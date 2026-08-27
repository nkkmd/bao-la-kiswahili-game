# SRDR-STUDY1 — Reproducibility Index

更新日: 2026-08-27

## Study anchor

```text
Program label = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Branch = research/g2-02-search-reliability-decision-robustness
```

## Stage identities

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
```

## Initial frozen spec

```text
preregistration/STAGE_0_TECHNICAL_SPEC.json
SHA-256 = 12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
scientificSeedUseAllowed = false
```

## Upstream records audited before Study freeze

- `README.md`
- `doc/FUTURE_RESEARCH_AGENDA.md` Version 2.0.0, Research Generation 2 Section 9
- `doc/RESEARCH_INDEX.md`
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`
- `doc/position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md`
- `doc/position-evaluation-empirical-outcome-calibration-replication/STUDY_1_FINAL_REPORT.md`
- `doc/position-evaluation-empirical-outcome-calibration-replication/CURRENT_STATUS.md`
- `doc/position-evaluation-empirical-outcome-calibration-replication/DECISION_REGISTER.md`
- `doc/position-evaluation-empirical-outcome-calibration-replication/REPRODUCIBILITY_INDEX.md`
- `doc/position-evaluation-empirical-outcome-calibration-replication/results/STAGE_2_FORMAL_RESULT.json`
- `doc/position-complexity/STUDY_1_FINAL_REPORT.md`
- `doc/position-complexity/CURRENT_STATUS.md`
- `doc/position-complexity/EXPERIMENT_INDEX.md`
- `doc/position-complexity/STAGE_1_EXPLORATORY_PROTOCOL.md`
- `doc/position-complexity/RESEARCH_PLAN.md`

## Search implementation audited before Stage 0

```text
public/ai.js
tools/experiments/lib/position-complexity-search-diagnostic.js
```

Observed implementation capabilities at the baseline commit:

- `AI.analyzeMove()` fixed depth / time limit / quiescence / ordering / aspiration / stability controls;
- exact root-candidate diagnostic with full legal move-set scores, TopSet, ranking and depth transitions;
- no public first-class dedicated node-budget cap;
- no public first-class PV sequence result.

## Required Stage 0 source freeze before execution

Exact SHA-256 values must be recorded for every file in the Stage 0 scientific/technical measurement path before the Stage 0 result is accepted, including at minimum:

```text
public/engine.js
public/ai.js
public/ai-weights.js
tools/experiments/lib/position-complexity-search-diagnostic.js
new SRDR Stage 0 production instrumentation
new SRDR Stage 0 independent verifier
preregistration/STAGE_0_TECHNICAL_SPEC.json
```

Any additional helper entering measurement semantics must be included.

## Pre-Stage 1 authorization requirement

Before fresh scientific Stage 1 generation, freeze and record:

```text
Stage 0 PASS result + independent verification
Stage 1 machine-readable spec SHA-256
complete Stage 1 source-file SHA-256 set
fresh population / seed range
selection rule / identity firewall
search-condition grid
move / tie / TopSet / ranking / PV rules
estimability/readiness gates
independent verifier
explicit authorization record
```

Stage 1 generation is currently **NOT AUTHORIZED**.

## Pre-Stage 2 authorization requirement

Stage 2 requires a new held-out spec and source-bound explicit authorization after Stage 1 is fully consumed. The numeric formal criterion / tolerance and formal decision inputs must be frozen before any Stage 2 outcome generation.

Stage 2 generation is currently **NOT AUTHORIZED**.

## Canonical evidence placeholders

No Stage 0 execution artifact, selection hash, measurement hash, artifact ZIP SHA-256, or canonical result SHA-256 exists yet. These fields must not be populated from historical PCX/G2-01 artifacts.
