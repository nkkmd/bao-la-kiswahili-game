# Effective Branching / Reply-Width Structure Study 1

## Status

`EBRWS-STUDY1` is the formally authorized Research Generation 3 `G3-02` Study.

Current state:

`PROTOCOL-FROZEN / STAGE0-PASS / STAGE1-AUTHORIZATION-PENDING / NO-FRESH-SCIENTIFIC-EVIDENCE-GENERATED`

Formal English title:

**Effective Branching and Reply-Width Structure Study 1 — Prospective validation of reproducible multi-ply branching and reply-width profiles as bounded RAW local game-tree position characteristics in Bao**

正式日本語題目:

**Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証**

## Scientific boundary

本Studyは、LGTGMIVでformal eligibilityを得たRAW-only / relative depth 5のbounded local geometry instrumentだけを用いる。

Primary dependency:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F5-REPLY-GEOMETRY`

Secondary contextual dependency:

- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

`effective branching`は新しいmeasurement instrumentではなく、F1 exact primitiveからprospectively定義したexact-rational derived constructである。

## Frozen primary endpoint

Primary construct systemsは次の2つだけである。

1. `TREE-WIDTH-SHAPE`
2. `REPLY-WIDTH-SHAPE`

phase-level candidate / formal confirmation gateはexactに

`3 * classCount >= 2 * eligibleRootCount`

とする。Stage 2はStage 1でpromoteされfreezeされた同一construct / phase / classだけを検証する。

## Stage plan and current state

1. `EBRWS-S0-TECHNICAL-2026-09-01-v1` — **`STAGE0-PASS`** / synthetic technical-only validation
2. `EBRWS-S1-DEVELOPMENT-2026-09-01-v1` — **`NOT-AUTHORIZED-NOT-EXECUTED`** / fresh development, 12 Namua + 12 Mtaji, depth 5
3. `EBRWS-S2-FORMAL-2026-09-01-v1` — **`NOT-AUTHORIZED-NOT-EXECUTED`** / fresh formal holdout, 18 Namua + 18 Mtaji, depth 5

Stage 0 production / independent scientific-core digest:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

Fresh seed blocks:

- Stage 1: `31210001..31210192` — **not consumed**
- Stage 2: `31220001..31220288` — **not consumed**

Stage 1/2 seeds are not to be generated or read before their corresponding authorization gates.

## Protected evidence

standard initial RAW root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

## Interpretation boundary

branching width / reply width / multi-ply width profileはmachine-observed bounded RAW geometryであり、best move、search difficulty、game-theoretic forcing、win/value、human difficultyとは別constructである。

## Canonical records

- `STUDY_1_PROTOCOL.md` — frozen scientific protocol
- `prereg/STUDY_1_SPEC.json` — machine-readable preregistration
- `CURRENT_STATUS.md` — current-facing state
- `DECISION_REGISTER.md` — formal decisions
- `REPRODUCIBILITY_INDEX.md` — reproducibility map
- `results/stage-0/technical-validation.json` — Stage 0 technical result
- `checkpoints/2026-09-01-stage-0-technical-pass.md` — Stage 0 PASS checkpoint

Historical `doc/research-generation-3/PROGRAM_PLAN.md` remains immutable and is not rewritten.
