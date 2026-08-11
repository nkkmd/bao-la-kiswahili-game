# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-11  
Status: **ACTIVE / Stage 1 primary pilot complete / supplemental exact-ply risk-set audit pending**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Stage 0 technical feasibility is closed PASS.

The fresh Stage 1 exploratory pilot has now been generated, replay-verified, and audited. The pilot is permanently consumed exploratory data and cannot be reused for later formal confirmation.

Current pause point:

> **The 192-game Stage 1 primary pilot is complete and technically valid, but Stage 2 design freeze remains unauthorized. Only one independent Namua CBE trajectory-ply unit and one independent convergence unit were observed after duplicate collapse, and the inherited Stage 6 comparator family has no deterministic-progression overlap. A prespecified exact-ply same-condition risk-set support audit must now be run on the existing pilot before any larger exploratory generation.**

## 1. Closed-study boundaries remain unchanged

### Phase-transition Study 1

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

Frozen `capture-branch-expansion` settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Classifier order remains unchanged.

### Position-typology / playing-style Study 1

Confirmed bounded Mtaji classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit / restandardization / relabeling.

Namua discrete type remains unsupported; N-ACT/N-CON remain exploratory. Playing-style STYLE-C1..C4 exact 4D geometry remains formal not-confirmed.

## 2. Stage 0 — CLOSED PASS

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_0_RESULT.md
```

Technical smoke established:

```text
8 games
452 observations
all replay/identity/legacy/provenance gates = passed
frozen Mtaji artifact hash = exact
```

## 3. Deterministic Namua clock — fixed design boundary

Engine semantics and fresh Stage 1 independently establish:

```text
initial total reserve = 44
first Mtaji observation = ply 44
```

for standard trajectories that survive Namua.

Stage 1 clock audit:

```text
reached Mtaji = 178
first Mtaji at ply 44 = 178
terminal before Mtaji = 14
violations = 0
```

Therefore:

```text
candidate-to-first-Mtaji = 44 - candidatePly
```

is a deterministic progression coordinate, not a survival-time endpoint.

Unauthorized interpretations:

- CBE accelerates Mtaji;
- CBE delays Mtaji;
- CBE changes first-Mtaji hazard.

Canonical pre-generation amendment:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_1.md
```

## 4. Stage 1 primary exploratory corpus — COMPLETE

Source commit used for generation:

```text
b2e36fe3c76a599b4c96d77fd25685836a27dbbd
```

Identity:

```text
paired opening replicates = 32
conditions = 6
games = 192
opening seeds = 20271001..20271032
opening plies = 8
max ply = 100
configHash = 88a90e90ded76151d200d75e419097bb7b581cd662da08a1a015e39ce990360c
summaryHash = 5ce3b8e1fbe58bfbadc5be0a149f1eddb7c204e991599755bdc22eb254e29546
```

Corpus summary:

```text
observations = 11083
unique historical trajectories = 169
duplicate historical trajectory groups = 22
largest trajectory group = 3
reached Mtaji = 178
first-Mtaji morphology eligible = 178
terminal before Mtaji = 14
administrative truncation = 1
```

Replay/provenance verification:

```text
43422 legal moves checked
11083 legacy compatibility checks
178 phase events
32 paired openings verified
all checks = passed
source hashes match = true
```

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_RESULT.md
```

## 5. Inherited Category-A pipeline result

Historical functions and thresholds were reused unchanged:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

Fresh classification:

```text
Category A = 9
Category B = 72
Category C = 105
```

Only four Category-A rows occur in Namua:

```text
P2-D2 Namua = 2
V2-D2 Namua = 2
```

The remaining five Category-A rows are already in Mtaji.

## 6. Frozen phenotype support

Category-A phenotype classes:

```text
capture-branch-expansion = 2 Namua rows
capture-branch-convergence = 2 Namua rows
forcing-release-precursor = 5 Mtaji rows
temporary-spike = 0
```

Identity collapse shows:

```text
CBE rows 2 -> 1 unique historical trajectory-ply unit
convergence rows 2 -> 1 unique historical trajectory-ply unit
```

The duplicated CBE unit appears under P2-D2 and V2-D2 but has the same complete historical trajectory and candidate ply 33.

The duplicated convergence unit likewise appears under P2-D2 and V2-D2 with the same complete historical trajectory and candidate ply 29.

Condition labels are therefore not independent replications when trajectory identity is equal.

## 7. Inherited Stage 6 comparator is not usable as-is

Observed deterministic-progression locations:

```text
CBE:
  candidate ply = 33
  candidate total reserve = 11
  landmark ply = 41
  landmark total reserve = 3

convergence:
  candidate ply = 29
  candidate total reserve = 15
  landmark ply = 37
  landmark total reserve = 7
```

There is no reserve/progression overlap.

No temporary-spike Category-A event is available.

Therefore the old Stage 6 comparator family is **not frozen** for the new study.

A direct CBE-versus-convergence morphology comparison would confound phenotype with deterministic Namua progression.

## 8. First-Mtaji morphology remains technically viable

Frozen artifact audit:

```text
expected = stored = recomputed hash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

classifier refit = false
restandardization = false
relabeling = false
```

Fresh first-Mtaji background support:

```text
eligible = 178
MTAJI-M1 = 118
MTAJI-M2 = 60
```

Thus outcome measurement is not the current bottleneck. Exposure/comparator support is.

The unique observed CBE and convergence trajectories both reach MTAJI-M1, but this is non-inferential because there is only one independent unit per class and no progression matching.

## 9. Stage 2 freeze — NOT AUTHORIZED

Do not freeze yet:

- formal comparator;
- primary statistical unit;
- formal condition set;
- formal exposure/sample target;
- post-ascertainment structural model;
- first-Mtaji morphology model;
- terminal-before-Mtaji estimand policy;
- formal seed block;
- effect direction;
- significance/multiplicity policy.

The primary reason is inadequate independent CBE exposure and comparator overlap, not a failed outcome classifier.

## 10. Supplemental Stage 1 exact-ply risk-set audit — FROZEN, NOT YET RUN

Deterministic progression enables an exact-ply comparator candidate.

For a CBE event at ply `t`, another trajectory at the same `t` has the same total remaining reserve under the standard clock.

Prespecified nested support families:

```text
R0 = same condition + exact ply
R1 = R0 + no Category-A representative at exact index
R2 = R1 + same forced-capture status
R3 = R2 + no Namua CBE anywhere in control trajectory
```

Protocol:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_2.md
```

Implementation:

```text
tools/experiments/audit-namua-mtaji-stage1-riskset.js
```

Runbook:

```text
doc/namua-mtaji-transition/STAGE_1_RISKSET_RUNBOOK.md
```

This audit uses only the existing consumed pilot. It performs no p-values/effect tests and intentionally does not compare M1 versus M2 labels across risk-set families.

## 11. Immediate next local step

Update the branch and run:

```bash
node --check tools/experiments/audit-namua-mtaji-stage1-riskset.js
node tools/experiments/audit-namua-mtaji-stage1-riskset.js
```

Return:

```text
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/stage1-riskset-audit.json
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/stage1-riskset-controls.csv
```

No new games should be generated before this audit is inspected.

## Pause point

> **Stage 1 primary pilot is complete and technically valid. The deterministic clock eliminates survival timing as a meaningful endpoint, first-Mtaji morphology is technically available, but only one independent CBE trajectory-ply unit was observed and the inherited comparator lacks progression overlap. Stage 2 remains unauthorized. The next action is the frozen exact-ply same-condition risk-set support audit on the existing 192-game exploratory corpus; no new corpus generation should occur before that audit is inspected.**
