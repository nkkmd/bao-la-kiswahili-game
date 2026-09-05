# `PBAI-P3` — 再開位置

更新日: 2026-09-05

状態: **`COMPLETE / KEEP-AI-GEN2`**

## 1. 最初に読む

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
3. [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)
4. [`SUPPORT_REACHABILITY_PROTOCOL.md`](SUPPORT_REACHABILITY_PROTOCOL.md)
5. [`SUPPORT_REACHABILITY_RUNBOOK.md`](SUPPORT_REACHABILITY_RUNBOOK.md)
6. [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
7. [`GENERATION_3_EVIDENCE_AUDIT.md`](GENERATION_3_EVIDENCE_AUDIT.md)
8. [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)
9. [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
10. [`SUPPORT_REACHABILITY_RESULT.md`](SUPPORT_REACHABILITY_RESULT.md)
11. [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md)
12. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
13. [`RELEASE_REGISTER.md`](RELEASE_REGISTER.md)
14. [`checkpoints/2026-09-05-p3-d-support-closure.md`](checkpoints/2026-09-05-p3-d-support-closure.md)
15. [`checkpoints/2026-09-05-pre-main-documentation-and-workflow-readiness.md`](checkpoints/2026-09-05-pre-main-documentation-and-workflow-readiness.md)

## 2. 固定済み状態

```text
Program = PBAI-P3
formal title = Generation-3 Evidence-Informed Public Bao AI Improvement Program 3
scientific evidence cutoff = 479bc3d3a9b6c745e37a88529732180e8690d6b3
initialization main = 1d57e7e1877c6ad00f45230d52c528a426abe25d
baseline = AI-GEN2-BASELINE-2026-09-05-v1
PBAI-P3-A = COMPLETE
PBAI-P3-B = COMPLETE
PBAI-P3-C = COMPLETE / CONTRACT FROZEN
PBAI-P3-D = COMPLETE / SUPPORT-FAIL
PBAI-P3-E and later = NOT-AUTHORIZED / NOT-EXECUTED
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

## 3. 凍結済み契約

```text
candidate inventory = PBAI-P3-INITIAL-CANDIDATE-INVENTORY-2026-09-05-v1
candidate = PBAI-C010-v1 only
global gate spec = PBAI-P3-C-GLOBAL-GATES-2026-09-05-v1
support contract = PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-2026-09-05-v1
development / validation / release holdout split = FROZEN / UNREAD
candidate source = NONE
support run manifest = PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-RUN-2026-09-05-v1
support result = HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
benchmark result = NONE
```

未実行をnegative resultとして解釈しません。

## 4. 次の認可判断

PBAI-P3は終了しており、Program内の次作業はありません。唯一の候補はsupport不足で実装せず閉じ、Program outcomeは`KEEP-AI-GEN2`です。

新しいAI Engineering Programを検討する場合は、新しいProgram ID、evidence cutoff、fresh evidence、outcome非依存の開始認可レビューを必要とします。PBAI-P3のcandidate implementation、benefit benchmark、validation、release holdout、公開変更、`main`統合は行いません。

## 5. 変更禁止事項

- Research Generation 3のformal conclusionを変更しない。
- PBAI-P1 / PBAI-P2または`PBAI-C001..C009`を再開しない。
- `G3-12`を一般化根拠にしない。
- higher-resource searchをground truthとしない。
- engine scoreをBao勝率としない。
- 未検証のsymmetry / canonicalizationを使用しない。
- outcome依存のthreshold、endpoint、seed、subgroup変更をしない。
- 正式採用・公開配備前に`AI-GEN3`と呼ばない。
