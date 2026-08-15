# RESEARCH_PLAN — Tactical Motifs / Tesuji Study 1

## 1. Objective

Determine whether Bao contains reproducible, position-transferrable structural move principles that can be operationally defined as tactical-motif / tesuji candidates and independently confirmed on fresh positions.

The success criterion is not the production of a tesuji dictionary. `no reproducible tesuji candidate`, `candidate not-confirmed`, `insufficient estimability`, or `technical inconclusive` are valid outcomes.

## 2. Core scientific distinction

The study keeps the following concepts separate:

1. **best move** — a move attaining the highest value under a specified frozen search/evaluator setting.
2. **tactical sequence** — a bounded move/reply sequence from one root state.
3. **forced sequence** — a bounded sequence in which the relevant reply set is uniquely constrained at specified plies.
4. **local structural motif** — a recurring precondition + move-family + state-transformation signature; no transferability claim yet.
5. **position-transferrable tesuji candidate** — a local motif recurring across independent historical trajectories and non-identical rule states under a frozen abstract matching rule.
6. **confirmed tesuji** — a frozen candidate that passes a fresh prospective Stage 2 decision rule.
7. **opening joseki** — knowledge whose validity is anchored to an opening sequence/prefix.
8. **general strategic principle** — a broader heuristic not necessarily reducible to one operational move family.
9. **human/expert-recognized tesuji** — requires independent expert validation and is outside Study 1.

## 3. Stage 0 — technical / representation audit

### 3.1 Identity

Retain three distinct identities:

- `historicalStateHash` for historical trajectory identity.
- `ruleStateKey` for exact rule-state duplicate detection.
- `seatCanonicalKey` for the already validated player-seat exchange only.

Do not substitute `AI.stateKey` for `ruleStateKey`: their field coverage differs.

### 3.2 Move identity

Use `AI.moveKey(move)` for exact moveVariant identity. Namua house-choice variants are distinct where `E.moveVariants()` exposes distinct outcomes.

### 3.3 Actor orientation

Structural comparisons are expressed relative to root actor/opponent. Seat exchange is allowed only through the already validated `mirrorState` / `mirrorMove` transformation. No horizontal reflection, pit-index reversal, or direction reversal is assumed valid for motif canonicalization.

### 3.4 Immediate transformation representation

For every root moveVariant, Stage 1 instrumentation may record:

- actor/opponent structural features before and after
- deltas in reserve, nyumba seeds, board/front/back seeds
- occupied/reusable pits, front occupancy/connections
- legal/capture move counts and forced-capture status
- capture/relay/chain counts and captured seeds
- pit-seed variance/concentration
- house-ownership change
- normalized capture/relay/sow event locations
- terminal state/reason
- opponent reply-set size and forced/free status

The engine event stream is authoritative. Any derived landing/endpoint quantity must be named as a derived event measure, not an engine-native `relayEndpoint` field.

### 3.5 Search/value instrumentation

Reuse `position-complexity-search-diagnostic.js` only as technical instrumentation. Exact D1/D2/D3 root-candidate values, tie-aware top sets and value gaps may be measured. This does **not** re-open Position Complexity Study 1.

The current diagnostic does not return a search-consistent PV. Therefore Stage 1 should prefer response-set / response-envelope summaries over a fabricated principal line unless a separate PV tracer is implemented and validated before Stage 1 generation.

## 4. Stage 1 — prospective exploratory discovery

Stage 1 may begin only after a machine-readable exploratory spec is committed and validated.

### 4.1 Corpus principles

- entirely fresh seed block, non-overlapping with Stage 2
- fixed game count and max-ply before generation
- deterministic seed-to-condition assignment
- no outcome-dependent extension or replacement
- scientific artifacts only under `artifacts/local/`
- no large scientific generation in GitHub Actions

### 4.2 Trajectory diversity

Use prospectively frozen trajectory-generation strata rather than a single opening line. The exact strata and sample size must be frozen before generation. Policy/search condition is metadata and a transferability dimension, not a tesuji label.

### 4.3 Sampling and pseudoreplication control

Preferred design:

- retain at most one outcome-independently selected root state per phase per unique historical trajectory;
- selection rank derived from pre-frozen hash salts, not motif outcome;
- collapse identical `ruleStateKey` roots globally;
- keep trajectory ID as the primary recurrence/support unit;
- audit opening-prefix concentration so one opening family cannot masquerade as transferability;
- no discovery state may be reused in Stage 2.

A root with only one legal move may describe a forced state but should not by itself establish a reusable move-choice principle. Eligibility for a tesuji candidate should normally require at least two legal moveVariants at the candidate root; forced replies after the candidate move remain scientifically relevant.

### 4.4 Discovery representation

Analyze all eligible legal moveVariants rather than only AI-selected best moves. Keep distinct axes:

- structural precondition
- move family
- immediate state transformation
- reply forcing/free structure
- exact search value/rank under frozen depths
- downstream response-envelope consequences
- frequency/support across independent trajectories

Exploratory clustering, rule induction, or candidate-family construction may be used, but smallest-p-value selection is not a promotion rule.

### 4.5 Candidate promotion to Stage 2 planning

Before Stage 1 generation, the exploratory spec must freeze a promotion rule with minimum support and transferability gates. At minimum it must require:

- multiple unique historical trajectories
- multiple non-identical rule states
- no exact-state duplicate inflation
- opening-prefix concentration below a frozen domination threshold
- a reproducible move/transformation matching rule
- sufficient independent instances to make a Stage 2 estimability calculation possible

Phase-specific or search-condition-specific candidates may be retained, but must be explicitly bounded rather than presented as universal Bao tesuji.

Candidate families listed in the study prompt (capture delay, relay-ending change, forced capture, nyumba sacrifice, reserve-placement plans, front-row sacrifice for mobility) remain hypothesis-generating examples only. Discovery is allowed to produce none, some, or different families.

## 5. Stage 2 — fresh prospective formal confirmation

Stage 2 is a separate authorization boundary. For each candidate/family, freeze before generation:

- candidate definition
- eligible population
- state/move matching rule
- outcome and comparator
- effect direction where directional
- statistical unit
- exact duplicate and trajectory handling
- sample-size / estimability gate
- multiplicity control and alpha
- decision/failure/no-rescue rules
- fresh seed block

The machine-readable Stage 2 spec and explicit generation authorization must be committed before any formal data are created.

## 6. Interpretation boundary

Machine-reproducible confirmation supports only the frozen operational motif claim. It does not establish traditionality, expert recognition, pedagogical importance, or human strategic salience. Those require a separate expert-validation study.
