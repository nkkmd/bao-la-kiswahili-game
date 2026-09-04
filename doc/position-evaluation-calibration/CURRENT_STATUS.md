# Current Status — Position Evaluation / Win-Rate Calibration Study 1 （現在の状態）

## 日本語での要点

formal decisionはINCONCLUSIVEで、校正modelをformalに確認したとは扱わない。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-20  
Status: **STUDY 1 CLOSED / FORMAL DECISION INCONCLUSIVE**

## Repository identity （識別と表現）

```text
baseline main HEAD = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
study branch = research/position-evaluation-winrate-calibration
Stage 1 generation source commit = c97a4f620f1a0da4e013ed55eb0fcf37fec16bf4
Stage 1 analysis source commit = b02fff06a63f1908cf74d1713d6a681c58c04269
Stage 2 generation source commit = a6f36a7cb86eab38897372680acd7eadc6f3436b
```

No closed-study formal decision was changed.

## Stage 1 （Stageの記録）

```text
stageId = PEC-S1-EXPLORATORY-2026-08-18-v1
games = 1024
seeds = 22200001..22201024
selected unique rule states = 830
Namua = 430
Mtaji = 400
verification = PASS
readiness = PASS
```

Frozen development result:

```text
phase-aware logistic = INELIGIBLE under frozen convergence rule
phase-stratified isotonic = ELIGIBLE / SELECTED
pooled CV Brier = 0.1532240986334561
Stage 1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
fullFit canonical SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

Stage 1 remains exploratory only.

## Stage 2 （Stageの記録）

```text
stageId = PEC-S2-FORMAL-2026-08-20-v1
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
games = 2048
seeds = 22300001..22302048
verification = PASS
```

Verification:

```text
gamesVerified = 2048
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
final Stage 1 overlap = 0 on trajectory / opening / rule-state identities
measurementHash = 373d780504814999466c3bc822a17b048054e8079b1c000e903a503cac9d1a33
```

Three frozen estimability gates failed:

```text
unique historical trajectories after Stage 1 firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

Therefore:

```text
FORMAL DECISION = INCONCLUSIVE
bootstrap = not decision-eligible
primary performance criteria = not decision-eligible
```

Canonical formal result SHA-256:

```text
94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
```

Descriptive-only performance:

```text
pooled Brier = 0.15550141283724248
phase-only reference Brier = 0.2510612273133199
observed paired Brier skill = +0.09555981447607745
Namua Brier = 0.22678074548187638
Mtaji Brier = 0.08012948693071474
exact log loss = non-finite; 7 boundary contradictions
```

These values do not override the failed estimability gate.

## Final interpretation boundary （結論）

Study 1 supports a reproducible phase-aware calibration research pipeline and a frozen exploratory isotonic mapping. It does not formally validate or formally reject that mapping on held-out data.

No claim is authorized for game-theoretic probability, human advantage perception, causal effect, generalization beyond the frozen population/policy, or revision of prior studies.

## Closure / no rescue （結論）

```text
additional Stage 2 games = FORBIDDEN
seed extension = FORBIDDEN
overlap replacement = FORBIDDEN
readiness-threshold relaxation = FORBIDDEN
Stage 1 mapping refit = FORBIDDEN
formal relabeling from descriptive metrics = FORBIDDEN
```

Any calibration re-evaluation requires a new prospective independent study with fresh data.

## Canonical closure records （結論）

- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `STAGE_2_FORMAL_RESULT.md`
- `REPRODUCIBILITY_INDEX.md`
- `results/STAGE_2_FORMAL_RESULT_SUMMARY.json`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`

Repository closure cross-audit of root `README.md`, `doc/RESEARCH_INDEX.md`, and `doc/FUTURE_RESEARCH_AGENDA.md` is the final integration step before any main merge.
