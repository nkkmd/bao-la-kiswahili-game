# Program Decision — Post-G3-08 G3-09 authorization review

Date: 2026-09-03  
Review baseline remote `main`: `6c218b9cc3f492fb96d051768702682fef9bb66a`

## Formal decision

**`G3-09-AUTHORIZED`**

This decision authorizes Research Generation 3 agenda item G3-09 — historically named **Continuous Local-Geometry Representation Study 1** — to proceed only as a new, prospective, independent Study-definition / preregistration freeze and technical-only Stage 0 preparation.

This decision does **not** authorize generation or reading of G3-09 fresh Stage 1 scientific evidence. Fresh Stage 1 remains blocked until the complete Study contract is prospectively frozen, technical-only Stage 0 passes, and a separate post-Stage-0 Stage 1 authorization review is recorded.

The authorized scientific question is whether a prospectively frozen, continuous multiaxial representation of bounded RAW local game-tree geometry can be constructed reproducibly and remain cross-implementation deterministic and stable on fresh held-out evidence without premature reduction to discrete event/candidate classes. The authorization does not extend to Bao win probability, best-move correctness, game-theoretic value, human difficulty, causal mechanism, strategic-regime discovery, or whole-game geometry claims.

## Current immutable program boundary

The review reconfirmed:

```text
remote main = 6c218b9cc3f492fb96d051768702682fef9bb66a
Research Generation 2 = CLOSED
G3-01 / LGTGMF-STUDY1 = CLOSED / TECHNICAL-INVALID
post-G3-01 prerequisite / LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
eligible geometry families = F1,F2,F3,F4,F5
representation = RAW-ONLY
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative local horizon = 5
validated transform set = []
canonicalization / symmetry quotient = NOT AUTHORIZED

G3-04 / SFCDF-STUDY1 = CLOSED / FORMAL-COMPLETE
G3-07 / SILGM-STUDY1 = CLOSED / FORMAL-COMPLETE
G3-08 / LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID
G3-08 Stage 0 = STAGE0-PASS
G3-08 Stage 1 = STAGE1-TECHNICAL-INVALID / 1 authorized / 1 actual
G3-08 Stage 1 seed block = CONSUMED
G3-08 formal promoted candidate set = []
G3-08 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-08 Stage 2 seed block = NOT CONSUMED
G3-08 same-evidence rescue = PROHIBITED
G3-08 technical error = relay-limit enumeration

protected standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

The historical `PROGRAM_PLAN.md` remains historical and unchanged. Its Git blob at the review baseline is `2bb90c11f1625f63f40a7eab8a3de7774505a1ac`.

## 1. Independence from G3-08 technical-invalid outcome

**PASS WITH HARD SCIENTIFIC SEPARATION.** G3-09 is scientifically distinct from G3-08.

G3-08 asked whether exact local-geometry changes persist, decay, reverse, exit and return along trajectories over prospectively frozen lags. G3-09 instead asks whether exact local geometry at sampled roots can be represented as a continuous multiaxial coordinate object that is reproducible and stable across development and fresh formal holdout evidence.

G3-09 must not reuse G3-08 partial Stage 1 trajectory measurements, trajectory-level persistence summaries, candidate-like directions, memory-length signals, phase-specific persistence behavior, or any other scientific content from the technical-invalid execution.

A valid G3-09 result may be eligible, not eligible, non-estimable, inconclusive, or technical-invalid without changing the G3-08 decision.

## 2. Additional prerequisite Study

**NO ADDITIONAL PREREQUISITE REQUIRED.**

The formally eligible LGTGMIV F1-F5 instrument is sufficient to define a continuous geometry representation within the existing RAW-only / relative-depth-5 boundary. G3-09 does not require a new symmetry/canonicalization Study, a repaired G3-08 longitudinal instrument, a strategic-regime representation, or a deeper exact holdout before Study definition.

Any dimensionality-reduction or data-dependent transformation used by G3-09 belongs inside the G3-09 development/formal contract and must be fitted only on development evidence and frozen before formal holdout access.

## 3. Measurement basis sufficiency

**PASS WITH FROZEN AXIS UNIVERSE.**

LGTGMIV provides exact/reproducible measurement families covering tree occurrences, RAW graph structure, transposition/reconvergence, tree/graph relation and reply geometry. These families are sufficient to construct a multiaxial continuous representation if G3-09 prospectively freezes a bounded axis universe composed only of:

- exact eligible primitives; or
- deterministic exact/reduced-rational functions of eligible primitives.

The Study may not introduce a post-result feature family merely because it yields a cleaner geometry, stronger separation or more favorable neighborhood structure.

## 4. Protected depth-10 holdout

**PASS / NOT REQUIRED.**

G3-09 can be completed entirely using fresh bounded depth-5 roots and therefore does not require opening the protected standard-initial RAW-root complete exact depth-10 holdout.

The protected holdout remains:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

G3-09 review, protocol freeze, Stage 0, Stage 1 and Stage 2 may not partially generate, resource-probe, trial-enumerate, count, inspect or debug against any portion of that depth-10 object.

## 5. Protection against retroactive fitting to G3-04 / G3-07

**PASS WITH OUTCOME-BLIND REPRESENTATION DESIGN.**

G3-04 C1/C6 and G3-07 confirmed candidates remain immutable context only. Their confirmed metric identities, directions, thresholds, search endpoints, p-values, support margins or phase contrasts may not be used to choose G3-09 feature inclusion, scaling, weights, dimensionality, representation family, distance metric, neighborhood criterion, phase standardization or formal eligibility threshold.

The G3-09 axis universe must be justified from LGTGMIV measurement semantics and the pre-existing historical G3-09 program question, not from which axes previously produced favorable formal results.

## 6. Use of G3-08 relay-limit technical knowledge

**ALLOWED AS PURELY TECHNICAL DESIGN INFORMATION ONLY.**

The fact that the G3-08 fresh Stage 1 execution encountered `relay-limit enumeration` may be used to require:

- explicit pre-fresh resource ceilings;
- bounded number of roots per stage;
- fail-closed handling of an unmeasurable root;
- artifact-before-repository-mirror;
- durable execution lease;
- explicit per-root/per-stage relay/state/transition limits;
- technical-only Stage 0 stress fixtures.

It may not be used to select scientifically favorable root families, exclude structurally difficult roots after measurement starts, infer geometry directions, alter feature weights, or justify relaxing the LGTGMIV contract after fresh access.

A fresh-stage relay/resource failure must fail closed under the frozen rule. The same fresh evidence may not be rescued by increasing ceilings, replacing roots, shrinking the axis panel or changing the representation family.

## 7. Development / formal separation

**PASS.**

A clean Stage 1 development / Stage 2 formal split is feasible. Stage 1 may fit only those data-dependent representation parameters prospectively authorized in the Study contract. Before any Stage 2 access, all fitted parameters and the complete representation transform must be frozen into a machine-readable formal input artifact.

Stage 2 must use fresh seeds and outcome-blind root selection, and must exclude Stage 1 source trajectories, opening prefixes and RAW roots through identity-only firewalls.

No Stage 2 refitting, reweighting, feature addition/removal, renormalization, PCA refit, distance-metric change or favorable subgroup selection is allowed.

## 8. Production / independent implementation separation

**PASS.**

Production and independent implementations can remain structurally separate. G3-09 must independently reconstruct the eligible geometry primitives and independently apply the frozen representation transformation.

Scientific equality must be established by canonical primitive serialization and exact integer/reduced-rational equality wherever possible. Runtime object prototypes, insertion order, host-specific floating-point formatting and tolerance-based deep object equality may not define scientific equivalence.

If a floating numeric representation is unavoidable for a fitted transform, the Study must freeze a deterministic numerical procedure, serialization precision, linear-algebra convention, sign/orientation rule and equality/checksum method before fresh formal access.

## 9. Resource ceiling feasibility

**PASS FOR TECHNICAL-ONLY STAGE 0; FRESH STAGE 1 REMAINS BLOCKED.**

Resource ceilings can be frozen before scientific outcome access. Technical Stage 0 must establish and test at minimum:

- per-root depth-5 reconstruction state/edge/relay ceilings;
- per-root production+independent elapsed ceiling;
- per-stage root count and elapsed ceiling;
- peak RSS ceiling;
- canonical primitive artifact-size ceiling;
- transformed representation artifact-size ceiling;
- fail-closed behavior for a root that cannot complete exact bounded measurement;
- deterministic recovery of canonical result bytes after process/workflow failure.

No fresh-stage ceiling relaxation is permitted after first fresh access.

## 10. Scientific objective boundary

**PASS.**

G3-09 is authorized only as a representation-construction / representation-eligibility Study. The primary question is whether a continuous local-geometry representation can be prospectively frozen, constructed reproducibly and remain stable/eligible on fresh holdout evidence.

Downstream usefulness is not part of the primary scientific claim. In particular, G3-09 does not automatically test or claim prediction of:

- win/loss or empirical outcome;
- best move correctness;
- AI search quality;
- tactical or strategic difficulty;
- human difficulty;
- causal Bao rule mechanism;
- game-theoretic value;
- whole-game state-space/game-tree geometry.

## Continuous-representation governance requirements

The complete Study contract must freeze, before G3-09 fresh evidence access:

- exact continuous feature/axis universe;
- whether each axis is raw count, exact ratio or deterministic monotone transform;
- normalization/scaling family;
- phase handling and whether phase-specific scaling is prohibited or allowed;
- missing/undefined metric rule;
- feature weighting rule;
- whether dimensionality reduction is used;
- if data-dependent reduction is used, the development-only fitting rule;
- deterministic component orientation/sign rule;
- number of retained dimensions and promotion/freeze rule;
- distance/similarity metric;
- neighborhood definition;
- representation-stability endpoints;
- root/trajectory dependence handling;
- eligibility gates and multiplicity control;
- exact or deterministically serialized numeric representation;
- no-rescue boundary.

Unlimited post-development model search is not authorized. The preregistration must define a finite representation-family menu or one primary family plus tightly bounded fallback rules that can be applied without consulting formal holdout outcomes.

## Required prospective Study contract

Before any G3-09 fresh scientific evidence is generated/read, freeze at minimum:

- formal Study ID and final English/Japanese titles;
- baseline main SHA and dedicated research branch;
- Stage IDs and stage-specific authorization semantics;
- research-engine/rule-semantics/source-blob bindings;
- RAW state and move identity;
- eligible LGTGMIV measurement-family bindings;
- relative depth 5;
- continuous feature/axis universe;
- exact arithmetic / deterministic numeric representation rules;
- missing/undefined metric handling;
- phase handling;
- Stage 0 technical population;
- Stage 1 development population;
- Stage 2 formal holdout population;
- stage seed namespaces;
- root/trajectory sampling unit and outcome-blind selection rule;
- upstream and Stage-1-to-Stage-2 identity firewalls;
- representation-construction rule;
- development-only fitting rule if any;
- promotion/freeze/eligibility rules;
- formal validation endpoints and statistical tests;
- multiplicity control and estimability gates;
- production / independent implementation requirements;
- canonical serialization/hash rules;
- resource ceilings;
- execution-count ceiling;
- durable lease and artifact-before-mirror policy;
- protected depth-10 guard;
- no-rescue boundary;
- stopping rules;
- output artifact schemas;
- repository/document lifecycle rules;
- explicit Stage 1 and Stage 2 authorization conditions;
- main integration only after explicit user instruction.

## Authorization meaning

`G3-09-AUTHORIZED` permits:

1. recording this authorization review and matching RG3 checkpoint;
2. creating a dedicated G3-09 research branch from the reviewed `main` baseline;
3. prospectively freezing the formal Study identity, Stage structure and complete Study contract;
4. preparing and executing technical-only Stage 0 with no G3-09 fresh scientific seed access.

It does **not** authorize G3-09 fresh Stage 1 scientific execution. A separate post-Stage-0 Stage 1 authorization review is mandatory.

## Downstream and integration boundary

No G3-10 or later Study is automatically authorized by this decision or by any eventual G3-09 result.

Main integration remains a separate user-authorized operation after research-branch scientific closure and documentation consistency work.
