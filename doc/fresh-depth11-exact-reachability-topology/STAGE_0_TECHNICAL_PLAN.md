# FDERT-STUDY1 — Stage 0 Technical Plan

更新日: 2026-09-28  
Stage: `FDERT-S0-TECHNICAL-2026-09-28-v1`  
Evidence class: `TECHNICAL-FIXTURE / HISTORICAL-REFERENCE ONLY`

## 目的

G4-10 protected depth-11 holdoutを開く前に、現行sourceでexact enumeration infrastructureが安全に再利用できるかを技術的に検証する。

Stage 0は科学的結果を生成しない。complete depth-11 state count、edge count、tree occurrence、transposition、RSS、部分prefixなどを生成・readしない。

## 固定境界

```text
scientific inference = false
protected depth-11 access = false
maximum real fixture depth = 2
Stage 1 authorization = false
public AI change = false
main integration = false
```

## 検証対象

1. 現行 `public/engine.js` のstandard initial RAW rootが既知identityを維持すること。
2. production enumeratorがdepth 2を完全列挙できること。
3. independent verifierがmaterialized resultとfull shallow recomputationの両方で一致すること。
4. known shallow prefix `1,4,14` RAW states / `1,4,14` tree occurrencesが維持されること。
5. unique-state / move-work / tree-occurrence / artifact-byte ceilingがfail closedすること。
6. final resource gateが境界値を正しく拒否すること。
7. completion metadata corruptionを拒否すること。
8. resource cutoffを`NON-ESTIMABLE`、integrity defectを`TECHNICAL-INVALID`としてpartial resultから分離できること。
9. independent enumeratorがproduction enumeratorをimportしていないこと。
10. Stage 0 runnerにdepth-11 real computationが含まれないこと。

## 実行経路

GitHub Actionsを第一候補とする。

Stage 0 workflowはauthorization artifactのpushだけで起動し、次を行う。

- frozen source bindingを検証
- technical runnerを一度だけ実行
- resultをActions artifactとして90日保存
- repository branchへscientific/technical resultを自動pushしない

runner-local canonical resultの喪失やremote branch競合を避けるため、Stage 0結果はartifactを取得・検証した後に別commitでrepositoryへmirrorする。

## PASS条件

全mandatory controlがPASSし、結果に次が明示されること。

```text
stageDisposition = STAGE0-PASS
scientificInferencePerformed = false
protectedDepth11Access = false
stage1ExecutionAuthorized = false
maximumRealFixtureDepthObserved = 2
allMandatoryControlsPassed = true
```

PASSしてもStage 1は自動認可しない。

## FAIL条件

いずれかのmandatory controlが失敗した場合:

```text
stageDisposition = STAGE0-TECHNICAL-INVALID
protected depth-11 evidence consumption = 0
```

同じStage versionを無条件再実行しない。原因を修正する場合はversioned technical refreezeと新authorizationを必要とする。

## Stage 0後に許可される次工程

PASS時に許可されるのはStage 1の**設計・resource planning・source freeze・pre-access audit**だけである。

protected depth-11 scientific executionは、Stage 1 numerical resource ceiling、metric schema、production/independent source、one-shot lease、artifact contractを別途freezeし、明示的authorizationを作成するまで禁止する。
