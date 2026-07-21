# Phase-transition pilot v2

## Purpose

The original 100-game `pilot` run remains an immutable audit record. Three games ended during or immediately after the six-ply random opening with `front-empty`. The `pilot-v2` profile prevents opening-only terminal accidents from entering the corrected sample.

## Opening acceptance rule

Game 0 remains the deterministic standard-opening baseline. For every later game, the runner generates a six-ply seeded legal opening and accepts it only when all conditions hold after ply 6:

- `winner === null`
- at least one legal move exists
- each player has at least one occupied front-row pit

Rejected candidates are regenerated deterministically, up to 100 attempts per game.

## Audit metadata

Each game records:

- `openingAttempt`
- `openingSeed`
- `openingRejectedCount`
- `openingRejectionReasons`

The manifest records aggregate `openingQuality` values:

- `rejectedOpenings`
- `gamesWithRetries`
- `maximumAttempt`
- `rejectionReasons`
- `acceptedEarlyTerminalCount`

## Run

```bash
node tools/experiments/run-phase-transition-research.js --profile pilot-v2
```

Output:

```text
artifacts/phase-transition/pilot-v2/
```

## Progress and resume

```bash
node tools/experiments/run-phase-transition-research.js \
  --profile pilot-v2 \
  --status
```

Run the normal command again to resume. Completed per-game files are reused only when the configuration hash matches.

## Verify

```bash
node tools/experiments/verify-phase-transition-artifacts.js \
  --input artifacts/phase-transition/pilot-v2
```

## Comparison policy

Do not overwrite or reinterpret `artifacts/phase-transition/pilot/`. Treat it as `pilot-v1`, including its three opening-terminal games. Compare `pilot-v1` and `pilot-v2` explicitly when reporting the effect of opening validation.
