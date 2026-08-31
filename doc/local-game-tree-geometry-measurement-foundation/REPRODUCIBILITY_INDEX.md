# G3-01 / LGTGMF-STUDY1 — Reproducibility Index

更新日: 2026-08-31

## Baseline / branch

```text
remote main = 7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f
branch = research/g3-01-local-game-tree-geometry-measurement-foundation
```

## Upstream scientific references

- `doc/research-generation-3/PROGRAM_PLAN.md`
- `doc/research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`
- `doc/research-generation-2/FINAL_SYNTHESIS.md`
- `doc/research-generation-2/PROGRAM_FINAL_RESULT.json`
- `doc/deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`
- `doc/deep-raw-state-space-enumeration/STUDY_1_FINAL_REPORT.md`
- `doc/deep-raw-state-space-enumeration/preregistration/STAGE_2_FORMAL_SPEC.json`

## Engine / identity references

- `public/engine.js`
- `tools/experiments/lib/drsse-production.js` — historical implementation reference only; importing its scientific aggregation into the new independent verifier is prohibited.
- `tools/experiments/lib/drsse-independent.js` — historical independent implementation reference only.

## Prospective authority

- `STUDY_1_PROTOCOL.md`
- `preregistration/STUDY_START_SPEC.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `preregistration/STAGE_2_FORMAL_SPEC.json`
- `DECISION_REGISTER.md`

If Markdown prose and JSON disagree on a machine-checkable field, the conflict must be treated as a technical integrity defect and resolved only before the affected scientific evidence is generated/read. It must not be resolved outcome-aware.

## Planned implementation separation

Production implementation and structurally independent verifier must be separate modules and separate result assembly paths. The verifier must reconstruct each local domain from the selected root RAW state and authoritative engine semantics rather than merely rehash production rows.

Shared dependency is limited to authoritative `public/engine.js`, Node standard-library cryptographic primitives, and frozen schema constants. Production serializer, move key, traversal, deduplication, transposition aggregation, reconvergence logic, reply-width aggregation, metric assembly and decision mapping are not importable into the independent path.

## Planned canonical artifacts

Per root:

```text
root manifest
selection identity
per-depth integer primitives
canonical histograms
exact rational pairs
state-set SHA256 per depth
transition-set SHA256 per depth
root-branch membership digest
metric-family digests
measurementCoreSha256
resource / completeness record
```

Per Stage:

```text
selected-root manifest
firewall audit
root digest manifest
stageCoreSha256
production compact summary
independent compact summary
exact comparison report
```

Full row dumps, if created, are supplemental and are not the only formal verification route.

## Protected evidence

Standard initial RAW root complete exact depth-10 layer remains G3-11-only. No G3-01 file should contain its complete state set, exact layer count, geometry summary or layer hash.

## Current artifacts

At the initial prospective checkpoint there are no scientific result artifacts and no consumed scientific seeds. Result paths will be added only after the relevant Stage is separately authorized and executed.
