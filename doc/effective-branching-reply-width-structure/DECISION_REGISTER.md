# EBRWS-STUDY1 — Decision Register

## D-001 — 2026-09-01 — Post-LGTGMIV G3-02 authorization

Decision: `AUTHORIZED`

Basis: `doc/research-program-decisions/2026-09-01-post-lgtgmiv-g3-02-authorization-review.md`.

Meaning: G3-02 Study-definition / preregistration may be prospectively frozen. This decision alone did not authorize fresh scientific evidence generation.

## D-002 — 2026-09-01 — Formal Study identity and protocol freeze

Decision: `FROZEN`

- Study ID: `EBRWS-STUDY1`
- research branch: `research/g3-02-effective-branching-reply-width-structure`
- baseline remote main: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- relative depth: 5
- state identity: RAW-only
- validated transform set: `[]`
- primary dependencies: LGTGMIV F1 + F5
- secondary contextual dependencies: F2 + F3 + F4
- primary construct systems: `TREE-WIDTH-SHAPE`, `REPLY-WIDTH-SHAPE`
- phase-level candidate prevalence gate: exact 2/3

No G3-02 fresh scientific evidence had been generated or read before this freeze.

## D-003 — 2026-09-01 — Fresh population freeze

Decision: `FROZEN`

Stage 1:

- `31210001..31210192`
- 12 Namua + 12 Mtaji
- `FRESH-DEVELOPMENT`

Stage 2:

- `31220001..31220288`
- 18 Namua + 18 Mtaji
- `FRESH-FORMAL-HELDOUT`

Both stages use relative depth 5. Geometry-blind selection and upstream/stage-to-stage root / trajectory / first-16-prefix firewalls are mandatory.

## D-004 — 2026-09-01 — Protected evidence

Decision: `SEALED / NOT GENERATED / NOT READ`

The standard initial RAW-root complete exact depth-10 holdout remains reserved for G3-11. EBRWS-STUDY1 does not authorize its generation or inspection.

## D-005 — 2026-09-01 — No-rescue boundary

Decision: `ACTIVE UPON FIRST STAGE-1 FRESH EVIDENCE GENERATION OR READ`

After that boundary, thresholds, endpoint definitions, measurement-family usage, phase subsets, root selection, seed blocks, horizon, class rules, promotion gate, and decision taxonomy cannot be changed to rescue the same evidence.

## D-006 — 2026-09-01 — Stage 0 technical authorization

Decision: `AUTHORIZED`

Stage: `EBRWS-S0-TECHNICAL-2026-09-01-v1`

Only synthetic/non-scientific primitive fixtures were authorized. Fresh Stage 1/2 seed consumption and protected depth-10 access were prohibited.

## D-007 — 2026-09-01 — Stage 0 technical result

Decision: `STAGE0-PASS`

All mandatory technical checks passed, including exact-rational arithmetic, class boundary cases, exact 2/3 promotion boundary, production / independent exact agreement, order invariance, telemetry separation, and static independence.

Production / independent stage scientific core:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

Fresh scientific evidence generated/read remained false. Protected depth-10 access remained false.

Stage 0 PASS did not itself authorize Stage 1.

## D-008 — 2026-09-01 — Stage 1 development authorization

Decision: `AUTHORIZED`

Stage: `EBRWS-S1-DEVELOPMENT-2026-09-01-v1`

Exactly one fresh-development execution was authorized for seed block `31210001..31210192`, 12 Namua + 12 Mtaji, relative depth 5. Stage 2 remained `NOT-AUTHORIZED-NOT-EXECUTED`.

## D-009 — 2026-09-02 — Stage 1 tooling and pre-execution gate

Decision: `PASS`

GitHub Actions tooling smoke run `33525232642`, job `99914259137`, passed without fresh scientific seed/root access. Production and independent G3-02 source hashes were distinct. Immediately before execution, no Stage 1 result artifact existed and the protected depth-10 holdout remained sealed.

## D-010 — 2026-09-02 — Stage 1 canonical materialization failure

Decision: `TECHNICAL-INVALID`

Formal Study disposition: `TECHNICAL-INVALID`.

Stage 2: `NOT-AUTHORIZED-NOT-EXECUTED`.

The authorized run `33569323221` / job `100059596453` completed the scientific execution step. The runner locally reported `STAGE1-PASS`, global mandatory gate PASS, 12 Namua + 12 Mtaji, and production / independent stage scientific core exact equality at `4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e`.

The runner-local candidate summary contained:

- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` = 9/12
- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` = 12/12

However, the canonical result files were committed only in the ephemeral runner workspace. Push of local commit `709bc393` was rejected non-fast-forward because the remote research branch advanced while execution was running. That commit is not recoverable from GitHub after runner teardown.

The no-rescue boundary had already been crossed. Missing canonical artifacts are not regenerated. The runner-local positive computation is diagnostic provenance only and is not a formal promoted candidate set.

Formal promoted candidate set: `[]`.

## D-011 — 2026-09-02 — Unintended duplicate Stage 1 execution discovered in final audit

Decision: `UNAUTHORIZED-DUPLICATE-INVALID / NO CHANGE TO FORMAL TECHNICAL-INVALID CLOSURE`

Final Actions-history audit found run `33569382663`, job `100060967285`, which executed the same Stage 1 scientific runner a second time.

Cause: while the first authorized run was still in progress, a technical workflow-arming commit added the Stage 1 workflow's own path as a push trigger because the first trigger run had not yet appeared in monitoring. That commit queued run #2 before the first scientific outcome was known. The concurrency group delayed actual run #2 computation until after run #1 had completed its scientific step and the no-rescue boundary had been crossed.

The second computation therefore violated the frozen exactly-one-execution authorization. It is not a valid replication, repair, confirmation, or rescue.

Run #2 locally reproduced the same scientific-result commitments:

```text
stage scientific core = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 = 4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
```

Its telemetry hash differed, as expected for runtime-dependent telemetry. Its local result commit `24c57398` was also rejected non-fast-forward and is not recoverable from GitHub.

Formal handling:

- authorized Stage 1 execution count = 1
- actual Stage 1 scientific execution count = 2
- execution-count contract = violated
- run #1 = diagnostic provenance only after canonical materialization failure
- run #2 = `INVALID-DO-NOT-USE`
- formal promoted candidate set = `[]`
- Stage 2 = `NOT-AUTHORIZED-NOT-EXECUTED`
- no third execution authorized

The Stage 1 execution workflow is disabled after closure. The authoritative machine-readable closure is `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`.

Protected standard-root depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.
