# PBAI-P9：標準持ち時間とWorker起動条件の検証

現在の公開AIは[AI-GEN4](../ai-gen4-release/README.md)（`AI-GEN4-RELEASE-001`）です。本書の公開系統・配信状態・未確認事項は、このプログラムと当時の確認範囲の記録です。後続の採用・配信によって、このプログラムの正式結果や凍結証拠は変更しません。

検証は完了した。P8と同じ論理ゲート候補PBAI-C015-v1は、標準500ms・最大深さ8・毎手Worker起動のNode検証で256局151勝105敗、勝点率58.984375%、95%区間55.078125〜62.890625%となり、事前条件を通過した。正式判断は `STRENGTH-IMPROVED-IN-COLD-WORKER-DOMAIN` である。

全352局・10329手と採用元176局面の検算も通過した。Chromiumの既知局面78件は合格したが、これはブラウザでの勝率試験ではない。スマートフォン実機とexpert設定は未確認であり、公開状態は `NO-RELEASE / KEEP-AI-GEN3` を維持する。

最初に[最終報告](PROGRAM_FINAL_REPORT.md)を読み、[現在の状態](CURRENT_STATUS.md)、[検証計画](PROTOCOL.md)、[再現性](REPRODUCIBILITY_INDEX.md)、[作業記録](RESEARCH_LOG.md)、[再開位置](RESUME_HERE.md)へ進む。[作業範囲](AUTHORIZATION.md)と[判断台帳](DECISION_REGISTER.md)に、検証成功と公開採用の区別を記録した。
