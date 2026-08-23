# SEED_AUDIT — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23  
Status: **FRESH NAMESPACE AUDITED / RESERVED / NOT AUTHORIZED**

## 1. Audit principle

Distinguish:

1. declared scientific source-game/opening seed blocks;
2. derived/internal RNG values used inside a game or continuation replicate;
3. technical fixture-only RNG values;
4. incidental numeric values in artifacts.

Fresh scientific source-game blocks must not overlap category 1.

## 2. Restored recent scientific blocks

Canonical recent tracked blocks include:

```text
Position Complexity Stage 1       20400001..20400768
Position Complexity Stage 2       20410001..20411024
Tactical Motifs Stage 1           21900001..21900768
Tactical Motifs Stage 2           22000001..22003072
TM Human Validation machine       22100001..22101536
Calibration Stage 1               22200001..22201024
Calibration Stage 2               22300001..22302048
BMP Stage 1                       22400001..22402048
BMP Stage 2                       22500001..22504096
```

Older Phase Transition, Position Typology, Namua→Mtaji, first-player and joseki blocks remain historical/consumed and are not reallocated.

## 3. New namespace audit

At verified baseline:

```text
576783b1a1d514726d4d30e4dfac1bf79dde9e2a
```

repository search found no tracked declaration for exact new block starts:

```text
22600001
22700001
```

An incidental search for broader numeric prefixes can match arbitrary historical artifact values; those are not seed declarations. The reservation below is based on explicit tracked scientific seed declarations.

## 4. New reservations

### Stage 0

```text
scientific source-game block = NONE
```

Stage 0 technical fixtures should use deterministic fixed states. If stochastic fixture testing is required, use a documented technical-only derived RNG function/salt; do not consume the Stage 1/2 scientific source-game blocks.

### Stage 1 exploratory

```text
reserved = 22600001..22603072
capacity = 3072 source games
```

### Stage 2 formal

```text
reserved = 22700001..22706144
capacity = 6144 source games
```

The larger Stage 2 block is a prospective attrition allowance motivated by the Calibration Study 1 identity-firewall estimability failure. It is not a result-dependent extension.

## 5. Reservation is not authorization

No game in either block may be generated as scientific evidence until the corresponding preregistration/spec, technical validation, exact source hash freeze and separate authorization are committed.

Once a stage begins, the exact authorized range is fixed. Unused later seeds may not be appended because candidate support or outcome is unfavorable.

## 6. Continuation replicate RNG

Continuation replicate RNG is nested inside a selected root and must be derived from a stage-specific salt, root identity and replicate index, for example conceptually:

```text
seed32 = H(stageSalt | rootRuleStateKey | replicateIndex)
```

Each legal root move receives a freshly initialized RNG with the same `seed32` for that replicate index.

These values:

- do not count as independent source-game seeds;
- do not increase root-level N;
- must not collide across stages because stage salts differ;
- must be reproducibly recorded or derivable.

## 7. No-rescue seed rule

Forbidden after scientific generation begins:

- seed extension;
- replacement after identity exclusion;
- candidate-specific reseeding;
- favorable seed subset selection;
- moving Stage 2 evidence into the Stage 1 block or vice versa.
