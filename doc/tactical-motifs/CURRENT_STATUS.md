# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## Current state

**ACTIVE — Stage 1 exploratory discovery is COMPLETE. Stage 2 formal candidate definitions, preregistration, runner/verifier/evaluator tooling, numerical hardening, and exact source-hash authorization are COMPLETE. The fresh 3,072-game Stage 2 formal corpus is AUTHORIZED / NOT YET GENERATED.**

Baseline `main` HEAD:

`08c70ba6ac980884d51562c207410db3521b8ae4`

Current branch:

`research/tactical-motif-discovery`

## Scientific state

- Stage 0 technical inspection: **COMPLETE / VALIDATED**
- Stage 1 exploratory discovery: **COMPLETE**
- Stage 1 promoted definitions: **8 / frozen**
- Stage 2 canonical formal candidates: **4 / FROZEN**
- Stage 2 formal spec: **FROZEN / VALIDATED**
- Stage 2 runner / independent verifier / evaluator: **IMPLEMENTED / VALIDATED**
- Stage 2 numerical hardening: **COMPLETE / VALIDATED BEFORE SCIENTIFIC GENERATION**
- Stage 2 source-hash authorization: **ACTIVE / VALIDATED**
- Stage 2 scientific corpus generation: **AUTHORIZED / NOT YET GENERATED**
- Stage 2 selection: **BLOCKED PENDING FULL REPLAY/SEARCH VERIFICATION**
- Stage 2 formal measurements: **NOT STARTED**
- Stage 2 formal evaluation: **NOT STARTED**
- `confirmed tesuji` claim: **NOT AUTHORIZED AT PRESENT**
- human/expert/traditional/pedagogical claim: **OUT OF SCOPE**

No Stage 2 scientific game, selected state, formal measurement, or formal result has yet been generated.

## Stage 1 frozen result

Stage ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

- Stage 1 spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- population: 768 games / seeds `21900001–21900768`
- unique historical trajectories: 741
- selected unique rule states: 715
- exact measured move records: 3,148
- discovery raw pattern instances: 3,116,520
- unique pattern keys: 323,676
- detailed candidates: 105,501
- candidates passing every frozen promotion gate: 948
- promoted Stage 2-planning definitions after frozen ranking/caps: 8
- discovery-result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`
- Stage 1 candidate-freeze file SHA-256: `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`

The eight definitions form four exact Stage 1 `supportIdentityHash` pairs. Stage 1 itself remains eight immutable exploratory definitions; no retrospective merge occurred.

## Stage 2 formal identity

Stage ID:

`TM-S2-FORMAL-2026-08-14-v1`

Candidate definition:

`doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json`

SHA-256:

`667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`

Formal spec:

`doc/tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json`

SHA-256:

`83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`

Authorization:

`doc/tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`

Authorization SHA-256:

`43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`

Human-readable formal protocol:

`doc/tactical-motifs/STAGE_2_FORMAL_PROTOCOL.md`

Execution runbook:

`doc/tactical-motifs/STAGE_2_EXECUTION_RUNBOOK.md`

## Four canonical formal candidates

Stage 2 prospectively chooses exactly one canonical definition per Stage 1 support-equivalence pair using the lowest Stage 1 promoted rank before fresh data:

- `TM-S2-C01` — Stage 1 rank 1; paired rank 2 diagnostic-only
- `TM-S2-C02` — Stage 1 rank 3; paired rank 4 diagnostic-only
- `TM-S2-C03` — Stage 1 rank 5; paired rank 6 diagnostic-only
- `TM-S2-C04` — Stage 1 rank 7; paired rank 8 diagnostic-only

The paired definition cannot replace, rescue, merge with, or supersede the canonical definition after Stage 2 data inspection.

## Fresh Stage 2 population

- games: 3,072
- fresh seeds: `22000001–22003072`
- six fixed generation strata × 512 games
- first 8 plies: seeded-uniform exact `E.moveVariants`
- max ply: 100
- no early stop
- no outcome-dependent extension
- no replacement sampling
- Stage 1 seeds/states/measurements cannot be formal Stage 2 observations

Generation strata remain trajectory-diversification metadata only; they do not reopen prior search/evaluator comparisons.

## Candidate-specific root and move selection

For each canonical candidate, fresh roots are eligible only from:

- the frozen candidate phase;
- the frozen canonical structural precondition;
- nonterminal states at ply >= 8;
- states with >=2 exact `E.moveVariants`;
- states where at least one exact legal move matches the canonical move abstraction.

Eligibility explicitly excludes the candidate consequence, D1/D2/D3 values, reply outcome, and game outcome.

One root per eligible unique historical trajectory is chosen by frozen candidate-specific SHA-256 rank. Unavailable candidate trajectories receive no replacement. Duplicate selected `ruleStateKey` values collapse within candidate with no replacement.

At a selected root, the formal candidate move is the lexicographically smallest matching `AI.moveKey`; search value and consequence cannot affect this choice.

## Formal endpoints and multiplicity

Each canonical candidate has two co-primary binary endpoints:

1. **Structural success:** the deterministic candidate move satisfies the frozen Stage 1 consequence predicate.
2. **Tactical-value success:** the deterministic candidate move belongs to the exact D3 top set among all legal root moveVariants under frozen `bao / phase2 / D3` instrumentation.

For each endpoint:

- H0: `p <= 0.50`
- H1: `p > 0.50`
- exact one-sided binomial
- observed rate must also be `>= 0.60`

All `4 candidates × 2 endpoints = 8` planned p-values are adjusted by Holm-Bonferroni at family-wise alpha `0.05`.

Consistency gates:

- D3 at-or-above-state-median rate `>= 0.60`
- D3 unique-worst rate `<= 0.15`

## Estimability / transferability gates

Per canonical candidate:

- unique historical trajectories `>= 96`
- unique rule states `>= 96`
- distinct opening prefixes `>= 48`
- maximum single opening-prefix share `<= 0.10`
- generation strata represented `>= 4`
- maximum single generation-stratum share `<= 0.50`

Failure yields `INCONCLUSIVE-NOT-ESTIMABLE`; the corpus is not extended.

## Formal decision states

Per candidate:

- `CONFIRMED`
- `NOT-CONFIRMED`
- `INCONCLUSIVE-NOT-ESTIMABLE`
- `TECHNICAL-INCONCLUSIVE`

Zero confirmed candidates is a valid study outcome.

## Numerical hardening and authorization chronology

Before any Stage 2 scientific generation, pre-generation audit identified potential floating-point underflow in a naive exact-binomial upper-tail calculation for large selected-root counts.

The Stage 2 authorization was explicitly suspended before changing scientific source. The calculation was replaced by log-combination + log-space recurrence + log-sum-exp accumulation. **No scientific design element changed:** candidates, fresh population, endpoints, thresholds, multiplicity, and decision rules remained fixed.

Validation chronology:

- design-freeze run `31784338545` = `success`
- initial tooling run `31784819713` = `success`, scientific games = 0
- hardened tooling run `31785214590`, job `94719501008` = `success`, 9 tests passed, scientific games = 0
- active authorization-binding run `31785382236`, job `94720016585` = `success`

The active authorization binds the exact hardened scientific source SHA-256 mapping. Any scientific source change invalidates generation until a new pre-generation validation/authorization boundary is created.

## Execution firewall

Required order:

1. `generate` — **NEXT / AUTHORIZED**
2. independent full replay/search `verify`
3. inspect manifest + verification
4. candidate-specific `select`
5. inspect selection identity / estimability preview
6. `measure`
7. inspect measurement integrity
8. formal `evaluate`

`select` is blocked unless `verification.json` has both `passed=true` and `fullSearchRecomputation=true`.

Large Stage 2 artifacts remain under:

`artifacts/local/tactical-motifs/stage2-formal-v1/`

GitHub Actions validate tooling but never generate the 3,072-game formal scientific corpus.

## No-rescue boundary

After Stage 2 scientific generation begins, forbidden actions include:

- seed extension;
- replacement sampling;
- replacement of unavailable candidate trajectories;
- replacement of duplicate rule states;
- canonical-candidate substitution;
- paired-definition promotion;
- candidate merge/split in response to fresh data;
- endpoint or threshold retuning;
- dropping planned tests from Holm adjustment;
- post-outcome depth selection;
- favorable subset selection;
- failed-candidate renaming.

A redesign requires a new prospective Stage 2 version and fresh non-overlapping seed block.

## Immutable interpretation boundary

A future `CONFIRMED` result can support only a **machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization**.

It does not establish traditional/expert recognition, human importance, beginner importance, pedagogical value, causal strategic benefit, or generalization beyond the frozen rules/engine/search instrument.

Prior Bao studies remain immutable and are not reopened by this Stage 2 design.

## Next action

Generate exactly the authorized 3,072-game fresh Stage 2 corpus in a stable local/Colab runtime, then run the independent full replay/search verifier.

**Do not execute candidate-specific selection until `manifest.json` and `verification.json` have been independently inspected and accepted.**
