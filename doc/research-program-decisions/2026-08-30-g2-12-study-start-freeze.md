# G2-12 Study Start Freeze — Program Decision

Date: 2026-08-30
Status: ACTIVE PROSPECTIVE START RECORD
Scope: Research Generation 2 / G2-12

## Decision

Agenda label `G2-12` is instantiated as:

```text
Study ID = SSGTGE-STUDY1
Formal title = State-Space / Game-Tree Growth Estimation Study 1
Branch = research/g2-12-state-space-game-tree-growth-estimation
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
```

This is a new prospective independent Study. It is not a G2-05 extension and does not alter G2-11 authorization.

## Upstream boundary

```text
DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
complete exact layers = 0..9
cumulative RAW states through depth 9 = 102857
G2-10 selectedRepresentation = null
PSRRE-STUDY1 = NON-ESTIMABLE
G2-11 = NOT-AUTHORIZED
```

## Frozen design

- RAW-only identity: `pits,reserve,houseOwned,player,phase,winner,pending`.
- No validated transform; no canonicalization or symmetry reduction.
- Development evidence: immutable G2-05 exact depth 0..9 summaries.
- Mandatory fresh formal holdout: exact depth 10.
- Secondary unchanged-estimator stress-test: depth 11 if complete.
- Finite estimator set: `E1-TRAILING-LOG-LINEAR-W5`, `E2-LOG-QUADRATIC-D2PLUS`, `E3-LOCAL-LOG-INCREMENT-TREND-W4`.
- Formal primary performance rule: joint depth-10 graph/tree maximum absolute log error `<= 0.20` plus frozen uncertainty-envelope coverage for both series, after complete exact and independent zero-mismatch verification.
- Partial layer is never formal exact evidence.
- Negative, non-estimable, resource-censored, and technical-invalid closures are allowed.

## Stage state at this record

```text
Stage 0 = technical-only authorized / not executed
Stage 1 = not authorized / not executed
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
fresh depth 10/11 outcomes = none
formal Study decision = not established
```

Canonical Study-level details are in `doc/state-space-game-tree-growth-estimation/preregistration/STUDY_START_FREEZE.md` and `STUDY_START_SPEC.json`.
