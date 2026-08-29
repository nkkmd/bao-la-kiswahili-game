# RCPR-STUDY1 — 重要局面の豊かな構造表現

Research Generation 2 `G2-06` — **Rich Critical-Position Representation Study 1**。

日本語題目:

**Baoにおける重要局面の豊かな構造表現の構築と事前規定による検証 — rich pre-root representationによるdecision-critical structureの再現可能な識別**

## 状態

```text
Study = CLOSED AT STAGE 1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

Stage 0では、結果を見る前に宣言した8つのrepresentation familyと310-scalar schemaを独立にtechnical validationしました。

fresh Stage 1 production runは完了し、production-only readiness gateをすべてPASSしましたが、mandatory independent feature recomputationでは600 selected rows中4 rowsでexact equalityが成立しませんでした。

そのため、frozen fail-closed ruleに従いStage 1は`STAGE1-TECHNICAL-INVALID`で終了しています。

read-only postmortemでは4件すべての差を`MOVE_SET_ENTROPY.indexEntropy`のfloating-point accumulation orderへ局在させました。しかし、これを理由としてpost-hoc tolerance、rounding、repair、consumed Stage 1 blockのrerunを承認することはありません。

## 最初に読む文書

1. `STUDY_1_OVERVIEW.md` — 結果とinterpretation boundaryの概要
2. `STUDY_1_FINAL_REPORT.md` — scientific / technical closureの統合記録
3. `CURRENT_STATUS.md` — terminal stateとexecution anchor
4. `DECISION_REGISTER.md` — prospective decisionとclosure decision
5. `REPRODUCIBILITY_INDEX.md` — hash、run、artifact、provenance
6. `RESEARCH_LOG.md` — chronological research record
7. `STUDY_1_PROTOCOL.md` — prospective scientific protocol
8. `RESUME_HERE.md` — restart / continuation boundary

## canonical machine-readable record

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_SOURCE_FREEZE_AUDIT.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`

Key closure checkpoint:

- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`
- `checkpoints/2026-08-29-post-closure-workflow-archive.md`

Program-level closure:

- `../research-program-decisions/2026-08-29-g2-06-rich-critical-position-representation-closure.md`

## frozen scientific boundary

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
canonicalization = false
symmetry reduction = false
feature families = 8
scalar features = 310
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
high-divergence boundary = D_range >= 0.30
```

Research Generation 1 Critical Positions evidenceとG2-01..G2-05のformal decisionはすべてimmutableです。Historical CPOB roots / outcomes / auditsは、G2-06のtraining、threshold selection、validation、formal evidenceとして再利用していません。

## Stage 1 terminal provenance

```text
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
workflow run = 33196954082
production job = 98936414477 / success
independent verification job = 99007180273 / failure
```

Production-only descriptive output:

```text
selected roots = 600
primary estimable = 599
high divergence = 134
low divergence = 465
selected family set = RICH_ALL
overall OOF AUROC = 0.7093403948001926
```

これらの値はunverified development provenanceとしてのみ保持し、accepted scientific resultへ昇格しません。

## closure / future work

`RCPR-STUDY1`にはこれ以上のscientific transitionはありません。consumed seed block `28610001..28613072`をrerun、replace、extendしてはいけません。また、このStudy内でStage 2を承認してはいけません。

直後のResearch Generation 2 machine-only agenda itemは`G2-07 — Practical Comeback / Reply-Pressure Representation Study 1`であり、独自のprospective contractとfresh evidenceを必要とします。

将来rich critical-position representationを再検討する場合も、closed Studyをgenericな「Study 2」として再開・救済するのではなく、distinct independent Study identityとfresh prospective validationが必要です。
