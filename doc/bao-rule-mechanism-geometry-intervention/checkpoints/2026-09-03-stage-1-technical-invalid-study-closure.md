# BRMGI-STUDY1 — Stage 1 technical-invalid / Study closure

Date: 2026-09-03

## Formal disposition

```text
Study = BRMGI-STUDY1
Program position = Research Generation 3 / G3-06
Study lifecycle = CLOSED / TECHNICAL-INVALID
Stage 0 v1 = TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = STAGE0-PASS
Stage 1 = BRMGI-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 1
Stage 1 seed = 31610001..31610256 / CONSUMED
no-rescue boundary = CROSSED / ACTIVE
formal promoted candidate set = []
Stage 2 = BRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31620001..31620384 / NOT CONSUMED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

## Stage 1 execution provenance

```text
audited scientific-content HEAD = d90ab9e00eda1d52535ae72e44806fcfc443f2a9
authorization commit = 1edc8886ffb0d2b65c7f4c1c8fb002be0abbe6e7
trigger commit = 61cb2ed31c26151edf19b9c1eb49f6b22b935898
authorization nonce = BRMGI-S1-AUTH-2026-09-03-V1-01
workflow run = 33679269612
job = 100411609044
```

Authorization-chain verification、frozen source-blob binding、trigger-only advancementはPASSした。fresh computation前にdurable leaseも保存された。

```text
lease artifact ID = 9865580015
lease ZIP SHA-256 = 9308c696f221cfa760b288a725837b4566e82231ea955185bea1e6cf2a3bb082
```

## Canonical technical-invalid result

Exactly-one fresh executionはStage 1 seedへアクセスした後、production / independentのdeterministic event-unit selection比較でfail closedした。

Canonical error:

```text
stageDisposition = TECHNICAL-INVALID
technicalError.name = Error
technicalError.message = production/independent selection mismatch
relayLimitInsideBoundedReconstruction = false
formalPromotedCandidateSet = []
```

このfailureはgeometry measurement開始前に発生した。canonical telemetryは:

```text
unitTimings = []
productionResources = null
independentResources = null
stageElapsedMs = 943.954495
maxRssBytes = 103530496
stageElapsedPass = true
```

したがって、M1-M6のfresh Stage 1 development summary、event-family prevalence、candidate direction、promotion resultは成立していない。

## Durable result artifact

```text
result artifact ID = 9865581198
result ZIP SHA-256 = 3f43ff832afaae5fc0a1d6756dcc9fa0101eb5a67befc7f3cdc2d1536bdb5d2a
scientific-result.json SHA-256 = a5a2f385699cd8bc629e1d1594005841778a82c7d1ca18bb7eb5bcfeb0d41452
telemetry.json SHA-256 = 141f4687528ce62fe60052c4c9ecff217a6a929a43190e4f5a507f8d4abc77f0
execution-summary.json SHA-256 = a3fdf314f12d6853e337f13b6c252eaebf27edb69c96dab53829b033ece5ca77
```

Exact artifact bytesはmirror workflow `33679517438`によりrepositoryへcommitされた。scientific recomputationは行っていない。

## Scientific interpretation

今回formalに成立したのは**technical validity result**である。

以下を主張しない。

- captureがbounded geometryを拡大／縮小する
- nyumba use/stopで特定geometryが変わる
- reserve exhaustion / Namua→Mtajiでgeometryが系統的に変わる
- rule-semantic eventとM1-M6にpositive/negative associationがある／ない
- G3-04 C1/C6をrule mechanismで説明できる
- G3-05 transitionの原因を特定した
- causal rule mechanism
- game-theoretic forcing、search ease、value、human difficulty

`production/independent selection mismatch`はscientific nullではない。fresh Stage 1 populationをformal candidate評価へ進めるためのmandatory implementation-agreement gateが成立しなかったことだけを意味する。

## No-rescue closure

Fresh Stage 1 evidenceへのアクセスが開始済みであるため、同じStudyで次を禁止する。

- Stage 1 seed `31610001..31610256`のsame-evidence rerun
- selector / event-unit constructor / projection equalityを修正して同じseedを再評価すること
- seed extension
- event/root/control replacement
- E1/E2/E3 definition変更
- source move policy変更
- endpoint M1-M6変更・追加
- favorable event family / subgroupだけの再解析
- promotion gate / resource ceiling変更
- partial selection provenanceからcandidate directionを推定・promotionすること
- Stage 2をauthorize / executeすること

将来、selection-verification designを改善して同じ研究問いを再検討する場合は、**新しいprospective independent Study/version**として別seed・別authorizationで開始し、BRMGI-STUDY1のformal decisionを変更しない。

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

## Program progression

G3-06はunfinishedではなくformal closure済みStudyとして扱う。Historical agenda上の次候補G3-07は自動開始しない。次にG3-07を行う場合は、post-G3-06 current-state authorization reviewを別途行い、G3-06 technical-invalid resultをpositive/negative geometry-mechanism evidenceとして流用しない。
