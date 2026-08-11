# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-11  
Status: **ACTIVE / Stage 1 primary pilot complete / exact-ply risk-set PASS / exposure-support extension frozen, local generation pending**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Stage 0 technical feasibility is closed PASS.

The 192-game Stage 1 primary exploratory pilot is complete, replay/provenance verified, and permanently consumed.

The supplemental exact-ply risk-set support audit is also complete and passes comparator feasibility.

Current pause point:

> **Stage 2 design freeze remains unauthorized because only one unique Namua CBE trajectory-ply exposure was observed in the primary pilot. Comparator scarcity is no longer the blocking issue: the strict R3 exact-ply risk set retains 31 unique controls in each observed condition. A fixed 384-paired-opening P2-D2/V2-D2 exploratory exposure-support extension has now been frozen before generation.**

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

Technical smoke:

```text
8 games
452 observations
all replay/identity/legacy/provenance gates = passed
frozen Mtaji artifact hash = exact
```

## 3. Deterministic Namua clock — fixed design boundary

Engine semantics and fresh Stage 1 establish:

```text
initial total reserve = 44
first Mtaji observation = ply 44
```

for standard trajectories that survive Namua.

Primary Stage 1 clock audit:

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

is deterministic progression, not survival time.

Unauthorized interpretations:

- CBE accelerates Mtaji;
- CBE delays Mtaji;
- CBE changes first-Mtaji hazard.

Canonical amendment:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_1.md
```

## 4. Stage 1 primary exploratory corpus — COMPLETE

Generation source commit:

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

Verification:

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

## 5. Inherited Category-A / phenotype support

Historical Category-A pipeline reused unchanged:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

Fresh classes:

```text
Category A = 9
Category B = 72
Category C = 105
```

Only four Category-A rows occur in Namua.

Frozen phenotype classification:

```text
capture-branch-expansion = 2 Namua rows
capture-branch-convergence = 2 Namua rows
forcing-release-precursor = 5 Mtaji rows
temporary-spike = 0
```

After identity collapse:

```text
CBE = 1 unique historicalTrajectoryHash + candidatePly unit
convergence = 1 unique historicalTrajectoryHash + candidatePly unit
```

The CBE condition rows P2-D2 and V2-D2 are the same complete historical trajectory at candidate ply 33.

Condition labels therefore cannot be treated as independent replication when historical trajectory identity is equal.

## 6. Why inherited Stage 6 comparator cannot be reused directly

Observed progression support:

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

No deterministic-progression overlap exists, and no temporary-spike Category-A event is available.

Therefore the prior Stage 6 comparator family is not frozen for this prospective study.

## 7. Exact-ply risk-set audit — PASS

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_RISKSET_RESULT.md
```

Observed unique CBE exposure:

```text
historicalTrajectoryHash = f74b37cbb627b3d5e290667c5fb22aa6ede828a86525c56faf45f9abe6689cbb
candidate ply = 33
landmark ply = 41
forcedCapture = true
raw condition rows = P2-D2, V2-D2
unique exposure units = 1
```

Prespecified nested control families:

```text
R0 = same condition + exact ply
R1 = R0 + not Category-A at index
R2 = R1 + same forced-capture status
R3 = R2 + no Namua CBE anywhere in control trajectory
```

Support result:

```text
P2-D2: R0=31 R1=31 R2=31 R3=31 unique trajectories
V2-D2: R0=31 R1=31 R2=31 R3=31 unique trajectories
```

Thus exact-ply deterministic-progression control is feasible and remains abundant under the strictest prespecified family.

At ply 33 all R3 controls have:

```text
actor reserve = 6
opponent reserve = 5
total reserve = 11
```

At ply 41 total reserve is 3.

No progression violations were observed.

## 8. Risk-set structural positivity and duplicate structure

The observed CBE lies within the R3 control range for 27/28 audited candidate/landmark numeric quantities in both conditions.

Only:

```text
candidateOpponentFrontSeeds
CBE = 6
R3 control range = 8..28
```

falls outside the observed control range.

This is not a reason to match on front-row structure, because capture/front-row quantities may constitute or mediate the phenotype itself.

Cross-condition duplicate structure remains important:

```text
R3 condition rows = 62
R3 unique historical trajectories across P2-D2/V2-D2 = 48
shared across both conditions = 14
```

Any formal design must deduplicate or cluster identical complete trajectories across condition labels.

## 9. First-Mtaji morphology technical viability

Frozen artifact audit remains exact:

```text
expected = stored = recomputed hash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

classifier refit = false
restandardization = false
relabeling = false
```

Primary Stage 1 background support:

```text
first-Mtaji eligible = 178
MTAJI-M1 = 118
MTAJI-M2 = 60
```

Outcome measurement is technically viable. Exposure prevalence remains the current bottleneck.

No comparator family may be selected using CBE-vs-control morphology contrast before Stage 2 freeze.

## 10. Stage 2 freeze — STILL NOT AUTHORIZED

Do not freeze yet:

- exact formal comparator;
- primary statistical unit;
- duplicate-trajectory handling model;
- formal condition set;
- formal exposure/sample target;
- post-ascertainment structural model;
- first-Mtaji morphology model;
- terminal-before-Mtaji estimand policy;
- formal seed block;
- effect direction;
- significance/multiplicity policy.

The remaining reason is inadequate independent CBE exposure, not comparator scarcity or morphology measurement failure.

## 11. Stage 1 exposure-support extension — FROZEN BEFORE GENERATION

Protocol:

```text
doc/namua-mtaji-transition/STAGE_1_EXPOSURE_EXTENSION_PROTOCOL.md
```

Fixed corpus:

```text
conditions = P2-D2 + V2-D2
paired opening replicates = 384
total games = 768
opening seeds = 20272001..20272384
opening plies = 8
max ply = 100
```

This condition selection is based only on fresh exposure availability and exact-ply control support, not morphology outcome.

No early stopping based on CBE count or morphology is authorized.

The corpus is permanently exploratory and cannot be reused formally.

Stage 2 design-readiness minimum:

```text
>= 10 unique Namua CBE historicalTrajectoryHash+candidatePly units
>= 8 unique CBE-bearing historical trajectories
```

This is a feasibility threshold, not a significance rule.

## 12. Extension instrumentation

```text
tools/experiments/run-namua-mtaji-stage1-extension.js
tools/experiments/verify-namua-mtaji-stage1-extension.js
tools/experiments/extract-namua-mtaji-stage1-extension-candidates.py
tools/experiments/analyze-namua-mtaji-stage1-events.js
tools/experiments/audit-namua-mtaji-stage1-clock.js
tools/experiments/audit-namua-mtaji-stage1-extension-support.js
```

Runbook:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RUNBOOK.md
```

Checkpoint:

```text
doc/namua-mtaji-transition/checkpoints/2026-08-11-riskset-pass-exposure-extension-frozen.md
```

## 13. Immediate next local step

Follow:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RUNBOOK.md
```

Generate the fixed extension, verify it, rerun the deterministic clock and inherited Category-A pipeline, classify frozen events, and run the combined exposure-support gate.

Do not compute CBE-vs-control M1/M2 contrasts before Stage 2 comparator/design freeze.

## Pause point

> **Stage 1 primary pilot and exact-ply risk-set feasibility audit are complete. Exact-ply same-condition comparison is feasible, but only one unique CBE exposure exists. Stage 2 remains blocked. A fixed 384-paired-opening P2-D2/V2-D2 exploratory exposure-support extension using seeds 20272001..20272384 is now frozen before generation. The next action is local extension generation and exposure-support auditing only; morphology effects remain uninspected for design selection.**
