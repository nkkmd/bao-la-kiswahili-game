# CURRENT_STATUS — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23

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

The verified current `main` had advanced beyond `2c452186...`; the study branch was created from the actual verified `576783b1...` HEAD.

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
Stage 1 scientific source generation = COMPLETE
Stage 1 scientific source games generated = 3072 / 3072
Stage 1 scientific source seeds consumed = 22600001..22603072 / COMPLETE
Stage 1 independent full corpus replay verification = PENDING
Stage 1 outcome-blind root selection = BLOCKED pending corpus verification PASS
Stage 1 scientific continuation measurement = NOT STARTED
Stage 1 scientific continuation outcomes inspected = false
Stage 2 scientific generation = NOT AUTHORIZED / NOT STARTED
```

Authorization permits only the frozen Stage 1 exploratory pipeline. It does **not** authorize confirmatory inference, Stage 2 generation, game-theoretic criticality claims, validated win-probability claims, or human/expert criticality claims.

## Stage 1 generated source corpus

Generated manifest identity:

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
authorization SHA-256 = 34ae3f2afb066521f2165f6e16d5edd720ab9587b71c64dce677696ad23cd941
generatedAt = 2026-08-23T11:15:15.447Z
sourceCommit = 157a4947435213b430ae7a9a85cc861aebfc258e
sourceTreeDirty = false
summaryHash = 1a56b7afb8c6c295f827c0546a87e9c2b0788914bffd1587b47f0d778bf73d63
```

Frozen population realized exactly:

```text
games = 3072
seedStart = 22600001
seedEnd = 22603072
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

Generation-level preregistered identity/diversity gates:

```text
unique historical trajectories: 2726 >= 2500 -> PASS
generated distinct opening prefixes: 2226 >= 1800 -> PASS
```

These are not selection-readiness results. Duplicate trajectories are collapsed by the frozen selection procedure without replacement. Root selection remains blocked until independent full corpus replay verification passes.

The manifest's scientific source-file SHA-256 mapping matches the authorization-bound mapping.

Generation checkpoint:

```text
doc/critical-positions-outcome-branching/checkpoints/2026-08-23-stage1-source-corpus-generated-verification-pending.md
commit = cd7b367c90df7d628b48471d7d63d863313e6057
```

## Primary construct and frozen measurement

Primary construct:

```text
fixed-policy empirical continuation divergence
```

For every selected nonterminal root with at least two exact legal `E.moveVariants(root)` moves:

```text
root actor = state.player
root move interventions = every exact AI.moveKey variant
post-root continuation policy = P1_NORMAL_TOP3
replicates per exact root move = 64
maximum post-root continuation plies = 200
replicate pairing = common derived seed across all root moves at replicate index r
administrative cap = ADMINISTRATIVE_UNFINISHED, never draw/0.5
primary root estimability = every exact root move terminates in all 64 replicates
```

For an estimable root:

```text
p_hat_m = root-actor wins / 64 for exact legal move m
D_range = max_m(p_hat_m) - min_m(p_hat_m)
Stage 1 high-divergence root = D_range >= 0.30
```

`p_hat_m` is a fixed-policy empirical continuation quantity. It is not a game-theoretic probability and is not derived from the inconclusive Calibration Study isotonic mapping.

## Stage 1 pre-generation firewall and authorization

Frozen Stage 1 specification:

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
source games = 3072
source seeds = 22600001..22603072
selected roots if readiness passes = 600 = 300 Namua + 300 Mtaji
```

Final source-changing scientific implementation commit before authorization:

```text
3995932ae73e9e99a27d4143de4e359db1136060
```

Validation evidence:

```text
Stage 1 contract validation:
  run = 32625783543
  conclusion = success

Stage 1 production tooling validation:
  run = 32625783544
  job = 97160810538
  conclusion = success

Stage 0 regression validation:
  run = 32625783553
  conclusion = success
```

Pre-generation firewall checkpoint:

```text
53dcfd971c9408327d2d9830486523322ec41a22
```

Separate source-bound authorization commit:

```text
a85f9b36abbf492cd8085b0a95c8d10b76f849e8
```

Authorization semantics:

```text
stage1GenerationAuthorized = true
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

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

No label above may be changed by this study.

## Seed state

```text
Stage 0 scientific seed block = NONE
Stage 1 = 22600001..22603072 -> CONSUMED by frozen source generation
Stage 2 = 22700001..22706144 -> RESERVED / NOT AUTHORIZED / UNCONSUMED
```

Continuation RNG seeds are deterministically derived from stage salt + root identity + replicate index and do not expand the source-game seed namespace.

## Current next gate

Independent full replay verification of all 3072 source games is mandatory before selection:

```bash
node tools/experiments/verify-critical-positions-stage1-exploratory.js \
  --phase corpus \
  --output artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1
```

Required:

```text
passed = true
fullCorpusReplay = true
gamesVerified = 3072
```

If verification fails, stop. Do not regenerate selective games, extend seeds, or perform root selection.

Stage 2 remains locked until Stage 1 is independently verified and completed as exploratory evidence, candidate definitions are separately frozen, Stage 2 formal rules are preregistered, source-bound Stage 2 authorization exists, and fresh evidence is guaranteed.
