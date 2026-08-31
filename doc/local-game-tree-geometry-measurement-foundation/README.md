# Local Game-Tree Geometry Measurement Foundation Study 1

Research Generation 3 `G3-01` / `LGTGMF-STUDY1` の研究ディレクトリである。

本Studyは、Baoの局面を戦略clusterへ分類したり、Bao全体のstate-space / game-tree sizeを推定したりする研究ではない。同一のauthoritative RAW rootとbounded local horizonから得られるlegal game tree / reachable RAW graphについて、branching、reply width、transposition、reconvergence、tree/graph divergence等をexactかつ再現可能に測定するinstrumentを構築し、downstream Research Generation 3で利用可能なformal eligibility boundaryを定める。

## Formal identity

```text
Program = Research Generation 3 G3-01
Study ID = LGTGMF-STUDY1
Stage 0 = LGTGMF-S0-TECHNICAL-2026-08-31-v1
Stage 1 = LGTGMF-S1-DEVELOPMENT-2026-08-31-v1
Stage 2 = LGTGMF-S2-FORMAL-2026-08-31-v1
Baseline main = 7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f
Branch = research/g3-01-local-game-tree-geometry-measurement-foundation
```

## 重要な境界

- authoritative identityはRAW-only: `pits,reserve,houseOwned,player,phase,winner,pending`。
- validated transform setは`[]`。symmetry reduction / canonicalization / player swap / reflection dedupは行わない。
- G2-05 depth 0..9は`HISTORICAL-EXACT-REFERENCE`としてtechnical useのみ可能。
- G2-12は`TECHNICAL-INVALID`、`selectedEstimator = null`のまま変更しない。
- standard initial RAW rootのcomplete exact depth-10 layerはG3-11用にsealedし、G3-01ではscientific counts / geometry outcomeを生成・readしない。
- branch widthやreply widthの狭さを、game-theoretic forcing、best move、人間の難易度と同一視しない。

## 文書

- `STUDY_1_PROTOCOL.md`: scientific contractとconstruct semanticsの正本
- `STUDY_1_OVERVIEW.md`: 初見向け概要
- `CURRENT_STATUS.md`: current-facing state
- `DECISION_REGISTER.md`: prospective / later formal decision記録
- `REPRODUCIBILITY_INDEX.md`: source・spec・artifact・verifierへの索引
- `preregistration/STUDY_START_SPEC.json`: Study共通freeze
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`: technical fixture freeze
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`: fresh development freeze
- `preregistration/STAGE_2_FORMAL_SPEC.json`: fresh held-out formal freeze
- `checkpoints/`: immutable progress checkpoints

## 現在状態

Study identityと全Stage contractはscientific outcome生成前にprospectively固定する。`main`への統合はuserの明示的指示があるまで行わない。
