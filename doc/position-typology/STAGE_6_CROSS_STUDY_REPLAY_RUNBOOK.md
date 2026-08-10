# Stage 6 Cross-Study Bridge — Replay Integrity Runbook

Date: 2026-08-10  
Status: **protocol frozen / replay integrity next / no association analysis yet**

## Frozen protocol

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

This protocol was frozen after schema feasibility audit and before any MTAJI-M1/M2 or N-ACT/N-CON association value was calculated.

## Purpose of this step

This step establishes that Study 1 candidate positions can be reconstructed exactly from the immutable final formal archives with the current engine-compatible replay path.

It does not yet compute:

- MTAJI-M1/MTAJI-M2 association,
- N-ACT/N-CON association,
- STYLE-C1..C4,
- any new cluster,
- any confirmatory p-value.

## Tools

Preparation:

```text
tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py
```

Replay:

```text
tools/experiments/replay-position-typology-stage6-candidate-states.js
```

The preparation tool:

1. verifies E-018/E-019/E-020 archive SHA-256;
2. reads the fixed candidate CSV paths;
3. applies the inherited Category-A / `distanceToTerminal >= 9` population rule;
4. rejects unknown classifier values;
5. extracts only candidate-bearing formal game JSON to a new local working directory;
6. leaves the formal archives untouched.

The replay tool:

1. starts from `public/engine.js` `initialState()`;
2. replays archived move objects;
3. verifies every traversed archived observation `stateHash`;
4. verifies move `beforeStateHash` and `afterStateHash` where present;
5. requires CSV phase, archived observation phase, and replayed position phase to agree;
6. only then calls `extractPositionTypologyObservation()` at each candidate ply;
7. writes a local candidate-state dataset plus a small replay audit.

## Local execution

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version
node --version

python -m py_compile \
  tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py

node --check \
  tools/experiments/replay-position-typology-stage6-candidate-states.js

python tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py

node tools/experiments/replay-position-typology-stage6-candidate-states.js
```

If the formal archives have moved, pass explicit paths to the Python preparation tool with `--e018`, `--e019`, and `--e020`.

## Expected local artifacts

Large local replay dataset — keep local, do not upload yet:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/replay/replayed-candidate-states.json
```

Small audit to share:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/replay/replay-audit.json
```

Upload/share **only `replay-audit.json`**.

## Required acceptance conditions

The replay audit must show:

```text
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
allReplayChecksPassed = true
associationAnalysisPerformed = false
scientificAssociationValuesComputed = false
gamesExecuted = false
formalAnalysisRerun = false
study1FormalDecisionsModified = false
stage5DecisionModified = false
```

There must be six condition audit rows:

```text
E-018 D2-P2
E-018 D2-LG
E-019 D3-P2
E-019 D3-LG
E-020 D3-P2
E-020 D3-LG
```

Any replay/hash/phase mismatch stops the bridge. Do not regenerate games or patch the archive to make it pass.

## After replay acceptance

Only after the audit is accepted will the fixed Stage 6 analyzer be enabled to calculate:

1. phase overlap;
2. Mtaji expansion/comparator M1/M2 composition;
3. Namua expansion/comparator N-ACT/N-CON descriptive contrasts.

Those outputs remain secondary / hypothesis-generation and cannot change Study 1 or Stage 5 formal decisions.
