# LGTGGC-STUDY1 — 現在の状態

更新日: 2026-09-04

```text
Program position = Research Generation 3 / G3-12
Program authorization = G3-12-AUTHORIZED
Study = LGTGGC-STUDY1
Lifecycle = CLOSED / TECHNICAL-INVALID
Source main HEAD = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
Research branch = research/g3-12-local-game-tree-geometry-generalization-counterexample
Stage 0 active = LGTGGC-S0-TECHNICAL-2026-09-04-v3 / STAGE0-PASS
Stage 1 = LGTGGC-S1-DEVELOPMENT-2026-09-04-v1 / EXECUTED EXACTLY ONCE / TECHNICAL-INVALID
Stage 2 = LGTGGC-S2-FORMAL-2026-09-04-v1 / NOT AUTHORIZED / NOT EXECUTED
Stage 2 authorization review = LGTGGC-STAGE2-NOT-AUTHORIZED
Formal generalization decisions = NONE
Formal counterexample decisions = NONE
Protected G3-11 depth-10 rerun = false / NOT AUTHORIZED
Depth-11 access = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT AUTHORIZED / NOT USED
Main integration = COMPLETE / FAST-FORWARD / source tip 146a515671838606034efd9d4c3120e9b4c597f2 / previous main 5597ae696d9eb76d8395e114cdb4f83af1138a3d / force=false
```

## 現在有効なsource-policy contract

fresh evidenceへアクセスする前に行ったamendmentを、正式な実行contractとして維持している。

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-MAX-CAPTURE
```

当初の`P2-CAPTURE-FIRST`はhistorical preregistration provenanceとして残している。ただし、正式な合法手生成がすでにcapture priorityを強制するためP1と観測上区別できず、scientific access前に置き換えた。

## Stage 0の状態

```text
V1 = PRE-EXECUTION-TECHNICAL-INVALID / NOT EXECUTED / original P1-P2 non-identifiability
V2 = PRECOMPUTATION-TECHNICAL-INVALID / technical seed access 0 / NO RERUN
V3 = STAGE0-PASS
V3 Actions run = 33843233392
V3 artifact ID = 9925602227
V3 technical core SHA-256 = 79a34669df5e5d80c179dbb40e2a8e6b8b3e58e05747ef0c1b21d7e493e8a834
```

Stage 0のPASSが確立したのは技術的な実行準備だけである。その後、Stage 1を別のauthorization reviewで承認した。

## Stage 1のexactly-once実行

```text
Actions run = 33848876682
job = 100946889620
trigger commit = 013f3fd2f859ef1758674b6a53ac5a05cd14efc8
lease artifact = 9927555827
lease ZIP SHA-256 = 927759cb9f521a484479efec3a54df0db6f22f7262a936d2ee742d5a6a313231
result artifact = 9927866205
result ZIP SHA-256 = b93e5401c3191979b35252eaa2003df0e8511db2bbfc1325396d298557b75cdb
maximum scientific executions = 1
execution consumed = 1
same-evidence rerun = NOT AUTHORIZED
```

### SFCDF-TRANSFERの状態

```text
seed range = 32311001..32311384 / CONSUMED
stage disposition = STAGE1-PASS
selected pairs = 40
selected roots = 80
defined roots = 80
production/independent exact = true
selection core SHA-256 = a49491bd973ba2ef8807b09e88b17ba929cd97869add1c8f49dc1521d017eff5
measurement core SHA-256 = 59667e24c250e74dc94746311ba23a448b0947fc40b3fe53e424cdf0054f3f3f
formal inference = false
p-values = false
effect-direction summary = false
```

これはdevelopment readinessだけを示し、G3-04のgeneralization resultではない。

### SILGM-TRANSFERの状態

```text
seed range = 32312001..32312768 / CONSUMED
stage disposition = STAGE1-TECHNICAL-INVALID
fatal error = complete root ranking required
formal inference = false
p-values = false
```

static independent auditにより、legal width 1を除外していない固定済みLOW root populationと、estimableなsearch resultの後に2件以上のroot candidateを必須とする既存のproduction / independent SILGM search helperとの間にcompatibility gapがあることを確認した。

fresh access後には、failureを起こした具体的なscientific rootを再実行または特定していない。

### GCLD-TRANSFERの状態

```text
seed range = 32313001..32313384
execution = NOT EXECUTED / WORKFLOW SKIPPED
seed access = 0 / UNREAD
```

## Stage 2の境界

Stage 1後のreview decisionは次のとおりである。

**`LGTGGC-STAGE2-NOT-AUTHORIZED`**

直接の理由は次のとおりである。

- Stage 1 SILGMが`TECHNICAL-INVALID`だった。
- Stage 1 GCLDのreadinessを確立できなかった。
- SILGMのfresh replayなしには、完全なStage 1 identity-only exclusion firewallをmaterializeできない。
- same-evidence rerun / repairは禁止されている。
- fresh evidence確認後のmodule droppingはpost-hoc rescueになる。

固定済みのStage 2 seedは、次のとおり未読のままである。

```text
SFCDF = 32321001..32321768 / UNREAD
SILGM = 32322001..32323536 / UNREAD
GCLD  = 32324001..32324768 / UNREAD
```

## 科学的結論の境界

`LGTGGC-STUDY1`は、`GENERALIZATION-CONFIRMED`、`COUNTEREXAMPLE-CONFIRMED`、`NOT-GENERALIZED`、`NON-ESTIMABLE`のいずれについても、formalなendpoint-domain decisionを確立していない。

Study-levelで正しく述べられる結論は、次の一点だけである。

**結果を見る前に固定したG3-12 capstone executionは、Stage 1が技術的にfail closedしたため、formal Stage 2へ到達しなかった。**

上流のG3-04 / G3-07 / G3-10のformal resultは変更されない。G3-10 C4は`NOT-CONFIRMED`のままであり、G3-11の主張範囲は一度だけ実行した固定depth-10 domainに限られる。

## canonical closure記録

- `STUDY_1_FINAL_REPORT.md`
- `STAGE_1_FAILURE_INDEPENDENT_AUDIT.md`
- `REPRODUCIBILITY_INDEX.md`
- `results/stage-1/STAGE_1_EXECUTION_RECORD.json`
- `../research-program-decisions/2026-09-04-post-g3-12-stage1-stage2-authorization-review.md`

## `main`への統合

`main`への統合は **COMPLETE / FAST-FORWARD / source tip 146a515671838606034efd9d4c3120e9b4c597f2 / previous main 5597ae696d9eb76d8395e114cdb4f83af1138a3d / force=false** で完了している。research branchはprovenanceのため保持している。
