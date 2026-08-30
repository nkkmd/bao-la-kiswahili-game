# PSRRE-STUDY1 — 初見向け成果概要

## 研究

**Study ID:** `PSRRE-STUDY1`  
**正式題目:** Prospective Strategic-Regime Representation Eligibility Study 1

日本語題目:

**Baoにおける戦略状態・regime表現の新規構築とprospective eligibility検証 — G2-11長期戦略遷移研究に先立つfresh evidenceベースの独立representation prerequisite**

本Studyは、Research Generation 2の`G2-10`と`G2-11`の間に置かれたdependency-resolution prerequisite Studyです。新しい`G2-xx` agenda labelではありません。

## 結論

正式判断は:

```text
NON-ESTIMABLE
```

です。

Stage構成は次の状態で終了しました。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
selected representation = null
G2-11 candidate input authorized = false
```

Stage 1のscientific computationそのものは正常に完了し、productionとindependent implementationはexact一致しました。しかし、科学的結果を見る前に固定していたrepresentation-readiness gateのうち、**非zero-MAD feature数が20以上**という条件に対し、観測値は**15**でした。

このため、candidate familyやcluster数の科学的比較へ進むための前提を満たさないと判定し、representationをfreezeせずStage 1を閉じました。

## なぜこのStudyを行ったか

`G2-10 / UMSSR-STUDY1`では、40-feature multiaxial vectorとdeterministic K-means `K=2..6`をprospectively検証しましたが、全candidateがsupportまたはassignment-stability criteriaを満たさず、G2-11へ渡せるfrozen representationは生成されませんでした。

本Studyはその結果を修正・救済するのではなく、fresh evidenceと新しいprospective contractを使い、異なるrepresentation familyでG2-11入力候補を構築できるかを独立に検証するために開始しました。

G2-10のthreshold、feature dictionary、candidate K、formal decision、consumed seed blockは変更していません。

## 何を事前に固定したか

Stage 1 scientific seedを使用する前に、少なくとも次を固定しました。

- 28-feature dictionary
- RAW state identity
- robust median/MAD scaling
- deterministic PCA semantics
- Ward / PAMのdeterministic semantics
- 3 representation families
- candidate `K=2..8`
- minimum support `0.10`
- minimum mean silhouette `0.10`
- five-fold assignment stability `0.80`
- source-policy concentration ceiling `0.75`
- 512-root development population
- Stage 1 / Stage 2 firewall
- Stage 2 held-out eligibility contract
- production / independent exact verification
- resource ceilings
- consume-once seed rule
- no-rescue rule

候補familyは次の3つでした。

```text
RF-A-ROBUST-PCA-WARD
RF-B-ROBUST-PCA-PAM
RF-C-DIRECT-ROBUST-PAM
```

Stage 0ではscientific fitを見ず、technical determinismと独立再構築だけを確認し、3 familyすべてtechnical PASSでした。

## Stage 1の実行結果

Stage 1ではfresh seed block `29510001..29514096`の4,096 gamesをconsume-onceで実行しました。

```text
generated games = 4096
unique trajectories = 4066
distinct opening prefixes = 3734
selected roots = 512
selected distinct opening prefixes = 502
```

8つのphase / source-policy strataから各64 rootsを選択しました。

```text
namua/UNIFORM = 64
namua/CAPTURE_FIRST = 64
namua/HIGH_CAPTURE = 64
namua/LOW_CAPTURE = 64
mtaji/UNIFORM = 64
mtaji/CAPTURE_FIRST = 64
mtaji/HIGH_CAPTURE = 64
mtaji/LOW_CAPTURE = 64
```

Population diversity、selected-root uniqueness、source-policy / phase balance、resource gate、production / independent exact verificationはPASSしました。

一方、28 featureのうちnonzero MADだったのは15 featureでした。

```text
observed nonzero-MAD features = 15
required minimum = 20
active feature families = 5
required active feature families = 5
```

したがって、事前固定したreadiness mappingに従い:

```text
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
```

としました。

## この結果が意味すること

このStudyから言えるのは、**今回prospectively固定した28-feature representation contractでは、scientific model-selectionへ進むために要求したfeature-variation readinessを満たせなかった**ということです。

これは次を意味しません。

- Baoに有用なstrategic regimeが存在しない
- PCA / Ward / PAMがBaoに不適切である
- 15個のactive featureだけなら必ず良いrepresentationになる
- zero-MAD featureを削れば同じStudyを救済できる
- G2-10のnegative resultが覆った
- G2-11のlong-horizon transition structureが存在しない
- machine-defined regimeが人間の戦略概念と一致する

結果確認後に20-feature floorを15へ下げる、zero-MAD featureを除いて同じseedを再解析する、candidate family/Kを追加する、といった変更は行いません。

## G2-11への影響

本Studyではfrozen representationを生成できなかったため:

```text
G2-11 candidate input authorized = false
G2-11 scientific execution authorized = false
```

です。

`G2-11 — Long-Horizon Strategic Transition Structure Study 1`へ本Studyのunvalidated representationを持ち込むことはできません。G2-11を今後実施する場合は、その前提representation dependencyを新しいprospective designで改めて解決するか、G2-11自体の研究設計を依存関係を含めて新たにprospectively定義する必要があります。

## 再現性

Stage 1 scientific workflow:

```text
source freeze commit = 41124069f89f0706cf943e18688c96a8c2db35d7
authorization commit = 085c5df24baff44bb644c00eda91d6212caf5708
workflow run = 33308337738
job = 99248759871
artifact = 9731444105
artifact ZIP SHA-256 = c418bca917723eb9c07035c323431972ac541b4b58e286820657b0d1c7e40d7a
```

Production / independent full shardはbyte-identicalでした。

```text
SHA-256 = 1f00bf677de11899c38179c7a383676be753c1184c0010bd84d3b1fb26af6cd1
```

科学的・技術的な正本は次を参照してください。

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STUDY_1_FINAL_RESULT.json`](results/STUDY_1_FINAL_RESULT.json)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
