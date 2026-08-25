# PCEM-STUDY1 — Decision Register

All entries below are prospective research-start decisions unless later superseded by an explicitly prospective pre-outcome decision. Terminal entries record outcomes under those frozen decisions and do not retroactively alter them.

## D-001 — Study identity

```text
studyId = PCEM-STUDY1
workingEnglishTitle = Practical Comeback / Error-Inducing Move Study 1
slug = practical-comeback-error-inducing-moves
branch = research/practical-comeback-error-inducing-moves
```

## D-002 — Study-start baseline

```text
remoteMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
verifiedDate = 2026-08-25
```

The branch was created from exactly this SHA.

## D-003 — Independent-study / no-rescue rule

PCEM-STUDY1 is not a continuation or rescue of Critical Positions / Outcome Branching Study 1, Position Evaluation / Win-Rate Calibration Study 1, Blunder / Misvaluation Patterns Study 1, Position Complexity / Difficulty Study 1, Restricted Endgame / Winning Regions Study 1, Symmetry / Isomorphic Positions Study 1, ORISC-STUDY1, or SSGTC-STUDY1.

No completed formal decision, threshold, classifier, endpoint, population or interpretation boundary may be changed by this study.

## D-004 — Authoritative representation

Downstream state identity is RAW-ONLY and includes exactly:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Excluded from identity:

```text
turn
reason
```

`pendingRequired = true` and seed conservation is mandatory. No symmetry/canonicalization is authorized.

## D-005 — Primary scientific distinction

The study shall not define a practical comeback move as merely the best move, the highest evaluation move, or the highest empirical-win-frequency move.

It must retain separate measurements for:

```text
reference/strongest-policy quality
bounded-horizon empirical comeback under frozen imperfect opponent
reply-set narrowness
opponent-error dependence
machine-operational reply difficulty / punishment concentration
move optimality gap
```

## D-006 — Human-claim firewall

Machine reply structure does not establish human difficulty, deception, pressure, misconception, expert recognition or traditional terminology. Such claims are unauthorized in PCEM-STUDY1 unless a separate human-participant stage/study is prospectively authorized.

## D-007 — Stage separation

```text
Stage 0 = technical-only
Stage 1 = fresh exploratory only
Stage 2 = fresh formal only if Stage 1 frozen promotion yields >= 1 candidate
```

Stage 1 rows cannot be reused as Stage 2 evidence. Reserved Stage 2 seeds cannot be consumed in Stage 1.

## D-008 — Zero-candidate rule

```text
zeroPromotedCandidatesAllowed = true
```

If Stage 1 yields zero promoted candidates, Stage 2 becomes `NOT-AUTHORIZED-NOT-EXECUTED`. Threshold relaxation, near-miss promotion, favorable subgroup rescue and post-outcome grammar expansion are forbidden.

## D-009 — Root disadvantage dependency

The disadvantaged-root construct must be independent of the unvalidated Calibration Study mapping. It must be prospectively defined from a fresh, reproducible reference quantity before Stage 1 outcome inspection, with Namua/Mtaji handled separately unless pooling is explicitly preregistered.

## D-010 — Comeback endpoint dependency

The primary comeback endpoint must be measured from fresh continuations generated under the current study's frozen continuation/opponent policy. No existing isotonic mapping may be promoted to a validated probability endpoint.

A bounded-horizon terminal-win indicator is preferred over treating administrative cutoff as missingness; exact horizon and accounting must be frozen before Stage 1.

## D-011 — Reply-set semantics

The following are distinct and must be separately named if measured:

```text
unique legal reply
unique reference-best reply
unique sufficiently successful defense
```

No document may use “unique reply” without specifying which definition applies.

## D-012 — Statistical unit

Root is the primary clustering/pairing unit for move comparisons. Move rows and continuation replicates from the same root are not independent roots. Replicate inflation cannot compensate for insufficient root support.

## D-013 — Formal vocabulary

Permitted stage/study labels include:

```text
TECHNICAL-PASS
EXPLORATORY-ONLY
CONFIRMED
NOT-CONFIRMED
NON-ESTIMABLE
RESOURCE-CENSORED
TECHNICALLY-INVALID
NOT-AUTHORIZED-NOT-EXECUTED
```

Informal adjectives such as “promising” are not substitutes for formal decisions.

## D-014 — Git boundary

No merge to `main`, auto-merge, or branch deletion without explicit user instruction.

## D-015 — Stage 0 reference-search semantics

Stage 0 prospectively implemented a study-owned deterministic exact-root search table:

```text
searchSemantics = pcem-exact-full-window-root-candidates/bao/q0/v1
evaluationProfile = bao
quiescence = 0
root candidate enumeration = all exact legal moves
```

D2 and D3 tables were independently reproduced on technical fixtures. These tables are machine references only and are not game-theoretic ground truth.

Status: **TECHNICALLY VALIDATED**.

## D-016 — Asymmetric continuation architecture

To avoid conflating opponent imperfection with weakening both players, Stage 0 fixed the technical architecture in which the root actor can use a reference policy while the opponent uses a separately specified imperfect policy.

Technical policy implementations validated in Stage 0:

```text
P_REFERENCE_D2_BEST
P_MEDIUM_D1_TOP3
P_SHALLOW_UNIFORM
```

This validates implementation/seedability only. It does not establish which policy is scientifically primary until the Stage 1 spec is prospectively frozen.

Status: **TECHNICALLY VALIDATED**.

## D-017 — Stage 0 common-random-number binding

For a fixed root and replicate index, the continuation RNG seed is derived independently of the chosen root move. Thus exact legal root moves are paired by the same replicate RNG stream.

This is a variance-control/binding device. A continuation replicate remains nested within a root and does not enlarge root N.

Status: **TECHNICALLY VALIDATED**.

## D-018 — Stage 0 canonical decision

Canonical Stage 0 result:

```text
stageId = PCEM-S0-TECHNICAL-2026-08-25-v1
decision = TECHNICAL-PASS
canonical source commit = 29976182dcdcabf206a1d0bf59252fe8bb2288df
workflow run = 32813154014
job = 97696278964
artifact = 9550497573
```

Production passed 12/12 technical gates and independent verification passed 8/8 gates.

Status: **FROZEN TECHNICAL RESULT**.

## D-019 — Invalidated first technical run

Workflow run `32813015855` is retained as an invalidated technical attempt. Its production measurement passed and all independent recomputations/hash binding passed, but the verifier independence source audit self-matched its own forbidden-module regex literals. The sole failed verifier gate was therefore `independence`.

The correction changed only the verifier's source-audit mechanism and was rerun in full. No scientific population, endpoint, threshold, candidate grammar or scientific result was changed or inspected for this correction.

Status: **TECHNICALLY INVALIDATED / NOT SCIENTIFIC EVIDENCE**.

## D-020 — Stage 0 scientific firewall remains closed

Stage 0 technical artifacts may support feasibility/resource decisions only. They may not be used to estimate disadvantaged-root prevalence, practical comeback effect, candidate recurrence, optimal promotion thresholds, or any human/game-theoretic claim.

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

Status: **FROZEN**.

## D-021 — Stage 1 frozen exploratory design

Before Stage 1 outcome inspection, the exact design was frozen as `PCEM-S1-EXPLORATORY-2026-08-25-v1`.

```text
specSha256 = 26a7daea8588a460e19ae8e77485c50a092d714bfb3243608b5b64a95fa3fe22
featureDefinitionsSha256 = 3f1e622c86fca8d4153baca815000234cd1672ad5a6a259aaae4ffea4a6e84d6
source games = 3072
Stage 1 seeds = 23200001..23203072
root target = 300 (Namua 150 / Mtaji 150)
reference disadvantage = D3 bestScore < 0
primary opponent = P_MEDIUM_D1_TOP3
primary replicates = 12 per exact root move
bounded horizon = 96 post-root plies
candidate templates = PCEM-T1..T8
```

The root state is hash-selected before disadvantage inspection, and no within-trajectory replacement is permitted after reference failure.

Status: **FROZEN PROSPECTIVELY**.

## D-022 — Stage 1 authorization boundary

Stage 1 generation was separately authorized after the pre-authorization contract passed and exact source/spec/feature hashes were materialized.

```text
stage1GenerationAuthorized = true
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

Status: **FROZEN PROSPECTIVELY**.

## D-023 — Execution-only parallel amendment

Before any canonical Stage 1 result artifact existed or candidate/effect/promotion outcome was inspected, the long serial workflow was superseded by deterministic parallel execution.

```text
sourceChunks = 12 x 256 games
measurementChunks = 12 x <=25 roots
scientificLogicChanged = false
sourceSeedBlockChanged = false
populationChanged = false
rootSelectionChanged = false
opponentPolicyChanged = false
endpointChanged = false
promotionRuleChanged = false
additionalScientificSeedsAllowed = false
```

Three parallel gate implementation defects occurred before scientific seed generation and are retained in `STAGE_1_EXECUTION_AMENDMENT_1.json`; all had `scientificSeedsGenerated = 0`.

Status: **FROZEN PRE-OUTCOME EXECUTION AMENDMENT**.

## D-024 — Canonical Stage 1 exploratory result

Canonical workflow `32820391017` completed successfully and independent reconstruction passed.

```text
scientificLabel = EXPLORATORY-ONLY
generatedGames = 3072
uniqueHistoricalTrajectories = 2764
selectedRoots = 300
exactRootMoveInterventions = 1065
totalContinuationRows = 18105
candidateAuditCount = 55
candidatesPassingPromotionGates = 0
promotedCandidateCount = 0
manualPromotionPerformed = false
resultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

All frozen readiness gates passed. Independent gates `independence`, `sourceReplay`, `selection`, `rawIdentity`, `measurement`, and `discovery` all passed.

Status: **FROZEN EXPLORATORY RESULT**.

## D-025 — No near-miss rescue

All 55 audited candidate definitions failed each of the frozen minimum unique-root, unique-historical-trajectory, distinct-opening-prefix, unique error-condition root, and unique defense-condition root support gates.

Individual candidate definitions may show large descriptive machine-error-conditioned differences, but these rows do not satisfy the full frozen promotion conjunction. They are not to be relabeled as promoted, confirmed, or informally privileged near-miss candidates within PCEM-STUDY1.

Status: **FROZEN NO-RESCUE INTERPRETATION**.

## D-026 — Stage 2 terminal disposition

Because Stage 1 produced zero promoted candidates:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
stage2GenerationAuthorized = false
reservedStage2Seeds = 23300001..23306144
reservedStage2SeedsConsumed = false
```

Threshold relaxation, favorable subgroup rescue, candidate grammar expansion, opponent-policy substitution, and reuse of Stage 1 rows as Stage 2 evidence are prohibited.

Status: **TERMINAL**.

## D-027 — Final Study 1 state

```text
PCEM-STUDY1 = COMPLETE
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
Stage 1 promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No human, game-theoretic, true-win-probability, all-opponent, or expert/traditional winning-try claim is authorized.

Status: **FINAL**.
