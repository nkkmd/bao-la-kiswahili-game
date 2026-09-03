# Research Program Decision — CLGR-STUDY1 Stage 1 Authorization Review

Date: 2026-09-03

## Decision

**`CLGR-STAGE1-AUTHORIZED`**

This decision authorizes exactly one fresh development execution of:

`CLGR-S1-DEVELOPMENT-2026-09-03-v1`

It does not authorize Stage 2.

## Prerequisite state

```text
G3-09 program review = G3-09-AUTHORIZED
Study = CLGR-STUDY1
representation = CLGR-R1-EXACT-SQUASHED-L1
axis universe = CLGR-A1..A6 / FROZEN
measurement basis = LGTGMIV F1-F5 / RAW-only / relative depth 5
validated transform set = []
Stage 0 v1 = TECHNICAL-INVALID / NO RERUN / fresh access false
Stage 0 v2 = STAGE0-PASS
Stage 1 preauth v1 = TECHNICAL-INVALID at syntax check / NO RERUN / fresh access false
Stage 1 preauth v2 = STAGE1-PREAUTH-STATIC-AUDIT-PASS
preauth workflow run = 33750207236
preauth artifact = 9891210816
preauth artifact ZIP SHA-256 = b29ff0d5d8e17fd3bd3f8e12dc08867da84049c4ab6ee7df06a82ecac66ab87a
preauth JSON SHA-256 = 14f4b8d68f727fd81d8f608817ef0c0838aa4d332a36039d2cc300a413c266ef
fresh Stage 1 seed access before authorization = false
Stage 2 seed access = false
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

## Authorization basis

The fresh-free preauthorization audit confirmed the following on the frozen Study contract:

- Stage 0 v2 PASS is present and contains no Stage 1/2 or protected-depth-10 access.
- The only primary representation family remains `CLGR-R1-EXACT-SQUASHED-L1`.
- The six-axis universe, exact rational squash, equal weights, exact L1 distance and tie-inclusive k=3 neighborhoods remain frozen.
- PCA, clustering, learned weights, phase-specific scaling and post-fresh feature selection remain disabled.
- Stage 1 population and seed block remain `24 Namua + 24 Mtaji`, `31910001..31910256`, with no seed extension.
- Root selection is outcome-, geometry- and resource-blind and uses the prospectively frozen stage-specific SHA-256 phase/ranking rule.
- The upstream exclusion input is identity-only. G3-08 partial Stage 1 scientific measurements are not loaded.
- Production and independent selectors/measurement/representation implementations remain separated through distinct CLGR and LGTGMIV implementations.
- The scientific workflow is push-triggered only by a dedicated Stage 1 trigger artifact, requires authorization/source binding before computation, uploads a durable lease before computation and uploads results before repository mirror.
- The protected standard-initial RAW-root complete exact depth-10 holdout remains sealed and is not required.

No additional prerequisite Study is required.

## Authorized scientific boundary

The authorized fresh evidence is limited to the frozen Stage 1 development population and the fixed relative-depth-5 representation contract.

```text
seed block = 31910001..31910256
maximum authorized scientific executions = 1
seed extension = prohibited
root replacement after measurement failure = prohibited
same-evidence rerun = prohibited
resource ceiling relaxation after fresh access = prohibited
representation/axis/transform/weight/distance/gate changes after fresh access = prohibited
```

The scientific no-rescue boundary is crossed at the first Stage 1 seed generation/read during the authorized execution. Any technical failure after that point is fail-closed for this Stage 1 evidence block.

## Stage 2 boundary

A Stage 1 PASS or eligible result does **not** automatically authorize Stage 2. Stage 2 requires a separate post-Stage-1 eligibility and authorization review, a Stage-1 identity-only exclusion manifest, source-bound formal tooling, and exactly one separate formal execution.

Stage 2 seeds `31920001..31920384` remain unconsumed and unauthorized at this decision point.

## Main integration

Main integration remains prohibited until the Study is closed, repository/document consistency is audited, and the user gives a separate explicit integration instruction.
