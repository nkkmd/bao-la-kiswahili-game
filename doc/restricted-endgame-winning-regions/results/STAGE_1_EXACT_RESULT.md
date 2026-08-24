# Stage 1 Exact Result — Restricted Endgame / Winning Regions Study 1

Date: 2026-08-24  
Stage ID: `REWR-S1-EXACT-2026-08-24-v1`  
Formal decision: **`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`**

## Frozen graph

```text
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
max move microsteps = 10
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
```

## Exact classification

```text
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
```

## Root value

```text
player to move = Player 0
status = WIN
absoluteWinner = Player 0
DTF = 3
optimalMoveSet = { capture:mtaji:1:4:left:::false }
```

## Nonterminal solved states

| stateKey | player | value | absolute winner | DTF | optimal move set |
| --- | ---: | --- | ---: | ---: | --- |
| `fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33` | 0 | WIN | 0 | 3 | `capture:mtaji:1:4:left:::false` |
| `6de4c58523ec71d1365d3dcb2f834c98ffb762c3562bfb4beea538e872a02d67` | 1 | LOSS | 0 | 2 | `takata:mtaji:1:0:left:::false`; `takata:mtaji:1:0:right:::false` |
| `8d9b1aafa1fd0dd718baad3de67e8c768fcf5cd37a065968bd640febc8f3659b` | 0 | WIN | 0 | 1 | `capture:mtaji:0:3:right:::false`; `capture:mtaji:1:0:left:::false` |
| `e9fbd5d69ab24f88e307d36c74cc85b2042fe066fc49d84e305d37d615ac996f` | 0 | WIN | 0 | 1 | `capture:mtaji:0:3:right:::false`; `capture:mtaji:1:0:left:::false` |

The other four states are terminal with `absoluteWinner=0`, `DTF=0`.

## Independent verification

```text
rootKeys = true
stateCount = true
edgeCount = true
stateSetSha256 = true
transitionSetSha256 = true
counts = true
fullStateRows = true
recurrentSccs = true
solutionSha256 = true
passed = true
exactClaimAuthorized = true
```

Hashes:

```text
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
productionResultSha256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
verificationResultSha256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
```

Full state records are canonicalized in `STAGE_1_EXACT_RESULT.json`.

## Claim boundary

Exact only within `REWR-S1-DOMAIN-2026-08-24-v1`. This result does not solve full Bao, all Mtaji, or all endgames and does not establish the absence of cycles outside the frozen domain.
