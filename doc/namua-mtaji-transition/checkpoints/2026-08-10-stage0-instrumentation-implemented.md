# Checkpoint — Stage 0 instrumentation implemented

Date: 2026-08-10  
Study: **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

## State

Stage 0のtechnical instrumentationをrepository上へ実装した。

現時点では**local validation pending**であり、Stage 0 scientific/technical resultはまだ確定していない。

新しいscientific corpus、exploratory pilot、formal held-out corpusはいずれも生成していない。

## Added implementation

```text
schemas/namua-mtaji-transition-observation.schema.json
schemas/namua-mtaji-transition-game.schema.json

tools/experiments/lib/namua-mtaji-transition-features.js
tools/experiments/run-namua-mtaji-transition-smoke.js
tools/experiments/verify-namua-mtaji-transition-smoke.js
tools/experiments/audit-namua-mtaji-mtaji-artifact.py

test/namua-mtaji-transition-features.test.js
test/namua-mtaji-transition-engine.test.js

doc/namua-mtaji-transition/STAGE_0_RUNBOOK.md
```

## Scientific boundaries preserved

No closed-study source definition was modified.

### Phase-transition Study 1

The new adapter calls the existing `forced-capture-regimes.js` classifier with the fixed settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Classifier precedence is inherited from the closed module and not rewritten.

### Position-typology Study 1

The new code reuses `extractPositionTypologyObservation()` without modifying its representation.

The confirmed Mtaji classifier is not reconstructed from the smoke corpus. A dedicated audit requires the historical frozen artifact whose canonical hash is:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

No scaler refit, centroid refit, or relabel is permitted.

## New-study technical representation

The Stage 0 smoke stores the existing position-typology observation shape and derives temporal quantities at game/event level.

Game-level outcome explicitly separates:

```text
first Mtaji
a natural terminal before first Mtaji
administrative max-ply truncation
```

The verifier independently recomputes the old phase-transition observation at every replayed state and requires compatibility for:

```text
phase
reserve / houseOwned / pending
historical state hash
legal move count
capture move count
forced-capture state
board/non-empty seed summaries
front-row occupancy and seed counts
```

This prevents a new-study schema adapter from silently changing the inherited phenotype inputs.

## Ascertainment boundary retained

The new helper records the frozen classifier look-ahead boundary:

```text
classificationLookAheadPly = candidatePly + 8
```

This is technical provenance only. It does not yet choose a formal survival time origin.

The primary time origin remains **unfrozen** pending Stage 1 feasibility/pilot work.

## Local validation required

Follow:

```text
doc/namua-mtaji-transition/STAGE_0_RUNBOOK.md
```

Required outputs:

```text
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/manifest.json
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/verification.json
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/mtaji-artifact-audit.json
```

## Pause point

> Stage 0 instrumentation implementation complete in GitHub; local unit/regression tests, technical smoke, full replay verification, and frozen Mtaji artifact audit remain required before Stage 0 can be declared complete.

No formal endpoint, comparator, statistical model, seed block, or confirmation threshold has been frozen.
