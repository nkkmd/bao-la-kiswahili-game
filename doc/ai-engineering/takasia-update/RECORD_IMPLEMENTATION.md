# 工程5の棋譜・診断・受信対応

更新日: 2026-10-08

## 現在状態と結論

takasiaとルール版を保存・再生・診断・受信まで保持する経路を、作業ブランチへ実装した。新旧形式の往復と拒否境界、通常・軽量遷移、ブラウザー相当VM、受信Workerのmockを検証し、工程5はこの限定範囲でPASSとする。

新規棋譜・通常対局の診断はversion 2。旧version 1は当時のR-002として再生・検証し、旧棋譜閲覧中の局面保存も旧版を維持する。main統合・本番配信・Cloudflare実環境のv2受信・DOM全体・スマートフォン実機の総合確認は未実施である。

## 形式とエンジンの対応

| 形式版 | ガイド版 | ルール基準 | エンジン | takasia |
| --- | --- | --- | --- | --- |
| 1 | v0.1.0-draft | R-002 | `public/engine-r002.js` | 項目を持たない |
| 2 | v0.2.0 | BAO-RULES-V0.2.0-TAKASIA-001 | `public/engine.js` | nullまたは対象手番・indexを必須保存 |

`public/rule-versions.js`が組合せの完全一致、局面正規化、対象の型・範囲・手番・phase・終局との整合、エンジン選択を共用する。v1へtakasiaを注入すること、v2で項目を落とすこと、未知の版や項目、版とエンジンの混在は拒否する。診断局面の構造検証だけでは、過去手が実際にtakasiaを成立させたことを証明しない。

旧エンジンは作業開始時main `8c87ed44c9b08f75456766f0a9bd9f76d06209d4`の`public/engine.js`から、公開名の`BaoEngine`だけを`BaoLegacyEngine`へ変えたもの。変更を戻したGit blob SHAが`1527bb3665228b7a5bd9f03153567aedbaaa22d7`へ一致することを検査する。通常対局・公開AIは新版エンジンを使い、旧版は旧棋譜の再生・受信検証へ隔離する。旧manifest・モデル・期待値は変更していない。

## 保存・再生・診断

棋譜は従来どおり確定した着手だけをメモリへ保持し、終局後の明示操作でファイルを生成する。途中のtakasiaは全着手から再構成し、途中イベントやAI探索統計は棋譜へ埋め込まない。AI設定には利用可能な`ruleRevision`・`aiRevision`を追加する。

viewerはルール版に応じた標準初期局面、canonicalな合法手、各plyメタデータ、最終局面・結果を照合する。「戻る」は検証済みsnapshotへ移り、「進む」の実際の`playMove`もsessionで選択したエンジンから表示イベントを生成する。読み込みだけを旧ルールで検証し、進むときに新版へ切り替わる不整合を防ぐ。

送信前のクライアント検証もviewerと同じsession構築を使い、着手・結果の改ざんや未知項目を拒否する。受信側では型、石総数、computer対戦、サイズ・手数などの追加条件も検証する。

診断v2は`rules`、`position.takasia`、統計の`ruleRevision`・`aiRevision`を保持する。旧診断v1はR-002として識別する。端末内記録のキー`bao_ai_feedback_v1`は保持し、新旧記録を同じ一覧へ保存できる。旧棋譜閲覧中の「現在局面を保存」は旧診断v1を生成する。変換ツールは対応する`ruleRevision`をfixtureへ付け、未確認の期待値は従来のTODOによる失敗のままにする。レビュー・探索には対応版のエンジンを別に選ぶ。

## 受信・保存先・移行

受信Workerはv1を固定R-002、v2をtakasia対応エンジンで全手再生する。標準初期局面、石総数、各canonical手、最終局面・結果を検証し、takasiaを正規化から落とさない。棋譜本文のJSON key順が異なっても値が同じなら検証できる。

API入口は既存の`/v1/game-records`を維持する。このURLのv1と棋譜本文のversionは別の識別である。既存の`records/v1/<sha256>.json`は移動せず、新規v2は`records/v2/<sha256>.json`へ保存する。metadataには本文のversion、ルール基準、ガイド版、利用可能なAI改訂を保持する。

Origin・Fetch Metadata・Turnstile、サイズ・手数上限、重複排除、共通の日次quota、private R2、IP・tokenを保存しない境界を維持する。利用者の送信同意や保存・再生操作の意味は変更しない。

新クライアントは既存のv1専用受信環境へ先行配信しない。配信前に受信側のv1／v2対応とcontrolled submission、R2保存、重複・日次quota、CPU、90日lifecycleを確認する。本作業でCloudflareの設定・配備・収集状態は変更していない。

## 再現用棋譜と検証結果

[固定棋譜](../../../tools/takasia/record-fixtures.json)は標準初期配置から本ゲームの新旧エンジンで生成した回帰例である。LCGと手選択条件を保存し、seed 1〜1000の最初の該当例を384 ply上限で選ぶ。takasia成立時は対象で停止する応手を優先する。

| 例 | seed | 手数 | 検証した内容 |
| --- | --- | --- | --- |
| 新規v2 | 46 | 79 | takasia成立・対象での停止が各1回あり、次の手で失効。全手の通常／軽量、viewer、受信と最終局面が一致 |
| 旧v1 | 36 | 78 | 旧ルールで終局へ一致。新版へ版を付け替えると合法性または結果が不一致になり、拒否される |

これは自然な初期配置から到達したtakasiaを含む1例であり、E30の到達可能性、全規則の独立証明、棋力・先後差の証拠ではない。新旧エンジンそのものを使う再現検査を、独立したBao規則実装との照合とは呼ばない。

新規回帰は18件、既存棋譜・診断48件、隣接UI2件の68件がPASS。エンジン・独立計算・AIの76件も再実行し、合計144件がPASS、skip・todo 0。仕様照合25条件と固定棋譜の再生成照合もPASSした。

初回実装コミット`8837af3d44a3a9b3027a3e0c895b7d69950d31f5`の[takasia専用PR実行](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37779707628)・[push実行](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37779700675)はともに成功し、143件とAI予算72条件を通過した。[棋譜CI](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37779707505)の新しい`takasia-record-verification`も67件PASSした。全72条件は合法手・入力不変・改訂一致・固定時間許容範囲を満たしたが、工程4で説明した比較深さ・モデル・棋力の限界は維持する。

JSONの項目順と重複判定を追加検証し、クライアント検証をviewerへ統一した最終実装コミット`d820d30a3e905bc5500289b81c8e9c2c9561fa4d`でも、[PR専用CI](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37781634238)・[push専用CI](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37781624659)がともに成功した。回帰は144件、AI予算は72条件がPASS。[棋譜CI](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37781634139)の新旧版jobは68件PASSし、従来jobの棋譜検査45件もPASSした。

対象ソース・hash・実行環境・結果・CI参照・追加AI予算の全結果は[機械可読記録](../../../tools/takasia/record-validation-20261008.json)へ保存する。工程4の固定条件と過去の72結果は書き換えていない。

## 既存CIの残件と次工程

従来の棋譜CIでは棋譜保存・再生・受信の45件がPASSし、前工程の`Unexpected field`は解消した。同CIは後段の`ai-generation-release.test.js`で、現在の`public/engine.js`と旧AI-GEN3 manifestのhashが異なるため失敗している。assertを削除・skipしていない。LGTTCI、PBAI-P4、AI-GEN3、図解ルール、PBAI-C015の旧資産・旧ルールとの照合も後続の同期が必要で、PR全体は未合格である。

次は工程6として、対象穴・成立・停止・失効の説明と日英ルール画面を同期する。工程7では固定版と現行版の検証経路、DOM全体・ブラウザー・Android実機、新旧棋譜の戻る／進む、v55からv56へのキャッシュ更新、受信側の配備・controlled submissionを確認する。PWAには旧エンジンと版選択資産を追加しv56を準備したが、実サイトでの更新は未実施である。

## 文書監査

root README、採用基準、AI中央索引、takasiaの7文書、検証ツール説明、棋譜・提供・運用・設計・AIレビュー・受信Workerの6文書を横断確認する。通常本文と説明見出しを日本語とし、過去の採用・配備・結果と現在の未配信状態を区別する。コード、API、ID、SHA、JSON、exact outputは再現に必要な例外として保持する。監査結果はPR本文と機械可読記録へ残す。

計17文書を監査し、英語だけの説明見出し0、説明済み例外を除く英語の通常完全文0、壊れた相対リンク0、意図しないコードブロック・固定ID・hash・数値・過去結果の変更0を確認した。Baoの正式名称とtakasiaの節名はcanonical名の例外である。旧提供文書の英語見出し3件を日本語化し、既存リンク用anchorは保持した。JSON例のv2対応、回帰件数とキャッシュ版の変更は今回の形式・実装に合わせた意図的な更新である。
