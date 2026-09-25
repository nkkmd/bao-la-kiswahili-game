# Research Generation 4 — 入口

更新日: 2026-09-25  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION / G4-03 COMPLETE / G4-04 COMPLETE`**

## このProgramが調べること

第四世代研究は、Research Generation 3で測定可能になったbounded RAW local game-tree geometryについて、主に次を検証する。

1. 別phase、root family、source policy、rule contextへどこまで移送できるか。
2. 完全解析可能な限定domainでexact game-theoretic consequenceとどう関係するか。
3. 時間的持続、rule-semantic event、search reliabilityとどう結びつくか。

第三世代のclosed Studyをrepairまたは再判定するProgramではない。各Studyはfresh evidence、事前登録、独立検証、no-rescue boundaryを用いる。

## 現在の状態

| Wave | Agenda | 目的 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| A | `G4-03` | G3-07由来width / search-ranking transfer | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| A | `G4-04` | G3-10由来geometry-trajectory transfer | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN NOT INTEGRATED` |
| B | `G4-05` | exact microdomain oracle foundation | `NEXT CORE CANDIDATE / NOT AUTHORIZED` |
| B | `G4-06` | geometry / exact consequence bridge | `DEPENDENCY-GATED / NOT AUTHORIZED` |
| C | `G4-07..G4-09` | memory、rule-semantic transition、search reliability | `NOT AUTHORIZED` |
| D | `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT AUTHORIZED / NOT ACCESSED` |
| 独立 | `G4-P01` | canonicalization re-foundation | `NOT AUTHORIZED` |
| 独立 | `G4-H01` | human / expert evidence | `DEFERRED` |

Public AI change authorized by RG4 = `false`。

## G4-01 — compatibility/readiness

G4-01 `LGTTCI-STUDY1` はSFCDF・SILGM・GCLDの3 familyを`COMPATIBILITY-ELIGIBLE-ALL`とした。これはgeneralizationそのものの確認ではない。

## G4-02 — corridor / tree-graph transfer

G4-02はG3-04由来C1/C6のfresh-domain transferをStudy 1〜4としてprospectiveに試みたが、formal scientific decisionまで到達せず、`CLOSED / NO SCIENTIFIC DECISION`となった。これはgeneralization失敗やcounterexampleのnegative scientific evidenceではない。

## G4-03 — width / search-ranking transfer

G4-03 `LWSRT-STUDY1` はG3-07由来associationをfresh source-policy × root-family domainsへ移送検証し、12 test中9 `GENERALIZATION-CONFIRMED`、1 `NOT-GENERALIZED`、2 `NON-ESTIMABLE`、counterexample 0で完了した。

詳細: [`../local-width-search-ranking-transfer/README.md`](../local-width-search-ranking-transfer/README.md)

## G4-04 — geometry trajectory dynamics transfer

G4-04 `GTTD-STUDY1` はG3-10でformal confirmationされたC1・C2・C3・C5のdirectionを、fresh P1/P2 source-policy domainsへprospectiveに移送検証した。

```text
canonical Stage 2 run = 36095831961 / attempt 1 / success
fresh seed block = 40423001..40424024 / 1024
seed reads = 369
formal measured trajectories = 64
production / independent exact = true
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

C1・C2・C5はpositive direction、C3はnegative directionで、P1/P2ともG3-10と同方向にformal confirmationされた。

この結果は本StudyのP1/P2 full-trajectory domainsに限定される。RF1/RF2はsupport descriptorのみでformal subgroup inferenceは行っていない。whole-Bao universal law、game-theoretic value、AI strength、人間のdifficultyを意味しない。

詳細:

- [`../geometry-trajectory-dynamics-transfer/README.md`](../geometry-trajectory-dynamics-transfer/README.md)
- [`../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`checkpoints/2026-09-25-g4-04-complete.md`](checkpoints/2026-09-25-g4-04-complete.md)

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — RG4全体の最新状態
2. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
3. [`RESUME_HERE.md`](RESUME_HERE.md) — 安全な再開位置
4. [`../geometry-trajectory-dynamics-transfer/README.md`](../geometry-trajectory-dynamics-transfer/README.md) — G4-04の正式入口
5. [`checkpoints/2026-09-25-g4-04-complete.md`](checkpoints/2026-09-25-g4-04-complete.md) — G4-04 closure checkpoint

## 次に許可される作業

G4-04を追加実行しない。Research Generation 4を継続する場合、次のcore candidateは`G4-05` exact microdomain oracle foundationである。

G4-05はprogram plan上の候補であり、**自動authorizationではない**。新しいStudyとしてauthorization reviewから開始する。

G4-04の`main`統合はユーザーの明示指示まで行わない。

## 解釈上の境界

- compatibilityはgeneralizationそのものではない。
- `GENERALIZATION-CONFIRMED`は固定domain・固定endpointに限定される。
- G4-04の8/8はRF1/RF2 subgroupやwhole-Bao universal lawを意味しない。
- search/geometry evidenceはbest move correctnessやAI棋力を意味しない。
- machine-only evidenceはhuman difficultyの証拠ではない。
- 研究結果と公開AI engineeringは分離する。
