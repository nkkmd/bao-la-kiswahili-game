# PCEM-STUDY1 — Decision Register

All entries below are prospective research-start decisions unless later superseded by an explicitly prospective pre-outcome decision.

## D-001 — Study identity

```text
studyId = PCEM-STUDY1
workingEnglishTitle = Practical Comeback / Error-Inducing Move Study 1
slug = practical-comeback-error-inducing-moves
branch = research/practical-comeback-error-inducing-moves
```

Rationale: consistent with recent repository convention such as `CPOB-STUDY1`, `ORISC-STUDY1`, and `SSGTC-STUDY1`.

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
