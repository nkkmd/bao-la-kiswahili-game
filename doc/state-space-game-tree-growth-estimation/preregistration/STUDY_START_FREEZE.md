# SSGTGE-STUDY1 — Study-start prospective freeze

Date: 2026-08-30
Status: FROZEN BEFORE ANY G2-12 FRESH HOLDOUT OUTCOME GENERATION
Program: G2-12 / Research Generation 2
Study ID: `SSGTGE-STUDY1`
Formal title: **State-Space / Game-Tree Growth Estimation Study 1**
Japanese working title: **Baoにおける状態空間・ゲーム木成長の推定 — bounded exact enumerationからのprospective growth estimator構築とfresh deeper exact holdoutによる検証**
Baseline remote `main`: `c5efcdb7972d1bc775a2857c1b0641c35c9df622`
Research branch: `research/g2-12-state-space-game-tree-growth-estimation`

## Independence and immutable upstream boundaries

This is a new prospective independent Research Generation 2 Study. It does not reopen, rescue, revise, or reinterpret G2-01..G2-10, Pre-G2-11 `PSRRE-STUDY1`, G2-11, or any Research Generation 1 Study.

Immutable upstream anchors at study start include:

```text
DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
DRSSE complete exact layers = 0..9
DRSSE cumulative RAW states through depth 9 = 102857
DRSSE depth 9 new RAW states = 78009
DRSSE depth 9 tree node occurrences = 105704
validated transform set = []
canonicalization = not authorized
symmetry reduction = not authorized
G2-10 selectedRepresentation = null
PSRRE-STUDY1 = NON-ESTIMABLE
G2-11 = NOT-AUTHORIZED
```

G2-05 remains immutable bounded exact evidence. G2-12 does not add depth 10+ rows to the G2-05 formal domain and does not revise the G2-05 decision.

## Authoritative scientific identity

Scientific state identity is RAW-only and contains exactly:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Excluded identity fields:

```text
turn
reason
```

`pending` is mandatory. Every accepted state must preserve the 64-seed invariant. The validated transformation set available to this Study is exactly `[]`.

Therefore:

```text
canonicalization = false
symmetry reduction = false
seat-swap reduction = false
reflection reduction = false
```

## Scientific question

Can a prospectively fixed estimator, developed only from bounded exact RAW-state/game-tree layers available before holdout generation, predict a fresh deeper exact holdout with reproducible point error and development-calibrated uncertainty coverage?

This Study does not force a total Bao state-space or full-game game-tree point estimate. Full-game extrapolation is not authorized unless the frozen holdout validation succeeds, and even success authorizes only the explicitly frozen bounded extrapolation boundary recorded later in the formal result.

## Development / holdout firewall

Development evidence is restricted to immutable exact summaries available before this freeze, principally G2-05 `DRSSE-STUDY1` depth `0..9`.

Stage 1 may consume the following G2-05 summary series:

- `newRawStateCount[d]`
- `cumulativeRawStateCount[d]`
- `treeNodeOccurrences[d]`
- `cumulativeTreeNodeOccurrences[d]`
- parent-layer legal edge counts and legal branching summaries
- duplicate-arrival and multi-predecessor summaries
- tree/RAW occurrence ratios

G1 `SSGTC-STUDY1` depth `0..8` may be used only as an immutable consistency/reference check, not as independent formal validation.

Formal holdout evidence is reserved as follows:

```text
mandatory primary holdout = fresh exact depth 10 layer from the standard initial RAW root
secondary prospective stress-test = fresh exact depth 11 layer, only if it completes under the same frozen ceilings
```

The Stage 2 production runner must reconstruct the standard root and enumerate from depth 0 under frozen source semantics. It may not import G2-05 materialized state rows or edge rows as enumeration input. The known depth `0..9` summaries may be checked for integrity, but depth 10/11 scientific values must first be generated only after Stage 1 estimator freeze and Stage 2 authorization.

No refit, family change, threshold change, interval recalibration, or favorable-depth selection is permitted after any depth 10 holdout outcome exists.

## Frozen estimator candidate set

Exactly three estimator families are eligible in Stage 1. No additional family may be introduced within this Study after this freeze.

### `E1-TRAILING-LOG-LINEAR-W5`

For each primary series independently, fit ordinary least squares to `log(count)` versus depth using the trailing five complete development layers available at the fit origin.

### `E2-LOG-QUADRATIC-D2PLUS`

For each primary series independently, fit ordinary least squares to:

```text
log(count_d) = a + b*d + c*d^2
```

using all complete development layers with `d >= 2` available at the fit origin.

### `E3-LOCAL-LOG-INCREMENT-TREND-W4`

For each primary series independently, compute log-growth increments and fit a linear trend to the latest four complete increments. Extrapolate the next increment deterministically and recurse unchanged for horizon 2.

No candidate may use future exact branching, future transposition, future phase composition, depth 10/11 values, or any feature unavailable at prediction time.

## Stage 1 winner-selection rule

Primary modeled series:

```text
S1 = newRawStateCount[d]
S2 = treeNodeOccurrences[d]
```

Rolling-origin development backtest origins are fixed at:

```text
5 -> 6
6 -> 7
7 -> 8
8 -> 9
```

For each candidate, compute absolute natural-log error for both S1 and S2 at all four origins.

Eligibility requires:

```text
all predictions finite and > 0
no predicted count decrease relative to the immediately prior observed layer
maximum absolute log error across the 8 backtest cells <= 0.15
```

Among eligible candidates, choose exactly one by the following lexicographic rule:

1. smallest maximum absolute log error across the 8 cells;
2. then smallest mean absolute log error across the 8 cells;
3. then fixed candidate order `E1`, `E2`, `E3`.

If no candidate is eligible, Stage 1 closes `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`; Stage 2 is not authorized.

## Frozen uncertainty method

For the selected candidate, let `q` be its maximum absolute log error across the 8 frozen rolling-origin backtest cells.

The deterministic development-calibrated log-radius is:

```text
R1 = max(0.15, 2*q)   # depth 10, horizon 1
R2 = 2*R1             # depth 11, horizon 2 stress-test
```

For predicted count `p`, the uncertainty envelope is:

```text
[p * exp(-R_h), p * exp(R_h)]
```

This is a deterministic calibration envelope, not a frequentist confidence interval and not a Bayesian credible interval.

## Frozen formal validation endpoint

Mandatory Stage 2 primary validation is based only on fresh exact depth 10 values for S1 and S2.

Validation requires all of the following:

```text
1. depth 10 is a complete exact layer under the frozen RAW identity;
2. production and independent exact reconstruction agree with zero mismatch;
3. max(abs(log(predicted/observed))) across S1,S2 <= 0.20;
4. both exact observed values lie inside the frozen R1 uncertainty envelopes;
5. no refit/recalibration/threshold change occurred after holdout generation.
```

Cumulative RAW-state and cumulative tree-occurrence predictions are derived secondary endpoints and must be reported, but they do not replace the primary layer-wise criterion.

Depth 11, if complete, is a prospective secondary stress-test under the already frozen estimator. It cannot rescue a failed depth 10 decision and cannot overturn a valid depth 10 decision; it refines the bounded generalization boundary only.

## Resource contract

Formal enumeration ceilings are frozen as:

```text
maximum target depth attempted = 11
mandatory complete holdout depth = 10
maximum cumulative distinct RAW states = 2000000
maximum cumulative depth-labelled legal edges = 12000000
maximum unique parent-state expansions = 600000
maximum legal move evaluations = 12000000
maximum cumulative tree-node occurrences = 50000000
maximum resident set size = 6442450944 bytes
maximum wall-clock / administrative cutoff = 1200 seconds
maximum uncompressed scientific artifact bytes = 1073741824
restart rule = no checkpoint resume for formal execution; restart from depth 0
```

A depth becomes exact only after every legal move of every parent state in the preceding complete layer has been generated, successor-bound, validated, deduplicated under RAW identity, and independently verified.

If depth 10 cannot complete because a frozen resource/admin ceiling is reached, the Study does not use partial depth 10 counts for validation and closes under the resource taxonomy below. Depth 11 failure has no retroactive effect on a completed depth 10 formal decision.

## Stage identities

```text
Stage 0 = SSGTGE-S0-TECHNICAL-2026-08-30-v1
Stage 1 = SSGTGE-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = SSGTGE-S2-FORMAL-2026-08-30-v1
```

Stage 0 is technical-only and may not emit scientific estimator-performance evidence.

Stage 1 consumes only pre-existing development evidence and freezes the single estimator specification. No fresh deeper exact layer is generated in Stage 1.

Stage 2 may run only after source hashes, estimator parameters, prediction values, uncertainty envelopes, holdout domain, resource ceilings, decision mapping, and independent verifier hashes are committed and explicitly authorized.

## Seed / domain reservation

This Study's formal standard-root enumeration is deterministic and seedless.

```text
development domain = immutable G2-05 exact summaries, depths 0..9
formal primary holdout domain = standard initial RAW root, depth 10 exact layer
secondary stress domain = same root, depth 11 exact layer if complete
scientific seed block = none
```

No consumed seed from another Study is reused.

## Decision taxonomy

Study-level formal decisions:

- `VALIDATED-WITHIN-FRESH-DEPTH-10-HOLDOUT`
- `NOT-VALIDATED`
- `NON-ESTIMABLE`
- `RESOURCE-CENSORED`
- `TECHNICAL-INVALID`
- `INCONCLUSIVE`

Stage-level dispositions may include:

- `STAGE0-TECHNICAL-PASS`
- `ESTIMATOR-FROZEN-DEVELOPMENT`
- `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`
- `STAGE1-TECHNICAL-INVALID`
- `NOT-AUTHORIZED-NOT-EXECUTED`

Technical stop classifications remain separate:

- `UNIQUE_STATE_CAP`
- `EDGE_CAP`
- `PARENT_EXPANSION_CAP`
- `MOVE_EVALUATION_CAP`
- `TREE_OCCURRENCE_CAP`
- `RSS_CAP`
- `ARTIFACT_BYTE_CAP`
- `ADMIN-CUTOFF`
- `VERIFICATION-FAILED`

## Interpretation boundary

Even if validated, this Study does not authorize an unconditional statement of the form `Bao state space = X` or `Bao full game tree = Y`.

The formal positive claim, if any, is limited to the frozen estimator's ability to predict the specified fresh bounded holdout under the authoritative RAW identity. Any later extrapolation beyond the validated horizon must be clearly labeled model-based and bounded by the frozen Study interpretation rules.

No strategic-regime, long-horizon strategic-transition, persistence, bottleneck, recurrence, or G2-11 representation claim is authorized by G2-12.

## No-rescue rule

After any fresh depth 10 scientific outcome exists, this Study may not change estimator family, fitting window, backtest origins, eligibility threshold, winner-selection rule, uncertainty radius formula, formal error threshold, resource ceilings, holdout depth, RAW identity, verifier semantics, or decision mapping.

A failed or censored outcome is a valid closure. A scientifically valid new attempt after a consumed holdout requires a new prospective Study/version with a fresh contract.