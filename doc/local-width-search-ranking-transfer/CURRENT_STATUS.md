# LWSRT-STUDY1 — Current Status

更新日: 2026-09-24  
Program: `Research Generation 4 / G4-03`

```text
Study ID = LWSRT-STUDY1
Protocol = FROZEN
Stage 0 = COMPLETE / STAGE0-PASS
Stage 1 = COMPLETE / STAGE1-PASS
Stage 1 canonical Actions run = 35987703180 / attempt 1 / success
Stage 1 scientific executions = 1 / 1
Stage 1 fresh seed reads = 768 / 768
Stage 1 selected roots = 128 / target 128
Stage 1 SC1/SC2/SC3 endpoint definedness = 128/128 each
Stage 1 production/independent exact = true
Stage 2 pre-access review = PASS / PREPARATION-AUTHORIZED / FRESH-EXECUTION-NOT-YET-AUTHORIZED
Stage 2 seed-free preflight = PASS / run 35991470739
Stage 2 frozen binding validation = PASS / run 35991767724
Stage 2 fresh seed reads = 0
Stage 2 scientific execution started = false
Stage 2 final one-shot authorization = ABSENT
Stage 2 execution environment = UNSET-PENDING-FINAL-AUTHORIZATION
formal Stage 2 scientific decision = NONE
public AI change authorized = false
main integration authorized = false
```

## Stage 1 closure

Stage 1はGitHub Actions run `35987703180`で一回だけ正式実行し、`STAGE1-PASS`となった。固定seed block `40312001..40312768` / 768を一度だけ消費し、16個の`policy × root-family × phase × width` cellすべてで`8 HIGH + 8 LOW`を確保した。RAW-root dedup後のselected rootsは128、SC1 / SC2 / SC3はいずれも128/128 defined、production/independent exactは`true`だった。

Stage 1ではprotocolどおり、HIGH-vs-LOW risk difference、effect direction、p-value、Holm判定、generalization/counterexample decisionを計算・保持していない。canonical artifactはID `10803311137`、artifact SHA-256 `aaea8b1c564dbe400d2d1fc00ebfa58f23cd485d9ae994af88cd4ceaf6b621a6`、`STAGE_1_RESULT.json` SHA-256 `58d5489ce918bc57b599ca168fdcefbd4e741892ad123d96d27439fb06085ac8`として固定した。

Stage 1内部の`FRESH_ACCESS_LEASE.json`は履歴正本である当初の`LOCAL-ONCE` tokenを保持するが、有効な実行認可はfresh access前に`GITHUB-ACTIONS-ONCE`へprospective amendment済みであり、Actions workflowとdurable repository leaseで検証されている。このmetadata token splitはStage 1 closureで明記済みで、科学設計・seed・runner・結果には影響しない。

## Stage 2 preparation

Stage 2 pre-access authorization reviewの正式判定は、

**`LWSRT-STUDY1-STAGE2-PREACCESS-PASS / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

である。許可されているのはStage 2 implementation、Stage 1 identity-only firewall、exact inference、pre-execution binding、seed-free preflightまでである。

Stage 1 canonical artifactから128件のsource seed / full trajectory / opening prefix / selected RAW-root identityをidentity-only用途で再materializeし、固定digestと照合した。Stage 1のsearch endpointやobserved effectはStage 2 inputとして再利用しない。

Stage 2では以下を実装・固定済みである。

```text
stage = LWSRT-S2-FORMAL-2026-09-24-v1
seed block = 40322001..40323536 / 1536
assignment namespace = LWSRT-S2-ASSIGN-2026-09-24-v1
selection namespace = LWSRT-S2-SELECT-2026-09-24-v1
target = 12 HIGH + 12 LOW per policy × root-family × phase / total 192 roots
formal tests = 3 contrasts × 4 domains = 12
phase test = exact hypergeometric PMF
phase combination = Namua/Mtaji convolution
two-sided p = min(1, 2 * min(lower tail, upper tail))
multiplicity = fixed 12-test Holm-Bonferroni
family alpha = 1/20
```

`NON-ESTIMABLE` slotはpreregistered fixed-12 familyから削除せず、multiplicity bookkeeping上のみ保守的`p=1`として保持する。non-estimable slot自体のscientific p-valueは報告しない。technical mismatchは`STAGE2-TECHNICAL-INVALID`へfail closedし、post-access rescue/rerunは認可しない。

## Seed-free validation

Stage 2 pre-execution static validation run `35991470739`は`success`。fresh execution未認可、runner/inference/preflight構文、canonical Stage 1 artifact digest、128件のidentity firewall、exact inference fixtures、fixed-12 Holm fixtureを検証した。

preflight artifact:

```text
artifact ID = 10804501661
artifact SHA-256 = 169e454762927829dbe60979720010ed3f25a9cbf34728c2c41ce3948b6bf1a5
STAGE_2_PREFLIGHT_RESULT.json SHA-256 = 4c50d1b5aad96f66cf99a80666399a5bc301e0df6978b56b41086b190b0088d2
fresh scientific seed access = false
```

`authorizations/STAGE_2_PREEXECUTION_BINDING.json`はcode freeze head `2a6f66760ce95f0ca36e021fef59c4ac8ebf751c`をanchorとし、24個の科学実行関連blobを固定している。独立binding validation run `35991767724`も`success`で、全bound blob SHA一致、final authorization不在、Stage 2 durable execution lease不在、fresh scientific seed access 0を確認した。

## Current boundary

Stage 2 formal runnerは`authorizations/STAGE_2_FINAL_AUTHORIZATION.json`が存在し、かつ一回限りの有効なauthorization tokenを満たさない限り実行できない。現在そのfileは存在せず、execution environmentもまだ固定していない。

したがって現在位置は、

**`Stage 2 preparation PASS → final one-shot Stage 2 authorization review直前`**

である。

次に許されるのは、fresh seed access前にexecution environmentとdurable one-shot contractを固定する別個のfinal authorization reviewである。そのreviewがPASSするまで`40322001..40323536`を生成・readしてはならない。

G3-11 depth-10、G4-10 depth-11、public AI変更、`main`統合は引き続き認可されていない。
