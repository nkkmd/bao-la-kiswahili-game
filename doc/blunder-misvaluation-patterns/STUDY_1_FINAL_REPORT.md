# Blunder / Misvaluation Patterns Study 1 — Final Report

更新日: 2026-08-23  
Status: **STUDY 1 CLOSED / 4 FORMAL CANDIDATES EVALUATED / 0 CONFIRMED / 4 NOT-CONFIRMED**

## 研究題目

> **Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証**

## 結論

Stage 1 exploratory discoveryでpromotionされた4件を、fresh Stage 2 corpusでprospectiveにformal confirmationした。

```text
formal candidates = 4
estimable candidates = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
INCONCLUSIVE-NOT-ESTIMABLE = 0
TECHNICAL-INCONCLUSIVE = 0
```

したがって本Studyのformal conclusionは、**4 exploratory candidatesのいずれも、事前固定したfailure-signature recurrence + D3-inferior recurrenceのco-primary confirmation ruleを満たさなかった**、である。

これは「4候補がgame-theoretically悪手ではない」という意味ではない。また、人間にとって錯覚しにくい、expert/traditional knowledgeに存在しない、教育価値がない、とも結論しない。

## Study architecture

```text
Stage 0 — technical / construct audit                 COMPLETE
Stage 1 — fresh exploratory discovery                COMPLETE
Stage 2 — fresh prospective formal confirmation      COMPLETE
Study 1                                                CLOSED
```

Stage 1 supportはStage 2 confirmation evidenceとして再利用していない。

## Stage 1 exploratory result

Fresh Stage 1 corpus:

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
selected roots = 1200
measured exact legal moves = 5295
```

Frozen grammar / promotion ruleから4件をpromotionした。

```text
BMP-S1-C01
BMP-S1-C02
BMP-S1-C03
BMP-S1-C04
```

これらはStage 1時点ではexploratory candidatesであり、confirmation claimはなかった。

## Stage 2 formal population

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
independent full replay/search verification = PASS
fullSearchRecomputation = true
```

Stage 1 identity firewall:

```text
historicalTrajectoryHash overlap = 0
openingPrefixHash overlap = 0
ruleStateKey overlap = 0
```

No replacement, seed extension, or alternate-root rescue was used.

## Outcome-blind formal support

```text
BMP-S2-G01-NAMUA selected/measured roots = 1868
BMP-S2-G02-MTAJI selected/measured roots = 810
total formal measurements = 2678
```

C01/C02/C03 share the same G01 support and exact candidate move. They differ only in failure token. C04 uses G02.

All four candidates passed all preregistered estimability gates.

## Independent measurement verification

```text
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
independent measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
measurementHashMatches = true
independent D3 candidate-table recomputation = true
independent matcher/failure recomputation = true
stage1IdentityFirewallPassed = true
passed = true
```

## Frozen formal decision rule

Each candidate had two co-primary endpoints:

```text
P1 failure-signature recurrence
   H0 p <= 0.50
   absolute observed-rate floor >= 0.65

P2 D3-inferior recurrence
   H0 p <= 0.50
   absolute observed-rate floor >= 0.70
```

Across 4 candidates × 2 endpoints = 8 tests, Holm-Bonferroni FWER 0.05 was fixed prospectively.

Additional consistency gates:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

A candidate required all formal conditions to be `CONFIRMED`.

## Candidate-level formal results

| Candidate | Failure recurrence | D3-inferior recurrence | D3 TopSet | Median rank loss | Formal decision |
| --- | ---: | ---: | ---: | ---: | --- |
| `BMP-S2-C01` | 0.923983 | 0.464668 | 0.152034 | 0.500000 | **NOT-CONFIRMED** |
| `BMP-S2-C02` | 0.797645 | 0.464668 | 0.152034 | 0.500000 | **NOT-CONFIRMED** |
| `BMP-S2-C03` | 0.794968 | 0.464668 | 0.152034 | 0.500000 | **NOT-CONFIRMED** |
| `BMP-S2-C04` | 0.627160 | 0.507407 | 0.193827 | 0.500000 | **NOT-CONFIRMED** |

### C01

The frozen response-envelope failure signature reproduced strongly:

```text
1726 / 1868 = 0.923983
Holm-adjusted p = 0
floor 0.65 = PASS
```

However D3-inferior recurrence was:

```text
868 / 1868 = 0.464668
Holm-adjusted p = 1
floor 0.70 = FAIL
```

Therefore `NOT-CONFIRMED`.

### C02

The immediate structural failure signature reproduced strongly:

```text
1490 / 1868 = 0.797645
Holm-adjusted p = 3.995751301553668e-155
floor 0.65 = PASS
```

But the shared G01 D3-inferior recurrence remained 0.464668 and failed the D3 co-primary endpoint. Therefore `NOT-CONFIRMED`.

### C03

The immediate structural failure signature also reproduced strongly:

```text
1485 / 1868 = 0.794968
Holm-adjusted p = 3.1297556505619717e-152
floor 0.65 = PASS
```

Again, the shared G01 D3-inferior recurrence was 0.464668. Therefore `NOT-CONFIRMED`.

### C04

C04 showed:

```text
failure-signature recurrence = 508 / 810 = 0.627160
D3-inferior recurrence       = 411 / 810 = 0.507407
```

The failure-signature endpoint is statistically above the `p=0.50` null after Holm adjustment, but the preregistered absolute confirmation floor 0.65 is not met. The D3-inferior endpoint also fails both the 0.70 floor and the adjusted significance criterion. Therefore `NOT-CONFIRMED`.

## Scientific interpretation

The most important result is the separation between **structural failure recurrence** and **D3 search-based inferiority recurrence**.

C01-C03 show that the frozen move pattern frequently reproduces the specified structural consequence, yet in fresh Stage 2 positions it does **not** recur as a D3-inferior move at the preregistered rate. Consequently these candidates cannot be promoted to machine-confirmed blunder/misvaluation patterns under the frozen operational definition.

C04 is weaker still: its structural failure recurrence itself falls below the absolute confirmation floor, and D3 inferiority does not replicate at the required rate.

Thus Stage 1's small exploratory support correctly remained exploratory; the larger fresh confirmation population did not sustain the combined confirmation rule.

## What is not authorized

The result does not authorize claims that:

```text
these moves are game-theoretically sound
these moves are never mistakes
human players do or do not misperceive them
experts or traditional Bao theory recognize or reject them
these patterns have or lack pedagogical importance
the observed structural changes causally explain wins/losses
results generalize to different engines/search settings/populations
```

D3 remains a frozen machine reference, not ground truth.

## No-rescue closure

No post-outcome change is authorized or performed:

```text
seed extension = false
replacement sampling = false
candidate edit/merge/split = false
matcher retuning = false
failure-token substitution = false
phase reassignment = false
endpoint substitution = false
null/floor retuning = false
multiplicity/alpha change = false
alternate primary depth/evaluator selection = false
favorable subgroup promotion = false
manual override = false
```

Zero confirmed candidates was an explicitly valid preregistered outcome.

## Canonical identities

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
formal embedded resultHash = 1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
raw formal-result file SHA-256 = e478d3fb29ad15508ddcaf6973d8eb8aa6bf4debd23921564ae08a1ac518293d
```

Canonical compact record:

- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)

## Final Study 1 state

```text
Stage 1 exploratory candidates = 4
Stage 2 formally evaluated = 4
confirmed = 0
not-confirmed = 4
Study 1 = CLOSED
```
