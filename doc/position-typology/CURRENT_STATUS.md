# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji independent confirmation complete / confirmed mtaji ontology names fixed / Stage 3 namua continuous-gradient tooling ready / playing-style analysis not yet started**

Branch: `research/position-typology-and-playing-style`

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
18. confirmed mtaji human-readable ontology naming
19. Stage 3 namua continuous-gradient audit design / tooling

現在の停止点は:

> **Stage 3 namua continuous-gradient auditのローカル実行前**

まだ実施していない:

- Stage 3 namua gradient audit execution / interpretation
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

このcoordinateは将来playing-style trajectory descriptorとして利用可能性があるが、position-type countには入れない。

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

## Final mtaji human-readable ontology names

Naming document:

```text
doc/position-typology/MTAJI_CONFIRMED_ONTOLOGY.md
```

Final names:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

Japanese descriptive rendering:

```text
MTAJI-M1 = 捕獲関与・低コントラスト型局面形態
MTAJI-M2 = 捕獲希薄・高コントラスト型局面形態
```

`Low-Contrast / High-Contrast` refers only to actor/opponent structural absolute differences in the frozen role-invariant representation.

It does not mean:

- equal/unequal player strength,
- win probability,
- actor advantage,
- playing style,
- AI implementation class.

The canonical IDs and classifier are unchanged by this naming decision.

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

Technical gates all passed.

Primary formal gates all passed:

```text
G1 minority frozen type fraction = 0.4481 >= 0.20
G2 frozen silhouette            = 0.1964 >= 0.12
G3 BIC(2) beats BIC(1) by       = 890.28; BIC(2) < BIC(3)
G4 de-novo median ARI           = 0.9167 >= 0.70
G5 80%-game subsample ARI p10   = 0.8931 >= 0.60
```

Formal decision:

```text
CONFIRMED
```

Confirmed claim:

> Within the preregistered Bao mtaji population and the frozen actor/opponent-invariant morphology representation, the Stage 1 two-type structural partition independently replicates.

No post-hoc rescue was used.

## Namua — retained negative discrete result

Current discrete-type decision remains:

```text
namua k=2 = not promoted
namua k=4 = not promoted
no discrete namua position-type candidate
```

Why:

- cross-method agreement was weak,
- preprocessing / representation sensitivity was substantial,
- k=2 methods cut very different partitions,
- k=4 separation remained weak,
- same-method resampling stability did not rescue cross-method disagreement.

Do not reopen k-search merely to obtain a positive discrete result.

## Stage 3 namua continuous-gradient audit

Tool:

```text
tools/experiments/analyze-position-typology-stage3-namua-gradients.py
```

Runbook:

```text
doc/position-typology/STAGE_3_NAMUA_GRADIENT_RUNBOOK.md
```

Checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-mtaji-ontology-naming-and-namua-gradient-start.md
```

### Purpose

Test whether namua is better described by continuous state coordinates rather than discrete types.

Primary interpretable coordinates:

1. `reserveDepletion`
   - negative z-score of total actor+opponent reserve
   - higher means less reserve remains
   - state-intrinsic progress proxy

2. `captureActivity`
   - composite of role-invariant total capture-move / capturable-seed / capture-event / forced-capture measures

3. `structuralContrast`
   - composite of role-invariant actor/opponent absolute differences across board / mobility / tactical primitives

### Geometry

Role-invariant representation:

```text
for each namua base field:
  total(actor, opponent)
  absDifference(actor, opponent)
```

Includes reserve and houseOwned in addition to the structural primitives used in mtaji work.

PCA is descriptive only; it cannot define a type in this audit.

Diagnostics:

- PC1–PC5 explained variance / loadings
- correlations with reserve depletion / capture activity / structural contrast
- ply correlation as descriptive-only
- 1D GMM / KDE density shape for main coordinates
- full-vs-capped principal subspace angles
- 80%-game resampling subspace stability ×40
- full-trajectory per-game monotonicity and consecutive deltas
- condition-group variance fraction

### Strict boundary

```text
discreteTypeSearchAuthorized = false
previousK2K4RescueAllowed = false
rawPlyUsedAsFeature = false
```

Stage 3 uses only the original Stage 1 exploratory corpus.

Stage 2 mtaji held-out rows are not reused for initial namua gradient discovery.

## Next local action

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/analyze-position-typology-stage3-namua-gradients.py
python tools/experiments/analyze-position-typology-stage3-namua-gradients.py
```

Expected output:

```text
artifacts/local/position-typology/stage3-namua-gradient-v1/namua-gradient-audit.json
```

Share only that JSON.

## Decision after Stage 3 audit

Possible outcomes:

### Continuous namua representation supported

If stable role-invariant axes align with interpretable state coordinates and density remains broadly continuous:

> represent namua by continuous coordinates rather than discrete position types.

### Mixed geometry

If a stable continuous axis coexists with independent strong multimodality:

> keep the continuous coordinate and separately justify any later discrete follow-up; do not retroactively rescue k=2/k=4.

### No compact representation

If low-dimensional subspaces are unstable or uninterpretable:

> record that this pilot supports neither a stable discrete namua typology nor a compact continuous namua representation.

## Playing-style boundary

Playing-style analysis has not started.

It may later use:

- confirmed MTAJI-M1/MTAJI-M2 occupancy,
- dwell durations,
- M1↔M2 transition patterns,
- mtaji relational polarity coordinate,
- namua continuous coordinates that survive Stage 3,
- other predeclared trajectory descriptors.

AI implementation/search/evaluator labels themselves are never playing styles.

## Important principles

- position type and playing style remain separate
- relational polarity remains a coordinate, not an intrinsic type
- confirmed mtaji classifier is immutable under the same study ID
- final human-readable naming does not alter the classifier
- namua negative discrete result is not post-hoc rescued
- same-pilot gradient analysis is exploratory, not confirmation
- no future namua confirmatory corpus is touched here
- Study 1 formal decisions remain unchanged
