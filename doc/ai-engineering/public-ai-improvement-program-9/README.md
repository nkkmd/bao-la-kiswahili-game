# PBAI-P9：標準持ち時間とWorker起動条件の検証

P8と同じ論理ゲート候補PBAI-C015-v1について、標準500ms・毎手Worker起動の条件でAI-GEN3への強化が続くかを検証する。Chromiumの既知局面78件は合格し、新規対局の条件固定を進めている。

読む順序は[現在の状態](CURRENT_STATUS.md)、[検証計画](PROTOCOL.md)、[再現性](REPRODUCIBILITY_INDEX.md)、[作業記録](RESEARCH_LOG.md)、[再開位置](RESUME_HERE.md)とする。[作業範囲](AUTHORIZATION.md)に従い、公開AIは変更しない。

Nodeでの新規対局は最大352局で、主要判定はそのうち標準設定256局を使う。ブラウザの互換性試験と新規対局は別の証拠である。スマートフォン実機とexpert設定は未確認であり、自動的に公開採用へ進まない。

[検証ページ](../../../tools/engineering/browser/pbai-p9/index.html)はHTTPで配信して使う。既知の9局面だけを対象とし、結果は保存ボタンから取得できる。
