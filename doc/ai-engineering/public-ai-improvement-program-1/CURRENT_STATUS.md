# PBAI-P1 Current Status

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1

## Status

```text
PROGRAM = ESTABLISHED
PBAI-A Research Generation 1 evidence audit = COMPLETE
PBAI-B AI-GEN2 exact public baseline = NOT-FROZEN / NEXT
PBAI-C benchmark framework = FRAMEWORK-FROZEN
PBAI-C numeric non-regression / release gates = NOT-FROZEN
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
candidate evidence-audit-ready = 5
candidate implementations = 0
candidate release decisions = 0
public deployments caused by PBAI-P1 = 0
public AI code changed by PBAI-P1 = false
Research Generation 2 evidence included = false
```

## AI generation naming

Canonical naming rule: `doc/ai-engineering/AI_GENERATION_NAMING.md`

- `AI-GEN1`: historical legacy AI lineage
- `AI-GEN2`: current public Bao AI lineage; lineage label, not an exact configuration ID
- `AI-GEN3`: reserved for the next formally adopted public lineage after frozen validation/non-regression/release gates and explicit public adoption
- `legacy` / `bao` / `bao-v2`: evaluation/search profile identifiers, not generation labels
- `bao-v2` is not `AI-GEN2`
- PBAI candidates remain `PBAI-Cxxx` until formal public adoption
- Research programs use `Research Generation 1` / `Research Generation 2`; AI generation numbers do not map to research generation numbers

## Work-start source of truth

Remote `main` at PBAI-A work start:

`f50362a435a3c5cdd1d9b6dd8969b15dcf5e4dc8`

Reference SHA supplied at work start:

`f50362a435a3c5cdd1d9b6dd8969b15dcf5e4dc8`

Result: **MATCH**.

The fixed PBAI-P1 scientific evidence cutoff remains the earlier program-start research anchor:

`2db7c4d65771066e914f32cbc4116fcc3e9e386a`

The commits between the scientific cutoff and PBAI-A work start establish PBAI-P1/naming documentation and do not expand the scientific evidence cutoff.

## PBAI-A completion

`GENERATION_1_EVIDENCE_AUDIT.md` now freezes:

- the 14-Study Research Generation 1 scientific evidence core;
- the earlier First Joseki / first-player work as context/benchmark/infrastructure rather than silently reclassifying it as Research Generation 1 scientific evidence;
- E1/E2/E3/E4 engineering use for every included Study;
- prohibited inference and regression risk for every Study;
- candidate traceability for `PBAI-C001..PBAI-C005`;
- Research Generation 2 exclusion;
- authoritative RAW identity requirements;
- the current-public observation that `AI.stateKey` is not identical to the Research Generation 1 RAW identity contract because it omits `pending`.

The latter is a forward engineering constraint, not a PBAI-A declaration that the current public search is incorrect. No public AI code was changed to resolve it during PBAI-A.

## Candidate state after PBAI-A

```text
PBAI-C001 = EVIDENCE-AUDIT-READY
PBAI-C002 = EVIDENCE-AUDIT-READY
PBAI-C003 = EVIDENCE-AUDIT-READY
PBAI-C004 = EVIDENCE-AUDIT-READY
PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
```

Evidence readiness does not authorize implementation. Candidate mechanism, benchmark endpoint, validation/holdout blocks, numeric acceptance rule and rollback contract must still be frozen prospectively.

## Current public AI overview — not yet an exact baseline freeze

Read-only inspection during PBAI-A confirms the current public path is consistent with `AI-GEN2` lineage:

- default evaluation profile: `bao`;
- `bao-v2`: historical experimental/diagnostic profile, not public lineage identity;
- hard/expert: iterative-deepening enhanced alpha-beta family using TT, PVS-style search, killer ordering and quiescence;
- hard/expert evaluation caching enabled by default inside `analyzeMove`;
- public `AIConfig.searchOptions(...)` currently returns fixed device-tier base budgets; historical adaptive-budget APIs are not public-default behavior;
- current `public/ai-config.js` hard budgets are low `D6/400ms`, standard `D8/500ms`, high `D10/600ms`;
- current expert budgets are low `D10/1500ms`, standard `D12/2000ms`, high `D14/3000ms`;
- Web Worker search with same-AI fallback path;
- public and benchmark move legality flows through `public/engine.js`.

These are inspection findings only. Exact hashes, deployment ref, device settings, cache/PWA implications and all baseline semantics remain to be formally bound in PBAI-B.

## PBAI-B reconciliation items discovered by PBAI-A

The following are **known baseline/documentation questions**, not candidate results and not PBAI-A code-change requests:

1. `doc/AI_DEVELOPMENT_LOG.md` still describes the hard browser default as `maxDepth=4 / 450ms`, while current `public/ai-config.js` supplies device-tier hard budgets of D6/400, D8/500 or D10/600. PBAI-B must treat current public code/deployment as authoritative and either classify the development-log statement as historical/stale or update the engineering documentation after the exact baseline is established.
2. `public/ai.js` `AI.stateKey` omits `pending`, while Research Generation 1 authoritative RAW identity includes it. `test/search.test.js` currently describes its key check as covering “every rule-relevant field” without testing `pending`. PBAI-B/PBAI-C must determine the actual public-search applicability separately; PBAI-C003 may not reuse this key as RAW tablebase identity.
3. `public/diagnostics.js` stores `pending` but supplies `[0,0]` when absent. This compatibility behavior is not equivalent to the strict ORISC research identity contract where missing `pending` is invalid. Any research-derived RAW fixture/tablebase path needs a dedicated strict binding.
4. `RULES_BASELINE.md` retains known implementation boundaries (`takasia` not applied; relay safety guard is an implementation guard, not a Bao rule). PBAI-B must bind the exact engine/rules source so candidate comparisons do not mix rule changes with AI changes.

None of these items authorizes a public-code modification before baseline and benchmark-gate freeze.

## Benchmark / regression state

Existing reusable infrastructure includes:

- deterministic seeded fixed-depth benchmark;
- paired openings with South/North seat swap;
- Namua/Mtaji opening-phase generation;
- time-limited operational benchmark;
- tactical regression suite;
- search/TT/quiescence/evaluation-cache regression tests;
- Worker/fallback and AI configuration tests;
- research-derived replay, independent verification, identity-firewall and continuation-policy infrastructure.

`BENCHMARK_PROTOCOL.md` has a frozen framework, but candidate-specific numeric non-inferiority/release gates are not frozen. Therefore PBAI-C is not complete.

## Next required work

1. **PBAI-B — AI-GEN2 Public Baseline Freeze**: bind exact repository/deployment source, file hashes, engine binding, default profile/search, hard/expert device budgets, TT/quiescence/move-order/cache/randomness/worker/fallback semantics and supported runtime/PWA assumptions; resolve the baseline/documentation reconciliation items above.
2. **PBAI-C — numeric non-regression / release-gate freeze**: freeze candidate-independent hard gates and candidate-specific numeric acceptance rules before any development authorization.
3. Only after PBAI-B/PBAI-C may a single `PBAI-Cxxx` candidate be moved to `AUTHORIZED-FOR-DEVELOPMENT`.
4. `AI-GEN3` remains reserved until all validation/holdout/regression/operational gates pass, an explicit `ADOPT` decision exists, and the approved build is actually deployed as public default.

## Explicitly not done

- no evaluation-weight change;
- no phase/morphology bonus;
- no tactical C03 production hard-code;
- no adaptive/selective deepening implementation;
- no exact-oracle connection to public AI;
- no score→win-probability conversion;
- no symmetry/canonicalization introduction;
- no public deployment;
- no `AI-GEN3` promotion.
