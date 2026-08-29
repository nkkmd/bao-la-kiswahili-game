# G2-08 / MDFT-STUDY1 — 最終報告

更新日: 2026-08-30  
Formal decision: **`NON-ESTIMABLE`**

## 1. 研究

**Study ID:** `MDFT-STUDY1`  
**Program:** Research Generation 2 `G2-08`  
**Formal title:** Machine Decision-Failure Taxonomy Study 1

日本語研究題目:

> **Baoにおける機械的意思決定失敗の構造分類 — horizon failure, reply undercoverage, ranking instability, tactical oversight, valuation failure, morphology mismatch, and long-horizon structural misvaluation のprospective分離・再現可能なtaxonomy構築**

本研究は、単一の「悪手」classを作るのではなく、machine/search decision disagreementを再現可能なmechanistic failure modeへ分解し、fresh development evidenceで構築したtaxonomyをfresh held-out evidenceで検証できるかを調べたprospective independent studyである。

## 2. 結論

Study 1のformal decisionは:

```text
NON-ESTIMABLE
```

である。

Stage 0は`STAGE0-TECHNICAL-PASS`。Stage 1はfresh 4,096-game development blockをconsume-onceで実行し、production / structurally independent implementationがsource generation、root selection、all analysis rows、development coreをexact一致させ、mandatory full artifactsの保存にも成功した。

しかし、prospectively frozen global readiness gateのうち次の2件が未達だった。

```text
distinct opening prefixes = 2836 < 3000
maximum single source-policy share = 170 / 512 = 0.33203125 > 0.32
```

したがってStage 1 formal dispositionは:

```text
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
```

となった。

Stage 2はpreregistered ruleに従い:

```text
NOT-AUTHORIZED-NOT-EXECUTED
```

であり、reserved seeds `29010001..29018192`は`RESERVED / UNCONSUMED`のままである。

## 3. Stage 0

Stage 0はscientific inferenceを行わず、search semantics、RAW identity、exact move identity、independent implementation、serialization、artifact transfer、F10 bounded continuation等をtechnical-only fixturesで検証した。

Canonical disposition:

```text
STAGE0-TECHNICAL-PASS
```

Stage 1 scientific entry前のleaf eligibilityは:

```text
MDFT-F01..F08 = eligible
MDFT-F09 = TECHNICALLY-INELIGIBLE
MDFT-F10 = eligible
```

F09はhistorically frozen morphology classifierのcomplete scaler/centroid artifactをcurrent preserved repositoryからexact再構築できなかったため、refit/replacementを行わず除外した。この判断はPosition Typology Study 1のhistorical formal resultを変更しない。

## 4. Stage 1 prospective contract

Canonical Stage 1 spec:

```text
Stage = MDFT-S1-DEVELOPMENT-2026-08-29-v1
spec SHA-256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
seeds = 28910001..28914096
games = 4096
selected-root target = 512
Namua quota = 256
Mtaji quota = 256
```

Stage 1 scientific run was separately authorized after technical preflight, source freeze and runner-readiness validation.

```text
execution HEAD = dfb9bf316dc767ae5920aba5a3308aa5f05d3acf
GitHub Actions run = 33277102013
seed status = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
```

## 5. Technical integrity of Stage 1

Stage 1 was technically valid.

Production and independent implementations agreed exactly on:

- source generation
- historical trajectory identities
- selected-root summary and exact selected-root identities
- search-condition analysis rows
- reply diagnostics
- rule-based leaf assignments
- promotion calculations
- final development core

Canonical development core:

```text
production SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
independent SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
exact match = true
```

Full compressed production / independent shards were both preserved and were byte-identical:

```text
bytes = 665093 each
SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Resource ceilings were also satisfied:

```text
production = 810283.6407120001 ms
independent = 773390.1727789999 ms
max RSS = 257340 KB
all frozen resource ceilings = PASS
```

Therefore the Stage 1 outcome is not `STAGE1-TECHNICAL-INVALID` and not `RESOURCE-CENSORED`.

## 6. Development population

Fresh Stage 1 source / selected population:

```text
generated games = 4096
unique trajectories = 4068
distinct opening prefixes = 2836
selected roots = 512
Namua = 256
Mtaji = 256
```

Source-policy counts among selected roots:

```text
UNIFORM = 128
CAPTURE_FIRST = 122
HIGH_CAPTURE = 92
LOW_CAPTURE = 170
```

Reference diagnostics:

```text
REFERENCE-CONSENSUS roots = 473
REFERENCE-DISAGREEMENT-EVENT = 110
Namua disagreement events = 65
Mtaji disagreement events = 45
```

All frozen readiness conditions except opening-prefix diversity and maximum source-policy share passed.

## 7. Leaf-level development observations

The frozen assignment/promotion computation produced the following development observations:

| Leaf | Applicable | Assigned | Prevalence | Development promotion calculation |
|---|---:|---:|---:|---|
| `MDFT-F01` | 110 | 64 | 0.5818 | true |
| `MDFT-F02` | 110 | 60 | 0.5455 | true |
| `MDFT-F03` | 110 | 55 | 0.5000 | true |
| `MDFT-F04` | 81 | 15 | 0.1852 | false |
| `MDFT-F05` | 110 | 100 | 0.9091 | true |
| `MDFT-F06` | 66 | 31 | 0.4697 | true |
| `MDFT-F07` | 65 | 0 | 0.0000 | false |
| `MDFT-F08` | 65 | 6 | 0.0923 | false |
| `MDFT-F10` | 91 | 77 | 0.8462 | true |

The six `true` calculations are:

```text
MDFT-F01
MDFT-F02
MDFT-F03
MDFT-F05
MDFT-F06
MDFT-F10
```

ただし、これは**validated taxonomyでもStage 2 targetでもない**。Global readiness gateがfalseである以上、Stage 1全体はblocked/non-estimableであり、leaf-level promotion calculationを切り出してpositive resultとして救済しない。

## 8. Stage 2

Stage 1 pass conditionを満たさなかったため、Stage 2 taxonomy/endpointをfreezeしてformal validationへ進むことは認められない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
seeds 29010001..29018192 = RESERVED / UNCONSUMED
```

同じStage 1 blockについてopening-prefix floorを下げる、source-policy share ceilingを緩和する、LOW_CAPTURE rootsを後から間引く、追加seedを生成する、root replacementを行う、別source weightingを採用する、といった救済は行わない。

## 9. 解釈

この研究から言えるのは、frozen machine referenceに対するdecision disagreementの中に、複数のrule-based mechanistic signatureがfresh development data上で観測された一方、prospectively要求したdevelopment-population diversity contractを満たさなかったため、Study 1として再現可能なtaxonomyをformal validationへ送る資格を確立できなかった、ということである。

したがって、次のいずれも主張しない。

- 六つのobserved leafが正式にvalidatedされた
- F04/F07/F08が存在しない
- F09 morphology mismatchが否定された
- higher-resource searchがgame-theoretic truthである
- machine failure modeがhuman difficulty/confusion/error probabilityを表す
- Bao一般についてfailure taxonomyが確立した

## 10. 既存研究への影響

本結果は既存研究を変更しない。

特に:

```text
BMP-STUDY1 = 0 CONFIRMED / 4 NOT-CONFIRMED
PCRPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
STSCV validated transform set = []
TM-S2-C03 = CONFIRMED
```

はimmutableである。

## 11. 再現性

Canonical repository results:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_FINAL_EXACT_COMPARISON.json`
- `results/STAGE_1_ARTIFACT_MANIFEST.json`
- `checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md`

GitHub Actions scientific run:

```text
run = 33277102013
artifact = 9722157483
artifact zip digest = bb34d16874175dcb581ad8725983a3ed4778687c0f3a2965ae929daaffbfe921
```

## 12. Study closure

Study 1 is closed with:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NON-ESTIMABLE
```

A future attempt to study machine decision-failure taxonomy must be a new prospective study/version with a new population contract and fresh seed block. It may use this Study 1 as historical evidence for design, but must not retroactively alter this Study 1's thresholds, population, leaf decisions or formal disposition.
