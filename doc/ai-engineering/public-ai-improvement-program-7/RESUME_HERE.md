# PBAI-P7 — 再開位置

P7は`COMPLETE / TECHNICAL-INVALID / HOLD`で終了している。新しい対局や同じrunの再実行は行わない。

## 最初に確認する記録

1. [現在の状態](CURRENT_STATUS.md)と[正式結果](../../../artifacts/pbai-p7/final-result.json)
2. [最終報告](PROGRAM_FINAL_REPORT.md)の検算停止と原因調査
3. [再現性](REPRODUCIBILITY_INDEX.md)と[成果物索引](../../../artifacts/pbai-p7/final-evidence-index.json)
4. [判断台帳](DECISION_REGISTER.md)と[公開状態](RELEASE_REGISTER.md)

保存済みarchiveの読取専用確認は可能である。`RUN_STARTED.json`を削除しない。終了後の診断成功を正式検算成功に読み替えず、元のソースと結果を保持する。

次に独立検証を行う場合は、JSON往復の0／−0契約と回帰試験を事前に整備し、P7の全生成情報を既知として除外する新規seedの別Programにする。P7を修正して同じ標本を取り直すことはしない。

作業ブランチは`engineering/pbai-p7-logic-inference`。[PR #123](https://github.com/nkkmd/bao-la-kiswahili-game/pull/123)はP6のPR #122に依存する。main統合と公開切替は今回の作業に含まれず、実施していない。
