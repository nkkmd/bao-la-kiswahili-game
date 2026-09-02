# EBRWS-STUDY1 — Reproducibility Index

## Study identity

- Study ID: `EBRWS-STUDY1`
- agenda: Research Generation 3 `G3-02`
- final disposition: `CLOSED / TECHNICAL-INVALID`
- baseline remote main: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- research branch: `research/g3-02-effective-branching-reply-width-structure`
- authoritative state identity: RAW-only
- validated transform set: `[]`
- relative local horizon: depth 5

## Canonical protocol records

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `DECISION_REGISTER.md`
- `CURRENT_STATUS.md`

Protocol blob frozen before scientific evidence: `cc367fe5315d1553f75cf3b95e629184070f05ac`.
Preregistration blob frozen before scientific evidence: `bdf7d35bcf8554e5a29bd5f2e92b27bb7edc8498`.

## Upstream instrument dependency

Formal eligible families only:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`
- `LGTGMIV-F5-REPLY-GEOMETRY`

Primary endpoint uses F1 + F5. F2-F4 are secondary context only.

## Stage 0

- ID: `EBRWS-S0-TECHNICAL-2026-09-01-v1`
- evidence: technical fixtures only
- disposition: `STAGE0-PASS`
- production / independent scientific core: `ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`
- fresh seed consumption: false
- protected depth-10 access: false

Records:

- `results/stage-0/technical-validation.json`
- `checkpoints/2026-09-01-stage-0-technical-pass.md`

## Stage 1 pre-execution

- ID: `EBRWS-S1-DEVELOPMENT-2026-09-01-v1`
- seed block: `31210001..31210192`
- target roots: 12 Namua + 12 Mtaji
- evidence class: `FRESH-DEVELOPMENT`
- authorization: `authorizations/2026-09-01-stage-1-development-authorization.md`
- tooling smoke run: `33525232642 / success`
- tooling job: `99914259137`
- pre-execution checkpoint: `checkpoints/2026-09-02-stage-1-tooling-smoke-pass-and-preexecution.md`

Tooling smoke reported no fresh scientific seed/root access and no protected depth-10 access.

## Authorized Stage 1 one-shot execution

GitHub Actions:

- run: `33569323221`
- job: `100059596453`
- execution step: success
- repository materialization step: failure

The frozen runner reported before materialization failure:

```text
reported runner disposition = STAGE1-PASS
globalGatePass = true
selected roots = 12 Namua + 12 Mtaji
productionStageScientificCoreSha256 = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
independentStageScientificCoreSha256 = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 = 4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = f13a71a7a219fc1978667c1b39120df709b163fd5250962e9f19310ca9f9c719
```

Runner-local diagnostic candidate summary:

- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` 12/12
- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` 9/12

These are not formal promoted candidates.

## Stage 1 materialization incident

The runner generated the three canonical files and locally committed them as short SHA `709bc393`, but the push was rejected non-fast-forward because the remote branch advanced during execution. The ephemeral local commit is not recoverable from GitHub.

No second Stage 1 execution was authorized after the no-rescue boundary. A later final Actions-history audit nevertheless discovered an unintended unauthorized duplicate execution; it is `INVALID-DO-NOT-USE` and cannot regenerate, replace, or repair the missing canonical Stage 1 evidence. Therefore full canonical Stage 1 result/telemetry files are not regenerated as valid evidence.

Authoritative closure records:

- `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- `checkpoints/2026-09-02-stage-1-materialization-failure-technical-invalid.md`

Formal Stage 1 disposition: `TECHNICAL-INVALID`.
Formal promoted candidate set: `[]`.

## Stage 2

- ID: `EBRWS-S2-FORMAL-2026-09-01-v1`
- seed block: `31220001..31220288`
- target roots: 18 Namua + 18 Mtaji
- evidence class: `FRESH-FORMAL-HELDOUT`
- disposition: `NOT-AUTHORIZED-NOT-EXECUTED`
- seed consumed: false

Stage 2 cannot use the runner-local diagnostic candidates because the prerequisite immutable Stage 1 canonical artifact was not durably materialized.

## Root policy

- deterministic Mulberry32 source trajectory
- canonical legal-move ordering
- Namua root at exact ply 24
- Mtaji root = first nonterminal mtaji state at ply >= 44
- phase-wise first-N by source seed after fixed identity firewall exclusions
- max source ply 240
- RAW-root deduplication

## Firewall identities

Exact collision exclusion was defined against:

- G3-01 roots / trajectories / first-16 prefixes
- LGTGMIV Stage 1 roots / trajectories / first-16 prefixes
- LGTGMIV Stage 2 roots / trajectories / first-16 prefixes

Only identity information was used for overlap exclusion; upstream geometry outcomes were not reused as G3-02 fresh evidence.

## Primary derived endpoint reproducibility

Production and independent implementations separately derive:

- `EB_tree(0..4)` exact rationals
- `treeWidthShapeClass`
- `replyDirection(0..4)`
- `replyWidthShapeClass`
- phase-level class counts
- candidate set

No shared G3-02 derived-metric, class, promotion, or canonical-hash helper was permitted.

## Protected evidence

standard initial RAW-root complete exact depth-10 holdout:

`SEALED / NOT GENERATED / NOT READ`

## Final Actions-history audit — duplicate execution

Final workflow audit:

```text
authorized executions = 1
actual scientific executions = 2
run 33569323221 = authorized / canonical materialization failure
run 33569382663 = unauthorized duplicate / INVALID-DO-NOT-USE
```

run #2 locally produced the same scientific core `4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e`, candidate set hash `4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6`, and scientific-result file hash `1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a`. These duplicate outputs are excluded from scientific inference.

Audit records:

- `checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md`
- `../research-generation-3/checkpoints/2026-09-02-g3-02-unintended-duplicate-execution-audit.md`
- `../research-program-decisions/2026-09-02-g3-02-unintended-duplicate-execution-audit.md`

Stage 1 execution workflow is disabled after closure. No third run is authorized. Classical telemetry variation between the two invalid/local runs is not part of the scientific core. Protected depth-10 access remained false.

## Repository main integration

- integration PR: #92
- merge method: normal merge commit
- pre-merge research HEAD: `0c0fc7a28f5ffc65853265d58a041863f520cdb8`
- pre-merge main: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- merge commit: `b41c7eda74dd1002e98e4d82714fadb987d1f1e1`
- scientific disposition after integration: `CLOSED / TECHNICAL-INVALID`
- Stage 2 after integration: `NOT-AUTHORIZED-NOT-EXECUTED`
- protected depth-10 holdout: `SEALED / NOT GENERATED / NOT READ`
