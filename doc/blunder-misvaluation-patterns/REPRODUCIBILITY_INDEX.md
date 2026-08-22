# REPRODUCIBILITY_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22  
Status: **STUDY 1 ACTIVE / STAGE 1 EXPLORATORY COMPLETE**

## Study identity

```text
studyId = BMP-STUDY1
baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
research branch = research/blunder-misvaluation-patterns
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
```

This index freezes the reproducibility chain for the completed Stage 1 exploratory discovery. Study 1 as a whole remains active because Stage 2 formal confirmation has not started.

## Stage 1 execution chain

```text
contract freeze commit
  94b565468a9222dcaee0576529147ef032a284e6

contract validation execution HEAD
  b3ff83a4b94b5e60e98ef48b6b2666a20a26334a

validated implementation commit
  8df328ca238611919ac58c262b92058712ee1049

tooling validation result commit
  cd26cb3280fde00663618162f7c1e2d306470032

execution source freeze commit
  0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c

Stage 1 generation authorization commit
  1af3828c1c25789d6f4af590ee973cffd34bca46

generation result commit
  bb6375ff1ce3afab00d588b4b6e017b6aaf24541

verification result commit
  17995f04f3b9abbe0d73b2f035e8129ff07e191f

selection execution HEAD
  2f6567bab0590ca7741fd8ad9907118544f6331d

selection result commit
  d6a8617a517140e34e9af3a5f2b0793884fb1345

measurement execution HEAD
  1c7fc1f8d979d6952433406e7ab5d0a515a633fb

measurement result commit
  5e916c6676022a50d551310f21cf1d3414b6c27c

discovery execution HEAD
  14c0d29683611ecd76771a213ce2380cb71fa18d

discovery result commit
  ffb9184d84c775e94f52b91f0c1621ea46061a93
```

## Population and identity

```text
Stage 1 games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
distinct generation opening prefixes = 1621
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
```

Selection:

```text
selected unique rule states = 1200
Namua = 600
Mtaji = 600
distinct selected opening prefixes = 1067
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
```

Measurement:

```text
completed roots = 1200
measured legal moves = 5295
all selected roots finite D3 tables = true
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
```

## Discovery artifact identity

Raw local artifact:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/discovery-result.json
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

The raw artifact is intentionally not committed because it contains the full detailed failed-candidate set.

Repository-scale streaming extraction:

```text
bytes = 10034
sha256 = 0df0438105c7d7b248e014ffc30087b96dceb97bb4aeb716456b504cddc32db0
method = streaming extraction of top-level discovery identity/counts, promotedCandidates and noRescue
original artifact modified = false
```

Canonical compact discovery record:

- [`results/STAGE_1_DISCOVERY_RESULT.json`](results/STAGE_1_DISCOVERY_RESULT.json)

## Machine-readable result records

- [`results/STAGE_0_FEASIBILITY_RESULT.json`](results/STAGE_0_FEASIBILITY_RESULT.json)
- [`results/STAGE_1_CONTRACT_VALIDATION_RESULT.json`](results/STAGE_1_CONTRACT_VALIDATION_RESULT.json)
- [`results/STAGE_1_TOOLING_VALIDATION_RESULT.json`](results/STAGE_1_TOOLING_VALIDATION_RESULT.json)
- [`results/STAGE_1_GENERATION_RESULT.json`](results/STAGE_1_GENERATION_RESULT.json)
- [`results/STAGE_1_VERIFICATION_RESULT.json`](results/STAGE_1_VERIFICATION_RESULT.json)
- [`results/STAGE_1_SELECTION_RESULT.json`](results/STAGE_1_SELECTION_RESULT.json)
- [`results/STAGE_1_MEASUREMENT_RESULT.json`](results/STAGE_1_MEASUREMENT_RESULT.json)
- [`results/STAGE_1_DISCOVERY_RESULT.json`](results/STAGE_1_DISCOVERY_RESULT.json)

## Preregistration / authorization

- [`preregistration/STAGE_0_DESIGN_FREEZE.json`](preregistration/STAGE_0_DESIGN_FREEZE.json)
- [`preregistration/STAGE_1_EXPLORATORY_SPEC.json`](preregistration/STAGE_1_EXPLORATORY_SPEC.json)
- [`preregistration/STAGE_1_EXECUTION_SOURCE_FREEZE.json`](preregistration/STAGE_1_EXECUTION_SOURCE_FREEZE.json)
- [`preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`](preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json)

## Scientific tooling

```text
tools/experiments/lib/blunder-misvaluation-patterns.js
tools/experiments/lib/blunder-misvaluation-stage1-contract.js
tools/experiments/lib/blunder-misvaluation-stage1-corpus.js
tools/experiments/lib/blunder-misvaluation-stage1-discovery.js
tools/experiments/run-blunder-misvaluation-stage1-exploratory.js
tools/experiments/verify-blunder-misvaluation-stage1-exploratory.js
tools/experiments/validate-blunder-misvaluation-stage1-spec.js
```

Tests:

```text
test/blunder-misvaluation-stage0.test.js
test/blunder-misvaluation-stage1-contract.test.js
test/blunder-misvaluation-stage1-tooling.test.js
```

## Interpretation firewall

Reproducibility of Stage 1 establishes the machine procedure and exploratory promotion output only. It does not turn Stage 1 candidates into confirmed blunders.

```text
Stage 1 exploratory discovery = complete
Study 1 formal result = none
confirmatory reuse of Stage 1 data = forbidden
Stage 2 generation = not authorized
human misconception claim = not authorized
game-theoretic blunder claim = not authorized
```
