# Critical Positions / Outcome Branching Study 1 — Stage 1 Exploratory Runbook

更新日: 2026-08-23  
Status: **AUTHORIZED / READY FOR LOCAL OR COLAB EXECUTION / EXPLORATORY ONLY**

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

Required before generation:

```text
branch = research/critical-positions-outcome-branching
tracked scientific source files = exact hashes bound by authorization
working tree for frozen scientific sources = clean
Stage 1 authorization = valid
Stage 2 authorization = false
```

Validate the frozen contracts and authorization without generating scientific data:

```bash
node tools/experiments/validate-critical-positions-stage1-spec.js
node test/critical-positions-stage1-contract.test.js
node test/critical-positions-stage1-tooling.test.js
```

Check current artifact state:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase status
```

Before first generation, expected scientific state is:

```text
generatedGames = 0
expectedGames = 3072
hasManifest = false
hasCorpusVerification = false
hasSelectionAudit = false
measurementFiles = 0
hasMeasurementVerification = false
hasDiscoveryResult = false
```

## 5. Phase A — generate fixed source corpus

Run:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase generate
```

Expected output root:

```text
artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1/
```

Key outputs:

```text
games/game-0000.json ... game-3071.json
manifest.json
```

Generation is resumable: an already materialized game is reused only when the frozen spec identity matches. Do not use result-dependent stopping.

After generation:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase status
```

Required before verification:

```text
generatedGames = 3072
hasManifest = true
```

## 6. Phase B — independent full corpus replay verification

Run:

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

If corpus verification fails, **stop**. Root selection is forbidden until it passes. Do not regenerate only unfavorable or problematic games as replacements.

## 7. Phase C — outcome-blind root selection

Only after independent corpus verification PASS:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase select
```

Selection uses only the frozen pre-outcome information and hashes:

```text
collapse duplicate historicalTrajectoryHash groups
→ assign unique trajectory to Namua/Mtaji by frozen hash parity
→ choose one eligible root within assigned phase by frozen SHA-256 rank
→ collapse duplicate selected ruleStateKey
→ apply frozen 300/300 phase quotas by frozen quota rank
```

It does **not** use game winner, continuation outcome, D_range, D2/D3 score, candidate matcher or post-move consequence.

Outputs:

```text
selection-audit.json
selected-roots.json
```

Inspect:

```bash
python3 - <<'PY'
import json
p='artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1/selection-audit.json'
x=json.load(open(p))
print(json.dumps(x, indent=2))
PY
```

Required selection readiness includes:

```text
unique historical trajectories >= 2500
generated distinct opening prefixes >= 1800
selected unique rule states = 600
Namua selected roots = 300
Mtaji selected roots = 300
selected distinct opening prefixes >= 450
each generation stratum selected >= 50
maximum single selected stratum share <= 0.30
```

If `readiness.passed != true`, Stage 1 v1 is **selection-non-estimable / insufficient for the frozen downstream design**. Stop without extension, replacement, phase reassignment or quota relaxation.

## 8. Phase D — all-move continuation and secondary measurement

Only after selection readiness PASS:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase measure
```

For every selected root this computes:

- every exact legal root-move intervention;
- 64 paired-seed P1 continuations per exact root move;
- terminal outcome / administrative unfinished status;
- compact per-replicate record plus hash of the complete continuation record;
- root `D_range` and estimability;
- exact D2/D3 search tables as secondary machine axes;
- immediate structural branch transition;
- exhaustive one-ply opponent response envelope.

Outputs:

```text
measurements/selected-*.json
measurement-audit.json
```

The compact replicate record does not weaken verification: the independent verifier reruns the full continuation and must reproduce the stored complete-record hash.

Inspect:

```bash
python3 - <<'PY'
import json
p='artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1/measurement-audit.json'
x=json.load(open(p))
print(json.dumps(x, indent=2))
PY
```

Frozen measurement readiness includes:

```text
measured exact-root-move interventions >= 1800
primary-estimable roots >= 450
primary-estimable Namua roots >= 180
primary-estimable Mtaji roots >= 180
all selected roots have finite D2/D3 candidate tables
```

Do not replace a primary-non-estimable root and do not add continuation replicates.

## 9. Phase E — independent full continuation remeasurement

Run after the complete fixed measurement, even if a readiness gate appears unfavorable, so the stored Stage 1 measurement state itself is independently audited:

```bash
node tools/experiments/verify-critical-positions-stage1-exploratory.js \
  --phase measurement \
  --output artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1
```

The verifier independently:

- reconstructs and reselects all 600 roots from the verified corpus;
- derives replicate seeds independently;
- reruns every exact-root-move continuation;
- reproduces terminal outcome, final rule-state identity, continuation length and complete-record hash;
- recomputes D2/D3 exact search tables;
- recomputes structural transitions and response envelopes;
- recomputes measurement readiness.

Expected output:

```text
measurement-verification.json
```

Required to unlock discovery:

```text
passed = true
fullContinuationRemeasurement = true
fullSecondaryRecomputation = true
fullStructuralRecomputation = true
```

If `passed != true`, deterministic discovery is blocked. A readiness failure is a valid Stage 1 outcome and must not be rescued.

## 10. Phase F — deterministic exploratory discovery

Only after independent measurement verification PASS:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase discover
```

This applies only the prospectively frozen root-structural candidate grammar and promotion gates. No manual candidate insertion or promotion is allowed.

Output:

```text
discovery-result.json
```

Valid outcomes include:

```text
0 promoted candidates
1..6 promoted candidates
non-estimable / insufficient Stage 1 readiness
```

A promoted Stage 1 candidate is **exploratory**, not confirmed.

## 11. Compact artifacts to preserve for review

Preserve at minimum:

```text
manifest.json
verification.json
selection-audit.json
selected-roots.json
measurement-audit.json
measurement-verification.json
discovery-result.json
```

The full `games/` and `measurements/` trees remain local unless an explicit archival policy is adopted.

## 12. Stage boundary after Stage 1

After Stage 1 completes and the compact artifacts are independently reviewed:

1. permanently record the Stage 1 seed/root identities as consumed;
2. freeze any promoted candidate definitions exactly as discovered;
3. construct the Stage 1/Stage 2 identity firewall on `historicalTrajectoryHash`, `openingPrefixHash`, and `ruleStateKey`;
4. preregister fresh Stage 2 formal endpoints, estimability, sample size/test, alpha and multiplicity;
5. bind Stage 2 to fresh source hashes;
6. issue a separate Stage 2 authorization only after all gates pass.

Until that separate authorization exists:

```text
Stage 2 generation = LOCKED
formal confirmation = NOT AUTHORIZED
```
