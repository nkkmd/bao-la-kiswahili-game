# Position Evaluation / Empirical Outcome Calibration Replication Study 1 — Protocol

Protocol freeze date: 2026-08-26
Closure status note: 2026-08-27
Status: **FROZEN PROSPECTIVE PROTOCOL / STUDY COMPLETE / formal decision `INCONCLUSIVE`**
Program label: `G2-01`
Study ID: `PEOCR-STUDY1`
Research generation: **Research Generation 2**

> Post-closure note: the protocol body below preserves the prospective, pre-outcome contract and therefore intentionally retains future-tense and pre-authorization wording. Current execution state and the final scientific decision are recorded in [`CURRENT_STATUS.md`](CURRENT_STATUS.md), [`DECISION_REGISTER.md`](DECISION_REGISTER.md), and [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md). No protocol threshold, endpoint, identity rule, or decision rule was changed after outcomes.

## 1. 研究題目

**Baoにおける形勢評価値と経験的継続結果の校正再検証 — strict identity firewall下でのfresh held-out replication**

English working title:

**Position Evaluation / Empirical Outcome Calibration Replication Study 1**

## 2. 中心課題

> actor-relative static `bao` evaluation と fresh empirical continuation outcome の対応を、Research Generation 1 の `PEC-STUDY1` を救済せず、identity-firewall attrition を事前に見込んだ十分な fresh population で formal に再検証できるか。

本Studyは`doc/FUTURE_RESEARCH_AGENDA.md`の`G2-01`を具体化した新規・prospective・独立Studyである。`G2-01`はAgenda上の順序ラベルであり、本Studyの正式IDは`PEOCR-STUDY1`とする。

## 3. Upstream boundary

Research Generation 1 `Position Evaluation / Win-Rate Calibration Study 1` (`PEC-STUDY1`) のformal decisionは `INCONCLUSIVE` のままimmutableである。

Research Generation 1で観測された以下は、第二世代の**resource planning / failure-mode identification**にのみ利用する。

- strict cross-stage identity firewall自体はtechnicalに成立した。
- Stage 2の最終overlapはhistorical trajectory / opening prefix / rule stateの全軸で0だった。
- 2,048 formal gamesでは、firewall後のunique trajectory、selected state、Mtaji stateの3 gateが未達だった。
- frozen isotonic mappingのdescriptive Brierは良好だったがformal criteria branchには入っていない。
- unclipped isotonic 0/1 predictionではboundary contradictionによりlog lossがnon-finiteになった。

これらは`PEC-STUDY1`のformal evidenceとして再計算・追加・救済しない。本Studyのformal evidenceへResearch Generation 1 rowを混ぜない。

## 4. Scientific constructs

明確に分離する。

```text
engine evaluation
empirical continuation outcome
game-theoretic value
search reliability
human advantage perception
public-AI quality
```

Primary score:

```text
AI.evaluate(state, state.player)
evaluationProfile = bao
z = staticBaoEvaluation / 100
```

Outcome:

```text
1 = final winner equals selected actor
0 = final winner equals selected actor opponent
```

`winner === null` at `maxPly=160` はadministrative truncationでありdrawではない。

Formal estimand:

```text
held-out empirical continuation-outcome calibration
conditional on:
  frozen evaluator
  frozen continuation policy
  frozen opening/state population
  frozen selection rule
  frozen Stage 1 mapping
```

game-theoretic probability、human judgment probability、causal effect、public AI strengthはclaimしない。

## 5. Authoritative state identity

G2 common contractに従い、formal identityはRAWのみとする。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`はidentityに含めない。

SIP-STUDY1 / ORISC-STUDY1でformal validationされていないreflection、seat swap、symmetry quotient、canonicalizationをdeduplicationへ使用しない。

## 6. Frozen research instrument

Study-start baseline `main`:

```text
9e9cb6e2525f09a873e741db9f8fa42696839fbe
```

Research branch:

```text
research/g2-01-position-evaluation-empirical-outcome-calibration-replication
```

Frozen continuation family:

```text
level = hard
evaluationProfile = bao
searchProfile = phase2
maxDepth = 2
timeLimitMs = Infinity
quiescenceDepth = 1
orderQuiescenceCaptures = false
adaptive = false
stableBestDepths = 0
aspirationWindow = 0
post-opening random move choice = false
maxPly = 160
```

Source files and exact SHA-256 valuesは各stage authorization前に別途freezeする。後続のpublic AI変更をretroactiveにresearch instrumentへ取り込まない。

## 7. Stage structure

### Stage 0 — Technical validation

Stage ID:

`PEOCR-S0-TECHNICAL-2026-08-26-v1`

32 smoke seeds (`24010001..24010032`) はtechnical fixture専用とし、科学的evidenceへ再利用しない。

Mandatory checksは、evaluator determinism、RAW identity、64-seed conservation、trajectory/opening identity、PAVA、prediction clipping、Brier/log loss、bootstrap、calibration slope/intercept diagnostic、hash/authorization firewallである。

Stage 0 PASS前にStage 1 scientific generationをauthorizeしない。

### Stage 1 — Fresh calibration development

Stage ID:

`PEOCR-S1-DEVELOPMENT-2026-08-26-v1`

```text
games = 2,048
seeds = 24011001..24013048
opening = 8-ply seeded-uniform exact E.moveVariants
```

Stage 1はfresh development evidenceでありformal confirmationではない。

Primary mapping familyは結果を見る前に**phase-stratified isotonic PAVA**へ固定する。candidate family selectionは行わない。

Research Generation 1のmapping parameterは再利用しない。Stage 1で新たにfitしたmappingをStage 2前にhash-freezeする。

PredictionはPAVA fit後、formal metrics用に prospectively fixed `clip(p, 0.01, 0.99)` を適用する。このclipping ruleはStage 2 outcome後に変更しない。

Stage 1 readiness minima:

```text
unique historical trajectories >= 1500
selected unique RAW states >= 1400
Namua selected >= 600
Mtaji selected >= 600
distinct static evaluations per phase >= 100
actor wins per phase >= 150
actor losses per phase >= 150
administrative truncation rate <= 0.01
```

1つでもFAILならStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`で、同じStage 1 dataへのseed extension / gate relaxation / replacementは行わない。

### Stage 2 — Fresh formal held-out replication

Stage ID:

`PEOCR-S2-FORMAL-2026-08-26-v1`

Reserved population:

```text
games = 8,192
seeds = 24020001..24028192
```

Stage 2 generationは、Stage 1 verified model freeze、exact source/model hashes、non-scientific Stage 2 smoke PASS、explicit authorization commitの後にのみ実施する。

## 8. Cross-stage identity firewall

Stage 1 reference universe:

```text
historicalTrajectoryHash = all Stage 1 generated games
openingPrefixHash        = all Stage 1 generated games
rawStateKey              = all Stage 1 observations
```

Stage 2ではいずれか1軸でもStage 1 overlapするunitを**exclude without replacement**する。

禁止:

- seed extension
- overlap unit replacement
- unavailable assigned-phase replacement
- duplicate selected RAW-state replacement
- outcome-dependent extension

Stage 2 final formal overlap requirementは全3軸でexactly 0とする。

## 9. Stage 2 estimability gates

```text
unique historical trajectories after Stage 1 firewall >= 4500
selected unique RAW states >= 4000
Namua selected >= 1750
Mtaji selected >= 1750
distinct opening prefixes >= 1000
distinct static evaluations per phase >= 150
actor wins per phase >= 400
actor losses per phase >= 400
administrative truncation rate <= 0.01
Stage 1 historicalTrajectory overlap = 0
Stage 1 openingPrefix overlap = 0
Stage 1 RAW-state overlap = 0
```

これらはResearch Generation 1のgateを結果後に緩和したものではなく、新Studyの8,192-game populationに対してoutcome前に固定する新しいestimability contractである。

## 10. Formal model and reference

Formal model:

- exact verified Stage 1 phase-stratified isotonic PAVA mapping
- Stage 2 refit禁止
- `clip(p,0.01,0.99)`固定
- smoothing / clipping rule変更禁止

Reference:

- Stage 1 selected-state actor-win rate by phase
- Stage 2 generation前にfreeze

## 11. Primary formal evaluation

Co-primary proper-score evidence:

1. paired Brier skill over phase-only reference
2. paired log-loss skill over phase-only reference

Uncertainty:

```text
phase-stratified nonparametric paired bootstrap
replicates = 20,000
resampling unit = selected unique trajectory/state
one-sided confidence = 95%
deterministic bootstrap index stream
```

`CONFIRMED`には、全estimability/identity/verification gateに加えて以下をすべて要求する。

```text
paired Brier-skill lower 95% bound > 0
paired log-loss-skill lower 95% bound > 0
pooled Brier <= 0.18
Namua Brier <= 0.25
Mtaji Brier <= 0.12
```

最後の3 thresholdはResearch Generation 1で使用されたtargetsを**新Studyのprospective replication targets**として再採用するものであり、Research Generation 1 resultを再判定しない。

Decision tree:

```text
all gates + all criteria PASS -> CONFIRMED
all gates PASS + any criterion FAIL -> NOT-CONFIRMED
any estimability/identity gate FAIL -> INCONCLUSIVE
```

## 12. Required calibration diagnostics

Primary decisionの救済には使用しないが、最低限以下を必ず報告する。

- phase-specific calibration bias
- fixed-decile reliability table
- ECE
- phase-specific calibration intercept
- phase-specific calibration slope
- 95% bootstrap CI for intercept/slope
- raw-score AUC by phase

Calibration slope/interceptは

```text
logit(P(y=1)) = intercept + slope * logit(modelPrediction)
```

をphase別にfitする。secondary diagnosticのfit failureは記録し、別optimizerやtolerance変更で結果後に救済しない。

## 13. Stop / no-rescue rules

Stage 1 / Stage 2とも固定game数で終了する。

結果を見た後の以下は禁止する。

- seed追加
- opening rule変更
- state selection変更
- identity firewall緩和
- mapping family変更
- Stage 2 refit
- clipping幅変更
- bootstrap変更
- primary threshold変更
- favorable subgroupへのformal target置換
- Research Generation 1 rowsとのpooled formal analysis

negative / `NOT-CONFIRMED` / `INCONCLUSIVE` / non-estimableは正常なclosure outcomeとして保存する。

## 14. Research / engineering separation

public AIの棋力、AI-GEN2/AI-GEN3昇格、latency、UX、deployment successは本Studyのendpointではない。

本Study結果が将来engineering inputになることはあり得るが、engineering outcomeによって本StudyまたはResearch Generation 1のformal decisionを変更しない。
