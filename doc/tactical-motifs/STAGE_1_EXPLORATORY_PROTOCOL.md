# STAGE_1_EXPLORATORY_PROTOCOL — Tactical Motifs / Tesuji Study 1

Date frozen: 2026-08-14

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

Machine-readable spec:

`doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_SPEC.json`

Frozen spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

## 1. Purpose

Stage 1 is a **prospective exploratory discovery stage**. Its purpose is to discover reproducible
position-transferrable tactical-motif / tesuji candidates without changing any completed Bao study.

Stage 1 may nominate candidates for later Stage 2 planning. It cannot:

- confirm a tesuji;
- authorize Stage 2 generation;
- change any prior formal decision;
- promote CBE, MTAJI morphology, style coordinates, search instability, or joseki labels into tesuji;
- support human/expert/traditional/pedagogical claims.

## 2. Population and fresh seed block

The scientific corpus is fixed at:

- games: **768**
- fresh seeds: **21900001–21900768**
- maximum ply: **100**
- early stopping by scientific outcome: forbidden
- outcome-dependent extension: forbidden
- replacement for unavailable trajectories or duplicate selected states: forbidden

The first 8 plies of every game use seeded uniform selection from `E.moveVariants(state)`.
This randomized prefix is used both to diversify trajectories and to define the opening-family audit.

## 3. Trajectory-generation strata

Games are assigned by exact `gameIndex modulo 6`, 128 games per stratum:

| Stratum | Evaluator | Search | Depth | Purpose |
|---|---|---|---:|---|
| `B-D1` | `bao` | `phase2` | 1 | shallow phase2 generation |
| `B-D2` | `bao` | `phase2` | 2 | standard phase2 generation |
| `B-D3` | `bao` | `phase2` | 3 | deeper phase2 generation |
| `LS-D2` | `bao` | `legacy` | 2 | legacy-search generation |
| `V2-D2` | `bao-v2` | `phase2` | 2 | evaluator-diverse generation |
| `LE-D2` | `legacy` | `phase2` | 2 | evaluator-diverse generation |

These labels are **trajectory-generation metadata only**. They do not reopen any prior comparison or
formal endpoint.

All AI strata use fixed depth, infinite time limit, no adaptive search, no stable-best early stopping,
and no aspiration-window dependence.

## 4. Identity and pseudoreplication control

The primary recurrence/support unit is the **unique historical trajectory**.

Procedure:

1. generate all 768 prospectively fixed games;
2. collapse identical `historicalTrajectoryHash` trajectories;
3. choose the minimum seed, then `gameId`, as the representative;
4. hash-assign each representative trajectory to either Namua or Mtaji;
5. within the assigned phase, select the single eligible root with the minimum frozen SHA-256 rank;
6. require at least two legal `moveVariants` at the root;
7. if the assigned phase has no eligible root, do not replace it;
8. globally collapse duplicate selected `ruleStateKey` roots without replacement.

Thus nearby states from one game cannot inflate candidate support.

## 5. Opening-family audit

The opening family is the SHA-256 identity of the ordered exact `AI.moveKey` prefix for the first
8 plies, with prefix length explicitly included.

A candidate cannot pass the exploratory promotion rule unless it has:

- at least 4 distinct opening-prefix identities; and
- no single opening prefix accounting for more than 50% of its supporting trajectories.

This prevents an opening/joseki family from masquerading as a position-transferrable tesuji.

## 6. Measurement unit

Every selected root is analyzed across **all legal `E.moveVariants(state)`**, not only the move
chosen by the generating AI.

For each exact moveVariant Stage 1 records:

- exact move identity;
- immediate actor/opponent structural deltas;
- capture / relay / sow event summary;
- house/nyumba changes;
- immediate opponent reply set;
- all-reply structural response envelope;
- exact root values at D1/D2/D3 using the frozen `bao` exact-root instrument;
- D1 reply-search diagnostic;
- D3 top-set membership, state-median relation, and unique-worst status.

Search-consistent principal variation is not required and is not fabricated.

## 7. Response envelope

For each candidate move, all immediate legal opponent `moveVariants` are enumerated.

The response envelope is expressed relative to the **original root actor** and records min/max/mean
root-relative changes across replies for:

- board/front/back seeds;
- occupied pits;
- front occupancy;
- reusable pits;
- front connections;
- legal move count;
- capture move count;
- maximum capturable seeds;
- nyumba seeds.

Terminal reply outcomes are counted separately.

This makes forcedness and downstream robustness distinct from one selected PV.

## 8. Prospective candidate representation

Candidate patterns have the frozen form:

`phase + 1–2 structural precondition tokens + one move-abstraction token + one consequence token`

The mandatory phase token is separate from the 1–2 additional precondition tokens.

Two move abstractions are retained:

- `coarse-no-index`
- `indexed`

Precondition token families are prospectively binned versions of:

- capture regime;
- legal move count;
- capture move count;
- reserve;
- house ownership;
- nyumba seeds;
- front occupancy;
- front connections;
- reusable pits.

Consequence token families include:

- captured-seed bin;
- relay-event bin;
- signs of mobility/capture/front-connection/reusable-pit/nyumba changes;
- house-ownership change;
- forced/free reply class;
- worst-reply signs for actor mobility and actor capture opportunity.

For each pattern, a historical trajectory contributes at most one support vote. If multiple exact
move records from the same trajectory match the same pattern, the representative is the
**lexicographically smallest exact `moveKey`**, not the best-valued move.

Patterns with fewer than 6 unique trajectory supports are retained only through a count and
aggregate key hash. Patterns with at least 6 are retained in the detailed candidate audit.

## 9. Readiness gates before discovery

After fixed generation and outcome-independent state selection, Stage 1 must have at least:

- 550 unique historical trajectories;
- 450 selected unique rule states;
- 180 Namua selected states;
- 180 Mtaji selected states;
- 32 distinct opening-prefix identities;
- 40 selected states from each generation stratum.

No replacement or corpus extension is allowed if a gate fails.

Measurement must then produce at least 1,800 exact move records before candidate discovery is
authorized.

Failure means insufficient exploratory estimability, not permission to add data.

## 10. Candidate promotion to Stage 2 planning

A detailed exploratory pattern is eligible for deterministic promotion only if all frozen gates pass:

- unique historical trajectories >= 12;
- unique rule states >= 12;
- distinct opening prefixes >= 4;
- maximum single opening-prefix share <= 0.50;
- generation strata >= 2;
- maximum single generation-stratum share <= 0.75;
- D3 top-set rate >= 0.60;
- D3 at-or-above state-median rate >= 0.60;
- D3 unique-worst rate <= 0.15.

Passing these gates does **not** confirm a tesuji.

Eligible patterns are ranked deterministically by:

1. unique trajectory support, descending;
2. D3 top-set rate, descending;
3. D3 at-or-above median rate, descending;
4. median D3 score minus state median, descending;
5. pattern complexity, ascending;
6. candidate key, ascending.

The automatically promoted set is capped at:

- 8 total;
- 4 per phase;
- 2 per move-abstraction key.

Manual override is forbidden.

## 11. Authorization firewall

The frozen spec **does not by itself authorize scientific generation**.

Generation may start only after:

1. this frozen specification, representation helper, candidate grammar, validator, and tests pass dedicated pre-generation validation;
2. a corpus runner and independent replay/search verifier are then implemented **without changing this frozen scientific contract**;
3. that execution implementation passes a separate technical validation gate;
4. only then is a separate `doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json` committed;
5. that authorization binds the exact spec SHA-256 and validated scientific implementation/source hashes.

At this freeze checkpoint no authorization file exists and no scientific corpus runner is authorized.

## 12. Future execution firewall

Once the runner/verifier gate is separately validated and authorized, scientific execution order is:

1. `generate`
2. independent full replay/search `verify`
3. `select`
4. readiness-gate inspection
5. `measure`
6. measurement-readiness inspection
7. `discover`

`select` is blocked until verification passes.
`measure` is blocked if selection readiness fails.
`discover` is blocked if measurement readiness fails.

Large scientific data remain under `artifacts/local/` and are never generated in GitHub Actions.

## 13. No-rescue rule

After generation begins, the following are forbidden:

- seed extension;
- outcome-dependent replacement;
- threshold retuning;
- phase reassignment;
- opening-family threshold relaxation;
- favorable subset selection;
- depth selection after seeing candidate results;
- failed-candidate renaming as a new candidate;
- manual addition of a candidate that failed the frozen promotion rule.

Any scientifically motivated redesign requires a new prospective Stage 1 version and a new,
non-overlapping corpus.

## 14. Stage 2 boundary

Stage 1 positions and seeds are not reusable for formal confirmation.

Before any Stage 2 generation, each promoted candidate/family must receive a separate frozen formal
definition covering population, matcher, comparator, endpoint, statistical unit, duplicate handling,
estimability, multiplicity, alpha, decision/failure rule, no-rescue rule, and a fresh seed block.

Stage 1 therefore discovers **machine-reproducible candidate patterns only**.
