# `PBAI-P3` — 現在の状態

更新日: 2026-09-05

Program: `Generation-3 Evidence-Informed Public Bao AI Improvement Program 3`

状態: **`COMPLETE / KEEP-AI-GEN2`**

`PBAI-P3`はprospective contractを凍結した後、`PBAI-P3-D` baseline-only support / reachability auditを1回実行しました。独立再構成は完全一致しましたが、top-3 probe completionが凍結gateを満たさなかったため、唯一の候補`PBAI-C010-v1`を実装せず閉じました。Program outcomeは`KEEP-AI-GEN2`です。

## 現在の正式状態

```text
PBAI-P3-A = COMPLETE / EVIDENCE CUTOFF FROZEN
PBAI-P3-B = COMPLETE / BASELINE FROZEN
PBAI-P3-C = COMPLETE / CONTRACT FROZEN
PBAI-P3-D = COMPLETE / SUPPORT-FAIL
PBAI-P3-E = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-F = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-G = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-H = NOT-AUTHORIZED / NOT-EXECUTED
PBAI-P3-I = NOT-AUTHORIZED / NOT-EXECUTED
candidate identifiers issued = 1 / PBAI-C010-v1
candidate implementations = 0
support executions = 1
benchmark executions = 0
validation executions = 0
release holdout executions = 0
public deployments = 0
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

`KEEP-AI-GEN2`はPBAI-P3の最終判断です。`PBAI-C010-v1`のformal dispositionは`HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION`で、formal `ADOPT`はありません。

## 固定済みidentity

```text
Program ID = PBAI-P3
formal title = Generation-3 Evidence-Informed Public Bao AI Improvement Program 3
initial authorization decision = AUTHORIZED-FOR-PROGRAM-INITIALIZATION-ONLY
latest completed stage = PBAI-P3-D / SUPPORT-FAIL / CLOSED
scientific evidence cutoff = 479bc3d3a9b6c745e37a88529732180e8690d6b3
initialization main = 1d57e7e1877c6ad00f45230d52c528a426abe25d
baselineId = AI-GEN2-BASELINE-2026-09-05-v1
working branch = engineering/pbai-p3-d-support-audit
```

`initialization main`と`scientific evidence cutoff`は異なる役割を持ちます。前者は開始時点の運用・source状態、後者はcandidate設計へ利用できる科学証拠の上限です。

## 公開AIの状態

`main/public/`の8 bound filesはPBAI-P2 baselineとbyte-identicalであり、repository上の公開用sourceは`AI-GEN2`です。candidate sourceは存在せず、公開defaultも変更していません。

公開endpointはCloudflare Pagesとして文書化されていますが、provider deployment IDと配信中assetのbyte identityをrepositoryまたはGitHub metadataだけから独立確認できませんでした。この観測上の空白は[`BASELINE_SPEC.md`](BASELINE_SPEC.md)へ記録し、公開判断前のfail-closed条件とします。

## 科学上の境界

- Research Generation 3のformal conclusionは不変です。
- PBAI-P3のengineering resultで過去Studyを再判定しません。
- higher-resource searchをground truth、engine scoreを勝率とみなしません。
- root widthやranking churnを人間の難しさと同一視しません。
- validated transform setは`[]`であり、未検証のsymmetry / canonicalizationを使用しません。
- `G3-12`からformal generalizationまたはcounterexample decisionを導きません。

## 最終support結果

```text
candidate inventory = PBAI-P3-INITIAL-CANDIDATE-INVENTORY-2026-09-05-v1
candidate = PBAI-C010-v1 only
support spec = PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-2026-09-05-v1
global gate = PBAI-P3-C-GLOBAL-GATES-2026-09-05-v1
execution commit = 3015ca39346901de8172677383331e4965871b68
trigger roots = 1164 / PASS
probe-complete roots = 23 total / Namua 6 / Mtaji 17 / FAIL
independent verification = PASS / exact aggregate match
candidate disposition = HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
```

詳細は[`SUPPORT_REACHABILITY_RESULT.md`](SUPPORT_REACHABILITY_RESULT.md)と[`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md)を参照してください。工学判断の時系列は[`DECISION_REGISTER.md`](DECISION_REGISTER.md)、公開系統と配備の判断は[`RELEASE_REGISTER.md`](RELEASE_REGISTER.md)に分離しています。

## 現在の作業境界

PBAI-P3内の次作業はありません。candidate実装、development benchmark、validation、release holdout、公開変更、deployment、`main`統合は認可されていません。新しいProgramを検討する場合は、新しいIDとevidence cutoffによる開始認可レビューから始めます。
