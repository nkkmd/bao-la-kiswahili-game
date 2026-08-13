# Position Complexity / Difficulty Study — Stage 1 Exploratory Result

更新日: 2026-08-13  
Stage ID: `PCX-S1-EXPLORATORY-2026-08-12-v1`  
Status: **COMPLETE / EXPLORATORY DESIGN AUDIT / READINESS PASS / NOT CONFIRMATORY**

## Scientific boundary

This Stage 1 corpus was prospectively frozen for exploratory design development only.

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
formalDecision = null
Stage 2 authorization by this result alone = false
```

No p-value based confirmation is made from Stage 1. The observed directions and magnitudes below may be used only to freeze a separate prospective Stage 2 design with fresh seeds.

## Frozen identity

```text
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
verificationIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

Measurement provenance:

```text
sourceCommit = bf33e00d8bd3192d23df7105010eb355a8b6cbcf
sourceTreeDirty = false
Node = v24.6.0
platform = linux / x64
```

## Population and deterministic selection

Generation and verification:

```text
generated games = 768
games fully verified = 768
observations verified = 43,110
moves verified = 42,342
post-opening depth-2 searches recomputed = 36,211
fullSearchRecomputation = true
unique historical trajectories = 685
```

Frozen hash assignment produced:

```text
assigned Namua trajectories = 343
assigned Mtaji trajectories = 342
assigned-phase unavailable = 19
```

After the frozen one-state-per-trajectory selection and exact-rule-state collapse:

```text
selected before rule-state collapse = 666
duplicate selected rule states collapsed = 0
selected unique rule states = 666
Namua selected = 341
Mtaji selected = 325
```

Thus 666/685 = 97.23% of unique historical trajectories supplied an eligible assigned-phase state. The 19 unavailable trajectories were not replaced, as preregistered.

## Frozen readiness gates

All Stage 1 design-estimability gates passed:

```text
selected unique rule states >= 300      observed 666   PASS
Namua selected states >= 120            observed 341   PASS
Mtaji selected states >= 120            observed 325   PASS
D2->D3 instability events >= 30         observed 162   PASS
D2->D3 stable events >= 30              observed 504   PASS
ordinary-domain D2 margins >= 200        observed 510   PASS
```

Overall:

```text
readiness.passed = true
```

This authorizes prospective Stage 2 design work. It does not confirm H1 or H2.

## Prediction instability prevalence

Tie-aware exact TopSet disjointness:

```text
D1->D2: 205 / 666 = 30.78%
D2->D3: 162 / 666 = 24.32%
D3->D4: 170 / 666 = 25.53%
```

The provisional primary endpoint, D2->D3 instability, is therefore neither rare nor mechanically saturated in the frozen selected population.

## Decision ambiguity availability

At D2:

```text
exact ties = 70 / 666 = 10.51%
TopSet size median = 1
TopSet size p90 = 2
TopSet size max = 7
ordinary-domain best-second margins = 510
```

For ordinary-domain D2 best-second margins:

```text
n = 510
min = 0
p10 = 9
median = 91
mean = 155.76
p90 = 403.10
max = 1241
```

The margin has sufficient support and is strongly right-skewed. A prospective formal model should therefore transform the margin rather than assume linearity on the raw scale.

## Score-domain audit

D2 score domains:

```text
ordinary-evaluation-domain = 532
root-loss-mate-domain = 31
root-win-mate-domain = 103
```

Mate-domain states remain valid for the primary tie-aware D2->D3 instability endpoint, but raw best-second score gaps across mate and ordinary domains are not treated as a single homogeneous ambiguity scale.

The key ambiguity analysis should therefore use the preregistered ordinary-domain margin subset only.

## Search-workload distributions

```text
D2 nodes: n=666, median=67, mean=86.72, p90=183.5, max=374
D3 nodes: n=666, median=170.5, mean=225.52, p90=473.5, max=1332
D4 nodes: n=666, median=376, mean=545.97, p90=1237, max=4277
```

The fixed-depth node burden increases materially with depth, while remaining measurable without wall-clock timing.

## Exploratory descriptive associations — no p-values

These are hypothesis-freezing inputs only:

```text
legalMoveCount vs D2->D3 instability
  n = 666
  Pearson = +0.1446
  Spearman = +0.1476

ordinary D2 best-second gap vs D2->D3 instability
  n = 510
  Pearson = -0.2242
  Spearman = -0.2435

legalMoveCount vs log1p(D3 nodes)
  n = 666
  Pearson = +0.6267
  Spearman = +0.6555
```

Interpretation boundary:

- the first relation is directionally consistent with the provisional structural-branching hypothesis;
- the second is directionally consistent with smaller searched margins corresponding to greater instability;
- the third supports a distinction between structural branching and deterministic search workload while showing substantial association;
- none is confirmatory evidence;
- no Stage 1 p-value, threshold search or best-performing metric selection is authorized.

## Stage 1 conclusion

Stage 1 succeeded at its intended purpose:

1. the frozen state-selection scheme produced a large, phase-balanced, non-pseudoreplicated sample;
2. D2->D3 instability is estimable with both event classes well represented;
3. ordinary-domain D2 ambiguity margins are available in sufficient number;
4. exact ties are present but not dominant;
5. deterministic search workload spans a broad measurable range;
6. all preregistered readiness gates passed.

Therefore:

```text
Stage 1 = COMPLETE / CONSUMED
Stage 1 confirmatory reuse = PROHIBITED
Stage 2 design = AUTHORIZED TO BE FROZEN PROSPECTIVELY
Stage 2 corpus generation = NOT YET AUTHORIZED until separate formal spec/runbook/tool validation exist
```

No Stage 1 seed, selected position or measured outcome may be reused as independent Stage 2 confirmation evidence.
