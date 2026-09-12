# Bao la Kiswahili

Bao la Kiswahili は、ローカル 2 人対戦とコンピューター対戦に対応した、Bao の静的ブラウザー実装です。通常の静的ファイルだけで動作し、ビルド手順は不要です。ゲームロジックはすべてブラウザー内で実行されます。

本リポジトリで提供するゲームの公式公開サイトは [https://bao-la-kiswahili.cultivationdata.net/](https://bao-la-kiswahili.cultivationdata.net/) です。

コンピューターには 4 つのレベルがあります。

| レベル | 方式 |
| --- | --- |
| やさしい | 合法手からランダムに選択 |
| ふつう | 1 手読みで評価上位の手からランダムに選択 |
| むずかしい | ミニマックス法とアルファベータ枝刈りによる反復深化探索 |
| ビングワ | デバイス性能に応じて調整した、より長い探索時間 |

コンピューターの手はすべて、人間の対局と同じルールエンジンで生成・検証されます。

## 機能

- `public/` 以下に配置された静的ブラウザーゲーム
- ローカル 2 人対戦モード
- コンピューター対戦時の South/North 選択
- namua、mtaji、連続種まき、nyumba、捕獲、勝敗判定に対応した Bao ルールエンジン
- 長めの思考中でも UI の応答性を保つ、Web Worker ベースの AI 探索
- オフライン対応デプロイのための PWA ファイル
- 日本語・英語で読める、10点の図版付きルール説明ページ
- ルール、AI、探索、Worker、チューニング、ベンチマークツール向けの Node.js テストスイート
- シード、ペア開局、戦術回帰テスト、保存済み成果物による再現可能な AI ベンチマーク
- 外部送信なしで局面JSONをファイル保存し、直前のAI着手を端末内に記録する診断機能
- 「むずかしい」「ビングワ」の直前探索統計と、Phase 10A向け保存推奨判定

## ルールの基準

この実装は、[`bao-la-kiswahili-ja`](https://github.com/nkkmd/bao-la-kiswahili-ja) の公開ドラフト `v0.1.0-draft` におけるルール基準 `R-002` を実装上の基準としています。捕獲義務、namua、mtaji、連続種まき、nyumba、勝敗判定を実装しています。

検証に使える完全な出典局面がまだ確認できていないため、`takasia` は適用していません。終わらない対局を防ぐため、連続種まきには安全上の上限を設けています。

固定参照コミット、実装範囲、既知の差異、ルール更新時の同期手順は [`doc/RULES_BASELINE.md`](doc/RULES_BASELINE.md) に記録しています。

遊ぶ人向けの説明は [`public/rules.html`](public/rules.html) にまとめています。ゲーム画面の「遊び方・採用ルール」から別タブで開けます。ブラウザーの言語に合わせた自動表示に加え、「日本語 / English」で切り替えられ、`?lang=ja`・`?lang=en`付きのURLで共有できます。図版の拡大と、ファイルのキャッシュ完了後のオフライン閲覧にも対応します。

## ローカルでの実行

任意の静的 HTTP サーバーで `public/` ディレクトリを配信し、`index.html` を開きます。

例:

```sh
cd public
python3 -m http.server 8000
```

続いて、以下を開きます。

```text
http://localhost:8000/
```

`file://` 経由で `public/index.html` を開いても大半のゲームプレイは動作しますが、Service Worker 機能には HTTP(S) が必要です。

## デプロイ

Cloudflare Pages などの静的ホスティングでは、公開ディレクトリを以下に設定します。

```text
public/
```

Privacy Policy へのリンクとPWAのオフラインキャッシュは、Cloudflare Pages の clean URL に合わせて `./privacy` を使用します。リダイレクト済みの `privacy.html` レスポンスはキャッシュしません。

図解ルールも同様に `./rules` を使います。公開時は `rules.html`・`rules.css`・`rules.js`・`assets/rules/` を含む `public/` 全体を配信してください。言語指定付きのページURLは、同じHTMLキャッシュから表示します。単純なローカルHTTPサーバーでは `rules.html` で開けますが、オフライン機能の検証には `/rules`・`/privacy` を解決できるサーバーが必要です。

## テスト

個別のテストを実行します。

```sh
node test/engine.test.js
```

現在の公開AI経路を確認する主要な回帰テストを実行します。

```sh
node --test test/engine.test.js test/ai.test.js test/ai-config.test.js \
  test/ai-generation-release.test.js test/ai-worker.test.js \
  test/worker-integration.test.js test/diagnostics-ui.test.js \
  test/pbai-c015-integration.test.cjs test/pbai-c015-expert-production.test.cjs
```

この選定は[公開AI組込みのCI](.github/workflows/pbai-c015-integration.yml)に対応します。`test/`には過去の凍結ソースとの一致を要求する研究・検証用テストも含まれます。全ファイルの一括実行を現行公開AIの合格条件にはせず、過去の試験は各文書の固定commitと再実行制限に従って扱います。

## AI ベンチマーク

基準AIを直接使う固定深さベンチマークの例です。`tools/benchmark.js`は`public/ai.js`を読み込み、AI-GEN4の公開アダプター・論理ゲート型評価器を読み込まないため、このコマンドを現在の公開AIの棋力試験として扱いません。AI-GEN4の採用根拠は[公開AIの開発・改善](#公開aiの開発改善)を参照してください。

```sh
node tools/benchmark.js --games 100 --seed 20260706 \
  --first hard --second normal --time-limit 0 --max-depth 2
```

戦術回帰テストを実行します。

```sh
node test/tactical.test.js
```

戦術テストの診断出力:

```sh
BAO_TACTICAL_DIAG=1 node test/tactical.test.js
```

ゲーム画面の「AI改善用診断」では、次のJSONファイルを端末へ保存できます。

- `現在局面を保存`: `bao-position-YYYYMMDD-HHMMSS.json`
- `記録を保存`: `bao-ai-review-YYYYMMDD-HHMMSS.json`

日時は利用者の端末のローカル日時をファイル名にだけ使用します。診断JSON本文には保存時刻を追加しません。「記録を保存」を実行しても、localStorage内の記録は削除されません。

### Phase 10A 保存推奨

「むずかしい」と「ビングワ」では、AI着手後に直前の完了深度、探索時間、探索局面数、timeoutの有無を表示します。次のような客観的条件を検出した場合は、悪手と断定せず「調査候補」として保存を推奨します。

- 探索のtimeout
- 難易度別の目安を下回る完了深度
- 同じ難易度の直近10手の中央値から2以上低い完了深度
- AI着手後に相手の捕獲可能手が2手以上増加
- AI着手後に自分の前列占有穴が2個以上減少
- AI着手直後の敗北確定

判定はブラウザー内だけで行われ、自動保存や外部送信はしません。保存を推奨された場合も、利用者が「AIの手を記録」を押したときだけlocalStorageへ追加されます。診断JSONには`review.status: "unreviewed"`、推奨スコア、検出シグナルが含まれます。

保存したJSONから、局面監査・レビュー用の戦術ケース雛形を生成できます。

```sh
node tools/diagnostic-to-fixture.js \
  --input /path/to/diagnostic.json \
  --output /tmp/bao-tactical-fixtures.js
```

生成される雛形は意図的に失敗するTODOを含みます。Baoの習熟度が十分でない場合は、期待手を無理に決めず、深度比較、評価値、node数、timeout、自己対局結果などの客観情報だけを記録して`unreviewed`のまま保持できます。期待手または避ける手とBao上の理由を確認した局面だけを`test/tactical.test.js`へ正式追加します。

詳しい手順は [`doc/AI_HUMAN_REVIEW_GUIDE.md`](doc/AI_HUMAN_REVIEW_GUIDE.md)、ベンチマーク条件とベースライン結果は [`doc/AI_BENCHMARK.md`](doc/AI_BENCHMARK.md) に記録しています。

## プロジェクト構成

| パス | 役割 |
| --- | --- |
| `public/` | デプロイ用の静的ゲームファイル |
| `public/rules.html` | 日英対応の図解ルール説明 |
| `public/assets/rules/` | ルール図版と出典・ライセンス記録 |
| `public/engine.js` | 盤面状態、合法手生成、着手適用 |
| `public/ai.js` | AI-GEN3基準の手の選択、評価、探索（継承元・切戻し先） |
| `public/logic-evaluator.js` | 学習済みモデルを含む論理ゲート型評価器 |
| `public/ai-candidate.js` | 論理ゲート型評価器を接続した探索本体 |
| `public/ai-release.js` | 公開AIの有効化条件、世代表示、基準AIへの復帰 |
| `public/ai-release-worker.js` | 現在の公開画面が使うAI探索Worker |
| `public/ai-weights.js` | デフォルトの評価重み |
| `public/ai-worker.js` | 継承元AI-GEN3のWorkerと回帰確認用経路 |
| `public/ai-config.js` | デバイス性能別の探索設定 |
| `public/diagnostics.js` | AI診断局面の許可リスト形式、復元、端末内記録 |
| `public/review-suggestion.js` | Phase 10Aの探索表示、保存推奨判定、診断根拠付与 |
| `public/diagnostic-download.js` | 診断JSONの日時付きファイル保存 |
| `tools/` | ベンチマーク、チューニングスクリプト、実験ランナー |
| `test/` | 回帰テスト |
| `artifacts/` | 保存済みのベンチマーク・チューニング・研究出力 |
| `doc/` | ルール学習、研究成果、ロードマップ、ベンチマーク、開発ログ、技術レポート |

## 公開AIの開発・改善

公開ゲームのコンピューター対戦を改善する開発作業（AI Engineering）は、Baoに関する科学的研究とは別系統で管理しています。`AI-GENx`は公開AIの世代、`PBAI-Px`は改善プログラムのIDであり、研究世代（Research Generation）の番号とは対応しません。全体像は[AI開発の中央索引](doc/AI_ENGINEERING_INDEX.md)を参照してください。

### 現在の公開AI

現在の公開AI系統は **`AI-GEN4`**、正式release IDは **`AI-GEN4-RELEASE-001`** です。hard・expertへの`PBAI-C015-v1`の正式採用と本番配信内容を確認し、2026年9月11日に昇格しました。AI-GEN4の画面表示を含む配信内容も確認済みです。[正式判断と配信確認記録](doc/ai-engineering/ai-gen4-release/README.md)を参照してください。

AI-GEN4で加えた改善は、**学習済みの論理ゲート型評価器を使って探索中の局面を評価する仕組み**です。ルールに従って合法手を探索する方式は継承しています。AI-GEN3で採用した`PBAI-C011-v1`の軽量な局面遷移も引き続き使い、探索中に不要な表示用スナップショットを省きます。通常の着手処理と画面のアニメーションは維持します。

| 難易度・条件 | 現在の構成 |
| --- | --- |
| むずかしい（hard）・ビングワ（expert）の既定`bao`／`phase2` | 論理ゲート型評価器`PBAI-C015-v1`と、AI-GEN3から継承した探索・軽量局面遷移 |
| やさしい（easy）・ふつう（normal） | 従来構成を維持。画面のAI-GEN4表記は公開世代を示す |
| 明示的な別profile・独自重み・補正 | 論理ゲート型評価器の適用対象外 |
| hard・expertで候補やモデルの取得に失敗した場合、または切戻し時 | AI-GEN3基準構成へ戻り、画面表示も区別 |

公開画面とWorkerは`public/ai-release.js`の共通設定を使います。`public/ai-config.js`などに残るAI-GEN3の識別子は、継承元・切戻し先として固定した構成の記録です。

### 現在の採用根拠と限界

hardは[P8・P9の検証と実機確認に基づく正式採用](doc/ai-engineering/pbai-c015-adoption-review/ADOPTION.md)、expertは[P11の独立再試験と実機確認に基づく正式採用](doc/ai-engineering/public-ai-improvement-program-11/ADOPTION.md)を根拠とします。以下の成績は、それぞれAI-GEN3基準構成との比較です。

| 検証 | 固定した主要条件 | 結果 |
| --- | --- | --- |
| PBAI-P8 | Node/Linux、100ms・最大深度8 | 512局295勝217敗。固定範囲での棋力改善と正式検算を確認 |
| PBAI-P9 | Node、毎手Worker起動、hard標準500ms・最大深度8 | 256局151勝105敗。主要条件と独立検算を通過 |
| PBAI-P11 | Node、毎手Worker起動、expert低・標準・高設定 | 各256局。順に146勝110敗、146勝110敗、141勝115敗。3設定すべての棋力・運用条件と独立検算を通過 |

本番用コードはChromium・Firefox・WebKitで確認し、実機用コピーではmoto g52j 5G／Android 12／Chromeによる約20分の操作確認報告を受領しています。棋力試験、ブラウザ動作確認、実機報告、配信ファイル照合は、それぞれ別の証拠です。全端末での棋力・速度を証明したものではなく、AI-GEN4配信記録では本番配信後の実機再対局、実機ピークメモリ、実機オフライン操作は未確認です。

### 継承するAI-GEN3の採用根拠

PBAI-P5では、軽量局面遷移をAI-GEN2の固定基準構成と新規holdout512局で比較し、328勝184敗、勝点率64.0625％でした。先後ペアの相関を考慮したcluster bootstrapの95％区間は61.1328125〜66.9921875％です。Node/Linux上の100ms・最大深度8という固定条件で`STRENGTH-IMPROVED-IN-FROZEN-DOMAIN`と判断し、同等計算の速度比較でも`EQUIVALENT-COMPUTATION-SPEEDUP`を確認しました。[P5最終報告](doc/ai-engineering/public-ai-improvement-program-5/PROGRAM_FINAL_REPORT.md)に条件と独立検算をまとめています。これはAI-GEN3の採用根拠であり、上記の論理ゲート型評価器の成績とは合算しません。

### 改善プログラムの経緯

**PBAI-P1〜P11は完了済み**です。下表の公開判断は各プログラム終了時点の履歴です。P8・P9の`KEEP-AI-GEN3`の後にhardの正式採用、P11の後にexpertの正式採用・本番組込み・配信確認を行い、現在のAI-GEN4へ至りました。

| プログラム | 検証内容と結果 | 各プログラムでの公開判断 |
| --- | --- | --- |
| [PBAI-P1](doc/ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md) | 研究第1世代までの証拠を利用。採用条件を満たす候補がなく、`KEEP-AI-GEN2`で完了 | 変更なし |
| [PBAI-P2](doc/ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md) | 研究第2世代までの証拠を利用。採用条件を満たす候補がなく、`KEEP-AI-GEN2`で完了 | 変更なし |
| [PBAI-P3](doc/ai-engineering/public-ai-improvement-program-3/README.md) | 研究第3世代の証拠を利用。候補`PBAI-C010-v1`の適用対象が事前条件を満たさず、実装前に終了。Programは`KEEP-AI-GEN2` | 変更なし |
| [PBAI-P4](doc/ai-engineering/public-ai-improvement-program-4/PROGRAM_FINAL_REPORT.md) | 軽量な局面遷移の正確性と速度改善を観測。全体時間上限の監視不成立で最終対局を354/512局で停止し、`STRENGTH-NON-ESTIMABLE / HOLD` | 採用せず |
| [PBAI-P5](doc/ai-engineering/public-ai-improvement-program-5/README.md) | 同じ`PBAI-C011-v1`を新規seedと連続4時間監視の下で独立再検証。事前の採用条件と独立検算を通過 | `ADOPT`、`AI-GEN3`へ昇格 |
| [PBAI-P6](doc/ai-engineering/public-ai-improvement-program-6/PROGRAM_FINAL_REPORT.md) | 論理ゲート型・線形・小型ニューラルネットを比較。主候補は誤差と既知戦術の条件を通過したが、速度条件未達で`HOLD` | 変更なし、`KEEP-AI-GEN3` |
| [PBAI-P7](doc/ai-engineering/public-ai-improvement-program-7/PROGRAM_FINAL_REPORT.md) | P6の固定モデルを軽量化。高速化と良好な対局成績を観測したが、正式検算が停止し`TECHNICAL-INVALID / HOLD` | 変更なし、`KEEP-AI-GEN3` |
| [PBAI-P8](doc/ai-engineering/public-ai-improvement-program-8/PROGRAM_FINAL_REPORT.md) | 同じ論理ゲート評価器を新規データで独立再検証。295勝217敗、正式検算と固定条件での棋力改善判定を通過 | 未採用・未配備、`KEEP-AI-GEN3` |
| [PBAI-P9](doc/ai-engineering/public-ai-improvement-program-9/PROGRAM_FINAL_REPORT.md) | 同じ候補を標準500ms・毎手WorkerのNode条件で追加検証。151勝105敗、正式検算と主要条件を通過。ブラウザ互換性78件も合格 | 未採用・未配備、`KEEP-AI-GEN3` |
| [PBAI-P10](doc/ai-engineering/public-ai-improvement-program-10/PROGRAM_FINAL_REPORT.md) | expertの低・標準・高設定を検証したが、実行中断により`TECHNICAL-INVALID / HOLD`。棋力改善は未判定 | expertの採用根拠にせず、hardの既存採用を維持 |
| [PBAI-P11](doc/ai-engineering/public-ai-improvement-program-11/PROGRAM_FINAL_REPORT.md) | 新規seedとGitHub実行基盤でexpertを独立再試験。3設定すべての棋力・運用条件と独立検算を通過 | 後続の実機確認・正式採用・配信確認を経て、hardとともに`AI-GEN4`へ昇格 |

PBAI-P3の候補は`HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION`です。後続プログラムの成功によって、P1〜P4の正式結果やP6・P7・P10のHOLD・技術的無効を変更しません。各試験の対局成績は合算せず、科学研究の結論も保持します。

### 詳細資料

- [AI-GEN4正式昇格・配信確認・切戻し](doc/ai-engineering/ai-gen4-release/README.md) — 現在の公開世代と運用状態の正本
- [AI開発の中央索引](doc/AI_ENGINEERING_INDEX.md) — P1〜P11の結果と各プログラムへの入口
- [expert本番組込み・配信記録](doc/ai-engineering/pbai-c015-expert-production/README.md) — P11の採用からAI-GEN4昇格までの経過
- [AI-GEN3正式昇格判断](doc/ai-engineering/public-ai-improvement-program-5/PROMOTION_DECISION.md)・[P5リリース台帳](doc/ai-engineering/public-ai-improvement-program-5/RELEASE_REGISTER.md) — 継承元の採用・配信履歴
- [P11の証拠確認・再開位置](doc/ai-engineering/public-ai-improvement-program-11/RESUME.md) — 完了済み試験の証拠と再実行の制限
- [AI世代の命名規則](doc/ai-engineering/AI_GENERATION_NAMING.md) — AI世代、改善プログラム、候補・採用判断・release IDの区別

## 研究成果

本リポジトリでは、AI自己対局、固定シード、同一開局条件での比較、独立再検証などを用いてBaoを研究しています。以下は研究世代ごとの要約です。「確認」は各研究で事前に固定した範囲内の結論であり、Bao全体への普遍的な主張ではありません。

全研究の個別結果、判定理由、再現手順は[研究成果の中央索引](doc/RESEARCH_INDEX.md)から参照できます。

### 研究第1世代 — 基礎的な現象と測定対象

局面相転移、局面類型、手筋、形勢評価、限定終盤、状態空間など、後続研究の土台となる対象を広く調べました。限定された条件では、`capture-branch-expansion`に関する探索深度別の反転、Mtajiの2つの局面類型、手筋候補`TM-S2-C03`などを確認しました。また、限定終盤8状態の完全解析と、標準初期局面から深さ8までの24,848 RAW状態の完全列挙を行いました。

一方、一般定石として採用できる候補は得られず、形勢評価や複雑度などにも未確認・結論未確定の結果が残りました。各結果の適用範囲は[研究成果の中央索引](doc/RESEARCH_INDEX.md)に記録しています。

### 研究第2世代 — 再現性、表現、探索信頼性

研究手順と独立検証を強化し、RAW状態、探索信頼性、重要局面表現、戦略状態表現、成長推定などを検討しました。最も明確な到達点は、標準初期局面から深さ9までの完全列挙（累積102,857 RAW状態、136,645ゲーム木ノード）です。

対称変換による正規化、検証済み戦略レジーム、長期戦略遷移、全局的な状態空間成長推定は確立しませんでした。技術的不成立や判定条件未達も否定結果へ読み替えず、そのまま境界として保存しています。詳しくは[研究第2世代の最終統合報告](doc/research-generation-2/FINAL_SYNTHESIS.md)を参照してください。

### 研究第3世代 — 局所ゲーム木の幾何

深さ5までのRAWゲーム木・グラフを用い、分岐幅、合流、tree/graph差、局面推移、探索結果との関係を調べました。再現可能な局所幾何測定法を確立し、限定された対象では、NamuaとMtajiのcorridor/tree-graph構造差、合法手幅と探索結果変化の関連、幾何軌跡の方向性・持続性・低い回帰率・一次の経路依存性を確認しました。さらに、標準初期局面から深さ10までを完全列挙し、348,270の新規RAW状態を確認しました。

G3-12は技術的不成立で終了したため、局所幾何の一般化可能範囲と反例領域は確立していません。研究第3世代のcore programはG3-01〜G3-12を閉じ、mainへの統合も完了しています。詳しくは[研究第3世代の最終統合報告](doc/research-generation-3/FINAL_SYNTHESIS.md)を参照してください。

### 研究第4世代 — 局所幾何の意味・移送可能性・exact帰結

第四世代は、第三世代で測定可能になったbounded RAW local game-tree geometryについて、別のphase・root family・source policyへの移送可能性、完全解析可能な限定domainでのgame-theoretic consequence、時間・ルール・探索条件との関係を検証する計画です。

core agendaは`G4-01..G4-10`です。最初にclaim-transfer compatibility instrumentを科学的effectから分離して構築し、claim別の一般化・反例検証、fresh exact microdomain、geometryとexact valueのbridge、多時間尺度memory、rule-semantic transition、search reliability、depth 11 exact topologyへ進む構成です。

現時点で固定されているのはProgram計画だけです。個別Studyの科学実行、scientific seedへのアクセス、depth 11、公開AI変更は承認されていません。次に行える研究作業は、G4-01についてのcurrent-state authorization reviewです。

- [第四世代研究の入口](doc/research-generation-4/README.md)
- [第四世代Program計画](doc/research-generation-4/PROGRAM_PLAN.md)
- [第四世代の現在状態](doc/research-generation-4/CURRENT_STATUS.md)

新しい独立研究を追加するときは、初見向け概要と科学的・技術的な正本を分け、[研究成果の中央索引](doc/RESEARCH_INDEX.md)から参照できるようにします。

## ドキュメント

- [`doc/RULES_BASELINE.md`](doc/RULES_BASELINE.md): 採用ルールの参照元、固定コミット、実装差分、更新方針
- [`doc/BEGINNER_STRATEGY_GUIDE.md`](doc/BEGINNER_STRATEGY_GUIDE.md): 初心者向けの基本戦略、思考手順、段階別練習方法
- [`doc/JOSEKI_RESEARCH.md`](doc/JOSEKI_RESEARCH.md): 定石研究の方法、全フェーズの実験結果、最終判断をまとめた統合記録
- [`doc/JOSEKI_RESEARCH_PLAN.md`](doc/JOSEKI_RESEARCH_PLAN.md): 定石研究の研究課題、判定基準、完了条件、実施記録
- [`doc/PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md`](doc/PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md): 全継続AI条件で固定開局系列を共有するペア追試計画
- [`doc/NAMUA_SYMMETRY_RESEARCH_PLAN.md`](doc/NAMUA_SYMMETRY_RESEARCH_PLAN.md): namua鏡像変換、合法手、bao評価の不一致原因を調査するローカル研究計画
- [`doc/BAO_AI_TECHNICAL_REPORT.md`](doc/BAO_AI_TECHNICAL_REPORT.md): 初期AI強化の技術レポート（当時の結果・設計の記録）
- [`doc/AI_BENCHMARK.md`](doc/AI_BENCHMARK.md): ベンチマークコマンドとベースライン結果
- [`doc/AI_DEVELOPMENT_LOG.md`](doc/AI_DEVELOPMENT_LOG.md): 設計判断、失敗した試行、制限事項
- [`doc/AI_ROADMAP.md`](doc/AI_ROADMAP.md): 完了済みの Phase 0-5 AI ロードマップ
- [`doc/AI_ADVANCED_ROADMAP.md`](doc/AI_ADVANCED_ROADMAP.md): 初期Phase 6以降の計画・実施記録と未完了の診断課題
- [`doc/AI_HUMAN_REVIEW_GUIDE.md`](doc/AI_HUMAN_REVIEW_GUIDE.md): 初心者でも進められる機械的局面監査と、根拠確認後の棋力レビュー手順
- [`doc/SYSTEM_DESIGN.md`](doc/SYSTEM_DESIGN.md): システム構成と責務

## ライセンス

プログラムコードは MIT License のもとで提供しています。詳しくは [`LICENSE`](LICENSE) を参照してください。

例外として、[`public/rules.html`](public/rules.html) の説明本文と [`public/assets/rules/`](public/assets/rules/) のSVG図版は、参照ガイドの規則説明を翻案し、CC BY-SA 4.0で提供しています。図版は本リポジトリで新たに作成したものです。出典、変更内容、適用範囲は [`public/assets/rules/README.md`](public/assets/rules/README.md) を参照してください。
