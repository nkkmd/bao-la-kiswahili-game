# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-10  
Status: **ACTIVE / Stage 0 design complete, execution not yet started**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

新規独立研究

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

を開始した。

現在は**Stage 0 feasibility auditの設計完了点**である。

まだ行っていないこと:

- new scientific corpus generation
- exploratory temporal association analysis
- formal endpoint freeze
- formal comparator freeze
- formal seed freeze
- statistical model freeze
- preregistration
- held-out formal corpus generation/inspection

したがって、このbranch上には新研究のpositive/negative scientific resultはまだ存在しない。

## Main head verification

研究開始時にGitHub `main`を再確認した。

```text
main
= c7d06d485789e1ea96d6603802423951a88c1f87
```

Commit message:

```text
docs: update future research agenda after Study 1 closures
```

このSHAを研究開始provenanceとして固定する。

## Restored closed-study state

### Phase-transition Study 1

Status:

```text
Study 1 closed
```

Formal decisions:

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

Fixed interpretation:

- `capture-branch-expansion` is a bounded strategic-transition phenotype.
- classifier/threshold/order remain fixed.
- E-019 D3 is not retrospectively relabeled as an H17 confirmation.
- E-018 and E-020 do not jointly establish a general depth interaction.
- `sustained-forcing window` remains retrospective Stage B vocabulary, not a numeric fitted threshold.

### Position-typology / playing-style Study 1

Status:

```text
research complete / final integration complete
```

Confirmed Mtaji morphology:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

Boundary:

- fixed representation/population only;
- no refit/restandardization/relabeling;
- not a universal/final Bao ontology.

Namua:

```text
no discrete type promoted
N-PROG = progression context
N-ACT  = exploratory continuous coordinate
N-CON  = exploratory continuous coordinate
```

Playing style:

```text
discrete cluster set = unsupported
STYLE-C1..C4 exact 4D geometry = formal not-confirmed
```

No rescue is allowed in this study.

## Cross-study bridge state inherited unchanged

Frozen Stage 6 scope:

```text
E-018 D2: P2 / LG
E-019 D3: P2 / LG
E-020 D3: P2 / LG
```

Result:

```text
capture-branch-expansion = 59 unique trajectory-ply units
Namua = 59
Mtaji = 0
```

Therefore same-ply `capture-branch-expansion ↔ MTAJI-M1/M2` was not estimable.

This new study addresses the unestimated temporal connection prospectively; it does not reinterpret the old zero-overlap result as absence of a future relationship.

## Stage 0 repository audit findings

### Engine

`public/engine.js` exposes sufficient deterministic rule-state transitions for temporal replay.

Formal phase transition occurs in `finishTurn()` when:

```text
phase == namua
reserve[0] == 0
reserve[1] == 0
```

then `phase = mtaji`.

Implication:

`time-to-first-Mtaji` is intrinsically related to reserve depletion. Raw reserve must be audited as rule-derived progression context.

### Existing phase-transition instrumentation

`tools/experiments/lib/phase-transition-features.js` records:

- phase
- reserve
- houseOwned
- legalMoveCount
- captureMoveCount
- forcedCapture
- board/global counts
- front-row occupancy/seeds
- stateHash

`tools/experiments/lib/forced-capture-regimes.js` implements the frozen candidate/regime classifier.

### Existing position-typology instrumentation

`tools/experiments/lib/position-typology-features.js` records full board state plus actor/opponent primitives including:

- reserve
- houseOwned / nyumbaSeeds
- board/front/back seeds
- occupied/reusable pits
- front connections
- legal/capture move counts
- forcedCapture
- max/mean capturable seeds
- capture/relay/chain measures
- pit variance/concentration
- rule-state / seat-canonical identities

The existing position-typology schema is therefore a strong base for the new temporal schema.

### Replay

Existing Stage 6 tooling already proves the following pattern is feasible:

```text
initialState
-> archived move replay
-> per-ply stateHash verification
-> before/after move hash verification
-> phase agreement
-> reconstructed full position features
```

The new study should reuse this QA pattern rather than create a weaker replay path.

### Frozen Mtaji artifact dependency

The new RQ3 endpoint requires the actual frozen classifier artifact containing:

- 40-feature order
- log1p field set
- discovery StandardScaler parameters
- discovery centroids
- raw-label → canonical-label mapping

with hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Stage 0 must verify the artifact file's availability and exact hash before any RQ3 formal design is authorized.

## Critical methodological issue identified before pilot

The existing phenotype classifier uses future observations through 8 ply and gives precedence to `namua-to-mtaji-precursor` when Mtaji occurs within that window.

Therefore:

```text
capture-branch-expansion -> first later Mtaji distance <= 8
```

is structurally impossible under the frozen classifier.

The formal time origin is consequently not yet frozen. A `candidatePly + 8` landmark or equivalent ascertainment-aware design must be evaluated before preregistration.

This issue was identified from code/definition audit, not from new outcome inspection.

## Current RQ status

### RQ1

Priority endpoint family:

```text
time-to-first-Mtaji
```

Status:

```text
candidate endpoint family selected
exact origin/model not frozen
```

### RQ2

Status:

```text
feature families identified
functional/time representation not frozen
```

Priority is full interval / rule-derived progression rather than post-hoc last-N-ply windows.

### RQ3

Status:

```text
frozen MTAJI-M1/M2 classifier authorized in principle
artifact availability/hash audit pending
endpoint handling for ineligible first Mtaji state pending
```

### RQ4

Status:

```text
secondary/formal candidate only
no direction preregistered
```

Past D2/D3 reversal is motivation, not a copied hypothesis.

## Decisions intentionally not made yet

Do not freeze before Stage 0/1 evidence:

- exact comparator;
- candidate-ply versus landmark time origin;
- survival versus competing-risk model;
- primary statistical unit;
- multiple-event policy;
- reserve matching/stratification/covariate policy;
- formal condition set;
- sample size;
- formal seed block;
- effect direction;
- significance/decision threshold;
- RQ2 smoothing/window/functional form.

## Immediate next execution steps

1. create a new-study temporal schema/spec proposal that composes existing position-typology primitives with phase-transition candidate/regime fields;
2. add engine regression tests for monotonic `namua -> mtaji`, first-Mtaji detection, reserve/pass edge cases, and terminal-before-Mtaji behavior;
3. implement a Stage 0 smoke runner or adapter using fresh smoke-only seeds;
4. implement replay/schema/provenance verifier using full state/move hash checks;
5. inventory and hash-check the frozen MTAJI classifier artifact;
6. run only the technical smoke locally;
7. inspect technical outputs and event-support/multiplicity feasibility without treating them as formal scientific evidence;
8. define a fresh exploratory Stage 1 seed block and pilot protocol;
9. only after Stage 1, freeze endpoint/comparator/unit/censoring/model/seeds and preregister.

## Pause point

> **Branch and initial research governance are established. Stage 0 audit design is complete. No new games have been generated. Next work starts with temporal schema/instrumentation implementation and local technical smoke; formal endpoint/comparator/seeds remain deliberately unfrozen.**
