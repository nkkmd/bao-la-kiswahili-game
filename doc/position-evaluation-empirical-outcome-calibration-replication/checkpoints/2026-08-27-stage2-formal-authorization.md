# PEOCR-STUDY1 — Stage 2 Formal Authorization

Date: 2026-08-27
Status: **STAGE 2 SCIENTIFIC GENERATION AND FROZEN FORMAL EVALUATION AUTHORIZED**

## Authorization basis

Stage 2 technical validation completed before any Stage 2 scientific seed was used.

```text
smoke ID = PEOCR-S2-SMOKE-2026-08-27-v1
workflow run = 33037897038
production smoke = PASS
independent smoke verification = PASS
scientific generation during smoke = false
formal inference during smoke = false
```

Canonical technical evidence:

```text
STAGE_2_TECHNICAL_SMOKE_RESULT.json SHA-256 = f2cf9b0bc0b091611e88871d8399a340e579c84f4b4143feaf85e266c0bc491e
STAGE_2_TECHNICAL_SMOKE_VERIFICATION.json SHA-256 = 1d5d9cba6869939d35156fa03069e9cf4490de8f291421d797d1545be82a5d6b
Stage 1 frozen mapping SHA-256 = b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac
Stage 1 reference universe SHA-256 = 5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063
Stage 2 spec SHA-256 = 6ef20e20f639797c3d98673980e6e4b2c4c63a522e0c052ce523f6132a94ea60
```

The smoke was executed at commit `8b088e50c89b07f4ff16ecfd0e4683614a89e13d`. A Git compare to the authorization basis commit `d392c26172c681f1bb7595bff0ad778f344031d5` confirmed that only execution workflows, checkpoints and canonical smoke records changed; no file in the frozen scientific source list changed. The exact source SHA-256 mapping is therefore carried forward unchanged into the authorization record.

## Authorized scientific population

```text
Stage ID = PEOCR-S2-FORMAL-2026-08-26-v1
games = 8192
seeds = 24020001..24028192
```

No seed extension, outcome-dependent extension, overlap replacement, unavailable-phase replacement or duplicate-RAW-state replacement is authorized.

## Frozen execution partition

Execution uses the prospectively fixed eight contiguous 1,024-game shards recorded in `2026-08-27-stage2-execution-sharding-freeze.md`. Sharding is an execution partition only; the scientific population remains the exact preregistered 8,192 games.

Each shard must be independently replayed with zero mismatch. All eight shards must be present before outcome-blind Stage 1 firewall application and state selection. Formal evaluation is executed only after independent selection/measurement verification.

## Frozen formal model and reference

```text
model = exact Stage 1 phase-stratified isotonic PAVA mapping
Stage 2 refit = forbidden
formal clipping = [0.01,0.99]
reference = frozen Stage 1 selected-state actor-win rate by phase
```

## Formal decision contract

The preregistered Stage 2 estimability/identity gates and co-primary Brier-skill/log-loss-skill criteria remain unchanged. The frozen evaluator may return `CONFIRMED`, `NOT-CONFIRMED`, or `INCONCLUSIVE` according to the preregistered decision tree. No result-dependent rescue is authorized.

Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE` remains immutable regardless of the G2-01 result.
