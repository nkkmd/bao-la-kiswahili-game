# `PBAI-P14` — 現在状態

更新日: 2026-09-28

```text
PBAI-P14 = COMPLETE / NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4
baseline = AI-GEN4-BASELINE-2026-09-28-v1
source commit = 22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b
baseline support = PASS / run 36408095064 / 111 samples
candidate ID = PBAI-C017-v1
development = PASS / run 36409930392 / 104 paired samples
mechanical applyMove reduction = 18,686 / 318,039 baseline calls
performance validation = VALID / run 36411624798 / 106 samples / 2.9795% estimated reduction
prospective performance gate = FAIL / point-estimate threshold 3.0%
strength comparison = NOT-AUTHORIZED / NOT-EXECUTED
release holdout = NOT-AUTHORIZED / NOT-EXECUTED
candidate main integration = NONE
public default change = NONE
public lineage = AI-GEN4
public release = AI-GEN4-RELEASE-001
```

固定depthの探索出力同値性、seed coverage、計時の技術条件はPASSしたが、未計装wall-clock削減の点推定が事前固定3.0% gateをわずかに下回った。区間が正側でも独立した点推定gateを緩和しない。P14は再試験・強度比較・release holdoutへ進まず終了する。終了文書と結果データのmain反映は、候補実装の採用や公開既定の変更を意味しない。

[最終報告](PROGRAM_FINAL_REPORT.md)に全工程の判断、[wall-clock結果](../../../artifacts/pbai-p14/C017_PERFORMANCE_002_RESULT.md)、[canonical data](../../../artifacts/pbai-p14/c017-performance-002.json)、[開発結果](../../../artifacts/pbai-p14/C017_DEVELOPMENT_RESULT.md)を記録した。候補仕様は[`CANDIDATE_SPEC.md`](CANDIDATE_SPEC.md)、判断履歴は[`DECISION_REGISTER.md`](DECISION_REGISTER.md)を参照。