# SSGTC-STUDY1 — Stage 0 Technical Validation Protocol

Frozen before Stage 0 execution.

## Scope

Stage 0 validates representation, deterministic replay, state-key identity, duplicate detection, shallow exact enumeration cross-check, and artifact materialization. It is **not** a scientific characterization of Bao complexity.

Stage 0 diagnostic counts MUST NOT be promoted into Stage 1/2 scientific evidence.

## Frozen diagnostic domain

Use the current-engine standard initial state as the single technical root and exhaustively expand legal transitions to **maximum ply/depth 2** from that root.

No symmetry/canonicalization is used. Every raw state is keyed by the seven-field identity contract.

Depth 2 is frozen solely to make a complete independent cross-check cheap and deterministic. Changing this depth requires a new versioned technical protocol before execution; it cannot be changed in response to observed counts.

## Mandatory gates

### S0-G1 — Raw field/type validation

All required identity fields exist and satisfy the study-owned structural validator. `pending` must exist explicitly.

### S0-G2 — Seed conservation

Every accepted parent/child satisfies exactly:

`sum(pits)+sum(reserve)+sum(pending)=64`.

### S0-G3 — Serializer agreement

Production and independently implemented serializers produce identical state keys for every Stage 0 state.

### S0-G4 — Missing-pending rejection

A fixture with absent `pending` is rejected **before** any engine transition/clone helper can repair it. Silent `[0,0]` synthesis is a failure.

### S0-G5 — Deterministic identity

Repeated serialization of the same raw state is byte-identical. Changing excluded metadata (`turn`, `reason`) does not alter the key.

### S0-G6 — Identity sensitivity

Semantically valid fixtures differing in included identity fields must not collapse to the same key. `pending` sensitivity must be explicitly checked with 64-seed-conserving fixtures.

### S0-G7 — Legal-move replay consistency

For every expanded parent, legal moves and generated successors are deterministic under the production expansion path. Replaying a stored move from the stored parent reproduces the stored child key.

### S0-G8 — Transition integrity

Every parent is validated before engine use and every child is validated immediately after transition. No invalid state is admitted to the graph.

### S0-G9 — Duplicate detection agreement

Production and independent reconstruction agree on generated node occurrences, unique raw keys, duplicate encounters, and parent/child bindings.

### S0-G10 — Exact shallow graph cross-check

For the frozen depth-2 diagnostic graph, production and independent reconstruction agree exactly on state set, transition multiset/set as preregistered by the implementation, counts, and cryptographic dataset hashes.

### S0-G11 — Materialization integrity

Scientific raw artifact -> materializer -> repository-facing artifact -> re-read verifier preserves row hashes, state keys, dataset counts, seed invariants, and dataset hashes.

### S0-G12 — Independence boundary

The independent serializer/verifier must not import or call the production serializer. Shared generic cryptographic/runtime primitives are allowed; shared state-key logic is not.

## Decision rule

```text
if all S0-G1..S0-G12 PASS:
    Stage0TechnicalDecision = SSGTC-STAGE0-PASS
else:
    Stage0TechnicalDecision = SSGTC-STAGE0-TECHNICAL-BLOCK
```

`SSGTC-STAGE0-PASS` is not a scientific result.

Stage 1 execution is authorized only after all mandatory gates pass and the Stage 1 resource profile / stopping rule is frozen without inspecting Stage 1 scientific outcomes.

## Artifacts

Planned Stage 0 outputs must be study-owned and include at minimum:

- raw state records with authoritative raw state + raw key + technical depth metadata kept outside identity;
- transition records with parent key, normalized move representation, child key, and depth;
- per-row hashes;
- sorted state-set hash;
- sorted transition-set hash;
- production technical summary;
- independent verification result;
- post-materialization verification result.

Repository-facing projections are never authoritative identity inputs.