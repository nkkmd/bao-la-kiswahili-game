# `PBAI-P3` — candidate台帳

状態: **`INITIAL INVENTORY FROZEN / PRE-SUPPORT`**

固定日: 2026-09-05

Program: `PBAI-P3`

機械可読inventory:

- [`candidates/PBAI-P3-INITIAL-CANDIDATE-INVENTORY-2026-09-05-v1.json`](candidates/PBAI-P3-INITIAL-CANDIDATE-INVENTORY-2026-09-05-v1.json)

## 1. 固定したinventory

```text
initial candidate inventory = PBAI-C010-v1 only
candidate identifiers issued = 1
candidate implementation authorization = NONE
support / reachability execution authorization = NONE
inventory additions after outcome inspection = PROHIBITED
```

`PBAI-P3`は、最初の候補を1件に限定します。候補数を増やして成功確率を事後的に高めることや、失敗後に近いmechanismを別名で追加することを防ぐためです。

## 2. `PBAI-C010-v1` — 計算量を制約した選択的root再検証

優先度: **第一候補 / 唯一のinitial candidate**

状態: **`INVENTORY-FROZEN / PREDEVELOPMENT-SUPPORT-NOT-AUTHORIZED`**

### 2.1 目的

root legal widthがphase別の固定境界を超え、反復深化の連続する完了iteration間でroot ranking preorderが変化した局面だけを対象に、上位3手へ限定した追加root検証を行います。

通常局面では既存`AI-GEN2`を維持し、対象局面でもnode reserve、wall-clock deadline、発火回数を固定上限内に収めます。

### 2.2 Research Generation 3との対応

設計入力は`G3-07 / SILGM-STUDY1`です。同Studyは限定populationで、root legal widthのhigh stratumにranking-preorder changeが集中する関連を、depth、node budget、quiescenceの3 peer perturbationで確認しました。

この正式結果から利用するのは、**widthとranking changeの結合条件を新しい工学仮説として検討できること**だけです。runtime signalは公開searchが既に生成するiteration scoreから構成するengineering proxyであり、SILGMのformal `E3` instrumentそのものではありません。

### 2.3 固定したmechanism境界

```text
candidate = PBAI-C010-v1
feature flag proposal = pbaiC010SelectiveRootReverification
default before adoption = false
eligible levels = hard / expert
eligible profile = bao enhanced iterative-deepening search
activation maximum = once per analyzeMove
root legal width condition:
  Namua > 4
  Mtaji > 3
ranking condition = pairwise root-score preorder changes between two consecutive completed iterations
candidate set maximum = 3 root moves
supplemental node reserve maximum = min(50% of nodes through trigger, 32768)
wall-clock extension = 0 ms
incomplete verification = discard partial result and retain frozen nominal fallback
new persistent memory = prohibited
rule engine / evaluation weights change = prohibited
```

Ranking preorderでは、各root move pairの`<`、`=`、`>`関係を比較します。canonical move keyは表示順と同値時の決定性だけに使用し、未検証のsymmetryやcanonicalizationは使用しません。

上位3手は、triggerを成立させた後側iterationのscore preorderを優先し、同値時だけcanonical move keyで決めます。support監査ではcandidate searchを実装せず、この集合が安価に構成できるかと、固定reserve内で検証可能かだけを測定します。

### 2.4 期待する因果経路

1. root widthが大きくranking preorderも変化する局面に対象を限定する。
2. baseline iterationが示す上位3手へ追加計算を集中する。
3. 追加検証が完了した場合だけ、次のroot判断へ再検証情報を利用する。
4. 通常局面と不完全検証ではbaseline fallbackを保持する。

これは「ranking changeが悪手を証明する」という因果主張ではありません。選択的な追加計算がengineering referenceに対するdecision qualityを改善するかを、fresh evidenceで試す仮説です。

### 2.5 過去候補との実質的な違い

| 過去候補 | 過去mechanism | `PBAI-C010-v1`との違い |
| --- | --- | --- |
| `PBAI-C004-v1` | D2→D3のselected-best変化後、root TT-best-first orderingだけを有効化 | C010はwidthと全root pairwise preorder changeの結合triggerを使い、orderingだけでなく上位3手を実際に追加検証する |
| `PBAI-C008-v1` | final best flip後、直前bestとfinal bestの2手を一律にdepth `d+1` full-window再探索 | C010はbest-key flip単独では発火せず、上位集合をrankingから作り、明示的node cap、1回上限、不完全時のbaseline fallbackを持つ |

C010はC004またはC008のsame-version rescueではありません。過去のseed、root、threshold、endpoint、resultを再利用しません。

### 2.6 主要リスク

- G3-07の関連が現在のpublic search budgetでは十分にreachableでない。
- runtime ranking proxyとformal SILGM `E3`の意味が一致しない。
- 上位3手への追加計算でもC008と同様にcostが大きくなる。
- node capにより追加検証が完了せず、実効supportが不足する。
- top-3外の手を除外することによるdecision quality低下。
- instrumentationやfeature-on経路がbaselineの決定性を壊す。

## 3. candidateにしなかった方向

- `G3-04`のphase差はbenchmark層別化に使いますが、forcingや品質を証明しないためphase-aware evaluation / budget変更をcandidate化しません。
- `G3-10`はtrajectory stress corpusへ使い、直接評価関数へ埋め込みません。
- `G3-11`はRAW identity、transposition、search-load regressionへ使い、best-move oracleとしてcandidate化しません。
- `G3-12`は`TECHNICAL-INVALID`であり、一般化に基づくcandidateを作りません。

この除外方針は、C010失敗後にこれらをPBAI-P3へ追加する余地を予約するものではありません。新しいProgramで扱うには、新しいevidence cutoffとoutcome非依存の認可レビューが必要です。

## 4. 次の認可境界

次に許可できるのは、[`SUPPORT_REACHABILITY_PROTOCOL.md`](SUPPORT_REACHABILITY_PROTOCOL.md)に固定したbaseline-only auditの実行だけです。

SupportがPASSしてもcandidate実装は自動承認されません。`PBAI-P3-E`でexact candidate contract、source surface、feature-off test、development authorizationを別に固定します。
