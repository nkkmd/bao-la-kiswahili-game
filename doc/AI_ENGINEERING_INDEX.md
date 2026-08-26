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
**状態:** **PBAI-A/B/C COMPLETE / PBAI-D PBAI-C002-v1 CONTRACT FROZEN / PBAI-E NEXT AFTER MERGE**  
**scientific evidence cutoff:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Research Generation 2 outcomes:** excluded

### Frozen controls

```text
PBAI-A evidence audit
  = 14-Study Research Generation 1 core frozen

PBAI-B exact baseline
  = AI-GEN2-BASELINE-2026-08-26-v1

PBAI-C global gate spec
  = PBAI-C-GLOBAL-GATES-2026-08-26-v1

PBAI-D first candidate contract
  = PBAI-C002-v1
  = feature pbaiC002C03Ordering
  = move-ordering-only
```

After the PBAI-D contract-freeze change is merged:

```text
PBAI-C002 = AUTHORIZED-FOR-DEVELOPMENT
AUTHORIZED-FOR-DEVELOPMENT count = 1
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

## Program documents

- [`ai-engineering/public-ai-improvement-program-1/README.md`](ai-engineering/public-ai-improvement-program-1/README.md)
- [`ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md)
- [`ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md`](ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md)
- [`ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md`](ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md)
- [`ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md)
- [`ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C002-v1.json`](ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C002-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md)

Program decisions:

- [`engineering-program-decisions/2026-08-26-public-ai-improvement-program-1.md`](engineering-program-decisions/2026-08-26-public-ai-improvement-program-1.md)
- [`engineering-program-decisions/2026-08-26-pbai-c002-v1-development-authorization.md`](engineering-program-decisions/2026-08-26-pbai-c002-v1-development-authorization.md)

## PBAI-C002-v1 boundary

Research source is machine-confirmed `TM-S2-C03`. The engineering v1 uses only its frozen Mtaji/reusable-pits/coarse move-family representation for conservative move ordering. It does not implement the research consequence as a runtime trigger and does not authorize selective extension, evaluation bonus, forced move, human/traditional claim, public-default activation or holdout execution.

The intended-benefit gate is D4 target-root node efficiency with exact semantic safety, plus all PBAI-C global gates. Failure or non-estimability leads to `HOLD/REJECT` and may correctly result in `KEEP-AI-GEN2`.

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
PBAI-D exact PBAI-C002-v1 contract
          ↓
PBAI-E isolated engineering implementation

Research Generation 2 = separate pure research track
```

Current `AI.stateKey` remains distinct from Research Generation 1 authoritative RAW identity because it omits `pending`; it is not authorized as a research-derived exact-tablebase key.
