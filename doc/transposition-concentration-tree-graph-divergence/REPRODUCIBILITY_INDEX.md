# TCTGD-STUDY1 — 再現性索引

Updated: 2026-09-02

## program authorization （承認状態）

- `../research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md`
- formal decision: `G3-03-AUTHORIZED`
- authorization reviewのintegration baselineはmain `6b1457294666267c5a75c8516001acd1ef7d2fcd`である

## 結果を見る前のfreeze

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `checkpoints/2026-09-02-study-preregistration-freeze.md`

prereg freeze時に固定したblob:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
LGTGMIV production = a4664f01535d6abbf6f83821befbb2fafd55cde6
LGTGMIV independent = 0c7239ac7acf146e9aee63dae66194681b8631d6
TCTGD production = 782ec5e7140d0b8e410d2156dc765c8b2f0c1a5d
TCTGD independent = 1435998dba938ecad15470370dd2ef096a046e83
Stage 0 runner = 8fe976990de7792926401334cfc0171599cd9059
Study protocol = 3f892949bc87f5963a77cb4604bacc7023faa3d9
Machine prereg = 3a651e3b34890c57a58065f091bcbcd062a68dda
```

Pre-checkpoint frozen-content HEAD:

`1ddf1f292ce48be2a0c866b0fa86ea060f2e613d`

Freeze checkpoint commit:

`9a9b5f834bdef216f370dbec56279ac3ed6e105e`

## Stage 0のauthorizationと実行

- authorization: `authorizations/2026-09-02-stage-0-technical-authorization.md`
- authorization commit: `b725600730c4a876a6049a125ac3a07a1602b666`
- one-shot technical trigger commitは`0c0a707bfa0baa64815dac0b826d2720e247ff52`である
- workflow: `.github/workflows/tctgd-stage0-technical.yml`
- run: `33589334375`
- job: `100119933850`
- conclusion: `success`

Durable Stage 0 artifact:

```text
artifact ID = 9831182022
name = tctgd-stage0-technical-result
size = 762 bytes
ZIP SHA-256 = efa3669c06a20b793d3f8feff80f71535fb582c0d1165fed38cf4dc0c3f78924
```

Stage 0 result:

- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`
- `results/stage-0/execution-summary.json`
- `checkpoints/2026-09-02-stage-0-technical-pass.md`

Deterministic Stage 0 core:

`e7e7831cf9503c94441a5dc9b30253485dc4b498e9b397408901186c914765d5`

Stage 0ではscientific seedとprotected depth-10のいずれにもアクセスしていないことを明示的に記録した。

## Stage 1前のnon-scientific tooling evidence

### 最初のdispatch-capability smoke

- tooling smoke run: `33591947107`
- static integrity auditはPASSだった
- non-scientific workflow-dispatch capability stepはHTTP 404だった
- fresh scientific evidenceは生成していない
- Stage 1 seedへアクセスしていない
- protected depth-10へアクセスしていない

これにより、当初のbranch-only `workflow_dispatch` control planeがGitHub RESTではoperationできないことを確認した。failureはscientific authorization / execution前に発生した。

### push-path control smoke v2 （概要）

- run: `33592075136`
- conclusion: `success`
- artifact: `9832086009`
- artifact ZIP SHA-256: `995b566a2c73f8972052315a8b5edc34b15c33602836a028399e3b47f916303a`
- fresh scientific evidenceは生成していない
- Stage 1 seedへアクセスしていない
- protected depth-10へアクセスしていない

v2 smokeはscientific evidenceに触れず、one-trigger / one-path-filtered-workflow control modelを確立した。

## technical execution v2のrefreeze

当初のprospective specは`prereg/STUDY_1_SPEC.json`として変更せず保存している。

fresh evidence前のtechnical execution correction artifact:

- `prereg/STUDY_1_SPEC_V2.json`
- `prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json`
- technical refreeze workflow runは`33592229434` / success
- technical refreeze result commitは`61139c0ed9e009b2142ff9b4a8b9b62128b54264`

refreeze後の関連blob:

```text
STUDY_1_SPEC_V2.json = 1adabe8ce48004678a80f4f45ba4713e92711d8b
UPSTREAM_IDENTITY_FIREWALL_V2.json = e644737dc32e2aec8694450aba8700d7a150fcc3
Stage 1 production selector = 6cd1a731bd96703a92020009b8c25b064ea20d69
Stage 1 independent selector = 106cfd90352f0ffb7c89e2d4ba16423a019dd664
TCTGD production endpoint = 782ec5e7140d0b8e410d2156dc765c8b2f0c1a5d
TCTGD independent endpoint = 1435998dba938ecad15470370dd2ef096a046e83
Stage 1 runner v2 wrapper = bfb29927a5f6b1e5fd621f7ed72d0b29edac1907
```

identity-only firewallは`scientificOutcomeFieldsRetained=false`を記録する。G3-02 scientific outcomeをloadせず、G3-02 selected rootもreconstructしていない。

final pre-fresh workflow binding後のStage 1 scientific-content baseline:

`3b31c0e853b99d50e6e4cd924984342535c22547`

## Stage 1のauthorization

- authorization decision: `STAGE1-AUTHORIZED`
- authorization nonce: `TCTGD-S1-AUTH-2026-09-02-V2-01`
- max scientific executions: `1`
- actual scientific executions: `1`
- seed block: `31310001..31310192`

Execution trigger commit:

`18cdade48db8f19e3b49615041630948dafb4e61`

## Stage 1の実行

Workflow:

- `.github/workflows/tctgd-stage1-development.yml`
- run `33592380079`

Jobs:

```text
lease = 100128827626 / success
scientific = 100128867042 / failure because runner intentionally exited 2 for TECHNICAL-INVALID disposition
mirror = 100129459563 / success
```

Pre-computation lease commit:

`2320d80424a48cbf72964d3910b90522c7936151`

Result mirror commit:

`ce94af693386699a5b0cc6292d3ac817af034f19`

Durable Stage 1 artifact:

```text
artifact ID = 9832258829
name = tctgd-stage1-development-result-33592380079
size = 27447 bytes
ZIP SHA-256 = cb03924420df2b280398f5493283dc47fae01bb4e22afdd18560d42b5bf1139b
retention expiry = 2026-12-01T04:51:04Z
```

Canonical mirrored files:

- `results/stage-1/scientific-result.json`
- `results/stage-1/telemetry.json`
- `results/stage-1/execution-summary.json`

execution summaryに記録したcanonical file identity:

```text
scientificResultFileSha256 = cfb292bf5d51fa270f9c72391f82c05af7600ed63cd587281b074482c420f903
telemetryFileSha256 = a009060be8722c2a7bb82ef4dcc339f35ff2b876966286e5a51f7fe2e8c903fc
productionStageScientificCoreSha256 = d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f
independentStageScientificCoreSha256 = d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f
```

## Stage 1のformal verification state

Pass / agreement:

```text
selectedPairCount = 12
selectedRootCount = 24
populationComplete = true
stageResourcePass = true
sourceIdentityExact = true
staticIndependence = true
pairComparisonExact = true
developmentExact = true
canonical production/independent stage SHA = identical
```

FAILした固定済みintegrity gate:

```text
allRootExact = false
stageScientificExact = false
stageDisposition = TECHNICAL-INVALID
```

root / family reconstruction hashは一致したが、independent endpoint mapが`Object.create(null)`、productionが通常のobjectを使い、固定済みrunnerがprototype-sensitiveな`util.isDeepStrictEqual`を使用したため、root-level `endpointExact`はFAILした。

これを直接原因となったtechnical defectとして保存する。same-evidence rerunまたはpost hocなequality-rule correctionは行わない。

## diagnostic candidateのprovenance

execution summaryには次のpromotion-like directionを記録している。

```text
C1 = NAMUA-GREATER
C2 = NAMUA-GREATER
C3 = NAMUA-GREATER
C4 = MTAJI-GREATER
```

Stage 1がtechnical-invalidであるため、formal promoted candidate setは`[]`である。

## Stage 2の状態

```text
TCTGD-S2-FORMAL-2026-09-02-v1
seed = 31320001..31320288
status = NOT-AUTHORIZED-NOT-EXECUTED
seed consumption = false
```

Stage 2 workflow executionまたはformal holdout readはauthorizeされていない。

## closure記録

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md`
- `../research-generation-3/checkpoints/2026-09-02-g3-03-technical-invalid-closure.md`

Formal Study decision:

`CLOSED / TECHNICAL-INVALID`

## protected holdout （証拠の状態）

standard initial RAW-root complete exact depth-10 holdoutの状態:

`SEALED / NOT GENERATED / NOT READ`

TCTGD-STUDY1からgenerate、read、peek、partial enumerate、resource estimationのいずれにも使用していない。
