# Checkpoint — Stage 1 pre-generation firewall PASS

Date: 2026-08-23

## Scientific state at this checkpoint

This checkpoint is recorded before any Stage 1 scientific source-game generation.

```text
Stage 1 scientific games generated = 0
Stage 1 reserved seeds consumed = 0
Stage 1 scientific continuation outcomes inspected = false
Stage 2 reserved seeds consumed = 0
Stage 2 generation authorized = false
```

## Frozen Stage 1 specification

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
population = 3072 games
seed block = 22600001..22603072
selected roots if readiness passes = 600
continuation policy = P1_NORMAL_TOP3
replicates per exact legal root move = 64
continuation cap = 200
high-divergence threshold = D_range >= 0.30
```

## Validation evidence

The final source-changing implementation commit is:

```text
3995932ae73e9e99a27d4143de4e359db1136060
```

The following pull-request validation runs passed on that implementation:

```text
Stage 1 contract validation
  run = 32625783543
  conclusion = success

Stage 1 production tooling validation
  run = 32625783544
  job = 97160810538
  conclusion = success

Stage 0 regression validation
  run = 32625783553
  conclusion = success
```

The Stage 1 tooling validation exercised, using non-scientific technical seeds only:

- source-game generation through the same generator path;
- outcome-blind trajectory-aware root selection;
- one technical Namua and one technical Mtaji root;
- all-exact-root-move continuation measurement;
- independent root reselection;
- independent continuation remeasurement from supplied RNG semantics;
- continuation record-hash equality;
- D2/D3 secondary search recomputation;
- structural transition and exhaustive reply-envelope recomputation;
- deterministic candidate discovery recomputation;
- explicit failure of scientific `generate` while authorization is absent.

Technical end-to-end verifier summary:

```text
passed = true
technicalOnly = true
gamesVerified = 2
rootsReselected = 2
measurementsFullyRemeasured = 2
deterministicDiscoveryRecomputed = true
scientificSeedConsumed = false
```

## Exact scientific source hashes

```text
public/engine.js
  e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
public/ai.js
  2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
public/ai-weights.js
  7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8
tools/benchmark.js
  2a893d7fe78d9d9cb211b38840c45f5c3dd9053fa3e05255b123985a08cfa808
tools/experiments/lib/position-typology-features.js
  94ec8283cdc9d8f75cbdb13215cc2acd95fd33a2ca3a14afccd3a26ca8644242
tools/experiments/lib/position-complexity-search-diagnostic.js
  471dace470d1d83651d75b2e239b35bbfd55fd65cccc562ac3b47c020988eda9
tools/experiments/lib/tactical-motif-features.js
  26fc334801c3cf879e41429ae011eb313cbb7a7f60184a7adfd5cb623eb31a42
tools/experiments/lib/critical-positions-outcome-branching.js
  c5744cf0b417953a8adf5c8e48b1f56b3f82a663baa56f75fe44f3b803b079f7
tools/experiments/lib/critical-positions-stage1-contract.js
  6b454d225774747b0af432c8a7c0ebce34fd47436b2c21f25ffe02084be2677b
tools/experiments/lib/critical-positions-stage1-discovery.js
  55359380f6bf689c1e885c5feddf5d5f51a28efadfb662b2e292ebd400e0edc7
tools/experiments/lib/critical-positions-stage1-corpus.js
  d60fca62117da4dba7e7bd817ac42a8e71e3f7c3b0ee2904b7bb6c302e3c2380
tools/experiments/validate-critical-positions-stage1-spec.js
  06243d741652790ec81fa29af6638bbb16b08e2bf01b53ddca15fcdff7f2ced8
tools/experiments/run-critical-positions-stage1-exploratory.js
  b097331880e476e93f5a5db9e2085a53eeaec747401505f5e61cde7ade8e4d1d
tools/experiments/verify-critical-positions-stage1-exploratory.js
  69ab0a63c040b7857d2045f47b432ba9215fb0e5696d8c8e28336f462d6244a9
doc/critical-positions-outcome-branching/preregistration/STAGE_1_EXPLORATORY_SPEC.json
  22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
```

## Production execution firewall now fixed

The production runner is staged as:

```text
generate
→ independent full corpus replay verification
→ outcome-blind root selection
→ inspect selection readiness
→ all-move continuation + secondary measurement
→ inspect measurement readiness
→ independent full continuation remeasurement + secondary/structural recomputation
→ deterministic exploratory discovery
```

Selection cannot run without a passing corpus `verification.json`. Measurement cannot run without passing root-selection readiness. Discovery cannot run without a passing `measurement-verification.json` that records full continuation remeasurement and secondary recomputation.

Continuation artifacts store compact per-replicate records containing the seed, terminal category, final rule-state identity, continuation length and hash of the complete continuation record. The independent verifier reruns the full continuation and must reproduce the complete-record hash; compact storage therefore does not weaken replay verification.

## Authorization boundary

All preregistration, contract and implementation technical gates required before authorization have now passed.

This checkpoint itself **does not authorize generation**. The next and only permissible unlocking action is a separate authorization commit bound to the exact specification and scientific source hashes above.

Stage 2 remains locked.
