# PCEM-STUDY1 — Research Log

## 2026-08-25 — Research start

- Re-fetched remote `main`; HEAD confirmed as `587472b7e1a3f6e390cdfea6ed0d8e0971d5711d`.
- Restored program-level and directly relevant completed-study boundaries.
- Confirmed this study is a new prospective independent study, not a rescue of any completed study.
- Fixed Study ID `PCEM-STUDY1` and slug `practical-comeback-error-inducing-moves`.
- Created branch `research/practical-comeback-error-inducing-moves` from the verified baseline SHA.
- Reaffirmed RAW-ONLY downstream identity and prohibition on symmetry/canonicalization.
- Separated strongest-policy quality, empirical comeback, reply narrowness, opponent-error dependence, machine reply difficulty, and move optimality gap.
- Established Stage 0 technical-only / Stage 1 exploratory / Stage 2 fresh formal architecture.
- No Stage 0 scientific outcome, Stage 1 outcome, candidate, or formal result was generated at research start.

## 2026-08-25 — Stage 0 technical implementation

- Added study-owned exact-root reference-search semantics `pcem-exact-full-window-root-candidates/bao/q0/v1`.
- Added exact legal root-move intervention and first-reply enumeration under the RAW-ONLY representation firewall.
- Added seeded asymmetric continuation architecture: root actor may use `P_REFERENCE_D2_BEST`; opponent may use separately frozen imperfect policies.
- Added `P_MEDIUM_D1_TOP3` and `P_SHALLOW_UNIFORM` technical policy implementations.
- Bound replicate RNG to stage salt + raw root identity + root actor + replicate index, independent of root move, enabling common-random-number pairing without treating replicates as roots.
- Added bounded outcome accounting that separates terminal win/loss from administrative horizon exhaustion.
- Added an independent verifier that reimplements search, RNG, policy selection, move/reply binding and continuation replay rather than importing the production PCEM measurement core.
- Added a read-only GitHub Actions Stage 0 workflow.

## 2026-08-25 — Invalidated Stage 0 technical attempt

Workflow run `32813015855` executed the primitive tests and production technical pilot successfully. Production passed all technical gates. Independent raw-state, legal-move, move-application, reply-set, reference-search, continuation and hash checks also matched.

The verifier nevertheless returned `TECHNICALLY-INVALID` because its independence audit searched its full source text for forbidden module-name regex literals; those literals appeared in the audit code itself and self-matched. The only failed verifier gate was `independence`.

This was classified as an implementation defect in the verifier audit, not scientific evidence and not a negative scientific result. The run and artifact `9550453776` remain retained for provenance.

## 2026-08-25 — Canonical Stage 0 technical PASS

The independence audit was corrected without changing the scientific population, endpoint, threshold, candidate grammar or any scientific outcome. The full workflow was rerun from commit `29976182dcdcabf206a1d0bf59252fe8bb2288df`.

Canonical workflow:

```text
run = 32813154014
job = 97696278964
artifact = 9550497573
artifact digest = sha256:0021c59fea047c0a192b0e9394513d63aba6347a02d79b1ce41b1bf6e61e2d32
conclusion = success
```

Canonical technical result:

```text
Stage 0 = TECHNICAL-PASS
production gates = 12 / 12 PASS
independent verifier gates = 8 / 8 PASS
technical fixtures = 3
phases = Namua + Mtaji
exact root moves = 15
exact first replies = 38
continuation rows = 60
production elapsed = 4857.528147 ms
max RSS = 94.82421875 MiB
```

Stage 0 remains `scientificInferenceAuthorized = false`. No scientific prevalence/effect/candidate result was generated.

## 2026-08-25 — Stage 1 prospective design freeze

Before any Stage 1 scientific generation or outcome inspection, the exploratory design was frozen as `PCEM-S1-EXPLORATORY-2026-08-25-v1`.

Key frozen decisions:

```text
source games = 3072
Stage 1 seeds = 23200001..23203072
Stage 2 reserved seeds = 23300001..23306144
root target = 300 (Namua 150 / Mtaji 150)
reference disadvantage = D3 bestScore < 0
root actor continuation = P_REFERENCE_D2_BEST
primary imperfect opponent = P_MEDIUM_D1_TOP3
primary replicates = 12 per exact root move
bounded endpoint horizon = 96 post-root plies
zeroPromotedCandidatesAllowed = true
```

Within each historical trajectory, the assigned-phase root candidate is selected by frozen hash rank before D3 reference disadvantage is inspected. If the selected state fails the D3 disadvantage criterion, no replacement state from that trajectory is allowed. This prevents retrospective selection of a more favorable disadvantaged state.

Candidate matching was bounded prospectively to templates `PCEM-T1..T8`; outcome fields and reference-score magnitude are forbidden in the matcher. Promotion requires the frozen support, diversity, comeback-difference, first-reply reference-error, defense-concentration, and conditional error-dependence gates. Human difficulty/error claims remain unauthorized.

The frozen byte hashes are:

```text
STAGE_1_EXPLORATORY_SPEC.json
26a7daea8588a460e19ae8e77485c50a092d714bfb3243608b5b64a95fa3fe22

STAGE_1_FEATURE_DEFINITIONS.json
3f1e622c86fca8d4153baca815000234cd1672ad5a6a259aaae4ffea4a6e84d6
```

## 2026-08-25 — Stage 1 pre-authorization contract PASS

Workflow `32814139745` completed successfully at head `c40679a93ab0e01899496e889f42476a3ac10339` before authorization existed.

The workflow checked only pre-outcome contract properties:

- frozen spec validation;
- production/independent primitive agreement;
- scientific runner hard-block when authorization is absent.

No Stage 1 scientific seed block was generated by this workflow.

## 2026-08-25 — Stage 1 hash materialization and authorization

Hash materialization workflow `32814274403` produced artifact `9550850177` and digest `sha256:86d78ce3a88e65361aeae17bc0bae7d8d2f9b8c887a0e54b184f571f8d5ff270`.

A separate `STAGE_1_EXPLORATORY_AUTHORIZATION.json` was then created at commit `6c7b8c53127f6b47f802d2d0af1ac14bba24d180`. It binds:

- the exact Stage 1 spec SHA-256;
- the exact feature-definition SHA-256;
- 12 scientific source-file SHA-256 values;
- the 3072-game Stage 1 seed block;
- the reserved, non-consumable Stage 2 seed block.

Authorization semantics are:

```text
stage1GenerationAuthorized = true
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

Any source/spec/feature hash mismatch or dirty scientific source tree blocks generation. Stage 2 remains unauthorized. No Stage 1 scientific outcome had been generated at the moment of authorization.
