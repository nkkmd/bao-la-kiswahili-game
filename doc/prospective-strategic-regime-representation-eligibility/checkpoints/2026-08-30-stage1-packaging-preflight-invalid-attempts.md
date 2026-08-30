# PSRRE-STUDY1 — Stage 1 packaging preflight technical-invalid attempts

Date: 2026-08-30

## 目的

Stage 1 scientific seed消費前に行ったtechnical-only packaging preflightのinvalid attemptsを保持する。これらはscientific evidenceではなく、scientific contract、feature dictionary、representation family、K、threshold、population、Stage 2 endpointを変更する根拠にしない。

## Attempt 1

```text
workflow run = 33307852222
workflow job = 99247471426
head = b3727732cb06e2875ab7b64aa703796d478048ea
artifact id = 9731047511
artifact zip sha256 = 64b408c58cb171427b7a4a0ac695d26084322ee79dac273584c7cf44b564123b
disposition = STAGE1-PACKAGING-PREFLIGHT-FAIL
scientific seeds used = []
scientific outcome generated = false
G2-11 outcome inspected = false
```

production / independentはsource generation、root selection、28-feature calculation、median/MAD scaling、128-row synthetic full candidate-model stressでexact一致した。runtime、RSS、total compressed artifact projectionもPASSした。

failureは次の2 gateだけだった。

```text
projectedProductionShard = false
projectedIndependentShard = false
```

preflight runnerは、64 technical games / 8 technical rootsのsource payloadと128-row synthetic model-stress payloadを単一gzipへ混在させ、その**全体**へ`projectedRootScaleFactor * artifactProjectionSafetyMultiplier = 64 * 2 = 128`を掛けていた。このため、すでに128-row規模を持つmodel-stress componentまで128倍され、per-shard sizeを過大推定した。

実測・投影値:

```text
production compressed mixed payload = 584,473 bytes
independent compressed mixed payload = 584,473 bytes
incorrect projected per-shard = 74,812,544 bytes
frozen per-shard ceiling = 33,554,432 bytes
projected total compressed = 149,625,088 bytes <= 268,435,456 bytes
```

## Attempt 2

```text
workflow run = 33307879877
workflow job = 99247545979
head = 385e32d0db9b692986edb2b14d4d45f33cd7bdbe
artifact id = 9731056225
artifact zip sha256 = 2d9f1ad8ab41cfbb53ee77dea6c83038c89d2e133fcf2d6263a298c032a290e0
disposition = STAGE1-PACKAGING-PREFLIGHT-FAIL
scientific seeds used = []
```

Attempt 2はworkflow activation用comment変更後に、同じ未修正preflight runnerを再実行したものであり、同じprojection defectによりfailureした。科学的contract、threshold、seed、resource ceilingは変更されていない。

## repair authorization boundary

scientific seedは一度も消費されておらず、scientific outcomeも生成されていないため、prospectively fixed technical repair ruleに従いimplementation-only repairを許可する。

repairでは次だけを変更する。

1. source/root componentとmodel componentを別々にgzip計測する。
2. source/root componentは固定済み`projectedRootScaleFactor=64`と`artifactProjectionSafetyMultiplier=2`を適用する。
3. model componentはtechnical stress 128 rowsからscientific selected roots 512 rowsへの比`512/128=4`を適用し、同じ`artifactProjectionSafetyMultiplier=2`を適用する。
4. runtime projectionは既存contractの`modelCubicScaleFactorFrom128To512=64`と`runtimeProjectionSafetyMultiplier=2`をそのまま保持する。

次は**変更しない**。

- per-shard ceiling `33,554,432 bytes`
- total compressed ceiling `268,435,456 bytes`
- runtime / RSS ceiling
- safety multiplier
- 28-feature dictionary
- representation family
- `K=2..8`
- support / silhouette / stability / source-policy threshold
- population / readiness gate
- Stage 2 held-out contract

したがってこれはresource gate relaxationではなく、frozen gateへ入力するprojection estimatorのimplementation correctionである。
