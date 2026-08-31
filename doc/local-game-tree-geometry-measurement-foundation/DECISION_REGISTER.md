# G3-01 / LGTGMF-STUDY1 — Decision Register

更新日: 2026-08-31

## DR-001 — Study identity freeze

```text
Program = G3-01
Study ID = LGTGMF-STUDY1
Formal title = Local Game-Tree Geometry Measurement Foundation Study 1
Stage 0 original = LGTGMF-S0-TECHNICAL-2026-08-31-v1
Stage 0 corrective = LGTGMF-S0-TECHNICAL-2026-08-31-v2
Stage 1 = LGTGMF-S1-DEVELOPMENT-2026-08-31-v1
Stage 2 = LGTGMF-S2-FORMAL-2026-08-31-v1
```

Disposition: **FROZEN BEFORE SCIENTIFIC OUTCOME**.

## DR-002 — RAW identity

Authoritative identityは`pits,reserve,houseOwned,player,phase,winner,pending`。`turn` / `reason`は除外する。validated transform setは`[]`であり、symmetry / canonicalization / player swap / reflectionによるstate reductionは禁止する。

Disposition: **FROZEN**.

## DR-003 — Candidate measurement family

```text
F1-TREE-OCCURRENCE
F2-RAW-GRAPH
F3-TRANSPOSITION-RECONVERGENCE
F4-TREE-GRAPH-RELATION
F5-REPLY-GEOMETRY
```

Stage 1 outcome後のfamily追加は禁止する。

Disposition: **FROZEN**.

## DR-004 — Fresh population

Stage 1はseed `31010001..31010096`、Namua 6 / Mtaji 6 roots。Stage 2はseed `31020001..31020096`、Namua 8 / Mtaji 8 roots。Stage 2はRAW root / full trajectory / first-16 exact move opening prefixでStage 1をfirewallする。

Disposition: **STAGE 1 CONSUMED / STAGE 2 UNCONSUMED**.

## DR-005 — Horizon / resource

local target depthはStage 1 / 2とも5。resource ceilingは`STUDY_1_PROTOCOL.md`と各Stage JSON specを正本とする。resource / admin stopはscientific negative resultへ変換しない。

Disposition: **FROZEN**.

## DR-006 — protected depth-10

G3-11用standard initial RAW root complete depth-10 exact layerはsealedする。G3-01ではcomplete layerのenumeration、scientific count / geometry outcome生成・readを禁止する。G2-12 estimatorはtruth/inputにしない。

Disposition: **SEALED / NOT GENERATED / NOT READ**.

## DR-007 — Stage 0 authorization boundary

Stage 0はtechnical-only。scientific seed消費なし。Stage 0 PASS前のStage 1実行はauthorizeしない。

Disposition: **SATISFIED BY STAGE 0 v2**.

## DR-008 — Formal decision taxonomy

```text
VALIDATED-ELIGIBLE
PARTIALLY-ELIGIBLE
INCONCLUSIVE
NON-ESTIMABLE
TECHNICAL-INVALID
NOT-AUTHORIZED-NOT-EXECUTED
```

`PARTIALLY-ELIGIBLE`は全formal rootsのglobal gate PASS後に、prospectively partition済みmetric familyの一部だけがexact verification PASSした場合に限る。root subgroupによるpartial successは認めない。

Disposition: **FROZEN**.

## DR-009 — Technical refreeze rule

fresh development / formal evidence生成・read前のtechnical defectに限り、旧versionをtechnical-invalidとして永久保存し、scientific contractを変更しない新technical versionを別IDでfreezeできる。scientific seed消費後のsame-evidence rerunは不可。

Disposition: **FROZEN / INVOKED ONCE FOR STAGE 0 v2 / NOT AVAILABLE AFTER STAGE 1 CONSUMPTION**.

## DR-010 — Main integration

本branchの`main`統合はuserの明示的指示まで行わない。

Disposition: **NOT AUTHORIZED**.

## DR-011 — Stage 0 v1 disposition

Workflow run `33358158087`はexecution check、historical depth-2 reference、traversal-order invariance、production / independent agreementをpassした。しかしStudy-level cross-contract auditで凍結済み`rootBranchPairOverlap`と`narrowPathRun`がformal measurement coreにmaterializeされていないことを検出した。

```text
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
Stage 1 authorization from v1 = false
Scientific contract changed = false
Scientific seed consumption = NONE
```

Disposition: **IMMUTABLE TECHNICAL-INVALID**.

## DR-012 — Stage 0 v2 corrective disposition

Corrective workflow run `33360528096`、head `3704cdf551c9ceb5b4d1740d299c054cff81fc5c`はsuccess。production / independent measurement core SHA256は`6c3c4a2aef893c09804988ef0d61a64424d415ee6bd63ebedd59e4ae91fee555`でexact一致した。

Required corrective gates:

```text
rootBranchPairOverlapAgreement = true
narrowPathRunAgreement = true
traversalOrderInvariance = true
historicalDepth2ReferenceAgreement = true
productionIndependentAgreement = true
independentImportsProductionV2 = false
protectedStandardRootDepth10Generated = false
protectedStandardRootDepth10Read = false
```

Disposition: **STAGE0-TECHNICAL-PASS / STAGE 1 PREREQUISITE SATISFIED**.

## DR-013 — Stage 1 fresh development disposition

Workflow run `33370605540`は凍結済みseed `31010001..31010096`を消費し、Namua 6 / Mtaji 6の全12 selected rootsをproduction / independent双方でdepth 5までcomplete reconstructionした。

root selection、root-level measurement core、F1〜F5 family digestはすべてexact一致し、全rootは凍結resource ceiling内だった。

しかしcanonical stage manifestの`stageCoreSha256`は一致しなかった。

```text
production = d9e06d4cd4830bb7aba9292351a7e1260decf98de9442cb27dfc88f44bbb3f50
independent = 3829928f93cba835f5120e6aa9bf903ac6a5570e91e547d76a2da90cfbb3a123
```

原因はimplementationがstage-level hash inputへelapsed time、RSS等のnon-deterministic resource observationsを含めたことにある。これはroot geometry primitiveの不一致ではないが、事前に固定したdeterministic stage manifest contractを満たさない。

Disposition: **STAGE1-TECHNICAL-INVALID**.

## DR-014 — No-rescue and Stage 2 authorization

Stage 1 fresh evidenceはすでに生成・readされseed blockもconsume済みである。したがって、manifest hash implementationを修正して同一Stage 1 evidenceをrerunし、family promotionをやり直すことは認めない。

```text
eligibleFamiliesForStage2 = []
Stage 2 authorization = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed consumption = NONE
```

Disposition: **FAIL-CLOSED / NO SAME-EVIDENCE REPAIR**.

## DR-015 — Study-level formal decision

G3-01は、formal held-out Stage 2へ進むためのvalid Stage 1 instrument qualificationを得られなかった。Stage 1のroot-level / family-level exact agreementはdevelopment上のfeasibility evidenceとして保存するが、formal eligibilityとは扱わない。

```text
LGTGMF-STUDY1 = TECHNICAL-INVALID
formal eligible measurement families = []
```

Disposition: **CLOSED / TECHNICAL-INVALID**.

## DR-016 — Research Generation 3 dependency

G3-02〜G3-08は原則としてG3-01でformal eligibilityを得たfamilyだけを使用するprogram contractである。本Studyのeligible family setは空なので、同instrumentのまま後続Studyを自動開始しない。

次の研究行為には、G3-01を再判定しない新規prospective prerequisite Study、またはResearch Generation 3 program-level dependency decisionが必要である。

Disposition: **DOWNSTREAM AUTO-START BLOCKED / DEPENDENCY REASSESSMENT REQUIRED**.
