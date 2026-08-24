# RESEARCH_PLAN — Symmetry / Isomorphic Positions Study 1

## 1. Purpose

Test whether prospectively defined transformations

```text
T : state -> state
π : player -> player
Φ_s : exactMove(s) -> exactMove(T(s))
```

form exact rule-semantic graph isomorphisms over frozen bounded domains.

This is not a state-count study and not a retrofit of the Restricted Endgame exact solution.

## 2. Primary exact properties

For every eligible formal state and edge, as applicable:

1. transformed-state representability / validity;
2. inverse consistency;
3. exact legal-move-set bijection using exact move keys;
4. transition commutation;
5. terminal equivalence;
6. winner equivariance under `π`;
7. reachability-witness status kept separate from rule-semantic isomorphism;
8. exact-oracle value, DTF, optimal-move-set and recurrent-SCC preservation;
9. independent verifier equality.

A scientific candidate requires **zero mismatches** in its frozen scope. A partial success rate is descriptive only.

## 3. Domains

### A. Immutable prior exact-oracle anchor

Use the 8-state / 7-edge Restricted Endgame raw exact oracle read-only. For each applicable transform, construct `T(G)` and independently solve the transformed graph.

### B. Fresh historically reachable states

Use a Study-specific fresh seed block. Source roots are generated from standard initial state with complete witness paths. Selection uses only phase, raw state identity and prespecified structural eligibility; candidate success/failure is forbidden as a selection input.

Fresh formal graphs are bounded local graphs. They do not authorize a full-Bao or full-phase theorem.

## 4. Exact move universe

`E.moveVariants(state)` is the exact top-level move universe for this Study. It exposes distinct `houseChoice=stop/use` transitions when they differ. Comparison key:

```text
type:phase:row:index:direction:side:houseChoice:houseTwo
```

Move counts alone are never sufficient.

## 5. Administrative guards

`relay-limit`, runtime cap, memory cap, graph-state cap and similar safeguards cannot create WIN/LOSS or symmetry failure. If a normative successor is not fully determined, the affected formal unit is technical failure / non-estimable according to the frozen Stage 1 rule.

## 6. Formal labels

Candidate-scope decisions will use:

- `VALIDATED-BOUNDED-ISOMORPHISM`
- `NOT-VALIDATED`
- `NON-ESTIMABLE`

Controls do not receive a scientific symmetry finding.

## 7. No-rescue firewall

After formal outcome generation begins, forbidden changes include candidate transform edits, player/direction/pit remapping edits, failed-state exclusion, failed-phase exclusion, root/depth reduction because of mismatch, post hoc applicability narrowing, or selective reporting.

A new semantic transform after formal outcome requires a new Study or explicitly separate prospective successor study.
