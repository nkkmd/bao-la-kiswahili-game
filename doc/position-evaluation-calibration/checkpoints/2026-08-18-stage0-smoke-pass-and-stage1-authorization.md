# Checkpoint — Stage 0 Smoke PASS / Stage 1 Authorization

Date: 2026-08-18
Study: Position Evaluation / Win-Rate Calibration Study 1

## Technical validation result

Returned artifact:

```text
smokeId = PEC-S0-SMOKE-2026-08-18-v1
smoke artifact SHA-256 = 11172d1a31d5716b40a5dd8d4cf092d0e7d6142c6b2299d30e6591e305d007f8
validated source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
passed = true
sourceTreeDirty = false
deterministicReplay = true
staticPerspectiveAntisymmetry = true
games = 8
uniqueHistoricalTrajectories = 8
selectedStates = 8
selectedNamua = 6
selectedMtaji = 2
scientificGeneration = false
scientificInferenceAuthorized = false
authorizationFilePresentDuringSmoke = false
generationAuthorizedBySpecAlone = false
```

The smoke was technical/non-scientific. Its states are permanently excluded from Stage 1 evidence.

## Authorization decision

Stage 0 technical validation is accepted as PASS.

A separate authorization artifact was committed at:

```text
e4323705087c854650097c7d3789ef1371f7a489
```

The artifact binds:

- exact Stage 1 spec SHA-256;
- exact frozen source-file SHA-256 mapping returned by the passing smoke;
- Stage 1 generation authorization only.

## Scientific boundary after authorization

```text
Stage 1 scientific corpus generation = AUTHORIZED
Stage 1 exploratory analysis before independent verification = NOT AUTHORIZED
Stage 1 confirmatory reuse = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

The next scientific operation is the fixed 1024-game Stage 1 generation followed by outcome-blind selection/measurement and independent verification. No outcome-dependent extension, replacement, model-family addition, threshold change, or prior-study reinterpretation is authorized.
