# STAGE_1_RUNBOOK — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24  
Status: PLACEHOLDER / GENERATION BLOCKED

Stage 1 must not begin until Stage 0 technical completion and a committed prospective specification.

## Required freeze contents

The Stage 1 spec must bind at minimum:

```text
studyId
stageId
baseline repository commit
engine.js SHA-256 / blob identity
rules baseline identity
all research transition/solver source hashes
exact root witness identities
domain definition D(R)
state serialization
exact move identity
state validity rules
reachability proof format
transition closure rule
normative terminal semantics
relay guard exclusion and guard-free transition semantics
RECURRENT / SCC semantics
retrograde algorithm
DTF recurrence
optimalMoveSet recurrence
resource limits
stopping/failure rules
artifact schemas
independent verifier source hashes
scientific outcome release authorization
```

## Pre-generation firewall

Before scientific graph construction:

1. Stage 0 candidate root set is frozen from technical quantities only.
2. Root witness paths and hashes are frozen.
3. Production and verifier source hashes are frozen.
4. Exact domain/resource rules are frozen.
5. Scientific output schema is frozen.
6. An authorization artifact binds all above identities.

Absent or mismatched authorization must hard-fail generation.

## Scientific outputs after authorization

Only after the freeze may the scientific run emit:

```text
state-level exact value
absolute forced winner for resolved states
RECURRENT classification
SCC metadata
optimalMoveSet for resolved states
DTF for resolved states
winning-region counts
value/DTF distributions
```

## Exact claim gate

No exact claim is authorized unless production and independent verifier agree on the full domain, all edges, terminal winners, state values, optimal move sets and DTF values.

Any mismatch yields `NOT-ESTIMABLE` / `INCONCLUSIVE` until a new prospective Study or pre-generation correction is established. Scientific outcomes already observed cannot be used to tune the frozen Stage 1 domain.
