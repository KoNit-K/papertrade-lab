import { Ajv } from 'ajv';
import { canonical, sha256, validateChainPacket } from '../evidence/chain.ts';
import type { ChainPacket } from '../evidence/chain.ts';
import { writeNew } from '../evidence/files.ts';
import { ENDPOINT } from '../collector/rpc.ts';
import { validateCollectionRun } from '../collector/run.ts';

const approvalShape=new Ajv({strict:true}).compile<{
 source_sha256:string;approved:true;scope:'chain_metadata'|'collection_metadata';redistribution:'permitted';identity_linkage:'none';file_name:string;
}>({type:'object',additionalProperties:false,required:['source_sha256','approved','scope','redistribution','identity_linkage','file_name'],properties:{
 source_sha256:{type:'string',pattern:'^[a-f0-9]{64}$'},approved:{const:true},scope:{enum:['chain_metadata','collection_metadata']},
 redistribution:{const:'permitted'},identity_linkage:{const:'none'},file_name:{type:'string',pattern:'^[A-Z0-9][A-Z0-9-]{0,79}\\.json$'}
}});
function rejectSensitive(value:unknown,depth=0){
 if(depth>30)throw new Error('Export rejected: nesting limit');
 if(typeof value==='string'){
  if(/(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_|-----BEGIN .*PRIVATE KEY|\/Users\/|\/home\/|bearer\s+|https?:\/\/[^/\s]+@)/i.test(value))throw new Error('Export rejected: sensitive value');
 } else if(Array.isArray(value)){for(const x of value)rejectSensitive(x,depth+1);}
 else if(value && typeof value==='object')for(const [k,v] of Object.entries(value)){
  if(/authorization|cookie|sessionkey|privatekey|seedphrase|mnemonic|signature|walletowner|rawhar|secret|password|accesstoken/.test(k.toLowerCase().replace(/[^a-z0-9]/g,'')))throw new Error('Export rejected: sensitive field');
  rejectSensitive(v,depth+1);
 }
}
/** Strict projection; this deliberately cannot export arbitrary raw captures or HAR. */
export function exportReviewed(source:string|Uint8Array,approval:unknown,root:string){
 const bytes=typeof source==='string'?Buffer.from(source,'utf8'):source;
 if(bytes.byteLength>8_000_000)throw new Error('Export rejected: input size');
 if(!approvalShape(approval) || sha256(bytes)!==approval.source_sha256)throw new Error('Export rejected: approval mismatch');
 let input:unknown;try{input=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new Error('Export rejected: invalid JSON');}
 rejectSensitive(input);
 let body:object;
 if(approval.scope==='chain_metadata'){
  try{validateChainPacket(input);}catch{throw new Error('Export rejected: invalid chain packet');}
  const packet=input as ChainPacket;
  body={fixture_kind:packet.fixture_kind,
   versions:packet.versions.map(v=>({version_id:v.version_id,chain_id:v.chain_id,block_number:v.block_number,block_hash:v.block_hash,binding_status:v.binding_status,needs_revalidation:v.needs_revalidation})),
   evidence:packet.evidence.map(e=>({evidence_id:e.evidence_id,version_id:e.version_id,kind:e.kind,content_sha256:e.content_sha256})),
   claims:packet.claims.map(c=>({claim_id:c.claim_id,version_id:c.version_id,support_status:c.support_status,reproduction_status:c.reproduction_status,missing_inputs:c.missing_inputs})),
  };
 }else{
  const run=validateCollectionRun(input);
  body={endpoint:ENDPOINT,status:run.status,stop_reason:run.stop_reason,started_at:run.started_at,finished_at:run.finished_at,
   requests:run.outcomes.map(o=>({method:o.request.method,status:o.status,http_status:o.http_status,
    request_sha256:sha256(canonical(o.request)),response_sha256:o.response_sha256,rpc_error_code:o.rpc_error_code??null,retry_after_seconds:o.retry_after_seconds??null})),
  };
 }
 const output={schema_version:'public-metadata-v1',scope:approval.scope,source_sha256:approval.source_sha256,
  protocol_reproduced:false,raw_data_included:false,...body};
 const outputBytes=JSON.stringify(output,null,2)+'\n';
 rejectSensitive(output);
 const path=writeNew(root,'evidence/public',approval.file_name,outputBytes);
 return {path,sha256:sha256(outputBytes),bytes:Buffer.byteLength(outputBytes)};
}
