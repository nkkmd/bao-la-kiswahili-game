# EBRWS-STUDY1 — Current Status

Updated: 2026-09-02

```text
Program = Research Generation 3
Agenda position = G3-02
Study ID = EBRWS-STUDY1
Study status = CLOSED / TECHNICAL-INVALID
Research workflow = COMPLETE / MAIN INTEGRATED
Main integration = COMPLETE / PR #92 / merge b41c7eda74dd1002e98e4d82714fadb987d1f1e1
Authorization review = AUTHORIZED
Study protocol = FROZEN / unchanged after fresh evidence
Stage 0 = EBRWS-S0-TECHNICAL-2026-09-01-v1 / STAGE0-PASS
Stage 1 = EBRWS-S1-DEVELOPMENT-2026-09-01-v1 / TECHNICAL-INVALID
Stage 1 authorized execution count = 1
Stage 1 actual scientific execution count = 2 / execution-count contract violated
Stage 2 = EBRWS-S2-FORMAL-2026-09-01-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Formal promoted candidate set = []
Stage 1 seed consumed = 31210001..31210192
Stage 2 seed consumed = false
No-rescue boundary = CROSSED / ACTIVE
Stage 1 execution workflow = CLOSED / DISABLED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Authoritative identity = RAW-only
Validated transform set = []
Research branch = research/g3-02-effective-branching-reply-width-structure
Study baseline remote main = ca6a1e4a9b41d79d873fa71385972e402ffa5197
```

## Upstream immutable state

- Research Generation 2 = CLOSED
- G3-01 `LGTGMF-STUDY1` = `CLOSED / TECHNICAL-INVALID`
- G3-01 formal eligible families = `[]`
- G3-01 Stage 2 = `NOT-AUTHORIZED-NOT-EXECUTED`
- `LGTGMIV-STUDY1` = `CLOSED / FORMAL-ELIGIBLE-ALL`
- LGTGMIV eligible families = F1..F5 exactly

G3-02 does not alter or rescue G3-01 and does not re-run or re-decide LGTGMIV.

## Stage 0

Formal disposition:

`STAGE0-PASS`

Production / independent stage scientific core:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

Stage 0 used synthetic primitive fixtures only and consumed no fresh scientific seed.

## Stage 1 frozen authorization

Authorized fresh block:

```text
seed = 31210001..31210192
target = 12 Namua + 12 Mtaji
relative depth = 5
evidence class = FRESH-DEVELOPMENT
authorized scientific executions = exactly 1
```

## Authorized execution — run 33569323221

GitHub Actions run `33569323221`, job `100059596453`, completed the frozen scientific runner. The runner-local computation reported:

```text
reported runner disposition = STAGE1-PASS
globalGatePass = true
selected roots = 12 Namua + 12 Mtaji
production / independent stage scientific core =
4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 =
4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
```

Runner-local diagnostic candidates:

- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` = 12/12
- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` = 9/12

These are **diagnostic provenance only**, not formal promoted candidates.

After the scientific files were generated, local commit `709bc393` was created with `scientific-result.json`, `telemetry.json`, and `execution-summary.json`. Its push was rejected non-fast-forward because the remote branch had advanced during execution. The ephemeral commit is not recoverable from GitHub after runner teardown.

Logged commitments:

```text
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = f13a71a7a219fc1978667c1b39120df709b163fd5250962e9f19310ca9f9c719
```

This canonical materialization failure already requires fail-closed handling because the frozen protocol requires an immutable promoted-candidate artifact and no technical-integrity violation before Stage 2 authorization.

## Unintended duplicate execution — run 33569382663

Final Actions-history audit found a second Stage 1 scientific execution:

- run `33569382663`
- job `100060967285`
- formal status `UNAUTHORIZED-DUPLICATE-INVALID`

While the first authorized run was still in progress, a technical workflow-arming commit added the Stage 1 workflow's own file path as a push trigger because the first trigger run had not yet appeared in monitoring. This queued run #2 before the first scientific outcome was known. Because the workflow used a non-cancelling concurrency group, its actual computation began only after run #1 had completed the scientific step and crossed the no-rescue boundary.

Run #2 therefore violated the frozen exactly-one-execution authorization. It is not a valid replication, repair, confirmation, or rescue and is excluded from scientific inference.

It locally reproduced the same scientific-result commitments:

```text
stage scientific core = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 = 4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = 6f9c5323ff5cf95b9261a8b90dcfb2385702ca53329739cb87267a71e92f9da4
```

Its local result commit `24c57398` was also rejected non-fast-forward and is not recoverable from GitHub.

The duplicate output has formal use `INVALID-DO-NOT-USE`.

## Formal technical-invalid closure

The no-rescue boundary was crossed by the first fresh evidence generation/read. No authorized or intentional same-evidence repair rerun is permitted or performed.

The unintended duplicate execution described above is itself an additional technical-integrity violation; it is not a valid repair path.

The formal Stage 1 / Study disposition remains:

`TECHNICAL-INVALID`

Reasons include both:

1. canonical Stage 1 result materialization failure from the authorized execution;
2. violation of the exactly-one-execution contract by the unintended duplicate run.

Formal promoted candidate set remains:

`[]`

The Stage 1 execution workflow has been disabled. No third execution is authorized.

## Stage 2

Stage 2 is permanently unexecuted for this Study closure:

`NOT-AUTHORIZED-NOT-EXECUTED`

Neither runner-local candidate summary authorizes Stage 2. Stage 2 seed `31220001..31220288` remains unconsumed.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

Neither Stage 1 execution generated or inspected it, and G2-12 was not used as depth-10 truth.

## Canonical closure records

- `STUDY_1_PROTOCOL.md` — immutable prospective protocol
- `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json` — authoritative machine-readable disposition and execution audit
- `checkpoints/2026-09-02-stage-1-materialization-failure-technical-invalid.md` — first incident / fail-closed rationale
- `checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md` — execution-count violation
- `DECISION_REGISTER.md` — formal decisions
- `STUDY_1_FINAL_REPORT.md` — integrated scientific/technical closure

No same-evidence repair, further rerun, threshold change, endpoint change, seed extension, or favorable subgroup rescue is authorized.

## Research completion / integration hold

G3-02の研究作業はresearch branch上で完了している。

```text
research workflow = COMPLETE
research branch = research/g3-02-effective-branching-reply-width-structure
main integration = COMPLETE
integration PR = #92
merge commit = b41c7eda74dd1002e98e4d82714fadb987d1f1e1
```

明示的な統合指示に基づき、PR #92を通常mergeして`main`統合を完了した。scientific closureとnext-program authorization boundaryは変更しない。
