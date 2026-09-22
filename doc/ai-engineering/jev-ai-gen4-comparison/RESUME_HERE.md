# `JEV-BAO-STRENGTH-20260921-v1` — 終了後の参照位置

## 現在の安全な状態

本Studyは`COMPLETED / CLOSED`であり、実験を再開する作業は残っていない。正式判定は`INCONCLUSIVE`、技術監査は`AUDIT-PASS`、公開AIへの採用は行わない。

## 後続者ができること

- [`FINAL_REPORT.md`](FINAL_REPORT.md)と保存済み`summary.json`の数値を読み取る。
- 最終ZIPのSHA-256、CRC、member一覧をオフラインで確認する。
- 保存済み棋譜、要求、応答、判断データをread-onlyで監査する。
- `node tools/jev-comparison/strength-qa.cjs`で模擬応答の無課金検証を実行する。

## 後続者がしてはいけないこと

- `--live`を付けた呼出しでJev APIに追加送信する。
- 完了済みの同一Study IDに棋譜や局面を追加する。
- 費用台帳をリセットし、未確定予約を削除する。
- 元の棋譜、要求、応答、着手判断を上書きする。
- 本結果をJev組込版の採用承認、同等性の証明、または一般的なJevの性能評価として扱う。

将来の新規試験は、新しいStudy ID、費用認可、固定計画、別の結果保存先を用意し、本Studyのデータをimmutableな比較対象として扱う。
