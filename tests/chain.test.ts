import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateChainPacket, compareVersions } from '../packages/evidence/chain.ts';
import { packet } from './chain-fixture.ts';
test('accepts incomplete historical identity only as unverified and blocked',()=>{
  const result=validateChainPacket(packet());assert.equal(result.protocol_reproduced,false);assert.equal(result.incomplete_versions,1);
});
for (const [name,change] of [
 ['missing chain identity',(p:any)=>delete p.versions[0].chain_id],
 ['wrong block hash',(p:any)=>p.evidence[0].block_hash='0x'+'44'.repeat(32)],
 ['wrong block number',(p:any)=>p.evidence[0].block_number='17'],
 ['wrong proxy',(p:any)=>p.evidence[0].proxy='0x'+'55'.repeat(20)],
 ['forged payload hash',(p:any)=>p.evidence[0].payload.timestamp='101'],
 ['unsupported reproduction',(p:any)=>p.claims[0].reproduction_status='reproduced'],
 ['unsupported support upgrade',(p:any)=>p.claims[0].support_status='supported'],
 ['incomplete claimed complete',(p:any)=>p.versions[0].binding_status='complete'],
 ['unbounded range inference',(p:any)=>{p.versions[0].effective_from='1';p.versions[0].effective_to='16';}],
 ['dangling supersedes',(p:any)=>p.versions[0].supersedes='VER-NONE'],
 ['self supersedes',(p:any)=>p.versions[0].supersedes=p.versions[0].version_id],
 ['future predecessor',(p:any)=>{const v=structuredClone(p.versions[0]);v.version_id='VER-FUTURE';v.block_number='18';p.versions.push(v);p.versions[0].supersedes=v.version_id;}],
 ['cross-version claim',(p:any)=>{const v=structuredClone(p.versions[0]);v.version_id='VER-OTHER';p.versions.push(v);p.claims[0].version_id=v.version_id;}],
 ['unknown sensitive nested field',(p:any)=>p.evidence[0].payload.authorization='synthetic-secret'],
 ['duplicate evidence ID',(p:any)=>p.evidence.push({...p.evidence[0],source_response_sha256:'b'.repeat(64)})],
 ['unsafe large integer number',(p:any)=>p.versions[0].block_number=9007199254740992],
] as const) test('rejects '+name,()=>{const p=packet();change(p);assert.throws(()=>validateChainPacket(p));});
test('requires revalidation when parameters change without implementation change',()=>{
  const a=packet().versions[0],b={...a,version_id:'VER-CHAIN-002',block_number:'17',parameter_snapshot_sha256:'b'.repeat(64)};
  assert.equal(compareVersions(a,b).requires_revalidation,true);
  assert.ok(compareVersions(a,b).changed_fields.includes('parameter_snapshot_sha256'));
});
test('unknown identity never establishes unchanged deployment',()=>{
  const a=packet().versions[0];assert.equal(compareVersions(a,{...a}).identity_complete,false);
});

import { completePacket } from './chain-fixture.ts';
import { codeHash, canonical, sha256 } from '../packages/evidence/chain.ts';
test('checks a complete synthetic historical snapshot without claiming replay',()=>{
 assert.equal(validateChainPacket(completePacket()).incomplete_versions,0);
 assert.equal(codeHash('0x'),'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470');
});
for(const [name,change] of [
 ['implementation code hash',(p:any)=>p.versions[0].implementation_code_hash='0x'+'66'.repeat(32)],
 ['wrong historical implementation slot',(p:any)=>{p.evidence[3].payload.value='0x'+'77'.repeat(32);p.evidence[3].content_sha256=sha256(canonical(p.evidence[3].payload));}],
 ['unbacked parameter values',(p:any)=>p.evidence[5].dependency_ids=[]],
 ['bad proxy type evidence',(p:any)=>p.versions[0].proxy_type_evidence_id='EVD-IMPL-CODE'],
 ['stale attempted version',(p:any)=>p.versions[0].needs_revalidation=true],
 ['claimed identity without matching bytes even if incomplete',(p:any)=>{p.versions[0].binding_status='incomplete';p.claims[0].reproduction_status='blocked';p.versions[0].implementation_code_hash='0x'+'66'.repeat(32);}],
] as const)test('rejects '+name,()=>{const p=completePacket();change(p);assert.throws(()=>validateChainPacket(p));});
for(const kind of ['storage','code','block','receipt'])test('rejects conflicting '+kind+' evidence at the same historical identity',()=>{
 const p=completePacket();
 if(kind==='receipt'){
  const e={...p.evidence[0],kind:'receipt',evidence_id:'EVD-RECEIPT',transaction_hash:'0x'+'88'.repeat(32),transaction_index:'0',payload:{transaction_hash:'0x'+'88'.repeat(32),transaction_index:'0',status:'success',logs:[]}};
  e.content_sha256=sha256(canonical(e.payload));p.evidence.push(e);
 }
 const row=structuredClone(p.evidence.find((e:any)=>e.kind===kind));row.evidence_id='EVD-CONFLICT';
 if(kind==='storage')row.payload.value='0x'+'99'.repeat(32);
 if(kind==='code')row.payload.bytecode='0x6001';
 if(kind==='block')row.payload.timestamp='101';
 if(kind==='receipt')row.payload.status='failed';
 row.content_sha256=sha256(canonical(row.payload));p.evidence.push(row);
 assert.throws(()=>validateChainPacket(p),/conflicting historical/);
});
