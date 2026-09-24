# Research Generation 4 — 入口

更新日: 2026-09-24  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION / G4-03 COMPLETE`**

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
| A | `G4-03` | G3-07由来width / search-ranking transfer | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE` |
| A | `G4-04` | G3-10由来geometry-trajectory transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| B | `G4-05..G4-06` | exact microdomainとgeometry / consequence bridge | `NOT AUTHORIZED` |
| C | `G4-07..G4-09` | memory、rule-semantic transition、search reliability | `NOT AUTHORIZED` |
| D | `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT AUTHORIZED / NOT ACCESSED` |
| 独立 | `G4-P01` | canonicalization re-foundation | `NOT AUTHORIZED` |
| 独立 | `G4-H01` | human / expert evidence | `DEFERRED` |

Public AI change authorized by RG4 = `false`。

## G4-01 — compatibility/readiness

G4-01 `LGTTCI-STUDY1` は、G3-04・G3-07・G3-10由来claimをfresh domainへ移す前提としてSFCDF・SILGM・GCLDのcompatibility/readinessを検証した。

```text
SFCDF = compatible
SILGM = compatible
GCLD = compatible
G4-01 decision = COMPATIBILITY-ELIGIBLE-ALL
```

これはgeneralizationやeffect directionそのものの確認ではない。

詳細: [`../local-game-tree-geometry-transfer-compatibility-instrument/README.md`](../local-game-tree-geometry-transfer-compatibility-instrument/README.md)

## G4-02 — corridor / tree-graph transfer

G4-02はG3-04由来C1/C6のfresh-domain transferをStudy 1〜4としてprospectiveに試みたが、formal Stage 2 scientific decisionまで到達しなかった。

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
final formal status = TECHNICAL-INVALID
main integration = COMPLETE / PR #154
```

これはC1/C6が一般化しない、counterexampleが存在する、effectがない、というnegative scientific evidenceではない。

詳細: [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)

## G4-03 — width / search-ranking transfer

G4-03 `LWSRT-STUDY1` は、G3-07でconfirmedとなったroot legal width HIGH stratumとranking-preorder changeのassociationを、fresh source-policy × root-family domainsへprospectiveに移送検証した。

Stage 1 development gateは128 rootsを確保してPASS。Stage 2はGitHub Actions one-shotで固定1536 seedsを一度だけ読み、192 rootsをformal sampleとして評価した。

```text
canonical Stage 2 run = 35993172710 / attempt 1 / success
stage disposition = STAGE2-COMPLETE-WITH-NON-ESTIMABLE
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

Claim別:

- `SC1 DEPTH`: 4/4 domainsで`GENERALIZATION-CONFIRMED`
- `SC2 NODE-BUDGET`: P1の2 domainsで`GENERALIZATION-CONFIRMED`、P2の2 domainsはMtaji support不足で`NON-ESTIMABLE`
- `SC3 QUIESCENCE`: 3/4 domainsで`GENERALIZATION-CONFIRMED`、P2×RF2は`NOT-GENERALIZED`
- formal counterexampleは0

したがって、G3-07由来associationは対象fresh domainsへ**広く移送されたが、普遍的ではない**。

本Studyはbest move correctness、game-theoretic value、AI strength、人間のdifficulty、causal mechanismを検証していない。研究結果をpublic AI変更へ自動変換しない。

詳細:

- [`../local-width-search-ranking-transfer/README.md`](../local-width-search-ranking-transfer/README.md)
- [`../local-width-search-ranking-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../local-width-search-ranking-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`checkpoints/2026-09-24-g4-03-complete.md`](checkpoints/2026-09-24-g4-03-complete.md)

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — RG4全体の最新状態
2. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
3. [`RESUME_HERE.md`](RESUME_HERE.md) — 安全な再開位置
4. [`../local-width-search-ranking-transfer/README.md`](../local-width-search-ranking-transfer/README.md) — G4-03の正式入口
5. [`checkpoints/2026-09-24-g4-03-complete.md`](checkpoints/2026-09-24-g4-03-complete.md) — G4-03 closure checkpoint

## 次に許可される作業

G4-03を追加実行しない。Research Generation 4を継続する場合、次のcore candidateは`G4-04`である。

G4-04はG4-01のeligibility gateを満たしているが、**自動authorizationではない**。新しいStudyとしてauthorization reviewから開始する。

G4-03の`main`統合も別工程であり、ユーザーの明示指示まで行わない。

## 解釈上の境界

- compatibilityはgeneralizationそのものではない。
- `GENERALIZATION-CONFIRMED`は固定domain・固定contrast・固定endpointに限定される。
- `NON-ESTIMABLE`はnegative resultではない。
- `NOT-GENERALIZED`はcounterexampleと同義ではない。
- search-ranking changeはbest move correctnessやAI棋力を意味しない。
- machine-only evidenceはhuman difficultyの証拠ではない。
- 研究結果と公開AI engineeringは分離する。
