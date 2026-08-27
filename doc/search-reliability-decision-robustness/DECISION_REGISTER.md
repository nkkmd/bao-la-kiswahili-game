# SRDR-STUDY1 — Decision Register

## D-001 — Study identity

Date: 2026-08-27

`G2-02` is instantiated as a new independent Research Generation 2 Study.

```text
Formal title = Search Reliability / Decision Robustness Study 1
Study ID = SRDR-STUDY1
Japanese working title = Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性のprospective検証
```

`G2-02` remains the Agenda sequence label, not the formal Study ID.

## D-002 — Baseline and branch

```text
Study-start remote main = db6980bffb7e6853751914da628db8936c76d81e
Prior expected main = db6980bffb7e6853751914da628db8936c76d81e
Match = true
Research branch = research/g2-02-search-reliability-decision-robustness
Open PRs at start = 0
```

Residual G2-01 branches were behind `main` with no commits ahead and were not competing active research branches.

## D-003 — Research Generation 2 position

`SRDR-STUDY1` is the Wave A / P0 `G2-02` measurement-foundation Study. It is independent of G2-01 and precedes downstream uses of search-reliability information in later Research Generation 2 work.

## D-004 — Upstream immutable decisions

The following remain immutable:

```text
PEOCR-STUDY1 = INCONCLUSIVE
Position Complexity / Difficulty Study 1 overall = INCONCLUSIVE
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

G2-01 data and Position Complexity scientific rows are prohibited as G2-02 formal evidence. Prior instruments and failure modes may inform technical design and resource planning only.

## D-005 — Primary construct boundary

Primary construct:

```text
machine search reliability / decision robustness
under prospectively frozen search-condition perturbations
```

Not equivalent to human difficulty, structural complexity, empirical win probability, game-theoretic value, engine evaluation correctness, public-AI strength or human perception.

A higher-resource condition is a `frozen search reference` only and never an oracle of true optimal play.

## D-006 — RAW state identity

Formal identity is:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` / `reason` are excluded. Symmetry reduction, reflection equivalence, player-seat canonicalization, state canonicalization and unvalidated isomorphism are forbidden for formal deduplication.

## D-007 — Stage structure

Fixed at Study start:

```text
SRDR-S0-TECHNICAL-2026-08-27-v1
SRDR-S1-DEVELOPMENT-2026-08-27-v1
SRDR-S2-FORMAL-2026-08-27-v1
```

Stage 0 is technical/non-scientific. Stage 1 is fresh development/construct characterization and is consumed after inspection. Stage 2 is fresh held-out formal replication.

## D-008 — Stage 0 technical spec

The Stage 0 machine-readable spec was frozen at:

```text
preregistration/STAGE_0_TECHNICAL_SPEC.json
SHA-256 = 12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
scientificSeedUseAllowed = false
```

## D-009 — Candidate search axes

Stage 0 technically evaluated depth, node budget, quiescence, move ordering and PV extraction together with available public-search controls. The scientific sensitivity axes promoted prospectively were depth, node budget and quiescence. No unrestricted factorial grid was authorized.

## D-010 — Implementation boundary

Public `AI.analyzeMove()` supplies the underlying engine/search/evaluator behavior. Dedicated deterministic node-budget semantics and PV extraction are research instrumentation. Formal G2-02 does not interpret deeper or higher-budget search as truth.

## D-011 — Move / tie / ranking / PV rules

Scientific rules are frozen as:

```text
move identity = exact AI.moveKey
scientific move ordering = lexical canonical
score tie tolerance = 0
TopSet = all exact maximum-score legal moves
canonical best = lexical minimum member of TopSet
Top-k = k=3 or all moves if fewer than 3
ranking ties = exact-score ties with average ranks for correlation
PV = canonical-exact-nominal-pv/quiescence-score-only/v1
```

No result-dependent tie-tolerance or TopSet change is authorized.

## D-012 — Population / firewall principle

Fresh historically reachable RAW states are required. Selection is search-reliability-outcome-blind. One selected state per historical trajectory is the maximum, followed by RAW-state deduplication. Stage 1 scientific units are consumed after inspection and cannot be reused as Stage 2 formal evidence.

## D-013 — Formal decision taxonomy

Study-level taxonomy is frozen as:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE
```

Technical execution failure is not a scientific failure and may not be relabeled `NOT-CONFIRMED`.

## D-014 — No-rescue and engineering separation

No post-outcome seed extension, favorable state replacement, search-grid substitution, threshold relaxation, tie tolerance change, subgroup rescue, failed-gate exception or alternate primary is authorized.

`PBAI-P1` and later AI engineering decisions cannot modify the G2-02 scientific decision.

## D-015 — Stage 0 decision

Date: 2026-08-27

Stage 0 passed all technical gates. Node-budget semantics are fixed as last fully completed all-root-candidate iterative-deepening depth only; partial iterations are discarded. PV reconstruction is deterministic postprocessing. Scientific move ordering must remain fixed because ordering can change node consumption even when complete-depth scores are unchanged.

Decision:

```text
STAGE 0 = PASS
```

## D-016 — Stage 1 prospective population and grid

Date: 2026-08-27

Stage 1 froze:

```text
games = 1280
seeds = 25011001..25012280
maxPly = 80
no extension
no replacement
search grid = D1_Q1 / D2_Q1 / D3_Q1 / D2_Q0 / D2_Q2 / B64 / B256 / B1024
```

The Stage 1 source-freeze commit was `753425610573354ae6394ae414666c3bc62c5365`. Scientific generation was explicitly authorized only after preauthorization and source-hash freeze.

## D-017 — Stage 1 verification-hash correction classification

Date: 2026-08-28

The initial Stage 1 independent verifier completed all scientific replay and remeasurement with:

```text
game replay mismatches = 0
selected-state mismatches = 0
measurement-row mismatches = 0
selection hash match = true
```

Its final aggregate hash differed because the frozen production pre-serialization representation contained exact-depth `attemptedDepth: undefined` and `abortedDepth: undefined`, whereas JSON persistence omitted those properties.

The discrepancy was exactly reproducible both ways from the immutable artifact. It is formally classified as:

```text
verification-hash-serialization-defect
scientific measurement mismatch = false
scientific regeneration authorized = false
seed reconsumption authorized = false
```

Correction ID: `SRDR-S1-VERIFICATION-HASH-CORRECTION-2026-08-28-v1`.

This decision does not relax any scientific gate and is not a rescue of a scientific outcome.

## D-018 — Stage 1 development decision

Date: 2026-08-28

After the strict representation-only correction, all prospectively frozen Stage 1 readiness gates passed.

```text
games = 1280
unique historical trajectories = 1057
selected unique RAW states = 1018
Namua = 527
Mtaji = 491
corrected independent verification = PASS
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

Decision:

```text
STAGE 1 = PROFILE-FROZEN-DEVELOPMENT
```

This is development characterization, not the Study-level formal decision.

## D-019 — Stage 2 consumed-identity firewall

Date: 2026-08-28

Stage 2 uses the corrected immutable Stage 1 artifact solely for consumed-identity exclusion and Stage 2 preregistration/resource planning. Stage 1 rows are not formal evidence.

The Stage 2 firewall is prospectively frozen as:

```text
historicalTrajectoryHash overlap -> exclude / no replacement
openingPrefixHash overlap -> exclude / no replacement
selected RAW rawStateKey overlap -> exclude / no replacement
required post-firewall overlap = 0 / 0 / 0
```

## D-020 — Stage 2 formal criterion

Date: 2026-08-28

Before any Stage 2 outcome, formal criterion `mixed-material-sensitivity-and-high-budget-convergence/v1` was frozen.

After all identity/measurement/reproducibility/estimability gates pass, all three are required:

```text
P1: D2_Q1 vs D3_Q1 pooled canonical-best disagreement
    95% Wilson lower bound >= 0.20
P2: D2_Q2 vs D2_Q1 pooled canonical-best disagreement
    95% Wilson lower bound >= 0.20
P3: B1024_Q1_MAXD3 vs D3_Q1 pooled canonical-best agreement
    95% Wilson lower bound >= 0.90
```

These thresholds are substantive rounded definitions fixed after development but are not copies of Stage 1 point estimates or confidence limits.

Formal rule:

```text
any gate fails -> INCONCLUSIVE
all gates pass + P1/P2/P3 all pass -> CONFIRMED
all gates pass + any of P1/P2/P3 fails -> NOT-CONFIRMED
```

Phase-stratified metrics, ranking metrics and PV metrics remain mandatory secondary reporting and cannot rescue the primary decision.

## D-021 — Stage 2 hash contract

Date: 2026-08-28

Stage 2 prospectively prevents recurrence of the Stage 1 serialization defect:

```text
measurement core
-> JSON roundtrip
-> stable canonical serialization
-> SHA-256
```

Any undefined-only object property therefore cannot produce a hidden pre-persistence hash split.

## D-022 — Stage 2 authorization

Date: 2026-08-28

The Stage 2 preauthorization trigger coverage was repaired before authorization so that all Stage 2 workflow source changes retrigger both the technical contract and source-freeze workflow.

On the same source commit:

```text
source commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
preauthorization run 33124483699 = success
source-freeze run 33124483869 = success
Stage 2 spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
```

Stage 2 was explicitly authorized by commit:

`bec87d54540c96c24353f2eeadc25338c53e54eb`

Authorization is limited to:

```text
games = 1536
seeds = 25021001..25022536
frozen grid / firewall / gates / formal criterion only
extension = false
replacement = false
no-rescue = active
```

Formal run `33124538584` is the authorized Stage 2 execution. No formal decision exists until that run passes independent verification and the frozen analyzer materializes a canonical result.