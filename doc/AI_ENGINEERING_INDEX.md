# Bao AI Engineering Index

この文書は、publicで使用されているBao AIの品質向上に関する**engineering track**の中央索引である。

研究成果の科学的正本は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)および[`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)を参照する。engineering trackは研究とは独立して運用し、AI実装・benchmark・deploymentの結果によって既存Studyのformal decisionを変更しない。

## AI generation naming

- canonical AI lineage: `AI-GEN1`, `AI-GEN2`, `AI-GEN3`, ...
- current public lineage: **`AI-GEN2`**
- frozen PBAI-P1 exact comparator: **`AI-GEN2-BASELINE-2026-08-26-v1`**
- next adopted public lineage reserved: **`AI-GEN3`**
- candidate IDs: `PBAI-Cxxx`
- pre-adoption assembly: `PBAI-P1-RCxx`
- `legacy` / `bao` / `bao-v2` are profile identifiers, not AI generation names
- `Research Generation 1` / `Research Generation 2` are a separate research namespace

Naming source: [`ai-engineering/AI_GENERATION_NAMING.md`](ai-engineering/AI_GENERATION_NAMING.md)

## Active program — `PBAI-P1`

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**状態:** **PBAI-A COMPLETE / PBAI-B COMPLETE / PBAI-C COMPLETE / PBAI-D NEXT**  
**scientific evidence cutoff:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a` completed Research Generation 1 evidence  
**Research Generation 2 outcomes:** excluded

### Completed controls

```text
PBAI-A evidence audit
  = 14-Study Research Generation 1 core frozen

PBAI-B baseline
  = AI-GEN2-BASELINE-2026-08-26-v1
  = public-source commit f4ae3b11901180cbe417b3e643e2b357d8045d2d

PBAI-C global gate spec
  = PBAI-C-GLOBAL-GATES-2026-08-26-v1
  = frozen before candidate implementation/outcome
```

No initial candidate is yet `AUTHORIZED-FOR-DEVELOPMENT`。

## Program documents

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

Program-level establishment decision:

- [`engineering-program-decisions/2026-08-26-public-ai-improvement-program-1.md`](engineering-program-decisions/2026-08-26-public-ai-improvement-program-1.md)

## Current phase boundary

```text
PBAI-A = COMPLETE
PBAI-B = COMPLETE
PBAI-C global numeric gates = COMPLETE / FROZEN
PBAI-C001..PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

PBAI-C freezes global playing-strength, decision-quality, robustness, operational and correctness floors plus dev/validation/holdout seed blocks. Candidate-specific benefit thresholds must still be frozen in PBAI-D before any one candidate receives development authorization; those rules may add constraints but may not relax PBAI-C global gates。

Current `AI.stateKey` remains distinct from Research Generation 1 authoritative RAW identity because it omits `pending`; it is not authorized as a research-derived exact-tablebase key。

## Separation from research

```text
completed Research Generation 1
          ↓
PBAI-A evidence audit
          ↓
frozen AI-GEN2 baseline
          ↓
frozen pre-outcome engineering gates
          ↓
PBAI-D+ isolated candidate engineering

Research Generation 2 = separate pure research track
```

Engineering success or failure is recorded as an engineering decision and does not revise scientific results. If no candidate passes all applicable gates, maintaining `AI-GEN2` is the correct result。
