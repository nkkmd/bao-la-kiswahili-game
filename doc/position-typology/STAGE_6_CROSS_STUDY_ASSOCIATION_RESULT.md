# Stage 6 Cross-Study Association Result

Date: 2026-08-10  
Status: **complete secondary / hypothesis-generation result**

## Purpose

Stage 6 asks where the already-fixed Study 1 `capture-branch-expansion` phenotype lies within the independently constructed position representation from the current study.

This is not a new formal confirmation experiment. It does not change any Study 1 decision, does not rescue Stage 5 `not-confirmed`, and does not establish causal mediation.

Frozen protocol:

```text
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

Result artifact:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/association/cross-study-association-result.json
resultHash = 59b210fb76970314a9c3c29b3cf47070172e0aa850d1e47c0c1ab06f3006537a
```

The result hash was independently recomputed from canonical JSON and matched exactly.

## Integrity

```text
raw eligible candidate rows = 757
unique trajectory-ply units = 227
duplicate rows collapsed = 530
conditions = 6
all replay checks passed = true
```

All fixed boundaries remained intact:

```text
confirmatory p-values = not computed
classifier refit = not performed
Namua scaler refit = not performed
new cluster search = not performed
STYLE-C1..C4 = not used
games executed = false
formal Study 1 analysis rerun = false
archives modified = false
Study 1 formal decisions modified = false
Stage 5 decision modified = false
pooled cross-corpus primary inference = false
causal mediation claim = false
```

## Fixed analysis population

Core corpus slices:

```text
E-018 D2: legacy / phase2
E-019 D3: legacy / phase2
E-020 D3: legacy / phase2
```

Primary descriptive unit:

```text
experiment + condition + trajectoryHash + candidatePly
```

Positive phenotype:

```text
capture-branch-expansion
```

Frozen non-precursor comparator:

```text
temporary-spike
capture-branch-convergence
```

Excluded from the comparator:

```text
namua-to-mtaji-precursor
forcing-release-precursor
```

## 1. Phase overlap — primary structural finding

Across the six fixed conditions, the 227 unique trajectory-ply units contained:

```text
capture-branch-expansion = 59
non-precursor comparator = 48
precursor classes = 120
```

All 59 observed `capture-branch-expansion` units occurred in **Namua**:

```text
expansion in Namua = 59
expansion in Mtaji = 0
```

This pattern held separately in every condition:

| Corpus | Condition | Expansion | Namua expansion | Mtaji expansion |
|---|---:|---:|---:|---:|
| E-018 D2 | LG | 7 | 7 | 0 |
| E-018 D2 | P2 | 11 | 11 | 0 |
| E-019 D3 | LG | 17 | 17 | 0 |
| E-019 D3 | P2 | 6 | 6 | 0 |
| E-020 D3 | LG | 13 | 13 | 0 |
| E-020 D3 | P2 | 5 | 5 | 0 |

Correct bounded interpretation:

> In the fixed E-018 D2 / E-019 D3 / E-020 D3 cross-study bridge population, every observed capture-branch-expansion candidate occurred during Namua rather than Mtaji.

This does **not** establish that capture-branch-expansion can never occur in Mtaji outside this scope.

## 2. Mtaji morphology bridge

Because no expansion unit occurred in Mtaji, the preregistered question of whether expansion is preferentially associated with `MTAJI-M1` or `MTAJI-M2` is not estimable in this bridge population.

Therefore:

```text
MTAJI-M1/M2 expansion association = not estimable
reason = zero Mtaji capture-branch-expansion units in all six conditions
```

This is a substantive phase-localization result, not a failure of the confirmed Mtaji classifier.

The confirmed ontology remains unchanged:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No new Mtaji type is created and no classifier refit is allowed.

## 3. Namua N-ACT relation

`N-ACT` is the frozen exploratory Namua capture-activity coordinate. Positive Cliff's delta means expansion positions tend to have higher N-ACT than the fixed non-precursor comparator.

| Corpus | Condition | Expansion n | Comparator n | Median diff | Cliff's delta |
|---|---:|---:|---:|---:|---:|
| E-018 D2 | LG | 7 | 6 | +0.2179 | +0.3810 |
| E-018 D2 | P2 | 11 | 4 | -0.0407 | +0.1818 |
| E-019 D3 | LG | 17 | 9 | +0.6189 | +0.6732 |
| E-019 D3 | P2 | 6 | 7 | +0.0341 | +0.3333 |
| E-020 D3 | LG | 13 | 7 | +0.7931 | +0.6923 |
| E-020 D3 | P2 | 5 | 7 | +0.1429 | +0.5429 |

Key descriptive pattern:

- Cliff's delta is positive in all six conditions.
- The strongest repeated separation is in D3 legacy:
  - E-019 D3-LG: `delta = +0.6732`
  - E-020 D3-LG: `delta = +0.6923`
- D2 shows weaker and less consistent median separation.

Bounded interpretation:

> Within the fixed bridge scope, capture-branch-expansion is repeatedly located toward the higher-activity side of the exploratory Namua N-ACT coordinate, with the clearest repeated contrast in the two independent D3 legacy corpora.

No p-value or confirmatory threshold is attached to this statement.

## 4. Namua N-CON relation

`N-CON` is the frozen exploratory Namua structural-contrast coordinate.

| Corpus | Condition | Median diff | Cliff's delta |
|---|---:|---:|---:|
| E-018 D2 | LG | +0.3113 | +0.3810 |
| E-018 D2 | P2 | +0.1419 | 0.0000 |
| E-019 D3 | LG | -0.0373 | -0.1111 |
| E-019 D3 | P2 | +0.1722 | +0.6667 |
| E-020 D3 | LG | -0.0373 | -0.0989 |
| E-020 D3 | P2 | +0.0927 | +0.5429 |

Unlike N-ACT, N-CON does not show one common direction across all conditions.

A repeated D3 profile contrast is visible descriptively:

```text
D3 legacy:
  E-019 delta = -0.1111
  E-020 delta = -0.0989

D3 phase2:
  E-019 delta = +0.6667
  E-020 delta = +0.5429
```

This repeated sign pattern is hypothesis-generation evidence only. It does not establish a general search-profile × depth interaction and is not evidence of causal mediation.

## 5. Relation to Study 1

Study 1 formal decisions remain exactly unchanged:

```text
E-018 / H16 = confirmed only for hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only for hard / bao / depth3, legacy > phase2
```

Stage 6 provides a structural description of where the fixed phenotype occurs:

1. the observed expansion phenotype is Namua-localized within the bridge scope;
2. it tends to occupy relatively high N-ACT states;
3. N-CON shows a condition-dependent pattern, including a repeated D3 LG-versus-P2 contrast;
4. the phenotype cannot be mapped to MTAJI-M1/M2 in this sample because no expansion candidate occurs in Mtaji.

These observations do not modify the original paired game-level Study 1 endpoints.

## 6. Relation to the current position/style study

The Stage 6 result strengthens the conceptual separation already established in this study:

```text
Mtaji:
  confirmed MTAJI-M1/M2 morphology
  but no observed capture-branch-expansion overlap in the fixed Stage 6 bridge

Namua:
  no discrete type promoted
  exploratory N-ACT / N-CON continuous coordinates
  capture-branch-expansion lies within this phase in all observed bridge cases

Playing style:
  exact STYLE-C1..C4 4D geometry remains formally not-confirmed
  Stage 6 does not use or rescue those coordinates
```

## 7. Scientific conclusion

The strongest Stage 6 conclusion is not that `capture-branch-expansion` corresponds to one of the confirmed Mtaji morphologies. Instead, the fixed cross-study bridge places the phenotype entirely in Namua in the examined D2/D3 formal corpora.

Within Namua, the most coherent descriptive relation is with **capture activity (N-ACT)** rather than a single universal structural-contrast position on N-CON.

Recommended bounded wording:

> In the fixed Study 1 D2/D3 bridge corpora, capture-branch-expansion was observed exclusively during Namua and tended to occur at comparatively high Namua capture-activity states. Structural contrast showed condition-dependent rather than universal separation.

This is secondary hypothesis-generation evidence, not a new formal confirmation claim.
