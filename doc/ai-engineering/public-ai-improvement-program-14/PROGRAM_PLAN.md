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

| 段階 | 作業 | 次へ進む条件 |
| --- | --- | --- |
| A | 最新main・過去のProgram境界・実release sourceを照合 | 完了 |
| B | support測定spec、計測器、tests、Actions matrix jobsを固定 | PASS |
| C | support結果の独立集計とsource/hash監査 | 完了、canonical recordをarchive |
| D | A1 candidate mechanism、ID、dev/validation分割、gateを結果前に固定 | 完了、`PBAI-C017-v1` |
| E | candidate developmentと意味同値性・費用測定 | CANDIDATE DEVELOPMENT PASS |
| F | fresh independent validationと先後交換対局 | 別途固定するvalidation contractの全gateを満たす |
| G | release準備とproduct decision | 明示判断と実機・互換性確認。自動昇格なし |

support不足、技術不成立、source mismatch、探索出力差のいずれかが起きたら該当段階で停止し、データ条件を後から変更しない。

## 長時間試験の設計方針

固定depthの大規模比較と対局比較はGitHub Actionsを第一候補とする。今回のsupport runでは8 matrix shard、各shard個別artifact、全shard成功後だけaggregateを使って中断に耐えた。以後も事前固定seed/opening blockでshardを分け、`fail-fast: false`、job timeout、`always()` artifact uploadを使う。未完了shardを敗局・引分け・不合格にせず、消費済みseedで補完しない。各artifactはbranch/source SHA、seed、shard、baseline hashes、完了数、statusを保存する。Actions上限・runnerの再現性が実測上不適切なら、その根拠、環境固定、チェックポイント/再開、hash検証を記録してからローカル等へ切り替える。
