# Research Generation 4 — 現在の状態

更新日: 2026-09-26  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION / G4-03 COMPLETE / G4-04 COMPLETE / G4-05 COMPLETE`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED
G4-06 = NEXT CORE CANDIDATE / ELIGIBLE FOR AUTHORIZATION REVIEW / NOT-AUTHORIZED
G4-07..G4-09 = DEPENDENCY-GATED / NOT-AUTHORIZED
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

### Stage 0

```text
run = 36118292862 / attempt 1 / success
stage decision = STAGE0-TECHNICAL-PASS
technical gates = 9 / 9 PASS
fresh scientific evidence = none
```

### Stage 1

```text
run = 36118961899 / attempt 1 / success
stage decision = STAGE1-DEVELOPMENT-ACCEPTED
selected tier = T3
selected roots = 7
complete closures = 5
Stage 1 RAW identity firewall roots = 8307
formal inference = false
```

### Stage 2

```text
canonical run = 36120286922 / attempt 1 / success
execution SHA = 72e45631112359346a83f9399be32ee3e6420ccb
artifact ID = 10858056244
artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
fresh seed block = 40523001..40524024 / 1024 games / maxPly 320
Stage 1 identity firewall roots = 8307
fresh RAW overlap excluded = 0
eligible candidates = 21
inspected candidates = 10
formal complete domains = 8
production / independent agreement = true
formal decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
main integration = COMPLETE / PR #166 / merge commit 97ffe3758157d2497b5884f7b17abe59a24159b5
```

frozen minimum gateは6 complete domains、targetは8。candidate 1と4は`STATE-LIMIT`でcomplete closureにならず、そのままfail-closedした。cap増加、root replacement、seed extension、same-evidence rerunは行っていない。

8 formal domainsではproduction / independentがgraph identity、transition identity、retrograde solution、root exact result、recurrent SCC metadataまで一致した。8 domainのrecurrent countは0だったが、`RECURRENT`は公式ルール上の`DRAW`を意味せず、draw inferenceは認可していない。whole-Bao generalization、AI strength claim、public AI変更も認可しない。

G4-05は`COMPLETE / FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN`として閉じ、PR #166で`main`へ統合済みである。

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| `G4-03` | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| `G4-04` | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| `G4-05` | `COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED` |
| `G4-06` | `NEXT CORE CANDIDATE / ELIGIBLE FOR AUTHORIZATION REVIEW / NOT-AUTHORIZED` |
| `G4-07`〜`G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次に許可される作業

G4-05のscientific executionは完了しているため追加runは行わない。

Program PlanではG4-06について、G4-05がformal-eligible exact oracle domainを生成した場合だけ実行すると固定している。G4-05がその前提を満たしたため、Research Generation 4を継続する場合の次のcore candidateは**G4-06 — 局所幾何とexact game-theoretic consequenceの接続**である。

ただし、これはG4-06のexecution authorizationではない。G4-06へ進む場合は専用authorization reviewから開始する。

## 保護境界

- G4-02 closed Studiesをrepair / reopen / rerunしない。
- G4-03 Stage 1 / Stage 2をrerunしない。
- G4-04 Stage 1 / Stage 2をrerunしない。
- G4-05 Stage 0 / Stage 1 / Stage 2をrerunしない。
- G4-05 `STATE-LIMIT` candidateをresource増加で救済しない。
- G4-05 seed blockをextensionしない。
- G4-05 recurrent resultをDRAWへ読み替えない。
- G4-05 resultをwhole-Bao solutionへ拡張しない。
- G3-12をrepair / replayしない。
- G3-11 depth-10をrerunしない。
- G4-10 depth-11へアクセスしない。
- RG4 resultをpublic AIへ自動反映しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/README.md`](../reachable-late-game-exact-microdomain-oracle-foundation/README.md)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md`](../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../research-program-decisions/2026-09-25-g4-05-reachable-late-game-exact-microdomain-oracle-foundation-study1-closure.md`](../research-program-decisions/2026-09-25-g4-05-reachable-late-game-exact-microdomain-oracle-foundation-study1-closure.md)
- [`checkpoints/2026-09-26-g4-05-main-integration.md`](checkpoints/2026-09-26-g4-05-main-integration.md)
