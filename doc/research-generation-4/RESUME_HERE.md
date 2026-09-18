# Research Generation 4 — 再開位置

更新日: 2026-09-19  
状態: **`G4-02 SFCDFT-STUDY3 STAGE 0 PASS / STAGE 1 PRE-ACCESS REVIEW NEXT`**

## 再開時の読む順序

1. remote `main` HEADと`research/g4-02-sfcdft-study3-prereg` HEADを取得する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体を確認する。
3. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)でG4-02 current stateを確認する。
4. [`../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md)と[`../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_SPEC.json`](../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_SPEC.json)を読む。
5. [`../structural-forcing-corridor-tree-raw-transfer/results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json)でStage 0 PASSを確認する。
6. [`identity-firewalls/g4-02-sfcdft-study2/MANIFEST.json`](identity-firewalls/g4-02-sfcdft-study2/MANIFEST.json)でStudy 2 firewallを確認する。
7. [`../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md`](../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md)でauthorization boundaryを確認する。

## 現在地

```text
main HEAD at Study3 start = c5689d70cd017171e7738140ba9186a117f732f1
current branch = research/g4-02-sfcdft-study3-prereg
Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 3 preregistration = FROZEN
Study 2 durable firewall = MATERIALIZED / VERIFIED
Study 3 Stage 0 = STAGE0-PASS
Study 3 Stage 1 = NOT AUTHORIZED / fresh reads 0
Study 3 Stage 2 = NOT AUTHORIZED / fresh reads 0
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Stage 0確定値

```text
canonical run = 35389371946
artifact ID = 10564654680
artifact digest = sha256:0da2a47c4b4df3cc209217d2eab4c07785d520bca672725ab836b8c3b93b918a
deterministic core = d823461f553da8fc8bab27845c38bfcb7552e5acc771968e6e212a0dcd4294ff
scientific seed reads = 0
```

4 domainのcandidate fixture、anchor完成即停止、relay-limit censoring、natural terminal、max source ply、production/independent equality、Study 1/2 firewall collision rejectが全てPASSした。

## Study 2 firewall確定値

```text
materialization run = 35388490684
install run = 35388715102
identity core = 7961d01342e35f3e70f82e5688f585be08ef99827b905dcccf032d285994abfc
source records = 382
trajectory hashes = 380
opening-prefix hashes = 372
RAW-root hashes = 657
```

## Study 3 scientific namespace

未読のまま維持する。

```text
Stage 1 primary = 40511001..40511384
Stage 1 reserve = 41511001..41511384
Stage 2 primary = 40521001..40521768
Stage 2 reserve = 41521001..41521768
```

## 次に行う作業

1. Stage 1 compatibility-only specをfreezeする。
2. source acquisitionをSTART-before-readのimmutable artifact pipelineとして設計する。
3. source population完成後にStudy 1/2/historical firewallとresource preflightを適用し、各domain 8 pairをdeterministic selectionする。
4. measurementはselected sealed sourcesだけを入力にし、fresh seed readを0とする。
5. Stage 1ではendpoint magnitude、paired direction、p-value、generalization/counterexample decisionを出力しない。
6. one-shot workflowと全実行blobを固定したpre-access authorization reviewを行う。
7. review PASS後のみStage 1 fresh scientific seedへアクセスする。

## 禁止事項

- Study 1/2 scientific seedの再読・再実行・repair
- Study 2 failed slotsの再play
- Stage 3 Stage 1/2 seedのpre-authorization access
- fresh workflowのfull rerun
- deterministic source failureのreserve救済
- Stage 2自動認可
- public AI変更
- `main`統合

`main`統合はユーザーの明示指示があるまで行わない。
