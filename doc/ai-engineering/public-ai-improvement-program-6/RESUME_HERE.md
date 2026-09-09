# PBAI-P6 — 再開手順

## 現在の結論

PBAI-P6は`COMPLETE / DEVELOPMENT-GATE-FAIL / HOLD`。論理ゲート型の主候補が速度条件を満たさず、開発段階で終了した。次の測定工程はない。開始markerを削除し、同じrunを再開・再測定してはいけない。

作業ブランチは`engineering/pbai-p6-logic-gate-evaluator`、[PR #122](https://github.com/nkkmd/bao-la-kiswahili-game/pull/122)。実行ソースはcommit `a47d6391a40005e034a6193be1fbb7a2a57518db`に固定されている。

## 読む順序

1. [現在の状態](CURRENT_STATUS.md)
2. [最終報告](PROGRAM_FINAL_REPORT.md)
3. [判断台帳](DECISION_REGISTER.md)
4. [再現性と検算](REPRODUCIBILITY_INDEX.md)
5. [固定した契約](PROTOCOL.md)と[SPEC.json](SPEC.json)

## 証拠の確認

`artifacts/pbai-p6/final-result.json`と`independent-audit.json`を確認する。完全な証拠は`final-evidence.tar.gz`にあり、`final-evidence-index.json`で全22ファイルのSHA-256を照合できる。展開するときは既存のrunディレクトリを上書きせず、別の検算用ディレクトリへ展開する。

開始markerは再実行防止のためGitにも保持した。記録されたPIDは過去の実行環境の識別情報であり、新しい環境で同じPIDのプロセスが存在しても、この実験が実行中だと判断しない。

学習・開発用の消費済みseed一覧はarchiveの`seed-access.jsonl`を正本とする。validation、対局、holdoutの予約blockは未使用だが、終了したP6の後続工程として無条件に開かない。

## 次に行える作業

現在は保存済みの差分・報告書のレビューが可能。新しい候補を検証する場合は、P6の結果を知った計画であることを記録し、新しいID・契約・評価集団を用意する。P6の既知モデルやデータを再び未知の検証用として扱わない。

main統合・公開AI切替は別の明示的な指示があるまで行わない。
