# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## Current state

**ACTIVE — Stage 0 technical / representation audit completed and technically validated; Stage 1 design/specification is next.**

Baseline `main` HEAD was verified at study start as:

`08c70ba6ac980884d51562c207410db3521b8ae4`

This exactly matched the pre-chat recorded HEAD, so no intervening-main diff audit was required.

Branch: `research/tactical-motif-discovery`

Stage 0 initialization commit: `de4931fb20c218c0d4b3d13689cf79af400e89bd`

Technical validation workflow: `Tactical motif Stage 0 technical validation`, run `31768708597`, conclusion `success`.

## Scientific authorization state

- Stage 0 technical inspection: **COMPLETE / VALIDATED**
- Stage 1 scientific corpus generation: **NOT YET AUTHORIZED**
- Stage 1 exploratory inference: **NOT STARTED**
- Stage 2 formal corpus generation: **NOT AUTHORIZED**
- Any `confirmed tesuji` claim: **NOT AUTHORIZED**
- Human/expert/traditional tesuji claim: **OUT OF SCOPE for Study 1**

No scientific corpus has been generated for this study.

## Restored immutable boundaries

### Phase Transition Study 1

`capture-branch-expansion` remains a bounded strategic-transition phenotype, not a universal Bao law and not a confirmed tesuji. E-010=`not-confirmed`, E-011=`inconclusive`, E-017=`not-confirmed`, E-018/H16 only fixed hard/bao/D2 phase2>legacy confirmed, E-019/H17 global=`not-confirmed`, E-020/H18 only fixed hard/bao/D3 legacy>phase2 confirmed.

### Position Typology / Playing Style Study 1

MTAJI-M1/MTAJI-M2 remain bounded confirmed morphology. Namua has no confirmed discrete type. N-ACT/N-CON are exploratory continuous coordinates. Discrete playing-style clustering is unsupported. STYLE-C1..C4 exact geometry is formal `not-confirmed`.

### Namua→Mtaji Transition Study 1

Formal decision remains `NOT-CONFIRMED`. Current engine makes first Mtaji observation deterministic at ply 44 for games reaching Mtaji. time-to-first-Mtaji / survival / hazard / acceleration / delay are not strategic endpoints for reuse.

### Position Complexity / Difficulty Study 1

Study is closed. PCX-H1=`INCONCLUSIVE`; PCX-H2=`NOT-CONFIRMATORILY-EVALUATED`; overall=`INCONCLUSIVE`. The reported p-values cannot override preregistered convergence/gatekeeping failures. This study will not rescue or re-test those hypotheses.

### Joseki Study 1

Opening-sequence knowledge remains separate from position-transferrable tesuji. A move or sequence that is useful only under a specific opening prefix cannot be promoted as a tesuji on that evidence alone.

## Stage 0 audit result

The current codebase supports:

- `historicalStateHash`: history-sensitive identity including turn/reason bookkeeping.
- `ruleStateKey`: rule-state identity that deliberately ignores turn/reason.
- `seatCanonicalKey`: validated South/North seat-exchange canonicalization.
- `AI.moveKey`: moveVariant identity including Namua `houseChoice` and `houseTwo`.
- actor/opponent structural features: reserve, house/nyumba, occupancy, connections, reusable pits, mobility/legal moves, capture options, capture/relay morphology, seed-distribution statistics.
- engine event stream: reserve/lift/sow/capture/relay/phase/turn/win/limit snapshots.
- exact fixed-depth root candidate values at D1/D2/D3 under named evaluator profiles.
- immediate opponent reply-set cardinality and forced/free reply classification.

The new `tactical-motif-features.js` and its Stage 0 test passed together with prerequisite symmetry, position-typology, and exact-root diagnostic tests in GitHub Actions.

Current explicit limitations:

- validated canonical symmetry is seat exchange only; horizontal column/direction reflection must not be assumed.
- engine does not expose a dedicated `relayEndpoint` field; a clearly named landing/event-derived measure can be constructed, but must not be silently called an engine-native endpoint.
- current exact-root diagnostic does not expose a search-consistent principal variation. Stage 1 must not present an independently replayed greedy line as the original search PV.

## Next readiness gate

Before Stage 1 corpus generation, freeze a machine-readable exploratory spec covering:

- fresh seed block and number of games
- trajectory-generation conditions
- maximum ply and stopping rule
- outcome-independent state sampling
- historical-trajectory deduplication
- exact rule-state duplicate collapse
- opening-family concentration audit
- structural feature set and candidate representation
- search depths/evaluator semantics
- candidate-family promotion rule
- failure/no-rescue rule
- explicit statement that Stage 1 cannot authorize Stage 2 generation

Until that spec is committed and technically validated, scientific generation remains blocked.
