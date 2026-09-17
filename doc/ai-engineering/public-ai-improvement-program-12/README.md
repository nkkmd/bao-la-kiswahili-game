# 公開Bao AI改善Program 12（`PBAI-P12`）

正式作業名: **十分良い手を基準にしたマージン制限型選択探索**  
英語作業名: **Good-Enough / Margin-Bounded Selective Search**  
Candidate: **`PBAI-C016-v1`**  
Baseline: **`AI-GEN4-BASELINE-2026-09-17-v1`**  
開始日: 2026-09-17

## 1. 現在状態

```text
PBAI-P12-A = COMPLETE / AUTHORIZED-FOR-BASELINE-MEASUREMENT
PBAI-P12-B = IN-PROGRESS / BASELINE-INSTRUMENTATION
PBAI-P12-C = NOT-AUTHORIZED / CANDIDATE-MECHANISM-FREEZE
PBAI-P12-D = NOT-AUTHORIZED / CANDIDATE-DEVELOPMENT
PBAI-P12-E = NOT-AUTHORIZED / INDEPENDENT-VALIDATION
PBAI-P12-F = NOT-AUTHORIZED / RELEASE-HOLDOUT
public lineage = AI-GEN4
public change = NONE
```

開始認可の正本は[`AUTHORIZATION_REVIEW.md`](AUTHORIZATION_REVIEW.md)である。

## 2. 目的

現行`AI-GEN4`は反復深化、alpha-beta、PVS、TT、killer move、quiescence search、論理ゲート型評価器などを使用する。今回のProgramでは、PVSを使っていても残る候補比較・full-window再探索の費用を測り、**最善候補間の不要な精密比較を抑えて重要枝へ計算資源を再配分する余地が本当に存在するか**を最初に確認する。

狙いは「弱い手で妥協する」ことではない。同じ思考時間の中で、着手品質に寄与しない比較精度のための計算を減らし、より深い探索または重要応手へ資源を回せるかを検証する。

## 3. 今回の段階構成

### `PBAI-P12-A` — 開始認可

完了。`PBAI-P12`と`PBAI-C016-v1`を発行し、baseline support計測までを認可した。

### `PBAI-P12-B` — baseline support計測

候補実装より先に、現行PVSのscout / full-window再探索費用を計測する。診断instrumentationはfeature flagで隔離し、診断ON/OFFで探索結果が一致することを必須とする。

### `PBAI-P12-C` — candidate mechanismのprospective freeze

`PBAI-P12-B`がPASSした場合だけ進む。baseline-only結果から、固定margin候補、安全条件、TTへの保存規則、再探索規則、development gateを定め、candidate結果を見る前に固定する。

### `PBAI-P12-D` — candidate development

未認可。`121210001..121210032`だけを使用する。

### `PBAI-P12-E` — independent validation

未認可。`121220001..121220064`を使用し、development結果を見た後に条件を変更しない。

### `PBAI-P12-F` — protected release holdout

未認可。`121230001..121230064`は最終採用判断まで温存する。

## 4. 重要な境界

- 現在の公開AIは`AI-GEN4`のままである。
- `PBAI-C016-v1`はcandidate IDであり、`AI-GEN5`ではない。
- baseline support計測のPASSだけではcandidate採用を意味しない。
- baseline support用データは最終validationへ再利用しない。
- fixed marginの数値はbaseline support結果を見る前には決めないが、candidate実装結果を見る前には固定する。
- 戦術回帰、安全条件、TTのbound semanticsを破壊する変更は認めない。
- node削減だけを成功条件にしない。
- `main`統合、公開配信、AI世代昇格は別判断とする。

## 5. 読む順序

1. [`AUTHORIZATION_REVIEW.md`](AUTHORIZATION_REVIEW.md) — 開始認可、baseline、seed block、support gate
2. [`../NEXT_IMPROVEMENT_CANDIDATE.md`](../NEXT_IMPROVEMENT_CANDIDATE.md) — 候補概念
3. [`../NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md`](../NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md) — 事前調査と実装前の注意点
4. [`../../AI_ENGINEERING_INDEX.md`](../../AI_ENGINEERING_INDEX.md) — AI Engineering全体の履歴
5. [`../ai-gen4-release/README.md`](../ai-gen4-release/README.md) — 現行公開系統の正式記録

## 6. 次の作業

`PBAI-P12-B`として、診断instrumentation、回帰test、development-only baseline runnerを追加し、support gateを判定する。