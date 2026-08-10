# 局面類型と棋風研究

このディレクトリは、Bao la Kiswahili に反復して現れる局面構造と、対局trajectoryに現れる戦略傾向を分類・検証した研究を管理します。

Status: **research complete**  
Branch: `research/position-typology-and-playing-style`

## 研究題目

> **Baoにおける局面類型と棋風の発見・検証**

本研究は [`doc/FUTURE_RESEARCH_AGENDA.md`](../FUTURE_RESEARCH_AGENDA.md) の「局面類型と棋風」を起点として開始しました。

## まず読む文書

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向けの研究全体像
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的正本
3. [`STUDY_1_VOCABULARY.md`](STUDY_1_VOCABULARY.md) — confirmed / exploratory / rejectedを分けた最終語彙
4. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — hash、artifact、toolingの再現性索引
5. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure状態と固定境界
6. [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md) — 研究開始時の設計骨格
7. [`../phase-transition/STUDY_1_FINAL_REPORT.md`](../phase-transition/STUDY_1_FINAL_REPORT.md) — cross-study bridgeの対象となったclosed phase-transition Study 1

## 最終主要結果

### Mtaji — confirmed two-type morphology

独立held-out confirmationにより、固定representation / preregistered population内で次の二つのstate-level morphologyをformalにconfirmedしました。

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
           捕獲関与・低コントラスト型局面形態

MTAJI-M2 = Capture-Sparse High-Contrast Morphology
           捕獲希薄・高コントラスト型局面形態
```

```text
Stage 2 formal decision = confirmed
resultHash = 26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347
```

これはuniversal/final Bao ontologyではなく、bounded empirical claimです。

### Namua — continuous representation preferred

Namuaではstable discrete position typeをpromoteしませんでした。

```text
N-PROG = deterministic progress context
N-ACT  = exploratory continuous capture-activity coordinate
N-CON  = exploratory continuous structural-contrast coordinate
```

N-PROGは進行contextでありmorphology/style featureには使いません。N-ACT/N-CONはexploratoryです。

### Playing style — discrete set unsupported / exact 4D geometry not confirmed

Stage 4ではk=2..6のcoherent discrete style setは得られませんでした。

Discovery-derived coordinates:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

Stage 5 independent confirmationではbehavioral anchors/signaturesは再現しましたが、exact 4D PCA subspaceのalignmentとtrajectory-resampling stabilityが事前登録基準を満たしませんでした。

```text
Stage 5 formal decision = not-confirmed
resultHash = 6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
```

したがってSTYLE-C1..C4はconfirmed style ontologyではなく、**discovery-derived exploratory trajectory descriptors**です。

### Cross-study — capture-branch-expansionは固定bridgeでNamuaに位置

closed phase-transition Study 1のE-018 D2 / E-019 D3 / E-020 D3 formal archivesをread-only replayし、position representationへsecondary bridgeしました。

```text
Stage 6 protocolHash
= 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc

Stage 6 resultHash
= 59b210fb76970314a9c3c29b3cf47070172e0aa850d1e47c0c1ab06f3006537a
```

Unique trajectory-ply単位の`capture-branch-expansion`は59件で、

```text
Namua = 59
Mtaji = 0
```

でした。

したがって、この固定scopeではexpansionをMTAJI-M1/M2へ対応づけることはできません。

NamuaではN-ACTがexpansion位置で高い方向を6条件すべてで示し、とくにD3 legacyのE-019/E-020で大きな正のCliff's deltaが繰り返されました。N-CONはcondition-dependentでした。

これはsecondary / hypothesis-generation evidenceであり、新しいformal confirmation、causal mediation、一般的search-profile × depth interactionではありません。

## 最終的な構造像

```text
Bao position structure
├─ Namua
│  ├─ discrete type: promotedせず
│  ├─ N-PROG: context
│  ├─ N-ACT: exploratory continuous coordinate
│  └─ N-CON: exploratory continuous coordinate
│
└─ Mtaji
   ├─ MTAJI-M1: formally confirmed
   └─ MTAJI-M2: formally confirmed

Playing style
├─ discrete clusters: unsupported
└─ exact STYLE-C1..C4 4D geometry: formal not-confirmed
```

## 重要な概念分離

- **局面類型 (position type)**: state-level structural object
- **棋風 (playing style)**: trajectory / policy-level pattern
- **AI実装名 / search profile**: metadata
- **強さ / 勝率**: 別の性能指標

```text
MTAJI-M1/M2 != playing style
N-ACT/N-CON != discrete position type
STYLE-C1..C4 != confirmed styles
phase2/legacy != styles
capture-branch-expansion != MTAJI-M1/M2
```

## 研究規律

- exploratory discoveryとconfirmatory validationを分離した。
- formal thresholdを結果後に緩和していない。
- negative / inconclusive resultを保持した。
- trajectory / repeated state dependenceを無視していない。
- Study 1 formal decisionsを変更していない。
- formal corpusをGitHub Actionsで生成していない。
- Stage 5 failed confirmationを同じheld-out data上の新feature/k/thresholdで救済していない。
- Stage 6 protocolをassociation値を見る前にfreezeした。

研究の科学的正本は [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) です。
