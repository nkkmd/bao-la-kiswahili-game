# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-15

## Current state

**ACTIVE — Stage 1 exploratory discovery is COMPLETE. Stage 2 formal design/tooling/authorization are frozen and validated. The fresh 3,072-game formal corpus is GENERATED / FULLY VERIFIED, candidate-specific selection is COMPLETE with all four estimability previews passing, and formal measurement is COMPLETE with `measurementIntegrityPassed=true`. Formal evaluation is now AUTHORIZED / NOT YET ACCEPTED.**

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
- Stage 2 formal measurements: **COMPLETE — 6,605 / INTEGRITY PASSED**
- Stage 2 formal evaluation: **AUTHORIZED / NOT YET ACCEPTED**
- `confirmed tesuji` claim: **NOT AUTHORIZED AT PRESENT**
- human/expert/traditional/pedagogical claim: **OUT OF SCOPE**

No Stage 2 endpoint success rate, exact-binomial p-value, Holm-adjusted result, consistency-gate result, or formal candidate decision has yet been accepted into the scientific record.

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

- games: `3072`
- seeds: `22000001–22003072`
- six generation strata × `512`
- unique historical trajectories: `2736`
- distinct opening prefixes: `2220`
- manifest summary hash: `e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`
- generation source commit: `3082cd2132cdd572e43f5f78e8d662271a9ed492`
- generation source tree dirty: `false`

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

- replacement performed: `false`
- selection integrity passed: `true`
- selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`

| candidate | phase | selected unique states | opening prefixes | strata | estimability preview |
| --- | --- | ---: | ---: | ---: | --- |
| `TM-S2-C01` | Mtaji | 1597 | 1373 | 6 | PASS |
| `TM-S2-C02` | Namua | 2705 | 2192 | 6 | PASS |
| `TM-S2-C03` | Mtaji | 1272 | 1121 | 6 | PASS |
| `TM-S2-C04` | Namua | 1031 | 891 | 6 | PASS |

All six frozen estimability/transferability preview gates pass for all four candidates. No extension, replacement, or paired-definition substitution is authorized.

Checkpoint:

`checkpoints/2026-08-15-stage2-selection-estimability-pass.md`

## Formal measurement result

Measurement was performed on exactly the frozen selected sets:

| candidate | selected unique states | completed measurements | candidate measurement hash |
| --- | ---: | ---: | --- |
| `TM-S2-C01` | 1597 | 1597 | `3e66255a70116f37c75f6b299fd29faa7051595356e84ae9b94ca99ee63eb033` |
| `TM-S2-C02` | 2705 | 2705 | `07ed4a22a9617658a973549088c729017ddb6541e4b8b8f2c40628ab423ab3c9` |
| `TM-S2-C03` | 1272 | 1272 | `f9053e48840f3b6b72393f7fd560009b3d5f06c376319083786779ad3e63b1ba` |
| `TM-S2-C04` | 1031 | 1031 | `01928aee253c664add28a40a11cbb15ca4d57ea74452ccc68a7a20a1d4820caf` |

- total formal measurements: `6605`
- overall measurement hash: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- measurement integrity passed: `true`
- measurement source commit: `e6f5e9528d523e7710a953020b1719abf60a26e8`
- source tree dirty: `false`
- scientific source SHA-256 mapping: authorization-bound mapping retained

Checkpoint:

`checkpoints/2026-08-15-stage2-measurement-integrity-pass.md`

## Frozen formal evaluation

Each candidate has two co-primary binary endpoints:

1. frozen structural-consequence success;
2. exact D3 top-set membership.

Each endpoint uses:

- H0: `p <= 0.50`
- H1: `p > 0.50`
- exact one-sided binomial
- required observed rate `>= 0.60`

All eight planned tests (`4 candidates × 2 endpoints`) remain in the Holm-Bonferroni family at FWER `0.05`; no endpoint may be dropped.

Consistency gates remain:

- D3 at-or-above-state-median rate `>= 0.60`
- D3 unique-worst rate `<= 0.15`

Formal decisions remain exactly:

- `CONFIRMED`
- `NOT-CONFIRMED`
- `INCONCLUSIVE-NOT-ESTIMABLE`
- `TECHNICAL-INCONCLUSIVE`

Zero confirmed candidates remains a valid outcome.

## No-rescue boundary

Forbidden after Stage 2 generation began:

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

Run formal evaluation only:

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase evaluate \
  2>&1 | tee /tmp/tm-stage2-evaluate.log
```

Then inspect `artifacts/local/tactical-motifs/stage2-formal-v1/stage2-formal-result.json` before recording any formal scientific conclusion.
