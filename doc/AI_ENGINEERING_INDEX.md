# Bao AI Engineering Index

この文書は、publicで使用されているBao AIの品質向上に関する**engineering track**の中央索引である。

研究成果の科学的正本は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)および[`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)を参照する。Engineering outcomeによって既存Studyのformal decisionを変更しない。

## AI generation naming

- current public lineage: **`AI-GEN2`**
- frozen exact comparator: **`AI-GEN2-BASELINE-2026-08-26-v1`**
- next adopted public lineage reserved: **`AI-GEN3`**
- engineering candidate IDs: `PBAI-Cxxx`
- `legacy` / `bao` / `bao-v2` are profile identifiers, not AI generations
- `Research Generation 1` / `Research Generation 2` are a separate research namespace

Canonical naming: [`ai-engineering/AI_GENERATION_NAMING.md`](ai-engineering/AI_GENERATION_NAMING.md)

## Active program — `PBAI-P1`

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**状態:** **PBAI-A/B/C COMPLETE / C001 HOLD / C002 HOLD / C004 HOLD / no candidate authorized**  
**scientific evidence cutoff:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Research Generation 2 outcomes:** excluded

### Frozen controls and candidate dispositions

```text
PBAI-B exact baseline
  = AI-GEN2-BASELINE-2026-08-26-v1

PBAI-C global gate spec
  = PBAI-C-GLOBAL-GATES-2026-08-26-v1

PBAI-C001-v1
  = predevelopment support 108 >= 32 / PASS
  = premetric safety / PASS
  = TopSet delta +0.015625 < +0.05 / FAIL
  = rank-loss delta -0.01171875 > -0.02 / FAIL
  = severe-loss excess +0.015625 > 0 / FAIL
  = median search-work ratio 0.2772631455 / PASS
  = DEVELOPMENT-BENEFIT-FAIL / HOLD
  = development PR #61 closed without merge

PBAI-C002-v1
  = NON-ESTIMABLE / HOLD
  = eligible targets 5 < frozen minimum 48
  = development PR #55 closed without merge

PBAI-C004-v1
  = predevelopment support 54 >= 48 / PASS
  = premetric safety / PASS
  = fixed-D4 median nodes(candidate/baseline) 1.000 > frozen maximum 0.950 / FAIL
  = DEVELOPMENT-BENEFIT-FAIL / HOLD
  = development PR #58 closed without merge
```

Current public/main candidate implementations remain `0`; authorized candidates `0`; validation, release holdout and `AI-GEN3` promotion remain unauthorized.

## Program documents

- [`ai-engineering/public-ai-improvement-program-1/README.md`](ai-engineering/public-ai-improvement-program-1/README.md)
- [`ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md)
- [`ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md`](ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md)
- [`ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md`](ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md)
- [`ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md)
- [`ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-predevelopment-support-spec.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-predevelopment-support-spec.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-predevelopment-support-result.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-predevelopment-support-result.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-development-result.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-development-result.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C002-v1.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C002-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C002-v1-development-result.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C002-v1-development-result.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1-predevelopment-support-spec.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1-predevelopment-support-spec.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1-predevelopment-support-result.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1-predevelopment-support-result.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1-development-result.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1-development-result.json)
- [`ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md)

## C001 engineering result boundary

Phase Transition Study 1 E-020/H18 remains a fixed-condition scientific result about capture-branch-expansion event frequency, not a proof that legacy search is stronger or chooses better moves. The C001 engineering hypothesis reduced search work strongly on its frozen target set but failed three prospectively frozen decision-quality benefit gates. That engineering result is binding only for `PBAI-C001-v1`; it neither revises the scientific result nor proves every related mechanism ineffective.

## Remaining candidate inventory

- `PBAI-C003`: restricted exact-oracle lookup plumbing. Only the frozen 8-state exact domain can be treated as exact. Strict authoritative RAW identity including `pending` is required; current `AI.stateKey` is not an authorized exact-tablebase key.
- `PBAI-C005`: evaluation-semantics sanitation. Position Evaluation / Win-Rate Calibration Study 1 remains `INCONCLUSIVE`; no engine-score→validated-win-probability semantics may be introduced.

Neither candidate is authorized. A prospective predevelopment support/contract cycle is required before implementation.

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
C002 exact candidate → NON-ESTIMABLE / HOLD
          ↓
C004 exact candidate → DEVELOPMENT-BENEFIT-FAIL / HOLD
          ↓
C001 exact candidate → DEVELOPMENT-BENEFIT-FAIL / HOLD
          ↓
no candidate currently authorized; public AI remains AI-GEN2

Research Generation 2 = separate pure research track
```

Current `AI.stateKey` remains distinct from Research Generation 1 authoritative RAW identity because it omits `pending`; it is not authorized as a research-derived exact-tablebase key.
