# Research Program Decision — Post-G3-09 G3-10 Authorization Review

Date: 2026-09-03
Reviewed remote `main`: `0bcd1695b6dbd044acf2eed91740d282c63dbb07`

## Formal conclusion

**`PREREQUISITE-REQUIRED`**

G3-10 — Geometry-Conditioned Longitudinal Dynamics Study 1 — is **not authorized** for scientific execution in the current evidence state.

This is a current-state dependency review only. No G3-10 fresh scientific evidence, no prerequisite fresh scientific evidence, no fresh scientific seed and no protected depth-10 evidence were generated, read or peeked during this review.

## Current upstream state

The review independently confirmed the following current source-of-truth boundaries:

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
eligible measurement families = F1,F2,F3,F4,F5
representation = RAW-only
relative local horizon = 5
validated transform set = []

SFCDF-STUDY1 / G3-04 = CLOSED / FORMAL-COMPLETE
C1 unit-width occupancy = CONFIRMED / MTAJI-GREATER
C6 cumulative tree/RAW ratio = CONFIRMED / NAMUA-GREATER

SILGM-STUDY1 / G3-07 = CLOSED / FORMAL-COMPLETE
confirmed family = G1 root legal width x E3 ranking-preorder change under SC1/SC2/SC3

LGPML-STUDY1 / G3-08 = CLOSED / TECHNICAL-INVALID
partial Stage 1 trajectory measurements = prohibited scientific input
relay-limit information = technical-design-only

CLGR-STUDY1 / G3-09 = CLOSED / TECHNICAL-INVALID
Stage 1 = STAGE1-PASS / development evidence only
Stage 2 = TECHNICAL-INVALID / 61 of 72 formal roots measured before fail-closed
formal continuous-representation eligibility = NOT ESTABLISHED
Stage 2 partial formal scientific reuse = PROHIBITED
same-evidence rerun = PROHIBITED
```

The standard-initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**.

Historical `doc/research-generation-3/PROGRAM_PLAN.md` remains immutable.

## A. Can G3-10 be authorized as historically conceived?

**No.**

The historical G3-10 concept depends on validated local-geometry coordinates for longitudinal directionality, persistence, return, hysteresis and path dependence. G3-09 was the prospective Wave-C representation study intended to establish such a continuous coordinate system, but its fresh formal holdout did not complete. Its Stage 1 development PASS cannot be promoted post hoc into formal representation eligibility.

Using `CLGR-R1-EXACT-SQUASHED-L1` as a G3-10 scientific coordinate at this point would violate the evidence hierarchy and the explicit G3-09 downstream boundary.

## B. Can G3-10 be redefined as representation-free within the same Study?

**Not without a material dependency and endpoint change.**

LGTGMIV F1-F5 exact RAW primitives remain formally eligible and could support a different prospective longitudinal Study in which each raw measurement axis is analyzed separately. That is scientifically feasible in principle.

However, replacing the historical G3-10 dependency on validated local-geometry coordinates with an unvalidated raw multiaxial panel would change the Wave-C dependency structure and the meaning of the planned coordinate-conditioned directionality / return / hysteresis endpoints. Performing that substitution under the G3-10 label would be a rescue-style redefinition after G3-09 failed to establish its prerequisite.

Therefore this review does not authorize a representation-free reinterpretation of G3-10. A future raw-axis-only longitudinal investigation, if desired, must be separately prospectively defined as a different Study.

## C. Is a new prerequisite required?

**Yes.**

Before G3-10 can be reconsidered, a new independent prospective prerequisite must establish a continuous multiaxial bounded local-geometry representation under a resource-robust / relay-limit-safe contract.

The prerequisite must satisfy all of the following:

- it does not reopen, repair or reclassify `CLGR-STUDY1`;
- it does not reuse G3-09 Stage 1 or Stage 2 scientific measurements as new scientific evidence;
- it does not target the G3-09 failing root, its seed, or any favorable subgroup learned from G3-09 outcomes;
- it uses a fresh population and fresh seed namespace;
- G3-08/G3-09 relay-limit knowledge may be used only as technical design information;
- G3-04/G3-07 formal outcomes may not be used to select axes, weights, directions, thresholds or populations;
- resource robustness and scientific population definition are prospectively separated;
- pre-root reconstructibility/resource eligibility is deterministic, outcome-blind, fixed before fresh access and independently verified;
- production and independent implementations remain materially separate;
- exact integer / reduced-rational primitives are authoritative;
- fresh-access failure is fail-closed and may not be repaired by same-evidence rerun, seed extension, root replacement, resource-ceiling relaxation or relay-limit handling change;
- protected depth-10 remains sealed.

## Prerequisite scientific purpose

The new prerequisite should answer a narrow instrument question:

> Can a prospectively fixed continuous multiaxial representation of formally eligible LGTGMIV F1-F5 bounded RAW depth-5 geometry be reconstructed and independently verified on a fresh, prospectively defined resource-eligible Bao population under a deterministic bounded-workload contract, without post hoc exclusion or repair?

The prerequisite is an instrument/representation eligibility study. It does not test G3-10 longitudinal directionality, persistence, return, hysteresis or path dependence.

## Authorization boundary after this review

Authorized now:

1. record this `PREREQUISITE-REQUIRED` decision;
2. create a new research branch from reviewed current `main`;
3. prospectively freeze a new independent prerequisite Study identity and complete contract;
4. build and execute **technical-only Stage 0** without fresh scientific seed access;
5. after Stage 0, conduct a separate scientific-stage authorization review.

Not authorized now:

- G3-10 scientific execution;
- G3-10 fresh seed access;
- prerequisite Stage 1 or Stage 2 scientific execution before separate authorization;
- any reuse of G3-09 partial formal measurements;
- any protected depth-10 generation/read/peek;
- any main integration.

## Main integration boundary

`main` integration remains **`NOT AUTHORIZED / NOT PERFORMED`** until explicit user instruction in this chat.
