# RCPR-STUDY1 — Stage 1 technical-invalid closure

Date: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1`  
Stage: `RCPR-S1-DEVELOPMENT-2026-08-28-v1`

## Closure decision

**`STAGE1-TECHNICAL-INVALID`**

Stage 1 is closed under the prospectively frozen consume-once / fail-closed execution contract. Stage 2 remains **`NOT-AUTHORIZED-NOT-EXECUTED`**.

This closure does not modify or rescue any prior threshold, classifier, endpoint, population, representation family, continuation policy, seed rule, or upstream Research Generation 1 / G2-01..G2-05 decision.

## Terminal execution provenance

```text
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
workflow run = 33196954082 / completed / failure
production job = 98936414477 / completed / success
independent verification job = 99007180273 / completed / failure
seed block = 28610001..28613072 / CONSUMED
same-block rerun = NOT AUTHORIZED
replacement or extension = NOT AUTHORIZED
```

The archived `execution-start.json` explicitly records `scientificStage1SeedBlockConsumed = true`.

## Artifacts

```text
production artifact = 9704250489
name = rcpr-stage1-development-production-v1
size = 3168004 bytes
ZIP SHA256 = 00c210eb0fd9391c67e05b40daa3a85f66a1bc5ba2a460db40128f290e6d26d8

verification artifact = 9708956844
name = rcpr-stage1-development-verified-v1
size = 3191366 bytes
ZIP SHA256 = 1f1be58ec9dccd5aa35ad7a903333b5c8c912795edab7b31d4e2541119e8d0e5
```

## Production-only output

The production job completed successfully and emitted:

```text
status = PASS-AWAITING-INDEPENDENT-VERIFICATION
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
production result SHA256 = bc2ece4cb2df6f3cc5625324661c56fcaa6476c9921265f08fa13f005373b66e
```

All prospectively frozen production readiness gates were true. However, these values are retained only as **production-only unverified development output**. They are not an independently verified Stage 1 result and cannot authorize Stage 2 or be promoted to confirmatory evidence.

## Independent verification

The independent verifier returned:

```text
technicalPass = false
finalDecision = STAGE1-TECHNICAL-INVALID
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
developmentCoreMatch = false
verification SHA256 = 6ca0257e4d2064afa177937f881ec13a1843fd98bc133cc5c94522fdd4b44ee2
```

Of 600 selected representation rows, exactly four failed exact feature-vector hash equality. Every row was present; RAW state keys, continuation measurements, `D_range`, and high-divergence labels matched.

## Technical root cause

The mismatch is localized to `MOVE_SET_ENTROPY.indexEntropy`.

Production `rcpr-production.js::entropy(values)` stores category counts in a `Map` and accumulates entropy terms in encounter/insertion order. Independent `rcpr-independent.js::shannon(values)` stores counts in a plain object and accumulates `Object.values(counts)`. For integer-like category keys such as move indices, JavaScript object enumeration reorders keys numerically while `Map` preserves insertion order.

The implementations therefore add the same floating-point terms in a different order. IEEE-754 addition is not associative, producing exact differences of approximately `2.22e-16` to `4.44e-16` in four Mtaji rows. Because Stage 1 prospectively required exact feature-vector equality, their hashes differ and the verifier correctly fails closed.

There was no observed difference in continuation remeasurement, `D_range`, high-divergence classification, model-development hash, or readiness recomputation. This narrows the defect but **does not rescue Stage 1**.

Full machine-readable details are retained in:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`

## No-rescue disposition

The following are explicitly prohibited for `RCPR-STUDY1`:

- rerunning `28610001..28613072`;
- rounding/tolerance changes applied post hoc to declare the failed verifier successful;
- replacing the independent verifier and replaying the consumed Stage 1 block;
- changing the feature schema or representation hash contract to salvage the production result;
- authorizing Stage 2 from the production-only output;
- treating Stage 1 rows as Stage 2 or successor formal evidence.

## Successor boundary

Future work may correct the technical defect, but only prospectively. A successor must freeze a deterministic entropy accumulation/category-order contract, include adversarial integer-like-key technical fixtures, re-establish exact 310-feature cross-implementation equality, and then—if scientific evidence generation is pursued—use a new study/spec/source freeze, fresh seed block, and new explicit authorization.

No successor scientific study is authorized by this checkpoint itself.
