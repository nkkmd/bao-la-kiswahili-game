# DECISION_REGISTER — Symmetry / Isomorphic Positions Study 1

Updated: 2026-08-24

## D-001 — New independent Study

`SIP-STUDY1` is prospective and does not modify prior Study decisions or artifacts.

## D-002 — Raw upstream oracle is immutable

Restricted Endgame Study 1 remains raw/no-symmetry. Its 8-state identity and exact solution are read-only anchors.

## D-003 — Engine-local coordinate interpretation

Both numeric players use pit indices from their own viewpoint. Physical facing front pits sum to index 7. Therefore physical seat exchange/180-degree board rotation is represented by swapping player-indexed values while preserving local row/index/side/direction.

## D-004 — Exact move set uses `moveVariants`

Formal legal-move bijection uses `moveVariants`, not only `legalMoves`, so distinct Namua `houseChoice` outcomes are represented.

## D-005 — Candidate semantics frozen before formal reachable outcomes

The candidate definitions and static non-candidates are frozen in `preregistration/CANDIDATE_TRANSFORMS.json` before Study 1 formal reachable-corpus transition-commutation results are generated.

## D-006 — Active nyumba blocks global local-LR reflection prospectively

A global `i -> 7-i` sends fixed `HOUSE=4` to index 3. Therefore an all-phase/all-state LR candidate is rejected from the scientific candidate set by static rule semantics, not by formal outcome. A restricted `mtaji + houseOwned=[false,false]` candidate is retained prospectively.

## D-007 — FRONT/BACK row swap rejected prospectively

Capture generation and nyumba semantics privilege `FRONT`. A transform that exchanges FRONT and BACK lacks a corresponding rule-semantic role mapping in the current engine and is not a scientific Study 1 candidate. It may be used only as a technical negative control.

## D-008 — Scientific transforms

Study 1 scientific transform definitions are:

- `SIP-T01-SEAT-SWAP-LOCAL`
- `SIP-T02-LR-MTAJI-HOUSELESS`
- `SIP-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS`

`SIP-T01` is evaluated separately in Namua, Mtaji and pooled-both scopes without post-outcome scope changes. T02/T03 have the prospectively fixed Mtaji house-inactive applicability predicate.

## D-009 — Controls are not findings

`SIP-C00-IDENTITY` is a positive implementation control. `SIP-C01-LR-NO-DIRECTION-FLIP` and optional row-role control are negative controls. Control PASS/FAIL is not a scientific symmetry result.

## D-010 — Fixed-start reachability is separate

`SIP-T01` does not preserve the raw standard initial state because it flips `player=0` to `player=1`; it may support transformed-initial replay but not automatic fixed-start historical reachability. T02/T03 do not apply along the full standard-initial Namua witness. Rule-semantic isomorphism claims therefore remain distinct from reachability-preservation claims.

## D-011 — Fresh seed separation

Stage 0 technical seeds are reserved from `22900001..22900256`. Stage 1 formal generation reserves a disjoint block beginning at `22910001`. No prior scientific seed block is reused implicitly.

## D-012 — Stage 0 domain choice is outcome-blind

Formal root counts and local graph depth may be chosen only from graph size, edge count, runtime, memory, relay-work/guard status and phase coverage. Candidate mismatch rates are forbidden inputs.

## D-013 — Fresh formal claim is bounded-local

Fresh reachable-state evidence can support only exact isomorphism over the frozen selected roots and frozen local expansion depth. It is not a theorem for all Namua, all Mtaji or all Bao.

## D-014 — Group language is conditional

If validated transforms share a common domain, composition/closure/inverse may be tested exactly. Group terminology is authorized only after those checks pass. Otherwise report a validated transformation set.

## D-015 — Canonicalization is conditional

No canonical key used by this Study or downstream State Space work may include an unvalidated transform. Reachability-preservation status must travel with the canonicalization contract.

## D-016 — Pre-generation correction rule

Pure interface/hash/field defects found before scientific outcome generation may use revoke-record-refreeze-reauthorize. Candidate/domain semantics may not be changed after scientific outcome generation begins.
