# LGTGECB-STUDY1 — 現在の状態

更新日: 2026-09-26  
Agenda: `Research Generation 4 / G4-06`  
Study ID: `LGTGECB-STUDY1`  
Research branch: `research/g4-06-geometry-exact-consequence-bridge`

## 現在地

```text
Authorization review = COMPLETE
Authorization token = G4-06-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
Stage 0 = COMPLETE / STAGE0-TECHNICAL-PASS
Stage 1 = NOT AUTHORIZED / NOT EXECUTED
Scientific bridge result = NONE YET
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

## Stage 0

Canonical technical run:

```text
run = 36211754989 / attempt 1
head SHA = 355162ae40cabcc443944133aa1168a1588fcba3
workflow conclusion = success
artifact ID = 10896360387
artifact SHA-256 = 7cfc9c10d23886e78b8c7f0bb2a8e226c35a31035c36433c2770f32510270009
mandatory gates = 12 / 12 PASS
production / independent agreement = true
```

Stage 0ではG4-05 formal 8-domainに対する新しいbridge computationを行っていない。

```text
G4-05 formal-domain bridge reads = 0
G4-10 depth-11 accesses = 0
scientific bridge inference = false
formal bridge decision = false
public AI change = false
```

初回technical run `36211639488`はterminal childを扱うvalue-preserving classifierの実装不備でfail-closedした。次のrun `36211729217`はproduction修正commitとindependent修正commitの間に自動起動したintermediate runであり、production / independent定義不一致によりfail-closedした。双方を同期したcanonical run `36211754989`で全gateがPASSした。これらはいずれもtechnical-onlyで、scientific evidence access前の実装検証である。

## G4-05から引き継ぐ固定population

Stage 1が別途認可された場合だけ、G4-05 canonical Stage 2の8 formal domainsをimmutable upstream populationとして使用できる。

```text
upstream = RLEMOF-STUDY1 / RLEMOF-S2-FORMAL-2026-09-25-v1
G4-05 canonical run = 36120286922 / attempt 1
G4-05 artifact ID = 10858056244
G4-05 artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
formal domains = 8
root values = WIN 2 / LOSS 6
```

population追加、candidate rescan、seed extension、`STATE-LIMIT` candidate rescueは禁止する。

## 次に許可される作業

次はpost-Stage0 / pre-Stage1 authorization reviewである。

そのレビューで少なくとも次をscientific output生成前に固定する必要がある。

- fixed 8-domain input manifest
- root再物質化algorithmとRAW key照合
- upstream state / transition / solution digest照合
- geometry scalar definitions
- exact consequence definitions
- finite relation summaries
- estimability gates
- production / independent implementation
- resource ceiling
- GitHub Actions execution identity
- rerun / failure / no-rescue semantics

Stage 1 formal executionは、その別authorizationが成立するまで開始しない。
