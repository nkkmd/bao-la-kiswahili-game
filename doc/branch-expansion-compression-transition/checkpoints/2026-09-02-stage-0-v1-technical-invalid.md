# BECT-STUDY1 checkpoint — Stage 0 v1 TECHNICAL-INVALID

Date: 2026-09-02

## Formal disposition

**`BECT-S0-TECHNICAL-2026-09-02-v1 = TECHNICAL-INVALID`**

This disposition has no G3-05 scientific outcome and does not authorize Stage 1.

## Execution provenance

```text
workflow = BECT Stage 0 Technical
run = 33631597307
job = 100252124483
head SHA = 4e34e624740df600182206dbde54827d7b071ee8
formal Stage 0 v1 executions authorized = 1
formal Stage 0 v1 executions actual = 1
branch advancement allowlist gate = PASS
frozen source binding gate = PASS
fixture/replay step = FAIL
artifact upload = NOT REACHED
```

## Failure cause

The authorized technical runner used the non-scientific technical seed `31500001` and assumed that its trajectory would remain nonterminal through exact ply 26 so that plies 24 and 25 could be used as adjacent depth-5 technical roots.

The trajectory terminated earlier. The runner therefore failed at its explicit guard with:

```text
Error: technical trajectory ended before ply 26
```

This is a technical fixture-design failure: the fixed replay seed was validly consumed as technical-only evidence, but the assumed minimum technical trajectory length was not guaranteed by the frozen fixture contract.

## Evidence boundary

The runner executed synthetic technical endpoint/event fixtures before reaching the replay-length guard. It did **not** access any G3-05 fresh scientific population.

```text
technical seed 31500001 access = true / TECHNICAL-ONLY
Stage 1 seed 31510001..31510240 access = false
Stage 2 seed 31520001..31520384 access = false
fresh G3-05 scientific evidence generated/read = false/false
protected depth-10 access = false
```

No G3-03/G3-04 outcome value was used to cause or repair this failure.

## No rerun boundary

The v1 Stage ID and nonce are consumed. `BECT-S0-TECHNICAL-2026-09-02-v1` will not be rerun.

A revised technical Stage 0 version, if authorized, must be prospectively versioned and may change only the technical replay/root-selection fixture needed to remove the invalid fixed-length assumption. It must not change the frozen scientific endpoint universe, transition grammar, Stage 1/2 seeds/populations, resource ceilings, formal inference or protected-evidence boundary.
