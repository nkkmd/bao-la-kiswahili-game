# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-21

## Research identity

```text
studyId = BMP-STUDY1
research branch = research/blunder-misvaluation-patterns
baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
Stage 1 contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
Stage 1 contract validation execution HEAD = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
validated implementation commit = 8df328ca238611919ac58c262b92058712ee1049
tooling validation result commit = cd26cb3280fde00663618162f7c1e2d306470032
execution source freeze commit = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
Stage 1 generation authorization commit = 1af3828c1c25789d6f4af590ee973cffd34bca46
```

## Current scientific state

```text
Stage 0 design restoration/audit = COMPLETE
Stage 0 executable technical semantics validation = PASS
Stage 0 D3+Q1 compute feasibility = PASS
Stage 1 exploratory spec = FROZEN
Stage 1 canonical contract validation = PASS
Stage 1 execution tooling validation = PASS
Stage 1 exact source-file SHA-256 map = FROZEN
Stage 1 scientific generation = AUTHORIZED
Stage 1 scientific corpus generated = 0
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
formal scientific result = NONE
```

## Frozen Stage 1 identity

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

The complete reserved Stage 1 seed block is the exact authorized population. No extension, replacement sampling, phase reassignment or threshold retuning is authorized.

## Authorization chain

The Stage 1 generation authorization is bound to:

```text
spec freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
contract validation execution HEAD = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
validated implementation commit = 8df328ca238611919ac58c262b92058712ee1049
tooling validation PASS = cd26cb3280fde00663618162f7c1e2d306470032
source SHA freeze = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
authorization = 1af3828c1c25789d6f4af590ee973cffd34bca46
```

Authorization file:

`preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`

The authorization permits only the frozen Stage 1 exploratory pipeline:

```text
generate
→ independent full replay/search verify
→ select
→ inspect selection readiness
→ measure
→ inspect measurement readiness
→ discover
```

It does **not** authorize confirmatory inference, Stage 2 generation, game-theoretic blunder claims, or human misconception claims.

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

Insufficient support causes readiness failure. It does not authorize replacement or additional games.

## Frozen readiness gate

```text
unique historical trajectories >= 1600
selected unique rule states = 1200
Namua selected = 600
Mtaji selected = 600
distinct opening prefixes >= 128
selected per generation stratum >= 100
measured move records >= 3600
complete finite D3 tables for all selected roots
```

## Frozen candidate promotion gate

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

Automatic cap: 6 total / 3 per phase / 2 per failure family. Manual override is forbidden.

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

## Immediate next gate

Stage 1 generation may now be executed on the research branch. After generation, independent full replay/search verification must PASS before state selection is allowed.

Current pre-generation state remains:

```text
scientific games generated = 0
manifest = absent
verification = absent
selection audit = absent
measurements = 0
discovery result = absent
Stage 2 generation authorized = false
```
