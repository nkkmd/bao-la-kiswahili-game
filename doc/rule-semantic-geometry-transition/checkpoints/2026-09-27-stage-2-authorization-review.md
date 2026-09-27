# G4-08 / BRSGT-STUDY1 — Stage 2 formal authorization review

Date: 2026-09-27  
Review ID: `BRSGT-STUDY1-STAGE2-DESIGN-AUTH-2026-09-27-V1`  
Decision: **AUTHORIZED FOR PREREGISTRATION AND PRE-FRESH STATIC VERIFICATION ONLY**

## Current evidence state

Stage 1 v3 `BRSGT-S1-DEVELOPMENT-2026-09-27-v3` completed as outcome-blind support-only development evidence.

```text
workflow run = 36303568642 / attempt 1 / success
fresh scientific seed reads = 512
measured event units = 64
production / independent exact agreement = true
formal inference performed = false
effect values retained = false
effect signs retained = false
supported formal-family slots = 24 / 24
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
```

The Stage 1 support gate used only exact-defined counts, not effect direction. Therefore all 24 preregistered event-family × metric slots may enter a fixed formal family without outcome-adaptive membership.

## Stage 1 technical-invalid versions

Stage 1 v1 and v2 remain technical-invalid and are not scientific evidence.

```text
v1 block 40813001..40813512 = quarantined / no reuse
v2 block 40814001..40814512 = consumed / no reuse
v3 block 40815001..40815512 = consumed / no reuse
```

No Stage 2 design choice may use v1/v2 partial outputs or hidden v3 contrast direction/value.

## Formal construct

Each formal slot is one fixed event family × geometry metric.

Event families remain semantically separate:

- `BRSGT-E1-CAPTURE`
- `BRSGT-E2-NYUMBA-USE-VS-STOP`
- `BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION`
- `BRSGT-E4-NAMUA-TO-MTAJI`

Metrics remain M1-M6 under RAW-only relative depth 5.

For E1/E3/E4 the signed contrast is `post - pre`. For E2 it is `use_post - stop_post` on the frozen same-root same-physical-move pair.

These are event-conditioned contrasts. Formal confirmation must not be described as a universal causal effect.

## Experimental unit and sample structure

Primary formal experimental unit:

`EVENT-UNIT / AT MOST ONE SELECTED UNIT PER SOURCE TRAJECTORY PER EVENT FAMILY`

The two frozen source policies remain P1 and P2. Formal source assignment is seed-parity based and outcome-blind.

Candidate Stage 2 block:

```text
40823001..40824024 / 1024 slots / 512 per policy
```

Formal measurement target:

```text
32 event units per event family per policy
4 families × 2 policies × 32 = 256 maximum measured event units
```

No cross-family or cross-policy borrowing is allowed.

## Formal family and multiplicity

The formal family is exactly the 24 Stage 1 supported slots. No slot may be added or removed based on Stage 2 outcomes.

Multiplicity control:

`HOLM-BONFERRONI / FIXED FAMILY SIZE 24 / FAMILY ALPHA 0.05`

Using one study-wide Holm family controls multiplicity across all four event families without pooling their effect observations or scientific interpretations.

## Formal test

For each slot:

1. retain exact reduced-rational event-unit contrast;
2. classify it as positive, negative, or zero by exact arithmetic;
3. exclude zero contrasts from the exact sign-test denominator;
4. perform an exact two-sided binomial sign test on positive vs negative event units;
5. include `p=1` for non-estimable slots so the Holm family size stays fixed at 24;
6. apply Holm–Bonferroni across all 24 slots.

A confirmation additionally requires the same majority direction within P1 and P2 independently. Policy-level significance is not required, but an opposite or tied policy majority prevents a directional confirmation.

## Frozen estimability gates

Per slot, before formal confirmation:

```text
exact-defined total >= 48
exact-defined P1 >= 24
exact-defined P2 >= 24
nonzero total >= 40
nonzero P1 >= 16
nonzero P2 >= 16
```

If any gate fails, the slot is `NON-ESTIMABLE` and contributes p=1 to the fixed Holm family.

## Decision labels

Allowed formal labels:

- `INCREASE-CONFIRMED`
- `DECREASE-CONFIRMED`
- `NOT-CONFIRMED`
- `NON-ESTIMABLE`
- `TECHNICAL-INVALID`

Decision rule:

- gate failure → `NON-ESTIMABLE`;
- Holm non-significant → `NOT-CONFIRMED`;
- Holm significant + pooled positive majority + P1/P2 positive majority → `INCREASE-CONFIRMED`;
- Holm significant + pooled negative majority + P1/P2 negative majority → `DECREASE-CONFIRMED`;
- otherwise → `NOT-CONFIRMED`.

## Freshness and identity firewall

Stage 2 must exclude all upstream identities already protected for Stage 1 and additionally the complete Stage 1 v3 identity manifest:

```text
Stage 1 v3 artifact ID = 10926322837
identity file SHA-256 = 31c8307b2221544fb388db03333959a06ef212d3bdc5322861a1352261b64e40
identity rows = 512
```

Stage 1 scientific outcome fields are not allowed into the firewall or source selection path.

## Resource / no-rescue boundary

GitHub Actions remains the first execution candidate.

The formal execution must fail closed under frozen resource ceilings. After the first Stage 2 fresh seed read, the following are forbidden:

- same-version rerun;
- seed extension or replacement population;
- policy replacement;
- event grammar or ordering change;
- sample target reduction or support-gate relaxation;
- metric / relative-depth change;
- multiplicity or alpha change;
- policy-concordance rule change;
- resource-ceiling relaxation;
- favorable subgroup rescue.

## Protected boundaries

This review does **not** authorize Stage 2 fresh scientific execution.

```text
Stage 2 preregistration = AUTHORIZED
Stage 2 technical/static verification = AUTHORIZED
Stage 2 fresh scientific seed access = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
main integration = NOT AUTHORIZED
```

A separate source-bound one-shot authorization may be issued only after the complete Stage 2 implementation, identity firewall, independent inference implementation, and pre-fresh static audit pass with fresh Stage 2 reads = 0.
