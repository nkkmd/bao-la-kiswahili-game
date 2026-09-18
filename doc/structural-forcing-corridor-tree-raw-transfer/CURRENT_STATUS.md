# G4-02 — 現在の状態

更新日: 2026-09-19  
Agenda: `Research Generation 4 / G4-02`  
現在のStudy: `SFCDFT-STUDY3`  
状態: **`STUDY 3 STAGE 1 FORMAL-PREPARATION-ELIGIBLE / STAGE 2 PRE-ACCESS REVIEW NEXT`**

## 現在地

G4-02はG3-04でformalに確認されたC1/C6 phase-structure claimをfresh source-policy × root-family domainへ移送できる範囲と反例境界を検証するAgendaである。科学的contractはStudy 1から一貫して変更していない。

```text
SFCDFT-STUDY1 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY2 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY3 preregistration = FROZEN
SFCDFT-STUDY3 Study2 firewall prerequisite = SATISFIED
SFCDFT-STUDY3 Stage 0 = STAGE0-PASS
SFCDFT-STUDY3 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
SFCDFT-STUDY3 Stage 2 = NOT AUTHORIZED / fresh reads 0
G4-02 scientific generalization/counterexample decision = NONE
Public AI change = false
main merge = false
```

## Study 3 Stage 1

Stage ID:

`SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1`

canonical one-shot run `35396341311` は `completed / success` で終了した。

```text
execution head = b2a70b198c343bf05b9c81ac15fa546858955cdf
primary START = 384 / 384
sealed primary source = 384 / 384
retry = 0
reserve = 0
deterministic source failure = 0
root shortage = 99
candidate pair complete = 285
engine-guard censoring = 0
selected pairs = 32 / 32
measurement tasks = 8 / 8 SUCCESS
Stage 1 decision = FORMAL-PREPARATION-ELIGIBLE
final result artifact ID = 10567663854
final result artifact digest = sha256:a36e4cbad1fb885065badd9b1ad519f065e221cb9af4ea4669e56ea13192b2ba
deterministic core = 498decdc808558d2e019d1ddf7aeec6c66d2a8074c6478e117a24bc9301e4dab
```

4 domainすべてで8 pairが測定され、C1/C6は8/8 defined、resource passも8/8だった。

freshness firewallではseed `40511296` のStudy 2 opening-prefix collisionを正常に除外した。scientific effect、effect direction、p-value、generalization/counterexample decisionは生成していない。

正本:

- [`results/stage-1-study3/STUDY_3_STAGE_1_COMPATIBILITY_RESULT.json`](results/stage-1-study3/STUDY_3_STAGE_1_COMPATIBILITY_RESULT.json)
- [`checkpoints/2026-09-19-study3-stage1-formal-preparation-eligible.md`](checkpoints/2026-09-19-study3-stage1-formal-preparation-eligible.md)

## Study 3のtechnical remediation

Study 3はStudy 1/2をrepair/reopenせず、新しいStudy identityとfresh namespaceを持つprospective再検証である。source replayはassigned anchor pair完成時に即停止する。

```text
policy/root-family assignment
-> source replay
-> assigned anchorを各plyで評価
-> Namua/Mtaji pair完成
-> 即停止
```

candidate完成前の停止は、natural terminal / max source plyをroot shortage、engine `relay-limit`をengine-guard censoringとして分離する。

## Study 2 identity firewall

Study 2の382 sealed source artifactだけからseed-freeでdurable firewallをmaterializeした。Study 2 scientific seedは再読していない。

```text
materialization run = 35388490684
install run = 35388715102
identity core = 7961d01342e35f3e70f82e5688f585be08ef99827b905dcccf032d285994abfc
source records = 382
unique source trajectory hashes = 380
unique first-16 opening-prefix hashes = 372
unique RAW-root hashes = 657
```

正本: `doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study2/`

## Stage 0

`SFCDFT3-S0-TECHNICAL-2026-09-19-v1` はcanonical run `35389371946`で `STAGE0-PASS`。

```text
scientific seed reads = 0
artifact ID = 10564654680
artifact digest = sha256:0da2a47c4b4df3cc209217d2eab4c07785d520bca672725ab836b8c3b93b918a
deterministic core = d823461f553da8fc8bab27845c38bfcb7552e5acc771968e6e212a0dcd4294ff
```

## 科学的contract

Study 1/2から変更していない。

```text
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / NAMUA-GREATER
representation = RAW-only
relative depth = 5
source policies = P1 / P2
root families = RF1 / RF2
Stage 1 target = 8 compatible pairs/domain
Stage 2 target = 18 pairs/domain
formal family = fixed 8 hypotheses
family-wise alpha = 1/20
inference = exact two-sided sign test + fixed-eight Holm-Bonferroni
```

## Scientific seed boundary

```text
Stage 1 primary = 40511001..40511384 / CONSUMED-ONCE / QUARANTINED / NO-REUSE
Stage 1 paired reserve = 41511001..41511384 / UNREAD / NOT-USED / CLOSED-FOR-STAGE1
Stage 2 primary = 40521001..40521768 / UNREAD
Stage 2 paired reserve = 41521001..41521768 / UNREAD
```

## 次の安全な作業

1. Stage 2 formal held-out executionのfrozen contractとexact inference familyを再確認する。
2. Study 1/2/Study 3 Stage 1を含むfreshness firewallをprospectiveに固定する。
3. one-shot source acquisition / seed-free measurement / exact inference pipelineを準備する。
4. 実行blobをbindingし、seed-free preflightを行う。
5. pre-access authorization reviewがPASSした場合だけStage 2 fresh scientific namespaceへのアクセスをfinal authorizeする。

`FORMAL-PREPARATION-ELIGIBLE`はStage 2の自動認可ではない。

## 禁止事項

- Study 1/2 scientific seedの再読・repair・rerun
- Study 3 Stage 1 fresh populationのrerun
- Study 3 Stage 1 primary/reserveの再利用
- Stage 2 pre-authorization seed access
- deterministic scientific failureのreserve救済
- G4-10 depth11 access
- public AIへの研究結果の自動反映
- current branchの`main`統合

## 正本

- [`STUDY_3_PROTOCOL.md`](STUDY_3_PROTOCOL.md)
- [`prereg/STUDY_3_SPEC.json`](prereg/STUDY_3_SPEC.json)
- [`prereg/STUDY_3_STAGE_1_COMPATIBILITY_SPEC.json`](prereg/STUDY_3_STAGE_1_COMPATIBILITY_SPEC.json)
- [`results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json`](results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json)
- [`results/stage-1-study3/STUDY_3_STAGE_1_COMPATIBILITY_RESULT.json`](results/stage-1-study3/STUDY_3_STAGE_1_COMPATIBILITY_RESULT.json)
