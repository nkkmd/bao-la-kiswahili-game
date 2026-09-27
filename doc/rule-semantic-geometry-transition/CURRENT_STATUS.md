# G4-08 / BRSGT-STUDY1 — 現在の状態

更新日: 2026-09-27  
状態: **PREREGISTERED / STAGE 0 TECHNICAL IMPLEMENTATION PREPARED / EXECUTION NOT YET TRIGGERED**

## Formal identity

```text
Agenda = Research Generation 4 / G4-08
Study ID = BRSGT-STUDY1
Branch = research/g4-08-rule-semantic-geometry-transition
Reviewed main = 2023860419d13b6f294b0600943de8fb4e50b1bb
Authorization review = G4-08-AUTHORIZATION-REVIEW-2026-09-27-V1
```

## Current authorization

```text
preregistration = AUTHORIZED
Stage 0 technical-only = AUTHORIZED FOR PREPARATION
Stage 0 execution = NOT YET TRIGGERED
fresh scientific seed access = NOT AUTHORIZED
Stage 1 = NOT AUTHORIZED
Stage 2 = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED / NOT ACCESSED
public AI change = NOT AUTHORIZED
```

## Frozen Stage 0 identity

```text
Stage ID = BRSGT-S0-TECHNICAL-2026-09-27-v1
evidence class = TECHNICAL-FIXTURE
relative depth = 5
max geometry root measurements = 8
max event transitions materialized = 128
scientific seed reads allowed = 0
G4-10 depth-11 reads allowed = 0
```

## Event families

```text
E1 = BRSGT-E1-CAPTURE
E2 = BRSGT-E2-NYUMBA-USE-VS-STOP
E3 = BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION
E4 = BRSGT-E4-NAMUA-TO-MTAJI
```

## Selector verification

G3-06 `BRMGI-STUDY1`のfresh Stage 1はproduction / independent event-unit selection mismatchでtechnical-invalidとなった。

BRSGT Stage 0では、count一致ではなく、fixture ID、event label、pre RAW identity、move identity、post RAW identity、NYUMBA pair identity、overlap vector、canonical orderingをunit-by-unitでexact比較する。

## Protected boundaries

- G3-06 repair/reopen/rerun禁止
- G3-06 Stage 1/Stage 2 scientific namespace再利用禁止
- G4-02 no-decisionのpositive/negative evidence化禁止
- G4-07 reversalのcausal mechanism化禁止
- G4-10 depth-11 access禁止
- public AI変更禁止

## Candidate future namespaces

```text
Stage 1 candidate start = 40813001 / NOT AUTHORIZED FOR READ
Stage 2 candidate start = 40823001 / NOT AUTHORIZED FOR READ
```

## Next gate

Stage 0 implementation一式をstatic reviewし、そのsource SHAをauthorization JSONへbindする。その後trigger-only commitでtechnical Stage 0を1回実行する。

Stage 0 PASS後もStage 1 fresh scientific accessには別authorization reviewが必要。
