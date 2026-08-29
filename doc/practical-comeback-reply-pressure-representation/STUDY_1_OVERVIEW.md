# Practical Comeback / Reply-Pressure Representation Study 1 — Overview

更新日: 2026-08-29
Status: **CLOSED / STAGE1-TECHNICAL-INVALID / MAIN NOT INTEGRATED**

## Study identity

```text
Program = G2-07 / Research Generation 2
Study ID = PCRPR-STUDY1
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

日本語研究題目:

> **Baoにおける実戦的逆転可能性とreply pressureの豊かな機械表現の構築・prospective検証 — reply-set width, defense-maintaining reply fraction, reply-quality distribution, punishment concentration, and opponent-policy sensitivity によるpractical comeback structureの再現可能な記述**

## 研究目的

`PCEM-STUDY1`のzero promotionを救済せず、reply-centeredな豊かなmachine representationによりpolicy-sensitive practical-comeback structureをfresh evidence上で再現可能に記述できるかを問う独立研究として実施した。

`RCPR-STUDY1`のtechnical-invalid resultも変更せず、そのfloating-point ordering failureだけをpre-outcome technical lessonとして取り込んだ。

## Representation

Primary unit:

```text
historically observed RAW root occurrence × exact root-move variant
```

12 prospectively declared families:

```text
REPLY_SET_WIDTH
DEFENSE_MAINTAINING_REPLY_FRACTION
REPLY_QUALITY_DISTRIBUTION
PUNISHMENT_CONCENTRATION
BEST_REPLY_GAP_VECTOR
FORCING_REPLY_STRUCTURE
REPLY_BRANCH_ASYMMETRY
REPLY_SEARCH_STABILITY
OPPONENT_POLICY_SENSITIVITY
ROOT_MOVE_REFERENCE_CONTEXT
LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE
LOCAL_TEMPORAL_CONTEXT
```

Continuation/future outcomesはpredictorから除外した。

## RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`、`reason`は除外。symmetry/canonicalizationは未承認。

## Stage 0

80-scalar representationについてproduction/independent exact equalityをtechnical fixturesで確認し、`STAGE0-TECHNICAL-PASS`。

## Stage 1

Fresh block:

```text
3072 games
seeds 28710001..28713072
400 roots / Namua 200 / Mtaji 200
1429 development rows
```

Productionはsupport/performance gatesを通過し、`F05_ALL` / lambda `100`を選択した。

独立replayの科学計算も完走し、productionと同一development-core SHA256を報告した。しかしfull independent artifactがGitHub Actions artifact transport timeoutで保存されず、frozen full final exact comparerを実行できなかった。

## Final decision

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 block = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

これはrepresentationの科学的negative resultではない。またproduction-only metricsをvalidated scientific evidenceとして採用することもできない。

## Human boundary

machine reply pressureはhuman difficulty、deception、error probability、psychology、expert recognitionを意味しない。

## Closure records

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`

## Next program item

次の独立machine-only agenda itemは`G2-08 — Machine Decision-Failure Taxonomy Study 1`。PCRPR Stage 1 rows/modelをformal evidenceとして継承しない。

main integrationはまだ行っていない。
