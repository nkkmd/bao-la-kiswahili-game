# Stage 2 Formal Protocol — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20
Status: **FROZEN / TECHNICAL VALIDATION PENDING / GENERATION NOT AUTHORIZED**

## 1. Formal role

Stage 2 is the fresh held-out confirmation stage for H3/Q3. It does not refit or rescue the Stage 1 mapping.

Frozen mapping source:

```text
Stage 1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
selected family = phase-stratified isotonic
score transform = staticBaoEvaluation / 100
```

Prediction is phase-specific, support-floor stepwise isotonic with endpoint clamping. No Stage 2 smoothing, clipping, recalibration, or parameter update is allowed for the primary Brier evaluation.

## 2. Fresh population

```text
games = 2048
seeds = 22300001..22302048
opening = first 8 plies seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
```

No early stop, extension, or outcome-dependent replacement is allowed.

## 3. Cross-stage identity firewall

Stage 2 excludes, without replacement, any candidate that overlaps Stage 1 on:

- historical trajectory hash against all Stage 1 generated games;
- opening-prefix hash against all Stage 1 generated games;
- rule-state key against all Stage 1 observations.

Within Stage 2, historical-trajectory duplicates are collapsed before state selection and selected rule-state duplicates are collapsed after selection.

## 4. Outcome-blind state selection

```text
minimum ply = 8
one selected state maximum per unique trajectory
phase assignment salt = PEC-S2-PHASE-v1
within-phase state-rank salt = PEC-S2-STATE-v1
unavailable phase = no replacement
duplicate rule state = no replacement
```

Administrative max-ply truncation is not a draw and contributes no binary outcome.

## 5. Estimability/readiness

Formal evaluation is `INCONCLUSIVE` if any frozen gate fails:

```text
unique Stage 2 historical trajectories after Stage 1 trajectory/opening firewall >= 1600
selected unique rule states >= 1500
Namua selected >= 650
Mtaji selected >= 650
distinct opening prefixes >= 400
distinct static evaluations per phase >= 100
actor wins per phase >= 150
actor losses per phase >= 150
administrative truncation <= 1%
final Stage 1 trajectory overlap = 0
final Stage 1 opening-prefix overlap = 0
final Stage 1 rule-state overlap = 0
independent verification = PASS
```

No failed gate authorizes additional games.

## 6. Primary formal estimand

The frozen mapping is compared with a frozen phase-only reference derived from Stage 1 development data:

```text
Namua reference p = 190 / 430 = 0.4418604651162791
Mtaji reference p = 200 / 400 = 0.5
```

Per selected Stage 2 state:

```text
skill_i = (p_reference - y)^2 - (p_frozen_model - y)^2
```

Positive skill means lower Brier loss for the frozen model.

## 7. Finite-sample uncertainty

A paired, phase-stratified nonparametric bootstrap is frozen:

```text
replicates = 10,000
resampling unit = selected unique trajectory/state
resampling is within phase
index stream = SHA256(PEC-S2-BOOT-v1|replicate|phase|draw) modulo phase n
one-sided lower confidence level = 95%
quantile = sorted bootstrap means at floor(0.05*(B-1)); no interpolation
```

## 8. Formal decision

`CONFIRMED` requires all estimability gates and all four criteria:

```text
one-sided 95% lower bound of paired Brier skill > 0
pooled frozen-model Brier <= 0.18
Namua frozen-model Brier <= 0.25
Mtaji frozen-model Brier <= 0.12
```

If estimable but any criterion fails, decision = `NOT-CONFIRMED`.

If any estimability/identity gate fails, decision = `INCONCLUSIVE`.

No secondary metric may rescue the primary decision.

## 9. Key secondary

Prespecified reports:

- phase-specific Brier;
- pooled and phase calibration bias;
- fixed-decile reliability/ECE;
- exact log loss with no probability clipping; any contradiction at p=0 or p=1 makes log loss explicitly infinite;
- phase-specific AUC of raw static score, ties = 0.5, interpreted as association/discrimination only.

## 10. Structural heterogeneity

Descriptive-only groups:

- forced capture: false / true;
- actor seat: 0 / 1;
- legal moves: 1 / 2–3 / >=4;
- capture moves: 0 / 1 / >=2;
- actor house ownership: false / true;
- actor nyumba seeds: 0 / >0.

Report Brier only where group n >= 30; otherwise n only. These analyses cannot alter the formal decision.

## 11. Authorization firewall

The Stage 2 spec does not authorize generation. Before scientific generation, a non-scientific technical smoke must PASS and return exact source-file SHA-256 values. A separate `STAGE_2_FORMAL_AUTHORIZATION.json` must then bind the exact spec SHA-256 and source mapping.

Until that artifact exists:

```text
Stage 2 scientific generation = NOT AUTHORIZED
Stage 2 formal evaluation = NOT RUN
```

## 12. Interpretation boundary

A future Stage 2 confirmation would establish only held-out empirical win-probability generalization under the frozen evaluator, population, continuation, selection, and mapping. It would not establish game-theoretic value, causal effect, human perception, or revise any prior study decision.
