# SSGTGE-STUDY1 — Decision Register

## DR-001 — Study identity

Date: 2026-08-30  
Decision: instantiate agenda label `G2-12` as `SSGTGE-STUDY1` — **State-Space / Game-Tree Growth Estimation Study 1**.

Rationale: the repository program contract explicitly separates G2-05 bounded exact enumeration from G2-12 prospective growth estimation with fresh exact holdout.

## DR-002 — Baseline and branch

```text
baseline remote main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
branch = research/g2-12-state-space-game-tree-growth-estimation
```

The baseline SHA exactly matches the last recorded PSRRE-STUDY1 integration SHA.

## DR-003 — RAW-only scientific identity

Freeze:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Exclude `turn,reason`. Validated transform set remains `[]`. No canonicalization/symmetry/seat-swap/reflection reduction.

## DR-004 — G2-05 boundary

`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` is immutable. Depth 0..9 exact summaries are development evidence only. G2-12 cannot retroactively extend the G2-05 formal domain.

## DR-005 — Development / holdout firewall

Development = immutable G2-05 depth 0..9 summaries.  
Mandatory fresh formal holdout = depth 10.  
Secondary prospective stress-test = depth 11 if complete under unchanged ceilings.

Stage 2 must enumerate from a fresh standard root and may not import G2-05 materialized state/edge rows as formal enumeration input.

## DR-006 — Candidate estimator set

Freeze exactly:

```text
E1-TRAILING-LOG-LINEAR-W5
E2-LOG-QUADRATIC-D2PLUS
E3-LOCAL-LOG-INCREMENT-TREND-W4
```

No post-freeze family addition is allowed.

## DR-007 — Development selection rule

Primary modeled series are per-depth new RAW states and tree node occurrences. Rolling-origin cells: `5->6`, `6->7`, `7->8`, `8->9`.

Eligibility maximum absolute log error = `0.15`. Winner is selected by minimum worst-cell error, then minimum mean error, then fixed candidate order.

## DR-008 — Formal endpoint

Depth 10 validation requires complete exact enumeration, independent zero mismatch, joint maximum absolute log error `<= 0.20`, and coverage of both primary series by the frozen development-calibrated envelope.

## DR-009 — Resource ceiling

Freeze maximum target depth 11; mandatory complete holdout depth 10; cumulative RAW-state cap 2,000,000; depth-labelled edge/move-evaluation caps 12,000,000; parent-expansion cap 600,000; tree-occurrence cap 50,000,000; RSS 6 GiB; wall-clock 1,200 s; uncompressed scientific artifact cap 1 GiB.

## DR-010 — Decision taxonomy

```text
VALIDATED-WITHIN-FRESH-DEPTH-10-HOLDOUT
NOT-VALIDATED
NON-ESTIMABLE
RESOURCE-CENSORED
TECHNICAL-INVALID
INCONCLUSIVE
```

Negative/censored/invalid outcomes are valid closures.

## DR-011 — Seed/domain reservation

The scientific enumeration is deterministic and seedless. Development and holdout are separated by depth and evidence access rather than seed blocks.

## DR-012 — G2-11 boundary

G2-10 and PSRRE-STUDY1 remain closed without eligible frozen strategic representation. `G2-11 = NOT-AUTHORIZED` remains unchanged. G2-12 growth evidence is not strategic-regime evidence.

## DR-013 — Stage 0 authorization

Stage 0 technical-only work is authorized after the initial freeze commit. It must not generate or inspect fresh depth 10/11 scientific outcomes. Stage 1 and Stage 2 are not authorized by this decision.

## DR-014 — Stage 0 v1 is technical-invalid

Workflow run `33315971968` reached the v1 execution commit but the production Node process failed before any technical fixture output at the frozen source-binding gate.

```text
failure = SOURCE-HASH-BINDING-MISMATCH
path = tools/experiments/verify-ssgtge-stage0-independent.js
production process exit = 1
production result generated = false
independent result generated = false
fresh depth 10/11 outcome generated = false
real development candidate evaluation performed = false
```

The Actions run metadata reports `success`, but the workflow used a pipeline ending in `tee` without `pipefail`; therefore the nonzero Node exit was masked. The log-level gate result controls scientific/technical acceptance, not the cosmetic Actions conclusion.

Formal Stage 0 v1 disposition:

```text
SSGTGE-S0-TECHNICAL-2026-08-30-v1 = STAGE0-TECHNICAL-INVALID
```

## DR-015 — Stage 0 v1 is not rerun or repaired in place

The v1 authorization explicitly fixed `sameStage0EvidenceRerunAuthorized=false`. Run `33315971968` will not be rerun, and the v1 authorization/source record will not be rewritten to manufacture a PASS.

The v1 artifact is retained as provenance only:

```text
run = 33315971968
job = 99269373670
artifact = 9733443553
artifact ZIP SHA256 = df9bb95a22bec49141bd45ac7baf0c6829f668e2c764b3b4668103ada208d7ac
```

## DR-016 — Prospective Stage 0 v2 technical correction is permitted

Research Generation 2 precedent permits a genuine implementation defect discovered before scientific outcome generation to be corrected through explicit versioning, refreeze, and reauthorization.

Because v1 failed before depth-2 technical output, before real G2-05 estimator competition, and before any fresh holdout generation, a new technical-entry version is allowed:

```text
SSGTGE-S0-TECHNICAL-2026-08-30-v2
```

This is not a rerun of v1 evidence and is not a scientific-outcome rescue.

## DR-017 — v2 may change only orchestration/source-binding mechanics

v2 changes are restricted to:

```text
content-SHA authorization check -> repository Git-blob identity check
shell pipeline -> set -euo pipefail fail-closed pipeline
new versioned runner/verifier/workflow/spec/authorization paths
```

The following are immutable from Study start and may not change in v2:

```text
Study ID
RAW identity
validated transform set
estimator candidate set
rolling-origin cells
candidate eligibility threshold
winner-selection rule
uncertainty rule
formal depth-10 endpoint
formal threshold
holdout depths
resource ceilings
G2-05 interpretation boundary
G2-11 boundary
```

## DR-018 — Stage 0 v2 remains technical-only

Stage 0 v2 may enumerate only the standard-root depth-2 technical fixture. It may read G2-05 depth 0..9 only to validate source/schema plumbing and may not evaluate the real candidate competition. All estimator-family numeric tests use synthetic series only.

Fresh depth 10 or 11 generation/read remains forbidden. Stage 1 and Stage 2 remain unauthorized regardless of v2 preparation.

## DR-019 — v2 requires separate freeze and separate authorization commit

The v2 source/spec must be committed before execution. A subsequent authorization-only commit must bind the exact implementation-freeze parent and exact Git blob identities. v2 execution is not authorized by the v1 authorization or by the v2 source-freeze commit itself.
