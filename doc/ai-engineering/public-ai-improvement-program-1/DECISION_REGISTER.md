# PBAI-P1 Decision Register

This register records engineering decisions for `PBAI-P1`. Research formal decisions remain governed by the research-track documents and are never changed by this register.

## Program establishment — 2026-08-26

### D01 — Separate engineering track

PBAI-P1 is independent from the Research Track. Engineering success/failure cannot relabel a scientific result.

### D02 — Scientific evidence cutoff

```text
Research Generation 1 evidence anchor = 2db7c4d65771066e914f32cbc4116fcc3e9e386a
Research Generation 2 outcomes = excluded from PBAI-P1
```

### D03 — No implementation at establishment

Candidate implementation is prohibited until evidence audit, exact baseline and global gates are frozen.

### D04 — Research labels remain intact

`CONFIRMED`, `NOT-CONFIRMED`, `INCONCLUSIVE`, `NON-ESTIMABLE`, exact/bounded and exploratory/descriptive labels are not rewritten for engineering convenience.

### D05 — No unvalidated win-probability semantics

Position Evaluation / Win-Rate Calibration Study 1 is formal `INCONCLUSIVE`; no score→validated-win-probability mapping is authorized.

### D06 — RAW identity boundary

Research-derived authoritative RAW identity contains:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Current `AI.stateKey` omits `pending` and is not authorized as a research-derived exact tablebase identity. Unvalidated symmetry/canonicalization is prohibited.

### D07 — Human claims remain separate

Machine search complexity, reply concentration, instability or error dependence may not be described as human difficulty/error/deception without separate evidence.

### D08 — Ablation before combination

Candidates are single-mechanism by default. Combined mechanisms require a new candidate ID and component ablation first.

### D09 — Holdout protection

Release holdout may not be used for tuning. If a holdout is consumed, replacement requires a newly prospective block.

### D10 — Release safety dominates strength

Correctness, invalid-state, crash and major operational failures cannot be offset by strength or efficiency gains.

## PBAI-A — Research Generation 1 evidence audit

### D11 — Canonical evidence core

The 14-study core is frozen as documented in `GENERATION_1_EVIDENCE_AUDIT.md`:

```text
Phase Transition Study 1
Position Typology / Playing Style Study 1
Namua→Mtaji Strategic Temporal Transition Study 1
Position Complexity / Difficulty Study 1
Tactical Motifs / Tesuji Study 1
Tactical Motif Human / Expert Validation Study 1
Position Evaluation / Win-Rate Calibration Study 1
Blunder / Misvaluation Patterns Study 1
Critical Positions / Outcome Branching Study 1
Restricted Endgame / Winning Regions Study 1
Symmetry / Isomorphic Positions Study 1
ORISC-STUDY1
State Space / Game Tree Complexity Study 1
PCEM-STUDY1
```

### D12 — PBAI-A complete

Evidence use tiers, prohibited inference, candidate trace and RAW identity boundary are frozen. Evidence readiness alone does not authorize implementation.

### D13 — `AI.stateKey` distinction is a constraint, not a current failure claim

The RAW-key mismatch prohibits silent reuse for research-derived exact tables. It does not by itself establish a defect in the current public search.

### D14 — PBAI-B next

The exact current public baseline must be frozen before numeric candidate gates.

### D15 — AI-GEN3 naming rule

`AI-GEN3` is granted only after explicit `ADOPT` plus actual public-default deployment. Development authorization, validation pass or release-candidate status is insufficient.

## PBAI-B — exact AI-GEN2 baseline

### D16 — Baseline identity

```text
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
lineage = AI-GEN2
source commit = f4ae3b11901180cbe417b3e643e2b357d8045d2d
public directory = public/
```

### D17 — Public deployment binding boundary

Public endpoint + documented Cloudflare Pages source + repository source hashes are the binding. Unknown provider-internal deployment IDs are not guessed.

### D18 — Current config overrides stale prose

Current baseline hard/expert configuration is authoritative:

```text
hard:   low D6/400ms; standard D8/500ms; high D10/600ms
expert: low D10/1500ms; standard D12/2000ms; high D14/3000ms
adaptive public default = false
```

### D19 — Baseline search semantics

```text
default evaluation = bao
hard/expert = enhanced alpha-beta iterative deepening
quiescenceDepth = 1
TT max entries = 50,000
evaluation cache hard/expert = enabled / max 2,048
PWA cache = bao-la-kiswahili-v24
```

### D20 — Fixed-depth and time-limited evidence remain separate

Deterministic fixed-depth verification and time-limited operational smoke are separate evidence classes.

### D21 — PWA/cache identity is release safety

Any adopted public asset change must satisfy the PBAI-C cache-version and rollback contract.

### D22 — PBAI-B complete

The exact `AI-GEN2` comparator is frozen; candidate implementation remains unauthorized until PBAI-C is frozen.

## PBAI-C — global pre-outcome gates

### D23 — Global gate-spec identity

```text
gateSpecId = PBAI-C-GLOBAL-GATES-2026-08-26-v1
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
gate-freeze source main = 0887551fd2e67c6e90c5171465b3354f9042adc4
candidate implementations observed before freeze = 0
candidate outcomes observed before freeze = 0
Research Generation 2 evidence included = false
```

### D24 — Playing-strength non-inferiority

Primary strength evidence uses paired shared openings, hard fixed D3, infinite time, seat swap. Validation/holdout require:

```text
core observed score >= 0.50
one-sided 95% opening-pair bootstrap LCB >= 0.47
each core phase >= 0.48
each seat >= 0.47
each challenge stratum >= 0.45
```

Locked validation+holdout requires core `>=0.50`, LCB `>=0.48`, each core phase `>=0.49`, each seat `>=0.48`. Bootstrap unit = opening pair; 20,000 replicates; seed `31999991`.

### D25 — Decision-quality non-regression

Frozen D4 exact-full-window `bao` reference. Validation/holdout require:

```text
catastrophic new loss count = 0
severe-loss excess <= +0.01
top-set agreement delta >= -0.02
mean normalized rank-loss delta <= +0.02
per-phase severe-loss excess <= +0.02
per-phase top-set agreement delta >= -0.03
```

Locked validation+holdout tightens severe-loss excess to `+0.005`, top-set delta to `-0.01`, normalized rank-loss delta to `+0.01`.

### D26 — Correctness and operational floors

Correctness:

```text
frozen public/engine.js SHA unchanged
existing tactical failures = 0
candidate regression failures = 0
required relevant test failures = 0
crash / illegal move / invalid state = 0
unvalidated canonicalization = prohibited
scientifically prohibited inference in implementation/UI = prohibited
```

Operational:

```text
median elapsed ratio <= 1.05
p95 elapsed ratio <= 1.10
median completed-depth delta >= -1
fraction roots >=2 depths below baseline <= 0.05
timeout-rate increase <= +0.05
direct/Worker deterministic mismatch = 0
added public static assets <= 524,288 bytes
```

Persistent new tables/caches require a new prospective memory gate before implementation.

### D27 — Frozen split and holdout firewall

Development, validation and release-holdout seed blocks are mutually non-overlapping and frozen. Release holdout execution requires fresh validation PASS, frozen candidate source/config hash and explicit PBAI-F authorization. Same-holdout retuning is prohibited.

### D28 — Feature-off comparator

Every candidate is feature-gated. Feature off must reproduce frozen `AI-GEN2`. Combined candidates require a new ID.

### D29 — Candidate-specific intended benefit is mandatory

Global non-regression alone does not adopt an improvement candidate. Exact mechanism, intended-benefit endpoint, minimum benefit, populations, cost and failure/rollback rules are frozen before candidate outcome.

### D30 — No compensation between major gate classes

Strength, decision quality, operational quality, correctness and robustness are conjunctive. Improvement in one class cannot offset hard failure in another.

### D31 — PBAI-C complete

Global gates and seed blocks are frozen. Normal program outcome may still be `KEEP-AI-GEN2`.

## Candidate decisions — 2026-08-26

### D32 — PBAI-C002-v1 exact contract

C002 was prospectively authorized as `TM-S2-C03` move-ordering-only:

```text
feature = pbaiC002C03Ordering
default = off
public surface = public/ai.js only
no extension / evaluation bonus / forced move / budget change / persistent cache
```

Scientific `TM-S2-C03 = CONFIRMED` and its interpretation boundary were preserved.

### D33 — C002 population materialized before benefit metrics

After isolated safety tests, only frozen development block `31300001..31300512` was materialized:

```text
population = 256
eligible target roots = 5
minimum estimable = 48
candidate benefit metrics observed = false
validation seeds accessed = false
release holdout seeds accessed = false
```

Canonical run `32914807381`, job `98016194190`, artifact `9587768831`, population digest `e016daa0f4669ac7730d34725de16d8c1ff10c398ca07867f47e81df0b399ea7`.

### D34 — C002 is NON-ESTIMABLE / HOLD

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
main/public change = 0
```

No same-version source-block, selector, trigger, ordering or threshold rescue. This does not alter `TM-S2-C03 = CONFIRMED` and is not evidence of C03 ineffectiveness.

### D35 — C004 selected before implementation; support probe required first

Among remaining evidence-audit-ready candidates, C004 was selected for the next cycle because a reproducible exact D2/D3 search instrument had materially broader expected support than the 8-state exact-oracle C003 domain. Position Complexity Study remains `INCONCLUSIVE`; no validated difficulty/complexity classifier exists.

To avoid repeating C002's post-implementation non-estimability, a baseline-only support probe was prospectively frozen before C004 candidate code.

### D36 — C004 predevelopment support PASS

Frozen development block `31300001..31300512` produced:

```text
population = 128 Namua + 128 Mtaji = 256
exact D2/D3 TopSet-disjoint = 54
minimum estimable = 48
Namua primary support = 42
Mtaji primary support = 12
candidate code used = false
candidate benefit metrics observed = false
validation/holdout seeds accessed = false
```

Canonical provenance:

```text
run = 32917223072
job = 98023357050
artifact = 9588624025
artifact ZIP SHA-256 = 5012c904789dff9dc9ec4144d2987afcf59ae7e8d7c712ffe1ca76f2e8f23b2e
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
```

Decision: `SUPPORT-PASS-ELIGIBLE-FOR-EXACT-CANDIDATE-CONTRACT-FREEZE`. This is engineering estimability evidence only.

### D37 — Runtime-signal boundary is separated prospectively

The intended production-native trigger is deterministic D2→D3 selected-root-move change, not exact TopSet computation. The baseline-only probe found:

```text
exact TopSets overlap but deterministic canonical best changes = 5
exact TopSets overlap and deterministic canonical best stays unchanged = 197
```

Therefore:

```text
primary benefit stratum = exact TopSet-disjoint
boundary-trigger stratum = overlap + deterministic best change; safety/cost only
negative control = deterministic best unchanged; trigger zero + exact equivalence
```

Boundary roots are never merged into primary benefit inference.

### D38 — PBAI-C004-v1 exact contract and development authorization

After support PASS and still before candidate implementation/outcome, freeze:

```text
candidate = PBAI-C004-v1
feature = pbaiC004D23RootTtFirst
public default = off
public source surface = public/ai.js only
activation = completed D2 and D3; deterministic selected root move changes
mechanism = depths >=4 root TT preferred move becomes TT-first
internal nodes = baseline
```

Prohibited:

```text
runtime exact TopSet computation
scientific difficulty/complexity classifier
extra depth/time
evaluation/quiescence change
persistent cache/table
forced move
engine/config/worker/UI change
```

Primary D4 intended-benefit gate:

```text
development/validation median nodes(on/off) <= 0.95
fraction candidate nodes <= baseline >= 0.55
release holdout median <= 0.97; fraction >= 0.52
root-score mismatch = 0
selected move outside frozen D4 top set = 0
catastrophic new loss = 0
```

Boundary aggregate node ratio must be `<=1.10` with exact semantic safety and no benefit claim. Negative controls require zero trigger and exact feature-on/off search-counter equality.

Development is authorized only after the exact-contract PR is merged. Validation requires development benefit/safety PASS. Release holdout remains not authorized. Post-outcome trigger/order/target/boundary/threshold retuning under v1 is prohibited.

## Current authorization state

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = true after exact-contract merge
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 1 after merge
active candidate implementations = 0
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

Future development/validation outcome, holdout authorization, adoption/rejection and release/rollback decisions are appended here without changing earlier decisions.
