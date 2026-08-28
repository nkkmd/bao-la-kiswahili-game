# DRSSE-STUDY1 — Study-start prospective freeze

Date: 2026-08-28
Status: FROZEN BEFORE ANY G2-05 OUTCOME GENERATION
Program: G2-05 / Research Generation 2
Study ID: `DRSSE-STUDY1`
Formal title: **Deep RAW State-Space Enumeration Study 1**
Japanese working title: **Baoにおける深層RAW状態空間の完全列挙 — prospectively fixed roots に対する bounded-depth complete enumeration, reachable-state growth, branching structure, transposition structure, and tree/graph occurrence ratio の厳密解析**
Baseline remote `main`: `c515c36a9b27a796dc7eae13fd1b2cec2b9d3ea6`
Research branch: `research/g2-05-deep-raw-state-space-enumeration`

## Independence and no-rescue boundary

This is a new prospective independent Research Generation 2 Study. It does not reopen, rescue, revise, or reinterpret any completed upstream Study.

Immutable upstream state at study start:

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
SRDR primaryFormalCriterion = null
STSCV-STUDY1 = INCONCLUSIVE
STSCV T01/T02/T03 = NON-ESTIMABLE
validated transform set = []
canonicalization = NON-ESTIMABLE / not authorized
REEOE-STUDY1 = INCONCLUSIVE
REEOE Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
fresh G2-04 exact oracle produced = false
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

G2-04 selected roots, partial closures, closure classifications, and resource failures are not G2-05 target-selection inputs. G1 SSGTC depth-8 results may be used only as an immutable technical positive fixture/resource-planning reference, never as fresh G2-05 formal evidence.

## Authoritative representation

Scientific state identity is RAW-only and contains exactly:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

`turn` and `reason` are excluded. Missing `pending` fails closed. Every accepted state must satisfy:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

No symmetry reduction, canonicalization, player-swap equivalence, left-right equivalence, quotient graph, or symmetry-reduced counting is authorized. The transformation set available to this Study is exactly `[]`.

## Move / successor identity

The exact move identity fields are frozen as:

```text
type, phase, row, index, direction, side, houseChoice, houseTwo
```

Undefined optional fields serialize as empty fields in the exact move key; `houseTwo` serializes explicitly as boolean. Every studied edge binds:

```text
source RAW key -> exact move key -> successor RAW key
```

through current frozen engine semantics `moveVariants` followed by `applyMove`.

## Scientific question

Can complete forward enumeration from a prospectively fixed Bao RAW root be performed through a frozen bounded depth, with every layer complete, and can exact layer-wise RAW reachable-state structure, legal branching, RAW transpositions, tree occurrence multiplicity, and tree/graph occurrence ratio be independently reproduced?

This Study does not estimate total Bao state-space size, total game-tree complexity, unbounded reachable states, or asymptotic growth. Those remain outside G2-05 and belong to a later prospective estimation Study, especially G2-12.

## Layer semantics

For depth `d`, `U_d` is the set of distinct authoritative RAW states reachable by at least one legal path of exactly `d` plies from the frozen root. A RAW state may therefore appear in more than one depth layer if the rules permit re-arrival at different path lengths.

`newRawStateCount[d]` counts states in `U_d` not seen in any earlier layer. `cumulativeRawStateCount[d]` is the union size through `d`.

Tree occurrences are not deduplicated: each legal path occurrence is counted. Tree occurrence multiplicity is propagated exactly per RAW state and depth. The RAW graph and game-tree occurrence structure are always reported separately.

## Complete-layer rule

An exact depth-`D` claim requires every legal edge from every nonterminal state in exact-depth layers `0..D-1` to be generated and independently verified, producing complete layers `0..D`.

If expansion stops while producing layer `d`, that layer is incomplete. Only `lastCompleteDepth < d` may retain exact bounded-layer status; the incomplete layer and all deeper layers are not exact evidence.

The result must report `lastCompleteDepth` and `firstIncompleteDepth`.

## Stage identities

```text
Stage 0 = DRSSE-S0-TECHNICAL-2026-08-28-v1
Stage 1 = DRSSE-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = DRSSE-S2-FORMAL-2026-08-28-v1
```

Stage 0 is technical-only. Stage 1 is fresh development/resource characterization only. Stage 2 is formal and may run only after an explicit authorization commit.

## Stage 2 target fixed at study start

To eliminate post-development depth selection, the formal scientific target is frozen now, before Stage 0/1 outcomes:

```text
root = fresh reconstruction of the standard engine initial RAW state
target depth D = 9
complete parent layers required = 0..8
complete reachable exact-depth layers required = 0..9
representation = RAW-only
symmetry/canonicalization = forbidden
estimation = forbidden
```

This is a new G2-05 target. A successful depth-9 result will not revise the immutable G1 SSGTC depth-8 decision.

## Formal resource contract fixed at study start

The following ceilings may not be increased after any G2-05 outcome is observed:

```text
maximum cumulative distinct RAW states = 500000
maximum cumulative depth-labelled legal edges = 3000000
maximum unique parent-state expansions = 500000
maximum legal move evaluations = 3000000
maximum cumulative tree-node occurrences = 1000000000
maximum resident set size = 6442450944 bytes
maximum wall-clock / administrative cutoff = 1200 seconds
maximum uncompressed scientific artifact bytes = 1073741824
shard strategy = one deterministic shard, depth-by-depth
checkpoint strategy = deterministic per-layer audit checkpoints
restart rule = no checkpoint resume; a formal execution starts from depth 0
```

Wall-clock stop is classified `ADMIN-CUTOFF`. State/edge/work/tree/RSS/artifact ceilings are classified `RESOURCE-LIMIT`. No target-depth reduction, root change, cap increase, representation change, or incomplete-layer promotion is authorized after outcome.

## Stage 1 development firewall

Stage 1 uses only fresh reachable development roots generated from reserved seed block `28050001..28050064`, with selected local roots at ply > 0. Those roots are development-only and are never formal Stage 2 roots or formal Stage 2 rows.

Stage 2 uses only a fresh reconstruction of the standard initial RAW root. Stage 1 local-enumeration rows are prohibited from Stage 2 input.

Stage 1 may determine readiness only. It may not change the already frozen Stage 2 root, target depth, representation, endpoints, or resource ceilings.

## Decision taxonomy

Scientific/formal labels:

- `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`
- `NOT-EXACTLY-ENUMERATED`
- `NON-ESTIMABLE`
- Study-level pre-formal closure: `INCONCLUSIVE`

Technical classifications are separate:

- `TECHNICAL-INVALID`
- `RESOURCE-LIMIT`
- `ADMIN-CUTOFF`
- `VERIFICATION-FAILED`
- `NOT-AUTHORIZED-NOT-EXECUTED`

A resource-censored count is never converted into an estimate.

## No-rescue rule

After a Stage 2 outcome exists, the same formal evidence may not be repaired/rerun to obtain a preferred scientific decision. Prohibited outcome-driven changes include target depth, root, caps, RAW identity, canonicalization, endpoint, threshold, verifier semantics, or decision rule.

A newly discovered Stage 2 technical defect fails closed under the frozen taxonomy. Any scientifically valid new attempt requires a new prospective version/Study and fresh formal identity.
