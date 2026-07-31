# Checkpoint — 主要6候補の強制捕獲レジーム監査

日付: 2026-07-31  
研究段階: pilot-v2探索的分析後半  
対象工程: E-008 強制捕獲レジーム分析

## 目的

主要6候補を単一plyではなく、連続する `forcedCapture=true` 区間の内部構造として測定し、捕獲分岐急拡大、収束、forcing解除前兆、`namua → mtaji` 前兆、一時的スパイクへ探索的に分類する。

## 再現情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- profile: `pilot-v2`
- analysisVersion: `6-priority-forced-capture-regime-audit`
- commit: `fd0bfd02c7ba65b6efd53bd11ced1ba73f74e017`
- GitHub Actions run: `30614184554`
- artifact: `phase-transition-ci-artifacts`
- artifact digest: `sha256:4a8c5aebec05f766687508cba80dc422d682bdd8a40455bb30411a884d55e9a5`

## 実行方法

`pilot-v2` の固定設定から、主要6候補に対応する6局だけを決定論的に再生成した。候補plyの `forcedCapture` と捕獲手数が既存の盤面監査値と一致しない場合は実行を失敗させる回帰ガードを設けた。

使用コード:

- `tools/experiments/lib/forced-capture-regimes.js`
- `tools/experiments/run-priority-forced-capture-regime-audit.js`
- `.github/workflows/phase-transition-research-ci.yml`

## 集計

- games: 6
- observations: 332
- forced-capture regimes: 26
- candidates: 6
- candidates outside regimes: 0

分類件数:

- `capture-branch-expansion`: 3
- `namua-to-mtaji-precursor`: 2
- `temporary-spike`: 1
- `capture-branch-convergence`: 0
- `forcing-release-precursor`: 0

## 候補別結果

| archetypeId | regime | position | pre mean | candidate | persistence | recovery | mtaji | release | class |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| `9f778d512ae1` | 3–48 | 4/46 | 2.00 | 8 | 1.00 | 22 | 37 | 42 | expansion |
| `22807aff1baf` | 8–46 | 22/39 | 2.00 | 9 | 0.75 | 14 | 14 | 17 | expansion |
| `0eb352745c9b` | 9–54 | 23/46 | 3.67 | 8 | 0.25 | 11 | 12 | 23 | temporary spike |
| `2e79188a987a` | 26–46 | 13/21 | 3.33 | 9 | 0.25 | 5 | 5 | 8 | mtaji precursor |
| `7360876ad5c7` | 4–43 | 33/40 | 4.33 | 9 | 0.25 | 5 | 7 | 7 | mtaji precursor |
| `6b364e603366` | 4–47 | 5/44 | 1.67 | 7 | 0.875 | 35 | 35 | 39 | expansion |

## 解釈

主要6候補の中心現象が強制捕獲レジーム内部にあることは再確認された。一方、捕獲手数の瞬間的な増加だけでは分岐急拡大を認定できない。`0eb352745c9b` は増加量が大きいが持続率が低く、一時的スパイクへ再分類された。

`2e79188a987a` と `7360876ad5c7` はレジーム後半に位置し、5〜7ply以内にmtajiへ移行する。ただし、戦略的相転移か、強制捕獲系列が形式的phase移行へ収束する前兆かは未確定である。

## 判断変更

- 撤回: 残る主要4件をすべて捕獲分岐爆発候補とする。
- 暫定採用: 3件を捕獲分岐急拡大、1件を一時的スパイクとする。
- 維持: 主要6件を正式な戦略的相転移と認定する判断は保留。

## 未完了

- 全A候補15区間の一括分析
- 閾値感度分析
- 候補外強制捕獲レジームとの対照比較
- 候補手の質的特徴量
- 未使用seedでの確認

## 次工程

全A候補を一括実行できる固定入力経路を整備し、候補外レジームを含めた基準率・感度分析へ進む。
