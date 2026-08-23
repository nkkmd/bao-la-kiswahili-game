# CURRENT_STATUS — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-24

## Repository identity

```text
studyId = CPOB-STUDY1
baseline main HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
study branch = research/critical-positions-outcome-branching
draft tracking PR = #36 / DO NOT MERGE during active scientific execution
directory = doc/critical-positions-outcome-branching/
artifact root = artifacts/local/critical-positions-outcome-branching/
```

Completed prior-study formal decisions remain immutable.

## Current scientific state

```text
Stage 0 construct design = COMPLETE / FROZEN
Stage 0 technical validation + independent replay = PASS
Stage 1 prospective design = FROZEN / VALIDATED
Stage 1 pre-generation firewall = COMPLETE / PASS
Stage 1 source-bound generation authorization = ISSUED
Stage 1 scientific source generation = COMPLETE / 3072 of 3072
Stage 1 scientific source seeds consumed = 22600001..22603072 / COMPLETE
Stage 1 independent full corpus replay verification = COMPLETE / PASS
Stage 1 outcome-blind root selection = COMPLETE / READINESS PASS
Stage 1 selected roots = 600 = 300 Namua + 300 Mtaji
Stage 1 continuation / secondary / structural measurement = COMPLETE / READINESS PASS
Stage 1 independent full continuation remeasurement = PENDING / NEXT
Stage 1 deterministic exploratory discovery = BLOCKED pending measurement verification PASS
Stage 2 scientific generation = NOT AUTHORIZED / NOT STARTED
```

Stage 1 remains exploratory only:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

## Frozen Stage 1 identity

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
authorization SHA-256 = 34ae3f2afb066521f2165f6e16d5edd720ab9587b71c64dce677696ad23cd941
source games = 3072
source seeds = 22600001..22603072
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
```

## Source corpus and verification

Generated source corpus:

```text
games = 3072
B-D1 = 512
B-D2 = 512
B-D3 = 512
LS-D2 = 512
V2-D2 = 512
LE-D2 = 512
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
```

Independent corpus replay:

```text
passed = true
gamesVerified = 3072
fullCorpusReplay = true
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
```

No continuation outcome was used for source generation, corpus verification, or root selection.

## Outcome-blind root selection

Frozen procedure:

```text
collapse duplicate historicalTrajectoryHash groups
-> deterministic Namua/Mtaji assignment by frozen SHA parity
-> choose one eligible root within assigned phase by frozen SHA rank
-> collapse duplicate selected ruleStateKey without replacement
-> apply frozen phase quotas: 300 Namua + 300 Mtaji
```

Observed audit:

```text
unavailableAssignedPhase = 87
selectedBeforeRuleStateCollapse = 2639
duplicateSelectedRuleStatesCollapsed = 6
phasePoolAfterRuleStateCollapse = Namua 1356 / Mtaji 1277
selectedUniqueRuleStates = 600
replacementPerformed = false
phaseReassignmentPerformed = false
Namua = 300
Mtaji = 300
selected distinct opening prefixes = 567
maximum single generation-stratum share = 0.18833333333333332
selection readiness = PASS
```

Generation-stratum counts among selected roots:

```text
B-D1 = 95
B-D2 = 95
B-D3 = 105
LS-D2 = 113
V2-D2 = 99
LE-D2 = 93
```

Selection checkpoint:

```text
doc/critical-positions-outcome-branching/checkpoints/2026-08-24-stage1-outcome-blind-selection-readiness-pass.md
commit = 5c3a6e87cd4fbe19c845756341d1afc62c735a2b
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

Secondary measurements are exact D2/D3 root tables under the frozen bao/phase2/Q1 semantics plus immediate structural transitions and exhaustive one-ply opponent reply envelopes. D3 is not ground truth.

## Stage 1 measurement readiness result

The local compact `measurement-audit.json` reports:

```text
selectedRoots = 600
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
primaryEstimableNamuaRoots = 300
primaryEstimableMtajiRoots = 300
replacementPerformed = false
replicateExtensionPerformed = false
continuationPolicySubstitutionPerformed = false
```

All frozen measurement-readiness gates passed:

```text
measuredExactRootMoveInterventions = PASS
primaryEstimableRoots = PASS
primaryEstimableNamuaRoots = PASS
primaryEstimableMtajiRoots = PASS
finiteD2D3CandidateTables = PASS
overall = PASS
```

Important boundary:

```text
independentContinuationRemeasurementPending = true
```

The measurement outputs now contain exploratory continuation outcomes, but deterministic discovery remains blocked until the independent verifier fully reproduces the selected-root set, all continuation measurements, D2/D3 tables, and structural branches.

Measurement checkpoint:

```text
doc/critical-positions-outcome-branching/checkpoints/2026-08-24-stage1-measurement-readiness-pass-remeasurement-pending.md
checkpoint commit = 9a8cfd23b4af430c1858a80ffa5e5d00e5dbc725
```

## No-rescue boundary

The following remain forbidden:

```text
source seed extension
root replacement
phase reassignment
replicate extension
continuation policy substitution
continuation cap change
D_range threshold retuning
primary evaluator/depth substitution
favorable subgroup rescue
manual candidate override
```

Stage 1 cannot confirm itself. Stage 2 cannot reuse Stage 1 support as confirmation evidence.

## Immutable inherited formal states

```text
Blunder / Misvaluation Patterns Study 1:
  0 CONFIRMED / 4 NOT-CONFIRMED / CLOSED

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
  first Mtaji under frozen engine = deterministic ply 44 for Mtaji-reaching trajectories
```

No inherited label may be changed by this study.

## Seed state

```text
Stage 0 scientific seed block = NONE
Stage 1 = 22600001..22603072 -> CONSUMED by frozen source generation
Stage 2 = 22700001..22706144 -> RESERVED / NOT AUTHORIZED / UNCONSUMED
```

Continuation RNG seeds are deterministic derivatives of stage salt + root identity + replicate index; they do not expand the source-game seed namespace.

## Current next gate

Run the mandatory independent full continuation remeasurement/recomputation:

```bash
node tools/experiments/verify-critical-positions-stage1-exploratory.js \
  --phase measurement \
  --output artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1
```

Expected compact output:

```text
measurement-verification.json
```

Required before discovery:

```text
fullContinuationRemeasurement = true
fullSecondaryRecomputation = true
fullStructuralRecomputation = true
passed = true
```

If independent measurement verification fails, stop. Do not repair by replacement, seed extension, replicate extension, policy substitution, threshold retuning, or subgroup rescue.

Only after measurement verification PASS may the frozen deterministic exploratory `discover` phase run. Stage 2 remains locked and unconsumed.
