# Namua→Mtaji Strategic Temporal Transition — Stage 1 Final Extension Result

更新日: 2026-08-11  
Status: **COMPLETE / PASS / Stage 2 design-readiness minimum met**

## Scope

This document closes the final consumed Stage 1 exposure-support extension and the final exact-ply risk-set review. It does not inspect or report CBE-vs-control MTAJI-M1/MTAJI-M2 outcome contrasts.

## Corpus identity and verification

Final extension source commit:

```text
0f1ad87b5e0340e051003d2dfc81e32af3127cd8
```

Source tree was clean.

Fixed final extension:

```text
conditions = P2-D2 + V2-D2
paired opening replicates = 768
games = 1536
opening seeds = 20273001..20273768
opening plies = 8
max ply = 100
configHash = f7d3448da4a0f23b7c51451e471ba775d5e48571f27d881f4cee3b97e89a07f2
summaryHash = 8d39b48f783d7e338b811c674ac83762434d171d108575fad6fb9e36d7ca6271
```

Observed corpus:

```text
games = 1536
observations = 84787
unique historical trajectories = 983
duplicate historical trajectory groups = 455
largest trajectory group = 8
reached Mtaji = 1454
terminal before Mtaji = 82
administrative truncation = 1
```

Verification:

```text
full replay = passed
legal moves checked = 363297
legacy compatibility checks = 84787
phase transition events = 1454
paired opening replicates verified = 768
source hashes match = true
all integrity checks = passed
```

## Deterministic Namua clock

Final extension clock audit:

```text
reached Mtaji = 1454
first Mtaji at ply 44 = 1454/1454
terminal before Mtaji = 82
violations = 0
```

Therefore candidate-to-first-Mtaji remains deterministic clock distance, not survival time. Survival/hazard, acceleration, and delay claims remain unauthorized.

## Inherited Category-A pipeline

Historical definitions were reused unchanged:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

Result:

```text
Category A = 116
Category B = 467
Category C = 626
Category-A Namua = 49
Category-A Mtaji = 67
```

No threshold optimization or candidate-definition modification was performed.

## Final-extension phenotype support

Frozen classifier result:

```text
capture-branch-expansion = 15 Namua rows
capture-branch-convergence = 7 Namua + 10 Mtaji rows
temporary-spike = 2 Namua rows
namua-to-mtaji-precursor = 21 Namua rows
forcing-release-precursor = 4 Namua + 57 Mtaji rows
```

All 15 final-extension CBE rows were fully ascertained and reached Mtaji.

After complete-trajectory identity collapse, the 15 raw CBE rows contain:

```text
9 unique historicalTrajectoryHash + candidatePly units
9 unique CBE-bearing historical trajectories
```

Candidate plies represented by final-extension CBE include:

```text
13, 14, 17, 25, 32, 33, 35
```

## Combined Stage 1 exposure-support gate

Primary pilot + extension #1 + final extension:

```text
raw CBE condition rows = 23
unique CBE trajectory-ply units = 14
unique CBE historical trajectories = 14
CBE-bearing trajectories with multiple unique CBE units = 0
duplicate condition rows = 9
```

Combined candidate-ply support:

```text
13 = 1
14 = 1
17 = 1
24 = 1
25 = 1
26 = 2
27 = 1
32 = 1
33 = 2
35 = 3
```

Prospectively frozen Stage 2 readiness minimum:

```text
unique CBE trajectory-ply units >= 10
unique CBE historical trajectories >= 8
```

Observed:

```text
14 >= 10
14 >= 8
```

Decision:

> **PASS. Stage 2 design freeze is authorized after final risk-set review.**

This is a design-feasibility result, not statistical confirmation of a morphology relationship.

## Final-extension exact-ply R3 review

Final-extension risk-set audit:

```text
raw CBE rows = 15
unique CBE trajectory-ply exposures = 9
progression violations = 0
```

For every exposure-condition stratum, the strict R3 family remains abundant:

```text
R3 unique historical trajectories per stratum = 601..646
```

The final extension contains 455 duplicate historical-trajectory groups, including 391 groups spanning P2-D2 and V2-D2. Raw condition rows therefore remain non-independent whenever their complete historical trajectory is identical.

A direct exposure-vs-R3 structural positivity check was additionally performed without morphology labels. Across all 13 exposure-condition strata and all 28 audited candidate/landmark structural numeric fields:

```text
13 strata × 28 fields = 364 comparisons
out-of-R3-range exposure values = 0
```

Thus exact-ply R3 comparator support is not a blocking issue anywhere in the observed CBE clock range.

## Outcome firewall

No exploratory MTAJI-M1/MTAJI-M2 contrast was used to:

- pass the readiness gate;
- select the formal condition;
- select R3;
- set the formal sample size;
- choose the formal statistical unit;
- set the effect direction;
- choose the formal test.

All Stage 1 corpora are permanently consumed exploratory data and cannot enter Stage 2 confirmation.

## Stage 1 disposition

Stage 1 is now complete.

The next action is a prospective Stage 2 design freeze using a fresh held-out formal corpus. Further exposure-driven Stage 1 sampling is not authorized or needed.