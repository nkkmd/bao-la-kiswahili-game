# Research Generation 3

Bao第三世代研究programの文書入口です。

## 現在の状態

```text
Program = Bao Third-Generation Research Program
Status = ACTIVE / POST-G3-01 MEASUREMENT PREREQUISITE SELECTED / NOT STARTED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Next scientific direction = new post-G3-01 / pre-G3-02 measurement-instrument prerequisite
Next Study working title = Local Game-Tree Geometry Measurement Instrument Verification Study 1
Next Study formal Study ID = NOT ASSIGNED
Next Study scientific execution = NOT STARTED
G3-02..G3-08 automatic start = BLOCKED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のprogram state、G3-01 closure、選択済みnext prerequisite、protected evidence
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — Research Generation 3開始前に固定したprospective program plan正本。current stateは`CURRENT_STATUS.md`を優先
- [`../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`](../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md) — G3-01後のdependency reassessmentにより次のmeasurement prerequisiteを選択したprogram-level decision
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md) — G3-01の初見向け概要
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md) — G3-01最終報告
- [`../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`](../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md) — 第三世代をlocal game-tree geometry方向として採用したprogram-level decision
- [`../research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md`](../research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md) — G3-01 closureとdownstream dependency decision

## G3-01から確定したboundary

G3-01は`LGTGMF-STUDY1`としてprospectively実行した。Stage 1 fresh developmentではNamua 6 / Mtaji 6の全12 rootsについてproduction / independentのroot-level measurement coreとF1〜F5 family digestがexact一致した。

一方、凍結済みcanonical stage manifestの`stageCoreSha256`へruntime-dependentなelapsed / RSS等を含めたimplementation defectによりdeterministic stage-level verification contractを満たさなかった。fresh evidence生成後のsame-evidence repairは禁止していたため、Stage 1は`STAGE1-TECHNICAL-INVALID`、Studyは`TECHNICAL-INVALID`で閉じ、Stage 2を実行していない。

G3-01のformal eligible measurement family setは`[]`であり、この結果は変更しない。

## 次の研究方向

次のscientific actionとして、G3-01とは別の新しいprospective independent prerequisite Studyを置く。

**Working title:** Local Game-Tree Geometry Measurement Instrument Verification Study 1

**日本語working title:** Baoにおける局所ゲーム木幾何測定instrumentの新規prospective再構築と独立検証 — deterministic canonical manifest、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立

このStudyはG3-01の再実行・救済・Study 2ではなく、G3-02でもない。G3-01 failure modeはdesign informationとしてのみ利用し、fresh Study identity / fresh seeds / fresh evidenceで測定instrument eligibilityを新規に検証する。

最重要設計原則は、**deterministic scientific / verification canonical coreとruntime resource telemetryの完全分離**である。production / structurally independent implementation、RAW-only identity、no symmetry reduction、canonical serialization、traversal-order invariance、root/family/stage digest reproducibilityを新Study開始時のprospective contractへ組み込む。

正式Study ID等はまだ付与しない。新Study開始時にcurrent `main`を再監査してprospectively固定する。

## Downstream boundary

G3-02〜G3-08のautomatic startは引き続きblockedである。新prerequisiteがformal eligible measurement familyを成立させた場合も、closure後のprogram state確認なしにG3-02を自動開始しない。G3-11用depth-10 exact holdoutはsealedのまま維持する。

## Upstream boundary

Research Generation 1 / 2のclosed Studyをreopen / rescueしない。

```text
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator null
```
