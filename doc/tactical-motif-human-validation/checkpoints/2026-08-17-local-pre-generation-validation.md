# TMHV Stage 1 — Local pre-generation validation

Date: 2026-08-17

Stage: `TMHV-S1-STIMULUS-2026-08-17-v1`

## Local execution identity

User-reported local pre-generation validation was performed from the exact authorized detached commit:

```text
HEAD = 12b02975f0c0e7ad053eef6db8b6a2d2c7392d70
worktree = clean
Node.js = v24.6.0
Git = 2.43.0
```

Node.js 24.6.0 differs from the Node 22.x CI validation runtime, but Node version is not an authorization identity gate in the frozen Stage 1 contract. Runtime version is retained in generated provenance. No source-file or scientific-contract modification is authorized in response to runtime differences.

## Contract validation

`validate-tactical-motif-human-validation-stage1-spec.js`:

```text
passed = true
stageId = TMHV-S1-STIMULUS-2026-08-17-v1
specSha256 = c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80
historicalCandidateDefinitionSha256 = 667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8
humanDataCollectionAuthorized = false
```

## Technical smoke

`tactical-motif-human-validation-stage1.test.js`:

```text
passed = true
historicalCandidate = TM-S2-C03
technicalGamePlies = 9
rendererActorNormalizedToSouth = true
humanDataCollectionAuthorized = false
```

## Source-hash status

The Stage 1 status command reported all frozen source-file SHA-256 values matching the authorization mapping, with:

```text
generatedGames = 0
expectedGames = 1536
hasManifest = false
hasVerification = false
hasStimulusPoolAudit = false
```

## Authorization binding

```text
specSha256 = c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80
authorizationSha256 = d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009
machineStimulusGenerationAuthorized = true
humanDataCollectionAuthorized = false
scientificHumanInferenceAuthorized = false
```

## Decision

**PASS — FIXED MACHINE STIMULUS GENERATION MAY START.**

This checkpoint does not authorize scientific human recruitment, participant responses, Stage 2 inference, corpus extension, source editing, selective regeneration, or threshold rescue.
