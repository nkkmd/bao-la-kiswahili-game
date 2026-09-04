# tactical motifの人間・expert検証 — Study 1

## 研究題目

**Baoにおけるmachine-confirmed tactical motifのHuman / Expert Validation — TM-S2-C03は人間の熟練者にも手筋として認識されるか**

## 最終状態

**STUDY 1 COMPLETE — MACHINE/INSTRUMENT STAGE COMPLETE / HUMAN AXIS `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`**

- repository baseline: `main` `3cc40d83917660dd815c785ff0e0c754666d9a0e`
- study branch: `research/tactical-motif-human-validation`
- Stage 1 ID: `TMHV-S1-STIMULUS-2026-08-17-v1`
- Stage 2A closure ID: `TMHV-S2A-RECRUITMENT-FEASIBILITY-2026-08-18-v1`
- formal human recruitment: **NOT LAUNCHED**
- formal human responses: `0`

## 最初に読む

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的最終統合
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — canonical closure state

## 既存の機械検証結果

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

本研究のhuman outcomeはこれらを変更しない。

## 機械測定・instrumentの結果

fresh Stage 1 population:

```text
games = 1536
seeds = 22100001..22101536
six generation strata × 256
```

independent verification:

```text
gamesVerified = 1536
fullSearchRecomputation = true
mismatchCount = 0
```

事前規定したclass別件数:

```text
C03_TARGET = 687
P_ONLY     = 277
M_ONLY     = 621
MORPH_NEAR = 987
```

Stage 1のreadiness gateはすべてPASSしました。

exact formal machine stimulus set:

```text
primary blocks = 12
primary C03 targets = 24
primary controls = 12
control balance = 4 / 4 / 4
secondary C03 move-choice targets = 6
total unique formal positions = 42
```

private exact freezeのSHA-256:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

## 人間検証軸の終了状態

本研究は所属機関によらない独立研究として実施された。

formal recruitment開始前の時点で、frozen expert criteriaを満たすBao専門家・研究者・競技者へ現実的にアクセスする経路を確保できなかったため、scientific recruitmentをlaunchせずに閉じた。

```text
accessible eligible experts = 0
scientific recruitment started = false
persons contacted for scientific recruitment = 0
included primary experts = 0
formal human responses = 0
```

Frozen minimum expertsは`10`であり、緩和していない。

human axisの最終label:

`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`

Zero participantsはnegative human evidenceではない。

## 最終的な証拠の状態

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

本研究はC03がhuman expertに認識されるとも、認識されないとも結論しない。

## 正本となる記録

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md)
- [`STATISTICAL_ANALYSIS_PLAN.md`](STATISTICAL_ANALYSIS_PLAN.md)
- [`ETHICS_AND_DATA_GOVERNANCE.md`](ETHICS_AND_DATA_GOVERNANCE.md)
- `STAGE_1_ARTIFACT_AUDIT.json`
- `STAGE_1_FORMAL_STIMULUS_FREEZE_AUDIT.json`
- `STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json`
- [`STAGE_2A_RECRUITMENT_FEASIBILITY_CLOSURE.md`](STAGE_2A_RECRUITMENT_FEASIBILITY_CLOSURE.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md)
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md)

## 将来研究との境界

将来qualified expertへアクセス可能になった場合、このclosed Study 1のhuman resultを上書きしない。新しいprospective independent study、またはnew human responses前に明示的にversionedされたprospective reopeningとして扱う。
