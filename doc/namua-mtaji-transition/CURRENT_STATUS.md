# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-12  
Status: **ACTIVE / Stage 2 PRIMARY FORMAL ANALYSIS COMPLETE / NOT-CONFIRMED / final integration**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Current formal state:

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
```

Canonical formal result:

```text
doc/namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md
```

Formal completion checkpoint:

```text
doc/namua-mtaji-transition/checkpoints/2026-08-12-stage2-formal-not-confirmed.md
```

## 1. Immutable inherited boundaries

No closed-study decision is reopened.

### Phase-transition Study 1

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

Frozen CBE settings remain:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Historical Category-A settings remain:

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

Namua discrete type remains unsupported. N-ACT/N-CON remain exploratory only. STYLE-C1..C4 exact geometry remains formal not-confirmed.

## 2. Deterministic Namua clock — permanent interpretation boundary

For standard trajectories surviving Namua:

```text
initial total reserve = 44
first Mtaji observation = ply 44
Namua total reserve at ply t = 44 - t
```

The Stage 2 formal corpus reconfirmed this invariant:

```text
reached Mtaji games = 3886
first Mtaji at ply 44 = 3886 / 3886
violations = 0
```

Therefore candidate-to-first-Mtaji distance is deterministic progression, not survival time.

Unauthorized interpretations remain:

- CBE accelerates Mtaji;
- CBE delays Mtaji;
- CBE changes first-Mtaji hazard;
- first-Mtaji timing is a survival endpoint.

## 3. Stage 1 — COMPLETE / CONSUMED

All Stage 1 corpora are permanently consumed exploratory data and do not enter Stage 2 formal inference.

Combined readiness result:

```text
raw CBE condition rows = 23
unique CBE trajectory-ply units = 14
unique CBE historical trajectories = 14
readiness minimum = 10 units / 8 trajectories
result = PASS
```

Final exact-ply R3 support remained abundant:

```text
601..646 unique controls per final-extension exposure-condition stratum
progression violations = 0
364 / 364 structural-range comparisons in-range
```

Canonical Stage 1 records:

- `STAGE_1_RESULT.md`
- `STAGE_1_EXTENSION_RESULT.md`
- `STAGE_1_FINAL_EXTENSION_RESULT.md`
- `STAGE_1_RISKSET_RESULT.md`
- `STAGE_1_EXTENSION_RISKSET_RESULT.md`

## 4. Frozen Stage 2 formal design

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
earliest fully ascertained Namua CBE only
maximum one exposure per historical trajectory
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

## 5. Formal corpus integrity — PASS

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

Full replay, source provenance, move legality, state identity, temporal outcome recomputation, seed range, single-condition, aggregate-view, and trajectory-hash checks all passed.

## 6. Stage 2 preoutcome matching — PASS

Frozen event classification:

```text
raw Namua CBE rows = 37
fully ascertained Namua CBE rows = 37
unique earliest-CBE historical trajectories = 31
```

One earliest-CBE trajectory terminated before Mtaji, leaving:

```text
morphology-eligible unique exposed trajectories = 30
```

Estimability:

```text
G1: 30 >= 20 -> PASS
G2: exactly 20 controls for every exposure -> PASS
```

Final preoutcome structure:

```text
matched sets = 30
unique controls = 600
control reuse = 0
exposure/control overlap = 0
progression violations = 0
morphology labels read during matching = false
frozen Mtaji classifier loaded during matching = false
```

Frozen identity:

```text
matchingAssignmentHash
= b7de843fbe61f07fce9ac8a6143e73a1c2ff834f7e44b2600479af68991644b1

preoutcomeAssignmentCsvSha256
= bea056341b8f49d2a32f2ddffa5247a58ca87067f63371d77be362fbbc2e0374

eventTableSha256
= 84e80ce832e5f10c627f4fb09d906adaf201ecd1350b7764624b973af4af8d82
```

Independent preoutcome review passed before outcome unlock.

Outcome unlock commit:

```text
afe1ca9e9021f5f391c2cedbf9c0fcf8330aafcb
```

## 7. Frozen Mtaji artifact — PASS

```text
stored candidateDefinitionHash = expected
recomputed candidateDefinitionHash = expected
expected = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
classifier refit = false
restandardization = false
relabeling = false
```

## 8. Stage 2 primary formal result — NOT-CONFIRMED

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

Prespecified descriptive summaries:

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

Frozen decision rule gives:

> **formal decision = NOT-CONFIRMED**

No direction label is assigned. The positive descriptive risk difference is not a confirmed association and must not be used as a rescue interpretation.

## 9. Final artifact audit — PASS

The post-evaluation morphology assignment contains:

```text
30 matched sets
630 total units
1 exposed + 20 controls in every set
600 / 600 unique controls
firstMtajiPly = 44 for 630 / 630
M1/M2-to-Y coding mismatches = 0
```

The preoutcome assignment columns and ordering were preserved exactly.

Morphology assignment SHA-256:

```text
961f5ef1c08447331642f10dbd4b67b9166f443a5909855ca2ac8ae38fe5e592
```

The primary counts, risk difference, MH OR, Poisson-binomial PMF, tail probabilities, two-sided p-value, and all 30 stratum summaries were independently recomputed and matched the formal result exactly.

## 10. Interpretation boundary after the negative formal result

Allowed conclusion:

> Within the frozen P2-D2, first-Mtaji-morphology-eligible target population, prior fully ascertained Namua CBE was **not confirmed** to be associated with first-Mtaji frozen morphology relative to exact-ply R3-M controls.

Do not reinterpret this as:

- proof that CBE has no later structural relationship;
- proof of no temporal structure of any kind;
- a causal null effect;
- a timing/hazard result;
- generalization beyond P2-D2;
- license to choose favorable candidate-ply subgroups, alternative comparators, thresholds, seed blocks, or additional games.

Any new confirmatory claim requires a separately preregistered fresh study/corpus.

## 11. Immediate next action

The primary formal analysis is finished. Do **not** rerun Stage 2 with alternative seeds or specifications.

Current work is final integration only:

1. preserve `STAGE_2_FORMAL_RESULT.md` as the canonical Stage 2 result;
2. update repository-facing overview/index documents without changing the formal decision;
3. identify any genuinely new future research questions as separate studies;
4. leave `artifacts/local/` gitignored and uncommitted.

No PR is opened at this stage unless separately requested.
