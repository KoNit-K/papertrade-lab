import test from 'node:test';
import assert from 'node:assert/strict';
import { bustPrice, mintCurveSegment, pendingReward } from '../packages/research/mechanics.ts';
const W=10n**18n,A=10n**27n;
const defaults={threshold:2_000_000n*W,rate:100n*W,decay:120_000_000n*W};
test('research mint calculation matches returned pure-library synthetic vectors across the cliff and tail',()=>{
 const cases:[bigint,bigint,bigint,bigint,bigint][]=[
  [-10n*W,0n,5n*W,500n*W,0n],
  [0n,0n,10n*W,1000n*W,0n],
  [0n,100_000_000n*W,10n*W,1000n*W,0n],
  [1_999_995n*W,0n,10n*W,999999979166667534500n,5n*W],
  [2_000_000n*W,0n,10n*W,999999916666673611000n,10n*W],
  [2_000_000n*W,100_000_000n*W,10n*W,297520647633358991150n,10n*W]
 ];
 for(const [tracked,tailProgress,basis,minted,tailAdvance]of cases)
  assert.deepEqual(mintCurveSegment({tracked,tailProgress,basis,...defaults}),{minted,tailAdvance});
});
test('zero basis stays zero and tail rounding occurs at each ratio and rate stage',()=>{
 assert.deepEqual(mintCurveSegment({tracked:defaults.threshold,tailProgress:100_000_000n*W,basis:0n,...defaults}),{minted:0n,tailAdvance:0n});
 const r=mintCurveSegment({tracked:defaults.threshold,tailProgress:100_000_000n*W,basis:10n*W,...defaults});
 const single=defaults.rate*defaults.decay*defaults.decay*10n*W/((defaults.decay+100_000_000n*W)*(defaults.decay+100_000_000n*W+10n*W)*W);
 assert.notEqual(r.minted,single);
});
test('research bust getter matches observed bytecode on both sides and uses zero-equity price as buffer basis',()=>{
 const buffer=476041580087574n;
 const cases:[bigint,bigint,bigint,bigint][]=[
  [1000000n,2n,500238n,1499286n],[1000000n,100n,990471n,1009520n],
  [1000000n,1000n,999475n,1000524n],[827865n,2n,414130n,1241206n],
  [827865n,100n,819977n,835745n],[827865n,1000n,827431n,828298n]
 ];
 for(const [entry,leverage,long,short]of cases){
  assert.equal(bustPrice({entry,leverage,buffer,isLong:true}),long);
  assert.equal(bustPrice({entry,leverage,buffer,isLong:false}),short);
 }
});
test('pending reward matches synthetic returned getter, preserving already accrued rewards after exit',()=>{
 assert.equal(pendingReward({staked:3n*W,accumulator:2n*A,rewardDebt:W,accrued:5n*W}),10n*W);
 assert.equal(pendingReward({staked:0n,accumulator:A,rewardDebt:0n,accrued:5n*W}),5n*W);
 assert.equal(pendingReward({staked:3n,accumulator:2n*A,rewardDebt:1n,accrued:5n}),10n);
 assert.equal(pendingReward({staked:1n,accumulator:A-1n,rewardDebt:0n,accrued:0n}),0n);
});
test('research helpers reject missing, negative, out-of-domain and overflowing inputs',()=>{
 assert.throws(()=>mintCurveSegment({tracked:0n,tailProgress:-1n,basis:W,...defaults}));
 assert.throws(()=>mintCurveSegment({tracked:0n,tailProgress:0n,basis:W,...defaults,decay:0n}));
 assert.throws(()=>mintCurveSegment({tracked:(1n<<255n)-1n,tailProgress:0n,basis:1n,...defaults}));
 assert.throws(()=>mintCurveSegment({tracked:0n,tailProgress:0n,basis:W,...defaults,rate:1n<<256n}));
 assert.throws(()=>bustPrice({entry:1n,leverage:0n,buffer:0n,isLong:true}));
 assert.throws(()=>bustPrice({entry:1n<<64n,leverage:2n,buffer:0n,isLong:true}));
 assert.throws(()=>pendingReward({staked:0n,accumulator:0n,rewardDebt:1n,accrued:0n}));
 assert.throws(()=>pendingReward({staked:1n<<255n,accumulator:2n,rewardDebt:0n,accrued:0n}));
});
