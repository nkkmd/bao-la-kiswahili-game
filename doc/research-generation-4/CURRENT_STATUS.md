# Research Generation 4 — 現在の状態

更新日: 2026-09-25  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION / G4-03 COMPLETE / G4-04 COMPLETE`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = NEXT CORE CANDIDATE / NOT-AUTHORIZED
G4-06..G4-09 = DEPENDENCY-GATED / NOT-AUTHORIZED
G4-10 depth 11 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
G4-P01 = INDEPENDENT / NOT-AUTHORIZED
G4-H01 = DEFERRED
Public AI change authorized by RG4 = false
```

## G4-01 — compatibility instrument

G4-01 `LGTTCI-STUDY1` はSFCDF・SILGM・GCLDの3 familyについてfresh-domain researchを行うためのcompatibility/readiness instrumentを検証し、`COMPATIBILITY-ELIGIBLE-ALL`で完了した。

これはgeneralizationやeffect directionを確認した結果ではない。G4-01は`main`統合済み。

## G4-02 — corridor / tree-graph transfer

G4-02はG3-04由来C1/C6のfresh-domain transferをformalに検証するためStudy 1〜4をprospectiveに実施したが、各Studyをno-rescue ruleに従って扱い、最終的に有効なformal Stage 2 measurementへ到達しなかった。

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
scientific transfer decision = NONE
final formal Stage 2 status = TECHNICAL-INVALID
main integration = COMPLETE / PR #154
```

これはC1/C6の一般化失敗やcounterexampleのnegative scientific evidenceではない。

## G4-03 — width / search-ranking transfer

G4-03 `LWSRT-STUDY1` は、G3-07でformal confirmationされたroot legal width HIGH stratumとranking-preorder changeのassociationを、G4-01でcompatibility確認済みのfresh source-policy × root-family domainsへ移送検証した。

```text
canonical Stage 2 run = 35993172710 / attempt 1 / success
stage disposition = STAGE2-COMPLETE-WITH-NON-ESTIMABLE
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
main integration = COMPLETE / PR #164
```

対象associationはfresh domainsへ広く移送されたが、無条件のuniversal lawではない。public AI変更は認可しない。

## G4-04 — geometry trajectory dynamics transfer

G4-04 `GTTD-STUDY1` は、G3-10でformal confirmationされたC1・C2・C3・C5のtrajectory-level directionを、fresh P1/P2 source-policy domainsへprospectiveに移送検証した。

### Stage 1

```text
run = 36089520136 / attempt 1 / success
stage disposition = STAGE1-PASS
fresh seed reads = 134
P1 fully eligible = 15 / measured = 8
P2 fully eligible = 16 / measured = 8
C1/C2/C3/C5 defined = 8/8 for both policies
production / independent exact = true
formal inference = false
```

Stage 1 endpoint値、contrast符号、effect direction、p値は保存していない。

### Stage 2

fresh access前に`GTTD-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`、24-file preexecution binding、identity firewall、seed-free preflight、durable repository leaseを固定し、一回だけformal executionを行った。

```text
canonical run = 36095831961 / attempt 1 / success
trigger commit = 97d8b374d6bfe1b573b915cd52974db6f6115423
durable lease commit = fcd1f68f8c65b2f6c3359bd8b37e1c1b12261161
seed block = 40423001..40424024 / 1024
seed reads = 369
last seed read = 40423593
P1 candidates = 48 / fully eligible = 47 / measured = 32
P2 candidates = 48 / fully eligible = 46 / measured = 32
formal measured trajectories = 64
production / independent exact = true
stage disposition = FORMAL-COMPLETE
artifact ID = 10849029913
artifact SHA-256 = fe165e6c1735cb07e71ed49e2a1c4d3f7446e796ab63936d90c7e982edfc4bd7
STAGE_2_RESULT.json SHA-256 = 85b5cf71c63dc9baeaf78a2dab4e61f03826b6f593552d916c5f48dcacd31d76
```

### Formal result

fixed 8-test Holm familyの最終内訳:

```text
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

Claim別:

- `C1 directionality / path efficiency`: P1 / P2とも`GENERALIZATION-CONFIRMED`
- `C2 persistence / lag-distance gradient`: P1 / P2とも`GENERALIZATION-CONFIRMED`
- `C3 return fraction`: P1 / P2とも`GENERALIZATION-CONFIRMED`、median directionはNEGATIVE
- `C5 first-order directional path dependence`: P1 / P2とも`GENERALIZATION-CONFIRMED`

G3-10でconfirmedだった4 directionは、本Studyでprospectiveに固定したfresh P1/P2 domainsへ8/8で同方向に移送された。

ただしformal domainはP1/P2 full trajectoriesである。RF1/RF2はsupport descriptorのみで、root-family別formal subgroup inferenceは行っていない。whole-Bao universal law、game-theoretic value、best move correctness、AI strength、人間のdifficultyは主張しない。

G4-04は`COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED`として閉じた。同一Studyのrerun / repair / seed extensionは行わない。`main`統合はPR #165で完了した。

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| `G4-03` | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| `G4-04` | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| `G4-05` | `NEXT CORE CANDIDATE / NOT-AUTHORIZED` |
| `G4-06`〜`G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次に許可される作業

G4-04のscientific executionは完了しているため追加runは行わない。

Research Generation 4を継続する場合、次のcore candidateは`G4-05` exact microdomain oracle foundationである。ただし候補であることはauthorizationではない。**G4-05専用のauthorization reviewから開始する。**

G4-04はPR #165で`main`統合済み。以後、G4-04をrepair/reopenせず、RG4を継続する場合はG4-05の個別authorization reviewから開始する。

## 保護境界

- G4-02 closed Studiesをrepair/reopen/rerunしない。
- G4-03 Stage 1 / Stage 2をrerunしない。
- G4-04 Stage 1 / Stage 2をrerunしない。
- G4-04 fixed seedを救済目的で再読しない。
- G4-04 resultをRF1/RF2 subgroupまたはwhole-Bao universal lawへ拡張しない。
- G3-12をrepair/replayしない。
- G3-11 depth-10をrerunしない。
- G4-10 depth11へアクセスしない。
- RG4 resultをpublic AIへ自動反映しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`checkpoints/2026-09-25-g4-04-complete.md`](checkpoints/2026-09-25-g4-04-complete.md)
- [`checkpoints/2026-09-25-g4-04-main-integration.md`](checkpoints/2026-09-25-g4-04-main-integration.md)
- [`../geometry-trajectory-dynamics-transfer/CURRENT_STATUS.md`](../geometry-trajectory-dynamics-transfer/CURRENT_STATUS.md)
- [`../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../research-program-decisions/2026-09-25-g4-04-geometry-trajectory-dynamics-transfer-study1-closure.md`](../research-program-decisions/2026-09-25-g4-04-geometry-trajectory-dynamics-transfer-study1-closure.md)