# G4-02 — 現在の状態

更新日: 2026-09-19  
Agenda: `Research Generation 4 / G4-02`  
現在のStudy: `SFCDFT-STUDY3`  
状態: **`STUDY 3 PREREGISTRATION FROZEN / STAGE 0 AUTHORIZED / STAGE 1 NOT AUTHORIZED`**

## 現在地

G4-02はG3-04 C1/C6のfresh source-policy × root-family transferを検証するAgendaである。科学的な中心問いは変えていない。

これまでの実行状態:

```text
SFCDFT-STUDY1 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY2 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY3 = PREREGISTRATION FROZEN
SFCDFT-STUDY3 Stage 0 = AUTHORIZED / NOT YET EXECUTED
SFCDFT-STUDY3 Stage 1 = NOT AUTHORIZED / fresh reads 0
SFCDFT-STUDY3 Stage 2 = NOT AUTHORIZED / fresh reads 0
G4-02 scientific compatibility/generalization/counterexample decision = NONE
Public AI change = false
main merge = false
```

## Study 1

Study 1はshort trajectoryに対してfirst-16 opening-prefix serializerをanchor eligibilityより前に要求していたため、384 primary slotsのうち9件がdeterministic serializer failureとなった。

```text
run = 35311628238
primary reads = 384 / 384
sealed source = 375
failure = 9
paired reserve = 0
```

Study 1はrepair/reopenしていない。primary namespace `40311001..40311384`はquarantine済みである。

## Study 2

Study 2ではshort trajectory serializer semanticsをprospectiveに修正したが、frozen source replayがcandidate pair取得後も最大plyまでcontinuationを生成したため、2 primary slotsがengine `relay-limit` guardへ到達した。

```text
run = 35345143248
execution head = 8c84f2cda1a62f812f030ef319341683a4d77e54
primary START = 384
sealed source = 382
deterministic failure = 2
paired reserve = 0
failed slots = 40411112 / 40411312
failure = relay-limit at ply 225 / 223
```

`relay-limit`は`public/engine.js`の`MAX_RELAY=512`による実装上の安全ガードであり、Baoの自然なterminal ruleとして科学的に利用しない。Study 2もrepair/reopenせずfail-closedで閉じた。

正本:

- [`results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json`](results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json)
- [`checkpoints/2026-09-18-study2-stage1-technical-invalid-relay-limit.md`](checkpoints/2026-09-18-study2-stage1-technical-invalid-relay-limit.md)

## Study 3

正式Study ID:

`SFCDFT-STUDY3`

中心的なtechnical remediationは**anchor-bounded source replay**である。

```text
policy/root-family assignment
-> source replay
-> assigned anchorsを逐次評価
-> pair completeなら即停止
-> pair complete後のcontinuationは生成しない
```

candidate完成前の停止は次のように分離する。

- natural terminal / max source ply → `NO-CANDIDATE-ROOT-SHORTAGE`
- engine `relay-limit` → `NO-CANDIDATE-ENGINE-GUARD-CENSORING`
- production/independent mismatch等 → `TECHNICAL-INVALID`

`relay-limit`由来winnerは科学的terminal evidenceとして使用しない。

## Study 3の科学的contract

Study 2から変更しない。

```text
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / NAMUA-GREATER
representation = RAW-only
relative depth = 5
source policies = P1 / P2
root families = RF1 / RF2
Stage 1 target = 8 pairs/domain
Stage 2 target = 18 pairs/domain
formal family = 8 hypotheses
alpha = 1/20 family-wise
inference = exact two-sided sign test + fixed-eight Holm-Bonferroni
```

## Study 3 seed boundary

```text
Stage 1 primary = 40511001..40511384 / UNREAD
Stage 1 paired reserve = 41511001..41511384 / UNREAD
Stage 2 primary = 40521001..40521768 / UNREAD
Stage 2 paired reserve = 41521001..41521768 / UNREAD
Stage 0 technical = 49031001..49031256 / NON-SCIENTIFIC
```

scientific seedはまだ1件もreadしていない。

## Stage 1前提条件

Study 2の382 sealed source artifactsから、fresh scientific seedを再読せずにdurable identity firewallをmaterializeする必要がある。

予定path:

`doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study2/`

最低限保存するidentity:

- Study 2 `sourceTrajectorySha256`
- first-16 opening-prefix SHA-256
- Namua/Mtaji RAW-root SHA-256
- Study 2 scientific seed namespace exclusion

このfirewallが完成するまでStage 1 pre-access authorizationを発行しない。

## 現在許可される作業

- Study 2 identity firewallのseed-free materialization
- Study 3 Stage 0 technical implementation
- technical fixtureの実行
- preregistration/specと実装の整合性検証
- Stage 1 pre-access reviewの準備

現在禁止される作業:

- `405...` / `415...` scientific seedへのアクセス
- Study 1/2 scientific seedの再読
- Study 1/2のrepair/reopen
- Stage 2 access
- G4-10 depth11 access
- public AIへの研究結果反映
- current branchの`main`統合

## 正本

- [`STUDY_3_PROTOCOL.md`](STUDY_3_PROTOCOL.md)
- [`prereg/STUDY_3_SPEC.json`](prereg/STUDY_3_SPEC.json)
- [`../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md`](../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md)
- [`results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json`](results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json)
