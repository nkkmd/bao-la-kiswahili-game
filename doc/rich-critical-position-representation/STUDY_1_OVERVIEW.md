# RCPR-STUDY1 — Overview

Updated: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

Japanese working title:

> Baoにおける重要局面の豊かな構造表現の構築とprospective検証 — rich pre-root representationによるdecision-critical structureの再現可能な識別

## Final study status

**CLOSED AT STAGE 1 — `STAGE1-TECHNICAL-INVALID`**

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 consume-once seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

The production Stage 1 pipeline passed all production readiness gates, but the prospectively required independent exact representation verification failed on four of 600 rows. The technical postmortem localized those four mismatches to floating-point addition order in `MOVE_SET_ENTROPY.indexEntropy`. Under the pre-frozen fail-closed contract this does not permit rescue or Stage 2 authorization.

See:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`

## Central question

Can a richer representation, fixed prospectively from information available at or before a root, reproducibly identify the same machine-defined fixed-policy continuation-divergence construct in a fresh independent population?

For `RCPR-STUDY1`, this question is **not adjudicated positively or negatively at Stage 2**, because Stage 1 failed the frozen exact technical verification gate. The Stage 1 production-only model output is not an accepted independently verified scientific result.

This Study is not an attempt to reclassify or rescue the 139/600 high-divergence roots or the 1,183 failed candidate audits from Research Generation 1.

## Stage architecture

```text
RCPR-S0-TECHNICAL-2026-08-28-v1
  technical representation feasibility only
  FINAL: STAGE0-TECHNICAL-PASS

RCPR-S1-DEVELOPMENT-2026-08-28-v1
  fresh development population; representation construction/model selection only
  FINAL: STAGE1-TECHNICAL-INVALID

RCPR-S2-FORMAL-2026-08-28-v1
  fresh independent formal validation, conditional on prospective authorization
  FINAL: NOT-AUTHORIZED-NOT-EXECUTED
```

## Authoritative scientific state identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
symmetry reduction = false
canonicalization = false
```

Historical occurrence provenance may be retained for temporal features, but it does not replace RAW state identity.

## Leakage boundary

```text
A PRE_ROOT_OBSERVABLE                       eligible
B ROOT_DERIVED_OUTCOME_INDEPENDENT          eligible
C SEARCH_DERIVED_OUTCOME_INDEPENDENT        eligible only under frozen search profile
D CONTINUATION_OR_FUTURE_OUTCOME_DERIVED    forbidden
```

No predictor representation may consume `D_range`, continuation wins/losses, post-root rollout states, future winner, or any other outcome-derived quantity.

## Prospectively declared representation families

```text
LOCAL_PIT_TOPOLOGY
CAPTURE_GRAPH
LEGAL_MOVE_GEOMETRY
REPLY_GRAPH
RESERVE_HOUSE_RELATION
MOVE_SET_ENTROPY
SEARCH_GAP_VECTOR
LOCAL_TEMPORAL_CONTEXT
```

No new family may be introduced to rescue the closed Stage 1.

## Stage 1 production-only output

For provenance only, production emitted:

```text
selected roots = 600
primary estimable = 599
high divergence = 134
low divergence = 465
selected family set = RICH_ALL
overall OOF AUROC = 0.7093403948001926
Namua AUROC = 0.7356189599631845
Mtaji AUROC = 0.6657646992502396
balanced accuracy = 0.6684641309581127
```

These are not promoted because independent exact representation verification failed.

## Technical-invalid reason

Independent verification matched corpus replay, root reselection, continuation remeasurement, `D_range`, high-divergence labels, model development and readiness. Four exact feature-vector hashes differed because `MOVE_SET_ENTROPY.indexEntropy` was accumulated in different category orders across the two independently implemented extractors, creating IEEE-754 differences of roughly `2.22e-16` to `4.44e-16`.

The frozen contract required exact equality; therefore final Stage 1 decision is `STAGE1-TECHNICAL-INVALID`.

## Prior-study boundary

Immutable upstream references remain unchanged:

```text
G2-01 / PEOCR-STUDY1 = INCONCLUSIVE
G2-02 / SRDR-STUDY1 = INCONCLUSIVE
G2-03 / STSCV-STUDY1 = INCONCLUSIVE
validated transform set = []
canonicalization = not authorized
G2-04 / REEOE-STUDY1 = INCONCLUSIVE
REEOE Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-05 / DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

Research Generation 1 Critical Positions / Outcome Branching Study 1 remains closed with 600 selected roots, 139 high-divergence roots, 1,183 candidate audits, zero promoted candidates, and Stage 2 not executed.

## Interpretation boundary and successor

`RCPR-STUDY1` establishes a technical failure of its frozen Stage 1 exact independent-verification contract. It does not establish game-theoretic turning points, human-perceived criticality, causality, universal Bao taxonomy, public-AI improvement, or a full-game solution.

A future successor may harden deterministic entropy/numeric hashing and repeat the research question prospectively only with a new study identity, new technical validation, fresh scientific seed block and new explicit authorization. The consumed `RCPR-STUDY1` block may not be rerun or promoted.
