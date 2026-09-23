# Bao la Kiswahili

Bao la Kiswahili は、ローカル 2 人対戦とコンピューター対戦ができる Bao のブラウザーゲームです。ゲーム本体は public/ の静的ファイルで動作し、ビルドは不要です。

公式公開サイト: [bao-la-kiswahili.cultivationdata.net](https://bao-la-kiswahili.cultivationdata.net/)

## ゲームの概要

コンピューターの難易度は4段階です。

| 難易度 | 概要 |
| --- | --- |
| やさしい | 合法手からランダムに選択 |
| ふつう | 1手先を評価し、上位の手から選択 |
| むずかしい | ミニマックス法とアルファベータ枝刈りで探索 |
| ビングワ | 端末性能に合わせて、より長く探索 |

対局ではnamua、mtaji、連続種まき、nyumba、捕獲、勝敗判定などを扱います。コンピューターの着手も、人間の着手と同じルールエンジンで生成・検証します。AI探索はWeb Worker上で動き、画面の応答性を保ちます。

ゲーム中の「遊び方・採用ルール」から、日英対応の図解ルールページを開けます。棋譜の保存・再生、AIの診断情報の端末内保存にも対応しています。完成したコンピューター対局の棋譜を送る機能は任意で、対局ごとの明示的な同意がある場合だけ利用できます。

## ルールの基準

実装の基準は、[bao-la-kiswahili-ja](https://github.com/nkkmd/bao-la-kiswahili-ja)の公開ドラフト v0.1.0-draft にあるルール基準 R-002 です。検証に使える完全な出典局面を確認できていないため、takasiaは適用していません。連続種まきには、終わらない対局を防ぐ安全上の上限があります。

- [図解ルール（日本語 / English）](public/rules.html)
- [実装ルールの基準、差異、更新手順](doc/RULES_BASELINE.md)

## ローカルで遊ぶ

静的HTTPサーバーで public/ を配信します。

    cd public
    python3 -m http.server 8000

ブラウザーで [http://localhost:8000/](http://localhost:8000/) を開いてください。Service Workerを含むオフライン機能の確認にはHTTP(S)が必要です。棋譜提供機能は、Turnstileと収集APIへのオンライン接続も必要です。

## 開発・テスト

基本のエンジンテストは、リポジトリのルートで実行できます。

    node test/engine.test.js

公開AI、図解ルール、棋譜機能などの回帰テストは、それぞれのCIワークフローで管理しています。

- [公開AIの組込み確認](.github/workflows/pbai-c015-integration.yml)
- [図解ルールのブラウザー回帰](.github/workflows/illustrated-rules.yml)
- [棋譜の保存・再生・任意提供の検証](.github/workflows/game-record-verification.yml)

ベンチマークやAI診断の実行方法は[AIベンチマークの手順](doc/AI_BENCHMARK.md)、局面を人手で確認する方法は[AIレビューガイド](doc/AI_HUMAN_REVIEW_GUIDE.md)を参照してください。過去の研究・検証用テストを含むため、全テストの一括実行を現在の公開AIの合格条件とはしていません。

## デプロイ

ゲーム本体は public/ 全体を静的ホスティングへ配置します。任意棋譜提供のWorkerはゲーム本体とは別に cloudflare/game-record-ingest/ からデプロイします。認証情報はCloudflare側のsecretとして管理し、リポジトリへ登録しません。

- [棋譜提供の設計・プライバシー・運用条件](doc/GAME_RECORD_CONTRIBUTION.md)
- [Workerの運用手順](doc/GAME_RECORD_CONTRIBUTION_OPERATIONS.md)

## 公開AIと研究

現在の公開AI系統は **AI-GEN4**（正式release: AI-GEN4-RELEASE-001）です。hardとexpertでは学習済み論理ゲート型評価器を探索に組み込み、easyとnormalは従来の構成を維持しています。正式判断、検証の範囲、改善履歴は中央索引を参照してください。

| 知りたいこと | 入口 |
| --- | --- |
| 公開AIの現在状態、採用根拠、改善履歴 | [AI開発の中央索引](doc/AI_ENGINEERING_INDEX.md) |
| AI-GEN4以降の改善案 | [今後の改善候補](doc/ai-engineering/AI_GEN4_FUTURE_IMPROVEMENT_OPTIONS_20260923.md) |
| 研究世代ごとの結果と現在状態 | [研究成果の中央索引](doc/RESEARCH_INDEX.md) |
| 今後の研究課題 | [研究アジェンダ](doc/FUTURE_RESEARCH_AGENDA.md) |

科学研究と公開AIの開発・改善は別の記録として管理しています。研究上の結果が、そのまま公開AIへの採用や変更を意味するものではありません。

## 文書案内

| 目的 | 文書 |
| --- | --- |
| 初心者向けの基本戦略 | [初心者向け戦略ガイド](doc/BEGINNER_STRATEGY_GUIDE.md) |
| 棋譜形式、保存・再生の仕様 | [棋譜の仕様](doc/GAME_RECORD.md) |
| システム構成 | [システム設計](doc/SYSTEM_DESIGN.md) |
| ルール出典と実装差分 | [ルール基準](doc/RULES_BASELINE.md) |

主なディレクトリは、public/（ゲーム本体）、cloudflare/（任意棋譜提供Worker）、test/（テスト）、tools/（開発・検証ツール）、artifacts/（保存済み成果物）、doc/（設計・研究・運用文書）です。

## ライセンス

プログラムコードはMIT Licenseです。詳細は[LICENSE](LICENSE)を参照してください。

[public/rules.html](public/rules.html)の説明本文と[public/assets/rules/](public/assets/rules/)のSVG図版はCC BY-SA 4.0で提供しています。出典、変更内容、適用範囲は[public/assets/rules/README.md](public/assets/rules/README.md)に記載しています。
