# PSRRE-STUDY1 — 研究ディレクトリ案内

`PSRRE-STUDY1`はG2-10とG2-11の間に置かれた、新規・prospective・独立のstrategic representation prerequisite Studyである。新しいG2-xx labelは追加していない。

正式題目: **Prospective Strategic-Regime Representation Eligibility Study 1**

日本語題目: **Baoにおける戦略状態・regime表現の新規構築とprospective eligibility検証 — G2-11長期戦略遷移研究に先立つfresh evidenceベースの独立representation prerequisite**

## 最終状態

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NON-ESTIMABLE
G2-11 candidate input authorized = false
G2-11 scientific execution authorized = false
```

Stage 1は技術的にvalidで、production / independent full-exact verificationとresource gateをPASSした。しかし、prospectively fixed minimum 20 nonzero-MAD featuresに対して15でreadiness failureとなったため、representationをfreezeしていない。

## 最初に読む文書

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的・技術的な統合正本
3. [`results/STUDY_1_FINAL_RESULT.json`](results/STUDY_1_FINAL_RESULT.json) — machine-readable canonical result
4. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 最終状態
5. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — source / workflow / artifact / hash索引
6. [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — prospective decisionとclosure判断
7. [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — chronology
8. [`RESUME_HERE.md`](RESUME_HERE.md) — closed Studyとしての再開境界

Prospective設計の正本:

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`](UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md)
- [`prereg/`](prereg/) — Stage 0 / Stage 1 / Stage 2のfrozen machine-readable contract

Execution / result provenance:

- [`authorizations/`](authorizations/) — technical / scientific authorization ledger
- [`results/`](results/) — repository-facing result indexとcanonical result
- [`checkpoints/`](checkpoints/) — study-startからclosureまでのcheckpoint

## G2-10との境界

`UMSSR-STUDY1`の40-feature / deterministic K-means `K=2..6` contract、threshold、formal decision、consumed Stage 1 seeds、unconsumed Stage 2 seedsは変更していない。本StudyはG2-10のsame-Study rescueではない。

## G2-11との境界

本Studyはfrozen representationを生成できなかったため、G2-11 candidate inputをauthorizeしていない。transition matrix、long-horizon persistence / recurrence、bottleneck / transient structure、trajectory prevalence、transition asymmetry等のG2-11 outcomeは本Studyのrepresentation selectionに使用していない。

G2-11を今後実施する場合は、本Studyのunvalidated representationを流用せず、representation dependencyを含む新しいprospective decisionが必要である。

## no-rescue

Stage 1 seeds `29510001..29514096`はconsume-onceで消費済みであり、同block rerun / repair / replacement / extensionはしない。threshold緩和、feature差替え、family/K追加、favorable subgroupによる救済もしない。

Stage 2 seeds `29610001..29618192`は`RESERVED_UNCONSUMED`のままである。Stage 2を本Studyへpost-hoc authorizeしない。
