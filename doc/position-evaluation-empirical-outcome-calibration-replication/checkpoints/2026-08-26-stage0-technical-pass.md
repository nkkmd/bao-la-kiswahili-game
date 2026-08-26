# PEOCR-STUDY1 — Stage 0 Technical PASS

Date: 2026-08-26  
Stage: `PEOCR-S0-TECHNICAL-2026-08-26-v1`  
Decision: **`STAGE0-TECHNICAL-PASS`**

## Execution

```text
study-start baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
execution commit = a3d8af5bbec005c61571d2533800775d87840283
workflow run = 32969621181
artifact = peocr-stage0-technical-v1
artifact ZIP SHA-256 = 645cd4925bc98c51ffead686a6a436a18c85771f11a3ceff999fdcc4153bcc6a
production.json SHA-256 = d0a72cad4e1c4612d30674bc3bc700a768b1ef5a3402f82343ec7b2fe58ca698
```

Production technical smoke passed every frozen technical gate. The separately implemented verifier reproduced RAW identity, 64-seed accounting, actor-relative evaluation, D2 search result, PAVA fixture, proper-score calculations, deterministic bootstrap probe, spec hashes, and closed authorization state.

## Covered technical semantics

- authoritative RAW identity and missing-`pending` rejection
- `turn/reason` exclusion from identity
- Namua and Mtaji fixtures from quarantined technical seeds
- deterministic `AI.evaluate`
- actor/opponent evaluation antisymmetry on fixtures
- frozen hard/bao/phase2/D2 search determinism
- deterministic monotone PAVA
- prospective `[0.01,0.99]` clipping
- finite Brier and clipped log loss including boundary-contradiction fixtures
- deterministic phase-stratified bootstrap index stream
- deterministic calibration slope/intercept diagnostic implementation
- spec/source hash binding
- Stage 1 and Stage 2 authorization remaining closed

## Scientific boundary

Stage 0 is technical-only.

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

No calibration evidence or Bao scientific outcome is inferred from the smoke fixtures.

## Next gate

Stage 1 scientific generation remains **NOT AUTHORIZED** until Stage 1 production/verification implementation is present, all Stage 1 scientific source files are SHA-256 frozen, and an explicit authorization record binds those exact hashes to the frozen Stage 1 spec.
