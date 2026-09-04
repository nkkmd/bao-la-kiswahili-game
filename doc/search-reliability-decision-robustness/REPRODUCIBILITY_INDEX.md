# SRDR-STUDY1 — 再現性索引

更新日: 2026-08-28

## Study anchor （基準点）

```text
Program = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Branch = research/g2-02-search-reliability-decision-robustness
Formal decision = INCONCLUSIVE
```

## Stage identity （識別情報）

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
```

## canonical repository result （リポジトリ状態）

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_2_GENERATION_MANIFEST.json`
- `results/STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json`
- `results/STAGE_2_VERIFICATION.json`
- `results/STAGE_2_FORMAL_RESULT.json`

## Stage 1 provenance （記録）

```text
original workflow run = 33067208005
corrected verification workflow run = 33123555267
canonical artifact ID = 9667419537
canonical artifact ZIP SHA-256 = 41c6b9940798aa1626b0c73279a47b53dbc3e14316d0cb75f48f4d194f5c8cf8
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

Stage 1 verification correctionではscientific rowを一切変更していません。1018 rowすべてが一致した後、representation-only hash semanticsだけをcorrectしました。

## Stage 2 source / authorization （承認状態）

```text
source-freeze commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
authorization commit = bec87d54540c96c24353f2eeadc25338c53e54eb
formal spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
Node = 22.23.2
```

## Stage 2 execution （実行記録）

```text
workflow run = 33124538584
artifact ID = 9672561139
artifact ZIP SHA-256 = c107773d7f7a7cd9ba05a875305486738e10268435730283d6aa46cb5340e47a
games = 1536
seeds = 25021001..25022536
selected unique RAW states = 1007
Namua / Mtaji = 518 / 489
```

## Stage 2 file hash （Stageの記録）

```text
generation manifest = 64ee67538d1a07a77553c1cd83319a23bc07574a2cff6ad70a02afd8cb67f209
selected states = 1c30b384c4afc38d6505f7065b1faba94111731a844565f55dd5b10d6996f263
measurements = d58e14880853b8d0bf0929dfa8f8e6216e9f8aac33622b87c2dda0e1907ded34
verification = aafefdd033da71104662202360c77579649ec62c4820b07d37461678fdca1a13
formal result file = c7f71a4422d6f11fdf7dc14a76796b21c6e9670b503f930f6e1cea0b899b5553
selection hash = a929e00fcedfcd9e6f89780d5ca02f9a5f126250e569bd3840d4d79cfa2d6f46
measurement hash = 13ca8825c250f038c510a2a7e7c0e8d1567f0d5027bd32ecb4dee0e34f64e2bd
canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
```

## independent verification （独立検証）

```text
passed = true
games verified = 1536
game replay mismatches = 0
selected-state mismatches = 0
measurement mismatches = 0
selection hash matches = true
measurement hash matches = true
Stage 1 overlap = 0 / 0 / 0
```

## formal result （最終状態）

FAILした事前登録gateは1件だけです。

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

したがって、

```text
formalDecision = INCONCLUSIVE
primaryFormalCriterion = null
```

です。outcome確認後のrescueは承認されていません。

## repository integration （リポジトリ状態）

```text
integration PR = #68
expected research head = f6814e4e828ea07ec309f6f7352c825494d8ff20
integration merge commit = ee5f0a5e769516d635fe8b70e42244a8dc8d9b34
integrated branch = main
integration date = 2026-08-28
```

Repository integrationは、G2-02 technical validation、second-generation research agenda audit、SSGTC closure consistency audit、PCEM closure consistency audit、repo-wide Phase Transition Research CIがすべてgreenになった後に実施しました。

immutable Stage 2 artifactに対するidempotent closure finalization workflowもPASSしました。

integrationによってcanonical scientific evidence、`INCONCLUSIVE` decision、`primaryFormalCriterion = null`、interpretation boundaryは変更していません。
