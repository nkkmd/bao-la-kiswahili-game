# `PBAI-P15` — Worker再利用のbaseline support

正式作業名: **探索データを持ち越さないWorker再利用 — F1成立性確認**  
開始日: 2026-09-28  
状態: **`HOLD / KEEP-AI-GEN4`（baseline support未達・終了）**  
比較対象: `AI-GEN4 / AI-GEN4-RELEASE-001`  
baseline commit: `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`  
Candidate ID: **未発行（candidate実装なし）**

## 目的

現在の公開経路はAI要求ごとに`ai-release-worker.js`を起動し、応答後にWorkerを終了する。Worker自体だけを次の手番でも使い続ければ、script importと起動の費用を一部省ける可能性がある。

preflight run `36420017985`でChromiumのWorker isolate heap計測・合法応答・取消後の再起動を確認した。正式support run `36420438844`は64 seedを処理したが、7 seedで指定plyの局面が欠け、各難易度の有効ペアは最低192件に対して171件だった。16件の長時間sessionも6件のみ64要求まで到達した。事前gate未達のためCandidate IDを発行せず終了した。

本Programの最初のsupport試験では、変更していない現行Workerを同一セッションで複数回使う測定用経路と、現行UIと同じ要求ごとのWorker起動を比較する。これはcandidate実装・棋力試験ではなく、導入前の起動費用・待ち時間・memory計測可能性・取消動作の確認である。

Workerプロセスだけを維持し、探索呼出しごとの置換表、評価cache、解析結果、候補move等を次の要求へ持ち越さない。Candidate IDの発行、development、独立validation、release holdoutは実施しない。

## 正本

- [Program計画](PROGRAM_PLAN.md)
- [baseline support計測契約](WORKER_SUPPORT_SPEC.md)（冒頭の状態は契約改訂時点の履歴。終了時点の判定は現在状態と最終報告を参照）
- [現在状態](CURRENT_STATUS.md)
- [判断記録](DECISION_REGISTER.md)
- [正式結果](../../../artifacts/pbai-p15/WORKER_SUPPORT_RESULT.md)と[canonical JSON](../../../artifacts/pbai-p15/worker-support.json)
- [最終報告](PROGRAM_FINAL_REPORT.md)
- [AI-GEN4以降の候補案・F1](../AI_GEN4_FUTURE_IMPROVEMENT_OPTIONS_20260923.md)

PBAI-P14/A1は`NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4`で終了した独立Programであり、そのcandidate、seed、結果をP15の根拠に流用しない。P14の結果は[P14最終報告](../public-ai-improvement-program-14/PROGRAM_FINAL_REPORT.md)を参照する。

## 公開AIの境界

baseline supportでは`public/`とrelease sourceを変更しない。測定器・workflowは隔離ブランチに保持する。公開default、release manifest、Worker寿命の本番挙動は変更しない。終了文書と証拠のmain統合は候補の採用を意味しない。
