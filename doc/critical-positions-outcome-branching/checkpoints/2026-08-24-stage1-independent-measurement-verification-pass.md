# Stage 1 independent measurement verification — PASS

Date: 2026-08-24

Study: **Critical Positions / Outcome Branching Study 1**  
Stage: `CPOB-S1-EXPLORATORY-2026-08-23-v1`

## Gate result

The mandatory independent full measurement verification has passed.

```text
schemaVersion = 1
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
specSha256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
passed = true
rootsReselectedIndependently = 600
fullContinuationRemeasurement = true
fullSecondaryRecomputation = true
fullStructuralRecomputation = true
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
primaryEstimableNamuaRoots = 300
primaryEstimableMtajiRoots = 300
```

All frozen measurement gates were independently reproduced:

```text
measuredExactRootMoveInterventions = PASS
primaryEstimableRoots = PASS
primaryEstimableNamuaRoots = PASS
primaryEstimableMtajiRoots = PASS
finiteD2D3CandidateTables = PASS
```

## Scientific consequence

This closes the mandatory measurement-verification firewall for Stage 1 v1. The frozen deterministic exploratory discovery phase is now permitted.

This does **not** authorize confirmatory inference. Stage 1 remains exploratory only:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

Stage 2 remains locked and the reserved `22700001..22706144` source-game block remains unconsumed.

## No-rescue boundary

No root replacement, source-seed extension, replicate extension, continuation-policy substitution, continuation-cap change, threshold retuning, phase reassignment, favorable-subgroup rescue, or manual candidate promotion is authorized.

The next scientific operation is exactly:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase discover
```

Discovery must use the already frozen grammar, support/diversity thresholds, support-equivalence handling, deterministic ranking, and candidate caps. Zero promoted candidates is a valid Stage 1 result.
