# LGTGECB-STUDY1 — 現在の状態

更新日: 2026-09-26  
Agenda: `Research Generation 4 / G4-06`  
Study ID: `LGTGECB-STUDY1`  
Research branch: `research/g4-06-geometry-exact-consequence-bridge`

## 現在地

```text
Authorization review = COMPLETE
Stage 0 = COMPLETE / STAGE0-TECHNICAL-PASS
Stage 1 = COMPLETE
Formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
G4-06 scientific study = COMPLETE ON RESEARCH BRANCH
main integration = NOT AUTHORIZED / NOT EXECUTED
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

## Stage 1 formal

Final source-freeze authorization:

```text
execution authorization SHA = 90283d1680cef8feda02e11b072e98b145d5d786
one-shot = true
rerun authorized = false
population = immutable G4-05 formal 8 domains only
```

Canonical formal run:

```text
run = 36214800357 / attempt 1
execution SHA = 90283d1680cef8feda02e11b072e98b145d5d786
workflow conclusion = success
artifact ID = 10897225431
artifact SHA-256 = 1a087b4bccfb0c941e9895d2bf35cce41fcbee5f0194de1c43f2293ea593c688
production result SHA-256 = a8acb2e81c69616c29e4ccfcab7e5e20ca0b23294af7d99b8c6085bfc4cc2863
independent verification SHA-256 = eb2eb5987e47e8712a1bf542acaff6601c4a9be1002c8484df9c3c29b22ba79c
formal domains = 8 / 8
relations = 12 / 12
all production / independent agreement = true
```

Protected boundaries:

```text
G4-05 candidate rescan = 0
G4-10 depth-11 access = 0
whole-Bao generalization = false
public AI change = false
```

## Main formal observations

- Tree/RAW inflation: all 8 roots = `1/1`; no geometry variation, so exact-consequence relations are non-estimable.
- Transposition occupancy: all 8 roots = `0/1`; no geometry variation, so exact-consequence relations are non-estimable.
- Exact value × corridor: `MIXED-ORDER`.
- Exact value × reply width: `MIXED-ORDER`.
- DTF × corridor: `MIXED-ORDER`.
- DTF × reply width: `MONOTONE-DECREASING-ORDER-CONSISTENT` within the frozen eight-domain population.
- VPMC × corridor: `MONOTONE-DECREASING-ORDER-CONSISTENT` within the frozen eight-domain population.
- VPMC × reply width: `MIXED-ORDER`.

これらは固定8 microdomain内のfinite ordering summaryであり、whole-Baoの一般則、因果関係、公開AI改善効果を意味しない。

## Canonical records

- `results/stage-1/STAGE_1_FORMAL_RECEIPT.json`
- `checkpoints/2026-09-26-stage-1-formal-complete.md`
- `FINAL_REPORT.md`

## 次に許可される作業

G4-06科学実行は完了した。次は **main統合前の最終整合性監査** である。

監査では少なくとも次を確認する。

- G4-06 README / CURRENT_STATUS / FINAL_REPORT / receipt / checkpointの相互整合
- Research Generation 4のprogram status文書でG4-06を`COMPLETE`へ更新するための差分
- G4-07 dependency gateの解放条件
- G4-10 depth-11 protected boundaryの維持
- public AI変更が混入していないこと
- main baseline以降の研究branch変更がG4-06専用範囲に限定されること

`main`への統合は、最終監査後の明示的な統合判断まで行わない。
