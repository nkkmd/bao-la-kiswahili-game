# Stage C capture-branch-expansion final recognition scope

Date: 2026-08-07
Status: completed integrative evidence assessment / non-formal
Branch: `research/forced-capture-regime-analysis`

## Purpose

This checkpoint evaluates `capture-branch-expansion` against the six recognition criteria fixed in the original master plan `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`.

The criteria are not modified after seeing results:

1. recurrence across different games;
2. changes in at least two independent feature groups;
3. persistence for a prespecified period;
4. reproduction on new seeds;
5. explainability as game-position structure;
6. recordable counterexamples and applicability boundaries.

This is an integrative evidence assessment. It is not a new formal experiment and does not modify any existing formal decision.

Fixed formal decisions remain:

- E-010: `not-confirmed`;
- E-011: `inconclusive`;
- E-017: `not-confirmed`;
- E-018/H16: `confirmed` only at fixed `hard / bao / depth2`;
- E-019/H17: global `not-confirmed`;
- E-020/H18: `confirmed` only at fixed `hard / bao / depth3`.

## Evaluation scale

For Stage C only:

- `satisfied`: available evidence is sufficient for the criterion within the bounded Study 1 scope;
- `partially satisfied`: evidence exists and is directionally coherent, but is not sufficiently general or independently replicated to treat the criterion as fully established;
- `not satisfied`: available evidence does not meet the criterion.

These labels are not formal experiment decisions.

## Criterion 1 — recurrence across different games

**Assessment: `satisfied`.**

Evidence:

- the phenomenon was first observed in multiple pilot games / archetypes;
- E-010 observed 7 expansion candidates among 11 eligible candidates on unused seeds, although E-010 remained formally `not-confirmed` because the minimum candidate count was 12;
- E-017 observed multiple unique expansion structures, while remaining formally `not-confirmed` because the unique-control minimum was not met;
- E-018 recorded expansion events in 63 P2 games and 9 LG games at fixed depth2;
- E-019 D3 recorded 13 P2 and 140 LG expansion games;
- E-020 independently recorded 18 P2 and 129 LG expansion games at fixed depth3.

Trajectory-ply deduplication confirms that recurrence is not only raw row repetition:

- E-018 D2: P2 11 expansion trajectory-ply structures, LG 7;
- E-019 D3: P2 6, LG 17;
- E-020 D3: P2 5, LG 13.

Therefore the event phenotype recurs across different games and multiple trajectory-ply structures.

## Criterion 2 — changes in at least two independent feature groups

**Assessment: `partially satisfied`.**

Strongly established feature group:

1. **legal capture-option structure**
   - `captureMoveCount` rises relative to the pre-candidate baseline;
   - the elevated state persists according to the fixed classifier;
   - candidate/control analyses show strong enrichment of this phenotype.

Second, structurally distinct feature group:

2. **maximum capturable seed quantity / side asymmetry**
   - E-014 formation analysis found that near expansion candidates, player-to-move maximum capturable seeds increased by an average `+3.0`, while the opponent side decreased by `-1.2`;
   - phase changed in `0/5`, so this was not simply a formal phase-transition artifact;
   - E-010 unused-seed secondary analysis reproduced the same mean direction: raw `+2.57 / -0.86`, trajectory-ply deduplicated `+1.50 / -0.50`.

Limitation:

- in E-010 only one of the two deduplicated expansion structures showed clear maximum-capture asymmetry; the other showed no change;
- this second feature group has not been established with the same breadth across E-018/E-019/E-020 as the legal capture-option phenotype.

Therefore two distinct feature groups have been observed and the second group reproduced directionally on unused seeds, but its structural generality remains incomplete. The strict criterion is conservatively marked `partially satisfied` rather than upgraded after the fact.

## Criterion 3 — persistence for a prespecified period

**Assessment: `satisfied`, operationally.**

Before the later confirmation experiments, the expansion classifier fixed:

- `expansionDelta = 3`;
- `persistenceFraction = 0.5`;
- post-candidate/event window = 8 ply.

`capture-branch-expansion` requires the elevated capture-option state to meet the fixed persistence rule; temporary spikes are classified separately.

Stage B fixed-gate reconstruction exactly reproduced recorded expansion labels, showing that persistence is part of the stable operational phenotype rather than a result-dependent Stage B threshold.

Boundary:

- this criterion is partly definitional because persistence is encoded in the phenotype classifier;
- it should not be presented as an independent validation statistic.

## Criterion 4 — reproduction on new seeds

**Assessment: `satisfied` for the bounded phenomenon; not a claim of universal robustness.**

Evidence:

- E-010 used an unused seed block and reproduced strong candidate-side expansion enrichment, despite its formal `not-confirmed` decision caused by the minimum-candidate-count guard;
- E-017 used a further independent seed block and observed multiple unique expansion structures, despite its formal `not-confirmed` decision caused by the minimum-control guard;
- E-018 formally confirmed search-profile dependence under fixed depth2 on another paired seed block;
- E-020 prospectively and independently confirmed the opposite LG > P2 ordering at fixed depth3 on a new seed block.

Thus capture-branch-expansion itself recurs on new seeds. What does **not** generalize uniformly is which search profile manifests it more often.

## Criterion 5 — explainability as game-position structure

**Assessment: `satisfied` within observable board/legal-move structure.**

The phenomenon can be described structurally as occurring inside a forced-capture regime and involving sustained expansion of legal capture options after a candidate transition.

Stage B further localizes expansion-compatible candidates to a **sustained-forcing window**:

- relatively long forced-capture regimes;
- relatively early normalized position inside the regime;
- not immediately before `namua -> mtaji` transition;
- not immediately before forcing release;
- sufficient remaining structure for elevated capture branching to persist.

The profile occupying this morphology changes with depth:

- E-018 D2: phase2 preferentially occupies the expansion-compatible morphology;
- E-019/E-020 D3: legacy preferentially occupies it.

Trajectory-ply deduplication preserves the same direction ordering, so the structural explanation is not solely a repeated-trajectory artifact.

Boundary:

- the observable position-level morphology is explainable;
- the internal search-tree reason why depth changes which profile reaches this morphology is not observed in the archived corpus and remains Future Work.

## Criterion 6 — counterexamples and applicability boundaries

**Assessment: `satisfied`.**

Counterexamples / boundaries are explicit:

- not every category-A candidate becomes expansion;
- temporary spikes are separated from persistent expansion;
- forcing-release precursors were shown to be concentrated near terminal positions and are not treated as the same phenomenon;
- E-010 remains formally `not-confirmed` despite strong effect direction;
- E-011 remains `inconclusive` rather than being rewritten as robust or non-robust;
- E-017 remains formally `not-confirmed` despite multiple unique expansion structures;
- E-018 confirmation is restricted to `hard / bao / depth2`;
- E-019 global same-direction generalization is `not-confirmed`;
- E-019 D3 shows the opposite profile ordering;
- E-020 confirms that opposite ordering only at fixed `hard / bao / depth3`;
- no general search-profile × depth interaction, evaluator generalization, or causal search-tree mechanism is claimed.

Therefore the phenomenon has an explicit applicability map and recorded negative/limiting evidence.

## Stage C summary

| original recognition criterion | assessment |
|---|---|
| 1. recurrence across games | `satisfied` |
| 2. >=2 independent feature groups | `partially satisfied` |
| 3. prespecified persistence | `satisfied` |
| 4. reproduction on new seeds | `satisfied` |
| 5. game-position structural explanation | `satisfied` |
| 6. counterexamples / scope | `satisfied` |

## Final recognition scope

The strongest defensible Study 1 statement is:

> `capture-branch-expansion` is a reproducible, persistent, structurally interpretable strategic-transition phenotype inside Bao forced-capture regimes, with clear search-condition boundaries. It recurs across new seeds and multiple independent trajectory-ply structures. Its manifestation rate is search-profile dependent, and the favored profile reverses between the tested fixed depth2 and depth3 conditions. The original strict phase-transition recognition criteria are almost fully met, but the requirement for a second independent feature group is only partially established because maximum-capturable-seed asymmetry has limited independent-structure replication.

Accordingly, Study 1 should **not** upgrade the phenomenon to an unqualified universal or fully generalized `phase transition` claim.

Preferred bounded wording for final integration:

- `capture-branch-expansion phenomenon`;
- `capture-branch-expansion strategic-transition phenotype`;
- when explicitly tied to the original research framing: `strong phase-transition candidate with bounded recognition scope`.

Avoid without qualification:

- `universal Bao phase transition`;
- `depth interaction confirmed`;
- `all search profiles/depths show the same transition`;
- `causal search-tree mechanism established`.

## Stage C completion decision

**Stage C is complete.**

The remaining Study 1 work is terminological and integrative rather than additional post-hoc evidence mining.

Proceed to:

- **Stage D — machine definition / Bao vocabulary fixation**;
- then **Stage E — final Study 1 integration**.

A new experiment is not required for Stage D/E. Further confirmation of the second independent feature group or the internal search-depth mechanism belongs to Future Work / a new preregistered study.