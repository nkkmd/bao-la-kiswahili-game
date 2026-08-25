# State Space / Game Tree Complexity Study 1

**Study ID:** `SSGTC-STUDY1`  
**Status:** COMPLETED  
**Formal decision:** `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`  
**Representation:** RAW-ONLY

## Purpose

This independent prospective study quantified Bao reachable-state growth, branching structure, transpositions, and bounded game-tree expansion using authoritative raw rule-state identity while separating exact bounded enumeration from observed/censored counts, game-tree path occurrences, trajectories, and estimates.

It did not reopen, rescue, reclassify, or amend any completed Bao study.

## Study-start baseline

```text
remote main = 9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901
study branch = research/state-space-game-tree-complexity
study ID = SSGTC-STUDY1
```

## Representation firewall

Authoritative raw-state identity includes exactly:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

and excludes:

```text
turn
reason
```

`pending` is mandatory; missing `pending` is rejected before engine entry. Every accepted raw state satisfies:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

No symmetry, seat swap, reflection, compound transformation, canonicalization, or quotient reduction was used in Study 1.

## Stage sequence

1. **Stage 0 — technical representation/enumeration validation:** `SSGTC-STAGE0-PASS`; diagnostic-only.
2. **Stage 1 — exploratory growth characterization:** accepted as `EXPLORATORY-ONLY`; graph resource cap encountered with partial depth-9 rows censored; Stage 2 feasibility minimum passed.
3. **Stage 2 — prospective formal bounded quantification:** fresh evidence, no Stage 1 row reuse, full independent re-enumeration; formal target completed exactly.

## Formal bounded result

```text
reachable raw states through depth 8 = 24,848
transition occurrences from parent depths 0..7 = 25,648
duplicate encounters = 801
multi-parent raw states = 763

game-tree nodes through depth 8 = 30,941
game-tree edges through depth 8 = 30,940
raw-state / tree-node ratio = 0.803076823632074
```

Set identities:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

These are exact only inside the frozen standard-root depth-8 RAW-ONLY domain. They are not a full Bao state-space count or full game-tree count.

## Core documents

- `STUDY_1_OVERVIEW.md` — first-read result summary
- `STUDY_1_FINAL_REPORT.md` — scientific and technical integrated report
- `CURRENT_STATUS.md` — closed status and current claim boundary
- `DECISION_REGISTER.md` — frozen decisions and no-rescue record
- `RESEARCH_LOG.md` — chronology, including technical-invalid attempts
- `REPRODUCIBILITY_INDEX.md` — tooling, workflow, artifact and hash index
- `results/STAGE_0_TECHNICAL_RESULT.json` — technical-only Stage 0 record
- `results/STAGE_1_EXPLORATORY_RESULT.json` — accepted exploratory-only record
- `results/STAGE_2_FORMAL_RESULT.json` — canonical formal result
- `preregistration/STUDY_START_FIREWALL.md`
- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`
- `preregistration/STAGE_1_EXPLORATORY_DESIGN.md`
- `preregistration/STAGE_2_PROSPECTIVE_FIREWALL.md`
- `preregistration/STAGE_2_FORMAL_SPEC.json`

## Interpretation boundary

Study 1 does not authorize:

- `Bao state space = 24,848`;
- an exact full-game state-space/game-tree count;
- a full-game estimator or extrapolated growth law;
- a symmetry-reduced state count;
- validated canonicalization;
- alteration of upstream Restricted Endgame, Symmetry, or ORISC decisions.

Any deeper/full-game/symmetry-reduced follow-up must be a new prospective study or versioned protocol.

PR #49 remains unmerged until repository-wide documentation and CI audit passes and the user explicitly authorizes integration.