# Research Generation 4 — 現在の状態

更新日: 2026-09-19  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 SFCDFT-STUDY3 PREREGISTRATION FROZEN / STAGE 1 NOT AUTHORIZED`**

## Program全体

Research Generation 4のprospective program planは`main`へ統合済みである。G4-01 `LGTTCI-STUDY1`は`COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`として完了し、`main`へ統合済みである。

G4-02はG3-04 C1/C6のfresh domain transferを検証するAgendaである。Study 1とStudy 2はいずれもscientific decisionを生成する前にtechnical failureでfail-closedとなった。現在は新しいprospective Study 3を開始し、scientific contractを変更せずsource acquisitionのtechnical boundaryだけを修正した。

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 3 = PREREGISTRATION FROZEN
G4-02 Study 3 Stage 0 = AUTHORIZED / NOT YET EXECUTED
G4-02 Study 3 Stage 1 = NOT AUTHORIZED / fresh reads 0
G4-02 Study 3 Stage 2 = NOT AUTHORIZED / fresh reads 0
G4-02 scientific transfer decision = NONE
G4-03 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-04 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized by RG4 = false
Current G4-02 branch main integration = NOT AUTHORIZED / NOT PERFORMED
```

## G4-01

確定状態:

```text
Study = LGTTCI-STUDY1
Stage 0 = PASS
Stage 1R = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
SFCDF = compatible
SILGM = compatible
GCLD = compatible
source coverage = 1536 / 1536
paired reserve use = 0
fresh workflow rerun = 0
```

G4-01のcompatibility判定はscientific generalization/effect/counterexample resultではない。

## G4-02 Study 1

`SFCDFT-STUDY1`はStage 1で384 primary slotsを一度だけ実行し、375 sealed source / 9 deterministic serializer failuresとなった。

short trajectoryに対してfirst-16 opening prefixをanchor eligibilityより前に要求したfrozen semanticsを事後変更せず、`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じた。

## G4-02 Study 2

`SFCDFT-STUDY2`はStudy 1 serializer問題をprospectiveに修正した。Stage 0はPASSしたが、Stage 1 canonical run `35345143248`で382 sealed sources / 2 deterministic failuresとなった。

failed slots:

```text
40411112 -> relay-limit at ply 225
40411312 -> relay-limit at ply 223
```

`relay-limit`は`public/engine.js`の`MAX_RELAY=512`による実装上の安全ガードであり、Baoの自然なterminalとして科学的に利用しない。Study 2もrepair/reopenせずfail-closedで閉じた。

## G4-02 Study 3

正式Study:

```text
Study ID = SFCDFT-STUDY3
Stage 0 = SFCDFT3-S0-TECHNICAL-2026-09-19-v1
Stage 1 = SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1
Stage 2 = SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1
branch = research/g4-02-sfcdft-study3-prereg
```

Study 3のtechnical remediationはanchor-bounded source replayである。assigned Namua/Mtaji pairが双方揃った最初の時点でreplayを停止し、科学的に不要なpost-anchor continuationを生成しない。

pair完成前の`relay-limit`は`NO-CANDIDATE-ENGINE-GUARD-CENSORING`とし、winner/reasonをBao terminal evidenceとして使わない。

科学的contractはStudy 2から不変である。

```text
C1 direction = MTAJI-GREATER
C6 direction = NAMUA-GREATER
RAW-only / depth 5
P1/P2 × RF1/RF2 = 4 domains
Stage 1 target = 8 pairs/domain
Stage 2 target = 18 pairs/domain
formal family = 8 hypotheses
FWER alpha = 1/20
exact two-sided sign test + fixed-eight Holm
```

## Study 3 freshness prerequisite

Study 1 durable firewallを継承する。

Study 2については次のseed namespaceを全面除外する。

```text
40411001..40411384
41411001..41411384
40421001..40421768
41421001..41421768
```

さらにStudy 2の382 sealed source artifactsからseed-freeにidentity-only firewallをmaterializeする。このfirewall完成前にStage 1 fresh accessをauthorizeしない。

予定path:

`doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study2/`

## Study 3 seed boundary

```text
Stage 1 primary 40511001..40511384 = UNREAD
Stage 1 reserve 41511001..41511384 = UNREAD
Stage 2 primary 40521001..40521768 = UNREAD
Stage 2 reserve 41521001..41521768 = UNREAD
Stage 0 technical 49031001..49031256 = NON-SCIENTIFIC
```

## Agenda別の状態

| Agenda | 役割 | 現在の状態 |
| --- | --- | --- |
| `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| `G4-02` | corridor / tree-graph transfer | `SFCDFT-STUDY3 PREREG FROZEN / STAGE 1 NOT AUTHORIZED` |
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

## 次の安全な作業

1. Study 2の382 sealed sourceからidentity firewallをseed-freeにmaterializeする。
2. Study 3 Stage 0 technical fixture / production-independent implementationを作る。
3. technical Stage 0を実行し、anchor-bounded replayとengine-guard censoringを検証する。
4. firewallとStage 0がPASSした場合のみ、Stage 1 pre-access binding / authorization reviewへ進む。

## 禁止事項

- Study 1/2 scientific seedの再読・再実行
- Study 1/2 failed slotのrepair replay
- Study 2 paired reserveによる救済
- Study 3 Stage 1/2 scientific seedへのpre-authorization access
- G3-12 repair / replay
- G4-10 authorization前のdepth11 access
- public AIへの研究結果の自動反映
- current G4-02 branchの`main`統合

## 文書上の正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)
- [`../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md)
- [`../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_SPEC.json`](../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_SPEC.json)
- [`../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md`](../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md)
