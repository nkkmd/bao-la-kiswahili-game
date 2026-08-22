# Blunder / Misvaluation Patterns Study 1 — Stage 2 Execution Runbook

Updated: 2026-08-22  
Status: **PRE-AUTHORIZATION / SCIENTIFIC GENERATION BLOCKED**

Stage:

```text
BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
```

Research branch:

```text
research/blunder-misvaluation-patterns-stage2-formal
```

Baseline integrated `main`:

```text
52f5635be7064b5016baf7cde82faebe60609d9e
```

## 1. Current firewall

At the current pre-authorization stage, the following are allowed:

```text
validator
contract test
tooling technical tests
node syntax checks
--phase status
source-hash audit
```

The following are **not** yet allowed:

```text
--phase generate
corpus verification on scientific Stage 2 output
--phase select
--phase measure
measurement verification on scientific Stage 2 output
--phase evaluate
```

`generate` must fail closed while `STAGE_2_FORMAL_AUTHORIZATION.json` is absent.

## 2. Pre-authorization technical validation

Run from repository root:

```bash
node tools/experiments/validate-blunder-misvaluation-stage2-formal-spec.js
node test/blunder-misvaluation-stage2-contract.test.js
node test/blunder-misvaluation-stage2-tooling.test.js

node --check tools/experiments/lib/blunder-misvaluation-stage2-formal.js
node --check tools/experiments/lib/blunder-misvaluation-stage2-corpus.js
node --check tools/experiments/run-blunder-misvaluation-stage2-formal.js
node --check tools/experiments/verify-blunder-misvaluation-stage2-formal.js
node --check tools/experiments/evaluate-blunder-misvaluation-stage2-formal.js

node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase status
```

Expected scientific authorization state:

```text
authorizationFilePresent = false
expectedGames = 4096
generatedGames = 0
```

No scientific output should exist at this point.

## 3. Authorization prerequisites

Generation authorization may be created only after all of the following are archived:

```text
candidate/spec validator PASS
contract test PASS
tooling semantics test PASS
syntax checks PASS
status/source-file hash audit PASS
scientific source tree clean
exact source-file SHA-256 map frozen
```

A separate machine-readable authorization file must then bind:

```text
Stage 2 stageId
candidate freeze SHA-256
formal spec SHA-256
validated implementation commit
exact source-file SHA-256 map
fresh seed range 22500001..22504096
no Stage 1 confirmation reuse
no-rescue rules
```

## 4. Scientific execution order after authorization

Only after explicit authorization:

### A. Generate fresh corpus

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase generate
```

Expected:

```text
4096 games
seeds 22500001..22504096
6 fixed generation strata
formalExperiment = true
```

Do not use `--force` unless correcting a purely technical interrupted write under the same frozen identity. `--force` is not a scientific rescue mechanism.

### B. Independent corpus verification

```bash
node tools/experiments/verify-blunder-misvaluation-stage2-formal.js --phase corpus
```

Required before selection:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 4096
```

### C. Outcome-blind support-group selection

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase select
```

Selection applies the Stage 1 trajectory/opening firewall before root selection, then the Stage 1 rule-state firewall after outcome-blind root selection. No alternate root or replacement is allowed after rule-state overlap.

Do not interpret candidate rates at this step.

### D. Formal D3 measurement

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase measure
```

C01/C02/C03 share one G01 measurement set. C04 uses G02. Each selected root is measured once per support group.

### E. Independent formal measurement verification

```bash
node tools/experiments/verify-blunder-misvaluation-stage2-formal.js --phase measurement
```

Required before evaluation:

```text
passed = true
measurementHashMatches = true
stage1IdentityFirewallPassed = true
independentFormalD3CandidateTableRecomputation = true
independentCandidateMatcherAndFailureRecomputation = true
```

### F. Formal evaluation

```bash
node tools/experiments/run-blunder-misvaluation-stage2-formal.js --phase evaluate
```

or equivalently:

```bash
node tools/experiments/evaluate-blunder-misvaluation-stage2-formal.js
```

Evaluation is blocked unless independent measurement verification exists and passes.

## 5. Formal decision labels

Per candidate:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

There is no requirement that any candidate be confirmed. Zero confirmed candidates is valid.

## 6. No-rescue boundary

After scientific generation begins, do not:

```text
extend seeds
replace excluded trajectories/states
choose alternate roots after overlap
edit candidate definitions
retune matcher/failure token
merge/split candidates
change phase
change endpoint/null/floors
change alpha or multiplicity family
promote favorable subgroups
switch primary depth/evaluator
manually override a candidate decision
```

## 7. Large artifact policy

Stage 2 local outputs belong under:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/
```

Large corpus and measurement files are not committed. Repository records should store compact results, counts, hashes, provenance, and checkpoints.

## 8. Interpretation boundary

Even a Stage 2 `CONFIRMED` label is a machine-reproducible recurrence claim under the frozen Bao engine/search/population only. It is not a game-theoretic proof, human misconception result, expert/traditional validation, pedagogical result, causal claim, or external-validity claim.
