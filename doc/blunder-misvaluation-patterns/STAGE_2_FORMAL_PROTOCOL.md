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
formal spec SHA-256      = e2845026a8414fcff1f5c8163a7de8a9089c7cbe3138fd67660cf0e026da5c65
```

## 1. Purpose

Stage 2 prospectively tests whether the exact four Stage 1 exploratory bad-move / misvaluation candidates reproduce in a fresh non-overlapping corpus.

The four upstream candidates are immutable inputs:

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

Stage 1 support is not confirmatory evidence. Stage 2 data are generated only after candidate/spec freeze, tooling validation, source freeze, and a separate explicit generation authorization.

## 2. Immutable Stage 1 boundary

Upstream identity:

```text
Stage 1 stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
Stage 1 spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
Stage 1 discovery result commit = ffb9184d84c775e94f52b91f0c1621ea46061a93
raw discovery artifact SHA-256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

After Stage 2 generation begins, the Stage 1 candidate matcher, move abstraction, failure token, phase, endpoint, or support grouping cannot be edited to improve results.

## 3. Formal candidate freeze

Canonical machine-readable candidate file:

`preregistration/STAGE_2_FORMAL_CANDIDATES.json`

SHA-256:

`12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b`

### Support group G01 — Namua

Shared by `BMP-S2-C01`, `BMP-S2-C02`, `BMP-S2-C03`:

```text
phase = namua
preconditions = frontOccupiedBins:6-8 + houseOwned:false
move abstraction mode = indexed
move = capture / row 0 / index 4 / side right / direction left
root-selection salt = BMP-S2-G01-ROOT-v1
```

The three formal candidates use the **same selected Stage 2 roots and the same deterministic candidate move**. They differ only in frozen failure token:

```text
BMP-S2-C01 = worstReplyActorFrontConnectionsDeltaNegative
BMP-S2-C02 = actorCaptureMoveDeltaNegative
BMP-S2-C03 = actorLegalMoveDeltaNegative
```

### Support group G02 — Mtaji

Used by `BMP-S2-C04`:

```text
phase = mtaji
preconditions = frontOccupiedBins:3-5 + legalMoveCountBins:5+
move abstraction mode = coarse-no-index
move = capture / row 1 / direction right
failure = allRepliesActorCaptureMoveDeltaNegative
root-selection salt = BMP-S2-G02-ROOT-v1
```

No candidate merge, split, substitution, or post-outcome renaming is allowed.

## 4. Fresh Stage 2 corpus

The complete previously reserved Stage 2 seed block is fixed:

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
opening = first 8 plies seeded-uniform exact E.moveVariants
```

Generation condition assignment is `game-index-modulo-6` with zero-based game index:

| Stratum | Remainder | Games | Generator |
| --- | ---: | ---: | --- |
| `B-D1` | 0 | 683 | hard / bao / phase2 / D1 / Q1 |
| `B-D2` | 1 | 683 | hard / bao / phase2 / D2 / Q1 |
| `B-D3` | 2 | 683 | hard / bao / phase2 / D3 / Q1 |
| `LS-D2` | 3 | 683 | hard / bao / legacy-search / D2 / Q0 |
| `V2-D2` | 4 | 682 | hard / bao-v2 / phase2 / D2 / Q1 |
| `LE-D2` | 5 | 682 | hard / legacy-evaluator / phase2 / D2 / Q1 |

All searches use infinite time limit, non-adaptive search, no aspiration window, and no result-dependent stopping.

The six strata are trajectory-diversification conditions only. They do not reopen earlier evaluator/search studies.

## 5. Stage 1 identity firewall

Stage 2 confirmation evidence must be non-overlapping with Stage 1 on three identity axes.

### Trajectory axis

```text
identity = historicalTrajectoryHash
Stage 1 reference = all Stage 1 generated games
```

If a Stage 2 trajectory overlaps, drop it before candidate root selection. No replacement.

### Opening axis

```text
identity = openingPrefixHash over exact first-8-ply moveKey prefix
Stage 1 reference = all Stage 1 generated games
```

If a Stage 2 opening prefix overlaps, drop the whole Stage 2 trajectory before candidate root selection. No replacement.

### Rule-state axis

```text
identity = ruleStateKey
Stage 1 reference = all Stage 1 measured observations
```

Root selection is first performed outcome-blind. If the selected Stage 2 root overlaps a Stage 1 rule state, that selected root/trajectory is dropped with **no alternate root from the same trajectory** and no replacement.

Final formal evidence requires:

```text
historicalTrajectoryHash overlap = 0
openingPrefixHash overlap = 0
ruleStateKey overlap = 0
```

No seed extension is allowed if the firewall reduces support.

## 6. Outcome-blind support-group root selection

Identical Stage 2 historical trajectories are collapsed before support-group selection. Representative trajectory = minimum seed then game ID.

For each support group, eligible roots use only:

1. frozen phase;
2. frozen precondition tokens;
3. nonterminal state;
4. ply >= 8;
5. at least two exact legal `E.moveVariants`;
6. at least one legal move matching the frozen move abstraction.

Eligibility explicitly excludes:

```text
failure token
D1/D2/D3 value
D3 inferior status
D3 TopSet status
normalized rank loss
reply outcome
game outcome
```

Each eligible historical trajectory contributes at most one selected root per support group. Root = minimum SHA-256 rank under the support-group salt using:

```text
supportGroupId
historicalTrajectoryHash
ruleStateKey
ply
```

Duplicate selected `ruleStateKey` values are collapsed by lowest historicalTrajectoryHash then seed, with no replacement.

C01/C02/C03 share G01 exactly, so they cannot acquire different Stage 2 denominators through outcome-dependent root choice.

## 7. Deterministic candidate move

At a selected support-group root, collect all exact legal moves matching the frozen move abstraction.

Formal candidate move:

```text
lexicographically smallest AI.moveKey
```

Move selection cannot depend on failure realization, D3 value, rank, response envelope, or game outcome.

All legal root moves are measured so the deterministic candidate move has an exact within-state D3 candidate table.

## 8. Standardized formal measurement

Each selected formal root is measured under:

```text
evaluation profile = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
depth = D3
quiescence depth = 1
orderQuiescenceCaptures = false
perspective = root actor
root move set = exact E.moveVariants(state)
```

The Stage 1 `d3-inferior-v1` event remains unchanged:

```text
candidate is not D3 TopSet
AND
(
  candidate is strictly below D3 state median
  OR candidate score-domain is worse than best score-domain
)
```

Mate-domain order remains:

```text
root-loss-mate-domain
< ordinary-evaluation-domain
< root-win-mate-domain
```

Normalized rank loss remains:

```text
(scoreRank - 1) / (legalMoveCount - 1)
```

for `legalMoveCount >= 2`.

## 9. Candidate estimability / transferability gates

Each formal candidate must independently pass all gates after the Stage 1 firewall and within-Stage-2 duplicate collapse:

```text
selected unique historical trajectories >= 96
selected unique rule states >= 96
distinct opening prefixes >= 48
maximum one-opening-prefix share <= 0.10
generation strata represented >= 4
maximum one-generation-stratum share <= 0.50
```

Failure of any gate yields:

```text
INCONCLUSIVE-NOT-ESTIMABLE
```

The corpus is not extended and no alternate candidate definition is substituted.

## 10. Co-primary formal endpoints

Each of the four formal candidates has exactly two co-primary binary endpoints over its frozen Stage 2 opportunity set.

### Endpoint P1 — failure-signature recurrence

Event:

```text
candidate's frozen failure token = true
```

Test:

```text
H0: p <= 0.50
H1: p > 0.50
exact one-sided binomial
```

Absolute confirmation floor:

```text
observed failure-signature rate >= 0.65
```

### Endpoint P2 — D3-inferior recurrence

Event:

```text
d3-inferior-v1 = true
```

Test:

```text
H0: p <= 0.50
H1: p > 0.50
exact one-sided binomial
```

Absolute confirmation floor:

```text
observed D3-inferior rate >= 0.70
```

The null probability 0.50 and absolute floors are fixed before Stage 2 data generation. The Stage 1 point estimates are not used as Stage 2 null values.

## 11. Multiplicity

Exactly eight confirmatory tests are planned:

```text
4 candidates × 2 co-primary endpoints
```

Family-wise alpha:

```text
0.05
```

Adjustment:

```text
Holm-Bonferroni across all eight planned one-sided exact p-values
```

If a candidate is non-estimable, each of its two planned endpoint p-values is fixed to `1.0` for the multiplicity family rather than dropped.

Both raw and Holm-adjusted p-values are reported. Only adjusted results enter formal confirmation.

## 12. Additional frozen consistency gates

To reproduce the full Stage 1 bad-move / misvaluation structure rather than only two recurrence rates, a `CONFIRMED` candidate must also satisfy:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

These are inherited from the Stage 1 promotion gate and are not retuned in Stage 2.

## 13. Candidate decision rule

A technically valid, estimable candidate is `CONFIRMED` only if **all** are true:

1. all estimability/transferability gates pass;
2. failure-signature observed rate >= 0.65;
3. D3-inferior observed rate >= 0.70;
4. both Holm-adjusted co-primary p-values <= 0.05;
5. D3 TopSet rate <= 0.20;
6. median normalized rank loss >= 0.50.

Decision labels:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

`NOT-CONFIRMED` means all required technical/estimability gates pass but at least one confirmation condition fails.

Zero confirmed candidates is a valid Study 1 Stage 2 result.

## 14. Secondary diagnostics

Prespecified descriptive diagnostics:

```text
D3 TopSet rate
median normalized rank loss
opportunity count
failure-positive count
D3-inferior count
opening-prefix diversity
generation-stratum diversity
descriptive breakdown by generation stratum
```

Generation-stratum breakdowns cannot replace the pooled primary decision.

C01/C02/C03 composite failure summaries may be reported descriptively but no composite is a formal endpoint.

## 15. Verification firewall

Scientific execution order is fixed:

```text
generate
→ independent full replay + generation-search verification
→ support-group select
→ formal measure
→ formal evaluate
```

Support-group selection is blocked until all 4096 generated games and their generation-search choices independently verify.

Formal evaluation is blocked until an independent measurement verifier confirms:

```text
selected root identity
legal move set
frozen move abstraction matching
deterministic candidate move
D3 candidate table
D3 inferior / TopSet / rank-loss classification
failure-token classification
Stage 1 identity firewall
source-file SHA-256 binding
```

A technical discrepancy cannot be repaired by changing scientific definitions, data, thresholds, or candidate IDs.

## 16. No-rescue rules

After Stage 2 scientific generation begins, all of the following are forbidden:

```text
seed extension
replacement sampling
Stage 1 overlap replacement
alternate root after selected rule-state overlap
candidate definition edit
matcher broadening or narrowing
failure-token substitution
candidate merge or split
phase reassignment
endpoint substitution
null-threshold retuning
absolute-rate-floor retuning
multiplicity-family change
alpha change
post-outcome primary depth/evaluator choice
favorable subgroup promotion
manual candidate override
```

A materially different design requires a new prospective version and a new fresh seed block.

## 17. Interpretation boundary

A `CONFIRMED` candidate means only:

> The exact frozen machine pattern reproduced its prespecified failure signature and D3-inferior recurrence on fresh Stage 2 data under the frozen Bao engine/search operationalization and decision rule.

It does **not** establish:

```text
game-theoretic blunder status
human misconception / cognitive bias
expert or traditional recognition
pedagogical importance
causal mechanism
external validity to other rules/engines/evaluators/search instruments
```

Human-facing claims require separate human evidence.

## 18. Authorization firewall

This protocol and `STAGE_2_FORMAL_SPEC.json` do **not** authorize scientific generation.

Before generation, all of the following are mandatory:

1. candidate/spec validator PASS;
2. Stage 2 contract test PASS;
3. runner + independent generation verifier + independent measurement/evaluation verifier materialized;
4. tooling technical validation PASS;
5. exact candidate/spec SHA-256 binding;
6. exact scientific source-file SHA-256 freeze;
7. separate committed `STAGE_2_FORMAL_AUTHORIZATION.json`.

Only then may seeds `22500001..22504096` be generated scientifically.
