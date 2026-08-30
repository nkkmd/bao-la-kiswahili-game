# PSRRE-STUDY1 — authorization ledger

## 現在のauthorization state

Study-start時点では、scientific executionを一切authorizeしていない。

```text
PSRRE-S0-TECHNICAL-2026-08-30-v1 technical execution authorized = false
PSRRE-S0-TECHNICAL-2026-08-30-v1 scientific inference authorized = false
PSRRE-S1-DEVELOPMENT-2026-08-30-v1 scientific execution authorized = false
PSRRE-S2-FORMAL-2026-08-30-v1 scientific execution authorized = false
G2-11 scientific execution authorized = false
```

## Stage 0 technical authorizationの必要条件

Stage 0 technical executionをauthorizeする前に、少なくとも次をsource/hash bindingする。

1. Study-start prospective contract
2. Stage 0 production implementation
3. Stage 0 independent implementation
4. technical fixture / technical-only seed policy
5. scientific seed参照禁止のstatic audit
6. artifact schema / canonical serialization
7. resource ceiling
8. mandatory gate / decision mapping

technical authorizationはscientific authorizationではない。

## Stage 1 scientific authorizationの必要条件

Stage 0が`STAGE0-TECHNICAL-PASS`でもStage 1を自動authorizeしない。Stage 1 scientific seed消費前に、別prefreezeで次を固定する。

- exact observable dictionary
- scaling / missing / undefined semantics
- technically eligible representation family set
- familyごとのhyperparameter candidate set
- dimension / partition complexity selection rule
- development model-selection hierarchy
- minimum support / coverage
- stability metric / threshold
- phase / source-policy coverage gate
- trajectory / opening-prefix / selected RAW-state firewall
- independent verification equality rule
- resource ceilings
- Stage 1 disposition mapping
- Stage 2 promotion rule

そのcommit/hashをauthorization artifactへbindingしてから初めてStage 1 executionを検討する。

## Stage 2 scientific authorizationの必要条件

Stage 1がprospectively fixed promotion gateをすべてPASSし、frozen representation artifactを生成した場合だけStage 2 authorizationを検討する。

Stage 2ではStage 1 representationをrefit / recluster / threshold-adjustしない。

## G2-11 authorization

本Studyが`ELIGIBLE-WITHIN-FROZEN-REPRESENTATION-DOMAIN`で閉じても、G2-11は自動authorizeされない。G2-11は別Studyとしてcurrent repository audit、fresh prospective contract、独自authorizationを必要とする。
