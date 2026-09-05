# State Space / Game Tree Complexity Study 1 — Final Report （結論）

## 日本語での結論と読み方

standard initial RAW rootのfrozen depth-8 domainで24,848 RAW statesと30,941 tree nodesをexactに数えた。formal decisionはSSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAINで、Bao全体の規模推定ではない。

以下には、Study closure時に固定した英語の詳細記録が含まれる。canonical decision token、数値、seed、hash、実行ID、authorization、evidence boundaryを再解釈しないため原文を保持している。初めて読む場合は`STUDY_1_OVERVIEW.md`と`CURRENT_STATUS.md`を先に参照する。

**Study ID:** `SSGTC-STUDY1`  
**Status:** COMPLETED  
**Formal scientific decision:** `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`  
**Representation:** RAW-ONLY  
**Study-start baseline `main`:** `9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901`

## 1. Question and scope （適用範囲と制限）

This prospective independent study asked whether Bao reachable-state growth and bounded game-tree complexity could be quantified reproducibly from authoritative raw rule-state identity without using unvalidated symmetry reduction or canonicalization.

The study did **not** attempt to produce one global number for “the Bao state space”. Exact enumeration, resource-bounded observation, game-tree path occurrences, unique raw states, transpositions, trajectories, and estimates were kept as separate claim classes.

The study does not reopen or change the formal decisions of Restricted Endgame / Winning Regions Study 1, Symmetry / Isomorphic Positions Study 1, ORISC-STUDY1, Position Complexity / Difficulty Study 1, or any other completed Bao study.

## 2. Representation firewall （識別と表現）

Authoritative raw identity was fixed as:

```text
include:
pits
reserve
houseOwned
player
phase
winner
pending

exclude:
turn
reason
```

Missing `pending` is invalid and was required to fail before engine entry. The engine's compatibility behavior that can synthesize `[0,0]` was therefore not permitted to repair a studied state.

Every accepted state satisfied:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

The following remained prohibited throughout Study 1:

```text
symmetry-reduced canonicalization
seat-swap reduction
left-right reflection reduction
compound symmetry reduction
SIP/ORISC T01/T02/T03 reduction
symmetry-group quotient counting
```

The validated downstream transformation set was `[]`.

## 3. Study sequence （日本語の要点）

### Stage 0 — technical representation validation （Stageの記録）

The frozen depth-2 technical graph passed all `S0-G1` through `S0-G12` gates and a separate-process independent verifier in GitHub Actions run `32803985808`.

The accepted Stage 0 label is only:

```text
SSGTC-STAGE0-PASS
```

Its 19-state / 18-transition shallow diagnostic is not scientific evidence about global Bao complexity and was not reused as Stage 1 or Stage 2 evidence.

### Stage 1 — exploratory characterization （Stageの記録）

Numeric resource caps were frozen before outcome generation. Several early executions were retained as non-canonical technical failures rather than rescued:

- run `32805036665`: G9 self-inspection false positive;
- run `32805162435`: second G9 self-reference failure;
- run `32805259739`: production passed, but independent verification exposed that partial-depth branching aggregates had been mixed with complete-layer aggregates.

These failures did not authorize scientific interpretation of their generated patterns. The correction aligned aggregation with the already frozen rule that partial layers are censored; it did not change resource caps, raw identity, the expansion algorithm, or scientific endpoints.

The accepted exploratory run was `32805576462`, artifact `9548021440`, ZIP SHA-256:

```text
d95f8be89984480031f6742d63d003f67c6cea8afe7b401d05adca28ee09846d
```

Stage 1 remained `EXPLORATORY-ONLY` and `scientificInferenceAuthorized=false`. Its graph stopped at the frozen `FRONTIER_CAP` while attempting depth 8 expansion, leaving partial depth-9 state rows censored. The verified completed domain nevertheless included all raw states through depth 8 and all transitions from parent depths 0 through 7. The bounded tree completed through depth 8. The preregistered Stage 2 minimum-feasibility rule was therefore met.

No Stage 1 row was reused as formal Stage 2 evidence.

### Stage 2 — prospective formal bounded quantification （Stageの記録）

Before formal outcome generation, Stage 2 froze a fresh target:

```text
root = standard engine initialState()
raw graph parent depths = 0..7
reachable raw-state depths = 0..8
game-tree depth = 0..8
representation = RAW-ONLY
symmetry reduction = false
canonicalization = false
estimation = false
```

The formal evidence was freshly regenerated under namespace `SSGTC-S2-FORMAL-2026-08-25-v1`; Stage 1 artifacts were not read as formal evidence.

Production enumeration and a separate-process independent verifier both succeeded in GitHub Actions run `32805975114`, job `97676042161`. The independent verifier did not import the production serializer, production formal runner, or Stage 1 artifact code, and independently re-enumerated the entire frozen graph and tree domains.

## 4. Formal result （結果）

The frozen target completed with no resource censoring. Therefore the formal decision is:

```text
SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

### 4.1 Reachable raw-state graph （日本語の要点）

```text
reachable raw states through depth 8 = 24,848
transition occurrences from parent depths 0..7 = 25,648
duplicate encounters = 801
multi-parent raw states = 763
max indegree = 4
non-increasing-depth edges = 0
```

Exact raw-state depth counts:

```text
depth 0      1
depth 1      4
depth 2     14
depth 3     38
depth 4    119
depth 5    384
depth 6  1,284
depth 7  4,706
depth 8 18,298
----------------
total    24,848
```

State-set and transition-set identities:

```text
stateSetSha256 =
8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9

transitionSetSha256 =
f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
```

All 24,848 states in this frozen depth-8 domain were Namua states. This means only that Mtaji was not reached within this bounded domain; it does not imply that Bao does not reach Mtaji.

There were 97 terminal and 24,751 nonterminal states in the depth-8 state set. Winner counts were Player 0 = 31, Player 1 = 66, none = 24,751.

### 4.2 Branching structure for completely expanded parent depths 0..7 （日本語の要点）

```text
expanded nonterminal states = 6,516
expanded terminal states = 34
arithmetic mean branching = 3.936157151626765
geometric mean branching = 3.4331822270441013
forced single-move proportion = 0.06476365868631062
capture-forced proportion = 0.8276550030693677
non-capture-choice proportion = 0.1723449969306323
mixed-move-type proportion = 0
```

These branching summaries apply only to the completely expanded parent-depth domain and must not be generalized to all Bao positions.

### 4.3 Bounded game tree （日本語の要点）

The non-deduplicated game tree was separately counted through depth 8:

```text
node occurrences = 30,941
edge occurrences = 30,940
```

Exact node-occurrence depth counts:

```text
depth 0      1
depth 1      4
depth 2     14
depth 3     38
depth 4    124
depth 5    405
depth 6  1,430
depth 7  5,655
depth 8 23,270
----------------
total    30,941
```

Tree occurrence identity:

```text
treeOccurrenceSetSha256 =
194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

The bounded ratio

```text
unique raw states / game-tree node occurrences = 0.803076823632074
```

quantifies deduplication/transposition effect only inside the frozen depth-8 target. It is not an estimator for the full Bao state space or full game tree.

## 5. Independent verification and artifact integrity （証拠と成果物）

Production gates `S2-G1` through `S2-G10` all passed, covering raw shape, missing-`pending` rejection, seed conservation, unique raw keys, deterministic replay, depth boundary, raw/report separation, post-write reopen, forbidden-import checks, and no-estimator enforcement.

The independent verifier reproduced exactly:

```text
raw states = 24,848
transitions = 25,648
tree nodes = 30,941
tree edges = 30,940
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

Canonical Stage 2 provenance:

```text
workflowRunId = 32805975114
workflowJobId = 97676042161
artifactId = 9548146194
artifactZipSha256 = 713e258847a98e9b01866bae248f0986708f8ef90df803157514c63469b52e15
```

The downloaded ZIP was independently re-hashed after retrieval and matched the GitHub artifact digest.

## 6. Exactness boundary （適用範囲と制限）

The formal claim is exactly:

> From the study-start engine's standard initial state, using the seven-field authoritative raw identity and no symmetry/canonicalization reduction, the complete reachable raw-state graph through state depth 8 contains 24,848 unique raw states and 25,648 transition occurrences from parent depths 0 through 7; the corresponding non-deduplicated game tree through depth 8 contains 30,941 node occurrences and 30,940 edge occurrences.

The study does **not** authorize any of the following claims:

```text
Bao state space = 24,848
full Bao state space is exactly known
full Bao game-tree complexity is exactly known
depth-8 growth extrapolates to the full game
0.803076823632074 is a global transposition ratio
Bao never reaches Mtaji
symmetry-reduced state count is known
canonicalization is validated
an estimator of the full state space is validated
```

A deeper exact count, a full-game estimate, or a symmetry-reduced count requires a new prospective study/versioned protocol with its own resource and representation authorization.

## 7. Upstream scientific state preserved （日本語の要点）

Nothing in SSGTC-STUDY1 changes:

- Restricted Endgame / Winning Regions Study 1: `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` for its frozen 8-state / 7-edge domain only;
- Symmetry / Isomorphic Positions Study 1: 0 validated / 0 rejected / 5 `NON-ESTIMABLE`;
- ORISC-STUDY1 Axis A: `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`;
- ORISC-STUDY1 Axis B: `NOT-AUTHORIZED-NOT-EXECUTED`.

The validated symmetry transformation set remains empty.

## 8. Closure （結論）

SSGTC-STUDY1 is complete. Its scientific contribution is a reproducible, independently verified **bounded exact** raw-state and game-tree count, not a global Bao state-space solution. Technical failures encountered before the accepted Stage 1 run were preserved as technical failures and were not converted into scientific evidence. No estimator or symmetry reduction was introduced after outcome inspection.

The canonical machine-readable result is `results/STAGE_2_FORMAL_RESULT.json`; reproducibility details are indexed in `REPRODUCIBILITY_INDEX.md`.
