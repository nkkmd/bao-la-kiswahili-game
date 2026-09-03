# SILGM Stage 0 v4 — Fresh-free technical refreeze

Date: 2026-09-03  
Status: **`SILGM-S0-TECHNICAL-2026-09-03-v4 / AUTHORIZED FOR NEW TECHNICAL EXECUTION / NOT YET EXECUTED`**

## Basis

Stage 0 v3 ended before technical computation because its authorization verifier falsely interpreted fresh-seed strings occurring only inside the wrapper's own negative safety assertion as a scientific-seed access path.

No v3 materialization, lease, technical computation, Stage 1/2 access, or protected depth-10 access occurred.

## v4 technical correction frozen before computation

The v4 verifier must not inspect the wrapper source for the literal fresh-seed strings used by a negative assertion. Instead it must:

1. bind the exact v4 wrapper blob;
2. bind the production/independent libraries and all relevant preregistration files;
3. verify the production/independent libraries themselves contain no Stage 1/2 seed literals;
4. execute the wrapper's `--verify-only` materialization audit before lease creation;
5. rely on that materialization audit to prove the generated v4 technical runner contains no `31710001` or `31720001` literal and does not access protected depth-10 evidence.

The v3 technical fixture contract is retained unchanged:

- Namua technical root = fixed seed `31709001`;
- Mtaji technical root = seed-ascending first eligible over `31709002..31709008` only;
- no technical seed extension;
- same 80-ply target horizon and eligibility rule;
- attempted technical seeds and selected seed recorded.

The v2 corrections remain retained: synthetic G5 expectation `7/17`, and deterministic-core check snapshot before telemetry/resource-only T14 bookkeeping.

All scientific Study definitions, Stage 1/2 populations/seeds, geometry/search endpoints, promotion rules, formal test, multiplicity, resource ceilings, no-rescue and protected depth-10 boundaries remain unchanged.

Maximum authorized v4 technical computations: `1`.

A v4 PASS does not authorize Stage 1; a separate fresh-free Stage 1 authorization review remains mandatory.
