# G4-10 / FDERT-STUDY1 — 再現性索引

更新日: 2026-09-28

## 重要な原則

本Studyはone-shot protected holdoutであるため、**same-evidence scientific rerunは再現性手段ではない**。

再現性は、frozen source/spec、durable lease、artifact digest、independent verification、canonical summaryによって担保する。

## Source / protocol

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`STAGE_1_RESOURCE_PLAN.md`](STAGE_1_RESOURCE_PLAN.md)
- [`prereg/STAGE_1_PROTECTED_EXACT_SPEC.json`](prereg/STAGE_1_PROTECTED_EXACT_SPEC.json)
- [`results/stage-1-preaccess/SOURCE_FREEZE_MANIFEST.json`](results/stage-1-preaccess/SOURCE_FREEZE_MANIFEST.json)
- [`checkpoints/2026-09-28-stage-1-final-authorization-review.md`](checkpoints/2026-09-28-stage-1-final-authorization-review.md)

## Scientific source identities

Source-freeze manifest was produced before protected access.

```text
source-freeze Actions run = 36368720452 / attempt 1
observed Node = v22.23.2
runner OS / arch = Linux / X64
protected depth-11 access during freeze = false
```

Key Git blobs:

```text
.github/workflows/fdert-stage1-protected.yml = b376674193bbb7ca2d0525eef4da59cbb62650a9
Stage 1 spec = 39c3242f09175da7b808c5e46597d412198ef6b3
fdert-production.js = 2307c6fe318550c4556cff336b2019fe98da933e
fdert-stage1-contract.js = 77ff041181bc6c975291298461530875c3dec904
fdert-contract.js = 5c564745e44860fa904a2b06cebade2590d43c95
drsse-independent.js = 906e0412bcf47fe37d95ac29ad83f9c83bc52857
run-fdert-stage1-protected.js = 2577e3c1a2f665ab5b105b72d9dd3145b2ff06ba
verify-fdert-stage1-independent.js = eb85a5cf0ad31083ea9d7a087e8943c0d8317465
public/engine.js = 1527bb3665228b7a5bd9f03153567aedbaaa22d7
G3-11 canonical formal result = 59375ab4af1a0e29d167e07e507339bd903fb0ff
```

## Protected execution

```text
workflow run = 36368880428
attempt = 1
trigger SHA = 787105a3016bac1172e669faf400fcc7cdd70dd5
workflow conclusion = success
scientific executions = 1 / 1
```

The lease was durably materialized and the authorization was consumed before production began.

## Artifact provenance

### Pre-computation lease

```text
artifact ID = 10948226759
digest = sha256:575b35ee5963d9846d363680c5718184bdae9d1339d91bc1f484fe35fedf11fc
```

### Production materialization

```text
artifact ID = 10949100069
compressed bytes = 83285199
digest = sha256:af6654f082da6478ed94f6852b57b1330ae77f3ed2eb491644844a108c4ec0c8
```

### Compact canonical bundle

```text
artifact ID = 10948857115
digest = sha256:ae7ff0f641f0997687268c3bc804f3128feac1c1bb48b7a5c61b027cde26991d
```

Files in compact bundle:

```text
STAGE_1_FORMAL_RESULT.json
  bytes = 15909
  sha256 = 7be828231d25ad0e9ee0a698992c3ccb726768b6329a6ad935548d4a46c72e1d

STAGE_1_PRODUCTION_SUMMARY.json
  bytes = 1718
  sha256 = 2629336107d663c4236df186cb541c00e0115ed146e16ad01943ec8dae17bd85

result-core.json
  bytes = 21130
  sha256 = ac9e7044484e96318ac7bf1b94497e51618565aca1ed8631f1c6f1107145130d

COMPACT_MANIFEST.json
  sha256 = 4bf865d5241aa851c4f7acbdab2b18a5586bd01f35c5d9cb4ff2261809933071
```

Repository canonical summary:

- [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)

## Canonical scientific identities

```text
formal decision = NON-ESTIMABLE
formal-result file SHA-256 = 7be828231d25ad0e9ee0a698992c3ccb726768b6329a6ad935548d4a46c72e1d
scientific-result core SHA-256 = a9649b654ae315fe7d234ccc5511252db6154e84d146bd9444185e9441f52484
production-result core SHA-256 = 81915a36f5350ae5559f5e82dbde8248776e628a5e54862b4accfe21054341b5
independent core SHA-256 = 2e913c8458037db33de0083981bf4442316bb28d7bf7dc4d05419b8e4a0057d5
historical/current prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
```

## Verification chain

1. Stage 0 v2 verified source compatibility and fail-closed behavior at maximum real fixture depth 2.
2. Stage 0 v3 verified the bounded-memory enumerator against the historical enumerator, including byte-exact state/edge JSONL at depth 2.
3. Stage 1 pre-access audit verified source separation, frozen resource ceiling, historical prefix reference and T1..T4 synthetic logic.
4. Source-freeze audit bound scientific files before evidence access.
5. Protected run durably consumed authorization before computation.
6. Production materialization was durably uploaded.
7. Independent verifier checked production file hashes.
8. Fresh complete 0..10 prefix matched the G3-11 canonical prefix exactly.
9. Independent implementation re-enumerated and verified the claimed-complete prefix.
10. The formal decision was `NON-ESTIMABLE`; no depth-11 partial values were promoted.

## Rerun boundary

The following is deliberately **not** a reproduction command for scientific execution. The original protected evidence has been consumed and may not be rerun under this Study/version.

Future research wishing to attempt deeper exact enumeration requires a new Study identity, new preregistration, new resource justification and new evidence authorization. It may not call itself a repair of `FDERT-STUDY1`.
