# Stage 1 Result — Fresh Exploratory Temporal Pilot

Date: 2026-08-11  
Status: **PRIMARY STAGE 1 PILOT COMPLETE / DESIGN SUPPORT INSUFFICIENT FOR STAGE 2 FREEZE**  
Study: Namua→Mtaji Strategic Temporal Transition  
Pilot source commit: `b2e36fe3c76a599b4c96d77fd25685836a27dbbd`

## 1. Scope and boundary

This document records the result of the fresh Stage 1 exploratory pilot.

The corpus is permanently exploratory:

```text
formalExperiment = false
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
```

No result below is a formal confirmation claim. The pilot may be used only to determine whether the later formal design is identifiable and technically supported.

No closed-study classifier, threshold, formal decision, negative/null result, or interpretation boundary is changed.

## 2. Corpus identity

```text
paired opening replicates = 32
conditions = 6
total games = 192
opening seeds = 20271001..20271032
opening plies = 8
max ply = 100
configHash = 88a90e90ded76151d200d75e419097bb7b581cd662da08a1a015e39ce990360c
summaryHash = 5ce3b8e1fbe58bfbadc5be0a149f1eddb7c204e991599755bdc22eb254e29546
```

Conditions:

```text
P2-D1
P2-D2
P2-D3
LG-D2
LG-D3
V2-D2
```

Observed corpus summary:

```text
games = 192
observations = 11083
unique historical trajectories = 169
largest trajectory group = 3
duplicate historical trajectory groups = 22
reached Mtaji = 178
first-Mtaji morphology eligible = 178
terminal before Mtaji = 14
administrative truncation = 1
```

## 3. Technical verification

Verification passed without exception:

```text
legal moves checked = 43422
legacy compatibility checks = 11083
phase-transition events = 178
paired opening replicates verified = 32
source hashes match = true
```

Passed checks include:

- schema readability/observation validation;
- full deterministic replay;
- stored observation recomputation;
- legacy phase-transition compatibility;
- move legality;
- before/after identity;
- phase monotonicity and event linkage;
- first-Mtaji reserve exhaustion;
- temporal outcome recomputation;
- trajectory identity;
- paired-opening identity;
- aggregate legacy/game-summary reconstruction;
- source provenance.

The Stage 1 corpus is technically valid for exploratory design audit.

## 4. Deterministic Namua clock — independently confirmed

The pre-generation engine-level amendment predicted:

```text
first Mtaji ply = 44
```

for every standard trajectory that survives Namua.

Stage 1 result:

```text
reached Mtaji = 178
firstMtajiPly == 44 = 178
terminal before Mtaji = 14
clock violations = 0
```

Therefore:

```text
candidate-to-first-Mtaji = 44 - candidatePly
```

is confirmed as a deterministic progression distance in this engine population, not a survival-time outcome.

Consequences remain fixed:

- survival/hazard timing is not an authorized primary endpoint;
- no transition-acceleration claim is authorized;
- no transition-delay claim is authorized;
- candidate ply and total remaining reserve are mechanically coupled progression coordinates.

## 5. Inherited Category-A pipeline result

Historical functions were reused directly from the closed phase-transition pipeline.

Frozen primary candidacy settings:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing signals = reserve / mobility / capture / front
```

Fresh pilot counts:

```text
analysis-eligible observations = 9163
inclusive candidate clusters = 186
forcing-excluded candidate clusters = 81
Category A = 9
Category B = 72
Category C = 105
```

Category-A by condition:

```text
LG-D2  = 2
P2-D2  = 4
P2-D3  = 1
V2-D2  = 2
P2-D1  = 0
LG-D3  = 0
```

Category-A by phase shows that only four rows are in Namua:

```text
P2-D2 / Namua = 2
V2-D2 / Namua = 2
```

The other five Category-A rows are already in Mtaji and therefore are not candidates for the Namua→Mtaji bridge estimand.

## 6. Frozen phenotype classification of Category-A events

All 9 Category-A representatives were classified using the inherited frozen phenotype module.

```text
capture-branch-expansion      = 2 rows
capture-branch-convergence    = 2 rows
forcing-release-precursor     = 5 rows
temporary-spike               = 0 rows
namua-to-mtaji-precursor      = 0 rows
```

Phase-specific structure:

```text
CBE                         = 2 Namua rows
convergence                 = 2 Namua rows
forcing-release-precursor   = 5 Mtaji rows
```

## 7. Identity collapse materially changes effective event support

The two CBE rows occur at the same candidate ply on the same complete historical trajectory:

```text
trajectoryHash = f74b37cbb627b3d5e290667c5fb22aa6ede828a86525c56faf45f9abe6689cbb
candidatePly = 33
conditions = P2-D2 / V2-D2
```

Likewise the two convergence rows are the same trajectory-ply unit:

```text
trajectoryHash = 835d555d8c2fa7aa2d551d2a64c0e835d58a662d3eed8b74c0ba6015c13d0e93
candidatePly = 29
conditions = P2-D2 / V2-D2
```

Therefore the effective independent Namua support under the previously established trajectory-ply identity principle is:

```text
unique CBE trajectory-ply units = 1
unique convergence trajectory-ply units = 1
unique temporary-spike units = 0
```

The condition labels must not be counted as independent replications when the deterministic historical trajectory is identical.

This strongly favors trajectory-aware duplicate collapse in any later formal design, although the exact primary statistical unit is not yet frozen.

## 8. Progression support and failure of the inherited Stage 6 comparator family

For the unique class locations observed in this pilot:

```text
CBE candidate ply = 33
CBE candidate total reserve = 11
CBE landmark ply = 41
CBE landmark total reserve = 3

convergence candidate ply = 29
convergence candidate total reserve = 15
convergence landmark ply = 37
convergence landmark total reserve = 7
```

Thus Stage 6 comparator reuse fails the central progression-overlap requirement:

```text
candidate reserve overlap = none
landmark reserve overlap = none
temporary-spike support = absent
```

A raw CBE-versus-convergence morphology comparison would therefore confound phenotype class with deterministic Namua progression.

The old Stage 6 comparator family is **not promoted** to the new formal comparator.

## 9. Event multiplicity

Within raw Category-A rows:

```text
games with Category-A events = 9
games with multiple Category-A events = 0
max Category-A events per game = 1
same-class repeat games = 0
mixed-class games = 0
overlapping ascertainment-window pairs = 0
duplicate trajectory-ply units = 2
duplicate historical trajectory groups in corpus = 22
```

The principal dependence issue in this pilot is therefore cross-condition trajectory duplication, not repeated Category-A events within one game.

This may change in a larger corpus and must continue to be audited.

## 10. Frozen first-Mtaji morphology feasibility

The frozen Mtaji classifier artifact remained hash-identical:

```text
expected = stored = recomputed
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

No refit, restandardization, or relabeling occurred.

All first-Mtaji eligible states were classified successfully:

```text
eligible first-Mtaji states = 178
MTAJI-M1 = 118
MTAJI-M2 = 60
```

Therefore the first-Mtaji morphology endpoint is technically supported and both frozen classes have background support in the fresh pilot.

The unique observed CBE trajectory and unique observed convergence trajectory both reach MTAJI-M1. This is **not evidence of equality or association** because:

1. each class has only one independent trajectory-ply unit;
2. their progression locations differ;
3. no valid progression-matched comparator has yet been frozen.

Morphology labels must not be used to choose a comparator that produces a favorable contrast.

## 11. Stage 2 freeze decision

Decision:

> **DO NOT ENTER STAGE 2 DESIGN FREEZE YET.**

Reasons:

1. CBE exposure support is one independent trajectory-ply unit;
2. inherited comparator support is one independent convergence unit and no temporary-spike unit;
3. CBE and convergence have no progression overlap;
4. duplicate trajectories demonstrate that condition rows cannot automatically be treated as independent;
5. first-Mtaji morphology itself is available, so the bottleneck is exposure/comparator support rather than outcome measurement.

## 12. Next design question — exact-ply risk-set comparator

The deterministic Namua clock creates a stronger comparator possibility than the old event-class family.

For an exposed CBE candidate at ply `t`, another trajectory observed at exactly the same `t` automatically has the same total-reserve progression under the standard clock.

A candidate comparator family is therefore:

> another trajectory in the same search condition, observed at the exact same Namua ply, with complete `t+8` ascertainment support, excluding the exposed historical trajectory.

Possible nested restrictions to audit **without effect testing**:

1. same condition + exact ply;
2. same condition + exact ply + non-Category-A index state;
3. same condition + exact ply + same forced-capture status;
4. same condition + exact ply + same forced-capture status + no CBE anywhere in the trajectory.

This is a new-study comparator candidate, not a redefinition of a closed-study class.

The comparator must be selected from pre-outcome support/balance properties, not from its M1/M2 contrast.

## 13. Required supplemental Stage 1 audit before any larger pilot

Before generating more games, use the existing consumed pilot to quantify:

- exact-ply same-condition risk-set sizes;
- unique historical-trajectory counts after duplicate collapse;
- exact reserve-vector identity at candidate and landmark;
- forced-capture matched support;
- clean-index and clean-trajectory support;
- early terminal / morphology-eligibility counts in candidate control sets;
- structural feature ranges at candidate and `t+8` landmark;
- duplicated-trajectory condition-pair structure.

No p-values, effect sizes, M1/M2 group contrast, or model fit is authorized in this supplemental audit.

## 14. Interpretation boundary

Stage 1 currently supports only these statements:

- the deterministic Namua clock is real in the fresh corpus;
- the inherited Category-A/CBE pipeline can be executed unchanged;
- CBE is very sparse in this 192-game pilot;
- the old Stage 6 comparator family is not progression-matched here;
- first-Mtaji M1/M2 classification is technically viable;
- a same-ply risk-set comparator is methodologically motivated by engine mechanics and requires support audit.

It does **not** support:

- CBE→M1 or CBE→M2 association;
- CBE causal effect on morphology;
- any transition-timing effect;
- general search-profile/depth interaction;
- a formal comparator or statistical model;
- changing any closed-study conclusion.

## 15. Pause point

> **The primary Stage 1 fresh exploratory pilot is complete and technically valid. It does not provide sufficient independent CBE/comparator support for Stage 2 freeze. The next step is a prespecified supplemental audit of exact-ply, same-condition risk-set comparator availability using the already-generated exploratory corpus only. No new scientific corpus should be generated until that support audit is inspected.**
