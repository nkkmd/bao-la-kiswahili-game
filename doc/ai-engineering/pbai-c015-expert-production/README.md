# PBAI-C015-v1：expert本番組込みと配信

## 現在状態

expertは[正式採用済み](../public-ai-improvement-program-11/ADOPTION.md)である。ユーザーから本番組込み・main統合・配信・AI-GEN4昇格を進める明示指示を受け、本番用publicへの接続を行う。Cloudflareの配信操作はユーザーが担当する。

本番用コードを用意し、関連Node21試験が合格した。3ブラウザで本番用publicそのものの確認を実施し、合格後にmainへ統合する。ここでは配信前の状態を記録しており、本番配信確認・AI-GEN4昇格・新しいAI世代release ID発行は未実施である。

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
