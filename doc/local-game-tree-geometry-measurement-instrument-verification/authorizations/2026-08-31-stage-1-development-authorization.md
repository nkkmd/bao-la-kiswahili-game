# LGTGMIV-STUDY1 — Stage 1 Development Authorization

Date: 2026-08-31

## Authorization decision

`LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1` is **AUTHORIZED FOR ONE FORMAL EXECUTION** under the already-frozen `LGTGMIV-STUDY1` protocol and `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`.

This authorization is prospective: it is committed before any Stage 1 fresh scientific seed is generated or read.

## Satisfied prerequisite

The required technical prerequisite is satisfied by:

- Stage 0: `LGTGMIV-S0-TECHNICAL-2026-08-31-v1`
- formal Stage 0 disposition: `STAGE0-PASS`
- Stage 0 implementation commit: `aa8dee624c09ff03af476bb7d82f850d7c8c3223`
- formal workflow run: `33386868192`
- workflow result commit: `044b39cd414f208226c989c17aeb61ae412d80a2`
- Stage 0 PASS checkpoint: `checkpoints/2026-08-31-stage-0-technical-pass.md`

No Stage 1/2 scientific evidence was generated or read during Stage 0.

## Authorized Stage 1 boundary

Only the following frozen development population is authorized:

- seed block: `31110001..31110128`
- selected population: 8 Namua roots + 8 Mtaji roots
- local relative horizon: depth 5
- authoritative state identity: RAW-only `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set: `[]`
- candidate metric families: only the five families already defined in `STUDY_1_PROTOCOL.md` and `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- deterministic scientific-core / telemetry separation: unchanged from the prospective freeze
- production / structurally independent implementation rule: unchanged from the prospective freeze
- resource ceilings, estimability gates, eligibility gates, promotion rules and decision taxonomy: unchanged from the prospective freeze

No field, threshold, population, seed, horizon, family, resource ceiling, gate or decision rule is modified by this authorization.

## Fresh-evidence firewall

Stage 1 execution must not use as scientific evidence:

- G3-01 seed block `31010001..31010096`
- G3-01 selected roots or Stage 1 outputs
- Stage 2 block `31120001..31120192`
- standard initial RAW root complete exact depth-10 holdout
- any other repository-designated reserved/protected future evidence

Any historical G3-01 artifact may be used only as an explicitly labeled non-scientific regression/control fixture and must not enter Stage 1 population selection, family metrics, eligibility decisions or scientific digests.

## One-execution and no-rescue rule

Once the first Stage 1 fresh scientific seed/evidence is generated or read, the Study crosses the no-rescue boundary. From that point, this Study must not be rescued by:

- same-seed formal rerun
- verifier/implementation repair followed by reuse of the same evidence
- tolerance relaxation
- canonical field inclusion/exclusion changes
- metric-family addition or deletion
- unfavorable-root deletion
- favorable-root replacement
- seed extension or population replacement
- local-horizon change
- resource-ceiling change
- estimability/eligibility/promotion threshold change
- formal-decision-taxonomy change

A defect discovered after fresh evidence access must be handled fail-closed under the frozen protocol rather than repaired within the same evidence.

## Stage 2 boundary

This authorization does **not** authorize Stage 2. `LGTGMIV-S2-FORMAL-2026-08-31-v1` remains `NOT-AUTHORIZED-NOT-EXECUTED` unless and until every prospectively frozen Stage 1 progression gate is satisfied, a non-empty promoted family set exists as required by the protocol, and a separate Stage 2 authorization artifact is committed.

## Protected evidence

Protected standard initial RAW root exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

No Stage 1 implementation or workflow may generate or inspect it.

## Upstream and downstream boundaries

This authorization does not alter G3-01. `LGTGMF-STUDY1` remains `CLOSED / TECHNICAL-INVALID`, eligible families `[]`, Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`.

This authorization also does not start G3-02. G3-02..G3-08 automatic start remains blocked pending post-closure program-level authorization review.
