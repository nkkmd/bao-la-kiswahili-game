# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 1 mtaji provisional two-type discovery frozen / Stage 2 independent confirmation preregistered / held-out corpus not yet generated / namua no discrete candidate / no held-out result inspected**

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
- [`preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json`](preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json)

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
12. exact discovery classifier definition export
13. candidate-definition artifact inspection / acceptance
14. Stage 2 independent confirmation preregistration
15. formal corpus runner / replay verifier / confirmation analyzer implementation

現在の停止点は:

> **Stage 2 formal held-out corpus generationの直前**

まだ実施していない:

- Stage 2 seeds `20310001..20310192` のgame generation
- Stage 2 replay verification
- Stage 2 formal confirmation metrics
- final mtaji ontology naming
- namua gradient-specific follow-up
- playing-style analysis
- Study 1 cross-study relation analysis

## Study 1 fixed boundary

Closed phase-transition Study 1は変更しない。

過去のformal decisions、`capture-branch-expansion` classifier / vocabulary、forced-capture regime、`sustained-forcing window`解釈境界、trajectory-ply sensitivityの位置づけ、negative/null resultsを維持する。

Study 1 formal corpusはinitial typology discoveryへ使用していない。Stage 2 confirmationにも使用しない。

## Rejected mtaji relational k=2

Actor-oriented S-pruned mtaji k=2はstableだったが:

- role swap cluster flip rate: 0.8175
- original projection vs negative swapped projection correlation: 0.9063
- consecutive cluster flip rate: 0.9011 while player-to-move always flips
- KDE major-peak valley ratio: 0.9699

Decision:

```text
actor-oriented mtaji k=2
= continuous relational polarity coordinate
!= two intrinsic position types
```

このcoordinateは将来trajectory / playing-style分析で利用可能性があるが、position-type countには入れない。

## Stage 1 discovered mtaji invariant morphology

Representation:

```text
actor-opponent-invariant-morphology-v1
```

For each primitive field:

```text
total(actor, opponent)
absDifference(actor, opponent)
```

40 dimensions。predeclared skewed fieldsはlog1p後にconstructionし、discovery training rows上でStandardScaler。

### Discovery evidence

Capped discovery population:

- 1,222 mtaji states
- 89 contributing games
- K-means cluster fractions: 0.5728 / 0.4272
- silhouette: 0.1962

Method agreement:

- K-means vs GMM ARI: 0.9197
- K-means vs Ward ARI: 0.9134
- GMM vs Ward ARI: 0.9935

Full vs capped:

- K-means ARI: 0.9514
- GMM: 1.0000
- Ward: 0.9869

Trajectory resampling 80% games ×40:

- K-means median ARI: 0.9902
- K-means min: 0.9387
- GMM median: 1.0000

Invariant-axis discreteness:

- BIC 1 component: 6213.06
- BIC 2 components: 5786.86
- BIC 3 components: 5796.42
- KDE peaks: 2
- valley / lower-peak ratio: 0.4305

Not reducible to single scalar:

- activityMagnitude ARI: 0.0236
- imbalanceMagnitude ARI: 0.1837

Relation to rejected actor-oriented polarity:

- ARI: 0.0548
- NMI: 0.0426

Decision:

```text
mtaji invariant morphology k=2
= board-level provisional two-type set
= discovery-corpus result
= independent confirmation required
```

## Frozen discovery classifier

Accepted local artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

Candidate definition hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Frozen specification contains:

- exact 40-feature order
- log1p field set
- discovery StandardScaler mean / scale / variance
- K-means `k=2`, `n_init=50`, `random_state=20260809`
- exact 2×40 discovery centroids
- discovery training-state hash
- raw-label → canonical provisional ID mapping

Canonical mapping is fixed:

```text
raw 0 -> MTAJI-M1
raw 1 -> MTAJI-M2
```

The discovery-side canonicalization feature was `total.meanCapturableSeeds`; this rule is **not recomputed on held-out data**.

### Provisional aliases

```text
MTAJI-M1 = capture-engaged / relatively balanced morphology
MTAJI-M2 = capture-sparse / relatively asymmetric morphology
```

Aliases remain descriptive, not final ontology names.

The frozen classifier may not be refit, restandardized, or relabeled using Stage 2 data.

## Stage 2 formal preregistration

Preregistration ID:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
```

Machine spec:

```text
doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json
```

Formal corpus:

```text
192 games
20310001..20310192
6 conditions × 32 games
opening = seeded-uniform legal, 8 plies
maxPly = 100
```

The held-out seed block was defined before any Stage 2 game was generated or inspected.

### Population

```text
phase == mtaji
terminal == false
ply >= 8
global ruleStateKey dedup
cap <= 20 states per game
cap order = SHA-256(ruleStateKey) lexical
```

Technical minimum:

```text
contributing games >= 144
capped rows >= 1500
```

Technical failure -> `inconclusive`.

## Primary formal gates

All must pass:

### G1 type non-collapse

```text
minority frozen type fraction >= 0.20
```

### G2 frozen separation

```text
frozen-label silhouette >= 0.12
```

### G3 frozen-axis discreteness

```text
BIC(2) <= BIC(1) - 10
BIC(2) < BIC(3)
```

### G4 de-novo agreement

Held-out StandardScaler; fixed k=2 only; K-means / diagonal GMM / Ward.

```text
at least 2 of 3 ARIs >= 0.70
median ARI >= 0.70
```

### G5 trajectory-level robustness

100 deterministic 80%-game subsamples:

```text
p10 frozen-vs-de-novo-KMeans ARI >= 0.60
```

## Formal decision rule

```text
all technical gates + G1..G5 pass -> confirmed
technical gates pass + any G1..G5 fails -> not-confirmed
technical/integrity insufficiency -> inconclusive
```

No post-hoc rescue by:

- alternate k,
- alternate feature set,
- alternate preprocessing,
- refitting discovery scaler/centroids,
- changing canonical labels.

## Formal tooling

Generation:

```text
tools/experiments/run-position-typology-stage2-confirmation.js
```

Replay / provenance verification:

```text
tools/experiments/verify-position-typology-stage2-confirmation.js
```

Formal metrics / decision:

```text
tools/experiments/analyze-position-typology-stage2-mtaji-confirmation.py
```

Runbook:

```text
doc/position-typology/STAGE_2_MTAJI_CONFIRMATION_RUNBOOK.md
```

Formal run is local only. GitHub Actions is not authorized.

## Namua

Current decision remains:

```text
no discrete position-type candidate promoted
```

Do not force namua into the mtaji two-type set. Continuous progress / tactical-activity gradient follow-up is separate and remains unperformed.

## Next local action

Activate the existing research venv:

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

Update and check branch:

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only
git status --short
```

Syntax checks:

```bash
node --check tools/experiments/run-position-typology-stage2-confirmation.js
node --check tools/experiments/verify-position-typology-stage2-confirmation.js
python -m py_compile tools/experiments/analyze-position-typology-stage2-mtaji-confirmation.py
```

Formal generation:

```bash
node tools/experiments/run-position-typology-stage2-confirmation.js
```

Then full replay verification:

```bash
node tools/experiments/verify-position-typology-stage2-confirmation.js
```

Only after verification passes:

```bash
python tools/experiments/analyze-position-typology-stage2-mtaji-confirmation.py
```

Share only:

```text
artifacts/local/position-typology/stage2-mtaji-confirmation-v1/confirmation-result.json
```

## Important principles

- position type and playing style remain separate
- relational polarity is not an intrinsic type
- same-pilot robustness is not confirmation
- discovery classifier is frozen before held-out generation
- failed confirmation cannot be rescued post hoc
- `inconclusive` is technical only, not a synonym for failed metric gate
- no final ontology naming before formal confirmation
- Study 1 formal decisions remain unchanged
- held-out Stage 2 data have not yet been generated or inspected
