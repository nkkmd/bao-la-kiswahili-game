# Research Generation 3 — Current Status

Updated: 2026-09-01

```text
Program = Bao Third-Generation Research Program
Program status = ACTIVE / POST-LGTGMIV PREREQUISITE CLOSED / G3-02 AUTHORIZATION REVIEW REQUIRED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-01 Stage 1 seed consumption = 31010001..31010096
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV Stage 1 seed consumption = 31110001..31110128
LGTGMIV Stage 2 seed consumption = 31120001..31120192
LGTGMIV formal eligible measurement families = F1,F2,F3,F4,F5 / all five frozen families
LGTGMIV research-branch closure = COMPLETE
LGTGMIV main integration = PENDING
Next scientific action = separate post-closure G3-02 authorization review
G3-02 automatic start = BLOCKED
G3-02..G3-08 automatic start = BLOCKED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Active scientific research branch = research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification / closure synchronization
```

## Program direction

Research Generation 3は、Research Generation 2で最も強く成立したRAW-only bounded exact analysisを基盤とし、Baoの局所ゲーム木・局所到達グラフの構造幾何を中心研究対象とする。

G3-01 `LGTGMF-STUDY1`は、fresh Stage 1のroot/family levelではproduction / independent exact agreementを得た一方、runtime telemetryをstage-level canonical digestへ混入させた凍結済みinstrument defectにより`TECHNICAL-INVALID`で閉じた。eligible familiesは`[]`、Stage 2は未実行であり、このformal decisionは永久に変更しない。

その後のprogram-level dependency reassessmentに従い、G3-01とは別のpost-G3-01 / pre-G3-02 prerequisiteとして`LGTGMIV-STUDY1`をprospectively開始・完遂した。

## Completed measurement-instrument prerequisite

Formal Study:

**`LGTGMIV-STUDY1` — Local Game-Tree Geometry Measurement Instrument Verification Study 1**

日本語題目:

**Baoにおける局所ゲーム木幾何測定instrumentのprospective再構築と独立検証 — deterministic scientific core、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立**

Formal closure:

`CLOSED / FORMAL-ELIGIBLE-ALL`

Stage progression:

- Stage 0 technical controls: `STAGE0-PASS`
- Stage 1 fresh development: 16 roots / depth 5 / `STAGE1-PASS` / five families promoted
- Stage 2 fresh formal holdout: 24 roots / depth 5 / global gate PASS / `FORMAL-ELIGIBLE-ALL`
- Stage 2 read-only post-result audit: PASS / scientific re-execution false

Formal eligible family set:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

Stage 2 exact verification:

```text
fresh holdout = 31120001..31120192
population = 12 Namua + 12 Mtaji = 24 unique RAW roots
relative depth = 5
production / independent exact root reconstruction = 24/24
each formal family exact roots = 24/24
resource gate = PASS
stage scientific core SHA-256 = 97ad7dc21e1758d31fa09e487389bf5d3935b1d98daf3eaa2f1b524d7169f9a4
```

この結果はbounded RAW-only depth-5 local geometry measurement instrumentのformal eligibilityを成立させる。whole-Bao game-tree size、depth 5を超えた自動一般化、symmetry reduction、strategic value、game-theoretic value、human difficultyを意味しない。

## Immutable upstream boundaries

```text
Research Generation 2 = CLOSED
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator null
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
G3-01 = CLOSED / TECHNICAL-INVALID / eligible families []
```

LGTGMIVはこれらを修正・救済・再判定していない。

## Protected evidence

standard initial RAW rootのdepth 10 exact layerはG3-11の`FRESH-DEEPER-EXACT-HOLDOUT`として引き続き保護する。

```text
complete depth-10 enumeration generated = false
depth-10 scientific counts / geometry outcome read = false
LGTGMIV input to depth-10 holdout = false
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## Downstream authorization boundary

LGTGMIVの成功はG3-02の自動開始条件ではない。Stage 2 resultにも`automaticG302StartAuthorized = false`を明示している。

```text
G3-02 automatic start = BLOCKED
G3-02..G3-08 automatic start = BLOCKED
next action = separate Research Generation 3 post-closure authorization review
```

次のreviewでは、current repository state、LGTGMIV formal eligible family set、G3-02のprospective question、fresh population / evidence firewall、protected evidenceとのdependencyを確認し、G3-02を開始可能かを別decisionとして固定する。reviewが完了するまではG3-02 scientific evidenceを生成しない。

## Canonical records

Program:
- `README.md`
- `PROGRAM_PLAN.md` — Research Generation 3開始前に固定したhistorical prospective plan。retroactiveに書き換えない
- `CURRENT_STATUS.md` — current-facing state
- `../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`
- `../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`

G3-01:
- `../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`
- `../local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md`

Completed prerequisite `LGTGMIV-STUDY1`:
- `../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md`
- `../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_PROTOCOL.md`
- `../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`
- `../local-game-tree-geometry-measurement-instrument-verification/CURRENT_STATUS.md`
- `../local-game-tree-geometry-measurement-instrument-verification/DECISION_REGISTER.md`
- `../local-game-tree-geometry-measurement-instrument-verification/REPRODUCIBILITY_INDEX.md`
- `../local-game-tree-geometry-measurement-instrument-verification/results/stage-2/execution-summary.json`
- `../local-game-tree-geometry-measurement-instrument-verification/results/stage-2/posthoc-audit-summary.json`

Research Generation 3 historical `PROGRAM_PLAN.md` remains unchanged. LGTGMIV scientific closure is complete on its research branch; main integration is a repository integration step and does not alter the scientific decision.
