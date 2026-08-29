# MDFT-STUDY1 — Stage 1 Technical Preflight / Source Freeze

日付: 2026-08-30 (JST)

## Disposition

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 scientific seed block = RESERVED / UNCONSUMED
Stage 1 scientific execution = NOT YET STARTED at this checkpoint
```

## Canonical fail-closed preflight

```text
run = 33258188633
head = 652af9a82c81f1a886436e422b16ac8ce99e151f
artifact = 9716460551
artifact digest SHA-256 = b78428700889f24073c4cd0ada6c599dc34096fdd05d4e7139de3f07681cb2a9
specSha256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
```

Technical-only corpus:

```text
seeds = 8082001..8082128
games = 128
selected roots = 16
scientific seed overlap = false
```

Exact equality:

```text
source generation = PASS
root selection = PASS
analysis = PASS
forced F10 = PASS
canonical payload = PASS
```

Resource / preservation evidence:

```text
production projected scientific wall clock = 719257.2435359999 ms
independent projected scientific wall clock = 666893.623536 ms
observed max RSS = 101988 KB
projected both-side gzip = 1441216 bytes
8 MiB transfer probe = PASS
workflow timeout ceiling = 120 minutes
```

Preflight output intentionally reported no target distribution and no candidate-leaf prevalence/promotion result.

## Scientific wrapper readiness

```text
run = 33277031634
conclusion = success
scientific execution performed = false
```

The scientific wrapper passed syntax and exact spec-binding checks while the authorization file was absent.

## Source freeze

Machine-readable source freeze:

```text
preregistration/STAGE_1_SOURCE_FREEZE.json
```

Source-freeze base commit:

```text
6a56b5ab0592704b5b78d68aa573ac63b2ef92d2
```

The freeze binds the Stage 1 spec, production and independent implementations, Stage 0 search implementations, SRDR controlled-search helper, engine, AI evaluator, weights, PRNG helper, scientific wrapper and scientific workflow by Git blob SHA.

No source listed in that freeze may change after scientific execution authorization without abandoning this Stage 1 version before seed consumption. After consumption, repair/replacement/rerun/extension of the same scientific block is not authorized.

## Authorization boundary

This checkpoint itself is not execution authorization. A separate authorization artifact is required. The authorization must bind:

- exact Stage 1 spec hash;
- exact 28910001..28914096 block;
- canonical preflight run 33258188633;
- source blob list from `STAGE_1_SOURCE_FREEZE.json`;
- consume-once/no-rerun rule;
- mandatory full production and independent artifact preservation.
