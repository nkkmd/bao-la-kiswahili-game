# Public Bao AI Improvement Program 2 (`PBAI-P2`)

**正式題目:** Generation-2 Evidence-Informed Public Bao AI Improvement Program 2  
**日本語表記:** 第二世代研究の確定済み成果のみを用いたPublic Bao AI品質向上プログラム — Research Generation 2 evidenceからの新規engineering hypothesis構築、prospective candidate評価、独立validation、protected release holdoutによるAI-GEN3採用可否判定  
**開始日:** 2026-09-01  
**完了日:** 2026-09-01  
**Status:** **COMPLETE / KEEP-AI-GEN2**

## 1. Program identity / final outcome

`PBAI-P2`は、完了済みResearch Generation 2の科学的正本と明示された不確実性・失敗境界だけをscientific/evidence inputとして、public Bao AIに実質的な改善をもたらすengineering mechanismが存在するかをprospectively評価した独立AI Engineering Programである。

PBAI-P1の再開・救済・延長ではない。PBAI-P1のResearch Generation 1 scientific evidenceを新candidateのscientific premiseとして再利用していない。

最終判断:

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

## 2. Immutable scientific evidence cutoff

```text
G2 scientific evidence cutoff
= cd200b85c1eb24aa4419bd5a9573552f3682f00d

immediate child
= c5e33524c32b9ce9994760bababa08a85b6570d8
= Add Research Generation 3 program plan
```

## 3. Research Generation 3 hard firewall

```text
Research Generation 3 influence on PBAI-P2 = ZERO
```

Research Generation 3のscientific evidence、diagnostic、measurement、hypothesis、candidate mechanism、documentation-derived ideaをcandidate設計、selection、threshold、validation、interpretation、release decisionへ使用していない。

Canonical firewall: [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)

## 4. Baseline / public lineage

Program開始時およびclosure audit時のremote `main`:

```text
2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
```

Frozen comparator:

```text
AI-GEN2-BASELINE-2026-09-01-v1
```

Current public lineage remains:

```text
AI-GEN2
```

Candidate implementationはisolated development branchだけでdefault-offとしてmaterializeし、失敗candidateの`public/ai.js`差分はpublic `main`へ採用しない。

## 5. Stage closure

| Stage ID | 役割 | Final state |
| --- | --- | --- |
| `PBAI-P2-A` | G2 evidence audit / G3 firewall | COMPLETE |
| `PBAI-P2-B` | public AI audit / baseline re-freeze | COMPLETE |
| `PBAI-P2-C` | global gates / fresh split / inventory freeze | COMPLETE |
| `PBAI-P2-D` | candidate-specific support / exact contract | COMPLETE |
| `PBAI-P2-E` | isolated development / development-only evaluation | COMPLETE |
| `PBAI-P2-F` | fresh independent validation | NOT-AUTHORIZED / NOT-EXECUTED |
| `PBAI-P2-G` | protected release holdout / ADOPT decision | NOT-AUTHORIZED / NOT-EXECUTED |
| `PBAI-P2-H` | public-default deployment / AI-GEN3 promotion | NO DEPLOYMENT |

## 6. Final candidate inventory

```text
PBAI-C006-v1
= WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED

PBAI-C007-v1
= NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION

PBAI-C008-v1
= DEVELOPMENT-BENEFIT-FAIL-HOLD / CLOSED
= quality/safety gates PASS
= cost gates FAIL

PBAI-C009-v1
= TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED
= negative-control gate FAIL
= primary benefit gates FAIL
```

詳細: [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)

## 7. C008 result boundary

C008はpredevelopment supportとfeature-off equivalenceを通過し、71 development eligible rootsでquality/safety metricsを改善したが、凍結済みcost gateを満たさなかった。

```text
TopSet agreement delta = +0.2957746478873239 PASS
mean normalized rank-loss delta = -0.19413145539906107 PASS
median node ratio = 2.1004464285714284 FAIL <= 1.60
p95 node ratio = 3.079245283018868 FAIL <= 2.50
```

```text
DEVELOPMENT-BENEFIT-FAIL-HOLD
validation = NOT AUTHORIZED
```

Positive quality signalを理由にpost-outcomeでcost thresholdを緩和しない。

## 8. C009 result boundary

C009はpredevelopment supportと256-comparison feature-off exact equivalenceを通過した。Developmentでは128 eligible roots / 64 negative controlsをproduction / independentの2実装で再構成した。

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

Frozen mapping:

```text
TECHNICAL-INVALID-REJECT-OR-HOLD
validation = NOT AUTHORIZED
```

## 9. Protected split at closure

```text
development decision roots 424xxxxx = ACCESSED under frozen development contracts
validation decision roots 425xxxxx = NOT ACCESSED
release holdout decision roots 426xxxxx = NOT ACCESSED
```

Validation / holdoutを見ていないため、それらをnegative/null resultとは扱わない。

## 10. No-rescue closure

Initial inventory `PBAI-C006-v1..PBAI-C009-v1`は全件closed。結果後にthreshold緩和、seed追加、negative-control再定義、subgroup追加、mechanism微修正でsame-version救済しない。

Initial inventory外candidateを今回のoutcomeから新規発明してPBAI-P2を延長しない。将来のAI改善は新しいAI Engineering Programとしてevidence cutoff、baseline、fresh split、candidate inventory、acceptance gateをprospectively freezeして開始する。

## 11. Canonical documents

- [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)
- [`GENERATION_2_EVIDENCE_AUDIT.md`](GENERATION_2_EVIDENCE_AUDIT.md)
- [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
- [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`RELEASE_REGISTER.md`](RELEASE_REGISTER.md)
- [`candidates/PBAI-C008-v1-feature-off-equivalence-spec.json`](candidates/PBAI-C008-v1-feature-off-equivalence-spec.json)
- [`candidates/PBAI-C008-v1-feature-off-equivalence-result.json`](candidates/PBAI-C008-v1-feature-off-equivalence-result.json)
- [`candidates/PBAI-C008-v1-development-measurement-spec.json`](candidates/PBAI-C008-v1-development-measurement-spec.json)
- [`candidates/PBAI-C008-v1-development-result.json`](candidates/PBAI-C008-v1-development-result.json)
- [`candidates/PBAI-C009-v1-feature-off-equivalence-spec.json`](candidates/PBAI-C009-v1-feature-off-equivalence-spec.json)
- [`candidates/PBAI-C009-v1-feature-off-equivalence-result.json`](candidates/PBAI-C009-v1-feature-off-equivalence-result.json)
- [`candidates/PBAI-C009-v1-development-measurement-spec.json`](candidates/PBAI-C009-v1-development-measurement-spec.json)
- [`candidates/PBAI-C009-v1-development-result.json`](candidates/PBAI-C009-v1-development-result.json)
- [`checkpoints/2026-09-01-c008-feature-off-equivalence-pass.md`](checkpoints/2026-09-01-c008-feature-off-equivalence-pass.md)
- [`checkpoints/2026-09-01-c009-feature-off-equivalence-pass.md`](checkpoints/2026-09-01-c009-feature-off-equivalence-pass.md)

```text
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
```
