# SRDR-STUDY1 — Decision Register

## D-001 — Study identity

Date: 2026-08-27

`G2-02` is instantiated as a new independent Research Generation 2 Study.

```text
Formal title = Search Reliability / Decision Robustness Study 1
Study ID = SRDR-STUDY1
Japanese working title = Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性のprospective検証
```

`G2-02` remains the Agenda sequence label, not the formal Study ID.

## D-002 — Baseline and branch

```text
Study-start remote main = db6980bffb7e6853751914da628db8936c76d81e
Prior expected main = db6980bffb7e6853751914da628db8936c76d81e
Match = true
Research branch = research/g2-02-search-reliability-decision-robustness
Open PRs at start = 0
```

Residual G2-01 branches were behind `main` with no commits ahead and are not competing active research branches.

## D-003 — Research Generation 2 position

`SRDR-STUDY1` is the Wave A / P0 `G2-02` measurement-foundation Study. It is independent of G2-01 and precedes downstream uses of search-reliability information in G2-06 / G2-08 / G2-10.

## D-004 — Upstream immutable decisions

The following remain immutable:

```text
PEOCR-STUDY1 = INCONCLUSIVE
Position Complexity / Difficulty Study 1 overall = INCONCLUSIVE
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

G2-01 data and Position Complexity scientific rows are prohibited as G2-02 formal evidence. Prior instruments and failure modes may inform technical design and resource planning only.

## D-005 — Primary construct boundary

Primary construct:

```text
machine search reliability / decision robustness
under prospectively frozen search-condition perturbations
```

Not equivalent to human difficulty, structural complexity, empirical win probability, game-theoretic value, engine evaluation correctness, public-AI strength or human perception.

A higher-resource condition is a `frozen search reference` only and never an oracle of true optimal play.

## D-006 — RAW state identity

Formal identity is:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` / `reason` are excluded. Symmetry reduction, reflection equivalence, player-seat canonicalization, state canonicalization and unvalidated isomorphism are forbidden for formal deduplication.

## D-007 — Stage structure

Fixed at Study start:

```text
SRDR-S0-TECHNICAL-2026-08-27-v1
SRDR-S1-DEVELOPMENT-2026-08-27-v1
SRDR-S2-FORMAL-2026-08-27-v1
```

Stage 0 is technical/non-scientific. Stage 1 is fresh development/construct characterization and is consumed after inspection. Stage 2 is fresh held-out formal replication.

## D-008 — Stage 0 technical spec

The Stage 0 machine-readable spec is frozen at:

```text
preregistration/STAGE_0_TECHNICAL_SPEC.json
SHA-256 = 12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
scientificSeedUseAllowed = false
```

## D-009 — Candidate search axes

Stage 0 must technically evaluate:

```text
depth
node budget
quiescence depth / enablement
quiescence capture ordering
move ordering
aspiration
adaptive / stability controls
TT ordering / history heuristic
principal variation extraction
```

The intended scientific sensitivity axes are depth, node budget and quiescence. Other controls remain technical unless prospectively promoted before Stage 1 generation.

No unrestricted factorial grid is authorized.

## D-010 — Current implementation audit

Current public `AI.analyzeMove()` supports fixed depth, quiescence depth, quiescence capture ordering, TT move-first, history heuristic, aspiration window, stable-best controls and time limits.

Existing Position Complexity diagnostic supports exhaustive exact legal root candidate scoring, deterministic TopSet/ranking and depth transitions.

Current public API does not expose a dedicated node-budget cap or a PV sequence. These may be implemented only as Stage 0 research instrumentation and must pass determinism / semantics / independent-verification gates before Stage 1 use.

## D-011 — Move / tie / ranking / PV rules

Exact Stage 1 rules for move identity, canonical tie-break, TopSet, Top-k, ranking ties, score tolerance, score-domain handling and PV comparison must be frozen before Stage 1 scientific outcome generation.

No result-dependent tie-tolerance or TopSet change is authorized.

## D-012 — Population / firewall principle

Fresh historically reachable RAW states will be used. Selection must be search-reliability-outcome-blind. Historical trajectory deduplication, opening-prefix dependence, RAW-state deduplication, prospective phase balance and one-state-per-trajectory principle must be resolved before Stage 1 authorization.

Stage 1 scientific units are consumed and cannot be reused as Stage 2 formal evidence.

## D-013 — Formal decision taxonomy

Study-level taxonomy is frozen as:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE
```

All gates PASS + frozen scientific criterion PASS -> `CONFIRMED`.
All gates PASS + scientific criterion FAIL -> `NOT-CONFIRMED`.
Any preregistered identity / measurement / reproducibility / estimability gate failure -> `INCONCLUSIVE`.

Technical execution failure is not a scientific failure.

The numeric Stage 2 scientific criterion will be frozen after Stage 1 development and before any Stage 2 formal outcome, under a separate Stage 2 preregistration. It may not be changed after Stage 2 outcome inspection.

## D-014 — Authorization state

At Study start:

```text
Stage 0 execution = pending source/instrument freeze
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
```

Stage 1 requires Stage 0 PASS, exact population / seeds / search grid / metric definitions / source hashes / verifier / spec freeze and an explicit authorization record.

## D-015 — No-rescue and engineering separation

No post-outcome seed extension, favorable state replacement, search-grid substitution, threshold relaxation, tie tolerance change, subgroup rescue, failed-gate exception or alternate primary is authorized.

`PBAI-P1` and later AI engineering decisions cannot modify the G2-02 scientific decision.
