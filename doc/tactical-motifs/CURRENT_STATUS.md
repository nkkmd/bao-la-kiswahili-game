# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-15

## Current state

**ACTIVE — Stage 1 exploratory discovery is COMPLETE. Stage 2 formal design/tooling/authorization are frozen and validated. The fresh 3,072-game Stage 2 formal corpus has been GENERATED and independently FULLY VERIFIED. Candidate-specific selection is now AUTHORIZED; formal measurement and evaluation have not started.**

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
- Stage 2 scientific corpus generation: **COMPLETE — 3,072 games**
- Stage 2 independent full replay/search verification: **PASSED**
- Stage 2 candidate-specific selection: **AUTHORIZED / NOT YET EXECUTED**
- Stage 2 formal measurements: **NOT STARTED**
- Stage 2 formal evaluation: **NOT STARTED**
- `confirmed tesuji` claim: **NOT AUTHORIZED AT PRESENT**
- human/expert/traditional/pedagogical claim: **OUT OF SCOPE**

No Stage 2 candidate consequence, formal endpoint success rate, p-value, or formal decision has yet been inspected.

## Stage 1 frozen result

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

- Stage 1 spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- population: 768 games / seeds `21900001–21900768`
- selected unique rule states: 715
- exact measured move records: 3,148
- detailed candidates: 105,501
- candidates passing every frozen promotion gate: 948
- promoted Stage 2-planning definitions after frozen ranking/caps: 8
- discovery-result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`
- candidate-freeze SHA-256: `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`

The eight Stage 1 definitions remain immutable exploratory definitions and form four exact `supportIdentityHash` pairs.

## Stage 2 formal identity

Stage ID: `TM-S2-FORMAL-2026-08-14-v1`

- candidate definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- formal spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- active authorization SHA-256: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`

Canonical formal candidates are Stage 1 ranks `1,3,5,7`; paired ranks `2,4,6,8` remain diagnostic-only and cannot replace or rescue canonical candidates.

## Fresh Stage 2 corpus

Generated exactly under the frozen contract:

- games: `3072`
- seeds: `22000001–22003072`
- six generation strata × `512`
- first 8 plies: seeded-uniform exact `E.moveVariants`
- max ply: 100
- early stop: false
- outcome-dependent extension: false
- replacement sampling: false
- Stage 1 formal-observation reuse: false

Observed corpus identity:

- unique historical trajectories: `2736`
- duplicate historical-trajectory groups: `239`
- largest duplicate group: `7`
- distinct opening prefixes: `2220`
- manifest summary hash: `e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`
- source commit: `3082cd2132cdd572e43f5f78e8d662271a9ed492`
- source tree dirty: `false`

Condition counts are exactly:

```text
B-D1  = 512
B-D2  = 512
B-D3  = 512
LS-D2 = 512
V2-D2 = 512
LE-D2 = 512
```

## Independent verification

The independent verifier completed full fixed-seed replay and generation-search recomputation:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 3072
```

Verification identity:

- unique historical trajectories: `2736`
- distinct opening prefixes: `2220`
- verification identity hash: `bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`
- source commit: `3082cd2132cdd572e43f5f78e8d662271a9ed492`
- source tree dirty: `false`

Manifest and verifier agree on trajectory count, opening-prefix count, six stratum counts, source commit, clean-tree status, and the full scientific source SHA-256 mapping.

Checkpoint:

`checkpoints/2026-08-15-stage2-corpus-full-verification.md`

## Candidate-specific selection rule

Selection is now authorized under the already-frozen rule. For each canonical candidate:

- eligibility uses only candidate phase, canonical structural precondition, nonterminal/ply/legal-move requirements, and canonical move-abstraction availability;
- eligibility excludes consequence, D1/D2/D3 value, reply outcome, and game outcome;
- identical historical trajectories collapse before candidate-specific root selection;
- at most one root per unique historical trajectory per candidate is chosen by the frozen SHA-256 ranking;
- duplicate selected `ruleStateKey` values collapse within candidate;
- unavailable trajectories and duplicate rule states receive no replacement;
- cross-candidate trajectory/rule-state reuse remains allowed exactly as preregistered.

## Estimability / transferability gates

Per canonical candidate:

- selected unique historical trajectories `>= 96`
- selected unique rule states `>= 96`
- distinct opening prefixes `>= 48`
- maximum single opening-prefix share `<= 0.10`
- generation strata represented `>= 4`
- maximum single generation-stratum share `<= 0.50`

A failure yields `INCONCLUSIVE-NOT-ESTIMABLE`; no corpus extension or replacement is allowed.

## Formal endpoints and multiplicity

After selection and measurement, each candidate has two co-primary binary endpoints:

1. frozen structural-consequence success;
2. exact D3 top-set membership.

Each uses H0 `p <= 0.50`, one-sided exact binomial, required observed rate `>= 0.60`. All eight planned tests (`4×2`) are Holm-Bonferroni adjusted at family-wise alpha `0.05`.

Consistency gates remain:

- D3 at-or-above-state-median rate `>= 0.60`
- D3 unique-worst rate `<= 0.15`

## No-rescue boundary

Now that Stage 2 scientific generation has begun, the following remain forbidden:

- seed extension or replacement sampling;
- replacement of unavailable trajectories or duplicate rule states;
- candidate substitution or paired-definition promotion;
- candidate merge/split in response to fresh data;
- threshold/endpoint retuning;
- dropping planned tests from Holm adjustment;
- post-outcome depth selection;
- favorable subset selection;
- failed-candidate renaming.

A redesign requires a new prospective version and fresh non-overlapping seed block.

## Interpretation boundary

A future `CONFIRMED` candidate can support only a **machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization**. It does not establish traditional/expert recognition, human importance, pedagogical value, causal strategic benefit, or generalization beyond the frozen rules/engine/search instrument.

## Next action

Run candidate-specific selection only:

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase select
```

Then inspect `artifacts/local/tactical-motifs/stage2-formal-v1/selection-audit.json` before executing `--phase measure`.
