# PSRRE-STUDY1 — results index

本ディレクトリは`PSRRE-STUDY1`のrepository-facing resultとprovenanceを保持する。

正式なStudy closure:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NON-ESTIMABLE
G2-11 candidate input authorized = false
```

主要成果物:

- [`STUDY_1_FINAL_RESULT.json`](STUDY_1_FINAL_RESULT.json) — Study-level canonical result
- [`STAGE_1_CONSUMPTION_RECORD.json`](STAGE_1_CONSUMPTION_RECORD.json) — Stage 1 consume-once seed record
- [`STAGE_1_FINAL_EXACT_COMPARISON.json`](STAGE_1_FINAL_EXACT_COMPARISON.json) — production / independent exact comparison
- [`STAGE_1_ARTIFACT_MANIFEST.json`](STAGE_1_ARTIFACT_MANIFEST.json) — scientific artifact provenance
- [`STAGE_1_PACKAGING_PREFLIGHT_RESULT.json`](STAGE_1_PACKAGING_PREFLIGHT_RESULT.json) — scientific seed消費前のpackaging preflight
- [`STAGE_1_TOOLING_SMOKE_RESULT.json`](STAGE_1_TOOLING_SMOKE_RESULT.json) — technical-only Stage 1 tooling smoke
- [`STAGE_0_TECHNICAL_CLOSURE_RESULT.json`](STAGE_0_TECHNICAL_CLOSURE_RESULT.json) — Stage 0 technical closure
- [`STAGE_0_SOURCE_HASHES.json`](STAGE_0_SOURCE_HASHES.json) — Stage 0 source binding

Stage 2 resultは存在しない。Stage 1のpreregistered readiness gateを満たさずrepresentationをfreezeしなかったため、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`で閉じている。

Artifact内部のfull production / independent shardはGitHub Actions artifactに保存し、repositoryへ巨大なfull shardを重複収載しない。hashとartifact IDは[`../REPRODUCIBILITY_INDEX.md`](../REPRODUCIBILITY_INDEX.md)を参照する。
