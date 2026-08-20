# Position Evaluation / Win-Rate Calibration Study 1 — Stage 2 Formal Result

更新日: 2026-08-20  
Status: **FORMAL INCONCLUSIVE / ESTIMABILITY GATE FAILURE**

## Identity

```text
studyId = PEC-STUDY1
stageId = PEC-S2-FORMAL-2026-08-20-v1
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
canonical local result SHA-256 = 94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
```

## Formal population

```text
games = 2048
seeds = 22300001..22302048
source commit = a6f36a7cb86eab38897372680acd7eadc6f3436b
sourceTreeDirty = false
```

Independent verification:

```text
passed = true
gamesVerified = 2048
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
measurementHash = 373d780504814999466c3bc822a17b048054e8079b1c000e903a503cac9d1a33
```

Final Stage 1 overlap:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

## Estimability gates

Three preregistered gates failed:

```text
unique historical trajectories after Stage 1 firewall
  1383 < 1600

selected unique rule states
  1290 < 1500

Mtaji selected states
  627 < 650
```

Other key counts:

```text
unique trajectories before Stage 1 firewall = 1618
Stage 1 trajectory overlaps excluded = 235
provisional selected states = 1292
unavailable assigned phase = 91
duplicate selected rule states collapsed = 2
Namua selected states = 663
administrative truncation = 0
```

## Frozen decision rule

```text
any estimability / identity gate fails -> INCONCLUSIVE
all gates pass but any primary criterion fails -> NOT-CONFIRMED
all gates and all primary criteria pass -> CONFIRMED
```

Therefore:

```text
FORMAL DECISION = INCONCLUSIVE
bootstrap = null
primary criteria = null
```

The Stage 2 formal question was not estimable under the frozen minimum-support conditions. This is not a confirmed calibration failure and not a confirmed calibration success.

## Descriptive-only values

The canonical evaluator records the following after the gate decision:

```text
n = 1290
frozen model Brier = 0.15550141283724248
frozen phase-only reference Brier = 0.2510612273133199
observed paired Brier skill = +0.09555981447607745
pooled calibration bias = -0.04426561163702176
pooled ECE = 0.05214158062926888
```

Phase-specific:

```text
Namua:
  n = 663
  model Brier = 0.22678074548187638
  raw-static AUC = 0.708638333515423

Mtaji:
  n = 627
  model Brier = 0.08012948693071474
  raw-static AUC = 0.9603788250695467
```

These Brier values are below the preregistered absolute thresholds, but those criteria were never formally reached because estimability failed first. They cannot be used to relabel the result.

Exact unclipped log loss was non-finite because there were 7 boundary contradictions in the frozen isotonic probabilities.

## Interpretation boundary

Supported:

- technically valid fresh Stage 2 corpus;
- independent replay/measurement verification;
- zero final Stage 1 identity overlap;
- formal closure as `INCONCLUSIVE` due to preregistered support gates.

Not supported:

- formally validated calibration;
- formally rejected calibration;
- game-theoretic win probability;
- human advantage perception;
- causal interpretation;
- generalization outside the frozen population/evaluator/policy;
- revision of prior-study decisions.

## No rescue

Study 1 does not add games, extend seeds, replace excluded identities, lower readiness gates, refit the Stage 1 mapping, or promote descriptive Brier values into a formal result.

Any future re-evaluation must be a new prospective study with fresh data and a newly frozen design.
