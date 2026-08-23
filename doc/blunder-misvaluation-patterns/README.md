# Blunder / Misvaluation Patterns Study 1

## 研究題目

**Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証**

## 状態

**STUDY 1 CLOSED — STAGE 1 EXPLORATORY COMPLETE / STAGE 2 FORMAL COMPLETE / 0 CONFIRMED / 4 NOT-CONFIRMED**

```text
studyId = BMP-STUDY1
integrated Stage 1 main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 branch = research/blunder-misvaluation-patterns-stage2-formal
Stage 1 promoted exploratory candidates = 4
Stage 2 stageId = BMP-S2-FORMAL-2026-08-22-v1
Stage 2 formal candidates = 4 estimable
CONFIRMED = 0
NOT-CONFIRMED = 4
Study 1 = CLOSED
```

## 最初に読む

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — Study 1 final scientific synthesis
- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — Study architecture and result summary
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — final scientific state
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json) — compact canonical formal result
- [`STAGE_2_FORMAL_PROTOCOL.md`](STAGE_2_FORMAL_PROTOCOL.md) — frozen Stage 2 protocol
- [`STAGE_2_DECISION_REGISTER.md`](STAGE_2_DECISION_REGISTER.md) — Stage 2-specific prospective decisions
- [`STAGE_1_EXPLORATORY_REPORT.md`](STAGE_1_EXPLORATORY_REPORT.md) — completed Stage 1 exploratory report
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — reproducibility chain
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — Study-level decisions
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md) — stage index

## Study architecture

```text
Stage 0 — technical / construct audit                 COMPLETE
Stage 1 — fresh exploratory discovery                COMPLETE
Stage 2 — fresh prospective formal confirmation      COMPLETE
Study 1                                                CLOSED
```

## Stage 1 result

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
selected roots = 1200
measured exact legal moves = 5295
matcherCount = 16421
detailedCandidateCount = 123624
promotion passing after support-equivalence = 11
final promoted candidates = 4
manual override = false
```

Promoted exploratory candidates:

```text
BMP-S1-C01 — Namua / worstReplyActorFrontConnectionsDeltaNegative
BMP-S1-C02 — Namua / actorCaptureMoveDeltaNegative
BMP-S1-C03 — Namua / actorLegalMoveDeltaNegative
BMP-S1-C04 — Mtaji / allRepliesActorCaptureMoveDeltaNegative
```

## Stage 2 frozen identity

```text
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
```

Fresh Stage 2 population:

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
full replay/search verification = PASS
```

Stage 1 identity firewall final overlap:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

Formal support and measurement:

```text
G01 Namua = 1868
G02 Mtaji = 810
total formal measurements = 2678
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
independent verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
```

## Formal decision structure

Per candidate, two co-primary endpoints were preregistered:

```text
failure-signature recurrence — exact one-sided binomial H0 p<=0.50; observed floor >=0.65
D3-inferior recurrence       — exact one-sided binomial H0 p<=0.50; observed floor >=0.70
```

Eight planned tests used Holm-Bonferroni FWER 0.05. Confirmation also required:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Zero confirmed candidates was explicitly valid.

## Final formal result

| Candidate | Failure recurrence | D3-inferior recurrence | Formal decision |
| --- | ---: | ---: | --- |
| `BMP-S2-C01` | 0.923983 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C02` | 0.797645 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C03` | 0.794968 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C04` | 0.627160 | 0.507407 | **NOT-CONFIRMED** |

C01-C03 reproduce their frozen structural failure signatures strongly but do not reproduce D3-inferior status at the preregistered rate. C04 also falls below the absolute failure-signature floor.

All four candidates were estimable. No candidate was confirmed.

## Canonical formal identity

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
formal embedded resultHash = 1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
raw formal-result SHA-256 = e478d3fb29ad15508ddcaf6973d8eb8aa6bf4debd23921564ae08a1ac518293d
```

## Interpretation boundary

`NOT-CONFIRMED` applies only to the frozen machine-operational confirmation definition. It is not a proof of game-theoretic soundness and does not establish absence of human misconception, expert/traditional rejection, lack of pedagogical importance, causal mechanism, or external validity.

D3 is a frozen machine reference, not ground truth.

## Artifact policy

Large scientific data remain local:

```text
artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/
```

Compact machine-readable records and provenance are committed; large corpus/measurement/formal payloads are not.
