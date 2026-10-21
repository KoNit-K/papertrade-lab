import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync,writeFileSync,readFileSync,rmSync,existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join,resolve } from 'node:path';
import { test } from 'node:test';
import { packet } from './chain-fixture.ts';
const root=resolve(import.meta.dirname,'..');
function dir(t:{after:(cb:()=>void)=>void}){const p=mkdtempSync(join(tmpdir(),'ptlab-cli-'));t.after(()=>rmSync(p,{recursive:true,force:true}));return p;}
test('chain validation CLI reads real JSON and reports failures without exposing input',t=>{
 const temp=dir(t),path=join(temp,'input.json');writeFileSync(path,JSON.stringify(packet()));
 const cli=join(root,'packages/evidence/chain-cli.ts');
 const ok=spawnSync(process.execPath,[cli,path],{encoding:'utf8'});assert.equal(ok.status,0,ok.stderr);assert.equal(JSON.parse(ok.stdout).protocol_reproduced,false);
 writeFileSync(path,'synthetic-private-input');
 const no=spawnSync(process.execPath,[cli,path],{encoding:'utf8'});assert.equal(no.status,1);assert.ok(!no.stderr.includes('synthetic-private-input'));
});
test('safe export CLI writes approved metadata once and refuses changed input',t=>{
 const temp=dir(t),path=join(temp,'input.json'),aPath=join(temp,'approval.json'),raw=JSON.stringify(packet());writeFileSync(path,raw);
 writeFileSync(aPath,JSON.stringify({source_sha256:createHash('sha256').update(raw).digest('hex'),approved:true,scope:'chain_metadata',redistribution:'permitted',identity_linkage:'none',file_name:'TEST-001.json'}));
 const cli=join(root,'packages/export/cli.ts');
 const run=()=>spawnSync(process.execPath,[cli,path,aPath],{cwd:temp,encoding:'utf8'});
 assert.equal(run().status,0);const target=join(temp,'evidence/public/TEST-001.json'),before=readFileSync(target,'utf8');
 writeFileSync(path,raw+'\n');assert.equal(run().status,1);assert.equal(readFileSync(target,'utf8'),before);
});
test('collector CLI rejects a whole invalid plan without writing raw output',t=>{
 const temp=dir(t),path=join(temp,'plan.json');
 writeFileSync(path,JSON.stringify({schema_version:'readonly-plan-v1',policy:{max_requests:2,min_interval_ms:1000,timeout_ms:50},steps:[{kind:'rpc',request:{method:'eth_sendRawTransaction',params:['synthetic-private-request']}}]}));
 const out=spawnSync(process.execPath,[join(root,'packages/collector/cli.ts'),path,'TEST'],{cwd:temp,encoding:'utf8'});
 assert.equal(out.status,1);assert.ok(!out.stderr.includes('synthetic-private-request'));assert.equal(existsSync(join(temp,'data/private/TEST.json')),false);
});
test('export CLI rejects non-UTF8 bytes instead of approving a decoded replacement',t=>{
 const temp=dir(t),path=join(temp,'input.json'),aPath=join(temp,'approval.json');
 const timestamp='2026-10-21T00:00:00.000Z';
 const input={schema_version:'collection-run-v1',endpoint:'https://rpc.hyperliquid.xyz/evm',policy:{max_requests:2,min_interval_ms:1000,timeout_ms:1000},started_at:timestamp,finished_at:timestamp,status:'completed',stop_reason:'none',outcomes:[{status:'ok',request:{method:'eth_chainId',params:[]},started_at:timestamp,finished_at:timestamp,response_sha256:'a'.repeat(64),http_status:200,result:'0x3e7'},{status:'ok',request:{method:'eth_getBlockByNumber',params:['0x10',false]},started_at:timestamp,finished_at:timestamp,response_sha256:'b'.repeat(64),http_status:200,result:'PLACEHOLDER'}]};
 const data=Buffer.from(JSON.stringify(input)),index=data.indexOf('PLACEHOLDER');data[index]=0xff;writeFileSync(path,data);
 for(const bytes of [Buffer.from(data.toString('utf8')),data]){
  writeFileSync(aPath,JSON.stringify({source_sha256:createHash('sha256').update(bytes).digest('hex'),approved:true,scope:'collection_metadata',redistribution:'permitted',identity_linkage:'none',file_name:'ENCODING.json'}));
  const out=spawnSync(process.execPath,[join(root,'packages/export/cli.ts'),path,aPath],{cwd:temp,encoding:'utf8'});
  assert.equal(out.status,1);assert.equal(existsSync(join(temp,'evidence/public/ENCODING.json')),false);
 }
});
