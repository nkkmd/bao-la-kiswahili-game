# Research Generation 4 — 入口

更新日: 2026-09-05  
Program: `Bao Fourth-Generation Research Program`  
状態: **`PROGRAM PLAN FROZEN / INTEGRATED TO MAIN / SCIENTIFIC EXECUTION NOT AUTHORIZED`**

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
Scientific execution authorized = none
Scientific seeds accessed = none
Depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized = false
```

この状態は、研究計画が整備されたことだけを示す。G4-01を含む個別Studyの開始、fresh seedへのアクセス、計算実行、公開AIの変更は別のauthorizationを必要とする。

## 研究構成

| Wave | Agenda | 目的 |
| --- | --- | --- |
| A | `G4-01..G4-04` | claim移送用compatibility instrumentと、G3-04・G3-07・G3-10由来claimの一般化・反例境界 |
| B | `G4-05..G4-06` | fresh exact microdomainと、局所幾何からgame-theoretic consequenceへの限定的なbridge |
| C | `G4-07..G4-09` | 多時間尺度memory、rule-semantic transition、search reliability |
| D | `G4-10` | 保護されたfresh depth-11 exact reachability topology |
| 独立 | `G4-P01` | state transformation / canonicalizationの再基礎化。coreを阻害しない |
| 独立 | `G4-H01` | qualified participantを必要とするhuman / expert研究。coreを阻害しない |

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在許可されていることと禁止されていること
2. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — 全Agenda、dependency、証拠区分、完了条件
3. [`RESUME_HERE.md`](RESUME_HERE.md) — 次のチャットで安全に再開する手順
4. [`../research-generation-3/FINAL_SYNTHESIS.md`](../research-generation-3/FINAL_SYNTHESIS.md) — 第三世代から引き継ぐ結果と未確定境界

## 次に許可される作業

計画統合後に行える次の研究作業は、**post-RG3 / pre-G4-01 current-state authorization review**である。G4-01を自動的に開始してはならない。

reviewでは、current `main` HEAD、第三世代closure、G3-12のtechnical-invalid原因、未使用・既使用evidence、G4-01の独立性、現実的なresource条件をread-onlyで確認する。明示的に`AUTHORIZED`と判断された場合にのみ、G4-01の正式Study contractを結果を見る前に固定する。

## 解釈上の境界

- 局所幾何の移送可能性は、whole-Bao universal lawと同義ではない。
- exact microdomainのvalueは、その限定domain外の勝率や最適性を示さない。
- engine scoreはvalidated Bao win probabilityではない。
- search stabilityは正しさ、人間の容易さ、悪手の不存在を意味しない。
- machine-only evidenceはhuman difficultyやhuman errorの証拠ではない。
- 研究結果は公開AIの採用判断と分離する。
