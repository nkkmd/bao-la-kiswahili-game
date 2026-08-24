# DECISION_REGISTER — Symmetry / Isomorphic Positions Study 1

Updated: 2026-08-24

## D-001 — New independent Study

`SIP-STUDY1` is prospective and does not modify prior Study decisions or artifacts.

## D-002 — Raw upstream oracle is immutable

Restricted Endgame Study 1 remains raw/no-symmetry. Its 8-state identity and exact solution are read-only anchors. This Study may diagnose downstream compatibility but may not rewrite the upstream artifact or formal decision.

## D-003 — Engine-local coordinate interpretation

Both numeric players use pit indices from their own viewpoint. Physical facing front pits sum to index 7. Therefore physical seat exchange/180-degree board rotation is represented by swapping player-indexed values while preserving local row/index/side/direction.

## D-004 — Exact move set uses `moveVariants`

Formal legal-move bijection uses `moveVariants`, not only `legalMoves`, so distinct Namua `houseChoice` outcomes are represented.

## D-005 — Candidate semantics frozen before formal reachable outcomes

The candidate definitions and static non-candidates are frozen in `preregistration/CANDIDATE_TRANSFORMS.json` before Study 1 formal reachable-corpus transition-commutation results are generated.

## D-006 — Active nyumba blocks global local-LR reflection prospectively

A global `i -> 7-i` sends fixed `HOUSE=4` to index 3. Therefore an all-phase/all-state LR candidate was rejected from the scientific candidate set before formal outcome. A restricted `mtaji + reserve=[0,0] + houseOwned=[false,false]` candidate was retained prospectively.

## D-007 — FRONT/BACK row swap rejected prospectively

Capture generation and nyumba semantics privilege `FRONT`. A transform that exchanges FRONT and BACK lacks a corresponding rule-semantic role mapping in the current engine and is not a scientific Study 1 candidate.

## D-008 — Scientific transforms

Study 1 scientific transform definitions are:

- `SIP-T01-SEAT-SWAP-LOCAL`
- `SIP-T02-LR-MTAJI-HOUSELESS`
- `SIP-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS`

`SIP-T01` is evaluated separately in Namua, Mtaji and pooled-both scopes without post-outcome scope changes. T02/T03 have the prospectively fixed Mtaji house-inactive applicability predicate.

## D-009 — Controls are not findings

`SIP-C00-IDENTITY` is a positive implementation control. `SIP-C01-LR-NO-DIRECTION-FLIP` is a negative control. Control behavior is diagnostic and is not itself a scientific symmetry finding.

## D-010 — Fixed-start reachability is separate

`SIP-T01` does not preserve the raw standard initial state because it flips `player=0` to `player=1`; it may support transformed-initial replay but not automatic fixed-start historical reachability. T02/T03 do not apply along the full standard-initial Namua witness.

## D-011 — Fresh seed separation

Stage 0 technical seeds are reserved from `22900001..22900256`. Stage 1 formal seeds are `22910001..22910064`. No prior scientific seed block is reused implicitly.

## D-012 — Stage 0 domain choice is outcome-blind

Formal root counts and local graph depth were selected only from graph size, edge count, runtime, memory, branching, guard status and phase coverage. Candidate mismatch rates were forbidden inputs.

## D-013 — Fresh formal claim is bounded-local

Fresh reachable-state evidence supports only exact statements over the frozen selected roots and frozen local expansion depth. It is not a theorem for all Namua, all Mtaji or all Bao.

## D-014 — Group language is conditional

Group terminology requires validated transforms on a common domain plus exact identity, inverse, composition and closure checks. It is not authorized merely from candidate definitions.

## D-015 — Canonicalization is conditional

No canonical key used by this Study or downstream State Space work may include an unvalidated transform. Reachability-preservation status must travel with any future canonicalization contract.

## D-016 — Pre-generation correction rule

Pure interface/hash/field defects found before scientific outcome generation may use revoke-record-refreeze-reauthorize. Candidate/domain semantics may not be changed after scientific outcome generation begins.

## D-017 — Frozen Stage 1 formal population

Stage 1 uses seeds `22910001..22910064`, maximum trajectory ply 120, 8 roots per stratum and depth-3 local expansion for `namua`, `mtaji`, and `mtaji-houseless`. Shortage and witness replay failure were both zero.

## D-018 — Fresh bounded-local result is exact but insufficient for Study-level validation

All five scientific outcomes produced zero fresh bounded-local semantic mismatches in production and independent validation. The identity control produced zero fresh mismatches and the frozen negative control produced 638 independent fresh mismatches.

These fresh results are retained as exact evidence within the tested graphs, but they do not override the preregistered requirement for the exact-oracle anchor and G12.

## D-019 — Oracle-anchor disagreement is not a candidate rejection

The mandatory immutable Restricted Endgame 8-state anchor failed even for `SIP-C00-IDENTITY`. Production counted 19 oracle mismatches while the independent implementation counted 10. Because the positive control fails at the anchor layer and G12 equality fails, the observed oracle mismatch cannot be interpreted as evidence that T01/T02/T03 are false symmetries.

## D-020 — Post-outcome read-only diagnostic does not alter formal scope

A read-only diagnostic found 3 terminal stateRows whose stored `stateKey` does not equal the canonical re-hash of the stored `ruleState`; those stored ruleStates total 63 seeds. Production and independent serializers agree with each other. All 7 recomputed transitions remain within the stored state-key set.

This diagnostic is a limitation of the current artifact as a rule-semantic transform anchor. It does not modify Restricted Endgame Study 1, and it cannot be used to remove G9-G12 after seeing outcomes.

## D-021 — Final formal decision

All five preregistered scientific outcomes are `NON-ESTIMABLE`.

```text
VALIDATED-BOUNDED-ISOMORPHISM = 0
NOT-VALIDATED                  = 0
NON-ESTIMABLE                  = 5
```

The Study does not rescue fresh zero-mismatch evidence into validation and does not convert anchor failure into candidate rejection.

## D-022 — No Study 1 canonicalization or group result

Because the validated transformation set is empty:

- canonicalization is not authorized;
- symmetry-group claims are not authorized;
- symmetry-reduced state counting is not authorized;
- composition/group testing is not run as a scientific Study 1 result.

## D-023 — Downstream State Space contract

State Space / Game Tree Complexity research may proceed using raw state identity. It may not use T01/T02/T03 for reduction on the authority of this Study 1.

A future prospective study may independently audit oracle terminal-state representation and then, if justified, perform a new symmetry confirmation. Such work must not retroactively change `SIP-STUDY1` or Restricted Endgame Study 1 decisions.

## D-024 — Study closure

`SIP-STUDY1` is closed after preservation of the frozen production result, independent verification, compact canonical formal result, read-only diagnostic, Overview and Final Report. No further scientific outcome generation is authorized within Study 1.

## D-025 — v1 invalidation controls the closure provenance

The executed `SIP-S1-FORMAL-2026-08-24-v1` run is technically invalidated for candidate-decision use because the IDENTITY positive control fails only in the exact-oracle reconstruction path. Its fresh zero-mismatch observations remain diagnostic only. The proposed corrected `SIP-S1-FORMAL-2026-08-24-v2` path was not completed: no v2 formal spec, authorization, independent verifier, or scientific result exists. Study closure at 5/5 `NON-ESTIMABLE` is therefore a Study-level estimability decision caused by the absence of a valid completed formal candidate run. This clarification supersedes any wording that could be read as treating v1 G12 output itself as a valid formal candidate decision.
