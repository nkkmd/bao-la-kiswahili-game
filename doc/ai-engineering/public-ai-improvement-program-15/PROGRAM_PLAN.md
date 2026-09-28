# `PBAI-P15` — Program計画

## 仮説

現行公開経路の`ai-release-worker.js`はAI要求ごとに起動・終了する。探索処理の状態を持ち越さずWorker instanceだけを維持すれば、2手目以降の要求待ち時間の一部を減らせる可能性がある。成立性は初回・後続要求の待ち時間、長い連続要求後のmemory、取消し・古い応答の抑止で確認する。

## 固定境界

- baselineは`main` commit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`。
- 現行公開AIは`AI-GEN4 / AI-GEN4-RELEASE-001`。対象難易度はhard / expert。
- baseline supportでは`public/`、公開設定、release・manifest、main UI経路を変更しない。
- 測定用のwarm-worker経路は同じ`ai-release-worker.js`へ独立した通常search requestを順に送るだけとし、worker globalに前回探索の状態を追加しない。
- cancellationは現行どおりWorker終了解決を基準に検査する。後続候補は取消時にWorkerを破棄でき、再要求でfresh Workerを起動できなければならない。
- PBAI-P14/C017の候補実装、seed、artifact、評価値を使用しない。
- support契約を固定してからseed sampleと時計を使う。未完了shardのseedは補完・再利用しない。

## 工程と停止条件

| 段階 | 作業 | 次へ進む条件 |
| --- | --- | --- |
| A | main baseline、公開Worker lifecycle、既存回帰、candidate連番、過去Program境界を照合 | 完了 |
| B | cold-vs-warm測定・seed/shard・memory/cancellation gateを事前固定 | `WORKER_SUPPORT_SPEC.md`確定 |
| C | Actions preflight（Playwright、COOP/COEP、Worker通信、memory API、checkpoint復旧） | PASS |
| D | fresh baseline support 64 seed / 8 shard | 全技術・sample・coverage・memory可観測性 gate PASS |
| E | 結果を独立集計し、source/seed/hashを監査 | gateに従いCandidate ID発行または`HOLD` |
| F以降 | default-off candidate開発、独立validation | Eが成立し、別契約を結果確認前に固定した場合のみ |

Supportの待ち時間screeningは、各難易度で少なくとも192のpaired positionsがあり、warm-workerのseed-cluster bootstrap 95%区間下限が0を上回り、paired median削減が5%以上の場合に成立する。どちらか一方の難易度だけが成立した場合、次段階はその難易度に限定する。Worker targetへのCDP接続、Worker isolateのheap計測、および長時間sessionでの増加gateも必要条件とする。数値・対象を結果後に変更しない。

## 長時間試験と中断耐性

support runはGitHub Actionsを第一候補とし、Ubuntu 24.04、Node 24、固定Playwright/Chromium、64 fresh seedを8 shardに分ける。各shardは独立seed list、atomic row checkpoint、`fail-fast: false`、30分timeout、`always()` artifact uploadを持つ。aggregateは8 artifactが揃い、hash・重複・coverage検査が通った時だけ作る。途中失敗したseed blockは消費済みとし、完了rowは保存するが、欠損分を同じseedで再実行しない。

Worker CDP計測非対応、cross-origin isolation不成立、Actions quota/runnerの再現性不足、memory計測がWorker isolateを指さない場合はsupportをPASSに読み替えない。その場合はP15を`HOLD / KEEP-AI-GEN4`とし、次の作業で実機または別計測環境が必要なら、その根拠を記録してから実行先を判断する。

## 終了時点の追記（2026-09-28）

[正式結果](../../../artifacts/pbai-p15/WORKER_SUPPORT_RESULT.md)により、CのpreflightはPASS、Dのbaseline supportは標本・長時間session gate未達でHOLDとなった。Eで候補IDを発行しないと判断し、F以降は未実行とした。上記の事前条件を結果後に変更せず、公開AIは`AI-GEN4`を維持する。
