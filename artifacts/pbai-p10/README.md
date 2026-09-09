# PBAI-P10：保存証拠

`known-preparation.json`は既知局面の動作確認で、棋力成績ではない。`browser-*.json`は最初の自動ブラウザ確認であり、そのファイル内のコミット時点の証拠である。表示識別子を修正した後の最終確認は`browser-final-*.json`として別途保存する。

正式実行の生記録は`run/`へ一度だけ書き込み、終了時に監視器が`final-evidence.tar.gz`とSHA-256索引を作成する。実行前・実行中を完了済みと扱わない。過去P6〜P9の正式結果は変更しない。

[固定計画](../../doc/ai-engineering/public-ai-improvement-program-10/PROTOCOL.md)と[再開手順](../../doc/ai-engineering/public-ai-improvement-program-10/RESUME_HERE.md)を参照する。時間付き対局の再実行ではなく、保存状態の確認から再開する。
