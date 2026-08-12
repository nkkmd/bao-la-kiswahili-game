# Stage 1 Exposure-Support Extension Result

Date: 2026-08-11  
Study: Namua→Mtaji Strategic Temporal Transition  
Status: **COMPLETE / TECHNICAL PASS / Stage 2 readiness minimum NOT MET**

## Scope

This document records the fixed Stage 1 exploratory exposure-support extension defined in:

```text
doc/namua-mtaji-transition/STAGE_1_EXPOSURE_EXTENSION_PROTOCOL.md
```

The corpus is permanently consumed exploratory data.

No confirmatory reuse is permitted.

No CBE-vs-control Mtaji morphology contrast was inspected for design selection.

## Corpus identity

Generation source commit:

```text
19dde6fded74283942519e7a7cceabfc8f9786c1
```

Source tree:

```text
clean
```

Fixed design:

```text
paired opening replicates = 384
conditions = P2-D2, V2-D2
total games = 768
opening seeds = 20272001..20272384
opening plies = 8
max ply = 100
```

Identity:

```text
configHash = 38ac12979e63694b2ba36160094d94e3bef1a81a04dd84d6798133b642a6345a
summaryHash = a08f3734dc82075c3d233fdc371d5484d255d42924f7fe4f723825f4c15770b0
```

## Technical verification — PASS

```text
games = 768
observations = 42980
legal moves checked = 182784
legacy compatibility checks = 42980
phase-transition events = 723
paired opening replicates verified = 384
source hashes match = true
```

All replay, recomputation, legality, state identity, phase linkage, aggregate reconstruction, paired-opening, trajectory-hash, and provenance checks passed.

## Deterministic clock audit — PASS

```text
reached Mtaji = 723
terminal before Mtaji = 45
first Mtaji ply 44 = 723
clock violations = 0
```

The prior interpretation boundary remains unchanged:

```text
candidate-to-first-Mtaji = 44 - candidatePly
```

is deterministic progression and is not a survival-time endpoint.

## Inherited Category-A pipeline

Historical thresholds/functions were reused unchanged:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

Extension result:

```text
Category A = 54
Category B = 247
Category C = 336
```

Category-A phase support:

```text
Namua = 24 rows
Mtaji = 30 rows
```

By condition:

```text
P2-D2: Namua 11 / Mtaji 15
V2-D2: Namua 13 / Mtaji 15
```

No threshold optimization or candidate-definition modification occurred.

## Frozen phenotype classification

Raw Category-A rows:

```text
capture-branch-expansion = 6 Namua
capture-branch-convergence = 3 Namua + 4 Mtaji
temporary-spike = 6 Namua
namua-to-mtaji-precursor = 7 Namua
forcing-release-precursor = 2 Namua + 26 Mtaji
```

The six extension CBE condition rows collapse to:

```text
4 unique historicalTrajectoryHash + candidatePly units
4 unique historical trajectories
```

Extension CBE candidate plies:

```text
24 = 1 unique unit
26 = 2 unique units
27 = 1 unique unit
```

All four unique extension CBE units are fully ascertained and subsequently reach the fixed Mtaji boundary.

No CBE-bearing historical trajectory contains multiple CBE events.

## Combined primary + extension CBE support

The primary pilot contributed one unique CBE unit at ply 33.

After combining the consumed primary pilot and consumed extension:

```text
raw CBE condition rows = 8
unique CBE trajectory-ply units = 5
unique CBE historical trajectories = 5
duplicate condition rows = 3
```

Combined candidate-ply support:

```text
ply 24 = 1
ply 26 = 2
ply 27 = 1
ply 33 = 1
```

Raw condition rows remain balanced:

```text
P2-D2 = 4
V2-D2 = 4
```

Condition rows are not independent when complete historical trajectory identity is shared.

## Prespecified Stage 2 readiness gate

The exposure-support protocol froze the following minimum before extension generation:

```text
unique Namua CBE trajectory-ply units >= 10
unique CBE-bearing historical trajectories >= 8
```

Observed:

```text
5 / 10 unique trajectory-ply units
5 / 8 unique trajectories
```

Decision:

> **Stage 2 design-readiness minimum NOT MET.**

This gate is a design-feasibility rule, not a statistical-significance test.

It is not waived post hoc.

## Comparator support implication

The extension now contains temporary-spike and convergence events with raw deterministic-progression ranges overlapping the CBE range.

However, this does not automatically reinstate the historical Stage 6 comparator family.

The prospective exact-ply risk-set strategy was already shown feasible in the primary pilot without consulting morphology outcomes.

Because the extension CBE support occurs at new clock locations (plies 24, 26, and 27), the next design audit must apply the already-defined R0–R3 exact-ply support rules to **all extension CBE units**, without selecting units or clock locations based on results.

No morphology labels may be used in that support audit.

## Interpretation boundary

Authorized:

- technical validation of the extension;
- deterministic-clock confirmation;
- exposure prevalence/support description;
- candidate-ply support description;
- exact-ply comparator feasibility auditing.

Not authorized:

- formal CBE effect claims;
- CBE-vs-control M1/M2 effect inspection for design selection;
- survival/hazard claims;
- treating duplicate condition rows as independent replication;
- waiving the preregistered Stage 2 readiness minimum.

## Decision

> **Stage 1 extension is technically valid and permanently consumed. It increases combined independent Namua CBE support from one to five unique trajectory-ply units, but the preregistered 10-unit / 8-trajectory Stage 2 readiness minimum is not met. Stage 2 remains unauthorized. Before any additional game generation, apply the existing exact-ply R0–R3 risk-set support audit to every extension CBE unit at plies 24, 26, and 27.**
