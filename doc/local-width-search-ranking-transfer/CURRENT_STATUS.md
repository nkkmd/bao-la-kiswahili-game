# LWSRT-STUDY1 — Current Status

更新日: 2026-09-24  
Program: `Research Generation 4 / G4-03`

```text
Study ID = LWSRT-STUDY1
Protocol = FROZEN
Stage 0 = COMPLETE / STAGE0-PASS
Stage 1 = COMPLETE / STAGE1-PASS
Stage 1 canonical Actions run = 35987703180 / attempt 1 / success
Stage 1 fresh seed reads = 768 / 768 / exactly one scientific execution
Stage 1 selected roots = 128 / 128
Stage 1 formal inference = PROHIBITED / NOT PERFORMED
Stage 2 pre-access review = PASS
Stage 2 seed-free preflight = PASS / run 35991470739
Stage 2 frozen binding validation = PASS / run 35991767724
Stage 2 final authorization = LWSRT-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE
Stage 2 canonical Actions run = 35993172710 / attempt 1 / success
Stage 2 fresh seed reads = 1536 / 1536 / exactly one scientific execution
Stage 2 selected roots = 192 / 192
Stage 2 disposition = STAGE2-COMPLETE-WITH-NON-ESTIMABLE
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
Study closure = COMPLETE
public AI change authorized = false
main integration = COMPLETE / PR #164 / merge commit 73ac1920177c2451669e5ceeccaed53e34459df9
```

## Stage 1

Stage 1はsupport、endpoint definedness、production/independent exactness、resource readiness、identity manifestだけを確認するdevelopment stageとしてGitHub Actionsで一回だけ実行した。

```text
run = 35987703180
seed block = 40312001..40312768 / 768
selected roots = 128
16 policy × root-family × phase × width cells = 8 / 8 each
SC1 / SC2 / SC3 endpoint definedness = 128 / 128 each
production / independent exact = true
formal inference = false
artifact ID = 10803311137
artifact SHA-256 = aaea8b1c564dbe400d2d1fc00ebfa58f23cd485d9ae994af88cd4ceaf6b621a6
```

Stage 1 observationsはStage 2のscientific outcomeとして再利用せず、source seed / full trajectory / opening prefix / RAW root identityだけをfreshness firewallに使用した。

## Stage 2 execution

Stage 2はfresh access前にfinal one-shot authorizationを固定し、trigger fileの単独commitで起動した。24個のpre-execution bound blob、canonical Stage 1 artifact、G3-07/G4-01 upstream identity artifacts、Stage 1 identity firewall、seed-free inference fixturesを最初のfresh read前に再検証した。

その後、durable repository execution leaseを取得してから固定seed blockを一度だけ読み取った。

```text
final authorization = LWSRT-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE
run = 35993172710
attempt = 1
trigger commit = f52fcd5a16028bac8e97a5b714b87c72853628e4
durable lease commit = 3ca186b448460e42f9057fbef9a741982550bbaa
seed block = 40322001..40323536 / 1536
scientific executions = 1 / 1
selected roots = 192 / 192
production / independent exact = true
stage disposition = STAGE2-COMPLETE-WITH-NON-ESTIMABLE
artifact ID = 10805571797
artifact SHA-256 = c4449f9a034f30a501f60c6ee90b07426bd1c42aa3b0bbc150fd8d3e1199b597
STAGE_2_RESULT.json SHA-256 = 88dd8c2e586f36692d5d0cb1d66847affe0151a803f9230eb7d8425f93469bf3
identity manifest SHA-256 = 9989a42656cac788e6d6207516103ba5f79678d4ba1d501fb2c676ef83ae1312
```

rerun、seed extension、root replacement、threshold relearningは行っていない。G3-11 depth-10、G4-10 depth-11 protected evidenceへのアクセスもない。

## Formal result

固定12 testの最終内訳:

```text
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

### SC1 — DEPTH

P1/P2 × RF1/RF2の4/4 domainで`GENERALIZATION-CONFIRMED`。

### SC2 — NODE-BUDGET

P1×RF1とP1×RF2は`GENERALIZATION-CONFIRMED`。P2×RF1とP2×RF2はMtaji phaseのminimum-changed support不足により`NON-ESTIMABLE`。

### SC3 — QUIESCENCE

P1×RF1、P1×RF2、P2×RF1は`GENERALIZATION-CONFIRMED`。P2×RF2は観測方向は`HIGHER-IN-HIGH`だったがfixed-12 Holm補正後に有意でなく、`NOT-GENERALIZED`。

反対方向の有意な`COUNTEREXAMPLE-CONFIRMED`は0件だった。

詳細な12 test値は[`results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)に固定した。

## Scientific interpretation

G3-07由来の「root legal width HIGHでranking-preorder changeが多い」という非因果的associationは、本Studyのfresh transfer domainsで広く再現したが、普遍的ではない。

- estimable 10 test中9 testはformalに同方向の一般化を確認
- 1 testは同方向だったがHolm補正後にformal confirmationへ届かなかった
- 2 testはphase support不足でformal test自体が成立しなかった
- 反対方向のformal counterexampleは確認されなかった

この結果はbest move correctness、game-theoretic value、AI棋力、人間の難しさ、因果mechanismを示さない。またpublic AI変更の根拠として自動採用しない。

## Closure

G4-03 / `LWSRT-STUDY1`は**`COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE`**として閉じる。

このStudyをrepair、rerun、seed-extensionしない。追加検証が必要なら新しいprospective Studyとして別authorizationから開始する。

`main`統合はユーザーの明示指示に基づきPR #164で完了した。merge commitは`73ac1920177c2451669e5ceeccaed53e34459df9`。

## 正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`authorizations/STAGE_2_FINAL_AUTHORIZATION.json`](authorizations/STAGE_2_FINAL_AUTHORIZATION.json)
- [`executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json`](executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json)
- [`results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../research-program-decisions/2026-09-24-g4-03-local-width-search-ranking-transfer-study1-closure.md`](../research-program-decisions/2026-09-24-g4-03-local-width-search-ranking-transfer-study1-closure.md)
