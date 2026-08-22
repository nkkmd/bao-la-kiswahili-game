# Blunder / Misvaluation Patterns Study 1

## 研究題目

**Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証**

## 状態

**STUDY 1 ACTIVE — STAGE 1 EXPLORATORY COMPLETE / STAGE 2 FORMAL DESIGN FROZEN / PRE-AUTHORIZATION TECHNICAL VALIDATION PENDING**

```text
studyId = BMP-STUDY1
integrated Stage 1 main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 branch = research/blunder-misvaluation-patterns-stage2-formal
Stage 1 promoted exploratory candidates = 4
Stage 2 stageId = BMP-S2-FORMAL-2026-08-22-v1
Stage 2 scientific generation = NOT AUTHORIZED
Study 1 formal result = NONE
```

## 最初に読む

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — Study 1全体の概要
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のscientific gate
- [`STAGE_2_FORMAL_PROTOCOL.md`](STAGE_2_FORMAL_PROTOCOL.md) — Stage 2 prospective formal protocol
- [`STAGE_2_DECISION_REGISTER.md`](STAGE_2_DECISION_REGISTER.md) — Stage 2-specific frozen decisions
- [`STAGE_2_EXECUTION_RUNBOOK.md`](STAGE_2_EXECUTION_RUNBOOK.md) — pre-authorization validationと将来のscientific execution順序
- [`STAGE_1_EXPLORATORY_REPORT.md`](STAGE_1_EXPLORATORY_REPORT.md) — 完了済みStage 1の科学的統合
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — Stage 1 commit/hash/artifact/tooling索引
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — Study-level frozen decisions
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md) — stage index

## Study architecture

```text
Stage 0 — technical / construct audit                 COMPLETE
Stage 1 — fresh exploratory discovery                COMPLETE
Stage 2 — fresh prospective formal confirmation      DESIGN FROZEN / PRE-AUTHORIZATION
```

現在閉じているのはStage 1 exploratoryであり、Study 1全体のformal conclusionはまだ存在しない。

## Stage 1 result

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
selected roots = 1200
Namua / Mtaji = 600 / 600
measured exact legal moves = 5295
matcherCount = 16421
detailedCandidateCount = 123624
promotion passing after support-equivalence = 11
final promoted candidates = 4
manual override = false
```

Promoted candidates:

```text
BMP-S1-C01 — Namua / worstReplyActorFrontConnectionsDeltaNegative
BMP-S1-C02 — Namua / actorCaptureMoveDeltaNegative
BMP-S1-C03 — Namua / actorLegalMoveDeltaNegative
BMP-S1-C04 — Mtaji / allRepliesActorCaptureMoveDeltaNegative
```

These remain exploratory inputs only.

## Stage 2 frozen design

Candidate mapping:

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share one exact Namua support-group denominator and deterministic candidate move; only failure token differs. C04 uses the Mtaji support group.

Machine-readable freeze:

```text
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 097aa6450f270254ec6dee2a7fd7e74a2d8298cae36923a39e822b2137172730
```

Fresh Stage 2 population:

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
opening random plies = 8
```

Three-axis Stage 1 identity firewall requires final overlap 0 on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

No replacement or seed extension is allowed.

## Stage 2 formal decision structure

Per candidate estimability:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Co-primary endpoints:

```text
failure-signature recurrence — exact one-sided binomial H0 p<=0.50; observed floor >=0.65
D3-inferior recurrence       — exact one-sided binomial H0 p<=0.50; observed floor >=0.70
```

Eight planned tests use Holm-Bonferroni FWER 0.05. Confirmation additionally requires:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Possible labels:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

Zero confirmed candidates is valid.

## Verification firewall

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal measure
-> independent formal measurement verification
-> formal evaluate
```

Formal evaluation cannot run until independent measurement verification reproduces the measurement hash and identity firewall.

## Current gate

The Stage 2 candidate/spec, runner, independent corpus verifier, independent formal measurement verifier, evaluator, contract/tooling tests, and CI workflows are materialized.

**Scientific generation is still blocked.** Next run only the pre-authorization validation commands in [`STAGE_2_EXECUTION_RUNBOOK.md`](STAGE_2_EXECUTION_RUNBOOK.md). If they pass, freeze the exact source-file SHA-256 map and create a separate source-bound authorization.

## Interpretation boundary

Even a future Stage 2 `CONFIRMED` label is limited to machine-reproducible recurrence under the frozen Bao engine/search/population. It is not a game-theoretic proof, human misconception result, expert/traditional recognition, pedagogical result, causal claim, or external-validity claim.

## Artifact policy

Large scientific data remain local:

```text
artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/
```

Compact machine-readable records and provenance are committed; large corpus/measurement payloads are not.
