# SILGM Stage 2 input materialization v1 — control-plane invalid

Date: 2026-09-03

## Disposition

`SILGM Stage 2 Formal Input Materialization v1 = PRECOMPUTATION-CONTROL-PLANE-INVALID / NO SAME-TRIGGER REUSE`

Workflow run `33715627740` failed while attempting to decode the repository mirror named `scientific-result.json.gz`. The repository blob contained transport-encoded text rather than gzip bytes, so `zlib.gunzipSync` failed with `Z_DATA_ERROR: incorrect header check`.

## Scientific boundary

- This workflow was a fresh-free Stage 2 input-materialization step, not Stage 2 scientific execution.
- Stage 2 seed range `31720001..31720384` was not generated or read.
- Stage 2 no-rescue boundary was not crossed.
- Protected standard initial RAW-root complete exact depth-10 evidence remained `SEALED / NOT GENERATED / NOT READ / NOT PEEKED`.
- Stage 1 scientific disposition and the eight promoted candidates are unchanged.

## Versioned correction

A v2 materialization may use only:

1. `results/stage-1/STAGE_1_RESULT_SUMMARY.json` for the already-frozen eight promoted candidate identities; and
2. `prereg/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json` for the 48 Stage 1 selected-root identity exclusions.

It must not read Stage 1 measurement rows, non-promoted candidate details, or any Stage 2 fresh seed.
