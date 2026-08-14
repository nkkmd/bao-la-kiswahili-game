# Position Complexity / Difficulty Study — Stage 1 Generation Verification

更新日: 2026-08-12  
Status: **PASS / EXPLORATORY CORPUS GENERATED AND FULLY VERIFIED / SCIENTIFIC INFERENCE NOT YET AUTHORIZED**

## Identity

```text
study = PCX-STUDY1
stage = PCX-S1-EXPLORATORY-2026-08-12-v1
class = exploratory / design development
formal reuse = prohibited
```

Frozen Stage 1 specification:

```text
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
```

Verifier:

```text
tools/experiments/verify-position-complexity-stage1-exploratory.js
```

## Canonical verification output

The following output was produced after the fixed 768-game Stage 1 generation and supplied for repository recording before state selection / D1-D4 measurement:

```json
{
  "schemaVersion": 1,
  "stageId": "PCX-S1-EXPLORATORY-2026-08-12-v1",
  "specSha256": "20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165",
  "passed": true,
  "scientificInferenceAuthorized": false,
  "confirmatoryReuseAllowed": false,
  "gamesVerified": 768,
  "observationsVerified": 43110,
  "movesVerified": 42342,
  "searchMovesRecomputed": 36211,
  "fullSearchRecomputation": true,
  "uniqueHistoricalTrajectories": 685,
  "duplicateHistoricalTrajectoryGroups": 61,
  "largestHistoricalTrajectoryGroup": 6,
  "reachedMtajiGames": 732,
  "verifiedIdentityHash": "b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f"
}
```

## Verification interpretation

The generation/verification stage passes its technical-integrity requirements:

```text
games expected = 768
games verified = 768
full search recomputation = true
verification passed = true
```

The verifier replayed and checked:

- 43,110 stored observations;
- 42,342 moves;
- 36,211 post-opening search moves by full search recomputation;
- trajectory/state identity and frozen Stage 1 specification identity.

Historical trajectory duplication is present and therefore the frozen deduplication/state-selection procedure remains necessary:

```text
unique historical trajectories = 685 / 768 generated games
duplicate trajectory groups = 61
largest duplicate trajectory group = 6
```

This is not treated as a failure. Stage 1 was prospectively designed to collapse duplicate `historicalTrajectoryHash` groups before state selection.

Mtaji was reached in:

```text
732 / 768 games
```

This descriptive availability fact does not itself establish whether the frozen hash-assigned one-state-per-trajectory selection will meet the Namua/Mtaji readiness gates. That is assessed only after the `select` and `measure` phases.

## Scientific boundary

This PASS means only:

> the fixed Stage 1 v1 generated corpus is internally verified and may proceed to the preregistered exploratory state-selection and measurement phases.

It does **not** mean:

- any complexity hypothesis is confirmed;
- any Stage 1 readiness gate has passed;
- Stage 2 is authorized;
- Stage 1 observations may be reused as formal confirmation evidence.

The complete 768-game seed block is now treated as consumed exploratory material. Do not regenerate selectively, append favorable seeds, replace duplicate trajectories with new seeds, or alter the frozen selection rule within Stage 1 v1.

## Next authorized sequence

```bash
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase select
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase measure
python3 tools/experiments/analyze-position-complexity-stage1-exploratory.py
```

After analysis, record the complete Stage 1 readiness audit before any Stage 2 preregistration is drafted.
