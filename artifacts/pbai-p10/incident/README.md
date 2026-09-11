# PBAI-P10：中断時の保存証拠

`interrupted-raw-evidence.tar.gz`は元のrunの27ファイルをそのまま保全したもの。`RAW_INDEX.json`にhashと最終更新時刻を記録した。監視器の終了結果は存在せず、後から元のrunへ作成していない。

`completed-pair-replay.json`と`log-replay.json`は中断後の診断。時間付き対局の再測定をせず、保存sourceと棋譜の整合を確認した。`ADJUDICATION.json`は固定した中断規則に基づく事後の技術的無効判断で、監視器が出した結果ではない。

[最終報告](../../../doc/ai-engineering/public-ai-improvement-program-10/PROGRAM_FINAL_REPORT.md)に、原因として確認できたこと、未確定事項、診断の限界を示す。部分成績をexpertの採用根拠にしない。
