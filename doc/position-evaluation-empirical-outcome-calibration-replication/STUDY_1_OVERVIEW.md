# G2-01 第1研究概要 — 形勢評価と実現勝敗の校正再検証

Program label: `G2-01`  
Study ID: `PEOCR-STUDY1`  
研究世代: **Research Generation 2**  
状態: **完了 / 正式判断 `INCONCLUSIVE`**

正式英語名: **Position Evaluation / Empirical Outcome Calibration Replication Study 1**

## 1. この研究は何を調べたのか

Research Generation 1のPosition Evaluation / Win-Rate Calibration Study 1（`PEC-STUDY1`）は、厳格な状態同一性によるデータ分離後の正式評価対象集団が、事前に固定した推定可能性の条件へ届かなかったため、`INCONCLUSIVE`で終了しました。

G2-01はその判断を変更・救済する研究ではありません。新しいStudy IDと、新たに生成した独立集団を用い、**手番側から見たBaoの静的評価値と、その局面から実際に得られる継続対局の勝敗との対応関係を、未使用の独立検証データで再検証できるか**を調べました。

研究とAI Engineeringは分離しており、公開Bao AIの棋力、公開環境への反映、AI世代の昇格は本研究の科学的評価項目ではありません。

## 2. 研究設計

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

Stage 1では2,048局の開発用データを使用しました。すべての実行準備条件を満たしたため、phase別のisotonic PAVA mappingを`MODEL-FROZEN-DEVELOPMENT`として固定し、Stage 2では再学習しないことを事前に確定しました。

Stage 1とStage 2の間では、trajectory、opening prefix、authoritative RAW stateの3層でデータ分離規則を適用しました。

## 3. Stage 2の結果

Stage 2では、8,192/8,192局を固定した8 shardで生成し、すべてのshardを独立にreplayしました。統合後の局面選択と測定についても独立検証を行い、Stage 1との重複はtrajectory / opening-prefix / RAW-stateのすべてで0でした。

しかし、事前に固定した推定可能性の判定条件のうち3項目を満たしませんでした。

| 判定条件 | 観測値 | 必要値 | 結果 |
| --- | ---: | ---: | --- |
| Stage 1との分離後に残ったunique historical trajectories | 3,898 | >= 4,500 | FAIL |
| 選択されたunique RAW states | 3,570 | >= 4,000 | FAIL |
| Namua selected states | 1,823 | >= 1,750 | PASS |
| Mtaji selected states | 1,747 | >= 1,750 | FAIL |

Mtajiは必要数に3 state届きませんでした。ただし、結果を見た後の追加seed、対象のreplacement、判定条件の緩和は事前に禁止していたため実施していません。

## 4. 正式判断

```text
PEOCR-STUDY1 = INCONCLUSIVE
```

これは、校正modelが`NOT-CONFIRMED`だったという意味ではありません。

推定可能性の判定条件をすべて満たさなかったため、co-primary Brier skill / log-loss skillとBrier maximaによる正式な成功判定そのものへ進んでいません。canonical resultでは`primary = null`です。

したがって、本研究から主要校正仮説を肯定または否定する正式判断は行いません。

## 5. 何が分かり、何が分からなかったか

本研究では、8,192局の独立Stage 2 corpusを生成・検証し、Stage間の重複がないことまで確認できました。一方で、事前に要求した正式評価対象数を満たせなかったため、校正性能の主要評価を正式判断へ使用できませんでした。

`INCONCLUSIVE`は「校正関係が存在しない」という意味ではなく、**この事前規定の設計では正式に判定可能な条件が揃わなかった**ことを表します。

## 6. 解釈上の境界

本結果から、次のことは主張しません。

- game-theoretic winning probability
- 人間による形勢認知
- 因果効果
- 公開Bao AIの品質
- 別populationや別search policyへの一般化

また、同じStage 2 dataに対する追加game、seed extension、identity-overlap replacement、判定条件の緩和、mappingの再学習、都合のよいsubgroupによる正式判断の救済は行いません。

再検証する場合は、新しいprospective Studyまたは明示的にversion管理された新protocolと、新しい独立証拠が必要です。

## 7. 詳細・再現用文書

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
