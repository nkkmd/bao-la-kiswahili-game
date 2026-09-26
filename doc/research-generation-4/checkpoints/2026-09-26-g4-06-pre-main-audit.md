# 2026-09-26 — G4-06 main統合前監査 checkpoint

## 判定

```text
Agenda = G4-06
Study = LGTGECB-STUDY1
scientific status = COMPLETE
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
pre-main audit = PASS
integration readiness = READY-FOR-MAIN-INTEGRATION-REVIEW
main integration = NOT AUTHORIZED / NOT EXECUTED
public AI change = NOT AUTHORIZED
```

本checkpointはG4-06の科学的判定を再評価するものではない。研究branchを`main`へ統合する前に、正本、現在状態文書、branch差分、protected boundaryを横断確認した記録である。

## 1. 監査対象

```text
repository = nkkmd/bao-la-kiswahili-game
main baseline = 6a005d9f84d222126dc41abfe17ad5baa4c96629
research branch = research/g4-06-geometry-exact-consequence-bridge
pre-audit-finalization branch HEAD = dc95c7ad56f0a387cc509d8f1cac9fd3a736184e
compare status = ahead
commits ahead = 37
commits behind = 0
changed files = 33
```

merge baseは`main` baselineと同一であり、監査時点でresearch branchは`main`から分岐後に独立して前進し、`main`側の未取込commitは存在しない。

## 2. Canonical scientific result

```text
Stage 0 canonical run = 36211754989 / attempt 1 / success
Stage 0 decision = STAGE0-TECHNICAL-PASS
Stage 0 mandatory gates = 12 / 12 PASS

Stage 1 canonical run = 36214800357 / attempt 1 / success
Stage 1 execution SHA = 90283d1680cef8feda02e11b072e98b145d5d786
Stage 1 artifact ID = 10897225431
Stage 1 artifact SHA-256 = 1a087b4bccfb0c941e9895d2bf35cce41fcbee5f0194de1c43f2293ea593c688
production result SHA-256 = a8acb2e81c69616c29e4ccfcab7e5e20ca0b23294af7d99b8c6085bfc4cc2863
independent verification SHA-256 = eb2eb5987e47e8712a1bf542acaff6601c4a9be1002c8484df9c3c29b22ba79c
formal domains = 8 / 8
relations = 12 / 12
all production / independent agreement = true
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
```

FINAL_REPORT、CURRENT_STATUS、Stage 1 receipt、Stage 1 completion checkpoint、program-level closure decisionの数値・formal decision・解釈境界が一致することを確認した。

## 3. Formal observation整合性

正本間で次が一致した。

- Tree/RAW inflationは全8 rootで`1`であり、variation不足により対応relationは`NON-ESTIMABLE`。
- Transposition occupancyは全8 rootで`0`であり、variation不足により対応relationは`NON-ESTIMABLE`。
- `VALUE × CORRIDOR` = `MIXED-ORDER`。
- `VALUE × REPLY` = `MIXED-ORDER`。
- `DTF × CORRIDOR` = `MIXED-ORDER`。
- `DTF × REPLY` = `MONOTONE-DECREASING-ORDER-CONSISTENT`。
- `VPMC × CORRIDOR` = `MONOTONE-DECREASING-ORDER-CONSISTENT`。
- `VPMC × REPLY` = `MIXED-ORDER`。

一方向orderingを示したrelationも、N=8の固定late-game exact microdomain内のfinite ordering summaryとしてのみ記述されている。whole-Bao law、因果関係、探索難易度一般則、AI strength、人間のdifficultyへ拡張していない。

## 4. Current-facing文書監査

次をG4-06完了状態へ同期した。

- `doc/local-game-tree-geometry-exact-consequence-bridge/README.md`
- `doc/local-game-tree-geometry-exact-consequence-bridge/CURRENT_STATUS.md`
- `doc/local-game-tree-geometry-exact-consequence-bridge/FINAL_REPORT.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`

`doc/research-generation-4/PROGRAM_PLAN.md`、historical checkpoint、preregistration、authorization等はprospective / historical recordとして保持し、事後結果に合わせて書き換えていない。

ルート`README.md`は研究の個別状態を複製せず、`doc/RESEARCH_INDEX.md`と`doc/FUTURE_RESEARCH_AGENDA.md`を入口としているため、G4-06固有の追記は不要と判定した。

## 5. Branch scope監査

`main..research/g4-06-geometry-exact-consequence-bridge`の変更は次の範囲に限定されている。

- G4-06専用GitHub Actions workflow
- G4-06 Study文書、preregistration、authorization、results、checkpoint
- G4-06専用production / independent実験コード
- RG4のcurrent-facing状態文書
- 中央研究索引 / future agenda

次の変更は存在しない。

```text
public/ changes = 0
public AI production changes = 0
gameplay feature changes = 0
G4-10 protected data/code access changes = 0
unrelated application changes = 0
```

したがって、本branchはG4-06研究とそのrepository-facing記録の範囲に限定されている。

## 6. Protected boundaries

```text
G4-05 formal decision reevaluation = false
G4-05 candidate rescan = 0
G4-05 seed extension = false
G4-05 STATE-LIMIT rescue = false
G4-06 Stage 1 rerun after outcome = false
G3-11 depth-10 rerun = false
G3-12 repair / replay = false
G4-10 depth-11 access = 0
validated transform set = []
whole-Bao generalization = false
public AI change = false
```

protected boundaryの破壊は確認されなかった。

## 7. G4-07への接続

Program PlanではG4-07をG4-02..G4-04 eligible closuresの下流に置いている。ただしG4-02は`CLOSED / NO SCIENTIFIC DECISION`であり、positive scientific evidenceとして扱わない。

G4-07は、G4-06を`main`へ統合した後の**次のauthorization-review candidate**としてのみ指定する。

```text
G4-07 execution authorization = false
fresh evidence access = false
Study ID = not yet assigned
```

G4-07を開始する場合は、専用authorization reviewで利用可能な上流evidence、fresh trajectory contract、lag family、missingness / phase-crossing rule、formal endpoint、resource ceiling、independent verification、no-rescue / no-rerun ruleを結果アクセス前に固定する。

## 8. 最終監査判定

監査時点で、G4-06の科学結果、正本、中央文書、branch scope、protected boundaryにmain統合を阻害する不整合は確認されなかった。

したがって判定は次とする。

```text
PRE-MAIN-AUDIT = PASS
READY-FOR-MAIN-INTEGRATION-REVIEW = true
MAIN-INTEGRATION = NOT EXECUTED
```

次工程は、明示的なmain統合判断である。追加のscientific runやpost-outcome rescueは行わない。
