# Position Complexity Study 1 — Stage 1 Exploratory Runbook

更新日: 2026-08-12  
Status: **READY FOR LOCAL EXECUTION / EXPLORATORY ONLY**

Stage ID:

```text
PCX-S1-EXPLORATORY-2026-08-12-v1
```

Frozen spec:

```text
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
```

Large/generated outputs stay under `artifacts/local/` and are not committed.

## 1. Preconditions

Before execution:

```bash
git switch research/position-complexity-difficulty
git pull --ff-only
git status --short
```

Required:

```text
branch = research/position-complexity-difficulty
tracked study source tree = clean
Stage 0 technical validation = PASS
Stage 2 formal corpus = still unauthorized
```

Do not edit the frozen Stage 1 spec after generation begins. If a genuine implementation defect is found, stop, document it, and define a new prospective exploratory version rather than silently changing v1.

## 2. Environment

The technical CI is validated on Node 24. The exploratory runner itself has no third-party Node dependency.

Recommended:

```bash
node --version
python3 --version
```

The Python analyzer uses only the standard library.

## 3. Check current local state

```bash
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase status
```

Initial expected state:

```text
generatedGameFiles = 0
expectedGames = 768
hasManifest = false
hasSelectionAudit = false
hasSelectedStates = false
measurementFiles = 0
hasMeasurementManifest = false
```

The runner is resumable. Existing files are reused only when their frozen spec identity matches.

## 4. Phase A — generate the fixed exploratory corpus

Run locally:

```bash
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase generate
```

Frozen corpus:

```text
768 games
seeds 20400001..20400768
8-ply seeded-uniform opening using moveVariants
then hard / bao / phase2 / depth2
max ply 100
timeLimitMs = Infinity
```

Do not stop because results look favorable/unfavorable. Generation ends only after the fixed 768 games complete or a technical error stops execution.

Expected key output:

```text
artifacts/local/position-complexity/stage1-exploratory-v1/manifest.json
artifacts/local/position-complexity/stage1-exploratory-v1/games/
```

Check:

```bash
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase status
```

Expected:

```text
generatedGameFiles = 768
hasManifest = true
```

## 5. Phase B — independent full verification

Run:

```bash
node tools/experiments/verify-position-complexity-stage1-exploratory.js
```

Default verification recomputes the post-opening depth-2 AI search for every stored trajectory move in addition to replay/state-feature/hash verification.

Do **not** use `--no-search-recompute` for the scientific Stage 1 verification record.

Required result:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 768
```

Expected output:

```text
artifacts/local/position-complexity/stage1-exploratory-v1/verification.json
```

If verification fails, do not continue to selection or measurement until the cause is resolved prospectively.

## 6. Phase C — deterministic trajectory/state selection

Only after full verification PASS:

```bash
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase select
```

This performs:

```text
collapse duplicate historicalTrajectoryHash groups
-> hash-parity assign each unique trajectory to Namua or Mtaji
-> require nonterminal ply >= 8 and moveVariants legalMoveCount >= 2
-> choose one state by frozen SHA-256 rank within assigned phase
-> no replacement when assigned phase is unavailable
-> collapse duplicate selected ruleStateKey states
```

Expected outputs:

```text
selection-audit.json
selected-states.json
```

Do not inspect search-instability outcomes before this selection is fixed; the selection procedure itself uses none of those outcomes.

## 7. Phase D — fixed D1–D4 measurement

Run:

```bash
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase measure
```

For every selected unique rule state this records:

```text
exact root candidate table at D1/D2/D3/D4
TopSet and best-second gap
adjacent-depth TopSet transitions
engine nodes / quiescence nodes / cutoffs / evaluations
structural actor/opponent features
```

The runner checks at every depth that:

```text
exact diagnostic bestScore == normal engine rootScore
normal engine chosen move belongs to exact TopSet
```

Expected outputs:

```text
measurements/selected-*.json
measurement-manifest.json
```

Measurement is resumable. `--force` is not needed in normal execution.

## 8. Phase E — exploratory design audit

After measurement completes:

```bash
python3 tools/experiments/analyze-position-complexity-stage1-exploratory.py
```

Expected outputs:

```text
stage1-exploratory-audit.json
stage1-selected-measurements.csv
```

The audit reports:

- selected-state and phase coverage;
- D1→D2 / D2→D3 / D3→D4 instability prevalence;
- D2 exact tie prevalence;
- mate/ordinary score-domain frequencies;
- ordinary-domain D2 best-second gap distribution;
- node distributions;
- descriptive correlations without confirmatory p-values;
- preregistered readiness gates.

It does **not** authorize a formal decision or Stage 2 by itself.

## 9. Readiness gates

All must pass before a separate Stage 2 design may be frozen:

```text
selected unique rule states >= 300
Namua selected states >= 120
Mtaji selected states >= 120
D2->D3 instability events >= 30
D2->D3 stable events >= 30
ordinary-domain D2 margins >= 200
```

If a gate fails:

```text
Stage 1 v1 = complete / insufficient for current Stage 2 design freeze
```

Do not add seeds or relax the gate inside v1.

## 10. Files to preserve for review

The compact files needed for the next research decision are:

```text
manifest.json
verification.json
selection-audit.json
measurement-manifest.json
stage1-exploratory-audit.json
stage1-selected-measurements.csv
```

The individual `games/` and `measurements/` files remain local unless a separate archival policy is defined.

## 11. Stage boundary after execution

After the six compact artifacts above are independently reviewed:

- mark Stage 1 seeds/states permanently consumed;
- decide which predeclared metric becomes Stage 2 primary/key-secondary;
- freeze sample size, fresh seed range, statistical model/test, alpha, multiplicity and estimability gates;
- only then authorize Stage 2 formal generation.

No Stage 1 p-value or descriptive association becomes a formal result.
