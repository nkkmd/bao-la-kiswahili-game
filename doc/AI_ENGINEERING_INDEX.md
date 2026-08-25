# Bao AI Engineering Index

この文書は、publicで使用されているBao AIの品質向上に関する**engineering track**の中央索引である。

研究成果の科学的正本は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)および[`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)を参照する。engineering trackは研究とは独立して運用し、AI実装・benchmark・deploymentの結果によって既存Studyのformal decisionを変更しない。

## AI generation naming

AI世代、evaluation/search profile、engineering candidate、research generationは別namespaceとして扱う。

- canonical AI lineage: `AI-GEN1`, `AI-GEN2`, `AI-GEN3`, ...
- current public lineage: **`AI-GEN2`**
- PBAI-P1 exact frozen comparison target: **`AI-GEN2-BASELINE-2026-08-26-v1`**
- next adopted public lineage reserved name: **`AI-GEN3`**
- candidate IDs: `PBAI-Cxxx`; public採用前に`AI-GEN3`へpromotionしない
- `legacy` / `bao` / `bao-v2`等はprofile名でありAI世代名ではない
- `Research Generation 1` / `Research Generation 2`はresearch namespaceであり、AI generation numberとは独立

正本: [`ai-engineering/AI_GENERATION_NAMING.md`](ai-engineering/AI_GENERATION_NAMING.md)

Program-level naming decision: [`engineering-program-decisions/2026-08-26-ai-generation-naming-convention.md`](engineering-program-decisions/2026-08-26-ai-generation-naming-convention.md)

## Active program

### Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**状態:** ESTABLISHED / **PBAI-A COMPLETE / PBAI-B COMPLETE** / PBAI-C numeric gate freeze next / public AI code unchanged  
**scientific evidence cutoff:** completed Research Generation 1 evidence at anchor `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Research Generation 2 outcomes:** excluded from PBAI-P1

PBAI-A fixed a 14-Study Research Generation 1 evidence core and advanced `PBAI-C001..PBAI-C005` only to `EVIDENCE-AUDIT-READY`.

PBAI-B froze the exact `AI-GEN2` public-source comparison target:

```text
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
source main commit = f4ae3b11901180cbe417b3e643e2b357d8045d2d
public endpoint = https://bao-la-kiswahili.cultivationdata.net/
```

No candidate is authorized for implementation.

入口:

- [`ai-engineering/public-ai-improvement-program-1/README.md`](ai-engineering/public-ai-improvement-program-1/README.md)
- [`ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md)
- [`ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md`](ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md)
- [`ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md`](ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md)
- [`ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`](ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json)
- [`ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md)
- [`ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md)

Program-level establishment decision:

- [`engineering-program-decisions/2026-08-26-public-ai-improvement-program-1.md`](engineering-program-decisions/2026-08-26-public-ai-improvement-program-1.md)

## Current phase boundary

```text
PBAI-A Research Generation 1 evidence audit = COMPLETE
PBAI-B AI-GEN2 exact baseline = COMPLETE
PBAI-C benchmark framework = FRAMEWORK-FROZEN
PBAI-C numeric non-regression / release gates = NOT-FROZEN / NEXT
AUTHORIZED-FOR-DEVELOPMENT = 0
candidate implementations = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

Current `AI.stateKey` remains distinct from Research Generation 1 authoritative RAW identity because it omits `pending`; the exact baseline records this current runtime property but does not authorize it as a research-derived tablebase key.

## Separation from research

```text
completed Research Generation 1
          ↓
PBAI-P1 evidence audit + frozen AI-GEN2 baseline
          ↓
prospectively frozen engineering gates
          ↓
engineering candidates / validation / release decision

Research Generation 2 = separate pure research track
```

AI engineeringで得たpositive/negative resultはengineering decisionとして記録する。科学的仮説を新たに検証する必要が生じた場合は、既存Studyを再解釈せず、新しいprospective research StudyとしてResearch Trackへ戻す。
