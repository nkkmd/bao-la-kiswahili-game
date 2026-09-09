# PBAI-P7 — 論理ゲート推論の軽量化と棋力検証

P6の学習済みモデルの出力を変えずに推論を軽量化し、同じ持ち時間でAI-GEN3を強化できるか検証した。再学習は行っていない。

正式状態は`COMPLETE / TECHNICAL-INVALID / HOLD`。旧推論実装に対して約10倍の評価速度と、最終512局で300勝212敗を観測したが、保存済み数値の0と−0を区別する検算が停止したため、正式な棋力改善とは認定しない。終了後の原因調査ではゼロ符号差2件を確認し、その差だけを許容した全件照合は通過した。元の無効判定を取り消す追加検算ではない。

公開AIは`AI-GEN3 / AI-GEN3-RELEASE-001`を維持する。P6のPR #122に依存する[PR #123](https://github.com/nkkmd/bao-la-kiswahili-game/pull/123)へ保存し、main統合と公開切替は行っていない。

## 読む順序

1. [最終報告](PROGRAM_FINAL_REPORT.md) — 測定値、検算停止、解釈の限界
2. [現在の状態](CURRENT_STATUS.md)と[判断台帳](DECISION_REGISTER.md)
3. [開始レビュー](AUTHORIZATION_REVIEW.md)と[事前固定条件](PROTOCOL.md)
4. [成果物](../../../artifacts/pbai-p7/README.md)と[再現性](REPRODUCIBILITY_INDEX.md)
5. [再開位置](RESUME_HERE.md)と[品質監査](QUALITY_AUDIT.md)
