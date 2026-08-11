# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-11  
Status: **ACTIVE / Stage 1 COMPLETE / Stage 2 formal design FROZEN / formal generation pending**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Stage 0 technical feasibility is closed PASS.

Stage 1 primary pilot, both fixed exposure-support extensions, and all exact-ply risk-set feasibility audits are complete and permanently consumed exploratory data.

Current pause point:

> **The prospectively frozen Stage 2 readiness gate has passed with 14 unique Namua CBE trajectory-ply units / 14 unique CBE historical trajectories. Final R3 support remains abundant at every newly observed clock position, with 601–646 unique controls per final-extension exposure-condition stratum, zero progression violations, and zero exposure values outside the audited 28-field R3 structural ranges. Stage 2 formal design is now frozen before formal generation. The next local action is the one-shot 4096-game P2-D2 formal corpus through the preoutcome matching hard stop; M1/M2 evaluation remains forbidden until that matching assignment is reviewed.**

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

Frozen CBE settings remain:

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

Namua discrete type remains unsupported. N-ACT/N-CON remain exploratory only. STYLE-C1..C4 exact geometry remains formal not-confirmed.

## 2. Deterministic Namua clock — fixed boundary

For standard trajectories surviving Namua:

```text
initial total reserve = 44
first Mtaji observation = ply 44
Namua total reserve at ply t = 44 - t
```

Therefore candidate-to-first-Mtaji distance is deterministic progression, not survival time.

Unauthorized interpretations remain:

- CBE accelerates Mtaji;
- CBE delays Mtaji;
- CBE changes first-Mtaji hazard.

## 3. Stage 1 primary pilot — COMPLETE / CONSUMED

```text
paired openings = 32
conditions = 6
games = 192
observations = 11083
unique CBE trajectory-ply units = 1
unique CBE historical trajectories = 1
candidate ply = 33
```

Verification, provenance, frozen-artifact, and deterministic-clock gates passed.

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_RESULT.md
```

## 4. Stage 1 exact-ply comparator development

Prospectively audited nested families:

```text
R0 = same condition + exact candidate ply
R1 = R0 + not Category A at exact index
R2 = R1 + same forced-capture status
R3 = R2 + no Namua CBE anywhere in control trajectory
```

Primary pilot at ply 33:

```text
P2-D2 R3 = 31 unique trajectories
V2-D2 R3 = 31 unique trajectories
progression violations = 0
```

Extension #1 at plies 24/26/27:

```text
R3 = 331..334 unique trajectories per exposure-condition stratum
progression violations = 0
```

Final extension at plies 13/14/17/25/32/33/35:

```text
R3 = 601..646 unique trajectories per exposure-condition stratum
progression violations = 0
```

Final direct structural positivity audit:

```text
13 exposure-condition strata
28 candidate/landmark numeric fields
364 exposure-vs-R3-range comparisons
out-of-range = 0
```

Comparator scarcity is not a remaining blocker.

## 5. Exposure-support extension #1 — COMPLETE / CONSUMED

```text
conditions = P2-D2 + V2-D2
paired openings = 384
games = 768
seeds = 20272001..20272384
observations = 42980
unique CBE trajectory-ply units = 4
unique CBE historical trajectories = 4
```

Technical and deterministic-clock gates passed.

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RESULT.md
```

## 6. Final exposure-support extension — COMPLETE / CONSUMED

Generation source commit:

```text
0f1ad87b5e0340e051003d2dfc81e32af3127cd8
```

Fixed corpus:

```text
conditions = P2-D2 + V2-D2
paired openings = 768
games = 1536
seeds = 20273001..20273768
observations = 84787
unique historical trajectories = 983
```

Verification:

```text
full replay = passed
legal moves checked = 363297
legacy compatibility checks = 84787
source hashes match = true
```

Clock:

```text
reached Mtaji = 1454
first Mtaji at ply 44 = 1454/1454
terminal before Mtaji = 82
violations = 0
```

Inherited Category-A:

```text
A = 116
B = 467
C = 626
```

Final-extension CBE:

```text
raw Namua CBE rows = 15
unique earliest CBE historical trajectories = 9
all 15 raw CBE rows fully ascertained
all 15 reached Mtaji
```

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_1_FINAL_EXTENSION_RESULT.md
```

## 7. Final Stage 1 readiness decision — PASS

Primary + extension #1 + final extension:

```text
raw CBE condition rows = 23
unique CBE historicalTrajectoryHash+candidatePly units = 14
unique CBE historical trajectories = 14
CBE-bearing trajectories with multiple unique events = 0
```

Candidate-ply support:

```text
13 = 1
14 = 1
17 = 1
24 = 1
25 = 1
26 = 2
27 = 1
32 = 1
33 = 2
35 = 3
```

Prospectively frozen readiness minimum:

```text
units >= 10
trajectories >= 8
```

Observed:

```text
14 / 10 units
14 / 8 trajectories
```

Decision:

> **PASS. Stage 2 design freeze authorized.**

No M1/M2 exploratory contrast was used to reach this decision.

## 8. Stage 2 formal design — FROZEN

Canonical protocol:

```text
doc/namua-mtaji-transition/STAGE_2_FORMAL_PROTOCOL.md
```

Machine-readable spec:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_FORMAL_SPEC.json
```

Formal condition:

```text
P2-D2 only
hard / bao / phase2 / depth2
```

Rationale is inherited and outcome-independent: E-018/H16 confirmed CBE only in this exact fixed P2-D2 context. V2-D2 is excluded from the primary formal corpus, removing the cross-condition duplicate-trajectory problem.

Formal corpus:

```text
games = 4096
seeds = 20280001..20284096
opening = seeded-uniform-legal, 8 plies
max ply = 100
no early stopping
no post-outcome corpus extension
```

## 9. Frozen Stage 2 exposure and comparator

Exposure unit:

```text
unique historicalTrajectoryHash
earliest fully ascertained Namua CBE only
maximum one exposure per historical trajectory
```

Primary target population:

```text
first-Mtaji morphology eligible trajectories
```

Formal comparator:

```text
R3-M
same P2-D2 condition
exact candidate ply
not Category A at index
same forced-capture status
no Namua CBE anywhere
first-Mtaji morphology eligible
20 unique controls per exposure
global control non-reuse
deterministic SHA-256 allocation
```

No matching on capture/front-row quantities is allowed.

## 10. Frozen Stage 2 estimability gates

```text
G1 morphology-eligible unique exposed trajectories >= 20
G2 every exposure receives exactly 20 unique R3-M controls
```

If G1 fails:

```text
inconclusive-insufficient-exposure
```

If G2 fails:

```text
inconclusive-comparator-shortage
```

No rescue sampling, threshold relaxation, or comparator relaxation is allowed.

## 11. Frozen primary outcome and test

Outcome:

```text
Y=1 MTAJI-M1
Y=0 MTAJI-M2
```

at the first eligible Mtaji observation using the exact frozen candidate artifact.

Primary test:

```text
matched-set exact conditional Poisson-binomial test
alpha = 0.05
two-sided
one primary test
```

Formal decisions after G1/G2 pass:

```text
p < .05  -> confirmed-association
p >= .05 -> not-confirmed
```

Direction is labeled only from the prespecified matched risk difference after significance is established.

No causal or timing interpretation is authorized.

## 12. Stage 2 outcome firewall

Execution order is frozen:

```text
generation
-> verification
-> deterministic clock
-> inherited Category-A
-> frozen CBE classification
-> R3-M preoutcome matching
-> HARD STOP / matching review
-> frozen Mtaji artifact audit
-> M1/M2 evaluation
```

The matching phase:

```bash
python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase match
```

must write:

```text
stage2-matching-audit.json
stage2-matched-sets-preoutcome.csv
```

with `morphologyLabelsRead = false` and a frozen `matchingAssignmentHash`.

Do not run `--phase evaluate` until the preoutcome matching artifacts are reviewed.

## 13. Stage 2 instrumentation

```text
tools/experiments/run-namua-mtaji-stage2-formal.js
tools/experiments/verify-namua-mtaji-stage2-formal.js
tools/experiments/audit-namua-mtaji-stage2-clock.js
tools/experiments/extract-namua-mtaji-stage2-candidates.py
tools/experiments/analyze-namua-mtaji-stage2-events.js
tools/experiments/analyze-namua-mtaji-stage2-formal.py
```

Runbook:

```text
doc/namua-mtaji-transition/STAGE_2_RUNBOOK.md
```

Checkpoint:

```text
doc/namua-mtaji-transition/checkpoints/2026-08-11-stage1-complete-stage2-formal-freeze.md
```

## 14. Immediate next local step

Follow `STAGE_2_RUNBOOK.md` exactly.

Generate the fixed 4096-game P2-D2 corpus and run only through:

```bash
python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase match
```

Then return the preoutcome artifacts for review.

## Pause point

> **Stage 1 is complete and consumed. The preregistered readiness gate passed at 14 unique CBE trajectory-ply units / 14 unique trajectories, with abundant exact-ply R3 support and no progression or structural-positivity failure. Stage 2 is now prospectively frozen: one P2-D2-only 4096-game formal corpus using seeds 20280001..20284096, earliest-CBE trajectory units, morphology-eligible R3-M 1:20 matching without control reuse, G1>=20 exposures, and one two-sided exact matched-set primary test. The next action is local execution through the preoutcome matching hard stop only; M1/M2 evaluation is not yet authorized.**
