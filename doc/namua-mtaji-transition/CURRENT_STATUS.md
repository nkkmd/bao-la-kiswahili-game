# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-12  
Status: **STUDY 1 CLOSED / REPOSITORY CLOSURE COMPLETE / FORMAL DECISION = NOT-CONFIRMED**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Final state:

```text
Stage 0 technical feasibility = CLOSED PASS
Stage 1 exploratory work = COMPLETE / CONSUMED
Stage 2 readiness = PASS
Stage 2 formal design = FROZEN
Stage 2 formal corpus = COMPLETE / VERIFIED
Stage 2 preoutcome matching = COMPLETE / PASS
G1 = PASS
G2 = PASS
outcome firewall = PASSED
frozen Mtaji artifact audit = PASS
primary formal evaluation = COMPLETE
formal decision = NOT-CONFIRMED
post-evaluation independent audit = PASS
final integration = COMPLETE
research status = CLOSED
```

No further Stage 2 sampling, primary analysis, rescue analysis, or outcome-dependent redesign is authorized.

## 1. Canonical closure records

First-read overview:

```text
doc/namua-mtaji-transition/STUDY_1_OVERVIEW.md
```

Scientific final integration:

```text
doc/namua-mtaji-transition/STUDY_1_FINAL_REPORT.md
```

Canonical formal result:

```text
doc/namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md
```

Reproducibility/provenance index:

```text
doc/namua-mtaji-transition/REPRODUCIBILITY_INDEX.md
```

Formal closure checkpoint:

```text
doc/namua-mtaji-transition/checkpoints/2026-08-12-study1-formal-closure.md
```

## 2. Immutable inherited boundaries

No closed-study decision is reopened.

### Phase-transition Study 1

```text
E-010 = NOT-CONFIRMED
E-011 = INCONCLUSIVE
E-017 = NOT-CONFIRMED
E-018 / H16 = CONFIRMED only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global NOT-CONFIRMED
E-020 / H18 = CONFIRMED only fixed hard / bao / depth3, legacy > phase2
```

Frozen CBE settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Historical Category-A settings:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

### Position-typology / playing-style Study 1

Frozen Mtaji classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit, restandardization, relabeling, feature change, or alternative-k rescue is authorized.

Namua discrete type remains unsupported. N-ACT/N-CON remain exploratory only. STYLE-C1..C4 exact geometry remains formal `NOT-CONFIRMED`.

## 3. Deterministic Namua clock — permanent boundary

For standard trajectories surviving Namua:

```text
initial total reserve = 44
first Mtaji observation = ply 44
Namua total reserve at ply t = 44 - t
```

Stage 2 reconfirmed:

```text
reached Mtaji games = 3886
first Mtaji at ply 44 = 3886 / 3886
violations = 0
```

Therefore candidate-to-first-Mtaji distance is deterministic progression, not survival time.

Permanent unauthorized interpretations:

- CBE accelerates Mtaji;
- CBE delays Mtaji;
- CBE changes first-Mtaji hazard;
- first-Mtaji timing is a survival endpoint.

## 4. Stage 1 — complete and consumed

All Stage 1 corpora are exploratory and permanently excluded from Stage 2 formal inference.

Combined readiness result:

```text
raw CBE condition rows = 23
unique CBE trajectory-ply units = 14
unique CBE historical trajectories = 14
readiness minimum = 10 units / 8 trajectories
result = PASS
```

Final exact-ply R3 support:

```text
601..646 unique controls per final-extension exposure-condition stratum
progression violations = 0
364 / 364 structural-range comparisons in-range
```

## 5. Frozen Stage 2 design

Formal condition:

```text
P2-D2 only
hard / bao / phase2 / depth2
```

Formal corpus:

```text
games = 4096
seeds = 20280001..20284096
opening = seeded-uniform-legal, 8 plies
max ply = 100
```

Exposure:

```text
unique historicalTrajectoryHash
earliest fully ascertained Namua CBE
maximum one exposure per trajectory
```

Comparator R3-M:

```text
same P2-D2
exact candidate ply
not Category A at exact index
same forced-capture status
no Namua CBE anywhere in control trajectory
first-Mtaji morphology eligible
20 unique controls per exposure
global control non-reuse
deterministic SHA-256 allocation
```

Primary test:

```text
Y=1 MTAJI-M1
Y=0 MTAJI-M2
matched-set exact conditional Poisson-binomial test
two-sided alpha = 0.05
one primary test
```

## 6. Formal corpus integrity — PASS

Formal source commit:

```text
b0e04a1c53d9c4d982a37c9489f3b56d9e6282ca
```

Observed corpus:

```text
games = 4096
observations = 227040
unique historical trajectories = 2874
reached Mtaji games = 3886
first-Mtaji morphology-eligible games = 3885
terminal before Mtaji games = 210
administrative truncation games = 3
```

Full replay, provenance, move legality, state identity, temporal outcome recomputation, seed range, single-condition, aggregate-view, and trajectory-hash checks all passed.

## 7. Preoutcome matching — PASS

```text
raw Namua CBE rows = 37
fully ascertained Namua CBE rows = 37
unique earliest-CBE trajectories = 31
terminal before Mtaji among earliest-CBE trajectories = 1
morphology-eligible exposed trajectories = 30
```

Estimability:

```text
G1: 30 >= 20 -> PASS
G2: exactly 20 controls for every exposure -> PASS
```

Matched structure:

```text
matched sets = 30
unique controls = 600
control reuse = 0
exposure/control overlap = 0
progression violations = 0
morphology labels read during matching = false
frozen Mtaji classifier loaded during matching = false
```

Frozen identities:

```text
matchingAssignmentHash
= b7de843fbe61f07fce9ac8a6143e73a1c2ff834f7e44b2600479af68991644b1

preoutcomeAssignmentCsvSha256
= bea056341b8f49d2a32f2ddffa5247a58ca87067f63371d77be362fbbc2e0374

eventTableSha256
= 84e80ce832e5f10c627f4fb09d906adaf201ecd1350b7764624b973af4af8d82
```

Independent review passed before outcome unlock commit:

```text
afe1ca9e9021f5f391c2cedbf9c0fcf8330aafcb
```

## 8. Frozen Mtaji artifact — PASS

```text
expected candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

stored hash = expected
recomputed hash = expected
classifier refit = false
restandardization = false
relabeling = false
```

## 9. Primary formal result — NOT-CONFIRMED

Observed first-Mtaji morphology:

```text
Exposed:
  MTAJI-M1 = 26
  MTAJI-M2 = 4
  M1 proportion = 0.8666666667

Matched controls:
  MTAJI-M1 = 509
  MTAJI-M2 = 91
  M1 proportion = 0.8483333333
```

Descriptive summaries:

```text
mean within-stratum matched risk difference = +0.0183333333
Mantel-Haenszel common OR = 1.1617647059
```

Primary exact conditional test:

```text
observed T = 26
p_lower = 0.6873577200535744
p_upper = 0.5180837673658513
p_two_sided = 1.0
alpha = 0.05
```

Frozen decision:

> **NOT-CONFIRMED**

No direction label is assigned. The positive descriptive difference is not a confirmed association and is not a rescue signal.

## 10. Final artifact audit — PASS

```text
matched sets = 30
total matched units = 630
1 exposed + 20 controls / set
600 / 600 unique controls
firstMtajiPly = 44 for 630 / 630
M1/M2-to-Y coding mismatches = 0
```

Morphology assignment SHA-256:

```text
961f5ef1c08447331642f10dbd4b67b9166f443a5909855ca2ac8ae38fe5e592
```

Primary counts, all stratum summaries, matched risk difference, MH OR, Poisson-binomial PMF, tail probabilities, and two-sided p-value were independently recomputed and matched the formal result exactly.

## 11. Final interpretation boundary

Allowed conclusion:

> Within the frozen P2-D2, first-Mtaji-morphology-eligible target population, prior fully ascertained Namua CBE was **not confirmed** to be associated with first-Mtaji frozen morphology relative to exact-ply R3-M controls.

Do not reinterpret as:

- proof of no downstream structural relationship;
- causal null effect;
- timing/hazard result;
- absence of all Namua→Mtaji structure;
- generalization beyond P2-D2;
- justification for subgroup/comparator/seed/threshold rescue.

## 12. Closed-study rule

Study 1 is closed.

Do not:

- append Stage 2 formal games;
- rerun with another seed block to seek significance;
- alter R3-M;
- change the 1:20 ratio;
- refit CBE or Mtaji classifiers;
- promote candidate-ply subgroup analyses into the completed primary result.

Any new confirmatory question must be separately preregistered and use fresh evidence.

`artifacts/local/` remains gitignored and uncommitted.
