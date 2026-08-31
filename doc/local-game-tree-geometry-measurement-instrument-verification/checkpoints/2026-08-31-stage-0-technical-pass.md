# LGTGMIV-STUDY1 — Stage 0 Technical PASS Checkpoint

Date: 2026-08-31

## Scope

This checkpoint records the completed technical-only validation of `LGTGMIV-S0-TECHNICAL-2026-08-31-v1`. It does not create or read Stage 1 or Stage 2 scientific evidence and does not change any frozen scientific contract.

## Identity and provenance

- Study: `LGTGMIV-STUDY1`
- source `main` baseline: `a53aabd26f78ac408445aff2d18ace3b21b827d7`
- research branch: `research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification`
- prospective Study freeze commit: `1ffdfb631cd1f7f56a798fe62c6e0cd732547b17`
- Stage 0 implementation commit: `aa8dee624c09ff03af476bb7d82f850d7c8c3223`
- formal GitHub Actions run: `33386868192`
- workflow result commit: `044b39cd414f208226c989c17aeb61ae412d80a2`
- formal result: `results/stage-0/technical-validation.json`

## Formal Stage 0 disposition

`STAGE0-PASS`

The formal result records all mandatory technical checks as passing, including:

- hand-derived fixture assertions
- traversal / legal-move-order invariance
- family-order invariance
- root-order invariance
- repeat-run determinism
- deterministic RAW-state serialization across implementations
- deterministic move serialization across implementations
- production / structurally independent reconstruction agreement
- production / structurally independent family agreement
- production / structurally independent root/stage scientific agreement
- telemetry-mutation invariance
- legacy failure-mode negative control
- static implementation-independence audit
- scientific-evidence and protected-holdout firewall checks

## Exact cross-implementation digests

Production and independent implementations both produced:

- `stageReconstructionCoreSha256 = 33c63d62cfaf9f38d81680f42e799a5084e2ef86686810bbe46f543a9fbe42b9`
- `stageScientificCoreSha256 = 38871e544593fa4e0120fe77bbb48c47e643bb89d816acfde2dfd1dd9bdc0c0b`

Family-level exact agreement was also obtained for all five prospectively defined candidate families. This technical agreement does not itself establish formal scientific eligibility for any family.

## G3-01 failure-mode control

The new deterministic scientific core is invariant to execution-dependent telemetry changes. Elapsed time, RSS, PID, runner/path and equivalent runtime observations are outside the scientific canonical digest input.

A negative control that intentionally places such telemetry into an otherwise canonical scientific object changes the digest as expected. Thus the G3-01 stage-manifest failure mode is both detected by the control and excluded from the new scientific-core contract.

## Evidence firewall state at Stage 0 completion

- Stage 1 block `31110001..31110128`: `RESERVED / NOT GENERATED / NOT READ`
- Stage 2 block `31120001..31120192`: `RESERVED / NOT GENERATED / NOT READ`
- G3-01 block `31010001..31010096`: historical only; prohibited as new scientific evidence
- protected standard-root exact depth-10 holdout: `SEALED / NOT GENERATED / NOT READ`

## Progression consequence

Stage 0 PASS satisfies the first prerequisite for Stage 1 progression under prospective Decision D-009. The Stage 0 result explicitly does **not** authorize Stage 1 by itself. Stage 1 remains non-executable until a separate prospective Stage 1 authorization artifact is committed.

This checkpoint does not authorize Stage 2 or any protected-evidence access.

## Immutable boundaries

- `LGTGMF-STUDY1` remains `CLOSED / TECHNICAL-INVALID`.
- G3-01 formal eligible measurement families remain `[]`.
- G3-01 Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED`.
- Research Generation 2 remains closed.
- authoritative scientific state identity remains RAW-only.
- validated transform set remains `[]`.
- G3-02..G3-08 automatic start remains blocked.
