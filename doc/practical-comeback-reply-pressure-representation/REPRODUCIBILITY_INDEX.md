# PCRPR-STUDY1 — Reproducibility Index

Updated: 2026-08-29
Status: **STAGE 0 TECHNICAL PASS / STAGE 1 PREAUTHORIZATION VALIDATION IN PROGRESS / NO SCIENTIFIC OUTCOME GENERATED**

## Study anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
branch = research/g2-07-practical-comeback-reply-pressure-representation
Program = G2-07
Study ID = PCRPR-STUDY1
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

## Canonical study-start records

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`
- `preregistration/STUDY_START_FREEZE.md`
- `checkpoints/2026-08-29-study-start-freeze.md`

## Required program/upstream records

- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`
- `doc/RULES_BASELINE.md`
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`
- `doc/practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md`
- `doc/practical-comeback-error-inducing-moves/CURRENT_STATUS.md`
- `doc/practical-comeback-error-inducing-moves/DECISION_REGISTER.md`
- `doc/practical-comeback-error-inducing-moves/REPRODUCIBILITY_INDEX.md`
- `doc/rich-critical-position-representation/STUDY_1_FINAL_REPORT.md`
- `doc/rich-critical-position-representation/CURRENT_STATUS.md`
- `doc/rich-critical-position-representation/DECISION_REGISTER.md`
- `doc/rich-critical-position-representation/REPRODUCIBILITY_INDEX.md`
- `doc/rich-critical-position-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`
- `doc/rich-critical-position-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `doc/rich-critical-position-representation/checkpoints/2026-08-29-main-integration.md`

## RAW identity

```text
identityFields = pits,reserve,houseOwned,player,phase,winner,pending
excludedIdentityFields = turn,reason
validatedTransformSet = []
canonicalization = false
symmetryReduction = false
```

## Reserved scientific blocks

```text
Stage 1 seeds = 28710001..28713072
Stage 1 count = 3072
Stage 1 status = RESERVED / UNCONSUMED
Stage 1 use = CONSUME-ONCE-DEVELOPMENT-ONLY

Stage 2 seeds = 28810001..28816144
Stage 2 count = 6144
Stage 2 status = RESERVED / UNCONSUMED
Stage 2 use = FORMAL-ONLY
```

Neither reservation constitutes authorization.

## Stage 0 frozen protocol and source

Canonical Stage 0 source commit:

```text
19c70ba60c8b43858b01a01c5a448311660269c4
```

Frozen Git blobs:

```text
protocol = b633eb40cfdb95de1f546bba951c425da768e8d3
production implementation = 84385b79613328fe316a4d54300837efaea4c152
production runner = e1d78f922daaad4a3f99567dc03abbf4104a03c0
independent verifier = 7b00e2a579ce868a495ad4425f928266a0b4969d
workflow = 0a7c83a0c658aba44633d88b7b3b434ebe7b80c3
```

Canonical technical workflow:

```text
run = 33238931893 / success
job = 99064778014 / success
artifact = 9710763348 / pcrpr-stage0-technical-v1
artifact bytes = 18826
artifact ZIP SHA256 = 408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b
```

Stage 0 result:

```text
STAGE0-TECHNICAL-PASS
production gates = 18 / 18 PASS
independent gates = 9 / 9 PASS
technical rows = 9
scalar features per row = 80
production core SHA256 = 792eb081e5ed287b3adca5b6bfa340d7a23747d384483dca60b7c39aacceba37
production file SHA256 = 380f67c70765f3f7dbd08480e5c25f73455a9b59b6c436b2d5d033e875c05b36
```

The technical fixture seed menu `28700001..28700032` is outside both scientific blocks.

Canonical records:

- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`
- `FEATURE_DICTIONARY.md`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `checkpoints/2026-08-29-stage0-technical-pass.md`

## Numeric integrity contract

```text
schema = PCRPR_FEATURES_STAGE0_V1
families = 12
scalar width = 80
exact move/reply order = ASCII lexical exact move key where not explicitly score-ranked
aggregation = deterministic left-to-right IEEE-754 binary64 over canonical order
scalar encoding = IEEE-754 binary64 big-endian lowercase hex
feature-vector comparison = exact hash equality
tolerance = none
```

The Stage 0 adversarial matrix includes reply-list permutation, integer-like category labels, tied scores, zero/one reply semantics, missing/corrupted `pending`, seed conservation, leakage injection, search-config drift, schema drift, raw-key mismatch, and deliberate hash perturbation.

## Stage 1 prospective records

Before any Stage 1 scientific execution, the following have been committed:

- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `preregistration/STAGE_1_COMPUTATION_CONTRACT.json`

The development spec freezes source population, occurrence-first root selection, fresh D3 disadvantage screen, all-exact-root-move row construction, strong/medium/weak continuation policies, replicate counts, 96-ply bounded endpoint, primary/secondary class-D targets, grouped deterministic ridge grid, readiness gates, failure taxonomy, resource ceilings, consume-once rule, and Stage 1→2 firewall.

A pre-outcome self-audit found an accidental duplicate family-set definition (`F03_REPLY_POLICY` duplicated `F04_ALL_NO_TEMPORAL`). It was corrected before implementation validation, authorization, scientific seed consumption, or scientific outcome. The correction is recorded inside the current Stage 1 spec.

The computation contract freezes exact arithmetic/order semantics for target construction, standardization, normal equations, Cholesky decomposition, prediction, RMSE, tie-aware Spearman, top-quintile enrichment, candidate selection, final fitting and binary64 parameter serialization. Independent verification must reproduce exact OOF/final hashes; no tolerance is authorized.

## Stage 1 current implementation provenance

Current preauthorization production components include:

```text
tools/experiments/lib/pcrpr-stage1-production.js
tools/experiments/lib/pcrpr-stage1-model.js
tools/experiments/run-pcrpr-stage1-implementation-smoke.js
.github/workflows/pcrpr-stage1-preauth-smoke.yml
```

These are not yet scientific source bindings. Exact blobs must be re-frozen only after all preauthorization validation completes.

Preauthorization smoke history:

```text
run 33239399107 = TECHNICAL ATTEMPT / syntax failure before technical source-game generation
scientific seeds generated = 0
Stage 1 scientific block consumed = false

run 33239459359 = corrected-source technical-only smoke / execution in progress at this reproducibility update
head = 2851f7f82f092f664f16f845e5ea52cd189b7213
syntax checks = PASS
scientific block used = false
technical seed menu = 28701001..28701064
```

The first failed preauthorization attempt has no scientific status and does not consume or invalidate the Stage 1 block.

## Remaining preauthorization requirements

Before `authorizations/STAGE_1_EXECUTE.json` may exist, the Study still requires:

1. complete production Stage 1 implementation smoke PASS;
2. structurally separate independent Stage 1 verifier implementation and exact smoke PASS;
3. technical-only resource preflight PASS;
4. Stage 1 spec/computation/feature/source byte hashes;
5. exact production/verifier/workflow/source Git blob map;
6. source-freeze audit PASS;
7. explicit authorization commit.

No scientific generation is authorized before all seven are satisfied.

## Reproduction boundary

Historical PCEM/RCPR scientific artifacts are methodological/upstream records only and are not PCRPR scientific rows. The consumed RCPR seed block may not be regenerated for PCRPR, and the unconsumed PCEM Stage 2 reserved block is not reassigned to PCRPR.
