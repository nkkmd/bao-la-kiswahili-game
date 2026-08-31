# Local Game-Tree Geometry Measurement Foundation Study 1

Research Generation 3 `G3-01` / `LGTGMF-STUDY1` の研究ディレクトリである。

本Studyは、同一のauthoritative RAW rootとbounded local horizonから得られるlegal game tree / reachable RAW graphについて、branching、reply width、transposition、reconvergence、tree/graph divergence等をexactかつ再現可能に測定するinstrumentのformal eligibility boundaryを検証した。

正式判断は **`TECHNICAL-INVALID`**。Stage 1 fresh developmentでは全12 selected rootsについてproduction / independentのroot-level measurement coreとF1〜F5 family digestがexact一致したが、凍結済みcanonical stage-manifest contractを実装が満たさなかった。fresh evidence消費後のsame-evidence repairは禁止されていたためfail-closedで閉じ、Stage 2は実行していない。

## Formal identity

```text
Program = Research Generation 3 G3-01
Study ID = LGTGMF-STUDY1
Stage 0 original = LGTGMF-S0-TECHNICAL-2026-08-31-v1
Stage 0 corrective = LGTGMF-S0-TECHNICAL-2026-08-31-v2
Stage 1 = LGTGMF-S1-DEVELOPMENT-2026-08-31-v1
Stage 2 = LGTGMF-S2-FORMAL-2026-08-31-v1
Baseline main = 7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f
Branch = research/g3-01-local-game-tree-geometry-measurement-foundation
Formal decision = TECHNICAL-INVALID
Formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Main integration = COMPLETE
```

## 重要な境界

- authoritative identityはRAW-only: `pits,reserve,houseOwned,player,phase,winner,pending`。
- validated transform setは`[]`。symmetry reduction / canonicalization / player swap / reflection dedupは行っていない。
- G2-05 depth 0..9は`HISTORICAL-EXACT-REFERENCE`としてtechnical useのみ行った。
- G2-12は`TECHNICAL-INVALID`、`selectedEstimator = null`のまま変更していない。
- standard initial RAW rootのcomplete exact depth-10 layerはG3-11用にsealedされ、本Studyでは生成・readしていない。
- branch widthやreply widthの狭さを、game-theoretic forcing、best move、人間の難易度と同一視しない。
- Stage 1 developmentのexact agreementをformal Stage 2 eligibilityへ昇格させていない。

## 文書

- `STUDY_1_PROTOCOL.md`: prospective scientific contractとconstruct semanticsの正本
- `STUDY_1_OVERVIEW.md`: 初見向けの日本語概要
- `STUDY_1_FINAL_REPORT.md`: 最終科学報告
- `CURRENT_STATUS.md`: current-facing closure state
- `DECISION_REGISTER.md`: prospective freezeとformal disposition
- `REPRODUCIBILITY_INDEX.md`: source・spec・workflow・artifact・verifier索引
- `preregistration/`: Study / Stage freeze
- `results/`: Stage result summary
- `checkpoints/`: immutable progress / closure checkpoints

## Current dependency state

G3-01のformal eligible measurement family setは空である。したがって、G3-02〜G3-08をこのinstrumentのまま自動開始してはならない。2026-08-31のprogram-level dependency decisionにより、次のscientific directionとしてG3-01とは別の新しいpost-G3-01 / pre-G3-02 measurement-instrument prerequisite（working title: `Local Game-Tree Geometry Measurement Instrument Verification Study 1`）を選択した。formal Study ID、scientific execution、fresh seed consumptionはまだ開始していない。

2026-08-31、userの明示的指示によりG3-01 scientific closureは`main`へ統合済みである。integrationはformal decision、seed consumption、Stage authorization、protected depth-10 holdoutを変更しない。
