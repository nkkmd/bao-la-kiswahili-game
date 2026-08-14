# RESEARCH_LOG — Tactical Motifs / Tesuji Study 1

## 2026-08-14 — Study initialization

- Verified baseline `main` HEAD `08c70ba6ac980884d51562c207410db3521b8ae4`.
- Restored immutable boundaries from Phase Transition, Position Typology / Playing Style, Namua→Mtaji, Position Complexity, and Joseki studies.
- Fixed joseki/tesuji separation and prohibited automatic relabeling of prior constructs as tesuji.
- Audited engine move/event representation, exact `moveVariants`, state identities, validated seat symmetry, structural features, and exact D1/D2/D3 search instrumentation.
- Confirmed current tooling has no search-consistent principal variation; Stage 1 therefore uses reply sets / response envelopes.
- Created branch `research/tactical-motif-discovery`.
- Stage 0 initialization commit: `de4931fb20c218c0d4b3d13689cf79af400e89bd`.
- Stage 0 validation record commit: `c3e14ea9bdf7c6a92ec57b0413af925e9c8e70d1`.
- Stage 0 Actions run `31768708597` = `success`.

## 2026-08-14 — Stage 1 prospective scientific-contract freeze

- Froze Stage ID `TM-S1-EXPLORATORY-2026-08-14-v1`.
- Froze 768 games, seeds `21900001–21900768`, max ply 100, no early stop, no extension, no replacement.
- Froze six generation strata ×128 games: `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, `LE-D2`.
- Froze first 8 plies as seeded-uniform exact `E.moveVariants`.
- Froze historical trajectory as support unit; one hash-assigned-phase root per representative trajectory; duplicate selected rule states collapse without replacement.
- Froze all-legal-move measurement, all-immediate-reply response envelope, exact D1/D2/D3 root values, D1 reply search, candidate grammar, transferability gates, D3 gates, deterministic ranking, caps, and no-rescue rules before generation.
- Spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`.
- Scientific-contract freeze commit: `62fbf68cf12a3539b46dcdcd4487a0a9ea7debba`.
- Actions run `31770343371` = `success`.

## 2026-08-14 — Stage 1 execution tooling and authorization

- Implemented deterministic corpus runner, selection/measurement/discovery phases, and independent full replay/search verifier.
- Execution implementation commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`.
- Actions run `31770629848`, job `94675639391` = `success`.
- Created source-hash-bound authorization only after validation.
- Authorization commit: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`.
- Authorization SHA-256: `9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`.
- Confirmatory inference and Stage 2 generation remained unauthorized.

## 2026-08-14 — Execution-environment recovery boundary

- Initial disposable assistant-container materialization was lost before a complete corpus could be retained.
- No scientific outcome was inspected and no seed/threshold/population/candidate rule changed.
- No partial corpus was promoted and no replacement occurred.
- Added stable-runtime execution recovery runbook/checkpoint at commit `6694714194eee2f536e90b4411566d9126e162ae`.

## 2026-08-14 — Stage 1 corpus generation and full verification

- Generated exactly 768 games using seeds `21900001–21900768` from clean source commit `6694714194eee2f536e90b4411566d9126e162ae`.
- Each frozen generation stratum contributed exactly 128 games.
- Manifest: 741 unique historical trajectories, 27 duplicate groups, largest group 2, 681 opening prefixes.
- Manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`.
- Independent verification: `passed=true`, `fullSearchRecomputation=true`, `gamesVerified=768`.
- Verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`.
- Full-verification checkpoint commit: `831d441d426a9e0cb308a41d54c77a6074c4c490`.

## 2026-08-14 — Deterministic selection and readiness pass

- From 741 unique historical trajectories, 25 had no eligible root in their hash-assigned phase and received no replacement.
- Selected before rule-state collapse: 716.
- One duplicate selected rule state collapsed; selected unique rule states: 715.
- `replacementPerformed=false`.
- Namua 370 / Mtaji 345.
- Distinct selected opening prefixes: 659.
- Stratum counts: `B-D1=114`, `B-D2=115`, `B-D3=122`, `LS-D2=122`, `V2-D2=121`, `LE-D2=121`.
- Selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`.
- All six frozen selection-readiness gates passed.
- Selection-readiness checkpoint commit: `40990b1489f956d52486553bb5e39d974e47dd75`.

## 2026-08-14 — All-move measurement and discovery-readiness pass

- Measured all exact legal moveVariants at all 715 selected roots.
- Completed root measurements: 715.
- Exact move records: 3148.
- Frozen discovery minimum: 1800; `measurementReadinessPassed=true`.
- Measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`.
- Measurement provenance was clean and retained the frozen scientific source mapping.
- Measurement-readiness checkpoint commit: `9348f4ea5384d9d67b9e9eb7b6a3d3b5fd0c30f7`.

## 2026-08-14 — Stage 1 exploratory discovery completion

- Ran the frozen deterministic `discover` phase against the 3148 exact move records.
- Local `discovery-result.json` size: 339,427,002 bytes; the artifact remains local and is not committed.
- Discovery artifact SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`.
- Generated at: `2026-08-14T07:02:13.454Z`.
- Raw pattern instances: 3,116,520.
- Unique pattern keys: 323,676.
- Detailed candidates: 105,501.
- Low-support patterns: 218,175; low-support key hash `f14010884922317218871d1dacc915ad9ecbd64abe93bc499d5d6fb9bdb5f7c2`.
- Independently stream-scanned all 105,501 detailed candidates without loading the huge artifact into conversational context.
- 948 detailed candidates passed every frozen promotion gate: Mtaji 921 / Namua 27; coarse-no-index 833 / indexed 115.
- Reapplied the frozen ranking and caps from `tactical-motif-discovery.js`; the eight recomputed candidate keys matched `promotedForStage2Planning` exactly and in order.
- The eight post-cap ranks correspond to pre-cap eligible ranking positions `1,2,22,23,40,41,645,646`, demonstrating the planned phase/move-abstraction caps rather than manual curation.
- Frozen candidate keys:
  1. `23e3dbe362049a6e220fa2aa74b6f9364b8277cadc4f329e8181b483cf03fe38`
  2. `9d56bfb8fd5dd74604720ed81d3157bdadb75bc8d046b9ac2d669753e1ce5f59`
  3. `76dacf8980eeecec8af798b19fb3e87d23665a67bffaf555fb05cec5dea5c852`
  4. `9a62f3db2e8d38c6c70849089ce309950d5c80ed6df436a389d22f472283fa49`
  5. `7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`
  6. `9af775a38a9fa5267ade3fbedbc4c2fa8effdc950cb1018e8242f5dfae988b0b`
  7. `8a2c28eaefd59c83d6a7983b3f7c6b36c80f677b08ab6d2af65203e6af0c8755`
  8. `e50ee37ceaf2ecdbb356908154185c66928d394eb27beaaaee585b1e0a911bcb`
- All eight pass all nine frozen promotion gates.
- The eight definitions form four exact support-identity pairs: ranks 1–2, 3–4, 5–6, and 7–8.
- Recorded support equivalence as an audit observation only; no candidate was merged, renamed, or manually promoted.
- Created `STAGE_1_EXPLORATORY_RESULT.md`, `STAGE_1_CANDIDATE_FREEZE.json`, and completion checkpoint.
- Stage 1 exploratory discovery is **COMPLETE**.

## 2026-08-14 — Stage 2 prospective formal candidate/family freeze

- Before any fresh Stage 2 data existed, fixed Stage 2 ID `TM-S2-FORMAL-2026-08-14-v1`.
- Preserved all eight Stage 1 definitions unchanged.
- Chose four canonical formal candidates, one per exact Stage 1 support-identity pair, by the deterministic prospective rule: lowest Stage 1 promoted rank within each pair.
- Canonical ranks: `1,3,5,7`; paired ranks `2,4,6,8` are diagnostic-only.
- Post-fresh-data candidate substitution, pair merge/split, and paired-definition promotion are forbidden.
- Candidate-definition file: `preregistration/STAGE_2_FORMAL_CANDIDATES.json`.
- Candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`.
- Correctly bound the actual repository Stage 1 candidate-freeze SHA-256 `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`; an earlier reconstructed hash was rejected by CI before authorization and did not affect scientific data.

## 2026-08-14 — Stage 2 formal scientific-contract freeze

- Froze fresh population at 3,072 games, seeds `22000001–22003072`, six strata ×512, max ply 100, seeded-uniform first 8 plies, no extension, and no replacement.
- Froze candidate-specific root selection using only candidate phase, canonical structural precondition, legal-move eligibility, and canonical move-abstraction availability.
- Explicitly prohibited consequence, D1/D2/D3 value, reply outcome, and game outcome from root eligibility.
- Froze one SHA-ranked root per unique historical trajectory per candidate, with duplicate rule-state collapse and no replacement.
- Froze formal candidate move as lexicographically smallest exact matching `AI.moveKey`, independent of search value or consequence.
- Froze two co-primary endpoints per candidate: structural consequence success and exact D3 top-set membership.
- Froze one-sided exact-binomial H0 `p<=0.50`, required observed rate `>=0.60`, D3 median/worst consistency gates, and six estimability/transferability gates.
- Froze 8 planned p-values (`4×2`) with Holm-Bonferroni FWER `0.05` and no endpoint dropping.
- Froze decision states `CONFIRMED`, `NOT-CONFIRMED`, `INCONCLUSIVE-NOT-ESTIMABLE`, `TECHNICAL-INCONCLUSIVE` and accepted zero confirmed candidates as a valid outcome.
- Formal spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`.
- Design-freeze Actions run `31784338545` = `success`.

## 2026-08-14 — Stage 2 tooling implementation and initial validation

- Implemented Stage 2 formal helper, corpus/provenance helper, runner, independent verifier, evaluator, validator, tests, and dedicated Actions workflows.
- Formal runner phases: `status`, `generate`, `select`, `measure`, `evaluate`.
- Mandatory execution firewall inserts independent full replay/search verification between `generate` and `select`.
- Independent verifier has no weakened/no-search mode and recomputes all fixed-seed post-opening generation search diagnostics.
- Initial Stage 2 tooling run `31784819713` completed with `success` and generated 0 scientific games / 0 formal measurements.

## 2026-08-14 — Pre-generation exact-binomial numerical hardening

- Before any Stage 2 scientific game was generated, a numeric audit found that naive probability-domain exact-binomial upper-tail accumulation could underflow for large selected-root counts.
- Explicitly suspended Stage 2 authorization before changing scientific source.
- Replaced the calculation with log-combination, log-space recurrence, and log-sum-exp accumulation.
- Candidate definitions, population, seed block, endpoints, thresholds, multiplicity, and formal decision rules were unchanged.
- Added large-`n` numerical stability tests and a deterministic short technical trajectory with full replay verification.
- One CI run failed only because the test compared floating-point `0.125` and `0.12500000000000003` using strict equality; large-`n` stability and replay tests already passed. The test assertion was corrected to use numeric tolerance without changing scientific source.
- Hardened tooling run `31785214590`, job `94719501008` completed with `success`: 9 tests passed, scientific games = 0, formal measurements = 0.

## 2026-08-14 — Stage 2 hardened authorization

- Reissued Stage 2 authorization only after the hardened tooling validation passed.
- Active authorization binds the frozen candidate definition, formal spec, actual Stage 1 candidate-freeze hash, Stage 1 discovery artifact hash, and exact SHA-256 mapping of all hardened scientific source files.
- Authorization SHA-256: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`.
- Active authorization-binding run `31785382236`, job `94720016585` completed with `success`.
- The CI reread the authorization through `loadAuthorization()` and confirmed `stage2GenerationAuthorized=true` and `scientificInferenceAuthorized=true` against the current source mapping.
- At authorization acceptance: Stage 2 scientific games = 0, verification absent, selection absent, candidate measurement files = 0, formal result absent.
- Created Stage 2 pre-generation checkpoint and execution runbook.
- Stage 2 formal scientific generation is now **AUTHORIZED / NOT YET GENERATED**.
- Next authorized action is fixed 3,072-game generation followed immediately by mandatory independent full replay/search verification. Candidate-specific selection remains blocked until that gate is independently accepted.
