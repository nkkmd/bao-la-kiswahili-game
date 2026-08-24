# RESEARCH_LOG — Critical Positions / Outcome Branching Study 1

## 2026-08-23 — Study initiation / prior-state restoration

Verified current GitHub `main` and created the prospective study branch from:

```text
baseline main HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
branch = research/critical-positions-outcome-branching
```

Restored completed-study scientific states before design. No historical formal decision was changed.

Primary construct selected prospectively:

```text
fixed-policy empirical continuation divergence
```

Search-value separation, ranking instability, structural branch divergence, game-theoretic criticality and human-perceived criticality were kept separate.

Reserved scientific source-game namespaces:

```text
Stage 1 = 22600001..22603072
Stage 2 = 22700001..22706144
```

Reservation did not authorize generation.

## 2026-08-23 — Stage 0 technical validation / Stage 1 freeze

Stage 0 validated exact move variants, `AI.moveKey`, continuation RNG control, terminal/admin-truncation semantics, common-random-number pairing, structural/reply-envelope extraction, exact D2/D3 root diagnostics and independent remeasurement feasibility.

Technical result:

```text
Stage 0 technical = PASS
primary continuation policy = P1_NORMAL_TOP3
replicates per exact root move = 64
continuation cap = 200 plies
highDivergence threshold = D_range >= 0.30
```

Stage 1 design then froze source population, root selection, measurement, structural grammar, support/diversity thresholds, deterministic promotion, stopping rules and no-rescue constraints.

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
specSha256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
```

Source-bound authorization was issued separately after tooling/contract validation.

## 2026-08-23 — Stage 1 source corpus generation

Generated the frozen population exactly once:

```text
games = 3072
seeds = 22600001..22603072
sourceCommit = 157a4947435213b430ae7a9a85cc861aebfc258e
sourceTreeDirty = false
summaryHash = 1a56b7afb8c6c295f827c0546a87e9c2b0788914bffd1587b47f0d778bf73d63
```

All six generation strata contained exactly 512 games.

```text
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
```

No seed extension or replacement generation occurred.

## 2026-08-24 — Independent full source replay

The independent corpus verifier replayed all source games.

```text
passed = true
gamesVerified = 3072
fullCorpusReplay = true
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
```

The root-selection firewall was therefore opened.

## 2026-08-24 — Outcome-blind root selection

Frozen selection produced:

```text
selectedUniqueRuleStates = 600
Namua = 300
Mtaji = 300
selectedDistinctOpeningPrefixes = 567
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
replacementPerformed = false
phaseReassignmentPerformed = false
selection readiness = PASS
```

Selection did not use game winner, continuation outcome, `D_range`, D2/D3 score, candidate matcher or post-move consequence.

## 2026-08-24 — Stage 1 all-root-move measurement

Measured every exact legal root intervention for the 600 selected roots under the frozen continuation policy.

```text
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
primaryEstimableNamuaRoots = 300
primaryEstimableMtajiRoots = 300
finiteD2D3CandidateTables = PASS
replacementPerformed = false
replicateExtensionPerformed = false
continuationPolicySubstitutionPerformed = false
```

Measurement readiness passed.

## 2026-08-24 — Independent full measurement verification

The mandatory verifier independently reselected all 600 roots and fully recomputed the measurement stack.

```text
passed = true
rootsReselectedIndependently = 600
fullContinuationRemeasurement = true
fullSecondaryRecomputation = true
fullStructuralRecomputation = true
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
```

Deterministic exploratory discovery was then unblocked.

## 2026-08-24 — Deterministic exploratory discovery

The frozen structural grammar audited 1183 candidate patterns.

Discovery identity:

```text
resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
uploaded artifact SHA-256 = e1931c0f84b294bf8201e7732756bf156d688e4a38d55587e61b7303848d5024
```

Result:

```text
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
zeroPromotedCandidatesAllowed = true
manualOverridePerformed = false
```

Disjoint single-token `legalMoveCount` bins partition the 600 selected roots and show:

```text
Namua high-divergence = 52 / 300
Mtaji high-divergence = 87 / 300
overall high-divergence = 139 / 600
```

Thus fixed-policy continuation divergence exists in the selected population, but no one-to-two-token pre-root structural matcher satisfied all frozen promotion gates.

## 2026-08-24 — Study 1 closure

Stage 2 required an exact Stage 1 promoted candidate mapping frozen before any formal generation. Because:

```text
promotedCandidateCount = 0
```

there was no eligible Stage 2 formal target.

No threshold relaxation, near-miss selection, grammar expansion, seed extension, policy substitution or manual promotion was performed.

Final state:

```text
Stage 1 = COMPLETE / NEGATIVE EXPLORATORY STRUCTURAL-RECURRENCE RESULT
Stage 2 = NOT AUTHORIZED / NOT EXECUTED
Stage 2 seeds 22700001..22706144 = RESERVED / UNCONSUMED
Study 1 = CLOSED
```

This closure is not a formal `NOT-CONFIRMED` candidate result because no candidate entered Stage 2 confirmation.

Canonical closure documents:

```text
STUDY_1_OVERVIEW.md
STUDY_1_FINAL_REPORT.md
results/STAGE_1_EXPLORATORY_SUMMARY.json
checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md
```
