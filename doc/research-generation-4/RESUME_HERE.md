# Research Generation 4 — 再開位置

更新日: 2026-09-19  
状態: **`G4-02 SFCDFT-STUDY3 PREREGISTRATION FROZEN / STAGE 0 AUTHORIZED / STAGE 1 NOT AUTHORIZED`**

## 再開時の読む順序

1. remote `main` HEADと`research/g4-02-sfcdft-study3-prereg` HEADを取得し、完全SHAを記録する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
3. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)でG4-02のscientific boundaryとno-rescue ruleを確認する。
4. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)でG4-02 current stateを確認する。
5. [`../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md)でStudy 3 frozen contractを確認する。
6. [`../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_SPEC.json`](../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_SPEC.json)でmachine-readable freezeを確認する。
7. [`../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md`](../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md)でauthorization boundaryを確認する。
8. Study 2 closure [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json)を確認する。
9. [`../DOCUMENTATION_LANGUAGE_POLICY.md`](../DOCUMENTATION_LANGUAGE_POLICY.md)と[`../JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](../JAPANESE_DOCUMENTATION_QUALITY_GATE.md)を読む。

## 現在地

```text
main HEAD at Study3 review = c5689d70cd017171e7738140ba9186a117f732f1
Study2 closure parent = 06515c5f8c3462e1265b40be74283f3a4deb933d
current branch = research/g4-02-sfcdft-study3-prereg
G4-02 Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 3 = PREREGISTRATION FROZEN
Study 3 Stage 0 = AUTHORIZED / NOT YET EXECUTED
Study 3 Stage 1 = NOT AUTHORIZED / fresh reads 0
Study 3 Stage 2 = NOT AUTHORIZED / fresh reads 0
Study 2 identity firewall = REQUIRED BEFORE STAGE 1 / NOT YET MATERIALIZED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Study 2からのtechnical lesson

Study 2 Stage 1 canonical run `35345143248`ではprimary 384 slotsのうち382 sealed sourceを保存し、2 slotsがsource replay中のengine `relay-limit` guardで停止した。

```text
40411112 -> relay-limit at ply 225
40411312 -> relay-limit at ply 223
```

`relay-limit`はBaoの自然な終局ではなく`engine.js`の`MAX_RELAY=512` safety guardである。Study 2をrepair/reopenせず、failed seedsを再読しない。

## Study 3のtechnical remediation

Study 3ではassigned root pairを得るために必要なprefixだけを生成する。

```text
source replay
-> assigned anchorsを各plyで更新
-> Namua/Mtaji pair完成
-> 即停止
```

pair完成後のcontinuationは生成しない。

pair完成前の停止:

```text
natural terminal / max source ply
  -> NO-CANDIDATE-ROOT-SHORTAGE

engine relay-limit
  -> NO-CANDIDATE-ENGINE-GUARD-CENSORING
  -> scientific terminal = false

identity / production-independent mismatch
  -> TECHNICAL-INVALID
```

## Study 3 seed namespace

scientific seedは全て未読である。

```text
Stage 1 primary = 40511001..40511384
Stage 1 reserve = 41511001..41511384
Stage 2 primary = 40521001..40521768
Stage 2 reserve = 41521001..41521768
Stage 0 technical = 49031001..49031256
```

## 次に実行する作業

安全な順序は次である。

1. Study 2 run `35345143248`の382 sealed source artifactsからidentity-only firewallをseed-freeでmaterializeする。
2. firewallのsource count、opening-prefix count、RAW-root count、hash coreを検証する。
3. Study 3 Stage 0 production / independent implementationを作る。
4. technical namespaceまたはsynthetic fixtureだけでanchor-bounded replayとrelay-limit censoringを検証する。
5. Stage 0 resultをfreezeする。
6. firewall + Stage 0 PASSの両方が揃った場合だけStage 1 pre-access binding / authorization reviewを作る。
7. Stage 1 authorization前は`405...`/`415...` scientific seedをreadしない。

## 現時点の禁止事項

- Study 1/2 scientific seedの再読・再実行・repair
- Study 2 failed slotをtechnical fixtureとしてreplayすること
- Study 2 paired reserveによる救済
- Study 3 Stage 1/2 scientific seed access
- Stage 1 authorization前のfresh source population生成
- Study 3 protocol/specの観測後変更によるrescue
- G3-12 repair / reopen / Stage 1 replay
- G4-10 authorization前のdepth11 access
- public AI変更
- `main`統合

## main統合境界

現在のresearch branchを`main`へ統合する承認はない。**ユーザーの明示指示があるまで統合しない。**
