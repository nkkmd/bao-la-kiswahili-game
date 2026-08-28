# STSCV-STUDY1 — Main Integration Checkpoint

Date: 2026-08-28

## Integration

```text
Program = G2-03
Study ID = STSCV-STUDY1
Integration PR = #69
Baseline main before Study = a8493d2a50e11f15d16ef8348f2442b262ca275d
Final research head = c6f2fa750ce2e30a5ce359b9f3c594145c8e5a38
Merge commit = 2b5f297e09330348fdb2c42472aed50340eb0180
Integrated branch = main
Formal decision = INCONCLUSIVE
Validated transform set = []
```

## Scientific closure remains unchanged

The Stage 2 mandatory independent-verification gate was not established because the frozen independent verifier terminated during formal-result assembly with:

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

The prospectively frozen global-failure rule therefore remains controlling:

```text
STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

Repository integration does not promote the production-only zero-mismatch diagnostics to formal validation and does not convert the technical verifier failure into scientific `NOT-VALIDATED` evidence.

## Pre-merge documentation and consistency audit

Before merge:

- root `README.md` included the G2-03 closure and linked the Study Overview;
- `doc/RESEARCH_INDEX.md` included G2-03 as completed and linked the canonical closure records;
- `doc/FUTURE_RESEARCH_AGENDA.md` marked G2-03 complete with formal `INCONCLUSIVE` / candidates `NON-ESTIMABLE`, retained RAW-only downstream identity, and advanced the next P0 candidates to G2-04/G2-05/G2-06;
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md` recorded the G2-03 program closure;
- Study Overview, Final Report, Current Status, Decision Register, Research Log, Reproducibility Index, preregistrations, authorizations, results, and checkpoints were cross-audited;
- the distinction between the missing workflow-produced independently verified formal-result artifact and the repository-facing fail-closed `results/STAGE_2_FORMAL_RESULT.json` was made explicit;
- no unresolved PR review thread existed;
- the research branch was ahead of `main` and behind by 0 commits;
- PR #69 was mergeable.

## Final pre-merge CI / audit state

All final PR workflows on research head `c6f2fa750ce2e30a5ce359b9f3c594145c8e5a38` passed:

```text
Second-generation research agenda audit = success (run 33148001769)
Phase Transition Research CI = success (run 33148001787)
PCEM closure consistency audit = success (run 33148001789)
SSGTC closure consistency audit = success (run 33148001829)
```

## Integration operation

PR #69 was changed from draft to ready-for-review only after the final documentation/CI audit. It was then merged with expected head SHA protection using:

```text
expected head = c6f2fa750ce2e30a5ce359b9f3c594145c8e5a38
merge method = merge
merge commit = 2b5f297e09330348fdb2c42472aed50340eb0180
```

The pre-merge `main` HEAD remained `a8493d2a50e11f15d16ef8348f2442b262ca275d` until the merge operation.

## No-rescue boundary

No candidate definition, formal population, seed range, mismatch tolerance, decision rule, canonical representative rule, RAW identity, Stage 2 evidence, or verifier source was changed to alter the scientific result during closure or integration.

Any future formal transformation/canonicalization re-test requires a new prospective Study or explicitly new versioned protocol, fresh authorization, and fresh formal evidence.
