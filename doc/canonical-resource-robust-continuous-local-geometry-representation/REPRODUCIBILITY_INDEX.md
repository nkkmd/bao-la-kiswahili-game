# CRCLGR-STUDY1 — 再現性索引

更新日: 2026-09-03

## canonical protocolとpreregistration

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`
- `prereg/STAGE_2_SELECTION_CONTRACT.json`

## authorization記録

- `authorizations/STAGE_0_TECHNICAL_AUTHORIZATION.json`
- `authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json`
- `authorizations/STAGE_2_FORMAL_AUTHORIZATION.json`

scientific trigger fileはprovenance記録としてのみ保持し、replayしてはならない。

## Stage 0の記録

Actions runは`33761178143`である。

canonical result:

- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`

最終状態は`STAGE0-PASS`である。

## Stage 1の記録

Actions runは`33761678941`である。

durable Actions artifact:

- artifact ID `9895942440`
- ZIP SHA-256 `b940b79fb4c541111b14756d51de43c069158c46d860e0f2df0fdbe7d48e78eb`

exact-byte mirror commit:

`8b3c7ca9c3fed220a40297d03a73b4b162708c3b`

canonical mirrored artifact:

- `results/stage-1/STAGE_1_CANDIDATE_MANIFEST.json`
- `results/stage-1/STAGE_1_PREFLIGHT_ELIGIBILITY.json`
- `results/stage-1/STAGE_1_MEASURED_POPULATION.json`
- `results/stage-1/STAGE_1_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-1/STAGE_1_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-1/STAGE_1_COORDINATES.json`
- `results/stage-1/STAGE_1_DISTANCE_ROWS.json`
- `results/stage-1/STAGE_1_NEIGHBORHOODS.json`
- `results/stage-1/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json`
- `results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json`

Stage 1の最終状態は`STAGE1-PASS`である。

canonical scientific resultのSHA-256:

`e964970c71b270aaee8857fdd99b5041abcdb2f43ba83b600aa7764b2dda613f`

## Stage 2のformal validation記録

Actions runは`33763404167`である。

durable Actions artifact:

- artifact ID `9896703676`
- ZIP SHA-256 `614f6b7bb487473c92a609e48b3ecee21ba3d23223e28e425078744310b66787`

exact-byte mirror commit:

`d1083ca07986fdbe3ab78d6bd4c12850e1200ef8`

canonical mirrored artifact:

- `results/stage-2/STAGE_2_CANDIDATE_MANIFEST.json`
- `results/stage-2/STAGE_2_PREFLIGHT_ELIGIBILITY.json`
- `results/stage-2/STAGE_2_MEASURED_POPULATION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-2/STAGE_2_COORDINATES.json`
- `results/stage-2/STAGE_2_DISTANCE_ROWS.json`
- `results/stage-2/STAGE_2_NEIGHBORHOODS.json`
- `results/stage-2/STAGE_2_FORMAL_RESULT.json`

formal decision（正式判断）:

`FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION`

canonical Stage 2 scientific resultのSHA-256:

`c43ba119dbbc91f4145129dc5b24e886b0f436b577185cfb54d5f44619e5b0f5`

## implementation（実装経路）

production path:

- `tools/experiments/lib/crclgr-production.js`
- `tools/experiments/lib/crclgr-stage1-production.js`
- 対応するLGTGMIV production implementation

independent path:

- `tools/experiments/lib/crclgr-independent.js`
- `tools/experiments/lib/crclgr-stage1-independent.js`
- 対応するLGTGMIV independent implementation

runner / verifier:

- `tools/experiments/run-crclgr-stage0-technical.js`
- `tools/experiments/verify-crclgr-stage0-authorization.js`
- `tools/experiments/run-crclgr-stage1-development.js`
- `tools/experiments/verify-crclgr-stage1-authorization.js`
- `tools/experiments/run-crclgr-stage2-formal.js`
- `tools/experiments/verify-crclgr-stage2-authorization.js`

## 再現に関する境界

scientific executionのprovenanceは完備しているが、**rerunは承認されていない**。ここでいうreproducibilityは、固定済みartifact / source bindingのindependent verificationと、将来の新しいprospective Studyを指す。同じStudy / versionで消費済みscientific evidenceをreplayすることではない。

protected depth-10はsealedのままである。ここにある`main integration remains not authorized`はCRCLGR単独closure時点の記録であり、その後G3-10とのcombined fast-forwardにより統合済みである。現在状態は`CURRENT_STATUS.md`を正本とする。
