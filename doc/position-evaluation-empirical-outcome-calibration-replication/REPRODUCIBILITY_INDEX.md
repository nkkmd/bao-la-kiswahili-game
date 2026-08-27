# PEOCR-STUDY1 — Reproducibility Index

更新日: 2026-08-26

## Study anchor

```text
Study ID = PEOCR-STUDY1
Program label = G2-01
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Branch = research/g2-01-position-evaluation-empirical-outcome-calibration-replication
```

## Initial frozen specs

```text
Stage 0 = 39f886334a4b7515053f35bc606928c2ebe9d7baa2c2d216a44b0b42be8209c7
Stage 1 = 3b5262105de7a804cbbbb67e9ad111212bef6f4859f722fcaea42e5504e8eb99
Stage 2 = 6ef20e20f639797c3d98673980e6e4b2c4c63a522e0c052ce523f6132a94ea60
```

## Stage 0 canonical evidence

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `checkpoints/2026-08-26-stage0-technical-pass.md`
- execution commit: `a3d8af5bbec005c61571d2533800775d87840283`
- workflow run: `32969621181`
- workflow artifact ID: `9607059405`
- artifact ZIP SHA-256: `645cd4925bc98c51ffead686a6a436a18c85771f11a3ceff999fdcc4153bcc6a`
- `production.json` SHA-256: `d0a72cad4e1c4612d30674bc3bc700a768b1ef5a3402f82343ec7b2fe58ca698`

### Stage 0 source hashes

```text
public/engine.js = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
public/ai.js = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
public/ai-weights.js = 7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8
tools/benchmark.js = 2a893d7fe78d9d9cb211b38840c45f5c3dd9053fa3e05255b123985a08cfa808
tools/experiments/lib/ssgtc-representation-production.js = eb9a25ff8026eee6efa1c4a1fe0b71e6b1bcd7701a1eb84bb46df679e5db913c
tools/experiments/run-g2-01-calibration-stage0-technical.js = 121c2155ba285f3e8db458035c1d4e2c2b7d6f6d383c53b43935ac72214c3106
tools/experiments/verify-g2-01-calibration-stage0-independent.js = 03b8bb04af2fd1ef35972b18ac9b02cd6b9639274a6e14b45a46047b3cae8b8f
```

## Upstream records audited before freeze

- `doc/FUTURE_RESEARCH_AGENDA.md` Version 2.0.0, Section 9
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`
- `doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`
- `doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_SPEC.json`

## Before Stage 1 authorization

Must additionally freeze exact SHA-256 for the complete Stage 1 scientific code path, including generation, selection, measurement, model fit, result writer, validator and independent verifier. The Stage 1 authorization must bind those hashes and the immutable Stage 1 spec before fresh outcome generation.

## Before Stage 2 authorization

Additionally freeze the verified Stage 1 result, exact calibration mapping artifact, Stage 2 production/evaluation code, independent verifier, Stage 2 spec and exact source hashes.

Production and independent verification logic must not share unverified scientific decision logic.

## Stage 1 canonical evidence

- successful recovery workflow run: `33017663172`
- successful workflow artifact ID: `9632042234`
- workflow artifact ZIP SHA-256: `1c5f4c3440abda834b442ad9bb5ce811d777ed0750e8e3fdaeda0ab9c32a4e30`
- `results/STAGE_1_GENERATION_MANIFEST.json`: `97b996f96ee236d3ea0a049a2980a27655696119e776bcd6f42905fa205c4ef9`
- `results/STAGE_1_SELECTION_MEASUREMENT_SUMMARY.json`: `6ef950393ba290a7df6af7228539903f9cc23bcfe01bdc8c0c791c24bb0ebd01`
- `results/STAGE_1_VERIFICATION.json`: `792cb9bcf88402d785bc9ba581fba0f62c75f7e0d6ac49f6f99884c2a45173b5`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`: `93c449b5d28d5fe2a51375d867f27b47880b54bc13c0ec45c6206226edd47b75`
- `results/STAGE_1_FROZEN_MAPPING.json`: `b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac`
- selection hash: `4c46baef47f52ecff47d042fb7983a806c55d891717cb8f9d0afa2b483bd3b87`
- measurement hash: `a521051db2f9197094ff6b48c141b8b65378d4dac17c16fca6f38af939356b0b`

The canonical mapping is the exact artifact bytes from the successful Stage 1 run; it is not refit during canonicalization.

## Stage 2 technical smoke evidence

- workflow run: `33037897038`
- workflow artifact ID: `9632722463`
- artifact ZIP SHA-256: `e42e3ee6228363282bfb4abd3c55ea55fb51cc808ab34cb18ff1ed92c5da834a`
- `results/STAGE_2_TECHNICAL_SMOKE_RESULT.json`: `f2cf9b0bc0b091611e88871d8399a340e579c84f4b4143feaf85e266c0bc491e`
- `results/STAGE_2_TECHNICAL_SMOKE_VERIFICATION.json`: `1d5d9cba6869939d35156fa03069e9cf4490de8f291421d797d1545be82a5d6b`
- Stage 1 reference universe SHA-256: `5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063`
- frozen Stage 1 mapping SHA-256: `b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac`
