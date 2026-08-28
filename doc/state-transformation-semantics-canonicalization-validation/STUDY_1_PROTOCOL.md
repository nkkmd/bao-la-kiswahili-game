# State Transformation Semantics / Canonicalization Validation Study 1 — Protocol

Protocol freeze date: 2026-08-28
Status: **FROZEN STUDY-LEVEL PROSPECTIVE PROTOCOL / PRE-SCIENTIFIC-GENERATION**
Program label: `G2-03`
Study ID: `STSCV-STUDY1`
Research generation: **Research Generation 2**
Baseline `main`: `a8493d2a50e11f15d16ef8348f2442b262ca275d`
Research branch: `research/g2-03-state-transformation-semantics-canonicalization-validation`

## 1. Formal title

**State Transformation Semantics / Canonicalization Validation Study 1**

Japanese working title:

**Baoにおける状態変換意味論とcanonicalizationの厳密検証 — rule-semantic validity, legal-move equivariance, successor binding, graph isomorphism, and prospective canonicalization authorization**

`G2-03` is an agenda sequence label. `STSCV-STUDY1` is the formal Study ID.

## 2. Central scientific question

> For fresh historically reachable authoritative RAW states with an explicit representation binding, do prospectively frozen candidate state transformations preserve Bao rule semantics exactly at the state, legal-move, successor, terminal/winner, and bounded-graph levels; and, separately, which validated transformations, if any, satisfy the additional domain/reachability conditions required to authorize a prospective canonicalization rule?

The study is not a visual-board-symmetry exercise. It explicitly separates:

```text
RAW state identity
representation mapping
rule-semantic validity
legal-move equivariance
move-identity mapping
successor-state binding
terminal / winner equivariance
bounded graph isomorphism
reachable-population/domain preservation
canonicalization authorization
```

## 3. Immutable upstream boundaries

### Research Generation 2

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
SRDR primaryFormalCriterion = null
SRDR uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

No G2-01 or G2-02 scientific row is formal evidence for this Study. G2-03 may not add trajectories, change identity, canonicalize states, or otherwise rescue either prior estimability failure.

### SIP-STUDY1

```text
validated = 0
rejected = 0
NON-ESTIMABLE = 5
v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

The invalidated-v1 fresh zero-mismatch observations are technical/hypothesis input only. They are not G2-03 confirmation evidence and cannot be retroactively promoted.

### ORISC-STUDY1

```text
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated transformation set = []
```

G2-03 does not rewrite the three repository-facing terminal rows, rerun ORISC Axis B, or alter that closure.

### REWR-STUDY1 / SSGTC-STUDY1

Their bounded exact RAW-only decisions remain immutable. G2-03 does not retrofit canonical counts into those completed Studies.

## 4. Rule / source baseline

Rule semantics are bound to the Study-start repository state and `doc/RULES_BASELINE.md`.

Current production rule engine binding:

```text
public/engine.js Git blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/engine.js byte SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
FRONT = 0
BACK = 1
HOUSE = 4
opposite front index = 7 - index
```

Any Stage 1 or Stage 2 source freeze will additionally bind all new transformation, population, runner, verifier, and workflow sources by hash before authorization.

## 5. Authoritative RAW state identity

Formal input-state identity is exactly:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Excluded:

```text
turn
reason
```

`pending` must be explicitly present. Missing `pending` is a hard representation failure and may not be silently synthesized for scientific evidence.

Until this Study formally authorizes otherwise, the following remain prohibited for population identity, deduplication, sample-count gates, or scientific state counting:

```text
symmetry reduction
left-right equivalence
player-seat equivalence
rotation equivalence
quotient identity
canonicalized identity
symmetry-reduced counting
```

All Stage 1/2 input population selection and firewalls remain RAW-only even while candidate transforms are being evaluated.

## 6. Exact move identity

Formal move identity must distinguish at least:

```text
type
phase
row
index
direction
side
houseChoice
houseTwo
```

Legal-move-set comparison uses `BaoEngine.moveVariants(state)` rather than collapsing distinct Namua `houseChoice` variants.

The production engine helper `sameMove` is an engine legality helper, not the scientific move-identity definition. Scientific move mapping and hashing must use the exact frozen move identity above.

## 7. Transformation formalism

For each candidate:

```text
T   : State -> State
pi  : Player -> Player
Phi_s : LegalMove(s) -> LegalMove(T(s))
```

The candidate contract must define:

- applicability predicate;
- exact state-field mapping;
- exact player/winner mapping;
- exact move-field mapping;
- inverse transform;
- phase mapping or phase preservation;
- expected initial-state behavior;
- expected reachable-population behavior;
- domain on which canonicalization may later be considered.

## 8. Prospectively fixed controls

### Positive control

`STSCV-C00-IDENTITY`

IDENTITY must pass every applicable representation, legal-move, successor, terminal, graph, reconstruction, and independent-verification gate. Failure is an instrument/representation failure and causes fail-closed non-estimability; it is never scientific evidence against a nontrivial transform.

### Negative control

`STSCV-C01-LR-NO-DIRECTION-FLIP`

A deliberately broken pit-index reflection is fixed prospectively: pit index is reflected while the direction/side/capture semantics required by a genuine LR mapping are intentionally not co-transformed. It must produce at least one predeclared semantic mismatch in the Stage 0 diagnostic fixture family. If it is incorrectly accepted as exact, instrument validity fails closed.

Controls are not scientific symmetry findings.

## 9. Candidate family and Stage 0 semantic reduction

Before any Stage 1 scientific outcome, Stage 0 must classify the following requested transform ideas as either a unique candidate, an exact alias/composition, or a prospectively excluded non-candidate based on rule semantics only:

```text
left-right reflection
pit-index reversal
player swap
player swap + board rotation
row remapping
direction inversion
player-relative orientation transforms
necessary compositions
```

Initial semantic hypotheses, not findings:

- player swap under engine-local coordinates may be represented by swapping player-indexed state fields while preserving local row/index/direction;
- LR reflection may require `index -> 7-index`, `left <-> right` direction/side mapping, and a restricted applicability domain because `HOUSE=4` is not LR invariant;
- player swap + physical board rotation may be an alias of local-coordinate seat swap rather than an independent transform;
- FRONT/BACK remapping is likely not rule-semantic because capture and nyumba semantics privilege FRONT;
- direction inversion alone is likely not rule-semantic.

These hypotheses may be resolved technically in Stage 0. The finite scientific candidate set and transformation-definition hash must be frozen before Stage 1 generation. No candidate definition may be repaired after candidate-specific scientific outcome inspection.

## 10. Mandatory exact transform gates

For each applicable candidate/state, formal validation requires zero mismatch for all applicable gates:

```text
T-G1  transformed-state totality / validity
T-G2  inverse / bijection / round trip
T-G3  authoritative RAW reconstruction integrity
T-G4  exact legal-move-set cardinality
T-G5  exact legal-move-set bijection
T-G6  unique exact move-identity mapping
T-G7  transition commutation
      T(apply(s,m)) == apply(T(s), Phi_s(m))
T-G8  terminal-state preservation
T-G9  winner equivariance under pi
T-G10 phase preservation or prospectively frozen phase mapping
T-G11 pending semantics
T-G12 reserve / houseOwned semantics
T-G13 bounded graph node bijection
T-G14 bounded graph edge bijection
T-G15 adjacency preservation
T-G16 inverse graph round trip
T-G17 independent reconstruction equality
T-G18 decision-input hash equality
```

No approximate threshold, tolerance, near-match rule, or favorable mismatch exclusion is authorized.

## 11. Reachability and canonicalization are separate from semantic isomorphism

A rule-semantic isomorphism is not automatically a canonicalization authorization for every scientific population.

For canonicalization within a population/domain `P`, the Study must separately establish the relevant domain contract, including as applicable:

```text
T(P) = P or a prospectively specified orbit-closure condition
fixed-root / transformed-root interpretation
historical reachability binding
phase/domain applicability closure
validated composition closure used by the orbit generator
```

A transform that maps a legal state graph to an isomorphic graph but does not preserve the standard fixed raw initial state may receive a bounded semantic-isomorphism decision while still being unauthorized for fixed-start reachable-state quotient counting.

## 12. Stage structure

### Stage 0 — technical feasibility / representation-contract validation

Stage ID:

`STSCV-S0-TECHNICAL-2026-08-28-v1`

Stage 0 is technical only:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
scientificSeedUseAllowed = false
```

Mandatory tasks:

1. reconstruct engine-local coordinate semantics;
2. verify exact RAW serializer/reconstruction rules;
3. verify exact moveVariants identity including `houseChoice`;
4. fixture terminal/pending and 64-seed accounting;
5. fixture capture mapping, side/direction, HOUSE behavior, Namua/Mtaji behavior;
6. implement production and independent transformation test paths;
7. require IDENTITY PASS;
8. require broken negative control detection;
9. classify requested transform family into unique candidate / alias / non-candidate;
10. estimate bounded local graph resources without inspecting Stage 1 candidate success/failure.

Synthetic/technical fixtures are permanently excluded from Stage 1/2 scientific evidence.

### Stage 1 — fresh development / candidate characterization

Stage ID:

`STSCV-S1-DEVELOPMENT-2026-08-28-v1`

Stage 1 uses fresh historically reachable RAW states and a finite transformation contract frozen before generation. It is development evidence only and cannot authorize canonicalization.

Stage 1 selection must be blind to transform success/failure, mismatch count, search result, outcome, and candidate-specific favorable behavior. It must include Namua and Mtaji strata and prospectively manage historical-trajectory, opening-prefix, and RAW-state duplication.

After inspection, all Stage 1 trajectory/opening/RAW identities are consumed and forbidden from Stage 2 formal evidence.

### Stage 2 — fresh held-out formal validation

Stage ID:

`STSCV-S2-FORMAL-2026-08-28-v1`

Stage 2 is the only candidate-confirmation evidence. Before any Stage 2 generation, freeze:

- exact candidate set and applicability scopes;
- formal population and fresh seed block;
- Stage 1 three-axis identity firewall;
- local graph depth/resource rules;
- all exact gates;
- candidate decision taxonomy;
- canonicalization authorization rule;
- canonical representative rule;
- production/independent source hashes;
- workflow hashes;
- explicit authorization.

Stage 2 is not automatically authorized by a Stage 1 result.

## 13. Candidate-level decision taxonomy

For each prospectively frozen candidate scope:

```text
VALIDATED-BOUNDED-ISOMORPHISM
NOT-VALIDATED
NON-ESTIMABLE
```

Meaning:

- `VALIDATED-BOUNDED-ISOMORPHISM`: all prerequisite instrument/identity/reproducibility/estimability gates pass and every applicable scientific transform gate has zero mismatch in the frozen Stage 2 domain.
- `NOT-VALIDATED`: prerequisite gates pass but at least one interpretable scientific transform-semantic mismatch occurs.
- `NON-ESTIMABLE`: identity/instrument/reconstruction/reproducibility/estimability failure prevents a valid candidate decision.

Technical/infrastructure failure is never relabeled `NOT-VALIDATED`.

## 14. Canonicalization authorization taxonomy

Canonicalization is a separate downstream decision:

```text
AUTHORIZED-WITHIN-FROZEN-DOMAIN
NOT-AUTHORIZED
NON-ESTIMABLE
```

Authorization requires at minimum:

1. one or more non-identity transforms are `VALIDATED-BOUNDED-ISOMORPHISM` in the exact intended domain;
2. inverse/bijection and composition/orbit rules used by canonicalization are exact;
3. RAW binding is exact;
4. legal move mapping and successor commutation are exact;
5. bounded graph semantics are exact;
6. required population/reachability closure gates pass;
7. independent verifier passes and decision-input hashes match;
8. canonicalization-specific checks pass.

Canonicalization-specific checks must include:

```text
idempotence
orbit consistency
canonical collision absence outside an authorized orbit
raw/canonical reconstruction binding
move/successor consistency under representative mapping
```

## 15. Canonical representative rule

The exact byte serialization used for canonicalization is not activated at Study start. It must be source-bound and frozen before Stage 2 outcome.

If authorization becomes scientifically eligible, the intended rule family is:

> canonical representative = lexicographically minimum authoritative serialization among the orbit generated only by formally validated and domain-authorized transforms.

No unvalidated transform may enter the orbit generator. No result-dependent representative rule change is allowed.

## 16. Independent verifier

The independent verifier must independently reconstruct, rather than import unverified production scientific-decision logic for:

```text
RAW serialization
state transformation
inverse
legal move generation / exact move identity
move mapping
successor reconstruction
terminal / winner mapping
bounded graph traversal and node/edge binding
candidate mismatch counts
canonicalization checks
decision-input hashes
```

Shared use of the production Bao rule engine may be allowed only where the formal spec explicitly treats that engine as the frozen rule-system object under test; transform, serializer, graph-binding, and decision reconstruction must remain independently implemented wherever feasible. Any unavoidable shared dependency must be disclosed before authorization.

## 17. Hash / provenance contract

Each scientific stage tracks at minimum:

```text
spec hash
source hash
authorization hash
population hash
selection hash
RAW-state identity hash
transformation-definition hash
measurement hash
verification hash
artifact ZIP hash
canonical result hash
```

Large workflow artifacts remain outside Git history unless compact repository-facing storage is scientifically necessary. Repository stores canonical compact results plus complete hash/provenance binding.

## 18. No-rescue rule

After relevant outcome inspection, the following are forbidden:

```text
candidate definition repair
failed-candidate-only direction/capture remapping
favorable-phase restriction
seed extension
state replacement
mismatch-state exclusion
threshold relaxation
tolerance addition
move-identity redefinition
canonical representative rule change
failed-gate near-miss exception
subgroup rescue
alternate primary substitution
```

A genuine technical implementation defect must be classified separately. Before scientific generation, a prospective correction may revoke/refreeze/reauthorize. After generation, the Study must fail closed unless a predeclared representation-only/execution-only correction rule demonstrably changes no scientific definition or scientific row.

## 19. Research / engineering separation

This is pure science. Research Generation 2 and AI-GEN engineering lineage are distinct. `PBAI-P1` or later public-AI engineering results cannot change this Study's formal decision.

Even if canonicalization is formally authorized, public AI implementation does not change automatically. Downstream use requires a separate engineering evaluation.
