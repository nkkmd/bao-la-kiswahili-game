# TCTGD-STUDY1 — Current Status

Updated: 2026-09-02

```text
Study = TCTGD-STUDY1
Program position = Research Generation 3 / G3-03
Status = CLOSED / TECHNICAL-INVALID
Research branch = research/g3-03-transposition-tree-graph-divergence
baseline remote main = 6b1457294666267c5a75c8516001acd1ef7d2fcd
program review = G3-03-AUTHORIZED
post-G3-03 program review = COMPLETED / G3-04-AUTHORIZED / separate downstream Study; no G3-03 rescue
prospective Study/prereg freeze = COMPLETE
technical execution v2 refreeze = COMPLETE / PRE-FRESH / SCIENTIFIC CONTRACT UNCHANGED
Stage 0 = TCTGD-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS
Stage 1 = TCTGD-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
Stage 2 = TCTGD-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 1
Stage 1 seed = 31310001..31310192 / CONSUMED
Stage 2 seed = 31320001..31320288 / NOT CONSUMED
formal promoted candidate set = []
no-rescue boundary = CROSSED / ACTIVE
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
next scientific action = none within TCTGD-STUDY1; Study remains closed. The separate post-G3-03 review later authorized G3-04, which subsequently closed independently.
```

## Formal scientific scope

Principal measurement families:

- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

Auxiliary denominator primitive:

- `LGTGMIV-F1-TREE-OCCURRENCE`

Boundary:

```text
representation = RAW-ONLY
relative horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
```

G3-02 branching/reply-width diagnostic outcomes were not scientific inputs.

## Frozen endpoints

1. `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO`
2. `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION`
3. `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION`
4. `TCTGD-C4-RECONVERGENCE-ONSET-SCORE`
5. `TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION`

All ratios and comparisons used exact integer/rational arithmetic.

## Frozen population

Stage 1:

- seeds `31310001..31310192`
- target 12 paired trajectories = 12 Namua + 12 Mtaji
- actual selected 12 paired trajectories = 24 roots
- population complete = true

Stage 2:

- seeds `31320001..31320288`
- target 18 paired trajectories = 18 Namua + 18 Mtaji
- unexecuted / unconsumed

Each pair was one fresh source trajectory with Namua at exact ply 24 and first nonterminal Mtaji at ply >=44. Selection was seed-ascending, geometry-blind and outcome-blind.

## Stage 0 result

GitHub Actions:

- run `33589334375`
- job `100119933850`
- conclusion `success`
- durable artifact `9831182022`
- artifact ZIP SHA-256 `efa3669c06a20b793d3f8feff80f71535fb582c0d1165fed38cf4dc0c3f78924`

Stage 0 deterministic core:

`e7e7831cf9503c94441a5dc9b30253485dc4b498e9b397408901186c914765d5`

All synthetic semantic, exact-agreement, order-invariance, exact sign/Holm and static-independence gates passed.

## Pre-Stage-1 technical execution refreeze

Initial non-scientific tooling smoke established that a branch-only `workflow_dispatch` target could not be resolved through GitHub REST and returned HTTP 404. No fresh scientific seed was accessed.

Before Stage 1 authorization, the execution control plane was refrozen as technical v2 while preserving the prospective scientific contract:

- path-filtered dedicated Stage 1 execution trigger;
- durable pre-computation execution lease;
- authorization-baseline ancestry + remote-advancement allowlist gate;
- exact source blob binding;
- durable artifact before repository mirror;
- upstream identity-only firewall manifest;
- no Stage 1/Stage 2 seed access during tooling/refreeze.

Scientific-content baseline:

`3b31c0e853b99d50e6e4cd924984342535c22547`

## Stage 1 execution

Stage 1 was separately authorized exactly once.

```text
authorization = STAGE1-AUTHORIZED
authorization nonce = TCTGD-S1-AUTH-2026-09-02-V2-01
maxScientificExecutions = 1
actualScientificExecutions = 1
```

GitHub Actions:

```text
run = 33592380079
lease job = 100128827626 / success
scientific job = 100128867042 / exit 2 after canonical TECHNICAL-INVALID result
mirror job = 100129459563 / success
execution trigger commit = 18cdade48db8f19e3b49615041630948dafb4e61
lease commit = 2320d80424a48cbf72964d3910b90522c7936151
result mirror commit = ce94af693386699a5b0cc6292d3ac817af034f19
```

Durable artifact:

```text
artifact ID = 9832258829
name = tctgd-stage1-development-result-33592380079
size = 27447 bytes
ZIP SHA-256 = cb03924420df2b280398f5493283dc47fae01bb4e22afdd18560d42b5bf1139b
```

Canonical Stage 1 result files are durably retained in both the Actions artifact and research branch.

## Stage 1 verification result

Pass / agreement fields:

```text
populationComplete = true
stageResourcePass = true
sourceIdentityExact = true
staticIndependence = true
pairComparisonExact = true
developmentExact = true
```

Failed mandatory integrity fields:

```text
allRootExact = false
stageScientificExact = false
stageDisposition = TECHNICAL-INVALID
```

Production / independent canonical stage scientific core SHA-256 were nevertheless identical:

`d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f`

## Technical-invalid cause

The frozen production endpoint implementation constructed its endpoint map as a normal JavaScript object. The frozen independent implementation constructed the equivalent endpoint map using `Object.create(null)`.

The frozen runner compared in-memory objects with Node.js `util.isDeepStrictEqual`, which is prototype-sensitive. Therefore exact endpoint key/value content and canonical serialization could match while root-level `endpointExact` remained false solely because the endpoint-map prototypes differed.

This defect propagated to `allRootExact=false` and `stageScientificExact=false`, causing the frozen integrity gate to fail.

The defect was identified only after fresh Stage 1 evidence had been generated. Correcting the object prototype or replacing prototype-sensitive equality with canonical equality would be a same-evidence rescue. It is therefore prohibited for TCTGD-STUDY1.

## Diagnostic candidate provenance

The technical-invalid run produced the following promotion-like diagnostic directions:

- `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO` — `NAMUA-GREATER`
- `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION` — `NAMUA-GREATER`
- `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION` — `NAMUA-GREATER`
- `TCTGD-C4-RECONVERGENCE-ONSET-SCORE` — `MTAJI-GREATER`

These are diagnostic provenance only. Formal promoted candidate set is `[]`.

## Stage 2

`TCTGD-S2-FORMAL-2026-09-02-v1` remains:

**`NOT-AUTHORIZED-NOT-EXECUTED`**

Stage 2 seed `31320001..31320288` remains unconsumed. A technical-invalid Stage 1 cannot authorize Stage 2.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

No G3-03 action generated, read, peeked at, or partially enumerated it.

## Closure boundary

Formal closure:

```text
TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No same-evidence rerun is authorized. Any future study must be a new, prospectively defined independent study after a separate program-level authorization review.
