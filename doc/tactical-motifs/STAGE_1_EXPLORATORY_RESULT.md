# Stage 1 Exploratory Discovery Result — Tactical Motifs / Tesuji Study 1

Date: 2026-08-14

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

## Status

**Stage 1 exploratory discovery COMPLETE. Eight machine-selected candidate definitions are frozen for Stage 2 planning only. No candidate is a confirmed tesuji. Stage 2 generation remains unauthorized.**

## Upstream integrity

- frozen spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`
- measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`
- discovery result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`
- discovery generated at: `2026-08-14T07:02:13.454Z`
- confirmatory reuse: forbidden
- Stage 2 generation authorized: false

## Discovery scale

- raw pattern instances: **3,116,520**
- unique pattern keys: **323,676**
- detailed candidates (support ≥ 6): **105,501**
- low-support patterns: **218,175**
- detailed candidates passing every frozen promotion gate: **948**
  - Mtaji: 921
  - Namua: 27
  - coarse-no-index: 833
  - indexed: 115

The 105,501 detailed candidates were independently stream-audited. Reapplying the frozen ranking and candidate caps reproduced the eight stored promoted candidate keys exactly.

The stored post-cap ranks correspond to pre-cap eligible ranking positions:

`1, 2, 22, 23, 40, 41, 645, 646`

This is expected from the frozen caps: maximum 8 total, 4 per phase, and 2 per exact move-abstraction token.

## Frozen promoted definitions

| Rank | Phase | Move abstraction | Precondition | Consequence | Support | D3 top-set | D3 ≥ median | D3 unique-worst |
|---|---|---|---|---|---:|---:|---:|---:|
| 1 | Mtaji | takata, back row, left | `captureMoveCount=0` | `actorCaptureMoveDeltaSign=0` | 44 | 0.6364 | 0.7955 | 0.0000 |
| 2 | Mtaji | takata, back row, left | `reserve=0` | `actorCaptureMoveDeltaSign=0` | 44 | 0.6364 | 0.7955 | 0.0000 |
| 3 | Namua | capture, front row, right side, left | `captureRegime=forced` | `replyClass=forced` | 32 | 0.6563 | 0.8438 | 0.1250 |
| 4 | Namua | capture, front row, right side, left | `captureMoveCount=2+` | `replyClass=forced` | 32 | 0.6563 | 0.8438 | 0.1250 |
| 5 | Mtaji | takata, back row, right | `reusablePits=0-2` | `actorNyumbaSeedsDeltaSign=0` | 30 | 0.7333 | 0.8000 | 0.1333 |
| 6 | Mtaji | takata, back row, right | `reusablePits=0-2` | `worstReplyActorCaptureMoveDeltaSign=0` | 30 | 0.7333 | 0.8000 | 0.1333 |
| 7 | Namua | takata, front row, right | `houseOwned=true` | `worstReplyActorCaptureMoveDeltaSign=+` | 14 | 0.7143 | 0.8571 | 0.0714 |
| 8 | Namua | takata, front row, right | `nyumbaSeeds=5+` | `worstReplyActorCaptureMoveDeltaSign=+` | 14 | 0.7143 | 0.8571 | 0.0714 |

All eight pass all nine frozen promotion gates. All are `coarse-no-index`; this was produced by the frozen ranking/cap procedure, not a manual choice.

## Support-equivalence audit

The eight promoted definitions form four exact support-identity pairs:

- ranks 1–2: `9f97ed51e315bc03cbebaddc7d9e29896b4a3de25897ce6870cd187de3eca4f8`
- ranks 3–4: `bc52e56c39b850e24846aaa78e4e38fe577130c278b10f30501c83b08c3369bb`
- ranks 5–6: `94a5c3b8b80d054dfe35f1234994a89b5614ce07d7e727be8d3a4c23acc6bc5a`
- ranks 7–8: `851dfbe2c18f018100d42ff00123c0e8f23f4cc517907116ec1610e5154934c0`

This is an audit observation, not a post-hoc candidate merge. The Stage 1 machine output remains eight candidate definitions. Any decision to test definitions separately or prospectively group support-equivalent definitions into Stage 2 families must be frozen before fresh Stage 2 generation and cannot depend on Stage 2 outcomes.

## Interpretation

Stage 1 establishes that the frozen exploratory pipeline can identify recurrent, opening-diverse, multi-stratum structural move patterns satisfying the preregistered search-value gates.

It does **not** establish:

- a confirmed tesuji;
- a universal Bao principle;
- human/expert/traditional recognition;
- pedagogical importance;
- causal strategic benefit;
- independence of the eight definitions as eight distinct tactical phenomena.

The four support-equivalent pairs are particularly important for Stage 2 design because candidate-definition multiplicity must not be mistaken for independent empirical phenomena.

## No-rescue status

The discovery artifact records all of the following as false:

- threshold retuning allowed
- favorable subset selection allowed
- phase relabeling allowed
- failed-candidate renaming allowed
- outcome-dependent extension allowed

No manual override was used.

## Next boundary

Before any fresh Stage 2 corpus is generated, create and commit a separate formal preregistration that prospectively freezes:

1. whether the eight Stage 1 definitions are tested individually, grouped into support-equivalent candidate families, or handled hierarchically;
2. exact candidate matching rules;
3. formal eligible population and fresh non-overlapping seeds;
4. comparator and outcome definitions;
5. duplicate/trajectory handling;
6. estimability/sample-size rules;
7. multiplicity and alpha;
8. formal decision/failure/no-rescue rules.

Until that boundary is complete, Stage 2 generation remains **NOT AUTHORIZED**.
