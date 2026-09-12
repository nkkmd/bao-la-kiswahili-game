# PBAI-P11：進捗照会と引継ぎ

## 実機所見確認後の現在状態

ユーザーから約20分の実機確認で全項目に問題なしとの回答を受け、[expert正式採用](ADOPTION.md)を`PBAI-C015-EXPERT-ADOPTION-001 / ADOPT`として記録した。後続の[本番組込み・main統合・配信](../pbai-c015-expert-production/README.md)と[AI-GEN4正式昇格・表示配信確認](../ai-gen4-release/README.md)も完了した。以下の採用保留・所見待ちは、実験終了時点の判断と採用前の履歴として保持する。

## 現在の確認先

正式試験・実機所見確認・採用から表示配信確認まで完了しており、進行中の試験や所見待ちはない。公開状態と切戻しは[AI-GEN4の記録](../ai-gen4-release/README.md)、試験の証拠は[最終報告](PROGRAM_FINAL_REPORT.md)を確認する。使用済みseedの対局や時間測定を再実行しない。

## 採用前の確認位置（履歴）

正式対局・検算は完了し、`EXPERT-STRENGTH-PASS / ADOPTION-PENDING`である。証拠は`artifacts/pbai-p11/results`へ保全済み。実機用コピーの3ブラウザ確認も完了した。約20分の実機報告とhard・expert各1件の診断を受領した。次は[実機手順](DEVICE_CHECK.md)に記録した使用感・各操作の所見の確認であり、対局の再実行ではない。[最終報告](PROGRAM_FINAL_REPORT.md)と[組込み準備](INTEGRATION_PREPARATION.md)を先に読む。以下の実行照会手順は出自確認のために保持する。

GitHubの`engineering/pbai-p11-expert-validation`ブランチに保存した実行結付けファイル`AUTHORIZATION.json`を読み、run ID、凍結commit、SPECとSOURCE_LOCKのhashを照合する。未作成なら正式試験は未結付けである。結付け後は対象runだけを確認し、後続commitによる対局未許可の別runを本試験と混同しない。

実行一覧とジョブ状態を読み、最後に成功したバッチ、実行中バッチ、終了ジョブを確認する。8ペア単位の途中保存を正式な進捗根拠とし、実行中ジョブから未保存の局数を推測しない。開始記録は`pbai-p11-checkpoint-initial`にある。

## 実行当時の完了・中断時の手順

正常終了または失敗時の`pbai-p11-final-evidence`を取得し、`FINAL_RESULT.json`、`REPORT.md`、`EVIDENCE_INDEX.json`と圧縮証拠を照合する。GitHubの緑表示だけで棋力合格と判断しない。3設定の独立検算結果と全棋譜の再生合格を確認する。

終了artifactがなければ未確認・中断として最後の保存点とジョブログを保全する。消費済みseedで対局を再実行しない。GitHubの再実行ボタン、run ID差替え、部分局の時間再測定は禁止する。照会・hash検算・文書更新は継続してよい。

artifactの保存設定は途中7日・終了30日なので、取得できるうちに証拠をリポジトリへ保全する。終了後は結果を日本語で報告し、実機未確認、採用未実施、組込み未実施、main未統合、未配信、未昇格を区別する。

## 実施済みの実機確認手順（履歴）

棋力合格後は試験用expertをスマートフォンで約20分利用し、端末・OS・ブラウザ、診断で実際の深さと予算、応答待ち時間、連続対局時の遅延・発熱・停止を記録する。思考中の新規対局、難易度切替、Worker経路と利用できない場合の復帰を確認する。直接同期探索中は操作が即時に処理されない既存制約を明記する。具体的な試験用URLと操作手順は採用準備時に提示する。hardの過去実機報告をexpertへ転用しない。
