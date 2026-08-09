# Stage 1 Python Feature Audit Runbook

更新日: 2026-08-09  
Status: **exploratory feature audit / clustering not yet authorized / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 目的

96-game Stage 1 pilotはgeneration / replay / provenance / eligible-population auditをpassした。

次に、clusteringを行う前にPythonでfeature tableを再構築し、feature redundancyとpreprocessing上の問題を監査する。

このrunbookでは:

- clusteringしない
- PCAしない
- position typeを命名しない
- cluster数を選ばない
- playing styleを分析しない
- Study 1 formal corpusを使用しない

## 2. Python environment

以前のBao研究で使用したvenvを再利用する。

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

確認:

```bash
which python
python --version
```

このfeature-audit script自体はPython standard libraryだけで実行できる。

ただし将来のclusteringで使用予定のpackage有無もartifactへ記録する。

- numpy
- pandas
- scipy
- scikit-learn
- matplotlib

既存venvに不足があっても、このfeature auditのためだけにまだenvironmentを作り直さない。

## 3. Repository preflight

Repository rootで:

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only
git status --short
```

Stage 1 pilot local artifactが存在することを確認する。

```bash
test -f artifacts/local/position-typology/stage1-pilot-v1/manifest.json
test -f artifacts/local/position-typology/stage1-pilot-v1/verification.json
test -f artifacts/local/position-typology/stage1-pilot-v1/pilot-audit.json
```

## 4. Script syntax check

```bash
python -m py_compile tools/experiments/analyze-position-typology-stage1-features.py
```

失敗した場合はanalysisへ進まない。

## 5. Feature audit

実行:

```bash
python tools/experiments/analyze-position-typology-stage1-features.py
```

既定input:

```text
artifacts/local/position-typology/stage1-pilot-v1/
```

既定output:

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/
```

出力:

```text
python-feature-audit-v1/
├── eligible-primary-rule-state.csv
├── eligible-seat-canonical-sensitivity.csv
└── feature-audit.json
```

これらはlocal exploratory artifactでありGitへcommitしない。

## 6. Feature table policy

Primary tableは:

- `terminal == false`
- `ply >= 8`
- `ruleStateKey` dedup

を再構築する。

Pilot auditと同じく4,834 rowsであることを要求する。

Seat-canonical sensitivity tableも生成する。このpilotではseat-canonical collapseが0なので同じ4,834 rowsになるはずである。

## 7. Actor-oriented raw pits

Raw pit vectorはseat 0 / seat 1順ではなく、player-to-moveをactorとして:

```text
actor front 0..7
actor back 0..7
opponent front 0..7
opponent back 0..7
```

の32 dimensionsへ並べる。

これによりSouth/North seat label自体をraw feature dimensionへ持ち込まない。

## 8. Matrix candidate inventory

### Matrix S

Actor / opponent absolute structural primitives。

次のようなdeterministic sumsはprimary candidate列から外し、audit用には保持する。

- `boardSeeds = frontSeeds + backSeeds`
- `occupiedPits = frontOccupied + backOccupied`
- `meanChainEvents = meanCaptureEvents + meanRelayEvents`

### Matrix C

Actor − opponent differencesを候補として保存する。

Difference fieldsはabsolute actor / opponent valuesから決定論的に導出できるため、Matrix Sと同時投入することを自動的に採用しない。

### Matrix P

Matrix S + actor-oriented raw 32-pit vector。

Raw pitsをartifactへ保存することと、cluster inputとして採用することを区別する。

## 9. Redundancy audit

`feature-audit.json` はnamua / mtaji別に少なくとも以下を出力する。

- row count
- condition count
- constant columns
- exact duplicate columns
- `|Pearson r| >= 0.98` のhigh-correlation pairs
- known deterministic relation residuals
- Matrix S feature min / p50 / p95 / max
- mean / standard deviation
- skewness
- zero fraction
- unique-value count

`0.98`はformal exclusion thresholdではない。次のpreprocessing / representation comparisonを設計するためのexploratory diagnosticである。

## 10. Trajectory balance metadata

各positionへ:

```text
gamePhaseWeight = 1 / eligible positions within that game × phase
```

を付与する。

この段階ではweightを使ってclusterしない。

次工程で:

1. unique-position unweighted
2. game × phase balanced weighting
3. deterministic trajectory-balanced subsample

を比較するためのmetadataである。

## 11. 実行後に共有するもの

次の1ファイルをチャットへアップロードする。

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/feature-audit.json
```

CSVは現段階ではアップロード不要。

`feature-audit.json`を確認してから:

- Matrix Sのredundancy pruning
- Matrix Cの比較設計
- Matrix P採用可否
- raw / log1p / robust scaling候補
- clusteringの最初のmethod × k diagnostic grid

を決める。

## 12. 停止条件

`feature-audit.json`を確認するまではclusteringへ進まない。

Stage 1は引き続きexploratoryであり、同じpilot data上のmethod selectionをformal confirmationとは扱わない。
