import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runPlan } from '../packages/collector/run.ts';
const plan=()=>({schema_version:'readonly-plan-v1',policy:{max_requests:4,min_interval_ms:1000,timeout_ms:1000},steps:[{kind:'rpc',request:{method:'eth_getBlockByNumber',params:['0x10',false]}}]});
test('preflights the entire plan before any read',async()=>{
 let calls=0;const p:any=plan();p.steps.push({kind:'rpc',request:{method:'eth_sendRawTransaction',params:['0x']}});
 await assert.rejects(runPlan(p,async()=>{calls++;return new Response();}));assert.equal(calls,0);
});
test('stops on wrong chain before requested state reads',async()=>{
 let calls=0;
 const result=await runPlan(plan(),async(_u,init)=>{calls++;return new Response(JSON.stringify({jsonrpc:'2.0',id:JSON.parse(String(init?.body)).id,result:'0x1'}));});
 assert.equal(result.status,'blocked');assert.equal(calls,1);
});
test('records missing data instead of filling it with current values',async()=>{
 let calls=0;
 const result=await runPlan(plan(),async(_u,init)=>{calls++;return new Response(JSON.stringify({jsonrpc:'2.0',id:JSON.parse(String(init?.body)).id,result:calls===1?'0x3e7':null}));});
 assert.equal(result.status,'partial');assert.equal(result.outcomes.length,2);assert.equal(result.outcomes[1].status,'missing');
});
test('preserves malformed-log stop reason even when transport returned success',async()=>{
 const p:any=plan();p.steps=[{kind:'logs',address:'0x'+'11'.repeat(20),topics:[],from:'0x10',to:'0x11'}];
 let calls=0;
 const out=await runPlan(p,async(_u,init)=>{calls++;return new Response(JSON.stringify({jsonrpc:'2.0',id:JSON.parse(String(init?.body)).id,result:calls===1?'0x3e7':[{}]}));});
 assert.equal(out.status,'partial');assert.equal(out.stop_reason,'invalid_logs');
});
