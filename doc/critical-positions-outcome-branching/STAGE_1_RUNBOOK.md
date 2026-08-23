# Critical Positions / Outcome Branching Study 1 — Stage 1 Exploratory Runbook

更新日: 2026-08-23  
Status: **SOURCE GENERATION COMPLETE / CORPUS VERIFICATION NEXT / EXPLORATORY ONLY**

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
authorization commit = a85f9b36abbf492cd8085b0a95c8d10b76f849e8
```

Large/generated outputs remain under `artifacts/local/` and are not committed unless a separate archival decision is made.

## 1. Scientific boundary

This run is fresh **Stage 1 exploratory** evidence only.

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

The following remain forbidden:

- confirmation claims from Stage 1 itself;
- game-theoretic criticality claims;
- treating empirical continuation win rates as validated game-theoretic probabilities;
- human/expert turning-point claims;
- rescue or relabeling of any completed study.

## 2. Frozen population and measurement

Source corpus:

```text
games = 3072
seeds = 22600001..22603072
opening = 8-ply seeded-uniform exact E.moveVariants
post-opening generation = six frozen strata, 512 games each
max source-game ply = 100
```

Selected roots, if selection readiness passes:

```text
600 roots total
300 Namua
300 Mtaji
one selected root per unique historical trajectory before quota
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

## 3. No-rescue rule

Once scientific generation starts, do **not** change within v1:

```text
seed block
number of games
selected-root quotas
continuation policy
replicate count
continuation cap
root estimability rule
D_range threshold
candidate grammar or bins
support/diversity thresholds
candidate ranking/caps
phase assignment
endpoint
```

If a readiness gate fails, record the failure and stop the affected downstream inference. Do not add seeds, replace roots, increase replicates, relax thresholds, or search for a favorable subgroup.

A genuine implementation defect requires stopping and documenting a new prospective version; never silently patch v1 after outcome inspection.

## 4. Environment / repository preflight

Use a clean checkout of the study branch:

```bash
git switch research/critical-positions-outcome-branching
git pull --ff-only
git status --short
node --version
```

Required source identity remains the authorization-bound scientific source set. Documentation-only branch commits after source generation do not change the already generated local corpus.

Validate frozen contracts and authorization when reproducing from scratch:

```bash
node tools/experiments/validate-critical-positions-stage1-spec.js
node test/critical-positions-stage1-contract.test.js
node test/critical-positions-stage1-tooling.test.js
```

## 5. Phase A — fixed source corpus — COMPLETE

The frozen source corpus was generated exactly over:

```text
3072 games
seeds 22600001..22603072
```

Generated manifest identity:

```text
sourceCommit = 157a4947435213b430ae7a9a85cc861aebfc258e
sourceTreeDirty = false
summaryHash = 1a56b7afb8c6c295f827c0546a87e9c2b0788914bffd1587b47f0d778bf73d63
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
```

All six generation strata contain exactly 512 games.

Do **not** rerun generation as replacement sampling. The Stage 1 seed block is consumed.

Generation checkpoint:

```text
doc/critical-positions-outcome-branching/checkpoints/2026-08-23-stage1-source-corpus-generated-verification-pending.md
```

## 6. Phase B — independent full corpus replay verification — NEXT

Run against the existing local artifact root:

```bash
node tools/experiments/verify-critical-positions-stage1-exploratory.js \
  --phase corpus \
  --output artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1
```

This independently replays all 3072 source games, including opening RNG, post-opening generator moves, state identities, trajectory hashes and opening-prefix identities.

Required result:

```text
passed = true
fullCorpusReplay = true
gamesVerified = 3072
```

Expected output:

```text
verification.json
```

If corpus verification fails, **stop**. Root selection is forbidden until it passes. Do not selectively regenerate problematic games.

## 7. Phase C — outcome-blind root selection

Only after independent corpus verification PASS:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase select
```

Selection uses only frozen pre-outcome information and hashes:

```text
collapse duplicate historicalTrajectoryHash groups
→ assign each unique trajectory to Namua/Mtaji by frozen hash parity
→ choose one eligible root within assigned phase by frozen SHA-256 rank
→ collapse duplicate selected ruleStateKey
→ apply frozen 300/300 phase quotas by frozen quota rank
```

It does **not** use game winner, continuation outcome, D_range, D2/D3 score, candidate matcher or post-move consequence.

After selection, inspect `selection-audit.json` only for preregistered readiness gates. If readiness fails, do not replace states or extend the source corpus.

## 8. Phase D — all-root-move measurement

Only after selection readiness PASS:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase measure
```

For each selected root this computes all exact legal root interventions, 64 P1 continuations per exact root move, D2/D3 secondary search axes, and structural/reply-envelope summaries.

Inspect only the preregistered measurement-readiness gates before independent remeasurement. Do not extend replicates or replace non-estimable roots.

## 9. Phase E — independent full continuation remeasurement

After measurement:

```bash
node tools/experiments/verify-critical-positions-stage1-exploratory.js \
  --phase measurement \
  --output artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1
```

Required scientific verification is full remeasurement, not spot checking. It must reproduce continuation outcomes/hashes and recompute the frozen secondary/structural axes.

Discovery is blocked until this verification passes.

## 10. Phase F — deterministic exploratory discovery

Only after measurement verification PASS:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase discover
```

Discovery applies the already frozen structural candidate grammar, opportunity/high-divergence support thresholds, opening/stratum diversity gates, support-equivalence rule, ranking and caps.

Zero promoted candidates is a valid result. Do not manually promote or redefine candidates.

## 11. Stage boundary

Stage 1 remains exploratory regardless of its result.

After compact Stage 1 artifacts are reviewed, only then may a **separate prospective Stage 2 design** be drafted using fresh evidence and the reserved `227...` namespace. This runbook does not authorize Stage 2.
