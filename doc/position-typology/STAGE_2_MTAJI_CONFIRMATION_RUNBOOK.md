# Stage 2 Mtaji Independent Confirmation — Local Runbook

更新日: 2026-08-10

This runbook executes the preregistered formal confirmation defined in:

```text
doc/position-typology/STAGE_2_MTAJI_CONFIRMATION_PREREGISTRATION.md
doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json
```

Preregistration ID:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
```

Required frozen candidate definition hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

## Boundary

This is a **formal held-out run**.

Do not:

- change seeds,
- change game count,
- change conditions,
- change opening policy,
- change maximum ply,
- refit the discovery classifier,
- inspect partial result metrics and then change the protocol,
- search alternative k,
- run this formal corpus through GitHub Actions.

If a technical failure occurs, preserve logs and stop before interpreting metrics.

## 1. Activate the existing research environment

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

Required Python packages are the packages already used by the Stage 1 audits:

- numpy
- scipy
- scikit-learn

No matplotlib dependency is required.

## 2. Update the branch

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only
```

Check status:

```bash
git status --short
```

The formal source files must be clean.

## 3. Confirm the frozen candidate artifact exists

Expected local path:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

Do not edit or regenerate it after held-out generation starts.

The analysis script will reject any candidate whose internal hash differs from:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

## 4. Syntax checks

```bash
node --check tools/experiments/run-position-typology-stage2-confirmation.js
node --check tools/experiments/verify-position-typology-stage2-confirmation.js
python -m py_compile tools/experiments/analyze-position-typology-stage2-mtaji-confirmation.py
```

Do not proceed if any check fails.

## 5. Generate the formal held-out corpus

```bash
node tools/experiments/run-position-typology-stage2-confirmation.js
```

Formal output root:

```text
artifacts/local/position-typology/stage2-mtaji-confirmation-v1
```

The runner reads the preregistration spec directly. Formal `games`, `seed`, `maxPly`, and conditions are intentionally not exposed as command-line overrides.

Fixed corpus:

```text
192 games
seeds 20310001..20310192
32 games per condition
opening = seeded-uniform legal, 8 plies
maxPly = 100
```

Per-game files are atomic. If execution is interrupted, rerun the same command; completed files with the same formal config hash are reused.

Do not use `--force` unless the existing formal output is known to be technically corrupted and the rerun is the exact same preregistered configuration. Any such use must be documented.

## 6. Full replay verification

Run before any confirmation metrics:

```bash
node tools/experiments/verify-position-typology-stage2-confirmation.js
```

Expected output:

```text
artifacts/local/position-typology/stage2-mtaji-confirmation-v1/verification.json
```

Verification checks:

- formal boundary,
- preregistration identity,
- exact preregistration spec-file SHA-256,
- candidate-definition hash recorded in the manifest,
- exact 192-seed block,
- 32 games per condition,
- schema validation,
- full replay,
- stored observation recomputation,
- move legality,
- state identities,
- trajectory hashes,
- summary recomputation,
- source-file provenance,
- clean formal source tree.

Do not run the metric analysis unless verification passes.

## 7. Run the preregistered confirmation analysis

```bash
python tools/experiments/analyze-position-typology-stage2-mtaji-confirmation.py
```

Expected output:

```text
artifacts/local/position-typology/stage2-mtaji-confirmation-v1/confirmation-result.json
```

The script applies the formal decision rule exactly as preregistered.

### Technical gates

```text
contributing mtaji games >= 144
capped mtaji rows >= 1500
```

### Primary gates

```text
G1 minority frozen type fraction >= 0.20
G2 frozen-label silhouette >= 0.12
G3 BIC(2) <= BIC(1)-10 AND BIC(2) < BIC(3)
G4 >=2/3 de-novo ARIs >=0.70 AND median ARI >=0.70
G5 80%-game subsample K-means ARI p10 >=0.60
```

All G1-G5 must pass for `confirmed`.

## 8. Share the result

After completion, upload only:

```text
artifacts/local/position-typology/stage2-mtaji-confirmation-v1/confirmation-result.json
```

The result contains the source manifest/verification hashes needed for interpretation.

Keep the following local for audit/replay:

```text
manifest.json
verification.json
games/
```

## Decision handling

### `confirmed`

Record the formal confirmation without expanding the claim beyond the preregistration domain.

### `not-confirmed`

Record the negative result. Do not rerun with a different k, representation, threshold, or preprocessing as a rescue.

### `inconclusive`

Only use for preregistered technical/integrity insufficiency. Do not relabel a failed metric gate as inconclusive.

## After the formal decision

Do not immediately merge mtaji type confirmation with playing-style analysis.

If confirmed, the next research tasks are separate:

1. formal result checkpoint,
2. final naming/ontology-scope decision,
3. namua gradient follow-up,
4. later trajectory-level playing-style analysis,
5. later Study 1 cross-study relation analysis.

Study 1 formal decisions remain unchanged throughout.
