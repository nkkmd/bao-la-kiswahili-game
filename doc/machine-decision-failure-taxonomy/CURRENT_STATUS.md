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
Study = INITIATED
Stage 0 = DESIGNED / NOT YET EXECUTED
Stage 1 = NOT AUTHORIZED / NOT EXECUTED
Stage 1 seeds 28910001..28914096 = RESERVED / UNCONSUMED
Stage 2 = NOT AUTHORIZED / NOT EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
scientificInferenceAuthorized = false
validated transform set = []
canonicalization = false
symmetry reduction = false
```

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

1. Stage 0 technical toolingをG2-08固有instrumentとして実装する。
2. independent implementationをproduction helper非依存で実装する。
3. positive/negative/determinism/move-identity/state-reconstruction/leakage/serialization controlsを実行する。
4. scientific target distributionを覗かないtechnical resource/artifact preflightを実行する。
5. Stage 0 PASSの場合のみStage 1 exact spec、source hash、artifact ceiling、decision mappingをfreezeする。
6. その後に別のexplicit Stage 1 authorizationを作る。

現在はStage 1/2 scientific generationを開始してはいけません。
