# 2026-08-30 — UMSSR-STUDY1 study-start freeze

## 目的

G2-10のscientific evidence生成前に、Study identity、Stage構成、upstream evidence eligibility、RAW identity、seed reservation、development / validation firewall、verification / no-rescue ruleを固定する。

## baseline

```text
remote main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
expected = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
match = true
```

## Study identity

```text
Program = G2-10
Study ID = UMSSR-STUDY1
Stage 0 = UMSSR-S0-TECHNICAL-2026-08-30-v1
Stage 1 = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = UMSSR-S2-FORMAL-2026-08-30-v1
branch = research/g2-10-unified-multiaxial-strategic-state-representation
```

## upstream scientific firewall

G2-06〜G2-09のtechnical-invalid / non-estimable / not-authorized outputをvalidated axisとして直接使用しない。

```text
G2-06 rich representation direct use = INELIGIBLE
G2-07 reply-pressure model direct use = INELIGIBLE
G2-08 taxonomy/promotion direct use = INELIGIBLE
G2-09 generalization boundary = INELIGIBLE / no scientific evidence generated
```

G2-05はstandard initial RAW root depth 0..9の凍結domainだけ`BOUNDED-EXACT-ELIGIBLE`とする。

## RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## seed reservation

```text
29300001..29300064 = Stage 0 technical-only
29310001..29314096 = Stage 1 scientific / RESERVED-UNCONSUMED
29410001..29418192 = Stage 2 scientific / RESERVED-UNCONSUMED
```

G2-09未消費seedは再利用しない。

## authorization state

```text
Stage 0 scientific inference = NOT AUTHORIZED / technical-only
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientific evidence generated = false
```

## no-rescue

outcome後のeligibility、axis、feature、search condition、threshold、cluster / dimension choice、primary endpoint、population、seed、subgroup、verification requirementの変更を禁止する。

## documentation quality

このcheckpointを含む初期human-readable Markdownは凍結前から日本語主体で作成し、canonical identifier / token / hash / pathは変更しない。
