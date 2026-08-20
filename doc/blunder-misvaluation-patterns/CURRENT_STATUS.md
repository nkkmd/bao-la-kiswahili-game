# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20

## Research identity

```text
studyId = BMP-STUDY1
research branch = research/blunder-misvaluation-patterns
baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
initial design commit = 0c0b88649cd77043bfadc2a2d48c7f27b611dc2d
Stage 0 tooling commit = dff7d11874c92d585f50f57b3077204271ab682b
Stage 0 feasibility execution HEAD = 45ce006eb63d5555a030d50fe7aa4e97637db327
Stage 1 contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
```

## Current scientific state

```text
Stage 0 design restoration/audit = COMPLETE
Stage 0 executable technical semantics validation = PASS
Stage 0 D3+Q1 compute feasibility = PASS
Stage 1 exploratory spec = FROZEN
Stage 1 canonical contract validation = PENDING
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
scientific corpus generated in this Study = 0
formal scientific result = NONE
```

## Stage 0 closure

Required semantics tests returned PASS.

The later feasibility benchmark was executed on exact returned local HEAD:

```text
45ce006eb63d5555a030d50fe7aa4e97637db327
```

Benchmark:

```text
benchmarkId = BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1
coveragePassed = true
technical roots = Namua 4 + Mtaji 4
overall mean total measurement = 214.412715875 ms/root
overall median total measurement = 139.4082525 ms/root
projected serial hours / 2000 roots = 0.11911817548611109
scientific seed namespace used = false
scientific corpus generated = false
```

Decision:

```text
Stage 0 compute feasibility = PASS
primary D3+Q1 reference = RETAIN
```

Machine-readable archive:

`results/STAGE_0_FEASIBILITY_RESULT.json`

## Frozen Stage 1 exploratory design

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
games = 2048
seeds = 22400001..22402048
maxPly = 100
selected roots if readiness passes = 1200
Namua quota = 600
Mtaji quota = 600
primary reference = D3 + Q1 / bao / root actor
```

The fixed Stage 1 seed interval uses the full previously reserved capacity. No outcome-dependent extension remains available inside this Study version.

## Root-selection firewall

```text
collapse historicalTrajectoryHash
→ hash phase assignment
→ one eligible root in assigned phase
→ no unavailable-phase reassignment
→ duplicate ruleStateKey collapse
→ hash quota ranking
→ 600 Namua + 600 Mtaji if sufficient
```

Insufficient phase support causes readiness failure, not replacement or corpus extension.

## Candidate anti-selection-bias rule

The candidate **matcher** is:

```text
phase + 1–2 structural preconditions + move abstraction
```

The failure signature is separate and excluded from the matcher.

For each matcher/trajectory, the representative exact move is the lexicographically smallest `AI.moveKey`.

D3-inferior and failure-signature rates are evaluated over all outcome-blind matcher opportunities.

## Frozen promotion gate

A candidate requires all of:

```text
opportunity trajectories >= 24
opportunity rule states >= 24
failure-positive trajectories >= 16
opening prefixes >= 6
max one opening prefix <= 0.40
generation strata >= 3
max one stratum <= 0.60
failure-signature rate >= 0.65
D3-inferior rate >= 0.70
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Automatic cap:

```text
total <= 6
per phase <= 3
per failure family <= 2
manual override = false
```

## Frozen inherited boundaries

```text
Position Evaluation / Win-Rate Calibration Study 1
  formal decision = INCONCLUSIVE
  isotonic mapping = exploratory-only

Position Complexity / Difficulty Study 1
  PCX-H1 = INCONCLUSIVE
  PCX-H2 = NOT-CONFIRMATORILY-EVALUATED

Tactical Motifs / Tesuji Study 1
  C01 = NOT-CONFIRMED
  C02 = NOT-CONFIRMED
  C03 = CONFIRMED
  C04 = NOT-CONFIRMED

Tactical Motif Human / Expert Validation Study 1
  machineEvidence = CONFIRMED
  humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
  humanExpertN = 0
```

No closed-study decision is reopened.

## Current gate

Canonical Stage 1 contract files are now defined by the freeze:

```text
STAGE_1_EXPLORATORY_PROTOCOL.md
preregistration/STAGE_1_EXPLORATORY_SPEC.json
tools/experiments/lib/blunder-misvaluation-stage1-contract.js
tools/experiments/validate-blunder-misvaluation-stage1-spec.js
test/blunder-misvaluation-stage1-contract.test.js
```

Before scientific generation:

1. execute the canonical spec validator and contract test;
2. implement a runner and independent replay/search verifier without changing the frozen scientific contract;
3. technically validate that implementation;
4. freeze exact source-file SHA-256 mapping and spec SHA-256;
5. create a separate source-bound Stage 1 generation authorization.

Until then:

```text
Stage 1 generation authorized = false
Stage 2 generation authorized = false
```
