# DRSSE-STUDY1 — Main Integration Checkpoint

Date: 2026-08-28

## Integration

```text
Program = G2-05
Study ID = DRSSE-STUDY1
Integration PR = #71
Baseline main before Study = c515c36a9b27a796dc7eae13fd1b2cec2b9d3ea6
Final research head = a6a4dc73ae1b448a909913dbff99b06862da2ac0
Merge commit = 8d024c5a6b5114eefbab8fb23d54582d149b85f3
Integrated branch = main
Formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

## Canonical formal result remains unchanged

```text
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
target depth = 9
complete reachable layers = 0..9
complete parent expansion layers = 0..8
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
lastCompleteDepth = 9
firstIncompleteDepth = null
stopReason = null
```

Canonical Stage 2 provenance:

```text
authorization/head = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
workflow run = 33156581843
workflow job = 98800676702
artifact = 9679860509
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
```

## Final pre-merge consistency audit

Before merge, the following were cross-audited and found consistent with the canonical result and interpretation boundary:

- root `README.md`;
- Study `README.md`;
- `STUDY_1_OVERVIEW.md`;
- `STUDY_1_FINAL_REPORT.md`;
- `CURRENT_STATUS.md`;
- `DECISION_REGISTER.md`;
- `REPRODUCIBILITY_INDEX.md`;
- `RESEARCH_LOG.md`;
- `results/STAGE_2_FORMAL_RESULT.json`;
- `results/STUDY_1_FINAL_RESULT.json`;
- `doc/RESEARCH_INDEX.md`;
- `doc/FUTURE_RESEARCH_AGENDA.md`;
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`;
- `doc/research-program-decisions/2026-08-28-g2-05-deep-raw-state-space-enumeration-study1-closure.md`.

The audit confirmed identical formal decision/token, principal exact counts, RAW-only identity, empty validated-transform set, G2-04/G1 no-rescue boundaries, and the G2-12 extrapolation boundary. `RULES_BASELINE.md` and AI-engineering documents were not changed because G2-05 modified neither rule-engine semantics nor public-AI engineering state.

One navigation omission was found and corrected before merge: the Study README did not initially link the PR-review disposition checkpoint. No scientific result or source was changed.

## PR review disposition

Automated review identified two valid latent concerns in hypothetical/future execution paths:

1. a resource-incomplete formal run would require independent re-enumeration through every claimed-complete layer;
2. a future enumerator should perform a final ambient/resource-cap recheck after the last transition/materialization before classifying completion.

Neither affected the accepted canonical run. The run was target-complete and underwent full independent depth-9 re-enumeration, and final recorded resource use remained well below all frozen caps. The frozen formal source was not modified or rerun after outcome observation. Full disposition is recorded in `2026-08-28-pr71-review-disposition.md`.

## Final pre-merge CI

All PR workflows passed on final research head `a6a4dc73ae1b448a909913dbff99b06862da2ac0`:

```text
DRSSE Study 1 Closure CI = success (run 33167122626)
Second-generation research agenda audit = success (run 33167122612)
SSGTC closure consistency audit = success (run 33167122620)
PCEM closure consistency audit = success (run 33167122615)
Phase Transition Research CI = success (run 33167122608)
```

PR #71 was mergeable, non-draft, and had no unresolved review threads before integration.

## Integration operation

PR #71 was merged with expected-head SHA protection and history-preserving merge semantics:

```text
expected head = a6a4dc73ae1b448a909913dbff99b06862da2ac0
merge method = merge
merge commit = 8d024c5a6b5114eefbab8fb23d54582d149b85f3
```

## Immutable downstream boundary

Integration changes no G2-01, G2-02, G2-03, G2-04, Research Generation 1, restricted-endgame, symmetry, ORISC, SSGTC, PCEM, or AI-engineering decision. RAW state identity remains authoritative and the validated transform set remains empty.

G2-05 does not establish a total Bao state-space count, total game-tree complexity, unbounded reachable-state estimate, or asymptotic growth model. Those questions require new prospective work, including G2-12. The next uncompleted P0 Research Generation 2 agenda item is G2-06.
