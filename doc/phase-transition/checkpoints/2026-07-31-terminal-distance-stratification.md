# Checkpoint — forcing解除前兆の終局距離層別

日付: 2026-07-31  
実験: E-013  
analysisVersion: `8-terminal-distance-summary`

## 目的

A候補で観測されたforcing解除前兆の濃縮が、独立した構造変化か終局近傍効果かを分離する。

## 方法

E-012の候補・対照指標を終局までの残りplyで `0–4 / 5–8 / 9–16 / 17+` に層別化した。対照群は分析後窓8plyを確保するため、直接比較は終局まで9ply以上の局面で行った。

## 結果

- forcing解除前兆に分類されたA候補6件は全て終局まで0–4ply。
- 終局まで9ply以上残るA候補は8件で、forcing解除前兆は0件。
- 終局まで9ply以上残る対照は4062件で、forcing解除前兆は576件（14.2%）。
- 0–4ply帯には適格対照点がなく、同帯の直接比較はできない。

## 判断

- forcing解除前兆のA候補側濃縮を戦略転移の証拠とする判断を撤回する。
- 6件を終局近傍サブタイプとして扱う。
- 主たる相転移候補の比較では、終局まで9ply以上を別集計する。

## 再現情報

- implementation commit: `2a3b13420ef403b49d66c15b307510b33843669f`
- workflow commit: `652c73289379b4387c84f51d63de6107cf52ed1f`
- Actions run: `30617983989`
- artifact: `phase-transition-terminal-strata`
- artifact digest: `sha256:af2f30d495a84c20b97c856dffa428197a2366532d9630f77122264271ce8ec3`

## 次の再開地点

E-009として、捕獲分岐急拡大候補へ最大捕獲量、relay長、候補手評価差などの質的特徴量を追加する。その後、確認実験用閾値と終局近傍除外規則を事前固定する。
