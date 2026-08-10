# Stage 5 Playing-Style Continuous Confirmation — Local Runbook

Date: 2026-08-10  
Preregistration: `PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1`

## Boundary

This is a formal local-only held-out confirmation. Do not run it in GitHub Actions and do not change the preregistered seed block, descriptor set, frozen transforms, or G1–G5 thresholds.

Required local discovery artifacts must already exist:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-coordinate-definition-v1/style-coordinate-definition.json
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-ingredient-definition-v1/style-ingredient-definition.json
```

Required hashes:

```text
Mtaji classifier:
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

Style coordinate definition:
568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc

Style ingredient definition:
b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

## 1. Sync and verify clean source

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version
node --version
```

`git status --short` should be empty for tracked formal source files before corpus generation.

## 2. Compile/check the formal analyzer

```bash
python -m py_compile tools/experiments/analyze-position-typology-stage5-style-confirmation.py
```

## 3. Generate the formal held-out corpus

Fixed corpus:

```text
192 games
seed 20350001..20350192
6 conditions x 32
```

Run:

```bash
node tools/experiments/run-position-typology-stage5-style-confirmation.js
```

Default output:

```text
artifacts/local/position-typology/stage5-playing-style-confirmation-v1/
```

The runner uses per-game atomic files and may resume an interrupted run when the config hash matches.

Status only:

```bash
node tools/experiments/run-position-typology-stage5-style-confirmation.js --status
```

Do not use `--force` unless the existing local output is known to be invalid and must be regenerated from the same frozen formal config.

## 4. Full replay / provenance verification

After all 192 game files and `manifest.json` exist:

```bash
node tools/experiments/verify-position-typology-stage5-style-confirmation.js
```

Expected output:

```text
artifacts/local/position-typology/stage5-playing-style-confirmation-v1/verification.json
```

Do not run formal analysis unless verification passes.

## 5. Formal G1–G5 analysis

```bash
python tools/experiments/analyze-position-typology-stage5-style-confirmation.py
```

Expected output:

```text
artifacts/local/position-typology/stage5-playing-style-confirmation-v1/confirmation-result.json
```

The analyzer reconstructs the full frozen chain without primary held-out refitting:

```text
state
 -> frozen N-ACT/N-CON transform
 -> frozen MTAJI-M1/M2 classifier
 -> fixed 10D game descriptor
 -> frozen 10D scaler
 -> frozen STYLE-C1..C4 projection
```

A de-novo held-out PCA is used only for preregistered subspace-comparison gates.

## 6. Share result

Upload only:

```text
artifacts/local/position-typology/stage5-playing-style-confirmation-v1/confirmation-result.json
```

The formal decision is already encoded as:

```text
confirmed / not-confirmed / inconclusive
```

Do not inspect alternative k, alternative coordinates, alternative feature sets, or modified thresholds after seeing the result.
