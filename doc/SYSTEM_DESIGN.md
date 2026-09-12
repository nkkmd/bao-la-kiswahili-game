# Bao la Kiswahili — 現行実装の設計書

更新日: 2026-09-12

確認基準: main `607613ca63dda10c74853db01247866dbb107aa4`

本書は現在の静的ブラウザー実装の構成と責務を説明する。初期草案にあった`src/core/`・`src/ai/`への分割、ES Modules、IndexedDBによる対局保存は現行実装では採用していない。初期の構想・開発フェーズはGit履歴に保持し、ここでは実装済み機能と将来候補を区別する。

## 1. 全体構成

`public/`全体をCloudflare Pagesなどの静的ホスティングから配信する。ビルドやゲーム用サーバーは不要で、ローカル2人対戦とコンピューター対戦の処理はブラウザー内で完結する。

HTML・CSSと通常のJavaScriptスクリプトを読み込み、盤面はCanvasで描画する。AIはWeb Workerで探索し、Service Workerは公開資産をキャッシュする。設定と利用者が記録した診断にはlocalStorageを使う。ルールエンジンなどはNode.jsからの読み込みにも対応し、テスト・ベンチマークで共用する。

## 2. ファイルと責務

| ファイル・ディレクトリ | 責務 |
| --- | --- |
| `public/index.html`・`style.css` | 対局設定、ゲーム画面、診断、ルール説明への入口 |
| `public/main.js` | 対局進行、Canvas描画、入力、アニメーション、AI要求、診断操作 |
| `public/locale.js` | 日本語・英語の表示選択と翻訳処理 |
| `public/engine.js` | 初期局面、合法手、着手適用、勝敗判定、探索用軽量局面遷移 |
| `public/ai.js`・`ai-weights.js` | AI-GEN3基準の探索・評価と重み。継承元・切戻し先 |
| `public/ai-config.js` | 端末性能別の基準探索設定と軽量局面遷移の有効化 |
| `public/logic-evaluator.js` | 学習済みモデルを含む論理ゲート型評価器 |
| `public/ai-candidate.js` | 論理ゲート型評価器を接続した探索本体 |
| `public/ai-release.js` | 公開候補の適用条件、世代・採用判断ID、基準AIへの復帰 |
| `public/ai-release-worker.js` | 公開画面からの探索要求を処理するWorker |
| `public/ai-worker.js` | 継承元AI-GEN3のWorker。回帰確認などで保持 |
| `public/diagnostics.js` | 診断snapshotの許可項目、復元、端末内の記録 |
| `public/review-suggestion.js`・`diagnostic-download.js` | 診断の保存推奨とJSONファイル保存 |
| `public/rules.html`・`rules.css`・`rules.js` | 日本語・英語の図解ルール説明 |
| `public/assets/rules/` | 10点のSVG図版と出典・ライセンス記録 |
| `public/service-worker.js`・`manifest.webmanifest`・`icon.svg` | オフライン用キャッシュとPWA情報 |
| `public/privacy.html`・`robots.txt`・`sitemap.xml` | プライバシー説明と検索エンジン向け情報 |
| `tools/`・`test/` | 開発・研究ツールと回帰テスト |
| `artifacts/`・`doc/` | 保存済み証拠、研究結果、設計・採用・配信の記録 |

## 3. ルールエンジンと局面

人間とAIの着手は、どちらも`public/engine.js`の合法手生成・着手適用を通す。人が読むルールの出典は[`bao-la-kiswahili-ja`](https://github.com/nkkmd/bao-la-kiswahili-ja)、採用版・固定commit・実装差分の正本は[RULES_BASELINE.md](RULES_BASELINE.md)である。

実装基準は`v0.1.0-draft`の`R-002`。namua、mtaji、捕獲義務、連続種まき、nyumba、勝敗判定を実装する。完全な出典局面による検証が未整備の`takasia`は適用せず、連続種まきには安全上の上限を設ける。

| 局面の項目 | 意味 |
| --- | --- |
| `pits` | 2人×前後2列×8穴の石数 |
| `reserve` | 各プレイヤーの持ち石 |
| `houseOwned` | 各プレイヤーのnyumbaの権利状態 |
| `player`・`phase` | 手番とnamua／mtaji |
| `winner`・`reason` | 勝者と終了理由。未終局の`winner`は`null` |
| `turn`・`pending` | 手数と持ち越す石の状態 |

`legalMoves(state)`は合法手を生成する。`applyMove(source, move)`は元局面のコピーを使い、新しい`state`と演出に使う`events`を返す。公開画面はそのイベントを順に描画する。探索用の`applyMoveForSearch`は表示用スナップショットを省き、探索に必要な結果を保つ。通常の画面着手は詳細イベントを生成する経路を使う。

## 4. 公開AIの構成

現在の公開世代は`AI-GEN4`、正式release IDは`AI-GEN4-RELEASE-001`。hard・expertの既定`bao`／`phase2`構成に論理ゲート型評価器`PBAI-C015-v1`を適用し、AI-GEN3の探索・ルール・軽量局面遷移を継承する。easy・normalの選択方式は従来構成を維持する。

| 難易度 | 選択方式 | 低／標準／高の時間予算・最大深度 |
| --- | --- | --- |
| やさしい（easy） | 合法手からランダム選択 | hard・expert用の時間予算は適用しない |
| ふつう（normal） | 1手評価の上位候補からランダム選択 | hard・expert用の時間予算は適用しない |
| むずかしい（hard） | 論理ゲート評価を使う反復深化・Alpha-Beta系探索 | 400ms・6／500ms・8／600ms・10 |
| ビングワ（expert、英語画面はBingwa） | hardと同系統の探索をより大きい予算で実行 | 1500ms・10／2000ms・12／3000ms・14 |

端末区分は`hardwareConcurrency`と`deviceMemory`から決める。公開呼出元は`BaoReleaseConfig.searchOptions`を使い、基準設定へ論理ゲート評価器の有効化を加える。局面に応じた適応的時間配分は別APIとして存在するが、現行の既定設定には使わない。予算は探索の制限値であり、Worker起動や描画まで含む応答時間の保証ではない。

別profile、独自重み、補正を明示した要求は論理ゲート型評価器の対象外。候補やモデルが取得できない場合はAI-GEN3基準へ戻る。hard・expertの切戻しはそれぞれ独立した有効化設定で行う。採用判断ID・AI世代release ID・アプリのバージョンタグは別に管理する。

`public/ai-config.js`などのAI-GEN3識別子は、継承元として固定した正式資産の一部である。公開世代は`public/ai-release.js`で管理する。正式採用の根拠、配信証拠、切戻し手順は[AI-GEN4の正式記録](ai-engineering/ai-gen4-release/README.md)を参照する。

## 5. AI要求と画面の応答

`main.js`は要求ID、局面のコピー、難易度、探索設定、局面識別子を`ai-release-worker.js`へ送る。各要求でWorkerを起動し、応答後に終了する。受け取ったIDと局面識別子を確認し、古い局面への応答を破棄する。採用する着手はルールエンジンで再検証する。

新規対局などで探索を取り消すときは要求世代を更新してWorkerを終了する。Workerが使えない場合や失敗した場合は、同じ公開アダプターをメインスレッドから直接呼ぶ。直接同期探索の間は入力応答が遅れる既存制約がある。

盤面描画と石移動はCanvasと`requestAnimationFrame`を使う。効果音はWeb Audioで生成し、音声ファイルの取得を必要としない。

## 6. 保存と診断

対局中の局面はメモリ上に保持する。現在の実装には、IndexedDBによる途中対局・完全棋譜の自動保存や、画面からの棋譜読み込み・対局復元はない。

localStorageには難易度、対戦モード、手番側、音などの設定と、利用者が明示的に記録したAI診断を保存する。診断記録は最大50件で、外部へ自動送信しない。現在局面または記録一覧をJSONファイルとして保存できるが、完全な対局履歴の保存機能とは区別する。

診断には局面・選択した着手と許可された探索統計を記録し、`evaluationCandidate`・`evaluationFallback`で論理ゲート評価器と基準構成を識別する。機械的な保存推奨を悪手判定と読み替えない。詳しい操作とレビュー境界は[局面監査・対人レビュー手順](AI_HUMAN_REVIEW_GUIDE.md)を参照する。

## 7. オフライン・配信・ルール説明

Service Workerのインストール時に、ゲーム画面・依存スクリプト・スタイル・PWA情報・プライバシー説明・図解ルールと図版をまとめてキャッシュする。キャッシュが正常に完了した後は通信なしで利用できる。現行mainのキャッシュ名は`bao-la-kiswahili-v40`であり、AI-GEN4昇格時のv37とは区別する。

Cloudflare Pagesでは`./rules`・`./privacy`のclean URLを使う。既知のHTMLページだけURLの別名・言語クエリーを共通キャッシュへ対応させる。図解ルールは日本語・英語の切替、言語指定URLの共有、図版の拡大に対応する。

配信対象は`public/`全体。古いrelease manifestはその時点の配信証拠として保持し、現在の配信ファイル一覧として流用しない。ローカルHTTPサーバー、clean URLの条件、ライセンスは[ルートREADME](../README.md)を参照する。

## 8. 検証と将来の変更

現在の公開経路の回帰は[公開AI組込みCI](../.github/workflows/pbai-c015-integration.yml)で管理する。AI-GEN3の固定資産検証、候補適用条件、既知局面、Worker・直接実行、候補取得失敗などを確認する。公開AIの棋力は各プログラムの固定条件による証拠で判断し、画面の動作確認と区別する。

`tools/benchmark.js`は基準AIを直接読み込むため、その結果をAI-GEN4の公開アダプターを通した試験とみなさない。過去の研究・検証テストには凍結commitを要求するものがあり、現行ツリーでの一括再実行を合格条件にはしない。

棋譜保存・読み込み、局面編集、ヒントなどは将来候補であり、実装済み機能として案内しない。新しい公開AI改善は[AI開発の中央索引](AI_ENGINEERING_INDEX.md)、科学研究は[研究成果の中央索引](RESEARCH_INDEX.md)から別々の計画・判断として管理する。
