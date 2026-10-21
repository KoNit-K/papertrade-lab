import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ReadonlyCollector, validateRequest } from '../packages/collector/rpc.ts';

const address = '0x' + '11'.repeat(20);
const hash = '0x' + '22'.repeat(32);
const request = { method: 'eth_getCode', params: [address, '0x10'] };
const settings = { max_requests: 4, min_interval_ms: 1000, timeout_ms: 1000 };
function transport(result: unknown, calls: unknown[] = []) {
  return async (_url: string | URL | Request, init?: RequestInit) => {
    calls.push(init);
    const body = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: body.id, result }));
  };
}
for (const method of ['eth_sendRawTransaction','eth_sendTransaction','eth_sign','personal_sign','eth_signTypedData_v4','personal_unlockAccount','eth_call','debug_traceTransaction','POST /intents']) {
  test('blocks non-allowlisted method ' + method + ' before transport', async () => {
    const calls: unknown[] = [];
    const client = new ReadonlyCollector(settings, transport('0x', calls));
    await assert.rejects(client.read({ method, params: [] }), /policy/);
    assert.equal(calls.length, 0);
  });
}
for (const params of [[address,'latest'],[address,'pending'],[address,'0x01'],[address,'0x1','extra'],['bad','0x1']]) {
  test('rejects unsafe or unpinned state query ' + JSON.stringify(params), () => {
    assert.throws(() => validateRequest({ method:'eth_getCode', params }), /policy/);
  });
}
test('allows read-only POST with exact fixed endpoint and no redirects or credentials', async () => {
  let received: RequestInit | undefined;
  const client = new ReadonlyCollector(settings, async (url, init) => {
    assert.equal(url, 'https://rpc.hyperliquid.xyz/evm'); received=init;
    return transport('0x6000')(url, init);
  });
  const result = await client.read(request);
  assert.equal(result.status,'ok'); assert.equal(result.result,'0x6000');
  assert.equal(received?.method,'POST'); assert.equal(received?.redirect,'error');
  assert.deepEqual(received?.headers, {'content-type':'application/json'});
});
test('rejects policy settings that disable limits', () => {
  for (const policy of [{...settings,max_requests:0},{...settings,max_requests:61},{...settings,min_interval_ms:0},{...settings,timeout_ms:0}]) {
    assert.throws(() => new ReadonlyCollector(policy, transport(null)), /policy/);
  }
});
test('counts failed requests against the budget', async () => {
  const client=new ReadonlyCollector({...settings,max_requests:1},async()=>{throw new Error('private upstream text');});
  assert.equal((await client.read(request)).status,'network_error');
  await assert.rejects(client.read(request), /budget/);
});
test('serializes concurrent requests with rate limiting', async () => {
  const starts: number[]=[];
  const client=new ReadonlyCollector(settings,async (u,i)=>{starts.push(Date.now());return transport('0x')(u,i);});
  await Promise.all([client.read(request),client.read(request)]);
  assert.ok(starts[1]-starts[0]>=950);
});
test('stops after 429 and retains Retry-After without retrying', async () => {
  let calls=0;
  const client=new ReadonlyCollector(settings,async()=>{calls++;return new Response('private text',{status:429,headers:{'Retry-After':'120'}});});
  const out=await client.read(request);
  assert.equal(out.status,'rate_limited'); assert.equal(out.retry_after_seconds,120);
  await assert.rejects(client.read(request), /stopped/); assert.equal(calls,1);
  assert.ok(!JSON.stringify(out).includes('private text'));
});
for (const [name,response,status] of [
  ['RPC capability error',{jsonrpc:'2.0',id:1,error:{code:-32601,message:'sensitive upstream text'}},'rpc_error'],
  ['missing object',{},'invalid_response'],
  ['wrong correlation',{jsonrpc:'2.0',id:900,result:'0x1'},'invalid_response'],
  ['null result',{jsonrpc:'2.0',id:1,result:null},'missing'],
] as const) {
  test('reports '+name+' without fabricating data',async()=>{
    const client=new ReadonlyCollector(settings,async()=>new Response(JSON.stringify(response)));
    const out=await client.read(request); assert.equal(out.status,status);
    assert.ok(!JSON.stringify(out).includes('sensitive upstream text'));
  });
}
test('rejects oversized responses',async()=>{
  const client=new ReadonlyCollector(settings,async()=>new Response('x'.repeat(2_000_001)));
  assert.equal((await client.read(request)).status,'response_too_large');
});
test('times out body reads, not just response headers',async()=>{
  const client=new ReadonlyCollector({...settings,timeout_ms:50},async()=>new Response(new ReadableStream({start(){}})));
  assert.equal((await client.read(request)).status,'timeout');
});
test('log pagination preserves ranges and deterministic order, removes identical duplicates',async()=>{
  const queries: any[]=[];
  const log=(block:string,index:string)=>({address,blockNumber:block,blockHash:hash,transactionHash:hash,transactionIndex:'0x0',logIndex:index,removed:false,topics:[hash],data:'0x'});
  const client=new ReadonlyCollector(settings,async(u,i)=>{
    const body=JSON.parse(String(i?.body));queries.push(body.params[0]);
    return transport(queries.length===1?[log('0x10','0x1'),log('0x10','0x0'),log('0x10','0x0')]:[])(u,i);
  });
  const out=await client.logs(address,[hash],'0x10','0x42');
  assert.equal(out.status,'ok'); assert.equal(out.logs.length,2);
  assert.equal(out.logs[0].logIndex,'0x0');
  assert.deepEqual(queries.map(x=>[x.fromBlock,x.toBlock]),[['0x10','0x41'],['0x42','0x42']]);
  assert.equal(out.completeness,'provider_reported_only');
});
test('log pagination fails closed on conflicting or outside-range results',async()=>{
  const invalid={address,blockNumber:'0x999',blockHash:hash,transactionHash:hash,transactionIndex:'0x0',logIndex:'0x0',removed:false,topics:[hash],data:'0x'};
  const client=new ReadonlyCollector(settings,transport([invalid]));
  assert.equal((await client.logs(address,[hash],'0x10','0x11')).status,'invalid_response');
});

import { createServer } from 'node:http';
test('real HTTP transport posts JSON and refuses redirects',async t=>{
 let calls=0,mode='success';
 const server=createServer(async(req,res)=>{
  calls++;assert.equal(req.method,'POST');assert.equal(req.headers.authorization,undefined);assert.equal(req.headers.cookie,undefined);
  let body='';for await(const c of req)body+=c;
  if(mode==='redirect'){res.writeHead(302,{location:'/other'});res.end();return;}
  const rpc=JSON.parse(body);res.setHeader('content-type','application/json');res.end(JSON.stringify({jsonrpc:'2.0',id:rpc.id,result:'0x6000'}));
 });
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>{server.closeAllConnections();server.close();});
 const port=(server.address() as {port:number}).port;
 // Only the test adapter redirects the fixed production URL to a local test server.
 const local:typeof fetch=(_url,init)=>fetch('http://127.0.0.1:'+port,init);
 const client=new ReadonlyCollector(settings,local);
 assert.equal((await client.read(request)).status,'ok');
 mode='redirect';assert.equal((await client.read(request)).status,'network_error');assert.equal(calls,2);
});
for(const variant of ['block hash','log index','transaction hash'])test('rejects inconsistent '+variant+' within log pages',async()=>{
 const a={address,blockNumber:'0x10',blockHash:hash,transactionHash:hash,transactionIndex:'0x0',logIndex:'0x0',removed:false,topics:[hash],data:'0x'};
 const b={...a,logIndex:'0x1'};
 if(variant==='block hash')b.blockHash='0x'+'33'.repeat(32);
 if(variant==='log index'){b.transactionIndex='0x1';b.logIndex='0x0';b.transactionHash='0x'+'33'.repeat(32);}
 if(variant==='transaction hash')b.transactionHash='0x'+'33'.repeat(32);
 const client=new ReadonlyCollector(settings,transport([a,b]));
 assert.equal((await client.logs(address,[hash],'0x10','0x11')).status,'invalid_response');
});

// Synthetic hashes and calldata; no real signature material.
test('collects a hash-addressed transaction through the plan and response pipeline', async () => {
 const { runPlan }=await import('../packages/collector/run.ts');
 const plan={schema_version:'readonly-plan-v1',policy:settings,steps:[{kind:'rpc',request:{method:'eth_getTransactionByHash',params:[hash]}}]};
 const out=await runPlan(plan,async(url,init)=>{
  assert.equal(url,'https://rpc.hyperliquid.xyz/evm');
  const req=JSON.parse(String(init?.body));
  assert.ok(['eth_chainId','eth_getTransactionByHash'].includes(req.method));
  if(req.method==='eth_getTransactionByHash')assert.deepEqual(req.params,[hash]);
  return transport(req.method==='eth_chainId'?'0x3e7':{hash,blockNumber:'0x10',blockHash:hash,transactionIndex:'0x0',input:'0x12345678'})(url,init);
 });
 assert.equal(out.status,'completed');
 assert.equal(out.outcomes[1].request.method,'eth_getTransactionByHash');
 assert.equal((out.outcomes[1].result as {input:string}).input,'0x12345678');
 assert.match(out.outcomes[1].response_sha256!,/^[0-9a-f]{64}$/);
});
for(const params of [[],['latest'],['0x1234'],[hash,'extra'],[{hash}]])test('rejects malformed transaction lookup '+JSON.stringify(params),async()=>{
 let calls=0;const client=new ReadonlyCollector(settings,async()=>{calls++;throw Error('unexpected transport');});
 await assert.rejects(client.read({method:'eth_getTransactionByHash',params}),/policy/);assert.equal(calls,0);
});
test('missing hash-addressed transaction remains missing',async()=>{
 const client=new ReadonlyCollector(settings,transport(null));
 const result=await client.read({method:'eth_getTransactionByHash',params:[hash]});
 assert.equal(result.status,'missing');assert.equal(Object.hasOwn(result,'result'),false);
});
