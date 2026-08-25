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
study = ACTIVE-STAGE1-EXPLORATORY-AUTHORIZED
Stage 0 = TECHNICAL-PASS
Stage 1 = AUTHORIZED-NOT-YET-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
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

## Stage 1 frozen exploratory design

The Stage 1 spec is immutable scientific input. Its embedded `status = prospective-frozen-not-authorized` records the state at which the spec itself was frozen; authorization is intentionally a separate later artifact and does not rewrite the frozen spec.

```text
stageId = PCEM-S1-EXPLORATORY-2026-08-25-v1
specSha256 = 26a7daea8588a460e19ae8e77485c50a092d714bfb3243608b5b64a95fa3fe22
featureDefinitionsSha256 = 3f1e622c86fca8d4153baca815000234cd1672ad5a6a259aaae4ffea4a6e84d6
source games = 3072
Stage 1 seeds = 23200001..23203072
Stage 2 reserved seeds = 23300001..23306144
selected-root target = 300 (Namua 150 / Mtaji 150)
primary imperfect opponent = P_MEDIUM_D1_TOP3
primary replicates per exact root move = 12
bounded continuation horizon = 96 post-root plies
```

The disadvantaged-root rule is outcome-blind at selection time: one state is hash-ranked within the assigned phase before reference disadvantage is inspected; it is eligible only if the frozen D3 reference best score is `< 0`. No replacement within trajectory is permitted after reference failure.

## Stage 1 authorization

Stage 1 exploratory generation was authorized only after the pre-authorization contract workflow succeeded.

```text
pre-authorization workflow = 32814139745
pre-authorization head = c40679a93ab0e01899496e889f42476a3ac10339
pre-authorization conclusion = success
hash-materialization workflow = 32814274403
hash-materialization artifact = 9550850177
authorization commit = 6c7b8c53127f6b47f802d2d0af1ac14bba24d180
stage1GenerationAuthorized = true
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

The authorization binds the exact spec/feature-definition hashes and 12 scientific source-file SHA-256 values. Any scientific source, spec, or feature-definition mismatch blocks generation. The Stage 1 runner also blocks a dirty scientific source tree.

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

## Stage 0 technical decisions available to Stage 1

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

Execute the authorized Stage 1 exploratory workflow from the hash-bound source/spec state. Production generation must be followed by independent reconstruction/verification before any Stage 1 exploratory result is treated as valid. Stage 2 remains unauthorized regardless of Stage 1 execution until the frozen Stage 1 promotion result is independently verified and a separate prospective Stage 2 authorization is created.
