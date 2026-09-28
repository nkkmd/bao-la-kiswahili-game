# G4-10 / FDERT-STUDY1 — Stage 0 v3 hardening pre-execution audit

Date: 2026-09-28  
Stage: `FDERT-S0-HARDENING-2026-09-28-v3`  
Decision: **`PASS / READY-FOR-ONE-SHOT-HARDENING-AUTHORIZATION`**

## Scope

Stage 1用bounded-memory production enumeratorをprotected evidenceへ触れる前にdepth-2だけで旧exact enumeratorと比較する。

```text
scientific inference = false
protected depth-11 access = false
maximum real fixture depth = 2
Stage 1 execution = false
```

## Frozen source blobs

```text
.github/workflows/fdert-stage0-hardening-v3.yml = bbee41856a38eb7401185e2582447f37f62719eb
doc/fresh-depth11-exact-reachability-topology/prereg/STAGE_0_TECHNICAL_SPEC_V3.json = 9ddf8c07ad2317e6d3393b67231c101b15c5788e
tools/experiments/run-fdert-stage0-hardening-v3.js = 772f401063eb3808b71f054b84b25de4cd9dd45f
tools/experiments/lib/fdert-production.js = 2307c6fe318550c4556cff336b2019fe98da933e
tools/experiments/lib/fdert-contract.js = 5c564745e44860fa904a2b06cebade2590d43c95
tools/experiments/lib/drsse-production.js = e8fc23799415f566850c817c22cf658216bb98be
tools/experiments/lib/drsse-independent.js = 906e0412bcf47fe37d95ac29ad83f9c83bc52857
public/engine.js = 1527bb3665228b7a5bd9f03153567aedbaaa22d7
```

## Required equivalence

- topology projection exact equality at depth 2
- state JSONL exact byte equality
- edge JSONL exact byte equality
- independent materialized verification PASS
- independent shallow recomputation PASS
- hardened fail-closed controls PASS
- `ROW-STREAMED-BOUNDED-MEMORY` marker present

## Decision

Pre-execution audit PASS。次に許可できるのはv3 one-shot hardening runだけである。Stage 1 scientific executionは未認可のままとする。
