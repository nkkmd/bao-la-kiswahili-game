# Checkpoint — Stage 1 execution tooling implementation

Date: 2026-08-14

Study: Tactical Motifs / Tesuji Study 1

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

## State

**FROZEN SCIENTIFIC CONTRACT UNCHANGED; EXECUTION TOOLING IMPLEMENTED; TECHNICAL VALIDATION PENDING; SCIENTIFIC GENERATION STILL BLOCKED.**

The Stage 1 v1 machine-readable scientific specification remains unchanged at SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

No Stage 1 scientific corpus has been generated.

## Implemented execution tooling

- `tools/experiments/lib/tactical-motif-stage1-corpus.js`
  - fixed seed/condition assignment
  - seeded exact-moveVariant opening
  - fixed-depth trajectory generation
  - trajectory/opening identities
  - frozen-source SHA-256 inventory
  - authorization-file validation
- `tools/experiments/run-tactical-motif-stage1-exploratory.js`
  - `status`
  - `generate`
  - `select`
  - `measure`
  - `discover`
- `tools/experiments/verify-tactical-motif-stage1-exploratory.js`
  - independent seed replay
  - opening move recomputation
  - trajectory AI search recomputation
  - observation/move/state identity verification
  - trajectory/opening hash verification
- `test/tactical-motif-stage1-tooling.test.js`
  - deterministic smoke trajectories across all six generation strata
  - full-search replay verification
  - response-envelope/candidate-grammar checks
  - authorization-absent status check

## Scientific firewalls implemented

1. `status` is technical-only and does not require authorization.
2. `generate`, `select`, `measure`, and `discover` require a valid Stage 1 authorization file.
3. The authorization must bind the exact frozen spec SHA-256 and the exact SHA-256 mapping of every frozen scientific source file.
4. `select` additionally requires `verification.json` with `passed=true` and `fullSearchRecomputation=true`.
5. `measure` requires the frozen selection-readiness gates to pass.
6. `discover` requires the frozen minimum measured-move-record gate to pass.
7. GitHub Actions executes only technical/smoke validation and `status`; it does not generate the 768-game scientific corpus.

## Next gate

Run dedicated Stage 1 pre-generation CI on this implementation commit.

If and only if it succeeds, record the exact validated implementation commit, workflow run, and source-file hashes in a separate `STAGE_1_EXPLORATORY_AUTHORIZATION.json` commit.

Even after authorization, the scientific corpus remains ungenerated until an explicit later execution step.
