# Research Generation 3

Bao第三世代研究programの文書入口です。

## 現在の状態

```text
Program = Bao Third-Generation Research Program
Status = ACTIVE / G3-02 EBRWS-STUDY1 CLOSED TECHNICAL-INVALID / G3-03 PROGRAM REVIEW AUTHORIZED / STUDY FREEZE PENDING
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV formal eligible measurement families = F1,F2,F3,F4,F5
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-02 Stage 0 = STAGE0-PASS
G3-02 Stage 1 = TECHNICAL-INVALID
G3-02 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02 main integration = COMPLETE / PR #92 / merge b41c7eda74dd1002e98e4d82714fadb987d1f1e1
G3-02 formal promoted candidate set = []
G3-02 Stage 1 seed = 31210001..31210192 / CONSUMED
G3-02 Stage 2 seed = 31220001..31220288 / NOT CONSUMED
G3-03 program review = G3-03-AUTHORIZED
G3-03 additional prerequisite = NONE
G3-03 principal upstream families = F2,F3,F4
G3-03 Study freeze = PENDING
G3-03 fresh scientific evidence = NOT AUTHORIZED / NOT GENERATED / NOT READ
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — Research Generation 3開始前に固定したhistorical prospective plan。current stateに合わせて書き換えない
- [`../research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md`](../research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md) — G3-03開始前のpost-G3-02 program authorization decision
- [`../effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`](../effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md) — G3-02の初見向けclosure概要
- [`../effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md`](../effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md) — G3-02 scientific/technical closure正本
- [`../research-program-decisions/2026-09-02-g3-02-technical-invalid-closure.md`](../research-program-decisions/2026-09-02-g3-02-technical-invalid-closure.md) — G3-02 program-level closure decision
- [`../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md) — completed LGTGMIV prerequisite
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md) — immutable G3-01 closure

## Immutable upstream boundary

G3-01 `LGTGMF-STUDY1` remains:

```text
CLOSED / TECHNICAL-INVALID
formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

このformal decisionは変更しない。

G3-01後の別Study `LGTGMIV-STUDY1`は`CLOSED / FORMAL-ELIGIBLE-ALL`であり、RAW-only / relative depth 5の次の5 familiesだけがformal eligibleである。

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

## G3-02 closure

G3-02は`EBRWS-STUDY1`として、post-LGTGMIV authorization reviewを`AUTHORIZED`で通過し、scientific outcome前にRAW-only、depth 5、fresh population、seed、derived endpoint、2/3 gate、resource ceiling、independent verification、no-rescue ruleをfreezeして開始した。

Stage 0はsynthetic fixturesだけで`STAGE0-PASS`。

Stage 1はfresh `31210001..31210192`、12 Namua + 12 Mtajiについて**exactly one scientific execution**をprospectively authorizationし、authorized run `33569323221`を実行した。runner内部ではglobal gate PASSとproduction / independent exact stage-core agreementを得たが、生成済みcanonical Stage 1 filesのrepository pushがnon-fast-forwardで失敗し、ephemeral runner終了後にfull canonical artifactを回収できなかった。後のActions-history auditで判明した2回目の実行は、このauthorizationに含まれない`INVALID-DO-NOT-USE`である。

fresh evidence生成後のsame-evidence rerunは許可されないため、runner-local positive summaryをformal resultへ救済せず、fail-closedで:

`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`

とした。

Runner logに残った`REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT` Namua 12/12、Mtaji 9/12はdiagnostic provenanceのみであり、formal promoted candidate setは`[]`である。

Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。Stage 2 seedは未消費。

## Post-G3-02 G3-03 authorization review

2026-09-02、G3-02 closure後に要求されていたseparate current-state program reviewをread-onlyで実施し、formal decisionを:

**`G3-03-AUTHORIZED`**

として固定した。

G3-03はG3-02のpositive branching/reply-width resultを必要とせず、LGTGMIVのformal eligible familiesのうち主としてF2/F3/F4だけで独立に構成できる。追加のrepresentation / measurement-instrument / canonicalization / graph-identity prerequisiteは不要であり、separate resource-feasibility prerequisiteも不要と判断した。G3-03は引き続きRAW-only、relative depth 5、validated transform set `[]`の境界に拘束される。

このauthorizationは**Study-definition / preregistration freezeのみ**を許可する。G3-03 fresh scientific evidenceの生成・readはまだauthorizeされていない。新しいresearch branchをその時点のcurrent remote `main`から作成し、Study ID、Stage IDs、fresh seed/population、measurement binding、firewall、resource ceilings、independent verification、execution-integrity contract、decision rule、no-rescue ruleをoutcome前に固定する必要がある。

G3-02のStage 1 seed、reserved Stage 2 seed、selected roots、runner-local candidate summaries、unintended duplicate execution、failed canonical artifactはG3-03 formal evidenceへ再利用しない。

## Protected evidence

standard initial RAW root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

G3-02もpost-G3-02 program reviewもこれを生成・readしていない。G3-03 Studyでもこのholdoutを開封しない。

## Interpretation boundary

branching / reply-width geometryをbest move、search difficulty、game-theoretic forcing、win/value、human difficultyへ読み替えない。G3-02のdiagnostic patternをBao一般のformal structure claimへ昇格させない。

G3-03で将来観測されるtransposition/reconvergenceやtree/graph divergenceも、strategic simplicity、tactical simplicity、search ease、best-move clarity、game-theoretic forcing、value、win probability、human difficulty、causal strategic effectへ自動的に読み替えない。

## Next program boundary

次の安全な作業は、新しいG3-03 research branchをcurrent remote `main`から作成し、prospective Study-definition / preregistration freezeを完了することである。

Stage 0はseparate authorization後のsynthetic/non-scientific technical fixtureだけを使用する。Stage 0 PASSはStage 1を自動authorizeせず、Stage 1からStage 2も自動進行しない。

## Canonical records

- `CURRENT_STATUS.md`
- `PROGRAM_PLAN.md` — immutable historical prospective plan
- `../research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md`
- `checkpoints/2026-09-02-g3-03-authorization-review-authorized.md`
- `../effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md`
- `../effective-branching-reply-width-structure/CURRENT_STATUS.md`
- `../effective-branching-reply-width-structure/DECISION_REGISTER.md`
- `../effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md`
- `../effective-branching-reply-width-structure/results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- `../research-program-decisions/2026-09-02-g3-02-technical-invalid-closure.md`

Historical `PROGRAM_PLAN.md` remains unchanged.

## G3-02 main integration

2026-09-02、completed G3-02 branch `research/g3-02-effective-branching-reply-width-structure`をPR #92の通常mergeで`main`へ統合した。merge commitは`b41c7eda74dd1002e98e4d82714fadb987d1f1e1`。このrepository integrationは`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`、formal promoted candidate set `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`、protected depth-10 holdout sealedというscientific stateを変更しない。
