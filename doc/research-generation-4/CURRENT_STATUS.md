# Research Generation 4 — 現在の状態

更新日: 2026-09-27  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01..G4-06 MAIN INTEGRATED / G4-07 COMPLETE ON RESEARCH BRANCH / PRE-MAIN AUDIT NEXT`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED
G4-07 = COMPLETE / FORMAL-COMPLETE / RESEARCH BRANCH CLOSED / MAIN NOT INTEGRATED
G4-08..G4-09 = DEPENDENCY-GATED / NOT-AUTHORIZED
G4-10 depth 11 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
G4-P01 = INDEPENDENT / NOT-AUTHORIZED
G4-H01 = DEFERRED
Public AI change authorized by RG4 = false
```

## G4-01 — compatibility instrument

G4-01 `LGTTCI-STUDY1` はSFCDF・SILGM・GCLDの3 familyについてfresh-domain researchを行うためのcompatibility/readiness instrumentを検証し、`COMPATIBILITY-ELIGIBLE-ALL`で完了した。これはgeneralizationやeffect directionを確認した結果ではない。`main`統合済み。

## G4-02 — corridor / tree-graph transfer

G4-02はG3-04由来C1/C6のfresh-domain transferをprospectiveに実施したが、no-rescue ruleに従い有効なformal Stage 2 measurementへ到達せず、`CLOSED / NO SCIENTIFIC DECISION`で閉じた。generalization failureやcounterexampleのnegative scientific evidenceではない。`main`統合済み。

## G4-03 — width / search-ranking transfer

G4-03 `LWSRT-STUDY1` はfresh source-policy × root-family domainsで12 testを行い、9 `GENERALIZATION-CONFIRMED`、1 `NOT-GENERALIZED`、2 `NON-ESTIMABLE`、counterexample 0で完了した。`main`統合済み。

## G4-04 — geometry trajectory dynamics transfer

G4-04 `GTTD-STUDY1` はG3-10由来C1・C2・C3・C5のdirectionをfresh P1/P2 domainsへ移送検証した。

```text
Stage 2 canonical run = 36095831961 / attempt 1 / success
formal measured trajectories = 64
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
main integration = COMPLETE / PR #165
```

8/8で同方向移送を確認したが、whole-Bao law、game-theoretic value、AI strength、人間のdifficultyは主張しない。

## G4-05 — exact microdomain oracle foundation

G4-05 `RLEMOF-STUDY1` はfresh reachable late-game rootsから限定microdomainを構築し、complete legal-transition closureと独立exact solver agreementをprospectiveに検証した。

```text
Stage 2 canonical run = 36120286922 / attempt 1 / success
formal complete domains = 8
formal decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
main integration = COMPLETE / PR #166
```

resource capでcomplete closureにならなかったcandidateを救済せず、recurrent resultを公式DRAWへ読み替えていない。

## G4-06 — local geometry / exact-consequence bridge

G4-06 `LGTGECB-STUDY1` はG4-05の固定8 exact microdomain内でrelative depth 5 local geometryとexact value・DTF・value-preserving move countを接続した。

```text
Stage 1 canonical run = 36214800357 / attempt 1 / success
formal domains = 8 / 8
relations emitted = 12 / 12
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
main integration = COMPLETE
```

Tree/RAW inflationとtransposition occupancyはvariation不足で`NON-ESTIMABLE`。DTF × reply width、VPMC × corridorは事前登録finite ordering ruleで`MONOTONE-DECREASING-ORDER-CONSISTENT`となったが、N=8限定結果をwhole-Baoへ一般化しない。

## G4-07 — multiscale geometry memory / return

G4-07 `MLGMR-STUDY1` は、fresh P1/P2 trajectories上で6つのcontinuous local-geometry axisについてlagged sign persistence / reversalをprospectiveに検証した。

Stage 1はsupport-onlyで24 slot中16 slotをeffect direction非使用でformal familyへ送った。

Stage 2 canonical execution:

```text
run = 36278926636 / attempt 1 / success
head = f73e2ade42b3379b9eaf2007292a057cfeaf88f0
artifact ID = 10919769185
artifact ZIP SHA-256 = 4d8370ccad1be7fa4052a4293e6b64c4e1b77f7c11c94c1f4dbabead694394f2
fresh scientific seed reads = 363
formal measured trajectories = 64 / P1 32 / P2 32
production / independent exact agreement = true
formal family = 16
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
G4-10 depth-11 access = 0
```

全6 axisのlag 1が`REVERSAL-CONFIRMED`。lag 2の6 slotとformal-family内lag 4の4 slotは`NOT-CONFIRMED`。lag 8はStage 1 support不足でformal family外。

preregistered contiguous-persistence summaryは全6 axisで:

```text
confirmedContiguousPersistenceLagMax = NONE
```

これはtemporal structure不在を意味しない。固定P1/P2 populationでは、same-sign persistence chainがlag 1から始まらず、最短lagでopposite-sign relationがformal confirmationに到達したという限定結果である。

return endpointはdescriptive only。universal oscillation / mean-reversion law、因果的rule-event mechanism、physical half-life、AI strengthへの読み替えは禁止する。

G4-07 scientific executionは研究ブランチ上で閉じた。main統合は未認可・未実施。

詳細:

- [`../multiscale-local-geometry-memory-return/FINAL_REPORT.md`](../multiscale-local-geometry-memory-return/FINAL_REPORT.md)
- [`../multiscale-local-geometry-memory-return/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../multiscale-local-geometry-memory-return/results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`../multiscale-local-geometry-memory-return/checkpoints/2026-09-27-stage-2-formal-complete.md`](../multiscale-local-geometry-memory-return/checkpoints/2026-09-27-stage-2-formal-complete.md)
- [`../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md`](../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md)

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| `G4-03` | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| `G4-04` | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| `G4-05` | `COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED` |
| `G4-06` | `COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED` |
| `G4-07` | `COMPLETE / FORMAL-COMPLETE / RESEARCH BRANCH CLOSED / MAIN NOT INTEGRATED` |
| `G4-08`〜`G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次に許可される作業

G4-07 scientific executionは完了した。同一Stageの追加run、seed extension、replacement population、lag/axis/checkpoint変更、subgroup rescueは行わない。

次に行うのは **G4-07 pre-main consistency audit / main-integration review** である。関連文書、canonical record、branch scope、protected boundaries、public AI非変更を横断確認し、問題がなければその後にのみmain統合を検討する。

G4-08 / G4-09 / G4-10は本closureによって自動認可されない。

## 保護境界

- G4-02 closed Studiesをrepair / reopen / rerunしない。
- G4-03 Stage 1 / Stage 2をrerunしない。
- G4-04 Stage 1 / Stage 2をrerunしない。
- G4-05 Stage 0 / Stage 1 / Stage 2をrerunしない。
- G4-05 candidate poolをrescanしない。
- G4-06 formal Stageをrerun / rescueしない。
- G4-07 Stage 1 / Stage 2をrerun / rescueしない。
- G4-07 seed extension / replacement populationを行わない。
- G4-07 resultをuniversal oscillation / causal lawへ拡張しない。
- G3-11 depth-10をrerunしない。
- G4-10 depth-11へアクセスしない。
- RG4 resultをpublic AIへ自動反映しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`../multiscale-local-geometry-memory-return/FINAL_REPORT.md`](../multiscale-local-geometry-memory-return/FINAL_REPORT.md)
- [`../multiscale-local-geometry-memory-return/CURRENT_STATUS.md`](../multiscale-local-geometry-memory-return/CURRENT_STATUS.md)
- [`../multiscale-local-geometry-memory-return/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../multiscale-local-geometry-memory-return/results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`../multiscale-local-geometry-memory-return/checkpoints/2026-09-27-stage-2-formal-complete.md`](../multiscale-local-geometry-memory-return/checkpoints/2026-09-27-stage-2-formal-complete.md)
- [`../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md`](../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md)
