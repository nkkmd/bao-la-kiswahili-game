# Resource-Robust Continuous Local-Geometry Representation Verification Study 1

Study ID: **`RRCLGR-STUDY1`**

Program position: Research Generation 3 / pre-G3-10 independent prerequisite

Status: **`CLOSED / TECHNICAL-INVALID`**

## 目的

G3-10で必要となるbounded RAW local-game-tree geometryの連続多軸coordinateについて、LGTGMIV F1–F5のformal-eligible exact primitivesを用い、deterministic pre-root reconstructibility eligibilityとmaterially independent production / verifierのもとでfresh evidence上のformal eligibilityを確立できるかを検証するための独立prospective prerequisite Studyである。

本StudyはG3-09 `CLGR-STUDY1`をreopen、repair、rerun、reclassifyするものではない。G3-09 Stage 1/Stage 2のscientific measurementsは本Studyのscientific evidenceとして利用していない。

## Frozen representation

`RRCLGR-R1-EXACT-SQUASHED-L1`

- relative RAW horizon = 5
- exact six-axis representation
- exact reduced rational arithmetic
- data-independent `q/(1+q)` transform
- equal-weight exact L1 distance
- k=3 tie-inclusive neighborhood
- phase-specific scaling / learned weights / refit = none

## Stage history

### Stage 0

`RRCLGR-S0-TECHNICAL-2026-09-03-v1`

**`STAGE0-PASS`**

Stage 0はtechnical-onlyであり、fresh Stage 1/2 scientific seedsおよびprotected depth-10へアクセスしていない。

### Stage 1

`RRCLGR-S1-DEVELOPMENT-2026-09-03-v1`

**`STAGE1-TECHNICAL-INVALID`**

Stage 1はexactly one authorized executionとしてGitHub Actions run `33759611989`で実行された。source binding、durable lease、artifact-before-mirror controlは通過したが、fresh seed access後、candidate manifest完成前にimplementation type errorでfail-closedした。

Canonical error:

```text
The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Array
```

原因はcandidate identity rowsの配列を、canonical serializerを経由せずinherited low-level digestへ直接渡したことである。

このdefectはfresh access後に判明したため、同Study/version内でのrepair + same-evidence rerunは禁止される。

### Stage 2

**`NOT-AUTHORIZED / NOT-EXECUTED`**

## Formal scientific boundary

```text
formal continuous-representation eligibility = NOT ESTABLISHED
scientific positive result = NONE
scientific negative result = NONE
scientific null result = NONE
scientific summary from Stage 1 = NOT AUTHORIZED
G3-10 at RRCLGR closure = NOT AUTHORIZED
subsequent G3-10 chronology = CRCLGR formal eligible → separate review G3-10-AUTHORIZED → GCLD-STUDY1 CLOSED FORMAL-COMPLETE
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
combined successor-branch main integration = NOT AUTHORIZED / NOT PERFORMED
```

RRCLGR closure時点では、continuous representation prerequisiteを再検証する場合はRRCLGR-STUDY1のrepairではなく、fresh seed namespaceと新たなprospective contractを持つ独立Study/versionとして開始する必要があった。その条件を満たす後継`CRCLGR-STUDY1`がその後独立に実施されformal eligibleで閉じた。RRCLGR自体のdecisionは変更しない。

## Canonical records

- `STUDY_1_PROTOCOL.md`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`
- `results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json`
- `../research-program-decisions/2026-09-03-rrclgr-stage1-technical-invalid-closure.md`
