# 局面類型と棋風研究 — 現在地

更新日: 2026-08-09  
Status: **Stage 0 complete / Stage 1 pilot passed / Python feature audit tooling ready / clustering not yet authorized / no formal confirmation authorized**

Branch: `research/position-typology-and-playing-style`

主要文書:

- [`STAGE_0_AUDIT.md`](STAGE_0_AUDIT.md)
- [`STAGE_0_RUNBOOK.md`](STAGE_0_RUNBOOK.md)
- [`STAGE_0_SMOKE_RESULT.md`](STAGE_0_SMOKE_RESULT.md)
- [`STAGE_1_EXPLORATORY_PROTOCOL.md`](STAGE_1_EXPLORATORY_PROTOCOL.md)
- [`STAGE_1_RUNBOOK.md`](STAGE_1_RUNBOOK.md)
- [`STAGE_1_PILOT_RESULT.md`](STAGE_1_PILOT_RESULT.md)
- [`STAGE_1_FEATURE_AUDIT_RUNBOOK.md`](STAGE_1_FEATURE_AUDIT_RUNBOOK.md)

## 現在地

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

完了済み:

1. Stage 0 repository / instrumentation / corpus audit
2. position-typology専用instrumentation実装
3. Stage 0 16-game smoke + full verification + seat-symmetry audit
4. Stage 1 exploratory protocol
5. Stage 1 96-game pilot generation
6. Stage 1 full replay / provenance verification
7. Stage 1 eligible-population audit
8. Stage 1 pilot result記録
9. Python feature-table / redundancy-audit tooling実装

現在の停止点は **Python feature auditのローカル実行前**。

まだ実施していない:

- Python feature audit実行
- clustering
- PCA / dimensionality-reduction diagnostics
- cluster数選択
- provisional position-type命名
- playing-style分析
- Study 1 cross-study analysis
- formal confirmation

Stage 1はexploratoryでありpreregistrationではない。

## Study 1との固定境界

局面相転移点Study 1はclosedであり、以下を変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018/H16: `confirmed` only fixed `hard / bao / depth2`
- E-019/H17: global `not-confirmed`
- E-020/H18: `confirmed` only fixed `hard / bao / depth3`
- `capture-branch-expansion` classifier / vocabulary
- forced-capture regime definition
- `sustained-forcing window` のStage B retrospective interpretation boundary
- trajectory-ply sensitivityの位置づけ

Study 1 formal corpusはinitial typology discoveryへ入れない。独立に得られたposition typeとの関係を、研究後半のcross-study analysisでのみ検討する。

## Stage 0結論

Stage 0 integrity gateはすべてpass。

- 16 games
- 970 observations
- 935 unique rule states
- 16 / 16 unique trajectories
- 16 / 16 unique opening states
- seat-symmetry audit: 935 states / 3,714 legal moves / 3,714 transitions / failure 0

Phase distributionは約73:27だったため、Stage 1ではphase-separated primary viewを採用した。

## Stage 1 pilot — integrity

96-game pilotはfull verificationをpass。

- exploratory boundary: passed
- schema validation: passed
- full replay: passed
- stored observation recomputation: passed
- move legality: passed
- state identity: passed
- trajectory hash: passed
- summary recomputation: passed
- source provenance: passed
- clean source tree: passed
- legal moves checked: 22,299

Source commit:

`cb5376145a8aeddf5ca42bc9c74e6a0efdb0e114`

Config hash:

`6d61f44cfaacf8dbb55fde544a31224faf45c729142fec83b68535bb941ccf10`

## Stage 1 pilot — raw corpus

- games: 96
- observations: 5,694
- terminal observations: 95
- namua: 4,111
- mtaji: 1,583
- unique rule states: 5,301
- duplicate rule-state slots: 393
- unique trajectories: 96 / 96
- unique opening states: 96 / 96
- seat-canonical collapse: 0

95 / 96 gamesはterminalへ到達し、1 / 96のみmax-ply 100でtruncated。

## Stage 1 primary eligible population

Definition:

```text
terminal == false
ply >= 8
```

Result:

- eligible positions: 4,834
- unique `ruleStateKey`: 4,834
- duplicate rule-state slots: 0
- rule states shared across trajectories: 0
- unique `seatCanonicalKey`: 4,834
- seat-canonical collapse: 0

Raw corpusの393 duplicate slotsはprimary対象外領域にのみ存在した。

Primary eligible phase counts:

- namua: 3,339 ≈ 69.1%
- mtaji: 1,495 ≈ 30.9%

Pilot-level exploratory clusteringのsample availabilityとしては両phaseとも十分と判断する。

## Condition coverage

各conditionは16 gamesだがeligible position数はtrajectory lengthで異なる。

| condition | all | namua | mtaji |
|---|---:|---:|---:|
| B-D1 | 980 | 576 | 404 |
| B-D2 | 865 | 576 | 289 |
| B-D3 | 847 | 568 | 279 |
| LS-D2 | 703 | 546 | 157 |
| V2-D2 | 702 | 505 | 197 |
| LE-D2 | 737 | 568 | 169 |

特にmtajiでcondition-specific occupancy差が大きい。

これをposition-type geometryへの暗黙のsample weightにしないため、後段で:

1. unique-position unweighted
2. game × phase balanced weighting
3. deterministic trajectory-balanced subsample

を比較する。

Condition label自体はfeature vectorへ入れない。

## Phase / identity policy

Primary exploratory clustering:

- namua / mtajiを分離する
- primary dedup: `ruleStateKey`
- seat-canonical dedup: sensitivity

Joint phase viewはsecondary diagnostic。

このpilotではprimary eligible populationにmirror pairが存在しなかったため、rule-state dedupとseat-canonical dedupのsample countは同一。

## Python feature audit

実装済み:

```text
tools/experiments/analyze-position-typology-stage1-features.py
```

Runbook:

```text
doc/position-typology/STAGE_1_FEATURE_AUDIT_RUNBOOK.md
```

監査内容:

- actor-oriented raw 32-pit vector
- Matrix S / C / P candidate inventory
- constant columns
- exact duplicate columns
- known deterministic relations
- high-correlation pairs (`|r| >= 0.98` exploratory diagnostic)
- min / p50 / p95 / max
- mean / standard deviation
- skewness
- zero fraction
- package / Python versions
- `gamePhaseWeight = 1 / eligible positions within game × phase`

このscriptはclusteringを実行しない。

## 次のローカル作業

以前の研究venvを再利用する。

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

python -m py_compile tools/experiments/analyze-position-typology-stage1-features.py
python tools/experiments/analyze-position-typology-stage1-features.py
```

共有対象:

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/feature-audit.json
```

CSVは現段階では共有不要。

## Feature audit後のdecision point

`feature-audit.json`を見てから:

- Matrix S redundancy pruning
- Matrix C comparison design
- Matrix P採用可否
- raw / log1p / robust scaling候補
- first clustering diagnostic grid
- trajectory-balanced weighting / subsampling design

を決定する。

Audit前にはclusteringしない。

## 重要原則

- position typeとplaying styleを分離する。
- playing styleを一局面だけから判定しない。
- AI実装条件を棋風名・position type名にしない。
- 勝率・AI評価値を局面類型そのものと同一視しない。
- 類型名を先に決めない。
- raw ply数を独立標本数とみなさない。
- deterministic trajectory repetitionを独立例として数えない。
- exploratory discoveryとfuture confirmatory validationを分離する。
- Study 1 formal decisionsを変更しない。
- formal corpusをGitHub Actionsで生成しない。

## 次のformal decision point

Stage 1でprovisional position typesが安定した後、Stage 2 replication前に少なくとも:

- target position population
- final feature set
- preprocessing
- clustering / assignment definition
- deduplication rule
- held-out seed block
- stability criterion
- minimum sample / cluster availability
- success / failure / inconclusive rule
- stopping condition

をfreezeする。
