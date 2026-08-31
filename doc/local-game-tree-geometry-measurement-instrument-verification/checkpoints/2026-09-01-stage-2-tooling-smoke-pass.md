# LGTGMIV-STUDY1 — Stage 2 non-scientific tooling smoke PASS

Date: 2026-09-01

## Disposition

The pre-holdout Stage 2 tooling smoke is accepted as `PASS`.

This is a non-scientific technical check only. It did not generate or read any Stage 2 fresh holdout seed/evidence and does not alter the frozen Stage 2 scientific contract.

## Record

- Stage 2 authorization: `authorizations/2026-09-01-stage-2-formal-authorization.md`
- Stage 2 tooling workflow commit: `ff6810176b396de0a5265567888ba3cb9449b204`
- GitHub Actions run: `33451567682`
- job: `99682401722 / success`
- production selector: `tools/experiments/lib/lgtgmiv-stage2-production.js`
- independent selector: `tools/experiments/lib/lgtgmiv-stage2-independent.js`
- verifier: `tools/experiments/verify-lgtgmiv-stage2-tooling.js`

## Verified boundary

The smoke check verifies, without Stage 2 seed access:

- reconstruction of the frozen G3-01 exclusion identity set in both implementation lines,
- exact binding of that identity digest to the committed Stage 1 scientific result,
- independent construction of the 16-root Stage 1 exclusion identity set,
- exact production / independent Stage 1 firewall agreement,
- synthetic root-selection agreement under the Stage 2 dual-firewall rules,
- no cross-import between Stage 2 production and independent selector modules,
- production Stage 2 selector uses only the production measurement line,
- independent Stage 2 selector uses only the independent measurement line.

## Evidence firewall state

At this checkpoint:

- Stage 1 fresh block `31110001..31110128`: consumed and immutable; no rerun authorized.
- Stage 2 fresh block `31120001..31120192`: `NOT GENERATED / NOT READ`.
- protected standard initial RAW-root exact depth-10 holdout: `SEALED / NOT GENERATED / NOT READ`.

Stage 2 formal execution remains one-shot and must be triggered only after the formal runner/workflow are committed and reviewed. G3-02..G3-08 remain blocked.
