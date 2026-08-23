# CPOB Study 1 — Stage 1 measurement readiness PASS / independent remeasurement pending

Date: 2026-08-24

Study: Critical Positions / Outcome Branching Study 1

Stage ID: `CPOB-S1-EXPLORATORY-2026-08-23-v1`

## Status

The frozen Stage 1 continuation / secondary-search / structural measurement phase has completed its local measurement pass and the compact `measurement-audit.json` reports **PASS**.

This checkpoint does **not** authorize deterministic discovery yet. Mandatory independent full continuation remeasurement/recomputation remains pending.

## Frozen identity

```text
specSha256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
selectedRoots = 600
```

## Measurement audit

```text
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
primaryEstimableNamuaRoots = 300
primaryEstimableMtajiRoots = 300
```

Frozen readiness gates:

```text
measuredExactRootMoveInterventions = PASS
primaryEstimableRoots = PASS
primaryEstimableNamuaRoots = PASS
primaryEstimableMtajiRoots = PASS
finiteD2D3CandidateTables = PASS
overall measurement readiness = PASS
```

No-rescue audit:

```text
replacementPerformed = false
replicateExtensionPerformed = false
continuationPolicySubstitutionPerformed = false
```

The measured root population therefore satisfies the preregistered Stage 1 measurement-readiness conditions without replacement, replicate extension, continuation-policy substitution, or favorable-subset rescue.

## Interpretation boundary

The measurement outputs contain exploratory scientific continuation outcomes, but they are not yet accepted for discovery until the independent verifier fully reselects the roots, reruns every stored continuation path, recomputes D2/D3 and structural branches, and reproduces the measurement results.

The following remain unchanged:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

No game-theoretic criticality, validated win-probability, human/expert criticality, or confirmatory claim is authorized.

## Next mandatory gate

Run exactly:

```bash
node tools/experiments/verify-critical-positions-stage1-exploratory.js \
  --phase measurement \
  --output artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1
```

Expected compact artifact:

```text
measurement-verification.json
```

Deterministic `discover` remains blocked until this independent measurement verification passes. No replacement, replicate extension, policy substitution, threshold retuning, seed extension, or phase reassignment is permitted.
