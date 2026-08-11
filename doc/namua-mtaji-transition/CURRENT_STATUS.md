# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-11  
Status: **ACTIVE / Stage 1 extension risk-set PASS / final exposure-support extension frozen, local generation pending**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Stage 0 technical feasibility is closed PASS.

The Stage 1 primary pilot, primary exact-ply risk-set audit, exposure-support extension #1, and extension-wide exact-ply risk-set audit are complete. All generated Stage 1 corpora are permanently consumed exploratory data.

Current pause point:

> **Comparator feasibility is now established across every observed CBE clock position (plies 24, 26, 27, 33), but combined independent CBE support remains 5 historicalTrajectoryHash+candidatePly units / 5 historical trajectories against the frozen Stage 2 readiness minimum of 10 / 8. Stage 2 remains unauthorized. One final fixed 768-paired-opening P2-D2/V2-D2 exposure-support extension is frozen before generation, with an explicit terminal stopping rule: if the final combined gate still fails, no further exposure-targeted Stage 1 sampling under the same frozen design is authorized.**

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

## 3. Stage 1 primary pilot — COMPLETE / CONSUMED

```text
paired openings = 32
conditions = 6
games = 192
observations = 11083
unique historical trajectories = 169
reached Mtaji = 178
terminal before Mtaji = 14
```

Verification and deterministic-clock audits passed.

After identity collapse:

```text
unique Namua CBE trajectory-ply units = 1
unique CBE historical trajectories = 1
candidate ply = 33
```

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_RESULT.md
```

## 4. Primary exact-ply risk-set audit — PASS

Prespecified families:

```text
R0 = same condition + exact candidate ply
R1 = R0 + not Category A at exact index
R2 = R1 + same forced-capture status
R3 = R2 + no Namua CBE anywhere in control trajectory
```

At primary-pilot CBE ply 33:

```text
P2-D2 R3 = 31 unique trajectories
V2-D2 R3 = 31 unique trajectories
progression violations = 0
```

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_RISKSET_RESULT.md
```

## 5. Exposure-support extension #1 — COMPLETE / CONSUMED

Fixed corpus:

```text
conditions = P2-D2 + V2-D2
paired openings = 384
games = 768
opening seeds = 20272001..20272384
```

Technical result:

```text
observations = 42980
unique historical trajectories = 525
reached Mtaji = 723
terminal before Mtaji = 45
full replay/provenance = passed
first Mtaji at ply 44 = 723/723
clock violations = 0
```

Historical Category-A pipeline reused unchanged:

```text
Category A = 54
Category B = 247
Category C = 336
```

Extension CBE support after identity collapse:

```text
raw condition rows = 6
unique CBE trajectory-ply units = 4
unique CBE historical trajectories = 4
candidate plies = 24, 26, 26, 27
```

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RESULT.md
```

## 6. Combined exposure support — readiness still NOT MET

Primary + extension #1:

```text
raw CBE condition rows = 8
unique CBE historicalTrajectoryHash+candidatePly units = 5
unique CBE historical trajectories = 5
```

Candidate-ply support:

```text
ply 24 = 1
ply 26 = 2
ply 27 = 1
ply 33 = 1
```

Frozen Stage 2 design-readiness minimum remains:

```text
unique Namua CBE trajectory-ply units >= 10
unique CBE historical trajectories >= 8
```

Observed:

```text
5 / 10 units
5 / 8 trajectories
```

The gate is not waived or relaxed.

## 7. Extension-wide exact-ply risk-set audit — PASS

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RISKSET_RESULT.md
```

Every extension CBE unit was included without morphology-based selection.

Strict R3 support:

```text
ply 24, P2-D2 = 331 unique trajectories
ply 24, V2-D2 = 331 unique trajectories
ply 26, P2-D2 = 334 unique trajectories
ply 26, V2-D2 = 334 unique trajectories
ply 27, P2-D2 = 334 unique trajectories
ply 27, V2-D2 = 334 unique trajectories
progression violations = 0
```

Cross-condition trajectory collapse remains material:

```text
ply 24 R3 union = 493 unique historical trajectories
  shared across both conditions = 169

ply 27 R3 union = 501 unique historical trajectories
  shared across both conditions = 167
```

Thus comparator scarcity is not the remaining blocker. Future formal design must account for identical complete trajectories repeated across condition labels.

## 8. Comparator policy remains unfrozen

The extension also contains temporary-spike/convergence rows with raw progression overlap, but the historical Stage 6 comparator family is not automatically reinstated.

Exact-ply risk-set feasibility was evaluated prospectively without Mtaji morphology contrasts and directly controls deterministic Namua progression.

Do not select a comparator by inspecting M1/M2 outcome differences.

## 9. Mtaji morphology firewall

The frozen MTAJI-M1/MTAJI-M2 classifier remains technically available.

Still forbidden during Stage 1 exposure-support design:

- CBE-vs-control morphology effect inspection;
- effect-direction selection;
- p-values for a CBE morphology effect;
- comparator/model selection from morphology contrast.

No morphology contrast was used to set the final extension size.

## 10. Final Stage 1 exposure-support extension — FROZEN BEFORE GENERATION

Protocol:

```text
doc/namua-mtaji-transition/STAGE_1_FINAL_EXPOSURE_EXTENSION_PROTOCOL.md
```

Fixed corpus:

```text
conditions = P2-D2 + V2-D2
paired opening replicates = 768
total games = 1536
opening seeds = 20273001..20273768
opening plies = 8
max ply = 100
```

This seed block is disjoint from all earlier Stage 1 exploratory blocks.

Planning rationale only:

```text
extension #1 observed 4 unique CBE units / 384 paired openings
simple plug-in expectation for 768 paired openings ≈ 8 additional units
```

A simple independent-binomial plug-in calculation gives roughly 90% probability of at least five additional units if the exploratory rate were stable. This is not a power calculation or prevalence inference.

No early stopping is authorized.

## 11. Terminal stopping rule

The final extension is the last exposure-driven Stage 1 sampling block under the current frozen CBE definition and P2-D2/V2-D2 condition family.

After combining:

```text
primary pilot
+ extension #1
+ final extension
```

apply the unchanged readiness gate:

```text
units >= 10
trajectories >= 8
```

### If PASS

Run/inspect the final-extension exact-ply R0–R3 audit across every newly observed CBE candidate ply. If comparator support remains adequate, proceed to Stage 2 formal design freeze.

### If FAIL

Do not generate another exposure-targeted block merely to reach the gate.

Record the prospective CBE→Mtaji formal bridge as not design-ready under the current frozen exposure definition and studied condition family. Any future continuation requires a separately justified redesign rather than threshold relaxation or sample-to-threshold continuation.

## 12. Final extension instrumentation

```text
tools/experiments/run-namua-mtaji-stage1-final-extension.js
tools/experiments/verify-namua-mtaji-stage1-final-extension.js
tools/experiments/extract-namua-mtaji-stage1-extension-candidates.py
tools/experiments/analyze-namua-mtaji-stage1-events.js
tools/experiments/audit-namua-mtaji-stage1-clock.js
tools/experiments/audit-namua-mtaji-stage1-riskset.js
tools/experiments/audit-namua-mtaji-stage1-final-support.js
```

Runbook:

```text
doc/namua-mtaji-transition/STAGE_1_FINAL_EXTENSION_RUNBOOK.md
```

Checkpoint:

```text
doc/namua-mtaji-transition/checkpoints/2026-08-11-extension-riskset-pass-final-extension-frozen.md
```

## 13. Decisions still intentionally unfrozen

Do not freeze yet:

- exact formal comparator;
- primary statistical unit;
- duplicate-trajectory / paired-opening dependence model;
- formal condition set;
- formal sample size / seed block;
- post-ascertainment structural endpoint/model;
- first-Mtaji morphology endpoint/model;
- terminal-before-Mtaji estimand policy;
- effect direction;
- significance/multiplicity policy.

## 14. Immediate next local step

Follow:

```text
doc/namua-mtaji-transition/STAGE_1_FINAL_EXTENSION_RUNBOOK.md
```

Generate the entire fixed final corpus, verify it, rerun deterministic-clock and inherited Category-A audits, classify frozen events, audit exact-ply risk-set support, and run the three-corpus final exposure gate.

Do not inspect CBE-vs-control M1/M2 effects before the final readiness decision.

## Pause point

> **Stage 1 primary and extension #1 are complete and consumed. Exact-ply comparator feasibility is PASS across all observed CBE clock positions, but combined independent CBE exposure remains 5 units / 5 trajectories, below the frozen 10 / 8 Stage 2 readiness minimum. One final fixed 768-paired-opening P2-D2/V2-D2 exploratory extension using seeds 20273001..20273768 is now frozen before generation. If the final combined gate still fails, no further exposure-targeted Stage 1 sampling under the same frozen design is authorized.**