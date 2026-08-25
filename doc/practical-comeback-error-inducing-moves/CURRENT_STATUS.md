# PCEM-STUDY1 — Current Status

Updated: 2026-08-25

## Study identity

```text
studyId = PCEM-STUDY1
slug = practical-comeback-error-inducing-moves
branch = research/practical-comeback-error-inducing-moves
studyStartMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
```

## Current stage

```text
study = ACTIVE-STAGE1-DESIGN-FREEZE
Stage 0 = TECHNICAL-PASS
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
scientificOutcomeGenerated = false
```

## Stage 0 canonical record

```text
stageId = PCEM-S0-TECHNICAL-2026-08-25-v1
canonical source commit = 29976182dcdcabf206a1d0bf59252fe8bb2288df
workflow run = 32813154014
job = 97696278964
artifact = 9550497573
artifact digest = sha256:0021c59fea047c0a192b0e9394513d63aba6347a02d79b1ce41b1bf6e61e2d32
production = PASS (12/12 technical gates)
independent verification = TECHNICAL-PASS (8/8 gates)
```

Technical coverage:

```text
fixtures = 3
phases = Namua + Mtaji
exact root moves = 15
exact first replies = 38
continuation rows = 60
accounted rows = 60
production elapsed = 4857.528147 ms
max RSS = 94.82421875 MiB
production payload = 350925 bytes
```

The first workflow run `32813015855` remains recorded as an invalidated technical attempt. Production passed and the independent measurements matched, but the verifier independence audit self-matched its own forbidden-module regex literals. The corrected verifier audit was rerun from a new commit; the complete workflow then passed. No scientific outcome was used in this correction.

## Fixed at research start and retained

1. The study is prospective and independent; no upstream decision may be rescued or re-adjudicated.
2. Authoritative state identity is RAW-ONLY: `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`.
3. Missing `pending` is invalid before engine entry.
4. Seed conservation is mandatory: `sum(pits) + sum(reserve) + sum(pending) = 64`.
5. Symmetry reduction and transform-based deduplication are forbidden.
6. Strongest-policy quality, practical comeback frequency, reply narrowness, error dependence, machine reply difficulty and move optimality gap are separate constructs.
7. Human difficulty/psychology claims are outside scope unless a future separately authorized human study is performed.
8. Stage 0 is technical-only and cannot supply scientific evidence.
9. Stage 1 and Stage 2 must use fresh non-overlapping evidence blocks.
10. Stage 1 zero promoted candidates is a legitimate outcome and does not authorize rescue.
11. No merge, auto-merge or branch deletion is authorized without explicit user instruction.

## Stage 0 technical decisions now available for Stage 1 design

The following measurement machinery is technically validated:

- exact RAW pre-entry validation;
- exact legal root-move enumeration and application;
- exact first-reply enumeration;
- deterministic D2/D3 reference-search tables under `pcem-exact-full-window-root-candidates/bao/q0/v1`;
- asymmetric continuation with a reference-policy root actor and seeded imperfect opponent;
- common-random-number binding by root + replicate index;
- bounded terminal/cutoff outcome accounting;
- independent full recomputation.

Stage 0 did **not** validate any scientific threshold, population prevalence, comeback effect, candidate grammar or promotion floor.

## Immediate next step

Freeze the complete Stage 1 exploratory specification using only the immutable upstream boundaries, construct logic and technical/resource feasibility. Then bind a separate Stage 1 authorization to that exact spec/source state before any fresh scientific generation.
