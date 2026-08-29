# MDFT-STUDY1 — 現在の状態

更新日: 2026-08-29

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
Study = ACTIVE
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = DESIGN/FREEZE IN PROGRESS / NOT YET AUTHORIZED
Stage 1 seeds 28910001..28914096 = RESERVED / UNCONSUMED
Stage 2 = NOT AUTHORIZED / NOT EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
scientificInferenceAuthorized = false
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Stage 0 canonical result:

```text
doc/machine-decision-failure-taxonomy/results/STAGE_0_TECHNICAL_RESULT.json
```

Stage 0 closure checkpoint:

```text
doc/machine-decision-failure-taxonomy/checkpoints/2026-08-29-stage0-technical-pass.md
```

## Stage 0 technical eligibility binding

Scientific evidenceを確認する前に、candidate leafのtechnical eligibilityを次のとおり固定しました。

```text
MDFT-F01 = ELIGIBLE
MDFT-F02 = ELIGIBLE
MDFT-F03 = ELIGIBLE
MDFT-F04 = ELIGIBLE
MDFT-F05 = TECHNICALLY-ELIGIBLE
MDFT-F06 = ELIGIBLE
MDFT-F07 = ELIGIBLE
MDFT-F08 = ELIGIBLE
MDFT-F09 = TECHNICALLY-INELIGIBLE
MDFT-F10 = TECHNICALLY-ELIGIBLE
```

F09 exclusion reason:

```text
FROZEN_HISTORICAL_CLASSIFIER_NOT_EXACTLY_RECONSTRUCTIBLE_FROM_CURRENT_PRESERVED_REPOSITORY_SOURCES
```

F09のreplacement/refitは許可しません。これはhistorical MTAJI-M1/MTAJI-M2 formal resultを変更しません。

## Stage 0 technical evidence

Core canonical run:

```text
GitHub Actions run = 33256737040
head = ad2a47401f38c58228d45270c94389d16c21dda9
core SHA-256 = f5052e9c18b118a194c4a43c8964e789a2a81083ad72ebf259b18c699ed5d6f1
```

Determinism replay run `33256767045`も同一core SHA-256を再現しました。

F10 canonical preflight:

```text
GitHub Actions run = 33256932295
head = 04ffda12149ab73b4d4a2729eefbdc5ff4f4f225
bounded continuation = 6 plies
production/independent exact trace = PASS
resource/artifact gates = PASS
```

Stage 0ではtechnical-only seed `8080001..8080032`の一部だけをfixture generationに使用し、Stage 1/2 scientific blockは消費していません。

## remote main確認

研究開始時のremote `main`は:

```text
cb660e166460e0f19d4ba16d5283fa880d55757f
```

直前G2-07統合後に記録されていた`24a0968e68c9eb0ed7462093d953f52b339a9d04`とは不一致でした。現在HEADはその後の日本語文書統合mergeを含み、`24a0968...`を祖先として保持しています。

## Immutable boundaries

Research Generation 2 `G2-01..G2-07`のcanonical decisionを変更しません。特に:

```text
STSCV validated transform set = []
RCPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 block = CONSUMED
PCRPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
BMP-STUDY1 = 0 CONFIRMED / 4 NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
```

PCRPR production-only `F05_ALL` / `lambda=100` / OOF metricsはvalidated inputとして使用しません。

## RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
```

## 次の許可された工程

1. Stage 1 exact machine-readable specをoutcome-blindに固定する。
2. source generation / root selection / dedup / leaf assignment / promotion / decision mappingを固定する。
3. Stage 1 production / independent implementationsを作成しtechnical-only preflightする。
4. source hashes、artifact ceiling、workflow timeout、runner-local comparer contractを固定する。
5. source-freeze checkpointを作成する。
6. 以上がすべてPASSした場合のみ、別のexplicit Stage 1 authorizationを作成する。

現在はStage 1/2 scientific generationを開始してはいけません。
