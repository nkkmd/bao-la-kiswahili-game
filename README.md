# Bao la Kiswahili

Bao la Kiswahili は、ローカル 2 人対戦とコンピューター対戦に対応した、Bao の静的ブラウザー実装です。通常の静的ファイルだけで動作し、ビルド手順は不要です。ゲームロジックはすべてブラウザー内で実行されます。

コンピューターには 4 つのレベルがあります。

| レベル | 方式 |
| --- | --- |
| やさしい | 合法手からランダムに選択 |
| ふつう | 1 手読みで評価上位の手からランダムに選択 |
| むずかしい | ミニマックス法とアルファベータ枝刈りによる反復深化探索 |
| ムタアラム | デバイス性能に応じて調整した、より長い探索時間 |

コンピューターの手はすべて、人間の対局と同じルールエンジンで生成・検証されます。

## 機能

- `public/` 以下に配置された静的ブラウザーゲーム
- ローカル 2 人対戦モード
- コンピューター対戦時の South/North 選択
- namua、mtaji、連続種まき、nyumba、捕獲、勝敗判定に対応した Bao ルールエンジン
- 長めの思考中でも UI の応答性を保つ、Web Worker ベースの AI 探索
- オフライン対応デプロイのための PWA ファイル
- ルール、AI、探索、Worker、チューニング、ベンチマークツール向けの Node.js テストスイート
- シード、ペア開局、戦術回帰テスト、保存済み成果物による再現可能な AI ベンチマーク
- 外部送信なしで局面JSONをファイル保存し、直前のAI着手を端末内に記録する診断機能
- 「むずかしい」「ムタアラム」の直前探索統計と、Phase 10A向け保存推奨判定

## ルールの基準

この実装は、[`bao-la-kiswahili-ja`](https://github.com/nkkmd/bao-la-kiswahili-ja) の公開ドラフト `v0.1.0-draft` におけるルール基準 `R-002` を実装上の基準としています。捕獲義務、namua、mtaji、連続種まき、nyumba、勝敗判定を実装しています。

検証に使える完全な出典局面がまだ確認できていないため、`takasia` は適用していません。終わらない対局を防ぐため、連続種まきには安全上の上限を設けています。

固定参照コミット、実装範囲、既知の差異、ルール更新時の同期手順は [`doc/RULES_BASELINE.md`](doc/RULES_BASELINE.md) に記録しています。

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

## テスト

個別のテストを実行します。

```sh
node test/engine.test.js
```

テストスイート全体を実行します。

```sh
for f in test/*.test.js; do node "$f" || exit 1; done
```

## AI ベンチマーク

再現可能な固定深さベンチマークを実行します。

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

「むずかしい」と「ムタアラム」では、AI着手後に直前の完了深度、探索時間、探索局面数、timeoutの有無を表示します。次のような客観的条件を検出した場合は、悪手と断定せず「調査候補」として保存を推奨します。

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
| `public/engine.js` | 盤面状態、合法手生成、着手適用 |
| `public/ai.js` | コンピューターの手の選択、評価、探索 |
| `public/ai-weights.js` | デフォルトの評価重み |
| `public/ai-worker.js` | バックグラウンド AI 探索 Worker |
| `public/ai-config.js` | デバイス性能別の探索設定 |
| `public/diagnostics.js` | AI診断局面の許可リスト形式、復元、端末内記録 |
| `public/review-suggestion.js` | Phase 10Aの探索表示、保存推奨判定、診断根拠付与 |
| `public/diagnostic-download.js` | 診断JSONの日時付きファイル保存 |
| `tools/` | ベンチマーク、チューニングスクリプト、実験ランナー |
| `test/` | 回帰テスト |
| `artifacts/` | 保存済みのベンチマーク・チューニング・研究出力 |
| `doc/` | ルール学習、研究成果、ロードマップ、ベンチマーク、開発ログ、技術レポート |

## 公開AIの開発・改善

本リポジトリでは、公開ゲームのコンピューター対戦を改善する開発作業と、Baoに関する科学的研究を別系統で管理しています。AIの採用・非採用によって、研究の結論を書き換えることはありません。

現在の公開AIは **`AI-GEN2`を継続採用**しています。Research Generation 1を用いた`PBAI-P1`と、Research Generation 2を用いた`PBAI-P2`では、いずれも公開版へ進める候補が得られなかったため、`AI-GEN3`への更新や公開AIコードの変更は行っていません。

- [AI開発の中央索引](doc/AI_ENGINEERING_INDEX.md) — 現在の世代、評価済み候補、公開状態への入口
- [第2回改善プログラムの最終報告](doc/ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md) — `PBAI-P2`の評価結果
- [第1回改善プログラムの最終報告](doc/ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md) — `PBAI-P1`の評価結果

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

新しい独立研究を追加するときは、初見向け概要と科学的・技術的な正本を分け、[研究成果の中央索引](doc/RESEARCH_INDEX.md)から参照できるようにします。

## ドキュメント

- [`doc/RULES_BASELINE.md`](doc/RULES_BASELINE.md): 採用ルールの参照元、固定コミット、実装差分、更新方針
- [`doc/BEGINNER_STRATEGY_GUIDE.md`](doc/BEGINNER_STRATEGY_GUIDE.md): 初心者向けの基本戦略、思考手順、段階別練習方法
- [`doc/JOSEKI_RESEARCH.md`](doc/JOSEKI_RESEARCH.md): 定石研究の方法、全フェーズの実験結果、最終判断をまとめた統合記録
- [`doc/JOSEKI_RESEARCH_PLAN.md`](doc/JOSEKI_RESEARCH_PLAN.md): 定石研究の研究課題、判定基準、完了条件、実施記録
- [`doc/PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md`](doc/PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md): 全継続AI条件で固定開局系列を共有するペア追試計画
- [`doc/NAMUA_SYMMETRY_RESEARCH_PLAN.md`](doc/NAMUA_SYMMETRY_RESEARCH_PLAN.md): namua鏡像変換、合法手、bao評価の不一致原因を調査するローカル研究計画
- [`doc/BAO_AI_TECHNICAL_REPORT.md`](doc/BAO_AI_TECHNICAL_REPORT.md): 公開向け Bao AI 技術レポート
- [`doc/AI_BENCHMARK.md`](doc/AI_BENCHMARK.md): ベンチマークコマンドとベースライン結果
- [`doc/AI_DEVELOPMENT_LOG.md`](doc/AI_DEVELOPMENT_LOG.md): 設計判断、失敗した試行、制限事項
- [`doc/AI_ROADMAP.md`](doc/AI_ROADMAP.md): 完了済みの Phase 0-5 AI ロードマップ
- [`doc/AI_ADVANCED_ROADMAP.md`](doc/AI_ADVANCED_ROADMAP.md): Phase 6 以降のロードマップと今後の改善メモ
- [`doc/AI_HUMAN_REVIEW_GUIDE.md`](doc/AI_HUMAN_REVIEW_GUIDE.md): 初心者でも進められる機械的局面監査と、根拠確認後の棋力レビュー手順
- [`doc/SYSTEM_DESIGN.md`](doc/SYSTEM_DESIGN.md): システム構成と責務

## ライセンス

このプロジェクトは MIT License のもとでライセンスされています。詳しくは [`LICENSE`](LICENSE) を参照してください。
