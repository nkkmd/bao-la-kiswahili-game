# LWSRT-STUDY1 — Current Status

更新日: 2026-09-24  
Program: `Research Generation 4 / G4-03`

```text
Authorization review = G4-03-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
Study ID = LWSRT-STUDY1
Protocol = FROZEN
Stage 0 = COMPLETE / STAGE0-PASS / run 35947479946
Upstream identity firewall = FROZEN / PRE-FRESH / DIGEST-BOUND
Stage 1 = AUTHORIZED-LOCAL-ONCE / PREEXECUTION-STATIC-PASS / NOT-YET-EXECUTED
Stage 1 pre-execution static validation = PASS / run 35971987147
Stage 2 = NOT-AUTHORIZED / RESERVED-NOT-ACCESSED
fresh scientific seed access = 0
formal scientific decision = NONE
public AI change authorized = false
main integration authorized = false
```

Stage 1 authorization decision: `LWSRT-STUDY1-STAGE1-AUTHORIZED-LOCAL-ONCE`.

Stage 1 pre-execution bindingは、runner、engine / AI、source-policy、RAW/continuous geometry、search production/independent、search robustness、spec、authorization、upstream identity firewallのblob SHAを固定している。

静的検証run `35971987147`は成功した。runner構文、固定blob SHA、`LOCAL-ONCE`認可、固定seed block `40312001..40312768` / 768、seed extension・rerun禁止、Stage 2 / public AI / main integrationの未認可、fresh-access lease/result未存在を確認した。この検証はfresh scientific seedを読み取っていない。

Stage 1は固定済み`40312001..40312768`の768 slotsをローカル環境で一度だけ使用できる。fresh seedの最初のread前にupstream identity firewallの件数・canonical digestをruntimeで再materializeして完全一致を確認しなければならない。不一致・artifact欠落はfail closedとする。

Stage 1で許可されるのはsupport、endpoint definedness、production/independent exactness、resource readiness、identity manifestのみであり、effect direction、risk difference、p-value、generalization/counterexample decisionは生成・保持しない。

Stage 2は引き続き未認可である。
