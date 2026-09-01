# Research Generation 3

Bao第三世代研究programの文書入口です。

## 現在の状態

```text
Program = Bao Third-Generation Research Program
Status = ACTIVE / G3-02 EBRWS-STUDY1 PROTOCOL FROZEN / STAGE0-PASS / STAGE1 AUTHORIZATION PENDING
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV formal eligible measurement families = F1,F2,F3,F4,F5
G3-02 = EBRWS-STUDY1 / AUTHORIZED / PROTOCOL-FROZEN
G3-02 Stage 0 = STAGE0-PASS
G3-02 Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02 Stage 1 seed = 31210001..31210192 / NOT CONSUMED
G3-02 Stage 2 seed = 31220001..31220288 / NOT CONSUMED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — Research Generation 3開始前に固定したhistorical prospective plan。current stateに合わせて書き換えない
- [`../effective-branching-reply-width-structure/README.md`](../effective-branching-reply-width-structure/README.md) — G3-02 / `EBRWS-STUDY1`の入口
- [`../effective-branching-reply-width-structure/STUDY_1_PROTOCOL.md`](../effective-branching-reply-width-structure/STUDY_1_PROTOCOL.md) — G3-02 frozen protocol
- [`../research-program-decisions/2026-09-01-post-lgtgmiv-g3-02-authorization-review.md`](../research-program-decisions/2026-09-01-post-lgtgmiv-g3-02-authorization-review.md) — G3-02 authorization decision
- [`../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md) — completed LGTGMIV prerequisite
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md) — immutable G3-01 closure

## Immutable upstream boundary

G3-01 `LGTGMF-STUDY1`は、fresh Stage 1のroot/family levelではproduction / independent exact agreementを得た一方、凍結済みstage-level canonical digestへruntime telemetryを混入させたinstrument defectにより`TECHNICAL-INVALID`で閉じた。

```text
G3-01 = CLOSED / TECHNICAL-INVALID
formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

このformal decisionは永久に変更しない。root/family level agreementを使ったrepair、corrected rerun、reclassificationを行わない。

G3-01後には別のprospective independent prerequisite `LGTGMIV-STUDY1`を実施し、`CLOSED / FORMAL-ELIGIBLE-ALL`で完了した。

Formal eligible families:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

このeligibilityはRAW-only / relative depth 5 / bounded local reconstruction / production-independent exact agreementの範囲に限定される。

## G3-02 authorization and prospective freeze

LGTGMIV closure後の別authorization reviewは`AUTHORIZED`となった。これを受け、G3-02を正式Study `EBRWS-STUDY1`としてprospectively freezeした。

正式日本語題目:

**Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証**

主要boundary:

- authoritative state identity = RAW-only `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set = `[]`
- relative horizon = depth 5
- primary dependency = LGTGMIV F1 + F5
- F2-F4 = secondary contextual characterization only
- primary construct systems = `TREE-WIDTH-SHAPE`, `REPLY-WIDTH-SHAPE`
- phase-level promotion / confirmation = exact `2/3` gate
- Stage 1 = 12 Namua + 12 Mtaji / seed `31210001..31210192`
- Stage 2 = 18 Namua + 18 Mtaji / seed `31220001..31220288`

`effective branching`は新しいvalidated instrumentではなく、eligible exact primitiveからprospectively定義するexact-rational derived constructである。

## Stage 0 technical result

`EBRWS-S0-TECHNICAL-2026-09-01-v1`はsynthetic primitive fixturesだけで実行し、`STAGE0-PASS`となった。

Production / independent stage scientific core:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

Stage 0ではG3-02 fresh scientific seed/rootを生成・readしていない。technical fixture上のcandidateはscientific evidenceではなく、Baoの局面特性として解釈しない。

## Protected evidence and next gate

standard initial RAW rootのcomplete exact depth-10 holdoutはG3-11用として引き続き:

`SEALED / NOT GENERATED / NOT READ`

Stage 0 PASSはStage 1の自動開始を意味しない。current-facing documentation synchronization後、Stage 1には別のexplicit authorizationが必要である。そのauthorization前に`31210001..31210192`を生成・readしない。

branching / reply widthをbest move、search difficulty、game-theoretic forcing、win/value、human difficultyへ読み替えない。

## Canonical records

Program current-facing:

- `README.md`
- `CURRENT_STATUS.md`
- `PROGRAM_PLAN.md` — immutable historical prospective plan
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

Historical `PROGRAM_PLAN.md` remains unchanged.
