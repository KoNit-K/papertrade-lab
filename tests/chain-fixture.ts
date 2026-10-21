import { createHash } from 'node:crypto';
const hash='0x'+'22'.repeat(32),proxy='0x'+'11'.repeat(20);
const sha=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
// Explicitly synthetic, not a mainnet fixture. Payload keys below are canonical.
export function packet(): any {
  const payload={hash,number:'16',parent_hash:'0x'+'33'.repeat(32),timestamp:'100'};
  return {schema_version:'chain-evidence-v1',fixture_kind:'synthetic',versions:[{
    version_id:'VER-CHAIN-001',chain_id:'999',block_number:'16',block_hash:hash,proxy,
    proxy_type:'unknown',proxy_type_evidence_id:null,implementation_address:null,implementation_code_hash:null,
    parameter_snapshot_sha256:null,execution_context:'block_end',effective_from:null,effective_to:null,
    supersedes:null,needs_revalidation:false,binding_status:'incomplete',
  }],evidence:[{evidence_id:'EVD-BLOCK-001',version_id:'VER-CHAIN-001',provider:'hyperliquid-public-rpc',
    kind:'block',chain_id:'999',block_number:'16',block_hash:hash,proxy,
    transaction_hash:null,transaction_index:null,log_index:null,
    source_response_sha256:'a'.repeat(64),content_sha256:sha(payload),dependency_ids:[],payload}],
    claims:[{claim_id:'CLM-CHAIN-001',version_id:'VER-CHAIN-001',evidence_ids:['EVD-BLOCK-001'],
      support_status:'unverified',reproduction_status:'blocked',missing_inputs:['implementation','parameters','prestate']}],
  };
}
export function completePacket(): any {
 const p=packet(),v=p.versions[0],base=p.evidence[0];
 const implementation='0x'+'44'.repeat(20);
 const add=(id:string,kind:string,payload:unknown,deps:string[]=[])=>{
  const e={...base,evidence_id:id,kind,payload,content_sha256:sha(payload),dependency_ids:deps,source_response_sha256:kind==='parameters'?null:base.source_response_sha256};p.evidence.push(e);return e;
 };
 add('EVD-PROXY-CODE','code',{address:proxy,bytecode:'0x6000'});
 add('EVD-IMPL-CODE','code',{address:implementation,bytecode:'0x6000'});
 add('EVD-IMPL-SLOT','storage',{slot:'0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',value:'0x'+'0'.repeat(24)+implementation.slice(2)});
 const item={slot:'0x'+'55'.repeat(32),value:'0x'+'0'.repeat(63)+'1'};
 add('EVD-PARAM-STORAGE','storage',item);
 const params=add('EVD-PARAMETERS','parameters',{values:[item]},['EVD-PARAM-STORAGE']);
 Object.assign(v,{proxy_type:'eip1967',proxy_type_evidence_id:'EVD-PROXY-CODE',implementation_address:implementation,
 implementation_code_hash:'0x07ad118d6cc8642c86c03827f276d8b791a65e5c99a3845faf186be720a1455d',parameter_snapshot_sha256:params.content_sha256,binding_status:'complete'});
 p.claims[0].reproduction_status='not_attempted';return p;
}
