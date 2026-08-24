# ORISC-STUDY1 — Prospective Protocol Draft

**Study ID:** `ORISC-STUDY1`  
**Document status:** `DRAFT / NOT FROZEN / NOT AUTHORIZED FOR SCIENTIFIC OUTCOME GENERATION`  
**Baseline main:** `e8f0a3c360d9e7c9f7f6882fb212a32921040912`

This document defines the design target for the new independent study. A later machine-readable freeze and separate authorization are required before Stage 1 or Stage 2 scientific outcomes may be generated.

## 1. Primary question

Can the current Bao rule semantics and the immutable Restricted Endgame exact graph be connected by a deterministic, independently reproduced raw-state representation contract, and only if that contract is confirmed, can prospectively frozen nontrivial transformations be confirmed as exact bounded graph isomorphisms?

## 2. Representation ontology

The protocol must distinguish:

1. **engine-semantic state** — the runtime rule state after a legal transition;
2. **identity projection** — the exact subset of fields defined as rule-state identity;
3. **serialized raw state** — stable byte/string representation of the identity projection;
4. **state key** — SHA-256 of the serialized raw state;
5. **workflow raw row** — state representation emitted by the original scientific runner/verifier;
6. **repository stored row** — state row committed to the canonical repository result;
7. **reconstructed state** — state regenerated from a frozen root and exact transition semantics;
8. **report/display state** — any human-facing projection not authorized as an identity source.

No pair above is assumed identical without an explicit gate.

## 3. Frozen upstream facts that cannot be changed

### REWR-STUDY1

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

### SIP-STUDY1

```text
studyStatus = COMPLETED
formalDecision = NON-ESTIMABLE
validated = 0
notValidated = 0
nonEstimable = 5
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

The new study cannot reinterpret either result.

## 4. Raw identity contract to be prospectively frozen

The current engine and prior exact solver both identify raw rule state using:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

The following are excluded from the primary state key:

```text
turn
reason
```

The final frozen protocol must re-derive and source-hash this contract from code before authorization. Any later change to the identity field set requires revoke/refreeze before scientific generation; it cannot be changed after Stage 1 outcome inspection.

## 5. Seed-conservation representation

For this engine representation, the prospective conservation quantity is:

```text
representedSeeds(state)
  = sum(pits)
  + sum(reserve)
  + sum(pending)
```

The required total in standard Bao states generated from the standard initial state is `64`.

`pending` is not interpreted as an arbitrary historical capture counter. Under the current engine semantics it is part of raw identity and, in the terminal capture path `finishOnEmptyFront`, represents captured seeds removed from the opponent front row but not re-materialized on the board before termination. The frozen protocol must verify this from source and synthetic transition fixtures before Stage 1.

## 6. Stage 0A — technical / semantic / provenance reconstruction

Stage 0A may inspect prior artifacts and code, but must emit no scientific symmetry decision.

Required tasks:

- pin current `main` and all relevant source blobs/hashes;
- recover the original REWR scientific workflow production and independent files;
- compare workflow raw rows with repository stored rows without modifying either;
- trace the commit/materialization path that created the repository-facing result;
- re-audit `public/engine.js` terminal semantics, `pending`, winner, phase, reserve, pits, house ownership, and move variants;
- identify every serializer/state-key implementation currently present;
- define synthetic fixtures for terminal capture accounting and stable serialization;
- document which implementation pieces are allowed to be shared and which must be independent.

Stage 0A output is technical provenance only.

## 7. Stage 0B — pre-outcome contract freeze

Before Stage 1 authorization, Stage 0B must freeze all outcome-facing choices, including the conditional Stage 2 design.

Required frozen items:

- source identities;
- state identity field set and serialization grammar;
- seed-conservation formula;
- REWR root/witness identity and immutable graph hashes;
- Stage 1 endpoints and exact pass/fail rules;
- identity positive-control contract;
- production/independent interface boundary;
- Stage 2 candidate-selection rule and final candidate definitions;
- Stage 2 applicability predicates, move maps and state maps;
- Stage 2 populations, root selection, graph depth and seed blocks;
- negative-control definition;
- failure and non-estimability rules;
- separate authorization requirements.

Stage 2 candidates may resemble prior SIP candidates only if they are independently re-derived from rule semantics and frozen before Stage 1 outcomes. The prior SIP zero-mismatch diagnostics must be declared as prior information and may not be used to tune candidate scope, threshold, depth, root selection, or transform details.

## 8. Stage 1 — Formal Oracle Representation Integrity

### 8.1 Population

The primary Stage 1 population is exhaustive, not sampled:

> the complete raw-state graph reconstructed from the immutable REWR frozen root under the prospectively frozen exact Mtaji transition contract, expected to correspond to the immutable 8-state / 7-edge graph identity.

The repository stored rows are a separate artifact-binding target, not the source of reconstructed raw state.

### 8.2 Production and independent implementations

Production and independent verifier must not share:

- raw-state projection helper;
- stable serializer implementation;
- state-key helper;
- exact legal-move generator;
- guard-free transition implementation;
- closure traversal;
- terminal accounting helper;
- Stage 2 state transform;
- Stage 2 move transform.

A third comparison/audit layer may compare the two emitted result artifacts after both are complete.

### 8.3 Mandatory Stage 1 gates

`A-G1` **Source identity gate**  
All frozen source/artifact hashes match exactly.

`A-G2` **Root reconstruction gate**  
Frozen reachability witness regenerates the expected raw root key exactly.

`A-G3` **Production/independent raw graph gate**  
Both implementations independently reconstruct the same full raw state and transition sets.

`A-G4` **Immutable graph identity gate**  
Both reconstructed graphs exactly match the immutable `stateSetSha256`, `transitionSetSha256`, state count 8 and edge count 7.

`A-G5` **Raw serializer equality gate**  
For every reconstructed state, production and independent canonical serialized raw state and SHA-256 key agree exactly.

`A-G6` **Seed conservation gate**  
Every reconstructed state satisfies `sum(pits)+sum(reserve)+sum(pending)=64` under the frozen representation semantics.

`A-G7` **Terminal accounting gate**  
Terminal transitions preserve the frozen winner/phase/player semantics and captured/pending accounting exactly in both implementations.

`A-G8` **Repository row re-hash gate**  
Each stored oracle row, treated exactly as stored and without correction, re-hashes to its stored `stateKey` under both independent serializers.

`A-G9` **Stored-row/raw-state binding gate**  
Each stored state key binds one-to-one to the corresponding reconstructed raw state and all frozen identity fields agree exactly.

`A-G10` **Transition successor binding gate**  
Every nonterminal stored/reconstructed source and exact legal move resolves to the same frozen successor raw key; no successor escape or aliasing is allowed.

`A-G11` **IDENTITY positive-control gate**  
IDENTITY must preserve exact state identity, exact move identity, transition identity, terminal semantics, winner semantics and oracle reconstruction with zero mismatch.

`A-G12` **Production/independent decision equality gate**  
Both implementations must produce the same gate-level and row-level outcome classifications.

### 8.4 Stage 1 decision labels

The final frozen protocol should use exactly three top-level states:

- `ORACLE-REPRESENTATION-INTEGRITY-CONFIRMED` — every mandatory gate passes with exact zero mismatch;
- `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` — one or more mandatory semantic/binding gates fail in an interpretable way and production/independent implementations agree on the failure;
- `NON-ESTIMABLE` — source drift, incomplete reconstruction, technical stop, implementation disagreement, or another predefined condition prevents an exact integrity decision.

A Stage 1 negative result does **not** alter `REWR-STUDY1`; it only answers whether the repository artifact/reconstruction contract is valid for this new downstream endpoint.

## 9. Stage 2 authorization gate

Stage 2 scientific execution is prohibited unless all are true:

```text
Stage 1 final decision = ORACLE-REPRESENTATION-INTEGRITY-CONFIRMED
A-G11 IDENTITY = PASS
A-G12 production/independent equality = PASS
Stage 2 candidate contract was frozen before Stage 1 outcome generation
separate Stage 2 authorization exists and matches frozen hashes
```

If any condition fails, Stage 2 status is:

```text
NOT-AUTHORIZED-NOT-EXECUTED
```

No nontrivial candidate receives a formal pass/fail label in that case.

## 10. Stage 2 — Conditional Independent Symmetry Confirmation

The candidate set is not automatically inherited from SIP-STUDY1. Stage 0B must independently justify each candidate from rule semantics.

For each frozen scientific candidate, exact gates must cover:

1. applicability predicate;
2. state-map totality on the declared domain;
3. inverse/bijection property;
4. exact move-set bijection, using `moveVariants` where Namua house choices create distinct outcomes;
5. exact transition commutation;
6. terminal equivalence;
7. winner permutation/equivariance;
8. transformed reachability claim only where prospectively specified;
9. exact graph isomorphism on the declared bounded graph;
10. value/DTF/optimal-move preservation only where a valid exact oracle is part of the frozen population;
11. production/independent equality.

All applicable semantic gates require zero mismatch. No approximate pass threshold is permitted for an exact isomorphism claim.

## 11. Controls

### Positive control

`IDENTITY` is mandatory and precedes all nontrivial candidate interpretation.

### Negative control

Stage 0B must freeze one intentionally malformed transform based only on rule-semantic reasoning. It must not be tuned after observing mismatch counts. Its purpose is instrumentation discrimination, not a scientific finding.

## 12. Stage 3 — downstream authorization

Canonicalization or symmetry-reduced state counting may be authorized only if Stage 2 produces one or more validly confirmed transformations and all required common-domain inverse/composition/closure checks are complete.

Possible Stage 3 outcomes include:

```text
CANONICALIZATION-AUTHORIZED-FOR-FROZEN-DOMAIN
CANONICALIZATION-NOT-AUTHORIZED
NON-ESTIMABLE
```

Authorization must specify the exact domain and reachability interpretation. No global Bao symmetry claim follows automatically.

## 13. Scientific leakage firewall

Forbidden after Stage 1 or Stage 2 outcome inspection:

- rewriting the upstream REWR oracle;
- replacing stored rows with reconstructed rows and calling the original artifact corrected;
- changing the raw identity field set;
- changing how `pending` contributes to conservation;
- changing candidates or applicability predicates;
- relaxing zero-mismatch gates;
- changing root selection or graph depth;
- extending seed blocks to rescue a result;
- selecting favorable subgroups;
- changing the negative control to achieve a desired failure rate;
- modifying the independent verifier to match production output;
- treating representation failure as symmetry rejection;
- treating prior SIP fresh diagnostics as formal ORISC evidence.

## 14. Authorization firewall

The following are **not yet created** and must remain absent until Stage 0B is complete:

```text
frozen Stage 1 machine-readable spec
Stage 1 scientific authorization
frozen Stage 2 candidate contract
frozen Stage 2 formal spec
Stage 2 scientific authorization
formal result artifacts
```

This draft alone authorizes no scientific outcome generation.