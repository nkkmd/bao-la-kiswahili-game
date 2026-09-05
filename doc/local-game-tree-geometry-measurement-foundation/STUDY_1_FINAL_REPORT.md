# G3-01 / LGTGMF-STUDY1 — 最終報告

更新日: 2026-08-31  
正式判断: **`TECHNICAL-INVALID`**

正式英語名: **Local Game-Tree Geometry Measurement Foundation Study 1**

日本語題目: **Baoにおける局所ゲーム木幾何の再現可能な測定基盤構築 — bounded RAW tree/graphのexact reconstructionによるbranching、reply width、transposition、reconvergence、tree/graph divergenceのprospective定義・検証**

## 1. 研究目的

G3-01はResearch Generation 3のmeasurement foundationとして、同一のauthoritative RAW rootと同一のbounded horizonから生成されるlocal game tree / reachable RAW graphについて、production implementationとstructurally independent implementationが同じexact measurementを再構築できるかを検証した。

対象としたのは、tree occurrence、distinct RAW state、legal transition、duplicate encounter、parent multiplicity、root branch reconvergence、tree / graph relation、reply-width geometryなどである。本Studyは戦略cluster、game-theoretic value、best move、人間の難易度、Bao全体のstate-space / game-tree sizeを推定する研究ではない。

## 2. 結果を見る前に固定したidentity

```text
Research Generation = Research Generation 3
Agenda label = G3-01
Study ID = LGTGMF-STUDY1
Baseline remote main = 7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f
Research branch = research/g3-01-local-game-tree-geometry-measurement-foundation
Stage 0 original = LGTGMF-S0-TECHNICAL-2026-08-31-v1
Stage 0 corrective = LGTGMF-S0-TECHNICAL-2026-08-31-v2
Stage 1 = LGTGMF-S1-DEVELOPMENT-2026-08-31-v1
Stage 2 = LGTGMF-S2-FORMAL-2026-08-31-v1
```

Study ID、Stage IDs、RAW identity、move identity、candidate metric family、fresh seed block、root-selection rule、local horizon、resource ceiling、firewall、formal decision taxonomy、no-rescue ruleはfresh scientific outcome生成前に固定した。

## 3. 維持したupstream boundary

本StudyはResearch Generation 1 / 2のclosed resultを変更していない。

```text
Research Generation 2 = CLOSED
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator = null
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
```

RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`であり、`turn`と`reason`はidentityへ含めなかった。reflection、rotation、player swap、symmetry quotient、canonicalizationはstate reductionへ使用していない。

## 4. 固定済みmeasurement family

次の5 familyをStudy開始時に固定した。

```text
F1-TREE-OCCURRENCE
F2-RAW-GRAPH
F3-TRANSPOSITION-RECONVERGENCE
F4-TREE-GRAPH-RELATION
F5-REPLY-GEOMETRY
```

一次measurementはinteger count、canonical set / tuple、exact numerator / denominator、SHA-256 digestを中心に構成した。floating-point toleranceをformal primary gateには用いなかった。

## 5. Stage 0 — technical entry （Stageの記録）

### 5.1 v1 （概要）

Stage 0 v1 workflow run `33358158087`では、RAW serialization、move binding、synthetic transposition / reconvergence、traversal-order invariance、G2-05 depth 0..2 historical exact referenceとの照合など、実行上のtechnical check自体はpassした。

しかしStudy-level cross-contract auditにより、凍結済みconstructである`rootBranchPairOverlap`と`narrowPathRun`のformal materializationがv1 measurement coreに存在しないことを検出した。

したがって:

```text
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
Stage 1 authorization from v1 = false
```

とした。

### 5.2 corrective v2の結果

この欠陥はfresh development / formal evidenceを一切生成・readしておらず、scientific seed consumptionも`NONE`の時点で見つかった。Study開始時に固定していたtechnical-refreeze ruleに従い、scientific contractを変更せずcorrective v2を別Stage versionとして固定した。

Workflow run `33360528096`では次がすべてpassした。

```text
rootBranchPairOverlapAgreement = true
narrowPathRunAgreement = true
traversalOrderInvariance = true
historicalDepth2ReferenceAgreement = true
productionIndependentAgreement = true
independentImportsProductionV2 = false
measurementCoreSha256 = 6c3c4a2aef893c09804988ef0d61a64424d415ee6bd63ebedd59e4ae91fee555
```

したがって:

```text
Stage 0 v2 = STAGE0-TECHNICAL-PASS
```

とし、Stage 1 execution prerequisiteを満たした。

## 6. Stage 1 — fresh development （開発段階）

Stage 1はformal scientific inferenceを行わない`FRESH-DEVELOPMENT`である。

```text
seed block = 31010001..31010096
required roots = Namua 6 / Mtaji 6
local target depth = 5
```

seedごとに凍結済みdeterministic source policyを用い、geometryやsearch evaluationを見ずにrootを選択した。全12 rootsが選択され、production / independentの双方でrelative depth 0..5までcomplete reconstructionされた。

### 6.1 成立したdevelopment-level agreement

次はすべてexactに一致した。

```text
selected root identities
source trajectory identities
opening-prefix identities
all 12 root-level measurementCoreSha256 values
F1-TREE-OCCURRENCE family digests
F2-RAW-GRAPH family digests
F3-TRANSPOSITION-RECONVERGENCE family digests
F4-TREE-GRAPH-RELATION family digests
F5-REPLY-GEOMETRY family digests
```

また、全12 rootsは凍結済みresource ceiling内でcompleteだった。

これは、bounded local tree / RAW graphの主要primitiveについて、fresh development population上でproductionとindependent implementationが同じmeasurement coreを再構築できたことを示す。ただしStage 1はdevelopment evidenceであり、この一致だけでformal eligibilityを主張することはできない。

### 6.2 Stage-level canonical manifestのdefect

Study開始時のartifact contractでは、root digestをcanonical orderで並べたdeterministic `stageCoreSha256`を持つことを要求していた。

Stage 1 implementationは誤ってelapsed time、resident-set size等のimplementation-dependent resource observationsをstage-level hash inputへ含めた。その結果、measurement coreとfamily digestが全rootで一致していたにもかかわらず、stage-level digestは一致しなかった。

```text
production stageCoreSha256
= d9e06d4cd4830bb7aba9292351a7e1260decf98de9442cb27dfc88f44bbb3f50

independent stageCoreSha256
= 3829928f93cba835f5120e6aa9bf903ac6a5570e91e547d76a2da90cfbb3a123

stageCoreAgreement = false
```

これはgeometry primitiveのscientific disagreementではなく、verification artifact assemblyのtechnical defectである。しかし、凍結済みcanonical artifact designを満たしていないため、Stage 1をvalid passとして扱うことはできない。

## 7. No-rescue ruleの適用

Stage 1ではfresh seed block `31010001..31010096`を既にconsumeし、fresh development outcomeを生成・readした。

事前に固定したno-rescue ruleは、fresh development evidence生成後にtechnical implementationを修正し、同じconsumed evidenceをrerunしてscientific dispositionを変更することを認めていない。

したがって、deterministic stage manifestだけを作り直してStage 1をpassへ変更することは行わなかった。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
same-evidence repair/rerun = NOT AUTHORIZED
eligibleFamiliesForStage2 = []
```

このfail-closed handlingは、実質的に良好だったroot-level agreementを無視するためではなく、outcomeを見た後にverification contractを有利に修正しないためのものだ。

## 8. Stage 2の状態

Stage 2はStage 0 technical passとStage 1 development passをprerequisiteとしていた。Stage 1がtechnical-invalidで閉じたため、Stage 2を実行していない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed block 31020001..31020096 = UNCONSUMED
FRESH-FORMAL-HELDOUT outcome = NONE
```

したがって、本Studyにはformal held-out measurement eligibilityを成立させる証拠が存在しない。

## 9. 正式判断

```text
LGTGMF-STUDY1 = TECHNICAL-INVALID
formal eligible measurement families = []
```

この判断は「局所ゲーム木幾何を測定できない」ことや「F1〜F5の定義が科学的に否定された」ことを意味しない。Stage 1 developmentでは全familyのroot-level exact agreementを観測したが、事前固定したformal verification chainを最後まで満たせなかったため、本Studyからdownstream利用可能なformal eligibilityを付与できない、という境界である。

## 10. protected depth-10 holdout （証拠の状態）

standard initial RAW rootのcomplete depth-10 exact layerはG3-11用にsealedされたままである。

```text
complete depth-10 enumeration generated = false
depth-10 scientific geometry/count outcome read = false
G2-12 estimator used as depth-10 truth/input = false
```

Stage 1のtrajectory source generationは単一legal pathを進めたものであり、standard-root complete depth-10 layerのenumerationやaggregate geometry generationを行っていない。

## 11. 解釈境界

本Studyから次を主張しない。

- Bao全体のstate-space size
- Bao全体のgame-tree size
- asymptotic growth law
- strategic regime
- best move / winning move / forced winとの関係
- search reliability
- human difficulty
- game-theoretic value
- symmetry-reduced count
- G2-12 estimatorの妥当性

Stage 1 development populationで観測された個別geometry patternも、本Studyのformal scientific findingとして一般化しない。

## 12. Research Generation 3への影響

Research Generation 3のprogram contractでは、G3-02〜G3-08は原則としてG3-01でformal eligibilityを得たmeasurement familyだけを使用する。

本Studyではeligible family setが空であるため、G3-02以降を同じinstrumentのまま自動的に開始してはならない。

合理的な次の手段は、G3-01を救済・再判定することではなく、今回のfailure modeをdesign informationとして利用し、deterministic stage manifestをscientific outcome前から正しく固定した**新しいprospective prerequisite Study**を設計することである。別案として、Research Generation 3全体のdependency graphをprogram levelで再評価することも可能である。

## 13. 再現性とartifact provenance

主要workflow / artifact:

```text
Stage 0 v1 run = 33358158087
Stage 0 v2 run = 33360528096
Stage 0 v2 artifact = 9746522427
Stage 0 v2 artifact digest = sha256:c77bd33aaa23f1b98ba703f4f7c6244d2ddc8f07325978bfea704a8f7d322213

Stage 1 run = 33370605540
Stage 1 artifact = 9749942891
Stage 1 artifact digest = sha256:d2fba425e60f2f8af9b821533628880be53c13b8e4af79266a1693ddd87370f4
Stage 1 independent verification SHA256 = c4fb4285560e1db291da52267a280c34eec1276ba94e4dbddd044f999042968f
```

詳細は`REPRODUCIBILITY_INDEX.md`、`DECISION_REGISTER.md`、`results/`、`checkpoints/`を参照する。

## 14. repositoryの状態

本Studyはresearch branch上で閉じる。`main`への統合はuserから明示的な指示があるまで行わない。
