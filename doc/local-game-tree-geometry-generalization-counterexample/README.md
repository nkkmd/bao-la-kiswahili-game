# LGTGGC-STUDY1 — Local Game-Tree Geometry Generalization / Counterexample Study 1

## Current status

```text
Program position = Research Generation 3 / G3-12
Program authorization = G3-12-AUTHORIZED
Study ID = LGTGGC-STUDY1
Study lifecycle = CLOSED / TECHNICAL-INVALID
Stage 0 active = LGTGGC-S0-TECHNICAL-2026-09-04-v3 / STAGE0-PASS
Stage 1 = LGTGGC-S1-DEVELOPMENT-2026-09-04-v1 / EXECUTED EXACTLY ONCE / TECHNICAL-INVALID
Stage 2 = LGTGGC-S2-FORMAL-2026-09-04-v1 / NOT AUTHORIZED / NOT EXECUTED
Formal generalization decisions = NONE
Formal counterexample decisions = NONE
source main = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
research branch = research/g3-12-local-game-tree-geometry-generalization-counterexample
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## 研究目的

G3-04、G3-07、G3-10でformal confirmationを得たbounded local-game-tree geometry claimを、新しいsource policyとreachable-root familyへprospectively移し、同じ方向に再現するdomain、再現しないdomain、反対方向のcounterexampleが成立するdomainをfresh evidenceで確定することを目的とした。

G3-12はupstream negative / null / technical-invalid resultを救済するStudyではない。

## Formal upstream targets

- G3-04: C1 `MTAJI-GREATER`、C6 `NAMUA-GREATER`
- G3-07: SC1 / SC2 / SC3の`G1 ROOT-LEGAL-WIDTH × E3 RANKING-PREORDER-CHANGE = HIGHER-IN-HIGH`
- G3-10: C1 `ACTUAL-GREATER`、C2 `ACTUAL-GREATER`、C3 `ACTUAL-LESS`、C5 `ACTUAL-GREATER`

G3-10 C4、G3-02/03/05/06/08/09 technical-invalid family、G3-07 non-confirmed/non-estimable familyはpositive targetではない。

G3-11 `FDEGHV-STUDY1`はsingle standard-root depth-10 historical exact anchor / boundary referenceに限定し、generalization targetにしない。

## Active transfer matrix

Pre-fresh technical amendment後のsource policies:

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-MAX-CAPTURE
```

Reachable-root families:

```text
RF1 = EARLY-ANCHOR
RF2 = LATE-ANCHOR
```

Historical base protocol/specに残る`P2-CAPTURE-FIRST`はpre-Stage0 provenanceであり、authoritative legal-move semanticsとのnon-identifiabilityがscientific access前に判明したためactive execution contractではない。

## Execution summary

### Stage 0

```text
V3 Actions run = 33843233392
stage disposition = STAGE0-PASS
technical core SHA-256 = 79a34669df5e5d80c179dbb40e2a8e6b8b3e58e05747ef0c1b21d7e493e8a834
```

### Stage 1

Exactly-once Actions run:

`33848876682`

SFCDF:

```text
STAGE1-PASS
384 seeds read
40 pairs / 80 roots
80 defined roots
production/independent exact
formal inference = false
```

SILGM:

```text
STAGE1-TECHNICAL-INVALID
fatal error = complete root ranking required
formal inference = false
```

The frozen LOW population permits legal-width-1 roots, while inherited SILGM production/independent helpers hard-require at least two ranked root candidates. The compatibility gap was not caught by Stage 0 fixtures. Fresh access had already occurred, so the helper is not corrected and the same evidence is not replayed.

GCLD:

```text
NOT EXECUTED / Stage 1 seed block UNREAD
```

### Stage 2

**`LGTGGC-STAGE2-NOT-AUTHORIZED`**

Stage 2 seed blocks remain unread. No formal generalization/counterexample inference was performed.

## Final interpretation

**`LGTGGC-STUDY1 = CLOSED / TECHNICAL-INVALID`**

The prospectively frozen capstone execution did not reach formal held-out Stage 2, so G3-12 did not establish a formal boundary for generalization, non-generalization, or counterexample domains.

SFCDF Stage 1 PASS is development readiness evidence only and is not promoted to a formal G3-04 transfer result. Upstream G3-04/G3-07/G3-10 decisions remain unchanged.

## Protected boundary

```text
G3-11 depth-10 = CONSUMED EXACTLY ONCE / HISTORICAL READ-ONLY RESULT ONLY
G3-11 same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT AUTHORIZED / NOT USED
validated transform set = []
Stage 2 fresh access = 0
```

## Canonical documents

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`PROSPECTIVE_TECHNICAL_AMENDMENT_V2.md`](PROSPECTIVE_TECHNICAL_AMENDMENT_V2.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`STAGE_1_FAILURE_INDEPENDENT_AUDIT.md`](STAGE_1_FAILURE_INDEPENDENT_AUDIT.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`results/stage-1/STAGE_1_EXECUTION_RECORD.json`](results/stage-1/STAGE_1_EXECUTION_RECORD.json)
- [`../research-program-decisions/2026-09-04-post-g3-11-g3-12-authorization-review.md`](../research-program-decisions/2026-09-04-post-g3-11-g3-12-authorization-review.md)
- [`../research-program-decisions/2026-09-04-post-g3-12-stage0-stage1-authorization-review.md`](../research-program-decisions/2026-09-04-post-g3-12-stage0-stage1-authorization-review.md)
- [`../research-program-decisions/2026-09-04-post-g3-12-stage1-stage2-authorization-review.md`](../research-program-decisions/2026-09-04-post-g3-12-stage1-stage2-authorization-review.md)

Historical `doc/research-generation-3/PROGRAM_PLAN.md` is not retroactively modified.
