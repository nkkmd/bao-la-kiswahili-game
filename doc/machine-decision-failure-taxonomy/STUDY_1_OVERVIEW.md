# G2-08 / MDFT-STUDY1 — 研究概要

更新日: 2026-08-29  
状態: **INITIATED / SCIENTIFIC SEEDS UNCONSUMED**

## この研究は何を調べるのか

本研究は、Baoのmachine/search decision failureを、単一の「悪手」classへ圧縮せず、複数の再現可能なmechanistic failure modeへ分解できるかを検証します。

中心となる問いは次です。

> 同一RAW stateで生じるmachine decision disagreementを、depth/horizon、reply resolution、ranking instability、tactical forcing、evaluation component sensitivity、morphology context、long-horizon structureなどの異なるmechanistic signatureへ、結果後の都合のよい再定義なしに分解し、fresh evidence上で再現できるか。

## なぜ新しい独立研究が必要か

`BMP-STUDY1`は4候補すべて`NOT-CONFIRMED`で閉じています。C01-C03のstructural/reply failure signatureが高率に再現したことは、新しい仮説を作る入力には使えますが、同じStage 2 evidenceを使って既存候補を救済することはできません。

`SRDR-STUDY1`はsearch-condition間のdecision instabilityを測定しましたが、formal decisionは`INCONCLUSIVE`です。higher-resource conditionはtruthではなく、frozen machine referenceにすぎません。

`RCPR-STUDY1`と`PCRPR-STUDY1`はどちらもStage 1でtechnical-invalid closureとなっており、production-only representation/modelをvalidated inputとして本Studyへ持ち込みません。これらのtechnical incidentは、新しいStudyの事前engineering designにだけ利用します。

## 基本設計

研究は次の3段階を採用します。

```text
MDFT-S0-TECHNICAL-2026-08-29-v1
  technical / instrument / verifier / resource / artifact validation only

MDFT-S1-DEVELOPMENT-2026-08-29-v1
  fresh development evidenceでtaxonomy construction

MDFT-S2-FORMAL-2026-08-29-v1
  fresh held-out evidenceでfrozen taxonomyをprospective validation
```

Stage 1が成功してもStage 2は自動実行しません。

## authoritative RAW identity

Research Generation 2共通contractに従い、科学的population identityは次です。

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

`AI.stateKey`等の既存helperがこのcontractと一致しない場合、scientific deduplicationには使用せず、G2-08専用RAW serializerを使用します。

## failure eventの入口

単に「探索結果が違う」ことをfailureとは定義しません。

Stage 1 scientific contractでは、少なくとも次を満たすrootのみをreference-consensus eligibleとします。

1. D3+Q1 exact full-window referenceと、固定high-budget conditionが同じexact TopSet / canonical bestを与える。
2. high-budget conditionが必要なcomplete depthを完了している。
3. legal exact move set、RAW reconstruction、score-domain integrityがtechnical gateを通過している。

そのうえでbaseline D2+Q1 canonical bestがreference TopSet外にある場合を、taxonomy分解対象の`REFERENCE-DISAGREEMENT-EVENT`とします。

D3とhigh-budget referenceが一致しないrootは`REFERENCE-AMBIGUOUS`とし、mechanistic failure labelを強制しません。D3/high-budgetの一致はgame-theoretic truthの証明ではありません。

## candidate family

初期candidate search spaceは10 leaf familyに限定し、Stage 1 outcome後に新しいfamilyを追加しません。taxonomyは**multi-label**とし、1 eventが複数mechanismを同時に持つことを許します。

- depth / horizon sensitivity
- quiescence / tactical sensitivity
- budget underresolution
- reply-tail underresolution
- capture / forcing-sequence misvaluation
- ranking instability
- reserve valuation sensitivity
- house / nyumba valuation sensitivity
- morphology-context mismatch
- long-horizon structural misvaluation

正式なleaf IDとoperational boundaryは`FAILURE_MODE_DICTIONARY.md`に記録します。

## leakage boundary

観測量を次の層へ分けます。

```text
A = PRE_ROOT_OBSERVABLE
B = BASE_SEARCH_DERIVED
C = REPLY_SEARCH_DERIVED
D = REFERENCE_SEARCH_DERIVED
E = FUTURE_CONTINUATION_DERIVED
F = TERMINAL_OR_GAME_OUTCOME_DERIVED
```

本Studyのtaxonomy assignmentはrule-basedであり、Stage 1で汎用learned classifierを訓練しません。Fはtaxonomy assignmentへ使用しません。Eを使う`LONG_HORIZON_STRUCTURAL`はpost-root diagnostic classとして明示し、pre-root predictionと混同しません。

## fresh evidence

```text
Stage 1 = seeds 28910001..28914096 / 4096 games / RESERVED / UNCONSUMED
Stage 2 = seeds 29010001..29018192 / 8192 games / RESERVED / UNCONSUMED
```

reservationはauthorizationではありません。Stage 1/2ともconsume-once gateより前にtechnical validation、source freeze、independent verifier readiness、resource/artifact preflight、explicit authorizationを要求します。

## 現在の正式状態

まだscientific outcomeは生成していません。現在は研究識別、immutable boundaries、candidate search space、Stage構成、fresh seed reservation、verification/artifact rulesを先に固定したinitiation checkpointです。
