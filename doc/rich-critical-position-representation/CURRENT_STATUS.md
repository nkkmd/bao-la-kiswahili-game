# RCPR-STUDY1 — Current Status

Updated: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## Status

**STUDY CLOSED AT STAGE 1 / STAGE 0 TECHNICAL PASS / STAGE 1 TECHNICAL INVALID / FRESH STAGE 1 BLOCK CONSUMED / NO SAME-BLOCK RERUN / STAGE 2 NOT-AUTHORIZED-NOT-EXECUTED**

```text
RCPR-S0-TECHNICAL-2026-08-28-v1 = COMPLETE / STAGE0-TECHNICAL-PASS
RCPR-S1-DEVELOPMENT-2026-08-28-v1 = COMPLETE / STAGE1-TECHNICAL-INVALID / SEED-BLOCK-CONSUMED
RCPR-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Repository and execution anchors

```text
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
research branch = research/g2-06-rich-critical-position-representation
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
source-freeze checkpoint commit = 4366e439c2838dd7f2f388e834ecc93aed7efcb6
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
Stage 1 workflow run = 33196954082 / completed / failure
production job = 98936414477 / success
independent verification job = 99007180273 / failure
G2-06 pull request = none
```

Remote `main` was rechecked after the workflow failure and remained exactly `37480777246aa306c6ca3d0679d936b5e0107071`.

## Stage 1 consume-once state

```text
source games = 3072
seed block = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
consumption = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement/extension = NOT AUTHORIZED
```

The archived `execution-start.json` records `scientificStage1SeedBlockConsumed = true`. The block cannot be rerun or repaired inside `RCPR-STUDY1`.

## Terminal artifacts and hashes

```text
production artifact = 9704250489
production artifact ZIP SHA256 = 00c210eb0fd9391c67e05b40daa3a85f66a1bc5ba2a460db40128f290e6d26d8
production result SHA256 = bc2ece4cb2df6f3cc5625324661c56fcaa6476c9921265f08fa13f005373b66e
production development core SHA256 = 245c7e04421b1ef534edcb23d3048df1e2f1d556f9223f1eee84f054973f66b8

verification artifact = 9708956844
verification artifact ZIP SHA256 = 1f1be58ec9dccd5aa35ad7a903333b5c8c912795edab7b31d4e2541119e8d0e5
verification SHA256 = 6ca0257e4d2064afa177937f881ec13a1843fd98bc133cc5c94522fdd4b44ee2
independent development core SHA256 = 5b2251ef1ac34295cd1d67412c9d7f09adbe55b5af81a8752d3cb639b036e22a
```

## Production-only development output

Production completed successfully and all frozen production readiness gates passed:

```text
generated games = 3072
selected roots = 600
primary estimable = 599
high divergence = 134
low divergence = 465
selected family set = RICH_ALL
overall OOF AUROC = 0.7093403948001926
Namua AUROC = 0.7356189599631845
Mtaji AUROC = 0.6657646992502396
balanced accuracy = 0.6684641309581127
```

These values are retained for provenance only as **production-only unverified development output**. They do not constitute an accepted Stage 1 scientific result, do not authorize Stage 2, and are not confirmatory evidence.

## Independent verification failure

```text
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
developmentCoreMatch = false
technicalPass = false
finalDecision = STAGE1-TECHNICAL-INVALID
```

Exactly four of 600 selected rows failed exact feature-vector hash equality. All rows were present, and RAW state identity, continuation measurements, `D_range`, and high-divergence labels agreed.

## Technical postmortem

Root cause is a deterministic floating-point accumulation-order discrepancy in `MOVE_SET_ENTROPY.indexEntropy`:

- production uses `Map` insertion order when summing entropy terms;
- the independent implementation uses object enumeration, which numerically reorders integer-like move-index keys;
- the resulting IEEE-754 differences are approximately `2.22e-16` to `4.44e-16` on four Mtaji rows;
- exact hash equality therefore fails.

This localization does not alter the frozen decision. Stage 1 remains **`STAGE1-TECHNICAL-INVALID`**.

Machine-readable closure and postmortem:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`

## Scientific boundary

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
canonicalization = false
symmetry reduction = false
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

All Research Generation 1 and G2-01..G2-05 formal decisions remain immutable. Historical Critical Positions evidence remains excluded from G2-06 training, tuning, threshold selection, validation, and formal evidence.

## Next valid work

`RCPR-STUDY1` itself has no further scientific stage transition. Do not rerun or repair Stage 1 and do not authorize Stage 2.

A future successor may be designed only as a new prospective study after technical hardening. It must freeze deterministic entropy ordering/numeric-hash semantics, pass adversarial independent representation fixtures, and use a fresh study/spec/source freeze, fresh scientific seed block, and new explicit authorization.
