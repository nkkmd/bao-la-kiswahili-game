# SFCDF-STUDY1 — Stage 0 v2 technical PASS

Date: 2026-09-02

## Disposition

**`STAGE0-PASS`**

Stage 0 v1 run `33616688284` is permanently retained as `PRE-FIXTURE-TECHNICAL-ABORT`: it stopped during prereg JSON parsing before any synthetic fixture execution. It generated/read no G3-04 fresh scientific evidence and accessed neither Stage 1/2 seed block nor the protected depth-10 holdout.

A syntax-only correction produced corrected prereg blob:

`3742a0b9ddbcf9c7b3534d22adb0e06d859410bf`

No scientific contract field, endpoint, population, seed range, horizon, gate, resource ceiling, or interpretation boundary changed.

## Authorized v2 execution

Authorization:

`doc/structural-forcing-corridor-decision-funnel/authorizations/STAGE_0_TECHNICAL_AUTHORIZATION_V2.json`

GitHub Actions:

```text
run = 33620251552
head = 3d9be40db559666e7e7c62fd69d98fa8c7d74419
conclusion = success
artifact = 9842597981
artifact name = sfcdf-stage0-technical-v2
artifact ZIP SHA-256 = 028ad7e5034cc4954003b081ca6f0c7ac2bc44a97db0f397fe78ea65f21b7021
```

Canonical deterministic core:

`14e7640dcd302c402c21a5acbe44bcbf004956670f467763faf7c301e545a295`

## Mandatory technical checks passed

- corrected prereg/source blob binding;
- production / independent endpoint canonical-content agreement;
- deliberate ordinary-object versus null-prototype endpoint-map control;
- canonical equality remained exact despite prototype-sensitive `util.isDeepStrictEqual` being false;
- corridor-only and funnel-only semantic separation controls;
- zero-denominator / undefined endpoint handling;
- exact rational endpoint arithmetic;
- Stage 1 development promotion boundary fixture;
- production/independent static import separation;
- `combinedClassDefined=false`;
- fresh scientific seed access = false;
- Stage 1 seed access = false;
- Stage 2 seed access = false;
- protected depth-10 access = false.

## Consequence

Stage 0 PASS does **not** authorize Stage 1.

Before Stage 1 authorization, SFCDF-STUDY1 still requires a non-scientific control-plane smoke that exercises the actual scientific trigger/lease/durability/equality path without reading Stage 1/2 seeds, followed by a separate Stage 1 authorization review.
