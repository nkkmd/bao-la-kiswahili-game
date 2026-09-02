# Research Generation 3 — Current Status

Updated: 2026-09-02

```text
Program = Bao Third-Generation Research Program
Program status = ACTIVE / G3-04 CLOSED FORMAL-COMPLETE / POST-G3-04 G3-05 REVIEW REQUIRED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Research Generation 2 = CLOSED
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV formal eligible measurement families = F1,F2,F3,F4,F5
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-02 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02 formal promoted candidate set = []
G3-02 Stage 1 seed = 31210001..31210192 / CONSUMED
G3-02 Stage 2 seed = 31220001..31220288 / NOT CONSUMED
G3-03 = TCTGD-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-03 Stage 0 = TCTGD-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS
G3-03 Stage 1 = TCTGD-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
G3-03 Stage 1 authorized scientific executions = 1
G3-03 Stage 1 actual scientific executions = 1
G3-03 Stage 2 = TCTGD-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
G3-03 formal promoted candidate set = []
G3-03 Stage 1 seed = 31310001..31310192 / CONSUMED
G3-03 Stage 2 seed = 31320001..31320288 / NOT CONSUMED
G3-03 no-rescue boundary = CROSSED / ACTIVE
G3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE
G3-04 Stage 0 = STAGE0-PASS
G3-04 Stage 1 = STAGE1-PASS / authorized executions 1 / actual executions 1
G3-04 Stage 2 = STAGE2-PASS / authorized executions 1 / actual executions 1
G3-04 C1 = CONFIRMED / MTAJI-GREATER
G3-04 C6 = CONFIRMED / NAMUA-GREATER
G3-04 Stage 1 seed = 31410001..31410192 / CONSUMED
G3-04 Stage 2 seed = 31420001..31420288 / CONSUMED
G3-04 no-rescue boundary = CROSSED / ACTIVE
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Active scientific research branch = none / G3-04 CLOSED
Next scientific action = separate post-G3-04 current-state authorization review for G3-05; G3-05 is NOT AUTHORIZED
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

- `../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`
- `../structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md`
- `../structural-forcing-corridor-decision-funnel/DECISION_REGISTER.md`
- `../structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md`
- `../structural-forcing-corridor-decision-funnel/checkpoints/2026-09-02-stage-2-formal-pass-study-closure.md`

## Protected evidence

G3-11 reserved standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

G3-02 / G3-03 / G3-04はいずれもこのholdoutを生成・read・peekしていない。G2-12はdepth-10 truthの代替として使用しない。

## Claim boundary

G3-03 has no formal positive transposition/tree-graph phase-difference claim.

The diagnostic C1–C4 directions must not be generalized to Bao overall, depth >5, best move, search difficulty, strategic simplicity, tactical simplicity, value, win probability, forcing, causal effects, or human difficulty.

The technical observation that canonical scientific bytes matched while prototype-sensitive in-memory equality failed is a reproducibility/verification lesson only; it is not a scientific confirmation of the candidate effects.

G3-04のformal positive claimはC1/C6のfrozen candidate-level phase differenceだけに限定する。C1/C6をgame-theoretic forcing、best-move clarity、search ease、strategic simplicity、human difficulty、position value / win probability、causal phase effect、relative depth 5を超える一般化へ拡張しない。

## Next program boundary

G3-04はclosedであり、同Studyの追加seed、rerun、endpoint rescue、threshold変更は行わない。

Historical `PROGRAM_PLAN.md`では次のcore agenda itemはG3-05 — Branch Expansion / Compression Transition Study 1である。ただしG3-04のpositive resultはG3-05を自動authorizeしない。

次の安全なprogram actionは、**post-G3-04 current-state G3-05 authorization review**をread-onlyで実施し、G3-05が現在のformal evidence boundaryから独立に開始可能か、追加prerequisiteが必要か、またはnot-authorizedかを明示的に判定することである。authorization review完了前にG3-05 fresh scientific evidenceを生成・readしない。

Protected depth-10 holdoutは引き続き`SEALED / NOT GENERATED / NOT READ`。

Historical `PROGRAM_PLAN.md` remains unchanged.
Historical `PROGRAM_PLAN.md` remains unchanged.
