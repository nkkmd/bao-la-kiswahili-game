# Checkpoint — 優先候補盤面監査完了

日付: 2026-07-30  
研究段階: pilot-v2探索的分析後半  
次工程: 強制捕獲レジーム分析

## 目的

forcingアブレーション後に残った主要候補が、実際にforcingから独立した戦略的転移なのか、強制捕獲系列内部の構造変化なのかを確認する。

## 入力

- corpus: `pilot-v2-analysis-input.zip`
- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- games: 100

## 使用コード

- `tools/experiments/extract-phase-transition-candidate-audit.js`
- `notebooks/phase-transition/05-candidate-board-audit.ipynb`
- commit: `b0845486b958c5e2da91405b708af9e8544efd5f`

## 対象アーキタイプ

- `9f778d512ae1`
- `22807aff1baf`
- `0eb352745c9b`
- `2e79188a987a`
- `7360876ad5c7`
- `6b364e603366`

## 監査窓

- 候補前: 1ply
- 候補後: 8ply

## 主要結果

全6候補について、候補plyで次が成立した。

- `forcedCapture=true`
- `legalMoveCount=captureMoveCount`

候補直前から候補plyへの手数変化:

| archetypeId | 直前 | 候補ply | 差 |
|---|---:|---:|---:|
| `9f778d512ae1` | 2 | 8 | +6 |
| `22807aff1baf` | 2 | 9 | +7 |
| `0eb352745c9b` | 2 | 8 | +6 |
| `2e79188a987a` | 3 | 9 | +6 |
| `7360876ad5c7` | 2 | 9 | +7 |
| `6b364e603366` | 1 | 7 | +6 |

## 候補別の暫定解釈

### `9f778d512ae1`

- opening / namua
- 3ゲームで同一stateHash・同一変化署名
- 捕獲分岐急拡大の再現候補

### `22807aff1baf`

- middle / namua
- forcing切替から離れた持続的捕獲系列
- 捕獲ネットワーク再編候補

### `0eb352745c9b`

- middle / namua
- forcing切替距離が大きいが、forcingレジーム内部
- 捕獲分岐急拡大候補

### `2e79188a987a`

- middle / namua
- 候補後5plyでmtajiへ移行
- mtaji前兆候補

### `7360876ad5c7`

- late / namua
- 候補後7plyでmtajiへ移行
- mtaji前兆候補

### `6b364e603366`

- opening / namua
- 長い強制捕獲系列が継続
- 開局方策依存の追加検証が必要

## 解釈の変更

### 撤回

`nearestForcingDistance > 0` をforcing独立性の証拠とみなす。

### 新しい解釈

`nearestForcingDistance > 0` はforcing真偽の切替から離れていることだけを示す。候補局面は強制捕獲レジーム内部に存在し得る。

A群の名称を次へ変更する。

- 旧: forcing独立候補
- 新: forcing切替非同時候補

## 現在の結論

正式な「戦略的相転移点」は未認定。

現時点で確認できた現象は、強制捕獲レジーム内部における捕獲選択肢構造の急変である。その一部は `namua → mtaji` の前兆である可能性がある。

## 次の実装要件

1. 各ゲームの連続 `forcedCapture=true` 区間を抽出する。
2. 各候補を所属レジームへ対応付ける。
3. レジーム開始・終了、長さ、候補位置を計算する。
4. 候補前後の捕獲手数平均・最大・回復を計算する。
5. forcing解除、mtaji移行、終局までの距離を計算する。
6. 候補を分岐急拡大、収束、解除前兆、mtaji前兆、一時スパイクへ分類する。

## 再開時の確認順

1. `doc/phase-transition/CURRENT_STATUS.md`
2. `doc/phase-transition/DECISION_REGISTER.md`
3. 本チェックポイント
4. `doc/phase-transition/EXPERIMENT_INDEX.md`
5. `pilot-v2-analysis-input.zip`
