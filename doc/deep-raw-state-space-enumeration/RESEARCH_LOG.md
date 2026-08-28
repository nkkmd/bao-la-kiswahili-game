# DRSSE-STUDY1 — Research Log

## 2026-08-28 — Startup audit and prospective freeze

- Re-acquired remote `main`: `c515c36a9b27a796dc7eae13fd1b2cec2b9d3ea6`; matched expected G2-04 post-integration HEAD.
- Open PRs: 0.
- Residual G2 branches audited as behind-only with no unmerged commits.
- Restored immutable G2-01/02/03/04 and G1 SSGTC decisions.
- Fixed Study ID `DRSSE-STUDY1`, Stage IDs, RAW identity, no-transform boundary, complete-layer rule and branch `research/g2-05-deep-raw-state-space-enumeration`.
- Prospectively fixed formal standard initial RAW root, target depth 9, decision taxonomy and formal resource ceilings before Stage 1 outcome inspection.

## 2026-08-28 — Stage 0 technical validation

- Built production RAW enumerator and structurally separate independent representation/enumerator.
- First workflow stopped before enumeration because a nonexistent smoke-test path was specified. No output was generated; recorded as pre-output workflow failure.
- Corrected workflow plumbing only.
- Second attempt completed depth-2 production enumeration but exposed a mismatch between the new depth-labelled edge hash convention and the immutable G1 technical fixture's original transition hash convention. The run was blocked, not accepted.
- Corrected only the positive-fixture binding; the G2-05 enumerator's native hash contract was unchanged.
- Canonical run `33155526103` passed G1 depth-2 fixture reproduction, materialized independent verification and all eight corruption controls.
- Stage 0 decision: `STAGE0-TECHNICAL-PASS`.

## 2026-08-28 — Stage 1 development

- Froze fresh development seed block `28050001..28050064` and deterministic phase-stratified selection.
- Selected three Namua roots and three Mtaji roots without using G2-04 selected roots or outcomes.
- Production completed depth 5 for all six roots.
- Independent verifier regenerated root selection, replayed root identities, verified materialized rows and fully re-enumerated all six local domains.
- Stage 1 decision: `STAGE1-DEVELOPMENT-PASS`.
- Stage 1 remained non-scientific/formal and was firewalled from Stage 2 input.

## 2026-08-28 — Stage 2 source freeze and authorization

- Transcribed the already frozen study-start formal target into `STAGE_2_FORMAL_SPEC.json` without using Stage 1 scientific-pattern direction.
- Froze spec, engine, production enumerator, independent enumerator, formal runner/verifier and workflow blobs.
- Formal domain remained fresh standard initial RAW root, depth 9, no transforms, fixed resource ceilings.
- Commit `9199a3d25ea38978673f94bfcd4250aa3b5411fa` authorized exactly one Stage 2 execution.

## 2026-08-28 — Stage 2 formal result

- Canonical workflow run `33156581843`, job `98800676702`.
- Production completed all layers 0..9 without stop.
- Independent verifier validated all ten state layers and nine edge-parent layers.
- Independent implementation then re-enumerated the full depth-9 domain and matched production exactly on state/edge sets, counts, tree propagation, predecessor/transposition accounting, phase counts and hashes.
- Formal decision: `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`.

Canonical cumulative values:

```text
RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
```

Canonical artifact:

```text
artifact = 9679860509
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
```

## 2026-08-28 — Scientific closure

- Materialized compact Stage 2 and Study-level results.
- Recorded exact bounded decision without changing upstream decisions.
- Confirmed no G2-04 root/partial closure, G1 partial depth-9 row, Stage 1 row/root, symmetry reduction or canonicalization entered the formal evidence.
- Full-game extrapolation remains unauthorized and reserved for separate future prospective work such as G2-12.

## 2026-08-28 — PR review and final consistency audit

- Opened PR #71 from `research/g2-05-deep-raw-state-space-enumeration` to `main`.
- PR review identified two latent implementation concerns: incomplete-run independent re-enumeration coverage and a missing final ambient-cap recheck.
- Audited the accepted canonical execution and established that neither concern affected its result: `targetComplete=true` caused full independent depth-9 re-enumeration, and final recorded resource use remained below every frozen cap.
- Preserved the frozen formal source and did not rerun or repair the formal evidence after outcome observation.
- Recorded the disposition at `checkpoints/2026-08-28-pr71-review-disposition.md`; both review threads were resolved.
- Cross-audited root `README.md`, Study README, Overview, Final Report, Current Status, Decision Register, Reproducibility Index, Research Log, machine-readable final result, `doc/RESEARCH_INDEX.md`, `doc/FUTURE_RESEARCH_AGENDA.md`, and the Research Generation 2 program decision.
- Found no scientific-content inconsistency. Added the missing Study-README link to the PR-review disposition checkpoint.
- Confirmed `RULES_BASELINE.md` and AI-engineering documentation required no update because G2-05 changed neither rule-engine semantics nor public-AI engineering state.

## 2026-08-28 — Main integration

- Final research head: `a6a4dc73ae1b448a909913dbff99b06862da2ac0`.
- Final PR CI passed all five workflows: DRSSE closure, Research Generation 2 agenda, SSGTC closure, PCEM closure, and Phase Transition Research CI.
- PR #71 was mergeable, non-draft, with no unresolved review threads and `main` still at the audited baseline before merge.
- Merged PR #71 with history-preserving `merge` and expected-head protection.
- Merge commit: `8d024c5a6b5114eefbab8fb23d54582d149b85f3`.
- Scientific decision and all interpretation/no-rescue boundaries remained unchanged by integration.
