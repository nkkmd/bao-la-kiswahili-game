# Namua→Mtaji Strategic Temporal Transition — Study 1 Final Report

更新日: 2026-08-12  
Status: **RESEARCH COMPLETE / FINAL INTEGRATION / PRIMARY FORMAL RESULT = NOT-CONFIRMED**

## 1. Study identity

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

本研究は、完了済みの

1. 局面相転移点 Study 1
2. 局面類型と棋風 Study 1

から生じた未推定部分を扱うprospectiveな独立研究である。

既存Studyのformal decision、classifier、threshold、negative/null/inconclusive result、interpretation boundaryを変更・救済することを目的としない。

## 2. Inherited scientific boundaries

### 2.1 Phase-transition Study 1

以下をimmutableとして継承した。

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

Frozen capture-branch-expansion settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Inherited Category-A definition:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

### 2.2 Position-typology / playing-style Study 1

Frozen Mtaji classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit, restandardization, relabeling, feature change, or alternative-k rescue was permitted.

Namua discrete type remained unsupported. `N-ACT/N-CON` remained exploratory coordinates only. `STYLE-C1..C4` exact geometry remained formal not-confirmed.

## 3. Initial research question and Stage 0 correction

The initial research agenda considered temporal distance from CBE to first Mtaji as a possible endpoint. Stage 0 established that, for a standard trajectory surviving Namua, first Mtaji timing is mechanically determined by reserve exhaustion:

```text
initial total reserve = 44
Namua total reserve at ply t = 44 - t
first Mtaji observation = ply 44
```

This made `time-to-first-Mtaji`, survival, hazard, acceleration, and delay unsuitable as strategic inferential endpoints in the frozen engine.

This was not an outcome-driven amendment. It was established before Stage 2 formal generation and permanently constrained interpretation.

The formal research question therefore became:

> Within a fixed P2-D2 population that reaches an eligible first Mtaji state, is frozen first-Mtaji morphology associated with a previously ascertained Namua CBE relative to exact-ply structurally eligible controls with no Namua CBE?

## 4. Stage 0 — technical feasibility

Stage 0 verified that the study could reconstruct and audit:

- exact temporal observations and phase transitions;
- historical trajectory identity;
- inherited Category-A representatives;
- frozen Namua event classification;
- frozen first-Mtaji morphology features;
- complete replay and source provenance;
- deterministic Namua clock behavior.

Stage 0 closed PASS.

The central scientific consequence was the deterministic-clock boundary described above.

## 5. Stage 1 — exploratory design development

All Stage 1 data were prospectively designated exploratory and permanently consumed before Stage 2 formal inference.

### 5.1 Primary pilot

```text
paired openings = 32
conditions = 6
games = 192
observations = 11083
unique CBE trajectory-ply units = 1
unique CBE historical trajectories = 1
```

This was insufficient for formal design freeze.

### 5.2 Exact-ply risk-set development

Prospective nested comparator families were audited without morphology labels:

```text
R0 = same condition + exact candidate ply
R1 = R0 + not Category A at exact index
R2 = R1 + same forced-capture status
R3 = R2 + no Namua CBE anywhere in control trajectory
```

At the primary-pilot CBE clock position, strict R3 retained 31 unique trajectories in each P2-D2 and V2-D2 condition and had no deterministic progression violation.

### 5.3 Exposure-support extension #1

```text
conditions = P2-D2 + V2-D2
paired openings = 384
games = 768
seeds = 20272001..20272384
unique CBE trajectory-ply units = 4
unique CBE historical trajectories = 4
```

R3 support at observed plies 24/26/27 was 331..334 unique controls per exposure-condition stratum, with zero progression violations.

### 5.4 Final exposure-support extension

```text
conditions = P2-D2 + V2-D2
paired openings = 768
games = 1536
seeds = 20273001..20273768
observations = 84787
unique historical trajectories = 983
```

Full replay and deterministic-clock gates passed.

Final extension CBE support:

```text
raw Namua CBE rows = 15
unique earliest-CBE historical trajectories = 9
```

Strict R3 support remained 601..646 unique trajectories per exposure-condition stratum.

Direct structural positivity review:

```text
13 exposure-condition strata
28 numeric candidate/landmark fields
364 comparisons
out-of-R3-range exposure values = 0
```

### 5.5 Stage 1 readiness decision

Combined Stage 1:

```text
raw CBE condition rows = 23
unique CBE trajectory-ply units = 14
unique CBE historical trajectories = 14
```

Frozen readiness minimum:

```text
units >= 10
trajectories >= 8
```

Decision:

```text
PASS
```

No CBE-vs-control M1/M2 contrast was inspected to reach this decision.

## 6. Stage 2 prospective formal design

Stage 2 was frozen before held-out generation.

### 6.1 Formal condition

```text
condition = P2-D2 only
level = hard
evaluator = bao
search = phase2
maxDepth = 2
```

This scope was outcome-independent and inherited from the bounded context in which phase-transition Study 1 E-018/H16 supported CBE.

### 6.2 Formal corpus

```text
games = 4096
opening seeds = 20280001..20284096
opening policy = seeded-uniform-legal
opening plies = 8
max ply = 100
```

Prohibited:

- early stopping;
- post-outcome extension;
- favorable reseeding;
- rescue sampling;
- threshold relaxation;
- comparator relaxation.

### 6.3 Exposure unit

```text
unique historicalTrajectoryHash
earliest fully ascertained Namua CBE
maximum one exposure per trajectory
```

### 6.4 Target population

```text
firstMtajiMorphologyEligible == true
```

CBE trajectories terminating before Mtaji were not assigned M1/M2 values.

### 6.5 Formal comparator R3-M

A control was required to satisfy:

```text
same P2-D2 condition
exact candidate ply
nonterminal Namua at index
observation through candidate ply + 8
not Category A at exact index
same actor forced-capture status
no Namua CBE anywhere in the control historical trajectory
first-Mtaji morphology eligible
not previously allocated to another matched set
```

The `no CBE anywhere` exclusion conservatively used every inherited Namua Category-A row classified CBE, not only rows that qualified as formal exposures.

Allocation:

```text
20 unique controls per exposure
global control reuse = false
exposure order = frozen SHA-256 ranking
control rank = frozen SHA-256 ranking
```

No matching on capture/front-row quantities that could constitute or mediate the phenotype was allowed.

### 6.6 Estimability gates

```text
G1: morphology-eligible unique exposed trajectories >= 20
G2: every exposure receives exactly 20 unique R3-M controls
```

Frozen failure decisions:

```text
G1 fail -> inconclusive-insufficient-exposure
G2 fail -> inconclusive-comparator-shortage
```

### 6.7 Primary outcome and test

```text
Y = 1 : MTAJI-M1
Y = 0 : MTAJI-M2
```

Primary test:

```text
matched-set exact conditional Poisson-binomial test
alpha = 0.05
two-sided
one primary test
```

For matched stratum `i` with one exposed and 20 controls:

```text
n_i = 21
m_i = total M1 units in the stratum
p_i = m_i / n_i
T = number of exposed M1 trajectories
```

The null distribution of `T` was the exact Poisson-binomial convolution over `{p_i}`.

Two-sided rule:

```text
p_lower = P(T <= T_obs)
p_upper = P(T >= T_obs)
p_two_sided = min(1, 2 * min(p_lower, p_upper))
```

Formal rule:

```text
p < .05  -> confirmed-association
p >= .05 -> not-confirmed
```

Direction labels were permitted only after significance.

## 7. Outcome firewall

Stage 2 used the following frozen execution order:

```text
formal generation
-> full verification
-> deterministic clock audit
-> inherited Category-A extraction
-> frozen CBE classification
-> R3-M preoutcome matching
-> HARD STOP / independent review
-> exact outcome-unlock commit
-> frozen Mtaji artifact audit
-> M1/M2 evaluation
```

The matching phase did not load the Mtaji classifier and recorded:

```text
morphologyLabelsRead = false
frozenMtajiClassifierLoaded = false
controlSelectionUsedM1M2 = false
effectTestingPerformed = false
```

The exact preoutcome assignment was independently reviewed before the outcome unlock was committed.

## 8. Formal corpus integrity

Formal source commit:

```text
b0e04a1c53d9c4d982a37c9489f3b56d9e6282ca
```

Input config hash:

```text
9485ef557e3ee00e3719e754c4ed202ca408a2bd0866a9f596896046406a17c3
```

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

Verification passed for:

- full replay;
- stored-observation recomputation;
- legacy phase-transition compatibility;
- move legality;
- before/after state identity;
- phase monotonicity;
- phase-event linkage;
- first-Mtaji reserve exhaustion;
- temporal outcome recomputation;
- trajectory hash;
- formal seed range;
- single formal condition;
- aggregate views;
- source provenance.

Deterministic clock:

```text
reached Mtaji = 3886
first Mtaji at ply 44 = 3886 / 3886
violations = 0
```

## 9. Formal exposure and matching result

Inherited Category-A pipeline used the frozen thresholds unchanged and read no morphology labels.

Category-A counts:

```text
A = 292
B = 1266
C = 1737
Category-A Namua = 120
Category-A Mtaji = 172
```

Frozen event classification:

```text
Namua CBE rows = 37
fully ascertained Namua CBE rows = 37
unique earliest-CBE historical trajectories = 31
```

Of 31 earliest-CBE trajectories:

```text
terminal before Mtaji = 1
administrative truncation = 0
morphology-eligible exposures = 30
```

Estimability:

```text
G1 observed 30 >= 20 -> PASS
G2 exactly 20 controls for every exposure -> PASS
```

Matched structure:

```text
matched sets = 30
exposed trajectories = 30
control assignments = 600
unique control trajectories = 600
control reuse = 0
exposure/control overlap = 0
progression violations = 0
```

Frozen matching identity:

```text
formalSpecSha256
= 92d763e2ae9a1c05c414946bb9425b00f3865eed0dfcd6cf65aa7a20a57574bc

eventTableSha256
= 84e80ce832e5f10c627f4fb09d906adaf201ecd1350b7764624b973af4af8d82

matchingAssignmentHash
= b7de843fbe61f07fce9ac8a6143e73a1c2ff834f7e44b2600479af68991644b1

preoutcomeAssignmentCsvSha256
= bea056341b8f49d2a32f2ddffa5247a58ca87067f63371d77be362fbbc2e0374
```

Outcome unlock commit:

```text
afe1ca9e9021f5f391c2cedbf9c0fcf8330aafcb
```

## 10. Frozen Mtaji classifier integrity

Final classifier audit:

```text
expected hash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

stored hash = expected
recomputed hash = expected
classifier refit = false
restandardization = false
relabeling = false
```

All 630 matched units were classified at first eligible Mtaji ply 44.

## 11. Primary formal result

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
Mantel-Haenszel common odds ratio = 1.1617647059
```

Primary exact conditional test:

```text
observed T = 26
p_lower = 0.6873577200535744
p_upper = 0.5180837673658513
p_two_sided = 1.0
alpha = 0.05
```

Formal decision:

> **NOT-CONFIRMED**

Direction:

```text
none / null
```

The small positive descriptive risk difference is not a confirmed association and does not receive a directional formal label.

## 12. Independent post-evaluation audit

The morphology assignment artifact was independently audited after evaluation.

```text
rows = 630
matched sets = 30
1 exposed + 20 controls in every set
unique controls = 600 / 600
control reuse = 0
exposure/control overlap = 0
firstMtajiPly = 44 for 630 / 630
M1/M2-to-Y coding mismatches = 0
```

The six preoutcome assignment columns and row ordering were preserved exactly.

Morphology assignment SHA-256:

```text
961f5ef1c08447331642f10dbd4b67b9166f443a5909855ca2ac8ae38fe5e592
```

The following were independently recomputed from the uploaded morphology assignment and exactly matched the machine result:

- exposed/control M1/M2 counts;
- all 30 stratum summaries;
- matched risk difference;
- Mantel-Haenszel common odds ratio;
- Poisson-binomial PMF;
- `p_lower`;
- `p_upper`;
- `p_two_sided`.

## 13. Scientific interpretation

### 13.1 Supported conclusion

Within the frozen P2-D2, first-Mtaji-morphology-eligible target population:

> Prior fully ascertained Namua `capture-branch-expansion` was **not confirmed** to be associated with first-Mtaji frozen `MTAJI-M1 / MTAJI-M2` morphology relative to exact-ply R3-M controls.

### 13.2 Not supported

The result does not support claims that:

- CBE causes M1 or M2;
- CBE has no later structural consequence of any kind;
- CBE accelerates or delays Mtaji;
- CBE changes first-Mtaji hazard;
- no Namua→Mtaji strategic structure exists;
- the result generalizes beyond P2-D2;
- M1/M2 are universal Bao strategic types.

### 13.3 Negative-result boundary

The formal `not-confirmed` decision is immutable for this frozen Stage 2 analysis.

It must not be rescued by:

- candidate-ply subgroup selection;
- alternate comparator families;
- alternate control ratios;
- alternative seed blocks;
- additional formal games;
- threshold relaxation;
- CBE redefinition;
- Mtaji classifier refit/relabeling;
- directional reinterpretation of the +0.0183 descriptive risk difference.

Any new confirmatory question requires a separately preregistered fresh corpus.

## 14. What this study contributed despite the negative primary result

The study produced several durable scientific and methodological results independent of the primary null confirmation decision.

1. **Deterministic Namua clock clarification.**  
   First-Mtaji timing in the frozen engine is rule-derived progression and must not be analyzed as a survival/hazard endpoint.

2. **Trajectory-level identity discipline.**  
   Complete `historicalTrajectoryHash` identity was used to collapse duplicate games and prevent pseudo-replication.

3. **Exact-ply progression matching.**  
   Matching at the same candidate ply controls the deterministic reserve clock without matching away capture/front-row phenotype quantities.

4. **Conservative CBE-negative control definition.**  
   Controls were excluded if any inherited Namua Category-A row on the trajectory was classified CBE.

5. **Outcome firewall.**  
   Preoutcome matching was frozen and independently reviewed before M1/M2 labels became accessible.

6. **Clean negative result.**  
   The formal association was allowed to remain `not-confirmed` without outcome-dependent extension or redesign.

## 15. Limitations

The formal claim is deliberately bounded.

- only P2-D2 was formal;
- self-play engine trajectories are not human-play validation;
- the estimand is conditional on reaching an eligible first Mtaji state;
- one earliest CBE exposure per historical trajectory was retained;
- M1/M2 inherit the population and representation limits of their original confirmation;
- R3-M controls exact progression and forced-capture status but does not create causal exchangeability;
- the formal sample contains 30 exposure strata, adequate for the frozen estimability gate but not evidence of broad external validity;
- no candidate-ply subgroup was preregistered as a separate primary hypothesis.

## 16. Future research boundary

Potential future work must be new work, not Stage 2 rescue.

Scientifically distinct possibilities include:

- full structural trajectory analysis across Namua progression using preregistered rule-state representations;
- external validity across other evaluator/search/depth conditions using fresh corpora;
- human/expert validation of MTAJI-M1/M2 and CBE semantics;
- mechanistic analysis of front-row, nyumba, mobility, forcing lifecycle, or search-tree properties using new hypotheses;
- independent replication of exploratory Namua coordinates where scientifically justified.

`time-to-first-Mtaji`, first-Mtaji hazard, acceleration, and delay are not viable endpoints in the current frozen engine unless the underlying rule/engine semantics themselves change and a new study is explicitly defined around that different system.

## 17. Closure

Study 1 is complete.

```text
Stage 0 = CLOSED PASS
Stage 1 = COMPLETE / CONSUMED
Stage 2 readiness = PASS
Stage 2 formal design = FROZEN
Stage 2 corpus = COMPLETE / VERIFIED
preoutcome matching = PASS
G1 = PASS
G2 = PASS
outcome firewall = PASS
frozen Mtaji artifact = PASS
primary formal evaluation = COMPLETE
formal decision = NOT-CONFIRMED
post-evaluation independent audit = PASS
research integration = COMPLETE
```

No additional Stage 2 formal sampling or primary analysis is authorized.

## 18. Canonical records

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md)
- [`STAGE_2_FORMAL_PROTOCOL.md`](STAGE_2_FORMAL_PROTOCOL.md)
- [`preregistration/STAGE_2_FORMAL_SPEC.json`](preregistration/STAGE_2_FORMAL_SPEC.json)
- [`preregistration/STAGE_2_OUTCOME_UNLOCK.json`](preregistration/STAGE_2_OUTCOME_UNLOCK.json)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
