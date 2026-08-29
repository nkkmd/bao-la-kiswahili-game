# G2-05 第1研究概要 — 深層RAW状態空間の完全列挙

Program: **Research Generation 2 / G2-05**  
Study ID: `DRSSE-STUDY1`  
状態: **完了**  
正式判断: **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

正式英語名: **Deep RAW State-Space Enumeration Study 1**

## 1. この研究は何を調べたのか

G2-05では、標準的なBao初期局面をauthoritative RAW rootとして結果を見る前に固定し、**depth 9までのすべての合法な前向き到達状態を完全列挙できるか**を調べました。

同時に、次の量をexactに記録しました。

- graph上のdistinct RAW state数
- game tree上のstate occurrence数
- branching structure
- transposition structure
- phase構成

これは、固定depth内でのbounded exact enumerationです。Bao全体の完全解、全状態空間サイズの確定、full-game game-tree sizeの推定ではありません。

## 2. 状態表現

RAW state identityは次の7項目です。

```text
pits, reserve, houseOwned, player, phase, winner, pending
```

`turn`と`reason`は除外しました。`pending`が欠けた状態は無効です。

validated transform setは引き続き`[]`であり、本研究ではsymmetry reductionもcanonicalizationも使用していません。

## 3. 正式評価domain

```text
root = fresh standard engine initialState()
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
target depth = 9
complete reachable layers = 0..9
complete parent expansions = 0..8
```

root、target depth、計算資源の上限、評価項目、decision rule、state representation、independent verifier requirementは、formal outcomeを生成する前に固定しました。

## 4. 結果

固定したすべてのlayerが完全に終了し、独立実装がdomain全体を再現しました。

```text
cumulative distinct RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
lastCompleteDepth = 9
firstIncompleteDepth = null
stopReason = null
```

depth 9単独では次の結果でした。

```text
unique RAW states = 78009
tree occurrences = 105704
duplicate arrivals = 3116
states with multiple predecessors = 2658
Namua nonterminal = 77658
Mtaji nonterminal = 0
terminal = 351
```

この結果から、同じRAW stateへ複数経路から到達するtranspositionが存在し、game tree上のoccurrence数がdistinct RAW state数より大きくなる構造を、固定depth 9までexactに記述できました。

## 5. 独立検証とprovenance

```text
formal authorization/head = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
workflow run = 33156581843
workflow job = 98800676702
artifact = 9679860509
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
production core = b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b
independent core = 02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3
```

Productionとindependent implementationの双方が、固定domainを完全に再構築しました。

## 6. 正式判断

```text
DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

このexactnessは、**標準初期局面をrootとした、事前固定depth 9までのRAW-state domainの内部だけ**に適用されます。

## 7. 解釈上の境界

本研究は次を承認しません。

- Bao全体のstate-space exact count
- full-game game-tree complexityの総量推定
- depth 9以降へのasymptotic extrapolation
- symmetry-reduced count
- canonicalized state count
- game-theoretic solution

G2-04の正式判断は引き続き`INCONCLUSIVE`であり、そのrootやpartial closureをG2-05へ再利用していません。

Research Generation 1の`SSGTC-STUDY1`も、独立に`SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`として維持され、G2-05によって変更されません。

## 8. 詳細・再現用文書

完全な科学的報告は`STUDY_1_FINAL_REPORT.md`を、source・artifact・再現手順は`REPRODUCIBILITY_INDEX.md`を参照してください。
