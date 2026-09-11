# PBAI-P11：スマートフォン実機の確認手順

## 実機所見確認後の現在状態

ユーザーから約20分の実機確認で全項目に問題なしとの回答を受け、[expert正式採用](ADOPTION.md)を`PBAI-C015-EXPERT-ADOPTION-001 / ADOPT`として記録した。本番用組込み・main統合・本番配信・AI-GEN4昇格は未実施。以下の採用保留・所見待ちは本判断前の履歴として保持する。

## 2026年9月11日の実機報告受領

ユーザーから[試験用サイト](https://cdn-ts.pages.dev/)で実機試験を完了したとの報告を受領した。端末はmoto g52j 5G、Android 12、Chrome 152.0.7977.75、利用時間は約20分である。以下の未実施という説明は報告受領前の手順であり、現在は使用感・各操作の所見を確認中である。問題の有無やオフライン確認結果は今回の報告に明示されていないため推測しない。

[添付診断の原本](../../../artifacts/pbai-p11/device-report/bao-ai-review-20260911-082837.json)はhardとexpertの各1件。SHA-256は`6b3a7c00fcb73993dd051f1bfcf9e5350971608d3a2b8159a1015fb672250b17`。両件の着手は合法で、保存局面からの遷移も確認できた。expertでは`evaluationCandidate: PBAI-C015-v1`、`evaluationFallback: false`、探索時間3009.5ms、完了深さ9を記録している。

`timedOut: true`は時間制限に達して探索を終了したことを示す。完了深さ9は最大深さ14まで到達した意味ではなく、約3秒という観測だけから端末設定や要求の割当予算を確定しない。診断JSONには割当予算・端末能力・Worker経路・全体のピークメモリは含まれていない。`reason: unexpected-ai-move`は「AIの手を記録」ボタンが共通で付与する識別子なので、ユーザーが不具合を申告したと解釈しない。捕獲候補増加の自動信号も悪手の確定判断ではない。

[照合記録](../../../artifacts/pbai-p11/device-report/verification.json)のとおり、試験用サイトのPREVIEW.jsonと主要JavaScript7ファイルは配布ZIPのhashに一致した。現在のサイトが試験用構成であることを裏付けるが、実機利用時の全通信・キャッシュ内容やサイト全24ファイルの照合を完了したものではない。本番配信の確認でもない。

正式採用は`ADOPTION-PENDING`のまま。残る確認は、約20分の利用で応答・入力・新規対局・難易度切替・発熱などに問題がなかったかというユーザー所見である。未実施の項目は未確認として残す。

今回の監査対象は本追記と関連する状態説明。英語だけの説明見出し・通常説明文、相対リンク切れ、意図しない凍結情報変更は0件。原本JSONは保持し、上記の技術識別子を日本語で説明した。

## 確認するもの

expertの論理ゲート型評価器は棋力試験に合格したが、実機確認は未実施である。hardのmoto g52j 5G／Android 12／Chrome／約20分という過去報告をexpertの結果へ流用しない。ここでは生成した試験用コピーを使う。

## コピーの作成と試験用配信

作成済みの[実機確認用ZIP](../../../artifacts/pbai-p11/device-package/expert-preview.zip)も利用できる。これは3ブラウザ確認済みcommit `9167a420a1ea6362bf67e182c0f040607406f71b`から生成した24ファイルのコピーで、ZIPのSHA-256は`911db46a09366336b47ae400bdb0d231d735b451314e57d1d502f7cc496bd91c`。展開先のPREVIEW.jsonで出自と各ファイルのhashを確認できる。本番の配信対象ではない。

ブランチは`engineering/pbai-p11-expert-validation`、PRは[#129](https://github.com/nkkmd/bao-la-kiswahili-game/pull/129)。このブランチのpublicそのものは現在配信中と同じhard限定である。次の生成器が作るディレクトリがexpert確認用の対象になる。

```sh
node tools/engineering/prepare-pbai-c015-expert-preview.cjs
python -m http.server 8765 --directory artifacts/local/pbai-c015-expert-preview
```

同じLANのスマートフォンからPCのIPアドレスのポート8765を開く。既存ディレクトリを上書きしないため、作り直す場合は第1引数に別の空の保存先を指定する。HTTPのLAN配信ではService Workerが利用できない場合があり、PWA・キャッシュ更新の確認にはHTTPSが必要である。

Cloudflareを使う場合は、通常の公開サイトとは別の検証用プロジェクト／プレビューURLへユーザーが配信する。ブランチは上記、ビルドコマンドは`node tools/engineering/prepare-pbai-c015-expert-preview.cjs`、出力ディレクトリは`artifacts/local/pbai-c015-expert-preview`。完成コピーのZIPを使う場合は展開して同ディレクトリ相当の中身を配信する。既存の本番サイトを試験用コピーで上書きしない。

生成された`PREVIEW.json`は出自commit・ファイルhash・キャッシュ名を持つ。画面には「実機確認用」と表示され、expertの候補表示IDは`PBAI-P11-EXPERT-PREVIEW`となる。試験用URLとPREVIEW.jsonを保存する。sourceTreeDirtyがtrueのコピーは未コミット変更を含むため、正式な配信対象にはしない。

## 約20分の確認

1. 難易度「ムタアラム／Mtaalamu」（expert）を選ぶ。人間が後手で開始し、AIが着手することを確認する。人間が先手の場合も試す。
2. 数手ずつ続けて対局し、普段と比べた待ち時間、画面や入力の詰まり、停止、発熱を記録する。新規対局を繰り返し、後半で急に遅くならないか確認する。
3. AI思考中にNEW GAMEを押す。新しい対局に古い着手が混ざらず、再度開始できることを確認する。
4. normal・easyへ切り替え、AI-GEN3表示と着手を確認する。hardでは採用済み論理ゲート型の表示と着手を確認し、expertへ戻す。
5. 「AI改善用診断」を開き、expert着手後に「AIの手を記録」「記録を保存」を操作する。JSONに`evaluationCandidate: PBAI-C015-v1`、`evaluationFallback: false`があることを確認する。診断の実際の時間予算・深さも保存し、端末名だけから設定を推測しない。
6. HTTPSの試験用URLでは一度読み込んだ後に機内モードで再読込みし、expertが着手するか確認する。通信を戻した後も利用できることを確認する。LAN HTTPだけの場合はこの項目を未確認とする。

Workerの強制停止やモデル取得失敗は自動ブラウザで確認する。通常の実機操作で人工的に再現できなかった項目は、そのまま未実施と記録してよい。実機の直接実行経路を確認する場合は専用の検証条件を別途用意し、通常利用の報告と混同しない。

## 返していただく記録

- 試験用URL、PREVIEW.json、端末名、OS、ブラウザとバージョン、日時、利用時間。
- expert先手・後手、継続利用、新規対局、難易度切替の結果。
- 待ち時間の体感、操作の詰まり、停止・発熱の有無。
- 保存したAI診断JSON。保存できなければ画面と候補表示を確認した内容。
- オフライン・更新を実施したか、未確認か。

問題がなければ「上記の操作を約20分行い、問題なし」と報告できる。試していない項目は未確認のまま残す。報告を受けてから採用判断と次の配信対象を確定する。
