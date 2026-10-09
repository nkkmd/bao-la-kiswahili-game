# Bao la Kiswahili v0.6.0

takasiaのルール対応、公開AIへの反映、新旧棋譜の互換処理を含む試作版リリースです。

ルール元の `bao-la-kiswahili-ja` v0.2.0でのtakasia採用に合わせ、通常対局・AI探索・棋譜・受信検証・日英ルール説明を更新しました。ローカル2人対戦とコンピューター対戦に対応し、通常の対局は引き続きブラウザー内で動作します。

## 主な更新内容

- ルールエンジンへtakasiaの成立、対象、停止・失効を実装
- AI-GEN4の合法手・探索遷移・局面キー・キャッシュ・Worker経路を同期
- 対局中の対象穴のT印と状態表示、日英のルール案内を追加
- 日英図解ルールとtakasiaの図版を更新
- 新規棋譜とAI診断をversion 2へ更新し、ルール版とtakasia状態を保持
- 旧version 1棋譜を固定したR-002エンジンで読み込み・再生・検証
- 棋譜受信Workerをv1／v2対応とし、R2保存先を形式版で分離
- 公開画面のアプリ表記をv0.6.0へ更新
- PWAキャッシュを `bao-la-kiswahili-v58` へ更新

## 採用ルールと棋譜の互換性

新規対局の採用ルールは `bao-la-kiswahili-ja` v0.2.0、ルール改訂は `BAO-RULES-V0.2.0-TAKASIA-001` です。

新しい棋譜は `bao-game-record` version 2で保存します。旧version 1は `v0.1.0-draft / R-002` として固定した旧エンジンを選び、全着手と最終局面を検証して再生します。旧棋譜を新ルールの棋譜へ読み替えません。

棋譜送信先の `/v1/game-records` はAPIのURLであり、棋譜本文のversion 1／2とは別の識別子です。新旧の送信を同じ入口で受け付け、保存先は `records/v1/` と `records/v2/` に分けます。

## 公開AI

公開AIの世代は引き続き **AI-GEN4**、既存release IDは `AI-GEN4-RELEASE-001` です。今回のルール対応改訂を `AI-GEN4-TAKASIA-001` として識別します。

学習済み論理ゲート型評価器、重み、探索予算は維持し、探索が新ルールの合法手・遷移を使うよう更新しました。今回の対応は新たな棋力改善の採用判断やAI世代の昇格ではありません。

## プライバシーとオフライン利用

ローカル棋譜保存、棋譜再生、AI改善のための任意棋譜提供は、それぞれ別操作です。利用者が選んだ棋譜の再生はブラウザー内で完結し、外部へ自動送信しません。棋譜提供はTurnstile確認と1局ごとの明示同意後に行います。

静的資産がキャッシュされた後は通常対局・ローカル保存・再生などをオフラインで利用できます。任意提供にはオンライン通信が必要です。

## 検証

takasia対応について、仕様照合25件、エンジン・AI・棋譜・受信・表示の回帰、固定したAI予算72条件、Chromium・Firefox・WebKitでの表示・新旧棋譜・日英図解・オフライン更新を確認しました。旧固定版の検査と過去の採用証拠も保持しています。

v0.6.0の表記・キャッシュ更新についても、関連5ワークフローが成功しました。3ブラウザー各14項目で、旧v55・配信済みv57からv58への移行、旧キャッシュ削除、v0.6.0表示、オフライン利用を確認しています。

受信Workerを先に更新し、本番の対局・AI、新v2棋譜の保存と送信・保存、旧v1棋譜の読み込み・再生はユーザーから正常との報告を受けました。表記更新版の検証結果と再配信状態は[リリース準備記録](https://github.com/nkkmd/bao-la-kiswahili-game/blob/main/doc/ai-engineering/takasia-update/RELEASE_PREPARATION.md)を参照してください。

## 主な制限

このゲームは試作版です。採用ガイドの実装であり、Baoのすべての地域差・解釈差を網羅するものではありません。終わらない連続種まきには安全上の上限があります。対局途中の自動保存・復元、通信対戦には対応していません。検証結果は固定した条件の範囲に限り、全端末の性能や一般的な棋力を保証しません。過去の研究結果は各時点の旧ルール・実験条件に対する記録として保持します。

## 関連リンク

- [公開サイト](https://bao-la-kiswahili.cultivationdata.net/)
- [日英図解ルール](https://bao-la-kiswahili.cultivationdata.net/rules)
- [リポジトリ](https://github.com/nkkmd/bao-la-kiswahili-game)
- [採用ルール基準](https://github.com/nkkmd/bao-la-kiswahili-game/blob/v0.6.0/doc/RULES_BASELINE.md)
- [takasia対応工程と検証](https://github.com/nkkmd/bao-la-kiswahili-game/blob/v0.6.0/doc/ai-engineering/takasia-update/README.md)
- [v0.5.0からの変更](https://github.com/nkkmd/bao-la-kiswahili-game/compare/v0.5.0...v0.6.0)
