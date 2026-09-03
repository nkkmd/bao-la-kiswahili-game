# CLGR-STUDY1 — Formal Study Protocol

Updated: 2026-09-03

## 1. Study identity

```text
Study ID = CLGR-STUDY1
Program position = Research Generation 3 / G3-09
Reviewed main baseline = 6c218b9cc3f492fb96d051768702682fef9bb66a
Research branch = research/g3-09-continuous-local-geometry-representation
English title = Continuous Local-Geometry Representation Study 1 — Prospective construction and fresh-holdout eligibility validation of an exact multiaxial bounded RAW local game-tree geometry representation in Bao
Japanese title = Baoにおける局所ゲーム木幾何の連続多軸表現のprospective構築とfresh holdout eligibility検証 — bounded RAW depth-5 exact geometryを離散candidateへ早期縮約しない再現可能representationの確立
```

## 2. Objective and scientific claim boundary

Primary objective:

> Determine whether a prospectively frozen continuous multiaxial representation of bounded RAW local game-tree geometry can be constructed reproducibly and remain exact/deterministic and formally eligible on fresh held-out Bao roots without reducing the geometry prematurely to binary candidate/event classes.

The Study validates a representation instrument only. It does not claim or test Bao win probability, best-move correctness, human difficulty, AI quality, game-theoretic value, causal mechanism, strategic regime, or whole-game geometry.

## 3. Immutable upstream measurement boundary

```text
measurement foundation = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
eligible families = F1,F2,F3,F4,F5
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
```

Canonicalization, symmetry quotient, reflection and seat-swap deduplication remain prohibited.

## 4. G3-08 no-rescue firewall

`LGPML-STUDY1` remains `CLOSED / TECHNICAL-INVALID`. Its partial Stage 1 trajectory measurements are not G3-09 scientific evidence and must not be read into G3-09 feature selection, scaling, weighting, eligibility or interpretation.

The known `relay-limit enumeration` failure may be used only to freeze fail-closed technical handling and conservative resource controls. It does not justify scientific root filtering after measurement begins.

G3-04 / G3-07 formal result identities, directions, thresholds, p-values and support margins are context only and may not select the representation contract.

## 5. Frozen continuous axis universe

Each analysis root is measured by exact LGTGMIV relative-depth-5 reconstruction and mapped to exactly six axes.

### A1 — `CLGR-A1-ROOT-LEGAL-WIDTH`

Exact integer root legal move count.

### A2 — `CLGR-A2-CUMULATIVE-TREE-OCCURRENCE`

Exact integer sum of tree node occurrences over relative depths 0..5.

### A3 — `CLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES`

Exact integer count of the global distinct RAW-state set reached over relative depths 0..5.

### A4 — `CLGR-A4-CUMULATIVE-TREE-RAW-RATIO`

Exact reduced rational `A2 / A3`.

### A5 — `CLGR-A5-DUPLICATE-TRANSITION-FRACTION`

Exact reduced rational:

`sum(duplicateEncounterCount over parent depths 0..4) / sum(uniqueTransitionCount over parent depths 0..4)`.

### A6 — `CLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION`

Exact reduced rational:

`depth-labelled unique nonterminal RAW-state presences with legal width 1 / all depth-labelled unique nonterminal RAW-state presences over depths 0..5`.

The axis universe is fixed. No axis may be added, removed or substituted after fresh Stage 1 access.

## 6. Primary representation family

Only one primary representation family exists:

**`CLGR-R1-EXACT-SQUASHED-L1`**

For every nonnegative exact rational quantity `q=n/d` in reduced form with `d>0`, define:

`S(q) = q/(1+q) = n/(n+d)`

and reduce the result exactly. Integer axes are interpreted as `n=q,d=1`.

The 6D coordinate is:

`Z(root) = [S(A1),S(A2),S(A3),S(A4),S(A5),S(A6)]`.

Frozen representation rules:

- no centering;
- no z-score normalization;
- no min-max fit to observed data;
- no phase-specific scaling;
- no learned weights;
- no PCA;
- no spectral embedding;
- no graph neural embedding;
- no clustering;
- no component dropping;
- no development-outcome-dependent family selection.

The transform is monotone, exact and data-independent.

## 7. Distance / neighborhood rule

Distance between roots is the equal-weight exact L1 metric:

`D(i,j) = sum_k |Z_k(i)-Z_k(j)|`.

Every sum and difference is represented as a reduced rational. No float tolerance defines equality.

For neighborhood reproducibility, `k=3` is frozen. The neighbor set of a root contains all other roots with distance less than or equal to the third-smallest distinct ordered root-distance cutoff; exact ties at the cutoff are retained. Root identity tie-break ordering is canonical RAW SHA-256 only for serialization, not for discarding tied neighbors.

## 8. Missing / undefined handling

All six axes are mandatory.

- A1/A2/A3 must be defined nonnegative integers.
- A4 requires A3 > 0.
- A5 denominator must be > 0.
- A6 denominator must be > 0.

If any required axis is undefined for a selected scientific root, the root is not replaced. The stage fails its complete-representation gate. After fresh access, the same evidence may not be rescued by dropping the axis or root.

## 9. Phase handling

Namua and Mtaji are retained as metadata strata only. Phase is not a coordinate and does not change scaling or weighting.

Formal reproducibility gates are evaluated for the full population and phase-specific support is used only for estimability/nondegeneracy checks. G3-09 does not test a Namua-vs-Mtaji directional effect.

## 10. Sampling unit and source policy

Scientific experimental unit = one selected RAW root from one unique source trajectory.

Source policy is deterministic seeded random legal play using the same engine semantics as prior RG3 root studies.

For each source seed:

1. replay from the standard initial state using deterministic seeded legal-move selection;
2. generate at most through source ply 80 or terminal;
3. reject the whole source trajectory if engine `relay-limit` occurs during source replay;
4. assign the seed prospectively to Namua or Mtaji by stage-specific SHA-256 parity;
5. consider nonterminal roots at plies >=16 in the assigned phase;
6. exclude upstream-firewall identities;
7. select exactly one candidate root using the minimum SHA-256 rank of `stageId|seed|ply|rootRawSha256`;
8. retain at most one scientific root per source trajectory.

Seeds are processed ascending until the frozen phase target is reached or the seed block is exhausted. Seed extension is prohibited.

The selection rule uses no local-geometry measurement, representation coordinate, prior formal direction, search output or game outcome.

## 11. Identity firewalls

Before Stage 1 authorization, materialize an outcome-free upstream identity manifest covering available prior RG3 scientific populations where canonical identity is available. At minimum retain only:

- source seed;
- source trajectory SHA-256;
- opening-prefix SHA-256;
- RAW-root SHA-256;
- selected source ply/window identity when applicable.

Do not retain prior geometry values, candidate labels, thresholds, search endpoints, p-values, formal directions or persistence summaries.

Before Stage 2 authorization, additionally exclude every Stage 1 source trajectory, opening prefix and RAW root identity.

## 12. Stage structure

### Stage 0 — `CLGR-S0-TECHNICAL-2026-09-03-v1`

Evidence class = `TECHNICAL-FIXTURE` / historical exact technical reference only.

Purpose:

- validate exact six-axis derivation;
- validate exact `q/(1+q)` transform;
- validate reduced-rational arithmetic;
- validate exact L1 distance and k=3 tie-inclusive neighborhood construction;
- validate canonical serialization and root-order invariance;
- validate production/independent implementation separation;
- validate relay-limit fail-closed behavior;
- validate source binding, authorization gate, durable lease and artifact-before-mirror paths;
- validate no Stage 1/2 seed access;
- validate protected depth-10 guard.

Stage 0 may use technical namespace `31909001..31909008` and committed historical exact fixtures. Technical seeds are permanently prohibited from scientific use.

Stage 0 does not authorize or generate G3-09 scientific evidence.

### Stage 1 — `CLGR-S1-DEVELOPMENT-2026-09-03-v1`

Fresh seed block = `31910001..31910256`.

Target population = 24 Namua + 24 Mtaji = 48 unique source trajectories / 48 unique RAW roots.

Stage 1 is not authorized at protocol freeze.

Development pass requires all mandatory integrity/resource gates plus:

- population complete 48/48;
- six axes defined for all 48 roots;
- production/independent exact axis coordinates 48/48;
- exact canonical pairwise L1 matrix agreement;
- exact k=3 neighborhood-set agreement;
- root-order invariance;
- at least 8 distinct coordinate vectors in Namua and at least 8 in Mtaji;
- at least four of the six axes each show at least four distinct exact values in both phases.

If Stage 1 passes, the already-frozen single representation `CLGR-R1-EXACT-SQUASHED-L1` becomes eligible for a separate Stage 2 authorization review. No representation-family search or refit occurs at Stage 1.

### Stage 2 — `CLGR-S2-FORMAL-2026-09-03-v1`

Fresh seed block = `31920001..31920384`.

Target population = 36 Namua + 36 Mtaji = 72 unique source trajectories / 72 unique RAW roots.

Stage 2 remains not authorized until a valid Stage 1 pass, exact freeze of the Stage 1 identity exclusion manifest, fresh-free preauthorization audit and separate authorization decision.

## 13. Formal Stage 2 endpoints

Mandatory exact integrity endpoints:

1. `CLGR-E1-ROOT-RECONSTRUCTION-EXACT`: all 72 roots production/independent exact under LGTGMIV scientific core.
2. `CLGR-E2-COORDINATE-EXACT`: all 72 six-axis transformed coordinate vectors exact.
3. `CLGR-E3-DISTANCE-MATRIX-EXACT`: all `72 choose 2 = 2556` pairwise exact L1 distances identical.
4. `CLGR-E4-NEIGHBORHOOD-EXACT`: all 72 frozen k=3 tie-inclusive neighbor sets identical.
5. `CLGR-E5-ORDER-INVARIANT`: canonical representation/distance/neighborhood scientific core identical under canonical ascending, descending and fixed hash-permuted root order.
6. `CLGR-E6-DEFINEDNESS`: all six coordinates defined on all 72 roots.

Formal nondegeneracy/estimability gates:

- at least 12 distinct coordinate vectors in Namua;
- at least 12 distinct coordinate vectors in Mtaji;
- at least four of six axes each have at least four distinct exact values in both phases.

## 14. Formal decision rule

Possible Stage 2 representation decisions:

- `FORMAL-ELIGIBLE-CONTINUOUS-REPRESENTATION` — complete population, all technical/integrity/resource gates pass, all E1-E6 pass, and all nondegeneracy gates pass.
- `FORMAL-NOT-ELIGIBLE` — complete technically valid population and exact implementation integrity are achieved, but a prospectively frozen scientific representation-eligibility/nondegeneracy gate fails.
- `NON-ESTIMABLE` — frozen source/phase support cannot produce the complete required population within the seed block without technical integrity failure.
- `TECHNICAL-INVALID` — source binding, engine semantics, relay-limit within required bounded reconstruction, production/independent scientific equality, authorization/execution integrity, resource ceiling or canonical artifact integrity fails.

A technical-invalid result is not a scientific negative result.

## 15. Statistical tests and multiplicity

Primary G3-09 eligibility is an exact representation/instrument decision, not a stochastic effect-size hypothesis test. Therefore:

```text
formal null-hypothesis test = NONE
p-value = NOT APPLICABLE
multiplicity correction = NOT APPLICABLE
```

No phase difference, outcome prediction or candidate direction is formally tested. Exact gate multiplicity is handled conjunctively: every mandatory gate must pass; there is no favorable subset selection.

Any optional descriptive marginal distributions, pairwise axis associations or phase summaries remain `DESCRIPTIVE-ONLY` and cannot change the formal representation decision.

## 16. Exact arithmetic and serialization

Scientific primitives use:

- integers as canonical decimal strings when outside ordinary safe integer handling;
- reduced rationals `{numerator,denominator,defined}` with positive denominator;
- deterministic canonical JSON with sorted object keys;
- SHA-256 for scientific-core identity.

No runtime elapsed time, RSS, job ID, filesystem path or object prototype enters the scientific digest.

## 17. Production / independent implementation contract

Production and independent implementations must:

- independently reconstruct the eligible LGTGMIV geometry;
- independently derive A1-A6;
- independently implement rational reduction, transform, L1 distance and neighborhood sets;
- not import each other's CLGR aggregation functions;
- pass static import-boundary audit before Stage 1;
- compare canonical primitives/bytes rather than prototype-sensitive runtime objects.

## 18. Resource ceilings

Frozen ceilings for any scientific Stage 1/2 root:

```text
perImplementationRootElapsedMs = 180000
combinedPerRootElapsedMs = 360000
uniqueRawStates = 100000
uniqueTransitions = 750000
parentExpansions = 100000
legalMoveEvaluations = 750000
treeNodeOccurrences = 1000000000
peakRssBytes = 4294967296
rootArtifactBytes = 67108864
stageResultArtifactBytes = 268435456
Stage1ElapsedMs = 10800000
Stage2ElapsedMs = 14400000
```

A ceiling may be tightened before fresh Stage 1 access if technical-only Stage 0 demonstrates a need and the new ceiling is prospectively refrozen. A ceiling may never be relaxed after first fresh Stage 1 access.

Engine `relay-limit` is always technical invalidity, never terminal/game-theoretic outcome.

## 19. Execution integrity

For every scientific stage:

- max authorized scientific executions = 1;
- separate authorization artifact required;
- source/tree/blob bindings verified before computation;
- durable pre-computation lease required;
- artifact written/uploaded before repository mirror;
- exact-byte recovery path required;
- mirror may not recompute scientific evidence;
- same-stage same-evidence rerun prohibited after first fresh access;
- duplicate/unintended executions are invalid and cannot replace the authorized run.

## 20. No-rescue boundary

The no-rescue boundary is crossed at first Stage 1 fresh scientific access.

After that point the following are prohibited for the same Study/evidence:

- implementation repair followed by same-evidence rerun;
- seed extension;
- source/population/root replacement;
- feature addition/removal/substitution;
- scaling or transform change;
- phase-specific standardization;
- feature weighting change;
- dimensionality reduction introduction/refit;
- distance/neighborhood rule change;
- support/estimability gate relaxation;
- formal endpoint or decision-rule change;
- resource-ceiling relaxation;
- favorable subgroup or phase selection.

A post-fresh technical defect that requires such change closes the affected Study version fail-closed; future work requires a new prospective independent Study/version.

## 21. Protected depth-10 boundary

Standard-initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

No G3-09 stage may partially generate, probe, trial-enumerate or resource-estimate from it.

## 22. Stopping rules

- Stage 0 failure: no fresh Stage 1 authorization until a fresh-free technical versioning decision is recorded.
- Stage 1 technical-invalid/non-estimable/non-pass: Stage 2 not authorized.
- Stage 1 pass: separate Stage 2 eligibility/authorization review required.
- Any scientific execution-count violation: fail closed.
- Any protected depth-10 access: fail closed and escalate to program-level integrity review.

## 23. Output artifacts

At minimum each scientific stage must materialize:

- source/selection manifest;
- identity firewall/exclusion manifest;
- production root measurements;
- independent root measurements;
- canonical six-axis coordinate table;
- exact pairwise L1 distance table/matrix digest;
- exact neighborhood-set table/digest;
- resource telemetry separated from scientific core;
- canonical stage result JSON;
- execution/authorization provenance;
- source/blob hash bindings.

## 24. Repository lifecycle

The Study directory maintains README, protocol, machine-readable preregistration, CURRENT_STATUS, DECISION_REGISTER, REPRODUCIBILITY_INDEX, authorizations, checkpoints, results, executions and final report.

Historical `doc/research-generation-3/PROGRAM_PLAN.md` is not rewritten retrospectively.

Current-facing program documents may be updated on the research branch as lifecycle state changes.

Main integration is prohibited until explicit user instruction after Study closure and final document/repository consistency audit.
