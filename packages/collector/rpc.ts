import { createHash } from 'node:crypto';

export const ENDPOINT = 'https://rpc.hyperliquid.xyz/evm';
export const quantity = /^0x(?:0|[1-9a-f][0-9a-f]*)$/;
export const addressPattern = /^0x[0-9a-fA-F]{40}$/;
export const hashPattern = /^0x[0-9a-fA-F]{64}$/;
export interface RpcRequest { method: string; params: unknown[] }
export interface Policy { max_requests: number; min_interval_ms: number; timeout_ms: number }
export type Outcome = {
  status: 'ok' | 'missing' | 'rpc_error' | 'network_error' | 'timeout' | 'rate_limited' | 'access_denied' | 'http_error' | 'invalid_response' | 'response_too_large';
  request: RpcRequest; started_at: string; finished_at: string;
  response_sha256: string | null; http_status: number | null;
  result?: unknown; rpc_error_code?: number; retry_after_seconds?: number;
};
export interface ChainLog {
  address: string; blockNumber: string; blockHash: string; transactionHash: string;
  transactionIndex: string; logIndex: string; removed: boolean; topics: string[]; data: string;
}
function policy(condition: unknown): asserts condition { if (!condition) throw new Error('Read-only policy rejected input'); }
function keys(value: object, expected: string[]) { return Object.keys(value).sort().join() === expected.sort().join(); }
const isQ = (v: unknown): v is string => typeof v === 'string' && quantity.test(v) && v.length <= 18;
const isA = (v: unknown): v is string => typeof v === 'string' && addressPattern.test(v);
const isH = (v: unknown): v is string => typeof v === 'string' && hashPattern.test(v);

export function validateRequest(input: unknown): asserts input is RpcRequest {
  policy(!!input && typeof input === 'object' && !Array.isArray(input) && keys(input,['method','params']));
  const {method,params}=input as RpcRequest;
  policy(typeof method==='string' && Array.isArray(params));
  switch(method) {
    case 'eth_chainId': case 'eth_blockNumber': policy(params.length===0); break;
    case 'eth_getBlockByNumber':
      policy(params.length===2 && (isQ(params[0]) || params[0]==='finalized') && params[1]===false); break;
    case 'eth_getCode': policy(params.length===2 && isA(params[0]) && isQ(params[1])); break;
    case 'eth_getStorageAt': policy(params.length===3 && isA(params[0]) && isH(params[1]) && isQ(params[2])); break;
    case 'eth_getTransactionReceipt': case 'eth_getTransactionByHash': policy(params.length===1 && isH(params[0])); break;
    case 'eth_getLogs': {
      policy(params.length===1 && !!params[0] && typeof params[0]==='object' && keys(params[0],['address','topics','fromBlock','toBlock']));
      const q=params[0] as {address:unknown;topics:unknown;fromBlock:unknown;toBlock:unknown};
      policy(isA(q.address) && Array.isArray(q.topics) && q.topics.length<=4 && q.topics.every(isH));
      policy(isQ(q.fromBlock) && isQ(q.toBlock) && BigInt(q.toBlock)>=BigInt(q.fromBlock) && BigInt(q.toBlock)-BigInt(q.fromBlock)<50n);
      break;
    }
    default: policy(false);
  }
}
export class ReadonlyCollector {
  private used=0;
  private lastStart=0;
  private stopped=false;
  private queue: Promise<unknown>=Promise.resolve();
  private readonly settings: Policy;
  private readonly transport: typeof fetch;
  constructor(settings: Policy, transport: typeof fetch=fetch) {
    policy(keys(settings,['max_requests','min_interval_ms','timeout_ms']));
    policy(Number.isInteger(settings.max_requests) && settings.max_requests>0 && settings.max_requests<=60);
    policy(Number.isInteger(settings.min_interval_ms) && settings.min_interval_ms>=1000 && settings.min_interval_ms<=60000);
    policy(Number.isInteger(settings.timeout_ms) && settings.timeout_ms>=1 && settings.timeout_ms<=30000);
    this.settings={...settings}; this.transport=transport;
  }
  read(input: unknown): Promise<Outcome> {
    // Clone at admission so callers cannot change a request while queued.
    try { validateRequest(input); } catch (error) { return Promise.reject(error); }
    const request=structuredClone(input);
    const pending=this.queue.then(()=>this.execute(request));
    this.queue=pending.catch(()=>undefined);
    return pending;
  }
  private async execute(request: RpcRequest): Promise<Outcome> {
    if(this.stopped) throw new Error('Collector stopped after access or rate-limit response');
    if(this.used>=this.settings.max_requests) throw new Error('Read-only request budget exhausted');
    const wait=Math.max(0,this.lastStart+this.settings.min_interval_ms-Date.now());
    if(wait) await new Promise(resolve=>setTimeout(resolve,wait));
    const id=++this.used; this.lastStart=Date.now();
    const out: Outcome={status:'network_error',request,started_at:new Date().toISOString(),finished_at:'',response_sha256:null,http_status:null};
    const controller=new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('timeout'));},this.settings.timeout_ms);});
    const work=async()=>{
      const response=await this.transport(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id,...request}),redirect:'error',signal:controller.signal});
      out.http_status=response.status;
      if(response.status===429 || response.status===401 || response.status===403) {
        this.stopped=true; out.status=response.status===429?'rate_limited':'access_denied';
        const retry=response.headers.get('retry-after');
        if(retry && /^\d+$/.test(retry) && Number.isSafeInteger(Number(retry))) out.retry_after_seconds=Number(retry);
        await response.body?.cancel(); return;
      }
      if(!response.ok) {out.status='http_error';await response.body?.cancel();return;}
      const reader=response.body?.getReader();
      if(!reader){out.status='invalid_response';return;}
      const chunks: Uint8Array[]=[]; let size=0;
      try {
        for(;;) {
          const chunk=await Promise.race([reader.read(),timeout]);
          if(chunk.done)break;
          size+=chunk.value.byteLength;
          if(size>2_000_000){out.status='response_too_large';void reader.cancel();return;}
          chunks.push(chunk.value);
        }
      } finally { if(controller.signal.aborted) void reader.cancel(); }
      const bytes=Buffer.concat(chunks);out.response_sha256=createHash('sha256').update(bytes).digest('hex');
      let parsed: any;
      try {parsed=JSON.parse(bytes.toString('utf8'));}catch{out.status='invalid_response';return;}
      if(!parsed || parsed.jsonrpc!=='2.0' || parsed.id!==id || ('result' in parsed)===('error' in parsed)){out.status='invalid_response';return;}
      if('error' in parsed){
        out.status='rpc_error';
        if(Number.isSafeInteger(parsed.error?.code))out.rpc_error_code=parsed.error.code;
      } else if(parsed.result===null){out.status='missing';}
      else{out.status='ok';out.result=parsed.result;}
    };
    try {await Promise.race([work(),timeout]);}catch{out.status=controller.signal.aborted?'timeout':'network_error';}
    finally {clearTimeout(timer);out.finished_at=new Date().toISOString();}
    return structuredClone(out);
  }
  async logs(address: string,topics: string[],from: string,to: string) {
    policy(isQ(from) && isQ(to) && BigInt(to)>=BigInt(from) && BigInt(to)-BigInt(from)<500n && isA(address) && topics.every(isH));
    const logs: ChainLog[]=[]; const pages: Outcome[]=[]; const seen=new Map<string,string>(); const blockHashes=new Map<string,string>(); const transactions=new Map<string,string>();
    for(let start=BigInt(from);start<=BigInt(to);start+=50n){
      const end=start+49n>BigInt(to)?BigInt(to):start+49n;
      const page=await this.read({method:'eth_getLogs',params:[{address,topics,fromBlock:'0x'+start.toString(16),toBlock:'0x'+end.toString(16)}]});
      pages.push(page);
      if(page.status!=='ok')return {status:page.status,logs:[],pages,completeness:'incomplete'};
      if(!Array.isArray(page.result))return {status:'invalid_response',logs:[],pages,completeness:'incomplete'};
      for(const entry of page.result){
        const log=entry as ChainLog;
        if(!log || !isQ(log.blockNumber) || BigInt(log.blockNumber)<start || BigInt(log.blockNumber)>end
          || !isQ(log.transactionIndex) || !isQ(log.logIndex) || !isH(log.blockHash) || !isH(log.transactionHash)
          || !isA(log.address) || log.address.toLowerCase()!==address.toLowerCase() || log.removed!==false
          || !Array.isArray(log.topics) || !log.topics.every(isH) || !topics.every((t,i)=>t.toLowerCase()===log.topics[i]?.toLowerCase())
          || typeof log.data!=='string' || !/^0x(?:[0-9a-fA-F]{2})*$/.test(log.data))
          return {status:'invalid_response',logs:[],pages,completeness:'incomplete'};
        const txKey=[log.blockNumber,log.transactionIndex].join(':');
        if((blockHashes.has(log.blockNumber) && blockHashes.get(log.blockNumber)!==log.blockHash.toLowerCase())
          || (transactions.has(txKey) && transactions.get(txKey)!==log.transactionHash.toLowerCase()))return {status:'invalid_response',logs:[],pages,completeness:'incomplete'};
        blockHashes.set(log.blockNumber,log.blockHash.toLowerCase());transactions.set(txKey,log.transactionHash.toLowerCase());
        const key=[log.blockNumber,log.logIndex].join(':');
        const canonical=JSON.stringify([log.blockHash,log.transactionHash,log.transactionIndex,log.address,log.topics,log.data]).toLowerCase();
        if(seen.has(key) && seen.get(key)!==canonical)return {status:'invalid_response',logs:[],pages,completeness:'incomplete'};
        if(!seen.has(key)){seen.set(key,canonical);logs.push(log);}
      }
    }
    logs.sort((a,b)=>{
      for(const key of ['blockNumber','transactionIndex','logIndex'] as const){const d=BigInt(a[key])-BigInt(b[key]);if(d!==0n)return d<0n?-1:1;}
      return 0;
    });
    return {status:'ok',logs,pages,completeness:'provider_reported_only'};
  }
}
