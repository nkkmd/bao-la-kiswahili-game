# 公開Bao AI改善Program 2（`PBAI-P2`）

正式題目: `Generation-2 Evidence-Informed Public Bao AI Improvement Program 2`
実施日: 2026-09-01
状態: **`COMPLETE / KEEP-AI-GEN2`**

`PBAI-P2`は、完了済みResearch Generation 2の確定済み証拠と不確実性だけを入力として、公開Bao AIの改善候補を評価した独立Programです。`PBAI-P1`の再開・延長ではありません。

4 candidateを事前に固定したengineering gateで評価しましたが、validationへ進む候補はありませんでした。そのため公開系統`AI-GEN2`を維持し、Programを完了しています。

## 最初に読む

1. [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md) — Program全体の最終判断
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の正式状態
3. [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md) — candidate台帳
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 判断とno-rescueの記録
5. [`RELEASE_REGISTER.md`](RELEASE_REGISTER.md) — 公開・release状態

## Programの結論

```text
PBAI-P2 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
formal ADOPT = none
validation executions = 0
release holdout executions = 0
public deployments = 0
```

`KEEP-AI-GEN2`は、採用条件を満たす候補がない場合に事前に許可された正式結果です。結果確認後にthreshold、seed、control、subgroup、mechanismを変更して候補を救済していません。

## 使用した証拠とhard firewall

```text
G2 scientific evidence cutoff
= cd200b85c1eb24aa4419bd5a9573552f3682f00d

baseline
= AI-GEN2-BASELINE-2026-09-01-v1

global gates
= PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1

Research Generation 3 influence
= ZERO
```

Research Generation 3のresult、diagnostic、measurement、hypothesis、candidate ideaは、PBAI-P2のcandidate設計・selection・threshold・validation・interpretationへ使用していません。詳細は[`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)を参照してください。

## Candidateの最終状態

| Candidate | 最終状態 | 判断理由の要約 |
| --- | --- | --- |
| `PBAI-C006-v1` | `WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED` | frozen support universeに、実装を正当化するidentity defectが見つかりませんでした。 |
| `PBAI-C007-v1` | `NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION` | same-key TT eventのsupport floorを満たしませんでした。 |
| `PBAI-C008-v1` | `DEVELOPMENT-BENEFIT-FAIL-HOLD / CLOSED` | quality / safety gateはPASSしましたが、cost gateを2件ともFAILしました。 |
| `PBAI-C009-v1` | `TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED` | negative-control gateとprimary benefit gateをFAILしました。 |

### `PBAI-C006-v1` — 判断

```text
semantic unique RAW states = 389148
semantic collision witnesses = 0
natural reachable collision witnesses = 0
Worker stale-identity witnesses = 0
local evaluation-cache collision events = 0
local TT collision events = 0
implementation = NOT AUTHORIZED
```

この結果は、`pending`をRAW identityから除外してよいことや、全Bao到達状態にcollisionが存在しないことを意味しません。

### `PBAI-C007-v1` — 判断

```text
same-key TT store events = 16512
incoming shallower-than-existing overwrite events = 0
roots with such event = 0
later potential depth-benefit hits = 0
required support floor = 32 events / 16 roots
```

対象事象が不足したため、candidate実装を作らず`NON-ESTIMABLE-HOLD`で閉じました。

### `PBAI-C008-v1` — 判断

predevelopment supportとfeature-off exact equivalenceを通過し、71 development eligible rootsで評価しました。quality / safety metricsはPASSしましたが、計算costが固定上限を超えました。

```text
TopSet agreement delta = +0.2957746478873239 PASS
mean normalized rank-loss delta = -0.19413145539906107 PASS
median node ratio = 2.1004464285714284 FAIL <= 1.60
p95 node ratio = 3.079245283018868 FAIL <= 2.50
```

quality signalを理由にcost thresholdを緩和していません。

### `PBAI-C009-v1` — 判断

predevelopment supportと256-comparison feature-off exact equivalenceを通過し、128 eligible rootsと64 negative controlsをproduction / independentの2実装で再構築しました。

```text
TopSet agreement delta = +0.015625 FAIL >= +0.03
mean normalized rank-loss delta = +0.003924851190476197 FAIL <= -0.01
severe-loss-rate excess = -0.015625 PASS
catastrophic new loss = 0 PASS
median node ratio = 1.0140845070422535 PASS
p95 node ratio = 1.3620689655172413 PASS
negative-control failures = 18 FAIL = 0
technical failures = 0 PASS
```

technical failureが0でも、negative controlとbenefitの必須条件が未達のためvalidationへ進めませんでした。

## Stageの最終状態

| Stage ID | 役割 | 最終状態 |
| --- | --- | --- |
| `PBAI-P2-A` | G2 evidence監査とG3 firewall | `COMPLETE` |
| `PBAI-P2-B` | 公開AI監査とbaseline再固定 | `COMPLETE` |
| `PBAI-P2-C` | global gate・fresh split・inventory固定 | `COMPLETE` |
| `PBAI-P2-D` | candidate-specific supportとexact contract | `COMPLETE` |
| `PBAI-P2-E` | isolated development評価 | `COMPLETE` |
| `PBAI-P2-F` | fresh independent validation | `NOT-AUTHORIZED / NOT-EXECUTED` |
| `PBAI-P2-G` | protected release holdoutと`ADOPT`判断 | `NOT-AUTHORIZED / NOT-EXECUTED` |
| `PBAI-P2-H` | public-default deploymentと`AI-GEN3`昇格 | `NO DEPLOYMENT` |

## 保護されたsplit

```text
development decision roots 424xxxxx = ACCESSED under frozen development contracts
validation decision roots 425xxxxx = NOT ACCESSED
release holdout decision roots 426xxxxx = NOT ACCESSED
```

validation / holdoutを見ていないため、それらをnegativeまたはnull resultとして扱いません。

## 正本と再現資料

- [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md) — 世代間の証拠分離
- [`GENERATION_2_EVIDENCE_AUDIT.md`](GENERATION_2_EVIDENCE_AUDIT.md) — 使用したG2証拠
- [`BASELINE_SPEC.md`](BASELINE_SPEC.md) — `AI-GEN2` baseline
- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md) — 評価手順
- [`candidates/PBAI-C008-v1-development-result.json`](candidates/PBAI-C008-v1-development-result.json) — C008 result
- [`candidates/PBAI-C009-v1-development-result.json`](candidates/PBAI-C009-v1-development-result.json) — C009 result
- [`RESUME_HERE.md`](RESUME_HERE.md) — closure後の引き継ぎ

Initial inventory `PBAI-C006-v1..PBAI-C009-v1`は全件closedです。将来のAI改善はPBAI-P2を延長せず、新しいProgram ID、evidence cutoff、baseline、fresh split、candidate inventory、acceptance gateを事前に固定して開始します。
