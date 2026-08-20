# Blunder / Misvaluation Patterns Study 1 — Stage 0 Feasibility PASS and Stage 1 Exploratory Design Freeze

Date: 2026-08-20  
Status: **STAGE 0 FEASIBILITY PASS / STAGE 1 SPEC FROZEN / SCIENTIFIC GENERATION BLOCKED**

## Provenance

The investigator returned the canonical local repository identity immediately before the benchmark:

```text
branch = research/blunder-misvaluation-patterns
HEAD = 45ce006eb63d5555a030d50fe7aa4e97637db327
```

This exactly matches the repository HEAD that materialized the Stage 0 feasibility script.

Unlike the earlier semantics-test transcript, this benchmark execution therefore has an exact returned source commit.

## Stage 0 benchmark result

```text
benchmarkId = BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1
technicalOnly = true
scientificCorpusGenerated = false
reservedScientificSeedNamespaceUsed = false
coveragePassed = true
selected technical roots = Namua 4 / Mtaji 4
```

Overall returned workload:

```text
mean total measurement = 214.412715875 ms/root
median total measurement = 139.4082525 ms/root
max total measurement = 770.202466 ms/root
projected serial hours / 1000 roots = 0.059559087743055544
projected serial hours / 2000 roots = 0.11911817548611109
```

No scientific score, regret, candidate-pattern, outcome or effect inference was authorized by the benchmark.

Machine-readable result:

`doc/blunder-misvaluation-patterns/results/STAGE_0_FEASIBILITY_RESULT.json`

## Technical decision

```text
D3+Q1 primary reference = RETAIN
technical compute feasibility = PASS
```

There is no technical reason from Stage 0 workload to amend the already frozen D3+Q1 primary reference.

## Stage 1 population freeze

The previously reserved Stage 1 block is now used as the exact population:

```text
games = 2048
seeds = 22400001..22402048
maxPly = 100
opening randomized prefix = first 8 plies
```

No unused within-study seed extension capacity remains.

## Stage 1 root budget

After trajectory deduplication, hash phase assignment, one-root-per-trajectory selection and duplicate rule-state collapse:

```text
Namua quota = 600
Mtaji quota = 600
total selected roots if readiness passes = 1200
```

Insufficient phase pools cause readiness failure. No phase reassignment, replacement or extension is permitted.

## Candidate-selection anti-bias rule

A Stage 1 candidate separates:

```text
outcome-blind matcher =
  phase + 1–2 structural preconditions + move abstraction

failure signature =
  one separately measured structural / response / horizon / static token
```

Promotion rates are evaluated over **all matcher opportunities**. Failure-positive records are not allowed to define their own denominator.

Within one trajectory and matcher, the representative exact move is the lexicographically smallest `AI.moveKey`.

## Frozen promotion gate

All must pass:

```text
opportunity trajectories >= 24
opportunity rule states >= 24
failure-positive trajectories >= 16
opening prefixes >= 6
max one opening prefix <= 0.40
generation strata >= 3
max one stratum <= 0.60
failure rate >= 0.65
D3-inferior rate >= 0.70
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Automatic promoted-candidate cap:

```text
total <= 6
per phase <= 3
per failure family <= 2
```

Manual override is forbidden.

## Frozen Stage 1 spec

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
```

Canonical files:

```text
doc/blunder-misvaluation-patterns/STAGE_1_EXPLORATORY_PROTOCOL.md
doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_SPEC.json
tools/experiments/lib/blunder-misvaluation-stage1-contract.js
tools/experiments/validate-blunder-misvaluation-stage1-spec.js
test/blunder-misvaluation-stage1-contract.test.js
```

A clean-room pre-materialization self-check of the exact planned spec/contract content returned validator PASS and contract-test PASS. This is only a construction check. Canonical post-commit execution is still required.

## Firewall state

```text
Stage 1 spec frozen = true
Stage 1 canonical contract validation = PENDING
Stage 1 scientific generation authorized = false
Stage 2 scientific generation authorized = false
scientific corpus generated = 0
```

Next work is canonical spec/contract validation, followed by runner/verifier implementation and source-hash-bound authorization. No scientific generation is permitted yet.
