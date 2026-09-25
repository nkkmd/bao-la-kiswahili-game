# Research Generation 4 — 入口

更新日: 2026-09-26  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION / G4-03 COMPLETE / G4-04 COMPLETE / G4-05 COMPLETE`**

## このProgramが調べること

第四世代研究は、Research Generation 3で測定可能になったbounded RAW local game-tree geometryについて、主に次を検証する。

1. 別phase、root family、source policy、rule contextへどこまで移送できるか。
2. 完全解析可能な限定domainでexact game-theoretic consequenceとどう関係するか。
3. 時間的持続、rule-semantic event、search reliabilityとどう結びつくか。

第三世代のclosed Studyをrepairまたは再判定するProgramではない。各Studyはfresh evidence、事前登録、独立検証、no-rescue boundaryを用いる。

## 現在の状態

| Wave | Agenda | 目的 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| A | `G4-03` | G3-07由来width / search-ranking transfer | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| A | `G4-04` | G3-10由来geometry-trajectory transfer | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| B | `G4-05` | exact microdomain oracle foundation | `COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED` |
| B | `G4-06` | geometry / exact consequence bridge | `NEXT CORE CANDIDATE / ELIGIBLE FOR AUTHORIZATION REVIEW / NOT AUTHORIZED` |
| C | `G4-07..G4-09` | memory、rule-semantic transition、search reliability | `DEPENDENCY-GATED / NOT AUTHORIZED` |
| D | `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT AUTHORIZED / NOT ACCESSED` |
| 独立 | `G4-P01` | canonicalization re-foundation | `NOT AUTHORIZED` |
| 独立 | `G4-H01` | human / expert evidence | `DEFERRED` |

Public AI change authorized by RG4 = `false`。

## G4-01 — compatibility/readiness

G4-01 `LGTTCI-STUDY1` はSFCDF・SILGM・GCLDの3 familyを`COMPATIBILITY-ELIGIBLE-ALL`とした。これはgeneralizationそのものの確認ではない。

## G4-02 — corridor / tree-graph transfer

G4-02はG3-04由来C1/C6のfresh-domain transferをStudy 1〜4としてprospectiveに試みたが、formal scientific decisionまで到達せず、`CLOSED / NO SCIENTIFIC DECISION`となった。これはgeneralization失敗やcounterexampleのnegative scientific evidenceではない。

## G4-03 — width / search-ranking transfer

G4-03 `LWSRT-STUDY1` はG3-07由来associationをfresh source-policy × root-family domainsへ移送検証し、12 test中9 `GENERALIZATION-CONFIRMED`、1 `NOT-GENERALIZED`、2 `NON-ESTIMABLE`、counterexample 0で完了した。

詳細: [`../local-width-search-ranking-transfer/README.md`](../local-width-search-ranking-transfer/README.md)

## G4-04 — geometry trajectory dynamics transfer

G4-04 `GTTD-STUDY1` はG3-10でformal confirmationされたC1・C2・C3・C5のdirectionをfresh P1/P2 source-policy domainsへprospectiveに移送検証した。

```text
canonical Stage 2 run = 36095831961 / attempt 1 / success
formal measured trajectories = 64
production / independent exact = true
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

8/8 formal testsすべてG3-10と同方向に移送された。ただしRF1/RF2 subgroup、whole-Bao universal law、game-theoretic value、AI strength、人間のdifficultyを意味しない。

詳細: [`../geometry-trajectory-dynamics-transfer/README.md`](../geometry-trajectory-dynamics-transfer/README.md)

## G4-05 — exact microdomain oracle foundation

G4-05 `RLEMOF-STUDY1` はfresh reachable late-game rootsからoutcome-blind / resource-feasibility-onlyに限定microdomainを選び、complete legal-transition closureと独立exact solver agreementをprospectiveに検証した。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-ACCEPTED
Stage 2 canonical run = 36120286922 / attempt 1 / success
fresh seed block = 40523001..40524024 / 1024 games
Stage 1 RAW identity firewall roots = 8307
fresh RAW overlap excluded count = 0
eligible candidates = 21
inspected candidates = 10
formal complete domains = 8
production / independent agreement = true
formal decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
main integration = COMPLETE / PR #166 / merge commit 97ffe3758157d2497b5884f7b17abe59a24159b5
```

candidate 1と4は`STATE-LIMIT`でfail-closedし、resource cap増加、root replacement、seed extension、same-evidence rerunは行っていない。

8 formal domainsのrecurrent countは0だったが、`RECURRENT`を公式ルール上の`DRAW`へ読み替えず、draw inferenceも行わない。whole-Bao solution、best move correctness一般保証、AI棋力改善、public AI変更も主張しない。

G4-05はPR #166で`main`へ統合済みである。formal result、no-rescue境界、G4-06未認可、public AI非変更は統合後も変わらない。

詳細:

- [`../reachable-late-game-exact-microdomain-oracle-foundation/README.md`](../reachable-late-game-exact-microdomain-oracle-foundation/README.md)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md`](../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`checkpoints/2026-09-26-g4-05-main-integration.md`](checkpoints/2026-09-26-g4-05-main-integration.md)

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — RG4全体の最新状態
2. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
3. [`RESUME_HERE.md`](RESUME_HERE.md) — 安全な再開位置
4. [`../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md`](../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md) — G4-05正式結果
5. [`../research-program-decisions/2026-09-25-g4-05-reachable-late-game-exact-microdomain-oracle-foundation-study1-closure.md`](../research-program-decisions/2026-09-25-g4-05-reachable-late-game-exact-microdomain-oracle-foundation-study1-closure.md) — G4-05 closure decision

## 次に許可される作業

G4-05を追加実行しない。

Program PlanではG4-06を「G4-05がformal-eligible exact oracle domainを生成した場合だけ実行する」としている。G4-05がこの前提を満たしたため、次のcore candidateは`G4-06`である。

ただし、G4-06は**自動authorizationではない**。専用authorization reviewから開始する。

## 解釈上の境界

- compatibilityはgeneralizationそのものではない。
- `GENERALIZATION-CONFIRMED`は固定domain・固定endpointに限定される。
- exact resultも固定microdomainの外へ自動一般化しない。
- `RECURRENT`と公式`DRAW`を同一視しない。
- search/geometry evidenceはbest move correctnessやAI棋力を意味しない。
- machine-only evidenceはhuman difficultyの証拠ではない。
- 研究結果と公開AI engineeringは分離する。
