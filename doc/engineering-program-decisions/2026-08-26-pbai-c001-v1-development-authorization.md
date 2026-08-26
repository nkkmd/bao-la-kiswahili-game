# PBAI-C001-v1 Development Authorization

Date: 2026-08-26  
Program: `PBAI-P1`  
Candidate: `PBAI-C001-v1`

## Decision

`PBAI-C001-v1` is **AUTHORIZED-FOR-DEVELOPMENT only after this exact-contract change is merged to `main`**.

The authorization is limited to one isolated development branch created from the resulting `main`. It does not authorize validation, release-holdout execution, public-default activation, deployment, or `AI-GEN3` promotion.

## Scientific boundary

Primary Research Generation 1 input is Phase Transition Study 1, specifically E-020 / H18:

```text
formal decision = CONFIRMED
scope = hard / bao / depth3 only
observed direction = legacy produced more capture-branch-expansion events than phase2
```

This does **not** establish that legacy search is stronger, chooses better moves, improves win rate, or is globally preferable. Capture-branch-expansion is not assumed to be beneficial for winning. The production trigger below is a new engineering hypothesis and does not copy the scientific CBE classifier.

## Predevelopment support

The support rule was frozen before candidate implementation or candidate outcome inspection. Baseline-only execution produced:

```text
run = 32952267253
job = 98126097111
artifact = 9600601764
artifact ZIP SHA-256 = b240f1d8ffd0e3e6022db2524d1bbc1204489098def079c7c96a20dcc41a99ce
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
eligible targets = 108
minimum estimable = 32
selected development targets = 64
support = PASS
candidate implementation observed = false
candidate benefit metrics observed = false
validation / holdout accessed = false
```

## Frozen mechanism

```text
feature flag = pbaiC001NamuaForcedCaptureLegacy
public default = false
allowed public code surface = public/ai.js only
levels = hard / expert
```

Eligibility is current-root-only:

```text
phase = namua
terminal = false
legal moveVariants >= 2
all legal moveVariants type = capture
baseline search family would otherwise be enhanced alpha-beta
```

When feature ON and eligible, that root `analyzeMove` call uses the already-existing legacy iterative-deepening alpha-beta branch. Explicit `mcts` remains MCTS; an explicitly requested `legacy` profile remains legacy. Easy/normal are unaffected.

Not authorized:

```text
new search algorithm
extra depth/time budget
evaluation profile/weight change
quiescence parameter change
persistent cache/table
forced move
scientific CBE classifier lookup
trajectory-history/future-outcome trigger
engine/config/worker/UI change
```

## Frozen development benefit gate

On the frozen 64 target roots, compare feature ON candidate vs feature OFF AI-GEN2 at:

```text
hard / bao / maxDepth=3 / timeLimitMs=Infinity
```

against the independent frozen D4 exact-full-window reference.

Required:

```text
TopSet agreement delta candidate-baseline >= +0.05
mean normalized rank-loss delta candidate-baseline <= -0.02
severe-loss-rate excess <= 0
catastrophic new losses = 0
median search-work ratio <= 1.50
fraction roots with search-work ratio >2 <= 0.10
```

Search work is `stats.nodes + stats.quiescenceNodes`.

Mtaji and Namua-non-forced controls must not trigger and must preserve feature-off move, rootScore, and completedDepth.

## No-rescue / firewall

```text
same-version mechanism retuning = prohibited
same-version trigger retuning = prohibited
same-version population retuning = prohibited
same-version threshold retuning = prohibited
validation = NOT AUTHORIZED until development PASS
release holdout = NOT AUTHORIZED
public default activation = NOT AUTHORIZED
AI-GEN3 = RESERVED / NOT AUTHORIZED
```

If development fails or is non-estimable, `PBAI-C001-v1` becomes HOLD/REJECT under the frozen rule and its implementation must not merge to public `main`.
