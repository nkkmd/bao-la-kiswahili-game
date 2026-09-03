# Research Generation 3 — Current Status

Updated: 2026-09-03

```text
Program = Bao Third-Generation Research Program
Program status = ACTIVE / G3-06 CLOSED TECHNICAL-INVALID / G3-07 AUTHORIZED FOR PROSPECTIVE DEFINITION + TECHNICAL-ONLY STAGE 0 / FRESH STAGE 1 NOT AUTHORIZED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Research Generation 2 = CLOSED
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL / F1..F5
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID / promoted [] / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
G3-03 = TCTGD-STUDY1 / CLOSED / TECHNICAL-INVALID / promoted [] / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
G3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE / C1 CONFIRMED MTAJI-GREATER / C6 CONFIRMED NAMUA-GREATER
G3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID / promoted [] / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
G3-06 program review = G3-06-AUTHORIZED
G3-06 = BRMGI-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-06 Stage 0 v1 = BRMGI-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID / NO RERUN
G3-06 Stage 0 v2 = BRMGI-S0-TECHNICAL-2026-09-03-v2 / STAGE0-PASS
G3-06 Stage 1 = BRMGI-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID / 1 authorized / 1 actual
G3-06 Stage 1 seed = 31610001..31610256 / CONSUMED
G3-06 formal promoted candidate set = []
G3-06 Stage 2 = BRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
G3-06 Stage 2 seed = 31620001..31620384 / NOT CONSUMED
G3-06 no-rescue boundary = CROSSED / ACTIVE
G3-07 program review = G3-07-AUTHORIZED
G3-07 = AUTHORIZED FOR PROSPECTIVE STUDY DEFINITION / TECHNICAL-ONLY STAGE 0
G3-07 fresh Stage 1 = NOT AUTHORIZED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Active scientific research branch = none / G3-07 branch not yet created
Next scientific action = create G3-07 research branch from post-decision main, freeze Study contract, then technical-only Stage 0
```

## Immutable upstream boundaries

Research Generation 2 remains closed.

G3-01 `LGTGMF-STUDY1` remains permanently:

```text
CLOSED / TECHNICAL-INVALID
formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

G3-01 Stage 1 root/family agreement is not used to rescue or reclassify it.

The independent prerequisite `LGTGMIV-STUDY1` remains:

`CLOSED / FORMAL-ELIGIBLE-ALL`

Formal eligible families:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

Eligibility remains limited to the frozen RAW-only / relative depth-5 bounded local reconstruction contract.

## G3-02 closure

G3-02 was prospectively frozen as `EBRWS-STUDY1` — Effective Branching and Reply-Width Structure Study 1.

Its Stage 0 passed. Stage 1 was authorized exactly once, but canonical result materialization failed after fresh evidence generation because the research branch advanced during execution. A separately queued unintended duplicate scientific execution also violated the exactly-one-execution contract.

Formal closure remains:

```text
G3-02 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Runner-local compression-dominant summaries and duplicate-run equality remain diagnostic provenance only.

G3-02 is integrated to `main` through PR #92 / merge `b41c7eda74dd1002e98e4d82714fadb987d1f1e1`.

## Post-G3-02 authorization of G3-03

A separate current-state review concluded:

**`G3-03-AUTHORIZED`**

G3-03 was authorized as a scientifically independent Study based principally on LGTGMIV F2/F3/F4 within the RAW-only relative depth-5 boundary. No G3-02 positive result was required or reused as scientific evidence.

Canonical review:

`../research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md`

## G3-03 formal Study

G3-03 was prospectively frozen as:

**`TCTGD-STUDY1` — Transposition Concentration and Tree-to-Graph Divergence Study 1**

正式日本語題目:

**Baoにおけるtransposition集中とtree/graph乖離のprospective exact検証 — bounded RAW局所構造におけるbranch reconvergence、multi-parent state、duplicate occurrence、tree occurrence / RAW graph divergenceの再現可能なphase差の検証**

Frozen representation:

```text
state identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
relative local horizon = 5
```

Frozen candidate endpoints were C1–C5 for cumulative tree/RAW ratio, duplicate-transition concentration, multi-parent concentration, reconvergence onset and root-branch overlap.

## G3-03 Stage 0

`TCTGD-S0-TECHNICAL-2026-09-02-v1` used only synthetic technical fixtures and passed all mandatory controls.

```text
Stage 0 = STAGE0-PASS
deterministic core = e7e7831cf9503c94441a5dc9b30253485dc4b498e9b397408901186c914765d5
fresh scientific seed consumption = false
protected depth-10 access = false
```

Actions provenance:

```text
run = 33589334375
job = 100119933850
artifact = 9831182022
artifact ZIP SHA-256 = efa3669c06a20b793d3f8feff80f71535fb582c0d1165fed38cf4dc0c3f78924
```

## G3-03 pre-Stage-1 control-plane correction

Before fresh Stage 1 evidence, non-scientific tooling smoke established that the original branch-only `workflow_dispatch` target returned HTTP 404 through GitHub REST. No fresh scientific evidence was generated/read.

A technical-execution-only v2 refreeze was therefore performed before Stage 1 authorization. The original prospective spec was preserved. The v2 correction changed only:

- execution trigger/control plane;
- durable pre-computation lease and advancement allowlist;
- durable artifact-before-mirror path;
- upstream identity-only firewall.

It did **not** change Stage 1/2 seed blocks, population, relative horizon, endpoints, promotion gate, formal test, resource ceilings, representation, or claim boundary.

Scientific-content baseline after the pre-fresh correction:

`3b31c0e853b99d50e6e4cd924984342535c22547`

Non-scientific push-path smoke v2:

```text
run = 33592075136 / success
artifact = 9832086009
artifact ZIP SHA-256 = 995b566a2c73f8972052315a8b5edc34b15c33602836a028399e3b47f916303a
fresh scientific evidence = false
Stage 1 seed access = false
protected depth-10 access = false
```

## G3-03 Stage 1 authorization and execution

Stage 1 was separately authorized exactly once:

```text
Stage = TCTGD-S1-DEVELOPMENT-2026-09-02-v1
seed = 31310001..31310192
target = 12 Namua + 12 Mtaji
authorized scientific executions = 1
actual scientific executions = 1
authorization nonce = TCTGD-S1-AUTH-2026-09-02-V2-01
```

Actions run:

```text
run = 33592380079
lease job = 100128827626 / success
scientific job = 100128867042 / exit 2 after writing TECHNICAL-INVALID canonical result
mirror job = 100129459563 / success
execution trigger commit = 18cdade48db8f19e3b49615041630948dafb4e61
lease commit = 2320d80424a48cbf72964d3910b90522c7936151
mirror commit = ce94af693386699a5b0cc6292d3ac817af034f19
```

Durable Stage 1 artifact:

```text
artifact = 9832258829
name = tctgd-stage1-development-result-33592380079
size = 27447 bytes
ZIP SHA-256 = cb03924420df2b280398f5493283dc47fae01bb4e22afdd18560d42b5bf1139b
```

Unlike G3-02, the canonical result bytes were durably uploaded before repository mirror and are preserved in the research branch.

## G3-03 Stage 1 verification

Pass / agreement state:

```text
selectedPairCount = 12
selectedRootCount = 24
populationComplete = true
stageResourcePass = true
sourceIdentityExact = true
staticIndependence = true
pairComparisonExact = true
developmentExact = true
```

Production / independent canonical Stage 1 scientific-core SHA-256 values were identical:

`d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f`

However, mandatory frozen integrity gates failed:

```text
allRootExact = false
stageScientificExact = false
stageDisposition = TECHNICAL-INVALID
```

### Causal technical defect

Production built its endpoint map as an ordinary JavaScript object. Independent implementation built the equivalent endpoint map using `Object.create(null)`.

The frozen Stage 1 runner used Node.js `util.isDeepStrictEqual` for root/stage in-memory exact agreement. That comparison is prototype-sensitive. Therefore exact endpoint values and canonical serialization could agree while the object-prototype difference caused root-level `endpointExact=false`.

This is a verification-representation defect, not evidence that the exact endpoint arithmetic disagreed. Nevertheless the frozen mandatory integrity gate failed.

The defect became known only after fresh Stage 1 evidence was generated. Changing the endpoint-map prototype, replacing deep-strict equality with canonical equality, or rerunning the same seed block would be post hoc same-evidence rescue and is prohibited.

## G3-03 diagnostic candidate provenance

The technical-invalid run recorded promotion-like directions for:

- C1 cumulative tree/RAW ratio — `NAMUA-GREATER`
- C2 duplicate/unique-transition fraction — `NAMUA-GREATER`
- C3 layer-sum multi-parent fraction — `NAMUA-GREATER`
- C4 reconvergence-onset score — `MTAJI-GREATER`

These are diagnostic provenance only.

Formal promoted candidate set:

**`[]`**

## G3-03 formal closure

```text
Stage 1 = TECHNICAL-INVALID
G3-03 / TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = CONSUMED
Stage 2 seed = NOT CONSUMED
```

Canonical closure records:

- `../transposition-concentration-tree-graph-divergence/README.md`
- `../transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md`
- `../transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md`
- `../transposition-concentration-tree-graph-divergence/CURRENT_STATUS.md`
- `../transposition-concentration-tree-graph-divergence/DECISION_REGISTER.md`
- `../transposition-concentration-tree-graph-divergence/REPRODUCIBILITY_INDEX.md`
- `../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md`
- `checkpoints/2026-09-02-g3-03-technical-invalid-closure.md`

## G3-04 formal closure

G3-04は`SFCDF-STUDY1`としてprospectively freezeし、Stage 0 `STAGE0-PASS`、Stage 1 `STAGE1-PASS`、Stage 2 `STAGE2-PASS`まで完了した。

Stage 1 fresh `31410001..31410192`では12 paired trajectoriesをexactly one authorized executionで測定し、C1 unit-width occupancyを`MTAJI-GREATER`、C6 cumulative tree/RAW ratioを`NAMUA-GREATER`としてpromotionした。C2–C5はpromotionされずStage 2へ進めていない。

Stage 2ではStage 1 RAW-root 24、trajectory 24、first-16-prefix 12 identitiesをadditional firewallとしてmaterializeし、fresh `31420001..31420288`から18 paired trajectories / 36 rootsをexactly one authorized formal executionで測定した。

Formal candidate decisions:

- C1 `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION` = **`CONFIRMED / MTAJI-GREATER`**。18/18同方向、exact two-sided sign-test `p=1/131072`、Holm PASS。
- C6 `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO` = **`CONFIRMED / NAMUA-GREATER`**。18/18同方向、exact two-sided sign-test `p=1/131072`、Holm PASS。

Production / independent formal Stage scientific coreは`e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039`でexact一致した。Stage 2 durable artifactはID `9844368476`、ZIP SHA-256 `c4d10eb07eec6ed75510f344f5c06d13deabeb03210023cd541035f05bd5da0f`。

Study lifecycleは`CLOSED / FORMAL-COMPLETE`。このlifecycle tokenは新しいscientific omnibus labelではなく、formal inferenceはcandidate-levelの`CONFIRMED` / `NOT-CONFIRMED`に限定する。

C1/C6からgame-theoretic forcing、best-move clarity、search ease、strategic simplicity、human difficulty、value/win probability、causal phase effect、depth >5 generalizationを導かない。

Canonical records:

- `../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`
- `../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`
- `../structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md`
- `../structural-forcing-corridor-decision-funnel/DECISION_REGISTER.md`
- `../structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md`
- `../structural-forcing-corridor-decision-funnel/checkpoints/2026-09-02-stage-2-formal-pass-study-closure.md`
- `../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`
- `checkpoints/2026-09-02-g3-04-formal-complete-closure.md`

## G3-05 formal closure

G3-05 was prospectively frozen as `BECT-STUDY1` — Branch Expansion and Compression Transition Study 1. Stage 0 v2 passed the longitudinal technical contract. Stage 1 was then authorized and executed exactly once on fresh seed namespace `31510001..31510240`.

The execution entered fresh bounded RAW measurement and failed closed with `relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529`. The canonical result is `TECHNICAL-INVALID`; Stage 1 seed is consumed and the no-rescue boundary is active. Partial telemetry is diagnostic-only and yields no formal promoted candidates.

```text
G3-05 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = NOT CONSUMED
```

Durable artifact `9849245665` (ZIP SHA-256 `0c99d05c1983a35996e283dee379e65848a8df98dda46989053ebd46873cfbcc`) was mirrored exactly without scientific recomputation by run `33637372364`, commit `ac2bd2ca101a9002c69131c2c39ebbfbb98368a1`.

G3-06 was not automatically authorized by G3-05 closure; a separate fresh-free current-state review was required.

Canonical closure records:

- `../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md`
- `../branch-expansion-compression-transition/CURRENT_STATUS.md`
- `../branch-expansion-compression-transition/DECISION_REGISTER.md`
- `../branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md`
- `../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`
- `checkpoints/2026-09-02-g3-05-technical-invalid-closure.md`

## Post-G3-05 authorization of G3-06

The required fresh-free current-state review concluded:

**`G3-06-AUTHORIZED`**

Canonical review:

`../research-program-decisions/2026-09-02-post-g3-05-g3-06-authorization-review.md`

RG3 checkpoint:

`checkpoints/2026-09-02-post-g3-05-g3-06-authorization-review.md`

G3-06 is authorized only for a new prospective Study-definition/preregistration freeze and technical-only Stage 0. Fresh Stage 1 remains `NOT AUTHORIZED` pending a separate post-Stage-0 authorization review.

The authorized scientific construct is non-causal move-conditioned/event-conditioned bounded structural change. Mandatory capture prevents a generic same-root capture/non-capture contrast, and generic Namua reserve decrement is phase-linked; final reserve depletion is mechanically linked to Namua→Mtaji transition. These identifiability facts must be frozen into the Study contract rather than hidden by post hoc control selection.

No G3-03 diagnostic direction/value or G3-05 partial telemetry may enter G3-06 event/endpoint/threshold/candidate selection. G3-04 C1/C6 remain context only.

## G3-06 formal closure

G3-06は`BRMGI-STUDY1`としてprospectively freezeし、LGTGMIV F1-F5 / RAW-only / relative depth 5のbounded instrumentだけでrule-semantic event周辺のgeometry changeを検証する契約とした。

Stage 0 v1はtechnical fixture invariantで`TECHNICAL-INVALID / NO RERUN`。fresh scientific evidence 0の状態でtechnical fixtureだけを修正したv2を別versionとしてrefreezeし、v2は`STAGE0-PASS`。その後fresh Stage 1をexactly one authorized executionで開始した。

Stage 1 authorization/source binding/durable leaseはPASSしたが、geometry measurement前にproduction / independent event-unit selectionが一致せず、canonical resultは:

```text
stageDisposition = TECHNICAL-INVALID
technicalError = production/independent selection mismatch
unitTimings = []
formal promoted candidate set = []
Stage 1 seed = CONSUMED
no-rescue boundary = CROSSED / ACTIVE
```

Durable result artifactは`9865581198`、ZIP SHA-256は`3f43ff832afaae5fc0a1d6756dcc9fa0101eb5a67befc7f3cdc2d1536bdb5d2a`、exact-byte mirror commitは`b8f9fe0e2d5008be2d41b3b8271fa325144f82fc`。

Formal closure:

```text
G3-06 / BRMGI-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = NOT CONSUMED
same-evidence selector repair/rerun = PROHIBITED
```

これはcapture / nyumba / reserve / Namua→Mtajiのgeometry effectが「ない」というnegative/null resultではない。

Canonical closure records:

- `../bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md`
- `../bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md`
- `../bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md`
- `../bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md`
- `../bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md`
- `../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md`
- `checkpoints/2026-09-03-g3-06-technical-invalid-closure.md`

## Post-G3-06 authorization of G3-07

The required fresh-free current-state review concluded:

**`G3-07-AUTHORIZED`**

Canonical review:

`../research-program-decisions/2026-09-03-post-g3-06-g3-07-authorization-review.md`

RG3 checkpoint:

`checkpoints/2026-09-03-post-g3-06-g3-07-authorization-review.md`

G3-07 is authorized only for a new prospective Study-definition/preregistration freeze and technical-only Stage 0. Fresh Stage 1 remains `NOT AUTHORIZED` pending a separate post-Stage-0 Stage 1 authorization review.

The minimum scientific foundation is LGTGMIV F1-F5 within RAW-only relative depth 5. No formal positive G3-02/G3-03/G3-05/G3-06 result is required or implied. Their technical-invalid diagnostics, partial telemetry and candidate-like directions are prohibited as G3-07 scientific inputs. G3-04 C1/C6 are context only. G2-02 remains `INCONCLUSIVE`; its scientific observations are not G3-07 evidence and higher-resource search is not truth.

The authorized construct is a non-causal bounded association/concentration/structural relation between exact local geometry and search-output changes under prospectively frozen deterministic search-condition perturbations. Best-move identity, ranking, score, PV, game-theoretic value, empirical outcome and human difficulty remain separate constructs.

## Protected evidence

G3-11 reserved standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

G3-02 / G3-03 / G3-04 / G3-05 / G3-06はいずれもこのholdoutを生成・read・peekしていない。G3-07 authorization review also generated/read no fresh scientific evidence and did not access the protected holdout. G2-12はdepth-10 truthの代替として使用しない。

## Claim boundary

G3-03 has no formal positive transposition/tree-graph phase-difference claim.

The diagnostic C1–C4 directions must not be generalized to Bao overall, depth >5, best move, search difficulty, strategic simplicity, tactical simplicity, value, win probability, forcing, causal effects, or human difficulty.

The technical observation that canonical scientific bytes matched while prototype-sensitive in-memory equality failed is a reproducibility/verification lesson only; it is not a scientific confirmation of the candidate effects.

G3-04のformal positive claimはC1/C6のfrozen candidate-level phase differenceだけに限定する。C1/C6をgame-theoretic forcing、best-move clarity、search ease、strategic simplicity、human difficulty、position value / win probability、causal phase effect、relative depth 5を超える一般化へ拡張しない。

G3-06は`CLOSED / TECHNICAL-INVALID`であり、causal-mechanism languageはauthorizeされない。valid Stage 1 candidate evaluationへ到達していないため、G3-06からsubstantiveなrule-event/geometry positive・negative・null claimは存在しない。

G3-07 authorization does not authorize causal-mechanism language, objective move correctness, deeper-search truth, game-theoretic difficulty, strategic/tactical difficulty, blunder propensity, win-probability inference or human-difficulty claims. Until valid fresh held-out evidence exists, no substantive G3-07 geometry/search association claim exists.

## Next program boundary

G3-06 / `BRMGI-STUDY1` remains `CLOSED / TECHNICAL-INVALID`; Stage 1 seed is consumed, same-evidence rescue is prohibited, formal promoted candidate set is `[]`, and Stage 2 is `NOT-AUTHORIZED-NOT-EXECUTED`.

G3-07 has passed its required post-G3-06 authorization review as **`G3-07-AUTHORIZED`**. The next permitted scientific-program action is to create a dedicated G3-07 research branch from the post-decision `main`, freeze the formal Study identity/Stage structure/full prospective search-instability/local-geometry contract, and execute only technical Stage 0. Fresh Stage 1 scientific evidence remains blocked pending a separate Stage 1 authorization review.

Protected depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.

Historical `PROGRAM_PLAN.md` remains unchanged.
