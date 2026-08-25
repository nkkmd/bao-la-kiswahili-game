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

The study separately names and tests engine-semantic state, identity projection, serialized raw state, state key, workflow raw row, repository stored row, reconstructed raw state, and reporting representation.

## D-006 — Identity fields are outcome-frozen

The Stage 1 state-key field set was frozen before formal generation:

```text
include: pits, reserve, houseOwned, player, phase, winner, pending
exclude from primary state key: turn, reason
```

No post-outcome change is allowed.

## D-007 — Seed conservation includes pending under current semantics

The frozen conservation representation is:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

for standard-engine states in this study. It was source-bound and synthetic-fixture validated before Stage 1 authorization and was not changed after outcome inspection.

## D-008 — Original REWR workflow artifacts are prior provenance, not ORISC outcomes

Recovered original production and independent files from REWR workflow run `32702596730` contain `pending=[1,0]` for the three terminal raw states later seen with repository row mismatches, and all eight raw states represent 64 seeds.

This is known prior technical information. It was not counted as new Stage 1 evidence.

## D-009 — Repository-facing materialization is a separate audit target

The repository result introduced in commit `eb6052679e94de62bacec0eebe13758c7e85638d` differs from the verified workflow raw rows for the three affected terminal states. The exact materialization mechanism remains unresolved. The stored file remained read-only during formal evaluation.

## D-010 — No oracle rewrite as a gate repair

If stored rows fail the Stage 1 binding gate, the study reports that result under the frozen decision rule. Stored rows may not be replaced or edited and then used to authorize Stage 2 in the same study.

## D-011 — IDENTITY is the primary positive control

IDENTITY must pass state identity, move identity, transition identity, terminal semantics, oracle reconstruction and production/independent equality before any nontrivial transform can receive a formal decision.

## D-012 — Stage 2 candidate contract must be pre-outcome

Stage 2 candidates, applicability predicates, state maps, move maps, populations, root/depth rules and controls were required to be frozen before Stage 1 outcome generation. Prior SIP diagnostic zero-mismatch counts were not candidate-tuning inputs.

## D-013 — No automatic inheritance of SIP candidates

The old SIP T01/T02/T03 definitions are context/prior information only. Semantically similar ORISC candidates were independently justified and assigned new ORISC identities in the pre-outcome contract.

## D-014 — Exact claims require zero mismatch

For exact state identity, move-equivariance, transition commutation and graph-isomorphism claims, every applicable gate requires exact zero mismatch. Approximate pass rates are not substitutes.

## D-015 — Representation failure is not symmetry rejection

If Stage 1 fails or is non-estimable, Stage 2 is not authorized and nontrivial candidates receive no formal pass/fail label. A representation-integrity defect is not interpreted as a failed symmetry.

## D-016 — Independent implementation separation is mandatory

Production and independent verifier do not share serializer, state-key helper, exact legal-move generator, guard-free transition, closure traversal, terminal-accounting helper, or symmetry state/move transform implementations. Comparison occurs after independent outputs exist.

## D-017 — `moveVariants` must be considered for Namua formal move identity

Where Stage 2 would include Namua positions, exact move-set bijection must account for `moveVariants` so distinct `houseChoice` outcomes cannot be silently collapsed.

## D-018 — Candidate population selection must be outcome-blind

Any fresh Stage 2 roots/depths/seed blocks must be selected using preregistered technical or structural rules only. No candidate mismatch rate, favorable subgroup or post-result seed extension may affect the formal population.

## D-019 — Separate authorization per scientific stage

Stage 1 and Stage 2 require separate machine-readable freezes and authorizations. Stage 1 authorization never implicitly authorizes Stage 2.

## D-020 — Stage 3 is the only canonicalization authorization point

Even a valid Stage 2 confirmed transform would not automatically authorize a global canonical key. Stage 3 would have to specify domain, reachability interpretation, transformation set, inverse/composition/closure properties and downstream scope.

## D-021 — No scientific outcome generation during initialization

Initial branch/document creation and Stage 0A provenance work generated no Stage 1 or Stage 2 formal result. Scientific generation remained blocked until the required frozen contracts and authorization existed.

## D-022 — Stage 0A completed as technical-only provenance work

Stage 0A independently bounded the workflow-to-repository discrepancy to exactly three terminal rows and the identity field `pending`; original production and independent workflow rows were exactly equal and all eight represented 64 seeds. This remained prior/technical evidence and did not itself decide Axis A.

The unresolved artifact materialization mechanism is recorded as:

```text
UNRESOLVED-PROVENANCE-GAP
```

## D-023 — Conditional Stage 2 contract was frozen before Axis A outcome

Before any Stage 1 formal result, the conditional candidate contract was frozen with SHA-256:

```text
6509dc18553d968437d87f7522cacebb4b66f13f15469240075964b72f1c8796
```

It contains `ORISC-C00-IDENTITY`, frozen negative control `ORISC-C01-LR-NO-DIRECTION-FLIP`, three nontrivial scientific candidates, seeds `23110001..23110128`, 12 roots per stratum and depth 4. No Stage 1 outcome was available when these choices were frozen.

## D-024 — Pre-authorization spec revision was technical-only

The first frozen Stage 1 spec was never authorized and produced no scientific outcome. Before authorization, it was superseded solely to bind the already-defined formal GitHub Actions workflow by byte SHA-256.

No population, endpoint, identity field, gate, decision rule, candidate, seed block, threshold or interpretation boundary changed.

Final spec:

```text
specSha256 = 5a766ec900c1f76c5b832f2c76153b9426b3970316b31806d377c497d1e585e5
formal workflow SHA-256 = 0f5e5da13e84e9511a477a8fdfc01133e3a36cc08e908e16a31b71517e3b429f
```

## D-025 — Stage 1 authorization was Axis-A-only

Stage 1 authorization was issued after source/hash validation:

```text
authorizationId = ORISC-S1-REPRESENTATION-INTEGRITY-AUTH-2026-08-25-v1
authorizationSha256 = b8bc9c65510c2f4ea0909e269af7945d7ae5d3d32b595224519b1549a275325e
```

It explicitly did not authorize Stage 2 symmetry execution or any upstream artifact mutation.

## D-026 — Formal Axis A decision is NOT-CONFIRMED

The authorized Stage 1 formal run produced:

```text
formalDecision = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
PASS = A-G1 A-G2 A-G3 A-G4 A-G5 A-G6 A-G7 A-G10 A-G12
FAIL = A-G8 A-G9 A-G11
```

The decision is not `NON-ESTIMABLE` because production and independent implementations agreed exactly on the reconstructed graph, serializers, affected rows, mismatch counts and gate classification (`A-G12=PASS`).

## D-027 — Raw graph integrity and repository-row binding are distinct findings

Both independent tracks reconstructed the immutable raw graph exactly:

```text
states = 8
edges = 7
state/transition hashes = exact frozen matches
represented seed totals = {64}
terminal accounting mismatches = 0
repository transition successor mismatches = 0
```

Exactly three immutable repository-facing terminal rows failed re-hash and raw-state binding; each differed from reconstructed raw state only in `pending` and represented 63 rather than 64 seeds.

This finding concerns the downstream repository-row reconstruction contract, not the upstream exact game-theoretic solution.

## D-028 — IDENTITY failure blocks Axis B

Repository-oracle reconstruction was a mandatory part of `ORISC-C00-IDENTITY`; therefore `A-G11=FAIL`.

The frozen Stage 2 authorization gate required Stage 1 `CONFIRMED`, IDENTITY PASS, production/independent equality PASS, and a separate Stage 2 authorization. Those conditions were not met.

Accordingly:

```text
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
nontrivial candidate formal decisions generated = 0
```

No ORISC T01/T02/T03 candidate is validated, rejected or assigned `NON-ESTIMABLE` by Axis B because Axis B was never executed.

## D-029 — No canonicalization or symmetry-reduced counting authorization

Because Axis B was not executed, the validated transformation set remains empty:

```text
canonicalization = NOT AUTHORIZED
symmetry-group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
```

No Stage 3 scientific execution is needed beyond recording this downstream non-authorization.

## D-030 — State Space / Game Tree Complexity may proceed raw-only

The completed ORISC result does not block State Space / Game Tree Complexity research that uses authoritative raw state identity only.

It does block treating the repository-facing REWR state rows as a validated transform anchor under the ORISC contract and blocks using the unexecuted ORISC T01/T02/T03 candidates for reduction.

## D-031 — Study closure

`ORISC-STUDY1` is closed after preservation of the Stage 0A provenance audit, pre-outcome Stage 2 candidate contract, Stage 0B prefreeze, final Stage 1 spec and authorization, formal production/independent evidence, canonical Axis A result, Study-level closure result, Overview and Final Report.

No further scientific outcome generation is authorized within this Study 1. Any future attempt to repair repository representation or re-test symmetry must use a new prospective study/versioned protocol without changing the formal result recorded here.