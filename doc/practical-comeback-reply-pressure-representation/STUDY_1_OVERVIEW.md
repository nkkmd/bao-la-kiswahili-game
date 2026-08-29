# G2-07 / PCRPR-STUDY1 — 研究概要

更新日: 2026-08-29  
状態: **CLOSED / STAGE1-TECHNICAL-INVALID / MAIN INTEGRATED**

## 研究識別

```text
Program = G2-07 / Research Generation 2
Study ID = PCRPR-STUDY1
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

日本語研究題目:

> **Baoにおける実戦的逆転可能性とreply pressureの豊かな機械表現の構築・事前規定検証 — reply-set width, defense-maintaining reply fraction, reply-quality distribution, punishment concentration, and opponent-policy sensitivity によるpractical comeback structureの再現可能な記述**

## この研究は何を調べたのか

`PCEM-STUDY1`の候補昇格0件という結果を救済せず、replyを中心とした豊かな機械表現によって、policy-sensitiveなpractical-comeback structureを新しい独立証拠上で再現可能に記述できるかを検討した。

`RCPR-STUDY1`の`STAGE1-TECHNICAL-INVALID`も変更していない。G2-06で確認されたfloating-point ordering failureは、G2-07の科学的結果として再利用するのではなく、結果を見る前のtechnical lessonとしてのみ取り込んだ。

## 表現設計

主な分析単位は次のとおりである。

```text
historically observed RAW root occurrence × exact root-move variant
```

結果を見る前に、次の12 feature familyを固定した。

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

continuationやfuture outcomeに由来する情報はpredictorから除外した。

## RAW state identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`は除外した。symmetry reductionとcanonicalizationは承認していない。

## Stage 0 — 技術検証

80-scalar representationについて、production実装と構造的に独立した実装とのexact equalityをtechnical fixtureで確認した。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
```

Stage 0はtechnical-onlyであり、G2-07の科学的outcomeを生成していない。

## Stage 1 — 新規development block

```text
3072 games
seeds 28710001..28713072
400 roots / Namua 200 / Mtaji 200
1429 development rows
```

production側ではsupport/performance gateを通過し、`F05_ALL`と`lambda=100`が選択された。

独立replayの科学計算そのものも完走し、productionと同一のdevelopment-core SHA256をterminal stdoutで報告した。しかしfull independent result artifactがGitHub Actionsのartifact transport timeoutにより保存されず、事前に必須と定めたfull final exact comparerを実行できなかった。

## 最終判断

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 block = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

これはreply-pressure representationの科学的なnegative resultではない。同時に、production-only metricsをvalidated scientific evidenceとして採用することもできない。

## 人間への解釈境界

ここでいうmachine reply pressureは、人間にとっての難しさ、欺瞞、誤答確率、心理的圧力、expert recognitionを意味しない。

## main統合

研究closureはPR #77で`main`へ統合済みである。

```text
research integration PR = #77
research merge commit = 57f7cf2d58f0543082434cb4c3259e26e90fe02e
```

その後のpost-main closure文書整備もPR #78で統合済みであり、科学的判断には変更を加えていない。

## 詳細記録

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`

## 次の研究

次の独立machine-only agenda itemは`G2-08 — Machine Decision-Failure Taxonomy Study 1`である。PCRPR Stage 1のrows/modelをG2-08のformal evidenceとして継承してはならない。
