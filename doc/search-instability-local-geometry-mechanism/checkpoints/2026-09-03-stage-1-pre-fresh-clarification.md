# SILGM Stage 1 — Pre-fresh implementation clarification

Date: 2026-09-03  
Study: `SILGM-STUDY1`  
Stage: `SILGM-S1-DEVELOPMENT-2026-09-03-v1`  
Evidence status: **NO FRESH STAGE 1 EVIDENCE GENERATED OR READ**

Stage 0 v4 reached `STAGE0-PASS`. The Study-level protocol already froze the Stage 1 seed block, target 24 Namua + 24 Mtaji roots, one-root-per-trajectory rule, hash-assigned phase, minimum hash-rank root selection, no seed extension, geometry/search endpoints and development promotion rule. Before any Stage 1 seed access, this clarification removes implementation ambiguity without changing those scientific choices.

## Exact source identity

A source trajectory is replayed with Mulberry32 and canonical-sorted legal move variants through terminal state or ply 80. Its full trajectory identity is SHA-256 of canonical sorted-JSON encoding of the ordered array:

```text
[{moveKey, afterRawStateSha256}, ...]
```

The opening-prefix identity is SHA-256 of canonical sorted-JSON encoding of the first `min(16, trajectoryLength)` canonical move-key strings.

If `relay-limit` occurs during source replay, that entire seed trajectory is ineligible. No substitute seed outside `31710001..31710256` is permitted.

## Exact phase assignment

```text
salt = SILGM-S1-PHASE-v1
digest = SHA256(salt + "|" + fullTrajectorySha256)
parity word = unsigned integer encoded by first 8 digest hex characters
even -> namua
odd -> mtaji
```

## Exact within-trajectory root rank

```text
salt = SILGM-S1-ROOT-v1
rank = SHA256(salt + "|" + fullTrajectorySha256 + "|" + rootRawSha256 + "|" + decimalPly)
```

Only nonterminal assigned-phase states at ply >=16 with at least two legal move variants are eligible. Select exactly the minimum rank state in the assigned phase. Hash ties are resolved by `rootRawSha256` lexical ascending then ply ascending.

If that selected root collides with the upstream root firewall, the trajectory candidate is rejected. The second-ranked root is **not** substituted.

## Firewall and final selection

Full-trajectory or opening-prefix collision with the base upstream identity-only manifest rejects the trajectory before root selection. G3-06 failed-selection diagnostics are neither read nor retained; BRMGI contributes no materialized valid selected-population identity rows because its canonical result stopped at selection mismatch. The consumed BRMGI seed range is disjoint from SILGM Stage 1.

After one candidate per trajectory is constructed, duplicate RAW roots are collapsed by minimum selection rank, then full trajectory identity, source seed, selected ply. Discarded duplicates are not replaced.

Within each phase, retained candidates are sorted by:

1. selection rank;
2. full trajectory identity;
3. source seed;
4. selected ply;
5. root RAW identity.

Take the first 24. If either phase has fewer than 24, Stage 1 is `NON-ESTIMABLE`; no seed extension occurs.

## Resource ceiling fixed from technical-only evidence

Stage 0 v4 used 20,603 ms and 132,632,576 bytes peak RSS for two combined technical roots. Before any fresh Stage 1 population access, Stage 1 ceilings are frozen conservatively as:

```text
per selected root combined elapsed <= 360,000 ms
stage elapsed <= 7,200,000 ms
stage peak RSS <= 4,294,967,296 bytes
stage result artifact <= 268,435,456 bytes
```

LGTGMIV per-geometry-root ceilings remain unchanged.

These ceilings will not be relaxed after Stage 1 evidence access.

## Boundary

This clarification changes no geometry metric, search condition, search endpoint, Stage 1/2 population size, seed namespace, promotion threshold, candidate competition, formal test, multiplicity rule, interpretation boundary, no-rescue rule or protected depth-10 firewall.

Stage 1 generation remains **NOT AUTHORIZED** until a separate static preauthorization audit passes and an explicit exactly-once authorization artifact is committed.
