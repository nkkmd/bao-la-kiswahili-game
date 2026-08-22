# Blunder / Misvaluation Patterns Study 1

## 研究題目

**Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証**

## 状態

**STUDY 1 CLOSED — EXPLORATORY DISCOVERY COMPLETE / 4 CANDIDATES PROMOTED / NOT CONFIRMED**

```text
studyId = BMP-STUDY1
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
research branch = research/blunder-misvaluation-patterns
Stage 1 scientific games = 2048
selected roots = 1200
measured legal moves = 5295
promoted exploratory candidates = 4
candidate confirmation = NOT PERFORMED
Stage 2 scientific generation = NOT AUTHORIZED
```

## 最初に読む

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — Study 1科学的統合正本
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — commit / hash / artifact / tooling索引
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在地と固定済み解釈境界
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — frozen scientific decisions / no-rescue boundaries
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md) — stage・experiment index

## Study 1の中心

異なるBao局面に繰り返し現れる、機械的に再現可能なbad-move / value-misestimation structureを、

```text
pre-move state
→ exact candidate move
→ frozen deeper-search decision loss
→ reply / forcing structure
→ downstream structural consequence
```

として抽出した。

このStudyでは「その後負けた手」「static evaluationが低い手」「AIが選ばなかった手」を、それだけで悪手とは定義していない。

Primary machine reference:

```text
evaluation profile = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
primary reference depth = D3
quiescence depth = 1
root move set = exact E.moveVariants(state)
perspective = root actor = state.player
```

## Stage 1結果

Generation / verification:

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
distinct generation opening prefixes = 1621
independent full replay/search verification = PASS
```

Outcome-blind selection:

```text
selected unique rule states = 1200
Namua / Mtaji = 600 / 600
distinct selected opening prefixes = 1067
selection readiness = PASS
replacement = false
phase reassignment = false
```

Measurement:

```text
completed roots = 1200
measured legal moves = 5295
all selected roots finite D3 candidate tables = true
measurement readiness = PASS
```

Discovery:

```text
matcherCount = 16421
lowSupportMatcherCount = 9553
detailedCandidateCount = 123624
promotion passing before support-equivalence = 11
promotion passing after support-equivalence = 11
promoted candidates after deterministic ranking/caps = 4
manual override = false
```

Promoted candidate set:

```text
BMP-S1-C01 — Namua / worstReplyActorFrontConnectionsDeltaNegative
BMP-S1-C02 — Namua / actorCaptureMoveDeltaNegative
BMP-S1-C03 — Namua / actorLegalMoveDeltaNegative
BMP-S1-C04 — Mtaji / allRepliesActorCaptureMoveDeltaNegative
```

Exact definitions and all promotion metrics are frozen in [`results/STAGE_1_DISCOVERY_RESULT.json`](results/STAGE_1_DISCOVERY_RESULT.json).

## Immutable inherited boundaries

### Position Evaluation / Win-Rate Calibration Study 1

```text
formal decision = INCONCLUSIVE
```

Stage 1 `phase-stratified isotonic` mapping is exploratory only and is not a validated win-probability severity scale for this Study.

### Position Complexity / Difficulty Study 1

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

Exact-search tooling was reused only as instrumentation; those formal results were not reopened.

### Tactical Motifs / Tesuji Study 1

```text
C01 = NOT-CONFIRMED
C02 = NOT-CONFIRMED
C03 = CONFIRMED
C04 = NOT-CONFIRMED
```

Historical C03 remains a machine-confirmed tactical motif under its own frozen operationalization and is not redefined here.

### Tactical Motif Human / Expert Validation Study 1

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

N=0 is not negative human evidence. This Study collected no new human evidence.

## Interpretation boundary

The four Stage 1 candidates are **exploratory machine candidates only**.

Not authorized:

```text
confirmed Bao blunder claim
game-theoretic blunder claim
human misconception / beginner-error claim
expert/traditional recognition claim
pedagogical importance claim
generalization beyond the frozen Stage 1 source/population
```

Stage 1 data cannot be reused as Stage 2 confirmation evidence.

## Next stage

The next scientifically valid step is a fresh prospective Stage 2 formal-confirmation design for the exact frozen candidate definitions `BMP-S1-C01..C04`.

Stage 2 reserved capacity:

```text
22500001..22504096
```

Reservation is not authorization. Stage 2 generation remains blocked until a separate formal spec, tooling/contract validation, source freeze and explicit source-bound authorization are complete.

## Artifact policy

Large scientific corpora and per-state/per-move artifacts remain under:

```text
artifacts/local/blunder-misvaluation-patterns/
```

The raw Stage 1 discovery artifact is hash-bound but intentionally not committed:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/discovery-result.json
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

Compact machine-readable result records are stored under [`results/`](results/).
