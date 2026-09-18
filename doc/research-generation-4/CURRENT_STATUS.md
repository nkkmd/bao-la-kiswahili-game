# Research Generation 4 — 現在の状態

更新日: 2026-09-18  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 SFCDFT-STUDY2 STAGE 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`**

## Program全体

第四世代のprospective program planは`main`へ統合済みである。G4-01 `LGTTCI-STUDY1`は`COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`として完了し、ユーザー承認のもとPR #151で`main`へ統合済みである。

G4-02では、G3-04のC1/C6 phase-structure claimをfresh source-policy × root-family domainへ移す研究を継続している。ただし、現在までに2つのprospective StudyがいずれもStage 1 technical failureでfail-closedとなっており、**G4-02の科学的transfer判定はまだ存在しない**。

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 Study 1 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 2 Stage 0 = PASS
G4-02 Study 2 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 compatibility/generalization/counterexample decision = NONE
G4-02 Study 2 Stage 2 = NOT AUTHORIZED / NOT ACCESSED
G4-03 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-04 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized by RG4 = false
Current G4-02 branch main integration = NOT AUTHORIZED / NOT PERFORMED
```

## G4-01の確定状態

G4-01の正式Studyは`LGTTCI-STUDY1`である。

```text
Stage 0 = STAGE0-PASS
old Stage 1 = EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
Stage 1R = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
SFCDF = compatible
SILGM = compatible
GCLD = compatible
source coverage = 1536 / 1536
paired reserve use = 0
fresh workflow rerun = 0
seed-free measurements = 22 / 22 success
recovery run = 35265290422 / success
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
```

`COMPATIBILITY-ELIGIBLE-ALL`はcompatibility/readiness判定であり、generalization、effect、counterexampleのformal resultではない。

## G4-02の研究経緯

initial G4-02 authorization reviewはG4-01 legacy source recordのopening-prefix identity不足から`PREREQUISITE-REQUIRED`だった。旧seedを再読せずmethodology amendmentとidentity-only firewallを整備した後、authorization review V2で`G4-02-AUTHORIZED`となった。

### Study 1 — `SFCDFT-STUDY1`

Stage 0は`PASS`。Stage 1はrun `35311628238`で384 primary slotsを一度だけ開始し、375 sealed sources / 9 deterministic failuresとなった。failureはshort trajectoryに対してfirst-16 opening-prefix serializer invariantをanchor eligibilityより先に要求したことによる。

frozen semanticsを事後変更せず、`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じた。Study 1をrepair/reopenしていない。

### Study 2 — `SFCDFT-STUDY2`

Study 1のfailureをtechnical development informationとして用い、C1/C6仮説・方向・endpoint・domain・sample target等の科学的contractを変えず、新しいStudy identity、fresh seed namespace、freshness firewallをprospectiveにfreezeした。source serializationはcandidate eligibilityを先に判断できるよう修正した。

Stage 0 `SFCDFT2-S0-TECHNICAL-2026-09-18-v1` は `PASS`。

Stage 1 `SFCDFT2-S1-COMPATIBILITY-2026-09-18-v1` はpre-access binding / execution authorization後、GitHub Actions run `35345143248`で一度だけ実行した。

```text
primary START = 384
sealed source success = 382
deterministic source failure = 2
paired reserve START = 0
retry = 0
unresolved = 0
fatal = true
Stage 1 scientific decision = NONE
```

failed slots:

```text
40411112 -> relay-limit seed=40411112 ply=225
40411312 -> relay-limit seed=40411312 ply=223
```

2件とも `P2 / RF1 / SFCDFT2-D3-P2-RF1` の割当で、frozen production replayの`relay-limit` guardで停止した。これはinfrastructure interruptionではないためpaired reserveを使用していない。382 sealed sourcesだけを用いたrecoveryも行っていない。

frozen Stage 1 specではnormal source statusは `CANDIDATE-PAIR-COMPLETE` / `NO-CANDIDATE-ROOT-SHORTAGE` であり、integrity failureは `TECHNICAL-INVALID` に写像される。したがってStudy 2 Stage 1は **`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`** である。

重要なのは、これはC1/C6 transfer仮説の否定ではないことである。科学的compatibility/generalization/counterexample decisionは生成されていない。

canonical provenance:

```text
execution head = 8c84f2cda1a62f812f030ef319341683a4d77e54
Actions run = 35345143248
final classification artifact = 10546781677
artifact digest = sha256:f11a502dcd9e9c273a6f41fb3e8f4ebfb7de12f028e60ad50b884e44cb0de0b6
```

## G4-02 seed disposition

### Study 1 Stage 1

```text
40311001..40311384 = 384/384 read / QUARANTINED / NO-REUSE
41311001..41311384 = 0 read / NOT-USED
```

### Study 2 Stage 1

```text
40411001..40411384 = 384/384 read / CONSUMED-ONCE / QUARANTINED / NO-REUSE
41411001..41411384 = 0 read / NOT-USED / NOT-ELIGIBLE-FOR-STUDY2-RECOVERY
```

### Study 2 Stage 2

```text
SFCDFT2-S2-FORMAL-HELDOUT-2026-09-18-v1
authorization = false
seed reads = 0
evidence access = 0
scientific outcome = none
```

## Agenda別の現在状態

| Agenda | 役割 | 現在の状態 |
| --- | --- | --- |
| `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| `G4-02` | corridor / tree-graph transfer | `SFCDFT-STUDY2 STAGE 1 TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED` |
| `G4-03` | width / search-ranking transfer | `ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED` |
| `G4-04` | geometry-trajectory transfer | `ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED` |
| `G4-05` | exact microdomain oracle foundation | `CANDIDATE / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-06` | geometry / exact consequence bridge | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-07` | multiscale memory / return | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-08` | rule-semantic transition | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-09` | search reliability / exact agreement | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT-AUTHORIZED-NOT-ACCESSED` |
| `G4-P01` | canonicalization re-foundation | `INDEPENDENT / NON-BLOCKING / NOT-AUTHORIZED` |
| `G4-H01` | human / expert evidence | `DEFERRED / INDEPENDENT / NON-BLOCKING` |

## 保護された境界

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE / NO RERUN
G3-12 Stage 1 = CLOSED / NO REPAIR OR REPLAY
G3-12 Stage 2 seeds = UNREAD / NOT REUSED BY RG4
G4-01 old namespaces = QUARANTINED / NO REUSE
G4-01 Stage 1R fresh workflow = EXECUTED ONCE / NO RERUN
G4-02 Study 1 primary = CONSUMED ONCE / QUARANTINED
G4-02 Study 2 primary = CONSUMED ONCE / QUARANTINED
G4-02 Study 2 paired reserve = UNREAD / NOT USED
G4-02 Study 2 Stage 2 seeds = UNREAD / NOT ACCESSED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
authoritative state identity = RAW
```

## 次の一手

`SFCDFT-STUDY2`をrepair/reopenしない。同じG4-02科学課題を再検証する場合は、今回の`relay-limit` failureをtechnical development informationとして扱い、新しいprospective Study/Stage identity、新しいfresh seed namespace、`relay-limit` semantics、production/independent replay contract、Study 1/2 identity firewallを**fresh scientific seed access前**にfreezeし、改めてauthorization reviewを行う。

別Agendaへ進む場合も、Agenda固有のauthorization reviewを先に行う。

現在のG4-02 research branchを`main`へ統合する承認はまだない。

## 文書上の正本

- [`README.md`](README.md) — 第四世代研究の入口
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
- [`RESUME_HERE.md`](RESUME_HERE.md) — 現在の安全な再開位置
- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md) — G4-02 current state
- [`../structural-forcing-corridor-tree-raw-transfer/STUDY_2_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_2_PROTOCOL.md) — Study 2 frozen protocol
- [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-study2-stage1-technical-invalid-relay-limit.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-study2-stage1-technical-invalid-relay-limit.md) — Study 2 Stage 1 closure
- [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json) — Study 2 Stage 1 machine-readable result
