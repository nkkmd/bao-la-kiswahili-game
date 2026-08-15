# STAGE 2 FORMAL PROTOCOL — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## 1. Purpose

Stage 2 prospectively tests whether a subset of the frozen Stage 1 exploratory tactical-motif definitions reproduce as transferable, machine-reproducible move principles in a fresh non-overlapping corpus.

Stage ID:

`TM-S2-FORMAL-2026-08-14-v1`

This protocol does not alter Stage 1. The eight Stage 1 promoted definitions remain frozen exactly as recorded in `STAGE_1_CANDIDATE_FREEZE.json`.

## 2. Formal unit: four canonical support-equivalence families

Stage 1 produced eight promoted definitions forming four exact `supportIdentityHash` pairs.

Stage 2 freezes one canonical formal candidate per pair using one deterministic rule fixed before any fresh Stage 2 data:

> choose the lowest Stage 1 promoted rank within each exact `supportIdentityHash` group.

The paired definition is retained only as a descriptive diagnostic. It cannot replace, merge with, rescue, or supersede the canonical definition after fresh-data inspection.

Canonical candidates:

- `TM-S2-C01`: Stage 1 rank 1
- `TM-S2-C02`: Stage 1 rank 3
- `TM-S2-C03`: Stage 1 rank 5
- `TM-S2-C04`: Stage 1 rank 7

Machine-readable candidate definition:

`doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json`

SHA-256:

`667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`

## 3. Fresh confirmatory corpus

Fixed population:

- games: 3,072
- fresh seeds: `22000001–22003072`
- max ply: 100
- first 8 plies: seeded uniform exact `E.moveVariants`
- six generation strata, 512 games each:
  - `B-D1`
  - `B-D2`
  - `B-D3`
  - `LS-D2`
  - `V2-D2`
  - `LE-D2`
- no early stopping
- no outcome-dependent extension
- no replacement sampling

The six strata remain trajectory-diversification devices only and do not reopen earlier search/evaluator studies.

## 4. Candidate-specific root selection

Identical historical trajectories are collapsed before candidate-specific selection. Representative trajectory = minimum seed then game ID.

For each canonical candidate separately, an eligible state must satisfy only:

1. candidate phase;
2. candidate canonical structural precondition;
3. nonterminal, ply >= 8;
4. at least two exact `E.moveVariants`;
5. at least one exact legal move matching the canonical frozen move abstraction.

Eligibility explicitly excludes:

- the candidate consequence;
- D1/D2/D3 value;
- reply outcome;
- game outcome.

Each eligible trajectory contributes at most one root per candidate, chosen by minimum SHA-256 rank using candidate-specific salt and `{candidateId, historicalTrajectoryHash, ruleStateKey, ply}`.

Unavailable trajectories receive no replacement. Duplicate selected `ruleStateKey` values are collapsed within each candidate with no replacement.

## 5. Deterministic candidate move

At a selected root, all exact legal moves matching the frozen canonical move abstraction are collected.

The formal candidate move is the lexicographically smallest `AI.moveKey`.

This choice cannot depend on search value, consequence realization, reply structure, or later outcome.

All legal root moves are nevertheless measured so the candidate has a within-state comparator.

## 6. Co-primary endpoints

Each canonical candidate has two preregistered binary co-primary endpoints.

### Structural success

The deterministic candidate move satisfies its frozen Stage 1 consequence predicate.

This consequence is an outcome. It is not part of root eligibility or move selection.

Formal test:

- H0: `p <= 0.50`
- H1: `p > 0.50`
- exact one-sided binomial
- required observed rate: >= 0.60

### Tactical-value success

The deterministic candidate move belongs to the exact D3 top set among all legal root moveVariants under frozen `bao / phase2 / D3` instrumentation.

Formal test:

- H0: `p <= 0.50`
- H1: `p > 0.50`
- exact one-sided binomial
- required observed rate: >= 0.60

Additional consistency gates:

- D3 at-or-above state-median rate >= 0.60
- D3 unique-worst rate <= 0.15

## 7. Estimability and transferability gates

Per canonical candidate:

- selected unique historical trajectories >= 96
- selected unique rule states >= 96
- distinct opening prefixes >= 48
- maximum one-opening-prefix share <= 0.10
- generation strata represented >= 4
- maximum one-stratum share <= 0.50

Failure of any gate yields `INCONCLUSIVE-NOT-ESTIMABLE`. The corpus is not extended.

## 8. Multiplicity

There are exactly eight planned confirmatory tests:

`4 canonical candidates × 2 co-primary endpoints`

Family-wise alpha = 0.05.

Adjustment = Holm-Bonferroni across all eight planned p-values.

If an endpoint is non-estimable, its value for multiplicity adjustment is fixed to `p = 1.0`. Endpoints may not be dropped after data inspection.

## 9. Candidate decision rule

A candidate is `CONFIRMED` only if all of the following hold:

1. every estimability/transferability gate passes;
2. structural-success observed rate >= 0.60;
3. tactical-value-success observed rate >= 0.60;
4. both Holm-adjusted co-primary p-values <= 0.05;
5. D3 at-or-above-median rate >= 0.60;
6. D3 unique-worst rate <= 0.15.

If estimable but any required formal condition fails: `NOT-CONFIRMED`.

If an estimability/transferability gate fails: `INCONCLUSIVE-NOT-ESTIMABLE`.

If corpus generation, independent replay/search verification, source binding, or measurement integrity fails before formal evaluation: `TECHNICAL-INCONCLUSIVE`.

Zero confirmed candidates is a valid study outcome.

## 10. Paired Stage 1 definitions

The paired Stage 1 definition in each support-equivalence group is descriptive-only.

At canonical selected roots Stage 2 may report:

- whether the paired precondition also holds;
- whether the paired consequence also holds.

These diagnostics do not enter the formal decision and cannot trigger candidate substitution, redefinition, merging, splitting, or rescue.

## 11. Verification firewall

Scientific execution order must be:

`generate → independent full replay/search verify → candidate-specific select → measure → formal evaluate`

Selection is blocked until full replay and full generation-search recomputation pass.

Formal evaluation is blocked until measurement identity/provenance checks pass.

## 12. No-rescue rule

After Stage 2 scientific generation begins, the following are forbidden:

- seed extension;
- replacement sampling;
- replacement for unavailable candidate trajectories;
- replacement for duplicate rule states;
- candidate substitution;
- paired-definition promotion;
- threshold retuning;
- endpoint retuning;
- post-outcome search-depth selection;
- favorable subset selection;
- redefining a failed candidate.

A redesign requires a new prospective Stage 2 version and a new fresh seed block.

## 13. Interpretation boundary

A `CONFIRMED` result authorizes only a **machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization**.

The phrase `confirmed tesuji` may be used only with this explicit machine-operational qualification.

The study does not establish:

- traditional/expert-recognized tesuji;
- human importance;
- beginner importance;
- pedagogical value;
- generalization to other rules, engines, evaluators, or search instruments.

## 14. Authorization boundary

This protocol and its machine-readable spec do **not** authorize Stage 2 data generation.

Generation requires:

1. candidate/spec validator success;
2. formal runner + independent verifier + evaluator implementation;
3. separate technical validation of that implementation;
4. exact SHA-256 binding of all scientific source files;
5. committed `STAGE_2_FORMAL_AUTHORIZATION.json`.

Machine-readable spec:

`doc/tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json`

SHA-256:

`83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
