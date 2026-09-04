# MDFT-STUDY1 — 現在の状態

更新日: 2026-08-30

## 研究識別

```text
Program = G2-08
Study ID = MDFT-STUDY1
Formal title = Machine Decision-Failure Taxonomy Study 1
Baseline remote main = cb660e166460e0f19d4ba16d5283fa880d55757f
Branch = research/g2-08-machine-decision-failure-taxonomy
Stage 0 = MDFT-S0-TECHNICAL-2026-08-29-v1
Stage 1 = MDFT-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = MDFT-S2-FORMAL-2026-08-29-v1
```

## 現在の正式状態

```text
Study = CLOSED
Study formal decision = NON-ESTIMABLE
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 1 run = 33277102013 / COMPLETED SUCCESS
Stage 1 seeds 28910001..28914096 = CONSUMED
same-block rerun / repair / replacement / extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## Stage 0 — 終了状態

Stage 0の正式な技術判断:

```text
STAGE0-TECHNICAL-PASS
```

Stage 1の科学的証拠を見る前に固定したleafのtechnical eligibility:

```text
MDFT-F05 = TECHNICALLY-ELIGIBLE
MDFT-F09 = TECHNICALLY-INELIGIBLE
MDFT-F10 = TECHNICALLY-ELIGIBLE
```

F09は、historically frozen morphology classifierを、現在repositoryに保存されているsourceだけからrefitや推測なしでexact再構築できなかったため除外した。この判断はhistorical Position Typology resultを変更しない。

## Stage 1 — 技術的完全性

```text
specSha256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
canonical technical preflight run = 33258188633 / PASS
scientific runner readiness run = 33277031634 / PASS
scientific run = 33277102013 / COMPLETED SUCCESS
execution HEAD = dfb9bf316dc767ae5920aba5a3308aa5f05d3acf
actions artifact = 9722157483
```

Productionと構造的に独立したimplementationは、source generation、root selection、selected-root identity、analysis rows、development coreについてexact一致した。

```text
production core SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
independent core SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
full production shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
full independent shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

必須artifactの保存と、結果を見る前に固定したresource ceilingはいずれもPASSした。したがってStage 1はtechnical-invalidでもresource-censoredでもない。

## Stage 1 — 科学的readiness

新たに生成したStage 1 population:

```text
games = 4096
unique trajectories = 4068
distinct opening prefixes = 2836
selected roots = 512
Namua = 256
Mtaji = 256
source-policy counts = 128 / 122 / 92 / 170
reference consensus roots = 473
reference disagreement events = 110
```

結果を見る前に固定したglobal readiness checkのうち2件がFAILした。

```text
opening-prefix diversity: 2836 < 3000
maximum source-policy share: LOW_CAPTURE 170/512 = 0.33203125 > 0.32
```

そのため:

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
```

となった。

## Leaf-level development observation（開発観測）

結果を見る前に固定したpromotion calculationは、次のleafで`true`を返した。

```text
MDFT-F01
MDFT-F02
MDFT-F03
MDFT-F05
MDFT-F06
MDFT-F10
```

`MDFT-F04`、`MDFT-F07`、`MDFT-F08`は`false`で、`MDFT-F09`はすでにtechnical-ineligibleだった。

これらはdevelopment observationに限られる。global readiness gateがFAILしているため、6件の`true` calculationをfrozen taxonomyやauthorized Stage 2 targetへ昇格させない。

## Stage 2 （Stageの記録）

Stage 1がblocked/non-estimableとなった場合の事前登録済みの帰結は次のとおりである。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
seeds 29010001..29018192 = RESERVED / UNCONSUMED
```

このStudy 1では、Stage 2 source/spec/targetの緩和やscientific executionを承認しない。

## 不変のupstream境界

Research Generation 2 `G2-01..G2-07`およびResearch Generation 1のcanonical decisionは変更しない。特に:

```text
STSCV validated transform set = []
RCPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 seeds = CONSUMED
PCRPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
BMP-STUDY1 = 0 CONFIRMED / 4 NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
```

PCRPRのproduction-only `F05_ALL` / `lambda=100` / OOF metricsは、G2-08のvalidated inputではない。

## RAW identity （識別情報）

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
```

## closure成果物

1. `STUDY_1_FINAL_REPORT.md`
2. `results/STAGE_1_DEVELOPMENT_RESULT.json`
3. `results/STAGE_1_FINAL_EXACT_COMPARISON.json`
4. `results/STAGE_1_ARTIFACT_MANIFEST.json`
5. `checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md`

将来decision-failure taxonomyを再検討する場合は、新しいprospective study/versionとfresh population / seed contractが必要である。このStudy 1をreopenまたはrescueしない。
