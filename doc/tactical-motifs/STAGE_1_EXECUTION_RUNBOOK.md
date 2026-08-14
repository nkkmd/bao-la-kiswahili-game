# Stage 1 Exploratory Execution Runbook — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## Purpose

Execute the already frozen and authorized Stage 1 exploratory pipeline for
`TM-S1-EXPLORATORY-2026-08-14-v1` in a stable local/Colab runtime.

This runbook does **not** modify the Stage 1 scientific contract. It does not authorize Stage 2,
confirmatory inference, or any `confirmed tesuji` claim.

## Frozen scientific identity

- Study branch: `research/tactical-motif-discovery`
- Spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- Validated implementation commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`
- Authorization file: `doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`
- Games: 768
- Seeds: `21900001–21900768`
- Output root: `artifacts/local/tactical-motifs/stage1-exploratory-v1`

A later docs-only branch commit is permitted only if the authorization source-hash binding still
passes. The source hashes, not a later documentation-only HEAD, are the scientific implementation
identity.

## Non-negotiable execution rules

1. Use the existing frozen seed block only.
2. Do not extend, replace, resample, or phase-reassign any game.
3. Do not change thresholds, candidate grammar, search depths, evaluator, opening policy, or
   readiness gates.
4. Do not use `--force` during ordinary execution or resume.
5. Do not use verifier option `--no-search-recompute` for the scientific verification.
6. If generation or measurement is interrupted, rerun the **same command**. Per-game/per-state
   atomic artifacts are designed for deterministic resume.
7. If verification or a readiness gate fails, stop. Do not rescue by altering the protocol.
8. Keep the large corpus under `artifacts/local/`; do not commit it and do not generate it in
   GitHub Actions.

## 1. Stable checkout

```bash
git fetch origin
git switch research/tactical-motif-discovery
git pull --ff-only

git rev-parse HEAD
git status --porcelain
node --version
```

The working tree must be clean before scientific generation. Node 22 is the validation runtime;
record the exact runtime version used for scientific execution.

## 2. Preflight — spec and authorization binding

```bash
node tools/experiments/validate-tactical-motif-stage1-spec.js

node - <<'NODE'
const C = require('./tools/experiments/lib/tactical-motif-stage1-corpus.js');
const { spec, specSha256 } = C.loadSpec();
const auth = C.loadAuthorization(specSha256);
console.log(JSON.stringify({
  stageId: spec.stageId,
  specSha256,
  games: spec.population.games,
  seedStart: spec.population.seedStart,
  seedEnd: spec.population.seedEnd,
  authorizationSha256: auth.authorizationSha256,
  sourceFileSha256: C.sourceFileSha256(),
}, null, 2));
NODE

node tools/experiments/run-tactical-motif-stage1-exploratory.js --phase status
```

Do not proceed unless the validator passes and `loadAuthorization()` returns successfully.

## 3. Generate the fixed 768-game corpus

```bash
node tools/experiments/run-tactical-motif-stage1-exploratory.js \
  --phase generate \
  2>&1 | tee /tmp/tm-stage1-generate.log
```

If interrupted, rerun exactly the same command without `--force`.

Expected retained artifact after completion:

- `artifacts/local/tactical-motifs/stage1-exploratory-v1/manifest.json`
- 768 atomic files under `.../games/`

Do not inspect or select candidate motifs before full verification.

## 4. Independent full replay/search verification

```bash
node tools/experiments/verify-tactical-motif-stage1-exploratory.js \
  2>&1 | tee /tmp/tm-stage1-verify.log
```

The scientific verification must have:

- `passed: true`
- `fullSearchRecomputation: true`
- `gamesVerified: 768`

If any check fails, stop and preserve the artifacts for technical audit. Do not proceed to
selection.

## 5. Select outcome-independent root states

Only after verification passes:

```bash
node tools/experiments/run-tactical-motif-stage1-exploratory.js \
  --phase select \
  2>&1 | tee /tmp/tm-stage1-select.log
```

Inspect `selection-audit.json` without changing any gate:

```bash
node - <<'NODE'
const a = require('./artifacts/local/tactical-motifs/stage1-exploratory-v1/selection-audit.json');
console.log(JSON.stringify({
  passed: a.passed,
  uniqueHistoricalTrajectories: a.uniqueHistoricalTrajectories,
  selectedUniqueRuleStates: a.selectedUniqueRuleStates,
  selectedPhaseCounts: a.selectedPhaseCounts,
  selectedConditionCounts: a.selectedConditionCounts,
  distinctOpeningPrefixes: a.distinctOpeningPrefixes,
  gates: a.gates,
  replacementPerformed: a.replacementPerformed,
  selectionHash: a.selectionHash,
}, null, 2));
NODE
```

If `passed !== true`, Stage 1 stops at readiness failure. No threshold relaxation or replacement is
permitted.

## 6. Measure all legal moveVariants

Only if selection readiness passes:

```bash
node tools/experiments/run-tactical-motif-stage1-exploratory.js \
  --phase measure \
  2>&1 | tee /tmp/tm-stage1-measure.log
```

If interrupted, rerun exactly the same command without `--force`.

Before discovery, require `measurement-manifest.json` with
`measurementReadinessPassed: true`.

## 7. Exploratory candidate discovery

Only if measurement readiness passes:

```bash
node tools/experiments/run-tactical-motif-stage1-exploratory.js \
  --phase discover \
  2>&1 | tee /tmp/tm-stage1-discover.log
```

Any promoted entry is only a **Stage 2 planning candidate**. It is not a confirmed tesuji.

## 8. Handoff artifacts

Do not upload the large game/measurement corpus unless a forensic audit specifically requires it.
For normal review, provide the small aggregate artifacts that exist at the stopping point:

- `manifest.json`
- `verification.json`
- `selection-audit.json`
- `measurement-manifest.json` (if measurement ran)
- `discovery-result.json` (if discovery ran)

Create a checksum file:

```bash
OUT=artifacts/local/tactical-motifs/stage1-exploratory-v1
find "$OUT" -maxdepth 1 -type f \
  \( -name 'manifest.json' \
  -o -name 'verification.json' \
  -o -name 'selection-audit.json' \
  -o -name 'measurement-manifest.json' \
  -o -name 'discovery-result.json' \) \
  -print0 | sort -z | xargs -0 sha256sum > "$OUT/handoff-sha256.txt"
cat "$OUT/handoff-sha256.txt"
```

Upload the aggregate JSON files plus `handoff-sha256.txt` for research-state review.

## Interpretation firewall

Stage 1 may end with zero promoted candidates. That is a valid exploratory result. No Stage 1
result, including a strongly recurring/high-value motif, authorizes a `confirmed tesuji` claim.
Stage 2 requires a separately frozen candidate definition, formal preregistration, fresh
non-overlapping seeds, and explicit Stage 2 generation authorization.
