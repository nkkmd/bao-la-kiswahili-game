# RESEARCH_LOG — Tactical Motifs / Tesuji Study 1

## 2026-08-14 — Study initialization / Stage 0

- Verified baseline `main` HEAD `08c70ba6ac980884d51562c207410db3521b8ae4`.
- Restored immutable boundaries from Phase Transition, Position Typology / Playing Style, Namua→Mtaji, Position Complexity, and Joseki studies.
- Fixed joseki / tesuji separation and prohibited relabeling prior constructs as tesuji.
- Audited exact `E.moveVariants`, `AI.moveKey`, historical/rule/canonical identities, validated seat symmetry, structural features, engine events, and exact D1/D2/D3 search instrumentation.
- Confirmed no search-consistent principal variation is exposed by current tooling.
- Created branch `research/tactical-motif-discovery`.
- Stage 0 initialization commit: `de4931fb20c218c0d4b3d13689cf79af400e89bd`.
- Stage 0 validation commit: `c3e14ea9bdf7c6a92ec57b0413af925e9c8e70d1`.
- Actions run `31768708597` = `success`.

## 2026-08-14 — Stage 1 prospective contract freeze

- Froze Stage ID `TM-S1-EXPLORATORY-2026-08-14-v1`.
- Froze 768 games, seeds `21900001–21900768`, max ply 100, six generation strata ×128, seeded-uniform first 8 plies, no extension, no replacement.
- Froze historical trajectory as support unit, deterministic hash-assigned phase/root selection, duplicate rule-state collapse, all-legal-move measurement, all-reply response envelope, D1/D2/D3 instrumentation, candidate grammar, promotion gates, ranking/caps, and no-rescue rules.
- Spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`.
- Freeze commit: `62fbf68cf12a3539b46dcdcd4487a0a9ea7debba`.
- Validation run `31770343371` = `success`.

## 2026-08-14 — Stage 1 tooling / authorization

- Implemented corpus runner, independent full replay/search verifier, deterministic selection, measurement, and discovery phases.
- Implementation commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`.
- Validation run `31770629848`, job `94675639391` = `success`.
- Issued source-hash-bound Stage 1 authorization only after validation.
- Authorization SHA-256: `9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`.

## 2026-08-14 — Execution-environment recovery boundary

- Initial disposable assistant runtime was lost before a complete corpus was retained.
- No scientific outcome was inspected and no seed, threshold, population, candidate grammar, or formal boundary changed.
- No partial corpus was promoted and no replacement occurred.
- Recovery/runbook commit: `6694714194eee2f536e90b4411566d9126e162ae`.

## 2026-08-14 — Stage 1 generation / full verification

- Generated exactly 768 games from the frozen seeds.
- Unique historical trajectories: `741`.
- Duplicate trajectory groups: `27`; largest group `2`.
- Distinct opening prefixes: `681`.
- Manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`.
- Independent verification: `passed=true`, `fullSearchRecomputation=true`, `gamesVerified=768`.
- Verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`.

## 2026-08-14 — Stage 1 deterministic selection / measurement

- 25 unique historical trajectories lacked an eligible root in their hash-assigned phase and received no replacement.
- Selected before rule-state collapse: `716`.
- One duplicate selected rule state collapsed.
- Selected unique rule states: `715` = Namua `370` / Mtaji `345`.
- Distinct selected opening prefixes: `659`.
- Selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`.
- All frozen readiness gates passed.
- Measured all exact legal moveVariants at all 715 roots.
- Exact move records: `3148`.
- Measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`.

## 2026-08-14 — Stage 1 exploratory discovery completion

- Raw pattern instances: `3,116,520`.
- Unique pattern keys: `323,676`.
- Detailed candidates: `105,501`.
- Low-support patterns: `218,175`.
- `948` candidates passed every frozen promotion gate.
- Independently reproduced frozen ranking/caps and the exact eight promoted candidate keys.
- Promoted definitions formed four exact support-identity pairs: ranks `1–2`, `3–4`, `5–6`, `7–8`.
- No candidate was merged, renamed, or manually promoted.
- Discovery artifact SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`.
- Candidate-freeze SHA-256: `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`.
- Stage 1 = **COMPLETE**.

## 2026-08-14 — Stage 2 prospective candidate/family freeze

- Fixed Stage ID `TM-S2-FORMAL-2026-08-14-v1` before fresh Stage 2 data existed.
- Preserved all eight Stage 1 definitions.
- Frozen canonical rule: lowest Stage 1 promoted rank within each exact supportIdentityHash pair.
- Canonical ranks: `1,3,5,7`; paired ranks `2,4,6,8` diagnostic-only.
- Candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`.

## 2026-08-14 — Stage 2 formal contract freeze

- Froze 3,072 fresh games, seeds `22000001–22003072`, six strata ×512, first 8 plies seeded-uniform exact moveVariants, max ply 100, no extension, no replacement.
- Froze candidate-specific consequence/value/outcome-blind root eligibility and deterministic hash-ranked selection.
- Froze canonical move representative as lexicographically smallest matching exact `AI.moveKey`.
- Froze co-primary endpoints: structural consequence success + exact D3 top-set membership.
- Froze exact one-sided binomial H0 `p<=0.50`, minimum observed rate `0.60`, D3 consistency gates, six estimability gates, and eight-test Holm-Bonferroni FWER `0.05`.
- Formal spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`.
- Design validation run `31784338545` = `success`.

## 2026-08-14 — Stage 2 tooling / pre-generation numerical hardening

- Implemented Stage 2 runner, independent verifier, evaluator, validator, and tests.
- Pre-generation numeric audit found naive exact-binomial tail accumulation could underflow at large `n`.
- Explicitly suspended authorization before scientific source change.
- Replaced the calculation with log-combination + log-space recurrence + log-sum-exp.
- Candidate definitions, seed block, endpoints, thresholds, multiplicity, and decision rules did not change.
- Hardened validation run `31785214590`, job `94719501008` = `success`, 9 tests passed, 0 scientific games.
- Reissued active authorization SHA-256 `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`.
- Authorization-binding run `31785382236`, job `94720016585` = `success`.

## 2026-08-15 — Stage 2 fresh corpus generation / full verification

- Generated exactly `3072` games / six strata ×512 / seeds `22000001–22003072`.
- Unique historical trajectories: `2736`.
- Distinct opening prefixes: `2220`.
- Manifest summary hash: `e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`.
- Generation source commit: `3082cd2132cdd572e43f5f78e8d662271a9ed492`; tree clean.
- Independent verifier: `passed=true`, `fullSearchRecomputation=true`, `gamesVerified=3072`.
- Verification identity hash: `bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`.
- Generation/full-verification gate = **PASS**.

## 2026-08-15 — Stage 2 candidate-specific selection

- Top-level `replacementPerformed=false` and `selectionIntegrityPassed=true`.
- Selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`.
- C01: `1597` unique states / `1373` opening prefixes / 6 strata.
- C02: `2705` / `2192` / 6.
- C03: `1272` / `1121` / 6.
- C04: `1031` / `891` / 6.
- All four candidates passed all six frozen estimability/transferability preview gates.
- No extension, replacement, or paired-definition substitution occurred.

## 2026-08-15 — Stage 2 formal measurement

- Completed measurements exactly matched selected unique-state counts.
- C01 `1597`; C02 `2705`; C03 `1272`; C04 `1031`; total `6605`.
- Measurement integrity: `true`.
- Overall measurement hash: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`.
- Measurement source commit: `e6f5e9528d523e7710a953020b1719abf60a26e8`; tree clean.

## 2026-08-15 — Stage 2 formal evaluation / Study 1 closure

- Evaluated all four canonical candidates with exactly eight planned co-primary tests.
- All four candidates were estimable.
- Holm-Bonferroni family retained all eight tests; no endpoint was dropped or substituted.
- Final decisions:
  - `TM-S2-C01` = **NOT-CONFIRMED**
  - `TM-S2-C02` = **NOT-CONFIRMED**
  - `TM-S2-C03` = **CONFIRMED**
  - `TM-S2-C04` = **NOT-CONFIRMED**
- C03: structural `1245/1272 = 0.978774`; D3 top set `937/1272 = 0.736635`; D3 >= median `0.869497`; D3 unique-worst `0.070755`.
- C01 reproduced its structural consequence but failed the tactical-value co-primary endpoint.
- C02 and C04 failed both co-primary patterns and additional D3 consistency gates.
- Result-core hash: `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748`.
- Uploaded/local result artifact SHA-256: `f13f5a87464a5c8b360695977edc5fca4348f438fbf20c4bd5be682ed80d4dd4`.
- Evaluation source commit: `d41b061067ab2e5dbe65294d3860586d9d3c1454`; tree clean.
- Independently recomputed result-core hash matched exactly.
- Independent high-precision exact-binomial check confirms C03 structural p ≈ `5.79e-328`; stored double `0` is representational underflow only.
- Created `STAGE_2_FORMAL_RESULT.md`, `STUDY_1_FINAL_REPORT.md`, `STUDY_1_OVERVIEW.md`, `REPRODUCIBILITY_INDEX.md`, and formal-completion checkpoint.
- Tactical Motifs / Tesuji Study 1 = **CLOSED / COMPLETE**.
- C03 is confirmed only as a machine-reproducible transferable tactical motif under the frozen operationalization. Human/expert/traditional/pedagogical claims remain for a separate prospective study.
