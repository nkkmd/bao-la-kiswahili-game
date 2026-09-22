# `JEV-BAO-STRENGTH-20260921-v1` — 終了監査記録

監査日: 2026年9月22日

## 結果と記録の照合

- 最終記録の対象Study ID、基準commit、仕様hashは最終ZIPの`summary.json`と`plan.json`に一致した。
- 完了数64、Jev組込版32勝、AI-GEN4単独32勝、1勝1敗32ペア、`INCONCLUSIVE`、p値1.0、`q = null`、95%信頼区間`null`を照合した。
- 棋譜から正式着手1,362、両方式各681手、全32ペアで同じ盤面側が勝ったことを再集計した。
- 正式対局の保存応答から591試行、正常579、検証不合格12を再集計した。予備を含む新規棋力試験全体は627回であることも確認した。
- 費用台帳と最終集計の733リクエスト、報告済み`$0.056991774`、未確定予約`$0.016515072`、累計`$0.073506846`を照合した。
- `.git`内の作業台帳と最終ZIP内の台帳は、SHA-256 `1a04d5cb0f9e9e48d184513003fc6280a3ec76f868906b50c5921941c2e84f7e`でバイト一致した。

## 容量と秘密情報の監査

最終ZIPは3,094ファイルで、非圧縮23,539,219 bytes、圧縮後4,740,192 bytesだった。展開済みの最終結果は約30 MiBである。大量の小ファイルをGit履歴に追加せず、外部ZIPとSHA-256で保存する方法を選んだ。

全16 ZIPを展開し、次の既知形式をファイル名と内容の両方で確認した。

- `.env`、credential、secret、private key、API keyを示すファイル名
- OpenAI/GitHub/Google/AWSの主要なキー形式
- private key header
- Bearer認証情報に見える長いliteral
- API key、password、client secret、Authorizationヘッダへの長い値の代入

認証情報の形式に合致する値は0件だった。`authorization`として検出された短い値は、`user-cli-run-live`等の操作確認tokenであり、認証情報ではない。コードは`TYPESAFE_API_KEY`を環境変数から読むが、その値は配布ZIP、結果ZIP、リポジトリのいずれにも保存されていない。

## 固定コードと計画の監査

- `bao-jev-strength-test-plan-v1.zip`の10 memberは`tools/jev-comparison/strength-v1-design/`とバイト一致した。
- `bao-jev-strength-v1.zip`の19 memberは作業ツリーの同名ファイルとバイト一致した。
- 固定manifestの対象ファイルを終了整備のために書き換えていない。
- 追加した`tools/jev-comparison/ARCHIVE_STATUS.md`はmanifest対象外であり、固定実装のバイト列を変更しない。

## 実行した検証

- `node tools/jev-comparison/selftest.cjs`: 43項目がPASS、実API呼出し0回。
- `node tools/jev-comparison/strength-qa.cjs`: 14項目がPASS、実API呼出し0回。子プロセス内でも実ネットワークを禁止した。
- 保存済み台帳と生データに対する`strength-v1.cjs`のread-only audit: 68局、1,449手、733リクエストを再検証してPASS、実API呼出し0回。
- `tools/jev-comparison/`内の全`.cjs`に対する`node --check`: PASS。
- 8件のmanifestに対するraw-byte SHA-256照合: 不一致0件。
- 新規・更新した12文書の相対リンク検査: 壊れたリンク0件。
- manifestでhash固定された`tools/jev-comparison/STRENGTH_V1.md`の1行と`tools/jev-comparison/strength-v1-design/README.md`の2行は、配布原文のMarkdown hard breakを保持するため行末に空白2文字を含む。この3行を明示的に除外した`git diff --check`はPASS。その他のwhitespace errorは0件。

## 公開AIの非変更確認

終了整備で`public/`を変更していない。公開AIは`AI-GEN4`、正式releaseは`AI-GEN4-RELEASE-001`のままで、Jev組込版は採用・組込み・配信しない。

## 日本語文書品質監査

監査対象は、本ディレクトリの8文書、`tools/jev-comparison/ARCHIVE_STATUS.md`、ルート`README.md`、`doc/AI_ENGINEERING_INDEX.md`、`doc/ai-engineering/ai-gen4-release/README.md`の変更箇所である。

- 英語だけの人間向け見出し: 0件
- 許容例外を除く英語の完全な通常説明文: 0件
- 壊れた相対リンク: 0件
- 意図しないfenced code block変更: 0件
- Study ID、decision token、数値、hash、費用、公開状態の意図しない変更: 0件

固定済みキット内の実行時点文書は、manifestでhash固定された履歴記録として原文を保持する。その現在の役割と有料呼出し禁止は、日本語の`ARCHIVE_STATUS.md`と本終了文書群で説明する。

```text
JAPANESE_DOCUMENTATION_QUALITY_GATE = PASS
```
