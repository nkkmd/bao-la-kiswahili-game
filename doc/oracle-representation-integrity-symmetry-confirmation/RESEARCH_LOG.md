# RESEARCH_LOG — ORISC-STUDY1

## 2026-08-25 — Study initialization

### Repository state

- Rechecked remote `main` rather than assuming the previously reported SHA.
- Confirmed current `main` HEAD: `e8f0a3c360d9e7c9f7f6882fb212a32921040912`.
- Confirmed open pull requests: `0`.
- Created new branch `research/oracle-representation-integrity-symmetry-confirmation` directly from that `main` commit.
- Assigned new Study ID `ORISC-STUDY1`.

No assertion is made about a local checkout worktree because this initialization is being performed through the GitHub repository interface.

### Upstream boundary reconstruction

Restored `REWR-STUDY1` as immutable:

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Restored `SIP-STUDY1` as immutable:

```text
studyStatus = COMPLETED
formalDecision = NON-ESTIMABLE
validated = 0
notValidated = 0
nonEstimable = 5
v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

The new study is explicitly not a continuation or rescue of either study.

### Rule and identity implementation audit

Re-read the current engine and exact-solver implementations.

Current raw identity contract in the exact tooling is based on:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

with `turn` and textual `reason` excluded from the primary state key.

Current engine semantics confirm:

- `FRONT = 0`, `BACK = 1`, `HOUSE = 4`;
- player pit coordinates are player-local;
- facing opponent front index is `7-index`;
- `finishOnEmptyFront` transfers the captured amount into `pending[player]` before setting the winner;
- Namua formal move identity may require `moveVariants` because `houseChoice` can distinguish outcomes.

### Recovery of original REWR scientific artifact

Recovered the still-available original GitHub Actions artifact:

```text
workflow run = 32702596730
artifact id = 9511074442
artifact ZIP SHA-256 = 7da2a3f46745c18f4aa8896bc6a576b5d56b490b1461a4def3364183b047c023
workflow head = 85c6a85fada301fcba526142549945e25a659855
```

The original production result and independent verification both contain eight raw state rows. Every raw state has:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

For the three terminal keys known from the earlier SIP read-only diagnostic, both original files carry `pending=[1,0]`, whereas the later repository-facing `STAGE_1_EXACT_RESULT.json` carries `pending=[0,0]` for those rows.

This localizes the already-known representation problem more precisely: it is absent from the original verified production/independent workflow outputs and appears in the later repository-facing result representation. This is recorded as **pre-formal prior provenance**, not as a new ORISC Stage 1 outcome.

### Repository-facing result provenance

The repository-facing exact result was introduced in commit:

```text
eb6052679e94de62bacec0eebe13758c7e85638d
parent = 85c6a85fada301fcba526142549945e25a659855
```

That commit changes Restricted Endgame documentation/checkpoint/result files but does not introduce a result-materializer implementation. Therefore the exact mechanism by which the three `pending` values changed remains unresolved and is retained as a Stage 0A provenance question.

No upstream artifact was edited.

### Study architecture selected

The preferred architecture is:

```text
Stage 0A  technical / semantic / provenance audit
Stage 0B  pre-outcome contract and candidate freeze
Stage 1   formal Oracle Representation Integrity
Stage 2   conditional Independent Symmetry Confirmation
Stage 3   downstream canonicalization authorization decision
```

The important addition beyond a simple Stage 0/1/2 plan is **Stage 0B**: the Stage 2 candidate contract must be frozen before Stage 1 outcomes are generated. This prevents a representation result from influencing candidate definitions, applicability predicates, populations, roots, graph depth, or controls.

### Formal outcome firewall

At the end of initialization:

```text
ORISC Stage 1 formal spec = not created
ORISC Stage 1 authorization = not created
ORISC Stage 1 result = not generated
ORISC Stage 2 candidate contract = not frozen
ORISC Stage 2 authorization = not created
ORISC Stage 2 result = not generated
canonicalization authorization = none
```

No existing formal decision has been modified.

## Next work

1. Complete Stage 0A provenance tracing and serializer inventory.
2. Add synthetic, oracle-independent terminal capture / pending / state-key fixtures.
3. Freeze production-versus-independent implementation boundaries.
4. Audit seed/source identity availability for any later fresh Stage 2 population.
5. Independently derive the prospective ORISC symmetry candidate set from current rule semantics.
6. Freeze Stage 1 endpoints and the conditional Stage 2 candidate/population contract together in Stage 0B.
7. Only after freeze validation, create a separate Stage 1 authorization.

Formal scientific execution remains blocked until those steps are complete.