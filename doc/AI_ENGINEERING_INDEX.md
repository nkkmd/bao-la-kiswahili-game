# Bao AI Engineering Index

この文書は、publicで使用されているBao AIの品質向上に関する**engineering track**の中央索引である。

研究成果の科学的正本は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)および[`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)を参照する。Engineering outcomeによって既存Studyのformal decisionを変更しない。

## AI generation naming

- current public lineage: **`AI-GEN2`**
- frozen exact comparator: **`AI-GEN2-BASELINE-2026-08-26-v1`**
- next adopted public lineage reserved: **`AI-GEN3`**
- engineering candidate IDs: `PBAI-Cxxx`
- `legacy` / `bao` / `bao-v2` are profile identifiers, not AI generations
- `Research Generation 1` / `Research Generation 2` are separate research namespaces

Canonical naming: [`ai-engineering/AI_GENERATION_NAMING.md`](ai-engineering/AI_GENERATION_NAMING.md)

## Active program — `PBAI-P1`

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**状態:** **PBAI-A/B/C COMPLETE / C001 HOLD / C002 HOLD / C003 HOLD / C004 HOLD / C005 NOT AUTHORIZED**  
**scientific evidence cutoff:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Research Generation 2 outcomes:** excluded

### Frozen controls

```text
PBAI-B exact baseline = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
AUTHORIZED-FOR-DEVELOPMENT = 0
public/main candidate implementations = 0
validation = NOT-AUTHORIZED
release holdout = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

### Candidate dispositions

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
  = frozen median node-ratio benefit gate FAIL
  = DEVELOPMENT-BENEFIT-FAIL / HOLD
  = PR #58 closed without merge

PBAI-C005
  = EVIDENCE-AUDIT-READY
  = NOT AUTHORIZED
  = next step is read-only production-surface semantics audit
```

## Program documents

- [`ai-engineering/public-ai-improvement-program-1/RESUME_HERE.md`](ai-engineering/public-ai-improvement-program-1/RESUME_HERE.md)
- [`ai-engineering/public-ai-improvement-program-1/README.md`](ai-engineering/public-ai-improvement-program-1/README.md)
- [`ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md)
- [`ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md`](ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md)
- [`ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md`](ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md)
- [`ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md)
- [`ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md)

### Candidate-specific canonical artifacts

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

## C003 engineering boundary

REWR-STUDY1 remains `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` for its frozen 8-state domain. ORISC-STUDY1 remains `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`, including its three repository-facing row rehash / RAW binding mismatches involving `pending`.

C003-v1 required stored oracle rows to rehash under the authoritative RAW identity before practical reachability could be measured. That precondition failed on the already-known ORISC mismatch, so C003-v1 did **not** produce a 0-hit result; the reachability metric is unmeasured. No candidate lookup implementation was created.

## Next permitted work

Only `PBAI-C005` remains in the original candidate inventory without a disposition. Begin with a read-only production-surface audit:

```text
question = does current public code/UI actually represent engine evaluation as win probability or violate the calibration boundary?
implementation = NOT AUTHORIZED
candidate outcome = NOT YET DEFINED
```

If no current production semantics defect exists, do not manufacture a code change merely to consume C005. `KEEP-AI-GEN2` is an acceptable final PBAI-P1 outcome.

## Separation from research

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
          ↓
C005 read-only production-surface audit = NEXT

Research Generation 2 = separate pure research track
```

Current `AI.stateKey` remains distinct from Research Generation 1 authoritative RAW identity because it omits `pending`; it is not authorized as a research-derived exact-tablebase key.
