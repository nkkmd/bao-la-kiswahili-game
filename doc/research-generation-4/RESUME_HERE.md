# Research Generation 4 — 再開位置

更新日: 2026-09-19  
状態: **`G4-02 SFCDFT-STUDY3 STAGE 1 FORMAL-PREPARATION-ELIGIBLE / STAGE 2 PRE-ACCESS REVIEW NEXT`**

## 再開時の読む順序

1. remote `main` HEADと`research/g4-02-sfcdft-study3-prereg` HEADを取得する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体を確認する。
3. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)でG4-02 current stateを確認する。
4. [`../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md)と[`../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_SPEC.json`](../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_SPEC.json)を読む。
5. [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study3/STUDY_3_STAGE_1_COMPATIBILITY_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study3/STUDY_3_STAGE_1_COMPATIBILITY_RESULT.json)を確認する。
6. [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-19-study3-stage1-formal-preparation-eligible.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-19-study3-stage1-formal-preparation-eligible.md)でrun provenanceと保護境界を確認する。
7. Stage 2 pre-access reviewを行い、final authorization成立前はStage 2 seedへ触れない。

## 現在地

```text
main HEAD at Study3 start = c5689d70cd017171e7738140ba9186a117f732f1
current branch = research/g4-02-sfcdft-study3-prereg
Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 3 preregistration = FROZEN
Study 2 durable firewall = MATERIALIZED / VERIFIED
Study 3 Stage 0 = STAGE0-PASS
Study 3 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
Study 3 Stage 2 = NOT AUTHORIZED / fresh reads 0
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Stage 1確定値

```text
canonical run = 35396341311
run attempt = 1
workflow conclusion = SUCCESS
execution head = b2a70b198c343bf05b9c81ac15fa546858955cdf
primary START = 384 / 384
sealed sources = 384 / 384
retry = 0
reserve = 0
deterministic failures = 0
root shortage = 99
engine-guard censoring = 0
selected pairs = 32 / 32
measurement tasks = 8 / 8 SUCCESS
final decision = FORMAL-PREPARATION-ELIGIBLE
final artifact ID = 10567663854
artifact digest = sha256:a36e4cbad1fb885065badd9b1ad519f065e221cb9af4ea4669e56ea13192b2ba
deterministic core = 498decdc808558d2e019d1ddf7aeec6c66d2a8074c6478e117a24bc9301e4dab
```

4 domain全てが8/8 measured、C1 8/8 defined、C6 8/8 defined、resource pass 8/8。Stage 1では科学的effect/direction/p-value/generalization/counterexample decisionを生成していない。

freshness firewallによりseed `40511296` のStudy 2 opening-prefix collisionを正常に除外した。

## Study 3 scientific namespace

```text
Stage 1 primary = 40511001..40511384 / CONSUMED-ONCE / QUARANTINED
Stage 1 reserve = 41511001..41511384 / UNREAD / CLOSED-FOR-STAGE1
Stage 2 primary = 40521001..40521768 / UNREAD
Stage 2 reserve = 41521001..41521768 / UNREAD
```

## 次に行う作業

1. Stage 2 formal held-out specのfrozen contractを監査する。
2. Stage 1で生成されたfresh identitiesをStage 2 freshness firewallへ含める方法をseed-freeで固定する。
3. Stage 2 one-shot source acquisition、seed-free measurement、exact two-sided sign test、fixed-eight Holm-Bonferroni pipelineを準備する。
4. resource ceilingとno-rescue/no-rerun境界を固定する。
5. executable dependency closureをblob SHAでbindingする。
6. seed-free preflightを実行する。
7. pre-access authorization reviewがPASSした場合だけStage 2 fresh scientific seed accessをfinal authorizeする。

## 禁止事項

- Study 1/2 scientific seedの再読・再実行・repair
- Study 3 Stage 1のrerun
- Study 3 Stage 1 seedの再利用
- Stage 2 seedのpre-authorization access
- deterministic scientific failureのreserve救済
- Stage 2 full population rerun
- G4-10 depth11 access
- public AI変更
- `main`統合

`main`統合はユーザーの明示指示があるまで行わない。
