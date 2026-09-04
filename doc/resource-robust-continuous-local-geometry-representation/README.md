# resource制約に耐えるcontinuous representationの再検証 — `RRCLGR-STUDY1`

Study ID: **`RRCLGR-STUDY1`**

研究上の位置づけ: Research Generation 3 / G3-10前の独立prerequisite

Status: **`CLOSED / TECHNICAL-INVALID`**

## 目的

G3-10で必要となるbounded RAW local-game-tree geometryの連続多軸coordinateについて、LGTGMIV F1–F5のformal-eligible exact primitivesを用い、deterministic pre-root reconstructibility eligibilityとmaterially independent production / verifierのもとでfresh evidence上のformal eligibilityを確立できるかを検証するための独立prospective prerequisite Studyである。

本StudyはG3-09 `CLGR-STUDY1`をreopen、repair、rerun、reclassifyするものではない。G3-09 Stage 1/Stage 2のscientific measurementsは本Studyのscientific evidenceとして利用していない。

## 固定済みの表現

`RRCLGR-R1-EXACT-SQUASHED-L1`

- relative RAW horizon = 5
- exact six-axis representation
- exact reduced rational arithmetic
- data-independent `q/(1+q)` transform
- equal-weight exact L1 distance
- k=3 tie-inclusive neighborhood
- phase-specific scaling / learned weights / refit = none

## 各Stageの経過

### Stage 0の結果

`RRCLGR-S0-TECHNICAL-2026-09-03-v1`

**`STAGE0-PASS`**

Stage 0はtechnical-onlyであり、fresh Stage 1/2 scientific seedsおよびprotected depth-10へアクセスしていない。

### Stage 1の結果

`RRCLGR-S1-DEVELOPMENT-2026-09-03-v1`

**`STAGE1-TECHNICAL-INVALID`**

Stage 1はexactly one authorized executionとしてGitHub Actions run `33759611989`で実行された。source binding、durable lease、artifact-before-mirror controlは通過したが、fresh seed access後、candidate manifest完成前にimplementation type errorでfail-closedした。

canonical errorは次のとおりです。

```text
The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Array
```

原因はcandidate identity rowsの配列を、canonical serializerを経由せずinherited low-level digestへ直接渡したことである。

このdefectはfresh access後に判明したため、同Study/version内でのrepair + same-evidence rerunは禁止される。

### Stage 2の結果

**`NOT-AUTHORIZED / NOT-EXECUTED`**

## 正式な科学的境界

```text
formal continuous-representation eligibility = NOT ESTABLISHED
scientific positive result = NONE
scientific negative result = NONE
scientific null result = NONE
scientific summary from Stage 1 = NOT AUTHORIZED
G3-10 at RRCLGR closure = NOT AUTHORIZED
subsequent G3-10 chronology = CRCLGR formal eligible → separate review G3-10-AUTHORIZED → GCLD-STUDY1 CLOSED FORMAL-COMPLETE
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
combined successor-branch main integration = COMPLETE / FAST-FORWARD / source tip 28b64d1cb02904e0c57886ae2046cd681ab64387
```

RRCLGR closure時点では、continuous representation prerequisiteを再検証する場合はRRCLGR-STUDY1のrepairではなく、fresh seed namespaceと新たなprospective contractを持つ独立Study/versionとして開始する必要があった。その条件を満たす後継`CRCLGR-STUDY1`がその後独立に実施されformal eligibleで閉じた。RRCLGR自体のdecisionは変更しない。

## 正本となる記録

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`
- `results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json`
- [`../research-program-decisions/2026-09-03-rrclgr-stage1-technical-invalid-closure.md`](../research-program-decisions/2026-09-03-rrclgr-stage1-technical-invalid-closure.md)
