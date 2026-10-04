# 追加研究のmain統合記録

統合日: 2026-10-04（日本時間）

研究ID: `FPA-GEN4-STUDY1-20261003-v1`

状態: **研究・最終監査・main統合が完了。**

## 認可と統合出典

ユーザーの「関連文書の不整合や更新漏れがないか最終チェックを行い、問題がなければ main への統合を完了させてください」に基づき、最終監査とCI確認の後に統合しました。

- 基準main: `096ee1fbc6f562f7a2959e62ea80b628ea78f7c8`。
- 科学ソースcommit: `542439d33b80275550f07a8ed04295e51fd545e1`。
- 最終研究HEAD: `ef26841ba8bba7bf335099db36aae070aa77de30`。
- 統合PR: [#178](https://github.com/nkkmd/bao-la-kiswahili-game/pull/178) / merged。
- merge方式: `merge`。
- 統合commit: `3845b8c6ae1fad964c1df6d38bf6e2dff5d0a2f4`。

研究HEADを指定してmergeし、GitHubの`merged = true`を確認しました。統合後の文書更新は現在状態・索引・統合記録に限定し、元runの出典・科学的な結果は保持します。

## 統合前の確認

関連16文書、結果表、再現手順、元証拠のhash、凍結ソース、既存研究、公開コード差分を確認しました。科学的数値の訂正はありません。再現手順の実行出典比較と、計画で挙げた棋譜進行の記述的補足を追加しました。補足は`DESCRIPTIVE-POSTHOC`として主要推論から分離しています。

最新研究HEADのPRチェックは次の5件が全て成功しました。未解決review threadは0件で、mergeableかつdraftではないことを確認しました。

- SSGTC closure consistency audit: run `37195791178` / `success`。
- DRSSE Study 1 Closure CI: run `37195791155` / `success`。
- AI-GEN4先後差研究の完了証拠保存: run `37195791147` / `success`。
- Second-generation research agenda audit: run `37195791161` / `success`。
- PCEM closure consistency audit: run `37195791150` / `success`。

## 科学結果と保存範囲

全17,768局は決着し、未決着は0局です。正式expertの一様序盤は先攻勝率53.17%・`INCONCLUSIVE`、静的評価上位3手序盤は56.88%・`FIRST-ADVANTAGE-WITHIN-DOMAIN`でした。Bao一般の先後差は未確定のままです。[最終報告](FINAL_REPORT.md)が解釈の基準です。

科学run `37121863392` / attempt 1は全job成功、正式3領域の全棋譜再生・seed再生成・完全性・Python再集計が合格しています。独立ルールエンジンと区間計算の別実装検証はしていません。元artifact `11299644872`の119,019,846 bytes、8分割、集計・検算8ファイルは[保存索引](../../artifacts/first-player-gen4/ARCHIVE_INDEX.json)のhashと一致します。

公開AI・ルール・既定値・事前条件・科学ソース14ファイル・元集計・元ZIP・既存研究結果を変更していません。対局の再実行や追加、第五世代の個別Study開始、本番配信は行っていません。

## 統合後の文書状態

入口・概要・最終報告・現在状態・再現性・研究ログ・引継ぎ・成果物・中央索引を統合済みへ合わせました。本記録を含む17文書の品質確認を[文書監査](DOCUMENT_AUDIT.md)に記録しています。過去の「未統合」という記録は当時の履歴であり、最新状態とは区別します。
