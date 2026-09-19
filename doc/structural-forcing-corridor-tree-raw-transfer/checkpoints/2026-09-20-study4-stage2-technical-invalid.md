# SFCDFT-STUDY4 Stage 2 — TECHNICAL-INVALID closure checkpoint

日付: 2026-09-20  
Agenda: `Research Generation 4 / G4-02`  
Study: `SFCDFT-STUDY4`  
Stage: `SFCDFT4-S2-FORMAL-HELDOUT-2026-09-19-v1`  
裁定: **`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / FAIL-CLOSED`**

## 1. このcheckpointの目的

Study 4 Stage 2 のcanonical one-shot executionを、frozen protocolとexecution authorizationに従って正式に閉鎖する。

このcheckpointはC1/C6 transferの科学的結果を記録するものではない。canonical executionはformal measurement開始前のmandatory `bundle-source`工程で停止したため、8-cell scientific decision vectorは生成されていない。

## 2. canonical execution

```text
run ID = 35450625402
event = push
execution SHA = 0acd54a23fd8e1f1226c307fe948c251d64f336d
run attempt = 1
run conclusion = failure
```

確認できたexecution trace:

```text
primary source acquisition = 768 / 768 completed
retry = 0
paired reserve = 0
deterministic failure = 0
classify-final = success
classify-final ready = true
bundle-source = failure
bundle-source job ID = 105919448021
recovered error = source identity mismatch
formal measurement = skipped / not started
formal aggregate = skipped / not started
```

したがって、fresh source取得とfinal classificationまでは成立したが、formal measurementへ渡すmandatory source bundleが成立しなかった。

## 3. post-failure identity-only audit

canonical runのsealed source artifactsだけを対象とするread-only identity auditを、fresh seedを一切読まずに実行した。

```text
audit run ID = 35452797563
audit execution SHA = 9a2abaa3b45e2eaac532ea9c7c1ba284e22d4688
run attempt = 1
conclusion = success
canonical source artifacts inspected = 768
top-level studyId mismatch = 0
top-level stageId mismatch = 0
duplicate slot = 0
fresh scientific seed reads = 0
scientific endpoint reads = 0
effect computation = false
```

Audit artifact:

```text
artifact ID = 10587421372
name = sfcdft4-s2-canonical-identity-audit-35450625402
digest = sha256:dae4371a2b06d3c6085a502b310b5af55dc0c439ec2d91268d2f7fbc219e2af8
```

この監査により、canonical bundlerで発生した `source identity mismatch` は、保存済み768 source artifactのtop-level `studyId` / `stageId` / slot uniqueness監査では再現しなかった。

ここからbundlerの内部原因を科学的に推測しない。また、監査結果を用いたsame-evidence repairやformal measurementの救済実行は行わない。

## 4. formal adjudication

`STUDY_4_PROTOCOL.md` は `TECHNICAL-INVALID` を、mandatory identity / serializer / implementation / authorization / execution / provenance / artifact contract違反に対するfail-closed labelとして定義している。

今回のcanonical executionでは、768/768 source acquisitionとfinal classificationは成功したが、その後のmandatory `bundle-source`工程が失敗し、formal measurementへ到達しなかった。

したがってStage 2の正式裁定を次とする。

```text
SFCDFT-STUDY4 Stage 2 = TECHNICAL-INVALID
scientific decision = NONE
8-cell decision vector = NOT GENERATED
formal label assignment = NOT PERFORMED
```

これは `NON-ESTIMABLE` ではない。`NON-ESTIMABLE` はintegrity violationなしにfrozen support / definedness / minimum-nonzero / resource gateが不足した場合の科学的評価ラベルであり、今回はそのformal measurement段階へ到達していない。

また `NOT-CONFIRMED`、`GENERALIZES-WITHIN-FROZEN-DOMAIN`、`COUNTEREXAMPLE-BOUNDARY-DETECTED` のいずれでもない。formal hypothesis test自体が実施されていない。

## 5. no-rerun / recovery disposition

frozen protocolとexecution authorizationに従い、次を行わない。

- full fresh workflow rerun
- same-evidence repair rerun
- manual dispatchによる再実行
- run attempt 2以降
- failure後のscientific seed再読
- frozen selectionの救済変更
- endpoint / direction / alpha / sample target / domain / resource ceilingの事後変更
- identity-only auditを根拠としたformal measurementのpost-hoc rescue

監査workflowはcanonical runのsealed artifactsをread-onlyで確認するためのものであり、scientific rerunではない。

## 6. scientific interpretation boundary

今回のtechnical failureからC1/C6の科学的方向を推論しない。

特に、次を主張しない。

- C1がfresh domainsで一般化した／しなかった
- C6がfresh domainsで一般化した／しなかった
- counterexample boundaryが検出された
- formal effectが確認されなかった
- support不足によるNON-ESTIMABLEだった

Study 4 Stage 1の `FORMAL-PREPARATION-ELIGIBLE` はcompatibility-only resultとして保持するが、Stage 2 scientific decisionへ昇格させない。

## 7. G4-02 disposition

G4-02ではStudy 1〜4までprospectiveにfail-closed boundaryを維持してきた。Study 4でもformal Stage 2 scientific measurementへ到達できなかったため、このAgenda内でさらにsuccessor Studyを自動生成しない。

正式なG4-02状態を次とする。

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
G4-02 scientific transfer decision = NONE
G4-02 successor study = NOT AUTHORIZED
```

これはG3-04 C1/C6が一般化しないという意味ではない。G4-02で計画したfresh-domain formal transfer判定を、凍結済みのone-shot条件下で有効に取得できなかった、という研究上の終了状態である。

将来この問いを再検討する場合は、G4-02のrepair/reopenではなく、別Agenda / 別Study identity / 新規prospective authorizationとして扱う必要がある。

## 8. closure

```text
Study 4 Stage 2 = CLOSED / TECHNICAL-INVALID
Study 4 formal scientific decision = NONE
Study 4 rerun = NOT AUTHORIZED / NOT PERFORMED
G4-02 = CLOSED / NO SCIENTIFIC DECISION
main integration = NOT AUTHORIZED / NOT PERFORMED
public AI change = false
```

機械可読な正本:

- [`../results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json`](../results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json)
- [`../authorizations/STUDY_4_STAGE_2_EXECUTION_AUTHORIZATION.json`](../authorizations/STUDY_4_STAGE_2_EXECUTION_AUTHORIZATION.json)
- [`../authorizations/STUDY_4_STAGE_2_PRE_EXECUTION_BINDING.json`](../authorizations/STUDY_4_STAGE_2_PRE_EXECUTION_BINDING.json)
- [`../STUDY_4_PROTOCOL.md`](../STUDY_4_PROTOCOL.md)
