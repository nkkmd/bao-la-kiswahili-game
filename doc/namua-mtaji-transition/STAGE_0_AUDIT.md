# Stage 0 Audit — Schema / Engine / Artifact / Replay Feasibility

Date: 2026-08-10  
Status: **audit design complete / technical execution pending / no formal experiment authorized**  
Study: **Namua→Mtaji Strategic Temporal Transition**  
Branch: `research/namua-mtaji-temporal-transition`

## 1. Purpose

Stage 0 establishes whether the repository can support a prospective temporal study connecting the frozen Namua `capture-branch-expansion` phenotype to formal Namua→Mtaji transition and frozen Mtaji morphology without changing either closed Study 1.

Stage 0 is a technical/design audit.

It is **not**:

- a new formal experiment;
- a test of RQ1-RQ4;
- a source of confirmatory p-values;
- a place to choose favorable windows, thresholds, comparators or effect directions;
- a reanalysis that changes a closed Study result.

## 2. Stage 0 questions

Stage 0 must answer:

1. Can every relevant per-ply state be reconstructed deterministically?
2. Can the frozen `capture-branch-expansion` classifier be applied unchanged to a fresh new-study corpus?
3. Can first formal Mtaji be detected unambiguously from engine state/replay?
4. Can the first Mtaji state be classified by the frozen MTAJI-M1/M2 artifact without refit?
5. Does the observation/game schema contain all variables needed for RQ1-RQ3?
6. Can terminal-before-Mtaji and max-ply truncation be distinguished?
7. Can multiple candidate events and overlapping temporal episodes be represented without treating raw ply as independent?
8. Can all source/protocol/artifact identities be hashed and verified before a future formal run?

## 3. Existing assets audited from `main`

### 3.1 Engine

Primary source:

```text
public/engine.js
```

Available state:

```text
pits
reserve
houseOwned
player
phase
winner
reason
turn
pending
```

Available deterministic APIs:

```text
initialState()
legalMoves()
moveVariants()
applyMove()
```

`applyMove()` emits physical/rule events including reserve, sow, capture, relay, phase, turn and win events.

### 3.2 Phase-transition feature source

```text
tools/experiments/lib/phase-transition-features.js
```

Current observation fields include:

- `phase`
- `reserve[2]`
- `houseOwned[2]`
- `pending[2]`
- `legalMoveCount`
- `captureMoveCount`
- `nonCaptureMoveCount`
- `forcedCapture`
- board/global counts
- front-row occupancy/seeds
- historical `stateHash`

### 3.3 Frozen candidate/regime source

```text
tools/experiments/lib/forced-capture-regimes.js
```

The new study may call the existing functions but must not change the Study 1 semantics when using the inherited phenotype name.

### 3.4 Position-typology feature source

```text
tools/experiments/lib/position-typology-features.js
schemas/position-typology-observation.schema.json
```

This provides full board state and actor/opponent primitives sufficient for most planned RQ2 variables.

### 3.5 Proven replay pattern

```text
tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py
tools/experiments/replay-position-typology-stage6-candidate-states.js
```

Existing replay QA checks:

- archived observation stateHash at every replayed ply;
- move `beforeStateHash` / `afterStateHash` where present;
- phase agreement between archived candidate row, archived observation and replayed state;
- deterministic move replay from `initialState()`;
- no archive patching on mismatch.

This should be treated as the minimum replay standard for the new study.

## 4. Engine semantics audit

### 4.1 Formal phase transition

Current implementation changes phase in `finishTurn()` when:

```text
state.phase === "namua"
&& state.reserve[0] === 0
&& state.reserve[1] === 0
```

then:

```text
state.phase = "mtaji"
```

Required Stage 0 regression tests:

1. phase begins as `namua`;
2. no `mtaji -> namua` reversion is possible on reachable test sequences;
3. transition occurs exactly after the move/turn that exhausts both reserves;
4. first observation with `phase == mtaji` is reproducible from replay;
5. pass behavior when one player's reserve is already zero is handled correctly;
6. terminal-before-Mtaji states are distinguishable from phase transition;
7. phase event and observation phase agree;
8. max-ply truncation does not masquerade as terminal or Mtaji.

### 4.2 First-Mtaji definition candidate

Technical candidate definition:

```text
first observation in a game with phase == "mtaji"
```

For morphology classification candidate:

```text
phase == "mtaji"
terminal == false
ply >= 8
```

The latter mirrors the frozen Stage 2 primary population boundary.

Stage 0 must verify whether the first formal Mtaji observation can ever violate the frozen morphology population boundary in the intended new corpus. If yes, no silent fallback to the second/later Mtaji state is allowed; a policy must be frozen later.

## 5. Critical frozen-classifier look-ahead audit

The inherited Study 1 classifier uses:

```text
before = 3
after = 8
eventWindow = 8
```

and classifies a Namua candidate as `namua-to-mtaji-precursor` before testing expansion when first future Mtaji is within 8 ply.

Therefore for `capture-branch-expansion`:

```text
first future Mtaji distance <= 8
```

cannot occur under the frozen definition.

Also, expansion persistence requires future observations after the candidate.

Stage 0 technical requirement:

Create an **ascertainment record** for every candidate with at least:

```text
candidatePly
classificationKnownByPly
classificationLookAheadPly
firstMtajiPly
firstForcingReleasePly
terminalPly
maxObservedPly
```

Expected initial rule:

```text
classificationKnownByPly = candidatePly + 8
```

subject to exact technical treatment of available post-window observations and the inherited primary eligibility rule.

The future formal protocol must choose the survival time origin before held-out inspection.

## 6. New-study schema design

Do not mutate the closed Study schemas to make them retrospectively look like they were designed for this study.

Recommended approach:

```text
schemas/namua-mtaji-transition-observation.schema.json
schemas/namua-mtaji-transition-game.schema.json
```

or a single game-artifact schema containing full observations and moves.

### 6.1 Per-observation minimum

Reuse/compose position-typology observation content:

```text
schemaVersion
gameId
conditionId
seed
ply
player
phase
turn
terminal
winner
reason
state.pits
state.reserve
state.houseOwned
state.pending
identity.historicalStateHash
identity.ruleStateKey
identity.seatCanonicalKey
features.actor
features.opponent
features.difference
features.global
```

Required feature families already available:

- reserve;
- nyumba seeds / house ownership;
- legal move count;
- capture move count;
- forced capture;
- board/front/back seeds;
- occupied and reusable pits;
- front connections;
- max/mean capturable seeds;
- capture-event / relay / chain primitives;
- pit distribution summaries.

### 6.2 Per-move minimum

Store:

```text
ply
player
move
moveKey/source
beforeHistoricalStateHash
afterHistoricalStateHash
beforeRuleStateKey
afterRuleStateKey
secondary search metadata
```

Search metadata remain secondary and are not position-type features.

### 6.3 Per-game minimum

Store:

```text
gameId
gameIndex
seed
condition
configHash
sourceCommit/source hashes
opening identity
historicalTrajectoryHash
ruleTrajectoryHash
seatCanonicalTrajectoryHash
winner/reason/plies
firstMtajiPly or null
terminalPly
truncation status
```

Derived candidate/event tables should be reproducible from the game artifact rather than being the only scientific source.

## 7. Candidate extraction compatibility audit

A new-study observation adapter must expose exactly the fields required by `forced-capture-regimes.js`:

```text
gameId
ply
phase
forcedCapture
captureMoveCount
```

For every fresh smoke game:

1. derive the legacy-compatible view from new observation objects;
2. run `extractForcedCaptureRegimes()`;
3. run the existing candidate pipeline / candidate metrics without modifying thresholds;
4. verify candidate classification against an independent recomputation path on selected deterministic fixtures;
5. record source-file SHA-256 for all inherited classifier files.

If a new wrapper changes only field mapping, it must prove semantic identity with the old classifier on fixture/replay data.

## 8. MTAJI frozen artifact audit

RQ3 cannot proceed formally from documentation hashes alone.

Required artifact:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Artifact must contain the frozen:

- 40-feature order;
- log1p field set;
- discovery StandardScaler parameters;
- discovery K-means centroids;
- raw-label → `MTAJI-M1/M2` mapping.

Stage 0 actions:

1. locate the exact local artifact used by Stage 2/Stage 6;
2. compute canonical artifact hash using the same historical hashing rule;
3. verify equality with `7a276...`;
4. record path as local provenance only, not as an assumed repository path;
5. run a small known-state classifier fixture or historical technical replay to prove compatible feature ordering;
6. fail closed if artifact is unavailable or hash mismatches.

No reconstruction of a "close enough" classifier from report statistics is permitted.

## 9. Replay feasibility audit

New-study verifier must reconstruct every game from:

```text
E.initialState()
+ stored move sequence
```

Required checks at every ply:

- observation historical hash matches replay;
- observation rule-state key matches replay;
- move before hash matches;
- move after hash matches;
- stored phase matches replay phase;
- stored reserve/house state matches replay;
- first-Mtaji ply recomputation matches stored summary;
- terminal reason/winner matches;
- trajectory hashes recompute exactly;
- candidate target boards can be reconstructed exactly;
- first Mtaji board can be reconstructed exactly.

Any mismatch stops the affected technical run. Do not patch outputs to force consistency.

## 10. Source provenance audit

Recommended source-file hash set includes at least:

```text
public/engine.js
public/ai.js
public/ai-config.js
public/ai-weights.js
tools/benchmark.js
tools/symmetry/transform-candidates.js
tools/experiments/lib/phase-transition-features.js
tools/experiments/lib/forced-capture-regimes.js
tools/experiments/lib/position-typology-features.js
new-study runner
new-study verifier
new-study schema(s)
future candidate/event analyzer
frozen MTAJI artifact hash
future preregistration spec hash
```

Formal runs must require the intended source state and preregistration identity.

## 11. Smoke corpus boundary

Stage 0 smoke is technical only.

It may use a small fresh seed block selected solely for instrumentation validation.

The smoke may inspect:

- schema validity;
- replay validity;
- phase transition detection;
- candidate extraction execution;
- whether both Namua/Mtaji occur at all;
- whether first Mtaji can be classified technically;
- whether terminal/max-ply status is encoded;
- whether multiple events can be represented.

It must not be used to:

- choose effect direction;
- estimate scientific association;
- optimize comparator;
- fit a favorable time window;
- select a formal model based on outcome significance.

## 12. Fresh exploratory pilot audit requirements

Stage 1, not Stage 0, will quantify the design distributions needed before freeze.

Required pilot outputs:

### 12.1 Event availability

By condition:

```text
games
unique trajectories
Category-A candidates
capture-branch-expansion
temporary-spike
capture-branch-convergence
namua-to-mtaji-precursor
forcing-release-precursor
```

Report raw rows and trajectory-aware counts separately.

### 12.2 Temporal support

For each candidate group:

- candidate ply;
- ascertainment/landmark ply;
- raw candidate-to-Mtaji distance;
- post-ascertainment time-to-Mtaji;
- total/actor/opponent reserve at origin;
- natural terminal-before-Mtaji count;
- max-ply truncated count;
- reached-Mtaji count.

### 12.3 Multiple-event structure

- events per game;
- events per unique trajectory;
- class multiplicity;
- mixed classes in one trajectory;
- overlapping episode count;
- repeated `trajectoryHash + candidatePly` units;
- duplicate trajectory groups.

### 12.4 Comparator feasibility

Assess availability/overlap, not significance hunting:

- reserve overlap;
- condition overlap;
- candidate/regime context overlap;
- event-origin support;
- censoring/competing-event balance;
- sample-size feasibility.

### 12.5 First Mtaji morphology feasibility

- first Mtaji reached count;
- first Mtaji non-terminal eligible count;
- frozen classifier technical success count;
- M1/M2 counts as exploratory feasibility only;
- any classifier-ineligible first Mtaji states.

The Stage 1 pilot is consumed after inspection and cannot become the formal held-out corpus.

## 13. Statistical design decisions explicitly deferred

Stage 0 does not freeze:

```text
primary comparator
primary statistical unit
time origin
survival model
competing-risk model
reserve adjustment policy
RQ2 functional model
formal condition set
seed block
sample size
alpha / decision threshold
hypothesis direction
```

Reason:

These depend on feasibility/support and must be frozen only after a fresh exploratory pilot, not guessed from old corpora or optimized on formal data.

## 14. Stage 0 deliverables to implement next

Recommended implementation sequence:

```text
1. schemas/namua-mtaji-transition-observation.schema.json
2. schemas/namua-mtaji-transition-game.schema.json
3. tools/experiments/lib/namua-mtaji-transition-features.js
   - or a minimal adapter around position-typology features
4. tools/experiments/run-namua-mtaji-transition-smoke.js
5. tools/experiments/verify-namua-mtaji-transition-smoke.js
6. test/namua-mtaji-transition-features.test.js
7. test/namua-mtaji-transition-engine.test.js
8. local Stage 0 smoke artifacts under artifacts/local/
9. STAGE_0_RUNBOOK.md
10. STAGE_0_RESULT.md after local execution
```

Names may be adjusted if repository conventions require, but the scientific boundaries above must remain.

## 15. Stage 0 completion gate

Stage 1 exploratory pilot is not authorized until all are true:

1. new schema validation passes;
2. inherited feature/classifier compatibility tests pass;
3. engine phase-transition regression tests pass;
4. full replay verification passes;
5. first-Mtaji detection recomputes exactly;
6. source provenance/hash checks pass;
7. frozen MTAJI artifact is found and hash-verified, or RQ3 is explicitly deferred;
8. smoke corpus remains clearly marked technical/non-scientific;
9. no formal seed block has been inspected;
10. Stage 1 pilot protocol is documented before pilot generation.

## 16. Current conclusion

Repository feasibility is promising because the engine, full-state position extractor, frozen candidate classifier, trajectory identities, and Stage 6 deterministic replay machinery already exist.

The largest methodological risks are not missing code primitives. They are:

1. look-ahead/immortal-time structure induced by the frozen 8-ply phenotype definition;
2. mechanical dependence of formal phase transition on reserve depletion;
3. multiple event episodes within trajectories;
4. distinguishing natural terminal competing events from administrative truncation;
5. ensuring the actual frozen Mtaji classifier artifact remains available and hash-identical.

These risks are now explicit before any new scientific corpus is generated.
