import assert from 'node:assert/strict';
import { mkdtempSync,readFileSync,mkdirSync,rmSync,symlinkSync,existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { packet } from './chain-fixture.ts';
import { exportReviewed } from '../packages/export/safe.ts';
const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
function approval(raw:string){return {source_sha256:digest(raw),approved:true,scope:'chain_metadata',redistribution:'permitted',identity_linkage:'none',file_name:'SYNTHETIC-001.json'};}
function dir(t:{after:(cb:()=>void)=>void}){const root=mkdtempSync(join(tmpdir(),'ptlab-export-'));t.after(()=>rmSync(root,{recursive:true,force:true}));return root;}
test('exports only reviewed metadata and a manifest, never raw payloads',t=>{
 const root=dir(t),raw=JSON.stringify(packet());
 const result=exportReviewed(raw,approval(raw),root);
 const out=JSON.parse(readFileSync(join(root,result.path),'utf8'));
 assert.equal(out.source_sha256,digest(raw));assert.equal(out.protocol_reproduced,false);
 assert.equal(out.evidence[0].payload,undefined);assert.equal(out.evidence[0].source_response_sha256,undefined);
 assert.equal(out.versions[0].proxy,undefined); // publication does not infer address disclosure permission
 assert.equal(out.fixture_kind,'synthetic');
 assert.throws(()=>exportReviewed(raw,approval(raw),root),/exists/);
});
for(const [name,change] of [
 ['no approval',(a:any)=>a.approved=false],['changed bytes',(a:any)=>a.source_sha256='b'.repeat(64)],
 ['unknown permission',(a:any)=>a.redistribution='unknown'],['identity joins',(a:any)=>a.identity_linkage='wallet-to-user'],
 ['wrong scope',(a:any)=>a.scope='all'],['path traversal',(a:any)=>a.file_name='../SECRET.json'],
] as const)test('rejects '+name+' before writing',t=>{
 const root=dir(t),raw=JSON.stringify(packet()),a=approval(raw);change(a);
 assert.throws(()=>exportReviewed(raw,a,root));assert.equal(existsSync(join(root,'evidence/public/SYNTHETIC-001.json')),false);
});
for(const key of ['Authorization','COOKIE','session-key','privateKey','seed_phrase','signature','walletOwner','rawHAR']){
 test('rejects nested '+key+' including in arrays',t=>{
   const root=dir(t),p=packet();p.evidence[0].payload.extra=[{[key]:'synthetic-sensitive-value'}];
   const raw=JSON.stringify(p);assert.throws(()=>exportReviewed(raw,approval(raw),root),/sensitive field/i);
   assert.equal(existsSync(join(root,'evidence/public/SYNTHETIC-001.json')),false);
 });
}
test('rejects escaping output directory symlink',t=>{
 const root=dir(t),outside=dir(t);mkdirSync(join(root,'evidence'));symlinkSync(outside,join(root,'evidence/public'));
 const raw=JSON.stringify(packet());assert.throws(()=>exportReviewed(raw,approval(raw),root),/directory/);
 assert.equal(existsSync(join(outside,'SYNTHETIC-001.json')),false);
});
test('refuses raw HAR rather than offering unsafe redaction',t=>{
 const raw=JSON.stringify({log:{entries:[{request:{headers:[{name:'Cookie',value:'synthetic'}]}}]}});
 assert.throws(()=>exportReviewed(raw,approval(raw),dir(t)),/export rejected/i);
});
for(const sensitive of [false,true])test('collection projection '+(sensitive?'rejects a nested secret':'omits arbitrary result data'),t=>{
 const timestamp='2026-10-21T00:00:00.000Z';
 const base={started_at:timestamp,finished_at:timestamp,response_sha256:'a'.repeat(64),http_status:200,status:'ok'};
 const run={schema_version:'collection-run-v1',endpoint:'https://rpc.hyperliquid.xyz/evm',policy:{max_requests:2,min_interval_ms:1000,timeout_ms:1000},started_at:timestamp,finished_at:timestamp,status:'completed',stop_reason:'none',outcomes:[{...base,request:{method:'eth_chainId',params:[]},result:'0x3e7'},{...base,request:{method:'eth_getBlockByNumber',params:['0x10',false]},result:{nested:[sensitive?{Authorization:'synthetic'}:{note:'synthetic-result-text'}]}}]};
 const raw=JSON.stringify(run),a={...approval(raw),scope:'collection_metadata'},root=dir(t);
 if(sensitive)assert.throws(()=>exportReviewed(raw,a,root),/sensitive field/);
 else {const out=exportReviewed(raw,a,root);assert.ok(!readFileSync(join(root,out.path),'utf8').includes('synthetic-result-text'));}
});
