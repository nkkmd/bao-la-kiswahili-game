# Research Generation 3 — 文書案内

更新日: 2026-09-04
Program: `Bao Third-Generation Research Program`（正式Program名）
状態: **`CLOSED / G3-01..G3-12 COMPLETE / INTEGRATED TO MAIN`**

Research Generation 3は、Baoのbounded RAW local game-tree / reachable-graph geometryを中心に検証した純粋研究programです。core `G3-01..G3-12`はすべてformal closureを持ち、`main`への統合も完了しています。

この世代は公開AIの改善programではありません。Research Generation 3の番号と`AI-GEN3`には対応関係がなく、研究結果だけで公開AIの変更を承認することもありません。

## 最初に読む

1. [`FINAL_SYNTHESIS.md`](FINAL_SYNTHESIS.md) — 世代全体で分かったこと、分からなかったこと
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の正式状態と保護された証拠
3. [`PROGRAM_FINAL_RESULT.json`](PROGRAM_FINAL_RESULT.json) — machine-readableな最終状態
4. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — 開始前に固定したhistorical prospective plan。現在状態に合わせて書き換えません
5. [`../research-program-decisions/2026-09-04-research-generation-3-program-closure.md`](../research-program-decisions/2026-09-04-research-generation-3-program-closure.md) — program closureの正式記録

## 世代全体の結論

第三世代でformalに強く残った結果は、次の5点です。

1. RAW-only・relative depth 5で、F1〜F5のlocal geometry measurementを再構築できる測定器が成立した。
2. G3-04の限定populationで、Mtaji側のunit-width occupancyとNamua側のcumulative tree / RAW ratioの差が確認された。
3. G3-07の限定populationで、root legal widthの高いstratumとranking-preorder changeの関連が3種類のsearch perturbationで確認された。
4. G3-10で、resource-bounded continuous representation上のdirectionality、persistence gradient、低return、first-order path dependenceの一部が確認された。
5. G3-11で、standard initial RAW rootのdepth 10におけるexact continuationが確認された。

これらはwhole-Bao law、causal mechanism、game-theoretic value、人間の難しさを示しません。またG3-12が`TECHNICAL-INVALID`で閉じたため、formalなgeneralization / counterexample decisionはありません。

## Study一覧

| Agenda / Study | 最終状態 | 文書入口 |
| --- | --- | --- |
| `G3-01` / `LGTGMF-STUDY1` | `TECHNICAL-INVALID` | [`../local-game-tree-geometry-measurement-foundation/README.md`](../local-game-tree-geometry-measurement-foundation/README.md) |
| 前提Study / `LGTGMIV-STUDY1` | `FORMAL-ELIGIBLE-ALL` | [`../local-game-tree-geometry-measurement-instrument-verification/README.md`](../local-game-tree-geometry-measurement-instrument-verification/README.md) |
| `G3-02` / `EBRWS-STUDY1` | `TECHNICAL-INVALID` | [`../effective-branching-reply-width-structure/README.md`](../effective-branching-reply-width-structure/README.md) |
| `G3-03` / `TCTGD-STUDY1` | `TECHNICAL-INVALID` | [`../transposition-concentration-tree-graph-divergence/README.md`](../transposition-concentration-tree-graph-divergence/README.md) |
| `G3-04` / `SFCDF-STUDY1` | `FORMAL-COMPLETE` | [`../structural-forcing-corridor-decision-funnel/README.md`](../structural-forcing-corridor-decision-funnel/README.md) |
| `G3-05` / `BECT-STUDY1` | `TECHNICAL-INVALID` | [`../branch-expansion-compression-transition/README.md`](../branch-expansion-compression-transition/README.md) |
| `G3-06` / `BRMGI-STUDY1` | `TECHNICAL-INVALID` | [`../bao-rule-mechanism-geometry-intervention/README.md`](../bao-rule-mechanism-geometry-intervention/README.md) |
| `G3-07` / `SILGM-STUDY1` | `FORMAL-COMPLETE` | [`../search-instability-local-geometry-mechanism/README.md`](../search-instability-local-geometry-mechanism/README.md) |
| `G3-08` / `LGPML-STUDY1` | `TECHNICAL-INVALID` | [`../local-geometry-persistence-memory-length/README.md`](../local-geometry-persistence-memory-length/README.md) |
| `G3-09` / `CLGR-STUDY1` | `TECHNICAL-INVALID` | [`../continuous-local-geometry-representation/README.md`](../continuous-local-geometry-representation/README.md) |
| 前提Study / `RRCLGR-STUDY1` | `TECHNICAL-INVALID` | [`../resource-robust-continuous-local-geometry-representation/README.md`](../resource-robust-continuous-local-geometry-representation/README.md) |
| 前提Study / `CRCLGR-STUDY1` | `FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION` | [`../canonical-resource-robust-continuous-local-geometry-representation/README.md`](../canonical-resource-robust-continuous-local-geometry-representation/README.md) |
| `G3-10` / `GCLD-STUDY1` | `FORMAL-COMPLETE` | [`../geometry-conditioned-longitudinal-dynamics/README.md`](../geometry-conditioned-longitudinal-dynamics/README.md) |
| `G3-11` / `FDEGHV-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN` | [`../fresh-depth10-exact-geometry-holdout/README.md`](../fresh-depth10-exact-geometry-holdout/README.md) |
| `G3-12` / `LGTGGC-STUDY1` | `TECHNICAL-INVALID` | [`../local-game-tree-geometry-generalization-counterexample/README.md`](../local-game-tree-geometry-generalization-counterexample/README.md) |

## Formal-complete Studyの要約

### G3-04 — Corridorとfunnel

`SFCDF-STUDY1`では、frozen paired population・RAW-only relative depth 5の範囲で次を確認しました。

```text
C1 unit-width occupancy = CONFIRMED / MTAJI-GREATER
C6 cumulative tree/RAW ratio = CONFIRMED / NAMUA-GREATER
```

これはgame-theoretic forcing、best-move clarity、戦略的単純さを意味しません。

### G3-07 — Local widthとsearch-output change

8 candidateのうち7件がestimableで、3件`CONFIRMED`、4件`NOT-CONFIRMED`、1件`NON-ESTIMABLE`でした。確認された3件は、root legal widthの高いstratumでranking-preorder changeがより集中するというnon-causal associationです。

### G3-10 — 時系列に沿ったgeometry dynamics

```text
C1 = CONFIRMED / ACTUAL-GREATER
C2 = CONFIRMED / ACTUAL-GREATER
C3 = CONFIRMED / ACTUAL-LESS
C4 = NOT-CONFIRMED
C5 = CONFIRMED / ACTUAL-GREATER
```

これはcausal dynamics、physical hysteresis、strategic regimeを確立しません。

### G3-11 — Depth 10のexact holdout

```text
depth-10 unique RAW states = 348270
depth-10 tree-node occurrences = 494456
cumulative distinct RAW states through depth 10 = 451127
cumulative tree-node occurrences through depth 10 = 631101
H1..H4 = DEEPER-CONFIRMED
```

exact claimはstandard initial RAW rootのfrozen depth-10 domainに限られます。

## 保護された証拠

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G3-12 Stage 1 repair / replay = NOT AUTHORIZED
G3-12 Stage 2 = NOT AUTHORIZED / NOT EXECUTED / seeds UNREAD
```

Program closureは新しい科学実行の承認ではありません。後続研究は、closed Studyのrepairではなく、新しいprospective StudyまたはResearch Generationとして別途承認する必要があります。

## 人間を対象とする研究

`G3-H01 — Human Perception of Local Branching / Decision Pressure Study 1`は`DEFERRED / INDEPENDENT / NON-BLOCKING`です。qualified participantへのアクセスがないため、人間に関する科学的結果は生成していません。`N=0`はnegative human evidenceではありません。

## 統合記録

Generation-level closureの`main`統合はforceなしfast-forwardで完了しました。詳細な時系列やcommit identityは、[`checkpoints/2026-09-04-research-generation-3-main-integration-complete.md`](checkpoints/2026-09-04-research-generation-3-main-integration-complete.md)と各StudyのReproducibility Indexを参照してください。
