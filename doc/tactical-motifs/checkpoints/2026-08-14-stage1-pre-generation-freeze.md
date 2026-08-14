# Checkpoint — Stage 1 v1 pre-generation freeze

Date: 2026-08-14

Study: Tactical Motifs / Tesuji Study 1

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

## State

**PRE-GENERATION FREEZE COMPLETE; TECHNICAL VALIDATION PENDING; SCIENTIFIC GENERATION BLOCKED.**

No Stage 1 scientific game, selected state, measurement, or candidate result existed when this
freeze was written.

## Frozen spec

Path:

`doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_SPEC.json`

SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

## Frozen population

- games: 768
- seeds: `21900001–21900768`
- max ply: 100
- randomized exact-moveVariant opening: 8 plies
- six fixed generation strata × 128 games
- no early stop
- no extension
- no replacement

## Frozen scientific firewall

- unique historical trajectory is the support unit
- identical historical trajectories collapse before root selection
- one hash-assigned-phase root per representative trajectory
- root must expose at least two exact moveVariants
- duplicate selected rule states collapse without replacement
- all legal moveVariants are measured
- all immediate replies are enumerated into response envelopes
- D1/D2/D3 exact-root values are measurement axes only
- no search-consistent PV is claimed
- opening-prefix concentration is prospectively gated
- Stage 1 candidate promotion is deterministic and capped
- Stage 1 cannot authorize Stage 2

## Prepared implementation

- `tools/experiments/lib/tactical-motif-features.js`
- `tools/experiments/lib/tactical-motif-discovery.js`
- `tools/experiments/validate-tactical-motif-stage1-spec.js`
- `test/tactical-motif-stage1-tooling.test.js`
- `.github/workflows/tactical-motif-stage1-spec.yml`

The scientific corpus runner and independent replay verifier are intentionally **not yet implemented** at this checkpoint. They are the next gate and must implement this frozen contract without changing it.

## Authorization rule

This specification/representation commit must first pass the dedicated pre-generation CI.

After that, the corpus runner and independent verifier must be implemented and separately validated. Only after that later validation may a separate:

`doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`

be committed.

That future authorization must bind the exact spec SHA-256 and the validated scientific implementation/source hashes. No authorization file exists now, and scientific generation remains blocked.

## Interpretation

This checkpoint contains no motif discovery and no scientific result.

The next action is technical validation of this frozen contract, followed by runner/verifier implementation if and only if validation succeeds.
