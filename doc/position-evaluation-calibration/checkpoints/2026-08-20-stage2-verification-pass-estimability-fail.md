# Checkpoint — Stage 2 verification PASS / estimability FAIL

Date: 2026-08-20
Study: Position Evaluation / Win-Rate Calibration Study 1
Stage: `PEC-S2-FORMAL-2026-08-20-v1`

## Returned artifacts

```text
generation-manifest SHA-256 = 1b5aae5333bc9b02a36fc72cbaf2514a303f9bfd5fae97ceb0ad530d4828e71b
stage2-selection-measurement-summary SHA-256 = 575caef5058cb3d04209708b7e04f0f09381f7beea6d41706624cb73534f1b51
verification SHA-256 = 10790c52ec15bf89dfd301942d91424504bf5bf2afd7230182382d33134515ff
measurementHash = 373d780504814999466c3bc822a17b048054e8079b1c000e903a503cac9d1a33
```

Generation identity:

```text
games = 2048
seeds = 22300001..22302048
source commit = a6f36a7cb86eab38897372680acd7eadc6f3436b
sourceTreeDirty = false
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
```

## Independent verification

```text
passed = true
gamesVerified = 2048
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
stage1HistoricalTrajectoryOverlap = 0
stage1OpeningPrefixOverlap = 0
stage1RuleStateOverlap = 0
```

The formal corpus is therefore technically reproducible and the final selected-state set respects all cross-stage identity firewalls.

## Selection accounting

```text
unique historical trajectories before Stage 1 firewall = 1618
Stage 1 trajectory overlaps excluded = 235
Stage 1 opening-prefix overlaps excluded = 0
unique historical trajectories after trajectory/opening firewall = 1383
Stage 1 rule-state observations excluded = 1199
provisional selected states = 1292
unavailable assigned phase = 91
duplicate selected rule states collapsed = 2
final selected unique rule states = 1290
Namua = 663
Mtaji = 627
```

No replacement occurred and none is authorized.

## Frozen readiness decision

Passed gates include:

```text
Namua selected states = 663 >= 650
distinct opening prefixes = 1290 >= 400
distinct static evaluations = 440 Namua / 534 Mtaji >= 100 each
Namua wins/losses = 324 / 339 >= 150 each
Mtaji wins/losses = 336 / 291 >= 150 each
administrative truncation = 0 <= 1%
all final Stage 1 overlap counts = 0
independent verification = PASS
```

Failed gates:

```text
unique historical trajectories after Stage 1 firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

Therefore the preregistered Stage 2 formal rule forces:

```text
formal decision = INCONCLUSIVE
formal performance criteria eligible = false
paired bootstrap eligible = false
```

This is an estimability failure, not evidence that the frozen calibration mapping is either confirmed or not confirmed.

## No-rescue boundary

The following remain forbidden:

- additional Stage 2 games;
- seed extension;
- replacement for Stage 1 overlap exclusions;
- replacement for unavailable assigned phase;
- threshold relaxation;
- selected-map refit or smoothing;
- reinterpretation of the failed gate as a performance failure.

The frozen formal evaluator may be run once only to materialize the canonical `stage2-formal-result.json`. Under the frozen code it must retain `formalDecision = INCONCLUSIVE`, with bootstrap and primary pass/fail criteria suppressed because readiness is false. Descriptive metrics cannot rescue or alter that decision.
