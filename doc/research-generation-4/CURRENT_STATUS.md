# Research Generation 4 — 現在の状態

更新日: 2026-09-19  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 SFCDFT-STUDY3 STAGE 0 PASS / STAGE 1 NOT AUTHORIZED`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 3 preregistration = FROZEN
G4-02 Study 3 Study2 firewall prerequisite = SATISFIED
G4-02 Study 3 Stage 0 = STAGE0-PASS
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

`LGTTCI-STUDY1`は`COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`として完了し、`main`へ統合済みである。これはclaim-transfer instrumentのcompatibility/readiness結果であり、G4-02 C1/C6のgeneralization結果ではない。

## G4-02の経緯

### Study 1

`SFCDFT-STUDY1`はshort trajectory serializer orderingによりStage 1を`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じた。repair/reopenしていない。

### Study 2

`SFCDFT-STUDY2`はserializer問題をprospectiveに修正したが、Stage 1 run `35345143248`で2 sourceがengine `relay-limit` safety guardへ到達したため、`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じた。Study 2もrepair/reopenしていない。

### Study 3

`SFCDFT-STUDY3`では科学的contractを変更せず、source replayをassigned anchor pair完成時に即停止するanchor-bounded designへ変更した。candidate完成前の`relay-limit`は`NO-CANDIDATE-ENGINE-GUARD-CENSORING`とし、engine由来winnerを科学的terminal evidenceとして使わない。

正式Stage:

```text
SFCDFT3-S0-TECHNICAL-2026-09-19-v1
SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1
SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1
```

## Study 2 freshness firewall

Study 2の382 sealed source artifactだけを用い、scientific seed replayなしでdurable identity firewallを作成した。

```text
materialization run = 35388490684 / SUCCESS
install run = 35388715102 / SUCCESS
identity core = 7961d01342e35f3e70f82e5688f585be08ef99827b905dcccf032d285994abfc
source records = 382
trajectory hashes = 380
opening-prefix hashes = 372
RAW-root hashes = 657
```

この前提条件はSATISFIEDである。

## Study 3 Stage 0

canonical run `35389371946`はSUCCESSし、正式判定は`STAGE0-PASS`。

```text
scientific seed reads = 0
technical seeds scanned = 16
4-domain candidate fixtures = PASS
relay-limit censoring fixture = PASS
natural terminal distinction = PASS
max-ply root shortage = PASS
production/independent exact = PASS
Study1/Study2 firewall collision reject = PASS
artifact ID = 10564654680
artifact digest = sha256:0da2a47c4b4df3cc209217d2eab4c07785d520bca672725ab836b8c3b93b918a
deterministic core = d823461f553da8fc8bab27845c38bfcb7552e5acc771968e6e212a0dcd4294ff
```

Stage 0 PASSはStage 1 fresh accessを自動認可しない。

## Study 3 scientific seed namespace

```text
Stage 1 primary 40511001..40511384 = UNREAD
Stage 1 reserve 41511001..41511384 = UNREAD
Stage 2 primary 40521001..40521768 = UNREAD
Stage 2 reserve 41521001..41521768 = UNREAD
```

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `SFCDFT-STUDY3 STAGE0-PASS / STAGE1 NOT-AUTHORIZED` |
| `G4-03` | `ELIGIBILITY-GATE-SATISFIED / NOT-AUTHORIZED` |
| `G4-04` | `ELIGIBILITY-GATE-SATISFIED / NOT-AUTHORIZED` |
| `G4-05` | `CANDIDATE / NOT-AUTHORIZED` |
| `G4-06`〜`G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次の一手

G4-02を継続する場合は、Study 3 Stage 1 compatibility-only executionのspec、one-shot GitHub Actions pipeline、blob bindingをprospectiveに固定し、別のpre-access authorization reviewを実施する。PASSするまで`405...`/`415...` scientific seedを読まない。

## 保護境界

- Study 1/2をrepair/reopenしない。
- Study 1/2 scientific seedを再読しない。
- Study 3 Stage 1/2 scientific seedをpre-authorizationで読まない。
- G3-12のrepair/replayをしない。
- G4-10 depth11へアクセスしない。
- public AIへ自動反映しない。
- current G4-02 branchをユーザーの明示承認なしに`main`へ統合しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)
- [`../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md)
- [`../structural-forcing-corridor-tree-raw-transfer/results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json)
