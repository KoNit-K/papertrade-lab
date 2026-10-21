/**
 * Bounded research arithmetic recovered from acquired runtime bytes.
 * See docs/research-notes/006-current-mechanisms.md for hashes and limits.
 * Inputs must be explicit. These helpers do not select live parameters, authenticate
 * historical inputs, validate signatures or reproduce a settlement/queue ledger.
 */
const W = 10n ** 18n;
const ACC_PRECISION = 10n ** 27n;
const U256 = (1n << 256n) - 1n;
const I256 = (1n << 255n) - 1n;
function uint(value: bigint, max = U256): bigint {
  if (typeof value !== 'bigint' || value < 0n || value > max) throw new RangeError('Outside research integer domain');
  return value;
}
function add(a: bigint, b: bigint): bigint { return uint(a + b); }
function mul(a: bigint, b: bigint): bigint { return uint(a * b); }

/** L is the LP start point supplied to the mint helper, not an inferred balance. */
export function mintCurveSegment(input: {
  tracked: bigint; tailProgress: bigint; basis: bigint; threshold: bigint; rate: bigint; decay: bigint;
}): { minted: bigint; tailAdvance: bigint } {
  const { tracked: lp, tailProgress: h, basis, threshold, rate, decay } = input;
  if (typeof lp !== 'bigint' || lp < -I256 - 1n || lp > I256) throw new RangeError('Outside signed research domain');
  uint(h); uint(basis, I256); uint(threshold, I256); uint(rate); uint(decay);
  if (decay === 0n || lp + basis > I256) throw new RangeError('Invalid curve input');
  if (basis === 0n) return { minted: 0n, tailAdvance: 0n };
  const below = lp < threshold ? threshold - lp : 0n;
  const flat = basis < below ? basis : below;
  const tail = basis - flat;
  const flatMint = mul(flat, rate) / W;
  if (tail === 0n) return { minted: flatMint, tailAdvance: 0n };
  const denominator = add(decay, h);
  const scaledDecay = mul(decay, W);
  const firstRatio = scaledDecay / denominator;
  const lastRatio = scaledDecay / add(denominator, tail);
  const segmentRate = mul(mul(rate, firstRatio) / W, lastRatio) / W;
  return { minted: add(flatMint, mul(tail, segmentRate) / W), tailAdvance: tail };
}

/** The buffer applies to the zero-equity reference, after entry/leverage division. */
export function bustPrice(input: { entry: bigint; leverage: bigint; buffer: bigint; isLong: boolean }): bigint {
  const { entry, leverage, buffer, isLong } = input;
  uint(entry, (1n << 64n) - 1n); uint(leverage, (1n << 32n) - 1n); uint(buffer, W);
  if (entry === 0n || leverage === 0n || typeof isLong !== 'boolean') throw new RangeError('Invalid position input');
  const distance = entry / leverage;
  const reference = isLong ? entry - distance : entry + distance;
  const offset = mul(reference, buffer) / W;
  // The supported domain excludes uint64 wrapping on extreme short inputs.
  return uint(isLong ? reference + offset : reference - offset, (1n << 64n) - 1n);
}

/** Previously stored rewards survive an unstake; this does not simulate distribution. */
export function pendingReward(input: { staked: bigint; accumulator: bigint; rewardDebt: bigint; accrued: bigint }): bigint {
  const { staked, accumulator, rewardDebt, accrued } = input;
  uint(staked); uint(accumulator); uint(rewardDebt); uint(accrued);
  const earned = mul(staked, accumulator) / ACC_PRECISION;
  if (earned < rewardDebt) throw new RangeError('Reward debt exceeds accumulated entitlement');
  return add(accrued, earned - rewardDebt);
}
