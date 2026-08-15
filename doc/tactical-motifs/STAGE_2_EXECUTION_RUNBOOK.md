# Stage 2 Formal Execution Runbook — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## Purpose

This runbook executes the already frozen and source-hash-authorized Stage 2 formal study:

`TM-S2-FORMAL-2026-08-14-v1`

It is an execution guide only. It does not alter the preregistered candidate definitions, population, endpoints, thresholds, multiplicity, or decision rules.

## Required repository state

Use branch:

`research/tactical-motif-discovery`

Pull the latest branch before execution:

```bash
git checkout research/tactical-motif-discovery
git pull --ff-only
```

The scientific source tree must be clean. The Stage 2 runner checks the exact authorization-bound source hashes and refuses scientific phases if they differ.

Do not edit any authorization-bound scientific source file during the run.

## Output root

Large scientific artifacts remain local:

`artifacts/local/tactical-motifs/stage2-formal-v1/`

Do not commit the 3,072-game corpus or per-candidate measurement files to GitHub.

## Frozen Stage 2 identity

- Stage ID: `TM-S2-FORMAL-2026-08-14-v1`
- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- authorization SHA-256: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`
- games: 3,072
- seeds: `22000001–22003072`
- six strata × 512

## Authorized execution order

The order is mandatory:

`generate → verify → select → measure → evaluate`

Do not skip gates.

## 1. Status check

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase status
```

Before first scientific generation, expected scientific outputs are absent and `generatedGames` is 0.

## 2. Generate the fixed formal corpus

Run in a stable runtime:

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase generate \
  2>&1 | tee /tmp/tm-stage2-generate.log
```

Normal execution must not use `--force`.

The runner is resumable from already materialized correctly bound game files. If execution is interrupted, rerun the same command against the same output directory and exact source tree. Do not extend seeds or replace missing/duplicate trajectories.

Expected compact artifact after completion:

`artifacts/local/tactical-motifs/stage2-formal-v1/manifest.json`

## 3. Independent full replay/search verification

Immediately after generation:

```bash
node tools/experiments/verify-tactical-motif-stage2-formal.js \
  2>&1 | tee /tmp/tm-stage2-verify.log
```

The verifier independently replays all 3,072 fixed seeds from the initial state and recomputes every post-opening generation search statistic.

Required before selection:

- `passed=true`
- `fullSearchRecomputation=true`
- `gamesVerified=3072`
- manifest/spec/candidate/authorization bindings intact
- source tree clean

Expected compact artifact:

`artifacts/local/tactical-motifs/stage2-formal-v1/verification.json`

**Stop here and inspect `manifest.json` + `verification.json` before selection.**

## 4. Candidate-specific selection

Only after independent acceptance of the verification gate:

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase select
```

Expected compact artifact:

`artifacts/local/tactical-motifs/stage2-formal-v1/selection-audit.json`

The selection is candidate-specific, consequence-blind, value-blind, outcome-blind, hash-ranked, and no-replacement.

The audit includes a prospective estimability preview. A candidate that appears non-estimable is **not** rescued or supplemented. Measurement still follows the fixed selected set; final decision becomes `INCONCLUSIVE-NOT-ESTIMABLE` if the formal gates fail.

## 5. Formal measurement

After selection identity is inspected:

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase measure \
  2>&1 | tee /tmp/tm-stage2-measure.log
```

Expected compact artifact:

`artifacts/local/tactical-motifs/stage2-formal-v1/measurement-manifest.json`

Per-candidate measurement files remain local under:

`artifacts/local/tactical-motifs/stage2-formal-v1/measurements/<candidateId>/`

## 6. Formal evaluation

Only after measurement integrity is accepted:

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase evaluate \
  2>&1 | tee /tmp/tm-stage2-evaluate.log
```

Expected compact result:

`artifacts/local/tactical-motifs/stage2-formal-v1/stage2-formal-result.json`

Formal candidate decisions are exactly one of:

- `CONFIRMED`
- `NOT-CONFIRMED`
- `INCONCLUSIVE-NOT-ESTIMABLE`
- `TECHNICAL-INCONCLUSIVE`

Zero confirmed candidates is a valid outcome.

## No-rescue rules

After scientific generation begins, do not:

- extend the seed block;
- replace unavailable trajectories;
- replace duplicate rule states;
- substitute a paired Stage 1 definition;
- merge/split formal candidates based on fresh results;
- retune endpoints or thresholds;
- drop planned p-values from Holm adjustment;
- select a favorable search depth;
- choose a favorable subset;
- rename a failed result as a new candidate.

Any redesign requires a new prospective version and a fresh non-overlapping seed block.

## Upload / review policy

At each gate, upload compact audit artifacts rather than the large corpus.

Recommended sequence:

1. `manifest.json`
2. `verification.json`
3. after acceptance: `selection-audit.json`
4. after acceptance: `measurement-manifest.json`
5. after acceptance: `stage2-formal-result.json`

The large `games/` and `measurements/` trees should remain local unless a specific forensic identity problem requires a targeted file.
