# Blunder / Misvaluation Patterns Study 1

## 研究題目

**Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証**

## 状態

**ACTIVE — STAGE 0 DESIGN FROZEN / TECHNICAL VALIDATION PENDING / NO SCIENTIFIC CORPUS AUTHORIZED**

Baseline `main`:

```text
b1cc7047504b73c5a848e866f795c26a64250d13
```

Research branch:

```text
research/blunder-misvaluation-patterns
```

Study ID:

```text
BMP-STUDY1
```

## 研究の中心

異なるBao局面に繰り返し現れる、機械的に再現可能なbad-move / value-misestimation structureを、

```text
pre-move state
→ exact candidate move
→ frozen deeper-search decision loss
→ reply / forcing structure
→ downstream structural consequence
```

として発見し、fresh corpusで確認できるかを調べる。

このStudyでは「その後負けた手」「static evaluationが低い手」「AIが選ばなかった手」を、それだけで悪手とは定義しない。

## Primary reference construct

Stage 0 designでは、primary search referenceを次に固定する。

```text
evaluation profile = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
primary reference depth = D3
quiescence depth = 1
root move set = exact E.moveVariants(state)
perspective = root actor = state.player
```

Primary decision-loss construct:

```text
regret_D3Q1(state, move)
  = best root score_D3Q1 - candidate root score_D3Q1
```

ただしmate-domainとordinary evaluation domainは別に監査し、cross-domain lossを通常評価点差と同じ連続尺度へ無条件に混ぜない。

D2はshallow-search comparator、D1は追加diagnostic、D4は事前固定したtechnical/robustness subset候補とする。D4を結果後にprimaryへ昇格させない。

## Immutable inherited boundaries

### Position Evaluation / Win-Rate Calibration Study 1

```text
formal decision = INCONCLUSIVE
```

Stage 1 `phase-stratified isotonic` mappingはexploratory development artifactであり、formalにvalidatedされたwin probabilityではない。本Studyのformal severity endpointには使用しない。

### Position Complexity / Difficulty Study 1

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

Exact search instrumentationはtechnical foundationとして再利用できるが、同Studyのformal resultを変更・救済しない。

### Tactical Motifs / Tesuji Study 1

```text
C01 = NOT-CONFIRMED
C02 = NOT-CONFIRMED
C03 = CONFIRMED
C04 = NOT-CONFIRMED
```

C03はfrozen machine operationalization内のmachine-reproducible transferable tactical motifまでであり、その定義・意味を変更しない。

### Tactical Motif Human / Expert Validation Study 1

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

N=0はnegative human evidenceではない。本Studyでhuman dataを収集しない限り、人間の錯覚・初心者の誤認・熟練者の見落としを主張しない。

## Stage architecture

```text
Stage 0 — technical / construct audit
Stage 1 — fresh exploratory discovery
Stage 2 — fresh prospective formal confirmation
```

Stage 0はscientific inferenceを行わず、scientific corpusを生成しない。

Stage 1/2 scientific generationには、それぞれmachine-readable specとsource-bound explicit authorizationを別に要求する。

## Seed reservation

Reservation only:

```text
Stage 1 capacity = 22400001..22402048
Stage 2 capacity = 22500001..22504096
```

Reservationはgeneration authorizationではない。exact game countはtechnical feasibility監査とStage-specific spec freeze後にのみ確定する。

## 最初に読む

- `RESEARCH_PLAN.md`
- `TECHNICAL_SEMANTICS_AUDIT.md`
- `STATISTICAL_ANALYSIS_PLAN.md`
- `HYPOTHESES.md`
- `SEED_AUDIT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`

## Artifact policy

Scientific corporaや大規模per-state/per-move measurementsをGitHubへ直接commitしない。将来生成する場合は原則として:

```text
artifacts/local/blunder-misvaluation-patterns/
```

配下へ置き、compact summary / hash / audit recordのみをrepositoryへ記録する。
