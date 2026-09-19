# SFCDFT-STUDY3 Stage 2 — TECHNICAL-INVALID closure checkpoint

日付: 2026-09-19  
Agenda: `Research Generation 4 / G4-02`  
Study: `SFCDFT-STUDY3`  
Stage: `SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1`  
裁定: **`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / FAIL-CLOSED`**

## 1. このcheckpointの目的

Study 3 Stage 2 のcanonical one-shot executionを、frozen protocolとexecution authorizationに従って正式に閉鎖する。

このcheckpointは科学的なC1/C6 transfer結果を記録するものではない。canonical executionはformal measurement開始前のmandatory source-bundle工程で停止したため、8-cell scientific decision vectorは生成されていない。

## 2. canonical execution

```text
run ID = 35427427920
event = push
execution SHA = dec9a91d5860b9f3d927d632a7165bcbf99f5f63
run attempt = 1
run conclusion = failure
```

確認できたexecution trace:

```text
classify-final = success
classify-final ready = true
bundle-source = failure
bundle-source job ID = 105857959486
failed step = Build fresh Stage2 source bundle
formal measurement = skipped / not started
formal aggregate = skipped / not started
```

GitHub connectorから監査時点で低レベルstderr全文を確実には回収できていない。そのため、具体的な例外文字列や内部原因を推測して記録しない。本裁定は、durableなjob/step conclusionとfrozen contractだけに基づく。

## 3. formal adjudication

`STUDY_3_PROTOCOL.md` は `TECHNICAL-INVALID` を、mandatory identity / serializer / implementation / authorization / execution / provenance / artifact contract違反に対するfail-closed labelとして定義している。

今回のcanonical executionでは、final classificationまでは成功したが、その後のmandatory source-bundle execution/artifact工程が成立せず、formal measurementへ到達しなかった。

したがってStage 2の正式裁定を次とする。

```text
SFCDFT-STUDY3 Stage 2 = TECHNICAL-INVALID
scientific decision = NONE
8-cell decision vector = NOT GENERATED
formal label assignment = NOT PERFORMED
```

これは `NON-ESTIMABLE` ではない。`NON-ESTIMABLE` はintegrity violationなしにfrozen support / definedness / minimum-nonzero / resource gateが不足した場合の科学的評価ラベルであるが、今回そこまでformal measurementが進行していない。

また `NOT-CONFIRMED`、`GENERALIZES-WITHIN-FROZEN-DOMAIN`、`COUNTEREXAMPLE-BOUNDARY-DETECTED` のいずれでもない。これらを判定するformal hypothesis test自体が実施されていない。

## 4. recovery / rerun disposition

frozen `STUDY_3_STAGE_2_EXECUTION_AUTHORIZATION.json` は次を明示的に `false` としている。

```text
fullFreshWorkflowRerunAuthorized = false
sameEvidenceRepairRerunAuthorized = false
manualWorkflowDispatchAuthorized = false
runAttemptGreaterThanOneAuthorized = false
```

したがって、失敗後に同一Stage 2をrepairして再実行することはしない。

監査時点で次は行っていない。

- canonical workflow rerun
- same-evidence repair rerun
- manual dispatch
- attempt 2以降の実行
- failure後のscientific seed再読
- frozen selectionの救済変更
- endpoint / direction / alpha / sample target / domain / resource ceilingの事後変更

## 5. scientific interpretation boundary

今回のtechnical failureからC1/C6の科学的方向について推論しない。

特に、次を主張しない。

- C1/C6がfresh domainへgeneralizeした
- C1/C6のcounterexample boundaryを検出した
- formal effectが確認されなかった
- support不足によりNON-ESTIMABLEだった

Study 1 / Study 2 の既存closure、およびStudy 3 Stage 1の `FORMAL-PREPARATION-ELIGIBLE` 記録は変更しない。

## 6. evidence firewall

Study 3 Stage 2でfresh access後に得られた情報を、同じStudy 3の科学的contractを有利にrepairするために使用しない。

successor studyを設計する場合も、Study 3のfresh scientific outcomeを用いて次を変更してはならない。

- scientific endpoint
- frozen direction
- source policy
- root family
- domain composition
- sample target
- alpha / multiplicity family
- resource ceiling
- favorable subgroup selection

今回の失敗から利用してよいのは、**source-bundle pipelineがfresh formal execution前に十分なend-to-end technical validationを必要とする**という技術的事実だけである。

## 7. successor studyへ持ち越すtechnical gate

次の独立prospective studyを開始する場合、fresh scientific namespaceへアクセスする前に、non-scientific synthetic fixtureだけで少なくとも次をend-to-end検証する。

```text
source fixture generation
-> source classification
-> final selection representation
-> source bundle construction
-> bundle artifact upload / retrieval contract
-> measurement input parse
-> production / independent dry-run agreement
-> aggregate schema validation
```

このgateはscientific outcomeを生成せず、fresh scientific seedを読まない。

successor studyはStudy 3のrerunではなく、新しいStudy identity、新しいfresh namespace、新しいauthorization boundaryを持つ独立prospective studyとしてのみ開始できる。

## 8. closure

```text
Study 3 Stage 2 = CLOSED / TECHNICAL-INVALID
Study 3 formal scientific decision = NONE
Study 3 rerun = NOT AUTHORIZED / NOT PERFORMED
G4-02 overall = IN PROGRESS
main integration = NOT AUTHORIZED / NOT PERFORMED
public AI change = false
```

機械可読な正本:

- [`../results/stage-2-study3/STUDY_3_STAGE_2_RESULT.json`](../results/stage-2-study3/STUDY_3_STAGE_2_RESULT.json)
- [`../authorizations/STUDY_3_STAGE_2_EXECUTION_AUTHORIZATION.json`](../authorizations/STUDY_3_STAGE_2_EXECUTION_AUTHORIZATION.json)
- [`../STUDY_3_PROTOCOL.md`](../STUDY_3_PROTOCOL.md)
