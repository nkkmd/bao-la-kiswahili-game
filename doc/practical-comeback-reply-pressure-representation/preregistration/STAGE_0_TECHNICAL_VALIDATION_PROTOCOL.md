# PCRPR-STUDY1 — Stage 0 Technical Validation Protocol

Date: 2026-08-29  
Stage ID: `PCRPR-S0-TECHNICAL-2026-08-29-v1`  
Status: **FROZEN BEFORE STAGE 0 EXECUTION**

## 1. Purpose

Stage 0 is technical-only. It validates the representation instrument, deterministic numeric/hash semantics, leakage guards, independent recomputation, and resource feasibility. It generates no practical-comeback scientific outcome and consumes no Stage 1 or Stage 2 scientific seed.

## 2. Authoritative identity

RAW state identity is exactly `pits,reserve,houseOwned,player,phase,winner,pending`; `turn` and `reason` are excluded. Missing `pending`, invalid dimensions/types, or failure of represented seed conservation to 64 fails closed. No transform, symmetry reduction, or canonicalization is permitted.

Exact move identity is the colon-joined ordered field tuple:

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

All exact root moves and exact replies are ordered by ascending lexical exact move identity before aggregation.

## 3. Stage 0 technical search semantics

Reference search identity:

```text
pcrpr-exact-full-window/bao/q0/v1
```

Rules:

- exact legal move variants only;
- evaluation profile `bao`;
- quiescence depth 0;
- terminal score `±1,000,000` adjusted by ply as in the PCEM technical reference convention;
- no alpha-beta pruning is required for the technical implementation; complete full-window enumeration is authoritative;
- ties are broken by lexical exact move identity;
- reply quality is evaluated from the opponent/replying player's perspective;
- D1 and D2 reply tables are technical predictors only, not game-theoretic truth.

For a root move `m`, let `s_m` be the exact successor. If `s_m` is terminal, reply-dependent families use the frozen terminal-applicability semantics in Section 7. Otherwise enumerate every exact reply `r` from `s_m` and compute D1/D2 reply scores from the replying player's perspective.

For D2 reply score `q_r`, define:

```text
q_best = max_r q_r
gap_r = q_best - q_r >= 0
```

`defense-maintaining reply` means exactly `gap_r = 0`, i.e. D2 top-set membership. No post-outcome or empirical continuation threshold enters this definition.

## 4. Frozen outcome-independent policy distributions

Predictor-side policy sensitivity uses distributions over the exact reply set only:

```text
P_STRONG_D2_TOPSET = uniform over D2 top-set replies
P_MEDIUM_D1_TOP3  = uniform over the first min(3, replyCount) D1-ranked replies
P_WEAK_UNIFORM    = uniform over every exact legal reply
```

These are class-C predictor distributions. They do not execute sampled continuations and do not use terminal continuation outcomes.

For a policy distribution `p(r)`, the Stage 0 representation may compute expected D2 defense gap `sum_r p(r) * gap_r`. Policy-to-policy total variation distance is `0.5 * sum_r |p_a(r)-p_b(r)|`, accumulated in canonical lexical reply order.

## 5. Deterministic numeric contract

All aggregation inputs are sorted into their prospectively specified canonical order before arithmetic. Ambient JavaScript `Object.keys`, integer-like object-key enumeration, `Map` insertion order from unsorted input, locale ordering, or filesystem ordering must not define scientific numeric order.

Frozen arithmetic rules:

1. sums use left-to-right IEEE-754 binary64 addition over canonical-ordered finite values;
2. means divide that canonical sum by exact count;
3. population standard deviation uses canonical-ordered squared deviations from the canonical mean;
4. quantiles use the sorted numeric vector with linear interpolation at `h=(n-1)p`; for empty vectors the family-specific terminal/missing rule applies;
5. HHI/concentration uses canonical-ordered non-negative gap values;
6. no compensated summation, rounding, epsilon equality, or tolerance is used for exact Stage 0 representation equality.

Canonical scalar hash encoding:

```text
schema = PCRPR_FEATURES_STAGE0_V1
family order = frozen 12-family order from STUDY_START_FREEZE.md
within-family feature-name order = ASCII lexical order
numeric scalar encoding = IEEE-754 binary64, big-endian, lowercase 16-hex-byte-pair representation
hash input row = family + TAB + featureName + TAB + f64be:<16 hex digits> + LF
vector hash = SHA-256 over UTF-8 concatenation of the header and ordered rows
```

All feature values must be finite binary64 numbers. Exact production/independent feature-vector hashes must match.

## 6. Frozen Stage 0 family semantics

The declared families remain exactly the 12 frozen study-start families.

### `REPLY_SET_WIDTH` (B)

- `legalReplyCount`
- `log1pLegalReplyCount`
- `replyCaptureCount`
- `replyTakataCount`
- `replyPassCount`

### `DEFENSE_MAINTAINING_REPLY_FRACTION` (C)

- `d2TopSetCount`
- `d2TopSetFraction = d2TopSetCount / legalReplyCount`
- `d1TopSetCount`
- `d1TopSetFraction`

### `REPLY_QUALITY_DISTRIBUTION` (C)

Over D2 `gap_r` in lexical reply order / numeric quantile order as applicable:

- mean, population standard deviation, minimum, maximum, q25, q50, q75
- number of distinct exact D2 score values

### `PUNISHMENT_CONCENTRATION` (C)

For positive D2 gaps only:

- positive-gap reply count/fraction
- positive-gap total
- top1 share
- top2 share
- HHI `sum(gap^2) / sum(gap)^2`

All concentration/share features are zero when positive-gap total is zero.

### `BEST_REPLY_GAP_VECTOR` (C)

Using D2 descending score order with lexical tie break:

- best-to-second gap (0 when fewer than 2 replies)
- best-to-median gap
- best-to-worst gap
- D1 best-to-second gap

### `FORCING_REPLY_STRUCTURE` (B/C)

- unique legal reply indicator
- unique D2 best reply indicator
- all replies capture indicator
- any reply capture indicator
- D2 top-set count
- immediate terminal-after-root-move indicator

### `REPLY_BRANCH_ASYMMETRY` (B)

For every exact reply, count exact legal root-actor moves in the two-ply successor (0 if terminal):

- mean, population standard deviation, min, max, range
- fraction of reply successors with exactly one legal root-actor move
- fraction of reply successors terminal

### `REPLY_SEARCH_STABILITY` (C)

- D1/D2 canonical-best match indicator
- D1/D2 top-set Jaccard
- D1/D2 top-set intersection count
- mean absolute D1-vs-D2 tie-aware rank difference over exact reply identities

### `OPPONENT_POLICY_SENSITIVITY` (C)

Using the three frozen reply distributions:

- expected D2 gap under strong, medium, weak
- medium-minus-strong expected gap
- weak-minus-strong expected gap
- policy expected-gap span
- TV(strong, medium), TV(strong, weak), TV(medium, weak)

### `ROOT_MOVE_REFERENCE_CONTEXT` (C)

At the root under D2 exact-root search, from the root actor perspective:

- root legal move count
- selected root move tie-aware rank
- selected root move score minus root best score
- selected root move membership in root D2 top set
- root D2 best-to-second gap

### `LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE` (A/B)

At root and exact root-move successor:

- actor/opponent reserve and reserve difference
- actor/opponent house-owned indicators
- phase indicators
- root-move capture indicator
- root-move immediate captured-seed count
- root-move terminal indicator
- successor front occupied counts for both players
- successor reusable-pit counts for both players

### `LOCAL_TEMPORAL_CONTEXT` (A)

Uses at most the four exact moves strictly before the root occurrence. It must never include the root move or any future move. Features:

- history length 0..4
- prior capture/takata/pass counts
- prior left/right direction counts
- prior phase-change count, computed only from consecutive pre-root historical RAW states
- immediately prior move capture indicator

Stage 0 fixtures must include exact pre-root histories; absent history is encoded by zeros, never by reading future rows.

## 7. Terminal root-move applicability semantics

If the exact root move immediately terminates the game:

- `legalReplyCount = 0`;
- all reply count/fraction/distribution/concentration/gap/stability/policy-sensitivity scalars are `0`;
- `immediateTerminalAfterRootMove = 1`;
- successor geometry remains computed where defined;
- no row is silently omitted.

For nonterminal successors, an empty legal reply set is a technical integrity failure because the engine should already have resolved no-move terminal semantics.

## 8. Leakage rejection

The production and independent feature builders accept only explicitly whitelisted inputs:

```text
root RAW state
exact root move
strictly pre-root history RAW states and exact moves
frozen Stage 0 search/policy configuration
```

Fields named or semantically representing continuation winner, rollout result, empirical comeback frequency, target, label, post-root sampled rollout, or formal decision are rejected. Deliberate forbidden-field injection is a mandatory negative control.

## 9. Independent implementation contract

Production and independent implementations may both import `public/engine.js` and `public/ai.js` as authoritative rule/evaluator dependencies. They may not import each other, `rcpr-production.js`, `rcpr-independent.js`, PCEM production measurement helpers, or a common PCRPR serializer/aggregation/feature helper.

The independent implementation must separately implement:

- RAW validation/projection/keying;
- exact move normalization/keying/order;
- D1/D2 full-window search;
- all 12 family calculations;
- canonical float encoding and vector hashing.

Source-audit independence checks inspect only `require(...)` lines, avoiding the PCEM self-match defect class.

## 10. Technical fixtures

No scientific seed block is used. A frozen small technical seed menu outside all PCRPR scientific blocks is permitted solely to construct reproducible reachable Namua/Mtaji fixtures.

Required fixture/control coverage:

- standard initial Namua root;
- non-initial Namua root with >=2 exact moves;
- reachable Mtaji root with >=2 exact moves;
- at least one root-move row with one reply if reachable from the technical menu; otherwise a synthetic aggregation-only one-reply fixture;
- synthetic aggregation fixtures with tied scores, integer-like labels in adversarial encounter order, and reply-list permutations;
- missing `pending` rejection;
- corrupted represented-seed total rejection;
- RAW-key mismatch detection;
- forbidden future/outcome-field rejection;
- search-config identity drift detection;
- feature-schema drift detection;
- deliberately perturbed scalar/hash mismatch detection.

Synthetic aggregation-only fixtures never enter scientific evidence and need not be legal Bao states when they test only pure numeric/order functions.

## 11. Mandatory Stage 0 gates

Production gates:

```text
rawIdentity
seedConservation
exactMoveOrdering
phaseFixtures
all12FamiliesMaterialized
finiteFeatureVectors
replyPermutationInvariant
integerLikeKeyOrderInvariant
tiedReplyScoresHandled
terminalApplicabilityHandled
leakageRejected
configDriftRejected
schemaDriftRejected
resourceProfile
```

Independent gates:

```text
independence
rawIdentity
exactMoveSets
searchTables
allFeatureVectorsExact
vectorHashesExact
syntheticNumericControlsExact
negativeControlsDetected
productionArtifactHashBinding
```

Stage 0 passes only when every mandatory production and independent gate is true.

## 12. Decision and downstream rule

```text
all mandatory gates pass -> STAGE0-TECHNICAL-PASS
otherwise -> STAGE0-TECHNICAL-FAILED
```

A Stage 0 pass authorizes only preparation/freeze of the Stage 1 scientific spec and source/implementation validation. It does **not** authorize Stage 1 scientific generation.

A Stage 0 failure may be repaired and rerun because Stage 0 is technical-only, provided zero PCRPR Stage 1/2 scientific seeds have been consumed and no scientific outcome exists. Any repaired Stage 0 execution must receive a versioned protocol/implementation record when semantics change materially.

## 13. Resource ceiling

Technical runner target ceiling:

```text
wall time <= 10 minutes
max RSS <= 2 GiB
artifact <= 50 MiB
```

Exceeding the ceiling is a Stage 0 technical/resource failure, not a scientific negative result.
