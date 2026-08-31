# 2026-08-31 — Research Generation 3 post-G3-01 measurement-instrument prerequisite selected

## Decision status

```text
Decision type = PROGRAM-LEVEL DEPENDENCY DIRECTION
Decision date = 2026-08-31
Baseline main before this synchronization = 3301d797410f0cb4a1e392e277fc968435b36aea
Scientific Study started by this decision = false
Formal Study ID assigned = false
Stage IDs assigned = false
Scientific seeds assigned or consumed = false
New scientific branch created = false
```

## Selected next scientific direction

G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`でclosedし、formal eligible measurement familiesは`[]`である。したがってG3-02を通常順序で開始せず、Research Generation 3の次のscientific actionとして、**G3-01とは別の新しいprospective independent measurement-instrument prerequisite Study**を置く。

現時点のworking titleは次とする。

**English working title**

**Local Game-Tree Geometry Measurement Instrument Verification Study 1**

**日本語working title**

**Baoにおける局所ゲーム木幾何測定instrumentの新規prospective再構築と独立検証 — deterministic canonical manifest、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立**

このworking titleはprogram-level planning labelであり、正式Study title / Study ID / Stage IDではない。正式identityは新Study開始時にcurrent remote `main`、repository naming rule、Research Generation 3 governanceを再監査したうえでscientific outcome生成前にprospectively固定する。

## Program position

```text
G3-01 = CLOSED / TECHNICAL-INVALID
        ↓
new post-G3-01 / pre-G3-02 measurement-instrument prerequisite
        ↓ only if formal eligibility is established
G3-02 and downstream geometry studies may be separately authorized
```

このprerequisiteは、

- G3-01のStudy 2ではない。
- G3-01のcorrected rerunではない。
- G3-01のformal decisionを変更・救済・再解釈しない。
- G3-02そのものではない。
- G3-01 Stage 1のconsumed seed block `31010001..31010096`を再利用しない。

## Mandatory design information carried forward

G3-01のfailure modeは**design information**としてのみ利用できる。新Studyでは少なくとも次をscientific outcome前に明示的に分離・固定する。

1. authoritative RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`を維持する。
2. validated transform setは`[]`のままとし、symmetry / canonicalizationをdeduplicationへ導入しない。
3. bounded local game tree / reachable RAW graphをproduction implementationとstructurally independent implementationで別々に再構築する。
4. scientific / verification canonical coreはdeterministic fieldsだけから構成する。
5. elapsed time、RSS、wall-clock、runner-specific telemetry等のruntime resource observationsはscientific canonical hash inputから完全に分離し、provenance / resource telemetryとして別管理する。
6. canonical serialization、canonical root ordering、traversal-order invariance、root-level digest、family-level digest、stage-level deterministic digestのcross-implementation reproducibilityを検証する。
7. fresh development evidenceと、authorization条件を満たした場合のfresh formal holdout evidenceを分離する。
8. fresh evidence read後のsame-evidence implementation repair、threshold relaxation、seed replacement、post-hoc gate変更を認めない。
9. G3-11用standard-root complete exact depth-10 holdoutはsealedのまま維持し、このprerequisiteでは生成・readしない。

具体的なmetric family、population、local horizon、sample/root count、resource ceiling、seed range、promotion / estimability gate、formal decision taxonomyはこのprogram decisionだけでは固定しない。新Study開始時にprospectively固定する。

## Downstream authorization boundary

```text
G3-02..G3-08 automatic start = BLOCKED
G3-09..G3-12 = NOT AUTHORIZED BY THIS DECISION
next prerequisite formal eligible measurement families = NOT YET ESTABLISHED
protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

新prerequisiteがformal eligible measurement familyを成立させた場合でも、その結果だけでG3-02を自動開始しない。closure後にResearch Generation 3 current stateを同期し、downstream authorization boundaryを改めて確認する。

新prerequisiteが`TECHNICAL-INVALID`、`NON-ESTIMABLE`、`INCONCLUSIVE`その他の非eligibility closureとなった場合は、G3-01をreopenせず、program dependencyを再評価する。

## Immutable upstream boundary

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

G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 1 seed block = CONSUMED / NO REUSE
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Disposition

Research Generation 3は`ACTIVE`を維持する。dependency reassessmentの結果、次のscientific directionは新しいpost-G3-01 / pre-G3-02 measurement-instrument prerequisiteへ固定した。ただし本decisionは研究開始authorizationではなく、formal Study identity、scientific branch、seed、evidence generationは未開始である。
