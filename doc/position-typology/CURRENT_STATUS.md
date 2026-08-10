# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 1 mtaji invariant morphology audit complete / provisional board-level two-type set promoted / candidate-definition freeze tooling ready / namua no discrete candidate / no formal confirmation authorized**

Branch: `research/position-typology-and-playing-style`

主要文書:

- [`STAGE_1_EXPLORATORY_PROTOCOL.md`](STAGE_1_EXPLORATORY_PROTOCOL.md)
- [`STAGE_1_PILOT_RESULT.md`](STAGE_1_PILOT_RESULT.md)
- [`STAGE_1_FEATURE_AUDIT_RESULT.md`](STAGE_1_FEATURE_AUDIT_RESULT.md)
- [`STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md`](STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md)
- [`STAGE_1_STABILITY_AUDIT_RESULT.md`](STAGE_1_STABILITY_AUDIT_RESULT.md)
- [`STAGE_1_POLARITY_AUDIT_RESULT.md`](STAGE_1_POLARITY_AUDIT_RESULT.md)
- [`STAGE_1_INVARIANT_MORPHOLOGY_RESULT.md`](STAGE_1_INVARIANT_MORPHOLOGY_RESULT.md)
- [`STAGE_1_MTAJI_CANDIDATE_FREEZE_RUNBOOK.md`](STAGE_1_MTAJI_CANDIDATE_FREEZE_RUNBOOK.md)

## 現在地

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

完了済み:

1. Stage 0 instrumentation / corpus / symmetry audit
2. 96-game Stage 1 exploratory pilot
3. replay / provenance / eligible-population audit
4. feature redundancy / distribution audit
5. S-pruned clustering diagnostic k=2..10
6. candidate stability / representation audit
7. representative / boundary position extraction
8. mtaji actor-oriented polarity audit
9. relational k=2をtwo position typesとして棄却
10. actor/opponent-invariant morphology k=2発見
11. invariant morphology stability / persistence / density audit
12. mtaji invariant k=2をboard-level provisional two-type setへ昇格
13. exact candidate-definition export tooling + runbook

現在の停止点は **mtaji candidate-definition freeze artifactのローカル実行前**。

まだ実施していない:

- candidate-definition artifact export / inspection
- independent confirmation preregistration
- held-out seed block definition
- held-out corpus generation
- formal confirmation
- final ontology naming
- namua gradient-specific follow-up
- playing-style analysis
- Study 1 cross-study analysis

Stage 1はexploratoryでありpreregistrationではない。

## Study 1との固定境界

局面相転移点Study 1はclosed。

過去のformal decisions、`capture-branch-expansion` classifier / vocabulary、forced-capture regime、`sustained-forcing window`解釈境界、trajectory-ply sensitivityの位置づけを変更しない。

Study 1 formal corpusはinitial typology discoveryへ入れない。

## Primary Stage 1 discovery population

```text
terminal == false
ply >= 8
```

- eligible unique rule states: 4,834
- namua: 3,339
- mtaji: 1,495
- seat-canonical collapse: 0
- states shared across trajectories: 0

Primary clustering sensitivity used deterministic game×phase capping at maximum20 positions / game × phase.

## Rejected mtaji relational k=2 interpretation

Actor-oriented S-pruned mtaji k=2 was highly stable, but polarity audit showed:

- actor/opponent role swap cluster flip rate: 0.8175
- original projection vs negative swapped projection correlation: 0.9063
- consecutive mtaji cluster flip rate: 0.9011 while player-to-move always flips
- KDE major-peak valley ratio: 0.9699

Decision:

```text
actor-oriented mtaji k=2
= continuous relational polarity coordinate
!= two intrinsic position types
```

This coordinate may later be useful for trajectory / playing-style analysis, but is not counted as a position-type set.

## Mtaji actor/opponent-invariant morphology result

Artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/invariant-morphology-audit-v1/mtaji-invariant-morphology-audit.json
```

Audit hash:

`7a2cea55a48f8d5566f95ff5a08f8966a146e6add262d742724a3bcfd573d2c3`

Boundary:

- `formalExperiment: false`
- `exploratory: true`
- `finalClusterCountSelected: false`
- `positionTypesNamed: false`
- future held-out seeds untouched

### Representation

For each mtaji state, actor/opponent direction is removed using:

```text
total(actor, opponent)
absDifference(actor, opponent)
```

across 20 primitive fields, including forced-capture morphology, for 40 dimensions total.

Predeclared skewed non-negative fields receive log1p before construction; the resulting features are standardized.

Numerical role-swap check:

```text
maximum absolute matrix difference = 0.0
```

### k=2 method agreement

Capped population: 1,222 rows.

- K-means vs diagonal GMM ARI: 0.9197
- K-means vs Ward ARI: 0.9134
- diagonal GMM vs Ward ARI: 0.9935

Silhouette is approximately 0.196 for all three methods.

Cluster proportions are approximately 57:43.

Condition NMI is approximately 0.024–0.027.

### Full vs capped stability

- K-means ARI: 0.9514
- diagonal GMM ARI: 1.0000
- Ward ARI: 0.9869

### Trajectory-level resampling

80% games × 40 repetitions:

K-means:

- min ARI: 0.9387
- p10: 0.9572
- median: 0.9902
- p90: 1.0000

Diagonal GMM:

- min: 0.9967
- median: 1.0000

This is same-pilot robustness, not independent replication.

### Discreteness

Invariant centroid-axis BIC:

- 1 component: 6213.06
- 2 components: 5786.86
- 3 components: 5796.42

KDE:

- peak count: 2
- peaks near -2.186 and +2.981
- valley / lower-peak density ratio: 0.4305

Unlike the rejected polarity coordinate, the invariant axis contains a substantial density valley and a two-component description is preferred to both one and three components by BIC.

### Not a simple scalar split

ARI with candidate k=2:

- activityMagnitude only: 0.0236
- imbalanceMagnitude only: 0.1837

Therefore the partition is not reducible to simple high/low activity or high/low actor-opponent imbalance.

### Independence from relational polarity

- ARI: 0.0548
- NMI: 0.0426

The invariant candidate and relational-polarity coordinate are largely distinct structures.

### Trajectory persistence

Across 1,406 consecutive mtaji pairs:

- same-cluster rate: 0.6309
- flip rate: 0.3691
- run length median: 1
- p75: 3
- p90: 5.3
- max: 22

Thus it behaves as a state morphology that can persist for multiple plies but can also transition within a game.

## Current mtaji decision

The exploratory evidence now supports:

```text
mtaji invariant morphology k=2
= board-level provisional two-type set
= discovery-corpus result only
= requires independent confirmation
```

This is the first Stage 1 structure promoted to a provisional discrete position-type set.

It is **not yet a final Bao ontology** and is not formally confirmed.

## Provisional descriptive aliases

Current profile effects permit descriptive aliases for candidate-definition purposes only.

### MTAJI-M1

```text
capture-engaged / relatively balanced morphology
```

Typical discovery-side profile:

- higher total forced-capture availability
- higher total capturable seeds
- higher total capture-event counts
- higher capture-move counts
- higher total front occupancy
- smaller actor/opponent absolute differences on several capture/front-row measures

### MTAJI-M2

```text
capture-sparse / relatively asymmetric morphology
```

Typical profile is approximately the reverse.

These are provisional descriptive aliases, not final names.

They are not:

- playing styles,
- evaluator/search labels,
- win/loss classes,
- actor advantage labels.

## Candidate-definition freeze tooling

Implemented:

```text
tools/experiments/export-position-typology-stage1-mtaji-candidate.py
```

Runbook:

```text
doc/position-typology/STAGE_1_MTAJI_CANDIDATE_FREEZE_RUNBOOK.md
```

The exporter records exactly:

- discovery population and deterministic cap policy
- training rule-state-key hash
- 40-feature order
- log1p field set
- StandardScaler mean / scale / variance
- K-means `k=2`, `n_init=50`, `random_state=20260809`
- standardized discovery centroids
- deterministic raw-label → canonical provisional ID mapping
- source hashes
- interpretation boundaries

Canonical provisional mapping:

```text
cluster with larger transformed total.meanCapturableSeeds -> MTAJI-M1
other cluster -> MTAJI-M2
```

This prevents arbitrary K-means numeric label IDs from becoming semantic names.

## Namua

Current decision remains:

```text
no discrete position-type candidate promoted
```

The pilot suggests continuous progress / tactical-activity gradients may be more appropriate. This will be analyzed separately and will not be forced into the mtaji two-type ontology.

## Next local action

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/export-position-typology-stage1-mtaji-candidate.py
python tools/experiments/export-position-typology-stage1-mtaji-candidate.py
```

Expected artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

Share only that JSON.

## After candidate-definition inspection

Only after the candidate-definition artifact is inspected and accepted should the study:

1. freeze the exact discovery classifier specification,
2. write a separate confirmation preregistration,
3. define the held-out seed block and execution policy,
4. generate the independent corpus,
5. apply the frozen classifier without refitting,
6. run a separately preregistered de-novo replication check,
7. decide confirmation / non-confirmation under preregistered thresholds.

No held-out seeds have been touched yet.

## Important principles

- position type and playing style remain separate
- relational polarity is not an intrinsic type
- robust clustering is not automatically an ontology
- same-pilot stability is not confirmation
- discovery definitions must be frozen before held-out inspection
- no post-hoc rescue after confirmation starts
- Study 1 formal decisions remain unchanged
- future held-out seed block remains untouched until preregistration
