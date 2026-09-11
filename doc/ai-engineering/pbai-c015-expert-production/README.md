# PBAI-C015-v1：expert本番組込みと配信

## 現在状態

expertは[正式採用済み](../public-ai-improvement-program-11/ADOPTION.md)である。ユーザーから本番組込み・main統合・配信・AI-GEN4昇格を進める明示指示を受け、本番用publicへの接続を行う。Cloudflareの配信操作はユーザーが担当する。

本番用コードと関連Node21試験、3ブラウザの各10項目が合格し、[PR #130](https://github.com/nkkmd/bao-la-kiswahili-game/pull/130)をmainへ統合した。統合commitは`b0d76af2c446c032b455a597df2232c25681e78b`。現在はユーザーによる本番配信待ちである。本番配信確認・AI-GEN4昇格・新しいAI世代release ID発行は未実施である。[機械可読の状態記録](DEPLOYMENT.json)と[公開22ファイルの照合一覧](PUBLIC_MANIFEST.json)を併記する。

## 本番組込みの検証結果

検証対象commitは`f90e05c5d2665305082fd4c9b374328b5d531170`。[本番組込み確認](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/34546157560)と[AI-GEN3正式資産検証](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/34546157394)はともに成功した。公開画面・連続応答・取消・難易度変更・通信不能時のキャッシュ・expertだけの切戻し・Worker代替実行・候補とモデルの取得失敗を確認した。

| 自動ブラウザ | バージョン | 結果 |
| --- | --- | --- |
| Chromium | 151.0.7922.34 | [10項目合格](../../../artifacts/pbai-c015-expert-production/chromium.json) |
| Firefox | 153.0 | [10項目合格](../../../artifacts/pbai-c015-expert-production/firefox.json) |
| WebKit | 26.5 | [10項目合格](../../../artifacts/pbai-c015-expert-production/webkit.json) |

これは今回の本番用publicに対する自動確認であり、新しい棋力改善の証拠や本番サイトでの実機対局報告ではない。スマートフォンについてはP11で受領した実機用コピーの約20分の報告を引き継ぐ。本番での再対局、実機のピークメモリ、実機オフライン操作は確認済みとは扱わない。

## ユーザーによる配信と再開手順

Cloudflareの本番プロジェクトで、mainの上記統合commit（またはpublicの内容が同一と確認された後続commit）を配信する。配信対象ディレクトリは`public`一式、全22ファイル。既存のビルド設定を使い、実機用ZIPや実機コピー生成器は使わない。配信先は`https://bao-la-kiswahili.cultivationdata.net/`である。

配信完了の連絡を受けたら、PUBLIC_MANIFEST.jsonの全ファイルを取得して照合する。CloudflareがHTML等へ追加する部分は、完全一致と区別して内容を確認する。候補有効化・expert採用判断ID・キャッシュv36が反映されたことを記録してから、承認済みのAI-GEN4正式化へ進む。表示更新を含む次の配信もユーザーへ依頼する。現在のAI-GEN3表示は、配信確認前に昇格を記録しないための意図した状態である。

## 本番用の変更

変更する公開ファイルは`public/ai-release.js`と`public/service-worker.js`の2ファイル。expertの既定bao／phase2構成で候補を使用し、表示用の採用判断IDを`PBAI-C015-EXPERT-ADOPTION-001`とする。hardの採用判断IDは保持する。easy・normalは基準AIを使う。

expertの既定設定は独立した`PBAI_C015_EXPERT_ENABLED`で管理する。候補フラグを明示するプログラムからの要求は従来の公開アダプターと同様に処理し、既定設定の無効化とAPIの明示指定を混同しない。対象外profile・独自重み・補正では候補を使わない。候補やモデルの取得失敗時は基準AIへ戻る。

キャッシュ名は`bao-la-kiswahili-v36`。配信対象は固定commitのpublic一式であり、変更2ファイルだけの部分配信は行わない。AI-GEN3の正式資産5ファイル、候補探索本体、モデルは変更していない。新しいNode確認では実機用ZIPのhashを確認し、全難易度・3設定の探索条件と既知9局面のexpert結果が実機確認済みコピーに一致することを確認した。

## 回帰と過去の証拠

既存の公開アダプター試験は採用範囲をhard・expertへ更新し、hardの凍結参照との一致を維持した。AI-GEN3の5資産hash検証は変更していない。現行キャッシュ番号を検査する2試験のみv36へ更新した。候補の内部性能や棋力を測り直していない。

P10・P11の凍結SPEC・SOURCE_LOCK・ソース・モデル・判断・seed・結果は保持する。本番更新により現在のpublicと過去のSOURCE_LOCKは一致しなくなるため、過去の検算・実機コピー作成はそれぞれの記録されたcommitで行う。P11正式実行の再現元は`0dd3bb6daf19bf00803d43c91bc832fb38d0213f`、実機用生成器と試験の確認元は`9167a420a1ea6362bf67e182c0f040607406f71b`である。古いhashを現行publicに合わせて書き換えない。

## 配信とAI-GEN4の順序

1. 本番用publicの3ブラウザ確認と回帰を完了し、mainへ統合する。
2. ユーザーが指定されたmain commitのpublic一式を本番サイトへ配信する。実機確認用ZIPは本番へ配信しない。
3. [本番サイト](https://bao-la-kiswahili.cultivationdata.net/)の配信内容を今回のmanifestと照合する。hard・expertの候補有効化、expert採用判断ID、v36の取得を確認する。
4. 配信内容の確認後に正式AI-GEN4のrelease IDを発行し、表示・世代規則・文書を更新する。その表示更新をmainへ統合した後、ユーザーに再度配信を依頼し、世代表示の配信も確認する。

AI-GEN4はhard・expertへの論理ゲート型評価器採用を示す世代として定義し、easy・normalの従来構成を明記する。採用判断IDとAI世代release ID、アプリのバージョンタグを混同しない。昇格自体の承認は今回のユーザー指示で得ており、配信前に昇格済みと記録しない。

## 切戻し

expertだけを戻す場合は`PBAI_C015_EXPERT_ENABLED`をfalseへ変更し、配信中と異なる新しいキャッシュ名でpublic一式を配信する。hard用の`PBAI_C015_ENABLED`はtrueを維持する。ブラウザ試験ではv36からv37への更新として確認するが、実際の切戻し時にはその時点で未使用の番号を選ぶ。

## 文書品質

対象は本書とルートREADME・中央索引の現在状態の変更箇所。英語だけの通常説明文・説明見出し、相対リンク切れ、意図しない凍結情報変更は0件。コード・ID・hashは正確な識別子として保持する。過去の実機報告とP11の正式判断は変更していない。
