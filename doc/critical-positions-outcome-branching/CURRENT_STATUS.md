# CURRENT_STATUS — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-24

## Repository identity

```text
studyId = CPOB-STUDY1
baseline main HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
previously reported main HEAD = 2c452186fc1bfbe2800c84d9acc8546915c33da1
study branch = research/critical-positions-outcome-branching
draft tracking PR = #36 / DO NOT MERGE during active scientific execution
directory = doc/critical-positions-outcome-branching/
artifact root = artifacts/local/critical-positions-outcome-branching/
```

The study branch was created from the actually verified main HEAD `576783b1...`. Completed prior-study formal decisions remain immutable.

## Current scientific state

```text
prior-study state restoration = COMPLETE
seed namespace audit = COMPLETE for tracked declarations at initiation
Stage 0 construct design = COMPLETE / FROZEN
Stage 0 technical execution = COMPLETE / PASS
Stage 0 independent technical replay verification = PASS
Stage 0 scientific data = NONE
Stage 1 prospective design = FROZEN / VALIDATED
Stage 1 pre-generation firewall = COMPLETE / PASS
Stage 1 source-bound generation authorization = ISSUED
Stage 1 scientific source generation = COMPLETE / 3072 of 3072
Stage 1 scientific source seeds consumed = 22600001..22603072 / COMPLETE
Stage 1 independent full corpus replay verification = COMPLETE / PASS
Stage 1 outcome-blind root selection = COMPLETE / READINESS PASS
Stage 1 selected roots = 600 = 300 Namua + 300 Mtaji
Stage 1 scientific continuation measurement = UNBLOCKED / NOT STARTED
Stage 1 scientific continuation outcomes inspected = false
Stage 2 scientific generation = NOT AUTHORIZED / NOT STARTED
```

Stage 1 remains exploratory only:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

Authorization does not permit confirmatory inference, Stage 2 generation, validated win-probability claims, game-theoretic criticality claims, human/expert criticality claims, or rescue/relabeling of completed studies.

## Frozen Stage 1 identity

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
authorization SHA-256 = 34ae3f2afb066521f2165f6e16d5edd720ab9587b71c64dce677696ad23cd941
source games = 3072
source seeds = 22600001..22603072
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
```

## Stage 1 generated source corpus

Generated manifest identity:

```text
generatedAt = 2026-08-23T11:15:15.447Z
sourceCommit = 157a4947435213b430ae7a9a85cc861aebfc258e
sourceTreeDirty = false
summaryHash = 1a56b7afb8c6c295f827c0546a87e9c2b0788914bffd1587b47f0d778bf73d63
```

Frozen population realized exactly:

```text
games = 3072
B-D1 = 512
B-D2 = 512
B-D3 = 512
LS-D2 = 512
V2-D2 = 512
LE-D2 = 512
```

Outcome-independent generation summary:

```text
uniqueHistoricalTrajectories = 2726
duplicateHistoricalTrajectoryGroups = 232
largestHistoricalTrajectoryGroup = 7
distinctOpeningPrefixes = 2226
```

Generation-level preregistered identity/diversity gates passed:

```text
unique historical trajectories: 2726 >= 2500 -> PASS
generated distinct opening prefixes: 2226 >= 1800 -> PASS
```

Generation checkpoint:

```text
doc/critical-positions-outcome-branching/checkpoints/2026-08-23-stage1-source-corpus-generated-verification-pending.md
commit = cd7b367c90df7d628b48471d7d63d863313e6057
```

## Stage 1 independent full corpus replay verification

Independent local `verification.json`:

```text
passed = true
gamesVerified = 3072
fullCorpusReplay = true
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

Verification checkpoint:

```text
doc/critical-positions-outcome-branching/checkpoints/2026-08-23-stage1-full-corpus-replay-verification-pass.md
checkpoint commit = e6a1fa2a467ba6646418a1096e1b3bacc4566914
```

This was a reproducibility/identity firewall only and did not inspect continuation outcomes.

## Stage 1 outcome-blind root selection

Frozen procedure:

```text
collapse duplicate historicalTrajectoryHash groups
-> deterministic Namua/Mtaji assignment by frozen SHA parity
-> choose one eligible root within assigned phase by frozen SHA rank
-> collapse duplicate selected ruleStateKey without replacement
-> apply frozen phase quotas: 300 Namua + 300 Mtaji
```

Forbidden selection inputs remained excluded:

```text
game winner
continuation outcome
D_range
D2/D3 score
candidate matcher
post-move consequence
```

Observed selection audit:

```text
generatedGames = 3072
uniqueHistoricalTrajectories = 2726
unavailableAssignedPhase = 87
selectedBeforeRuleStateCollapse = 2639
duplicateSelectedRuleStatesCollapsed = 6
phasePoolAfterRuleStateCollapse:
  namua = 1356
  mtaji = 1277
droppedByPhaseQuota:
  namua = 1056
  mtaji = 977
selectedUniqueRuleStates = 600
replacementPerformed = false
phaseReassignmentPerformed = false
```

Final selected population:

```text
Namua = 300
Mtaji = 300
total = 600
unique historical trajectories among selected roots = 600
unique rule states among selected roots = 600
selected distinct opening prefixes = 567
maximum single generation-stratum share = 0.18833333333333332
```

Generation-stratum counts:

```text
B-D1 = 95
B-D2 = 95
B-D3 = 105
LS-D2 = 113
V2-D2 = 99
LE-D2 = 93
```

All frozen selection-readiness gates passed:

```text
uniqueHistoricalTrajectories = PASS
generatedDistinctOpeningPrefixes = PASS
selectedUniqueRuleStates = PASS
namuaSelectedRoots = PASS
mtajiSelectedRoots = PASS
selectedDistinctOpeningPrefixes = PASS
selectedPerGenerationStratum = PASS
maximumSingleSelectedGenerationStratumShare = PASS
selection readiness = PASS
```

Independent cross-check of the supplied compact artifacts also found:

```text
selectionHash agrees across selected-roots and selection-audit = true
terminal selected roots = 0
assigned phase mismatches = 0
selected roots with actor legalMoveCount < 2 = 0
selected roots with ply < 8 = 0
```

Selection checkpoint:

```text
doc/critical-positions-outcome-branching/checkpoints/2026-08-24-stage1-outcome-blind-selection-readiness-pass.md
checkpoint commit = 5c3a6e87cd4fbe19c845756341d1afc62c735a2b
```

## Primary construct and frozen measurement

Primary construct:

```text
fixed-policy empirical continuation divergence
```

For every selected root:

```text
root actor = state.player
root move interventions = every exact E.moveVariants(root) / AI.moveKey variant
post-root continuation policy = P1_NORMAL_TOP3
replicates per exact root move = 64
maximum post-root continuation plies = 200
replicate pairing = common derived seed across all root moves at replicate index r
administrative cap = ADMINISTRATIVE_UNFINISHED, never draw/0.5
primary root estimability = every exact root move terminates in all 64 replicates
```

For a primary-estimable root:

```text
p_hat_m = root-actor wins / 64 for exact legal move m
D_range = max_m(p_hat_m) - min_m(p_hat_m)
highDivergence = D_range >= 0.30
```

`p_hat_m` is a fixed-policy empirical continuation quantity. It is not a game-theoretic probability and is not derived from the inconclusive Calibration Study isotonic mapping.

Secondary root-only measurements remain:

```text
exact D2/D3 / bao / phase2 / Q1 search-value axis
TopSet / ranking-instability summaries
immediate structural transition
exhaustive one-ply opponent reply envelope
```

D3 is not ground truth. No validated probability conversion is authorized. No fabricated PV is allowed.

## Stage 1 pre-generation firewall and authorization

Final source-changing implementation before authorization:

```text
implementation commit = 3995932ae73e9e99a27d4143de4e359db1136060
Stage 1 contract run = 32625783543 / success
Stage 1 tooling run/job = 32625783544 / 97160810538 / success
Stage 0 regression run = 32625783553 / success
pre-generation firewall checkpoint = 53dcfd971c9408327d2d9830486523322ec41a22
authorization commit = a85f9b36abbf492cd8085b0a95c8d10b76f849e8
```

The authorization remains bound to the frozen spec and exact scientific source hashes. Documentation/checkpoint changes after generation do not change the authorized scientific implementation.

## Immutable inherited formal states

```text
Blunder / Misvaluation Patterns Study 1:
  4 estimable formal candidates
  0 CONFIRMED
  4 NOT-CONFIRMED
  CLOSED

Position Evaluation / Win-Rate Calibration Study 1:
  FORMAL DECISION = INCONCLUSIVE
  Stage 1 isotonic mapping = exploratory only

Position Complexity / Difficulty Study 1:
  PCX-H1 = INCONCLUSIVE
  PCX-H2 = NOT-CONFIRMATORILY-EVALUATED

Tactical Motifs / Tesuji Study 1:
  C01 = NOT-CONFIRMED
  C02 = NOT-CONFIRMED
  C03 = CONFIRMED
  C04 = NOT-CONFIRMED

Tactical Motif Human / Expert Validation Study 1:
  machineEvidence = CONFIRMED
  humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
  N = 0

Namua→Mtaji Strategic Temporal Transition Study 1:
  FORMAL DECISION = NOT-CONFIRMED
  first Mtaji observation under frozen engine = deterministic ply 44 for Mtaji-reaching trajectories
```

No inherited label may be changed by this study.

## Seed state

```text
Stage 0 scientific seed block = NONE
Stage 1 = 22600001..22603072 -> CONSUMED by frozen source generation
Stage 2 = 22700001..22706144 -> RESERVED / NOT AUTHORIZED / UNCONSUMED
```

Continuation RNG seeds are deterministically derived from stage salt + root identity + replicate index and do not expand the source-game seed namespace.

## Current next gate

The outcome-blind selection readiness firewall has passed. The next permitted operation is frozen Stage 1 continuation/secondary/structural measurement:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase measure
```

Expected compact output includes:

```text
measurement-audit.json
```

Do not replace non-estimable roots, increase replicates, extend the source seed block, change the 200-ply cap, substitute the continuation policy, retune `D_range`, or inspect/promote favorable subgroups.

After measurement, run the mandatory independent full remeasurement/recomputation:

```bash
node tools/experiments/verify-critical-positions-stage1-exploratory.js \
  --phase measurement \
  --output artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1
```

Deterministic discovery remains blocked until `measurement-verification.json` has been produced and its required verification conditions pass. Stage 2 remains locked and unconsumed.
