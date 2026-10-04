# 追加研究の文書・保存監査

監査日: 2026-10-04

研究ID: `FPA-GEN4-STUDY1-20261003-v1`

判定: `JAPANESE_DOCUMENTATION_QUALITY_GATE = PASS`

## 対象

人間向け文書16件を確認しました。研究入口・概要・最終報告・現在状態・計画・認可・再現・研究ログ・引継ぎ・本監査の10件、成果物入口と自動集計表の2件、ツール説明の1件、ルートREADME・研究中央索引・過去先後差研究の今回追記部分3件です。中央文書の既存研究本文や凍結済み歴史記録は今回の編集対象ではありません。

- `doc/first-player-gen4/*.md`: 10件。
- `artifacts/first-player-gen4/README.md`、`artifacts/first-player-gen4/results/REPORT.md`: 2件。
- `tools/research/first-player-gen4/README.md`: 1件。
- `README.md`、`doc/RESEARCH_INDEX.md`、`doc/FIRST_PLAYER_ADVANTAGE_RESEARCH.md`: 今回の研究導線・終了要約3件。

## 日本語品質と意味

対象の説明見出し・本文・正式判断・限界・導線を確認し、許容例外を除く英語だけの人間向け見出し0件、英語の完全な通常説明文0件、壊れた相対リンク0件です。既存ルートの正式ゲーム名`Bao la Kiswahili`と中央索引の`G4-01`等は正式名称・canonical identifierの許容例外です。条件ID、判断トークン、path、command、JSON、hashは機械互換性のため保持し、周囲で日本語の意味を説明しています。

原文を保持する例外は、事前固定の認可・計画、機械集計・検算JSON、workflow生成の`results/REPORT.md`、元ZIPです。生成表のトークンと結果は日本語の最終報告で解説し、科学記録自体を翻訳・修正していません。

入口から最終報告・現在状態・再現・研究ログ・引継ぎ・成果物説明・中央索引まで、全17,768局完了、主要2領域の異なる判断、条件付き自己対局の限界、main統合未実施を一致させました。`INCONCLUSIVE`を均衡証明へ、別言語再集計を独立ルール・区間検証へ読み替えていません。

## 科学的情報と検証

- 凍結source manifestの14ファイルのSHA256が全て一致。公開AI7ファイルと元研究workflowの変更0件。
- 事前の条件・seed・件数・閾値・認可状態・研究ID・判断トークン・機械結果に意図しない変更0件。
- 既存7月研究の本文・結果に変更0件。今回追加研究の追記だけを更新。
- 事前の技術テスト4件はActionsでも合格。科学コードを変更していないため、文書完成を理由に対局生成を再実行しません。
- 科学run `37121863392`の全jobが成功。予備352局・本試験16,384局・感度分析1,024局の完全性、全棋譜再生、seed再生成、Python検算が合格。
- ローカルで取得した119,019,846 bytesのZIPはartifact digestと完全一致。8分割hashと保存済み集計8ファイルのhashを照合。
- 保存専用run `37194651908`は`ARCHIVE-BYTE-EXACT-PASS`。保存commitは`5ecb97856b3c456db33e0d57cb4c0879ac8b38f5`。
- code fenceは全件対応し、既存code blockへの意図しない変更0件。新しい復元コマンドは分割hashとZIP hashを検証してから展開する。

完了証拠保存workflowは後処理として別ファイルへ追加しました。科学対局・元集計・元ルールを変更しません。研究は予定範囲で終了し、main統合は別途の状態として保持します。
