# Critical Positions / Outcome Branching Study 1 — Stage 1 Exploratory Runbook

更新日: 2026-08-24  
Status: **STAGE 1 COMPLETE / ZERO PROMOTED CANDIDATES / DO NOT RERUN AS RESCUE**

Stage ID:

```text
CPOB-S1-EXPLORATORY-2026-08-23-v1
```

Frozen spec:

```text
doc/critical-positions-outcome-branching/preregistration/STAGE_1_EXPLORATORY_SPEC.json
SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
```

Source-bound authorization:

```text
doc/critical-positions-outcome-branching/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json
```

## 1. Final scientific boundary

This run is completed **Stage 1 exploratory** evidence only.

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

Final Stage 1 result:

```text
selected roots = 600
primary estimable roots = 600
high-divergence roots = 139 / 600
candidate audits = 1183
promoted candidates = 0
manual override = false
Stage 2 = NOT EXECUTED
```

Do not rerun or modify Stage 1 to obtain a positive candidate set.

## 2. Frozen population and measurement

Source corpus:

```text
games = 3072
seeds = 22600001..22603072 / CONSUMED
opening = 8-ply seeded-uniform exact E.moveVariants
post-opening generation = six frozen strata, 512 games each
max source-game ply = 100
```

Selected roots:

```text
600 roots total
300 Namua
300 Mtaji
no replacement / no phase reassignment
```

Primary continuation measurement:

```text
root moves = all exact E.moveVariants(root) / AI.moveKey variants
policy = P1_NORMAL_TOP3
replicates per exact root move = 64
max post-root continuation = 200 plies
unfinished = ADMINISTRATIVE_UNFINISHED, not draw
primary-estimable root = every exact root move has 64/64 terminal replicates
D_range = max(move win rate) - min(move win rate)
highDivergence = D_range >= 0.30
```

## 3. Completed execution sequence

```text
Phase A generate source corpus                    COMPLETE
Phase B independent full corpus replay            PASS
Phase C outcome-blind root selection              PASS
Phase D all-root-move measurement                 PASS
Phase E independent full remeasurement            PASS
Phase F deterministic exploratory discovery       COMPLETE
```

Relevant compact identities:

```text
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
discovery resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
```

## 4. Final discovery result

```text
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
zeroPromotedCandidatesAllowed = true
manualOverridePerformed = false
```

The disjoint single-token legal-move-count bins show:

```text
Namua high-divergence = 52 / 300
Mtaji high-divergence = 87 / 300
overall = 139 / 600
```

Thus high-divergence roots existed, but no candidate in the frozen one-to-two-token structural grammar passed all promotion gates.

## 5. No-rescue rule after closure

Do **not** run any of the following as a continuation of v1:

```text
additional Stage 1 source games
seed extension
replacement generation
root replacement
phase reassignment
replicate extension
continuation cap extension
policy substitution
D_range threshold change
candidate grammar expansion
candidate token/bin edit
support threshold reduction
high-divergence-rate floor reduction
median-D_range floor reduction
near-miss promotion
manual override
```

A genuine implementation defect discovered later must be documented separately; it does not authorize silent repair of the completed scientific version.

## 6. Stage 2 boundary

Stage 2 reserved namespace:

```text
22700001..22706144
```

Final state:

```text
reserved = true
authorized = false
consumed = false
executed = false
```

Stage 2 required an exact promoted Stage 1 candidate mapping before any formal generation. Because Stage 1 produced zero promoted candidates, no formal target exists within this Study.

Do not select a near miss to populate Stage 2. Any richer representation or alternate classifier is a **new prospective independent study** requiring a new design, fresh evidence, fresh seed audit and separate authorization.

## 7. Closure documents

Read in this order for final state:

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
3. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
4. [`results/STAGE_1_EXPLORATORY_SUMMARY.json`](results/STAGE_1_EXPLORATORY_SUMMARY.json)
5. [`checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md`](checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md)

Large generated outputs remain under `artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1/`.
