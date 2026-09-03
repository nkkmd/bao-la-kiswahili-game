# CLGR-STUDY1 — Final Report

Date: 2026-09-03

## 1. Final decision

**`CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID`**

Research Generation 3 program position: **G3-09 — Continuous Local-Geometry Representation Study 1**.

Formal representation eligibility was **not established**. Stage 1 development passed its prospectively frozen gates, but the exactly-one fresh Stage 2 formal execution failed closed during required depth-5 RAW enumeration. Because the failure occurred after fresh Stage 2 evidence access, the Study is closed without rerun or rescue.

## 2. Study question and claim boundary

The Study asked whether bounded RAW local game-tree geometry could be retained as a reproducible continuous multiaxial representation rather than prematurely reduced to binary candidates or discrete event classes.

The only primary representation was prospectively fixed as:

`CLGR-R1-EXACT-SQUASHED-L1`

with six exact axes derived from the formally eligible `LGTGMIV-STUDY1` F1-F5 measurement foundation at RAW-only relative depth 5. Each nonnegative exact rational axis value `q=n/d` was transformed data-independently to `n/(n+d)`, with equal axis weight and exact L1 distance. No learned weights, PCA, clustering, z-score, phase-specific scaling, post-development feature selection or other data-dependent representation family selection was allowed.

The Study did **not** test or claim win probability, human difficulty, best-move correctness, causal mechanism, strategic regime validity or game-theoretic forcing.

## 3. Upstream and protected-evidence boundary

Immutable upstream state was preserved:

- `LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`
- eligible measurement families = F1-F5
- representation = RAW-only
- relative depth = 5
- validated transform set = `[]`
- G3-08 partial Stage 1 measurements = prohibited as G3-09 scientific input
- G3-08 `relay-limit` knowledge = technical-design-only
- G3-04/G3-07 formal outcomes = context only, not representation-selection input

The standard-initial complete exact RAW depth-10 holdout remained:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

throughout the Study.

## 4. Prospective Study contract

Reviewed baseline remote `main`:

`6c218b9cc3f492fb96d051768702682fef9bb66a`

Research branch:

`research/g3-09-continuous-local-geometry-representation`

Formal stages:

- `CLGR-S0-TECHNICAL-2026-09-03-v1` / technical-only
- `CLGR-S0-TECHNICAL-2026-09-03-v2` / technical-only replacement version after pre-fresh v1 technical failure
- `CLGR-S1-DEVELOPMENT-2026-09-03-v1`
- `CLGR-S2-FORMAL-2026-09-03-v1`

Scientific seed namespaces:

- Stage 1 = `31910001..31910256`
- Stage 2 = `31920001..31920384`

Technical seeds `31909001..31909008` were permanently excluded from scientific use.

## 5. Stage 0

Stage 0 v1 failed before any fresh scientific access because the synthetic relay-limit negative-control expectation was over-specific to an implementation error string. v1 was not rerun.

Because the scientific contract had not been crossed and no Stage 1/2 seed had been read, a separately versioned fresh-free technical v2 was allowed without changing the representation, feature universe, scientific population, seed namespaces, gates or resource ceilings.

Stage 0 v2:

```text
workflow run = 33748876201
result artifact = 9890713293
artifact ZIP SHA-256 = 4f5b63b30146aa97b30f5adfa2b615eb360cba77236d6288042b2c320c72041b
stage disposition = STAGE0-PASS
fresh Stage 1 access = false
fresh Stage 2 access = false
protected depth-10 access = false
```

Production and independent implementations agreed exactly on bounded depth-5 reconstruction, six axes, transformed coordinates and exact L1 distance for the technical fixtures.

## 6. Stage 1 development

Fresh Stage 1 was separately authorized only after a fresh-free static preauthorization audit passed. The authorization permitted exactly one execution and explicitly prohibited seed extension, root replacement, same-evidence rerun, Stage 2 access and protected depth-10 access.

Exactly-one Stage 1 execution:

```text
workflow run = 33750400172
result artifact = 9891394814
lease artifact = 9891283252
artifact ZIP SHA-256 = 6a8ebc0d242027ad6a634555a290df1284626839e4397e87b06551e2fc726fc9
population = 24 Namua + 24 Mtaji = 48
stage disposition = STAGE1-PASS
stage2Eligible = true
canonical scientific result SHA-256 = 1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529
```

Prospectively frozen development gates passed:

- population complete: 48/48
- all six axes defined
- production/independent RAW reconstruction exact
- production/independent coordinates exact
- full pairwise exact L1 distance matrix exact
- `k=3` tie-inclusive neighborhood exact
- root-order invariance exact
- distinct coordinate vectors: Namua 24 / Mtaji 24, each above minimum 8
- axes with at least four distinct values in both phases: 6/6, above minimum 4

Stage 1 was development evidence only. Passing Stage 1 did not itself establish a formal eligible representation and did not automatically authorize Stage 2.

## 7. Stage 2 formal authorization

Stage 2 was separately reviewed after Stage 1 exact-byte mirroring and identity-only exclusion materialization.

The Stage 2 formal input did not retain Stage 1 coordinate values, favorable axis directions, learned weights or any refitted representation family. Stage 1 contributed only its prospectively allowed formal eligibility gate result and 48-root identity exclusion needed to prevent evidence overlap.

Fresh-free Stage 2 preauthorization audit:

```text
workflow run = 33751580785
audit artifact = 9891748675
audit disposition = STAGE2-PREAUTH-STATIC-AUDIT-PASS
fresh Stage 2 seed access = false
protected depth-10 access = false
```

The formal population was frozen at 36 Namua + 36 Mtaji = 72 roots and the execution ceiling remained exactly one.

## 8. Stage 2 formal result

Exactly-one fresh Stage 2 execution:

```text
workflow run = 33751818456
result artifact = 9892142995
lease artifact = 9891829617
artifact ZIP SHA-256 = 7fbb28407a1233911b581875c76bef44287cd5f21cc63ab7405f3ec621c94e26
formal-result JSON SHA-256 = 11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73
selected population = 36 Namua + 36 Mtaji = 72
completed root measurements before fail-closed = 61
formal decision = TECHNICAL-INVALID
scientific summary authorized = false
same-evidence rerun authorized = false
protected depth-10 access = false
```

The required exact depth-5 RAW reconstruction failed at formal root index 61:

```text
phase = mtaji
source seed = 31920066
root RAW SHA-256 = e2260d76b2f40fa24ebe2183ca0cc865f48dc7c951737414ef8c498143b8087c
technical error = relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b
```

This is a technical execution failure, not evidence that the continuous representation is scientifically eligible or not eligible.

No formal nondegeneracy summary, phase comparison, downstream usefulness claim or representation-level scientific inference may be derived from the 61 partial formal measurements.

## 9. Exact artifact preservation

The Stage 2 immutable Actions artifact was verified by exact hashes and mirrored to:

`results/stage-2/`

through technical-only mirror run `33752894852`. The mirror workflow did not authorize or execute scientific recomputation.

Authoritative Stage 2 files include:

- `results/stage-2/STAGE_2_SELECTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-2/STAGE_2_FORMAL_RESULT.json`

The formal-result repository blob SHA at closure is recorded in `REPRODUCIBILITY_INDEX.md` together with workflow/artifact provenance.

## 10. Scientific interpretation

The correct Study-level interpretation is:

**The prospectively fixed continuous representation passed the fresh development gate but did not complete the fresh formal holdout; therefore formal eligibility remains unestablished.**

The following conclusions are prohibited:

- `CLGR-R1-EXACT-SQUASHED-L1` is formally eligible
- `CLGR-R1-EXACT-SQUASHED-L1` is formally not eligible
- the 61 partial Stage 2 roots validate or invalidate any axis
- Stage 2 partial measurements establish phase differences or neighborhood stability
- the failure may be repaired inside `CLGR-STUDY1`

Stage 1 development PASS remains part of immutable Study provenance, but it is not a substitute for the failed formal holdout.

## 11. No-rescue boundary

Stage 2 fresh access occurred and the seed block is consumed. For `CLGR-STUDY1`, the following are permanently prohibited:

- same-evidence rerun
- rerunning seed `31920066` after changing relay-limit handling
- seed extension or replacement
- root replacement
- resource ceiling relaxation
- feature addition or deletion
- normalization or transform change
- weighting change
- distance metric change
- representation-family change
- formal endpoint or nondegeneracy-gate change
- favorable subgroup selection
- using the 61 partial formal measurements as a completed formal sample

A future relay-limit-safe continuous-representation study would require a new prospective independent Study/version and separate authorization. It must not be described as completion or repair of `CLGR-STUDY1`.

## 12. Downstream program boundary

Historical `PROGRAM_PLAN.md` is unchanged.

Because G3-09 did not establish a formally validated continuous representation, G3-10 is **not automatically authorized** by this closure. Any G3-10 action requires a separate post-G3-09 current-state authorization review that considers whether its stated dependency on validated local-geometry coordinates is satisfied or whether a new prerequisite is required.

No decision on G3-10 scientific execution is made by this report.

## 13. Final closure

```text
G3-09 / CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID
Stage 0 v1 = TECHNICAL-INVALID / PRE-FRESH / NO RERUN
Stage 0 v2 = STAGE0-PASS
Stage 1 = STAGE1-PASS / exactly one fresh execution / seed block consumed
Stage 2 = TECHNICAL-INVALID / exactly one fresh execution / seed block consumed
formal continuous-representation eligibility = NOT ESTABLISHED
Stage 2 partial formal scientific reuse = PROHIBITED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

This closes the scientific Study on the research branch. Repository/document consistency review may proceed, but integration into `main` requires explicit user instruction.
