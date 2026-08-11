# Checkpoint — Exact-Ply Risk-Set PASS / Exposure-Support Extension Frozen

Date: 2026-08-11  
Branch: `research/namua-mtaji-temporal-transition`

## State entering checkpoint

The fresh 192-game Stage 1 pilot was technically complete, but only one unique Namua CBE trajectory-ply unit was available after trajectory deduplication.

The inherited Stage 6 comparator family had no deterministic-progression overlap, so an outcome-blind exact-ply risk-set audit was prespecified before further generation.

## Risk-set result

The exact-ply support audit passed.

Observed unique CBE exposure:

```text
historicalTrajectoryHash = f74b37cbb627b3d5e290667c5fb22aa6ede828a86525c56faf45f9abe6689cbb
candidatePly = 33
landmarkPly = 41
conditions = P2-D2, V2-D2
raw condition rows = 2
unique exposure units = 1
```

For both P2-D2 and V2-D2:

```text
R0 = 31 unique controls
R1 = 31
R2 = 31
R3 = 31
```

Thus strict same-condition exact-ply risk-set support is available and does not collapse under non-Category-A, forced-capture-matched, no-Namua-CBE restrictions.

No morphology-label contrast was used to select these families.

## Duplicate structure

P2-D2/V2-D2 share many complete historical trajectories.

Within the R3 controls:

```text
62 condition rows
48 unique historical trajectories
14 trajectories shared across P2-D2 and V2-D2
```

Therefore condition rows with identical full trajectories cannot be treated as independent formal evidence.

## Design consequence

Comparator scarcity is no longer the blocking issue.

The blocking issue is exposure scarcity:

```text
unique Namua CBE trajectory-ply units = 1
```

Stage 2 design freeze remains unauthorized.

## Exposure-support extension freeze

Before any additional game generation, a fixed extension was documented:

```text
conditions = P2-D2 + V2-D2
paired opening replicates = 384
total games = 768
seeds = 20272001..20272384
opening plies = 8
max ply = 100
```

The extension is permanently exploratory and cannot enter the formal corpus.

No early stopping based on CBE count or morphology is permitted.

Stage 2 design-readiness minimum is fixed as a feasibility threshold:

```text
>= 10 unique CBE historicalTrajectoryHash+candidatePly units
>= 8 unique CBE-bearing historical trajectories
```

This is not a significance or confirmation rule.

## Morphology boundary

Before Stage 2 comparator/design freeze, the extension may not be used to inspect CBE-versus-control MTAJI-M1/M2 contrast.

Allowed outputs are exposure availability, localization, multiplicity, deterministic-clock support, comparator availability, and overall classifier technical feasibility only.

## Next step

Run the local extension according to:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RUNBOOK.md
```

Return the extension manifest, verification, clock audit, inherited candidate audit, event support table/audit, and combined exposure-support audit.

## Pause point

> **Exact-ply risk-set comparator feasibility has passed. Stage 2 remains blocked only because independent CBE exposure is too sparse. A fixed 384-paired-opening P2-D2/V2-D2 exploratory extension is now frozen before generation to measure exposure support without inspecting morphology effects.**
