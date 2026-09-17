# LGTTCI-STUDY1 — Stage 0実行前contract補完

日付: 2026-09-17  
状態: **`PRE-EXECUTION / NO SCIENTIFIC ACCESS / CONTRACT COMPLETION`**

## 結論

`LGTTCI-S0-TECHNICAL-2026-09-17-v1`のrunner実装前監査で、既存の`CRCLGR` bounded preflightが5種類のresource counterを要求する一方、`STUDY_1_SPEC.json`では`treeNodeOccurrences` ceilingだけが欠けていることを検出した。

Stage 0の実行、technical fixtureの測定結果確認、fresh compatibility seedへのアクセス、protected evidenceへのアクセスはいずれもまだ行っていない。このため結果を見る前のpre-execution contract補完として、[`../prereg/PRE_EXECUTION_SPEC_AMENDMENT_V1.json`](../prereg/PRE_EXECUTION_SPEC_AMENDMENT_V1.json)を追加した。

## 追加した唯一のresource ceiling

```text
maxTreeNodeOccurrences = 1000000
```

runnerでは次のactive preflight limitへ明示変換する。

```text
distinctRawStates = 100000
uniqueTransitions = 750000
parentExpansions = 100000
legalMoveEvaluations = 750000
treeNodeOccurrences = 1000000
```

## 変更していないもの

- Study ID、Stage ID
- source policy
- root family
- technical fixture seed namespace
- Stage 1 fresh compatibility seed namespace
- search conditionsとhelper precondition
- population support gate
- decision mapping
- protected evidence firewall
- no-rescue boundary

この補完はscientific targetや結果判定を変更しない。

## access state

```text
Stage 0 execution count before amendment = 0
fresh compatibility seed access before amendment = 0
G3-12 seed replay = 0
G3-11 depth 10 rerun = 0
G4-10 depth 11 access = 0
scientific effect generated = 0
```

このcheckpoint以降にStage 0 runnerを実装し、technical-only executionへ進む。
