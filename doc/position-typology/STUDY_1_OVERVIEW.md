# Study 1 Overview — Baoにおける局面類型と棋風の発見・検証

Date: 2026-08-10  
Status: **research complete**

## この研究は何を調べたか

この研究は、Bao la Kiswahili の局面を単なる「序盤・中盤・終盤」やAI評価値ではなく、盤面・合法手・捕獲構造・reserve・前列・mobilityなどの構造から説明できるかを調べました。

研究上、次の二つを厳密に分けています。

```text
position type = ある時点のstate-level局面構造
playing style = 多数の局面・遷移にわたるtrajectory/policy-level傾向
```

AIの`phase2`、`legacy`、depth、evaluator名はmetadataであり、局面類型や棋風の名前には使っていません。

## 結論を先に

### 1. Mtajiでは再現可能な二つの局面形態が得られた

独立held-out confirmationで次の二類型がformalにconfirmedされました。

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
           捕獲関与・低コントラスト型局面形態

MTAJI-M2 = Capture-Sparse High-Contrast Morphology
           捕獲希薄・高コントラスト型局面形態
```

これは本研究で最も強いpositive resultです。

ただし、Bao全体に普遍的な最終ontologyという意味ではありません。固定representationと研究population内で確認されたbounded state morphologyです。

### 2. Namuaでは離散類型より連続座標が適切だった

Namuaのk=2/k=4等を離散position typeとして採用する根拠は得られませんでした。

探索的には次の連続座標が有用でした。

```text
N-PROG = reserve depletionによる進行context
N-ACT  = capture activity
N-CON  = structural contrast
```

N-PROGはほぼ決定論的な進行時計なのでmorphology/style featureには使いません。

N-ACT/N-CONはexploratoryであり、formalにconfirmedされたposition typesではありません。

### 3. 離散的な「棋風タイプ」は支持されなかった

one-game-one-trajectoryでk=2..6を複数手法・resamplingで検査しましたが、coherentで安定した離散style cluster setは得られませんでした。

したがって「Baoにはこの4種類の棋風がある」のような結論は出していません。

### 4. 4次元continuous style geometryも独立確認には失敗した

探索では次の4軸を得ました。

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

しかし独立Stage 5では、behavioral anchors/signaturesは再現した一方、exact 4D PCA subspaceのalignmentとtrajectory-resampling stabilityが事前登録基準を満たしませんでした。

```text
FORMAL DECISION = NOT-CONFIRMED
```

したがってSTYLE-C1..C4は、confirmed style ontologyではなく探索的trajectory descriptorsとして残します。

### 5. Study 1のcapture-branch-expansionは、今回調べた範囲ではNamuaに位置した

closed phase-transition Study 1のformal archiveをread-onlyで再生し、独立に作ったposition representationへbridgeしました。

E-018 D2、E-019 D3、E-020 D3の6条件で、unique trajectory-ply単位の`capture-branch-expansion`は59件ありました。

```text
Namua = 59
Mtaji = 0
```

したがって、この固定cross-study scopeでは`capture-branch-expansion`をMTAJI-M1/M2のどちらかへ対応づけることはできませんでした。

Namua内では、expansion位置は比較対象より高いN-ACT側に位置する傾向が6条件すべてで観測され、特にD3 legacyのE-019/E-020で大きな差が繰り返されました。

N-CONは一方向ではなくcondition-dependentでした。

これはsecondary / hypothesis-generation resultであり、新しいformal confirmationやcausal mediationではありません。

## 最終的な研究像

```text
Bao position structure
├─ Namua
│  ├─ discrete position type: supportedせず
│  ├─ N-PROG: progress context
│  ├─ N-ACT: exploratory continuous coordinate
│  └─ N-CON: exploratory continuous coordinate
│
└─ Mtaji
   ├─ MTAJI-M1: formally confirmed
   └─ MTAJI-M2: formally confirmed

Playing style
├─ discrete style clusters: unsupported
└─ STYLE-C1..C4 exact 4D geometry: formal NOT-CONFIRMED

Cross-study
└─ capture-branch-expansion:
   fixed D2/D3 bridgeでは59/59がNamua
   -> high N-ACT sideとのsecondary relation
```

## この研究が示したこと

重要なのは、すべてを類型化できたことではありません。

むしろ、Baoの構造はphaseによって異なり、

- Mtajiではboundedな離散morphologyが再現できる
- Namuaでは連続的な構造記述の方が適切
- trajectory-level styleは単純な少数clusterとしては安定しない

という**非対称な構造**が見えました。

positive resultだけでなく、Namua discrete typeの棄却、discrete style clusteringの不支持、Stage 5 `NOT-CONFIRMED`も本研究の主要成果として保持します。

## 詳細

科学的正本:

```text
doc/position-typology/STUDY_1_FINAL_REPORT.md
```

語彙:

```text
doc/position-typology/STUDY_1_VOCABULARY.md
```

再現性:

```text
doc/position-typology/REPRODUCIBILITY_INDEX.md
```
