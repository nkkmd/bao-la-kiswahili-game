# Blunder / Misvaluation Patterns Study 1 — Stage 2 Execution Runbook

Updated: 2026-08-22  
Status: **SOURCE-BOUND AUTHORIZED / GENERATION NEXT**

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
validated execution HEAD = 011b9a56ecb95046f7d61a331b76dea093aa7663
source freeze commit = 11670e528dccff063b8e66be9ff190e61e4e4e77
final corrected authorization commit = a9eee06c6a1ad36f9e65948f5d78eff58a91d561
```

Research branch:

```text
research/blunder-misvaluation-patterns-stage2-formal
```

Baseline integrated `main`:

```text
52f5635be7064b5016baf7cde82faebe60609d9e
```

## 1. Mandatory execution order

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal D3 measurement
-> independent formal measurement verification
-> formal evaluation
```

Do not skip gates.

## 2. Pre-generation status and authorization acceptance

After pulling the latest branch, first inspect status:

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase status
```

Required before generation:

```text
authorizationFilePresent = true
generatedGames = 0
expectedGames = 4096
hasManifest = false
hasCorpusVerification = false
hasSelectionAudit = false
hasMeasurementManifest = false
hasMeasurementVerification = false
hasFormalResult = false
```

`--phase status` reports current hashes but intentionally does not consume the authorization. Therefore run this explicit **non-generating authorization acceptance check** next:

```bash
node - <<'NODE'
const C = require('./tools/experiments/lib/blunder-misvaluation-stage2-corpus.js');
const { specSha256 } = C.loadSpec();
const { candidateSha256 } = C.loadCandidates();
const { authorizationSha256 } = C.loadAuthorization(specSha256, candidateSha256);
console.log(JSON.stringify({
  stageId: 'BMP-S2-FORMAL-2026-08-22-v1',
  authorizationAccepted: true,
  specSha256,
  candidateSha256,
  authorizationSha256,
  sourceFileSha256: C.sourceFileSha256()
}, null, 2));
NODE
```

This validates authorization semantics, candidate/spec binding, and the exact ordered `authorizedSourceFileSha256` map without generating scientific data. Any failure stops the study.

## 3. Generate the fixed formal corpus

Only after the authorization acceptance check succeeds:

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase generate \
  2>&1 | tee /tmp/bmp-stage2-generate.log
```

Frozen population:

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
```

Do not extend seeds or use replacement sampling. The runner is deterministic/resumable under the same frozen identity; rerunning after an interruption is not authorization to change scientific inputs.

Expected compact artifact:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/manifest.json
```

**After generation, do not run selection. Run independent corpus verification next.**

## 4. Independent corpus verification

```bash
node tools/experiments/verify-blunder-misvaluation-stage2-formal.js --phase corpus \
  2>&1 | tee /tmp/bmp-stage2-verify-corpus.log
```

Required before selection:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 4096
candidate/spec/source bindings intact
```

Expected artifact:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/verification.json
```

Stop and inspect `manifest.json` + `verification.json` before selection.

## 5. Support-group selection

Only after corpus verification PASS:

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase select
```

Selection is outcome-blind and applies the Stage 1 leakage firewall. C01/C02/C03 share one Namua support-group root set; C04 uses one Mtaji support-group root set. No alternate root or replacement is allowed after a rule-state overlap exclusion.

Expected artifact:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/selection-audit.json
```

## 6. Formal D3 measurement

Only after selection audit is accepted:

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase measure \
  2>&1 | tee /tmp/bmp-stage2-measure.log
```

Expected compact artifact:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/measurement-manifest.json
```

## 7. Independent measurement verification

```bash
node tools/experiments/verify-blunder-misvaluation-stage2-formal.js --phase measurement \
  2>&1 | tee /tmp/bmp-stage2-verify-measurement.log
```

Required before evaluation:

```text
passed = true
measurementHashMatches = true
stage1IdentityFirewallPassed = true
independentFormalD3CandidateTableRecomputation = true
independentCandidateMatcherAndFailureRecomputation = true
```

Expected artifact:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/measurement-verification.json
```

## 8. Formal evaluation

Only after independent measurement verification PASS:

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase evaluate \
  2>&1 | tee /tmp/bmp-stage2-evaluate.log
```

Expected result:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/stage2-formal-result.json
```

Candidate labels are exactly `CONFIRMED`, `NOT-CONFIRMED`, `INCONCLUSIVE-NOT-ESTIMABLE`, or `TECHNICAL-INCONCLUSIVE`. Zero confirmed candidates is valid.

## 9. No-rescue boundary

After scientific generation begins, do not extend seeds, replace excluded trajectories/states, choose alternate roots after identity overlap, edit/merge/split/rename candidates, retune matcher/failure token, change endpoint/null/floors, change alpha/multiplicity family, promote favorable subgroups, switch primary depth/evaluator, or manually override a decision.

A materially different design requires a new prospective version and a new fresh seed block.

## 10. Authorization correction audit

The first authorization commit `a0e7d9ee619d081749039271f039b32267699d4b` had one clerical source-hash transcription error and was never used. Final valid authorization is:

```text
a9eee06c6a1ad36f9e65948f5d78eff58a91d561
```

No scientific source or scientific data changed as part of that correction.

## 11. Interpretation boundary

Even `CONFIRMED` means machine-reproducible recurrence under the frozen Bao engine/search/population only. It is not a game-theoretic proof, human misconception result, expert/traditional validation, pedagogical result, causal claim, or external-validity claim.
