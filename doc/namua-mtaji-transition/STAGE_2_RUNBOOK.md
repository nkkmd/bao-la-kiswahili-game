# Namua→Mtaji Strategic Temporal Transition — Stage 2 Formal Runbook

更新日: 2026-08-11  
Status: **FROZEN / DO NOT DEVIATE**

Canonical protocol:

```text
doc/namua-mtaji-transition/STAGE_2_FORMAL_PROTOCOL.md
doc/namua-mtaji-transition/preregistration/STAGE_2_FORMAL_SPEC.json
```

## 0. Non-negotiable boundary

Stage 2 is one-shot formal held-out evidence.

Do not:

- reuse any Stage 1 games;
- change seeds, game count, condition, depth, evaluator, or opening policy;
- inspect M1/M2 before preoutcome matching is frozen and independently unlocked;
- append games after seeing CBE count or morphology outcomes;
- relax G1/G2;
- replace R3-M;
- rerun with a favorable seed block.

The file below must **not exist** before the preoutcome review:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

`--phase evaluate` is machine-blocked until that file is created after review with exact matching/config/file hashes.

## 1. Update local branch

```bash
git fetch origin
git switch research/namua-mtaji-temporal-transition
git pull --ff-only

git rev-parse HEAD
git status --short
```

The worktree must be clean before formal generation.

Confirm the unlock is absent:

```bash
test ! -e doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

If this command fails, stop and inspect why an outcome unlock already exists.

## 2. Dependency check

```bash
python3 -c 'import numpy, pandas; print("numpy", numpy.__version__, "pandas", pandas.__version__)'
```

The frozen Mtaji artifact must already exist at the historical local path:

```text
artifacts/local/position-typology/stage1-pilot-v1/
  mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

Do not regenerate or refit it.

A hash-only precheck is allowed:

```bash
python3 tools/experiments/audit-namua-mtaji-mtaji-artifact.py \
  --no-smoke-classification \
  --output /tmp/nmt-stage2-mtaji-artifact-precheck.json
```

Expected hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

## 3. Static checks

```bash
node --check tools/experiments/run-namua-mtaji-stage2-formal.js
node --check tools/experiments/verify-namua-mtaji-stage2-formal.js
node --check tools/experiments/audit-namua-mtaji-stage2-clock.js
node --check tools/experiments/analyze-namua-mtaji-stage2-events.js

python3 -m py_compile tools/experiments/extract-namua-mtaji-stage2-candidates.py
python3 -m py_compile tools/experiments/analyze-namua-mtaji-stage2-formal.py
```

If any check fails, stop. Do not generate formal games.

## 4. Regression checks

```bash
node test/namua-mtaji-transition-features.test.js
node test/namua-mtaji-transition-engine.test.js
node test/position-typology-features.test.js
node test/symmetry-transform.test.js
node test/transition-symmetry.test.js
node test/evaluation-symmetry.test.js
```

All must pass.

## 5. Generate the fixed formal corpus

Frozen corpus:

```text
P2-D2 only
4096 games
seeds 20280001..20284096
opening plies 8
max ply 100
```

Run:

```bash
node tools/experiments/run-namua-mtaji-stage2-formal.js
```

The runner is resumable. To inspect progress:

```bash
node tools/experiments/run-namua-mtaji-stage2-formal.js --status
```

Resume by running the normal command again.

Do not use `--force` after formal generation has begun unless the corpus is being discarded before any scientific output is inspected and the reason is documented as a technical failure. Never use `--force` to seek a different result.

## 6. Full formal verification

```bash
node tools/experiments/verify-namua-mtaji-stage2-formal.js
```

Expected:

```text
passed = true
games = 4096
opening seeds unique and exact range
condition = P2-D2 only
sourceHashesMatch = true
all replay/provenance checks = passed
```

If verification fails, stop.

## 7. Deterministic Namua clock audit

```bash
node tools/experiments/audit-namua-mtaji-stage2-clock.js
```

Expected:

```text
passed = true
progression violations = 0
all reached-Mtaji firstMtajiPly = 44
```

If this fails, stop.

## 8. Inherited Category-A preprocessing

```bash
python3 tools/experiments/extract-namua-mtaji-stage2-candidates.py
```

This must use the unchanged historical Category-A functions and thresholds.

Do not inspect morphology labels.

## 9. Frozen CBE event classification

```bash
node tools/experiments/analyze-namua-mtaji-stage2-events.js
```

This creates:

```text
stage2-event-table.csv
stage2-event-audit.json
```

No M1/M2 labels are read in this step.

## 10. Freeze R3-M matched sets — PREOUTCOME ONLY

Run:

```bash
python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase match
```

This creates:

```text
stage2-matching-audit.json
stage2-matched-sets-preoutcome.csv
```

The matching phase:

- deduplicates complete historical trajectories;
- requires duplicate complete trajectories to have identical temporal outcomes;
- selects earliest fully ascertained CBE per trajectory;
- excludes from controls every trajectory with any Namua row classified CBE;
- restricts the primary population to first-Mtaji morphology-eligible trajectories without reading M1/M2;
- applies exact-ply R3-M;
- selects 20 globally non-reused controls per exposure by frozen SHA-256 ranking;
- writes `matchingAssignmentHash` and all relevant file/config hashes;
- evaluates G1/G2;
- does **not** load the Mtaji classifier.

## 11. HARD STOP — upload preoutcome artifacts

**Do not run `--phase evaluate`.** It will refuse to evaluate because no valid outcome-unlock file exists yet.

Return these files for formal preoutcome review:

```text
manifest.json
verification.json
clock-audit.json
candidate-pipeline-audit.json
stage2-event-audit.json
stage2-event-table.csv
stage2-matching-audit.json
stage2-matched-sets-preoutcome.csv
```

The review checks:

```text
G1 morphology-eligible unique CBE trajectories >= 20
G2 every exposure has exactly 20 unique R3-M controls
progression violations = 0
matching assignment hash present
preoutcome CSV hash present
formal config/spec/event hashes bound
no M1/M2 labels read
frozen Mtaji classifier not loaded by matching
```

If either G1 or G2 fails, formal decision is the frozen inconclusive status and no morphology evaluation is authorized.

If both pass, the exact observed hashes are committed in:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

The user then pulls that commit. The unlock is not guessed or created in advance.

## 12. Outcome phase — only after preoutcome review and unlock

The commands below are frozen now but must not be run before the hard stop is cleared and the exact unlock file has been pulled.

First re-audit the frozen classifier without classifying the formal corpus:

```bash
python3 tools/experiments/audit-namua-mtaji-mtaji-artifact.py \
  --no-smoke-classification \
  --output artifacts/local/namua-mtaji-transition/stage2-formal-v1/mtaji-artifact-audit.json
```

Then evaluate the already-frozen assignment:

```bash
python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase evaluate
```

`--phase evaluate` recomputes the preoutcome assignment and verifies:

```text
matchingAssignmentHash
preoutcomeAssignmentCsvSha256
formalSpecSha256
eventTableSha256
inputConfigHash
formalSourceCommit
```

against both the local preoutcome audit and the independently committed unlock **before loading the Mtaji classifier**.

Outputs include:

```text
stage2-matched-sets-with-morphology.csv
stage2-formal-result.json
```

The single primary test and decision rule are exactly those frozen in `STAGE_2_FORMAL_PROTOCOL.md`.
