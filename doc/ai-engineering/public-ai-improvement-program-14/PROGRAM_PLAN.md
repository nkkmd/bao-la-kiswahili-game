# `PBAI-P14` — Program計画

## 目的と仮説

公開AI改善案A1の対象を、現行hard/expertのrelease探索に限定する。Namua捕獲の `nyumba stop/use` 状態を比べるために作った遷移結果を、その候補の順位付けにも使えば、同じ探索判断を保って一部の重複を省けるという仮説を検証する。

baseline support gateはPASSし、111局面・全64 seedでの対象頻度と計装前後の探索同値性を確認した。この出現数自体は改善効果や一般的な棋力効果の証拠ではない。

## 前提・固定対象

- 比較元: `AI-GEN4-BASELINE-2026-09-28-v1`、main anchor `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`。
- 実際の検索経路: `BaoReleaseAI`、`BaoReleaseConfig`、hard/expertの既定PBAI-C015評価器。
- 公開設定、ルール処理、move ordering、PVS、置換表、静止探索、Worker寿命は変更しない。
- 最初の対象はA1のみ。A2、F1、D1等を一緒に実装・評価しない。
- `PBAI-C017-v1` の実装範囲とdevelopment gateは[`CANDIDATE_SPEC.md`](CANDIDATE_SPEC.md)でfreeze済み。

## 段階とexit criteria

| 段階 | 作業 | 結果・次へ進む条件 |
| --- | --- | --- |
| A | 最新main・過去のProgram境界・実release sourceを照合 | 完了 |
| B | support測定spec、計測器、tests、Actions matrix jobsを固定 | PASS |
| C | support結果の独立集計とsource/hash監査 | 完了・canonical archive |
| D | A1 candidate mechanism、ID、dev/validation分割、gateを結果前に固定 | 完了、`PBAI-C017-v1` |
| E | candidate developmentと意味同値性・費用測定 | PASS、104 paired samples |
| F1 | 性能計測runner初回試行 | technical invalid。完了rowがなくseed blockは再利用禁止 |
| F2 | fresh uninstrumented wall-clock validation | 技術・標本・同値性PASS。事前の3.0%点推定gateは2.9795%でFAIL |
| G | 強度比較、release holdout、公開準備 | performance gate未達のため未認可・未実行 |
| H | 最終判断と記録 | `COMPLETE / NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4` |

support不足、技術不成立、source mismatch、探索出力差のいずれかが起きた場合は該当段階で停止し、データ条件を後から変更しない。このProgramはF2の固定gateを満たさなかったため終了し、同seedでの救済再試験や強度比較へ進まない。

## 長時間試験の設計方針

固定depthの大規模比較と対局比較はGitHub Actionsを第一候補とする。support、development、PERFORMANCE-002は8 matrix shard、各shard artifact、checkpoint/aggregateを使って実行・保全できた。PERFORMANCE-001のrunner不成立後はそのseed blockを再利用せず、別blockのPERFORMANCE-002ではsample/repeatごとのatomic checkpointを追加した。今回の全試験でActions上限やrunner制約は観察されず、ローカル実行への切替は不要だった。