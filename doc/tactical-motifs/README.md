# Tactical Motifs / Tesuji Study 1

## 研究題目

**Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証**

## 現在の状態

- baseline `main`: `08c70ba6ac980884d51562c207410db3521b8ae4`
- branch: `research/tactical-motif-discovery`
- Stage 0: **COMPLETE / VALIDATED**
- Stage 1 exploratory discovery: **COMPLETE**
- Stage 1 promoted definitions: **8 / frozen**
- Stage 2 canonical formal candidates: **4 / frozen**
- Stage 2 formal preregistration/tooling: **FROZEN / VALIDATED**
- Stage 2 numerical hardening: **COMPLETE / VALIDATED BEFORE SCIENTIFIC GENERATION**
- Stage 2 generation authorization: **ACTIVE / VALIDATED**
- Stage 2 formal corpus: **GENERATED / FULLY VERIFIED — 3,072 games**
- Stage 2 candidate-specific selection: **COMPLETE / ALL 4 ESTIMABILITY PREVIEWS PASS**
- Stage 2 formal measurement: **AUTHORIZED / NOT YET EXECUTED**
- Stage 2 formal evaluation: **BLOCKED PENDING MEASUREMENT-INTEGRITY ACCEPTANCE**
- `confirmed tesuji` claim: **NOT AUTHORIZED AT PRESENT**

## Stage 1 result

Stage 1 ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

Frozen Stage 1 spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

The completed exploratory pipeline used 768 fresh-seed games, selected 715 unique rule states, measured 3,148 exact legal move records, and enumerated 3,116,520 raw tactical-pattern instances. Of 105,501 detailed candidates, 948 passed all frozen promotion gates; deterministic ranking/caps selected eight Stage 2-planning definitions.

Stage 1 discovery artifact SHA-256:

`aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`

Compact candidate freeze SHA-256:

`f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`

The eight promoted definitions form four exact support-identity pairs. Stage 1 remains eight immutable exploratory definitions; no post-hoc merge occurred.

## Stage 2 formal design

Stage 2 ID:

`TM-S2-FORMAL-2026-08-14-v1`

Stage 2 prospectively froze one canonical formal definition per Stage 1 support-equivalence pair using the lowest Stage 1 promoted rank:

- `TM-S2-C01` = Stage 1 rank 1; rank 2 diagnostic-only
- `TM-S2-C02` = Stage 1 rank 3; rank 4 diagnostic-only
- `TM-S2-C03` = Stage 1 rank 5; rank 6 diagnostic-only
- `TM-S2-C04` = Stage 1 rank 7; rank 8 diagnostic-only

Candidate-definition SHA-256:

`667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`

Formal-spec SHA-256:

`83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`

Active hardened authorization SHA-256:

`43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`

Fresh formal population:

- 3,072 games
- seeds `22000001–22003072`
- six trajectory-generation strata × 512
- first 8 plies seeded-uniform exact `E.moveVariants`
- max ply 100
- no extension / no replacement
- no Stage 1 formal-observation reuse

Per candidate, Stage 2 has two frozen co-primary endpoints: structural-consequence success and exact D3 top-set membership. All eight planned p-values (`4 × 2`) are Holm-Bonferroni adjusted at FWER 0.05. Candidate-specific estimability/transferability gates were frozen before generation.

## Stage 2 corpus and verification

The fresh formal corpus was generated under the active authorization and independently fully replay/search verified.

```text
games = 3072
uniqueHistoricalTrajectories = 2736
distinctOpeningPrefixes = 2220
passed = true
fullSearchRecomputation = true
gamesVerified = 3072
```

Manifest summary hash:

`e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`

Verification identity hash:

`bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`

## Stage 2 candidate-specific selection

The frozen outcome/value/consequence-blind selection completed with `replacementPerformed=false` and `selectionIntegrityPassed=true`.

Selection hash:

`81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`

Selected formal roots:

| candidate | phase | selected unique states | opening prefixes | strata | estimability preview |
| --- | --- | ---: | ---: | ---: | --- |
| `TM-S2-C01` | Mtaji | 1597 | 1373 | 6 | PASS |
| `TM-S2-C02` | Namua | 2705 | 2192 | 6 | PASS |
| `TM-S2-C03` | Mtaji | 1272 | 1121 | 6 | PASS |
| `TM-S2-C04` | Namua | 1031 | 891 | 6 | PASS |

All four candidates pass all six frozen estimability / transferability preview gates. No candidate receives extra games, replacement roots, or paired-definition substitution.

## Pre-generation numerical hardening

Before any Stage 2 scientific game was generated, a numeric audit found potential underflow in a naive exact-binomial tail implementation at large `n`. Authorization was deliberately suspended, the calculation was replaced by a log-space/log-sum-exp method, and the tooling was revalidated.

No scientific design quantity changed. Candidate definitions, seed block, endpoints, thresholds, multiplicity, and decision rules remained fixed.

Hardened tooling run `31785214590` passed all 9 tests, including large-`n` stability and deterministic short full-replay smoke. Active authorization binding run `31785382236` also passed. Both occurred with 0 formal scientific games and 0 formal measurements.

## Boundaries

Prior Bao studies remain immutable. `capture-branch-expansion`, MTAJI morphology, N-ACT/N-CON, Position Complexity metrics, or joseki moves are not automatically tesuji labels.

A future Stage 2 `CONFIRMED` decision supports only a **machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization**.

It does not establish:

- traditional/expert-recognized tesuji;
- human or beginner importance;
- pedagogical value;
- causal strategic benefit;
- generalization to other rules, engines, evaluators, or search instruments.

## Key documents

- `CURRENT_STATUS.md`
- `RESEARCH_PLAN.md`
- `HYPOTHESES.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`
- `STAGE_0_TECHNICAL_AUDIT.md`
- `STAGE_1_EXPLORATORY_PROTOCOL.md`
- `STAGE_1_EXECUTION_RUNBOOK.md`
- `STAGE_1_EXPLORATORY_RESULT.md`
- `STAGE_1_CANDIDATE_FREEZE.json`
- `STAGE_2_FORMAL_PROTOCOL.md`
- `STAGE_2_EXECUTION_RUNBOOK.md`
- `checkpoints/2026-08-15-stage2-corpus-full-verification.md`
- `checkpoints/2026-08-15-stage2-selection-estimability-pass.md`
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`
- `preregistration/STAGE_2_FORMAL_CANDIDATES.json`
- `preregistration/STAGE_2_FORMAL_SPEC.json`
- `preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`

## Artifact policy

Large Stage 1 scientific artifacts remain under:

`artifacts/local/tactical-motifs/stage1-exploratory-v1/`

Large Stage 2 scientific artifacts remain under:

`artifacts/local/tactical-motifs/stage2-formal-v1/`

Scientific corpora and per-state/per-candidate measurement files are not generated in GitHub Actions and are not committed to Git.

## Next boundary

The next authorized operation is **Stage 2 formal measurement only**.

Required order remains:

`generate → verify → inspect → select → inspect → measure → inspect → evaluate`

Run `--phase measure`, then inspect `measurement-manifest.json`. Formal evaluation remains blocked until measurement integrity is accepted.
