# Study 1 Vocabulary — 局面類型と棋風

Date: 2026-08-10  
Status: **frozen final vocabulary**

この文書は、研究 **「Baoにおける局面類型と棋風の発見・検証」** の最終語彙を定義します。

語彙のstatusを混同しないことが重要です。

```text
confirmed       = 独立formal confirmationを通過
exploratory     = 記述上有用だがformal confirmationされていない
rejected/non-type = 類型として採用しない
external bridge = closed Study 1由来の固定語彙
```

## 1. Core conceptual terms

### Position type / 局面類型

ある一時点の盤面・合法手・捕獲構造等を表す **state-level structural object**。

一局全体の傾向やAI実装名とは区別する。

### Playing style / 棋風

多数の局面、滞在、遷移、捕獲活動等にわたる **trajectory / policy-level pattern**。

一局面だけから棋風を判定しない。

### Search condition metadata

`phase2`, `legacy`, evaluator, depth等は研究条件を表すmetadata。

これ自体を局面類型や棋風の意味ラベルとして使用しない。

## 2. Confirmed Mtaji ontology

### MTAJI-M1

Canonical ID:

```text
MTAJI-M1
```

English:

```text
Capture-Engaged Low-Contrast Morphology
```

Japanese:

```text
捕獲関与・低コントラスト型局面形態
```

Status:

```text
FORMALLY CONFIRMED
```

Meaning:

- Mtaji state-level morphology.
- comparatively greater capture engagement in the frozen representation.
- comparatively smaller actor/opponent absolute structural differences than MTAJI-M2.

“Low-Contrast” does not mean low quality, weak, losing, defensive or passive.

### MTAJI-M2

Canonical ID:

```text
MTAJI-M2
```

English:

```text
Capture-Sparse High-Contrast Morphology
```

Japanese:

```text
捕獲希薄・高コントラスト型局面形態
```

Status:

```text
FORMALLY CONFIRMED
```

Meaning:

- Mtaji state-level morphology.
- comparatively sparse capture engagement in the frozen representation.
- comparatively larger actor/opponent absolute structural differences than MTAJI-M1.

“High-Contrast” does not mean high strength, winning, aggressive or superior.

### Scope of MTAJI-M1/M2

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

These are bounded empirical morphologies under the frozen representation/population. They are not declared the universal or final Bao ontology.

## 3. Namua continuous vocabulary

No discrete Namua position type is promoted.

### N-PROG

Canonical ID:

```text
N-PROG
```

Label:

```text
Namua Progress Context
```

Status:

```text
EXPLORATORY CONTEXT ONLY
```

Meaning:

Reserve depletion / progression coordinate. It was almost deterministically monotonic with game progression and is therefore treated as context, not morphology or style.

### N-ACT

Canonical ID:

```text
N-ACT
```

Label:

```text
Namua Capture Activity
```

Status:

```text
EXPLORATORY CONTINUOUS COORDINATE
```

Meaning:

Continuous Namua coordinate describing capture-related tactical activity under the frozen discovery-side transform.

It is not a discrete position type.

Stage 6 relation:

In the fixed E-018 D2 / E-019 D3 / E-020 D3 bridge, `capture-branch-expansion` tended to lie toward higher N-ACT values than the frozen non-precursor comparator. This is secondary hypothesis-generation evidence only.

### N-CON

Canonical ID:

```text
N-CON
```

Label:

```text
Namua Structural Contrast
```

Status:

```text
EXPLORATORY CONTINUOUS COORDINATE
```

Meaning:

Role-invariant continuous coordinate describing actor/opponent structural contrast in Namua.

It is not a discrete position type.

Stage 6 relation:

The expansion-versus-comparator relation was condition-dependent rather than universally positive or negative.

## 4. Playing-style discovery vocabulary

The following aliases describe the Stage 4 discovery geometry only.

They are **not confirmed playing-style coordinates** because Stage 5 returned `not-confirmed`.

### STYLE-C1

```text
STYLE-C1 = Engagement-Persistence
```

Status:

```text
DISCOVERY-DERIVED EXPLORATORY TRAJECTORY DESCRIPTOR
```

Discovery meaning:

More persistent MTAJI-M1 occupancy/dwell together with higher average Namua capture activity and lower activity variability/switching.

### STYLE-C2

```text
STYLE-C2 = Structural-Contrast Intensity
```

Status:

```text
DISCOVERY-DERIVED EXPLORATORY TRAJECTORY DESCRIPTOR
```

Discovery meaning:

Greater Namua structural contrast level/variation/trend.

### STYLE-C3

```text
STYLE-C3 = Activity-Escalation Dynamics
```

Status:

```text
DISCOVERY-DERIVED EXPLORATORY TRAJECTORY DESCRIPTOR
```

Discovery meaning:

Stronger positive Namua capture-activity trend and related activity variation/dwell pattern.

### STYLE-C4

```text
STYLE-C4 = Morphology-Switching Tempo
```

Status:

```text
DISCOVERY-DERIVED EXPLORATORY TRAJECTORY DESCRIPTOR
```

Discovery meaning:

Faster switching between MTAJI-M1/M2 and shorter dwell behavior.

### Formal boundary

```text
Stage 5 decision = not-confirmed
resultHash = 6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
```

Therefore do not write:

```text
"Bao has four confirmed playing styles"
```

Preferred wording:

```text
"Stage 4 yielded four exploratory trajectory coordinates, but the exact 4D geometry was not independently confirmed."
```

## 5. Rejected / non-type terms

### Actor-oriented Mtaji k=2

Status:

```text
NOT AN INTRINSIC POSITION TYPE
```

Preferred description:

```text
continuous relational-polarity coordinate
```

Reason:

The apparent clusters largely flipped with actor/opponent role and behaved like a signed relational axis.

### Namua k=2 / k=4

Status:

```text
NO DISCRETE POSITION TYPE PROMOTED
```

Do not resurrect these labels as confirmed or provisional types from the existing data.

### Playing-style clusters k=2..6

Status:

```text
UNSUPPORTED AS A COHERENT DISCRETE STYLE TYPOLOGY
```

Cluster IDs from Stage 4 diagnostics are not semantic style names.

## 6. External Study 1 bridge vocabulary

The following term is inherited unchanged from the closed phase-transition Study 1.

### capture-branch-expansion

Preferred full wording:

```text
capture-branch-expansion strategic-transition phenotype
```

or

```text
strong phase-transition candidate with bounded recognition scope
```

It is not redefined by the present study.

Stage 6 bounded relation:

```text
fixed D2/D3 bridge expansion units = 59
Namua = 59
Mtaji = 0
```

Preferred wording:

> In the fixed Study 1 D2/D3 bridge corpora, every observed capture-branch-expansion unit occurred during Namua and the phenotype tended to occupy comparatively high N-ACT states.

Do not generalize this to:

```text
"capture-branch-expansion is impossible in Mtaji"
```

### sustained-forcing window

Status:

```text
closed Study 1 retrospective Stage B interpretation
```

It is not a position type and was not refit in this study.

## 7. Terms that must remain separate

Do not equate:

```text
MTAJI-M1/M2 != playing style
N-ACT/N-CON != discrete position type
STYLE-C1..C4 != confirmed styles
phase2/legacy != styles
winner/outcome != position type
capture-branch-expansion != MTAJI-M1/M2
```

The final study vocabulary is intentionally asymmetric because the evidence is asymmetric across phase and analysis level.
