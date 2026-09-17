# Bao la Kiswahili — 現行実装の設計書

更新日: 2026-09-16

確認基準: 2026-09-16時点のリポジトリ実装（対局中ルールガイド、終局後の棋譜保存、AI改善用の任意棋譜提供を含む）

本書は現在のブラウザーゲームと、その周辺の任意提供機能の構成・責務を説明する。初期草案にあった`src/core/`・`src/ai/`への分割、ES Modules、IndexedDBによる対局の自動保存は現行実装では採用していない。一方、終局した1局を利用者が明示的にJSONファイルへ保存する棋譜機能と、完成したコンピュータ対戦を1局ごとの明示同意後にAI改善用へ提供する任意送信機能は実装している。初期の構想・開発フェーズはGit履歴に保持し、ここでは実装済み機能と将来候補を区別する。

## 1. 全体構成

`public/`全体をCloudflare Pagesなどの静的ホスティングから配信する。ビルドやゲーム用サーバーは不要で、ローカル2人対戦とコンピューター対戦の進行・AI探索・ルール判定はブラウザー内で完結する。

HTML・CSSと通常のJavaScriptスクリプトを読み込み、盤面はCanvasで描画する。AIはWeb Workerで探索し、Service Workerは公開資産をキャッシュする。設定と利用者が記録したAI診断にはlocalStorageを使う。対局中の棋譜はメモリ上だけに保持し、終局後に利用者が明示操作した場合だけJSONファイルを生成する。ルールエンジンなどはNode.jsからの読み込みにも対応し、テスト・ベンチマークで共用する。

通常対局は静的サイトだけで成立する。任意棋譜提供を利用する場合だけ、別系統のCloudflare Worker `bao-game-record-ingest`へ`https://bao-data.cultivationdata.net/v1/game-records`から送信する。WorkerはTurnstile、strict validation、engine replay、重複排除、private R2の日次quotaを通した棋譜だけをprivate R2へ保存する。任意提供が停止中でも対局・ローカル棋譜保存・AI診断は影響を受けない。

## 2. ファイルと責務

| ファイル・ディレクトリ | 責務 |
| --- | --- |
| `public/index.html`・`style.css` | 対局設定、ゲーム画面、診断、ルール説明への入口 |
| `public/main.js` | 対局進行、Canvas描画、入力、アニメーション、AI要求、診断操作、対局中ルールガイド |
| `public/game-record.js` | 確定着手の軽量記録、`bao-game-record` v1の検証・再生・終局後JSON保存UI |
| `public/game-record-contribution-config.js` | 任意棋譜提供の有効化、Custom Domain endpoint、公開Turnstile Sitekey、client側サイズ上限 |
| `public/game-record-contribution.js` | 完成したコンピュータ対戦の明示同意、Turnstile、client側検証・送信UI |
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
| `cloudflare/game-record-ingest/` | 任意棋譜提供のCloudflare Worker、Wrangler設定、Turnstile検証、replay、dedupe、rate limit、R2保存 |
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

対局中ルールガイドは、通常の画面着手で既に生成される`events`を読み、捕獲、takata、連続種まき、nyumba、namuaからmtajiへの移行、終局など意味のある状態変化だけをボード下へ日本語・英語で表示する。1個ごとの種まきは従来のCanvas演出に任せ、説明のための探索・合法手再計算・評価処理は追加しない。表示した規則から`rules`ページの対応節へ直接移動できる。直前の重要な説明とリンクは手の終了後も次の着手選択まで残し、通常の手番案内と併記する。

棋譜記録はこの通常着手経路の確定手だけを`public/game-record.js`が受け取り、canonicalな小さい着手情報としてメモリへ追加する。表示用`events`全体やAI探索局面を保持せず、Worker要求にも棋譜を追加しないため、探索ループとは分離する。

## 6. 保存、棋譜、診断、任意提供

対局中の棋譜はメモリ上だけに保持する。終局後、利用者が「棋譜を保存」を押した場合に限り、`bao-game-record` version `1`のJSONファイルを生成する。保存内容は初期局面、対局設定、確定着手列、勝敗、最終局面である。ファイル名の日時は端末のローカル日時を使うが、JSON本文には保存時刻を入れない。

棋譜の確定着手には、人間、AI、自動passを含む通常対局経路の手を記録する。sow/relayの中間イベント、石1個ごとの演出局面、AI探索ノード、探索統計は棋譜へ常時保存しない。JSON文字列化とBlob生成も、終局後の明示的な保存操作まで行わない。

棋譜はlocalStorageやIndexedDBへ自動保存せず、外部へ自動送信しない。ローカル保存操作は端末内のファイル生成だけであり、任意提供の同意を兼ねない。保存済みJSONは「棋譜再生」モードで利用者が明示選択した場合だけブラウザー内で読み込む。再生開始前にformat/version、ルールbaseline、標準初期局面、各着手の手番メタデータと合法性、最終局面・勝敗を検証し、検証済みの各ply局面をメモリ上に保持する。「戻る」は逆演算せず保存済みsnapshotへ移動し、「進む」は通常着手と同じルールエンジン・表示イベントを利用する。再生ファイル自体を外部送信せず、再生モードもlocalStorageへ保存しない。現在も対局途中の棋譜ファイル保存と途中対局の自動復元は行わない。棋譜の形式、計算資源上の境界、再生検証、将来互換性は[棋譜保存機能](GAME_RECORD.md)を参照する。

完成したコンピュータ対戦では、任意提供が有効な配信版に限り「AI改善のため棋譜を送信」を別操作として表示する。利用者がその1局について目的・送信内容を確認し、Turnstile完了後に「同意して送信」を押した場合だけ`bao-game-record` v1を送信する。自動送信、一括同意、バックグラウンド再送、送信用local queueは行わない。ローカル2人対戦は受理しない。

収集Workerはexact Origin allow-listとFetch Metadataを確認し、request/schema、標準初期局面、canonical move、全着手replay、最終局面・結果を検証する。正規化JSONのSHA-256で重複排除し、private R2のglobal daily quotaをhard stopとして受理件数を制御する。Workers Rate Limiting APIはbest-effortのburst緩和としてだけ使う。source IPはrate limit keyとTurnstile Siteverifyに一時利用するが、R2の棋譜body・object key・custom metadataへ保存しない。Turnstile tokenとconsent envelopeも保存しない。raw棋譜は90日lifecycleで削除する。詳細は[任意の棋譜提供機能](GAME_RECORD_CONTRIBUTION.md)を参照する。

localStorageには難易度、対戦モード、手番側、音などの設定と、利用者が明示的に記録したAI診断を保存する。診断記録は最大50件で、外部へ自動送信しない。現在局面または記録一覧をJSONファイルとして保存できる。

AI診断と棋譜は別形式・別目的である。診断には局面・選択したAI着手と許可された探索統計を記録し、`evaluationCandidate`・`evaluationFallback`で論理ゲート評価器と基準構成を識別する。機械的な保存推奨を悪手判定と読み替えない。詳しい操作とレビュー境界は[局面監査・対人レビュー手順](AI_HUMAN_REVIEW_GUIDE.md)を参照する。

## 7. オフライン・配信・ルール説明

Service Workerのインストール時に、ゲーム画面・依存スクリプト・棋譜モジュール・任意提供client・スタイル・PWA情報・プライバシー説明・図解ルールと図版をまとめてキャッシュする。キャッシュが正常に完了した後は通常対局、ローカル棋譜保存、診断などの静的機能を通信なしで利用できる。Turnstileと任意提供APIはオンライン通信を必要とする。棋譜再生モジュール追加後の現行キャッシュ名は`bao-la-kiswahili-v48`である。

Cloudflare Pagesでは`./rules`・`./privacy`のclean URLを使う。既知のHTMLページだけURLの別名・言語クエリーを共通キャッシュへ対応させる。図解ルールは日本語・英語の切替、言語指定URLの共有、図版の拡大に対応する。対局中ルールガイドのリンクは現在の表示言語を引き継ぎ、対応する節を直接開ける。

配信対象は`public/`全体。任意提供のbackendは`cloudflare/game-record-ingest/`を別途Wranglerでdeployし、本番入口は`bao-data.cultivationdata.net`のCustom Domainだけとする。`workers_dev:false`と`preview_urls:false`で`*.workers.dev`・Preview URLを本番入口に使わない。古いrelease manifestはその時点の配信証拠として保持し、現在の配信ファイル一覧として流用しない。ローカルHTTPサーバー、clean URLの条件、ライセンスは[ルートREADME](../README.md)を参照する。

## 8. 検証と将来の変更

現在の公開AI経路の回帰は[公開AI組込みCI](../.github/workflows/pbai-c015-integration.yml)で管理する。AI-GEN3の固定資産検証、候補適用条件、既知局面、Worker・直接実行、候補取得失敗などを確認する。公開AIの棋力は各プログラムの固定条件による証拠で判断し、画面の動作確認と区別する。

図解ルールの日英表示・拡大・対局導線・オフライン更新は[図解ルールCI](../.github/workflows/illustrated-rules.yml)で確認する。`tools/build-rules-figures.js --check`はSVG図版と生成条件の再生成一致も検証する。

棋譜保存・棋譜再生・任意提供は[棋譜専用CI](../.github/workflows/game-record-verification.yml)で、形式、実エンジンでのreplay、確定着手の記録、失敗着手時のrollback、標準初期局面・各plyメタデータ・最終局面の再生検証、戻る/進むUI、終局前後の保存・送信UI、localStorage非使用、Service Workerキャッシュ、Privacy Policy、Custom Domain設定、Worker request/schema/replay/deduplication/R2 quota、Origin・Fetch Metadata境界と隣接回帰を確認する。

ローカル棋譜保存は2026年9月15日にPR #142で`main`へ統合済みである。任意提供は2026年9月16日にテストサイト、スマートフォン実機、Cloudflare Worker/R2/Turnstile、Custom Domain経由のcontrolled submissionを確認し、R2保存・日次quota・privacy境界・duplicate・malformed request・CPU/resource状態を検証した。最終Worker構成では`workers.dev`とPreview URLを無効化し、`bao-data.cultivationdata.net`をWrangler管理下のCustom Domain targetとしてdeployしている。server-side kill switchの既定値は`COLLECTION_ENABLED=false`である。

`tools/benchmark.js`は基準AIを直接読み込むため、その結果をAI-GEN4の公開アダプターを通した試験とみなさない。過去の研究・検証テストには凍結commitを要求するものがあり、現行ツリーでの一括再実行を合格条件にはしない。

対局途中の自動保存・復元、棋譜ファイルの画面読み込み、専用棋譜viewer、局面編集、ヒントなどは将来候補であり、実装済み機能として案内しない。新しい公開AI改善は[AI開発の中央索引](AI_ENGINEERING_INDEX.md)、科学研究は[研究成果の中央索引](RESEARCH_INDEX.md)から別々の計画・判断として管理する。