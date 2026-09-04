# 実戦的逆転可能性とreply pressureの表現 — `G2-07` / `PCRPR-STUDY1`

Research Generation 2 `G2-07` — **Practical Comeback / Reply-Pressure Representation Study 1**。

日本語研究題目:

**Baoにおける実戦的逆転可能性とreply pressureの豊かな機械表現の構築・prospective検証 — reply-set width, defense-maintaining reply fraction, reply-quality distribution, punishment concentration, and opponent-policy sensitivity によるpractical comeback structureの再現可能な記述**

## 現在の状態

```text
Study = CLOSED / MAIN INTEGRATED
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds 28710001..28713072 = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
main integration = COMPLETE / PR #77 / 57f7cf2d58f0543082434cb4c3259e26e90fe02e
```

## 研究終了の要点

Stage 1のproduction計算と構造的に独立したreplay計算は、どちらも科学計算そのものを完走し、3072 games、400 roots、1429 rows、`F05_ALL`、`lambda=100`、同一の`developmentCoreSha256`を報告した。

しかしindependent replayのfull result artifactはGitHub Actionsの`CreateArtifact` timeoutにより保存されず、結果を見る前に必須と定めていたfull final exact comparerを実行できなかった。

事前固定したdecision mappingに従い、Stage 1は`STAGE1-TECHNICAL-INVALID`で終了した。これはreply-pressure representationの科学的否定ではない一方、production-only metricsをaccepted scientific evidenceへ昇格させることも認めない。

## 不変の境界

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
canonicalization = false
symmetry reduction = false
human interpretation = NOT AUTHORIZED
```

`PCEM-STUDY1`と`RCPR-STUDY1`の既存decisionは変更しない。

## 読む順序

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向けの研究概要
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — canonical study closure
3. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の終了状態と実行anchor
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 事前固定decisionとterminal decision
5. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — exact provenanceとhash
6. `results/STAGE_1_DEVELOPMENT_RESULT.json` — machine-readable final decision
7. `results/STAGE_1_TECHNICAL_POSTMORTEM.json` — artifact transport incident
8. [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — 時系列研究記録
9. [`RESUME_HERE.md`](RESUME_HERE.md) — closed-studyの再開禁止・次研究への境界

## main統合

研究branchのclosureはPR #77で`main`へ統合済みである。

```text
research integration PR = #77
research merge commit = 57f7cf2d58f0543082434cb4c3259e26e90fe02e
```

post-mainのprovenance整備はPR #78で追加統合されており、科学的decision、seed消費状態、Stage 2 non-authorizationは変更されていない。

## 次の研究

PCRPR-STUDY1では、これ以上scientific executionを行わない。次の独立machine-only agenda itemは`G2-08 — Machine Decision-Failure Taxonomy Study 1`である。

G2-08はfresh prospective studyとして開始し、PCRPR Stage 1のrows/modelをformal evidenceとして継承してはならない。
