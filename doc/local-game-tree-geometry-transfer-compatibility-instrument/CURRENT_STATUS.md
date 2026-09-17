# LGTTCI-STUDY1 — 現在の状態

更新日: 2026-09-17

## 正式状態

```text
Program position = Research Generation 4 / G4-01
Study = LGTTCI-STUDY1
Study authorization = G4-01-AUTHORIZED
Research branch = research/g4-01-transfer-compatibility-instrument
Baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
Stage 0 = LGTTCI-S0-TECHNICAL-2026-09-17-v1 / AUTHORIZED / NOT-EXECUTED
Stage 1 = LGTTCI-S1-COMPATIBILITY-2026-09-17-v1 / NOT-AUTHORIZED-NOT-EXECUTED
fresh compatibility seeds accessed = 0
formal scientific effects generated = 0
G3-12 evidence reused = false
G3-11 depth 10 rerun = false
G4-10 depth 11 access = false
public AI change authorized = false
```

## 現在固定されていること

Study ID、題目、Stage構成、現在のsource identity、RAW identity、source policy、root family、Stage 1用fresh compatibility seed namespace、resource ceiling、decision mapping、protected evidence firewallをscientific access前に固定している。

Stage 1のseed namespaceは予約しただけであり、現在は**未アクセス**である。

## Stage 0で検証すること

Stage 0は`TECHNICAL-FIXTURE`だけを使用し、次を検証する。

1. source-policy replayのproduction/independent一致
2. RAW state identityとcanonical move identity
3. relative depth 5 RAW geometryのproduction/independent exact一致
4. root family eligibility判定
5. SILGM系helperのroot legal width precondition分類
6. width 1をhard failureにせず`NON-ESTIMABLE / ROOT-LEGAL-WIDTH-LT2`へ落とすこと
7. width 2以上でのfrozen controlled-search conditionsのproduction/independent一致
8. continuous geometry implementation境界
9. fail-closed negative control
10. protected evidence accessが0であること
11. resource ceilingを超えないこと

Stage 0でupstream claimのeffect direction、p-value、generalization/counterexample decisionを計算してはならない。

## protected evidence

```text
G3-11 depth 10 = NO RERUN
G3-12 Stage 1 consumed seeds = NO REPLAY
G3-12 Stage 2 unread seeds = DO NOT ACCESS / DO NOT REUSE
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
```

## 次の工程

`LGTTCI-S0-TECHNICAL-2026-09-17-v1`のrunnerとproduction/independent compatibility wrapperを実装し、technical-only Stage 0を実行する。

Stage 0がPASSした場合もStage 1は自動的に開始しない。Stage 0 artifact、source hash、production/independent一致、resource telemetryを確認したうえで、**post-Stage0 Stage 1 authorization review**を別途行う。
