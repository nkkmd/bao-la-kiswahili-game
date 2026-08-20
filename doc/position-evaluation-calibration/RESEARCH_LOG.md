# Research Log — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20  
Final status: **STUDY 1 CLOSED / FORMAL INCONCLUSIVE**

This log records the principal scientific chronology. Detailed operational state is preserved in `checkpoints/`, preregistration files, authorization records, `DECISION_REGISTER.md`, and `REPRODUCIBILITY_INDEX.md`.

## 2026-08-18 — Study initiation and state restoration

Repository baseline:

```text
user-reported previous main = 1a5a591d526b2383ca3540827eff6f8f39c14861
current main at initiation = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
research branch = research/position-evaluation-winrate-calibration
```

The main difference was the prior `FUTURE_RESEARCH_AGENDA.md` priority update that moved win-rate calibration ahead of bad-move/misconception research. No completed-study decision changed.

Restored immutable boundaries included:

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
TMHV human axis = INCONCLUSIVE-NOT-ESTIMABLE (N=0)
Namua→Mtaji formal decision = NOT-CONFIRMED
```

Technical audit established:

- static `AI.evaluate` is player-relative;
- terminal static values are ±1,000,000;
- ordinary static evaluation is not a probability;
- `bao` weights are phase-specific;
- hard / phase2 / D2 continuation is deterministic for fixed state/options;
- max-ply unresolved states are administrative truncation, not intrinsic draws;
- trajectory/state identities support pseudoreplication controls.

Primary measurement was frozen as:

```text
AI.evaluate(state, state.player), profile=bao
```

Key secondary remained exact D2 root bestScore.

## 2026-08-18 — Stage 0 design freeze

Fresh scientific seed blocks were frozen:

```text
Stage 1 = 22200001..22201024 (1024 games)
Stage 2 reserved = 22300001..22302048 (2048 games)
```

Stage 1 population:

```text
opening = 8-ply seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
support unit = unique historicalTrajectoryHash
max selected states per trajectory = 1
outcome-blind SHA phase assignment and state ranking
unavailable phase = no replacement
duplicate selected ruleStateKey = collapse / no replacement
```

Model candidates were frozen before outcomes:

```text
phase-aware logistic
phase-stratified isotonic PAVA
```

Five trajectory-level SHA folds, pooled CV Brier selection, no outcome-dependent extension, and readiness gates were preregistered.

Stage 1 spec:

```text
stageId = PEC-S1-EXPLORATORY-2026-08-18-v1
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
```

## 2026-08-18 — Stage 0 smoke PASS / Stage 1 authorization

Non-scientific technical smoke:

```text
smokeId = PEC-S0-SMOKE-2026-08-18-v1
smoke SHA-256 = 11172d1a31d5716b40a5dd8d4cf092d0e7d6142c6b2299d30e6591e305d007f8
validated source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
passed = true
deterministicReplay = true
staticPerspectiveAntisymmetry = true
scientificGeneration = false
```

A separate source-bound authorization was then committed:

```text
authorization commit = e4323705087c854650097c7d3789ef1371f7a489
Stage 1 generation = AUTHORIZED
formal inference = NOT AUTHORIZED
confirmatory reuse of Stage 1 = NOT AUTHORIZED
```

## 2026-08-19 — Stage 1 generation / verification / readiness PASS

Stage 1 production artifacts:

```text
generation manifest SHA-256 = 0a1ad53c2ac5dff272b771d6b9c48ca26b349aad650029a5d13464c0aa990813
selection/measurement summary SHA-256 = 1e843c9fbc3f286f2e6bc17a99e6590b51f636d09b051ff73fa96228fb756d73
verification SHA-256 = 6b4e08a11b1145337410036a697e81f7c7f2408378f4584bc1a2b27cef76ff21
generation source commit = c97a4f620f1a0da4e013ed55eb0fcf37fec16bf4
```

The first verifier attempt was interrupted by a WSL disconnection before a completed `verification.json` existed. Process inspection showed no surviving verifier, so the verifier alone was rerun over the same already-generated corpus. No generation or seed extension was repeated.

Final Stage 1 verification/readiness:

```text
games = 1024
gamesVerified = 1024
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
uniqueHistoricalTrajectories = 872
selectedUniqueRuleStates = 830
Namua = 430
Mtaji = 400
administrative truncation = 0
selectionHash = 29b270b7dbfca8ef67c393c60f6232694c629b80228665eb1166dddeb257dd79
measurementHash = 0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa
```

All preregistered Stage 1 readiness gates passed.

Residual numerical mechanics were frozen before score-outcome model fitting in:

```text
preregistration/STAGE_1_ANALYSIS_METHOD_FREEZE.json
analysisId = PEC-S1-CALIBRATION-DEVELOPMENT-2026-08-19-v1
```

This freeze clarified zero initialization, Newton/IRLS convergence mechanics, full SHA-256 modulo convention, isotonic equal-score grouping, support-floor prediction, endpoint clamping, and no-rescue behavior without changing the candidate families or scientific decision rules.

## 2026-08-20 — Stage 1 model selection

Stage 1 analysis result:

```text
result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
selected binary rows = 830
analysis source commit = b02fff06a63f1908cf74d1713d6a681c58c04269
analysis code dirty = false
```

Phase-aware logistic failed the frozen eligibility rule in CV fold 1 / Mtaji:

```text
iterations = 100
max |gradient| = 4.513435944430988e-10
required tolerance = 1e-10
reason = maximum-iterations-without-gradient-convergence
```

No rescue optimizer, additional iterations, tolerance change, or regularization was used.

Phase-stratified isotonic remained eligible:

```text
pooled CV Brier = 0.1532240986334561
pooled CV log loss = 0.6349271789417926
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

Frozen selection:

```text
selected family = phase-stratified-isotonic
reason = only-eligible-candidate
Stage 1 status = MODEL-SELECTED-EXPLORATORY
```

Full fit:

```text
Namua = n430 / 327 support points / 24 blocks
Mtaji = n400 / 363 support points / 200 blocks
fullFit canonical SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

## 2026-08-20 — Stage 2 formal freeze

Fresh formal design:

```text
stageId = PEC-S2-FORMAL-2026-08-20-v1
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
games = 2048
seeds = 22300001..22302048
```

The exact Stage 1 isotonic mapping was hash-bound; Stage 2 refit/smoothing/primary clipping was forbidden.

Cross-stage identity firewall:

```text
historicalTrajectoryHash — all Stage 1 generated games
openingPrefixHash — all Stage 1 generated games
ruleStateKey — all Stage 1 observations
```

Overlaps were to be excluded without replacement.

Formal `CONFIRMED` required every estimability/identity gate plus all of:

```text
paired Brier-skill one-sided 95% bootstrap lower bound > 0
pooled Brier <= 0.18
Namua Brier <= 0.25
Mtaji Brier <= 0.12
```

Any estimability/identity gate failure was frozen to `INCONCLUSIVE` before the performance-criteria branch.

## 2026-08-20 — Stage 2 technical smoke PASS / authorization

Technical smoke:

```text
smokeId = PEC-S2-SMOKE-2026-08-20-v1
smoke SHA-256 = 5cf0e2276f997cca689d52b8304e42dc1ac9df96769b7a7e858535e7c38628d2
source commit = fbb84549713b0b699fc32ea87345112b378d9e5a
passed = true
fixture seeds = 990101..990108
deterministicReplay = true
stage1ResultHashVerified = true
stage1MeasurementHashVerified = true
finiteFrozenModelPredictions = true
scientificGeneration = false
```

Separate Stage 2 authorization:

```text
authorization commit = 2b4b186f8fd51912c5b4ed52fa0f1a6c6672e8a2
authorization SHA-256 = e0513a4bc33f9029b485dce9674a21601a91f0d094ea7de455ed29e75b362d26
```

It allowed exactly the frozen 2,048-game Stage 2 generation and did not authorize refit, extension, or replacement.

## 2026-08-20 — Stage 2 generation / independent verification

Returned production artifacts:

```text
generation manifest SHA-256 = 1b5aae5333bc9b02a36fc72cbaf2514a303f9bfd5fae97ceb0ad530d4828e71b
selection/measurement summary SHA-256 = 575caef5058cb3d04209708b7e04f0f09381f7beea6d41706624cb73534f1b51
verification SHA-256 = 10790c52ec15bf89dfd301942d91424504bf5bf2afd7230182382d33134515ff
generation source commit = a6f36a7cb86eab38897372680acd7eadc6f3436b
```

Technical verification was fully clean:

```text
games = 2048
gamesVerified = 2048
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
final Stage 1 historicalTrajectoryHash overlap = 0
final Stage 1 openingPrefixHash overlap = 0
final Stage 1 ruleStateKey overlap = 0
measurementHash = 373d780504814999466c3bc822a17b048054e8079b1c000e903a503cac9d1a33
```

Selection accounting:

```text
unique historical trajectories before Stage 1 firewall = 1618
Stage 1 trajectory overlaps excluded = 235
unique trajectories after trajectory/opening firewall = 1383
Stage 1 rule-state observations excluded = 1199
provisional selected states = 1292
unavailable assigned phase = 91
duplicate selected rule states collapsed = 2
selected unique rule states = 1290
Namua = 663
Mtaji = 627
administrative truncation = 0
```

## 2026-08-20 — Stage 2 estimability FAIL

Three preregistered gates failed:

```text
unique historical trajectories after Stage 1 firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

All identity-overlap gates, verification, truncation, distinct-score, opening-prefix, and outcome-support gates passed.

Frozen consequence:

```text
formal decision = INCONCLUSIVE
formal performance criteria eligible = false
paired bootstrap eligible = false
```

No additional games, seed extension, overlap replacement, threshold relaxation, or mapping refit was authorized.

## 2026-08-20 — Canonical formal-result materialization

Canonical Stage 2 result:

```text
stage2-formal-result SHA-256 = 94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
formalDecision = INCONCLUSIVE
bootstrap = null
criteria = null
```

Descriptive-only values:

```text
n = 1290
frozen model Brier = 0.15550141283724248
phase-only reference Brier = 0.2510612273133199
observed paired Brier skill = +0.09555981447607745
Namua Brier = 0.22678074548187638
Mtaji Brier = 0.08012948693071474
pooled ECE = 0.05214158062926888
exact unclipped log loss = non-finite / 7 boundary contradictions
```

Although the descriptive Brier values are below the frozen absolute thresholds, the formal decision never reached that branch because estimability failed first. The positive descriptive skill therefore does not become confirmation.

## 2026-08-20 — Study 1 closure and central integration

Final closure records were materialized:

```text
STUDY_1_OVERVIEW.md
STUDY_1_FINAL_REPORT.md
STAGE_2_FORMAL_RESULT.md
REPRODUCIBILITY_INDEX.md
results/STAGE_2_FORMAL_RESULT_SUMMARY.json
CURRENT_STATUS.md
DECISION_REGISTER.md
EXPERIMENT_INDEX.md
```

Central navigation was updated:

```text
/README.md
doc/RESEARCH_INDEX.md
doc/FUTURE_RESEARCH_AGENDA.md
```

`FUTURE_RESEARCH_AGENDA.md` now records calibration Study 1 as completed / formal `INCONCLUSIVE` and promotes Bad Move / Misconception Patterns as the next recommended Stage-2 study. It explicitly forbids treating the exploratory isotonic mapping as a formally validated Bao win probability.

Final scientific state:

```text
Stage 0 = COMPLETE / TECHNICAL PASS
Stage 1 = COMPLETE / EXPLORATORY MODEL SELECTED
Stage 2 = COMPLETE / VERIFIED / ESTIMABILITY FAIL
OVERALL FORMAL DECISION = INCONCLUSIVE
additional-data rescue = FORBIDDEN
```

Repository integration into `main` is a separate operation and is not implied by scientific closure.
