# Bao AI Engineering 中央索引

この文書は、**公開中のBao AIの品質向上を目的とするAI Engineering trackの中央索引**です。

科学研究の正本は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)および[`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)を参照してください。AI Engineeringで得られた工学上の結果によって、既存Studyの正式判断を変更することはありません。

人間向け文書の言語・用語表記は[`DOCUMENTATION_LANGUAGE_POLICY.md`](DOCUMENTATION_LANGUAGE_POLICY.md)に従い、日本語を本文の主言語とします。Study ID、Program ID、AI generation、canonical decision token、JSON fieldなどの固定識別子は変更しません。

## 1. AI世代の命名

- 現在の公開系統: **`AI-GEN2`**
- PBAI-P2 exact baseline: **`AI-GEN2-BASELINE-2026-09-01-v1`**
- PBAI-P1 historical baseline: **`AI-GEN2-BASELINE-2026-08-26-v1`**
- 次に正式採用される公開系統の予約名: **`AI-GEN3`**
- engineering candidate ID: `PBAI-Cxxx`
- `legacy` / `bao` / `bao-v2`はprofile identifierであり、AI世代名ではない
- `Research Generation 1` / `Research Generation 2` / `Research Generation 3`はAI世代とは別の研究namespaceである

正式な命名規則: [`ai-engineering/AI_GENERATION_NAMING.md`](ai-engineering/AI_GENERATION_NAMING.md)

## 2. 完了済みProgram — `PBAI-P2`

**正式題目:** Generation-2 Evidence-Informed Public Bao AI Improvement Program 2

**状態:** **COMPLETE / KEEP-AI-GEN2**

**Research Generation 2 scientific evidence cutoff:** `cd200b85c1eb24aa4419bd5a9573552f3682f00d`

**Research Generation 3 influence:** **ZERO / EXCLUDED**

PBAI-P2はResearch Generation 2のbounded evidenceだけをscientific premiseとしてC006〜C009をprospectively評価した。Final dispositions:

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED
PBAI-C007-v1 = NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
PBAI-C008-v1 = DEVELOPMENT-BENEFIT-FAIL-HOLD / CLOSED
PBAI-C009-v1 = TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED
```

C008はquality/safety gatesを通過したがfrozen cost gatesをFAIL。C009はnegative-control gateをFAILし、primary benefit gatesも未達。両candidateともvalidation authorizationへ進まなかった。

```text
validation executions = 0
release holdout executions = 0
formal ADOPT = none
public deployments = 0
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

Canonical entry points:

- [`ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md`](ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md)
- [`ai-engineering/public-ai-improvement-program-2/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-2/CURRENT_STATUS.md)
- [`ai-engineering/public-ai-improvement-program-2/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/CANDIDATE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-2/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/DECISION_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-2/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/RELEASE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C008-v1-development-result.json`](ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C008-v1-development-result.json)
- [`ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C009-v1-development-result.json`](ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C009-v1-development-result.json)

## 3. 完了済みProgram — `PBAI-P1`

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**状態:** **COMPLETE / KEEP-AI-GEN2**  
**科学的証拠のcutoff:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Research Generation 2の結果:** 対象外

### 3.1 最終管理状態

```text
PBAI-B exact baseline = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation = NOT-AUTHORIZED / NOT-EXECUTED
release holdout = NOT-AUTHORIZED / NOT-EXECUTED
original candidate inventory remaining = 0
public releases = 0
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

### 3.2 各候補の最終状態

```text
PBAI-C001-v1
  = support PASS + premetric PASS
  = quality benefit conjunction FAIL
  = DEVELOPMENT-BENEFIT-FAIL / HOLD
  = PR #61 closed without merge

PBAI-C002-v1
  = eligible targets 5 < minimum 48
  = NON-ESTIMABLE / HOLD
  = PR #55 closed without merge

PBAI-C003-v1
  = strict RAW identity binding failed before reachability measurement
  = hit count unmeasured / null; zero-hit inference unauthorized
  = consistent with existing ORISC pending-binding mismatch
  = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
  = PR #63 closed without merge

PBAI-C004-v1
  = support PASS + premetric safety PASS
  = frozen median node-ratio intended-benefit gate FAIL
  = DEVELOPMENT-BENEFIT-FAIL / HOLD
  = PR #58 closed without merge

PBAI-C005
  = read-only production-surface semantics audit complete
  = no current score->validated-probability defect found
  = NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD
  = closed without implementation
```

### 3.3 Programの最終判断

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT PROMOTED
public AI code changed by PBAI-P1 = false
Research Generation 2 evidence included = false
```

`KEEP-AI-GEN2`は、すべてのcandidateが事前に定めたengineering acceptance sequenceを生き残らなかった場合に許可されている最終結果です。

つまりPBAI-P1では、既存の公開AIを維持すること自体が正規の工学判断でした。

## 4. PBAI-P1 Program文書

- [`ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md`](ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md)
- [`ai-engineering/public-ai-improvement-program-1/RESUME_HERE.md`](ai-engineering/public-ai-improvement-program-1/RESUME_HERE.md)
- [`ai-engineering/public-ai-improvement-program-1/README.md`](ai-engineering/public-ai-improvement-program-1/README.md)
- [`ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md)
- [`ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/C005_PRODUCTION_SURFACE_AUDIT.md`](ai-engineering/public-ai-improvement-program-1/C005_PRODUCTION_SURFACE_AUDIT.md)
- [`ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md`](ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md)
- [`ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md`](ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md)
- [`ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md)
- [`ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json)

### 4.1 Candidate固有のcanonical artifact

- `candidates/PBAI-C001-v1-predevelopment-support-spec.json`
- `candidates/PBAI-C001-v1-predevelopment-support-result.json`
- `candidates/PBAI-C001-v1.json`
- `candidates/PBAI-C001-v1-development-result.json`
- `candidates/PBAI-C002-v1.json`
- `candidates/PBAI-C002-v1-development-result.json`
- `candidates/PBAI-C003-v1-predevelopment-support-spec.json`
- `candidates/PBAI-C003-v1-predevelopment-support-result.json`
- `candidates/PBAI-C004-v1-predevelopment-support-spec.json`
- `candidates/PBAI-C004-v1-predevelopment-support-result.json`
- `candidates/PBAI-C004-v1.json`
- `candidates/PBAI-C004-v1-development-result.json`
- `candidates/PBAI-C005-production-surface-audit-result.json`

これらのmachine-readable artifactや固定結果は、文書日本語化のために書き換えません。

## 5. PBAI-P1 C003の工学上の境界

REWR-STUDY1は、凍結した8-state domainの内部で引き続き`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`です。

ORISC-STUDY1も`ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`のままであり、`pending`に関係する3件のrepository-facing row rehash / RAW binding mismatchを含む既存判断は変更しません。

C003-v1では、practical reachabilityを測定する前提として、保存済みoracle rowがauthoritative RAW identityの下で再hash可能であることを要求しました。この前提が既知のORISC mismatchで成立しなかったため、reachability measurementには進んでいません。

したがってC003-v1は「hitが0件だった」という結果を出していません。hit countは未測定です。また、candidate lookup implementationも作成していません。

## 6. PBAI-P1 C005の工学上の境界

Position Evaluation / Win-Rate Calibration Study 1の正式判断は引き続き`INCONCLUSIVE`です。

PBAI-C005では、現在公開されているUI、code、diagnostic surfaceをread-onlyで監査し、engine evaluationを検証済みの勝率・勝利確率・confidence probabilityとして表示している箇所がないことを確認しました。そのため、現行production surfaceを修正するcandidate実装は正当化されませんでした。

今後も次の禁止は維持します。

```text
engine score -> validated Bao win probability = NOT AUTHORIZED
```

将来probability-likeな公開機能を追加する場合は、新しいprospective engineering candidateとして独立に評価する必要があります。C005は、その種の機能を包括的に許可するものではありません。

## 7. 研究とAI Engineeringの分離

PBAI-P1のhistorical flow:

```text
completed Research Generation 1
          ↓
PBAI-A evidence audit
          ↓
PBAI-B frozen baseline
          ↓
PBAI-C frozen pre-outcome gates
          ↓
C002 → NON-ESTIMABLE / HOLD
C004 → DEVELOPMENT-BENEFIT-FAIL / HOLD
C001 → DEVELOPMENT-BENEFIT-FAIL / HOLD
C003 → STRICT RAW IDENTITY PRECONDITION FAIL / HOLD
C005 → NO ACTIONABLE PRODUCTION SEMANTICS DEFECT / HOLD
          ↓
PBAI-P1 COMPLETE → KEEP-AI-GEN2
```

PBAI-P2ではResearch Generation 2だけをscientific/evidence inputとし、Research Generation 3はhard firewallで完全除外します。

PBAI-P2のcurrent flow:

```text
G2-only evidence cutoff / G3 firewall
          ↓
AI-GEN2 baseline + global gates freeze
          ↓
C006 → WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
          ↓
C007 → NON-ESTIMABLE-HOLD
          ↓
C008 baseline-only support → SUPPORT-PASS
          ↓
C008 exact development contract → FROZEN
          ↓
C008 implementation + feature-off equivalence → NEXT
```

C006/C007/C008のengineering結果はResearch Generation 2のformal scientific decisionやidentity boundaryを変更しません。

PBAI-P2のcandidateがすべて採用gateを通らない場合は、PBAI-P1と同様に`KEEP-AI-GEN2`を正常なProgram outcomeとして認めます。
