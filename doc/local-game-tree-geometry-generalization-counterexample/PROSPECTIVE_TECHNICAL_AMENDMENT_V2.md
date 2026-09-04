# LGTGGC-STUDY1 — Prospective Technical Amendment V2

Date: 2026-09-04

## Status

**`PRE-FRESH / OUTCOME-BLIND / SCIENTIFIC-EVIDENCE-ACCESS = 0`**

This amendment preserves the original authorization review, protocol, and `prereg/STUDY_1_SPEC.json` as historical prospective records and supersedes only the source-policy definition and Stage 0 technical version before any G3-12 scientific seed or outcome access.

## Technical defect found before Stage 0 execution

The frozen V1 source policies were:

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-CAPTURE-FIRST
```

Authoritative Bao engine semantics enforce capture priority inside legal-move generation in both Namua and Mtaji. Therefore, whenever capture is available, the legal move set already contains only capture moves. Selecting uniformly from `capture moves if any, otherwise all legal moves` is consequently identical to selecting uniformly from the legal move set.

Thus V1 `P2-CAPTURE-FIRST` is not an identifiable source-policy transfer factor relative to P1.

No Stage 0 execution occurred under the defective V1 design. No Stage 1/2 scientific seed was generated, read, replayed, or peeked.

## V1 disposition

```text
LGTGGC-S0-TECHNICAL-2026-09-04-v1
= PRE-EXECUTION-TECHNICAL-INVALID / NOT EXECUTED
reason = P1/P2 SOURCE-POLICY NON-IDENTIFIABILITY UNDER AUTHORITATIVE CAPTURE-PRIORITY LEGAL-MOVE SEMANTICS
fresh scientific seed access = 0
```

This is not a scientific negative result and does not alter the `G3-12-AUTHORIZED` program decision.

## Versioned correction

The active source-policy family is prospectively refrozen as:

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-MAX-CAPTURE
```

### P1 — UNIFORM-LEGAL

- PRNG: Mulberry32.
- Legal moves sorted by canonical move identity ascending.
- One PRNG draw per ply.
- Select `floor(u * legalMoveCount)` from all legal moves.

### P2 — MAX-CAPTURE

- Same PRNG and canonical legal ordering.
- For every legal move, apply that move to an isolated cloned root state and compute the exact immediate number of captured seeds as the sum of authoritative `capture` event counts.
- Let `M` be the maximum immediate capture count among legal moves.
- Candidate pool = all legal moves with immediate capture count exactly `M`.
- One PRNG draw per ply; select `floor(u * candidatePoolCount)` from that pool.
- If all legal moves have the same immediate capture count (including all-zero non-capture positions), P2 reduces locally to uniform selection over the complete legal set.

The policy uses only immediate authoritative rule consequences at the current state. It does not use local-game-tree geometry, search output, game outcome, upstream scientific measurements, or any G3-12 endpoint.

## Distinguishability gate

Stage 0 V2 must fail closed unless technical-only trajectories establish all of:

1. production and independent P1 replay exact agreement;
2. production and independent P2 replay exact agreement;
3. at least one reachable technical state with two or more legal moves whose immediate capture counts are not all equal;
4. at least one fixed technical seed for which P1 and P2 produce different ordered move-key sequences;
5. no scientific seed namespace is touched.

Technical seed namespace:

```text
32309001..32309064
```

This namespace is permanently prohibited from Stage 1/2 scientific use.

## Active Stage 0

```text
LGTGGC-S0-TECHNICAL-2026-09-04-v2
```

V2 retains every other frozen scientific element: upstream claim set, root families, Stage 1/2 scientific seed blocks, thresholds, endpoints, multiplicity families, resource ceilings, no-rescue rule, RAW identity, transform set, depth-10/depth-11 firewall, and interpretation boundary.

## Freshness statement

At amendment freeze:

```text
G3-12 Stage 1 seed access = 0
G3-12 Stage 2 seed access = 0
fresh G3-12 scientific evidence generated/read/peeked = 0
G3-11 depth-10 rerun = false
depth-11 access = false
G2-12 estimator scientific input = false
```
