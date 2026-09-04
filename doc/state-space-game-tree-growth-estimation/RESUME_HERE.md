# SSGTGE-STUDY1 — Resume Here （ここから再開）

再確認する場合は、次の順に読む。

1. `CURRENT_STATUS.md`
2. `STUDY_1_FINAL_REPORT.md`
3. `results/STUDY_1_FINAL_RESULT.json`
4. `results/STAGE_1_TECHNICAL_INVALID_RESULT.json`
5. `DECISION_REGISTER.md`
6. `REPRODUCIBILITY_INDEX.md`
7. `RESEARCH_LOG.md`
8. `STUDY_1_PROTOCOL.md`

現在の安全な状態:

```text
baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
research branch integration head = 741ba02ffa944a9569b262841465bfc78db8220a
Study status = COMPLETE
formal decision = TECHNICAL-INVALID
Stage 0 v1 = STAGE0-TECHNICAL-INVALID / no rerun
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID / no same-evidence rerun
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
canonical selectedEstimator = null
fresh depth 10/11 = not generated / not read
central documentation = SYNCHRONIZED
main integration = COMPLETE
G2-11 = NOT-AUTHORIZED / unchanged
```

Stage 1のproduction実装はE2を提案したが、必須のindependent verificationが固定済みtolerance `1e-12`の条件で失敗した。この提案は診断専用であり、Stage 2へ引き渡してはならない。

このStudy内でStage 1 verifierやtoleranceを修正し、同じdevelopment evidenceを再実行してはならない。再検証には新しいprospective Studyまたは明示的なnew versionが必要である。

中央文書は統合前にresearch branch上で同期した。最終監査で`main`が`c5efcdb7972d1bc775a2857c1b0641c35c9df622`、research branchが`741ba02ffa944a9569b262841465bfc78db8220a`、比較結果が`ahead 16 / behind 0`であることを確認した後、利用者が統合を明示的に承認した。`main`はforceを使わずresearch branch headへfast-forwardし、その後に統合済み状態を示す文書を`main`上で更新した。

closure済みのこのStudyでは、追加のscientific executionを承認していない。growth estimatorを再検証する場合は、新しいprospective Studyまたは明示的なnew versionとして開始する。G2-11は、未解決のstrategic representation dependencyにより別途blockされたままである。
