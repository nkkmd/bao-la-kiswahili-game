# Stage 1 exploratory discovery completion

Date: 2026-08-14

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

## Decision

Stage 1 exploratory discovery is **COMPLETE**.

The frozen pipeline produced eight deterministic candidate definitions for **Stage 2 planning only**. No candidate is a confirmed tesuji. Stage 2 generation remains **NOT AUTHORIZED**.

## Artifact integrity

- discovery result local artifact: `artifacts/local/tactical-motifs/stage1-exploratory-v1/discovery-result.json`
- discovery result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`
- generated at: `2026-08-14T07:02:13.454Z`
- spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`
- measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`
- confirmatory reuse allowed: `false`
- Stage 2 generation authorized: `false`

The 324 MB discovery artifact remains local and is not committed. Its compact machine-readable promoted set is frozen in `doc/tactical-motifs/STAGE_1_CANDIDATE_FREEZE.json`.

## Discovery counts

- raw pattern instances: 3,116,520
- unique pattern keys: 323,676
- detailed candidates: 105,501
- low-support patterns: 218,175
- detailed candidates passing every frozen promotion gate: 948
  - Mtaji: 921
  - Namua: 27
  - coarse-no-index: 833
  - indexed: 115

## Independent ranking/cap audit

All 105,501 detailed candidates were stream-scanned independently from the stored JSON without loading the huge artifact into conversational context.

The frozen candidate comparison order and caps from `tactical-motif-discovery.js` were reapplied:

- support descending
- D3 top-set rate descending
- D3 at-or-above-state-median rate descending
- median D3 score-minus-state-median descending
- pattern complexity ascending
- candidate key ascending
- maximum 8 total
- maximum 4 per phase
- maximum 2 per exact move-abstraction token

The recomputed eight candidate keys exactly matched `promotedForStage2Planning` in order.

Their pre-cap eligible ranking positions were:

`1, 2, 22, 23, 40, 41, 645, 646`

Therefore the final eight are a deterministic capped set, not a manual curation.

## Promoted candidate keys

1. `23e3dbe362049a6e220fa2aa74b6f9364b8277cadc4f329e8181b483cf03fe38`
2. `9d56bfb8fd5dd74604720ed81d3157bdadb75bc8d046b9ac2d669753e1ce5f59`
3. `76dacf8980eeecec8af798b19fb3e87d23665a67bffaf555fb05cec5dea5c852`
4. `9a62f3db2e8d38c6c70849089ce309950d5c80ed6df436a389d22f472283fa49`
5. `7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`
6. `9af775a38a9fa5267ade3fbedbc4c2fa8effdc950cb1018e8242f5dfae988b0b`
7. `8a2c28eaefd59c83d6a7983b3f7c6b36c80f677b08ab6d2af65203e6af0c8755`
8. `e50ee37ceaf2ecdbb356908154185c66928d394eb27beaaaee585b1e0a911bcb`

All eight pass every frozen promotion gate.

## Support-equivalence observation

The eight definitions form four pairs with identical `supportIdentityHash` values:

- ranks 1–2
- ranks 3–4
- ranks 5–6
- ranks 7–8

This does not modify or merge the Stage 1 output. It is an audit observation that must be handled prospectively in Stage 2 design. Candidate-definition multiplicity must not be treated automatically as eight independent empirical phenomena.

## No-rescue audit

The discovery artifact explicitly keeps all of the following false:

- threshold retuning allowed
- favorable subset selection allowed
- phase relabeling allowed
- failed-candidate renaming allowed
- outcome-dependent extension allowed

No manual promotion occurred.

## Interpretation boundary

Authorized interpretation:

> The frozen exploratory pipeline identified eight recurrent, opening-diverse, multi-stratum tactical-pattern definitions satisfying the preregistered Stage 1 search-value and transferability gates. They are candidates for a fresh prospective Stage 2 design.

Not authorized:

- confirmed tesuji
- universal Bao principle
- causal strategic benefit
- human/expert/traditional recognition
- pedagogical importance
- reuse of Stage 1 positions or seeds for confirmation

## Next action

Design and freeze Stage 2 prospectively before any new corpus exists. The first unresolved design question is whether the eight candidate definitions should be tested individually, treated as four support-equivalent families, or represented hierarchically. That choice, plus matching rules, outcomes, comparator, fresh population/seeds, estimability, multiplicity, decision rules, and no-rescue rules, must be committed before Stage 2 generation authorization.
