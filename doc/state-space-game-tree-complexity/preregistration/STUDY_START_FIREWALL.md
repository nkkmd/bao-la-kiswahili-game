# SSGTC-STUDY1 — Study-Start Firewall

Frozen: 2026-08-25 before Stage 0 outcome generation.

## Immutable upstream state

### Restricted Endgame / Winning Regions Study 1

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

This claim remains limited to the frozen 8-state / 7-edge domain.

### Symmetry / Isomorphic Positions Study 1

```text
studyStatus = COMPLETED
formalDecision = NON-ESTIMABLE
validated = 0
rejected = 0
nonEstimable = 5
v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

The invalidated-v1 zero-mismatch diagnostic cannot authorize reduction here.

### ORISC-STUDY1

```text
studyStatus = COMPLETED
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
PASS = A-G1 A-G2 A-G3 A-G4 A-G5 A-G6 A-G7 A-G10 A-G12
FAIL = A-G8 A-G9 A-G11
validated symmetry transformation set = []
canonicalization = NOT AUTHORIZED
symmetry-group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
raw state identity = authoritative downstream representation
```

ORISC terminal-row mismatches will not be repaired or re-adjudicated by this study.

## Raw representation contract

Accepted raw identity includes exactly seven fields:

`pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`.

`turn` and `reason` are reporting/provenance metadata, not identity.

Missing `pending` is a representation failure. Study-owned validation must occur before any engine helper that can synthesize compatibility defaults.

Seed invariant:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

## Prohibited transformations

No seat swap, reflection, compound transform, SIP transform, ORISC transform, visual-symmetry assumption, canonicalization, or symmetry quotient is authorized.

## Exact / bounded / observed / estimated firewall

- `exact exhaustive count`: exhaustive over a fully specified target, frontier exhausted, uncensored and verified.
- `bounded exhaustive count`: exact only inside a pre-frozen bounded target.
- `observed unique raw states`: empirical count in a partial/sample process; no total-space claim.
- `estimate`: permitted only under a separately frozen estimator protocol.
- `game-tree nodes`: path occurrences, including duplicate states.
- `trajectory count`: distinct ordered move sequences; not a state count.
- `historically encountered count`: descriptive only; no current estimand.

## No-rescue prohibitions

The following are forbidden after inspecting relevant outcomes:

1. changing depth/resource limits to obtain a preferred growth curve;
2. retaining only favorable seeds/roots;
3. redefining duplicate identity;
4. dropping any raw identity field;
5. defaulting missing `pending` to `[0,0]`;
6. introducing symmetry to reduce counts;
7. relabeling a failed/censored exact attempt as an estimate;
8. switching estimator/uncertainty method opportunistically;
9. reusing Stage 1 rows as Stage 2 evidence;
10. using upstream null/negative/non-estimable observations as rescued positive evidence.

Technical invalidity and scientific negative/non-estimable outcomes must remain distinct.