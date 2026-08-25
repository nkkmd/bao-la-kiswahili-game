# PCEM-STUDY1 — Reproducibility Index

Updated: 2026-08-25

## Study baseline

```text
studyId = PCEM-STUDY1
remoteMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
branch = research/practical-comeback-error-inducing-moves
```

## Required upstream scientific records

- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`
- `doc/critical-positions-outcome-branching/STUDY_1_FINAL_REPORT.md`
- `doc/blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md`
- `doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`
- `doc/position-complexity/STUDY_1_OVERVIEW.md`
- `doc/tactical-motifs/STUDY_1_OVERVIEW.md`
- `doc/restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`
- `doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`
- `doc/oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md`
- `doc/state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md`
- `doc/state-space-game-tree-complexity/CURRENT_STATUS.md`

## Study-owned protocol records

- `preregistration/STUDY_START_FIREWALL.md`
- `protocol/CONSTRUCT_MEASUREMENT_DEPENDENCIES.md`
- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`
- `preregistration/STAGE_1_DESIGN_SKELETON.md`
- `preregistration/STAGE_2_FORMAL_SKELETON.md`

## Stage 0 technical implementation

```text
tools/experiments/lib/practical-comeback-stage0-production.js
tools/experiments/run-pcem-stage0-technical.js
tools/experiments/verify-pcem-stage0-independent.js
test/practical-comeback-stage0-tooling.test.js
.github/workflows/pcem-stage0-technical.yml
```

The independent verifier does not import the production PCEM measurement core, the Critical Positions outcome-branching module, or the Position Complexity search-diagnostic module. It independently implements raw identity binding, exact move identity, exact first-reply enumeration, reference-search recursion, RNG derivation, policy choice and continuation replay.

Reference-search identity:

```text
pcem-exact-full-window-root-candidates/bao/q0/v1
```

## Stage 0 canonical workflow

```text
stageId = PCEM-S0-TECHNICAL-2026-08-25-v1
sourceCommit = 29976182dcdcabf206a1d0bf59252fe8bb2288df
workflowRunId = 32813154014
workflowJobId = 97696278964
artifactId = 9550497573
artifactName = pcem-stage0-technical-v1
artifactCompressedBytes = 33226
artifactDigest = sha256:0021c59fea047c0a192b0e9394513d63aba6347a02d79b1ce41b1bf6e61e2d32
workflowConclusion = success
```

Production technical result:

```text
decision = PRODUCTION-TECHNICAL-PASS-PENDING-INDEPENDENT-VERIFICATION
12 / 12 technical gates = PASS
fixtures = 3
phases = Namua + Mtaji
exact root moves = 15
exact first replies = 38
continuation rows = 60
accounted continuation rows = 60
elapsed = 4857.528147 ms
maxRSS = 94.82421875 MiB
production payload = 350925 bytes
productionSha256 = 95cc8bee080dd83b006296236269265c2ed98a6712adc13e0107bdf63c624ac5
productionFileSha256 = e1d15ad548c2bc48b7554a7856b7ba16e68b26e822a4b336a3fa948abd13ef9b
```

Independent verification:

```text
decision = TECHNICAL-PASS
8 / 8 verifier gates = PASS
roots independently verified = 3
root moves = 15
reply moves = 38
continuations = 60
productionSha256Matches = true
```

Canonical compact repository record:

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `checkpoints/2026-08-25-stage0-technical-pass.md`

## Invalidated technical attempt

```text
workflowRunId = 32813015855
jobId = 97695892961
sourceCommit = b0c7f3b2a2653411244b30c2e31fe4b53f3424c9
artifactId = 9550453776
workflowConclusion = failure
```

Production passed. Independent raw/move/reply/search/continuation/hash checks also passed. The only failed gate was the verifier's source-independence audit because its regex literals self-matched. This run is retained for provenance but is not canonical and is not scientific evidence.

## Fresh evidence firewall

Stage 1 and Stage 2 must record and compare at least:

```text
historicalTrajectoryHash
openingPrefixHash where applicable
raw rule-state identity hash
seed block
root identity
move identity
continuation replicate seed
```

Formal candidate derivation rows and formal confirmation rows must be disjoint.

## Current artifact boundary

Stage 0 is complete and `TECHNICAL-PASS`, but all Stage 0 rows remain technical-only:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

No Stage 1 scientific measurement artifact exists yet. Stage 1 may begin only after an exact prospective Stage 1 spec and separate authorization are frozen.
