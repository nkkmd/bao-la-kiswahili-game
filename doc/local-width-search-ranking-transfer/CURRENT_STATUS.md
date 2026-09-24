# LWSRT-STUDY1 — Current Status

更新日: 2026-09-24  
Program: `Research Generation 4 / G4-03`

```text
Authorization review = G4-03-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
Study ID = LWSRT-STUDY1
Protocol = FROZEN
Stage 0 = COMPLETE / STAGE0-PASS / run 35947479946
Upstream identity firewall = FROZEN / PRE-FRESH / DIGEST-BOUND
Stage 1 = NOT-AUTHORIZED / RESERVED-NOT-ACCESSED
Stage 2 = NOT-AUTHORIZED / RESERVED-NOT-ACCESSED
fresh scientific seed access = 0
formal scientific decision = NONE
public AI change authorized = false
main integration authorized = false
```

Stage 0はtechnical readinessのみを確立した。G4-03のscientific effectについて結論はない。

G3-07 Stage 1/Stage 2およびG4-01 Stage 1Rから監査可能なidentity-only sourceをmaterializeし、件数・canonical digest・監査不能classを`prereg/UPSTREAM_IDENTITY_FIREWALL.json`へ固定した。G4-01 Stage 1Rのopening-prefix hashはcanonical recovery source bundleに存在しないため、当該classについて非重複確認済みとは主張しない。

次のgateはpost-Stage0 / pre-fresh Stage 1 authorization reviewである。Stage 1の`40312001..40312768`へのアクセスは、別途authorizationを記録するまで禁止する。
