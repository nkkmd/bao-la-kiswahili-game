# 2026-08-28 — STSCV Stage 0 technical validation success

## Status

```text
Study = STSCV-STUDY1
Stage = STSCV-S0-TECHNICAL-2026-08-28-v1
Decision = STSCV-STAGE0-TECHNICAL-PASS
Scientific inference = NOT AUTHORIZED
Stage 1 generation = NOT YET AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

## Canonical technical execution

```text
workflow run = 33143414612
job = 98759117746
head SHA = 0b60be6f419d393cc6f2f2ed3b520a6ae1ac14e9
artifact ID = 9674826941
artifact ZIP SHA-256 = bf612fb1e7a592aad9c17d6f6ecf16c6cc65e72267614eebfc26d7127b56e835
```

All 12 Stage 0 gates passed.

## Control behavior

```text
STSCV-C00-IDENTITY: 0 mismatches across 3 technical fixtures
STSCV-C01-LR-NO-DIRECTION-FLIP: 11 mismatches across 1 technical fixture
```

Thus the positive control passes and the deliberately broken negative control is detected.

## Technical-only candidate diagnostics

The following provisional transform implementations had zero mismatch on the small technical fixture set:

```text
STSCV-T01-SEAT-SWAP-LOCAL
STSCV-T02-LR-MTAJI-HOUSELESS
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

These are explicitly **not scientific validation results**. They authorize only freezing a finite Stage 1 candidate contract for fresh development evidence.

## Requested-family classification

Before Stage 1 outcome generation, Stage 0 classified the requested transform ideas by current rule semantics:

- player swap -> unique provisional candidate T01;
- player swap + physical board rotation -> semantic alias of T01 under player-local engine coordinates;
- left-right reflection -> restricted provisional candidate T02 only in Mtaji houseless scope;
- pit-index reversal -> component of T02, not a standalone candidate;
- direction inversion alone -> non-candidate;
- FRONT/BACK row remapping -> non-candidate;
- player-relative orientation -> represented by T01/T03 local-coordinate candidates;
- required seat+LR composition -> provisional candidate T03.

This classification is source/representation reasoning plus technical fixture validation, not a response to fresh scientific candidate outcomes.

## Outcome-blind resource audit

The resource audit applied no non-identity transform.

```text
technical seeds = 26030001..26030032
trajectories = 32
max ply = 80
trajectory relay-limit hits = 0
Namua coverage = 32 / 32
Mtaji coverage = 26 / 32
Namua depth-2: 4 roots / 111 raw states / 107 edge occurrences / max branching 10
Mtaji depth-2: 4 roots / 41 raw states / 37 edge occurrences / max branching 6
local graph relay-limit hits = 0
```

## Provenance hashes

```text
engine = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
Stage 0 spec = 2047e8a0aea420183562005ba98b120b75ac44d9ac82962d73ea183dc88cb5e4
production transform source = 68fa955c4601736f83c08caea242a37d46fead78c94b2939b9d1553a996428b1
independent transform source = c5b69be309a6fdfc31ebadaba9d388d480b0a95e3f76529a4e28d56e1af881b8
runner source = cc0aae9301d85566d9fcc1cfb3094462de82a9d760c7a45eb86527354679eb3b
```

## Next boundary

A separate Stage 1 candidate/population/source contract and explicit authorization must be frozen before fresh Stage 1 development generation. No Stage 0 fixture, technical seed, or prior SIP/ORISC row may be imported as Stage 1 evidence.
