# RCPR-STUDY1 — Stage 0 Technical Acceptance

Date: 2026-08-28  
Stage: `RCPR-S0-TECHNICAL-2026-08-28-v1`  
Decision: **STAGE0-TECHNICAL-PASS**

## Frozen execution

```text
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
job = 98876051308
artifact = 9688987798
artifact name = rcpr-stage0-technical-v1
artifact ZIP SHA256 = 442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269
artifact size = 62144 bytes
```

## Technical result

```text
fixtures = 6
Namua = 3
Mtaji = 3
candidate feature families = 8
numeric scalar features = 310
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
production/independent exact representation agreement = true
RAW identity production/independent agreement = true
all mandatory positive controls = PASS
all mandatory negative controls = PASS
```

Resource characterization:

```text
maximum production extraction = 41.59041 ms / fixture
maximum independent extraction = 39.570791 ms / fixture
peak RSS = 71020544 bytes
```

Hashes:

```text
Stage 0 spec SHA256 = 158e41761677aa23df4051a579f48358847a0c00cc7ca16f467349a97f4d1fa1
production result core SHA256 = e0dc26d16aade006c8ff472c672472a4fd5e8e702c51aa94c231ebb07ce2215d
independent verification core SHA256 = 4acc64c2d4edec4ce8d8d65e2355f3a8f7448db9eb761233f6343b91aba89668
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

All eight prospectively declared families are technically eligible to be considered under a separately frozen Stage 1 development procedure. This does **not** mean that all eight must or will be retained in the final representation.

## Scientific boundary

Stage 0 generated no decision-criticality outcome and did not read historical CPOB Stage 1 scientific payloads. `scientificInferenceAuthorized = false` throughout.

Stage 1 remains `NOT-AUTHORIZED-NOT-EXECUTED` until a fresh development specification, source seed block, population rule, continuation measurement instrument and development/model-selection procedure are prospectively frozen and explicitly authorized.
