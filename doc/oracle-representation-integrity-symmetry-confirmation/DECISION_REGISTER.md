# DECISION_REGISTER — ORISC-STUDY1

Updated: 2026-08-25

## D-001 — New independent Study

`ORISC-STUDY1` is a new prospective independent study. It is not `SIP-STUDY1` Stage 2, corrected v2, continuation, rescue, or retrospective candidate reanalysis.

## D-002 — REWR formal decision is immutable

`REWR-STUDY1` remains `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` for the frozen 8-state / 7-edge domain. This study may evaluate a new downstream representation-integrity endpoint but may not retroactively invalidate, correct, or rescue the upstream exact result.

## D-003 — SIP closure is immutable

`SIP-STUDY1` remains closed at `0 validated / 0 rejected / 5 NON-ESTIMABLE`; v1 remains technically invalidated for candidate-decision use and v2 remains not authorized / not executed.

## D-004 — Raw state is authoritative until a new authorization exists

Until a valid Stage 3 decision:

```text
raw state identity = authoritative
validated symmetry set = empty
canonicalization = not authorized
symmetry-reduced state counting = not authorized
```

## D-005 — Representation layers are distinct

The study must separately name and test engine-semantic state, identity projection, serialized raw state, state key, workflow raw row, repository stored row, reconstructed raw state, and reporting representation.

## D-006 — Identity fields are outcome-frozen

The final Stage 1 protocol must freeze the state-key field set before formal generation. The current code-derived candidate contract is:

```text
include: pits, reserve, houseOwned, player, phase, winner, pending
exclude from primary state key: turn, reason
```

No post-outcome change is allowed.

## D-007 — Seed conservation includes pending under current semantics

The prospective conservation representation is:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

for standard-engine states in this study. The definition must be source-hashed and synthetic-fixture validated before Stage 1 authorization. It may not be redefined after observing the oracle integrity result.

## D-008 — Original REWR workflow artifacts are prior provenance, not ORISC outcomes

Recovered original production and independent files from REWR workflow run `32702596730` contain `pending=[1,0]` for the three terminal raw states later seen with repository row mismatches, and all eight raw states represent 64 seeds.

This is known prior technical information at the start of `ORISC-STUDY1`. It cannot be counted as new Stage 1 evidence.

## D-009 — Repository-facing materialization is a separate audit target

The repository result introduced in commit `eb6052679e94de62bacec0eebe13758c7e85638d` differs from the verified workflow raw rows for the three affected terminal states. The mechanism remains an audit question. The stored file is read-only during formal evaluation.

## D-010 — No oracle rewrite as a gate repair

If stored rows fail the prospective Stage 1 binding gate, the study must report that result under the frozen decision rule. It may not replace or edit stored rows and then use the edited artifact to authorize Stage 2 in the same formal run.

## D-011 — IDENTITY is the primary positive control

IDENTITY must pass state identity, move identity, transition identity, terminal semantics, oracle reconstruction and production/independent equality before any nontrivial transform can receive a formal decision.

## D-012 — Stage 2 candidate contract must be pre-outcome

The final Stage 2 candidates, applicability predicates, state maps, move maps, populations, root/depth rules and controls must be frozen before Stage 1 outcome generation is authorized. Prior SIP diagnostic zero-mismatch counts cannot be used for candidate tuning.

## D-013 — No automatic inheritance of SIP candidates

The old SIP T01/T02/T03 definitions are context/prior information only. If the new candidate set contains semantically similar transforms, each must be independently justified from current rule semantics and assigned a new `ORISC` identity under the frozen Stage 0B contract.

## D-014 — Exact claims require zero mismatch

For exact state identity, move-equivariance, transition commutation and graph-isomorphism claims, every applicable gate requires exact zero mismatch. Approximate pass rates are not valid substitutes.

## D-015 — Representation failure is not symmetry rejection

If Stage 1 fails or is non-estimable, Stage 2 is not authorized and nontrivial candidates receive no formal pass/fail label. A representation-integrity defect must not be interpreted as a failed symmetry.

## D-016 — Independent implementation separation is mandatory

Production and independent verifier must not share serializer, state-key helper, exact legal-move generator, guard-free transition, closure traversal, terminal-accounting helper, or symmetry state/move transform implementations. Comparison occurs only after both artifacts exist.

## D-017 — `moveVariants` must be considered for Namua formal move identity

Where a Stage 2 candidate includes Namua positions, exact move-set bijection must account for `moveVariants` so distinct `houseChoice` outcomes are not silently collapsed.

## D-018 — Candidate population selection must be outcome-blind

Any fresh Stage 2 roots/depths/seed blocks must be selected using preregistered technical or structural rules only. No candidate mismatch rate, favorable subgroup or post-result seed extension may affect the formal population.

## D-019 — Separate authorization per scientific stage

Stage 1 and Stage 2 require separate machine-readable freezes and separate authorizations. A Stage 1 authorization never implicitly authorizes Stage 2.

## D-020 — Stage 3 is the only canonicalization authorization point

Even a valid Stage 2 confirmed transform does not by itself authorize a global canonical key. Stage 3 must explicitly specify domain, reachability interpretation, transformation set, inverse/composition/closure properties and downstream scope.

## D-021 — No scientific outcome generation during initialization

Initial branch/document creation and Stage 0A provenance work may proceed. No Stage 1 or Stage 2 formal result may be generated until the required frozen contracts and authorizations exist.