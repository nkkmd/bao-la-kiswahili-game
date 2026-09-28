# `PBAI-P14` — Program計画

## 目的と仮説

公開AI改善案A1の対象を、現行hard/expertのrelease探索に限定する。探索内のmove-variant列挙がNamua捕獲の `nyumba stop/use` 状態を比較するため遷移を適用し、その後の順位付けも候補遷移を適用する箇所について、既に計算した状態とイベント情報を渡せば同じ判断を保って一部の重複を省ける、という仮説を調べる。

baseline support計測は、まずその対象ケースが新しいfixed-depth sample上で十分発生するか、診断コードが結果を変えないかを確認する。対象発生数は改善効果の証明ではない。

## 前提・固定対象

- 比較元: `AI-GEN4-BASELINE-2026-09-28-v1`、main anchor `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b)。
- 実際の検索経路: `BaoReleaseAI`、`BaoReleaseConfig`、hard/expertの既定PBAI-C015評価器。
- 現在の公開設定、ルール処理、move ordering、PVS、置換表、静止探索、Worker寿命はbaseline supportで変更しない。
- 最初の対象はA1のみ。A2、F1、D1等を一緒に実装・評価しない。
- 正式Candidate IDはbaseline support結果を確認してから新規発行する。

## 段階とexit criteria

| 段階 | 作業 | 次へ進む条件 |
| --- | --- | --- |
| A | 最新main・過去のProgram境界・実release sourceを照合 | 完了 |
| B | support測定spec、計測器、tests、Actions matrix jobsを固定 | 条件と実行が記録される |
| C | support結果の独立集計とsource/hash監査 | BASELINE SUPPORT PASSのみ候補契約へ |
| D | A1 candidate mechanism、ID、dev/validation分割、gateを結果前に固定 | Candidate contractの全項目をfreeze |
| E | candidate developmentと意味同値性・費用測定 | 事前gateをPASS |
| F | fresh independent validationと先後交換対局 | 主endpoint、非劣性/改善基準、採用可能性を満たす |
| G | release準備とproduct decision | 明示判断と実機・互換性確認。自動昇格なし |

段階B〜Cでsupportが不足、技術不成立、source mismatch、探索出力差のいずれかが起きたら直ちに停止する。原因に応じてstatusを区別し、同一データ上で条件を変更しない。

## 長時間試験の設計方針

棋力比較や大量のfixed-depth測定が必要になった段階では、GitHub Actionsを第一候補とする。単一の長いjobに全対局を詰めず、事前固定したseed / opening blockで複数shardに分ける。各shardは独立artifactを途中結果として保存し、aggregate jobは全必要shardが完了したときだけformal判定を出す。matrixは `fail-fast: false`、各jobには時間上限を設定する。再実行は未完了/技術失敗shardに限定し、消費済みseedの再利用や結果確認後の標本追加をしない。

各Actions artifactにはbranch/source SHA、seed、shard、baseline file hashes、完了局数/局面数、statusを保存する。Action runが中断・失敗した場合は部分成果を保持し、未完了を敗局・引分け・不合格へ変換しない。Actions上限またはrunnerの再現性が不適切と分かった場合のみ、ローカル実行を候補にし、実行前に採用理由・環境固定・チェックポイント/再開・hash検証を明記する。
