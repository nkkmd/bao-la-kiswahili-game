# G2-12 第1研究概要 — 状態空間・ゲーム木成長の推定

Program: **Research Generation 2 / G2-12**  
Study ID: `SSGTGE-STUDY1`  
状態: **開始済み / initial prospective freeze complete / fresh holdout未生成**  
正式判断: **未確定**

正式英語名: **State-Space / Game-Tree Growth Estimation Study 1**

## 1. 何を調べる研究か

この研究では、標準初期局面からのbounded exact enumerationで既に得られているdepth 0..9のRAW-state / game-tree成長系列だけをdevelopment evidenceとして使い、結果を見る前に有限のestimator候補・選択規則・uncertainty rule・formal acceptance criterionを固定します。

その後、developmentに使っていないfresh exact depth 10を生成し、凍結済みestimatorがその層をどの程度予測できるかを検証します。depth 11は同じestimatorを一切変更せず試すsecondary stress-testです。

## 2. 既存研究との境界

直接の基礎はG2-05 `DRSSE-STUDY1`です。

```text
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
complete exact layers = 0..9
cumulative RAW states through depth 9 = 102857
```

G2-12はG2-05にdepth 10以降を後付けしてformal domainを拡張する研究ではありません。G2-05のexact claimはimmutableです。

また、G2-10とPre-G2-11 `PSRRE-STUDY1`はいずれもG2-11へ渡せるfrozen strategic representationを生成していません。したがってG2-11は引き続き`NOT-AUTHORIZED`であり、本研究のstate-space growthをstrategic regime evidenceとして使用しません。

## 3. 状態表現

authoritative RAW identityは次の7項目です。

```text
pits, reserve, houseOwned, player, phase, winner, pending
```

`turn`と`reason`は除外します。validated transform setは`[]`なので、canonicalization / symmetry reduction / seat swap / reflection reductionは使用しません。

## 4. Developmentとholdout

DevelopmentはG2-05のexact depth 0..9 summaryに限定します。

Formal primary holdoutはfresh exact depth 10です。Stage 2 runnerは標準初期RAW rootからdepth 0より再列挙し、G2-05のmaterialized state/edge rowsを入力として読み込みません。

Depth 11はsecondary stress-testです。depth 10を見た後にestimatorを変更することは禁止されています。

## 5. 凍結したestimator候補

候補は3つに限定しました。

```text
E1-TRAILING-LOG-LINEAR-W5
E2-LOG-QUADRATIC-D2PLUS
E3-LOCAL-LOG-INCREMENT-TREND-W4
```

primary modeled seriesは、`newRawStateCount[d]`と`treeNodeOccurrences[d]`です。

Stage 1では`5->6`, `6->7`, `7->8`, `8->9`のrolling-origin backtestを行い、最大absolute log error `<= 0.15`をpromotion条件とします。eligible候補のうちworst-cell error、mean error、固定candidate orderの順で唯一のestimatorを選びます。

## 6. Formal validation

Fresh depth 10について、次をすべて満たした場合だけpositive validationとします。

```text
depth 10 complete exact layer = true
production / independent exact mismatch = 0
joint max absolute log error across graph/tree primary series <= 0.20
both exact counts covered by frozen development-calibrated envelope
post-holdout refit/recalibration = false
```

Positive labelは`VALIDATED-WITHIN-FRESH-DEPTH-10-HOLDOUT`です。

予測精度が基準を満たさなければ`NOT-VALIDATED`、depth 10をresource ceiling内でcompleteできなければ`RESOURCE-CENSORED`、estimatorをfreezeできなければ`NON-ESTIMABLE`等で正常にcloseします。

## 7. 重要な解釈境界

この研究は、validationに成功した場合でも直ちに「Baoの全状態数はX」「full game treeはY」と断定するものではありません。まず検証するのは、凍結済みestimatorがfresh bounded holdoutへどこまで一般化できるかです。

詳細な科学的契約は`STUDY_1_PROTOCOL.md`と`preregistration/STUDY_START_FREEZE.md`を参照してください。
