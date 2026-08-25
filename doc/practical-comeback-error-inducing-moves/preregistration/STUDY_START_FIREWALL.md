# PCEM-STUDY1 — Study-Start Firewall

Frozen: 2026-08-25 before Stage 0 execution and before any PCEM scientific outcome generation.

## Study-start baseline

```text
remoteMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
branch = research/practical-comeback-error-inducing-moves
studyId = PCEM-STUDY1
```

## Immutable upstream state

### Critical Positions / Outcome Branching Study 1

```text
fresh Stage 1 games = 3072
selected roots = 600
Namua / Mtaji = 300 / 300
exact root-move interventions = 2666
primary-estimable roots = 600 / 600
high-divergence threshold = D_range >= 0.30
high-divergence roots = 139 / 600
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
promotedCandidateCount = 0
manualOverridePerformed = false
Stage 2 = NOT AUTHORIZED / NOT EXECUTED
```

PCEM-STUDY1 may reuse the general scientific idea of exact root-move intervention or fixed-policy continuation, but may not reopen CPOB Stage 2, relax its grammar/thresholds, promote near misses, manually select old roots/candidates, or consume its reserved formal seeds as a rescue.

### Position Evaluation / Win-Rate Calibration Study 1

```text
formalDecision = INCONCLUSIVE
validatedBaoWinProbabilityMapping = false
```

Its isotonic mapping is not an authorized primary probability endpoint in PCEM-STUDY1.

### Blunder / Misvaluation Patterns Study 1

```text
CONFIRMED = 0
NOT-CONFIRMED = 4
```

C01-C04 are not validated blunder markers and cannot be imported as confirmed PCEM candidate classifiers.

### Position Complexity / Difficulty Study 1

```text
formalDecision = INCONCLUSIVE
```

Machine workload/ambiguity/instability is not human difficulty. PCEM reply difficulty is machine-operational only.

### Restricted Endgame / Winning Regions Study 1

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
states = 8
edges = 7
```

Exact value may be invoked only when a PCEM state is demonstrably inside that exact frozen domain. It is not a global Bao oracle.

### Symmetry / Isomorphic Positions Study 1

```text
validated = 0
rejected = 0
nonEstimable = 5
formalDecision = NON-ESTIMABLE
```

No validated symmetry transformation exists.

### ORISC-STUDY1

```text
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated symmetry transformation set = []
raw state identity = authoritative downstream representation
```

### State Space / Game Tree Complexity Study 1

```text
formalDecision = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
reachable raw states through depth 8 = 24848
graph transition occurrences parent depth 0..7 = 25648
game-tree node occurrences through depth 8 = 30941
game-tree edge occurrences through depth 8 = 30940
```

No global state-space prior or full Bao game-tree estimate may be inferred from this bounded result.

## Authoritative RAW representation

Identity includes exactly:

`pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`.

Identity excludes `turn` and `reason`.

```text
pendingRequired = true
sum(pits) + sum(reserve) + sum(pending) = 64
```

Validation occurs before engine compatibility code can synthesize defaults.

## Prohibited transformations

```text
symmetry reduction
seat-swap canonicalization
left-right reflection canonicalization
quotient identity
unvalidated transform-based deduplication
```

## No-rescue rules

Forbidden after relevant outcome inspection:

1. root disadvantage redefinition;
2. opponent-strength selection because it gives the largest effect;
3. comeback horizon/endpoint change to improve results;
4. defensive-success threshold relaxation;
5. candidate feature-universe or interaction-order expansion;
6. favorable phase-only subgroup rescue;
7. Stage 1 row reuse as Stage 2 evidence;
8. additional formal games after a failed frozen support/stopping gate;
9. promotion of Calibration Study 1 mapping to validated probability;
10. reconstruction or reuse of CPOB/BMP candidates as confirmed PCEM candidates;
11. human difficulty inference from machine reply structure;
12. symmetry/canonicalization introduced to improve support.

## Scientific result vocabulary

Allowed outcomes include:

```text
TECHNICAL-PASS
EXPLORATORY-ONLY
CONFIRMED
NOT-CONFIRMED
NON-ESTIMABLE
RESOURCE-CENSORED
TECHNICALLY-INVALID
NOT-AUTHORIZED-NOT-EXECUTED
```

Positive results are not required for study success.
