# ORISC-STUDY1 — Stage 0A Technical / Semantic / Provenance Audit Plan

Status: **HISTORICAL PREFORMAL PLAN / STAGE 0A COMPLETED / TECHNICAL-ONLY**

This file preserves the plan that governed Stage 0A before formal Axis A execution. It is not the current study status. The completed Stage 0A record is `STAGE_0A_TECHNICAL_AUDIT.md`; final study status is in `CURRENT_STATUS.md` and `STUDY_1_FINAL_REPORT.md`.

## Objective

Stage 0A reconstructs the provenance and semantics needed to freeze a valid formal representation-integrity protocol. It may discover technical facts, but it may not issue the Study's Stage 1 representation-integrity decision or any Stage 2 symmetry decision.

## A. Source identity inventory

Record Git blob / byte SHA identities for at least:

- `public/engine.js`;
- Restricted Endgame production transition, tablebase, runner and verifier implementations;
- Restricted Endgame Stage 1 domain/spec/authorization;
- original scientific workflow artifacts;
- repository-facing exact result;
- SIP diagnostic and transform tooling used only as prior context.

Any source drift material to the eventual formal run must be resolved before freeze, never after a formal outcome.

## B. Artifact provenance chain

Construct a read-only chain:

```text
frozen reachable root
  -> production exact graph/result
  -> independent exact reconstruction/verification
  -> workflow artifact archive
  -> repository-facing exact result materialization
  -> later SIP oracle-anchor consumption
```

For each boundary, compare:

```text
state keys
raw identity fields
row count
state-set identity
transition-set identity
solution identity
pending values
represented seed totals
```

The audit must distinguish exact observed differences from inferred causes. If the mechanism of a change cannot be established from repository/workflow provenance, report it as unresolved rather than inferring manual or automatic corruption.

## C. Raw-state serializer inventory

Locate every serializer/state-key path that may be relevant to the formal study and document:

- included/excluded fields;
- object-key ordering rule;
- array ordering rule;
- null/undefined/missing-field behavior;
- defaulting behavior for `pending`;
- SHA-256 byte/string input;
- whether the implementation shares code with another verifier.

Formal Stage 1 cannot rely on two wrappers around the same serializer as evidence of independence.

## D. Oracle-independent synthetic fixtures

Before formal oracle evaluation, create synthetic or transition-derived fixtures that test semantics without using the eight oracle rows as expected-answer fixtures.

Minimum fixture classes:

1. `pending` distinguishes raw state identity even when pits/reserve/player/etc. are otherwise identical;
2. changing `turn` alone does not change the primary state key;
3. changing `reason` alone does not change the primary state key;
4. terminal capture through `finishOnEmptyFront` preserves represented seed total by moving removed captured seeds into `pending`;
5. no-move/front-empty terminal paths that do not remove a captured quantity do not invent pending seeds;
6. production/independent serializers produce identical canonical bytes and keys for the synthetic contract while remaining separately implemented;
7. exact move identity distinguishes any relevant Namua `houseChoice`/`moveVariants` outcomes.

Synthetic fixture success is instrumentation readiness only, not evidence that the stored oracle passes Stage 1.

## E. Exact transition reconstruction readiness

Audit production and independent exact Mtaji transition paths for:

- legal-move generation;
- player-local sowing ring;
- `7-index` facing capture relation;
- terminal capture accounting;
- house ownership changes;
- phase and player switching;
- runtime relay guard separation from normative exact semantics;
- deterministic state-key emission.

No new exact-oracle decision is generated in Stage 0A.

## F. Independent implementation boundary

Prepare two implementation tracks with no sharing of:

```text
raw-state projection
stable serializer
state key
legal-move generator
guard-free transition
closure traversal
terminal accounting helper
symmetry state transform
symmetry move transform
```

Shared frozen input files and a post-hoc comparison schema are permitted. Any unavoidable shared dependency must be listed explicitly and evaluated for correlated-error risk before authorization.

## G. Stage 2 pre-outcome candidate derivation

Independently re-derive possible symmetry candidates from current Bao semantics before Stage 1 outcomes.

The derivation may use semantic facts such as player-local coordinates, FRONT/BACK roles, `HOUSE=4`, facing index `7-index`, phase/reserve/house invariants, and winner/player permutations. It may cite prior SIP candidates as declared prior context, but may not use their observed mismatch counts to choose or tune the new candidates.

Each retained ORISC candidate must receive:

- new candidate ID;
- exact applicability predicate;
- state map;
- move map;
- winner/player permutation;
- inverse expectation;
- reachability interpretation;
- exact population/scope;
- prospective non-applicability cases.

## H. Population and seed collision audit

If Stage 2 uses fresh historically reachable sampled roots, verify before freeze that its seed block and raw root identities do not overlap forbidden prior formal/exploratory populations under the intended independence rule. Define shortage handling and stop rules before generation.

## I. Stage 0A completion criteria

Stage 0A is complete only when:

- source/provenance inventory is explicit;
- the workflow-to-repository representation discrepancy is bounded and documented without rewriting upstream data;
- synthetic serializer/terminal fixtures are designed and pass independently;
- implementation independence is documented;
- a candidate/population proposal exists without using new Stage 1 outcomes;
- all information needed for a machine-readable Stage 0B freeze is available.

Completion of Stage 0A does **not** authorize Stage 1.

## Historical disposition

All Stage 0A completion criteria were subsequently met. Stage 1 was later frozen and separately authorized, and the final Axis A decision was `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`. Stage 2 remained `NOT-AUTHORIZED-NOT-EXECUTED`. These later results do not alter the preformal rules recorded above.