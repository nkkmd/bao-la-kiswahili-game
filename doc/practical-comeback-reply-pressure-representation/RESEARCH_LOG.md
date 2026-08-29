# PCRPR-STUDY1 — Research Log

## 2026-08-29 — Study-start audit and prospective freeze

- Re-acquired remote `main` and verified exact HEAD `e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5`.
- Confirmed this matches the post-G2-06 closure reference SHA supplied at study start.
- Audited root `README.md`, `doc/RESEARCH_INDEX.md`, `doc/FUTURE_RESEARCH_AGENDA.md`, `doc/RULES_BASELINE.md`, and the active Research Generation 2 program decision.
- Confirmed `G2-07 — Practical Comeback / Reply-Pressure Representation Study 1` is the next unstarted machine-only agenda item after G2-01..G2-06 closure.
- Reconfirmed direct upstream `PCEM-STUDY1`: 55 audits, zero promoted candidates, Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`.
- Reconfirmed immediate predecessor `RCPR-STUDY1`: Stage 1 `STAGE1-TECHNICAL-INVALID`, seed block `28610001..28613072` consumed, no same-block rerun/replacement/extension, Stage 2 not authorized.
- Reconfirmed the RCPR exact-hash failure root cause: deterministic floating-point accumulation-order difference in `MOVE_SET_ENTROPY.indexEntropy` on 4/600 rows.
- Verified that changes after the G2-06 scientific integration commit to current `main` are documentation-only; no public rule/engine code change intervened.
- Searched for an existing G2-07 branch and found none.
- Searched proposed Study IDs for collisions and found none.
- Frozen Study identity: `PCRPR-STUDY1`.
- Frozen branch: `research/g2-07-practical-comeback-reply-pressure-representation`.
- Frozen Stage IDs: `PCRPR-S0-TECHNICAL-2026-08-29-v1`, `PCRPR-S1-DEVELOPMENT-2026-08-29-v1`, `PCRPR-S2-FORMAL-2026-08-29-v1`.
- Created the research branch from exactly the verified remote-main SHA.
- Frozen RAW-only identity and no-transform boundary.
- Frozen 12-family reply-pressure representation search-space boundary.
- Reserved fresh Stage 1 seeds `28710001..28713072` and fresh Stage 2 seeds `28810001..28816144`; both remain unconsumed.
- Frozen Stage 0 numeric-hardening requirements before any scientific seed consumption.
- No PCRPR scientific outcome has been generated. Stage 1 and Stage 2 remain unauthorized.

## 2026-08-29 — Stage 0 technical protocol, implementation and canonical PASS

- Frozen `PCRPR-S0-TECHNICAL-2026-08-29-v1` before execution.
- Defined reply quality from the replying-player perspective under exact full-window D1/D2 search.
- Defined defense-maintaining reply as exact D2 top-set membership, not an empirical continuation threshold.
- Defined predictor-side strong/medium/weak reply distributions using only root/reply/search-derived outcome-independent information.
- Frozen canonical exact move/reply ordering, left-to-right binary64 arithmetic, big-endian binary64 scalar serialization and exact feature-vector hashing.
- Added integer-like-key and reply-permutation adversarial controls specifically addressing the G2-06 accumulation-order lesson.
- Implemented structurally separate production and independent Stage 0 representations.
- Canonical workflow run `33238931893` succeeded at source commit `19c70ba60c8b43858b01a01c5a448311660269c4`.
- Production passed 18/18 mandatory gates.
- Independent verifier passed 9/9 gates and reproduced all 9 technical rows × 80 scalar features exactly.
- Artifact `9710763348` / `pcrpr-stage0-technical-v1`, ZIP SHA256 `408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b`.
- Stage 0 decision: `STAGE0-TECHNICAL-PASS`.
- Technical fixture seeds `28700001..28700032` are outside both scientific blocks; Stage 1/2 scientific seed consumption remains zero.

## 2026-08-29 — Stage 1 prospective development specification

- Frozen source block `28710001..28713072` / 3072 fresh games, still unconsumed.
- Frozen target root quotas 200 Namua + 200 Mtaji.
- Frozen occurrence-first selection followed by fresh PCRPR D3 `bestScore < 0` disadvantage screen with no within-trajectory replacement.
- Frozen all-exact-root-move row construction.
- Frozen continuation semantics: actor canonical D2 best; opponent strong canonical D2 best, medium seeded D1 top3, weak seeded uniform; 96 post-root plies; strong/medium/weak replicate counts 1/16/8.
- Frozen primary development target `medium bounded-win rate - strong bounded-win indicator`; all continuation targets remain class-D and forbidden from predictors.
- Frozen deterministic grouped ridge development grid and readiness/zero-promotion/non-estimable/technical-invalid dispositions.
- Immediate pre-outcome self-audit detected that the first committed `F03_REPLY_POLICY` duplicated `F04_ALL_NO_TEMPORAL`.
- Before implementation validation, authorization, scientific seed consumption or outcome observation, `F03_REPLY_POLICY` was narrowed to its intended reply-quality/policy set. The correction is recorded inside the Stage 1 spec.
- Frozen a separate Stage 1 computational contract covering row/feature ordering, normal-equation accumulation, Cholesky loop order, rank ties, RMSE/Spearman/enrichment semantics, binary64 serialization and exact independent model equality.

## 2026-08-29 — Stage 1 preauthorization implementation smoke attempts

- Implemented the production corpus/root-selection/representation/continuation core and deterministic ridge model core without creating a scientific runner or authorization.
- Added a technical-only smoke using `28701001..28701064`, outside the Stage 1 scientific block.
- Preauthorization smoke run `33239399107` stopped at syntax check due to an unclosed parenthesis in the model result assembly. No technical smoke game and no scientific seed was generated by that run.
- The syntax defect and an adjacent prediction-hash variable defect were corrected in a new commit; semantics, Stage 1 population, target, thresholds and scientific seed blocks were unchanged.
- A complete new smoke run was then triggered from the corrected source. Stage 1 scientific generation remains unauthorized and unexecuted.
