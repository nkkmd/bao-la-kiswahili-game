# TECHNICAL_SEMANTICS_AUDIT — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20  
Status: **DESIGN AUDIT COMPLETE / EXECUTABLE TECHNICAL SMOKE PENDING**

Baseline source commit:

```text
b1cc7047504b73c5a848e866f795c26a64250d13
```

This document records repository-level semantic findings before any new scientific corpus is generated.

## 1. Engine move semantics

Authoritative move enumeration:

```text
E.moveVariants(state)
```

`moveVariants` expands Namua capturing moves into distinct house-choice variants when `stop` and `use` produce distinct states.

Exact research move identity must therefore use:

```text
AI.moveKey(move)
```

which includes:

```text
type
phase
row
index
direction
side
houseChoice
houseTwo
```

Do not collapse exact house-choice variants when the engine exposes distinct outcomes.

## 2. Engine transition semantics

Authoritative transition:

```text
E.applyMove(state, move)
```

The returned event stream contains engine-native transition events such as reserve, lift, sow, capture, relay, phase, win, limit and turn.

Existing tactical-motif tooling derives structural transition summaries and immediate opponent reply envelopes from this event/state output. There is no engine-native `relayEndpoint` field; any endpoint/landing quantity must remain explicitly derived.

## 3. Static evaluator semantics

Default profile:

```text
evaluationProfile = bao
```

The default evaluator is actor/player-relative. Terminal static evaluation uses magnitude `WIN = 1,000,000`.

The `bao` weights are phase-specific (`namua` and `mtaji`). Static score therefore must not be treated as a probability or pooled across phases without an explicit role in the analysis.

For static post-move misvaluation, the comparison perspective must remain the original root actor.

## 4. Exact root search diagnostic

Existing validated instrumentation:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
```

Search semantics identifier:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
```

`analyzeRootCandidates(state, depth, options)`:

- enumerates all exact legal root `E.moveVariants`;
- applies each root move;
- searches the resulting state using full-window alpha-beta semantics;
- evaluates every candidate from `player = state.player` at the root;
- returns exact tie-aware top set, score rank, best score, second-best score and per-candidate counters;
- does not mutate the source state.

Default diagnostic options include:

```text
evaluationProfile = bao
quiescenceDepth = 1
orderQuiescenceCaptures = false
```

## 5. Terminal and mate-distance semantics

Search terminal score:

```text
root actor win  => +1,000,000 - ply
root actor loss => -1,000,000 + ply
```

Score classes already distinguish:

```text
root-win-mate-domain
ordinary-evaluation-domain
root-loss-mate-domain
```

Consequences for regret:

1. raw `bestScore - candidateScore` may be stored for reproducibility;
2. same ordinary-domain numeric regret may be interpreted as an evaluator-scale decision loss under the frozen search;
3. same mate-domain differences encode mate/termination distance effects;
4. cross-domain differences must be represented categorically as a domain drop and not averaged indiscriminately with ordinary evaluator-point regret.

Proposed domain-loss ordering for audit:

```text
win-mate > ordinary > loss-mate
```

Exact ordinal/categorical encoding will be fixture-tested before Stage 1 authorization.

## 6. Ties and ranking

Existing diagnostic defines:

```text
TopSet = all candidates whose score == bestScore
scoreRank = 1 + number of candidates with strictly higher score
```

Therefore tied best moves all have rank 1 and regret 0.

Working normalized rank loss for roots with at least two legal moves:

```text
normalizedRankLoss = (scoreRank - 1) / (legalMoveCount - 1)
```

This is a secondary rank construct, not a replacement for the D3 reference score/domain construct.

## 7. Primary and comparator depth semantics

Frozen design choice before scientific data:

```text
primary reference = D3 + quiescenceDepth 1
shallow comparator = D2 + quiescenceDepth 1
additional shallow diagnostic = D1 + quiescenceDepth 1
D4 = technical/robustness subset candidate only
```

D3 is selected prospectively because the exact diagnostic supports it and Tactical Motifs Study 1 already used D3 as a large-scale formal root-value operationalization. This does not import Tactical Motifs scientific conclusions into this Study.

A technical failure before Stage 1 generation may justify a versioned amendment. Stage 1/2 outcomes may not justify switching primary depth.

## 8. Structural/reply instrumentation

Reusable existing instrumentation:

```text
tools/experiments/lib/tactical-motif-features.js
tools/experiments/lib/position-typology-features.js
```

Available actor-relative quantities include:

- reserve / nyumba / board/front/back seeds
- occupied/reusable pits
- front occupancy/connections
- legal/capture move counts
- max capturable seeds and relay/capture chain measures
- house ownership
- pit variance / seed concentration
- immediate event summaries
- exact immediate reply set
- forced reply indicator
- all-immediate-reply response envelope

## 9. Principal-variation boundary

The current exact root diagnostic does **not** expose a search-consistent principal variation.

A line produced by independently re-searching successive states may not be labeled the original D3 search PV.

This Study will use exact root values plus bounded response-set / reply-envelope summaries unless a separate PV tracer is prospectively implemented and fixture-validated before scientific generation.

## 10. Identity semantics

Existing identity foundation distinguishes:

```text
historicalStateHash
ruleStateKey
seatCanonicalKey
historicalTrajectoryHash
openingPrefixHash
```

`ruleStateKey` is based on exact rule-relevant state fields including pits, reserve, house ownership, player, phase, winner and pending state.

Stage 1 support and Stage 2 inference must remain trajectory-aware. Nearby states within one trajectory cannot create nominal independent replication.

## 11. Required executable Stage 0 smoke gates

Before any Stage 1 authorization, implement/execute technical tests for at least:

1. exact moveVariant exhaustiveness and moveKey uniqueness;
2. root-actor perspective and sign consistency;
3. D3+Q1 determinism;
4. tie handling;
5. terminal win/loss and mate-distance ordering;
6. domain-aware regret encoding;
7. static post-move root-actor evaluation;
8. structural/reply non-mutation;
9. identity key reproducibility;
10. source-file hash binding;
11. D3 compute feasibility on representative non-scientific fixtures;
12. optional D4 feasibility without using scientific outcomes.

Until all required gates pass and a Stage 1 spec plus explicit authorization exist:

```text
scientific generation authorized = false
```
