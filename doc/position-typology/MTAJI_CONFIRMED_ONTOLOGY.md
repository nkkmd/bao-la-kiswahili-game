# Confirmed Mtaji Position-Morphology Ontology

Date: 2026-08-10  
Status: **human-readable ontology naming fixed / classifier unchanged / Stage 2 formal confirmation unchanged**

## Scope

This document fixes the human-readable names for the two mtaji position morphologies that were independently confirmed under preregistration:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
```

The frozen classifier remains identified by:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Nothing in this naming decision changes:

- the 40-dimensional representation,
- log1p field set,
- discovery StandardScaler,
- discovery centroids,
- K-means settings,
- canonical raw-label mapping,
- Stage 2 formal result,
- population boundary.

## Canonical study IDs

The stable machine-facing IDs remain:

```text
MTAJI-M1
MTAJI-M2
```

These IDs are the primary identifiers in artifacts and code.

## Final human-readable names

### MTAJI-M1 — Capture-Engaged Low-Contrast Morphology

Japanese descriptive rendering:

> **捕獲関与・低コントラスト型局面形態**

Definition by confirmed empirical profile:

- high total forced-capture availability,
- high total capture-move count,
- high total capturable-seed measures,
- high total capture-event measures,
- higher total front occupancy,
- relatively small actor/opponent absolute differences across several capture/front-row structural measures.

`Low-Contrast` means lower actor/opponent **structural contrast in the invariant feature representation**. It does not mean equal playing strength, equal winning chances, or strategic balance.

### MTAJI-M2 — Capture-Sparse High-Contrast Morphology

Japanese descriptive rendering:

> **捕獲希薄・高コントラスト型局面形態**

Definition by confirmed empirical profile:

- lower total forced-capture availability,
- lower total capture-move count,
- lower total capturable-seed measures,
- lower total capture-event measures,
- lower total front occupancy,
- larger actor/opponent absolute differences across several capture/front-row structural measures.

`High-Contrast` means larger actor/opponent **structural contrast in the invariant feature representation**. It is not an advantage/disadvantage label.

## Why these names replace the discovery aliases

The discovery aliases were:

```text
MTAJI-M1 = capture-engaged / relatively balanced morphology
MTAJI-M2 = capture-sparse / relatively asymmetric morphology
```

`balanced` / `asymmetric` were accurate descriptive shorthand, but could be misread as:

- competitive balance,
- expected win probability,
- player strength,
- actor advantage.

The terms `Low-Contrast` and `High-Contrast` are narrower. They refer specifically to actor/opponent absolute structural differences in the confirmed role-invariant representation.

## Interpretation boundary

These are **position morphology types**, not:

- playing styles,
- player identities,
- AI evaluator/search labels,
- win/loss classes,
- causal advantage states,
- universal names for every Bao legal state.

The ontology is confirmed specifically for the preregistered mtaji population and frozen representation.

The previously rejected actor-oriented mtaji k=2 remains a **continuous relational-polarity coordinate** and is not part of this two-type ontology.

## Naming policy for downstream work

Use:

```text
MTAJI-M1 (Capture-Engaged Low-Contrast Morphology)
MTAJI-M2 (Capture-Sparse High-Contrast Morphology)
```

on first mention.

Afterward, use `MTAJI-M1` / `MTAJI-M2` when machine/research precision matters, or the short descriptive names when discussing morphology qualitatively.

Do not silently rename these types in later playing-style or cross-study analyses. A wording revision may only change the human-readable alias; it may not change the frozen classifier while retaining the same study ID.
