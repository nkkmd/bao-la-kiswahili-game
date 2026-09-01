# Research Generation 3 — Current Status

Updated: 2026-09-01

```text
Program = Bao Third-Generation Research Program
Program status = ACTIVE / G3-02 EBRWS-STUDY1 PROTOCOL FROZEN / STAGE0-PASS / STAGE1 AUTHORIZATION PENDING
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Research Generation 2 = CLOSED
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-01 Stage 1 seed consumption = 31010001..31010096
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV Stage 1 seed consumption = 31110001..31110128
LGTGMIV Stage 2 seed consumption = 31120001..31120192
LGTGMIV formal eligible measurement families = F1,F2,F3,F4,F5
LGTGMIV main integration = COMPLETE
G3-02 authorization review = AUTHORIZED
G3-02 = EBRWS-STUDY1 / PROTOCOL-FROZEN
G3-02 baseline remote main = ca6a1e4a9b41d79d873fa71385972e402ffa5197
G3-02 research branch = research/g3-02-effective-branching-reply-width-structure
G3-02 Stage 0 = EBRWS-S0-TECHNICAL-2026-09-01-v1 / STAGE0-PASS
G3-02 Stage 1 = EBRWS-S1-DEVELOPMENT-2026-09-01-v1 / NOT-AUTHORIZED-NOT-EXECUTED
G3-02 Stage 2 = EBRWS-S2-FORMAL-2026-09-01-v1 / NOT-AUTHORIZED-NOT-EXECUTED
G3-02 Stage 1 seed = 31210001..31210192 / NOT CONSUMED
G3-02 Stage 2 seed = 31220001..31220288 / NOT CONSUMED
G3-02 fresh scientific evidence generated = false
G3-02 fresh scientific evidence read = false
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Active scientific research branch = research/g3-02-effective-branching-reply-width-structure
Next scientific action = explicit G3-02 Stage 1 authorization review
```

## Program direction

Research Generation 3はResearch Generation 2で最も強く成立したRAW-only bounded exact analysisを基盤とし、Baoのbounded local game tree / reachable RAW graphの構造幾何を中心研究対象とする。

## Immutable upstream boundaries

G3-01 `LGTGMF-STUDY1`は`CLOSED / TECHNICAL-INVALID`、formal eligible families `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`のまま永久に変更しない。Stage 1のroot/family level exact agreementを用いたrepair、corrected rerun、reclassificationを行わない。

G3-01とは別のpost-G3-01 prerequisite `LGTGMIV-STUDY1`は`CLOSED / FORMAL-ELIGIBLE-ALL`で完了している。

Formal eligible family set:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

eligibilityはRAW-only / relative depth 5 / bounded local reconstruction / production-independent exact agreementのfrozen contractに限定される。

## G3-02 authorization review

LGTGMIV closure後の別reviewは`AUTHORIZED`と記録した。review baselineはremote `main`:

`ca6a1e4a9b41d79d873fa71385972e402ffa5197`

このdecisionはG3-01やLGTGMIVを変更せず、G3-02のprospective Study-definition / preregistrationを許可した。

## G3-02 frozen Study

Formal Study:

**`EBRWS-STUDY1` — Effective Branching and Reply-Width Structure Study 1**

正式日本語題目:

**Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証**

Frozen representation:

```text
state identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
relative local horizon = 5
```

Primary dependencyはLGTGMIV F1 + F5。F2-F4はsecondary contextual characterizationだけに使用する。

Primary construct systems:

1. `TREE-WIDTH-SHAPE`
2. `REPLY-WIDTH-SHAPE`

phase-level candidate / formal confirmation gate:

`3 * classCount >= 2 * eligibleRootCount`

floating-point thresholdは使わない。

## Frozen fresh population

Stage 1 development:

```text
stage = EBRWS-S1-DEVELOPMENT-2026-09-01-v1
seed = 31210001..31210192
population = 12 Namua + 12 Mtaji
relative depth = 5
evidence = FRESH-DEVELOPMENT
seed consumed = false
```

Stage 2 formal holdout:

```text
stage = EBRWS-S2-FORMAL-2026-09-01-v1
seed = 31220001..31220288
population = 18 Namua + 18 Mtaji
relative depth = 5
evidence = FRESH-FORMAL-HELDOUT
seed consumed = false
```

G3-01 / LGTGMIV evidenceをG3-02 fresh evidenceとして再利用しない。root RAW identity、full trajectory identity、first-16-move prefix identityはprospectively fixed overlap exclusionに限り使用できる。

## Stage 0 technical closure

`EBRWS-S0-TECHNICAL-2026-09-01-v1`はsynthetic primitive fixturesだけで実行し、formal disposition:

`STAGE0-PASS`

Production / independent stage scientific core:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

全mandatory technical controlsがPASSした。Stage 0ではfresh scientific seed/root generation、fresh evidence read、protected depth-10 accessはいずれも行っていない。

## Protected evidence

standard initial RAW rootのcomplete exact depth-10 layerはG3-11用`FRESH-DEEPER-EXACT-HOLDOUT`として引き続き:

`SEALED / NOT GENERATED / NOT READ`

G3-02はこれをresource planningにも使用しない。G2-12 estimatorをdepth-10 truthとして利用しない。

## Claim boundary

G3-02で観測可能なのはbounded machine geometryである。次を明確に分離する。

- branching width
- reply width
- multi-ply width profile
- structural narrowing / expansion
- transposition / reconvergence
- search difficulty
- strategic forcing
- best move
- game-theoretic value
- human difficulty

branch narrowingを「強制手」「最善手が明確」「人間に簡単」と読み替えない。

## Next authorization boundary

Stage 0 PASSはStage 1を自動開始しない。Stage 1 scientific seed `31210001..31210192`を生成・readする前に、以下を確認する別authorizationが必要である。

- current-facing documentation synchronization complete
- frozen protocol / preregistration unchanged
- Stage 0 `STAGE0-PASS`
- Stage 1 / Stage 2 seed unconsumed
- protected depth-10 holdout sealed
- production / independent Stage 1 implementation boundary fixed

Stage 1 authorization前はfresh scientific executionを行わない。

## Canonical records

Program:

- `README.md`
- `CURRENT_STATUS.md`
- `PROGRAM_PLAN.md` — historical prospective plan; do not retrospectively rewrite
- `checkpoints/2026-09-01-g3-02-authorization-review-authorized.md`
- `checkpoints/2026-09-01-g3-02-preregistration-freeze.md`

G3-02:

- `../effective-branching-reply-width-structure/README.md`
- `../effective-branching-reply-width-structure/STUDY_1_PROTOCOL.md`
- `../effective-branching-reply-width-structure/prereg/STUDY_1_SPEC.json`
- `../effective-branching-reply-width-structure/CURRENT_STATUS.md`
- `../effective-branching-reply-width-structure/DECISION_REGISTER.md`
- `../effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md`
- `../effective-branching-reply-width-structure/results/stage-0/technical-validation.json`
- `../effective-branching-reply-width-structure/checkpoints/2026-09-01-stage-0-technical-pass.md`
- `../research-program-decisions/2026-09-01-post-lgtgmiv-g3-02-authorization-review.md`

G3-01 and LGTGMIV remain closed and immutable. Historical `PROGRAM_PLAN.md` remains unchanged.
