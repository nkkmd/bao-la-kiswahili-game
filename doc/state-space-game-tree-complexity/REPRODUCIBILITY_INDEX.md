# SSGTC-STUDY1 — Reproducibility Index

## Study identity

```text
studyId = SSGTC-STUDY1
baselineMain = 9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901
branch = research/state-space-game-tree-complexity
representation = RAW-ONLY
formalDecision = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

## Authoritative raw identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
pendingRequired = true
seedInvariant = sum(pits)+sum(reserve)+sum(pending)=64
validatedSymmetryTransformations = []
```

`public/engine.js` at the study-start baseline initializes `pending:[0,0]`, but compatibility code can synthesize missing `pending`. SSGTC therefore validates raw states before engine entry and rejects missing `pending` rather than allowing engine fallback to repair studied identity.

## Core implementation

Production representation:

- `tools/experiments/lib/ssgtc-representation-production.js`

Independent representation:

- `tools/experiments/lib/ssgtc-representation-independent.js`

Stage runners/verifiers:

- `tools/experiments/run-ssgtc-stage0-technical.js`
- `tools/experiments/verify-ssgtc-stage0-independent.js`
- `tools/experiments/run-ssgtc-stage1-exploratory.js`
- `tools/experiments/verify-ssgtc-stage1-independent.js`
- `tools/experiments/run-ssgtc-stage2-formal.js`
- `tools/experiments/verify-ssgtc-stage2-independent.js`

Workflows:

- `.github/workflows/ssgtc-stage0-technical.yml`
- `.github/workflows/ssgtc-stage1-exploratory.yml`
- `.github/workflows/ssgtc-stage2-formal.yml`

The independent formal verifier does not import the production serializer, production formal runner, or Stage 1 artifact code. It independently re-enumerates the entire frozen Stage 2 graph and tree domains.

## Stage 0 — technical-only validation

Canonical run:

```text
workflowRunId = 32803985808
decision = SSGTC-STAGE0-PASS
S0-G1..S0-G12 = PASS
scientificInferenceAuthorized = false
maxDepth = 2
uniqueRawStates = 19
transitionOccurrences = 18
```

State/transition diagnostic hashes:

```text
stateSetSha256 = 0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f
transitionSetSha256 = be534cbc3e99808a668483c21fca1720dc5ea5a7ac442075294f21a8542baea1
```

Stage 0 counts are diagnostic only and are not scientific Stage 1/2 evidence.

Canonical compact record:

- `results/STAGE_0_TECHNICAL_RESULT.json`

## Stage 1 — exploratory-only characterization

Frozen resource profile:

```text
graph max depth = 12
graph max unique raw states = 100000
graph max generated edges = 500000
graph max frontier states = 50000

tree max depth = 8
tree max node occurrences = 250000
tree max edge occurrences = 250000

global max wall clock = 600 seconds
global max RSS = 4294967296 bytes
global max uncompressed artifact bytes = 134217728 bytes
```

Non-canonical technical failures were preserved rather than scientifically interpreted:

- `32805036665` — self-inspection G9 false positive;
- `32805162435` — second self-reference G9 failure;
- `32805259739` — independent verification exposed incomplete-depth aggregation contamination.

Accepted exploratory run:

```text
workflowRunId = 32805576462
workflowJobId = 97674932536
artifactId = 9548021440
artifactZipSha256 = d95f8be89984480031f6742d63d003f67c6cea8afe7b401d05adca28ee09846d
technicalAcceptance = PASS
scientificInferenceAuthorized = false
formalReuseInStage2 = false
```

The graph reached `FRONTIER_CAP` during depth-8 parent expansion. Depth-9 rows are censored/observed only. The independently verified completed graph domain is exactly raw-state depths 0..8 with transitions from parent depths 0..7:

```text
raw states through depth 8 = 24848
transitions from parent depths 0..7 = 25648
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
```

The exploratory tree completed through depth 8 with 30,941 nodes and 30,940 edges. The predeclared Stage 2 feasibility minimum passed.

Canonical compact record:

- `results/STAGE_1_EXPLORATORY_RESULT.json`

## Stage 2 — formal bounded exact enumeration

Preregistration:

- `preregistration/STAGE_2_FORMAL_SPEC.json`
- `preregistration/STAGE_2_PROSPECTIVE_FIREWALL.md`

Frozen formal domain:

```text
root = standard engine initialState()
parent expansion depths = 0..7
reachable raw-state depths = 0..8
game-tree depths = 0..8
symmetryReduction = false
canonicalization = false
estimation = false
Stage1 rows reused as formal evidence = false
```

Canonical production/verification run:

```text
workflowRunId = 32805975114
workflowJobId = 97676042161
artifactId = 9548146194
artifactZipSha256 = 713e258847a98e9b01866bae248f0986708f8ef90df803157514c63469b52e15
formalDecision = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
independentVerification = PASS
```

Canonical formal counts:

```text
reachable raw states = 24848
graph transition occurrences = 25648
game-tree node occurrences = 30941
game-tree edge occurrences = 30940
```

Canonical set identities:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

Formal artifact file identities:

```text
formalGraphStatesFileSha256 = 6150fe6a21837126930cc1733af6c2d53590be5b019679082bea282d21f3c349
formalGraphTransitionsFileSha256 = 0d403739ae8258f430b1ea8a6808ef5fbb317b7b78f9b29b5fa7829923c2f696
formalSummaryFileSha256 = f85025fb475137b7d7e25218b996ec6bbddba04e915775cd4e70b4372c88ea4f
repositoryFacingFileSha256 = 3247de6de1b4f2c363bac8161f99aa0a5a51e457963fb91d2dfb8f87916b524e
productionVerificationFileSha256 = 9a734858efe19842a22b56058fd6a763145cc3b2c2289b347cb309dccf85414c
independentVerificationFileSha256 = 2061957e5132c71cfe7cc325b2ca4c5141f804d1aaedecce7217fe1e506323d1
```

The downloaded artifact ZIP was re-hashed after retrieval and matched the GitHub-recorded digest.

Canonical compact record:

- `results/STAGE_2_FORMAL_RESULT.json`

## Materialization chain

The study maintained the following responsibility separation:

```text
scientific raw artifact
  -> verified repository-facing projection
  -> reopen / re-hash / semantic verification
  -> compact canonical result committed under doc/.../results/
```

Repository-facing projections never become raw-state identity authority merely because they are committed.

## Reproduction commands

From repository root with Node.js 22 or a compatible runtime:

```sh
node tools/experiments/run-ssgtc-stage0-technical.js
node tools/experiments/verify-ssgtc-stage0-independent.js

node tools/experiments/run-ssgtc-stage1-exploratory.js
node tools/experiments/verify-ssgtc-stage1-independent.js

node tools/experiments/run-ssgtc-stage2-formal.js
node tools/experiments/verify-ssgtc-stage2-independent.js
```

The canonical GitHub Actions workflows are preferred for provenance because they preserve the frozen environment, run IDs, and uploaded artifacts.

## Claim boundary

The exact result is confined to the frozen depth-8 RAW-ONLY target. No global Bao state-space count, full game-tree count, symmetry-reduced count, canonicalization claim, or full-game estimator is authorized by this Study.