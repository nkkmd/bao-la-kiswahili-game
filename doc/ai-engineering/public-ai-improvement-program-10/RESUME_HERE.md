# PBAI-P10：現在状態と再開手順

## 現在の状態

準備中。既知局面72要求とhard・easy・normalの不変確認、モデル未取得時の復帰、対象外profileを確認した。正式対局seedはまだ消費していない。公開ファイルへの変更はない。

## 再開時に確認するもの

1. このブランチの最新HEAD、[固定計画](PROTOCOL.md)、[SPEC](SPEC.json)を読む。
2. `artifacts/pbai-p10/run/RUN_STARTED.json`と`FINAL_RESULT.json`、実行ログを確認する。開始markerがある場合は新しい正式実行を開始しない。
3. 実行中なら既存プロセスと最後の完了ペアを確認する。停止済みなら、未完了試験を同じseedで再開せず技術的無効として記録する。
4. 完了後は全棋譜再生、Python集計、hash確認、アーカイブ保存、日本語結果報告を行う。main統合はユーザー指示待ち。

## 実行するコマンド

固定ソースをコミット・pushし、準備記録とSOURCE_LOCKを確定してから一度だけ実行する。

```sh
python tools/engineering/supervise-pbai-p10.py
```

監視器の自己試験は対局seedを消費しない。正式試験開始後のソース変更・再起動を避け、結果を理由に条件を修正しない。
