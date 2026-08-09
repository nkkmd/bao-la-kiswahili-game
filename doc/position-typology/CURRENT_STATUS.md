# 局面類型と棋風研究 — 現在地

更新日: 2026-08-09  
Status: **Stage 0 complete / Stage 1 pilot tooling ready / local pilot execution pending / no formal confirmation authorized**

Branch: `research/position-typology-and-playing-style`

- Stage 0監査: [`STAGE_0_AUDIT.md`](STAGE_0_AUDIT.md)
- Stage 0実行手順: [`STAGE_0_RUNBOOK.md`](STAGE_0_RUNBOOK.md)
- Stage 0 smoke結果: [`STAGE_0_SMOKE_RESULT.md`](STAGE_0_SMOKE_RESULT.md)
- Stage 1 exploratory protocol: [`STAGE_1_EXPLORATORY_PROTOCOL.md`](STAGE_1_EXPLORATORY_PROTOCOL.md)
- Stage 1 pilot runbook: [`STAGE_1_RUNBOOK.md`](STAGE_1_RUNBOOK.md)

## 現在地

次の優先研究課題として **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

2026-08-09にrepository audit、専用instrumentation実装、16-game Stage 0 smoke、full replay verification、seat-canonical identity auditを完了した。Stage 0 hard integrity gateはすべてpassした。

その結果に基づきStage 1 exploratory protocolを作成し、96-game pilot generator、専用full verifier、eligible-population auditを実装した。

現在の停止点は **Stage 1 exploratory pilotのローカル実行前** である。

まだ実施していない:

- Stage 1 96-game pilot generation
- Python feature-table analysis
- clustering
- PCA / dimensionality-reduction diagnostics
- provisional position-type命名
- playing-style分析
- Study 1 cross-study analysis
- formal confirmation

以下は引き続きformalには固定していない。

- formal hypothesis
- final cluster数
- final position-type名称
- playing-style名称
- final feature set
- final preprocessing
- confirmatory seed block
- confirmation threshold
- formal statistical test
- formal execution policy

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

## Stage 0結果

### Integrity

- schema validation: passed
- full replay: passed
- stored observation recomputation: passed
- move legality: passed
- state identity: passed
- trajectory hash: passed
- summary recomputation: passed
- source provenance: passed

### Corpus

- games: 16
- observations: 970
- unique rule states: 935
- duplicate rule-state slots: 35
- unique seat-canonical states: 935
- seat-canonical collapse: 0
- within-trajectory repeated rule positions: 0
- unique trajectories: 16 / 16
- unique 8-ply opening states: 16 / 16

### Phase

- raw namua: 704 / 970 ≈ 72.6%
- raw mtaji: 266 / 970 ≈ 27.4%
- unique-state audit namua: 669
- unique-state audit mtaji: 266

35 duplicate rule-state slotsはsmokeではnamua側にのみ現れた。

### Seat-canonical identity

新reachable-state sampleで:

- unique rule states checked: 935
- legal moves checked: 3,714
- transitions checked: 3,714
- failures: 0
- result: passed

South/North seat exchange transformのvalidityは再確認できた。ただしsmokeではseat-canonical collapseが0だったため、primary dedupとしての実効的影響はStage 1で比較する。

## Stage 1 exploratory pilot design

### Corpus

- 96 games
- base seed `20270001`
- exploratory-only seed namespace
- max ply 100
- random opening 8 ply
- future confirmatory useは禁止

### Generation strata

各16 games:

| ID | evaluator | search | depth |
|---|---|---|---:|
| B-D1 | bao | phase2 | 1 |
| B-D2 | bao | phase2 | 2 |
| B-D3 | bao | phase2 | 3 |
| LS-D2 | bao | legacy | 2 |
| V2-D2 | bao-v2 | phase2 | 2 |
| LE-D2 | legacy | phase2 | 2 |

conditionはsampling / metadataでありposition featureではない。

### Primary discovery population

```text
terminal == false
ply >= 8
```

random-opening中のply 0–7とterminal positionはraw corpusへ残すが、primary discovery geometryから外す。

### Phase

- **phase-separated discoveryをprimary exploratory view**
- natural phase occupancyはraw corpusに保存
- generation時に50:50へ人工調整しない
- joint feature-space analysisはsecondary diagnostic

### Identity / dedup

- primary pilot view: `ruleStateKey` exact dedup
- sensitivity: `seatCanonicalKey` dedup
- raw occurrence frequencyは別途保持

### Trajectory balance

比較する:

1. unique-position unweighted
2. trajectory-balanced weighted
3. deterministic trajectory-balanced subsample

stability resamplingの基本単位はgame / trajectoryとする。

## Stage 1実装済み

```text
tools/experiments/run-position-typology-stage1-pilot.js
tools/experiments/verify-position-typology-stage1-pilot.js
tools/experiments/audit-position-typology-stage1-pilot.js

doc/position-typology/STAGE_1_EXPLORATORY_PROTOCOL.md
doc/position-typology/STAGE_1_RUNBOOK.md
```

Pilot auditは次を出力する。

- terminal / max-ply truncation
- game length
- eligible positions per game
- phase / condition counts
- phase × condition counts
- unique rule states
- duplicate rule-state slots by phase
- repeated/shared rule states
- unique seat-canonical states
- seat-canonical collapse

## 次のローカル作業

`STAGE_1_RUNBOOK.md` に従いNode.jsで:

```bash
node test/position-typology-features.test.js
node test/symmetry-transform.test.js
node test/transition-symmetry.test.js
node test/evaluation-symmetry.test.js

node tools/experiments/run-position-typology-stage1-pilot.js
node tools/experiments/verify-position-typology-stage1-pilot.js
node tools/experiments/audit-position-typology-stage1-pilot.js
```

この段階ではPython venvは不要。

共有対象:

```text
artifacts/local/position-typology/stage1-pilot-v1/manifest.json
artifacts/local/position-typology/stage1-pilot-v1/verification.json
artifacts/local/position-typology/stage1-pilot-v1/pilot-audit.json
```

## Pilot後の停止点

3ファイルをinspectionしてから、初めてPython venvを使うfeature-table / clustering toolingを実装・実行する。

Pilot監査前には:

- large corpusへ拡張しない
- clusteringしない
- cluster数を選ばない
- position typeを命名しない

## 重要原則

- position typeとplaying styleを分離する。
- playing styleを一局面だけから判定しない。
- AI実装条件を棋風名にしない。
- 勝率・AI評価値を局面類型そのものと同一視しない。
- 類型名を先に決めない。
- raw ply数を独立標本数とみなさない。
- deterministic trajectory repetitionを独立例として数えない。
- exploratory discoveryとfuture confirmatory validationを分離する。
- Study 1 formal decisionsを変更しない。
- formal corpusをGitHub Actionsで生成しない。

## 次のformal decision point

Stage 1 exploratory evidenceからprovisional position typesが安定した後、Stage 2 replication前に:

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
