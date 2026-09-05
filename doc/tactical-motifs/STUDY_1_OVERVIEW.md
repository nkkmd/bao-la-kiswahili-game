# Tactical Motifs / Tesuji Study 1 — 概要

## 研究題目

**Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証**

## 結論

このStudy 1は完了しました。

freshなformal corpusで4つの候補を事前登録どおり検証した結果、**1候補（TM-S2-C03）がCONFIRMED、3候補がNOT-CONFIRMED**となりました。

確認されたC03は、現在のBaoルール実装と凍結済み探索条件のもとで、特定の開局手順に依存せず、多数の異なる局面で再現する**machine-reproducible transferable tactical motif**です。

ただし、この研究だけで「伝統的に知られた手筋」「熟練者が手筋と認識する」「初心者教育で重要」とまでは言えません。そこには別のhuman / expert validationが必要です。

## 何を調べたか

囲碁や将棋の「手筋」に近い、局面をまたいで再利用できるBaoの着手原理が機械的に発見・確認できるかを調べました。

特定の定石手順を覚える研究ではなく、異なる局面に共通する

```text
局面構造
  → ある種類の着手
  → 構造的な結果
  → 探索上の価値
```

というパターンを対象にしました。

## Stage 1 — 候補を探索

Stage 1では768局のfresh corpusを生成し、715個のunique rule stateを選び、そこで可能な全合法手を測定しました。

```text
exact move records = 3,148
raw pattern instances = 3,116,520
unique pattern keys = 323,676
detailed candidates = 105,501
promotion gate通過 = 948
最終promotion = 8 definitions
```

8候補は、同じsupportを共有する4組のpairを形成しました。

ここで都合よく4候補へまとめ直すのではなく、Stage 1の8定義はそのまま保存し、fresh Stage 2 dataを見る前に各pairから1つだけformal candidateを選ぶ規則を固定しました。

## Stage 2 — fresh dataで正式確認

Stage 2では、Stage 1と重ならない3,072局を新しく生成しました。

```text
games = 3,072
seeds = 22000001–22003072
unique historical trajectories = 2,736
distinct opening prefixes = 2,220
```

全3,072局を独立verifierで再生成・再探索し、完全一致を確認してから候補局面を選びました。

候補ごとのformal root数は次のとおりです。

| 候補 | formal roots | opening prefixes | strata |
| --- | ---: | ---: | ---: |
| C01 | 1,597 | 1,373 | 6 |
| C02 | 2,705 | 2,192 | 6 |
| C03 | 1,272 | 1,121 | 6 |
| C04 | 1,031 | 891 | 6 |

全候補が事前登録したestimability / transferability条件を満たしました。

## 何をもって「確認」としたか

各候補について、次の2条件をco-primary endpointとして両方要求しました。

1. 候補手が、事前に定義した構造的な結果を実際に生むこと
2. 候補手が、同じ局面の全合法手の中でD3探索のtop setに入ること

それぞれ成功率60%以上を要求し、exact binomial testを行いました。4候補×2 endpointの8検定すべてをHolm-Bonferroniで補正しました。

さらに、D3でstate median以上となる割合60%以上、unique worstとなる割合15%以下も要求しました。

## 最終結果

| 候補 | 構造再現率 | D3 top-set率 | D3 median以上 | D3 unique worst | 判定 |
| --- | ---: | ---: | ---: | ---: | --- |
| C01 | 69.44% | 49.34% | 75.08% | 8.02% | NOT-CONFIRMED |
| C02 | 9.28% | 30.72% | 59.70% | 23.03% | NOT-CONFIRMED |
| C03 | **97.88%** | **73.66%** | **86.95%** | **7.08%** | **CONFIRMED** |
| C04 | 41.42% | 31.52% | 55.87% | 19.59% | NOT-CONFIRMED |

## 確認されたC03とは何か

C03の機械定義は次です。

```text
phase = Mtaji
precondition = reusablePits が 0〜2
move = takata / row 1 / right direction / coarse-no-index
consequence = actor側の nyumba seeds 数を変化させない
```

この条件を満たすfreshな1,272局で、候補手は97.88%の局面で指定された構造結果を再現し、73.66%でD3 top setに入りました。

開局prefixは1,121種類、generation strataは6種類すべてに広がっており、特定の1つのopening familyだけを繰り返し数えた結果ではありません。

## C01が確認されなかった理由

C01は構造結果そのものは69.44%で再現しました。しかしD3 top-set率は49.34%でした。

つまり「構造としては繰り返し起きる」ことと「その手が局面横断的に有力な手である」ことは同じではありません。この分離は本研究の重要な結果です。

## C02 / C04 （日本語の要点）

C02とC04は構造再現率もD3 top-set率もformal基準を満たしませんでした。追加gameや閾値変更で救済せず、そのままNOT-CONFIRMEDとして閉じています。

## この研究から言えること

現在の機械的な範囲では、Baoに局面横断的に再現するtactical motifを探索→fresh confirmationする研究pipelineは成立し、少なくともC03についてformal confirmationまで到達しました。

一方、Stage 1で有望に見えた候補の多くがfresh confirmationを通らなかったことから、探索段階の高いsupportやD3指標だけで「手筋」と呼ぶのは危険だとも分かりました。

## この研究からは言えないこと

C03についても、以下は未検証です。

- Bao熟練者が伝統的な手筋として認識するか
- 人間が実戦で使えるか
- 初心者教育に有効か
- 他のBaoルール実装でも同じか
- 別の評価関数・探索器でも同じか

これらはStudy 1の結果を書き換えるのではなく、新しいprospective studyとして扱います。

## 詳細を読む

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — Study 1全体の科学的統合
- [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md) — Stage 2 formal result
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — hash / artifact / tooling索引
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure状態
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 研究上の固定判断
