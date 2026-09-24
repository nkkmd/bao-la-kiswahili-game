# LWSRT-STUDY1 — Current Status

更新日: 2026-09-24  
Program: `Research Generation 4 / G4-03`

```text
Authorization review = G4-03-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
Study ID = LWSRT-STUDY1
Protocol = FROZEN
Stage 0 = COMPLETE / STAGE0-PASS / run 35947479946
Upstream identity firewall = FROZEN / PRE-FRESH / DIGEST-BOUND
Stage 1 = AUTHORIZED-GITHUB-ACTIONS-ONCE / PREEXECUTION-STATIC-PASS / ARMED-BY-TRIGGER-FILE / NOT-YET-EXECUTED
Stage 1 pre-execution static validation = PASS / run 35987274368 / head cb4dbb3bbe2084ea68f18804b66555ff3564904f
Stage 1 execution trigger = ABSENT / NOT-YET-ARMED
Stage 1 durable execution lease = ABSENT / NOT-YET-CONSUMED
Stage 2 = NOT-AUTHORIZED / RESERVED-NOT-ACCESSED
fresh scientific seed access = 0
formal scientific decision = NONE
public AI change authorized = false
main integration authorized = false
```

当初のStage 1 authorization decision `LWSRT-STUDY1-STAGE1-AUTHORIZED-LOCAL-ONCE` は履歴正本として保持する。fresh scientific seed accessが0の状態で、`STAGE_1_EXECUTION_ENVIRONMENT_AMENDMENT.json` により有効な実行認可を `LWSRT-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE` へ変更した。変更対象はexecution environmentのみであり、scientific design、runner logic、固定seed blockは変更していない。

Stage 1 pre-execution bindingは、runner、engine / AI、source-policy、RAW/continuous geometry、search production/independent、search robustness、spec、当初authorization、execution-environment amendment、authorized Actions workflow、upstream identity firewallのblob SHAを固定している。

最終pre-execution静的検証run `35987274368`は成功した。runner構文、固定blob SHA、有効な`GITHUB-ACTIONS-ONCE`認可、専用trigger契約、trigger不在、local fresh generation禁止、固定seed block `40312001..40312768` / 768、durable lease契約、seed extension・二回目実行・fresh access後rerun禁止、Stage 2 / public AI / main integrationの未認可を確認した。この検証はfresh scientific seedを読み取っていない。

Stage 1本実行workflow `.github/workflows/lwsrt-stage1-actions-once.yml` は、研究ブランチ上に `doc/local-width-search-ranking-transfer/authorizations/STAGE_1_ACTIONS_EXECUTION_TRIGGER.json` が単独コミットとして追加されたpushだけを本実行開始操作として受け付ける。triggerはfixed study/stage/seed block、`EXECUTE-AUTHORIZED-STAGE1-ONCE`、no-rerun / no-seed-extension acknowledgementを検証し、trigger以外の同時変更があればfresh seed access前にfail closedとする。現在triggerファイルは存在しないため、本実行は開始していない。

trigger検証後、固定blob SHAを再確認し、artifact ID `9879091983`（G3-07 Stage 2）と `10517090411`（G4-01 Stage 1R source bundle）のraw ZIPを取得して固定SHA-256を検証する。その後、upstream identity firewallをfresh Stage 1 seed accessなしで再materializeし、完全一致を確認する。

これらのpre-fresh checksを通過した場合のみ、最初のfresh seed read直前に `doc/local-width-search-ranking-transfer/executions/STAGE_1_ACTIONS_EXECUTION_LEASE.json` をGitHub Contents API経由で作成する。既にleaseが存在する場合はfresh seed access前にfail closedとなる。これにより、誤った二回目のtrigger、workflow rerun、その他の再実行からscientific executionを保護する。

Stage 1で許可されるのはsupport、endpoint definedness、production/independent exactness、resource readiness、identity manifestのみであり、effect direction、risk difference、p-value、generalization/counterexample decisionは生成・保持しない。

`main`には今回の本実行workflowを追加しておらず、研究ブランチの隔離を維持している。Stage 2は引き続き未認可である。
