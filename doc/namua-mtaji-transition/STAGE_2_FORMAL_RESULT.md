# Namua→Mtaji Strategic Temporal Transition — Stage 2 Formal Result

更新日: 2026-08-12  
Status: **COMPLETE / FORMAL DECISION = NOT-CONFIRMED**

## 1. Formal question

The prospectively frozen Stage 2 test asked, within the fixed

```text
hard / bao / phase2 / depth2
P2-D2
```

condition and among trajectories eligible for first-Mtaji morphology, whether a prior fully ascertained Namua `capture-branch-expansion` (CBE) was associated with frozen first-Mtaji morphology relative to exact-ply R3-M controls.

This is a bounded association test. It is not a causal or Mtaji-timing test.

## 2. Frozen formal corpus identity

```text
games = 4096
opening seeds = 20280001..20284096
opening policy = seeded-uniform-legal
opening plies = 8
max ply = 100
condition = P2-D2 only
formal source commit = b0e04a1c53d9c4d982a37c9489f3b56d9e6282ca
input config hash = 9485ef557e3ee00e3719e754c4ed202ca408a2bd0866a9f596896046406a17c3
formal spec SHA-256 = 92d763e2ae9a1c05c414946bb9425b00f3865eed0dfcd6cf65aa7a20a57574bc
```

No early stopping, post-outcome extension, favorable reseeding, threshold relaxation, comparator relaxation, or rescue sampling was performed.

Observed corpus:

```text
games = 4096
observations = 227040
unique historical trajectories = 2874
duplicate historical-trajectory groups = 615
largest trajectory group = 21
reached Mtaji games = 3886
first-Mtaji morphology-eligible games = 3885
terminal before Mtaji games = 210
administrative truncation games = 3
```

## 3. Integrity and deterministic-clock gates

Full formal verification passed.

```text
full replay = passed
stored observation recomputation = passed
legacy phase-transition compatibility = passed
move legality = passed
before/after state identity = passed
phase monotonicity = passed
phase-event linkage = passed
first-Mtaji reserve exhaustion = passed
temporal outcome recomputation = passed
trajectory hash = passed
formal seed range = passed
single formal condition = passed
aggregate views = passed
source provenance = passed
source hashes match = true
```

The deterministic Namua clock audit also passed:

```text
reached Mtaji = 3886
first Mtaji at ply 44 = 3886 / 3886
terminal before Mtaji = 210
progression violations = 0
```

Therefore candidate-to-first-Mtaji distance remains deterministic progression, not a survival/hazard endpoint.

## 4. Inherited Category-A and frozen CBE classification

The historical Category-A pipeline was reused unchanged:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

No threshold optimization, candidate-definition modification, morphology inspection, or effect testing was used in preprocessing.

Observed Category-A counts:

```text
A = 292
B = 1266
C = 1737
Category-A Namua = 120
Category-A Mtaji = 172
```

Frozen temporal-event classification produced:

```text
raw Namua CBE rows = 37
fully ascertained Namua CBE rows = 37
unique earliest-CBE historical trajectories = 31
```

## 5. Preoutcome R3-M matching and estimability

The frozen exposure unit was the earliest fully ascertained Namua CBE per unique `historicalTrajectoryHash`.

One of the 31 earliest-CBE trajectories terminated before Mtaji, leaving:

```text
morphology-eligible unique exposed trajectories = 30
administrative truncation among earliest-CBE trajectories = 0
```

Formal gates:

```text
G1 required >= 20 morphology-eligible unique exposed trajectories
G1 observed = 30
G1 = PASS

G2 required = exactly 20 unique R3-M controls per exposure
G2 = PASS
```

The 30 matched sets contained:

```text
1 exposed + 20 controls per set
600 control assignments
600 unique control historical trajectories
global control reuse = 0
exposure/control historical-trajectory overlap = 0
progression violations = 0
```

Matching occurred before any M1/M2 label was read and without loading the frozen Mtaji classifier.

Frozen preoutcome identity:

```text
eventTableSha256 = 84e80ce832e5f10c627f4fb09d906adaf201ecd1350b7764624b973af4af8d82
matchingAssignmentHash = b7de843fbe61f07fce9ac8a6143e73a1c2ff834f7e44b2600479af68991644b1
preoutcomeAssignmentCsvSha256 = bea056341b8f49d2a32f2ddffa5247a58ca87067f63371d77be362fbbc2e0374
```

Independent preoutcome review passed before outcome unlock. The exact binding was committed in:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
unlock commit = afe1ca9e9021f5f391c2cedbf9c0fcf8330aafcb
unlock file SHA-256 = b0d9f7832b565a2f558bb7c86514768f1b8c525719ab3a4deaf508cbf62ac271
```

## 6. Frozen Mtaji classifier audit

The historical frozen classifier was used without refit, restandardization, or relabeling.

```text
expected candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

stored hash = expected
recomputed hash = expected
classifier refit = false
restandardization = false
relabeling = false
```

All 630 matched units were classified at first eligible Mtaji ply 44.

## 7. Primary formal outcome

Binary coding remained frozen:

```text
Y = 1 : MTAJI-M1
Y = 0 : MTAJI-M2
```

Observed outcomes:

```text
Exposed trajectories:
  MTAJI-M1 = 26
  MTAJI-M2 = 4
  M1 proportion = 0.8666666667

Matched controls:
  MTAJI-M1 = 509
  MTAJI-M2 = 91
  M1 proportion = 0.8483333333
```

Prespecified descriptive summaries:

```text
mean within-stratum matched risk difference = +0.0183333333
Mantel-Haenszel common odds ratio = 1.1617647059
```

These descriptive values do not control the formal decision.

## 8. Primary exact conditional test

The single preregistered primary test was the matched-set exact conditional Poisson-binomial test.

```text
matched sets = 30
controls per set = 20
observed T = 26 exposed MTAJI-M1 trajectories
p_lower = 0.6873577200535744
p_upper = 0.5180837673658513
p_two_sided = 1.0
alpha = 0.05
two-sided
```

Formal rule:

```text
p < 0.05  -> confirmed-association
p >= 0.05 -> not-confirmed
```

Observed:

```text
1.0 >= 0.05
```

Therefore the formal decision is:

> **NOT-CONFIRMED.**

No direction label is assigned because the association was not formally confirmed.

## 9. Independent final-artifact audit

After evaluation, the morphology assignment CSV and formal result were independently checked against the frozen preoutcome assignment.

```text
stage2-matched-sets-with-morphology.csv rows = 630
matched sets = 30
set structure = 1 exposed + 20 controls for every set
firstMtajiPly = 44 for 630 / 630 rows
M1/M2 <-> Y coding mismatches = 0
preoutcome assignment columns/order changed = no
unique controls = 600 / 600
control reuse = 0
exposure/control overlap = 0
```

The morphology CSV SHA-256 is:

```text
961f5ef1c08447331642f10dbd4b67b9166f443a5909855ca2ac8ae38fe5e592
```

The primary M1/M2 counts, matched risk difference, Mantel-Haenszel OR, full Poisson-binomial PMF, lower/upper tails, two-sided p-value, and all 30 stratum summaries were independently recomputed from the CSV and matched the formal result exactly.

## 10. Interpretation boundary

The supported conclusion is limited to:

> Within the frozen P2-D2, first-Mtaji-morphology-eligible target population, the preregistered analysis did **not confirm** an association between prior fully ascertained Namua CBE and first-Mtaji frozen morphology relative to exact-ply R3-M controls.

This result does **not** authorize the claims that:

- CBE has no relationship to all later Bao structure;
- CBE causes or does not cause MTAJI-M1/MTAJI-M2;
- CBE accelerates or delays Mtaji;
- CBE changes first-Mtaji hazard;
- the result generalizes beyond P2-D2;
- MTAJI-M1/MTAJI-M2 are universal Bao strategic types;
- candidate-ply subgroups or alternative comparators can be used post hoc to rescue the primary result.

The small positive descriptive difference (`+0.0183`) is not a confirmed association and must not be promoted as a positive formal finding.

## 11. Formal disposition

```text
Stage 0 technical feasibility = CLOSED PASS
Stage 1 exploratory work = COMPLETE / CONSUMED
Stage 2 readiness = PASS
Stage 2 formal corpus = COMPLETE / VERIFIED
Stage 2 preoutcome matching = PASS
G1 = PASS
G2 = PASS
outcome firewall = PASSED
frozen Mtaji artifact = PASS
primary formal evaluation = COMPLETE
formal decision = NOT-CONFIRMED
```

No rescue analysis changes this decision. Any new secondary/exploratory analysis must be explicitly labeled as such, and any new confirmatory claim requires a separately preregistered fresh study/corpus.
