# REPRODUCIBILITY INDEX

更新日: 2026-08-30

## Baseline

- study baseline `main`: `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`
- branch: `research/g2-09-tactical-motif-generalization-counterexample`

## Upstream C03 sources

- `doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json`
- `doc/tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json`
- `doc/tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`
- frozen reconstruction: `preregistration/UPSTREAM_C03_FROZEN_REFERENCE.json`

Research Generation 1 source commits:

```text
generation = 3082cd2132cdd572e43f5f78e8d662271a9ed492
measurement = e6f5e9528d523e7710a953020b1719abf60a26e8
evaluation = d41b061067ab2e5dbe65294d3860586d9d3c1454
```

## Prospective G2-09 freezes

- `preregistration/STUDY_CONTRACT.json`
- `preregistration/UPSTREAM_C03_FROZEN_REFERENCE.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `preregistration/STAGE_0_SOURCE_PREFLIGHT_SPEC.json`
- `preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json`
- `preregistration/STAGE_1_TOOLING_SMOKE_SPEC.json`

## Stage 0 evidence

### Core

```text
run = 33285277593
source commit = 123b24049f6d12dbe529c5aecc7fc2ee78852deb
disposition = CORE-SEMANTICS-AND-PROVENANCE-PASS
```

### Contract validator

```text
run = 33285599766
passed = true
```

### Source preflight

```text
invalid attempt run = 33285427882
accepted run = 33285761079
accepted source commit = 93396ec45619cf10a08726b5705b9a155bcb1c3b
disposition = SOURCE-PREFLIGHT-PASS
artifact id = 9724412966
artifact ZIP SHA-256 = dd0e3cd14f127d89240e7f34a612dab73bf5ae805731dfa7eb925c3281dd71ae
```

### Stage 0 closure commit

`0d8d20bd7f1b229958c66e9987556ad642f32f78`

## Stage 1 tooling source

Core independent tooling commit:

`5875dd1c621edc293c82d0d0807033c24ab8f59d`

Sharded runners commit:

`9b88ef5e582ccd14c4c90ec8377f3ef9f442ef80`

Smoke/workflow freeze commit:

`65b2e3dee0994e1520ad9a3470feff4f3c9d98ae`

Key source files:

- `tools/experiments/lib/tmgc-stage1-production.js`
- `tools/experiments/lib/tmgc-stage1-independent.js`
- `tools/experiments/lib/tmgc-stage1-boundary-production.js`
- `tools/experiments/lib/tmgc-stage1-boundary-independent.js`
- `tools/experiments/run-tmgc-stage1-source-shard.js`
- `tools/experiments/aggregate-tmgc-stage1-source.js`
- `tools/experiments/measure-tmgc-stage1-shard.js`
- `tools/experiments/aggregate-tmgc-stage1-results.js`
- `.github/workflows/tmgc-stage1-development.yml`

## Terminal Stage 1 technical evidence

```text
workflow run = 33287035754
source commit = 65b2e3dee0994e1520ad9a3470feff4f3c9d98ae
artifact id = 9724782927
artifact ZIP SHA-256 = 54c536eceb460d8734ba19e6e79bfc2e9e7c82838056338a4527e7d365e1d51c
syntax checks = PASS
runner exit = 1
canonical smoke result JSON = absent
error = ReferenceError: topSetRate is not defined
```

Artifact内容は` tmgc-stage1-tooling-smoke.log `のみで、canonical scientific/development resultは含まれない。

## Canonical terminal records

- `results/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`
- `checkpoints/2026-08-30-stage1-tooling-smoke-technical-invalid.md`
- `STUDY_1_FINAL_REPORT.md`

## Scientific seed state

```text
Stage 1 29110001..29114096 = RESERVED / UNCONSUMED
Stage 2 29210001..29218192 = RESERVED / UNCONSUMED
```

## Verification boundary

Stage 1 production/independent formal equalityはtechnical smokeが完遂できなかったため成立していない。partial pre-error computationをaccepted scientific evidenceへ昇格させない。将来修正版はnew prospective Study/versionとして扱う。
