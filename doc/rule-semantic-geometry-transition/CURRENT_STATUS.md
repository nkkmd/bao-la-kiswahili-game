# G4-08 / BRSGT-STUDY1 — 現在の状態

更新日: 2026-09-27  
状態: **STUDY CLOSED / STAGE 2 FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / NO DIRECTIONAL SCIENTIFIC CONCLUSION / MAIN INTEGRATED**

## Formal identity

```text
Agenda = Research Generation 4 / G4-08
Study ID = BRSGT-STUDY1
Branch = research/g4-08-rule-semantic-geometry-transition
Reviewed main = 2023860419d13b6f294b0600943de8fb4e50b1bb
Integrated research HEAD = 0956b5b17085714c1fb9df8ef82f29f6b6ff0f53
```

## Current boundary

```text
Stage 0 v1 = TECHNICAL-INVALID / NO-RERUN
Stage 0 v2 = STAGE0-PASS / COMPLETE
Stage 1 v1 = TECHNICAL-INVALID / NO-RERUN-SAME-VERSION
Stage 1 v1 block = 40813001..40813512 / QUARANTINED / NO REUSE
Stage 1 v2 = TECHNICAL-INVALID / NO-RERUN-SAME-VERSION
Stage 1 v2 block = 40814001..40814512 / CONSUMED / NO REUSE
Stage 1 v3 = STAGE1-DEVELOPMENT-COMPLETE / SUPPORT-ONLY
Stage 1 v3 block = 40815001..40815512 / 512 READ / CONSUMED / NO REUSE
Stage 2 v1 = STAGE2-FORMAL-COMPLETE / 24 NON-ESTIMABLE / NO RERUN
Stage 2 block = 40823001..40824024 / 1024 READ / CONSUMED / NO REUSE
G4-10 depth-11 = NOT AUTHORIZED / NOT ACCESSED
public AI change = NONE / NOT AUTHORIZED
pre-main audit = PASS / READY-FOR-MAIN-INTEGRATION-REVIEW
main integration = COMPLETE / FAST-FORWARD
```

## Stage 0

Stage 0 v1はtechnical fixture不整合で`TECHNICAL-INVALID / NO-RERUN`。Stage 0 v2はRun `36295553800`で`STAGE0-PASS`となった。

```text
fixtures = 4
represented seed total = 64 for every fixture
E1-E4 = covered
production / independent exact agreement = true
fresh scientific seed reads = 0
```

Canonical record: `results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json`

## Stage 1 closure

### v1

Run `36298620437`。counter shorthand defectにより`STAGE1-TECHNICAL-INVALID`。exact fresh-read countを保存できなかったため`40813001..40813512`全体を安全側で隔離した。同version rerun禁止。

### v2

Run `36299638508`。512 slotsをread後、CRCLGR preflight limit-key interface mismatchで`STAGE1-TECHNICAL-INVALID`。`40814001..40814512`は全消費・再利用禁止。

### v3

pre-fresh static auditを経てone-shot実行を行い、Run `36303568642`で`STAGE1-DEVELOPMENT-COMPLETE`。

```text
execution HEAD = b59918149fdceac5f619328aa82771abdbfa5994
artifact ID = 10926322837
artifact ZIP SHA-256 = c93ae26b019edde841e58a4f452aa8bacd45c0954937294ca2c12c786d916140
fresh reads = 512
measured event units = 64
unique geometry roots = 97
production / independent exact agreement = true
formal inference = false
effect value/sign/direction retained for promotion = false
```

4 event families × 6 metricsの全24 slotsがStage 1 support gateを通り、`SUPPORTED-FOR-FORMAL-HOLDOUT`となった。これはdirectional resultではない。

Canonical record: `results/stage-1-v3/STAGE_1_V3_CANONICAL_RECORD.json`  
Checkpoint: `checkpoints/2026-09-27-stage-1-v3-development-complete.md`

## Stage 2 pre-fresh verification

Stage 2はfixed 24-slot formal family、fresh block `40823001..40824024`、RAW depth 5、exact two-sided binomial sign test、Holm-Bonferroni、policy concordanceを事前登録した。

最初のpre-fresh audit Run `36313405735` は、G4-08 Stage 1 v3 artifact内のidentity fileがnested pathに保存されていた一方、workflowがtop-level pathを期待していたため、fresh access前のpresence checkで停止した。scientific seed readは0。

artifact layout normalizationとstatic-auditの現行spec-key参照だけをtechnical correctionし、科学spec・seed block・formal family・inference ruleは変更しなかった。

再監査:

```text
static audit run = 36314109864 / attempt 1 / PASS
job = 108605445752
audit HEAD = d2e22fa9b4ca8286480beda2a89b5e287bcdad9c
disposition = STAGE2-PRE-FRESH-STATIC-AUDIT-PASS
audit scope = 2
artifact ID = 10930605637
artifact ZIP SHA-256 = 00a84324547b1ffd1718283a1afbc3ae5d5dbe76776af8a5c816ade06b98c6e7
fresh Stage 2 reads = 0
G4-10 access = 0
public AI changed = false
```

監査HEAD以後、formal execution前に変更されたのは`STAGE_2_AUTHORIZATION.json`と`STAGE_2_TRIGGER.json`の2 pathのみ。

## Stage 2 one-shot formal execution

```text
stage = BRSGT-S2-FORMAL-2026-09-27-v1
workflow run = 36314208922 / attempt 1 / success
job = 108605721107
execution HEAD = 692d2d718ab55348e7fb4f8190476524b0a5bc95
binding = PASS
stage disposition = STAGE2-FORMAL-COMPLETE
artifact ID = 10929684128
artifact name = brsgt-stage2-formal-36314208922-1
artifact ZIP SHA-256 = bbbe1e2206c9f439168829581d1bce1ef03dddaec1fe0914b8888a63767bcb1b
fresh scientific seed reads = 1024 / 1024
first / last = 40823001 / 40824024
no-rescue boundary crossed = true
production / independent exact agreement = true
G4-10 depth-11 access = 0
public AI changed = false
```

## Stage 2 formal result

frozen freshness firewallはfresh access前に完成し、その後1024 fresh source trajectoriesを固定順でreadした。

```text
UPSTREAM-REACHABLE-RAW-ROOT = 1011
UPSTREAM-TRAJECTORY = 6
UPSTREAM-OPENING-PREFIX = 7
total rejected = 1024
accepted source trajectories = 0
measured event units = 0
unique geometry roots measured = 0
```

このため4 event families × 6 metricsの24 formal slotsすべてがestimability gateを満たさなかった。

```text
INCREASE-CONFIRMED = 0
DECREASE-CONFIRMED = 0
NOT-CONFIRMED = 0
NON-ESTIMABLE = 24
TECHNICAL-INVALID = 0
```

**正式結論は24 / 24 `NON-ESTIMABLE`。**

これは「effectなし」を意味しない。freshness gate後にformal event unitsが残らなかったため、capture、nyumba、reserve decrement、Namua→Mtajiのgeometry directionについて科学的結論を形成できなかった。

Canonical record: `results/stage-2/STAGE_2_CANONICAL_RECORD.json`  
Checkpoint: `checkpoints/2026-09-27-stage-2-formal-complete.md`

## Freshness exhaustion diagnostic

結果を変更しないpost-execution identity diagnosticで、全1024 Stage 2 trajectoriesのply 0 RAW rootが同一であることを確認した。

```text
initial RAW root = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
Stage 2 rows with this ply-0 root = 1024 / 1024
Stage 1 v3 rows with this ply-0 root = 512 / 512
initial root already in frozen firewall = true
```

collision判定はtrajectory → opening prefix → reachable RAW rootの順であり、先にtrajectory 6件、prefix 7件が除外された後、残る1011件は全て共通initial rootでRAW-root collisionとなった。

この診断を使って同Stage/versionを修正再実行しない。ply 0除外、freshness grammar変更、seed extension、replacement populationはno-rescue契約により禁止される。

## Scientific interpretation

G4-08から許される結論は次に限定する。

- Stage 1では24/24 slotsにformal holdoutを実行できるsupportが存在した。
- Stage 2のfrozen identity firewallではfresh population 1024/1024が除外された。
- そのためStage 2 formal family 24/24はNON-ESTIMABLEとなった。
- rule-semantic eventによるgeometryの増減方向についてformal confirmationは得られていない。
- `NON-ESTIMABLE`をnegative result、no-effect、counterexampleとして扱わない。
- causal effect、whole-Bao law、game-theoretic consequence、AI strength、人間のdifficultyへ拡張しない。

## Main統合前最終監査

G4-08 closure後のcanonical record、closure record、current-facing文書、prospective Program Plan、branch scope、protected boundaryを再監査し、`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`と判定した。

```text
reviewed main HEAD = 2023860419d13b6f294b0600943de8fb4e50b1bb
audited research HEAD = 62b8961a416fa8140de2163d682a92b1fafea848
behind main = 0
merge base = reviewed main HEAD
public/ changed files = 0
public AI production changes = 0
G4-10 depth-11 access = 0
```

監査記録: `../research-generation-4/checkpoints/2026-09-27-g4-08-pre-main-audit.md`

## Main統合

2026-09-27、remote `main`が監査baseline `2023860419d13b6f294b0600943de8fb4e50b1bb`から動いていないことを再確認し、research branchが`ahead 129 / behind 0`、merge baseが同じcurrent `main` HEADであることを確認した。

その後、research HEAD `0956b5b17085714c1fb9df8ef82f29f6b6ff0f53` へnon-force fast-forwardした。

```text
pre-integration main HEAD = 2023860419d13b6f294b0600943de8fb4e50b1bb
integrated research HEAD = 0956b5b17085714c1fb9df8ef82f29f6b6ff0f53
integration method = non-force fast-forward
force = false
scientific rerun during integration = false
public/ changed files = 0
public AI production changes = 0
G4-10 depth-11 access = 0
```

統合記録: `../research-generation-4/checkpoints/2026-09-27-g4-08-main-integration.md`

## Protected boundaries / closure

- Stage 0 v1 rerun禁止。
- Stage 1 v1/v2/v3 rerun禁止、各namespace再利用禁止。
- Stage 2 v1 rerun禁止、`40823001..40824024`再利用禁止。
- Stage 2のpost-hoc firewall修正によるrescue禁止。
- G4-10 depth-11 access禁止、実アクセス0。
- public AI変更なし。
- main integration完了。統合によって科学結果・no-rescue境界・G4-10保護境界は変更しない。

**BRSGT-STUDY1は、Stage 2 formal holdoutの完了と24/24 NON-ESTIMABLEをもって研究実行を閉じ、main統合まで完了した。** G4-09 / G4-10は自動認可されず、次のscientific agendaには独立authorization reviewが必要である。