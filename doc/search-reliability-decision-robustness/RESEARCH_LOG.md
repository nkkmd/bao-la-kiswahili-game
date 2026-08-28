# SRDR-STUDY1 — Research Log

## 2026-08-27 — Study-start audit

- Re-fetched remote `main` and confirmed `db6980bffb7e6853751914da628db8936c76d81e` exactly matches the post-G2-01 provenance anchor supplied at handoff.
- Confirmed zero open pull requests.
- Audited Research Generation 2 residual branches. `research/g2-01-position-evaluation-empirical-outcome-calibration-replication` and `research/g2-01-stage1-implementation-backup` were both behind `main` and `ahead_by = 0`; no unintegrated competing G2 work existed.
- Reconstructed Research Generation 2 common contract and G2-02 agenda position from `FUTURE_RESEARCH_AGENDA.md`, `RESEARCH_INDEX.md`, and the second-generation program decision.
- Reconstructed `PEOCR-STUDY1 = INCONCLUSIVE` and its strict no-rescue boundary.
- Reconstructed Position Complexity / Difficulty Study 1 as `INCONCLUSIVE`, with PCX-H1 `INCONCLUSIVE` and PCX-H2 `NOT-CONFIRMATORILY-EVALUATED`.

## 2026-08-27 — Search implementation audit

Current `public/ai.js::analyzeMove()` supports `maxDepth`, `timeLimitMs`, quiescence depth/order controls, TT/history ordering controls, aspiration settings and stable-best/adaptive controls. Existing position-complexity diagnostics expose exhaustive legal-root scores, exact ties, TopSet, canonical best and ranking information.

Dedicated deterministic node-budget semantics and reproducible PV reconstruction were treated as Stage 0 technical feasibility questions rather than assumed scientific capabilities.

## 2026-08-27 — Prospective study freeze

Frozen:

```text
Program label = G2-02
Study ID = SRDR-STUDY1
Formal title = Search Reliability / Decision Robustness Study 1
Branch = research/g2-02-search-reliability-decision-robustness
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
```

No scientific G2-02 outcome existed at this freeze point.

## 2026-08-27 — Stage 0 technical validation

- Stage 0 source hashes were frozen before technical execution.
- Controlled search instrument matched existing exact-root diagnostics on frozen fixtures.
- RAW identity/source non-mutation, repeat determinism, node-budget semantics and deterministic PV reconstruction passed.
- Node-budget decisions were fixed to the last fully completed all-root-candidate iterative-deepening depth; partial root iterations are discarded.
- Move ordering was observed to affect node consumption even when complete-depth scores were unchanged, so scientific move ordering was required to be fixed.
- Stage 0 decision: `PASS`.

## 2026-08-27 — Stage 1 prospective freeze and authorization

Stage 1 froze before scientific generation:

```text
games = 1280
seeds = 25011001..25012280
one state per historical trajectory
RAW-state dedup
no seed extension
no replacement
search grid = D1_Q1, D2_Q1, D3_Q1, D2_Q0, D2_Q2, B64, B256, B1024
move ordering = canonical lexical
score tie tolerance = 0
```

The final preauthorization and source-freeze commit was `753425610573354ae6394ae414666c3bc62c5365`. Stage 1 authorization was committed at `eed7c6adbc234f5c3bf95b6bcd35b67d68b0eada` and run `33067208005` consumed exactly the reserved Stage 1 seed block.

## 2026-08-27 — Stage 1 generation and independent-verifier fail-closed event

Stage 1 production completed:

```text
games = 1280
unique historical trajectories = 1057
distinct opening prefixes = 1057
selected unique RAW states = 1018
Namua = 527
Mtaji = 491
selection hash = ed00623f244310b29bc25c0885f287321d4430df1b4d8e4a3a061c06dfc62052
stored production measurement hash = 9b3425d546bdb59176fb49711161b0d5b79fb368039d65a89946ad37efb98532
```

The frozen independent verifier completed all 1280 game replays and all 1018 remeasurements with zero game, selection, and measurement-row mismatches. Selection hash matched. It nevertheless failed closed because its aggregate canonical measurement hash was `76225f2d76176ab13bfa34566874b13e14b97c587b1505877504b0aa68959eea`, not the stored production pre-serialization hash.

Readiness analysis was therefore correctly skipped at that point.

## 2026-08-28 — Stage 1 verification serialization defect investigation

The original Stage 1 artifact was retained and investigated without generating any new scientific trajectory or remeasuring any scientific state.

Root cause was reproduced exactly:

- exact-depth production compact objects contained `attemptedDepth: undefined` and `abortedDepth: undefined` in memory;
- the frozen production `stableStringify()` encoded those object keys as literal `undefined` in the pre-persistence measurement hash;
- normal JSON persistence omitted object properties whose values were `undefined`;
- the independent verifier reconstructed semantically identical rows but did not create the two undefined-only fields;
- canonical hashing of the persisted artifact exactly reproduced the independent verifier hash;
- restoring the two undefined fields exactly reproduced the stored production hash.

This was classified as a representation-only verification-hash serialization defect, not a scientific measurement mismatch. No search result, trajectory, RAW state, move identity, score, TopSet, ranking, PV, search grid, endpoint, threshold, seed, or selection was changed.

Correction ID:

`SRDR-S1-VERIFICATION-HASH-CORRECTION-2026-08-28-v1`

## 2026-08-28 — Stage 1 corrected verification and development profile

Correction workflow run `33123555267` passed all strict forensic preconditions and then applied the already-frozen Stage 1 analyzer.

Canonical artifact:

```text
artifact ID = 9667419537
artifact = g2-02-stage1-development-v1-verified-canonical
ZIP SHA-256 = 41c6b9940798aa1626b0c73279a47b53dbc3e14316d0cb75f48f4d194f5c8cf8
canonical persisted / independent measurement hash = 76225f2d76176ab13bfa34566874b13e14b97c587b1505877504b0aa68959eea
```

All frozen Stage 1 readiness gates passed.

Stage 1 decision:

```text
PROFILE-FROZEN-DEVELOPMENT
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

Stage 1 rows remain non-confirmatory development evidence and are prohibited as Stage 2 formal rows.

## 2026-08-28 — Stage 2 formal rule freeze

Before any Stage 2 scientific outcome, Stage 2 froze:

```text
games = 1536
seeds = 25021001..25022536
maxPly = 80
no extension
no replacement
search grid unchanged from Stage 1
```

A three-part consumed-identity firewall was frozen against the immutable corrected Stage 1 artifact:

1. historical trajectory overlap exclusion;
2. opening-prefix overlap exclusion;
3. selected authoritative RAW-state overlap exclusion.

All exclusions are no-replacement and post-firewall overlap must be zero.

Primary formal criterion `mixed-material-sensitivity-and-high-budget-convergence/v1` froze three decision-bearing Wilson-lower-bound conditions:

```text
P1 depth disagreement lower bound >= 0.20
P2 quiescence disagreement lower bound >= 0.20
P3 B1024-to-D3 agreement lower bound >= 0.90
```

All three are required for `CONFIRMED` after all formal gates pass. Gate failure yields `INCONCLUSIVE`; gate pass plus any primary criterion failure yields `NOT-CONFIRMED`.

Stage 2 also prospectively fixed measurement hashing to JSON-roundtrip the measurement core before stable serialization, preventing recurrence of the Stage 1 undefined-field split.

## 2026-08-28 — Stage 2 preauthorization and explicit authorization

After the Stage 2 formal workflow was added, the preauthorization workflow trigger coverage was found not to include the newly added Stage 2 workflow files. Because Stage 2 scientific generation had not been authorized and no reserved Stage 2 seed had been used, the trigger coverage was repaired prospectively.

The final common source commit was:

`e176cafc15d2dde7b8767de6961959bb7ee9bb7b`

On that exact commit:

```text
preauthorization run 33124483699 = success
source-freeze run 33124483869 = success
Stage 2 spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
reserved Stage 2 seed consumed before authorization = false
```

Explicit Stage 2 authorization was then committed at:

`bec87d54540c96c24353f2eeadc25338c53e54eb`

Formal workflow run `33124538584` passed the explicit authorization gate, downloaded the immutable Stage 1 consumed-identity firewall artifact, and entered the frozen Stage 2 generation/firewall-selection/measurement step.

No formal result has yet been declared. No rescue modification is authorized in response to the Stage 2 outcome.

## 2026-08-28 — Stage 1 verification correction

- Recovered the original Stage 1 artifact without consuming new scientific seeds.
- Confirmed 1280/1280 replay, 1018/1018 selected-state measurements and zero row mismatches.
- Isolated the aggregate hash discrepancy to pre-serialization `undefined` keys omitted by JSON persistence.
- Ran representation-only correction; no scientific row, grid, seed or criterion changed.
- Stage 1 decision fixed as `PROFILE-FROZEN-DEVELOPMENT`.

## 2026-08-28 — Stage 2 formal closure

- Source-freeze commit: `e176cafc15d2dde7b8767de6961959bb7ee9bb7b`.
- Explicit authorization commit: `bec87d54540c96c24353f2eeadc25338c53e54eb`.
- Formal workflow run `33124538584` completed successfully.
- 1536/1536 games generated and independently replayed.
- 1007 selected RAW states independently remeasured; selection/measurement mismatches 0; hashes exact-match.
- Stage 1 cross-stage overlap: trajectory/opening-prefix/RAW state = `0 / 0 / 0`.
- One frozen estimability gate failed: `1040 < 1050` unique historical trajectories after firewall.
- Formal decision fixed as `INCONCLUSIVE`; `primaryFormalCriterion = null`.
- No rescue, extension, replacement or threshold relaxation performed.
