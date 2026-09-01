# Research Generation 3 — Current Status

Updated: 2026-09-02

```text
Program = Bao Third-Generation Research Program
Program status = ACTIVE / G3-02 CLOSED TECHNICAL-INVALID / NEXT PROGRAM REVIEW REQUIRED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Research Generation 2 = CLOSED
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV formal eligible measurement families = F1,F2,F3,F4,F5
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-02 Stage 0 = EBRWS-S0-TECHNICAL-2026-09-01-v1 / STAGE0-PASS
G3-02 Stage 1 = EBRWS-S1-DEVELOPMENT-2026-09-01-v1 / TECHNICAL-INVALID
G3-02 Stage 2 = EBRWS-S2-FORMAL-2026-09-01-v1 / NOT-AUTHORIZED-NOT-EXECUTED
G3-02 formal promoted candidate set = []
G3-02 Stage 1 seed = 31210001..31210192 / CONSUMED
G3-02 Stage 2 seed = 31220001..31220288 / NOT CONSUMED
G3-02 no-rescue boundary = CROSSED / ACTIVE
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Active scientific research branch = research/g3-02-effective-branching-reply-width-structure / closure synchronization
Next scientific action = separate post-G3-02 program review
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

## Stage 1

Stage 1 was separately authorized for exactly one fresh-development execution:

```text
seed = 31210001..31210192
target = 12 Namua + 12 Mtaji
relative depth = 5
```

Tooling smoke run `33525232642` passed without fresh evidence access.

Authorized one-shot run `33569323221`, job `100059596453`, completed the scientific execution step. The frozen runner locally reported:

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

Because fresh evidence had already crossed the no-rescue boundary and the Stage 1 authorization permitted exactly one execution, the same evidence was not re-run to rebuild the missing canonical files.

The protocol requires no technical-integrity violation and an immutable promoted-candidate artifact before Stage 2 authorization. Therefore the runner-local positive summary is diagnostic provenance only.

Formal disposition:

```text
Stage 1 = TECHNICAL-INVALID
Study = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
```

## Stage 2

`EBRWS-S2-FORMAL-2026-09-01-v1` is:

`NOT-AUTHORIZED-NOT-EXECUTED`

Stage 2 seed `31220001..31220288` remains unconsumed. Runner-local Stage 1 diagnostic candidates do not authorize Stage 2.

## Protected evidence

G3-11 reserved standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

G3-02 did not generate/read it and did not use G2-12 as depth-10 truth.

## Claim boundary

G3-02 has no formal positive branching/reply-width structure claim. In particular, the diagnostic compression-dominant observations are not generalized to Bao, depth >5, best move, search difficulty, strategic/game-theoretic forcing, win/value, causal strategic effects, or human difficulty.

## Next program boundary

G3-02 closure does not automatically authorize G3-03 or later studies. The next scientific action is a separate current-state program review that preserves:

- G3-01 immutable technical-invalid closure,
- LGTGMIV formal eligible family boundary,
- G3-02 technical-invalid closure and no-rescue boundary,
- RAW-only identity and validated transform set `[]`,
- protected depth-10 holdout.

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

Historical `PROGRAM_PLAN.md` remains unchanged.
