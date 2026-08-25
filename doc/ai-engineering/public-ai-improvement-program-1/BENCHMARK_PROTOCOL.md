# PBAI-P1 Engineering Benchmark Protocol

Status: **FROZEN / PBAI-C GLOBAL NUMERIC GATES COMPLETE**  
Program: `PBAI-P1`  
Gate spec: **`PBAI-C-GLOBAL-GATES-2026-08-26-v1`**  
Baseline: **`AI-GEN2-BASELINE-2026-08-26-v1`**

Canonical machine-readable gate specification:

- `benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`

既存の[`../../AI_BENCHMARK.md`](../../AI_BENCHMARK.md)を下位測定基盤として再利用する。ただしhistorical thresholdを結果後に流用するのではなく、PBAI-P1の採否規則は本Protocolとcanonical gate specを正とする。

## 1. Freeze timing and firewall

PBAI-C freeze時点:

```text
PBAI-A = COMPLETE
PBAI-B = COMPLETE
AI-GEN2 baseline = AI-GEN2-BASELINE-2026-08-26-v1
candidate implementations = 0
candidate outcomes observed = 0
AUTHORIZED-FOR-DEVELOPMENT = 0
Research Generation 2 evidence included = false
```

したがって以下のnumeric gates、seed blocks、holdout rulesはcandidate outcomeを見る前に固定される。

PBAI-Cのglobal gateは後続candidate固有ruleによって**緩和できない**。Candidate-specific ruleはglobal gateへ追加条件を課すためのものである。

## 2. Benchmark axes

### A. Playing strength

Primary relative-strength evidenceはdeterministic fixed-depth paired comparisonとする。

```text
level = hard
maxDepth = 3
timeLimitMs = Infinity
maxTurns = 160
```

1つのseeded openingにつき2局を実行し、candidate/baselineのSouth/Northを交換する。

Score:

```text
win = 1
draw / administrative unresolved = 0.5
loss = 0
pairScore = candidate points across the two games / 2
```

Administrative max-turn unresolvedはengineering point score上0.5とするだけで、Baoのscientific draw claimには使用しない。

### B. Decision quality

Fresh selected rootsに対し、frozen `AI-GEN2` baseline processからD4 exact-full-window root-candidate referenceを作る。

```text
reference semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
reference evaluator = bao
reference depth = 4
reference quiescenceDepth = 1
reference time limit = Infinity
```

Candidate code自身にreferenceを再定義させない。

測定:

- D4 top-set agreement;
- normalized reference rank loss;
- severe-loss frequency;
- catastrophic new loss;
- phase-stratified deltas.

これらはgame-theoretic optimalityまたはvalidated win probabilityとは呼ばない。

### C. Robustness

Core strength strata:

```text
Namua: openingPhase=namua / openingPlies=8
Mtaji: openingPhase=mtaji / openingPlies=4
```

Challenge strata:

```text
Namua early: openingPlies=4
Namua late: openingPlies=12
Mtaji entry: openingPlies=0 after Mtaji entry
Mtaji later: openingPlies=8 after Mtaji entry
```

Decision-quality populationもNamua/Mtajiを50/50 targetとする。

Candidate-specific evidenceにmorphology、C03、exact-oracle、instability trigger等が必要な場合はPBAI-D authorization時に追加target/control strataをfreezeする。

### D. Operational quality

Candidateとbaselineを同一root・同一hostで比較し、rootごとにAB/BA execution orderを交互にする。

Primary public-budget operational condition:

```text
standard hard = D8 / 500ms
```

Expert subset:

```text
standard expert = D12 / 2000ms
```

記録:

- elapsed time distribution;
- timeout;
- completed depth;
- node / qnode count;
- crash / exception;
- illegal move / invalid state;
- direct/Worker deterministic agreement;
- added public static asset size;
- memory where mechanism adds persistent tables/caches and measurement is prospectively defined.

### E. Correctness / regression

Hard gate:

- frozen `public/engine.js` SHA-256 remains unchanged inside an AI candidate;
- relevant existing tests all pass;
- existing tactical suite has zero failures;
- candidate-specific regression fixtures have zero failures;
- invalid state / illegal move / crash = zero;
- unvalidated symmetry/canonicalization = prohibited;
- Research Generation 1 RAW identity boundary = preserved;
- scientific prohibited inference may not be introduced into AI logic/UI claims.

If a change requires `public/engine.js`, it leaves the AI-candidate comparison and must be handled as separate rules/engine work before a new baseline is defined.

## 3. Data split and frozen seed blocks

### 3.1 Core playing-strength blocks

Development is tunable and is not release evidence.

```text
development
  Namua pairs: 31000001..31000128 = 128 pairs / 256 games
  Mtaji pairs: 31001001..31001128 = 128 pairs / 256 games
```

Fresh validation:

```text
validation
  Namua pairs: 31100001..31100256 = 256 pairs / 512 games
  Mtaji pairs: 31101001..31101256 = 256 pairs / 512 games
```

Release holdout:

```text
release holdout
  Namua pairs: 31200001..31200512 = 512 pairs / 1024 games
  Mtaji pairs: 31201001..31201512 = 512 pairs / 1024 games
```

### 3.2 Robustness challenge blocks

Validation:

```text
31102001..31102064  Namua / 4 plies   64 pairs
31103001..31103064  Namua / 12 plies  64 pairs
31104001..31104064  Mtaji / 0 plies   64 pairs
31105001..31105064  Mtaji / 8 plies   64 pairs
```

Release holdout:

```text
31202001..31202128  Namua / 4 plies   128 pairs
31203001..31203128  Namua / 12 plies  128 pairs
31204001..31204128  Mtaji / 0 plies   128 pairs
31205001..31205128  Mtaji / 8 plies   128 pairs
```

### 3.3 Decision-quality source blocks

```text
development source = 31300001..31300512 / target 256 roots
validation source  = 31400001..31401024 / target 512 roots
release source     = 31500001..31502048 / target 1024 roots
```

Root requirements:

- legal move count >=2;
- 50% Namua / 50% Mtaji target;
- unique authoritative RAW state;
- unique historical trajectory;
- outcome/value/consequence-blind deterministic selection;
- no replacement after outcome inspection.

### 3.4 Operational source blocks

```text
development source = 31600001..31600256 / target 128 roots
validation source  = 31700001..31700512 / target 256 roots
release source     = 31800001..31801024 / target 512 roots
```

Expert operational subset sizes:

```text
validation = 64 roots
release holdout = 128 roots
```

### 3.5 Holdout firewall

- release holdoutをcandidate tuningへ使用しない。
- PBAI-C時点ではrelease holdout executionは**NOT-AUTHORIZED**。
- holdout実行には、validation PASS後のcandidate source/config hash freezeとexplicit PBAI-F authorizationが必要。
- holdoutを見てmechanism/thresholdを変更し、同じholdoutで再判定しない。
- holdout failure後に変更する場合はnew candidate/versionとprospectively frozen future holdout blockが必要。

Seed番号が公開されていることはexecution authorizationを意味しない。

## 4. Playing-strength statistical rule

Opening pairをresampling unitにするdeterministic nonparametric bootstrapを使用する。

```text
bootstrap replicates = 20,000
analysis seed = 31999991
one-sided 95% lower bound = bootstrap mean pair scoreの5th percentile
```

### Validation gate

Core pooled:

```text
observed candidate score >= 0.50
one-sided 95% LCB >= 0.47
```

Local safety:

```text
each core phase observed score >= 0.48
each seat observed score >= 0.47
each challenge stratum observed score >= 0.45
```

### Release-holdout gate

同じthresholdをfresh holdoutに独立適用する。

### Locked validation + holdout final gate

Candidate tuningを終了したvalidationと未使用holdoutを固定candidateに対してpoolする最終support check:

```text
core observed score >= 0.50
one-sided 95% LCB >= 0.48
each core phase observed score >= 0.49
each seat observed score >= 0.48
```

この設計は、sample上candidateがbaselineより弱い状態をpublic adoptionへ通さず、sampling uncertainty上も大きな劣化を制限する。

## 5. Decision-quality numeric gates

Normalized rank loss:

```text
(reference scoreRank - 1) / max(1, legalMoveCount - 1)
```

Severe loss:

```text
D4 reference上unique worst
OR
candidate selected moveがroot-loss-mate-domainで、D4 bestはroot-loss-mate-domainではない
```

Catastrophic new loss:

> baselineではsevereでないrootにおいてcandidateだけがsevereとなり、candidate moveがimmediate terminal lossまたはroot-loss-mate-domainで、referenceにnon-loss moveが存在するもの。

### Validation and holdout — each independently

```text
catastrophic new loss count = 0
severe-loss rate(candidate - baseline) <= +0.01
top-set agreement delta >= -0.02
mean normalized rank-loss delta <= +0.02
per-phase severe-loss excess <= +0.02
per-phase top-set agreement delta >= -0.03
```

### Locked validation + holdout

```text
catastrophic new loss count = 0
severe-loss excess <= +0.005
top-set agreement delta >= -0.01
mean normalized rank-loss delta <= +0.01
```

Candidate-specific intended-benefit gate may require positive improvement beyond these non-regression floors。

## 6. Operational numeric gates

Validation and holdout each require:

```text
crash / unhandled exception = 0
illegal move = 0
invalid-state generation = 0
median elapsed(candidate / baseline) <= 1.05
p95 elapsed(candidate / baseline) <= 1.10
median completed-depth delta >= -1
fraction with candidate depth >=2 below baseline <= 0.05
timeout-rate increase <= +0.05
direct/Worker deterministic mismatch = 0
added public static candidate assets <= 524,288 bytes
```

A mechanism introducing persistent tables/caches must additionally freeze a memory gate before development. Missing memory measurement does not permit a post-outcome exception for such a candidate。

Operational comparison is same-root/same-host relative measurement. PBAI-BのGitHub-runner absolute milliseconds are descriptive baseline context, not these acceptance thresholds。

## 7. Tactical / correctness hard gates

A candidate is `REJECT` or `HOLD` regardless of strength if any required hard gate fails:

```text
public/engine.js SHA-256 != frozen baseline engine hash
existing tactical regression failures > 0
candidate-specific regression failures > 0
required relevant test failures > 0
crash / illegal move / invalid state > 0
unapproved RAW identity / canonicalization change
scientifically prohibited inference introduced in implementation or public claim
```

Frozen baseline engine SHA-256:

```text
e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
```

Strength improvement cannot compensate for these failures。

## 8. PWA / public-release safety

Baseline Service Worker cache:

```text
bao-la-kiswahili-v24
```

If an RC changes any pre-cached public asset:

- Service Worker cache version must change from baseline;
- rollback target must be recorded;
- the cache/deployment change must be included in the RC **before** release holdout;
- holdout must test the actual RC source/config hash intended for public deployment。

Public asset deployment後にholdout未検証codeを追加しない。

## 9. Candidate isolation requirement

Every PBAI candidate implementation must be behind an explicit mechanism flag/configuration such that:

```text
feature off = baseline comparator
feature on  = one PBAI candidate
```

Before adoption the public default remains feature off。

Feature-off path must reproduce frozen baseline behavior on mandatory deterministic baseline fixtures. This allows candidate-vs-baseline comparisons within one instrumented development build without silently redefining baseline semantics。

Multiple mechanisms require a new combined candidate ID. Component ablations precede combination。

## 10. Candidate-specific acceptance rule floor

Before a candidate moves to `AUTHORIZED-FOR-DEVELOPMENT`, its registry entry must freeze:

```text
exact mechanism / feature flag
affected subsystem
primary intended-benefit endpoint
minimum practical benefit
target/control strata
candidate-local dev/validation/holdout seeds or fixtures
runtime/memory budget if applicable
failure handling
rollback
```

Global PBAI-C gates above cannot be relaxed candidate-by-candidate。

A normal improvement candidate must pass at least one prospectively declared intended-benefit endpoint. Merely being non-inferior is not sufficient for adoption。

A candidate may instead be prospectively classified as a **correctness/semantics-only maintenance candidate**. In that case its intended benefit may be correctness/semantic sanitation rather than playing-strength gain, but it must still pass all applicable global non-regression gates and exact decision-equivalence rules frozen in its candidate contract。

## 11. Development / validation / release decision sequence

```text
PBAI-D exact candidate contract + development authorization
  ↓
PBAI-E development / tuning block
  ↓
freeze candidate source/config hash
  ↓
PBAI-F fresh validation
  ↓
validation PASS required
  ↓
explicit release-holdout authorization
  ↓
assemble PBAI-P1-RCxx including PWA/cache release changes
  ↓
release holdout
  ↓
PBAI-G correctness + operational final gate
  ↓
explicit ADOPT / REJECT / HOLD
  ↓
public deployment if ADOPT
  ↓
AI-GEN3 promotion only after public-default adoption
```

## 12. Release decision conjunction

Public adoption requires **all** applicable conditions:

```text
correctness hard gates = PASS
playing-strength global gate = PASS
decision-quality gate = PASS
required robustness strata = PASS
operational gate = PASS
candidate-specific intended-benefit gate = PASS
validation = PASS
release holdout = PASS
rollback = READY
explicit engineering decision = ADOPT
```

No axis may compensate for a hard failure on another axis。

If no candidate satisfies the conjunction:

```text
KEEP-AI-GEN2
```

is the correct PBAI-P1 engineering result。

## 13. Scientific interpretation boundary

Engineering benchmark success does not confirm the Research Generation 1 hypothesis that inspired a candidate。

Correct recording:

> A candidate inspired by completed Research Generation 1 evidence passed the prospectively frozen PBAI-P1 engineering gates。

Incorrect recording:

> The underlying scientific hypothesis was confirmed because the AI became stronger。

Research Generation 2 results remain outside PBAI-P1。
