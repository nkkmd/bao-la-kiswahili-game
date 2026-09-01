# Research Generation 3

Bao第三世代研究programの文書入口です。

## 現在の状態

```text
Program = Bao Third-Generation Research Program
Status = ACTIVE / LGTGMIV PREREQUISITE CLOSED / G3-02 AUTHORIZATION REVIEW REQUIRED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV formal eligible measurement families = all five frozen families
G3-02 automatic start = BLOCKED
G3-02..G3-08 automatic start = BLOCKED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のprogram state、G3-01 immutable closure、LGTGMIV closure、G3-02 authorization boundary、protected evidence
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — Research Generation 3開始前に固定したprospective program plan正本。historical planであり、current stateは`CURRENT_STATUS.md`を優先
- [`../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md`](../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md) — completed prerequisiteの初見向け概要
- [`../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md) — `LGTGMIV-STUDY1`最終報告
- [`../research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md`](../research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md) — LGTGMIV formal closureとG3-02別authorization review requirementのcurrent program decision
- [`checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md`](checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md) — LGTGMIV closed research branchの`main`統合完了記録
- [`../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`](../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md) — G3-01後に新しいmeasurement prerequisiteを選択したhistorical program decision
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md) — G3-01最終報告
- [`../research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md`](../research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md) — G3-01 technical-invalid closure

## G3-01から確定したboundary

G3-01は`LGTGMF-STUDY1`としてprospectively実行した。Stage 1 fresh developmentではNamua 6 / Mtaji 6の全12 rootsについてproduction / independentのroot-level measurement coreとF1〜F5 family digestがexact一致した。

一方、凍結済みcanonical stage manifestの`stageCoreSha256`へruntime-dependentなelapsed / RSS等を含めたimplementation defectによりdeterministic stage-level verification contractを満たさなかった。fresh evidence生成後のsame-evidence repairは禁止していたため、Stage 1は`STAGE1-TECHNICAL-INVALID`、Studyは`TECHNICAL-INVALID`で閉じ、Stage 2を実行していない。

G3-01のformal eligible measurement family setは`[]`であり、この結果は変更しない。

## Post-G3-01 prerequisiteの結果

G3-01とは別の新しいprospective independent Studyとして、`LGTGMIV-STUDY1`を完遂した。

**Formal title:** Local Game-Tree Geometry Measurement Instrument Verification Study 1

**日本語題目:** Baoにおける局所ゲーム木幾何測定instrumentのprospective再構築と独立検証 — deterministic scientific core、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立

Final decision:

**`CLOSED / FORMAL-ELIGIBLE-ALL`**

Stage 0ではsynthetic/non-scientific controlsによりdeterministic scientific core、telemetry separation、ordering invariance、production / independent implementation independenceをtechnical validationした。

Stage 1ではfresh `31110001..31110128`からNamua 8 / Mtaji 8の16 rootsをdepth 5までexact reconstructionし、全global gateをPASS、5 familyすべてをpromoteした。

Stage 2ではfresh formal holdout `31120001..31120192`からNamua 12 / Mtaji 12の24 rootsをdepth 5まで測定した。production / independent root reconstructionは24/24 exact一致し、5 familyそれぞれで全24 rootsおよびstage digestがexact一致、resource gateもPASSした。

Formal eligible families:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`
- `LGTGMIV-F5-REPLY-GEOMETRY`

このeligibilityはfrozen RAW-only depth-5 local reconstruction instrumentに限定される。whole-Bao state/game-tree size、deeper horizon、symmetry reduction、strategic/game-theoretic value、human difficultyを自動的に成立させない。

## Downstream boundary

LGTGMIV Stage 2 resultは`automaticG302StartAuthorized = false`を明示している。

したがってG3-02〜G3-08のautomatic startは引き続きblockedである。次のscientific actionは、current repository stateとLGTGMIV formal eligible family setを確認する**別のpost-closure G3-02 authorization review**である。review完了前にG3-02 fresh scientific evidenceを生成しない。

G3-11用standard initial RAW-root complete exact depth-10 holdoutは引き続き:

`SEALED / NOT GENERATED / NOT READ`

## Upstream boundary

Research Generation 1 / 2のclosed Studyをreopen / rescueしない。

```text
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator null
G3-01 = TECHNICAL-INVALID / eligible families []
```

Research Generation 3 historical `PROGRAM_PLAN.md`はretroactiveに変更しない。
