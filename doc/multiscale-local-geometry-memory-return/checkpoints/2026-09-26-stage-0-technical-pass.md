# G4-07 / MLGMR-STUDY1 — Stage 0 technical validation checkpoint

Date: 2026-09-26  
Agenda: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
Stage: `MLGMR-S0-TECHNICAL-2026-09-26-v1`  
Final disposition: **`STAGE0-PASS`**

## 1. Purpose

Stage 0 is a technical-only prerequisite. It validates the frozen representation, lag/return semantics, phase-crossing censoring, trajectory-level aggregation, production/independent separation, identity firewall behavior, resource feasibility, and execution guards **without reading any G4-07 scientific seed**.

Stage 0 PASS is not a scientific result and does not automatically authorize Stage 1.

## 2. Execution history

### Run 1 — fail-closed before technical execution

```text
run = 36233613050 / attempt 1
head = c523d44ef474e4c5bb315d249759345b05f98849
conclusion = failure
binding = MLGMR-STUDY1-STAGE0-BINDING-2026-09-26-V1
failure point = frozen execution binding verification
cause = actions/checkout default fetch-depth=1 made HEAD~2 unavailable
technical-only Stage 0 body = NOT EXECUTED
fresh scientific seed reads = 0
Stage 1 seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
```

This was an execution-environment issue. The fail-closed guard correctly prevented Stage 0 from continuing.

### Run 2 — fail-closed in synthetic fixture

```text
run = 36238676096 / attempt 1
head = ea050adcc1182541cca743764e9db264e7ff16aa
conclusion = failure
binding = MLGMR-STUDY1-STAGE0-BINDING-2026-09-26-V2
binding verification = PASS
failure point = synthetic semantic fixture
cause = abbreviated fixture axis keys (CRCLGR-A1..A6) did not match canonical axis identifiers
technical trajectory scan = NOT STARTED
fresh scientific seed reads = 0
Stage 1 seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
failure artifact ID = 10904547624
```

The remediation changed only technical fixture key binding to canonical `MP.AXES`; the scientific design, checkpoint grid, lag family, endpoints, support gates, seed reservations, and measurement semantics were unchanged.

### Run 3 — canonical PASS

```text
run = 36238840292 / attempt 1
head = 0c7cdb2b2fa83c4d97ec0d2ad27c6a5c9c22b2b5
conclusion = success
binding = MLGMR-STUDY1-STAGE0-BINDING-2026-09-26-V3
frozen source commit = 0886bb6786c38b35c5285dd87da8edaf7c6cb5f8
mandatory gates = 18 / 18 PASS
production / independent exact agreement = true
artifact ID = 10905163005
artifact ZIP SHA-256 = cf5b96e4fb63786e085bf9719beed6ff125f588d623657ed7450031b1a20614f
result.json SHA-256 = d6854bd00454288e76de2274990571f6c5d0249b7b8ee8f632c53e8a4fe6e0a5
result.json bytes = 6967
elapsedMs = 199675
rssAfterBytes = 218730496
peak RSS ceiling = 4294967296
```

## 3. Canonical Stage 0 result

Canonical repository mirror:

`doc/multiscale-local-geometry-memory-return/results/stage-0/STAGE_0_TECHNICAL_RESULT.json`

The repository mirror is the byte-exact `result.json` emitted by canonical Run 3.

Final guards:

```text
scientificExecution = false
scientificOutcomeGenerated = false
freshScientificSeedReads = 0
stage1SeedReads = 0
stage2SeedReads = 0
G4-10 depth11 access = 0
public AI change = false
main integration = false
```

Technical trajectories used only the frozen technical-fixture namespace. P1 and P2 each obtained one fully eligible trajectory with all 15 checkpoints through ply 72 depth-5 eligible. Technical fixture seed `40709001` remains prohibited from scientific use.

## 4. Interpretation

Stage 0 establishes only the following technical prerequisite:

- exact-rational six-axis continuous representation can be evaluated on the frozen checkpoint grid;
- lag `1,2,4,8` semantics and bounded return semantics are executable;
- whole-span phase censoring and ZERO handling behave as preregistered;
- production and independent implementations agree exactly;
- the identity firewall fixture blocks an upstream trajectory identity;
- the workload is within the frozen Stage 0 resource ceiling.

It does **not** establish persistence, reversal, memory length, or return as a Bao scientific result.

## 5. Next gate

Stage 1 fresh development access remains separately gated.

The next allowed step is a **post-Stage-0 / pre-Stage-1 design-and-source-freeze authorization review**. That review may authorize implementation and execution freezing, but scientific Stage 1 seed access must remain disabled until a final one-shot execution authorization binds the source blobs, workflow, branch, trigger, and attempt.

Stage 2, G4-10 depth 11, public-AI change, and main integration remain unauthorized.
