import { Ajv } from 'ajv';
import { ENDPOINT, ReadonlyCollector, validateRequest, quantity, addressPattern, hashPattern } from './rpc.ts';
import type { Policy, Outcome, RpcRequest } from './rpc.ts';

export interface Plan {schema_version:'readonly-plan-v1';policy:Policy;steps:({kind:'rpc';request:RpcRequest}|{kind:'logs';address:string;topics:string[];from:string;to:string})[]}
export interface CollectionRun {schema_version:'collection-run-v1';endpoint:typeof ENDPOINT;policy:Policy;started_at:string;finished_at:string;status:'completed'|'partial'|'blocked';stop_reason:'none'|'chain_identity'|'rpc_failure'|'invalid_logs';outcomes:Outcome[]}
const ajv=new Ajv({strict:true});
const object=(properties:Record<string,unknown>)=>({type:'object',additionalProperties:false,properties,required:Object.keys(properties)});
const str={type:'string'},integer={type:'integer'};
const policySchema=object({max_requests:{type:'integer',minimum:1,maximum:60},min_interval_ms:{type:'integer',minimum:1000,maximum:60000},timeout_ms:{type:'integer',minimum:1,maximum:30000}});
const requestSchema=object({method:str,params:{type:'array',maxItems:3}});
const planShape=ajv.compile<Plan>(object({schema_version:{const:'readonly-plan-v1'},policy:policySchema,steps:{type:'array',minItems:1,maxItems:59,items:{oneOf:[object({kind:{const:'rpc'},request:requestSchema}),object({kind:{const:'logs'},address:str,topics:{type:'array',maxItems:4,items:str},from:str,to:str})]}}}));
const nullable=(schema:object)=>({anyOf:[schema,{type:'null'}]});
const time={type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$'};
const outcomeProps={status:{enum:['ok','missing','rpc_error','network_error','timeout','rate_limited','access_denied','http_error','invalid_response','response_too_large']},request:requestSchema,started_at:time,finished_at:time,response_sha256:nullable({type:'string',pattern:'^[a-f0-9]{64}$'}),http_status:nullable({type:'integer',minimum:100,maximum:599}),result:{},rpc_error_code:integer,retry_after_seconds:{type:'integer',minimum:0,maximum:Number.MAX_SAFE_INTEGER}};
const outcomeSchema={...object(outcomeProps),required:['status','request','started_at','finished_at','response_sha256','http_status']};
const runShape=ajv.compile<CollectionRun>(object({schema_version:{const:'collection-run-v1'},endpoint:{const:ENDPOINT},policy:policySchema,started_at:time,finished_at:time,status:{enum:['completed','partial','blocked']},stop_reason:{enum:['none','chain_identity','rpc_failure','invalid_logs']},outcomes:{type:'array',minItems:1,maxItems:60,items:outcomeSchema}}));
function ensure(value:unknown):asserts value {if(!value)throw new Error('Collection record or plan rejected');}
export function validatePlan(input:unknown):Plan {
 ensure(planShape(input));
 let count=1;
 for(const step of input.steps){
  if(step.kind==='rpc'){validateRequest(step.request);count++;}
  else {
   ensure(quantity.test(step.from) && quantity.test(step.to) && step.from.length<=18 && step.to.length<=18 && addressPattern.test(step.address) && step.topics.every(t=>hashPattern.test(t)));
   const span=BigInt(step.to)-BigInt(step.from)+1n;ensure(span>0n && span<=500n);count+=Number((span+49n)/50n);
  }
 }
 ensure(count<=input.policy.max_requests);
 return structuredClone(input);
}
export function validateCollectionRun(input:unknown):CollectionRun {
 ensure(runShape(input));ensure(input.outcomes.length<=input.policy.max_requests);
 const checkTime=(a:string,b:string)=>ensure(Number.isFinite(Date.parse(a)) && new Date(a).toISOString()===a && Number.isFinite(Date.parse(b)) && new Date(b).toISOString()===b && a<=b);
 checkTime(input.started_at,input.finished_at);
 for(const out of input.outcomes){
  validateRequest(out.request);checkTime(out.started_at,out.finished_at);
  ensure(out.started_at>=input.started_at && out.finished_at<=input.finished_at);
  ensure(out.status==='ok'?Object.hasOwn(out,'result') && out.result!==null:!Object.hasOwn(out,'result'));
 }
 const first=input.outcomes[0];ensure(first.request.method==='eth_chainId');
 ensure(input.status==='completed'?input.stop_reason==='none':input.stop_reason!=='none');
 if(input.status==='completed')ensure(first.status==='ok' && first.result==='0x3e7' && input.outcomes.every(o=>o.status==='ok'));
 return input;
}
export async function runPlan(input:unknown,transport:typeof fetch=fetch):Promise<CollectionRun>{
 const plan=validatePlan(input),client=new ReadonlyCollector(plan.policy,transport);
 const run:CollectionRun={schema_version:'collection-run-v1',endpoint:ENDPOINT,policy:plan.policy,started_at:new Date().toISOString(),finished_at:'',status:'completed',stop_reason:'none',outcomes:[]};
 const chain=await client.read({method:'eth_chainId',params:[]});run.outcomes.push(chain);
 if(chain.status!=='ok' || chain.result!=='0x3e7'){run.status='blocked';run.stop_reason='chain_identity';run.finished_at=new Date().toISOString();return run;}
 for(const step of plan.steps){
  if(step.kind==='rpc')run.outcomes.push(await client.read(step.request));
  else {const scan=await client.logs(step.address,step.topics,step.from,step.to);run.outcomes.push(...scan.pages);if(scan.status!=='ok'){run.status='partial';run.stop_reason=scan.status==='invalid_response'?'invalid_logs':'rpc_failure';break;}}
  const last=run.outcomes.at(-1)!;
  if(last.status!=='ok'){run.status='partial';run.stop_reason='rpc_failure';}
  if(['rate_limited','access_denied','timeout','network_error'].includes(last.status))break;
 }
 run.finished_at=new Date().toISOString();return run;
}
