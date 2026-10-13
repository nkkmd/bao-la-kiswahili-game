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

ゲーム中の「遊び方・採用ルール」から、日英対応の図解ルールページを開けます。棋譜の保存・再生、AIの診断情報の端末内保存にも対応しています。完成したコンピューター対局の棋譜を送る機能は任意で、対局ごとの明示的な同意がある場合だけ利用できます。公開サイト上のデータ取扱いは[プライバシーポリシー](public/privacy.html)を参照してください。PWAとしてオフライン利用にも対応しています。

## ルールの基準

配信済みゲームは、[bao-la-kiswahili-ja](https://github.com/nkkmd/bao-la-kiswahili-ja)のv0.2.0を基準とし、takasiaに対応しています。ルール改訂は `BAO-RULES-V0.2.0-TAKASIA-001`、AI改訂は `AI-GEN4-TAKASIA-001` です。[takasia対応の更新工程](doc/ai-engineering/takasia-update/README.md)でエンジン、公開AI、棋譜・診断・受信、日英表示を同期し、[ソフトウェア総合検証](doc/ai-engineering/takasia-update/INTEGRATION_VALIDATION.md)を通過しました。2026-10-09にmain統合とユーザーによる手動配信を完了し、通常ブラウザーでの更新・対局・AI、新v2棋譜の保存と本番送信・保存、旧v1棋譜の読み込み・再生が正常との報告を受けました。確認範囲は[配信作業ログ](doc/ai-engineering/takasia-update/DEPLOYMENT_LOG.md)に記録しています。旧棋譜は固定したR-002エンジンで扱い、過去の研究結果へ新ルールを遡及適用しません。連続種まきには、終わらない対局を防ぐ安全上の上限があります。

ゲームv0.6.0の本番更新と[GitHubリリース公開](https://github.com/nkkmd/bao-la-kiswahili-game/releases/tag/v0.6.0)を2026-10-09に完了しました。本番更新はユーザー報告、Pre-release公開と配信zip収録元コミットへのタグの一致はGitHubで確認済みです。[更新対象と公開記録](doc/ai-engineering/takasia-update/RELEASE_PREPARATION.md)を参照してください。

- [takasia対応版の手動配信手順](doc/ai-engineering/takasia-update/DEPLOYMENT.md)
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
| 世代横断の今後の研究候補と、完了研究から引き継ぐ境界 | [研究アジェンダ](doc/FUTURE_RESEARCH_AGENDA.md) |
| 現在の中心課題である第五世代の計画と供給診断の状態 | [第五世代研究](doc/research-generation-5/README.md) |

第五世代は測定・独立遷移・完全解析の基盤を整備し、[G5-03](doc/research-generation-5/g5-03/REPORT.md)・[G5-04](doc/research-generation-5/g5-04/REPORT.md)で計16完全領域を取得しました。同価値内の終局手数差は記述できた一方、勝敗価値差のある手は得ていません。[準備再評価](doc/research-generation-5/readiness-review-20261012/README.md)で旧4 Studyを再検算し、主要な「順位変動と勝敗価値損失」の準備条件は未成立と判断しました。[新しい供給設計](doc/research-generation-5/source-design-20261013/README.md)で相手の捕獲手/takataが分かれる構造層と、全軌跡最後の適格root固定を具体化しました。[G5-05](doc/research-generation-5/g5-05/REPORT.md)は64 sourceから35構造適格代表を得ましたが、固定8候補の完全閉包は0件で、価値差は未確定です。保存・独立検算まで終了しました。[方法再評価](doc/research-generation-5/method-review-20261013/README.md)で科学用遷移と可逆RAW保存が技術合格し、[全閉包BFS統合](doc/research-generation-5/bfs-integration-20261013/REPORT.md)も固定fixtureで独立復元・解が一致しました。[分岐包絡供給案](doc/research-generation-5/branch-envelope-20261013/README.md)を記録し、[source・保存preflight](doc/research-generation-5/branch-envelope-preflight-20261013/REPORT.md)で第一代表・独立再生・停止保存・gzip復元が固定fixtureで合格しました。[一度限り運用preflight](doc/research-generation-5/befcs-operations-20261013/REPORT.md)では全区画取得・読取前記録・mirror・合算RSSが固定fixtureで合格し、[実128 MiB/1 GiB OOM確認](doc/research-generation-5/befcs-operations-20261013/CI_CONFIRMATION.md)も合格しました。[保存済み全workloadの結合](doc/research-generation-5/befcs-workload-20261013/README.md)はローカルで合格し、全pipelineの実cgroup確認と科学用hostへの結合・最終freezeが次工程です。科学Studyは未登録・未実行で、科学seed消費0です。正式比較は未登録・未実行です。[第五世代入口](doc/research-generation-5/README.md)に全工程の結果と境界を示します。科学研究と公開AIの開発・改善は別に管理し、研究結果をそのまま公開AIへの採用や変更へ昇格しません。

先攻・後攻差については、独立した[AI-GEN4追加研究](doc/first-player-gen4/FINAL_REPORT.md)の全17,768局と検証が完了し、mainへ統合済みです。公開expertの静的評価上位3手序盤では先攻有利、全合法手からの一様序盤では未確定でした。Bao一般の先後差は未確定とし、第五世代の個別Studyとは別に管理します。

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

## 2026-10-13 — 分岐包絡供給の運用・保存統合

[運用cgroup確認](doc/research-generation-5/befcs-operations-20261013/CI_CONFIRMATION.md)で実128 MiB/1 GiB OOMとprefix保持を確定した。[保存済み全workload統合](doc/research-generation-5/befcs-workload-20261013/README.md)は128件の技術source再生と8固定閉包の結合であり、科学供給Studyの登録・実行ではない。共有256 MiB容量、停止・mirror・markerを検証し、科学用hostへの結合と最終freeze・別triggerを残す。科学seed消費0、科学leaseなし、正式関係未登録/未実行、main・公開AI未変更を保持する。
