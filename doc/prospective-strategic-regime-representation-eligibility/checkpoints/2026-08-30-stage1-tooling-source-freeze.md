# PSRRE-STUDY1 — Stage 1 tooling source freeze

Date: 2026-08-30

## 状態

Stage 1 scientific developmentの前に行うtechnical-only tooling smokeについて、実装sourceを固定した。

```text
Study ID = PSRRE-STUDY1
Stage ID = PSRRE-S1-DEVELOPMENT-2026-08-30-v1
Tooling source commit = 509c80bbf1d0f9855e61923a2fa3c722aeb3c492
Scientific inference authorized = false
Scientific seed use authorized = false
G2-11 outcome inspection authorized = false
```

## 固定したStudy-specific source

```text
tools/experiments/lib/psrre-stage1-production.js
  git blob = f7ce3f4b008fe358b7aadd78c991738078dee768

tools/experiments/lib/psrre-stage1-independent.js
  git blob = ee513d989a9867f15b00664d3bbcb423b3cbffcc

tools/experiments/run-psrre-stage1-tooling-smoke.js
  git blob = 910fcb0c2af5eae3014d21c811e5220bca31042c

.github/workflows/psrre-stage1-tooling-smoke.yml
  git blob = 78795e6e632f270aa75d56c4bf9ec04082684ba2
```

## prospective scientific contract binding

次のcontractはtooling sourceより先に固定済みであり、tooling smokeの結果に応じて変更しない。

- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_FEATURE_DICTIONARY.json`
- `prereg/STAGE_2_VALIDATION_CONTRACT.json`
- `prereg/STAGE_1_TOOLING_SMOKE_SPEC.json`
- `checkpoints/2026-08-30-stage1-pre-scientific-freeze.md`

## technical-only境界

tooling smokeは`29500001..29500064`だけをtechnical seedとして使用する。次のscientific blockは参照・消費しない。

```text
29510001..29514096 = Stage 1 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
29610001..29618192 = Stage 2 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
```

G2-10のscientific seed blockも使用しない。

tooling smokeではscientific support / silhouette / stabilityを研究結果として解釈しない。synthetic metric fixtureはmetric plumbingのexact reproduction確認だけに使う。

## independent verification境界

independent implementationは`psrre-stage1-production.js`をimportしない。authoritative engine / AI rule semanticsと、Stage 0で別々に確立したproduction-side / independent-side primitivesの共有範囲を除き、source generation、selection、28-feature calculation、scaling、PCA、Ward/PAM、assignment、candidate metric、serializationを独立経路で再構築する。

## authorization

本checkpoint自体はtooling smokeをauthorizeしない。次のcommitで、このcheckpoint commitを`sourceFreezeCommit`として明示的にbindingしたtechnical-only authorization artifactを作成した場合にのみworkflow実行を許可する。

Stage 1 scientific executionは、このtooling smoke PASSによって自動承認されない。
