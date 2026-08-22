# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

## Research identity

```text
studyId = BMP-STUDY1
integrated Stage 1 main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 research branch = research/blunder-misvaluation-patterns-stage2-formal
```

Stage 1 immutable identities:

```text
Stage 1 stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
Stage 1 spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
Stage 1 selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
Stage 1 measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
Stage 1 discovery execution HEAD = 14c0d29683611ecd76771a213ce2380cb71fa18d
Stage 1 discovery result commit = ffb9184d84c775e94f52b91f0c1621ea46061a93
Stage 1 raw discovery SHA-256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

Stage 2 frozen design identities:

```text
Stage 2 stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze ID = BMP-S2-CANDIDATES-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 097aa6450f270254ec6dee2a7fd7e74a2d8298cae36923a39e822b2137172730
```

## Current scientific state

```text
Stage 0 technical / construct audit = COMPLETE
Stage 1 fresh exploratory discovery = COMPLETE
Stage 1 promoted candidates = 4
Stage 1 integrated to main = COMPLETE

Stage 2 candidate definition freeze = COMPLETE
Stage 2 formal protocol = FROZEN
Stage 2 machine-readable spec = FROZEN
Stage 2 contract validator = MATERIALIZED
Stage 2 contract test = MATERIALIZED
Stage 2 runner = MATERIALIZED
Stage 2 independent corpus verifier = MATERIALIZED
Stage 2 independent formal measurement verifier = MATERIALIZED
Stage 2 formal evaluator = MATERIALIZED
Stage 2 tooling semantics test = MATERIALIZED
Stage 2 CI validation workflow = MATERIALIZED

Stage 2 local technical validation = PENDING
Stage 2 exact scientific source-file SHA-256 freeze = PENDING
Stage 2 generation authorization = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
Stage 2 formal result = NONE
Study 1 formal result = NONE
```

## Stage 1 result boundary

Stage 1 used:

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
selected unique rule states = 1200
Namua / Mtaji = 600 / 600
measured exact legal moves = 5295
matcherCount = 16421
detailedCandidateCount = 123624
promotion passing after support-equivalence = 11
final promoted candidates = 4
manual override = false
```

Frozen promoted inputs:

```text
BMP-S1-C01 — Namua / worstReplyActorFrontConnectionsDeltaNegative
BMP-S1-C02 — Namua / actorCaptureMoveDeltaNegative
BMP-S1-C03 — Namua / actorLegalMoveDeltaNegative
BMP-S1-C04 — Mtaji / allRepliesActorCaptureMoveDeltaNegative
```

These are exploratory candidates only. They are not confirmed Bao blunders.

## Stage 2 formal candidate mapping

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share the exact same frozen Namua support group and therefore must use the same fresh Stage 2 selected roots and deterministic candidate move. They differ only in failure token.

C04 uses its own frozen Mtaji support group.

## Stage 2 fresh population

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
opening = first 8 plies seeded-uniform exact E.moveVariants
condition assignment = game-index-modulo-6
```

Generation strata:

```text
B-D1 = 683
B-D2 = 683
B-D3 = 683
LS-D2 = 683
V2-D2 = 682
LE-D2 = 682
```

No early stopping, replacement, or seed extension is authorized.

## Stage 1 identity firewall for Stage 2

Fresh formal evidence must end with zero overlap on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

Rules:

- Stage 1 trajectory/opening overlap drops the whole Stage 2 trajectory before root selection.
- Stage 1 rule-state overlap is checked only after outcome-blind root selection; the selected root/trajectory is dropped without an alternate root.
- no replacement;
- no seed extension.

## Stage 2 outcome-blind root and move selection

Support-group root eligibility uses only phase, frozen structural preconditions, nonterminal status, ply >= 8, legal move count >= 2, and existence of a legal move matching the frozen move abstraction.

It excludes failure token, D1/D2/D3 values, D3-inferior status, TopSet, normalized rank loss, reply outcome, and game outcome.

Within an eligible trajectory, the selected root is deterministic SHA-256 minimum rank under the support-group salt.

Formal candidate move is the lexicographically smallest exact `AI.moveKey` among legal moves matching the frozen move abstraction.

## Stage 2 standardized formal measurement

```text
evaluation = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
primary depth = D3
quiescence depth = 1
perspective = root actor
```

The Stage 1 `d3-inferior-v1`, TopSet, domain ordering and normalized rank loss definitions are unchanged.

## Stage 2 estimability gates

Each candidate must pass:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Failure -> `INCONCLUSIVE-NOT-ESTIMABLE`; no rescue.

## Stage 2 primary tests and decision rule

Exactly eight planned one-sided exact binomial tests:

```text
4 candidates x 2 co-primary endpoints
FWER alpha = 0.05
Holm-Bonferroni
```

Co-primary endpoints:

```text
failure-signature recurrence: H0 p <= 0.50; observed floor >= 0.65
D3-inferior recurrence:       H0 p <= 0.50; observed floor >= 0.70
```

Additional confirmation consistency gates:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Candidate labels:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

Zero confirmed candidates is valid.

## Verification firewall

Exact order:

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal measure
-> independent formal measurement verification
-> formal evaluate
```

Formal evaluation is blocked until independent measurement verification passes and reproduces the exact measurement hash and Stage 1 identity firewall.

## No-rescue / interpretation boundary

After Stage 2 generation starts, candidate edits, seed extension, replacement, alternate roots after overlap, matcher/failure substitution, endpoint/null/floor retuning, multiplicity changes, favorable subgroup promotion, alternate primary depth/evaluator, and manual override are forbidden.

Even a Stage 2 `CONFIRMED` result means machine-reproducible recurrence under the frozen Bao engine/search/population only. It does not establish game-theoretic blunder status, human misconception, expert/traditional recognition, pedagogical value, causal mechanism, or external validity.

## Immediate next gate

Run only the pre-authorization technical validation in [`STAGE_2_EXECUTION_RUNBOOK.md`](STAGE_2_EXECUTION_RUNBOOK.md).

If and only if validator, contract/tooling tests, syntax checks, status/source-hash audit, and clean scientific source tree all pass, freeze the exact Stage 2 source-file SHA-256 map and create a separate source-bound generation authorization.
