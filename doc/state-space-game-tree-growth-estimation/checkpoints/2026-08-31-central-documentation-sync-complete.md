# G2-12 central documentation synchronization complete

Date: 2026-08-31  
Study: `SSGTGE-STUDY1`  
Branch: `research/g2-12-state-space-game-tree-growth-estimation`

## Closure state before synchronization

```text
Study formal decision = TECHNICAL-INVALID
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
canonical selectedEstimator = null
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
fresh depth 10/11 = NOT GENERATED / NOT READ
Study-local closure commit = 4f63d615ef25702d99881aedf4a4054fbe7c275b
```

## Central synchronization authorization

A one-time branch-only synchronization was used because the central documents are large and exact-anchor editing was safer than manual full-document reconstruction.

```text
authorization commit = 57c813726e72486f38f3da86216523afbccdafd7
mainIntegrationAuthorized = false
scientificDecisionChangeAuthorized = false
sameEvidenceRerunAuthorized = false
freshDepth10Or11GenerationAuthorized = false
```

Allowed central paths were restricted to:

- `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`

## Execution and verification

```text
workflow run = 33339370675
job = 99332085365
workflow conclusion = success
central-doc sync commit = f69e4a7912e39bfd424969e5cd220ac36baa5d15
```

The workflow used fail-closed exact anchors and `git diff --check`. Direct post-run inspection confirmed:

- root README contains the G2-12 `TECHNICAL-INVALID` closure;
- `doc/RESEARCH_INDEX.md` contains section 28 for `SSGTGE-STUDY1`;
- `doc/FUTURE_RESEARCH_AGENDA.md` marks G2-12 completed / `TECHNICAL-INVALID`, records the no-rescue closure, and updates the priority line;
- the Research Generation 2 program decision contains the 2026-08-31 G2-12 closure section.

No accepted estimator was introduced by documentation synchronization. The production-only E2 proposal remains diagnostic-only.

## Temporary write-capable helper removal

After successful synchronization, the temporary helper files were removed:

```text
.github/workflows/ssgtge-central-doc-sync.yml
removal commit = 9651f62c8f07605800b6a9103d9d6966c389870d

tools/maintenance/sync-g2-12-central-docs.js
removal commit = 8ef6b0329d386db48c729ea5017cfe6f4e21eb10
```

The machine-readable authorization file is retained as immutable provenance, but its triggering workflow no longer exists.

## Main boundary

No commit was merged or pushed to `main`. The expected remote `main` remains the study baseline until separately re-audited:

```text
c5efcdb7972d1bc775a2857c1b0641c35c9df622
```

This checkpoint does not authorize future `main` integration.
