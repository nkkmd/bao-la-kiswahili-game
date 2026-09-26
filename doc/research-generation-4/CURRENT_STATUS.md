# Research Generation 4 — 現在の状態

更新日: 2026-09-26  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION / G4-03 COMPLETE / G4-04 COMPLETE / G4-05 COMPLETE / G4-06 COMPLETE / MAIN INTEGRATED`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED
G4-07 = NEXT AUTHORIZATION-REVIEW CANDIDATE / NOT-AUTHORIZED
G4-08..G4-09 = DEPENDENCY-GATED / NOT-AUTHORIZED
G4-10 depth 11 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
G4-P01 = INDEPENDENT / NOT-AUTHORIZED
G4-H01 = DEFERRED
Public AI change authorized by RG4 = false
```

## G4-01 — compatibility instrument

G4-01 `LGTTCI-STUDY1` はSFCDF・SILGM・GCLDの3 familyについてfresh-domain researchを行うためのcompatibility/readiness instrumentを検証し、`COMPATIBILITY-ELIGIBLE-ALL`で完了した。これはgeneralizationやeffect directionを確認した結果ではない。`main`統合済み。

## G4-02 — corridor / tree-graph transfer

G4-02はG3-04由来C1/C6のfresh-domain transferをStudy 1〜4としてprospectiveに実施したが、no-rescue ruleに従い、最終的に有効なformal Stage 2 measurementへ到達しなかった。

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
scientific transfer decision = NONE
final formal Stage 2 status = TECHNICAL-INVALID
main integration = COMPLETE / PR #154
```

これはC1/C6の一般化失敗やcounterexampleのnegative scientific evidenceではない。

## G4-03 — width / search-ranking transfer

G4-03 `LWSRT-STUDY1` はG3-07由来associationをfresh source-policy × root-family domainsへ移送検証した。

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

G4-04 `GTTD-STUDY1` はG3-10でformal confirmationされたC1・C2・C3・C5のtrajectory-level directionをfresh P1/P2 source-policy domainsへ移送検証した。

```text
Stage 1 run = 36089520136 / attempt 1 / success
Stage 1 disposition = STAGE1-PASS
Stage 2 canonical run = 36095831961 / attempt 1 / success
Stage 2 disposition = FORMAL-COMPLETE
formal measured trajectories = 64
production / independent exact = true
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
main integration = COMPLETE / PR #165
```

G3-10でconfirmedだった4 directionは、本Studyで固定したfresh P1/P2 domainsへ8/8で同方向に移送された。ただしformal domainはP1/P2 full trajectoriesであり、RF1/RF2 subgroup、whole-Bao universal law、game-theoretic value、best move correctness、AI strength、人間のdifficultyは主張しない。

## G4-05 — reachable late-game exact microdomain oracle foundation

G4-05 `RLEMOF-STUDY1` は、outcome-blind / resource-feasibility-onlyに選択したfresh reachable late-game rootsについてcomplete legal-transition closureを構築し、production / independent solverがexact valueとsolution structureを一致して再構築できるかを検証した。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-ACCEPTED / selected tier T3
Stage 2 canonical run = 36120286922 / attempt 1 / success
execution SHA = 72e45631112359346a83f9399be32ee3e6420ccb
artifact ID = 10858056244
formal complete domains = 8
production / independent agreement = true
formal decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
main integration = COMPLETE / PR #166
```

candidate 1と4は`STATE-LIMIT`でcomplete closureにならず、そのままfail-closedした。cap増加、root replacement、seed extension、same-evidence rerunは行っていない。8 domainのrecurrent countは0だったが、`RECURRENT`を公式ルール上の`DRAW`へ読み替えていない。

## G4-06 — local geometry / exact-consequence bridge

G4-06 `LGTGECB-STUDY1` は、G4-05の固定8 complete microdomainをimmutable upstream populationとして受け取り、relative depth 5のRAW local geometryとexact value・DTF・value-preserving move countをprospectiveに接続した。

### Stage 0

```text
canonical run = 36211754989 / attempt 1 / success
stage decision = STAGE0-TECHNICAL-PASS
mandatory gates = 12 / 12 PASS
production / independent agreement = true
G4-05 formal-domain scientific bridge reads = 0
```

### Stage 1 formal

```text
canonical run = 36214800357 / attempt 1 / success
execution SHA = 90283d1680cef8feda02e11b072e98b145d5d786
artifact ID = 10897225431
artifact SHA-256 = 1a087b4bccfb0c941e9895d2bf35cce41fcbee5f0194de1c43f2293ea593c688
formal domains = 8 / 8
relations emitted = 12 / 12
all production / independent agreement = true
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
G4-05 candidate rescan = 0
G4-10 depth-11 access = 0
```

固定8 rootではTree/RAW inflationが全root `1`、transposition occupancyが全root `0`で、これらはgeometry variation不足によりexact consequenceとの関係が`NON-ESTIMABLE`となった。Corridorとreply widthにはvariationがあり、exact valueとの関係はmixedだった。

事前登録したfinite ordering ruleでは、`DTF × reply width`と`value-preserving move count × corridor`が`MONOTONE-DECREASING-ORDER-CONSISTENT`となった。ただしこれはN=8の限定late-game exact microdomain内の結果であり、whole-Bao一般則、因果関係、探索難易度、AI strength、公開AI feature採用へ一般化しない。

### main統合前監査

```text
pre-main audit = PASS
readiness = READY-FOR-MAIN-INTEGRATION-REVIEW
public/ changes = 0
public AI production changes = 0
G4-10 depth-11 access = 0
```

G4-06正本、中央研究文書、branch scope、protected boundaryを横断監査し、main統合を阻害する不整合は確認されなかった。

### main統合

```text
integration method = FAST-FORWARD
main baseline before integration = 6a005d9f84d222126dc41abfe17ad5baa4c96629
integrated research HEAD = 889b3d16f09517e5b8aa6621cfd347d4b8902891
main integration = COMPLETE
public AI change = false
```

統合直前は`ahead 43 / behind 0`で、merge baseはmain baselineと一致していた。統合によってformal result、解釈境界、no-rescue rule、G4-10保護境界は変更していない。統合記録は[`checkpoints/2026-09-26-g4-06-main-integration.md`](checkpoints/2026-09-26-g4-06-main-integration.md)に固定した。

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| `G4-03` | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| `G4-04` | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| `G4-05` | `COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED` |
| `G4-06` | `COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED` |
| `G4-07` | `NEXT AUTHORIZATION-REVIEW CANDIDATE / NOT-AUTHORIZED` |
| `G4-08`〜`G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次に許可される作業

G4-06はscientific execution、closure、main統合まで完了した。同一formal Stageの追加run、metric変更、depth変更、domain除外、seed extension等は行わない。

次のcore candidateはG4-07 — 多時間尺度geometry memoryと回帰 — のauthorization reviewである。G4-07は現在`NOT-AUTHORIZED`であり、fresh evidenceへのアクセスやStudy executionは行わない。

G4-02は`CLOSED / NO SCIENTIFIC DECISION`であるため、G4-07 reviewではProgram Planのdependencyをpositive scientific evidenceへ機械的に読み替えず、利用可能な上流evidenceを改めて明示的に判定する。

## 保護境界

- G4-02 closed Studiesをrepair / reopen / rerunしない。
- G4-03 Stage 1 / Stage 2をrerunしない。
- G4-04 Stage 1 / Stage 2をrerunしない。
- G4-05 Stage 0 / Stage 1 / Stage 2をrerunしない。
- G4-05 candidate poolをrescanしない。
- G4-05 `STATE-LIMIT` candidateをresource増加で救済しない。
- G4-05 seed blockをextensionしない。
- G4-05 recurrent resultをDRAWへ読み替えない。
- G4-05 resultをwhole-Bao solutionへ拡張しない。
- G4-06 Stage 1をoutcome確認後にrerun / rescueしない。
- G4-06のN=8結果をwhole-Bao ruleへ一般化しない。
- G3-12をrepair / replayしない。
- G3-11 depth-10をrerunしない。
- G4-10 depth-11へアクセスしない。
- RG4 resultをpublic AIへ自動反映しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`../local-game-tree-geometry-exact-consequence-bridge/README.md`](../local-game-tree-geometry-exact-consequence-bridge/README.md)
- [`../local-game-tree-geometry-exact-consequence-bridge/FINAL_REPORT.md`](../local-game-tree-geometry-exact-consequence-bridge/FINAL_REPORT.md)
- [`../local-game-tree-geometry-exact-consequence-bridge/results/stage-1/STAGE_1_FORMAL_RECEIPT.json`](../local-game-tree-geometry-exact-consequence-bridge/results/stage-1/STAGE_1_FORMAL_RECEIPT.json)
- [`../local-game-tree-geometry-exact-consequence-bridge/checkpoints/2026-09-26-stage-1-formal-complete.md`](../local-game-tree-geometry-exact-consequence-bridge/checkpoints/2026-09-26-stage-1-formal-complete.md)
- [`checkpoints/2026-09-26-g4-06-pre-main-audit.md`](checkpoints/2026-09-26-g4-06-pre-main-audit.md)
- [`checkpoints/2026-09-26-g4-06-main-integration.md`](checkpoints/2026-09-26-g4-06-main-integration.md)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md`](../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md)
