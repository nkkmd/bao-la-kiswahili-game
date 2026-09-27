# G4-08 / BRSGT-STUDY1 — 現在の状態

更新日: 2026-09-27  
状態: **PREREGISTERED / STAGE 0 v2 PASS / STAGE 1 PRE-FRESH STATIC AUDIT PASS / STAGE 1 SCIENTIFIC EXECUTION NOT AUTHORIZED**

## Formal identity

```text
Agenda = Research Generation 4 / G4-08
Study ID = BRSGT-STUDY1
Branch = research/g4-08-rule-semantic-geometry-transition
Reviewed main = 2023860419d13b6f294b0600943de8fb4e50b1bb
Authorization review = G4-08-AUTHORIZATION-REVIEW-2026-09-27-V1
```

## Current authorization boundary

```text
preregistration = AUTHORIZED
Stage 0 v1 = TECHNICAL-INVALID / ONE-SHOT / NO-RERUN
Stage 0 v2 = STAGE0-PASS / TECHNICAL-ONLY COMPLETE
Stage 1 preparation + pre-fresh static audit = COMPLETE
Stage 1 scientific execution = NOT AUTHORIZED
Stage 1 scientific authorization file = ABSENT
Stage 1 scientific trigger file = ABSENT
Stage 2 = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED / NOT ACCESSED
public AI change = NOT AUTHORIZED
main integration = NOT AUTHORIZED
```

## Stage 0 v1 record

```text
Stage ID = BRSGT-S0-TECHNICAL-2026-09-27-v1
workflow run = 36295138475 / attempt 1
job = 108552488514
binding = PASS
runtime = TECHNICAL-INVALID
technical error = represented seed total 34
fresh scientific seed reads = 0
G4-10 depth-11 access = 0
scientific outcome = NONE
```

v1はhand-constructed NYUMBA fixtureがauthoritative 64-seed RAW invariantを満たさなかったため、geometry measurement前にfail closedした。同versionをrerunしない。

詳細: [`checkpoints/2026-09-27-stage-0-v1-technical-invalid.md`](checkpoints/2026-09-27-stage-0-v1-technical-invalid.md)

## Stage 0 v2 canonical result

```text
Stage ID = BRSGT-S0-TECHNICAL-2026-09-27-v2
workflow run = 36295553800 / attempt 1
job = 108553613736
source SHA = dbd15518791515a08570f9e7065c1b02cb7ec254
audited source SHA = e0c7a359af5d37875cb914eae19a142d4c86f427
artifact ID = 10923364588
artifact ZIP SHA-256 = fb19763c2f2bcd29ddf2d84a776ad28cf787e8727ee1857e9a0e44f680535177
technical result SHA-256 = 3474e55298a41f76f54184027352c5d1bcbb06cbabad5241020a926d077cb1aa
stage disposition = STAGE0-PASS
fixture count = 4
all represented seed totals = 64
geometry measurements = 7
fresh scientific seed reads = 0
Stage 1 candidate namespace reads = 0
Stage 2 candidate namespace reads = 0
G4-10 depth-11 access = 0
public AI changed = false
scientific interpretation = NONE / TECHNICAL READINESS ONLY
```

Coverage:

```text
E1 CAPTURE = covered
E2 NYUMBA USE-vs-STOP = covered
E3 RESERVE-DECREMENT-NONTRANSITION = covered
E4 NAMUA-TO-MTAJI = covered
compound label vector = covered
production / independent unit selection exact = true
production / independent geometry endpoint exact = true
exact arithmetic agreement = true
```

正本: [`results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json`](results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json)

## Stage 1 frozen development contract

Stage ID:

`BRSGT-S1-DEVELOPMENT-2026-09-27-v1`

Stage 1はformal decisionを生成しないdevelopment/support-only stageとして固定済み。

```text
evidence class = FRESH-DEVELOPMENT
seed block = 40813001..40813512 / 512 slots
P1 = BRSGT-P1-UNIFORM-LEGAL-SEEDED
P2 = BRSGT-P2-MIN-IMMEDIATE-CAPTURE-SEEDED
event families = E1..E4
metrics = M1..M6
candidate universe = 24
relative depth = 5
representation = RAW-ONLY
formal inference = false
effect values retained = false
effect signs retained = false
Stage 2 seed access = false
G4-10 depth-11 access = false
public AI change = false
```

Fresh Stage 1 evidenceはまだ読んでいない。

## Hardened Stage 1 pre-fresh static audit

旧static auditのPASS後にStage 1 workflow / binding verifier / relay-limit処理へ変更が入ったため、その旧PASSをcurrent HEADへ流用しなかった。audit scopeを拡張してcurrent implementationを再監査した。

```text
workflow run = 36298236747 / attempt 1 / success
audit head = bc39087699d20761dfa58ce904e6b9534d2fbcd2
artifact ID = 10924423363
artifact ZIP SHA-256 = 37aa71b03d2be9c90006b4c1a4466e2afa0d6c0150def550f2599ba7032eba09
disposition = STAGE1-PRE-FRESH-STATIC-AUDIT-PASS
audit scope version = 2
scientific authorization present at audit = false
scientific trigger present at audit = false
fresh scientific seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Audit scope v2は少なくとも次を検証した。

1. Stage 1 scientific authorization / scientific triggerが存在しない。
2. development workflowが`STAGE_1_TRIGGER.json`専用triggerである。
3. binding verifierがone-shot authorization、run attempt 1、branch/source bindingを要求する。
4. audited source以後に許す変更をauthorization + triggerの2 pathだけへ限定する。
5. runner内の順序がauthorization guards → firewall materialization → first fresh seed readである。
6. production / independent replay success/error agreementを要求する。
7. relay-limit source/candidateをfail closedする。
8. Stage 2 / G3-06 scientific namespaceをrunnerが直接参照しない。
9. formal inference / effect value / effect sign retentionを禁止する。

Firewall materialization summary:

```text
seed identities = 8448
trajectory identities = 1041
opening-prefix identities = 657
RAW-root identities = 9355
firewall digest SHA-256 = 7f734c5086cc483531882993dbeac43cdd918b325a609ab619a0f9c0d1f2f946
```

## Event families

```text
E1 = BRSGT-E1-CAPTURE
E2 = BRSGT-E2-NYUMBA-USE-VS-STOP
E3 = BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION
E4 = BRSGT-E4-NAMUA-TO-MTAJI
```

## Selector / replay verification boundary

G3-06 `BRMGI-STUDY1`のfresh Stage 1はproduction / independent event-unit selection mismatchでtechnical-invalidとなった。

BRSGTではcount一致だけを用いず、source replay、event unit identity、RAW root identity、move identity、post identity、NYUMBA pair identity、event label vector、preflight、geometry endpointをproduction / independentでexact比較する。source replayがrelay-limit等で失敗する場合も両実装の成功/失敗とerror identityの一致を要求し、candidateへ昇格させない。

## Protected boundaries

- G3-06 repair / reopen / rerun禁止
- G3-06 Stage 1 / Stage 2 scientific namespace再利用禁止
- Stage 0 v1 rerun禁止
- G4-02 no-decisionのpositive / negative evidence化禁止
- G4-07 reversalのcausal mechanism化禁止
- Stage 1 authorization前のseed `40813001..40813512` read禁止
- Stage 2 seed access禁止
- G4-10 depth-11 access禁止
- public AI変更禁止
- main integration禁止

## Candidate future namespaces

```text
Stage 1 = 40813001..40813512 / RESERVED / NOT YET ACCESSED / SCIENTIFIC EXECUTION NOT AUTHORIZED
Stage 2 candidate start = 40823001 / NOT AUTHORIZED FOR READ
```

## Next gate

このstatus同期自体はstatic audit後のdocumentation-only changeである。したがって、Stage 1 scientific authorizationを検討する前に、**documentation同期を含むcurrent HEADでもう一度pre-fresh final-freeze static auditをPASSさせる**。

そのfinal-freeze audit後は、Stage 1を開始する場合でも別authorization reviewを行い、`STAGE_1_AUTHORIZATION.json`と`STAGE_1_TRIGGER.json`以外の変更を入れない。final-freeze PASSだけではfresh scientific executionを自動認可しない。
