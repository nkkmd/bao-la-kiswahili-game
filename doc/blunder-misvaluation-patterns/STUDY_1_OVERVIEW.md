# Blunder / Misvaluation Patterns Study 1 — Overview （概要）

更新日: 2026-08-23  
Status: **STUDY 1 CLOSED / STAGE 2 FORMAL COMPLETE / 0 CONFIRMED / 4 NOT-CONFIRMED**

## 研究題目

> **Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証**

## 最終状態

Study 1はStage 0→Stage 1 exploratory→Stage 2 formal confirmationの三段階構成で完了した。

```text
Stage 0 technical / construct audit = COMPLETE
Stage 1 fresh exploratory discovery = COMPLETE
Stage 2 fresh formal confirmation = COMPLETE
Study 1 = CLOSED
```

Stage 1で4件をexploratory promotionし、fresh Stage 2で全4件をformal evaluationした。4件すべてestimableであったが、全件`NOT-CONFIRMED`となった。

```text
formal candidates = 4
estimable = 4
confirmed = 0
not-confirmed = 4
```

## 研究上の分離

本Studyでは次を同一視しなかった。

```text
search-based decision loss
structural consequence
forcing / response-envelope failure
horizon / static misvaluation
empirical continuation outcome
game-theoretic blunder
human misconception
```

Primary machine referenceは`bao` evaluation / exact full-window root candidate search / D3 + Q1 / root-actor perspectiveである。D3はground truthではない。

## Stage 1 — exploratory discovery （Stageの記録）

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
distinct opening prefixes = 1621
selected unique rule states = 1200
Namua / Mtaji = 600 / 600
measured legal-move records = 5295
independent full replay/search verification = PASS
```

Frozen grammar / promotion ruleから4件をpromotionした。

| ID | Phase | Failure token | Stage 1 failure rate | Stage 1 D3 inferior |
| --- | --- | --- | ---: | ---: |
| `BMP-S1-C01` | Namua | `worstReplyActorFrontConnectionsDeltaNegative` | 1.000000 | 0.730769 |
| `BMP-S1-C02` | Namua | `actorCaptureMoveDeltaNegative` | 0.846154 | 0.730769 |
| `BMP-S1-C03` | Namua | `actorLegalMoveDeltaNegative` | 0.846154 | 0.730769 |
| `BMP-S1-C04` | Mtaji | `allRepliesActorCaptureMoveDeltaNegative` | 0.666667 | 0.703704 |

Stage 1 dataはStage 2 confirmation evidenceとして再利用していない。

## Stage 2 — fresh formal confirmation （Stageの記録）

Fresh formal corpus:

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
fullSearchRecomputation = true
independent corpus verification = PASS
```

Stage 1 identity firewall final overlap:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

Outcome-blind formal support:

```text
G01 Namua = 1868 unique roots
G02 Mtaji = 810 unique roots
total formal measurements = 2678
```

独立measurement verifierは、D3 candidate table、matcher / failure classification、exact measurement hashを別実装で再現した。

```text
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
passed = true
```

## Frozen confirmation rule （日本語の要点）

Per candidate, two co-primary endpoints were required:

```text
failure-signature recurrence: H0 p <= 0.50; observed floor >= 0.65
D3-inferior recurrence:       H0 p <= 0.50; observed floor >= 0.70
```

4 candidates × 2 endpoints = 8 testsについて、FWER 0.05でHolm-Bonferroni補正を行った。

Additional gates:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

confirmed candidateが0件となる可能性も、preregistrationで認めた有効なoutcomeだった。

## Final candidate results （結論）

| Candidate | Failure recurrence | D3 inferior | D3 TopSet | Median rank loss | Formal decision |
| --- | ---: | ---: | ---: | ---: | --- |
| `BMP-S2-C01` | 0.923983 | 0.464668 | 0.152034 | 0.500000 | **NOT-CONFIRMED** |
| `BMP-S2-C02` | 0.797645 | 0.464668 | 0.152034 | 0.500000 | **NOT-CONFIRMED** |
| `BMP-S2-C03` | 0.794968 | 0.464668 | 0.152034 | 0.500000 | **NOT-CONFIRMED** |
| `BMP-S2-C04` | 0.627160 | 0.507407 | 0.193827 | 0.500000 | **NOT-CONFIRMED** |

C01-C03ではfrozen structural failure signatureは強く再現したが、fresh Stage 2でD3-inferior recurrenceが0.464668に低下し、co-primary confirmation conditionを満たさなかった。

C04ではfailure-signature recurrence自体がabsolute floor 0.65を下回り、D3-inferior recurrenceも0.70を大きく下回った。

## Study 1 conclusion （結論）

```text
Stage 1 exploratory candidates = 4
Stage 2 formally evaluated = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
Study 1 = CLOSED
```

これは「Baoの悪手パターンが存在しない」ことを意味しない。今回の4つのexploratory candidatesが、凍結済みengine/search/populationとprospective ruleの下でmachine-confirmed blunder/misvaluation patternにならなかった、という限定されたformal resultである。

## Interpretation boundary （適用範囲と制限）

次の主張は認可されない。

```text
game-theoretic blunder / soundness
human misconception or absence thereof
expert/traditional recognition or rejection
pedagogical importance or lack thereof
causal mechanism
external validity beyond the frozen system
```

## Canonical records （日本語の要点）

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`results/STAGE_1_DISCOVERY_RESULT.json`](results/STAGE_1_DISCOVERY_RESULT.json)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
