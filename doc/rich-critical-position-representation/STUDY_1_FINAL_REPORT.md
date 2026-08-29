# Rich Critical-Position Representation Study 1 — Final Report

Updated: 2026-08-29

## Study identity

```text
Program label = G2-06
Study ID = RCPR-STUDY1
Research Generation = Research Generation 2
Formal title = Rich Critical-Position Representation Study 1
Baseline main = 37480777246aa306c6ca3d0679d936b5e0107071
Research branch = research/g2-06-rich-critical-position-representation
Scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
```

Japanese working title:

**Baoにおける重要局面の豊かな構造表現の構築とprospective検証 — rich pre-root representationによるdecision-critical structureの再現可能な識別**

## Final decision

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement / extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

The Study closes at Stage 1 because the prospectively mandatory independent verifier did not reproduce all 600 pre-root feature vectors with exact equality. The technical failure is not a scientific rejection of the rich representation hypothesis, and the production-only readiness result is not promoted to an accepted scientific result.

## Research question

The Study asked whether a richer representation fixed from information available at or before a root can reproducibly identify the same machine-defined fixed-policy continuation-divergence construct in a fresh population.

The motivation came from the completed Research Generation 1 Critical Positions / Outcome Branching Study 1, which observed 139 high-divergence roots among 600 selected roots but promoted no candidate from its frozen simple structural grammar. G2-06 did not reopen that Study, promote its near misses, relax its thresholds, or reuse its measured roots/outcomes as development or formal evidence.

## Scientific identity and no-rescue boundary

Authoritative state identity remained RAW-only:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` and `reason` were excluded. The validated transform set remained empty:

```text
validated transform set = []
canonicalization = false
symmetry reduction = false
```

All Research Generation 1 decisions and G2-01..G2-05 decisions remained immutable. Historical Critical Positions source seeds, selected roots, high-divergence roots, candidate audits, and reserved Stage 2 evidence were excluded from G2-06 scientific development/formal evidence.

## Representation contract

The Study prospectively declared eight feature families:

```text
LOCAL_PIT_TOPOLOGY
CAPTURE_GRAPH
LEGAL_MOVE_GEOMETRY
REPLY_GRAPH
RESERVE_HOUSE_RELATION
MOVE_SET_ENTROPY
SEARCH_GAP_VECTOR
LOCAL_TEMPORAL_CONTEXT
```

Only predictor information available at or before the root was eligible. Continuation outcomes, future winners, `D_range`, post-root rollout states, and other future-outcome-derived quantities were prohibited from the predictor representation.

Stage 0 froze a 310-scalar feature schema with:

```text
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
```

## Stage 0 — technical representation validation

Stage 0 was technical-only and generated no scientific outcome.

Canonical execution:

```text
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
job = 98876051308
artifact = 9688987798
artifact ZIP SHA256 = 442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

Six technical fixtures covered Namua and Mtaji. Production and structurally independent implementations agreed exactly on the full representation and RAW identity, and mandatory positive/negative controls passed.

Decision:

```text
STAGE0-TECHNICAL-PASS
```

## Stage 1 — prospective development freeze

Before Stage 1 scientific outcome generation, the following were fixed:

```text
source games = 3072
fresh seed block = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
selected-root target = 600
Namua quota = 300
Mtaji quota = 300
representation width = 310 scalar features
replicates per exact root move = 64
maximum post-root continuation plies = 200
primary divergence endpoint = D_range
high-divergence boundary = D_range >= 0.30
model development = deterministic diagonal LDA
cross-validation = 5-fold by historicalTrajectoryHash
Stage 1 rows reusable as Stage 2 formal evidence = false
```

The source population used six prospectively fixed generation strata. Root selection was outcome-blind, RAW duplicate handling was fixed, and no phase replacement/reassignment was allowed if quotas were unavailable.

The Stage 1 scientific design SHA256 was:

```text
STAGE_1_DEVELOPMENT_SPEC.json = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
STAGE_1_EXECUTION_ADDENDUM.json = e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64
```

## Implementation, resource, and source-freeze validation

Before scientific authorization, non-scientific validation established that the frozen pipeline was runnable and that the exact scientific source set was bound.

```text
implementation smoke run = 33195723195 / success
implementation smoke artifact = 9695647002
resource preflight run = 33195349152 / success
resource preflight artifact = 9695494212
source-freeze audit run = 33196797865 / success
source-freeze audit artifact = 9696075216
source-freeze audit envelope SHA256 = 03c466fa075d95ee0a8aba8ba863e7236a9a1997e8b566e6725b0ba378476a2d
```

The scientific source was frozen at:

```text
a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
```

The source-freeze audit confirmed the exact Git blobs required by the scientific run before explicit authorization.

## Explicit Stage 1 authorization and consumption

Explicit authorization was committed as:

```text
authorization ID = RCPR-S1-EXECUTE-2026-08-29-v1
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
```

The authorization retained:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2Authorized = false
```

It bound the fixed spec, execution addendum, exact source-blob map, fresh seed block, and fail-closed consume-once failure semantics.

Once the scientific Stage 1 execution crossed its start boundary, the seed block became permanently consumed for `RCPR-STUDY1`.

## Stage 1 execution

Canonical workflow:

```text
workflow run = 33196954082 / completed / failure
production job = 98936414477 / success
independent verification job = 99007180273 / failure
failed step = Independent full-corpus replay and recomputation
```

### Production-only development output

Production completed the frozen development pipeline and reported:

```text
generated games = 3072
selected roots = 600
primary estimable = 599
high divergence = 134
low divergence = 465
selected family set = RICH_ALL
overall OOF AUROC = 0.7093403948001926
Namua AUROC = 0.7356189599631845
Mtaji AUROC = 0.6657646992502396
balanced accuracy = 0.6684641309581127
```

All frozen production readiness checks were true.

Production artifact provenance:

```text
artifact = 9704250489
artifact ZIP SHA256 = 00c210eb0fd9391c67e05b40daa3a85f66a1bc5ba2a460db40128f290e6d26d8
production result SHA256 = bc2ece4cb2df6f3cc5625324661c56fcaa6476c9921265f08fa13f005373b66e
production development core SHA256 = 245c7e04421b1ef534edcb23d3048df1e2f1d556f9223f1eee84f054973f66b8
```

These results are retained strictly as production-only unverified development provenance. They do not constitute an accepted scientific Stage 1 result and do not authorize Stage 2.

## Mandatory independent verification

The independent verifier recomputed the corpus, root selection, representation, continuation outcomes, model development, and readiness without importing the production feature implementation or production Stage 1 classifier helper.

Verification outcome:

```text
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
developmentCoreMatch = false
technicalPass = false
finalDecision = STAGE1-TECHNICAL-INVALID
```

Exactly four of 600 selected rows failed exact feature-vector hash equality. RAW state keys, continuation measurements, `D_range`, high-divergence labels, model development, and readiness otherwise agreed.

Verification artifact provenance:

```text
artifact = 9708956844
artifact ZIP SHA256 = 1f1be58ec9dccd5aa35ad7a903333b5c8c912795edab7b31d4e2541119e8d0e5
verification SHA256 = 6ca0257e4d2064afa177937f881ec13a1843fd98bc133cc5c94522fdd4b44ee2
independent development core SHA256 = 5b2251ef1ac34295cd1d67412c9d7f09adbe55b5af81a8752d3cb639b036e22a
```

## Technical postmortem

A read-only post-failure audit localized all four mismatches to one feature:

```text
MOVE_SET_ENTROPY.indexEntropy
```

Production accumulated Shannon entropy terms from a `Map` in encounter/insertion order. The independent implementation used a plain object; JavaScript enumeration numerically orders integer-like keys. Because floating-point addition is not exactly associative, the different summation order produced differences of approximately:

```text
2.220446049250313e-16 .. 4.440892098500626e-16
```

The prospectively frozen verifier required exact equality. Therefore the explanation does not authorize replacing exact equality with a tolerance, rounding the vectors after outcome observation, repairing the verifier and rerunning the consumed block, or treating the four mismatches as immaterial for the Study decision.

The canonical postmortem is:

- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`

## Fail-closed closure

The frozen execution contract maps a post-consumption technical or independent-verification failure to:

```text
STAGE1-TECHNICAL-INVALID
```

Therefore:

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement / extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No post-hoc rescue was applied.

## Interpretation boundary

This closure does **not** establish that rich pre-root representation cannot identify machine-defined decision-critical structure. It also does not validate `RICH_ALL`, its production AUROC, or the production operating threshold as a reusable scientific classifier.

The Study establishes only that the prospectively frozen Stage 1 pipeline failed its mandatory exact independent representation-verification requirement after consuming its single fresh development block.

The production observations may be preserved for provenance and future hypothesis generation, but they must not be promoted into accepted Stage 1 evidence, Stage 2 formal evidence, or a claim of validated critical-position classification.

## Workflow archival and repository closure

After scientific closure and central-document synchronization, all RCPR technical/development/materialization workflows were converted to read-only archival stubs. The original executable blobs remain preserved in Git history and source-freeze records.

Canonical archive checkpoint:

- `checkpoints/2026-08-29-post-closure-workflow-archive.md`

No further RCPR-STUDY1 technical, development, scientific, or automatic central-document execution is authorized.

## Program continuation

G2-06 is closed and is not reopened as a result-driven `RCPR-STUDY2` retry.

The next uncompleted machine-only Research Generation 2 agenda item is:

```text
G2-07 — Practical Comeback / Reply-Pressure Representation Study 1
```

G2-07 requires a fresh repository-state audit, new prospective Study/Stage IDs, its own representation/endpoint/source/seed contract, and explicit authorization. It does not inherit RCPR Stage 1 rows as formal evidence.

A future independent revisit of rich critical-position representation is possible only under a distinct prospective identity with deterministic entropy/numeric-hash semantics, fresh technical validation, fresh scientific evidence, and fresh authorization. It must not alter the final `RCPR-STUDY1` decision.
