# G3-11 final document consistency audit PASS — 2026-09-04

## Audit result

**`PASS`**

G3-11 `FDEGHV-STUDY1`のscientific closure後、research branch上のcurrent-facing documentation、study-local closure records、formal result identity、historical-plan boundary、main non-integration boundaryをread-onlyで照合した。

Audit source branch before this checkpoint:

```text
branch = research/g3-11-fresh-depth10-exact-geometry-holdout
pre-checkpoint HEAD = fbe833f215f67efae625096856b48869dd91da5c
main HEAD = e537199a959c0808cbef6cf8aaeb1caab91e3702
branch relation to main = ahead / behind 0
historical PROGRAM_PLAN Git blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac
scientific recomputation during audit = false
protected evidence re-execution = false
depth-11 access = false
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Canonical scientific identity rechecked

`doc/fresh-depth10-exact-geometry-holdout/results/stage-1/STAGE_1_FORMAL_RESULT.json` remains the same mirrored formal result.

```text
study = FDEGHV-STUDY1
formal decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1 = DEEPER-CONFIRMED
H2 = DEEPER-CONFIRMED
H3 = DEEPER-CONFIRMED
H4 = DEEPER-CONFIRMED
formal-result repository Git blob = 59375ab4af1a0e29d167e07e507339bd903fb0ff
scientific-result-core SHA-256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
same-evidence rerun = NOT AUTHORIZED
```

No scientific result file was modified by the documentation synchronization or this audit.

## Current-facing documents checked

The following current-facing documents were synchronized and then re-read:

- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-generation-3/README.md`
- `doc/research-generation-3/CURRENT_STATUS.md`
- `doc/fresh-depth10-exact-geometry-holdout/README.md`
- `doc/fresh-depth10-exact-geometry-holdout/CURRENT_STATUS.md`

They consistently state the current G3-11 condition:

```text
Lifecycle = CLOSED / FORMAL-COMPLETE
Formal domain = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1..H4 = DEEPER-CONFIRMED
protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT USED / NOT AUTHORIZED
G3-11 main integration = NOT AUTHORIZED / NOT PERFORMED
```

The earlier G3-10 wording has been preserved as chronology rather than current state: G3-10 closure-time records may correctly state that depth-10 was sealed **at G3-10 closure**, while current-facing documents now record that the later independent G3-11 opened and consumed it exactly once.

## Study-local closure records checked

The following closure records exist and agree with the canonical formal result:

- `doc/fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md`
- `doc/fresh-depth10-exact-geometry-holdout/DECISION_REGISTER.md`
- `doc/fresh-depth10-exact-geometry-holdout/REPRODUCIBILITY_INDEX.md`
- `doc/research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md`
- `doc/research-generation-3/checkpoints/2026-09-04-g3-11-formal-complete-closure.md`

No closure record expands the claim to whole-Bao state space/game tree, depth 11, symmetry-reduced counts, causal mechanism, human difficulty, game-theoretic value, or re-decision of G3-04/G3-07/G3-10.

## Historical plan boundary

`doc/research-generation-3/PROGRAM_PLAN.md` remains unchanged with Git blob:

`2bb90c11f1625f63f40a7eab8a3de7774505a1ac`

Its historical prospective wording is intentionally retained and is not treated as a current-facing inconsistency.

## Branch / main boundary

Immediately before recording this audit, compare against main showed:

```text
base / merge-base = e537199a959c0808cbef6cf8aaeb1caab91e3702
research branch = ahead
behind = 0
```

The changed-file set consists of G3-11 study/workflow/tooling/provenance files plus the explicitly synchronized current-facing root/RG3 index/status documents. No `PROGRAM_PLAN.md` change is present.

`main` remains at `e537199a959c0808cbef6cf8aaeb1caab91e3702`. This audit does not authorize or perform integration.

## Final repository readiness

```text
scientific execution = COMPLETE
formal decision = FIXED
exact-byte compact result mirror = COMPLETE
study-local closure documentation = COMPLETE
root/central current-facing documentation sync = COMPLETE
final document consistency audit = PASS
historical PROGRAM_PLAN = UNCHANGED
main integration = WAITING FOR EXPLICIT USER INSTRUCTION
```

G3-11 research branch is therefore documentation-consistent and ready for a separately authorized main-integration operation, but no such operation is performed by this checkpoint.