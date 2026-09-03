# Research Program Decision — RRCLGR Post-Stage-0 Stage 1 Authorization Review

Date: 2026-09-03
Study: `RRCLGR-STUDY1`
Reviewed baseline main: `0bcd1695b6dbd044acf2eed91740d282c63dbb07`
Stage 0 workflow run: `33758538923`
Stage 0 trigger source: `11739159d6e26037b2b9c006eac06407f6284f01`

## Formal conclusion

**`RRCLGR-STAGE1-AUTHORIZED`**

Exactly one source-bound execution of `RRCLGR-S1-DEVELOPMENT-2026-09-03-v1` may be authorized after its scientific execution tooling and authorization artifact are frozen.

This decision does **not** authorize Stage 2 or G3-10.

## Stage 0 evidence reviewed

Stage 0 is `TECHNICAL-ONLY` and completed exactly once with workflow conclusion `success` and result disposition `STAGE0-PASS`.

Verified technical gates:

- source-bound authorization verification passed;
- durable pre-computation lease was uploaded before computation;
- synthetic six-axis derivation exactness passed;
- exact rational `q/(1+q)` transform passed;
- exact L1 and k=3 tie-inclusive neighborhood agreement passed;
- root-order invariance passed;
- forced `relay-limit` was converted to deterministic preflight resource-ineligibility rather than a game outcome;
- forced deterministic resource ceiling was fail-closed;
- production and independent bounded preflight agreed;
- one technical Namua root and one technical Mtaji root from the non-scientific namespace were preflight-eligible and reconstructed exactly by materially separate LGTGMIV production/independent paths;
- production/independent axes and coordinates were exact;
- fresh Stage 1/2 scientific seed access was false;
- protected depth-10 access was false;
- scientific inference authorization was false.

Uploaded result artifact ZIP digest:

`sha256:3635e5a9a9d2a882ab7df170fc769c3c8f54a5231ffd6c25b03a7634b5dedfbd`

Exact result JSON:

```text
bytes = 4808
sha256 = 82e6d1c15b92e6f8adfc080bbcf77d278a7a3f83f20047c650e0a6fba80b1fe7
Git blob SHA-1 = 95b25311915a1befc543c6a58b536511918ff3b8
```

The mirrored repository blob exactly matches the downloaded artifact bytes.

## Stage 1 authorization rationale

The Stage 0 result establishes only technical readiness; it is not representation eligibility evidence. It nevertheless resolves the technical prerequisites needed to permit first fresh scientific access under the already-frozen Stage 1 contract:

```text
Stage 1 ID = RRCLGR-S1-DEVELOPMENT-2026-09-03-v1
fresh seed block = 32010001..32010256
candidate manifest = 32 Namua + 32 Mtaji
minimum resource-eligible support = 28/32 per phase
measured population = first 24 eligible roots per phase after full eligibility-manifest freeze
representation = RRCLGR-R1-EXACT-SQUASHED-L1
relative depth = 5
```

The candidate manifest must be completely materialized before any bounded preflight. The complete preflight eligibility manifest must then be materialized before any representation coordinate is generated. No measured root may be replaced after coordinate generation begins.

The deterministic preflight eligibility limits and execution-safety ceilings remain exactly as frozen in `STUDY_1_PROTOCOL.md`; no ceiling is relaxed or changed by this review.

## Exactly-one fresh execution boundary

The Stage 1 scientific workflow must enforce:

1. source-bound authorization;
2. max scientific executions = 1;
3. durable pre-computation lease uploaded before first access to seed `32010001`;
4. candidate-manifest construction;
5. complete bounded-preflight eligibility-manifest construction;
6. representation computation only after eligibility-manifest freeze;
7. canonical artifact upload before repository mirror;
8. exact-byte artifact verification;
9. no scientific recomputation during mirror/recovery.

After first Stage 1 seed access, same-evidence rerun, seed extension, root replacement, implementation repair plus rerun, feature/axis/scaling/weight/distance/threshold change, resource-ceiling relaxation, relay-limit handling change and favorable subgroup selection are prohibited.

## Continuing prohibitions

```text
RRCLGR Stage 2 = NOT AUTHORIZED
G3-10 scientific execution = NOT AUTHORIZED
G3-09 scientific measurement reuse = PROHIBITED
G3-09 failure-root targeting = PROHIBITED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
historical PROGRAM_PLAN = UNCHANGED
main integration = NOT AUTHORIZED / NOT PERFORMED
```
