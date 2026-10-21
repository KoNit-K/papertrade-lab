import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { Ajv } from 'ajv';
import { keccak_256 } from '@noble/hashes/sha3.js';

export const IMPLEMENTATION_SLOT='0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
export interface ChainVersion {
  version_id:string; chain_id:string; block_number:string; block_hash:string; proxy:string;
  proxy_type:'unknown'|'eip1967'; proxy_type_evidence_id:string|null;
  implementation_address:string|null; implementation_code_hash:string|null;
  parameter_snapshot_sha256:string|null; execution_context:'block_end';
  effective_from:string|null; effective_to:string|null; supersedes:string|null;
  needs_revalidation:boolean; binding_status:'incomplete'|'complete';
}
export interface ChainEvidence {
  evidence_id:string;version_id:string;provider:'hyperliquid-public-rpc';kind:'block'|'receipt'|'storage'|'code'|'parameters';
  chain_id:string;block_number:string;block_hash:string;proxy:string;
  transaction_hash:string|null;transaction_index:string|null;log_index:string|null;
  source_response_sha256:string|null;content_sha256:string;dependency_ids:string[];
  payload:Record<string,any>;
}
export interface ChainPacket {
  schema_version:'chain-evidence-v1'; fixture_kind:'synthetic'|'public_chain';
  versions:ChainVersion[];evidence:ChainEvidence[];
  claims:{claim_id:string;version_id:string;evidence_ids:string[];support_status:'unverified';reproduction_status:'not_attempted'|'blocked';missing_inputs:string[]}[];
}
export function canonical(value: unknown): string {
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value!==null && typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([key,item])=>JSON.stringify(key)+':'+canonical(item)).join(',')+'}';
  return JSON.stringify(value);
}
export const sha256=(value: string | Uint8Array)=>createHash('sha256').update(value).digest('hex');
export const codeHash=(bytecode:string)=>'0x'+Buffer.from(keccak_256(Buffer.from(bytecode.slice(2),'hex'))).toString('hex');
function check(value:unknown,message:string):asserts value {if(!value)throw new Error('Chain validation failed: '+message);}
const schema=JSON.parse(readFileSync(new URL('./chain.schema.json',import.meta.url),'utf8'));
const shape=new Ajv({strict:true}).compile<ChainPacket>(schema);
function index<T>(rows:T[],key:(r:T)=>string){
  const map=new Map<string,T>();for(const row of rows){check(!map.has(key(row)),'duplicate ID');map.set(key(row),row);}return map;
}
export function compareVersions(a:ChainVersion,b:ChainVersion){
  const fields=['chain_id','proxy','implementation_address','implementation_code_hash','parameter_snapshot_sha256','block_hash','block_number'] as const;
  const changed_fields=fields.filter(key=>a[key]!==b[key]);
  const identity_complete=a.binding_status==='complete' && b.binding_status==='complete';
  return {changed_fields,identity_complete,requires_revalidation:!identity_complete || changed_fields.length>0 || a.needs_revalidation || b.needs_revalidation};
}
export function validateChainPacket(input:unknown){
  check(shape(input),'schema rejected input');
  const packet=input;
  const versions=index(packet.versions,v=>v.version_id),evidence=index(packet.evidence,e=>e.evidence_id);
  index(packet.claims,c=>c.claim_id);
  const visit=(id:string,active=new Set<string>(),done=new Set<string>())=>{
    check(!active.has(id),'cyclic evidence dependencies');if(done.has(id))return;
    active.add(id);for(const dependency of evidence.get(id)!.dependency_ids){check(evidence.has(dependency),'missing dependency');visit(dependency,active,done);}
    active.delete(id);done.add(id);
  };
  const semantic=new Map<string,string>();
  for(const row of packet.evidence){
    const v=versions.get(row.version_id);check(v,'missing version');
    for(const key of ['chain_id','block_number','block_hash','proxy'] as const)check(row[key]===v[key],'historical identity mismatch');
    check(sha256(canonical(row.payload))===row.content_sha256,'payload SHA-256 mismatch');
    if(row.kind!=='parameters'){
      const key=[row.version_id,row.kind,row.kind==='storage'?row.payload.slot:row.kind==='code'?row.payload.address:row.kind==='receipt'?row.transaction_hash:'block'].join(':');
      const prior=semantic.get(key);check(prior===undefined || prior===row.content_sha256,'conflicting historical evidence');semantic.set(key,row.content_sha256);
    }
    if(row.kind==='parameters')check(row.source_response_sha256===null && row.dependency_ids.length>0,'derived parameters need dependencies');
    else check(row.source_response_sha256!==null,'provider capture digest missing');
    visit(row.evidence_id);
    for(const id of row.dependency_ids)check(evidence.get(id)!.version_id===row.version_id,'dependency version mismatch');
    if(row.kind==='block')check(row.payload.hash===v.block_hash && row.payload.number===v.block_number,'block payload mismatch');
    if(row.kind==='receipt'){
      check(row.transaction_hash===row.payload.transaction_hash && row.transaction_index===row.payload.transaction_index,'receipt execution order missing');
      const indices=row.payload.logs.map((log:any)=>log.log_index);
      check(new Set(indices).size===indices.length,'duplicate receipt log index');
      check(row.log_index===null || indices.includes(row.log_index),'unknown selected log index');
    } else check(row.transaction_hash===null && row.transaction_index===null && row.log_index===null,'block-end evidence cannot claim transaction prestate');
    if(row.kind==='parameters'){
      const seen=new Set<string>();
      for(const value of row.payload.values){
        check(!seen.has(value.slot),'duplicate parameter slot');seen.add(value.slot);
        check(row.dependency_ids.some(id=>{const e=evidence.get(id)!;return e.kind==='storage' && e.payload.slot===value.slot && e.payload.value===value.value;}),'parameter not backed by storage evidence');
      }
    }
  }
  for(const v of packet.versions){
    // A point-in-time read cannot establish a wider unchanged historical interval.
    check((v.effective_from===null && v.effective_to===null) || (v.effective_from===v.block_number && v.effective_to===v.block_number),'unproved effective interval');
    if(v.supersedes){const old=versions.get(v.supersedes);check(old && old.chain_id===v.chain_id && old.proxy===v.proxy && BigInt(old.block_number)<BigInt(v.block_number),'invalid predecessor');}
    const rows=packet.evidence.filter(e=>e.version_id===v.version_id);
    check(rows.some(e=>e.kind==='block'),'version lacks block evidence');
    if(v.proxy_type==='unknown')check(v.proxy_type_evidence_id===null,'unknown proxy type cannot claim type evidence');
    else {const typeEvidence=evidence.get(v.proxy_type_evidence_id??'');check(typeEvidence?.version_id===v.version_id && typeEvidence.kind==='code' && typeEvidence.payload.address===v.proxy,'proxy type needs reviewed proxy bytecode');}
    if(v.binding_status==='complete')check(v.proxy_type==='eip1967' && v.implementation_address && v.implementation_code_hash && v.parameter_snapshot_sha256,'incomplete deployment identity');
    if(v.implementation_address!==null){
      check(v.proxy_type==='eip1967' && v.implementation_address!=='0x'+'0'.repeat(40),'unidentified or zero implementation');
      const slot=rows.find(e=>e.kind==='storage' && e.payload.slot===IMPLEMENTATION_SLOT);
      check(slot && slot.payload.value==='0x'+'0'.repeat(24)+v.implementation_address.slice(2),'implementation slot mismatch');
    }
    if(v.implementation_code_hash!==null){
      check(v.implementation_address!==null,'code hash without implementation address');
      const code=rows.find(e=>e.kind==='code' && e.payload.address===v.implementation_address);
      check(code && codeHash(code.payload.bytecode)===v.implementation_code_hash,'implementation Keccak-256 mismatch');
    }
    if(v.parameter_snapshot_sha256!==null)check(rows.some(e=>e.kind==='parameters' && e.content_sha256===v.parameter_snapshot_sha256),'parameter snapshot missing');
  }
  for(const claim of packet.claims){
    const v=versions.get(claim.version_id);check(v,'claim version missing');
    for(const id of claim.evidence_ids)check(evidence.get(id)?.version_id===claim.version_id,'claim evidence version mismatch');
    if(v.binding_status==='incomplete' || v.needs_revalidation)check(claim.reproduction_status==='blocked','incomplete/stale version must block reproduction');
  }
  return {versions:packet.versions.length,evidence:packet.evidence.length,claims:packet.claims.length,
    incomplete_versions:packet.versions.filter(v=>v.binding_status==='incomplete').length,protocol_reproduced:false};
}
