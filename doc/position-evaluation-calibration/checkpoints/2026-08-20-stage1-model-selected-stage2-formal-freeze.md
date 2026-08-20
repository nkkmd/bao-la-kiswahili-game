# Checkpoint — Stage 1 model selected / Stage 2 formal design frozen

Date: 2026-08-20
Study: Position Evaluation / Win-Rate Calibration Study 1

## Stage 1 exploratory calibration result

Returned result artifact:

```text
SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
analysisId = PEC-S1-CALIBRATION-DEVELOPMENT-2026-08-19-v1
selected binary rows = 830
```

All input readiness and independent-verification gates remained PASS.

### Candidate selection

`phase-aware-logistic` became ineligible under the frozen optimizer rule:

```text
failed fold = 1
failed phase = Mtaji
reason = maximum-iterations-without-gradient-convergence
iterations = 100
max |gradient| = 4.513435944430988e-10
required tolerance = 1e-10
```

No alternate optimizer, tolerance relaxation, penalty, or additional family is authorized.

`phase-stratified-isotonic` remained eligible:

```text
pooled CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

Frozen selection rule therefore yields:

```text
selected family = phase-stratified-isotonic
reason = only-eligible-candidate
Stage 1 status = MODEL-SELECTED-EXPLORATORY
formal claim = not authorized from Stage 1
```

### Full-data exploratory fit

```text
Namua: n=430; 327 support points; 24 monotone blocks
Mtaji: n=400; 363 support points; 200 monotone blocks
fullFit canonical JSON SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

Block weights/win sums reconcile to phase sample counts/outcomes and both phase mappings are nondecreasing.

The large exploratory difference in CV performance by phase is recorded but is not itself a formal phase-effect result.

## Stage 2 formal freeze

Machine-readable formal spec:

```text
doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_SPEC.json
stageId = PEC-S2-FORMAL-2026-08-20-v1
```

Population remains the previously reserved fresh block:

```text
2048 games
22300001..22302048
```

The selected Stage 1 mapping is hash-bound and may not be refit on Stage 2.

Cross-stage overlap is forbidden against all Stage 1 generated trajectories/opening prefixes and all Stage 1 observed rule states; exclusion is without replacement.

### Primary formal decision

After all readiness/identity/verification gates pass, `CONFIRMED` requires all:

```text
paired Brier-skill one-sided 95% bootstrap lower bound > 0
pooled frozen-model Brier <= 0.18
Namua frozen-model Brier <= 0.25
Mtaji frozen-model Brier <= 0.12
```

An estimable failure is `NOT-CONFIRMED`; a failed estimability/identity gate is `INCONCLUSIVE`.

No key-secondary or descriptive analysis may rescue the primary decision.

## Current firewall

Stage 2 guarded runner, independent verifier, frozen formal evaluator, validator, contract test, and non-scientific smoke are materialized.

```text
Stage 2 spec alone authorizes generation = false
STAGE_2_FORMAL_AUTHORIZATION.json = intentionally absent
Stage 2 scientific generation = NOT AUTHORIZED
```

Next action is local Stage 2 contract/spec validation and non-scientific smoke only.
