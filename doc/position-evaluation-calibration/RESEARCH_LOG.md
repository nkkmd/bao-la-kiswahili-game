# Research Log — Position Evaluation / Win-Rate Calibration Study 1

## 2026-08-18 — Study initiation

### Repository restoration

- user-reported previous main: `1a5a591d526b2383ca3540827eff6f8f39c14861`
- current GitHub main: `8672ba4fafb896124df0c4728d41f7c3a6ed5056`
- compare result: current is one merge ahead;
- changed file: `doc/FUTURE_RESEARCH_AGENDA.md` only;
- change meaning: Position Evaluation / Win-Rate Calibration promoted ahead of bad-move/misconception research as a measurement foundation;
- no existing formal decision changed.

### Scientific state restoration

Reviewed central index/agenda and canonical records for Position Complexity, Tactical Motifs, TMHV, Phase Transition, Position Typology and first-player effects.

Immutable boundaries restored:

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
TMHV human axis = INCONCLUSIVE-NOT-ESTIMABLE (N=0)
```

### Technical audit

Audited engine/evaluator/search semantics.

Key findings:

- static `AI.evaluate` is exported and player-relative;
- static terminal score is ±1,000,000;
- ordinary evaluation is not a probability and is not clipped to a probability-like range;
- bao weights are phase-specific;
- engine phase is global and transitions to Mtaji after both reserves reach zero;
- captures are compulsory when available under the legal-move generator;
- enhanced search value differs from static evaluation and includes fixed-depth lookahead, mate-distance scoring and capture quiescence;
- hard minimax/alpha-beta continuation is deterministic for fixed state/configuration;
- easy/normal/MCTS consume RNG;
- benchmark `draw` can mean unresolved administrative max-turn truncation, not an intrinsic engine draw.

### Initial design decision

Working primary measurement:

```text
AI.evaluate(state, state.player), profile=bao
```

Key secondary:

```text
exact D2 bestScore
exact-full-window-root-candidates/phase2-value-semantics/v1
```

Primary empirical estimand is population-level continuation outcome probability under a frozen sampled-state distribution and deterministic continuation policy.

### Authorization state

```text
Stage 0 = OPEN
Stage 1 generation = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

## 2026-08-18 — Stage 0 design freeze

### Seed firewall closure

Canonical prior-study seed blocks, frozen configs, first-player generator formulas, benchmark defaults and symbolic joseki/MCTS seeds were audited. The declared new scientific corpus namespace was checked against the tracked repository index.

Frozen new allocation:

```text
Stage 1 = 22200001..22201024 (1024 games)
Stage 2 reserved = 22300001..22302048 (2048 games)
```

Searches for the new numeric prefixes/Stage 1 start found no prior tracked references on baseline main. Stage 2 reservation is not generation authorization.

### Stage 1 population freeze

```text
opening = 8-ply seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
trajectory unit = unique historicalTrajectoryHash
selected states per trajectory <= 1
phase assignment = frozen SHA-256 parity
within-phase state = frozen minimum SHA-256 rank
unavailable phase = no replacement
duplicate selected ruleStateKey = collapse, no replacement
```

Administrative max-ply truncation is recorded separately from draw and receives no binary outcome. Selection is outcome-blind. Truncation >1% fails Stage 1 readiness without extension.

### Model-development freeze

Stage 1 candidate families are exactly:

```text
phase-aware logistic
phase-stratified isotonic PAVA
```

Five deterministic trajectory-level folds are used. Primary selection metric is out-of-fold Brier score. Isotonic must improve Brier by at least 0.002 to displace logistic; otherwise logistic is preferred. Both-candidate technical failure closes Stage 1 inconclusive without Stage 2.

### Tooling materialized

Prepared:

- frozen Stage 1 machine-readable spec;
- spec validator;
- shared source-hash/provenance and generation library;
- guarded Stage 1 production runner;
- replay/measurement verifier;
- non-scientific Stage 0 smoke;
- Stage 0 contract test;
- Stage 0/Stage 1 protocols and runbook.

The production runner requires an authorization JSON that is intentionally absent.

### Current authorization state

```text
Stage 0 design = FROZEN
local Stage 0 smoke = PENDING
Stage 1 generation = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

## 2026-08-18 — Stage 0 technical smoke PASS and Stage 1 authorization

The returned non-scientific smoke artifact was audited against the frozen Stage 1 contract.

```text
smokeId = PEC-S0-SMOKE-2026-08-18-v1
smoke artifact SHA-256 = 11172d1a31d5716b40a5dd8d4cf092d0e7d6142c6b2299d30e6591e305d007f8
source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
passed = true
sourceTreeDirty = false
deterministicReplay = true
staticPerspectiveAntisymmetry = true
games = 8
uniqueHistoricalTrajectories = 8
selectedStates = 8
selectedNamua = 6
selectedMtaji = 2
scientificGeneration = false
scientificInferenceAuthorized = false
authorizationFilePresent = false
generationAuthorizedBySpecAlone = false
```

The spec hash also matched the spec entry in the returned source SHA-256 mapping. The smoke exercised both authoritative phases and confirmed deterministic replay and actor-relative static-score antisymmetry. It is technical validation only and is permanently excluded from calibration evidence.

A separate source-bound authorization artifact was then committed:

```text
authorization commit = e4323705087c854650097c7d3789ef1371f7a489
file = doc/position-evaluation-calibration/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json
Stage 1 generation = AUTHORIZED
Stage 1 scientific inference before independent verification = NOT AUTHORIZED
Stage 1 confirmatory reuse = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

The authorization binds the exact Stage 1 spec SHA-256 and the exact frozen source-file SHA-256 mapping returned by the passing smoke. Subsequent documentation-only commits do not change the frozen source set.

## 2026-08-19 — Stage 1 generation, independent verification, and readiness PASS

The fixed Stage 1 corpus was generated under the prior authorization and returned for audit.

```text
generation manifest SHA-256 = 0a1ad53c2ac5dff272b771d6b9c48ca26b349aad650029a5d13464c0aa990813
selection/measurement summary SHA-256 = 1e843c9fbc3f286f2e6bc17a99e6590b51f636d09b051ff73fa96228fb756d73
verification SHA-256 = 6b4e08a11b1145337410036a697e81f7c7f2408378f4584bc1a2b27cef76ff21
generation source commit = c97a4f620f1a0da4e013ed55eb0fcf37fec16bf4
games = 1024
seed range = 22200001..22201024
sourceTreeDirty = false
```

The prior verifier attempt was interrupted by a WSL disconnection before `verification.json` existed. Process inspection confirmed that no verifier remained running and no completed verification artifact existed. The verifier was therefore rerun over the same already-generated corpus. This was a verification repeat only; no scientific regeneration, seed extension, replacement, or outcome-dependent continuation occurred.

Independent verification returned:

```text
passed = true
gamesVerified = 1024
gameReplayMismatches = 0
uniqueHistoricalTrajectories = 872
selectedUniqueRuleStates = 830
measurementMismatches = 0
measurementHashMatches = true
selectionHash = 29b270b7dbfca8ef67c393c60f6232694c629b80228665eb1166dddeb257dd79
measurementHash = 0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa
```

### Readiness result

All preregistered Stage 1 readiness gates passed:

```text
unique historical trajectories = 872 >= 800
selected unique rule states = 830 >= 750
Namua = 430 >= 330
Mtaji = 400 >= 330
distinct opening prefixes = 830 >= 200
distinct static evaluations = 327 Namua / 363 Mtaji >= 50 each
Namua actor wins/losses = 190 / 240 >= 75 each
Mtaji actor wins/losses = 200 / 200 >= 75 each
administrative truncation rate = 0 <= 0.01
```

Selection accounting was:

```text
unique historical trajectories = 872
provisional selected states = 832
unavailable assigned phase = 40
duplicate selected rule states collapsed = 2
final selected unique rule states = 830
```

No replacement or extension is needed or authorized.

### Analysis mechanics freeze

Before opening individual score–outcome pairs for model fitting, residual implementation mechanics were separately frozen in `preregistration/STAGE_1_ANALYSIS_METHOD_FREEZE.json`.

The underlying scientific choices did not change: the candidate set remains phase-aware logistic versus phase-stratified isotonic, five trajectory-level folds remain fixed, Brier remains the selection metric, and isotonic still requires an absolute Brier improvement of at least 0.002.

The added freeze only makes previously unspecified computational mechanics exact: zero initialization for phase-specific logistic fits, full 256-bit SHA-256 integer modulo for CV folds, deterministic Newton/IRLS and step-halving behavior, equal-score PAVA grouping, support-floor isotonic prediction, endpoint clamping, and no-rescue failure handling.

### Current state

```text
Stage 1 generation = COMPLETE
Stage 1 independent verification = PASS
Stage 1 readiness = PASS
Stage 1 exploratory model fitting = OPEN
Stage 1 confirmatory reuse = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

## 2026-08-20 — Stage 1 model selection and Stage 2 formal freeze

The returned frozen Stage 1 analysis result was audited before any Stage 2 scientific generation.

```text
result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
analysisId = PEC-S1-CALIBRATION-DEVELOPMENT-2026-08-19-v1
selected binary rows = 830
analysis source commit = b02fff06a63f1908cf74d1713d6a681c58c04269
analysis code dirty = false
```

### Frozen candidate decision

Phase-aware logistic failed its frozen numerical eligibility rule in CV fold 1, Mtaji:

```text
reason = maximum-iterations-without-gradient-convergence
iterations = 100
max |gradient| = 4.513435944430988e-10
required tolerance = 1e-10
```

This is not rescued by tolerance relaxation, additional iterations, an alternate optimizer, regularization, or a new model family.

Phase-stratified isotonic remained eligible:

```text
pooled CV Brier = 0.1532240986334561
pooled CV log loss = 0.6349271789417926
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

The pre-frozen selection rule therefore selects:

```text
family = phase-stratified-isotonic
reason = only-eligible-candidate
Stage 1 status = MODEL-SELECTED-EXPLORATORY
formal Stage 1 claim = not authorized
```

The full fit reconciles phase sample sizes/outcomes and is monotone nondecreasing:

```text
Namua = 327 support points / 24 blocks / n=430
Mtaji = 363 support points / 200 blocks / n=400
fullFit canonical JSON SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

The large exploratory CV-performance difference between phases is retained as development information only.

### Stage 2 formal design

The reserved Stage 2 block remains:

```text
2048 games
22300001..22302048
```

A prospective machine-readable Stage 2 spec was frozen before Stage 2 generation:

```text
stageId = PEC-S2-FORMAL-2026-08-20-v1
file = preregistration/STAGE_2_FORMAL_SPEC.json
```

The exact Stage 1 result hash and selected mapping are frozen dependencies; Stage 2 refitting is forbidden.

Stage 2 candidates overlapping Stage 1 are excluded without replacement against:

```text
all Stage 1 historicalTrajectoryHash values from generated games
all Stage 1 openingPrefixHash values from generated games
all Stage 1 ruleStateKey values from all observations
```

The formal center is held-out Brier-skill generalization versus a frozen Stage 1 phase-only reference. `CONFIRMED` requires all:

```text
paired Brier-skill one-sided 95% bootstrap lower bound > 0
pooled Brier <= 0.18
Namua Brier <= 0.25
Mtaji Brier <= 0.12
```

The paired bootstrap is phase-stratified, 10,000 replicates, selected-trajectory/state resampling, with a deterministic SHA-256 index stream and frozen non-interpolated 5% quantile convention.

Failed estimability/identity gates yield `INCONCLUSIVE`; estimable failure of any primary criterion yields `NOT-CONFIRMED`. Secondary metrics cannot rescue the primary decision.

### Stage 2 tooling and firewall

Materialized before scientific generation:

- Stage 2 source/model common library;
- formal spec validator;
- guarded production runner;
- independent verifier;
- frozen formal evaluator;
- contract test;
- non-scientific smoke;
- Stage 2 protocol/runbook;
- checkpoint and status records.

Current state:

```text
Stage 1 exploratory development = COMPLETE
Stage 1 selected model = phase-stratified isotonic
Stage 2 formal spec = FROZEN
Stage 2 technical validation = OPEN
Stage 2 scientific generation = NOT AUTHORIZED
STAGE_2_FORMAL_AUTHORIZATION.json = ABSENT by design
formal Stage 2 result = NOT YET EVALUATED
```
