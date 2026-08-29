# G2-08 / MDFT-STUDY1 — 研究概要

更新日: 2026-08-30
状態: **Study closed / `NON-ESTIMABLE`**

## 何を調べたか

本研究は、Baoのmachine/search decision failureを単一の「悪手」classへ圧縮せず、depth/horizon、quiescence、budget、reply resolution、capture/forcing sequence、ranking、reserve/house valuation、morphology、long-horizon structureといった複数のmechanistic failure modeへprospectively分解できるかを調べたResearch Generation 2 `G2-08`の独立研究です。

Higher-resource searchはgame-theoretic truthではなく、frozen machine referenceとしてのみ使用しました。Human difficulty、confusion、deception、error probability等は研究対象外です。

## 結果

Stage 0は`STAGE0-TECHNICAL-PASS`でした。F09 morphology-context mismatchだけは、historically frozen classifierをcurrent preserved repositoryからexact再構築できなかったため、scientific evidenceを見る前に`TECHNICALLY-INELIGIBLE`として除外しました。

Stage 1はfresh seeds `28910001..28914096`の4,096 gamesをconsume-onceで実行し、512 roots（Namua 256 / Mtaji 256）をoutcome-blindに選択しました。Productionとstructurally independent implementationはsource generation、root selection、analysis rows、development coreをexact一致させ、full artifactsも正常に保存されました。

しかしprospectively frozen global readiness gateのうち2件が未達でした。

```text
distinct opening prefixes = 2836 < 3000
LOW_CAPTURE share = 170 / 512 = 0.33203125 > 0.32
```

このためStage 1のformal dispositionは:

```text
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
```

Study 1のformal decisionは:

```text
NON-ESTIMABLE
```

です。

## Leaf-level observationの扱い

Frozen development promotion formula自体はF01/F02/F03/F05/F06/F10で`true`を返しました。一方F04/F07/F08は`false`、F09は事前technical exclusionでした。

ただしglobal readiness gateが失敗しているため、F01/F02/F03/F05/F06/F10を「validated taxonomy」または「Stage 2 target」として救済しません。これらは将来の新しいprospective studyの仮説生成に使えるdevelopment observationに限られます。

## Stage 2

Stage 1がpassしなかったためStage 2は:

```text
NOT-AUTHORIZED-NOT-EXECUTED
```

です。Reserved seeds `29010001..29018192`は未消費です。

同じStage 1 evidenceを見た後でopening-prefix floorを下げる、policy-share ceilingを緩和する、rootsを間引く、seedを追加する、populationを置換する等の救済は行いません。

## 詳細

- `STUDY_1_FINAL_REPORT.md` — 最終科学的統合
- `CURRENT_STATUS.md` — formal closure state
- `DECISION_REGISTER.md` — immutable decisions / no-rescue boundary
- `REPRODUCIBILITY_INDEX.md` — source / hash / artifact / Actions run
- `results/STAGE_1_DEVELOPMENT_RESULT.json` — canonical Stage 1 result
- `checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md` — Stage 1 closure checkpoint
