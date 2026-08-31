# G3-01 / LGTGMF-STUDY1 — Current Status

Updated: 2026-08-31

```text
Program agenda = Research Generation 3 G3-01
Study ID = LGTGMF-STUDY1
Formal title = Local Game-Tree Geometry Measurement Foundation Study 1
Study status = CLOSED / TECHNICAL-INVALID
Baseline remote main = 7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f
Research branch = research/g3-01-local-game-tree-geometry-measurement-foundation
Main integration = COMPLETE
Stage 0 v1 = STAGE0-TECHNICAL-INVALID / IMMUTABLE
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID / FRESH DEVELOPMENT CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed consumption = 31010001..31010096
Stage 2 seed consumption = NONE
Formal eligible measurement families = []
Protected standard-root depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## Frozen identities

```text
Stage 0 original = LGTGMF-S0-TECHNICAL-2026-08-31-v1
Stage 0 corrective = LGTGMF-S0-TECHNICAL-2026-08-31-v2
Stage 1 = LGTGMF-S1-DEVELOPMENT-2026-08-31-v1
Stage 2 = LGTGMF-S2-FORMAL-2026-08-31-v1
```

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
```

## Stage 0

Stage 0 v1では、workflow自体は成功したものの、凍結済みconstruct `rootBranchPairOverlap` と `narrowPathRun` のformal materialization欠落をfresh scientific evidence生成前のcross-contract auditで検出した。そのためv1は`STAGE0-TECHNICAL-INVALID`として保存した。

fresh evidence未生成・scientific seed未消費だったため、事前に固定していたtechnical-refreeze ruleに従い、scientific contractを変更せずv2を作成した。Stage 0 v2 workflow run `33360528096`は、production / independent reconstruction、2つの欠落construct、traversal-order invariance、G2-05 depth-2 historical referenceをすべてexactに再現し、`STAGE0-TECHNICAL-PASS`となった。

## Stage 1 fresh development

Stage 1 workflow run `33370605540`で、凍結済みseed block `31010001..31010096`を消費した。geometry-blind selectionによりNamua 6 roots / Mtaji 6 rootsを得て、全12 rootsをproduction / structurally independent implementationの双方でrelative depth 0..5までcomplete reconstructionした。

次はすべて一致した。

```text
selected root identities = exact agreement
source trajectory / opening-prefix identities = exact agreement
all root-level measurementCoreSha256 = exact agreement
F1-TREE-OCCURRENCE = exact agreement
F2-RAW-GRAPH = exact agreement
F3-TRANSPOSITION-RECONVERGENCE = exact agreement
F4-TREE-GRAPH-RELATION = exact agreement
F5-REPLY-GEOMETRY = exact agreement
resource ceilings = all selected roots within frozen limits
```

しかし、Study開始時に凍結していたcanonical artifact designは、root digestをcanonical orderで並べたdeterministic `stageCoreSha256`を要求していた。Stage 1 implementationは誤ってelapsed time、RSS等のimplementation-dependent resource observationsをstage-level hash inputへ含めたため、productionとindependentでstage-level digestが一致しなかった。

```text
production stageCoreSha256 = d9e06d4cd4830bb7aba9292351a7e1260decf98de9442cb27dfc88f44bbb3f50
independent stageCoreSha256 = 3829928f93cba835f5120e6aa9bf903ac6a5570e91e547d76a2da90cfbb3a123
stageCoreAgreement = false
```

これはgeometry primitiveそのものの不一致ではないが、凍結済みverification artifact contractを満たさないtechnical integrity defectである。

## No-rescue disposition

Stage 1 fresh evidenceはすでに生成・readされ、seed blockもconsume済みである。したがって、`stageCoreSha256`だけを修正して同一Stage 1 evidenceをrerunし、scientific dispositionを変更することはno-rescue ruleに反する。

このため:

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
eligibleFamiliesForStage2 = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study decision = TECHNICAL-INVALID
```

Stage 1で観測されたroot-level / family-level exact agreementは、将来の新しいprospective prerequisite Studyを設計する際のfailure-mode / feasibility informationとして参照できるが、本Study内ではformal eligibilityへ昇格させない。

## Protected holdout audit

```text
standard initial RAW root complete depth-10 enumeration generated = false
standard initial RAW root depth-10 scientific outcome read = false
G2-12 estimator used as depth-10 truth/input = false
```

## Research Generation 3 dependency

G3-01からformal eligible measurement familyは得られなかった。したがって、G3-02〜G3-08をこのinstrumentで自動的に開始してはならない。

2026-08-31のprogram-level dependency reassessmentにより、次のscientific directionとしてmeasurement instrumentを新規に再構築・検証するpost-G3-01 / pre-G3-02 prospective prerequisite Study（working title: `Local Game-Tree Geometry Measurement Instrument Verification Study 1`）を選択した。これはG3-01のStudy 2、corrected rerun、rescue、G3-02そのものではない。formal Study ID、scientific execution、fresh seed consumptionはまだ開始しておらず、G3-01のclosed resultは変更しない。

## Main integration

2026-08-31、userの明示的指示により、documentation consistency audit後のresearch branch HEAD `fa7476ed764ac2ff1497774afead22698dbe76e4`を、remote `main` `7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f`から`force=false`でfast-forward統合した。

このrepository integrationはStudyのformal scientific decision、seed consumption、Stage authorization、eligible family set、protected depth-10 holdoutを変更しない。統合前checkpointに保存された`main integration = NOT PERFORMED`等の表記は、そのcheckpoint作成時点の歴史的状態として保持する。
