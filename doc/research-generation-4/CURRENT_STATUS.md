# Research Generation 4 — 現在の状態

更新日: 2026-09-24  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION / G4-03 COMPLETE`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / NOT YET MAIN INTEGRATED
G4-04 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-05 = CANDIDATE / NOT-AUTHORIZED
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

正式状態:

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
scientific transfer decision = NONE
final formal Stage 2 status = TECHNICAL-INVALID
main integration = COMPLETE / PR #154
```

これはC1/C6の一般化失敗やcounterexampleのnegative scientific evidenceではない。

## G4-03 — width / search-ranking transfer

G4-03 `LWSRT-STUDY1` は、G3-07でformal confirmationされたroot legal width HIGH stratumとranking-preorder changeのassociationを、G4-01でcompatibility確認済みのfresh source-policy × root-family domainsへ移送検証した。

### Stage 1

```text
run = 35987703180 / attempt 1 / success
seed block = 40312001..40312768 / 768
selected roots = 128 / 128
16 strata = 8 HIGH + 8 LOW each
SC1 / SC2 / SC3 endpoint definedness = 128 / 128 each
production / independent exact = true
formal inference = prohibited / not performed
```

### Stage 2

final one-shot authorization `LWSRT-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`をfresh access前に固定し、専用trigger、24-file frozen binding、identity firewall、seed-free preflight、durable repository leaseを通過して一回だけ実行した。

```text
canonical run = 35993172710 / attempt 1 / success
trigger commit = f52fcd5a16028bac8e97a5b714b87c72853628e4
durable lease commit = 3ca186b448460e42f9057fbef9a741982550bbaa
seed block = 40322001..40323536 / 1536
scientific executions = 1 / 1
selected roots = 192 / 192
production / independent exact = true
stage disposition = STAGE2-COMPLETE-WITH-NON-ESTIMABLE
artifact ID = 10805571797
artifact SHA-256 = c4449f9a034f30a501f60c6ee90b07426bd1c42aa3b0bbc150fd8d3e1199b597
STAGE_2_RESULT.json SHA-256 = 88dd8c2e586f36692d5d0cb1d66847affe0151a803f9230eb7d8425f93469bf3
```

### Formal result

fixed 12-test Holm familyの最終内訳:

```text
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

Claim別:

- `SC1 DEPTH`: 4/4 domainsで`GENERALIZATION-CONFIRMED`
- `SC2 NODE-BUDGET`: P1×RF1 / P1×RF2で`GENERALIZATION-CONFIRMED`、P2×RF1 / P2×RF2はMtaji support不足で`NON-ESTIMABLE`
- `SC3 QUIESCENCE`: P1×RF1 / P1×RF2 / P2×RF1で`GENERALIZATION-CONFIRMED`、P2×RF2は`NOT-GENERALIZED`
- `COUNTEREXAMPLE-CONFIRMED`は0

対象associationは本Studyのfresh domainsで広く移送されたが、無条件のuniversal lawではない。formal support不足とHolm補正後にconfirmationへ届かないdomainが存在する。

この結果はbest move correctness、game-theoretic value、AI strength、人間のdifficulty、causal mechanismを検証していない。public AI変更は認可しない。

G4-03は`COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE`として閉じた。同一Studyのrerun / repair / seed extensionは行わない。

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| `G4-03` | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / NOT YET MAIN INTEGRATED` |
| `G4-04` | `ELIGIBILITY-GATE-SATISFIED / NOT-AUTHORIZED` |
| `G4-05` | `CANDIDATE / NOT-AUTHORIZED` |
| `G4-06`〜`G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次に許可される作業

G4-03のscientific executionは完了しているため追加runは行わない。

Research Generation 4を継続する場合、次のcore candidateは`G4-04`である。ただしG4-01のeligibility gateだけでは自動authorizationされない。**G4-04専用のauthorization reviewから開始する。**

G4-03を`main`へ統合する場合も別工程であり、ユーザーの明示指示が必要である。

## 保護境界

- G4-02 closed Studiesをrepair/reopen/rerunしない。
- G4-03 Stage 1 / Stage 2をrerunしない。
- G4-03 fixed seedを救済目的で再読しない。
- G4-03 resultをwhole-Bao universal lawへ拡張しない。
- G3-12をrepair/replayしない。
- G4-10 depth11へアクセスしない。
- RG4 resultをpublic AIへ自動反映しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`checkpoints/2026-09-24-g4-03-complete.md`](checkpoints/2026-09-24-g4-03-complete.md)
- [`../local-width-search-ranking-transfer/CURRENT_STATUS.md`](../local-width-search-ranking-transfer/CURRENT_STATUS.md)
- [`../local-width-search-ranking-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../local-width-search-ranking-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../research-program-decisions/2026-09-24-g4-03-local-width-search-ranking-transfer-study1-closure.md`](../research-program-decisions/2026-09-24-g4-03-local-width-search-ranking-transfer-study1-closure.md)
