# Stage 1 Colab / Local Execution Runbook

Stage: `TMHV-S1-STIMULUS-2026-08-17-v1`

This runbook executes the already authorized machine-only Stage 1 corpus. It does not authorize human recruitment or human response collection.

## 1. Clean checkout of the authorized tree

Use the exact authorization commit:

```sh
git clone https://github.com/nkkmd/bao-la-kiswahili-game.git
cd bao-la-kiswahili-game
git checkout 12b02975f0c0e7ad053eef6db8b6a2d2c7392d70
git status --porcelain
```

Required:

```text
HEAD = 12b02975f0c0e7ad053eef6db8b6a2d2c7392d70
worktree = clean
```

Do not edit authorization-bound source files before generation.

## 2. Pre-generation validation

```sh
node tools/experiments/validate-tactical-motif-human-validation-stage1-spec.js
node test/tactical-motif-human-validation-stage1.test.js
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase status
```

Expected identity anchors:

```text
stageId = TMHV-S1-STIMULUS-2026-08-17-v1
specSha256 = c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80
authorizationSha256 = d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009
historical C03 candidate-definition SHA-256 = 667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8
humanDataCollectionAuthorized = false
```

## 3. Generate the fixed corpus

```sh
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase generate
```

Default output root:

```text
artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1/
```

Expected scientific games:

```text
1536
```

No seed extension or replacement is allowed.

## 4. Independent full verification

```sh
node tools/experiments/verify-tactical-motif-human-validation-stage1.js
```

Do not continue unless `verification.json` contains:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 1536
mismatchCount = 0
```

A verification failure is preserved as a technical failure; do not regenerate selectively.

## 5. Materialize stimulus classes and matched controls

```sh
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase select
```

This creates:

```text
stimulus-pool-audit.json
stimulus-pool.json
```

The readiness audit may pass or fail. Do not alter class definitions, matching costs, thresholds, seed count, or no-reuse rules to force a pass.

## 6. Compact artifacts to preserve

Keep at minimum:

```text
manifest.json
verification.json
stimulus-pool-audit.json
stimulus-pool.json
```

Create hashes:

```sh
sha256sum \
  artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1/manifest.json \
  artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1/verification.json \
  artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1/stimulus-pool-audit.json \
  artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1/stimulus-pool.json
```

The large `games/` directory remains local/private execution material and is not committed to GitHub.

## 7. Stop boundary

After Stage 1 `select`, stop before scientific human recruitment.

The next authorized scientific decision is based on the frozen Stage 1 readiness audit:

- readiness PASS → formal stimulus freeze + ethics/recruitment feasibility + Stage 2 preregistration;
- readiness FAIL → preserve failure and decide prospectively whether a new design version is justified.

Neither branch changes historical `TM-S2-C03 = CONFIRMED`.
