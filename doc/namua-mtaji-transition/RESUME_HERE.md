# Namua→Mtaji Strategic Temporal Transition — RESUME HERE

更新日: 2026-08-11  
Purpose: **新しいチャット・新しいローカルセッションから研究状態を安全に復元するための入口**

## 0. 最重要の現在地

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

現在の状態:

```text
Stage 0 technical feasibility = CLOSED PASS
Stage 1 exploratory work      = COMPLETE / CONSUMED
Stage 2 formal design         = FROZEN
Stage 2 formal generation     = NOT STARTED
Stage 2 preoutcome matching   = NOT STARTED
M1/M2 formal evaluation       = NOT AUTHORIZED
```

Branch:

```text
research/namua-mtaji-temporal-transition
```

Study-start main head:

```text
c7d06d485789e1ea96d6603802423951a88c1f87
```

The last formal-design hardening checkpoint before this resume document was created at branch head:

```text
e6359b49675d12c91865ca2593ed634b7294365e
```

On resume, **do not assume this is still the branch tip**. Fetch the current branch and verify its actual head before acting.

## 1. Required read order

Read these files in order before making any scientific or implementation decision:

1. `doc/namua-mtaji-transition/RESUME_HERE.md`
2. `doc/namua-mtaji-transition/CURRENT_STATUS.md`
3. `doc/namua-mtaji-transition/checkpoints/2026-08-11-stage2-pre-generation-firewall-hardening.md`
4. `doc/namua-mtaji-transition/STAGE_2_FORMAL_PROTOCOL.md`
5. `doc/namua-mtaji-transition/preregistration/STAGE_2_FORMAL_SPEC.json`
6. `doc/namua-mtaji-transition/STAGE_2_RUNBOOK.md`
7. `doc/namua-mtaji-transition/checkpoints/2026-08-11-stage1-complete-stage2-formal-freeze.md`
8. `doc/namua-mtaji-transition/STAGE_1_FINAL_EXTENSION_RESULT.md`
9. `doc/namua-mtaji-transition/STAGE_1_EXTENSION_RISKSET_RESULT.md`
10. `doc/namua-mtaji-transition/STAGE_1_RISKSET_RESULT.md`

Read older Stage 0 / Stage 1 protocol and amendment files only when needed to resolve provenance or inherited-definition questions.

## 2. Immutable inherited boundaries

Do not reopen or reinterpret closed studies.

### Phase-transition Study 1

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
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

Historical Category-A definition remains unchanged:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing signal groups = reserve / mobility / capture / front
```

### Position typology / playing style

Frozen Mtaji classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

Never refit, restandardize, relabel, change features, or use alternative-k rescue.

Namua discrete type remains unsupported. N-ACT/N-CON are exploratory coordinates only. STYLE-C1..C4 exact geometry remains formal not-confirmed.

## 3. Deterministic Namua clock — permanent interpretation boundary

For a standard trajectory that survives Namua:

```text
initial total reserve = 44
first Mtaji observation = ply 44
Namua total reserve at ply t = 44 - t
```

Therefore candidate-to-first-Mtaji distance is deterministic progression, not survival time.

Never claim:

- CBE accelerates Mtaji;
- CBE delays Mtaji;
- CBE changes first-Mtaji hazard;
- first-Mtaji timing is a survival endpoint.

## 4. Stage 1 final state — complete and consumed

All Stage 1 corpora are exploratory and permanently consumed. They may support design/provenance, but **must never enter Stage 2 formal inference**.

Final combined readiness result:

```text
raw CBE condition rows = 23
unique CBE historicalTrajectoryHash + candidatePly units = 14
unique CBE historical trajectories = 14

frozen readiness gate:
units >= 10
trajectories >= 8

result = PASS
```

Observed exact-ply R3 comparator support was abundant across all observed CBE clock positions. In the final extension:

```text
R3 unique controls per exposure-condition stratum = 601..646
progression violations = 0
364/364 audited exposure-vs-R3 structural range comparisons were in-range
```

Comparator scarcity is therefore not the reason for Stage 2 uncertainty.

## 5. Stage 2 frozen formal design

Primary and only formal condition:

```text
P2-D2
hard / bao / phase2 / depth2
```

Fixed formal corpus:

```text
games = 4096
opening seeds = 20280001..20284096
opening policy = seeded-uniform-legal
opening plies = 8
max ply = 100
no early stopping
no post-outcome extension
```

Exposure unit:

```text
unique historicalTrajectoryHash
earliest fully ascertained Namua CBE only
maximum one exposure per historical trajectory
```

Primary target population:

```text
firstMtajiMorphologyEligible == true
```

Formal comparator `R3-M`:

```text
same P2-D2 condition
exact candidate ply
not Category A at exact index
same actor forced-capture status
control trajectory has no Namua CBE anywhere
first-Mtaji morphology eligible
20 unique controls per exposure
global control reuse = false
deterministic SHA-256 allocation
no matching on capture/front-row quantities
```

Estimability gates:

```text
G1: morphology-eligible unique exposed trajectories >= 20
G2: every exposure receives exactly 20 unique R3-M controls
```

Frozen failures:

```text
G1 fail -> inconclusive-insufficient-exposure
G2 fail -> inconclusive-comparator-shortage
```

No rescue sampling, threshold relaxation, comparator relaxation, or favorable reseeding is authorized.

Primary outcome/test:

```text
Y=1 MTAJI-M1
Y=0 MTAJI-M2
matched-set exact conditional Poisson-binomial test
two-sided alpha = 0.05
one primary test
```

Allowed interpretation is a bounded association within the frozen P2-D2, Mtaji-reaching target population. Causal, timing, or broad-generalization claims are unauthorized.

## 6. Machine-enforced outcome firewall

Required execution order:

```text
formal generation
-> full verification
-> deterministic-clock audit
-> inherited Category-A extraction
-> frozen CBE classification
-> R3-M preoutcome matching
-> HARD STOP / independent review
-> outcome unlock commit
-> frozen Mtaji artifact audit
-> M1/M2 evaluation
```

Before the preoutcome review, this file must **not exist**:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

`--phase match` must not load the frozen Mtaji classifier or read M1/M2 labels.

`--phase evaluate` is machine-blocked until an independently committed unlock file binds the exact observed:

```text
inputConfigHash
formalSourceCommit
matchingAssignmentHash
preoutcomeAssignmentCsvSha256
formalSpecSha256
eventTableSha256
```

Do not create or guess the unlock before the preoutcome artifacts have been reviewed.

## 7. Immediate resume action

First restore repository state only. Do not generate data until the branch, files, and formal boundary have been checked.

```bash
git fetch origin
git switch research/namua-mtaji-temporal-transition
git pull --ff-only

git rev-parse HEAD
git status --short

test ! -e doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

Then follow `doc/namua-mtaji-transition/STAGE_2_RUNBOOK.md` exactly.

The next scientific execution is the one-shot 4096-game P2-D2 formal corpus. Run only through:

```bash
python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase match
```

Then **stop** and review/upload the preoutcome artifacts. Do not run `--phase evaluate`.

Required preoutcome artifacts:

```text
manifest.json
verification.json
clock-audit.json
candidate-pipeline-audit.json
stage2-event-audit.json
stage2-event-table.csv
stage2-matching-audit.json
stage2-matched-sets-preoutcome.csv
```

## 8. Local artifact policy

Formal and exploratory corpora under `artifacts/local/` remain gitignored and must not be committed.

Stage 2 formal generation must be local only. Do not move formal corpus generation into GitHub Actions.

## 9. Pause point

> **Research is deliberately paused after Stage 1 completion and after Stage 2 protocol/spec/instrumentation/outcome-firewall freeze, but before any Stage 2 formal held-out game is generated. This is a clean prospective boundary. On resume, restore the branch and read order above, verify that the outcome unlock is absent, then execute the frozen Stage 2 runbook only through the preoutcome matching hard stop.**
