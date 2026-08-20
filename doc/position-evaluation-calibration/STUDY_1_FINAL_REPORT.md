# Position Evaluation / Win-Rate Calibration Study 1 — Final Report

更新日: 2026-08-20  
Status: **STUDY 1 CLOSED / FORMAL DECISION INCONCLUSIVE**

## Executive summary

This prospective independent study tested whether actor-perspective static `bao` evaluation can be mapped to empirical continuation win probability under a frozen Bao state population and deterministic continuation policy.

Stage 0 established evaluator, phase, outcome, identity, and truncation semantics. Stage 1 used a fresh exploratory corpus to select between two prospectively enumerated calibration families. Phase-aware logistic became ineligible under its frozen numerical-convergence rule; phase-stratified isotonic remained eligible and was selected without rescue.

Stage 2 then froze that exact isotonic mapping and evaluated it on a fresh 2,048-game corpus with strict Stage 1 identity exclusion. The Stage 2 corpus was technically valid: all games replayed exactly, all measurements matched, and final historical-trajectory, opening-prefix, and rule-state overlap with Stage 1 was zero.

However, three preregistered estimability gates failed after the Stage 1 identity firewall and no-replacement selection rules reduced usable support. Under the frozen decision tree, formal performance criteria were therefore not eligible for evaluation and the final result is:

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
```

Descriptive Brier performance was favorable, but it cannot rescue the formal result.

---

## 1. Research question

The study asked:

> Can static actor-perspective `bao` evaluation be prospectively transformed into a phase-aware empirical continuation win-probability mapping that generalizes to fresh held-out Bao positions?

The estimand was explicitly conditional:

```text
P(actor wins | evaluation,
                 frozen continuation policy,
                 frozen sampled state population,
                 frozen source/version)
```

This is not a game-theoretic probability, human judgment probability, or causal effect of the evaluation score.

---

## 2. Inherited scientific boundaries

The study did not reopen completed Bao studies.

Immutable inherited boundaries included:

```text
Position Complexity Study 1:
  PCX-H1 = INCONCLUSIVE
  PCX-H2 = NOT-CONFIRMATORILY-EVALUATED

Tactical Motifs Study 1:
  C01 = NOT-CONFIRMED
  C02 = NOT-CONFIRMED
  C03 = CONFIRMED
  C04 = NOT-CONFIRMED

TM-S2-C03 Human / Expert Validation Study 1:
  machineEvidence = CONFIRMED
  humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
  humanExpertN = 0

Namua→Mtaji Study 1:
  formal decision = NOT-CONFIRMED
  deterministic first-Mtaji clock retained
```

Calibration results cannot revise any of these labels.

---

## 3. Stage 0 — construct and technical validation

Primary score:

```text
AI.evaluate(state, state.player)
evaluationProfile = bao
```

Important semantic findings:

- evaluation is actor/player-relative;
- terminal values are ±1,000,000;
- ordinary static scores are not probabilities and are not probability-clipped;
- default `bao` weights are phase-specific;
- hard/phase2/D2 continuation is deterministic for fixed state/options;
- max-ply unresolved outcomes are administrative truncation, not draws;
- trajectory and rule-state identity keys are available for pseudoreplication control.

Stage 0 smoke validation passed deterministic replay, perspective antisymmetry, source hashing, and authorization-firewall checks before scientific generation.

---

## 4. Stage 1 — exploratory calibration development

Stage ID:

```text
PEC-S1-EXPLORATORY-2026-08-18-v1
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
```

Fresh corpus:

```text
games = 1024
seeds = 22200001..22201024
opening = 8-ply seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
```

Outcome-blind selection and independent verification yielded:

```text
unique historical trajectories = 872
selected unique rule states = 830
Namua = 430
Mtaji = 400
administrative truncation = 0
measurementHash = 0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa
verification = PASS
```

All Stage 1 readiness gates passed.

### 4.1 Candidate families

Prospectively enumerated candidates:

```text
1. phase-aware logistic
2. phase-stratified isotonic PAVA
```

Five deterministic trajectory-level CV folds were used. Primary selection metric was pooled out-of-fold Brier score. Isotonic could displace logistic only under the frozen selection rule; technical candidate failure had a no-rescue policy.

### 4.2 Logistic candidate

The logistic candidate became ineligible in CV fold 1, Mtaji:

```text
iterations = 100
max |gradient| = 4.513435944430988e-10
required tolerance = 1e-10
reason = maximum-iterations-without-gradient-convergence
```

No additional iterations, alternate optimizer, tolerance relaxation, or regularization was introduced after observing this result.

### 4.3 Isotonic candidate

The phase-stratified isotonic candidate remained eligible:

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
Namua: n=430 / 327 support points / 24 monotone blocks
Mtaji: n=400 / 363 support points / 200 monotone blocks
fullFit canonical JSON SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

Stage 1 remained exploratory and could not itself support a formal calibration claim.

---

## 5. Stage 2 — prospective formal design

Stage ID:

```text
PEC-S2-FORMAL-2026-08-20-v1
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
```

Fresh corpus:

```text
games = 2048
seeds = 22300001..22302048
opening = 8-ply seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
```

The exact Stage 1 isotonic mapping was hash-bound before Stage 2 generation. Refit, smoothing, and primary probability clipping were prohibited.

### 5.1 Cross-stage identity firewall

Stage 2 excluded Stage 1 overlap on:

```text
historicalTrajectoryHash — all Stage 1 generated games
openingPrefixHash — all Stage 1 generated games
ruleStateKey — all Stage 1 observations
```

Exclusions used no replacement and no seed extension.

### 5.2 Formal decision rule

Formal `CONFIRMED` required every estimability/identity/verification gate and all of:

```text
paired Brier-skill one-sided 95% bootstrap lower bound > 0
pooled frozen-model Brier <= 0.18
Namua frozen-model Brier <= 0.25
Mtaji frozen-model Brier <= 0.12
```

If all gates passed but any criterion failed, the result would be `NOT-CONFIRMED`.

If any estimability or identity gate failed, the result would be `INCONCLUSIVE` and the bootstrap/criteria branch would not be formally evaluated.

---

## 6. Stage 2 corpus validity

Generation:

```text
games = 2048
seed range = 22300001..22302048
source commit = a6f36a7cb86eab38897372680acd7eadc6f3436b
sourceTreeDirty = false
```

Independent verification:

```text
passed = true
gamesVerified = 2048
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
measurementHash = 373d780504814999466c3bc822a17b048054e8079b1c000e903a503cac9d1a33
```

Final Stage 1 overlap:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

The formal corpus is therefore technically valid under the frozen verifier.

---

## 7. Stage 2 selection and estimability

Selection accounting:

```text
unique historical trajectories before Stage 1 firewall = 1618
Stage 1 trajectory overlaps excluded = 235
Stage 1 opening-prefix overlaps excluded = 0
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

Failed gates:

```text
1383 < 1600 required unique trajectories after firewall
1290 < 1500 required selected unique rule states
627  < 650 required Mtaji selected states
```

Passed gates included Namua count, distinct opening prefixes, distinct static scores, win/loss support in both phases, zero truncation, zero final Stage 1 overlap, and independent verification.

Because not all gates passed:

```text
formal estimability = FAIL
```

---

## 8. Formal result

Frozen rule application:

```text
FORMAL DECISION = INCONCLUSIVE
bootstrap = null
primary criteria = null
```

This is the canonical Study 1 formal outcome.

The result is inconclusive because the formal support population fell below preregistered minimums after strict identity isolation and no-replacement rules. It is not a technical verification failure.

---

## 9. Descriptive results after the gate decision

For transparency, the frozen evaluator recorded descriptive performance on the 1,290 selected binary states:

```text
frozen model Brier = 0.15550141283724248
phase-only reference Brier = 0.2510612273133199
observed paired Brier skill = +0.09555981447607745
pooled calibration bias = -0.04426561163702176
pooled ECE = 0.05214158062926888
```

By phase:

```text
Namua:
  n = 663
  model Brier = 0.22678074548187638
  reference Brier = 0.2520648314241053
  raw-static AUC = 0.708638333515423

Mtaji:
  n = 627
  model Brier = 0.08012948693071474
  reference Brier = 0.25
  raw-static AUC = 0.9603788250695467
```

The absolute Brier values are below the preregistered thresholds, but those criteria were never formally entered because estimability failed first. The positive observed skill likewise lacks the preregistered paired-bootstrap lower bound because bootstrap evaluation was blocked.

Exact unclipped log loss was non-finite due to seven boundary contradictions from exact 0/1 isotonic probabilities:

```text
Namua contradictions = 2
Mtaji contradictions = 5
pooled = 7
```

These are descriptive observations only.

---

## 10. Final scientific conclusion

The study established a reproducible calibration-development and held-out-evaluation pipeline and demonstrated that the frozen Stage 1 isotonic mapping can be transported technically to a fresh corpus without identity leakage.

It did **not** obtain enough preregistered effective Stage 2 support to adjudicate the formal held-out calibration claim.

Final state:

```text
Stage 0 = COMPLETE / TECHNICAL PASS
Stage 1 = COMPLETE / EXPLORATORY MODEL SELECTED
Stage 2 = COMPLETE / VERIFIED / ESTIMABILITY FAIL
OVERALL FORMAL DECISION = INCONCLUSIVE
```

This does not establish either formal calibration success or formal calibration failure.

---

## 11. Interpretation boundary

Supported:

- actor-relative static evaluation and empirical continuation outcome can be reproducibly linked in a phase-aware pipeline;
- Stage 1 selected a deterministic isotonic mapping under frozen candidate rules;
- Stage 2 generated and independently verified a fresh formal corpus;
- cross-stage identity overlap was eliminated;
- the current formal question closes as inconclusive due to prespecified support gates.

Not supported:

- a formally validated score-to-win-probability mapping;
- a formal null/miscalibration result;
- game-theoretic win probability;
- human perception of advantage;
- causal claims;
- generalization beyond the frozen engine/evaluator/population/policy;
- retrospective rescue of any prior research result.

---

## 12. Why no rescue is performed

After Stage 2 data exist, adding games, extending seeds, replacing overlap exclusions, lowering minimum counts, changing phase assignment, modifying the mapping, clipping probabilities, changing the bootstrap, or using descriptive Brier thresholds to bypass the gate would alter the frozen formal study.

Those changes are not used to rewrite Study 1.

---

## 13. Recommended next work

Two paths are scientifically distinct.

### A. Fresh calibration replication

If formal calibration validation is itself the goal, conduct a new prospective independent replication that anticipates Stage 1 identity-firewall attrition when setting initial game count and estimability thresholds. Use a fresh seed block and freeze the full design before new outcomes.

### B. Bad-move / misconception research

The planned bad-move study may proceed as a new independent study, but this Study 1 isotonic mapping must not be described as a formally validated win-probability instrument. It may be retained as exploratory/descriptive context. Formal bad-move severity should preferably rely on fresh continuation outcomes or another prospectively valid endpoint rather than assuming the calibration question was confirmed.

---

## 14. Canonical records

```text
doc/position-evaluation-calibration/STUDY_1_OVERVIEW.md
doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md
doc/position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md
doc/position-evaluation-calibration/REPRODUCIBILITY_INDEX.md
doc/position-evaluation-calibration/CURRENT_STATUS.md
doc/position-evaluation-calibration/EXPERIMENT_INDEX.md
doc/position-evaluation-calibration/DECISION_REGISTER.md
doc/position-evaluation-calibration/RESEARCH_LOG.md
```
