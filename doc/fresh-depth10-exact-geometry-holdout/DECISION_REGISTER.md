# FDEGHV-STUDY1 — DECISION REGISTER

更新日: 2026-09-04

## Final Study decision

```text
Program = Research Generation 3 / G3-11
Study = FDEGHV-STUDY1
Lifecycle = CLOSED / FORMAL-COMPLETE
Formal domain decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1 = DEEPER-CONFIRMED
H2 = DEEPER-CONFIRMED
H3 = DEEPER-CONFIRMED
H4 = DEEPER-CONFIRMED
scientificResultCoreSha256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
main integration = COMPLETE / FAST-FORWARD / source tip 03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae / previous main e537199a959c0808cbef6cf8aaeb1caab91e3702 / force=false
```

## D-01 — Program authorization

Decision: **`G3-11-AUTHORIZED`**

Basis: post-G3-10 current-state review. Authorization was prospective and outcome-blind; protected depth-10 remained sealed through the review and freeze phase.

## D-02 — Formal domain

Decision: **`EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`**

Basis:

- standard initial RAW root;
- complete reachable layers depth 0..10;
- complete parent expansion layers 0..9;
- production completion without stopReason;
- all frozen production/final artifact resource gates PASS;
- materialized verification PASS;
- materially separate full independent depth-10 exact re-enumeration PASS.

This decision is exact only inside the frozen standard-root depth-10 domain.

## D-03 — H1 exact-depth novelty continuation

Decision: **`DEEPER-CONFIRMED`**

```text
newRawStateCount[10] = 348270
uniqueRawStateCount[10] = 348270
348270 == 348270
```

## D-04 — H2 layer tree/RAW divergence continuation

Decision: **`DEEPER-CONFIRMED`**

```text
treeNodeOccurrences[10] = 494456
uniqueRawStateCount[10] = 348270
494456 > 348270
```

## D-05 — H3 cumulative tree/RAW inflation continuation

Decision: **`DEEPER-CONFIRMED`**

Frozen exact integer comparison:

```text
left = treeThrough10 * rawThrough9 = 64913155557
right = treeThrough9 * rawThrough10 = 61644248915
left > right
```

## D-06 — H4 transposition persistence

Decision: **`DEEPER-CONFIRMED`**

```text
duplicateArrivalCount[10] = 11725
statesWithMultiplePredecessors[10] = 10383
```

Both prospectively required quantities are strictly positive.

## D-07 — Stage 0 treatment

Decision: **`STAGE0-PASS`**

Stage 0 technical result itself passed all frozen controls. The enclosing Actions run later failed in a post-artifact current-document synchronization step because of a stale exact-string assumption. That defect occurred after Stage 0 PASS artifact materialization and before protected depth-10 access.

The Stage 0 scientific/technical execution was **not rerun**. Repair was limited to control-plane/documentation handling.

## D-08 — Protected evidence state after Stage 1

Decision:

```text
protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED
```

The historical pre-access label `SEALED / NOT GENERATED / NOT READ / NOT PEEKED` remains valid only for records explicitly describing the pre-Stage-1 chronology. Current-facing G3-11 documents must not present it as the present state.

## D-09 — Representation and estimator firewalls

```text
RAW-only = retained
validated transform set = []
symmetry reduction used = false
canonicalization used = false
G2-12 estimator scientific input used = false
depth11 accessed = false
```

No post-outcome representation rescue or estimator-based reinterpretation is authorized.

## D-10 — Upstream decisions

G3-11 does not revise, rescue, strengthen, weaken, or reclassify any formal decision from G3-01 through G3-10 or their prerequisite Studies.

In particular, G3-04 phase contrasts, G3-07 search-condition associations, G3-10 trajectory-level longitudinal claims, and G2-12 estimator disposition remain governed by their own canonical records.

## D-11 — Main integration

Decision: **`NOT AUTHORIZED / NOT PERFORMED`**

Scientific closure, documentation closure, and repository integration are separate gates. The G3-11 research branch must remain unmerged until the user gives an explicit main-integration instruction.

## D-12 — Historical program plan

`doc/research-generation-3/PROGRAM_PLAN.md` is a historical prospective artifact and remains unchanged. Current state belongs in current-facing status/index/agenda documents and G3-11 closure records.