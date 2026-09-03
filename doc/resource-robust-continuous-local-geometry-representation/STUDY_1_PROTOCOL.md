# RRCLGR-STUDY1 — Formal Study Protocol

Updated: 2026-09-03

## 1. Study identity

```text
Study ID = RRCLGR-STUDY1
Program position = Research Generation 3 / Pre-G3-10 independent prerequisite
Reviewed main baseline = 0bcd1695b6dbd044acf2eed91740d282c63dbb07
Research branch = research/pre-g3-10-resource-robust-continuous-local-geometry
English title = Resource-Robust Continuous Local-Geometry Representation Verification Study 1 — Prospective independent validation of an exact multiaxial bounded RAW local-game-tree geometry representation under deterministic pre-root reconstructibility eligibility in Bao
Japanese title = Baoにおけるresource-robust連続局所ゲーム木幾何表現のprospective独立検証 — deterministic pre-root reconstructibility eligibilityによりbounded RAW depth-5 exact multiaxial representationをfail-closedで確立するG3-10 prerequisite
```

This Study is new, prospective and independent. It does not reopen, repair, rerun or reclassify `CLGR-STUDY1`.

## 2. Objective and claim boundary

Primary objective:

> Determine whether a prospectively fixed continuous multiaxial representation of formally eligible LGTGMIV F1-F5 bounded RAW depth-5 geometry can be reconstructed and independently verified on a fresh, prospectively defined resource-eligible Bao population under a deterministic bounded-workload contract, without post hoc exclusion or repair.

The Study validates a representation instrument for a prospectively defined resource-eligible stratum. It does not test G3-10 trajectory directionality, persistence, return, hysteresis or path dependence. It does not claim whole-game geometry, game-theoretic value, win probability, causal mechanism, human difficulty, AI quality or strategic-regime validity.

## 3. Immutable upstream evidence boundary

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
eligible measurement families = F1,F2,F3,F4,F5
representation = RAW-only
relative local horizon = 5
validated transform set = []

LGPML-STUDY1 / G3-08 = CLOSED / TECHNICAL-INVALID
CLGR-STUDY1 / G3-09 = CLOSED / TECHNICAL-INVALID
G3-09 formal continuous-representation eligibility = NOT ESTABLISHED
```

G3-08/G3-09 partial scientific measurements are prohibited scientific inputs. G3-09 Stage 1 coordinates and Stage 2 partial coordinates are not copied into this Study. The existence and operational form of `relay-limit enumeration` may be used only as technical resource-design information.

G3-04/G3-07 formal outcomes may not select axes, weights, scaling, thresholds, phase allocation, population or endpoints.

The standard-initial RAW-root complete exact depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ / NOT PEEKED`; partial probes are prohibited.

## 4. Frozen representation family

Representation ID:

**`RRCLGR-R1-EXACT-SQUASHED-L1`**

The six axes are prospectively fixed from LGTGMIV F1-F5 exact primitives:

1. `RRCLGR-A1-ROOT-LEGAL-WIDTH` — exact integer root legal move count.
2. `RRCLGR-A2-CUMULATIVE-TREE-OCCURRENCE` — exact integer sum of tree node occurrences over relative depths 0..5.
3. `RRCLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES` — exact integer count of the global distinct RAW-state set over relative depths 0..5.
4. `RRCLGR-A4-CUMULATIVE-TREE-RAW-RATIO` — exact reduced rational A2/A3.
5. `RRCLGR-A5-DUPLICATE-TRANSITION-FRACTION` — exact reduced rational sum of duplicate encounters / sum of unique transitions over parent depths 0..4.
6. `RRCLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION` — exact reduced rational depth-labelled unit-width nonterminal RAW-state presences / all depth-labelled nonterminal RAW-state presences over depths 0..5.

For any nonnegative exact reduced rational `q=n/d`, define `S(q)=q/(1+q)=n/(n+d)`. Integer axes are represented as `q/1`. The coordinate is the ordered six-vector of `S(A1)..S(A6)`.

Frozen rules: no centering, no observed-data normalization, no phase-specific scaling, no learned weights, no PCA/embedding/clustering, no component dropping and no development-outcome-dependent family selection.

Distance is equal-weight exact L1. Neighborhood verification uses frozen `k=3`, retaining all exact ties at the third ordered cutoff. Float tolerance does not define scientific equality.

The mathematical family is deliberately data-independent. Its similarity to the prospectively specified G3-09 family is design inheritance only; no G3-09 measured value is reused and no G3-09 decision is changed.

## 5. Deterministic pre-root reconstructibility eligibility

Resource robustness and scientific population definition are separated as follows.

First, an outcome-blind candidate manifest is selected solely from source trajectory identity and phase rules. No local-geometry value is computed or used for candidate ranking.

Second, **before any representation coordinate is generated**, every candidate in that stage is passed through two materially independent bounded depth-5 preflight implementations. Preflight may output only resource eligibility, canonical reason code and implementation-agreement metadata to the population-selection layer; representation axes, coordinates, distances and neighborhoods are not available to selection.

Preflight eligibility is based only on deterministic reconstruction events/counters:

```text
required depth = 5
relay-limit encountered = false
max global distinct RAW states = 100000
max unique canonical transitions = 750000
max parent expansions = 100000
max legal move variants enumerated = 750000
max tree node occurrences over depth-labelled layers = 1000000000
```

A counter is checked during reconstruction, not only after completion. The first exceeded ceiling terminates that preflight as resource-ineligible. `relay-limit` terminates preflight as resource-ineligible. Production and independent preflight must agree exactly on eligibility and canonical reason code; disagreement is `TECHNICAL-INVALID`.

Elapsed time and RSS are never scientific population filters. They are execution-safety ceilings only; exceeding them invalidates the stage rather than excluding/replacing a root.

The full candidate manifest and full preflight eligibility manifest are frozen before representation measurement begins. After measurement begins, no candidate or measured root may be replaced.

## 6. Source policy and identity firewall

Scientific experimental unit = one selected RAW root from one unique source trajectory.

Fresh source policy:

1. deterministic seeded random legal play from the standard initial state;
2. maximum source ply 80 or terminal;
3. source replay `relay-limit` rejects that source before it can become a candidate;
4. source seed is assigned prospectively to Namua or Mtaji using SHA-256 parity of `stageId|seed`;
5. nonterminal roots at plies >=16 in the assigned phase are candidate positions;
6. upstream identity firewall exclusions are applied without importing prior geometry/results;
7. exactly one root per source is selected by minimum SHA-256 rank of `stageId|seed|ply|rootRawSha256`;
8. source seeds are processed ascending until the frozen candidate count is reached or the fixed seed block ends.

The firewall excludes, wherever canonical identities are available, prior RG3 source trajectory SHA-256, opening-prefix SHA-256 and RAW-root SHA-256. Before Stage 2 it additionally excludes every Stage 1 source trajectory, opening prefix and RAW root. Prior scientific geometry values, labels, p-values, directions and thresholds are not retained in the firewall artifact.

## 7. Stage structure and fresh namespaces

### Stage 0 — `RRCLGR-S0-TECHNICAL-2026-09-03-v1`

Evidence class = `TECHNICAL-ONLY`.

Technical seed namespace = `32009001..32009016`; permanently prohibited from scientific use.

Purpose: validate independent bounded preflight, relay-limit/resource-ceiling fail-closed behavior, exact six-axis derivation, exact squash/L1/neighborhood arithmetic, root-order invariance, canonical serialization, implementation separation, source binding, durable lease, artifact-before-mirror ordering and depth-10/fresh-science guards.

Stage 0 may use synthetic fixtures and technical roots only. It may not read Stage 1/2 fresh scientific seed namespaces and cannot authorize scientific inference.

### Stage 1 — `RRCLGR-S1-DEVELOPMENT-2026-09-03-v1`

Fresh seed block = `32010001..32010256`.

Candidate manifest target = 32 Namua + 32 Mtaji unique source trajectories/roots.

Preflight support gate = at least 28/32 resource-eligible candidates in each phase.

If that gate passes, scientific representation population = first 24 resource-eligible Namua and first 24 resource-eligible Mtaji roots in canonical source order, selected from the already-frozen eligibility manifest before coordinate generation.

Stage 1 is **not authorized at protocol freeze**. No Stage 1 seed may be consumed until a separate post-Stage-0 authorization review authorizes exactly one execution.

Development pass requires complete measured population 48/48; all six axes defined; production/independent exact raw primitives/coordinates; exact pairwise L1 matrix and k=3 neighborhood agreement; order invariance; at least 8 distinct coordinate vectors in each phase; and at least four of six axes with at least four distinct exact values in each phase.

### Stage 2 — `RRCLGR-S2-FORMAL-2026-09-03-v1`

Fresh seed block = `32020001..32020384`.

Candidate manifest target = 48 Namua + 48 Mtaji unique source trajectories/roots.

Preflight support gate = at least 42/48 resource-eligible candidates in each phase.

If that gate passes, formal representation population = first 36 resource-eligible Namua and first 36 resource-eligible Mtaji roots in canonical source order from the fully frozen eligibility manifest.

Stage 2 is not authorized until a valid Stage 1 pass, Stage 1 identity exclusion freeze and separate fresh-free authorization review.

## 8. Stage 2 formal endpoints and decision rule

Mandatory exact endpoints:

- E1 bounded preflight production/independent eligibility agreement for all 96 candidates;
- E2 complete frozen eligible population and phase support gate;
- E3 exact depth-5 production/independent reconstruction on all 72 measured roots;
- E4 exact six-axis coordinate equality on all 72 roots;
- E5 exact `72 choose 2 = 2556` L1 pairwise distance equality;
- E6 exact k=3 tie-inclusive neighborhood equality;
- E7 canonical ascending/descending/fixed-hash-permuted order invariance;
- E8 all coordinates defined.

Formal nondegeneracy gates: at least 12 distinct coordinate vectors in Namua and 12 in Mtaji; at least four of six axes each have at least four distinct exact values in both phases.

Possible formal decisions:

- `FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION` — all integrity, preflight-support, exactness and nondegeneracy gates pass.
- `FORMAL-NOT-ELIGIBLE` — technically valid complete populations and exact implementation agreement are achieved but a frozen representation nondegeneracy/eligibility gate fails.
- `NON-ESTIMABLE` — fixed source/candidate support cannot satisfy the frozen candidate or preflight support requirement without an implementation-integrity defect.
- `TECHNICAL-INVALID` — source binding, authorization/execution integrity, production/independent preflight agreement, exact reconstruction equality, execution safety ceiling, artifact integrity or other technical invariant fails.

A technical-invalid result is not scientific negative evidence.

No null-hypothesis test or p-value is used; multiplicity correction is not applicable. Mandatory exact gates are conjunctive and no favorable subset may be selected.

## 9. Exact arithmetic and implementation independence

Scientific integers and reduced rationals are canonical. Production and independent implementations independently reconstruct geometry, derive A1-A6, reduce rationals, squash coordinates, compute L1 distances and construct neighborhoods. Production must not import independent aggregation/preflight logic and independent must not import production logic. Each may use only its corresponding formally eligible LGTGMIV production/independent measurement implementation plus shared engine semantics.

Runtime metadata, object prototypes, filesystem paths, job IDs, elapsed times and iteration-order artifacts do not enter scientific equality digests.

## 10. Execution safety ceilings

Frozen safety ceilings for scientific Stage 1/2:

```text
perImplementationRootElapsedMs = 180000
combinedPerRootElapsedMs = 360000
peakRssBytes = 4294967296
rootArtifactBytes = 67108864
stageResultArtifactBytes = 268435456
Stage1ElapsedMs = 14400000
Stage2ElapsedMs = 21600000
```

These are fail-closed execution ceilings, not resource-eligibility filters. They may be tightened before first Stage 1 fresh access based on Stage 0 technical-only evidence, but may never be relaxed after first Stage 1 fresh access.

## 11. Execution integrity and no-rescue

Each scientific stage requires source-bound authorization, exactly-one execution ceiling, durable pre-computation lease, computation, canonical artifact upload, exact-byte verification and repository mirror. Mirror/recovery may not recompute scientific evidence.

The no-rescue boundary is crossed at first Stage 1 fresh scientific access. Thereafter, within the same Study/version/evidence, no implementation repair plus rerun, seed extension, root replacement, axis/scale/weight/distance/threshold/test change, resource-ceiling relaxation, relay-limit handling change, subgroup selection or same-evidence rerun is allowed. A defect requiring such change closes the affected stage/version fail-closed.

## 12. Authorization state at freeze

```text
Stage 0 technical execution = AUTHORIZED subject to source-bound Stage 0 authorization artifact
Stage 1 scientific execution = NOT AUTHORIZED
Stage 2 scientific execution = NOT AUTHORIZED
G3-10 scientific execution = NOT AUTHORIZED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```
