# `PBAI-P15` — 最終報告

正式作業名: **探索データを持ち越さないWorker再利用 — F1成立性確認**  
開始・終了: 2026-09-28  
正式判断: **`HOLD / KEEP-AI-GEN4`**  
Candidate ID: **未発行**  
公開AI: **`AI-GEN4 / AI-GEN4-RELEASE-001`を維持**

## 目的と工程

現行の「AI要求ごとにWorkerを起動・終了」と、公開Workerを同一対局中に維持する測定用経路の成立性を、公開sourceを変えずに調べた。[事前契約](WORKER_SUPPORT_SPEC.md)でseed、局面、待ち時間、Worker heap、取消、停止条件を固定した。これは候補実装や棋力対局ではない。

初回preflightではChromium 151でページ側の`measureUserAgentSpecificMemory()`が使用できず、正式seed計測前にWorker targetのCDP isolate heapへ契約を改訂した。旧API呼出しの残存も修正し、[preflight run `36420017985`](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36420017985)で技術条件をPASSした。その後、固定64 seedを[baseline support run `36420438844`](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36420438844)の8 shardで一度だけ処理した。

## 判定

64 seedを重複なく処理したものの、7 seedでは固定plyに必要な状態が揃わず、hard/expertそれぞれの後続paired positionsは171件で最低192件に届かなかった。16 long-sessionのうち6件だけが64要求まで到達し、全件に必要なheap checkpointも成立しなかった。公開source一致と取消・再起動はPASSした。数値、seed別欠測、memoryの扱い、artifact hashは[結果記録](../../../artifacts/pbai-p15/WORKER_SUPPORT_RESULT.md)と[canonical JSON](../../../artifacts/pbai-p15/worker-support.json)にある。

hardの時間短縮中央値13.3375%（bootstrap 95%区間8.0093〜24.9337%）は171局面・57 seedの観測である。正の観測をゼロ効果と読み替えないが、標本数とmemoryの事前条件を欠くため支持判定にも採用判断にも使わない。expertの観測中央値1.2933%も5.0%条件を満たさない。結果後にseed、ply、閾値、memory条件を変更せず、`BASELINE-SUPPORT-HOLD`と判定した。

## 停止境界と公開状態

Candidate IDは発行せず、default-off candidate開発、独立validation、release holdout、実機採用確認は未実施。隔離ブランチ上の測定器・workflowを公開経路へ入れない。終了文書・証拠だけをmainへ反映しても、F1の採用や公開配信を意味しない。公開AI系統、release、hard/expertの設定は変更しない。

次の試みが必要なら、今回の64 seedを再利用した救済試験ではなく、問題となった到達可能性とlong-session設計を事前に見直す新しいProgram・baseline・fresh evidenceで判断する。
