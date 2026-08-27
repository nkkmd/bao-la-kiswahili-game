# PEOCR-STUDY1 — Current Status

更新日: 2026-08-27

## Status

**STUDY ACTIVE / STAGE 0 PASS / STAGE 1 MODEL-FROZEN-DEVELOPMENT / STAGE 2 AUTHORIZED AND FORMAL GENERATION IN PROGRESS**

## Identity

```text
Program = G2-01
Study ID = PEOCR-STUDY1
Research Generation = Research Generation 2
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Branch = research/g2-01-position-evaluation-empirical-outcome-calibration-replication
```

## Completed scientific prerequisites

- Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE` remains immutable.
- Stage 0 technical validation: `STAGE0-TECHNICAL-PASS`.
- Stage 1 complete fresh development population: 2,048/2,048 games.
- Stage 1 independent replay: 2,048/2,048, zero replay/measurement mismatch.
- All Stage 1 readiness gates passed.
- Stage 1 decision: `MODEL-FROZEN-DEVELOPMENT`.
- Frozen PAVA mapping SHA-256: `b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac`.
- Stage 1 reference-universe SHA-256: `5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063`.
- Stage 2 technical smoke `PEOCR-S2-SMOKE-2026-08-27-v1`: production PASS and independent verification PASS.
- Stage 2 technical smoke used no Stage 2 scientific seed and performed no formal inference.
- Stage 2 source-bound authorization frozen at commit `5d1b4a40ef95ac639787aa0abf040a455c3c2995`.

## Stage 2 frozen execution

```text
workflow run = 33038132423
games = 8192
seeds = 24020001..24028192
execution partition = 8 contiguous shards x 1024 games
shard-level independent replay = required
all shards required before selection = true
seed extension = forbidden
identity-overlap replacement = forbidden
Stage 2 refit = forbidden
```

All eight shard jobs passed their source-bound contract/authorization audit and entered fixed scientific generation.

After all eight shards complete and independently replay with zero mismatch, the workflow will merge exactly one game for each global index `0..8191`, apply the outcome-blind Stage 1 trajectory/opening/RAW-state firewall, perform deterministic state selection/measurement, independently verify the selection and zero cross-stage overlap, and only then run the frozen formal evaluator.

## Authorization state

```text
Stage 0 technical execution = COMPLETE / PASS
Stage 1 scientific development generation = COMPLETE
Stage 1 formal calibration confirmation = NOT CLAIMED (development stage)
Stage 2 scientific generation = AUTHORIZED / IN PROGRESS
Stage 2 frozen formal evaluation = AUTHORIZED after verification/gates
Stage 2 formal decision = NOT YET MADE
```

## Interpretation boundary

Current Stage 2 authorization concerns held-out empirical continuation-outcome calibration only. It does not authorize game-theoretic, human-perception, causal, public-AI-quality, or Research Generation 1 decision-revision claims.
