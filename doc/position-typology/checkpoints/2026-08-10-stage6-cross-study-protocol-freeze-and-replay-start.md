# Checkpoint — Stage 6 cross-study protocol freeze and replay start

Date: 2026-08-10

## State entering this checkpoint

- Stage 5 formal decision remains `not-confirmed`.
- Study 1 formal decisions remain unchanged.
- Study 1 final formal archive inventory completed with fixed SHA-256 matches and unsafe member count zero.
- Study 1 archive schema audit completed for E-018 D2, E-019 D3, and E-020 D3.
- Schema audit reported no scientific association values.
- No cross-study MTAJI-M1/M2 or N-ACT/N-CON association had been calculated before the protocol below was frozen.

Schema audit SHA-256:

```text
910990b049abf31e42deccac2756dc68a721e565127f842209abf72b4a62e90c
```

## Frozen Stage 6 protocol

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

Source scope:

```text
E-018 D2 P2/LG
E-019 D3 P2/LG
E-020 D3 P2/LG
```

Primary candidate population:

```text
Category A
distanceToTerminal >= 9
```

Positive phenotype:

```text
capture-branch-expansion
```

Non-precursor comparator fixed as:

```text
temporary-spike
capture-branch-convergence
```

Excluded precursor classes:

```text
namua-to-mtaji-precursor
forcing-release-precursor
```

Primary descriptive unit:

```text
experiment + condition + trajectoryHash + candidatePly
```

No cross-condition or cross-experiment deduplication is performed.

## Phase-specific bridge

Phase overlap is reported before structural association.

Mtaji candidates may be classified only with the frozen confirmed classifier:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Namua candidates may be projected only through the frozen discovery ingredient transform:

```text
styleIngredientDefinitionHash = b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

No scaler/classifier refit is permitted.

`STYLE-C1..C4` are excluded from this primary bridge because Stage 5 exact 4D playing-style geometry was formally `not-confirmed`.

## Replay guard

Before any cross-study association calculation, candidate states must pass deterministic replay from archived moves.

Required checks:

- every traversed observation stateHash matches;
- move before/after stateHash matches where present;
- CSV phase, archived observation phase, and replayed position phase agree;
- no game is regenerated;
- formal archives are not modified;
- no source formal analysis is rerun.

Tooling:

```text
tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py
tools/experiments/replay-position-typology-stage6-candidate-states.js
doc/position-typology/STAGE_6_CROSS_STUDY_REPLAY_RUNBOOK.md
```

## Current stop point

> Run Stage 6 preparation + deterministic candidate replay locally and share only `replay-audit.json`.

Cross-study relation values remain uncomputed at this checkpoint.
