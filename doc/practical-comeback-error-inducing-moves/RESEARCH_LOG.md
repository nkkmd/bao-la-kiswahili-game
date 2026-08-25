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

Stage 0 remains `scientificInferenceAuthorized = false`. No scientific prevalence/effect/candidate result was generated. The study now moves to prospective Stage 1 design freeze; Stage 1 remains unauthorized until an exact spec and separate authorization are bound.
