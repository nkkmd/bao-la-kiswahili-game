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

Research-derived authoritative RAW identity contains `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`. Current `AI.stateKey` omits `pending` and is not authorized as a research-derived exact tablebase identity. Unvalidated symmetry/canonicalization is prohibited.

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

The 14-study Research Generation 1 core is frozen in `GENERATION_1_EVIDENCE_AUDIT.md`: Phase Transition; Position Typology / Playing Style; Namua→Mtaji Strategic Temporal Transition; Position Complexity / Difficulty; Tactical Motifs / Tesuji; Tactical Motif Human / Expert Validation; Position Evaluation / Win-Rate Calibration; Blunder / Misvaluation Patterns; Critical Positions / Outcome Branching; Restricted Endgame / Winning Regions; Symmetry / Isomorphic Positions; ORISC-STUDY1; State Space / Game Tree Complexity; PCEM-STUDY1.

### D12 — PBAI-A complete

Evidence-use tiers, prohibited inference, candidate trace and RAW identity boundary are frozen. Evidence readiness alone does not authorize implementation.

### D13 — `AI.stateKey` distinction is a constraint, not a current failure claim

The RAW-key mismatch prohibits silent reuse for research-derived exact tables. It does not by itself establish a defect in current public search.

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

Public endpoint + documented Cloudflare Pages source + repository source hashes are binding. Unknown provider-internal deployment IDs are not guessed.

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

Primary strength evidence uses paired shared openings, hard fixed D3, infinite time and seat swap. Frozen validation/holdout thresholds and opening-pair bootstrap rules remain those in `PBAI-C-GLOBAL-GATES-2026-08-26-v1`.

### D25 — Decision-quality non-regression

The reference is frozen D4 exact-full-window `bao`. Catastrophic-new-loss, severe-loss, TopSet and normalized-rank-loss thresholds remain frozen as specified in the global gate file.

### D26 — Correctness and operational floors

Correctness requires unchanged frozen `public/engine.js`, zero relevant regression failures/crashes/illegal states, no unvalidated canonicalization and no scientifically prohibited inference. Operational gates remain frozen.

### D27 — Frozen split and holdout firewall

Development, validation and release-holdout seed blocks are mutually non-overlapping and frozen. Release holdout execution requires fresh validation PASS, frozen candidate source/config hash and explicit PBAI-F authorization. Same-holdout retuning is prohibited.

### D28 — Feature-off comparator

Every candidate is feature-gated. Feature off must reproduce frozen `AI-GEN2`. Combined candidates require a new ID.

### D29 — Candidate-specific intended benefit is mandatory

Global non-regression alone does not adopt an improvement candidate. Exact mechanism, intended-benefit endpoint, minimum benefit, populations, cost and failure/rollback rules are frozen before candidate outcome.

### D30 — No compensation between major gate classes

Strength, decision quality, operational quality, correctness and robustness are conjunctive. Improvement in one class cannot offset hard failure in another.

### D31 — PBAI-C complete

Global gates and seed blocks are frozen. `KEEP-AI-GEN2` remains an acceptable program outcome.

## Candidate decisions — 2026-08-26

### D32 — PBAI-C002-v1 exact contract

C002 was prospectively authorized as `TM-S2-C03` move-ordering-only with feature `pbaiC002C03Ordering`, default off, `public/ai.js` only, and no extension/evaluation bonus/forced move/budget change/persistent cache. Scientific `TM-S2-C03 = CONFIRMED` remained unchanged.

### D33 — C002 population materialized before benefit metrics

Frozen development block `31300001..31300512` produced 256 selected population roots but only 5 eligible C002 targets against minimum 48. Candidate benefit metrics, validation and holdout were not accessed. Canonical run `32914807381`, job `98016194190`, artifact `9587768831`.

### D34 — C002 is NON-ESTIMABLE / HOLD

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
main/public change = 0
```

No same-version source-block, selector, trigger, ordering or threshold rescue is allowed. This does not alter `TM-S2-C03 = CONFIRMED`.

### D35 — C004 selected before implementation; support probe required first

C004 was selected because reproducible exact D2/D3 search instrumentation had materially broader expected support than the 8-state exact-oracle C003 domain. Position Complexity / Difficulty Study remains `INCONCLUSIVE`; no validated human/general difficulty classifier was inferred.

### D36 — C004 predevelopment support PASS

Frozen development block produced 54 exact D2/D3 TopSet-disjoint roots against minimum 48, with candidate code and benefit outcomes still unobserved. Canonical run `32917223072`, job `98023357050`, artifact `9588624025`, population digest `fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734`.

### D37 — C004 runtime-signal boundary separated prospectively

Primary benefit stratum was exact TopSet-disjoint; a 5-root overlap+canonical-best-change boundary stratum was safety/cost only; stable-best roots were negative controls. Boundary roots were never merged into primary benefit inference.

### D38 — PBAI-C004-v1 exact contract and development authorization

Feature `pbaiC004D23RootTtFirst`, public default off, `public/ai.js` only. At completed D2/D3 selected-root-move change, depths >=4 use TT preferred root move first; internal nodes remain baseline. Runtime exact TopSet, extra budget, eval/quiescence changes, forced move and persistent state were prohibited. Primary median-node gate `<=0.95` and fraction non-worse `>=0.55` were frozen before outcome.

### D39 — C004 premetric safety PASS before benefit inspection

Authorized public surface, engine binding, size budget, contracts, feature-off equivalence, regressions, seed firewall, trigger coverage, negative controls and D3 exactness all passed before D4 benefit inspection.

### D40 — C004 frozen D4 median intended-benefit gate FAIL

Canonical run `32918902388`, job `98028290217`, artifact `9589217604`. Median nodes candidate/baseline `1.000` exceeded frozen maximum `0.950`; fraction non-worse `46/54 = 0.8518518519` passed. All measured semantic/boundary/control safety gates passed. Descriptive pooled ratio could not rescue the failed primary endpoint.

### D41 — PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD

PR #58 closed without merge. Development authorization ended; validation/holdout/public adoption/AI-GEN3 remained unauthorized. Same-version rescue is prohibited. Position Complexity / Difficulty Study remains `INCONCLUSIVE`.

### D42 — C001 baseline-only support PASS and exact contract frozen before outcome

Primary scientific input remained Phase Transition Study 1 E-020/H18 (`CONFIRMED` within its fixed scope only). Engineering claims that legacy is stronger/better or that capture-branch-expansion improves winning were explicitly unauthorized.

Frozen development support:

```text
source = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
eligible Namua all-capture targets = 108
selected targets = 64
minimum estimable = 32
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
```

Feature `pbaiC001NamuaForcedCaptureLegacy` was frozen default-off for hard/expert only: an eligible nonterminal Namua root with >=2 legal variants, all captures, routes an otherwise enhanced-family root through the existing legacy branch. No extra budget/evaluation/quiescence/persistent state/forced move/new algorithm was allowed.

### D43 — C001 premetric safety PASS before D4 benefit inspection

Canonical premetric provenance:

```text
run = 32957250041
job = 98141544109
artifact = 9602505672
artifact ZIP SHA-256 = 861735a270202e4488283dad3470ccc61ff060f4877402086b6c4b9771a8346d
```

All 64 target roots triggered as frozen; feature-off matched frozen AI-GEN2; feature-on target routing matched the existing explicit legacy branch; 32 Mtaji and 20 Namua non-forced controls did not trigger and preserved behavior; easy/normal/MCTS/explicit-legacy semantics and relevant regressions passed. D4 benefit had not been observed before this PASS.

### D44 — C001 frozen 64-root D4 decision-quality conjunction FAIL

Canonical development provenance:

```text
development base main = 65a335b455bfb288931487747d633315f71d1d17
candidate branch head = f9767c575e512c1e0d41c2ad4dd1a7a9c302e29f
run = 32957738413
job = 98143061656
artifact = 9602744693
artifact ZIP SHA-256 = 82fdffb39c967e8bf02abf3080ab1651fcfa1c88f881d0028ce5af3493d45762
candidate public/ai.js SHA-256 = 108a57d17d0d0bf2f63e3794f386ee480116791181793ff6cde7366f7bd0a439
```

Frozen target result:

```text
TopSet agreement: 41/64 -> 42/64; delta +0.015625; required >= +0.05 => FAIL
mean normalized rank loss: 0.1648623511904762 -> 0.15314360119047618; delta -0.011718750000000028; required <= -0.02 => FAIL
severe loss: 2/64 -> 3/64; excess +0.015625; required <= 0 => FAIL
catastrophic new loss count = 0 => PASS
median search-work ratio = 0.2772631454984396 <= 1.50 => PASS
fraction roots with search-work ratio >2 = 0 <= 0.10 => PASS
trigger failures = 0 => PASS
```

The substantial efficiency gain cannot compensate for failed quality endpoints because the frozen candidate-specific acceptance rule is conjunctive.

### D45 — PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD; no same-version rescue

```text
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
development authorization = ENDED
same-version mechanism/trigger/population/threshold rescue = PROHIBITED
validation = NOT EXECUTED / NOT AUTHORIZED
release holdout = NOT EXECUTED / NOT AUTHORIZED
public adoption = NOT AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
PR #61 = CLOSED WITHOUT MERGE
main/public candidate implementation = 0
main public result = KEEP-AI-GEN2
```

This engineering result does not alter Phase Transition Study 1 E-020/H18 and does not establish a universal preference for or against legacy search. Any materially different mechanism requires a new prospective candidate/version and a new pre-outcome contract.

## Current authorization state

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
isolated development implementation attempts = 3
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

Future candidate selection, contract, development/validation outcome, holdout authorization, adoption/rejection and release/rollback decisions are appended here without changing earlier decisions. `KEEP-AI-GEN2` remains an acceptable program outcome.
