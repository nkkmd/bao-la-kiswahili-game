# 第3版の停止・終了処理の技術検証

PR #202の本文に第3版の修正説明があったが、再開時に確認したhead `67984fa90b305cb8092f80d8b74392b94a659fcb`には第3版のコード・再開文書がなかった。PR #203の証拠保存head `750103001fc20ebba3c824b52b2c61c509d95822`から新しい技術版を作成する。未保存の修正を取得したとは扱わず、旧実装・原manifest・全10原artifactを保持する。

未完成workerによる最終書込みの拒否、session停止とtransport停止の結合、成功条件の判定失敗時のtimer/watch終了を検証する。既知抽象FIRST-48だけを処理し、科学sourceは生成しない。新旧の結果を混同しない。

- [固定した技術契約](TECHNICAL_CONTRACT.md)
- [安全な再開位置](RESUME_HERE.md)
- [前工程の原証拠・失敗一覧](../befcs-remote-review-20261014/REPORT.md)
- [固定入力一覧](SOURCE_MANIFEST.json)

実Git・親cgroupの結果は実行完了後に別の報告へ保存する。この入口の作成時点では未確認であり、ローカル検査の合格を実環境合格へ昇格しない。BEFCS-STUDY1は未登録・未実行、科学seed消費0・科学leaseなしを維持する。科学実験の開始条件は開放しない。
