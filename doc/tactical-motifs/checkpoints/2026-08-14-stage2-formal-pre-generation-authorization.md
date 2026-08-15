# Stage 2 Formal — Pre-generation authorization checkpoint

Date: 2026-08-14

## Status

Stage 2 formal design, scientific tooling, numerical hardening, and exact source-hash authorization are complete.

**Scientific Stage 2 generation is AUTHORIZED but has not yet been executed.**

No Stage 2 formal scientific game, selected state, formal measurement, or formal result existed at this checkpoint.

## Frozen identity

- Stage ID: `TM-S2-FORMAL-2026-08-14-v1`
- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- formal-spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- Stage 1 candidate-freeze SHA-256: `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`
- Stage 1 discovery-result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`

## Formal candidate unit

The eight immutable Stage 1 promoted definitions form four exact `supportIdentityHash` pairs.

Stage 2 prospectively fixes one canonical definition per pair using the lowest Stage 1 promoted rank before any fresh data:

- `TM-S2-C01` = Stage 1 rank 1; rank 2 diagnostic-only
- `TM-S2-C02` = Stage 1 rank 3; rank 4 diagnostic-only
- `TM-S2-C03` = Stage 1 rank 5; rank 6 diagnostic-only
- `TM-S2-C04` = Stage 1 rank 7; rank 8 diagnostic-only

No post-data substitution, merge, split, or paired-definition rescue is allowed.

## Fresh formal population

- 3,072 games
- fresh seeds `22000001–22003072`
- six trajectory-generation strata × 512 games
- first 8 plies seeded-uniform exact `E.moveVariants`
- max ply 100
- no early stop
- no outcome-dependent extension
- no replacement sampling
- no Stage 1 seed/state/measurement reuse as formal observations

## Formal endpoints

Per canonical candidate, two co-primary binary endpoints are frozen:

1. frozen structural consequence success;
2. canonical candidate move belongs to the exact D3 top set.

Each uses an exact one-sided binomial test against `p = 0.50` and additionally requires observed rate `>= 0.60`.

Across four candidates × two endpoints, all eight planned p-values are controlled by Holm-Bonferroni at family-wise alpha `0.05`.

Additional consistency gates:

- D3 at-or-above-state-median rate `>= 0.60`
- D3 unique-worst rate `<= 0.15`

## Per-candidate estimability / transferability gates

- unique historical trajectories `>= 96`
- unique rule states `>= 96`
- distinct opening prefixes `>= 48`
- maximum single opening-prefix share `<= 0.10`
- generation strata represented `>= 4`
- maximum single generation-stratum share `<= 0.50`

A failed gate yields `INCONCLUSIVE-NOT-ESTIMABLE`; corpus extension is forbidden.

## Execution firewall

Required order:

`generate → independent full replay/search verify → candidate-specific select → measure → formal evaluate`

Selection is forbidden before `verification.json` reports both:

- `passed=true`
- `fullSearchRecomputation=true`

Formal evaluation is forbidden before measurement integrity passes.

## Technical validation chronology

1. Stage 2 design-freeze validation run `31784338545` = success.
2. Initial tooling validation run `31784819713` = success, with zero scientific games generated.
3. Before any Stage 2 scientific generation, a numeric audit identified possible floating-point underflow in naive exact-binomial tail computation for large `n`.
4. Authorization was explicitly suspended before changing scientific source.
5. The binomial implementation was hardened using log-combination, log-space recurrence, and log-sum-exp accumulation. Candidate definitions, population, endpoints, thresholds, and multiplicity were unchanged.
6. Hardened tooling run `31785214590`, job `94719501008` = success; 9 tests passed, including large-`n` numeric stability and deterministic short technical replay verification. Formal games generated = 0.
7. Stage 2 authorization was reissued against the hardened source mapping.
8. Active-authorization binding run `31785382236`, job `94720016585` = success.

## Active authorization

Authorization file:

`doc/tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`

Authorization SHA-256:

`43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`

The authorization binds the exact current scientific source SHA-256 mapping, including the numerically hardened formal evaluator helper.

## Interpretation boundary

A future `CONFIRMED` decision may support only a machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization.

It does not establish traditional/expert recognition, human importance, beginner importance, pedagogical value, or generalization to other rules/engines/search instruments.

## Next action

Generate exactly the authorized 3,072-game fresh Stage 2 corpus in a stable local/Colab runtime and immediately perform independent full replay/search verification.

Do not execute candidate-specific selection before the verification artifacts have been independently inspected and accepted.
