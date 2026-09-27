# G4-08 / BRSGT-STUDY1 — Bao Rule-Semantic Geometry Transition Study 1

更新日: 2026-09-27  
状態: **CLOSED / STAGE 2 FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / MAIN INTEGRATED**

## 目的

Research Generation 4 / G4-08として、Bao固有のrule-semantic event前後でbounded RAW local game-tree geometryのどの成分が変化するかを、event familyごとに分離してprospectiveに検証した。

対象event family:

1. `BRSGT-E1-CAPTURE`
2. `BRSGT-E2-NYUMBA-USE-VS-STOP`
3. `BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION`
4. `BRSGT-E4-NAMUA-TO-MTAJI`

これらをpooled event familyへ混合しない。

## Representation / measurement boundary

```text
authoritative state identity = pits,reserve,houseOwned,player,phase,winner,pending
representation = RAW-ONLY
validated transform set = []
relative local horizon = 5
measurement foundation = LGTGMIV-STUDY1 / FORMAL-ELIGIBLE-ALL
```

metricは6つのexact integer / reduced-rational endpoint:

- `BRSGT-M1-ROOT-LEGAL-WIDTH`
- `BRSGT-M2-CUMULATIVE-TREE-OCCURRENCE`
- `BRSGT-M3-GLOBAL-DISTINCT-RAW-STATES`
- `BRSGT-M4-DUPLICATE-TRANSITION-FRACTION`
- `BRSGT-M5-CUMULATIVE-TREE-RAW-RATIO`
- `BRSGT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION`

Default constructは **EVENT-CONDITIONED PRE/POST ASSOCIATION**。一般的causal effect、whole-Bao law、game-theoretic consequence、AI strength、人間のdifficultyは対象外。

## Stage 0

v1はtechnical fixture不整合で`TECHNICAL-INVALID / NO-RERUN`。

v2はRun `36295553800`で`STAGE0-PASS`。4 event familiesのtechnical coverageとproduction / independent unit-by-unit exact agreementを確認し、fresh scientific seedは読まなかった。

## Stage 1

v1・v2はtechnical-invalidとして閉じ、各seed namespaceを再利用禁止とした。

v3はRun `36303568642`で`STAGE1-DEVELOPMENT-COMPLETE`。

```text
fresh reads = 512
seed block = 40815001..40815512
measured event units = 64
unique geometry roots = 97
production / independent exact agreement = true
formal inference = false
effect direction used for promotion = false
```

4 event families × 6 metrics = 24 slotsの全てがsupport gateを満たし、`SUPPORTED-FOR-FORMAL-HOLDOUT`となった。

これは方向性の科学結果ではなく、Stage 2 formal familyのsupport eligibilityだけを示す。

## Stage 2

### Pre-fresh audit

最初のauditはG4-08 Stage 1 v3 artifactのnested layoutとworkflow期待pathの不一致でfresh access前に停止した。

artifact normalizationとstatic-auditの現行spec-key参照だけをtechnical correctionし、科学spec・seed block・formal family・inference ruleは変更しなかった。

再監査Run `36314109864`はPASS。

```text
audit HEAD = d2e22fa9b4ca8286480beda2a89b5e287bcdad9c
fresh Stage 2 reads = 0
formal family = 24 fixed slots
G4-10 access = 0
public AI change = false
```

### One-shot formal holdout

Run `36314208922` / attempt 1でformal executionを完遂した。

```text
execution HEAD = 692d2d718ab55348e7fb4f8190476524b0a5bc95
artifact ID = 10929684128
artifact ZIP SHA-256 = bbbe1e2206c9f439168829581d1bce1ef03dddaec1fe0914b8888a63767bcb1b
seed block = 40823001..40824024
fresh reads = 1024 / 1024
production / independent exact agreement = true
no-rescue boundary crossed = true
```

frozen freshness firewallによるsource exclusion:

```text
UPSTREAM-REACHABLE-RAW-ROOT = 1011
UPSTREAM-TRAJECTORY = 6
UPSTREAM-OPENING-PREFIX = 7
total rejected = 1024
accepted = 0
```

accepted source trajectoryが0となったため、event candidateとgeometry measurementも0であった。

Formal result:

```text
formal slots = 24
INCREASE-CONFIRMED = 0
DECREASE-CONFIRMED = 0
NOT-CONFIRMED = 0
NON-ESTIMABLE = 24
TECHNICAL-INVALID = 0
```

**G4-08の正式なStage 2結果は24/24 `NON-ESTIMABLE`。**

これは「effectなし」というnegative resultではない。frozen freshness gate後にformal estimabilityを形成するevent unitsが残らなかったため、各eventのgeometry方向について結論を形成できなかったことを意味する。

## Freshness exhaustion diagnostic

formal resultを変更しないpost-execution identity diagnosticでは、全1024 Stage 2 trajectoriesとStage 1 v3の512 rowsが共通のply-0 initial RAW rootを含むことを確認した。

```text
initial RAW root = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
Stage 2 = 1024 / 1024 rows
Stage 1 v3 = 512 / 512 rows
```

このinitial rootはfrozen firewallに含まれる。そのためtrajectory collision 6件、opening-prefix collision 7件を先に除いた残り1011件は、ply 0でreachable-RAW-root collisionとなった。

これは同Stage/versionを救済する理由には使用しない。ply 0の除外、freshness grammar変更、seed extension、replacement population、same-evidence rerunはno-rescue契約により禁止される。

## Interpretation / closure

このStudyから許される結論は次に限定する。

- Stage 1では24/24 slotsにformal holdout用supportがあった。
- Stage 2ではfrozen fresh population 1024/1024がfrozen identity firewallで除外された。
- そのため24/24 formal slotsはNON-ESTIMABLEとなった。
- capture、nyumba、reserve decrement、Namua→Mtajiのgeometry directionについてformal confirmationは得られていない。
- NON-ESTIMABLEをno-effect、negative result、counterexampleへ読み替えない。

`BRSGT-STUDY1`はこのformal closureをもって研究実行を終了する。

## Protected boundaries

```text
Stage 0 v1 rerun = prohibited
Stage 1 v1/v2/v3 rerun = prohibited
Stage 2 v1 rerun = prohibited
G4-10 depth-11 access = 0 / prohibited
public AI change = none
main integration = COMPLETE / FAST-FORWARD
integrated research HEAD = 0956b5b17085714c1fb9df8ef82f29f6b6ff0f53
```

## Records

- 現在状態: [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- decision register: [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- Stage 2 canonical record: [`results/stage-2/STAGE_2_CANONICAL_RECORD.json`](results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- Stage 2 closure checkpoint: [`checkpoints/2026-09-27-stage-2-formal-complete.md`](checkpoints/2026-09-27-stage-2-formal-complete.md)
- Stage 2 preregistration: [`prereg/STAGE_2_FORMAL_SPEC.json`](prereg/STAGE_2_FORMAL_SPEC.json)
- Stage 2 identity firewall: [`prereg/STAGE_2_IDENTITY_FIREWALL.json`](prereg/STAGE_2_IDENTITY_FIREWALL.json)
- main integration checkpoint: [`../research-generation-4/checkpoints/2026-09-27-g4-08-main-integration.md`](../research-generation-4/checkpoints/2026-09-27-g4-08-main-integration.md)

Research branch: `research/g4-08-rule-semantic-geometry-transition`
