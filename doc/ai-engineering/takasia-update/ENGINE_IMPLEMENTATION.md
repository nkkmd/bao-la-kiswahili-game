# 工程3のエンジン実装と検証

確認日: 2026-10-08

## 結果と現在状態

工程3を作業ブランチ`feat/takasia-preparation-20261008`で完了した。`public/engine.js`へtakasiaの成立、開始制限、蒔きの停止、1手での失効を実装し、仕様照合25件が全件PASSになった。公開AI・棋譜・表示は未対応で、main統合・配信は未実施である。AI-GEN4の棋力・性能や旧棋譜互換性の合格を意味しない。

準備時点のFAILとhashは[準備記録](VALIDATION.md)と既存のJSONに保持した。新しい検査結果は[工程3の機械可読記録](../../../tools/takasia/engine-validation-20261008.json)へ別に保存した。

## 実装した振る舞い

- 初期状態は`takasia: null`。成立時は防御側の本人視点で`{player, index}`を保持する。
- 純粋関数`detectTakasia(state, attacker, previousMove)`は完了したmtajiのtakata後の盤面から初回の蒔きの捕獲対象を数える。合法手展開や遷移へ再帰しない。
- 防御側に捕獲がなく、攻撃側の捕獲対象が異なる穴として1つだけで、例外に該当しなければ成立する。手番フィールドではなく引数の攻撃側を調べる。
- 対象穴からtakataを開始できない。他の前列穴を優先する。捕獲手・namua・無関係な手番に誤適用しない。
- 途中通過は通常どおり1個を加え、最後の1個で対象へ着地したときに取り上げず停止する。nyumba開始でも同じである。
- 手の終了時に旧対象を消し、新たな成立を判定して次の手へ渡す。終局・relay上限でも対象を消す。
- 実際の開始phaseを遷移内で保存し、呼出側のphase省略・誤記で判定が抜けないようにする。
- 詳細イベントと探索用の軽量イベントは同じ最終状態とイベント情報を返す。`kind: "takasia"`の`action`は`activate`・`stop`・`expire`である。表示への反映は工程6で行う。

## nyumba所有の関連修正

[固定ガイド第09章](https://github.com/nkkmd/bao-la-kiswahili-ja/blob/aad9fda3ffb12c2ca785509951c71ce8a42bef5a/guide/09-nyumba.md)と[R-002 Appendix C](https://project.dke.maastrichtuniversity.nl/games/files/phd/Donkers_thesis.pdf)の§2.5a・§3.2（pp. 166–167）を追加照合した。最初のmtaji捕獲が起きるまで残る所有を、捕獲発生時に両側とも解除する。現行実装が着手側だけ解除していた差異を修正し、捕獲イベントの状態と、最後の敵前列を取って直ちに終局する場合を試験した。

namua捕獲では、空にしていない相手nyumbaの所有を維持する。namuaで5個のnyumbaだけが残った場合の開始規則は未解決境界として変更しない。512回の安全上限も維持し、最後の許容蒔きでtakasia対象へ着地したときは規則上の停止を優先する。

## 実行した検査

| 検査 | 結果 | 範囲 |
| --- | --- | --- |
| `node tools/takasia/check-engine.cjs` | 25件PASS | 17件の判定、E30直前手・合法手・4応手、nyumba開始、初期状態 |
| `node --test test/takasia-contract.test.cjs test/takasia-engine.test.cjs test/engine.test.js test/namua-mtaji-transition-engine.test.js` | 47件PASS、skip・todo 0 | 独立計算30件、追加エンジン15件、既存スクリプト2件 |
| `python3 tools/takasia/verify.py` | PASS | 独立した限定計算、17判定・E30全4応手・追加蒔き1件 |

Node.js `v24.19.0`、Python `3.12.14`で実行した。既存基本試験には50対局のランダムな石数保存確認を含む。takasia専用CIはpush・PRとも成功した（下記）。PR全体のCIは未合格であり、後続対応が必要である。既存の公開資産hash照合や棋譜互換性を緩める変更は行っていない。

追加回帰の旧対象から新対象への置換は、E30直前盤面へ旧マーカーを構成して入れた処理順序の試験である。通常の成立した制約下では元の捕獲対象は残るため、自然に連続成立する実戦局面を確認したとの主張はしない。relay上限の境界は独立VMで定数だけを4・3へ縮め、E30で停止優先と上限終局を試験した。本番の512回を変更する試験ではない。

旧入力で`takasia`がない場合にnullへ正規化することは、旧棋譜を旧ルールで再生できる保証ではない。工程5でルール版を分ける必要がある。

## GitHub Actionsの確認と統合前の残件

実装コミットは`e576ef0d0e3eee8352c42e7ecac812d675abdb7c`。takasia専用CIは[push実行](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37772230017)と[PR実行](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37772235066)が成功した。

既存CIの次の失敗をログから確認した。専用CIのPASSをPR全体の合格へ読み替えず、Draftを維持する。

| 実行 | 失敗した条件 | 後続工程での扱い |
| --- | --- | --- |
| [LGTTCI](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37772235077) | 旧engine blob `1527bb3665228b7a5bd9f03153567aedbaaa22d7`の固定照合 | 旧版の固定検証を保持し、新版の検証経路を分ける |
| [PBAI-P4](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37772235075) | 過去の結果の`sourceHashes`と現在のengineが異なる | 過去のhash・結果を書き換えず、当時の資産で検証する経路を保持 |
| [AI-GEN3](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37772235062)と[図解ルール](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37772235064) | 継承したAI-GEN3 manifestのengine SHA-256照合 | 工程4以降で公開改訂識別と検証経路を同期。図解10点の再生成照合自体は成功し、ブラウザー試験前に停止 |
| [PBAI-C015](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37772235070) | 上記manifest照合に加え、既知9局面の公開Worker・直接実行・切戻しと凍結参照の一致 | 工程4で新状態の局面キー・探索経路を同期して再検証。hardの開始namua局面で着手と探索統計が異なるため、hashだけの失敗とは扱わない |

新engineのblobは`1d60ab1e2393cc9f12105748d8346c6c67608d1c`、SHA-256は`7147697b8befd0c4c483e12aaf11f88432ce77a0cc189787d98ec184c24085f1`である。AI-GEN3の旧SHA-256 `2c5d245d731bbfd682eec7a0bbd8324c680ad6fbabd567286752d61b985d1bd3`は変更しない。これらの不一致を解消するためのskipやassert削除は加えていない。

## 文書監査と再開位置

対象はroot README、採用基準、AI中央索引、更新工程の4文書、検証ツール説明の計8文書である。見出し・通常説明は日本語で記述し、コマンド、API、path、SHA、機械可読結果は再現に必要な例外とする。既存作品名と規則名の見出しを保持する。英語だけの説明見出し0件、例外を除く英語の通常完全文0件、壊れた相対リンク0件、意図しない固定証拠・コードブロック・数値・IDの変更0件を確認した。

次は[更新工程](README.md)の工程4である。対象有無の局面キー分離、探索キャッシュ、Worker、切戻し、全難易度を同期し、評価器の品質と性能を検証する。その後に棋譜・受信・表示・総合検証へ進む。
