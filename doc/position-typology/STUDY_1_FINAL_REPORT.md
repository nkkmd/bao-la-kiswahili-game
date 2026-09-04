# Study 1 Final Report — Baoにおける局面類型と棋風の発見・検証

## 日本語での結論と読み方

fixed representationと研究populationの範囲で、MtajiのMTAJI-M1 / MTAJI-M2というbounded two-type morphologyを確認した。Namuaでは離散typeより連続座標が適切で、Bao全体の普遍的ontologyは主張しない。

以下には、Study closure時に固定した英語の詳細記録が含まれる。canonical decision token、数値、seed、hash、実行ID、authorization、evidence boundaryを再解釈しないため原文を保持している。初めて読む場合は`STUDY_1_OVERVIEW.md`と`CURRENT_STATUS.md`を先に参照する。

Date: 2026-08-10  
Status: **complete / scientific record**

## 1. Research purpose （日本語の要点）

This study examined whether recurrent Bao la Kiswahili game states can be described as reproducible structural position types and whether longer trajectories support stable playing-style descriptions.

The study deliberately separated:

```text
position type = state-level structural object
playing style = trajectory / policy-level pattern
```

Search implementation labels, evaluator names, depth, outcome and win/loss were not allowed to define position types or playing styles.

The study also preserved a strict exploratory/confirmatory boundary. Discovery data were not reused as independent confirmation, held-out thresholds were not relaxed after inspection, and negative/null results were retained.

## 2. Research questions and final answers （結論）

### RQ1 — Can recurrent position structures be extracted? （日本語の要点）

**Answer: yes, but not uniformly across phases.**

Mtaji yielded a reproducible bounded two-type morphology under a fixed role-invariant representation. Namua did not support a stable discrete position-type candidate and was better described by continuous coordinates.

### RQ2 — Are the extracted structures stable? （日本語の要点）

**Mtaji: yes under the preregistered representation/population.**  
**Namua discrete types: no candidate promoted.**

The Mtaji two-type classifier was independently confirmed on a fresh 192-game held-out corpus.

### RQ3 — Are there recurrent transitions between types? （日本語の要点）

The strongest confirmed discrete typology exists only in Mtaji. Transition/dwell structure was therefore used mainly as trajectory descriptors rather than promoted as a separate confirmed transition ontology.

No universal position-transition taxonomy is claimed.

### RQ4 — Are stable playing styles identifiable? （日本語の要点）

**No discrete playing-style typology was supported.**

A four-dimensional continuous discovery geometry was found, but its exact PCA subspace failed preregistered independent confirmation. The discovered coordinates remain exploratory descriptors rather than a confirmed playing-style system.

### RQ5 — How do search conditions relate to position/style structure? （日本語の要点）

Search condition labels were used only as metadata diagnostics. Some condition-associated variation exists, but no implementation label was redefined as a style.

The study does not claim a general search-profile × depth style interaction.

### RQ6 — How does the independently derived representation relate to Study 1 capture-branch-expansion? （識別と表現）

In the fixed E-018 D2 / E-019 D3 / E-020 D3 cross-study bridge, all 59 unique `capture-branch-expansion` units occurred in **Namua**, with zero in Mtaji.

Within Namua, expansion positions tended to occur toward higher N-ACT values. N-CON relations were condition-dependent.

This is secondary hypothesis-generation evidence only.

## 3. Study design （方法と設計）

### 3.1 Stage 0 — instrumentation and corpus audit （Stageの記録）

The engine state and feature extraction were audited before discovery.

State identity was separated into:

```text
historicalStateHash
ruleStateKey
seatCanonicalKey
```

`ruleStateKey` intentionally omits historical bookkeeping such as `turn`/`reason` and captures rule-relevant state. Seat canonicalization was validated using player-index swapping only; no unsupported board-column or direction reversal was introduced.

Features were divided conceptually into:

- Tier A: board/legal primitives
- Tier B: trajectory context
- Tier C: AI/search metadata

Tier C variables were excluded from initial structural clustering.

### 3.2 Stage 1 — exploratory discovery corpus （Stageの記録）

A fresh 96-game exploratory corpus was generated with six conditions and base seed `20270001`.

The primary eligible population excluded terminal states and opening plies before ply 8. Namua and Mtaji were analyzed separately.

Primary eligible counts:

```text
4834 total
3339 Namua
1495 Mtaji
```

No formal claim was made from this corpus alone.

### 3.3 Dependence and representation audits （識別と表現）

The initial actor-oriented Mtaji k=2 solution was examined for role dependence.

It showed strong actor/opponent polarity behavior, including high cluster flipping under role swap and near-antisymmetric projection behavior. It was therefore rejected as an intrinsic position type and retained only as a continuous relational-polarity coordinate.

A role-invariant Mtaji representation based on actor/opponent totals and absolute differences was then constructed.

This representation yielded a robust provisional two-type morphology and was frozen before independent confirmation.

## 4. Stage 2 — Mtaji independent confirmation （Stageの記録）

Frozen candidate definition:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Preregistration:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
```

Held-out corpus:

```text
192 games
six conditions × 32
fresh seed block 20310001..20310192
local execution only
```

Formal result:

```text
resultHash = 26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347
FORMAL DECISION = confirmed
```

Key held-out values:

```text
contributing games = 180
capped rows = 2256
minority fraction = 0.44814
silhouette = 0.19640

BIC1 = 11612.365
BIC2 = 10722.084
BIC3 = 10735.331

de novo agreement with frozen classifier:
KMeans ARI = 0.91666
GMM ARI    = 0.91835
Ward ARI   = 0.90312

resampling ARI:
p10    = 0.89308
median = 0.92048
```

### Confirmed bounded ontology （日本語の要点）

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
           捕獲関与・低コントラスト型局面形態

MTAJI-M2 = Capture-Sparse High-Contrast Morphology
           捕獲希薄・高コントラスト型局面形態
```

“Low/High Contrast” refers to smaller/larger role-invariant actor/opponent structural differences. It does not mean weak/strong, winning/losing, or passive/aggressive style.

This is a bounded empirical ontology under the frozen representation and study population, not a universal final ontology for all Bao states.

## 5. Stage 3 — Namua continuous representation （Stageの記録）

No discrete Namua position-type candidate was promoted.

The exploratory role-invariant analysis instead produced three coordinates:

```text
N-PROG = reserve-depletion progress
N-ACT  = capture activity
N-CON  = structural contrast
```

Stage 3 audit:

```text
099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a
```

### N-PROG （日本語の要点）

N-PROG was almost perfectly monotonic with ply within games and behaved as a deterministic progression clock. It was therefore retained only as context and excluded from playing-style features.

### N-ACT （日本語の要点）

N-ACT behaved as a continuous tactical capture-engagement coordinate rather than a discrete mode.

### N-CON （日本語の要点）

N-CON behaved as a continuous role-invariant structural-contrast coordinate.

The coordinate system is exploratory. No independent formal confirmation of the exact Namua coordinate system was claimed.

## 6. Stage 4 — playing-style discovery （Stageの記録）

The primary unit was one full-phase game trajectory. Eighty-nine Stage 1 games contained eligible states in both phases.

Ten trajectory descriptors were fixed from Namua N-ACT/N-CON and Mtaji M1/M2 occupancy/dwell/switching behavior.

Excluded from the style definition:

- raw ply
- N-PROG
- AI condition labels
- winner/outcome
- Mtaji classifier QA margin

### 6.1 Discrete style clustering （日本語の要点）

KMeans/GMM/Ward solutions for k=2..6 were diagnostic only.

They did not produce a coherent, cross-method, resampling-stable discrete style set. Some GMM solutions included singleton components and method agreement was weak.

Therefore:

```text
no discrete playing-style candidate promoted
```

### 6.2 Continuous discovery geometry （日本語の要点）

PCA of the ten trajectory descriptors produced four leading axes explaining approximately 76.78% cumulative discovery variance.

Exploratory aliases:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

Exact frozen discovery definition:

```text
styleCoordinateDefinitionHash = 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

The underlying exact Namua state transform required for reproducibility was separately frozen before Stage 5:

```text
styleIngredientDefinitionHash = b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

## 7. Stage 5 — independent playing-style confirmation （Stageの記録）

Preregistration:

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
```

Fresh corpus:

```text
192 generated games
176 full-phase trajectories
seed block 20350001..20350192
```

All technical gates passed.

Formal result:

```text
resultHash = 6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
FORMAL DECISION = not-confirmed
```

Preregistered gates:

```text
G1 frozen 4D variance retention      PASS  0.69823 >= 0.60
G2 de-novo subspace alignment        FAIL  max 34.1058° > 25°; mean 15.7369° > 15°
G3 behavioral anchors                PASS
G4 non-anchor signatures             PASS  7/8
G5 game-resample subspace robustness FAIL  p90 max-angle 48.8193° > 30°
```

Interpretation:

The frozen coordinates retained substantial held-out variance and their behavioral meanings remained recognizable, but the exact four-dimensional PCA geometry was not independently stable enough under the preregistered criteria.

Therefore:

```text
STYLE-C1..C4
= discovery-derived exploratory trajectory descriptors
!= confirmed playing-style coordinate system
```

No alternative dimension, clustering, threshold, descriptor set or preprocessing was fitted to the same held-out corpus to rescue this result.

## 8. Stage 6 — cross-study relation to phase-transition Study 1 （Stageの記録）

Closed Study 1 formal archives were used read-only after position/style discovery and confirmation were complete.

Fixed bridge scope:

```text
E-018 D2: P2 / LG
E-019 D3: P2 / LG
E-020 D3: P2 / LG
```

Frozen bridge protocol:

```text
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

Replay verification reconstructed candidate boards deterministically from archived moves. All six condition replay audits passed.

Association result:

```text
resultHash = 59b210fb76970314a9c3c29b3cf47070172e0aa850d1e47c0c1ab06f3006537a
raw candidate rows = 757
unique trajectory-ply units = 227
rows collapsed as duplicates = 530
```

### 8.1 Phase localization （日本語の要点）

The fixed phenotype occurred as follows:

```text
capture-branch-expansion = 59
Namua = 59
Mtaji = 0
```

This held in every one of the six conditions.

The correct bounded statement is:

> In the fixed E-018 D2 / E-019 D3 / E-020 D3 bridge population, every observed capture-branch-expansion unit occurred during Namua rather than Mtaji.

It is not a universal claim that Mtaji expansion is impossible.

### 8.2 Mtaji bridge （日本語の要点）

Because there were zero Mtaji expansion units, the association of expansion with MTAJI-M1 versus MTAJI-M2 is not estimable.

This does not weaken the Stage 2 Mtaji confirmation; it shows that the Study 1 transition phenotype and the confirmed Mtaji morphology occupy different phase scopes in the observed bridge corpus.

### 8.3 Namua N-ACT （日本語の要点）

Cliff's delta for expansion versus the frozen non-precursor comparator was positive in all six conditions.

The strongest repeated values occurred in D3 legacy:

```text
E-019 D3-LG = +0.6732
E-020 D3-LG = +0.6923
```

This supports the secondary description that expansion positions tend to lie toward higher Namua capture activity within the bridge scope.

### 8.4 Namua N-CON （日本語の要点）

N-CON did not show one universal direction.

A repeated D3 descriptive pattern was observed:

```text
legacy:
  E-019 = -0.1111
  E-020 = -0.0989

phase2:
  E-019 = +0.6667
  E-020 = +0.5429
```

This is hypothesis-generation evidence only. No general search-profile × depth interaction or causal mediation claim follows from it.

## 9. Positive, negative and null results （結果）

### Positive formal result （結果）

- MTAJI-M1/MTAJI-M2 bounded two-type morphology: **confirmed**.

### Negative / non-promoted results （結果）

- actor-oriented Mtaji k=2 as intrinsic position type: rejected; retained as relational polarity coordinate.
- Namua discrete k=2/k=4 position types: not promoted.
- discrete playing-style clusters k=2..6: unsupported.
- exact four-dimensional continuous playing-style geometry: **formal not-confirmed**.
- MTAJI-M1/M2 relation to capture-branch-expansion in Stage 6: not estimable because expansion count in Mtaji = 0.

These are not failed side analyses to discard. They define the empirical boundaries of the study.

## 10. Final scientific synthesis （結論）

The study does not support one simple global typology for all Bao positions.

Instead, the strongest evidence supports a **phase-dependent representation**:

```text
Namua
  -> continuous structural description preferred
  -> no discrete type promoted

Mtaji
  -> bounded reproducible two-type morphology confirmed

Trajectory-level playing style
  -> discrete clusters unsupported
  -> exact 4D PCA geometry not independently confirmed
```

The cross-study bridge further shows that the Study 1 `capture-branch-expansion` phenotype, in the examined formal D2/D3 corpora, lies on the Namua side of this phase division and is descriptively associated most consistently with higher N-ACT.

A concise final statement is:

> Bao position structure was not well described by a single universal clustering scheme. Under the fixed study representation, Mtaji showed a reproducible two-type morphology, whereas Namua was better represented by continuous coordinates. Stable discrete playing styles were not supported, and the exact discovery-derived four-dimensional style geometry was not independently confirmed. In the fixed Study 1 cross-study bridge, capture-branch-expansion occurred exclusively in Namua and tended toward higher Namua capture activity.

## 11. Interpretation boundaries （解釈）

This study does not claim:

- a universal/final Bao ontology;
- that all Namua states form no useful subtypes under every possible representation;
- that MTAJI-M1/M2 are strength or outcome classes;
- that STYLE-C1..C4 are confirmed universal styles;
- that `phase2` or `legacy` are styles;
- that capture-branch-expansion can never occur in Mtaji;
- causal mediation by N-ACT/N-CON;
- a general search-profile × depth interaction;
- that negative Stage 5 evidence may be rescued by post-hoc redefinition.

## 12. Future work （今後の課題）

The strongest next studies would be new, prospectively designed studies rather than re-analysis intended to rescue this dataset.

Priorities:

1. **Namua state-coordinate replication** — independently freeze and test N-ACT/N-CON as state coordinates in their own right.
2. **Transition timing around Namua→Mtaji** — test how the Study 1 phenotype relates temporally to reserve depletion and phase conversion without assuming a discrete Namua type.
3. **New playing-style model family** — if pursued, define a new prospective study rather than modifying Stage 5 after its negative result. Alternatives could focus on interpretable descriptor families instead of exact PCA axes.
4. **Human/expert validation** — compare confirmed MTAJI-M1/M2 representative boards against expert Bao interpretation.
5. **External implementation validity** — test the bounded morphology under additional legal engines/search implementations without treating implementation labels as semantic types.

## 13. Canonical companion documents （日本語の要点）

Overview:

```text
doc/position-typology/STUDY_1_OVERVIEW.md
```

Vocabulary:

```text
doc/position-typology/STUDY_1_VOCABULARY.md
```

Reproducibility index:

```text
doc/position-typology/REPRODUCIBILITY_INDEX.md
```

Current status / closure ledger:

```text
doc/position-typology/CURRENT_STATUS.md
```
