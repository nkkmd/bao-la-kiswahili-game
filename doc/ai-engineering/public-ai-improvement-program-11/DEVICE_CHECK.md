# PBAI-P11：スマートフォン実機の確認手順

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
