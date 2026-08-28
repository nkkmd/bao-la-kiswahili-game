# Prospective RAW Enumeration Hardening Requirements after G2-05

Date: 2026-08-28  
Status: **PROSPECTIVE PROGRAM-LEVEL IMPLEMENTATION REQUIREMENT**  
Origin: PR #71 review of `G2-05` / `DRSSE-STUDY1`

## Purpose

This record converts two valid latent implementation concerns identified during the review of `DRSSE-STUDY1` into mandatory requirements for **future** RAW state-space enumeration implementations.

This record is not a retroactive amendment to `DRSSE-STUDY1`. It does not modify, rerun, reinterpret, rescue, or weaken the accepted G2-05 formal result.

Immutable G2-05 state:

```text
study = DRSSE-STUDY1
stage = DRSSE-S2-FORMAL-2026-08-28-v1
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
authorization/head = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
canonical run = 33156581843
canonical artifact = 9679860509
```

The frozen G2-05 Stage 2 source blobs remain historical scientific provenance and must not be edited or rerun under the same formal identity.

## Scope

These requirements apply whenever a future Study/version uses or derives from the G2-05 RAW enumeration architecture to make an exact bounded-layer claim, including a future version of DRSSE and **G2-12 — State-Space / Game-Tree Growth Estimation Study 1** if G2-12 uses bounded exact RAW enumeration as an empirical foundation.

They also apply to any later Research Generation that reuses the same complete-layer / resource-censored enumeration pattern.

## H1 — Independent verification of every claimed-complete layer after a resource/admin stop

A future protocol may retain exact bounded evidence below a resource/admin cutoff only if every claimed-complete layer is independently regenerated and verified.

If production stops while constructing layer `d`, then:

```text
firstIncompleteDepth = d
lastCompleteDepth = d - 1
```

or the equivalent values under that protocol's explicitly frozen indexing convention.

Before any layer `0..lastCompleteDepth` is reported as exact, a structurally separate independent implementation must start from the prospectively frozen root and re-enumerate the complete domain through `lastCompleteDepth`.

The independent path must verify, at minimum:

- RAW state identity and state-set equality at every claimed-complete depth;
- every complete parent layer's legal edge set and successor binding;
- tree occurrence propagation;
- predecessor / transposition accounting;
- phase and terminal accounting where those are endpoints;
- all frozen set/file/result hashes required by the protocol.

A production resource stop by itself is not sufficient to certify the earlier layers. If independent re-enumeration of the claimed-complete prefix cannot be completed or does not match, those layers must not receive an exact scientific label under that execution.

## H2 — Final ambient/resource recheck before exact completion classification

A future production enumerator must perform a final resource/ambient check **after the final transition work and final scientific materialization/serialization that are part of the frozen resource contract, but before setting `targetComplete=true` or issuing an exact candidate decision**.

The final check must cover every resource class frozen by the protocol, including as applicable:

- cumulative distinct RAW states;
- depth-labelled edges;
- parent expansions;
- move evaluations;
- tree occurrences;
- resident memory;
- wall-clock / administrative cutoff;
- uncompressed scientific artifact size.

A cap crossed only during final materialization is still a cap crossing. Such an execution must be classified according to the preregistered stop taxonomy rather than promoted to an exact complete result.

The protocol must define whether resource measurement includes temporary files and post-processing; that choice must be frozen before formal outcome generation.

## H3 — Mandatory pre-formal negative-control matrix

Before future formal authorization, the implementation must demonstrate tests that exercise both the success path and the previously latent paths. At minimum, the test matrix must include:

1. target-complete positive control;
2. forced state/edge/work/tree cap during an intermediate layer;
3. forced wall/admin stop during an intermediate layer;
4. forced artifact-size cap at or after final materialization;
5. final ambient check with a cap just below and just above the observed terminal value;
6. corrupted `lastCompleteDepth` / `firstIncompleteDepth` metadata;
7. independent-prefix mismatch after a simulated resource stop;
8. missing or corrupted final-layer state/edge materialization.

Formal authorization must be blocked if the implementation incorrectly promotes an incomplete layer or skips independent verification of a claimed-complete prefix.

## H4 — New source identity and authorization

Any code change implementing H1/H2 is a **new prospective implementation version** for scientific use.

It must have:

- new Git blob/source identities;
- an explicit new Study/version or Stage implementation identity where required by the scientific protocol;
- a fresh source freeze before outcome generation;
- a fresh execution authorization.

The corrected implementation must not be substituted retrospectively into `DRSSE-S2-FORMAL-2026-08-28-v1`, and the canonical G2-05 evidence must not be rerun to obtain a cosmetically cleaner result.

## H5 — Post-merge read-only closure audit

For a closed study with a canonical scientific result, later `main` changes to its documentation, indexes, consistency tests, or administrative provenance should trigger a **read-only closure audit** when practical.

The audit may:

- parse canonical repository-facing results;
- check frozen decision/count/hash invariants;
- check no-rescue and interpretation boundaries;
- check documentation/index consistency;
- check workflow archival state.

The audit must not:

- rerun scientific enumeration;
- create replacement formal evidence;
- modify frozen formal source;
- alter the accepted decision automatically.

A post-merge audit failure is first an integrity/administrative signal. If it reveals a genuine scientific defect, the applicable frozen decision taxonomy and prospective-version rules govern the response.

## H6 — G2-12 adoption boundary

If G2-12 uses G2-05-derived exact enumeration code or exact bounded prefixes, its preregistration must explicitly adopt or supersede H1–H5 **before** any G2-12 scientific outcome is generated.

G2-12 must keep two evidence classes separate:

```text
complete independently verified RAW layers = exact bounded evidence
estimation / extrapolation beyond those layers = separate prospective estimator evidence
```

No estimator may inherit an `exact` label merely because its input prefix was exact. Resource-censored or incomplete layers must not be silently used as exact growth observations.

## G2-05 impact statement

These prospective hardening requirements do not change the G2-05 result because its canonical run:

- was target-complete through the frozen depth 9;
- performed and passed full independent depth-9 re-enumeration;
- recorded final resource use below every frozen cap.

The canonical G2-05 decision therefore remains:

**`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**.
