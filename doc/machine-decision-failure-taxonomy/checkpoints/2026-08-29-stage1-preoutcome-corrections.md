# MDFT-STUDY1 — Stage 1 Pre-Outcome Corrections

Date: 2026-08-29

## Boundary

This checkpoint records corrections made **before** Stage 1 source freeze, explicit authorization, scientific seed consumption, or scientific outcome inspection.

```text
Stage 1 seeds 28910001..28914096 = RESERVED / UNCONSUMED
Stage 1 scientific execution = NOT AUTHORIZED
scientific outcome observed = false
```

No prior formal result is modified.

## C01 — within-trajectory occurrence rank field correction

Initial Stage 1 spec hash:

```text
cf25ebabd4109c0f901e45e4424b7ba3280d64cd9bfe2dc25e63a7dab3546109
```

The initial human-readable field list for `rootSelection.withinTrajectoryOccurrence` included `trajectoryHash`, while the intended streaming occurrence-selection implementation ranks candidate occurrences before the complete trajectory hash exists.

This was detected during implementation/spec consistency review before technical preflight.

The corrected frozen occurrence rank is:

```text
SHA256(MDFT-S1-ROOT-v1|seed|rawStateKey|ply)
```

`trajectoryHash` remains part of later trajectory deduplication and phase-quota ranking; it is intentionally excluded only from the within-trajectory occurrence rank because it is unavailable until trajectory completion.

Corrected Stage 1 spec hash:

```text
85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
```

This is a prospective implementation-consistency correction, not an outcome-driven population change.

## C02 — production / independent comparison-schema normalization

Stage 0 production search output retains auxiliary PV metadata (`semantics`, `nominalPlyLength`) that the structurally independent search implementation does not emit. Those fields are implementation metadata rather than scientific decision inputs.

Before Stage 1 preflight, the comparison representation was therefore normalized to retain exactly:

```text
principalVariation.moveKeys
principalVariation.score
```

for both implementations.

The production ablation candidate-table field was also renamed from `rows` to `candidates` so that both implementations serialize the same scientific table schema.

No score, move identity, TopSet, ranking, leaf rule, threshold, population rule, or promotion criterion was changed.

## Binding

1. The corrected spec hash `85090d...fe203` supersedes the initial pre-freeze hash `cf25eb...46109`.
2. Only the corrected spec may be used for Stage 1 source freeze or execution.
3. These corrections may not be revisited after scientific outcome inspection as a rescue mechanism.
4. Stage 1 remains unconsumed and unauthorized until technical preflight, source freeze, and explicit authorization are complete.
