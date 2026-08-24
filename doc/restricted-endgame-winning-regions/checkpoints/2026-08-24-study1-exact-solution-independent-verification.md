# 2026-08-24 — Study 1 exact solution and independent verification

Study: `REWR-STUDY1`  
Stage: `REWR-S1-EXACT-2026-08-24-v1`  
Decision: **`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`**

## Frozen domain

```text
domainId = REWR-S1-DOMAIN-2026-08-24-v1
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
```

## Pre-generation firewall

The initial authorization was revoked before any scientific outcome after a field-name mismatch was found between the frozen resource-limit spec and the two runners. Only that field reference was corrected. Domain, classification, DTF and endpoint were unchanged. Technical fixtures re-passed, source hashes were re-frozen, and authorization v2 was issued.

```text
specSha256 = ec20df4621b7d8e50fd979bee4681c7eadb5bf2138c14911cb6ab97acd0738cc
authorizationSha256 = d3fe788e95606c6641ad4c33a396a2c02b21138b9b80bef2522f85cd124f282c
scientific outcomes before correction = none
```

## Scientific result

```text
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Frozen root:

```text
Player 0 to move
WIN
absoluteWinner = 0
DTF = 3
unique optimal move = capture:mtaji:1:4:left:::false
```

## Independent verification

Workflow run: `32702596730`

Full equality passed for root keys, complete state/edge counts, state/transition hashes, classification counts, all state-level rows, recurrent SCCs, and solution SHA-256.

```text
productionResultSha256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
verificationResultSha256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
exactClaimAuthorized = true
```

## Immutable boundary

The exact claim is limited to this frozen restricted domain. No full-Bao, all-Mtaji, all-endgame, no-cycle, symmetry, or engine-evaluation claim is authorized.

Study 1 scientific outcome generation is consumed. No domain retuning or additional Stage 0 cap expansion is authorized.
