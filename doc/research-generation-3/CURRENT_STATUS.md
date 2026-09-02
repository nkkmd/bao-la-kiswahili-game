# Research Generation 3 — Current Status

Updated: 2026-09-02

```text
Program = Bao Third-Generation Research Program
Program status = ACTIVE / G3-02 CLOSED TECHNICAL-INVALID / G3-03 PROGRAM REVIEW AUTHORIZED / STUDY FREEZE PENDING
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Research Generation 2 = CLOSED
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV formal eligible measurement families = F1,F2,F3,F4,F5
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-02 research workflow = COMPLETE / MAIN INTEGRATED
G3-02 main integration = COMPLETE / PR #92 / merge b41c7eda74dd1002e98e4d82714fadb987d1f1e1
G3-02 Stage 0 = EBRWS-S0-TECHNICAL-2026-09-01-v1 / STAGE0-PASS
G3-02 Stage 1 = EBRWS-S1-DEVELOPMENT-2026-09-01-v1 / TECHNICAL-INVALID
G3-02 Stage 1 authorized scientific executions = 1
G3-02 Stage 1 actual scientific executions = 2 / execution-count contract violated
G3-02 Stage 2 = EBRWS-S2-FORMAL-2026-09-01-v1 / NOT-AUTHORIZED-NOT-EXECUTED
G3-02 formal promoted candidate set = []
G3-02 Stage 1 seed = 31210001..31210192 / CONSUMED
G3-02 Stage 2 seed = 31220001..31220288 / NOT CONSUMED
G3-02 no-rescue boundary = CROSSED / ACTIVE
G3-02 Stage 1 execution workflow = CLOSED / DISABLED
G3-03 program review = G3-03-AUTHORIZED
G3-03 additional prerequisite = NONE
G3-03 principal upstream families = LGTGMIV F2 + F3 + F4
G3-03 Study identity/protocol = NOT YET FROZEN
G3-03 fresh scientific evidence = NOT AUTHORIZED / NOT GENERATED / NOT READ
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Active scientific research branch = none; G3-03 research branch must be created from post-review current main
Next scientific action = prospective G3-03 Study-definition / preregistration freeze on a new branch; Stage progression requires separate authorization
```

## Immutable upstream boundaries

Research Generation 2 remains closed.

G3-01 `LGTGMF-STUDY1` remains permanently:

```text
CLOSED / TECHNICAL-INVALID
formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

G3-01 Stage 1 root/family agreement is not used to rescue or reclassify it.

The independent prerequisite `LGTGMIV-STUDY1` remains:

`CLOSED / FORMAL-ELIGIBLE-ALL`

Formal eligible families:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

Eligibility is limited to the frozen RAW-only / relative depth-5 bounded local reconstruction contract.

## G3-02 formal Study

G3-02 was separately authorized after LGTGMIV and prospectively frozen as:

**`EBRWS-STUDY1` — Effective Branching and Reply-Width Structure Study 1**

正式日本語題目:

**Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証**

Frozen representation:

```text
state identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
relative local horizon = 5
```

Primary systems were `TREE-WIDTH-SHAPE` and `REPLY-WIDTH-SHAPE`, with exact phase-level gate `3 * classCount >= 2 * eligibleRootCount`.

## Stage 0

`EBRWS-S0-TECHNICAL-2026-09-01-v1` used only synthetic primitive fixtures and passed all mandatory controls.

```text
Stage 0 = STAGE0-PASS
production / independent scientific core = ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd
fresh scientific seed consumption = false
protected depth-10 access = false
```

## Stage 1 authorization and authorized execution

Stage 1 was separately authorized for exactly one fresh-development scientific execution:

```text
seed = 31210001..31210192
target = 12 Namua + 12 Mtaji
relative depth = 5
authorized scientific executions = 1
```

Tooling smoke run `33525232642` passed without fresh evidence access.

Authorized run `33569323221`, job `100059596453`, completed the scientific execution step. The frozen runner locally reported:

```text
reported runner disposition = STAGE1-PASS
globalGatePass = true
selected roots = 12 Namua + 12 Mtaji
production / independent stage scientific core = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 = 4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
```

Runner-local diagnostic candidates:

- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` = 12/12
- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` = 9/12

However, the generated canonical Stage 1 files were committed only in the ephemeral runner workspace. Push of local commit `709bc393` was rejected non-fast-forward because the remote branch advanced during execution, and the local commit is not recoverable after runner teardown.

The frozen protocol does not permit a result-dependent authorized repair rerun after the no-rescue boundary. No such valid / intentional repair rerun was performed.

## Final Actions-history audit — unintended duplicate execution

Final Actions-history audit established that a second Stage 1 scientific execution occurred:

```text
run 33569323221 = authorized one-shot / canonical materialization failure
run 33569382663 = unauthorized duplicate / INVALID-DO-NOT-USE
authorized scientific executions = 1
actual scientific executions = 2
execution-count contract = violated
```

Run `33569382663`, job `100060967285`, was unintentionally queued by a workflow-arming commit before the first scientific outcome was known. Because the workflow used non-cancelling concurrency, its actual computation began only after the first run had completed the scientific step and crossed the no-rescue boundary.

This run therefore violated the frozen exactly-one-execution authorization. It locally produced the same scientific core / candidate-set / scientific-result file hash as the authorized run, but this equality is **not** a valid replication, confirmation, repair, or rescue and is excluded from scientific inference.

The duplicate run's local result commit `24c57398` was also rejected non-fast-forward and is not recoverable.

## Formal fail-closed closure

The Study has two recorded technical-integrity failures:

1. canonical Stage 1 result materialization failure from the authorized execution;
2. exactly-one-execution contract violation from the unintended duplicate run.

Accordingly:

```text
Stage 1 = TECHNICAL-INVALID
Study = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
```

The runner-local positive summaries are diagnostic provenance only. The unauthorized duplicate execution has formal use `INVALID-DO-NOT-USE`.

## Stage 2

`EBRWS-S2-FORMAL-2026-09-01-v1` is:

`NOT-AUTHORIZED-NOT-EXECUTED`

Stage 2 seed `31220001..31220288` remains unconsumed. Neither runner-local Stage 1 summary authorizes Stage 2.

## Post-G3-02 G3-03 program review

The separate current-state review completed with formal decision:

**`G3-03-AUTHORIZED`**

The review confirms that G3-03 is scientifically independent of the invalid G3-02 branching/reply-width result and can be constructed from LGTGMIV's formally eligible graph/transposition families, principally F2/F3/F4, within the RAW-only relative depth-5 boundary.

No additional representation, measurement-instrument, canonicalization, graph-identity, or separate resource-feasibility prerequisite is required before prospective Study definition. Canonicalization remains not authorized and validated transform set remains `[]`.

This authorization permits only Study-definition / preregistration freeze. G3-03 fresh scientific evidence remains `NOT AUTHORIZED / NOT GENERATED / NOT READ` until the protocol is frozen and the applicable Stage receives separate authorization.

G3-02 runner-local candidate summaries, the duplicate execution, G3-02 Stage 1 roots, and both G3-02 seed blocks are prohibited as G3-03 formal evidence inputs. Upstream identities may be used only for exclusion firewalls where prospectively declared.

Canonical decision:

`../research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md`

## Protected evidence

G3-11 reserved standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

Neither G3-02 nor the G3-03 authorization review generated/read it. G2-12 is not used as depth-10 truth.

## Claim boundary

G3-02 has no formal positive branching/reply-width structure claim. In particular, the diagnostic compression-dominant observations and the duplicate-run equality are not generalized to Bao, depth >5, best move, search difficulty, strategic/game-theoretic forcing, win/value, causal strategic effects, or human difficulty.

G3-03 authorization likewise authorizes only a bounded RAW local tree/graph geometry Study. Transposition/reconvergence structure must not be automatically re-labelled as strategic simplicity, tactical simplicity, search ease, best-move clarity, value, win probability, forcing, causal effect, or human difficulty.

## Next program boundary

The next safe action is a new G3-03 research branch from the current remote `main`, followed by prospective Study-definition / preregistration freeze. No fresh G3-03 evidence may be generated or read before that freeze.

Stage 0 may use only technical/synthetic fixtures after its separate authorization. Stage 0 PASS does not automatically authorize Stage 1; Stage 1 does not automatically authorize Stage 2.

## Main integration boundary

G3-02 research work is complete and integrated to `main` through PR #92 using a normal merge commit so the prospective research history is preserved.

Merge commit: `b41c7eda74dd1002e98e4d82714fadb987d1f1e1`. This repository integration does not change the Study's `CLOSED / TECHNICAL-INVALID` decision.

## Canonical records

- `README.md`
- `PROGRAM_PLAN.md` — historical prospective plan; do not rewrite
- `../effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`
- `../effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md`
- `../effective-branching-reply-width-structure/CURRENT_STATUS.md`
- `../effective-branching-reply-width-structure/DECISION_REGISTER.md`
- `../effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md`
- `../effective-branching-reply-width-structure/results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- `../research-program-decisions/2026-09-02-g3-02-technical-invalid-closure.md`
- `../research-program-decisions/2026-09-02-g3-02-unintended-duplicate-execution-audit.md`
- `../research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md`
- `checkpoints/2026-09-02-g3-03-authorization-review-authorized.md`

Historical `PROGRAM_PLAN.md` remains unchanged.
