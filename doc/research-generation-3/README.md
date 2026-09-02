# Research Generation 3

Bao第三世代研究programの文書入口です。

## 現在の状態

```text
Program = Bao Third-Generation Research Program
Status = ACTIVE / G3-05 BECT-STUDY1 CLOSED TECHNICAL-INVALID / POST-G3-05 G3-06 REVIEW REQUIRED / G3-06 NOT AUTHORIZED
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
G3-03 = TCTGD-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-03 Stage 0 = STAGE0-PASS
G3-03 Stage 1 = TECHNICAL-INVALID / authorized executions 1 / actual executions 1
G3-03 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-03 formal promoted candidate set = []
G3-03 Stage 1 seed = 31310001..31310192 / CONSUMED
G3-03 Stage 2 seed = 31320001..31320288 / NOT CONSUMED
G3-04 program review = G3-04-AUTHORIZED
G3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE
G3-04 Stage 0 = STAGE0-PASS
G3-04 Stage 1 = STAGE1-PASS / executions 1 authorized / 1 actual
G3-04 Stage 2 = STAGE2-PASS / executions 1 authorized / 1 actual
G3-04 C1 = CONFIRMED / MTAJI-GREATER
G3-04 C6 = CONFIRMED / NAMUA-GREATER
G3-04 Stage 1 seed = CONSUMED
G3-04 Stage 2 seed = CONSUMED
G3-05 program review = G3-05-AUTHORIZED
G3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-05 Stage 0 v2 = STAGE0-PASS
G3-05 Stage 1 = TECHNICAL-INVALID / executions 1 authorized / 1 actual
G3-05 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-05 formal promoted candidate set = []
G3-05 Stage 1 seed = 31510001..31510240 / CONSUMED
G3-05 Stage 2 seed = 31520001..31520384 / NOT CONSUMED
G3-05 no-rescue boundary = CROSSED / ACTIVE
G3-06 = NOT AUTHORIZED / separate post-G3-05 review required
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state
- [`../branch-expansion-compression-transition/STUDY_1_OVERVIEW.md`](../branch-expansion-compression-transition/STUDY_1_OVERVIEW.md) — G3-05 prospective scope and frozen boundary
- [`../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md`](../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md) — G3-05 technical-invalid closure and no-rescue boundary
- [`../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`](../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md) — G3-05 program closure / G3-06 not authorized
- [`../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`](../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md) — G3-04初見向けformal overview
- [`../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`](../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md) — completed G3-04 formal result and interpretation boundary
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


## G3-03 closure

G3-03は`TCTGD-STUDY1`としてprospectively freezeし、Stage 0 PASS後にfresh Stage 1をexactly one authorized executionで実施した。12 paired trajectories / 24 rootsを測定し、population/resource/source identity/static independence/pair/development agreementとcanonical production/independent stage SHA一致を得た。

しかしindependent endpoint mapが`Object.create(null)`、productionが通常objectで、frozen runnerの`util.isDeepStrictEqual`がprototype差をscientific object inequalityとして扱ったため`allRootExact=false` / `stageScientificExact=false`となった。fresh evidence後に同一seedを修正再実行することはno-rescue ruleに反するため、formal decisionは`CLOSED / TECHNICAL-INVALID`、formal promoted candidate set `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`である。

Canonical records:

- [`../transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md`](../transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md)
- [`../transposition-concentration-tree-graph-divergence/CURRENT_STATUS.md`](../transposition-concentration-tree-graph-divergence/CURRENT_STATUS.md)
- [`../transposition-concentration-tree-graph-divergence/DECISION_REGISTER.md`](../transposition-concentration-tree-graph-divergence/DECISION_REGISTER.md)
- [`../transposition-concentration-tree-graph-divergence/REPRODUCIBILITY_INDEX.md`](../transposition-concentration-tree-graph-divergence/REPRODUCIBILITY_INDEX.md)
- [`../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md`](../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md)

## G3-04 formal closure

G3-04は`SFCDF-STUDY1`としてprospectively freezeし、Stage 0 `STAGE0-PASS`、Stage 1 `STAGE1-PASS`、Stage 2 `STAGE2-PASS`まで完了した。

Stage 1 fresh `31410001..31410192`では12 paired trajectoriesをexactly one authorized executionで測定し、C1 unit-width occupancyを`MTAJI-GREATER`、C6 cumulative tree/RAW ratioを`NAMUA-GREATER`としてpromotionした。C2–C5はpromotionされずStage 2へ進めていない。

Stage 2ではStage 1 RAW-root 24、trajectory 24、first-16-prefix 12 identitiesをadditional firewallとしてmaterializeし、fresh `31420001..31420288`から18 paired trajectories / 36 rootsをexactly one authorized formal executionで測定した。

Formal candidate decisions:

- C1 `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION` = **`CONFIRMED / MTAJI-GREATER`**。18/18同方向、exact two-sided sign-test `p=1/131072`、Holm PASS。
- C6 `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO` = **`CONFIRMED / NAMUA-GREATER`**。18/18同方向、exact two-sided sign-test `p=1/131072`、Holm PASS。

Production / independent formal Stage scientific coreは`e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039`でexact一致した。Stage 2 durable artifactはID `9844368476`、ZIP SHA-256 `c4d10eb07eec6ed75510f344f5c06d13deabeb03210023cd541035f05bd5da0f`。

Study lifecycleは`CLOSED / FORMAL-COMPLETE`。このlifecycle tokenは新しいscientific omnibus labelではなく、formal inferenceはcandidate-levelの`CONFIRMED` / `NOT-CONFIRMED`に限定する。

C1/C6からgame-theoretic forcing、best-move clarity、search ease、strategic simplicity、human difficulty、value/win probability、causal phase effect、depth >5 generalizationを導かない。

Canonical records:

- `../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`
- `../structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md`
- `../structural-forcing-corridor-decision-funnel/DECISION_REGISTER.md`
- `../structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md`
- `../structural-forcing-corridor-decision-funnel/checkpoints/2026-09-02-stage-2-formal-pass-study-closure.md`

## G3-05 formal closure

G3-05は`BECT-STUDY1`としてprospectively freezeし、Stage 0 v2を`STAGE0-PASS`として完了した。その後fresh Stage 1をexactly one authorized executionで開始したが、bounded RAW enumeration中の`relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529`によりfail-closedした。

Formal closureは`CLOSED / TECHNICAL-INVALID`。Stage 1 seed `31510001..31510240`はconsume済み、formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。partial telemetryはdiagnostic-onlyで、branch expansion/compression transitionのpositive/negative scientific evidenceへ格上げしない。same-evidence rerunやrelay-limit repair-and-rescueは禁止する。

Durable artifact `9849245665`はexact-byte mirror run `33637372364`でscientific recomputationなしにrepositoryへ保存された。

Canonical records:

- `../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md`
- `../branch-expansion-compression-transition/CURRENT_STATUS.md`
- `../branch-expansion-compression-transition/DECISION_REGISTER.md`
- `../branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md`
- `../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`
- `checkpoints/2026-09-02-g3-05-technical-invalid-closure.md`

## Protected evidence

standard initial RAW root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

G3-02 / G3-03 / G3-04 / G3-05はいずれもこれを生成・readしていない。G3-05 closure後も封印を維持する。

## Interpretation boundary

branching / reply-width geometryをbest move、search difficulty、game-theoretic forcing、win/value、human difficultyへ読み替えない。G3-02のdiagnostic patternをBao一般のformal structure claimへ昇格させない。

G3-03のtechnical-invalid runに残るdiagnostic transposition/reconvergenceやtree/graph divergence方向を、strategic simplicity、tactical simplicity、search ease、best-move clarity、game-theoretic forcing、value、win probability、human difficulty、causal strategic effectへ読み替えない。G3-04のformal C1/C6も同様に、frozen bounded phase-difference claimを超えて解釈しない。

## Next program boundary

G3-05 / `BECT-STUDY1`は`CLOSED / TECHNICAL-INVALID`であり、formal promoted candidate setは`[]`、Stage 2は未実行である。

Historical program plan上の次候補はG3-06だが、**G3-06はまだauthorizeされていない**。次はseparate post-G3-05 current-state authorization reviewを行う。review前にG3-06 fresh evidenceを生成・readせず、G3-05 partial telemetryをvalidated transition/mechanism evidenceとして継承しない。

## Canonical records

- `../transposition-concentration-tree-graph-divergence/README.md`
- `../transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md`
- `../transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md`
- `../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`
- `../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`
- `../structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md`
- `../structural-forcing-corridor-decision-funnel/DECISION_REGISTER.md`
- `../structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md`
- `../research-program-decisions/2026-09-02-post-g3-03-g3-04-authorization-review.md`
- `../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`
- `checkpoints/2026-09-02-g3-04-formal-complete-closure.md`
- `../branch-expansion-compression-transition/STUDY_1_OVERVIEW.md`
- `../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md`
- `../branch-expansion-compression-transition/CURRENT_STATUS.md`
- `../branch-expansion-compression-transition/DECISION_REGISTER.md`
- `../branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md`
- `../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`
- `checkpoints/2026-09-02-g3-05-technical-invalid-closure.md`
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
