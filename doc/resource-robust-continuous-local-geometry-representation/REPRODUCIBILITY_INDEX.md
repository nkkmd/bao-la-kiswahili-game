# RRCLGR-STUDY1 — 再現性索引

更新日: 2026-09-03

## identity（研究識別情報）

```text
Study ID = RRCLGR-STUDY1
reviewed main = 0bcd1695b6dbd044acf2eed91740d282c63dbb07
research branch = research/pre-g3-10-resource-robust-continuous-local-geometry
formal status = CLOSED / TECHNICAL-INVALID
representation = RRCLGR-R1-EXACT-SQUASHED-L1
```

## prospective protocol（結果確認前のprotocol）

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`

## core implementation（主要実装）

production:

- `tools/experiments/lib/rrclgr-production.js`
- `tools/experiments/lib/rrclgr-stage1-production.js`
- upstream `tools/experiments/lib/lgtgmiv-stage1-production.js`

independent:

- `tools/experiments/lib/rrclgr-independent.js`
- `tools/experiments/lib/rrclgr-stage1-independent.js`
- upstream `tools/experiments/lib/lgtgmiv-stage1-independent.js`

Stage runner / authorization verifierは次のとおりである。

- `tools/experiments/run-rrclgr-stage0-technical.js`
- `tools/experiments/verify-rrclgr-stage0-authorization.js`
- `tools/experiments/run-rrclgr-stage1-development.js`
- `tools/experiments/verify-rrclgr-stage1-authorization.js`

Actions workflow:

- `.github/workflows/rrclgr-stage0-technical.yml`
- `.github/workflows/rrclgr-stage1-development.yml`

## Stage 0の記録

GitHub Actions runは`33758538923`である。

最終状態は`STAGE0-PASS`である。

canonical repository result:

- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`
- JSON SHA-256: `82e6d1c15b92e6f8adfc080bbcf77d278a7a3f83f20047c650e0a6fba80b1fe7`
- Git blob: `95b25311915a1befc543c6a58b536511918ff3b8`

Actions result ZIPのSHA-256:

`3635e5a9a9d2a882ab7df170fc769c3c8f54a5231ffd6c25b03a7634b5dedfbd`

Stage 0ではfresh Stage 1 / Stage 2 seedまたはprotected depth-10へアクセスしていない。

## Stage 1のauthorization

authorization artifact:

- `authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json`
- blob at authorization: `6028e460405cdbc313911ea087adaaf53e132bb9`

authorizationでbindしたtooling commit:

`b2d68a6314019a70d90b00675f33f71411786960`

authorization commit:

`da0ae19a1ce399c6684b2051a97adfd4f808cd4c`

single trigger commit:

`00cbdb11c3310ea7a529c320ee03273c80dc8c7f`

## Stage 1の実行記録

GitHub Actions runは`33759611989`である。

execution container resultはworkflow `success`であり、source binding、durable lease、scientific runner、artifact uploadを含む全control-plane stepが完了した。

scientific runnerの最終状態:

`STAGE1-TECHNICAL-INVALID`

result artifact:

- artifact name: `rrclgr-stage1-result-33759611989`
- artifact id: `9894879572`
- ZIP SHA-256: `7b8a44a9e4873731d813e68b51755be39495980588564da8d4a504afad3c9b78`

canonical JSON:

- `results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json`
- bytes: `523`
- SHA-256: `c9d3d3d3f987a88a90a27f6c0c118e15e584e778ad3234eafb5ab36130dcebd0`
- repository Git blob: `5a1c7949578dae70e1299b849ec4957030c0a85f`

downloadしたartifact byteとrepository mirrorは、SHA-256およびGit blob identityで検証した。mirror作成時にscientific recomputationは行っていない。

## technical failureの発生箇所

`rrclgr-stage1-production.js`と対応するindependent implementationは、既存のlow-level `digest`を通じてcandidate-core digestを計算した。上流のLGTGMIV implementationが`digest`としてexportするraw SHA functionは`crypto.update`を直接呼び出し、stringを要求する。identity-row arrayを渡したため、記録済みのArray type errorが発生した。

このdiagnosisはtechnical provenanceに限られ、修正後のsame-evidence runをauthorizeしない。

## evidenceの制限

- RRCLGR Stage 1 fresh evidenceを後続のscientific evidenceとして再利用できない。
- candidate manifestは完成していない。
- Stage 1のcoordinate / distance / neighborhood summaryは承認されていない。
- Stage 2は承認も実行もされていない。
- protected depth-10はsealedのままである。
- G3-09 scientific valueはRRCLGRへの有効なscientific inputではない。

## closure記録

- `README.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `STUDY_1_FINAL_REPORT.md`
- `../research-program-decisions/2026-09-03-rrclgr-stage1-technical-invalid-closure.md`
- `../research-generation-3/checkpoints/2026-09-03-rrclgr-stage1-technical-invalid-closure.md`
