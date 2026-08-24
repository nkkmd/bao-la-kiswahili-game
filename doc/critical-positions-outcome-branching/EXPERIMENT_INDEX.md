# EXPERIMENT_INDEX — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-24

## Final study state

```text
Stage 0 design / technical validation = COMPLETE / PASS
Stage 1 exploratory = COMPLETE
Stage 2 formal = NOT EXECUTED
Study 1 = CLOSED AFTER STAGE 1 NEGATIVE EXPLORATORY RESULT
```

## Stage 0 technical experiments

### CPOB-S0-T01 — exact root intervention audit

PASS. Exhaustive `E.moveVariants`, exact `AI.moveKey`, replay and root-actor perspective were validated on deterministic fixtures.

### CPOB-S0-T02 — continuation RNG determinism audit

PASS. Frozen policy candidates were checked for deterministic replay under supplied seeds.

### CPOB-S0-T03 — policy semantics audit

PASS. Technical-only comparison selected `P1_NORMAL_TOP3` prospectively; scientific outcomes were not used for policy selection.

### CPOB-S0-T04 — terminal / administrative unfinished audit

PASS. Administrative truncation remains distinct from draw/win/loss.

### CPOB-S0-T05 — paired replicate audit

PASS. Common replicate seed derivation across root moves and separate RNG instances were validated.

### CPOB-S0-T06 — structural feature / response envelope audit

PASS. Immediate actor-relative structural transitions and exhaustive one-ply opponent reply envelopes were validated.

### CPOB-S0-T07 — exact search diagnostic audit

PASS. D2/D3 exact-root tables reproduce the frozen `exact-full-window-root-candidates/phase2-value-semantics/v1` instrumentation.

### CPOB-S0-T08 — runtime / artifact-size benchmark

COMPLETE / technical-only. Runtime was not used inferentially.

### CPOB-S0-T09 — independent verifier audit

PASS. Production tooling and independent full remeasurement path were validated before scientific generation.

## Stage 1 exploratory execution

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
source seeds = 22600001..22603072
source games = 3072
```

Execution order and status:

```text
generate source corpus                         COMPLETE
independent full corpus replay                PASS
outcome-blind root selection                  PASS
all-root-move measurement                     PASS
independent full measurement verification     PASS
deterministic exploratory discovery           COMPLETE
```

### Source corpus

```text
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
gamesVerified = 3072
fullCorpusReplay = true
```

### Root selection

```text
selected roots = 600
Namua = 300
Mtaji = 300
selected distinct opening prefixes = 567
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
replacementPerformed = false
phaseReassignmentPerformed = false
```

### Measurement

```text
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
primaryEstimableNamuaRoots = 300
primaryEstimableMtajiRoots = 300
```

Independent verifier:

```text
rootsReselectedIndependently = 600
fullContinuationRemeasurement = true
fullSecondaryRecomputation = true
fullStructuralRecomputation = true
passed = true
```

### Exploratory discovery

```text
high-divergence threshold = D_range >= 0.30
high-divergence Namua roots = 52 / 300
high-divergence Mtaji roots = 87 / 300
high-divergence overall = 139 / 600
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
manualOverridePerformed = false
resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
```

Zero promoted candidates was explicitly allowed by the frozen spec.

## Stage 2 formal execution

```text
reserved seeds = 22700001..22706144
scientific generation = NOT AUTHORIZED
execution = NOT STARTED / NOT EXECUTED
seeds consumed = false
formal candidates = 0
```

Stage 2 required a separate freeze of exact Stage 1 promoted candidate mappings. Because Stage 1 produced zero promoted candidates, there was no prospective formal target. Threshold relaxation, near-miss selection, grammar broadening or manual promotion was not permitted.

## Closure artifacts

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`results/STAGE_1_EXPLORATORY_SUMMARY.json`](results/STAGE_1_EXPLORATORY_SUMMARY.json)
- [`checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md`](checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md)
