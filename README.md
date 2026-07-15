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

この実装は `bao-la-kiswahili-ja` v0.1.0-draft R-002 のルール基準に従っています。捕獲義務、namua、mtaji、連続種まき、nyumba、勝敗判定を実装しています。

検証に使える完全な出典局面がまだ確認できていないため、`takasia` は適用していません。終わらない対局を防ぐため、連続種まきには安全上の上限を設けています。

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

Privacy Policy へのリンクは Cloudflare Pages の clean URL に合わせて `./privacy` を使用します。PWA のオフラインキャッシュでは `privacy.html` にフォールバックします。

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
| `artifacts/` | 保存済みのベンチマーク・チューニング出力 |
| `doc/` | ルール学習、ロードマップ、ベンチマーク、開発ログ、技術レポート |

## ドキュメント

- [`doc/BEGINNER_STRATEGY_GUIDE.md`](doc/BEGINNER_STRATEGY_GUIDE.md): 初心者向けの基本戦略、思考手順、段階別練習方法
- [`doc/FIRST_PLAYER_ADVANTAGE_RESEARCH.md`](doc/FIRST_PLAYER_ADVANTAGE_RESEARCH.md): 先攻・後攻差研究の統合記録、統計比較、現在の結論
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
