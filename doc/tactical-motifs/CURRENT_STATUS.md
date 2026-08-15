# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-15

## Current state

**ACTIVE — Stage 1 exploratory discovery is COMPLETE. Stage 2 formal design/tooling/authorization are frozen and validated. The fresh 3,072-game formal corpus is GENERATED / FULLY VERIFIED, candidate-specific selection is COMPLETE with all four estimability previews passing, and formal measurement is now AUTHORIZED. Formal evaluation has not started.**

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
- Stage 2 runner / verifier / evaluator: **IMPLEMENTED / VALIDATED**
- Stage 2 numerical hardening: **COMPLETE / VALIDATED BEFORE SCIENTIFIC GENERATION**
- Stage 2 source-hash authorization: **ACTIVE / VALIDATED**
- Stage 2 scientific corpus generation: **COMPLETE — 3,072 games**
- Stage 2 independent full replay/search verification: **PASSED**
- Stage 2 candidate-specific selection: **COMPLETE / SELECTION INTEGRITY PASSED**
- Stage 2 estimability preview: **ALL 4 CANDIDATES PASS ALL 6 GATES**
- Stage 2 formal measurements: **AUTHORIZED / NOT YET EXECUTED**
- Stage 2 formal evaluation: **BLOCKED PENDING MEASUREMENT-INTEGRITY ACCEPTANCE**
- `confirmed tesuji` claim: **NOT AUTHORIZED AT PRESENT**
- human/expert/traditional/pedagogical claim: **OUT OF SCOPE**

No Stage 2 candidate consequence-success rate, D1/D2/D3 endpoint rate, p-value, Holm-adjusted result, or formal candidate decision has yet been accepted.

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

## Fresh Stage 2 corpus and verification

Generated exactly under the frozen contract:

- games: `3072`
- seeds: `22000001–22003072`
- six generation strata × `512`
- unique historical trajectories: `2736`
- distinct opening prefixes: `2220`
- manifest summary hash: `e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`
- source commit: `3082cd2132cdd572e43f5f78e8d662271a9ed492`
- source tree dirty: `false`

Independent verification:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 3072
verificationIdentityHash = bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d
```

Checkpoint:

`checkpoints/2026-08-15-stage2-corpus-full-verification.md`

## Candidate-specific selection result

Top-level selection identity:

- generated games: `3072`
- unique historical trajectories in corpus: `2736`
- candidate count: `4`
- replacement performed: `false`
- selection integrity passed: `true`
- selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`

Candidate selected sets:

| candidate | phase | eligible histories | duplicates collapsed | selected unique states | opening prefixes | max prefix share | strata | max stratum share | preview |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `TM-S2-C01` | Mtaji | 1607 | 10 | 1597 | 1373 | 0.003757 | 6 | 0.191609 | PASS |
| `TM-S2-C02` | Namua | 2712 | 7 | 2705 | 2192 | 0.002218 | 6 | 0.169686 | PASS |
| `TM-S2-C03` | Mtaji | 1282 | 10 | 1272 | 1121 | 0.003145 | 6 | 0.195755 | PASS |
| `TM-S2-C04` | Namua | 1097 | 66 | 1031 | 891 | 0.004850 | 6 | 0.215325 | PASS |

All per-candidate `replacementPerformed` flags are `false`.

Checkpoint:

`checkpoints/2026-08-15-stage2-selection-estimability-pass.md`

## Estimability / transferability gates

Frozen per-candidate gates are:

- selected unique historical trajectories `>= 96`
- selected unique rule states `>= 96`
- distinct opening prefixes `>= 48`
- maximum single opening-prefix share `<= 0.10`
- generation strata represented `>= 4`
- maximum single generation-stratum share `<= 0.50`

All six preview gates pass for all four candidates. The smallest selected set is C04 with 1,031 unique histories/states and 891 distinct opening prefixes; therefore no extension or replacement is needed or authorized.

The preview is not a replacement for the final frozen formal gate evaluation and cannot authorize corpus extension.

## Formal endpoints and multiplicity

Each candidate has two frozen co-primary binary endpoints:

1. frozen structural-consequence success;
2. exact D3 top-set membership.

Each uses H0 `p <= 0.50`, one-sided exact binomial, and required observed rate `>= 0.60`. All eight planned tests (`4×2`) are Holm-Bonferroni adjusted at family-wise alpha `0.05`.

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

Run formal measurement only:

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase measure \
  2>&1 | tee /tmp/tm-stage2-measure.log
```

Then inspect `artifacts/local/tactical-motifs/stage2-formal-v1/measurement-manifest.json` before executing `--phase evaluate`.
