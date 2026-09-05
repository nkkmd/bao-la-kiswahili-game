# Bao公開AI改善の索引

更新日: 2026-09-05
現在の公開AI系統: **`AI-GEN2`**
完了済みProgram: **`PBAI-P1`、`PBAI-P2`**
進行中Program: **`PBAI-P3 / CONTRACT-FROZEN / PRE-SUPPORT`**

この文書は、公開中のBao AIを安全に改善するAI Engineeringの入口です。`PBAI-P1`と`PBAI-P2`は候補を事前に固定したgateで評価し、公開AIを変更せず`KEEP-AI-GEN2`で完了しました。`PBAI-P3`はResearch Generation 3の正式成果を設計入力とする独立Programとして、1件のinitial candidate inventoryとprospective gateを固定しましたが、support実行以降は未承認です。

科学研究の結果は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)と[`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)で管理します。engineering上の結果によって、研究Studyの正式判断を書き換えることはありません。

## 1. 最初に知っておくこと

- `AI-GEN2`は現在の公開AI系統です。
- `AI-GEN3`は、将来正式採用される系統の予約名です。現時点では`NOT-PROMOTED`です。
- `PBAI-P1`、`PBAI-P2`、`PBAI-P3`は、候補を評価するengineering programのIDです。
- `PBAI-Cxxx`は個別candidateのIDです。
- `Research Generation 1..3`は研究世代であり、AI世代とは別です。
- `legacy`、`bao`、`bao-v2`はprofile identifierであり、AI世代名ではありません。

正式な命名規則は[`ai-engineering/AI_GENERATION_NAMING.md`](ai-engineering/AI_GENERATION_NAMING.md)を参照してください。

## 2. Programの状態

| Program | 使用する研究証拠 | Candidate | 現在状態・最終判断 | 公開AIへの変更 |
| --- | --- | --- | --- | --- |
| `PBAI-P1` | Research Generation 1まで | `PBAI-C001..C005` | `KEEP-AI-GEN2` | なし |
| `PBAI-P2` | Research Generation 2まで。Research Generation 3は除外 | `PBAI-C006..C009` | `KEEP-AI-GEN2` | なし |
| `PBAI-P3` | Research Generation 3まで。cutoff `479bc3d...` | `PBAI-C010-v1` | `CONTRACT-FROZEN / PRE-SUPPORT` | なし |

`KEEP-AI-GEN2`は失敗時の代替措置ではなく、採用条件を満たす候補がない場合に事前に認められた正式結果です。結果確認後にthreshold、population、seed、candidate mechanismを都合よく変更して救済していません。

## 3. `PBAI-P3` — 第三世代研究を使う改善Program

正式題目: `Generation-3 Evidence-Informed Public Bao AI Improvement Program 3`

状態: **`CONTRACT-FROZEN / PRE-SUPPORT / KEEP-AI-GEN2`**

研究証拠cutoff: `479bc3d3a9b6c745e37a88529732180e8690d6b3`

baseline: `AI-GEN2-BASELINE-2026-09-05-v1`

Program開始認可、Research Generation 3 evidence audit、現在の公開用source監査、baseline固定に加え、initial candidate inventory、support / reachability contract、global gate、fresh splitを結果確認前に固定しました。support測定とcandidate実装はまだ行っていません。

```text
PBAI-P3-A = COMPLETE
PBAI-P3-B = COMPLETE
PBAI-P3-C = COMPLETE / CONTRACT FROZEN
PBAI-P3-D and later = NOT-AUTHORIZED / NOT-EXECUTED
candidate identifiers issued = 1 / PBAI-C010-v1
candidate implementations = 0
support executions = 0
benchmark executions = 0
public deployments = 0
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

読む順序:

1. [`ai-engineering/public-ai-improvement-program-3/README.md`](ai-engineering/public-ai-improvement-program-3/README.md) — Programの入口と停止境界
2. [`ai-engineering/public-ai-improvement-program-3/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-3/CURRENT_STATUS.md) — 現在の正式状態
3. [`ai-engineering/public-ai-improvement-program-3/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-3/CANDIDATE_REGISTER.md) — `PBAI-C010-v1` inventory
4. [`ai-engineering/public-ai-improvement-program-3/SUPPORT_REACHABILITY_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-3/SUPPORT_REACHABILITY_PROTOCOL.md) — baseline-only support契約
5. [`ai-engineering/public-ai-improvement-program-3/BENCHMARK_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-3/BENCHMARK_PROTOCOL.md) — fresh splitとprospective gate
6. [`ai-engineering/public-ai-improvement-program-3/GENERATION_3_EVIDENCE_AUDIT.md`](ai-engineering/public-ai-improvement-program-3/GENERATION_3_EVIDENCE_AUDIT.md) — Research Generation 3証拠の利用範囲
7. [`ai-engineering/public-ai-improvement-program-3/BASELINE_SPEC.md`](ai-engineering/public-ai-improvement-program-3/BASELINE_SPEC.md) — `AI-GEN2` baseline
8. [`ai-engineering/public-ai-improvement-program-3/PROGRAM_PLAN.md`](ai-engineering/public-ai-improvement-program-3/PROGRAM_PLAN.md) — prospective工程

## 4. `PBAI-P2` — 第二世代研究を使った改善Program

正式題目: `Generation-2 Evidence-Informed Public Bao AI Improvement Program 2`
状態: **`COMPLETE / KEEP-AI-GEN2`**
研究証拠cutoff: `cd200b85c1eb24aa4419bd5a9573552f3682f00d`
Research Generation 3の影響: **`ZERO / EXCLUDED`**

### 4.1 Candidateの最終状態

| Candidate | 最終状態 | 判断理由の要約 |
| --- | --- | --- |
| `PBAI-C006-v1` | `WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED` | frozen support universeで、実装を正当化するidentity defectを確認できませんでした。 |
| `PBAI-C007-v1` | `NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION` | support floorに必要なsame-key TT event数を満たしませんでした。 |
| `PBAI-C008-v1` | `DEVELOPMENT-BENEFIT-FAIL-HOLD / CLOSED` | quality / safety gateは通過しましたが、計算cost gateを2件とも満たしませんでした。 |
| `PBAI-C009-v1` | `TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED` | negative control 18件が失敗し、primary benefit gateも2件とも未達でした。 |

`PBAI-C008-v1`のcost resultは次のとおりです。

```text
median node ratio = 2.1004464285714284 > 1.60
p95 node ratio = 3.079245283018868 > 2.50
```

quality指標の改善だけを理由に、事前に固定したcost gateを緩和していません。

`PBAI-C009-v1`ではtechnical failureが0でも、negative-control gateとbenefit gateを満たさなかったためvalidationへ進めませんでした。これを結果後のcontrol再定義やtrigger変更で救済していません。

### 4.2 実行しなかった工程

```text
validation executions = 0
release holdout executions = 0
formal ADOPT = none
public deployments = 0
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

未実行のvalidation / holdoutを「効果なし」という測定結果に読み替えてはいけません。実行の承認条件が成立しなかったため、保護されたデータへアクセスしていないという意味です。

### 4.3 読む順序

1. [`ai-engineering/public-ai-improvement-program-2/README.md`](ai-engineering/public-ai-improvement-program-2/README.md) — Programの目的と入口
2. [`ai-engineering/public-ai-improvement-program-2/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-2/CURRENT_STATUS.md) — 現在の正式状態
3. [`ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md`](ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md) — 全候補を含む最終報告
4. [`ai-engineering/public-ai-improvement-program-2/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/CANDIDATE_REGISTER.md) — candidate台帳
5. [`ai-engineering/public-ai-improvement-program-2/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/DECISION_REGISTER.md) — 判断記録
6. [`ai-engineering/public-ai-improvement-program-2/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/RELEASE_REGISTER.md) — 公開状態

## 5. `PBAI-P1` — 第一世代研究を使った改善Program

正式題目: `Generation-1 Evidence-Informed Public Bao AI Improvement Program 1`
状態: **`COMPLETE / KEEP-AI-GEN2`**
研究証拠cutoff: `2db7c4d65771066e914f32cbc4116fcc3e9e386a`
Research Generation 2の証拠: **対象外**

### 5.1 Candidateの最終状態

| Candidate | 最終状態 | 判断理由の要約 |
| --- | --- | --- |
| `PBAI-C001-v1` | `DEVELOPMENT-BENEFIT-FAIL / HOLD` | quality benefit conjunctionが未達。PR #61はmergeせずcloseしました。 |
| `PBAI-C002-v1` | `NON-ESTIMABLE / HOLD` | eligible target 5件でminimum 48件に届かず、PR #55はmergeせずcloseしました。 |
| `PBAI-C003-v1` | `NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD` | RAW identity bindingがreachability測定前に失敗。PR #63はmergeせずcloseしました。 |
| `PBAI-C004-v1` | `DEVELOPMENT-BENEFIT-FAIL / HOLD` | median node-ratio gateが未達。PR #58はmergeせずcloseしました。 |
| `PBAI-C005` | `NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD` | 現行公開面に修正すべきscore→probability表示を確認できず、実装せずcloseしました。 |

### 5.2 最終管理状態

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation = NOT-AUTHORIZED / NOT-EXECUTED
release holdout = NOT-AUTHORIZED / NOT-EXECUTED
original candidate inventory remaining = 0
public releases = 0
public AI code changed by PBAI-P1 = false
Research Generation 2 evidence included = false
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

### 5.3 C003を読むときの注意

`PBAI-C003-v1`はpractical reachabilityを測定していません。保存済みoracle rowとauthoritative RAW identityのbindingが成立しなかったため、その前段階で停止しました。

したがって、hit countは`null / unmeasured`であり、「hitが0件だった」という結論は承認されません。`REWR-STUDY1`と`ORISC-STUDY1`の既存判断も変更していません。

### 5.4 C005を読むときの注意

`PBAI-C005`は、現行のUI・code・diagnostic surfaceをread-onlyで監査しました。engine evaluationを検証済み勝率・勝利確率として表示する箇所がなかったため、candidate実装を作成していません。

```text
engine score -> validated Bao win probability = NOT AUTHORIZED
```

これは将来のprobability-like機能を包括的に許可する判断ではありません。

### 5.5 読む順序

1. [`ai-engineering/public-ai-improvement-program-1/README.md`](ai-engineering/public-ai-improvement-program-1/README.md) — Programの目的と入口
2. [`ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md) — 現在の正式状態
3. [`ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md`](ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md) — 最終報告
4. [`ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md) — candidate台帳
5. [`ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md) — 判断記録
6. [`ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md) — 公開状態

## 6. 研究とEngineeringの境界

- 研究の`CONFIRMED`は、公開AIへの採用を意味しません。
- engineering benchmarkのPASSは、科学的な真理やgame-theoretic optimalityを意味しません。
- higher-resource searchをground truthとして無条件に扱いません。
- candidate実装は、validation・release holdout・正式な`ADOPT`を経ない限り公開系統へ入りません。
- Research Generation番号と`AI-GENx`番号に対応関係はありません。

## 7. `PBAI-P3`の次の認可境界

`PBAI-P1`と`PBAI-P2`には次のcandidate taskはありません。`PBAI-P3-C`では、結果を見る前に次を固定しました。

1. candidate inventoryとmechanism
2. development / validation / release holdoutのfresh split
3. quality・safety・cost・compatibility gate
4. independent verificationとno-rescue rule
5. `ADOPT`・`HOLD`・`REJECT`・`KEEP-AI-GEN2`のdecision mapping
6. baseline-only support / reachability audit protocol

次に許可できる最小作業単位は、凍結済みprotocolに従う`PBAI-P3-D` baseline-only support / reachability auditです。別の明示的認可があるまで、support seedを読まず、candidate実装、benefit benchmark、validation、release holdout、公開変更を行いません。

人間向け文書は[`DOCUMENTATION_LANGUAGE_POLICY.md`](DOCUMENTATION_LANGUAGE_POLICY.md)と[`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](JAPANESE_DOCUMENTATION_QUALITY_GATE.md)に従い、固定ID・数値・decision tokenを変えずに日本語で説明します。
