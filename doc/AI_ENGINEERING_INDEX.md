# Bao AI Engineering Index

この文書は、publicで使用されているBao AIの品質向上に関する**engineering track**の中央索引である。

研究成果の科学的正本は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)および[`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)を参照する。engineering trackは研究とは独立して運用し、AI実装・benchmark・deploymentの結果によって既存Studyのformal decisionを変更しない。

## AI generation naming

AI世代、evaluation/search profile、engineering candidate、research generationは別namespaceとして扱う。

- canonical AI lineage: `AI-GEN1`, `AI-GEN2`, `AI-GEN3`, ...
- current public lineage at PBAI-P1 establishment: **`AI-GEN2`**
- next adopted public lineage reserved name: **`AI-GEN3`**
- candidate IDs: `PBAI-Cxxx`; public採用前に`AI-GEN3`へpromotionしない
- `legacy` / `bao` / `bao-v2`等はprofile名でありAI世代名ではない
- Research Generation 1 / 2はresearch namespaceであり、AI generation numberとは独立

正本: [`ai-engineering/AI_GENERATION_NAMING.md`](ai-engineering/AI_GENERATION_NAMING.md)

Program-level naming decision: [`engineering-program-decisions/2026-08-26-ai-generation-naming-convention.md`](engineering-program-decisions/2026-08-26-ai-generation-naming-convention.md)

## Active program

### Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**状態:** ESTABLISHED / Phase A evidence audit ready / public AI code unchanged  
**evidence cutoff:** Generation-1 completed research available at program-start repository anchor `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Generation-2 research outcomes:** excluded from PBAI-P1 by default

入口:

- [`ai-engineering/public-ai-improvement-program-1/README.md`](ai-engineering/public-ai-improvement-program-1/README.md)
- [`ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md)
- [`ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md`](ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md)
- [`ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md`](ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md)
- [`ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md)
- [`ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md)
- [`ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md)

Program-level decision:

- [`engineering-program-decisions/2026-08-26-public-ai-improvement-program-1.md`](engineering-program-decisions/2026-08-26-public-ai-improvement-program-1.md)

## Separation from research

```text
Generation-1 completed research
          ↓
PBAI-P1 engineering evidence audit
          ↓
engineering candidates / benchmark / release decision

Generation-2 research = separate pure research track
```

AI engineeringで得たpositive/negative resultはengineering decisionとして記録する。科学的仮説を新たに検証する必要が生じた場合は、既存Studyを再解釈せず、新しいprospective research StudyとしてResearch Trackへ戻す。
