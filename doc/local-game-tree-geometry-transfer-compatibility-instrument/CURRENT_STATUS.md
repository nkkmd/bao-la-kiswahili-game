# LGTTCI-STUDY1 — 現在の状態

更新日: 2026-09-17

## 正式状態

```text
Program position = Research Generation 4 / G4-01
Study = LGTTCI-STUDY1
Study authorization = G4-01-AUTHORIZED
Research branch = research/g4-01-transfer-compatibility-instrument
Baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
Stage 0 = LGTTCI-S0-TECHNICAL-2026-09-17-v1 / STAGE0-PASS
Stage 1 = LGTTCI-S1-COMPATIBILITY-2026-09-17-v1 / EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
Stage 1R = LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1 / STAGE1R-PRE-EXECUTION-READY / NOT-AUTHORIZED-NOT-EXECUTED
old 401... compatibility namespace = QUARANTINED / NO REUSE
fresh 402... primary seed access = 0
paired 412... reserve seed access = 0
formal scientific effects generated = 0
G3-12 evidence reused = false
G3-11 depth 10 rerun = false
G4-10 depth 11 access = false
public AI change authorized = false
main integration authorized = false
```

## Stage 0

`LGTTCI-S0-TECHNICAL-2026-09-17-v1`は正式に`STAGE0-PASS`となった。G3-12で見逃されたroot legal width 1のhelper precondition gapを、scientific populationへ進む前に検出・遮断できることをnegative control込みで確認済みである。

## 旧Stage 1の扱い

旧Stage 1はfresh seedへのアクセス開始後にローカル長時間processの実行環境が失われ、監査可能な最終result artifactを残せなかった。そのため`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`として閉じた。

旧`401...` seed blockは正確な最終read境界を証明できないため全体をquarantineし、再試験でも後続研究でも再利用しない。途中観測やpartial telemetryも科学的結果へ使用しない。

## Stage 1R再試験

再試験は新しいStage ID `LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`として固定した。科学的contractのsource policy、root family、RAW identity、search condition、support gateは旧Stage 1から変更していない。

新しいfresh evidenceは次で固定している。

```text
Primary:
  SFCDF = 40211001..40211384
  SILGM = 40212001..40212768
  GCLD  = 40213001..40213384

Paired reserve:
  reserveSeed = primarySeed + 1000000
  SFCDF = 41211001..41211384
  SILGM = 41212001..41212768
  GCLD  = 41213001..41213384
```

reserveは結果やsupport不足による救済には使えない。primaryがdurable `SOURCE-START`後、`SOURCE-COMMIT`前にインフラ中断した場合だけ、対応するreserveを1回使用できる。明示的source process failureではreserve禁止、reserve-of-reserveも禁止する。

## 耐障害execution contract

Stage 1Rではsource acquisitionと重いmeasurementを分離する。

1. primary slotごとにdurable journalをfsyncする。
2. production/independent replay一致後、slot単位のsealed source artifactをatomic commitする。
3. `SOURCE-COMMIT`済みslotはresume時に再読しない。
4. fresh acquisition完了後、depth-5 preflight、search、continuous geometryをsealed source artifactだけから測定する。
5. measurement taskはfresh seedを再読しないため、インフラ中断時に同じartifact setで再実行できる。
6. 最終aggregationもfresh seedを読まない。

全block通算のfresh read上限は1584、infrastructure replacement上限は48で固定済みである。

## pre-execution検証

GitHub Actionsのtechnical-only workflow `LGTTCI Stage 1R pre-execution validation`はrun `35220959149` / job `105200705604`でsuccessした。

pre-execution bindingも作成済みで、Stage 1R spec、runner、wrapper、source identity、technical CI provenanceをexact blob SHAで固定している。

## 現在の停止位置

Stage 1Rは**試験開始直前**で停止している。

`STAGE_1R_EXECUTION_AUTHORIZATION.json`はまだ存在しない。したがってrunnerは非technical modeでfresh seedを読むことができない。

次に進むのは、ユーザーが再試験開始を明示した場合だけである。その際はpre-execution bindingを再確認し、final execution authorizationを作成してからfresh acquisitionを開始する。
