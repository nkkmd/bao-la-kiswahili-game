# Stage B depth/search-profile mechanism analysis completion

Date: 2026-08-07
Status: completed / retrospective non-formal mechanism analysis
Branch: `research/forced-capture-regime-analysis`

## Scope and governance

This checkpoint closes Study 1 Stage B using only already-fixed E-018, E-019, and E-020 formal corpora and already-produced structural-secondary outputs.

It does **not**:

- create a new formal experiment or hypothesis;
- regenerate or overwrite a formal corpus;
- alter any preregistration, seed block, execution policy, authorization, or lock;
- alter E-018/H16, E-019/H17, or E-020/H18;
- establish a general search-profile × depth interaction;
- establish causal search-tree mediation.

The fixed formal decisions remain:

- E-018/H16: `confirmed` only for fixed `hard / bao / depth2`;
- E-019/H17: global `not-confirmed`;
- E-020/H18: `confirmed` only for fixed `hard / bao / depth3`.

PR #26 remains open / draft / unmerged.

## Final Stage B sensitivity input

Uploaded result reviewed:

- `stage-b-trajectory-dedup-summary.json`
- analysisVersion: `stage-b-trajectory-dedup-1`
- reviewer-side SHA-256: `7cf27991014fd0b6415774bfa74e2a743359e8c3319b287ab3d909abbf5ba4e9`

Boundary flags:

- `generatesGames=false`
- `invokesFormalRunner=false`
- `recomputesTrajectoryAudit=false`
- `changesPrimaryDecision=false`

The analyzer reads archived structural-secondary JSON only.

## Trajectory-ply deduplication result

| comparison | P2 dedup expansion | LG dedup expansion | direction | dedup RR in observed direction |
|---|---:|---:|---|---:|
| E-018 D2 | 11/34 = 32.35% | 7/31 = 22.58% | P2 > LG | P2/LG = 1.433 |
| E-019 D3 | 6/49 = 12.24% | 17/36 = 47.22% | LG > P2 | LG/P2 = 3.856 |
| E-020 D3 | 5/42 = 11.90% | 13/35 = 37.14% | LG > P2 | LG/P2 = 3.120 |

Therefore the D2/D3 profile-ordering reversal survives trajectory-plus-ply deduplication in all three relevant corpora.

## Duplication is substantial but not explanatory of the reversal

Raw-to-trajectory-ply multiplicity and maximum multiplicity are asymmetric:

- E-018 D2 P2: mean multiplicity 3.15, maximum 37;
- E-018 D2 LG: mean 1.74, maximum 5;
- E-019 D3 P2: mean 2.33, maximum 8;
- E-019 D3 LG: mean 5.39, maximum 86;
- E-020 D3 P2: mean 2.67, maximum 10;
- E-020 D3 LG: mean 5.03, maximum 90.

Accordingly, raw candidate-row contrasts are partly amplified by repeated deterministic trajectories. Deduplication attenuates the contrast substantially, especially E-018 D2 and both D3 LG conditions.

However, because the ordering remains P2 > LG at D2 and LG > P2 in both D3 corpora after deduplication, repeated trajectory multiplicity cannot account for the direction reversal itself.

## Integrated Stage B findings

### B1 — candidate availability

The favored search profile has more candidate-bearing games in each comparison:

- E-018 D2: P2 > LG;
- E-019 D3: LG > P2;
- E-020 D3: LG > P2.

Candidate availability contributes to the observed event-rate contrast but is not sufficient.

### B2 — candidate-to-expansion manifestation

The larger multiplicative component is conditional manifestation among candidate-bearing games:

- E-018 D2: P2 substantially exceeds LG;
- E-019 D3: LG substantially exceeds P2;
- E-020 D3: LG substantially exceeds P2.

The D3 manifestation ordering is independently reproduced in E-019 and E-020.

### B3/B4 — forced-capture morphology

The profile with the higher expansion-game rate consistently occupies a more sustained forcing morphology:

- longer forced-capture regimes;
- earlier normalized position within the regime;
- higher post-candidate capture branch ceiling;
- greater post-candidate persistence;
- longer recovery distance;
- longer distance to forcing release.

Instantaneous candidate capture-move count and capture delta do not consistently track the favored profile across depths and are therefore insufficient as a standalone mechanism.

### Fixed categorical context decomposition

The reversal remains after restricting to the directly comparable recorded context `phaseAtCandidate=namua` and `inside-regime`:

- E-018 D2: P2 63/77 = 81.82%, LG 9/46 = 19.57%, P2/LG RR = 4.182;
- E-019 D3: P2 13/68 = 19.12%, LG 140/175 = 80.00%, LG/P2 RR = 4.185;
- E-020 D3: P2 18/73 = 24.66%, LG 129/157 = 82.17%, LG/P2 RR = 3.332.

Thus coarse phase composition and regime membership do not explain the reversal.

### Fixed classifier-gate decomposition

Using the pre-existing classifier defaults only (`eventWindow=8`, `expansionDelta=3`, `persistenceFraction=0.5`), the profile separation is concentrated in:

1. whether candidates are near `namua -> mtaji` transition;
2. whether forcing release is near;
3. whether the elevated branching persists.

The fixed capture-delta gate contributes relatively little to the profile separation after the earlier gates are passed.

Because these are classifier gates, this decomposition describes where the recorded candidate pools separate; it is not independent validation or causal mediation evidence.

## Stage B working structural explanation

The strongest explanation supported by the existing fixed corpora is:

> Search profile and search depth change where category-A candidates fall within the lifecycle of a forced-capture regime. Capture-branch-expansion is most compatible with candidates that occur inside a sustained forcing window: sufficiently early in a relatively long forced-capture regime, not immediately before formal phase transition or forcing release, and with enough remaining structure for elevated capture branching to persist. Under fixed depth2 this morphology is preferentially associated with phase2, whereas in both depth3 corpora it is preferentially associated with legacy.

This explains the observed descriptive reversal more completely than candidate count, instantaneous capture branching, phase composition, regime membership, or repeated deterministic trajectories alone.

## What Stage B does not explain

The existing archives do not expose enough internal search information to determine why changing depth changes which profile reaches the sustained-forcing window.

A direct explanation would require new instrumentation / game generation for variables such as:

- internal search-tree node expansions;
- principal variation changes;
- cutoffs;
- leaf evaluations;
- horizon-boundary diagnostics;
- direct same-opening depth2/depth3 decision divergence if not already recorded at the required granularity.

These are not authorized by Stage B and are not required to close the existing-corpus mechanism analysis.

If pursued as a confirmatory claim, they require a new hypothesis, experiment ID, preregistration, independent seed block, execution policy, explicit authorization, and new execution lock.

## Stage B completion decision

**Stage B existing-corpus mechanism analysis is complete.**

Rationale:

1. candidate availability and manifestation have been separated;
2. D3 morphology has been compared across discovery and independent replication corpora;
3. the opposite D2 morphology has been described with identical definitions;
4. fixed categorical context decomposition shows the reversal is not explained by coarse context composition;
5. fixed classifier-gate decomposition localizes where candidate pools separate without introducing result-chosen thresholds;
6. trajectory-ply deduplication shows the reversal is not an artifact of repeated deterministic trajectory rows;
7. the remaining explanatory gap requires search internals absent from the archived corpus and therefore belongs to a new study/design rather than further post-hoc slicing of Stage B.

## Next Study 1 stage

Proceed to **Stage C — capture-branch-expansion final recognition scope**.

Stage C must evaluate the six pre-existing recognition criteria with explicit evidence and limitations:

1. recurrence across games;
2. change in at least two independent feature groups;
3. persistence for the pre-specified period;
4. reproduction on new seeds;
5. explainability as game-position structure;
6. recordable counterexamples and applicability boundaries.

Stage C remains an integrative evidence assessment. It must not change any formal experiment decision.