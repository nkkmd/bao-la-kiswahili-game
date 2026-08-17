# Stage 1 Colab / Local Execution Runbook

Stage: `TMHV-S1-STIMULUS-2026-08-17-v1`

This runbook executes the already authorized machine-only Stage 1 corpus. It does not authorize human recruitment or human response collection.

## 0. Environment preflight

Recommended runtime:

```text
Node.js 22.x
Git
POSIX shell (Linux / macOS / Colab)
```

Check:

```sh
node --version
git --version
```

The scientific runner uses repository code and Node built-ins; no `npm install` step is required for this Stage 1 execution.

### Persistent output for Colab

A Colab runtime reset can remove `/content`. To preserve resumable generation, mount Google Drive and place only the scientific output there.

In a Colab Python cell:

```python
from google.colab import drive
drive.mount('/content/drive')
```

Then in a shell cell:

```sh
export TMHV_OUT=/content/drive/MyDrive/bao-research/tmhv-stage1-stimulus-v1
mkdir -p "$TMHV_OUT"
```

For a normal local machine, either use the default repository-local output or set a persistent path, for example:

```sh
export TMHV_OUT="$PWD/artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1"
```

All commands below may use `--output "$TMHV_OUT"`.

## 1. Clean checkout of the authorized tree

Use the exact authorization commit:

```sh
git clone https://github.com/nkkmd/bao-la-kiswahili-game.git
cd bao-la-kiswahili-game
git checkout 12b02975f0c0e7ad053eef6db8b6a2d2c7392d70
printf 'HEAD: '
git rev-parse HEAD
printf 'WORKTREE:\n'
git status --porcelain
```

Required:

```text
HEAD = 12b02975f0c0e7ad053eef6db8b6a2d2c7392d70
worktree = clean
```

Do not edit authorization-bound source files before or during generation.

If using an existing clone instead of a fresh clone, use:

```sh
git fetch origin
git checkout --detach 12b02975f0c0e7ad053eef6db8b6a2d2c7392d70
git status --porcelain
```

Do not run from a working tree with local source modifications.

## 2. Pre-generation validation

Run:

```sh
node tools/experiments/validate-tactical-motif-human-validation-stage1-spec.js
node test/tactical-motif-human-validation-stage1.test.js
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase status --output "$TMHV_OUT"
```

Then explicitly validate the authorization binding and print its hash:

```sh
node - <<'NODE'
const C = require('./tools/experiments/lib/tactical-motif-human-validation-stage1.js');
const { specSha256 } = C.loadSpec();
const { authorization, authorizationSha256 } = C.loadAuthorization(specSha256);
console.log(JSON.stringify({
  specSha256,
  authorizationSha256,
  machineStimulusGenerationAuthorized: authorization.machineStimulusGenerationAuthorized,
  humanDataCollectionAuthorized: authorization.humanDataCollectionAuthorized,
  scientificHumanInferenceAuthorized: authorization.scientificHumanInferenceAuthorized,
}, null, 2));
NODE
```

Expected identity anchors:

```text
stageId = TMHV-S1-STIMULUS-2026-08-17-v1
specSha256 = c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80
authorizationSha256 = d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009
historical C03 candidate-definition SHA-256 = 667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8
machineStimulusGenerationAuthorized = true
humanDataCollectionAuthorized = false
scientificHumanInferenceAuthorized = false
```

If any identity anchor differs, **stop before generation**. Do not repair by editing the spec, authorization, source files, seed range, or candidate definition.

## 3. Generate the fixed corpus

```sh
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase generate --output "$TMHV_OUT"
```

If `TMHV_OUT` is not set, the default output root is:

```text
artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1/
```

Expected scientific games:

```text
1536
```

No seed extension or replacement is allowed.

### Interruption / resume rule

The generator is restart-safe under the same frozen spec: without `--force`, already existing game files are read and reused, while missing games are generated. Therefore, after a Colab/runtime interruption, remount Drive, restore the same `TMHV_OUT`, check out the same authorized commit, and rerun the **same** command:

```sh
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase generate --output "$TMHV_OUT"
```

Do **not** add `--force`. Do not delete a subset of games to obtain a different result. If an existing game has a different `specSha256`, the runner stops rather than silently replacing it.

After generation, preserve the terminal JSON output and confirm that `$TMHV_OUT/manifest.json` exists before continuing.

## 4. Independent full verification

```sh
node tools/experiments/verify-tactical-motif-human-validation-stage1.js --output "$TMHV_OUT"
```

The verifier recomputes all 1,536 games from the beginning on every invocation. It does not checkpoint partial verification. If the runtime is interrupted during verification, rerun the same verifier command from the beginning.

Do not continue unless `verification.json` contains:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 1536
mismatchCount = 0
```

A verification failure is preserved as a technical failure; do not regenerate selectively and do not delete only failed games.

For a compact check:

```sh
node - "$TMHV_OUT" <<'NODE'
const fs = require('fs');
const path = require('path');
const out = process.argv[2];
const v = JSON.parse(fs.readFileSync(path.join(out, 'verification.json'), 'utf8'));
console.log(JSON.stringify({
  passed: v.passed,
  fullSearchRecomputation: v.fullSearchRecomputation,
  gamesVerified: v.gamesVerified,
  mismatchCount: v.mismatchCount,
  specSha256: v.specSha256,
}, null, 2));
NODE
```

## 5. Materialize stimulus classes and matched controls

Only after verification PASS:

```sh
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase select --output "$TMHV_OUT"
```

This creates:

```text
stimulus-pool-audit.json
stimulus-pool.json
```

The readiness audit may pass or fail. Do not alter class definitions, matching costs, thresholds, seed count, opening-prefix no-reuse rules, trajectory no-reuse rules, or control reuse rules to force a pass.

After `select`, **stop before scientific human recruitment**.

## 6. Compact artifacts to preserve and return

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
  "$TMHV_OUT/manifest.json" \
  "$TMHV_OUT/verification.json" \
  "$TMHV_OUT/stimulus-pool-audit.json" \
  "$TMHV_OUT/stimulus-pool.json"
```

Return bundles are local execution artifacts and must not be created in the repository root. Store them under the gitignored `artifacts/local/` boundary:

```sh
TMHV_RETURN="$PWD/artifacts/local/tactical-motif-human-validation/stage1-return"
TMHV_RETURN_TAR="$PWD/artifacts/local/tactical-motif-human-validation/tmhv-stage1-return.tar.gz"

rm -rf "$TMHV_RETURN"
mkdir -p "$TMHV_RETURN"
cp "$TMHV_OUT"/{manifest.json,verification.json,stimulus-pool-audit.json,stimulus-pool.json} "$TMHV_RETURN"/
sha256sum "$TMHV_RETURN"/*.json > "$TMHV_RETURN/SHA256SUMS.txt"
tar -czf "$TMHV_RETURN_TAR" -C "$(dirname "$TMHV_RETURN")" "$(basename "$TMHV_RETURN")"
sha256sum "$TMHV_RETURN_TAR"
```

Canonical local placement:

```text
artifacts/local/tactical-motif-human-validation/stage1-return/
artifacts/local/tactical-motif-human-validation/tmhv-stage1-return.tar.gz
```

Both paths are intentionally ignored by Git. They must not be committed.

Return either:

- the four JSON files plus `SHA256SUMS.txt`, or
- `tmhv-stage1-return.tar.gz`.

The large `games/` directory remains local execution material and should not be uploaded unless a later discrepancy requires targeted forensic inspection.

## 7. Failure handling

If `generate` exits non-zero:

1. preserve the terminal output;
2. do not edit the corpus/spec/source to recover;
3. report the exact error and whether any game files were created.

If `verify` fails:

1. preserve `verification.json`;
2. do not run `select`;
3. return `manifest.json` and `verification.json` plus the terminal error/output.

If `select` returns readiness FAIL:

1. preserve the result as-is;
2. return all compact artifacts;
3. do not extend the seed range or relax matching/readiness rules.

## 8. Stop boundary

After Stage 1 `select`, stop before scientific human recruitment.

The next authorized scientific decision is based on the frozen Stage 1 readiness audit:

- readiness PASS → formal stimulus freeze + ethics/recruitment feasibility + Stage 2 preregistration;
- readiness FAIL → preserve failure and decide prospectively whether a new design version is justified.

Neither branch changes historical `TM-S2-C03 = CONFIRMED`.
