# G2-02 第1研究概要 — 探索信頼性と意思決定頑健性

Program label: `G2-02`  
Study ID: `SRDR-STUDY1`  
研究世代: **Research Generation 2**  
状態: **完了 / 正式判断 `INCONCLUSIVE`**

正式英語名: **Search Reliability / Decision Robustness Study 1**

## 1. この研究は何を調べたのか

同一のauthoritative RAW stateに対して、探索depth、node budget、quiescence条件を結果を見る前に固定した複数条件へ変化させたとき、**best move、TopSet、着手順位、evaluation sign、principal variationがどの程度安定しているか**を検証しました。

本研究が測定する中心概念は、**機械探索における信頼性と意思決定の頑健性（machine search reliability / decision robustness）**です。

これは、人間にとっての局面の難しさ、局面そのものの複雑度、game-theoretic value、engine correctness、公開Bao AIの棋力とは別の概念です。また、D3など計算資源を多く使う条件も「真の正解」とはみなさず、事前に固定した探索上の比較基準としてのみ扱いました。

## 2. 研究設計

```text
Stage 0 = technical validation / PASS
Stage 1 = 1,280 fresh development games / PROFILE-FROZEN-DEVELOPMENT
Stage 2 = 1,536 fresh held-out formal games
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
Stage 1 -> Stage 2 firewall = trajectory + opening prefix + RAW state
search grid = D1_Q1, D2_Q1, D3_Q1, D2_Q0, D2_Q2, B64, B256, B1024
move ordering = frozen
node-budget partial iteration = discarded
```

Stage 1では1,280局の開発用データから1,018個のunique RAW statesを選択しました。内訳はNamua 527、Mtaji 491です。

すべての実行準備条件を満たしたため、開発段階のsearch profileを`PROFILE-FROZEN-DEVELOPMENT`として固定し、Stage 2では変更しませんでした。

## 3. Stage 2の検証結果

Stage 2では1,536/1,536局を生成し、独立verifierが全対局のreplay、局面選択、1,007 selected statesの測定を再構築しました。

```text
games verified = 1536 / 1536
game replay mismatches = 0
selected-state mismatches = 0
measurement mismatches = 0
selection hash match = true
measurement hash match = true
Stage 1 overlap = trajectory 0 / opening prefix 0 / RAW state 0
```

つまり、生成・局面選択・測定の独立再現は成立し、Stage 1とStage 2のデータ分離も確認できました。

## 4. 推定可能性の判定

しかし、事前に固定した推定可能性の条件のうち1項目を満たしませんでした。

| 判定条件 | 観測値 | 必要値 | 結果 |
| --- | ---: | ---: | --- |
| Stage 1との分離後に残ったunique historical trajectories | **1,040** | **>= 1,050** | **FAIL** |
| selected unique RAW states | 1,007 | >= 1,000 | PASS |
| Namua selected states | 518 | >= 450 | PASS |
| Mtaji selected states | 489 | >= 450 | PASS |
| 分離後のdistinct opening prefixes | 1,040 | >= 900 | PASS |

必要数との差は10 trajectoryでしたが、結果を見た後の追加seed、replacement、threshold relaxation、near-miss exceptionは、事前に定めたno-rescue ruleに反するため実施していません。

## 5. 正式判断

```text
SRDR-STUDY1 = INCONCLUSIVE
primaryFormalCriterion = null
```

すべての推定可能性条件を満たさなかったため、事前登録したprimary 3 criteriaは正式判断を担う評価へ進んでいません。

したがって、この研究結果を`CONFIRMED`または`NOT-CONFIRMED`へ読み替えることはしません。

## 6. 記述的なsecondary profile

正式判断には使用できませんが、事前に指定していたsecondary profileは記述的証拠として保存しています。

```text
D2_Q1 vs D3_Q1 canonical-best agreement = 0.734856
D2_Q2 vs D2_Q1 canonical-best agreement = 0.748759
B1024 vs D3 canonical-best agreement = 0.941410
```

NamuaではMtajiよりagreementが低い比較が多く観測されました。ただし、これはformal gate failure後に保持したsecondary resultであり、人間の難しさや「真の着手品質」を示す結果としては使用しません。

## 7. 何が分かり、何が分からなかったか

探索条件を変化させたときの各種decision representationを、独立に再現可能な形で測定するところまでは成功しました。一方、正式な主要基準を評価するために必要なtrajectory数が事前条件に届かなかったため、中心仮説について正式な肯定・否定はできませんでした。

`INCONCLUSIVE`は探索が不安定だった、あるいは安定していた、という方向の結論ではありません。

## 8. 詳細・再現用文書

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
- [`results/STAGE_2_VERIFICATION.json`](results/STAGE_2_VERIFICATION.json)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
