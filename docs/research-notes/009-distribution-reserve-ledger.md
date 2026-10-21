# Distribution reserve rollforward and remaining scheduler gaps

Date: 2026-10-21. Baseline: `5168553`. This continues [note 008](008-core-credit-and-relayer-pressure.md).
It adds three real distribution receipts and an aggregate reward-reserve rollforward.
**This is provider-reported event/API consistency, not authenticated historical
pre/post state, per-user entitlement reconstruction or M1 settlement replay.**

## Prospective selection and evidence scope

The [round plan](../../research/cases/002-004-ledger-followup-plan.json) was saved
before new research reads. The official public activity response named a distribution
at block 49122884; the separately captured protocol summary reported source block
49122983. Before any new event scan, [CASE-006](../../research/cases/006-event-ledger-plan.json)
fixed **49122484–49122983**, exactly 500 inclusive blocks ending at that already
captured summary height. This is a source-led sample, not an unbiased sample or
an expansion of CASE-001 or CASE-002–005. Their original windows and records remain
unchanged. No new account endpoint or Core ledger query was used.

The bounded collector returned 160 PaperStaking logs: **80 nonce-use, 24 Staked,
53 Claimed and three Distributed**. No `Unstaked(address,uint256)` topic was returned.
The acquired runtime contains that event topic, so this is absence in one bounded
returned log set, not a claim that unstaking is unavailable or never happens.
Headers pin the first and last block; a second read of the final header agrees.
Logs, three complete distribution receipts, transactions and distribution-block
headers agree on hashes and coordinates. This is one provider's consistency check,
not independent finality or completeness verification.

The [outcome record](../../research/cases/006-event-ledger-outcome.json) retains
coordinates, boundary hashes, source/RPC capture digests, arithmetic and null gates.
Raw responses, signatures, nonce values and account addresses stay private.

## Four distribution words and the old unidentified events

Keccak preimages match `Distributed(uint256,uint256,uint256,uint256)` and
`NonceUsed(address,uint256,uint256)` in the acquired PaperStaking implementation
`0xe6e3519455170913c5c3bfe541dd918a2d0cbb15`, runtime Keccak-256
`0x54573c497e5109e353cf5330343323915e0c0f26e1b410fd3cb2cd8d1460f154`.
These are recovered signatures and code support; no compiler ABI or historical
transaction-point implementation is authenticated.

Following routine `0x1392`, the distribution data words are:

| Word, zero-based | Interpretation supported by acquired code |
|---|---|
| 0 | Reward reserve after recognizing newly received funds |
| 1 | Newly received funds, above the previously tracked reserve |
| 2 | Amount allocated now, including prior unallocated rewards when total stake is positive |
| 3 | Accumulator after allocation |

Slots 5/6/7/8 hold total stake, accumulator, reserve and unallocated rewards in
this returned implementation. The nonzero-stake branch adds
`floor(allocated × 10^27 / totalStake)` to the accumulator. The zero-stake branch
keeps new funds unallocated and leaves the accumulator unchanged. Allocation changes
the accumulator; it does not itself consume the reserve. Claims consume reserve.

Forty synthetic internal-routine checks exercise five stake values (including
zero), two reserve values, two unallocated values and two incoming amounts. They
check all four event words and resulting reserve/accumulator/unallocated slots.
Exchange fee-push and balance reads are mocked, and execution starts at the internal
routine; this bounded scratch interpreter is neither a full EVM nor proof of the
signed entrypoint, external calls or any historical execution.

This also clarifies the **40 previously unassigned events** in note 006's original
staking window: their topic matches `NonceUsed`, supported by the acquired bitmap
update and `LOG3` path at `0x113d–0x117b`. They are not forty additional token or
reward movements. The old record preserves what was known at its publication;
this note supplies the later interpretation without rewriting its evidence.

## Three actual funding/distribution pairs

All amounts below use internal 18-decimal raw units; accumulator values use the
separate `10^27` precision. Each receipt succeeds and has an Exchange fee-push event
immediately before its staking distribution event.

| Block / transaction index | Exchange push / fee component / new allocation, all equal | Reserve after | Accumulator after |
|---|---:|---:|---:|
| 49122700 / 3 | 123971689287136230497 | 3238952679607177812396323 | 13855826468886670577395252 |
| 49122731 / 15 | 126380295333522113467 | 3239066930246453677950928 | 13855840799820058494919395 |
| 49122884 / 6 | 118120319303372570075 | 3237916665256396143183897 | 13855854193964804868419647 |

The transactions are [first distribution](https://hyperevmscan.io/tx/0x7756293da981d71578312deaa0d7336e5c56b856f2a309b25690842f86754b9b),
[second distribution](https://hyperevmscan.io/tx/0x200c6d810025812d20b91f923cc93478f9c740a6f7b67c67e9525bd6070148db),
and [third distribution](https://hyperevmscan.io/tx/0xb7b44be334d0a46cf8b6738968c79a03e07b01b0d3cea7d42adb20a755001cde).
The RPC receipts, rather than an explorer rendering, are the acquired evidence.
For each, the push total equals its fee component, newly received staking funds
and allocated amount. **None demonstrates an additional LP-surplus component.**
The later API reports zero LP excess and zero payout debt at its own source height;
that does not rule out an earlier surplus or active-queue event elsewhere.

## Reserve rollforward: exact across two events and the later summary

Use the first distribution's reported reserve as an anchor. Apply every later
returned `Claimed` amount in block/transaction/log order, and add the next
distribution's newly received amount before comparing its reserve word:

| Interval | Claims | Claim total, raw | New funding, raw | Resulting reserve, raw |
|---|---:|---:|---:|---:|
| First → second distribution | 4 | 12129656057656558862 | 126380295333522113467 | 3239066930246453677950928 |
| Second → third distribution | 19 | 1268385309360907337106 | 118120319303372570075 | 3237916665256396143183897 |
| Third distribution → summary source block 49122983 | 10 | 17641579492593090844 | 0 | 3237899023676903550093053 |

Both intermediate results exactly equal the next distribution's reserve word.
All **33 claims after the first anchor** total `1298156544911156986812`.
The final result exactly equals the already captured official summary's
`paper.reserve`, or **3237899.023676903550093053** internal units. The other 20
claims precede the anchor and are not included in that rollforward. No initial
historical reserve was fetched or guessed. This is an aggregate event ledger;
it does not independently authenticate each claim's reward entitlement, internal
credit receipt or eventual external withdrawal.

The API's `source.block` is 49122983 but it supplies no block hash. We retain that
limitation: the matching height is not independent proof that its indexed state
corresponds to our pinned canonical block. Provider/indexer agreement can also
share upstream dependencies. Reserve includes obligations from earlier rounds;
it is not solely these three new distributions or a complete allocation to users.

## Accumulator arithmetic, with its dependence made explicit

The later API reports total stake `8818807371670990025158480300`. Subtracting the
subsequent returned stake deltas backwards yields the following denominators:

| Distribution block | Stake backsolved from API and events | Event accumulator increase = floor(allocation × 10^27 / stake) |
|---|---:|---:|
| 49122731 | 8818706494028778458389995192 | 14330933387917524143 |
| 49122884 | 8818802658927062565030920530 | 13394144746373500252 |

Both integer comparisons match. The last event accumulator also equals the later
API accumulator. These are **consistency equations using an API-derived denominator**,
not independently authenticated historical total stake. We do not invent a prior
accumulator for the first event, nor use these aggregate checks to assign a user's
rewardDebt, accrued rewards or payment provenance.

## Scheduler and other unresolved branches

The current official sitemap, [FAQ](https://docs.papertrade.xyz/intro/faq/) and
[session-key description](https://docs.papertrade.xyz/learn/session-keys/) describe
signed intents submitted through the relayer/batcher. They do not supply a versioned
selection, priority, retry/backoff or expiry-worker implementation. Eight bounded
search queries recovered no attributable server-policy source. Third-party client
code and commentary were not used to fill that gap. This is not an exhaustive
source survey or proof that such a policy does not exist.

No new pressure/trading stream was sampled: the retained note 008 aggregates
already establish backlog and cannot establish per-intent FIFO or ETA through
repetition. Real unstake, LP-surplus funding, active payout-queue/debt cases,
per-user distribution inputs and authenticated historical pre/post state remain
missing. CASE-001 still lacks historical state/trace/recorded precompile inputs;
its fixed window and candidate order are unchanged, selected transaction remains
null and M1 remains unimplemented. The previously reconciled Core payment was
not queried again.

## Acquisition and verification

This independent round used **25/60 RPC attempts**: 24 successful, one chain-ID
network failure followed by one ordinary successful retry of the same plan.
A local plan-shape validation failure happened before transport, with zero requests;
the invalid private plan is retained. Eight explicit HTTP source accesses succeeded
(**8/30**); all eight search queries were used (**8/8**). Unused budget is not an
instruction to repeat successful reads. No account channel, signing, production
write, credentials, paid service, cloud deployment or outreach was used.

Offline checks recompute receipt/header/transaction identities, all source and run
capture digests, event counts, reserve segments, API-dependent accumulator arithmetic
and the forty synthetic field checks. The research JSON is not a new validated
historical chain packet. Final local checks and independent review are recorded in
[STATUS](../../STATUS.md).
