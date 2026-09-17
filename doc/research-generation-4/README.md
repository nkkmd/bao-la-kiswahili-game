# Research Generation 4 — 入口

更新日: 2026-09-18  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / NEXT WAVE-A STUDY NOT AUTHORIZED`**

## このProgramが調べること

第四世代研究は、Research Generation 3で測定可能になったbounded RAW local game-tree geometryについて、次の三点を中心に検証する。

1. 別のphase、root family、source policy、rule contextへどこまで移送できるか。
2. 完全解析可能な限定domainで、exact game-theoretic consequenceとどのように関係するか。
3. 時間的持続、rule-semantic event、search reliabilityとどのように結びつくか。

第三世代のclosed Studyをrepairまたは再判定するProgramではない。各研究は新しいStudy ID、fresh evidence、事前登録、独立検証、結果確認後の救済的変更を禁止する規則を用いる。

## 現在の状態

```text
Program plan = FROZEN / INTEGRATED TO MAIN
Planning PR = #103
Planning merge commit = 692bcb40f52c097ca89bf7fea842b6f77fbdf19e
Core agenda = G4-01..G4-10
Independent tracks = G4-P01, G4-H01
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
G4-02 = NOT AUTHORIZED
G4-03 = NOT AUTHORIZED
G4-04 = NOT AUTHORIZED
Depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized = false
G4-01 main integration = NOT YET AUTHORIZED
```

## G4-01の到達点

G4-01は`LGTTCI-STUDY1`として実施し、claim-transfer compatibility instrumentをscientific effectから分離して検証した。

Stage 0は`STAGE0-PASS`。旧Stage 1は実行環境消失のためfail-closedで終了し、旧`401...` namespaceをquarantineした。Stage 1Rは新しい`402...` primary namespaceでfresh acquisitionを一度だけ実行し、1536/1536 source evidenceを取得した。

元workflowのdownstream technical failure後はfresh seedを再読せず、immutable source artifactだけを使うdownstream-only recoveryを実施し、22/22 measurement taskとaggregateがsuccessした。

最終結果:

```text
SFCDF = compatible
SILGM = compatible
GCLD = compatible
G4-01 decision = COMPATIBILITY-ELIGIBLE-ALL
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
```

詳細は[`../local-game-tree-geometry-transfer-compatibility-instrument/README.md`](../local-game-tree-geometry-transfer-compatibility-instrument/README.md)を参照する。

## 研究構成

| Wave | Agenda | 目的 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim移送用compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL` |
| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| A | `G4-03` | G3-07由来width / search-ranking transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| A | `G4-04` | G3-10由来geometry-trajectory transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| B | `G4-05..G4-06` | fresh exact microdomainと局所幾何からgame-theoretic consequenceへの限定的bridge | `NOT AUTHORIZED` |
| C | `G4-07..G4-09` | 多時間尺度memory、rule-semantic transition、search reliability | `NOT AUTHORIZED` |
| D | `G4-10` | 保護されたfresh depth-11 exact reachability topology | `PROTECTED / NOT AUTHORIZED` |
| 独立 | `G4-P01` | state transformation / canonicalizationの再基礎化 | `NOT AUTHORIZED` |
| 独立 | `G4-H01` | qualified participantを必要とするhuman / expert研究 | `DEFERRED` |

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のProgram状態とauthorization境界
2. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
3. [`RESUME_HERE.md`](RESUME_HERE.md) — 次の安全な再開手順
4. [`../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md`](../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md) — G4-01の正式結果
5. [`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md) — G4-01 closure

## 次に許可される作業

G4-01の研究そのものは完了している。

次の科学実行を行う場合は、G4-02、G4-03、G4-04のいずれかについて**post-G4-01 current-state authorization review**を実施する。G4-01の`COMPATIBILITY-ELIGIBLE-ALL`は後続Studyの自動authorizationではない。

G4-01を`main`へ統合する場合も、ユーザーの明示指示が必要である。

## 解釈上の境界

- `COMPATIBILITY-ELIGIBLE-ALL`はcompatibility/readinessであり、generalizationやeffectの確認ではない。
- 局所幾何の移送可能性はwhole-Bao universal lawと同義ではない。
- exact microdomainのvalueは、その限定domain外の勝率や最適性を示さない。
- engine scoreはvalidated Bao win probabilityではない。
- search stabilityは正しさ、人間の容易さ、悪手の不存在を意味しない。
- machine-only evidenceはhuman difficultyやhuman errorの証拠ではない。
- 研究結果は公開AIの採用判断と分離する。
