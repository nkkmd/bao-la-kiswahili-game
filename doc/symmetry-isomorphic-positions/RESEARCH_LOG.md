# RESEARCH_LOG — Symmetry / Isomorphic Positions Study 1

## 2026-08-24 — Study start

- Re-fetched current `main` and bound study start to `f2edfe27f4e22198e28525b0ac09f6dd4834c488`.
- Recovered rules baseline and runtime engine semantics.
- Recovered Restricted Endgame Study 1 raw exact oracle from canonical repository artifacts; no prompt-supplied hash was trusted without re-check.
- Reviewed `NAMUA_SYMMETRY_RESEARCH_PLAN.md`, historical transform tooling and regression tests as historical context/technical clues only.
- Confirmed current engine uses player-local pit indices and fixed `HOUSE=4`.
- Identified `moveVariants()` as necessary exact move universe for Namua house-choice transitions.
- Separated fixed-start historical reachability from transformed-initial replay.
- Froze prospective scientific transform semantics before fresh formal-corpus outcomes.
- Created dedicated research branch `research/symmetry-isomorphic-positions` from current main.
- Opened tracking Draft PR #39.

At candidate freeze time no Study 1 formal candidate pass/fail result had been generated.

## 2026-08-24 — Stage 0 technical validation

- Added Study-owned transform implementation independent of historical `tools/symmetry/transform-candidates.js`.
- Added identity/inverse fixtures and negative control.
- Stage 0 technical workflow verified engine regression and synthetic controls.
- Outcome-blind v2 benchmark included prospectively declared `mtaji-houseless` stratum.
- Technical run `32713095966` completed with guard hit 0.
- Depth-3 sizes were Namua 386 states/386 edges, Mtaji 372/364, Mtaji-houseless 372/364.
- Froze formal design at 8 roots per stratum, local depth 3, seed block `22910001..22910064`, maximum trajectory ply 120.
- No symmetry success/failure rate was used to choose the formal population.

## 2026-08-24 — Stage 1 prefreeze

- Implemented deterministic fresh-domain materializer without candidate-transform calls.
- Implemented production formal validator and independent verifier before formal outcome generation.
- Prefreeze run `32727669985` regenerated all three strata with 8 roots each, shortage 0, witness replay failure 0, runtime guard hit 0.
- Froze `STAGE_1_FORMAL_SPEC.json` and `STAGE_1_AUTHORIZATION.json` with candidate/domain/source hashes.
- Authorization chronology recorded `scientificOutcomeGeneratedBeforeAuthorization=false`.
- No candidate/domain correction was performed after authorization.

## 2026-08-24 — First authorized Stage 1 scientific outcome

- Triggered first scientific execution only after spec/authorization freeze.
- Production formal validation found zero fresh mismatches in all five preregistered scientific outcome scopes.
- Production exact-oracle integration returned 19 mismatches per scientific candidate and provisional `NOT-VALIDATED` because the mandatory oracle anchor failed.
- No candidate, scope, phase, root, depth, direction mapping, or threshold was changed after seeing the result.

## 2026-08-24 — Independent verification

- Executed exact diagnostic rerun under unchanged frozen hashes through temporary PR #44.
- Frozen-domain hash check passed before outcome generation.
- Independent fresh validation again found zero mismatch for all five scientific outcomes.
- Negative control produced 638 fresh mismatches; identity positive control produced zero fresh mismatches.
- Independent oracle integration produced 10 mismatches per scientific candidate, not 19.
- Because production and independent oracle accounting did not agree, `G12=FAIL` for all five outcomes.
- Independent final decisions: 0 validated / 0 not-validated / 5 non-estimable.
- Formal result was not rescued by dropping the oracle gate or promoting fresh evidence alone.

## 2026-08-24 — Post-outcome read-only oracle diagnostic

- Added a diagnostic that cannot modify the formal result or upstream Study.
- Workflow run `32728619101` recomputed each stored 8-state oracle row with both production and independent serializers.
- Found three terminal `stateRows` whose stored `stateKey` does not equal the key recomputed from the stored `ruleState`.
- Both independent serializers agreed with each other on all eight recomputed keys.
- The three mismatching stored rule states had seed total 63; other rows had 64.
- Recomputed all seven guard-free transitions; every target belonged to the stored oracle key set.
- Recorded this as an integrity limitation of using the immutable artifact as a symmetry-transform anchor, not as a revision of Restricted Endgame Study 1.

## 2026-08-24 — Immutable result archival

- Disabled automatic Stage 0 runtime-metric materialization after Stage 0 closure because repeated elapsed/RSS updates were racing with Stage 1 artifact commits. This lifecycle change did not alter scientific input or result.
- Re-ran the unchanged frozen Stage 1 contract solely to archive the already observed failure.
- Workflow run `32728925376` reproduced the same domain, production result and independent result hashes.
- Bot commit `0b021de1138b07e2b64619fc80a507b9effaf9b2` archived `STAGE_1_DOMAIN.json`, production result, independent verification and workflow provenance.

## 2026-08-24 — Study closeout

- Formal result fixed at `NON-ESTIMABLE` for all five scientific outcomes.
- Created `results/STAGE_1_FORMAL_RESULT.json`.
- Created `STUDY_1_OVERVIEW.md` and `STUDY_1_FINAL_REPORT.md`.
- Formally validated transformation set is empty.
- Conditional canonicalization and symmetry-group stages are not authorized.
- Downstream State Space / Game Tree Complexity Study may proceed with raw state identity only; T01/T02/T03 may not be used for symmetry reduction from this Study 1.
- Restricted Endgame Study 1 remains immutable; no formal decision, count, hash, value or DTF is rewritten.

Study 1 is closed. No further scientific outcome generation is authorized within `SIP-STUDY1`.

## 2026-08-24 — Closure provenance clarification

- Final repository audit recovered the already-recorded `STAGE_1_V1_INVALIDATION.json` chronology.
- The v1 run is therefore treated as technically invalidated for candidate-decision use; its fresh zero-mismatch observations remain diagnostics only.
- A corrected v2 runner draft existed, but no v2 formal spec, authorization, independent verifier, workflow result, or candidate decision was ever created.
- The correction path was not resumed. Study closure remains 0 validated / 0 rejected / 5 `NON-ESTIMABLE` because no valid completed formal candidate-decision run exists.
- This does not change Restricted Endgame Study 1 and does not rescue any SIP candidate.
