# G4-08 / BRSGT-STUDY1 — 現在の状態

更新日: 2026-09-27  
状態: **STAGE 0 v2 PASS / STAGE 1 v3 DEVELOPMENT-COMPLETE / 24-OF-24 SUPPORTED-FOR-FORMAL-HOLDOUT / STAGE 2 NOT AUTHORIZED**

## Formal identity

```text
Agenda = Research Generation 4 / G4-08
Study ID = BRSGT-STUDY1
Branch = research/g4-08-rule-semantic-geometry-transition
Reviewed main = 2023860419d13b6f294b0600943de8fb4e50b1bb
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
Stage 2 = NOT AUTHORIZED / NOT ACCESSED
G4-10 depth-11 = NOT AUTHORIZED / NOT ACCESSED
public AI change = NONE / NOT AUTHORIZED
main integration = NOT AUTHORIZED
```

## Stage 0 v2

`BRSGT-S0-TECHNICAL-2026-09-27-v2` is `STAGE0-PASS`.

```text
workflow run = 36295553800
fixture count = 4
all represented seed totals = 64
E1-E4 = covered
production / independent exact agreement = true
fresh scientific seed reads = 0
Stage 2 reads = 0
G4-10 depth-11 access = 0
```

Canonical record: `results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json`

## Stage 1 v1 / v2 technical closure

### v1

```text
stage = BRSGT-S1-DEVELOPMENT-2026-09-27-v1
run = 36298620437
binding = PASS
stage disposition = STAGE1-TECHNICAL-INVALID
terminal error = ReferenceError: freshScientificSeedReads is not defined
exact fresh read count = unknown
seed block = 40813001..40813512 / conservatively consumed
scientific outcome = NONE
```

v1は未定義shorthandが正常系とcatch系の双方に存在したため、同version rerunを禁止し、block全体を隔離した。

Canonical record: `results/stage-1-v1/STAGE_1_V1_CANONICAL_FAILURE_RECORD.json`  
Checkpoint: `checkpoints/2026-09-27-stage-1-v1-technical-invalid.md`

### v2

```text
pre-fresh audit run = 36299573408 / PASS
execution run = 36299638508 / attempt 1
binding = STAGE1-V2-BINDING-PASS
stage disposition = STAGE1-TECHNICAL-INVALID
technical error = missing limit distinctRawStates
fresh scientific seed reads = 512
seed block = 40814001..40814512 / consumed
formal inference = false
effect values/signs retained = false
Stage 2 reads = 0
G4-10 depth-11 access = 0
```

原因は`CRCLGR boundedPreflight()`へ渡す3つのlimit-key名のinterface mismatchで、科学的negative resultではない。v2は同version rerun禁止。

Canonical record: `results/stage-1-v2/STAGE_1_V2_CANONICAL_FAILURE_RECORD.json`  
Checkpoint: `checkpoints/2026-09-27-stage-1-v2-technical-invalid.md`

## Stage 1 v3 pre-fresh verification

v3は科学設計を変更せず、v1のfresh-read shorthand修正とv2で判明した3つのpreflight limit-key修正のみをversion-isolatedに適用した。

最初のstatic-audit attempt `36303146973` は、生成runner内の正常なself-test mappingを含めた件数をauditが誤って4件と期待したため、**fresh access前にtechnical audit assertion failure**で停止した。科学seed accessは0。

監査条件だけを修正したattempt 2:

```text
static audit run = 36303292448
job = 108574922365
audit HEAD = 27f2129d7ed434377c363b1f89534c7cd5cad7fb
disposition = STAGE1-V3-PRE-FRESH-STATIC-AUDIT-PASS
catch self-test = PASS
preflight-contract self-test = PASS / ELIGIBLE
fresh reads at audit = 0
Stage 2 reads at audit = 0
G4-10 access at audit = 0
generated runner SHA-256 = 180b02e89b60b3a83fa201a9f67a9d3ace08f5e96a57c47db93ec0a88bd48e65
```

監査HEAD以後、execution前に変更されたのはv3 authorizationとv3 triggerの2ファイルだけで、binding verifierがこれを確認した。

## Stage 1 v3 one-shot execution

```text
stage = BRSGT-S1-DEVELOPMENT-2026-09-27-v3
workflow run = 36303568642 / attempt 1
job = 108575705651
execution HEAD = b59918149fdceac5f619328aa82771abdbfa5994
binding = STAGE1-V3-BINDING-PASS
stage disposition = STAGE1-DEVELOPMENT-COMPLETE
artifact ID = 10926322837
artifact ZIP SHA-256 = c93ae26b019edde841e58a4f452aa8bacd45c0954937294ca2c12c786d916140
fresh scientific seed reads = 512
identity rows = 512
measured event units = 64
unique geometry roots = 97
production / independent exact agreement = true
formal inference = false
effect values retained = false
effect signs retained = false
Stage 2 reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Artifact SHA manifestはdownload後にも再検証し、execution context / result / Stage 2 identity exclusion / firewall summaryの全ファイルが一致した。

Canonical record: `results/stage-1-v3/STAGE_1_V3_CANONICAL_RECORD.json`  
Checkpoint: `checkpoints/2026-09-27-stage-1-v3-development-complete.md`

## Stage 1 v3 support-only result

Stage 1 support familyは4 event families × 6 metrics = 24 slots。

全8 event-family × policy cellで8 event unitsずつ計測し、合計64 event unitsを得た。選択されたmeasurement sequenceではpreflight rejectionは0。

```text
E1 capture: P1 8 / P2 8
E2 nyumba use-vs-stop: P1 8 / P2 8
E3 reserve decrement nontransition: P1 8 / P2 8
E4 Namua→Mtaji: P1 8 / P2 8
```

全24 slotsについて:

```text
exact-defined P1 = 8
exact-defined P2 = 8
combined = 16
frozen minimum per policy = 6
frozen minimum combined = 12
classification = SUPPORTED-FOR-FORMAL-HOLDOUT
effect direction used = false
```

したがって **24 / 24 slotsがformal holdout候補にsupportされる**。

これはdirectional resultではない。Stage 1はcontrast value/signを保持せず、増加・減少・因果効果・formal confirmationを判定していない。

## Firewall / identity exclusion

```text
firewall digest = 6dd29d162df43fc4e36bcb9323aecf30d98cda18e8aeeffa1424c865cd658f7a
seed identities = 9472
trajectory identities = 1041
prefix identities = 657
root identities = 9355
fresh reads before firewall complete = 0
Stage 1 v3 identity exclusion rows = 512
scientific outcome fields retained in identity exclusion = false
```

v1/v2/v3 Stage 1 namespacesはすべて再利用禁止。

## Scientific interpretation to date

```text
Stage 1 v1 scientific outcome = NONE / TECHNICAL-INVALID
Stage 1 v2 scientific outcome = NONE / TECHNICAL-INVALID
Stage 1 v3 scientific outcome class = DEVELOPMENT-SUPPORT-ONLY
formal inference performed = false
effect values/signs retained as evidence = false
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Stage 1 v3が示したのは、固定fresh-development populationとRAW depth-5測定契約の下で、24 event-family × metric slotsすべてがformal heldout検証に十分なexact-defined supportを持ったことだけである。

## Protected boundaries

- Stage 0 v1 rerun禁止
- Stage 1 v1/v2/v3 rerun禁止
- Stage 1 v1 block `40813001..40813512` reuse禁止
- Stage 1 v2 block `40814001..40814512` reuse禁止
- Stage 1 v3 block `40815001..40815512` reuse禁止
- Stage 2 seed accessは別authorization前禁止
- Stage 1 effect方向をStage 2 family選定へ使用禁止
- G4-10 depth-11 access禁止
- public AI変更禁止
- main integration禁止

## Next gate — Stage 2 formal preregistration / authorization review

24 / 24 slotsがsupport gateを通過したため、Stage 2 formal holdoutを設計する資格は得た。ただしStage 2はまだ未認可。

次は、Stage 1のsupport classificationとidentity exclusionだけを使用し、effect方向を参照せずにStage 2 formal family、fresh seed block、identity firewall、event別inference、multiplicity、formal labels、resource/no-rescue境界を別途freezeする。

Stage 2 fresh seed accessは、そのpreregistration・static verification・source-bound one-shot authorizationが完了するまで行わない。
