# Blunder / Misvaluation Patterns Study 1 — Final Report

更新日: 2026-08-22  
Status: **STUDY 1 CLOSED / EXPLORATORY DISCOVERY COMPLETE / 4 CANDIDATES PROMOTED / NOT CONFIRMED**

## Executive summary

This prospective independent study developed and executed a machine-reproducible framework for discovering recurrent bad-move / misvaluation structures in Bao without defining a blunder merely by game outcome, static evaluation, or an AI policy's chosen move.

The study separated exact search-based decision loss, structural deterioration, forcing/response consequences, horizon/static misvaluation, empirical outcome, game-theoretic value, and human misconception. The primary machine reference was frozen before scientific generation as exact full-window root-candidate search under `bao`, D3 with quiescence depth 1, from the root actor perspective.

Stage 1 generated 2,048 fresh games, independently replayed and recomputed all search trajectories, selected 1,200 unique rule states by an outcome-blind trajectory-aware procedure, and measured all 5,295 legal moves. All preregistered generation, selection, and measurement readiness gates passed without replacement, phase reassignment, threshold retuning, or seed extension.

The frozen discovery grammar enumerated 16,421 matchers and 123,624 detailed candidates. Eleven candidates passed the promotion gate before and after support-equivalence collapse. Deterministic ranking and caps produced four promoted exploratory candidates: three Namua candidates sharing one matcher/support with distinct failure tokens, and one Mtaji response-envelope candidate.

The final Study 1 conclusion is therefore:

```text
Stage 1 exploratory discovery = COMPLETE
promoted exploratory candidates = 4
candidate confirmation = NOT PERFORMED
formal scientific result = NONE
```

These four candidates are eligible only for prospective fresh-data Stage 2 confirmation. They are not established game-theoretic blunders or human misconception patterns.

---

## 1. Research question

The study asked:

> Can recurrent Bao position → move → search-loss → structural/response-failure patterns be discovered reproducibly across distinct trajectories under a frozen machine operationalization, while controlling pseudoreplication and avoiding outcome-selected denominators?

The target construct was not a single scalar "blunder score". The study explicitly separated:

```text
D3 decision loss / rank loss
structural deterioration
response-envelope deterioration
forcing-response structure
horizon misvaluation
static misvaluation
continuation outcome
game-theoretic value
human misconception
```

---

## 2. Inherited scientific boundaries

Completed studies remained immutable.

```text
Position Evaluation / Win-Rate Calibration Study 1:
  formal decision = INCONCLUSIVE
  Stage 1 isotonic mapping = exploratory only

Position Complexity / Difficulty Study 1:
  PCX-H1 = INCONCLUSIVE
  PCX-H2 = NOT-CONFIRMATORILY-EVALUATED

Tactical Motifs / Tesuji Study 1:
  C01 = NOT-CONFIRMED
  C02 = NOT-CONFIRMED
  C03 = CONFIRMED
  C04 = NOT-CONFIRMED

Tactical Motif Human / Expert Validation Study 1:
  machineEvidence = CONFIRMED
  humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
  humanExpertN = 0
```

The Calibration Study 1 isotonic mapping was not used as a validated probability severity scale. Human misconception claims were excluded because no new human evidence was collected.

---

## 3. Stage 0 — construct and technical audit

Stage 0 fixed or validated:

- exact legal move identity via `E.moveVariants(state)` / `AI.moveKey`;
- root-actor search/evaluation perspective;
- exact TopSet and tied-best handling;
- separation of ordinary evaluator-domain loss, mate-distance loss, and cross-domain categorical loss;
- response-envelope and structural-transition instrumentation;
- no fabricated principal variation;
- D3+Q1 compute feasibility.

Primary reference:

```text
evaluation profile = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
primary depth = D3
quiescence depth = 1
perspective = root actor
root move set = exact moveVariants
```

The deterministic technical feasibility benchmark passed phase coverage and retained D3+Q1.

---

## 4. Stage 1 preregistration and authorization

Stage identity:

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
validated implementation commit = 8df328ca238611919ac58c262b92058712ee1049
source freeze commit = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
generation authorization commit = 1af3828c1c25789d6f4af590ee973cffd34bca46
```

Exact Stage 1 population:

```text
games = 2048
seeds = 22400001..22402048
maxPly = 100
opening random plies = 8
```

Six generation strata were assigned deterministically by game index modulo 6:

```text
B-D1 = 342
B-D2 = 342
B-D3 = 341
LS-D2 = 341
V2-D2 = 341
LE-D2 = 341
```

Stage 1 was exploratory. Confirmatory reuse was forbidden.

---

## 5. Generation and independent verification

Generation result:

```text
games = 2048
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
sourceTreeDirty = false
```

Independent full replay/search verification:

```text
verification execution HEAD = 897dcd2cb8775f8c129dbbde01167eef1f973089
passed = true
fullSearchRecomputation = true
gamesVerified = 2048
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
sourceTreeDirty = false
```

All six condition counts and all authorization-bound source hashes matched exactly.

---

## 6. Outcome-blind root selection

Selection did not use D1/D2/D3 score, regret, static evaluation, failure signature, candidate metric, game outcome, or manual replacement.

Frozen procedure:

```text
collapse duplicate historicalTrajectoryHash
→ deterministic phase hash assignment
→ choose one eligible root in assigned phase by frozen hash rank
→ no unavailable-phase reassignment
→ collapse duplicate ruleStateKey
→ deterministic within-phase quota rank
→ select 600 Namua + 600 Mtaji
```

Result:

```text
uniqueHistoricalTrajectories = 1884
unavailableAssignedPhase = 70
selectedBeforeRuleStateCollapse = 1814
duplicateSelectedRuleStatesCollapsed = 1
phasePoolAfterRuleStateCollapse = Namua 961 / Mtaji 852
selectedUniqueRuleStates = 1200
selectedPhaseCounts = Namua 600 / Mtaji 600
distinctOpeningPrefixes = 1067
replacementPerformed = false
phaseReassignmentPerformed = false
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
passed = true
```

Selected stratum counts:

```text
B-D1 = 191
B-D2 = 185
B-D3 = 218
LS-D2 = 203
V2-D2 = 187
LE-D2 = 216
```

All frozen selection readiness gates passed.

---

## 7. Exact move measurement

Every exact legal move at each selected root was measured.

```text
completedMeasurements = 1200
measuredMoveRecords = 5295
minimumMeasuredMoveRecords = 3600
allSelectedRootsFiniteD3CandidateTables = true
measurementReadinessPassed = true
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
sourceTreeDirty = false
```

For each move, the measurement layer recorded D1/D2/D3 search quantities, D3 domain-aware inferior/rank-loss information, static post-move evaluation, structural transition, response envelope, and frozen failure flags.

---

## 8. Discovery grammar and anti-selection-bias design

Matcher definition:

```text
phase
+ 1 or 2 structural precondition tokens
+ move abstraction
```

The failure token was excluded from the matcher and evaluated over all matcher opportunities.

Nine precondition families were available:

```text
captureRegime
legalMoveCountBins
captureMoveCountBins
reserveBins
houseOwned
nyumbaSeedsBins
frontOccupiedBins
frontConnectionsBins
reusablePitsBins
```

Both coarse-no-index and indexed move abstractions were used.

Within each matcher × historical trajectory, the representative exact move was the lexicographically smallest `moveKey`, making denominator construction outcome-blind.

Support-equivalence was frozen as:

```text
opportunityIdentityHash + failureToken
```

---

## 9. Promotion gate

A detailed candidate required:

```text
opportunity trajectories >= 24
opportunity rule states >= 24
failure-positive trajectories >= 16
distinct opening prefixes >= 6
maximum one opening prefix share <= 0.40
generation strata >= 3
maximum one generation stratum share <= 0.60
failure-signature rate >= 0.65
D3-inferior rate >= 0.70
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Automatic caps:

```text
maximum total = 6
maximum per phase = 3
maximum per failure family = 2
manual override = forbidden
```

Ranking was deterministic and favored the minimum of D3-inferior/failure rate, then support, D3-inferior rate, failure rate, rank loss, lower complexity, and candidate key.

---

## 10. Stage 1 discovery result

Discovery execution:

```text
execution HEAD = 14c0d29683611ecd76771a213ce2380cb71fa18d
generatedAt = 2026-08-22T04:11:03.583Z
```

Enumeration:

```text
matcherCount = 16421
lowSupportMatcherCount = 9553
lowSupportMatcherKeyHash = 46909b7f207af4f714f0d7845e5ebe8f080d1c68d43f51c520296933d6d31b60
detailedCandidateCount = 123624
promotionPassingBeforeSupportEquivalence = 11
promotionPassingAfterSupportEquivalence = 11
promotedCandidateCount = 4
manualOverridePerformed = false
```

The large raw result remained a local artifact:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/discovery-result.json
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

It was processed by streaming extraction without modifying the original artifact. The compact extraction used for repository-scale recording had SHA-256:

```text
0df0438105c7d7b248e014ffc30087b96dceb97bb4aeb716456b504cddc32db0
```

---

## 11. Promoted exploratory candidates

### BMP-S1-C01

```text
phase = Namua
preconditions = frontOccupiedBins:6-8 + houseOwned:false
move abstraction = indexed capture / row0 / index4 / side right / direction left
failure = worstReplyActorFrontConnectionsDeltaNegative
failure family = response-envelope
opportunity trajectories = 26
opportunity rule states = 26
failure-positive trajectories = 26
opening prefixes = 26
generation strata = 6
failureSignatureRate = 1.000000
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
```

### BMP-S1-C02

```text
phase = Namua
matcher/support = same as C01
failure = actorCaptureMoveDeltaNegative
failure family = immediate-structural
opportunity trajectories = 26
failure-positive trajectories = 22
failureSignatureRate = 0.846154
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
```

### BMP-S1-C03

```text
phase = Namua
matcher/support = same as C01
failure = actorLegalMoveDeltaNegative
failure family = immediate-structural
opportunity trajectories = 26
failure-positive trajectories = 22
failureSignatureRate = 0.846154
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
```

### BMP-S1-C04

```text
phase = Mtaji
preconditions = frontOccupiedBins:3-5 + legalMoveCountBins:5+
move abstraction = coarse-no-index capture / row1 / direction right
failure = allRepliesActorCaptureMoveDeltaNegative
failure family = response-envelope
opportunity trajectories = 27
opportunity rule states = 27
failure-positive trajectories = 18
opening prefixes = 27
generation strata = 6
failureSignatureRate = 0.666667
d3InferiorRate = 0.703704
d3TopSetRate = 0.148148
medianNormalizedRankLoss = 0.600000
```

All four passed every frozen promotion gate.

C01–C03 share the same opportunity support but remain distinct because the frozen support-equivalence identity includes the failure token.

---

## 12. Scientific interpretation

The correct conclusion is:

```text
four machine-reproducible exploratory candidates were promoted
```

The following conclusions are not authorized:

```text
four Bao blunders were confirmed
game-theoretic inferiority was established
human players make these mistakes
experts recognize these as blunders
these are pedagogically important principles
these patterns generalize beyond the frozen population/source
```

Stage 1 is discovery only. It cannot confirm itself.

---

## 13. No-rescue discipline

No Stage 1 result authorized:

- threshold retuning;
- favorable subset selection;
- phase relabeling;
- failed-candidate renaming;
- manual candidate promotion;
- outcome-dependent seed extension;
- replacement of unavailable assigned-phase trajectories.

These operations were not used.

---

## 14. Next research stage

The next scientifically valid step is a new prospective Stage 2 formal-confirmation design for the exact frozen candidates `BMP-S1-C01..C04`.

Stage 2 must use fresh data and may not count Stage 1 support as confirmation evidence. Candidate definitions must be frozen before Stage 2 outcomes are generated.

Stage 2 scientific generation remains unauthorized until all of the following are complete:

```text
formal Stage 2 spec
canonical contract validation
execution tooling validation
exact source-file hash freeze
explicit source-bound authorization
```

---

## 15. Canonical records

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`results/STAGE_1_DISCOVERY_RESULT.json`](results/STAGE_1_DISCOVERY_RESULT.json)
- [`preregistration/STAGE_1_EXPLORATORY_SPEC.json`](preregistration/STAGE_1_EXPLORATORY_SPEC.json)
