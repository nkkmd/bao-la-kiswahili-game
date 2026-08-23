# RESEARCH_LOG — Critical Positions / Outcome Branching Study 1

## 2026-08-23 — Study initiation / Stage 0 design

### Repository baseline

Verified GitHub `main` rather than assuming the previously reported value.

```text
previously reported HEAD = 2c452186fc1bfbe2800c84d9acc8546915c33da1
actual verified HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
branch = research/critical-positions-outcome-branching
```

### Prior-state restoration

Read and restored canonical scientific states from:

- root README / RESEARCH_INDEX / FUTURE_RESEARCH_AGENDA;
- Blunder / Misvaluation Patterns Study 1;
- Position Evaluation / Win-Rate Calibration Study 1;
- Position Complexity / Difficulty Study 1;
- Tactical Motifs / Tesuji Study 1;
- Tactical Motif Human / Expert Validation Study 1;
- Phase Transition Study 1;
- Position Typology / Playing Style Study 1;
- Namua→Mtaji Strategic Temporal Transition Study 1.

No historical formal decision was changed.

### Technical source inspection

Inspected current engine / AI / exact-root diagnostic behavior relevant to Stage 0:

- `E.moveVariants` exact legal variant enumeration;
- `AI.moveKey` exact move identity;
- seeded RNG injection into `AI.analyzeMove`;
- existing `normal` top-3 immediate-score stochastic selection;
- deterministic hard search path;
- exact D2/D3 candidate diagnostic semantics;
- terminal winner and administrative max-ply distinction;
- existing historical trajectory / opening / rule-state identity practice.

### Seed audit

Restored recent consumed blocks through BMP Stage 2 and searched proposed new block starts. No tracked declaration conflict was found for exact starts `22600001` or `22700001`.

Reserved:

```text
Stage 1 = 22600001..22603072
Stage 2 = 22700001..22706144
```

No Stage 0 scientific source-game seed block was assigned.

### Construct decision

Primary construct selected prospectively:

```text
fixed-policy empirical continuation divergence
```

Search-value separation, ranking instability and structural branch divergence remain separate secondary axes.

### Current gate

```text
scientific data generation = BLOCKED
Stage 0 technical tooling execution = NEXT
```

No scientific corpus or scientific continuation outcomes were generated during this initiation step.

## 2026-08-23 — Stage 1 source corpus generation

The source-bound Stage 1 authorization had already been issued and validated before scientific generation.

The generated Stage 1 manifest reported:

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
specSha256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
games = 3072
seeds = 22600001..22603072
sourceCommit = 157a4947435213b430ae7a9a85cc861aebfc258e
sourceTreeDirty = false
summaryHash = 1a56b7afb8c6c295f827c0546a87e9c2b0788914bffd1587b47f0d778bf73d63
```

All six generation strata contained exactly 512 games.

Outcome-independent identity/diversity summary:

```text
uniqueHistoricalTrajectories = 2726
duplicateHistoricalTrajectoryGroups = 232
largestHistoricalTrajectoryGroup = 7
distinctOpeningPrefixes = 2226
```

The preregistered generation-level gates `uniqueHistoricalTrajectories >= 2500` and `generatedDistinctOpeningPrefixes >= 1800` are satisfied. This does not imply selection readiness.

The manifest scientific source hashes match the authorization-bound source mapping. No seed extension, replacement generation, or scientific continuation measurement has occurred.

Current gate:

```text
Stage 1 source generation = COMPLETE
independent full corpus replay verification = NEXT / REQUIRED
root selection = BLOCKED pending verification PASS
continuation measurement = NOT STARTED
scientific continuation outcomes inspected = false
```
