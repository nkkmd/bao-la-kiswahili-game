# Position Evaluation / Empirical Outcome Calibration Replication Study 1 — Overview

Program label: `G2-01`
Study ID: `PEOCR-STUDY1`
Research Generation: **Research Generation 2**
Status: **COMPLETE / formal decision `INCONCLUSIVE`**

## 何を調べたか

Research Generation 1のPosition Evaluation / Win-Rate Calibration Study 1 (`PEC-STUDY1`) は、strict identity firewall後のformal populationが事前estimability gateへ届かず`INCONCLUSIVE`で閉じた。本Studyはそのdecisionを変更・救済せず、新しいfresh populationとStudy IDを用いて、actor-relative static Bao evaluationとempirical continuation outcomeのheld-out calibrationを再検証した。

研究とAI engineeringは分離し、public Bao AIの棋力、deployment、AI generation promotionはscientific endpointにしていない。

## 設計

```text
Stage 0 = technical validation
Stage 1 = 2,048 fresh development games
Stage 2 = 8,192 fresh held-out formal games
state identity = RAW pits,reserve,houseOwned,player,phase,winner,pending
Stage 1 -> Stage 2 firewall = trajectory + opening prefix + RAW state
mapping = phase-stratified isotonic PAVA
formal clipping = [0.01, 0.99]
Stage 2 refit = forbidden
```

Stage 1は全readiness gateを通過し、`MODEL-FROZEN-DEVELOPMENT`としてPAVA mappingをfreezeした。

## Stage 2の結果

8,192/8,192局を固定8 shardで生成し、全shardを独立replayした。統合後のselection/measurementも独立verificationをPASSし、Stage 1とのcross-stage overlapはtrajectory / opening-prefix / RAW-stateすべて0だった。

しかし、事前固定したestimability gateのうち3項目が未達だった。

| Gate | observed | required | result |
| --- | ---: | ---: | --- |
| unique historical trajectories after Stage 1 firewall | 3,898 | >= 4,500 | FAIL |
| selected unique RAW states | 3,570 | >= 4,000 | FAIL |
| Namua selected states | 1,823 | >= 1,750 | PASS |
| Mtaji selected states | 1,747 | >= 1,750 | FAIL |

Mtajiは3 state不足だったが、追加seed、replacement、gate relaxationは事前に禁止されているため実施していない。

## Formal decision

```text
PEOCR-STUDY1 = INCONCLUSIVE
```

これはcalibration modelが`NOT-CONFIRMED`だったことを意味しない。estimability gateが全PASSしなかったため、co-primary Brier skill / log-loss skillとBrier maximaによるformal success criteriaには入っておらず、canonical resultでは`primary = null`である。

## 解釈境界

本結果からgame-theoretic winning probability、人間の形勢認知、因果効果、public AI品質、別population/search policyへの一般化は主張しない。

同じStage 2 dataへの追加game、seed extension、identity-overlap replacement、gate relaxation、mapping refit、favorable subgroupによるformal救済は行わない。再検証する場合は新しいprospective Study / versioned protocolとfresh evidenceを必要とする。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
