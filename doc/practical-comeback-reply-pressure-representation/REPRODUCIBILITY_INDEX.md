# PCRPR-STUDY1 — Reproducibility Index

更新日: 2026-08-29
Status: **CLOSED / STAGE1-TECHNICAL-INVALID / MAIN NOT INTEGRATED**

## Study anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
branch = research/g2-07-practical-comeback-reply-pressure-representation
Program = G2-07
Study ID = PCRPR-STUDY1
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

## Canonical closure records

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `preregistration/STAGE_1_COMPUTATION_CONTRACT.json`
- `preregistration/STAGE_1_EXECUTION_ADDENDUM.json`
- `authorizations/STAGE_1_EXECUTE.json`

## RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## Stage 0

```text
source commit = 19c70ba60c8b43858b01a01c5a448311660269c4
workflow = 33238931893 / success
artifact = 9710763348
artifact ZIP SHA256 = 408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b
Decision = STAGE0-TECHNICAL-PASS
feature width = 80
production gates = 18/18 PASS
independent gates = 9/9 PASS
```

Frozen Stage 0 Git blobs:

```text
protocol = b633eb40cfdb95de1f546bba951c425da768e8d3
production = 84385b79613328fe316a4d54300837efaea4c152
runner = e1d78f922daaad4a3f99567dc03abbf4104a03c0
independent = 7b00e2a579ce868a495ad4425f928266a0b4969d
workflow = 0a7c83a0c658aba44633d88b7b3b434ebe7b80c3
```

## Stage 1 frozen contract

```text
spec SHA256 = 15aff7a35c7875c16a815ae0323b3726714b36941ce53ce4788f8947700b2f2c
computation contract SHA256 = 7f6d2c9a928392c557f31f35cd0e912ba8396055c9535872b698f8085bc282e9
feature dictionary SHA256 = 892624860ac22c722ad9877b8c93ba6c32536da98692fc6735cd86e43886ca4f
source-freeze commit = eb48ecae8d5ae171175f7cc9f00c9bcc77b2c237
source-freeze workflow = 33241372471 / PASS
```

Preauthorization:

```text
production smoke = 33240901637 / PASS
resource preflight = 33240989191 / PASS
independent exact smoke = 33241110983 / PASS
```

## Authorization and consume-once record

```text
authorization commit = 64f0352e7d8b26432e2a68c408e403859c3e71bf
workflow = 33241465899
authorize-and-consume job = 99071430645 / success
execution-start artifact = 9711478864
execution-start ZIP SHA256 = cf80f4b24ef9cf8996bcaa09ea4569c2030daa9640eacc0a9e864f76a35fc120
Stage 1 seeds 28710001..28713072 = CONSUMED
```

## Production artifact

```text
job = 99071451933 / success
artifact = 9714352893
artifact ZIP SHA256 = 36f0fae32f3ca9deec842602b0dbe87e933fd589643820f192c90d379b2f3b5b
production result SHA256 = dea825892090fe9b101a8bd25610c7f24b40c4aac79fd61faaff1d213a5cdf90
source corpus SHA256 = 558f2cc2c122cb738de4d345edfdd86f29d92acb787553e6beba77a066ae8e9e
selection SHA256 = deb43668e75ccf4a4f6897cd3629828e2fa77876cb80f46bdfa1d536b437324b
rows SHA256 = 15fb799da64862fe70a04e4f1249060086dfd3527911702b116ca8f0310c12ea
measurements SHA256 = de18d69e3603cac80906656d1184b6d197695d47b1607af0d90542729ea5028f
compact rows SHA256 = b3fcd1a0484444c35ee3def141941ed743a6527a5647c8fd71f6c9692886f69c
development core SHA256 = 4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2
```

Production output is retained as unverified provenance only.

## Independent replay provenance

```text
job = 99071451969
scientific replay step = success
artifact upload = failure
full independent artifact = unavailable
reported independent result SHA256 = db7358d1308481fd4d9645fbffd79a319603ea7debd263bcaa98d2fa9fe35395
reported development core SHA256 = 4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2
```

The development-core stdout hash matched production, but this is not a substitute for the frozen full-object comparison.

Failure:

```text
actions/upload-artifact CreateArtifact timeout after 5 attempts
```

## Final verification

```text
job = 99096549383
conclusion = skipped
mandatory full independent artifact = unavailable
frozen final comparer executed = false
```

Final decision:

```text
STAGE1-TECHNICAL-INVALID
```

## Scientific/authorization state

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
same-block rerun = false
repair/replacement/extension = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
```

## Reproduction boundary

PCRPR-STUDY1を再現する際、consumed Stage 1 blockを再生成してaccepted resultを作り直してはならない。canonical reproduction targetはGit history、frozen specs/hashes、production artifact provenance、independent job logs、terminal closure recordsである。

Artifact transportを改善した再研究は、別Study identity・fresh seeds・新しいprospective artifact-preservation contractを必要とする。

## main integration

```text
main integration = NOT PERFORMED
```
