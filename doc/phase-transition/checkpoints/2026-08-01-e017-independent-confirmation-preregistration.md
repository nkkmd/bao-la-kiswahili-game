# E-017 独立構造確認実験 — 事前登録チェックポイント

日付: 2026-08-01  
analysisVersion: `15-independent-structural-confirmation`  
Status: Preregistered / Not run

## 目的

E-010で観測した捕獲分岐急拡大の候補群への濃縮を、未使用seedで再確認する。

E-010では候補行11件のうち、急拡大7件中6件が同一`trajectoryHash + candidatePly`だった。このためE-017では、生の候補行ではなく`trajectoryHash + eventPly`重複除去単位を主解析とし、最低固有trajectory数も成功条件へ含める。

E-010の正式判定`not-confirmed`、E-011の条件・判定規則は変更しない。

## 固定コーパス

- games: 1000
- base seed: `20263001`
- seed range: `20263001–20264000`
- profile: `pilot-v2`
- max ply: 180
- random opening: 6ply
- baseline games: 1
- AI: `hard / bao / phase2 / depth 2`

次の既存seed範囲とは重複しない。

- 探索群: `20260721–20260820`
- E-010: `20261001–20261200`
- E-011: `20262001–20262400`

## 固定分析条件

- category: `A`
- `signalThreshold=2.0`
- `persistenceThreshold=0.75`
- `pliesRemaining >= 9`
- `expansionDelta=3`
- `persistenceFraction=0.5`
- `eventWindow=8`
- `controlExclusionBuffer=8`

## 主解析単位

各candidate/control行へ`games.json`の`trajectoryHash`を結合する。

イベントplyは次の優先順で解決する。

1. `candidatePly`
2. `representativePly`
3. `ply`

主キー:

```text
trajectoryHash + eventPly
```

同一主キーの反復行は1単位へ重複除去する。生の候補行集計は副次解析として残す。

## 主エンドポイント

- 分子: `capture-branch-expansion`に分類された固有candidate trajectory-ply数
- 分母: 主解析集団の全固有A-candidate trajectory-ply数
- 対照: 固有eligible control trajectory-plyに同じ分類規則を適用
- 効果量: 重複除去後の候補率／対照率リスク比

## サンプル数設計

E-010 200局から得た計画用点推定値:

| 指標 | E-010 | 1局あたり |
|---|---:|---:|
| 生の主解析候補行 | 11 | 0.055 |
| 固有candidate trajectory-ply | 5 | 0.025 |
| 固有candidate trajectory | 4 | 0.020 |
| 固有expansion trajectory-ply | 2 | 0.010 |
| 固有expansion trajectory | 2 | 0.010 |
| 固有control trajectory-ply | 7061 | 35.305 |

1000局での期待値:

- 生の主解析候補行: 55
- 固有candidate trajectory-ply: 25
- 固有candidate trajectory: 20
- 固有expansion trajectory-ply: 10
- 固有expansion trajectory: 10
- 固有control trajectory-ply: 35305

Poisson点推定近似:

| availability条件 | 1000局での確率 |
|---|---:|
| 生候補行30件以上 | 99.9911% |
| 固有candidate trajectory-ply 15件以上 | 98.7598% |
| 固有candidate trajectory 12件以上 | 97.8613% |
| 固有expansion trajectory-ply 5件以上 | 97.0747% |

4条件を独立と仮定した単純積は約93.8121%。実際には相関するため、これは計画上の記述値であり、統計的証拠や正式な同時達成確率とは扱わない。

800局では固有control期待値が28244で、最低30000を下回る。900局では構造availability 4条件の単純積が約85.8%。1000局では期待control数と構造availabilityの双方を満たすため、1000局を固定した。

## 成功条件

すべてを満たした場合のみ`confirmed`とする。

- 生の主解析A候補行30件以上
- 固有candidate trajectory-ply 15件以上
- 固有candidate trajectory 12件以上
- 固有expansion trajectory-ply 5件以上
- 固有expansion trajectory 5件以上
- 固有control trajectory-ply 30000件以上
- 重複除去後リスク比3以上
- 重複除去後候補率が対照率を上回る

一つ以上失敗した場合は`not-confirmed`。corpus、hash、trajectory結合、schema、必要出力の生成に失敗した場合は`inconclusive`。

## 実行制約

- 正式1000局は固定ローカル環境だけで実行する。
- GitHub Actionsで正式corpusを生成しない。
- 現時点では正式実行未承認。
- 1000局生成開始には別の明示的な開始指示を要求する。
- E-017生成開始後にE-010またはE-011の結果を用いて条件を緩和しない。

## 登録ファイル

- `config/experiments/phase-transition-independent-confirmation-v2.json`

## 次工程

1. E-017用のtrajectory-primary evaluatorと回帰fixtureを実装する。
2. E-011 formal guard CIを完了する。
3. 明示的な開始承認なしにE-011またはE-017の正式corpusを生成しない。
