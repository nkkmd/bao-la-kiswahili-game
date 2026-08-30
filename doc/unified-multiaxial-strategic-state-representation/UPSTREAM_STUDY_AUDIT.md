# UMSSR-STUDY1 — upstream Study監査

更新日: 2026-08-30

## 1. 監査目的

G2-10のscientific evidence生成前に、Research Generation 2 `G2-01..G2-09`、とくにG2-02およびG2-06〜G2-09のformal status、authorization、seed consumption、RAW identity、reproducibility boundaryをsource-of-truth文書とcanonical machine-readable resultから再確認した。

本監査はupstream Studyのformal decisionを変更しない。

## 2. repository baseline

```text
remote main observed = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
user-provided expected = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
match = true
```

中央規則として次を確認した。

- `/README.md`
- `/doc/FUTURE_RESEARCH_AGENDA.md`
- `/doc/RESEARCH_INDEX.md`
- `/doc/DOCUMENTATION_LANGUAGE_POLICY.md`
- `/doc/JAPANESE_DOCUMENTATION_QUALITY_GATE.md`

## 3. canonical scientific status

| Program | Study | canonical scientific state | G2-10で変更しない境界 |
| --- | --- | --- | --- |
| `G2-01` | `PEOCR-STUDY1` | `INCONCLUSIVE`; primary=`null` | calibration mappingをvalidated axisへ昇格しない |
| `G2-02` | `SRDR-STUDY1` | `INCONCLUSIVE`; primary=`null` | secondary search profileをformal classifierへ昇格しない |
| `G2-03` | `STSCV-STUDY1` | `INCONCLUSIVE`; validated transform set=`[]` | canonicalization / symmetry reductionを使用しない |
| `G2-04` | `REEOE-STUDY1` | `INCONCLUSIVE`; fresh exact oracleなし | bounded development failureをexact strategic stateへ昇格しない |
| `G2-05` | `DRSSE-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` | standard initial RAW root depth 0..9だけのbounded exact claim |
| `G2-06` | `RCPR-STUDY1` | Stage 1 `STAGE1-TECHNICAL-INVALID`; Stage 2未実行 | `RICH_ALL` / metricsはunverified provenance only |
| `G2-07` | `PCRPR-STUDY1` | Stage 1 `STAGE1-TECHNICAL-INVALID`; Stage 2未実行 | `F05_ALL` / `lambda=100` / metricsはunverified provenance only |
| `G2-08` | `MDFT-STUDY1` | Study `NON-ESTIMABLE`; Stage 2未実行 | six `promoted=true` calculationsはdevelopment observation only |
| `G2-09` | `TMGC-STUDY1` | Study `TECHNICAL-INVALID`; scientific evidence生成なし | C03 generalization / counterexample domainは未推定 |

## 4. G2-02照合

確認した主な正本:

- `doc/search-reliability-decision-robustness/CURRENT_STATUS.md`
- `doc/search-reliability-decision-robustness/STUDY_1_FINAL_REPORT.md`
- `doc/search-reliability-decision-robustness/DECISION_REGISTER.md`
- `doc/search-reliability-decision-robustness/REPRODUCIBILITY_INDEX.md`
- `doc/search-reliability-decision-robustness/results/STAGE_2_FORMAL_RESULT.json`

一致した事項:

```text
formalDecision = INCONCLUSIVE
primaryFormalCriterion = null
failed formal gate = unique historical trajectories 1040 < 1050
independent verification = PASS
Stage 1 -> Stage 2 trajectory/opening/RAW overlap = 0/0/0
```

secondary profileは保存されているがformal primary decisionではない。

## 5. G2-06照合

確認した主な正本:

- `doc/rich-critical-position-representation/CURRENT_STATUS.md`
- `doc/rich-critical-position-representation/STUDY_1_FINAL_REPORT.md`
- `doc/rich-critical-position-representation/DECISION_REGISTER.md`
- `doc/rich-critical-position-representation/REPRODUCIBILITY_INDEX.md`
- `doc/rich-critical-position-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`

一致した事項:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds 28610001..28613072 = CONSUMED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

4 rowsの`MOVE_SET_ENTROPY.indexEntropy` exact mismatchはfloating-point accumulation order差に由来する。原因が小さい数値差であることはpost-hoc tolerance / roundingによる救済を許可しない。

## 6. G2-07照合

確認した主な正本:

- `doc/practical-comeback-reply-pressure-representation/CURRENT_STATUS.md`
- `doc/practical-comeback-reply-pressure-representation/STUDY_1_FINAL_REPORT.md`
- `doc/practical-comeback-reply-pressure-representation/DECISION_REGISTER.md`
- `doc/practical-comeback-reply-pressure-representation/REPRODUCIBILITY_INDEX.md`
- `doc/practical-comeback-reply-pressure-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`

一致したscientific事項:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds 28710001..28713072 = CONSUMED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
```

production/independent terminal stdoutのdevelopment-core hashは一致したが、mandatory full independent artifactが保存されずfrozen final comparerを実行できなかった。stdout一致を代替verificationにしない。

### 非科学的な文書不整合

`DECISION_REGISTER.md`のD38にはhistorical stateとして`main integration = NOT PERFORMED`が残っている。一方、`CURRENT_STATUS.md`と`REPRODUCIBILITY_INDEX.md`は次を明記する。

```text
main integration = COMPLETE
PR = #77
merge commit = 57f7cf2d58f0543082434cb4c3259e26e90fe02e
```

これはrepository-integration provenanceのstale entryであり、Stage 1 scientific decision、seed state、Stage 2 non-authorizationには不一致がない。G2-10 eligibility判定へ影響させない。本Study開始作業ではupstream G2-07文書をretroactive editしない。

## 7. G2-08照合

確認した主な正本:

- `doc/machine-decision-failure-taxonomy/CURRENT_STATUS.md`
- `doc/machine-decision-failure-taxonomy/STUDY_1_FINAL_REPORT.md`
- `doc/machine-decision-failure-taxonomy/DECISION_REGISTER.md`
- `doc/machine-decision-failure-taxonomy/REPRODUCIBILITY_INDEX.md`
- `doc/machine-decision-failure-taxonomy/results/STAGE_1_DEVELOPMENT_RESULT.json`

一致した事項:

```text
Stage 1 technical integrity = PASS
opening-prefix diversity 2836 < 3000 = FAIL
max source-policy share 170/512 > 0.32 = FAIL
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

`MDFT-F01/F02/F03/F05/F06/F10`の`promoted=true`はglobal readiness failureのためvalidated taxonomy leafではない。`MDFT-F09`はhistorical morphology classifierをcurrent preserved sourceからexact reconstructionできず、Stage 1前にtechnical-ineligibleだった。

## 8. G2-09照合

確認した主な正本:

- `doc/tactical-motif-generalization-counterexample/CURRENT_STATUS.md`
- `doc/tactical-motif-generalization-counterexample/STUDY_1_PROTOCOL.md`
- `doc/tactical-motif-generalization-counterexample/STUDY_1_FINAL_REPORT.md`
- `doc/tactical-motif-generalization-counterexample/DECISION_REGISTER.md`
- `doc/tactical-motif-generalization-counterexample/REPRODUCIBILITY_INDEX.md`
- `doc/tactical-motif-generalization-counterexample/results/STUDY_1_FINAL_RESULT.json`

一致した事項:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = TECHNICAL-INVALID
Stage 1 scientific seeds 29110001..29114096 = RESERVED / UNCONSUMED
Stage 2 scientific seeds 29210001..29218192 = RESERVED / UNCONSUMED
scientificGeneralizationEvidenceGenerated = false
scientificCounterexampleEvidenceGenerated = false
```

`TM-S2-C03 = CONFIRMED`はResearch Generation 1のoriginal claim domain内で不変である。

## 9. G2-10 eligibilityへの帰結

本監査から`UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`の分類を変更する必要はない。

- G2-05だけをfrozen domain内で`BOUNDED-EXACT-ELIGIBLE`とする。
- G2-06/07 direct model outputは`INELIGIBLE`。
- G2-08 direct taxonomy promotionは`INELIGIBLE`。
- G2-09 generalization boundaryは`INELIGIBLE`。
- G2-02は`TECHNICAL-REFERENCE-ONLY`で、raw search stabilityを使う場合はG2-10でfresh `DEVELOPMENT-CANDIDATE-ONLY`として再定義する。

## 10. 監査判断

```text
upstream scientific-status consistency = PASS
initial eligibility classification = PASS
RAW identity consistency = PASS
validated transform set consistency = PASS / []
seed-reservation conflict with G2-09 = NONE
non-scientific upstream documentation discrepancy = G2-07 D38 only / recorded / non-blocking
scientific evidence generated by G2-10 = false
```
