# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-11  
Status: **ACTIVE / Stage 1 extension complete / Stage 2 readiness minimum not met / extension-wide exact-ply risk-set audit pending**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Stage 0 technical feasibility is closed PASS.

The 192-game Stage 1 primary pilot, its exact-ply risk-set audit, and the fixed 768-game Stage 1 exposure-support extension are complete and permanently consumed exploratory data.

Current pause point:

> **The fixed exposure-support extension increased combined independent Namua CBE support from one to five historicalTrajectoryHash+candidatePly units, but the prospectively frozen Stage 2 readiness minimum of 10 units / 8 trajectories is not met. Stage 2 remains unauthorized. Before any further game generation, the unchanged exact-ply R0–R3 comparator-support audit must be applied to every extension CBE unit at the newly observed candidate plies 24, 26, and 27.**

## 1. Immutable closed-study boundaries

### Phase-transition Study 1

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

Frozen `capture-branch-expansion` settings remain:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Classifier precedence remains unchanged.

### Position-typology / playing-style Study 1

Frozen Mtaji classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit / restandardization / relabeling.

Namua discrete type remains unsupported. N-ACT/N-CON remain exploratory coordinates only. STYLE-C1..C4 exact geometry remains formal not-confirmed.

## 2. Deterministic Namua clock — fixed research boundary

Engine semantics establish:

```text
initial total reserve = 44
first Mtaji observation = ply 44
```

for a standard trajectory that survives Namua.

Thus:

```text
candidate-to-first-Mtaji = 44 - candidatePly
```

is deterministic progression, not survival time.

Unauthorized claims remain:

- CBE accelerates Mtaji;
- CBE delays Mtaji;
- CBE changes first-Mtaji hazard.

Canonical amendment:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_1.md
```

## 3. Stage 1 primary pilot — COMPLETE / CONSUMED

Generation source commit:

```text
b2e36fe3c76a599b4c96d77fd25685836a27dbbd
```

Corpus:

```text
paired opening replicates = 32
conditions = 6
games = 192
observations = 11083
unique historical trajectories = 169
reached Mtaji = 178
terminal before Mtaji = 14
```

Verification:

```text
43422 legal moves checked
11083 legacy compatibility checks
32 paired openings verified
all replay/provenance checks = passed
```

Clock:

```text
178/178 reached-Mtaji games first Mtaji at ply 44
violations = 0
```

Primary inherited Category-A result:

```text
Category A = 9
Category B = 72
Category C = 105
```

Namua CBE result after identity collapse:

```text
raw condition rows = 2
unique CBE historicalTrajectoryHash+candidatePly units = 1
unique CBE historical trajectories = 1
candidate ply = 33
```

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_RESULT.md
```

## 4. Primary exact-ply risk-set audit — PASS

Prospectively frozen nested support families:

```text
R0 = same condition + exact candidate ply
R1 = R0 + not Category A at exact index
R2 = R1 + same forced-capture status
R3 = R2 + no Namua CBE anywhere in control trajectory
```

Primary-pilot CBE at ply 33:

```text
P2-D2: R0=31 R1=31 R2=31 R3=31 unique trajectories
V2-D2: R0=31 R1=31 R2=31 R3=31 unique trajectories
progression violations = 0
```

Thus comparator scarcity at ply 33 is not the bottleneck.

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_RISKSET_RESULT.md
```

## 5. Stage 1 exposure-support extension — COMPLETE / CONSUMED

Protocol:

```text
doc/namua-mtaji-transition/STAGE_1_EXPOSURE_EXTENSION_PROTOCOL.md
```

Generation source commit:

```text
19dde6fded74283942519e7a7cceabfc8f9786c1
```

Source tree was clean.

Fixed corpus:

```text
conditions = P2-D2 + V2-D2
paired opening replicates = 384
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

Corpus summary:

```text
games = 768
observations = 42980
unique historical trajectories = 525
duplicate historical trajectory groups = 217
largest trajectory group = 6
unique opening state keys = 352
reached Mtaji = 723
terminal before Mtaji = 45
administrative truncation = 2
```

Verification:

```text
182784 legal moves checked
42980 legacy compatibility checks
723 phase events
384 paired opening replicates verified
all checks = passed
source hashes match = true
```

Extension clock audit:

```text
first Mtaji at ply 44 = 723/723 reached-Mtaji games
violations = 0
```

Canonical extension result:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RESULT.md
```

## 6. Extension inherited Category-A result

Historical pipeline reused unchanged:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

Result:

```text
Category A = 54
Category B = 247
Category C = 336
```

Category A by phase:

```text
Namua = 24 rows
Mtaji = 30 rows
```

No threshold optimization or candidate-definition modification occurred.

## 7. Extension phenotype support

Raw Category-A classes:

```text
capture-branch-expansion = 6 Namua rows
capture-branch-convergence = 3 Namua + 4 Mtaji rows
temporary-spike = 6 Namua rows
namua-to-mtaji-precursor = 7 Namua rows
forcing-release-precursor = 2 Namua + 26 Mtaji rows
```

The six extension CBE condition rows collapse to:

```text
4 unique CBE trajectory-ply units
4 unique CBE historical trajectories
```

Unique extension CBE candidate-ply support:

```text
ply 24 = 1
ply 26 = 2
ply 27 = 1
```

All four unique extension CBE units are fully ascertained and reach Mtaji.

No CBE-bearing historical trajectory contains multiple CBE events.

## 8. Combined CBE support and readiness gate

Primary + extension:

```text
raw CBE condition rows = 8
unique CBE historicalTrajectoryHash+candidatePly units = 5
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

Prospectively frozen Stage 2 design-readiness minimum:

```text
>= 10 unique Namua CBE trajectory-ply units
>= 8 unique CBE-bearing historical trajectories
```

Observed:

```text
5 / 10 units
5 / 8 trajectories
```

Decision:

> **NOT MET. The readiness threshold is not waived. Stage 2 remains unauthorized.**

The threshold is a design-feasibility rule, not a significance threshold.

## 9. Comparator landscape after extension

Unlike the primary pilot, the extension contains temporary-spike and convergence support whose raw deterministic-progression ranges overlap the CBE range.

Observed raw CBE candidate-ply range:

```text
24..27
```

Raw Stage 6 comparator-family progression overlap is therefore present in the extension.

However, the historical Stage 6 comparator family is **not automatically reinstated**.

The exact-ply risk-set strategy was already prospectively audited without morphology outcomes and directly controls deterministic Namua progression.

No comparator may be selected by inspecting M1/M2 contrasts.

## 10. Mtaji morphology outcome firewall

The frozen MTAJI-M1/MTAJI-M2 classifier remains available technically, but morphology-effect inspection remains unauthorized for Stage 1 design selection.

No CBE-vs-control morphology effect was used to:

- select P2-D2/V2-D2;
- set the extension size;
- select a comparator;
- select candidate-ply support;
- determine the current next step.

The extension and primary pilot are permanently consumed exploratory corpora and cannot be reused for later formal confirmation.

## 11. Extension-wide exact-ply risk-set audit — FROZEN, PENDING

The primary risk-set PASS was demonstrated only at ply 33.

Extension CBE occurs at new clock positions:

```text
24
26
27
```

Before any additional game generation, the unchanged R0–R3 support audit must be applied to **every fully ascertained extension Namua CBE unit**.

Canonical scope amendment:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_3.md
```

Runbook:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RISKSET_RUNBOOK.md
```

The audit must not inspect morphology labels, tune tolerances, or omit poorly supported exposure units.

Even a PASS does not itself authorize Stage 2 because the 10-unit / 8-trajectory readiness gate remains unmet.

## 12. Decisions still unfrozen

Do not freeze yet:

- exact formal comparator;
- primary statistical unit;
- paired-opening / duplicate-trajectory dependence model;
- formal condition set;
- formal sample/exposure target;
- post-ascertainment structural endpoint/model;
- first-Mtaji morphology endpoint/model;
- terminal-before-Mtaji estimand policy;
- disjoint formal seed block;
- effect direction;
- significance/multiplicity policy.

## 13. Immediate next local step

Do **not** generate more games yet.

Follow:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RISKSET_RUNBOOK.md
```

Run the existing exact-ply risk-set audit on:

```text
artifacts/local/namua-mtaji-transition/stage1-extension-v1
```

Return:

```text
stage1-riskset-audit.json
stage1-riskset-controls.csv
```

## Pause point

> **Stage 1 exposure extension is complete, technically valid, and consumed. Combined independent Namua CBE support is now 5 trajectory-ply units / 5 trajectories, below the prospectively frozen 10 / 8 Stage 2 readiness minimum. Stage 2 remains unauthorized. Before any further exploratory generation, apply the unchanged exact-ply R0–R3 support audit to all extension CBE units at plies 24, 26, and 27 without consulting Mtaji morphology outcomes.**
