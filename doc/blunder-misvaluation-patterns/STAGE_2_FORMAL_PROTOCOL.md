# Blunder / Misvaluation Patterns Study 1 — Stage 2 Formal Confirmation Protocol

Updated: 2026-08-22  
Status: **DESIGN FROZEN / SCIENTIFIC GENERATION NOT AUTHORIZED**

Stage ID:

```text
BMP-S2-FORMAL-2026-08-22-v1
```

Machine-readable identities:

```text
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256      = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
```

## 1. Purpose

Stage 2 tests whether the exact four Stage 1 exploratory candidates reproduce in fresh, non-overlapping data. Mapping is one-to-one and immutable:

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

Stage 1 support cannot count as Stage 2 confirmation evidence.

## 2. Immutable upstream identity

```text
Stage 1 stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
Stage 1 spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
Stage 1 discovery result commit = ffb9184d84c775e94f52b91f0c1621ea46061a93
raw discovery SHA-256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

No Stage 1 candidate may be merged, split, renamed, broadened, narrowed, or replaced after Stage 2 outcomes are generated.

## 3. Frozen support groups and candidates

Machine-readable definition:

`preregistration/STAGE_2_FORMAL_CANDIDATES.json`

### `BMP-S2-G01-NAMUA`

Shared by C01/C02/C03:

```text
phase = namua
frontOccupiedBins = 6-8
houseOwned = false
move abstraction = indexed capture / row 0 / index 4 / side right / direction left
root-selection salt = BMP-S2-G01-ROOT-v1
```

The same selected roots and the same deterministic candidate move are used for C01/C02/C03. Only failure token differs:

```text
C01 = worstReplyActorFrontConnectionsDeltaNegative
C02 = actorCaptureMoveDeltaNegative
C03 = actorLegalMoveDeltaNegative
```

### `BMP-S2-G02-MTAJI`

Used by C04:

```text
phase = mtaji
frontOccupiedBins = 3-5
legalMoveCountBins = 5+
move abstraction = coarse-no-index capture / row 1 / direction right
failure = allRepliesActorCaptureMoveDeltaNegative
root-selection salt = BMP-S2-G02-ROOT-v1
```

## 4. Fresh Stage 2 population

Use the full reserved block:

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
opening = first 8 plies seeded-uniform exact E.moveVariants
```

Generation strata are assigned by zero-based game index modulo 6:

| Stratum | Games | Generator |
| --- | ---: | --- |
| `B-D1` | 683 | hard / bao / phase2 / D1 / Q1 |
| `B-D2` | 683 | hard / bao / phase2 / D2 / Q1 |
| `B-D3` | 683 | hard / bao / phase2 / D3 / Q1 |
| `LS-D2` | 683 | hard / bao / legacy search / D2 / Q0 |
| `V2-D2` | 682 | hard / bao-v2 / phase2 / D2 / Q1 |
| `LE-D2` | 682 | hard / legacy evaluator / phase2 / D2 / Q1 |

No early stopping, outcome-dependent extension, or replacement sampling is allowed.

## 5. Stage 1 identity firewall

Stage 2 formal evidence must have zero overlap with Stage 1 on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

Rules:

1. Stage 2 trajectories overlapping any Stage 1 generated `historicalTrajectoryHash` are dropped before root selection.
2. Stage 2 trajectories overlapping any Stage 1 generated first-8-ply `openingPrefixHash` are dropped before root selection.
3. Root selection then occurs outcome-blind. If the selected Stage 2 root overlaps a Stage 1 selected/measured `ruleStateKey`, the selected root/trajectory is dropped. No alternate root from that trajectory is substituted.
4. No replacement and no seed extension occur at any firewall step.

Required final overlap counts are exactly 0 / 0 / 0.

## 6. Outcome-blind support-group selection

Identical historical trajectories are collapsed first; representative = minimum seed then game ID.

Root eligibility uses only:

```text
frozen phase
frozen structural preconditions
nonterminal
ply >= 8
at least 2 exact legal moveVariants
at least 1 legal move matching frozen move abstraction
```

Eligibility explicitly excludes failure token, search values, D3-inferior status, D3 TopSet status, normalized rank loss, reply outcome, and game outcome.

Each eligible historical trajectory contributes at most one root per support group. Root is minimum SHA-256 rank under the support-group salt over:

```text
supportGroupId
historicalTrajectoryHash
ruleStateKey
ply
```

Duplicate selected rule states are collapsed deterministically with no replacement.

## 7. Deterministic formal candidate move

At each selected root, collect all exact legal moves matching the frozen move abstraction. Formal candidate move is:

```text
lexicographically smallest AI.moveKey
```

Move selection cannot use failure realization, search score, rank, response envelope, or game outcome. All legal root moves are measured for the exact D3 candidate table.

## 8. Standardized formal measurement

```text
evaluation profile = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
depth = D3
quiescence depth = 1
orderQuiescenceCaptures = false
perspective = root actor
```

The frozen `d3-inferior-v1` event is unchanged:

```text
candidate not in D3 TopSet
AND
(candidate strictly below D3 state median
 OR candidate score-domain worse than best score-domain)
```

Domain order:

```text
root-loss-mate < ordinary-evaluation < root-win-mate
```

Normalized rank loss:

```text
(scoreRank - 1) / (legalMoveCount - 1)
```

## 9. Estimability / transferability gates

Each formal candidate must pass all of:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one-opening-prefix share <= 0.10
generation strata >= 4
maximum one-generation-stratum share <= 0.50
```

Failure yields `INCONCLUSIVE-NOT-ESTIMABLE`. No corpus extension or candidate rescue follows.

## 10. Co-primary endpoints

Exactly two binary endpoints per candidate:

### P1 — failure-signature recurrence

```text
H0: p <= 0.50
H1: p > 0.50
exact one-sided binomial
absolute confirmation floor: observed rate >= 0.65
```

### P2 — D3-inferior recurrence

```text
H0: p <= 0.50
H1: p > 0.50
exact one-sided binomial
absolute confirmation floor: observed rate >= 0.70
```

Null values and absolute floors are fixed before Stage 2 generation.

## 11. Multiplicity

Exactly eight planned confirmatory tests:

```text
4 candidates × 2 endpoints
```

```text
FWER alpha = 0.05
method = Holm-Bonferroni
```

A non-estimable candidate contributes `p = 1.0` for each planned endpoint rather than dropping tests from the family.

## 12. Additional consistency gates

A confirmed candidate must also satisfy:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

These are inherited from the frozen Stage 1 promotion criteria.

## 13. Candidate decision rule

`CONFIRMED` requires every one of:

1. technical integrity PASS;
2. all estimability gates PASS;
3. failure-signature rate >= 0.65;
4. D3-inferior rate >= 0.70;
5. both Holm-adjusted co-primary p-values <= 0.05;
6. D3 TopSet rate <= 0.20;
7. median normalized rank loss >= 0.50.

Otherwise:

```text
estimable + technically valid but any condition fails -> NOT-CONFIRMED
any estimability gate fails -> INCONCLUSIVE-NOT-ESTIMABLE
mandatory technical/integrity failure -> TECHNICAL-INCONCLUSIVE
```

Zero confirmed candidates is valid.

## 14. Secondary diagnostics

Prespecified descriptive diagnostics include D3 TopSet rate, median normalized rank loss, opportunity/failure/D3-inferior counts, opening and stratum diversity, and by-stratum summaries. They cannot replace the pooled formal decision.

No composite of C01/C02/C03 is a primary endpoint.

## 15. Mandatory verification firewall

Execution order is fixed:

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal measure
-> independent formal measurement verification
-> formal evaluate
```

Selection is blocked until corpus verification passes. Formal evaluation is blocked until both measurement production integrity and an independent measurement verifier pass.

Independent verification must recompute the selected root identity, legal move set, support-group matching, deterministic candidate move, exact D3 candidate table, D3 inferior/TopSet/rank-loss classification, frozen failure-token classification, Stage 1 identity firewall, and source-file binding.

## 16. No-rescue rules

Forbidden after Stage 2 scientific generation starts:

```text
seed extension
replacement sampling
identity-overlap replacement
alternate root after selected rule-state overlap
candidate edit / merge / split / rename
matcher broadening or narrowing
failure-token substitution
phase reassignment
endpoint substitution
null/floor retuning
multiplicity-family or alpha changes
post-outcome primary depth/evaluator choice
favorable subgroup promotion
manual override
```

A materially different design requires a new prospective version and a fresh seed block.

## 17. Interpretation boundary

A `CONFIRMED` candidate means only that the exact frozen machine pattern reproduced both its prespecified failure signature and D3-inferior recurrence on fresh Stage 2 data under the frozen engine/search/population and decision rule.

It does not establish game-theoretic blunder status, human misconception, expert/traditional recognition, pedagogical importance, causal mechanism, or external validity to other systems.

## 18. Authorization firewall

This protocol and spec do **not** authorize scientific generation.

Before generation all are mandatory:

```text
candidate/spec validator PASS
Stage 2 contract test PASS
runner + independent corpus verifier + independent measurement verifier + evaluator materialized
tooling technical validation PASS
exact candidate/spec hashes bound
exact scientific source-file SHA-256 map frozen
separate committed STAGE_2_FORMAL_AUTHORIZATION.json
```

Only then may seeds `22500001..22504096` be generated scientifically.
