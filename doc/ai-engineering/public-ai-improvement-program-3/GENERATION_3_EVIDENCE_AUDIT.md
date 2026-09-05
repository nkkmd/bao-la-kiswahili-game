# `PBAI-P3` — Research Generation 3証拠監査

状態: **`FROZEN / PBAI-P3-A COMPLETE`**

Program: `PBAI-P3`

科学証拠cutoff: `479bc3d3a9b6c745e37a88529732180e8690d6b3`

## 1. 正本とcutoff

Program-level正本は、cutoff時点の次の記録です。

- [`../../research-generation-3/FINAL_SYNTHESIS.md`](../../research-generation-3/FINAL_SYNTHESIS.md)
- [`../../research-generation-3/PROGRAM_FINAL_RESULT.json`](../../research-generation-3/PROGRAM_FINAL_RESULT.json)
- [`../../research-generation-3/CURRENT_STATUS.md`](../../research-generation-3/CURRENT_STATUS.md)
- [`../../research-program-decisions/2026-09-04-research-generation-3-program-closure.md`](../../research-program-decisions/2026-09-04-research-generation-3-program-closure.md)

`479bc3d3a9b6c745e37a88529732180e8690d6b3`は`Complete Research Generation 3 main integration bookkeeping`であり、Program開始時の`main`の祖先であることを確認しました。詳細を必要とする場合だけ、同cutoff時点の各Study protocol、凍結契約、result、review、closureを参照します。

## 2. Tier A — candidate仮説の直接入力にできる限定的証拠

### `G3-07 / SILGM-STUDY1`

frozen formal populationでは、root legal width `G1`のhigh stratumにranking-preorder change `E3`が集中する関連が、3種類のpeer search perturbationで確認されました。

```text
SC1 DEPTH × E3 × G1 = CONFIRMED / HIGHER-IN-HIGH
SC2 NODE-BUDGET × E3 × G1 = CONFIRMED / HIGHER-IN-HIGH
SC3 QUIESCENCE × E3 × G1 = CONFIRMED / HIGHER-IN-HIGH
```

Formal study thresholdはNamua `4`、Mtaji `3`でした。観測supportは次のとおりです。

```text
depth:
  Namua HIGH 20 / LOW 11, changed 16 / 4
  Mtaji HIGH 13 / LOW 14, changed 8 / 4
node budget:
  Namua changed HIGH 15 / LOW 1
  Mtaji changed HIGH 6 / LOW 0
quiescence:
  Namua changed HIGH 17 / LOW 3
  Mtaji changed HIGH 9 / LOW 2
```

この証拠は、root widthと反復深化中のranking churnを組み合わせ、限られた上位手だけを追加検証する工学仮説の根拠にできます。ただしthresholdを公開triggerへ直接転用せず、fresh supportでreachabilityを確認して結果を見る前に別途固定します。

この関連はnon-causalです。ranking変化が誤りを示す、widthがsearch failureを生む、高resource探索が真のbest moveである、という推論は禁止します。

## 3. Tier B — benchmark層別化・stress corpus・回帰試験への入力

### `G3-04 / SFCDF-STUDY1`

```text
SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION = CONFIRMED / MTAJI-GREATER
SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO = CONFIRMED / NAMUA-GREATER
paired population = 18 / 18
```

phase-stratified benchmark、phase別support確認、慎重なphase-aware budget仮説に利用できます。forcing、best-move clarity、局面価値、human difficulty、causal phase effectの根拠にはしません。

### `G3-10 / GCLD-STUDY1`

```text
C1 DIRECTIONALITY PATH EFFICIENCY = CONFIRMED / ACTUAL-GREATER
C2 PERSISTENCE LAG DISTANCE GRADIENT = CONFIRMED / ACTUAL-GREATER
C3 RETURN FRACTION = CONFIRMED / ACTUAL-LESS
C4 CHRONOLOGY-CONDITIONED CIRCULATION = NOT-CONFIRMED
C5 FIRST-ORDER DIRECTIONAL PATH DEPENDENCE = CONFIRMED / ACTUAL-GREATER
```

trajectory-stratified regression、longitudinal stress corpus、経路依存を壊さないための試験設計に利用できます。直接的な評価関数、勝率推定、causal dynamics、physical hysteresis、strategic regimeへ短絡しません。

### `G3-11 / FDEGHV-STUDY1`

standard initial RAW rootからdepth 10までのcomplete exact domainで次を確定しました。

```text
depth-10 unique RAW states = 348270
depth-10 tree-node occurrences = 494456
depth-10 duplicate arrivals = 11725
depth-10 multi-predecessor states = 10383
cumulative distinct RAW states through depth 10 = 451127
cumulative tree-node occurrences through depth 10 = 631101
depth-labelled legal edges through parent depth 9 = 466768
H1..H4 = DEEPER-CONFIRMED
```

move generation、RAW identity、transposition handling、search-load regressionのstress testに利用できます。exact best move、局面価値、depth 11、Bao全体のoracleとして扱いません。同じdepth-10 evidenceの再生成による再判定も行いません。

## 4. Tier C — positive premiseまたは一般化根拠として使用不可

### `G3-12 / LGTGGC-STUDY1`

```text
G3-12 = CLOSED / TECHNICAL-INVALID
SFCDF Stage 1 = STAGE1-PASS / development readiness only
SILGM Stage 1 = STAGE1-TECHNICAL-INVALID
GCLD Stage 1 = NOT EXECUTED / seeds UNREAD
Stage 2 = NOT AUTHORIZED / NOT EXECUTED / all formal seeds UNREAD
formal generalization decisions = NONE
formal counterexample decisions = NONE
```

G3-12を、広い母集団への一般化、counterexample不存在、全面的な公開変更の根拠にしません。SFCDF development PASSをformal generalizationへ昇格させず、SILGM failureを関連不存在というnegative resultへ読み替えません。

## 5. 全Programに適用する禁止推論

```text
ranking change -> current move is wrong = NOT AUTHORIZED
higher-resource search -> true best move = NOT AUTHORIZED
engine score -> validated Bao win probability = NOT AUTHORIZED
root width -> position value or win probability = NOT AUTHORIZED
search complexity -> human difficulty = NOT AUTHORIZED
unvalidated symmetry / canonicalization = NOT AUTHORIZED
G3-12 -> broad generalization = NOT AUTHORIZED
```

## 6. PBAI-P1 / PBAI-P2 no-rescue境界

`PBAI-C001..C009`の過去判断、threshold、endpoint、classifier、seed、標本を変更しません。とくに`PBAI-C004-v1`、`PBAI-C008-v1`、`PBAI-C009-v1`の失敗を、新しい名前や軽微なmechanism変更で救済しません。

新candidateは、Research Generation 3の証拠に基づく異なるmechanism、trigger、介入、期待される因果経路を持つ必要があります。

## 7. 監査結果

```text
PBAI-P3-A = COMPLETE
scientific evidence cutoff = FROZEN
Tier A / B / C classification = FROZEN
Research Generation 4 scientific influence = ZERO / EXCLUDED
candidate inventory frozen = false
candidate outcome observed before evidence freeze = false
```
