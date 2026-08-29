# PCRPR-STUDY1 — Stage 0 Technical Pass

Date: 2026-08-29  
Stage: `PCRPR-S0-TECHNICAL-2026-08-29-v1`  
Decision: **`STAGE0-TECHNICAL-PASS`**

## Canonical execution

```text
source commit = 19c70ba60c8b43858b01a01c5a448311660269c4
workflow run = 33238931893 / success
job = 99064778014 / success
artifact = 9710763348 / pcrpr-stage0-technical-v1
artifact size = 18826 bytes
artifact ZIP SHA256 = 408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b
```

The execution used technical fixture seeds `28700001..28700032`, outside both reserved scientific blocks. No Stage 1 or Stage 2 scientific seed was generated or consumed.

## Production technical result

Production passed all 18 mandatory gates:

```text
rawIdentity = true
seedConservation = true
exactMoveOrdering = true
phaseFixtures = true
all12FamiliesMaterialized = true
finiteFeatureVectors = true
replyPermutationInvariant = true
integerLikeKeyOrderInvariant = true
tiedReplyScoresHandled = true
terminalApplicabilityHandled = true
missingPendingRejected = true
corruptSeedTotalRejected = true
leakageRejected = true
configDriftRejected = true
schemaDriftRejected = true
hashPerturbationDetected = true
rawKeyMismatchDetected = true
resourceProfile = true
```

Technical profile:

```text
fixture rows = 9
phases = Namua + Mtaji
scalar features per row = 80
elapsed = 223.295232 ms
max RSS = 60.91015625 MiB
production.json size = 275840 bytes
production core SHA256 = 792eb081e5ed287b3adca5b6bfa340d7a23747d384483dca60b7c39aacceba37
production file SHA256 = 380f67c70765f3f7dbd08480e5c25f73455a9b59b6c436b2d5d033e875c05b36
```

## Independent exact recomputation

The structurally separate verifier passed all 9 mandatory gates:

```text
rawIdentity = true
exactMoveSets = true
searchTables = true
allFeatureVectorsExact = true
vectorHashesExact = true
independence = true
syntheticNumericControlsExact = true
negativeControlsDetected = true
productionArtifactHashBinding = true
```

It independently recomputed all 9 technical rows and all 80 scalar features per row with exact equality under the frozen binary64 hash contract.

## Numeric hardening result

The G2-06 technical lesson was prospectively addressed without changing the G2-06 decision:

- exact replies are canonicalized by lexical exact move identity before aggregation;
- implicit object/integer-key or encounter order is not a scientific numeric ordering rule;
- arithmetic order is deterministic;
- scalar hash input is IEEE-754 binary64 big-endian hex;
- integer-like keys in adversarial encounter order and reply-list permutations were tested;
- no tolerance or rounding was needed;
- production and independent vector hashes matched exactly.

This validates the PCRPR Stage 0 technical contract only. It does not retroactively make RCPR-STUDY1 valid.

## Frozen source bindings

```text
Stage 0 protocol blob = b633eb40cfdb95de1f546bba951c425da768e8d3
production implementation blob = 84385b79613328fe316a4d54300837efaea4c152
production runner blob = e1d78f922daaad4a3f99567dc03abbf4104a03c0
independent verifier blob = 7b00e2a579ce868a495ad4425f928266a0b4969d
workflow blob = 0a7c83a0c658aba44633d88b7b3b434ebe7b80c3
```

## Scientific boundary after Stage 0

```text
scientificOutcomeGenerated = false
scientificInferenceAuthorized = false
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds 28710001..28713072 = RESERVED / UNCONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
```

`STAGE0-TECHNICAL-PASS` authorizes preparation and pre-execution validation of the Stage 1 scientific contract. It does not itself authorize Stage 1 scientific generation.

Canonical machine-readable record: `../results/STAGE_0_TECHNICAL_RESULT.json`.
