# PBAI-C008-v1 — predevelopment support PASS checkpoint

Date: 2026-09-01  
Program: `PBAI-P2`  
Stage: `PBAI-P2-D-PREDEVELOPMENT-SUPPORT`  
Candidate: `PBAI-C008-v1`  
Decision: **`SUPPORT-PASS`**

## 1. 事前固定した問い

`PBAI-C008-v1`は、G2-02のformal decision `INCONCLUSIVE`を変更せず、その事前指定secondary search descriptorsだけをTier Bのhypothesis-forming inputとして開始した。

候補機構の有効性を測る前に、current frozen `AI-GEN2` baselineでD2とD3のdeterministic selected root moveが入れ替わる局面が、fresh support populationに十分存在するかだけを確認するsupport gateを固定した。

```text
support seeds = 43200001..43201024
candidate code = prohibited
minimum eligible roots = 64
technical failures allowed = 0
```

D4 quality、confirmation result、node cost、strength、validation、release holdoutはsupport measurementでは観測しない。

## 2. canonical execution

最初のsuccessful executionをcanonicalとする。

```text
workflow run = 33492849852
job = 99808142315
head SHA = f17ab590a6305c0da806b963360cb60f861757d3
artifact = 9794730237
artifact ZIP SHA256 = 4a56952f7bdf034f472661314d9de29a824a6342a63df1230969dbbfd6f2c6a3
production result SHA256 = 2eb30a3d411c08285778352b73035e2b976a2e583a6435e25bf2968b589e74e3
independent verification SHA256 = c172230cb0b5ff81e4667d2b4a691e7cd6f945afd7d8be8b12f2ab1810c62c64
deterministic core SHA256 = 9010ffa1fbdfa33e854d1fafe3c652e2017a6b46f0902c7fe25de69e0b2411c9
```

Production / independentはsource-root identity、D2/D3 move key、eligibility、selected eligible-root digest、decision coreを完全一致で再構成した。

## 3. support population

```text
source seeds = 1024
trajectory roots available = 870
unavailable trajectory roots = 154
source Namua = 512
source Mtaji = 358
source root digest = a65b84d663f4d16c74a0527260cc049be815f587fb6b45e8e6e57d75272aed61
```

各seedから最大1 rootだけを、seed parityで事前指定したphase内のminimum SHA-256 rankによってoutcome/value/consequence-blindに選択した。

## 4. support result

```text
technicalFailures = 0
rootBestFlipEligible = 233
eligible Namua = 177
eligible Mtaji = 56
selected eligible examples = 128
selected Namua = 72
selected Mtaji = 56
selected eligible root digest = f4b763478d1910e27ba59c10fca6b6e65ad442e877b3c478c7972d5cd02213fb
```

Frozen minimum `64`に対してeligible rootsは`233`であり、support floorを通過した。

Mtaji eligibleが56で64-targetを満たさなかったためselected example setはNamua 72 / Mtaji 56となった。ただしphase balanceはspec上「target」であり、追加estimability gateではないことを結果前に固定済みである。結果後にphase-specific floorを追加しない。

## 5. 判断

事前固定したdecision mappingを適用する。

```text
PBAI-C008-v1 predevelopment support = SUPPORT-PASS
candidate implementation = NOT YET AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public AI change = 0
```

Support PASSは、root-best-flip signalがfresh frozen baseline support universeでcandidate developmentを検討するだけの十分なsupportを持つことを示す。candidate mechanismの品質改善、速度、棋力、D4 reference superiorityはまだ何も示していない。

## 6. 科学的解釈の境界

次は主張しない。

- G2-02のformal decisionが`CONFIRMED`へ変わったこと
- D3またはD4が真のbest moveであること
- root-best flipが人間にとって難しいこと
- 233/870という比率がBao全体へ一般化できること
- confirmation re-searchが有効であること

PBAI-P2 engineering supportはResearch Generation 2のformal scientific decisionを変更しない。

## 7. 次に許可する工程

candidate sourceを変更する前に、`PBAI-C008-v1`のexact implementation contract、feature-off equivalence、development population、primary benefit metrics、cost ceilings、failure semanticsを別途freezeする。

```text
exact implementation contract freeze = AUTHORIZED NEXT
candidate source modification = NOT AUTHORIZED UNTIL CONTRACT FREEZE
validation / release holdout = NOT AUTHORIZED / NOT ACCESSED
Research Generation 3 influence = ZERO
```
