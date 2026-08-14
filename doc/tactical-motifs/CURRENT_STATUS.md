# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## Current state

**ACTIVE — Stage 1 exploratory discovery is COMPLETE. Eight deterministic candidate definitions are frozen for Stage 2 planning only. Stage 2 formal design has not yet been frozen or authorized.**

Baseline `main` HEAD:

`08c70ba6ac980884d51562c207410db3521b8ae4`

Current branch:

`research/tactical-motif-discovery`

## Scientific state

- Stage 0 technical inspection: **COMPLETE / VALIDATED**
- Stage 1 v1 spec: **FROZEN / VALIDATED**
- Stage 1 execution tooling: **IMPLEMENTED / VALIDATED**
- Stage 1 scientific corpus generation: **COMPLETE**
- Stage 1 independent full replay/search verification: **PASSED**
- Stage 1 deterministic state selection: **COMPLETE / READINESS PASSED**
- Stage 1 all-move exact measurement: **COMPLETE / READINESS PASSED**
- Stage 1 exploratory candidate discovery: **COMPLETE**
- Stage 1 candidate freeze: **COMPLETE — 8 definitions**
- Stage 2 formal preregistration: **NOT YET FROZEN**
- Stage 2 corpus generation: **NOT AUTHORIZED**
- `confirmed tesuji` claim: **NOT AUTHORIZED**
- human/expert/traditional tesuji claim: **OUT OF SCOPE for Study 1**

## Frozen Stage 1 identity

Stage ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

Spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

Authorization SHA-256:

`9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`

Population:

- 768 games
- fresh seeds `21900001–21900768`
- six fixed generation strata × 128 games
- first 8 plies seeded-uniform over exact `E.moveVariants`
- max ply 100
- no early stop
- no outcome-dependent extension
- no replacement sampling

## Corpus / verification

- generated games: 768
- unique historical trajectories: 741
- duplicate historical-trajectory groups: 27
- largest duplicate group: 2
- distinct opening prefixes: 681
- manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`
- verification: `passed=true`
- full search recomputation: `true`
- games verified: 768
- verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`

## Selection / measurement

Selection:

- unique historical trajectories entering selection: 741
- unavailable assigned phase: 25, no replacement
- selected before rule-state collapse: 716
- duplicate selected rule states collapsed: 1
- selected unique rule states: 715
- Namua: 370
- Mtaji: 345
- distinct selected opening prefixes: 659
- minimum selected in any generation stratum: 114
- selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`
- every frozen selection-readiness gate: **PASS**

Measurement:

- completed root measurements: 715
- measured exact move records: 3148
- frozen minimum: 1800
- measurement readiness: **PASS**
- measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`

## Stage 1 discovery result

Local discovery artifact:

`artifacts/local/tactical-motifs/stage1-exploratory-v1/discovery-result.json`

SHA-256:

`aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`

Discovery scale:

- raw pattern instances: 3,116,520
- unique pattern keys: 323,676
- detailed candidates: 105,501
- low-support patterns: 218,175
- candidates passing every frozen promotion gate: 948
  - Mtaji: 921
  - Namua: 27
  - coarse-no-index: 833
  - indexed: 115

The full 105,501-candidate detailed set was independently stream-audited. Reapplication of the frozen comparator and caps reproduced the stored promoted candidate keys exactly.

Promoted post-cap ranks correspond to pre-cap eligible ranks:

`1, 2, 22, 23, 40, 41, 645, 646`

The eight candidate definitions are frozen in:

`doc/tactical-motifs/STAGE_1_CANDIDATE_FREEZE.json`

Human-readable result:

`doc/tactical-motifs/STAGE_1_EXPLORATORY_RESULT.md`

## Promoted candidate families at a glance

The eight definitions use four exact move-abstraction tokens, two definitions per token, with the frozen maximum-per-move cap reached in each case:

1. Mtaji back-row takata left — ranks 1–2
2. Namua front-row right-side capture left — ranks 3–4
3. Mtaji back-row takata right — ranks 5–6
4. Namua front-row takata right — ranks 7–8

All eight pass all nine prospectively frozen promotion gates.

## Support-equivalence audit

The eight definitions form four exact `supportIdentityHash` pairs:

- ranks 1–2
- ranks 3–4
- ranks 5–6
- ranks 7–8

This is an **audit observation only**. Stage 1 output remains eight definitions. No post-hoc merge or relabeling is authorized.

Stage 2 must prospectively freeze whether these are tested as eight definitions, four support-equivalent families, or a hierarchical structure before any fresh confirmation data exist.

## Interpretation boundary

Authorized Stage 1 statement:

> The frozen exploratory pipeline identified eight recurrent, opening-diverse, multi-stratum tactical-pattern definitions satisfying the preregistered Stage 1 transferability and D3-value gates. They are candidates for a fresh prospective Stage 2 design.

Not authorized:

- confirmed tesuji
- universal Bao principle
- causal strategic benefit
- human/expert/traditional recognition
- pedagogical importance
- treating eight candidate definitions automatically as eight independent empirical phenomena
- reusing Stage 1 positions or seeds for confirmation

## No-rescue boundary

The discovery artifact preserves:

- threshold retuning allowed: `false`
- favorable subset selection allowed: `false`
- phase relabeling allowed: `false`
- failed-candidate renaming allowed: `false`
- outcome-dependent extension allowed: `false`

Manual promotion remains forbidden.

## Immutable prior-study boundaries

- Phase Transition Study 1 remains immutable; `capture-branch-expansion` is not automatically a tesuji.
- Position Typology / Playing Style Study 1 remains immutable; morphology/style constructs are not automatically motif classes.
- Namua→Mtaji Study 1 remains `NOT-CONFIRMED`; timing/survival/hazard endpoints are not reused.
- Position Complexity Study 1 remains closed and inconclusive; search tooling is reused only as instrumentation.
- Joseki remains opening-sequence knowledge, distinct from position-transferrable tesuji.

## Next action

Proceed to **Stage 2 prospective formal design only**. Before Stage 2 generation, freeze and commit:

1. candidate-definition versus support-equivalent-family handling;
2. exact matching rule;
3. fresh eligible population and non-overlapping seed block;
4. comparator and formal outcome;
5. duplicate/trajectory handling;
6. estimability/sample-size rules;
7. multiplicity and alpha;
8. decision/failure/no-rescue rules;
9. separate Stage 2 generation authorization.

Until those gates are complete, Stage 2 generation remains **NOT AUTHORIZED**.
