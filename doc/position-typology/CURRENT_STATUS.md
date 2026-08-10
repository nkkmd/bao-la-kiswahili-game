# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji independent confirmation complete / MTAJI-M1 and MTAJI-M2 formally confirmed under frozen study boundary / namua no discrete candidate / naming and playing-style follow-up not yet performed**

Branch: `research/position-typology-and-playing-style`

主要文書:

- [`STAGE_1_EXPLORATORY_PROTOCOL.md`](STAGE_1_EXPLORATORY_PROTOCOL.md)
- [`STAGE_1_PILOT_RESULT.md`](STAGE_1_PILOT_RESULT.md)
- [`STAGE_1_FEATURE_AUDIT_RESULT.md`](STAGE_1_FEATURE_AUDIT_RESULT.md)
- [`STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md`](STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md)
- [`STAGE_1_STABILITY_AUDIT_RESULT.md`](STAGE_1_STABILITY_AUDIT_RESULT.md)
- [`STAGE_1_POLARITY_AUDIT_RESULT.md`](STAGE_1_POLARITY_AUDIT_RESULT.md)
- [`STAGE_1_INVARIANT_MORPHOLOGY_RESULT.md`](STAGE_1_INVARIANT_MORPHOLOGY_RESULT.md)
- [`STAGE_1_MTAJI_CANDIDATE_DEFINITION_RESULT.md`](STAGE_1_MTAJI_CANDIDATE_DEFINITION_RESULT.md)
- [`STAGE_2_MTAJI_CONFIRMATION_PREREGISTRATION.md`](STAGE_2_MTAJI_CONFIRMATION_PREREGISTRATION.md)
- [`STAGE_2_MTAJI_CONFIRMATION_RUNBOOK.md`](STAGE_2_MTAJI_CONFIRMATION_RUNBOOK.md)
- [`STAGE_2_MTAJI_CONFIRMATION_RESULT.md`](STAGE_2_MTAJI_CONFIRMATION_RESULT.md)
- [`preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json`](preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json)
- [`checkpoints/2026-08-10-stage2-mtaji-formal-confirmation.md`](checkpoints/2026-08-10-stage2-mtaji-formal-confirmation.md)

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

完了済み:

1. Stage 0 instrumentation / corpus / symmetry audit
2. 96-game Stage 1 exploratory discovery pilot
3. replay / provenance / eligible-population audit
4. feature redundancy / distribution audit
5. S-pruned clustering diagnostic k=2..10
6. candidate stability / representation audit
7. mtaji actor-oriented polarity audit
8. actor-oriented mtaji k=2をtwo intrinsic typesとして棄却
9. actor/opponent-invariant morphology k=2発見
10. invariant morphology stability / persistence / density audit
11. mtaji invariant k=2をboard-level provisional two-type setへ昇格
12. exact discovery classifier definition export / freeze
13. Stage 2 independent confirmation preregistration
14. 192-game held-out formal corpus generation
15. full replay / provenance verification
16. preregistered G1–G5 formal analysis
17. **Stage 2 formal decision = confirmed**

現在の停止点は:

> **Mtaji two-type confirmation完了後。final naming / namua gradient / playing-style analysisへ進む前。**

まだ実施していない:

- final mtaji ontology naming review
- namua gradient-specific follow-up
- playing-style analysis
- Study 1 cross-study relation analysis

## Study 1 fixed boundary

Closed phase-transition Study 1は変更しない。

過去のformal decisions、`capture-branch-expansion` classifier / vocabulary、forced-capture regime、`sustained-forcing window`解釈境界、trajectory-ply sensitivityの位置づけ、negative/null resultsを維持する。

Study 1 formal corpusはinitial typology discoveryにもStage 2 mtaji confirmationにも使用していない。

## Rejected mtaji relational k=2

Actor-oriented S-pruned mtaji k=2はstableだったが、role swap / consecutive-ply flip / shallow density valleyから:

```text
actor-oriented mtaji k=2
= continuous relational polarity coordinate
!= two intrinsic position types
```

このdecisionはStage 2 confirmation後も変更しない。

## Confirmed mtaji position morphology

Representation:

```text
actor-opponent-invariant-morphology-v1
```

For each primitive field:

```text
total(actor, opponent)
absDifference(actor, opponent)
```

40 dimensions。predeclared skewed fieldsはlog1p後にconstruction。

Frozen discovery classifier:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
KMeans k=2
n_init=50
random_state=20260809
```

Discovery StandardScaler・2×40 centroids・canonical mappingをheld-out dataでrefit/restandardize/relabelしない。

Canonical study IDs:

```text
MTAJI-M1
MTAJI-M2
```

Current descriptive aliases:

```text
MTAJI-M1 = capture-engaged / relatively balanced morphology
MTAJI-M2 = capture-sparse / relatively asymmetric morphology
```

IDsはfixed classifier / population boundary内でformal confirmation済み。English aliasesはontology wording review前のdescriptive labels。

## Stage 2 formal confirmation

Preregistration:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
```

Formal result hash:

```text
26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347
```

Held-out corpus:

```text
192 games
seed block = 20310001..20310192
6 conditions × 32 games
```

Observed formal population:

- mtaji-contributing games: 180
- raw eligible mtaji rows: 2,704
- rule-state-dedup rows: 2,704
- capped rows: 2,256

Technical gates:

- full replay / provenance verification: passed
- contributing games: 180 >= 144
- capped rows: 2,256 >= 1,500

## Primary formal gates — all passed

### G1 — type non-collapse

```text
minority frozen type fraction = 0.4481 >= 0.20
```

### G2 — frozen separation

```text
silhouette = 0.1964 >= 0.12
```

### G3 — frozen-axis discreteness

```text
BIC(1) = 11612.37
BIC(2) = 10722.08
BIC(3) = 10735.33
BIC(1)-BIC(2) = 890.28
BIC(3)-BIC(2) = 13.25
```

Passed both preregistered requirements.

Secondary KDE reproduced two peaks with valley / lower-peak ratio 0.3826.

### G4 — de-novo held-out agreement

ARI with frozen labels:

```text
K-means = 0.9167
GMM     = 0.9184
Ward    = 0.9031
median  = 0.9167
```

3/3 methods exceeded 0.70.

### G5 — trajectory-level robustness

100 deterministic 80%-game subsamples:

```text
ARI p10   = 0.8931 >= 0.60
ARI median= 0.9205
ARI min   = 0.8790
```

## Formal decision

Preregistered rule:

```text
all technical gates + G1..G5 pass -> confirmed
technical gates pass + any G1..G5 fails -> not-confirmed
technical/integrity insufficiency -> inconclusive
```

Observed:

```text
all technical gates passed
G1 passed
G2 passed
G3 passed
G4 passed
G5 passed
```

Therefore:

```text
FORMAL DECISION = confirmed
```

Confirmed claim:

> Within the preregistered Bao mtaji population and the frozen actor/opponent-invariant morphology representation, the Stage 1 two-type structural partition independently replicates.

No post-hoc rescue was used.

## Held-out morphology profile

### MTAJI-M1

Held-out direction reproduces the discovery description:

- much higher total forced-capture availability
- much higher total capture-move count
- much higher total capturable seeds / capture events
- higher total front occupancy
- smaller actor/opponent differences on several capture/front measures

### MTAJI-M2

Approximately the reverse:

- capture-sparser
- lower total capture-event availability
- lower front occupancy
- larger actor/opponent structural asymmetry on several measures

These remain position morphologies, not playing styles, win/loss classes, actor-advantage labels, or AI implementation labels.

## Trajectory persistence

Held-out consecutive mtaji pairs: 2,524.

```text
same-type rate = 0.6311
flip rate      = 0.3689
run p75        = 3 plies
run p90        = 5 plies
run max        = 16 plies
```

This independently reproduces the discovery pattern of state-level persistence plus within-game transitions.

## Interpretation boundary

Formal confirmation does **not** establish:

- a universal Bao ontology for every legal state,
- a corresponding two-type namua ontology,
- a playing-style classification,
- causal outcome advantage,
- causal AI evaluator/search effects.

The confirmed object is specifically the frozen mtaji structural morphology classifier under the preregistered population boundary.

## Namua

Current decision remains:

```text
no discrete position-type candidate promoted
```

Do not force namua into the confirmed mtaji two-type set.

## Next authorized research streams

The following may now proceed separately without altering the Stage 2 formal decision:

1. **Mtaji ontology/naming review** — choose final human-readable terminology for MTAJI-M1/M2 while preserving the frozen classifier.
2. **Namua continuous-gradient analysis** — test whether progress/tactical-activity coordinates describe namua better than discrete types.
3. **Playing-style analysis** — derive trajectory/policy-level patterns from confirmed mtaji type occupancy, dwell, transitions, relational polarity, and other predeclared trajectory descriptors. Do not call AI implementation labels playing styles.
4. **Study 1 cross-study relation analysis** — only after the current typology/style definitions are independently fixed; do not revise Study 1 formal decisions.

## Important principles

- position type and playing style remain separate
- relational polarity remains a coordinate, not an intrinsic type
- Stage 2 confirmation is independent of the Stage 1 discovery corpus
- confirmed classifier may not be retroactively refit and called the same result
- aliases/names may change wording without changing the classifier
- no post-hoc rescue of future negative/null analyses
- Study 1 formal decisions remain unchanged
