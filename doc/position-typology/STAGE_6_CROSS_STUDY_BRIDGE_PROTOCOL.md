# Stage 6 Cross-Study Bridge Protocol

Date: 2026-08-10  
Status: **frozen secondary / hypothesis-generation protocol before association analysis**

## Purpose

Stage 6 asks where the fixed Study 1 `capture-branch-expansion` phenotype lies within the independently constructed position representation from the current study.

This is **not** a new formal confirmation experiment. It does not alter any Study 1 decision and does not rescue Stage 5 `not-confirmed`.

Machine specification:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

The uploaded archive schema audit used to freeze this protocol has SHA-256:

```text
910990b049abf31e42deccac2756dc68a721e565127f842209abf72b4a62e90c
```

No scientific association value had been inspected before this protocol was fixed.

## Fixed source scope

Only these formal Study 1 corpus slices are used:

```text
E-018 D2: phase2 / legacy
E-019 D3: phase2 / legacy
E-020 D3: phase2 / legacy
```

E-019 D1 and V2 are outside the primary bridge scope.

Fixed archive hashes:

```text
E-018  bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5
E-019  6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75
E-020  37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2
```

The original Study 1 primary population is inherited unchanged:

```text
category = A
minimum distanceToTerminal = 9 ply
```

## Candidate groups

### Positive phenotype

```text
classification = capture-branch-expansion
```

### Non-precursor comparator

The comparator is fixed before relation values are inspected as:

```text
temporary-spike
capture-branch-convergence
```

The following precursor classes are not mixed into that comparator:

```text
namua-to-mtaji-precursor
forcing-release-precursor
```

They remain reportable in the phase-overlap inventory because they are part of the fixed Study 1 classifier, but they are excluded from the expansion-versus-comparator structural contrast.

Unknown classification values are an integrity error rather than a reason to redefine the comparator.

## Analysis unit

Primary descriptive unit:

```text
experiment + condition + trajectoryHash + candidatePly
```

This is a unique trajectory-ply within one corpus condition.

Raw candidate-row counts are also reported for provenance, but raw repeated rows are not treated as independent structural examples.

No deduplication is performed across experiments or across P2/LG conditions. No pooled cross-corpus confirmatory inference is allowed.

## Deterministic board replay

Study 1 observations do not serialize the full pit array. Formal game JSON does serialize:

- complete move sequence,
- observation ply,
- phase,
- archived `stateHash`,
- game-level `trajectoryHash`.

The candidate board is reconstructed as:

```text
initialState -> archived moves -> candidatePly
```

Replay integrity is mandatory:

1. every reconstructed observation traversed on the way to the target must reproduce the archived observation `stateHash`;
2. archived move `beforeStateHash` / `afterStateHash` must match where present;
3. CSV `phaseAtCandidate`, archived observation phase, and replayed position phase must agree;
4. on mismatch, the affected condition stops. The archive is not patched and no new game is generated.

Only after replay verification may `extractPositionTypologyObservation()` be applied.

## Phase-first bridge

The first scientific output is phase overlap. No Mtaji representation is forced onto Namua and no Namua coordinate is applied to Mtaji.

### Mtaji

For candidate positions whose actual phase is `mtaji`, use the already confirmed frozen classifier:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
MTAJI-M1 / MTAJI-M2
```

No classifier or scaler refit is permitted.

Report separately by experiment and condition:

- M1/M2 count and fraction among expansion candidates;
- M1/M2 count and fraction among non-precursor comparators;
- `M1 fraction(expansion) - M1 fraction(comparator)`.

These are descriptive cross-study relations, not a new confirmation of M1/M2.

### Namua

For candidate positions whose actual phase is `namua`, use the exact discovery-side frozen state transform:

```text
styleIngredientDefinitionHash = b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
N-ACT
N-CON
```

N-ACT / N-CON remain exploratory coordinates. Their scaler is never refit on Study 1 data.

Report separately by experiment and condition:

- N-ACT distribution for expansion vs comparator;
- N-CON distribution for expansion vs comparator;
- median difference expansion minus comparator;
- Cliff's delta expansion versus comparator.

No confirmatory p-value is used.

## Explicit exclusions

Stage 6 primary bridge does **not** use:

- `STYLE-C1..C4` as confirmed style dimensions;
- any new clustering or new number of position types;
- winner/outcome as a position definition;
- AI condition ID as a feature;
- a newly fit `sustained-forcing-window` threshold;
- a post-hoc alternative comparator;
- any modification of Study 1 formal endpoints or decisions.

`STYLE-C1..C4` are excluded because Stage 5 formally returned `not-confirmed` for the exact four-dimensional playing-style geometry.

## Reporting boundary

Allowed interpretation:

> Secondary/hypothesis-generation evidence describing where the fixed Study 1 transition phenotype lies in an independently defined position representation.

Not allowed:

- a new formal confirmation of `capture-branch-expansion`;
- a universal Bao phase transition claim;
- causal mediation by MTAJI-M1/M2 or N-ACT/N-CON;
- a general search-profile × depth interaction;
- rescue of the Stage 5 playing-style result.

D2 and D3 are cross-corpus descriptive contrasts only. E-019 D3 and E-020 D3 remain separately reported rather than pooled into a new formal replication claim.
