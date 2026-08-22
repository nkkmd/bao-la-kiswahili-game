# 2026-08-22 — Stage 2 formal design freeze / tooling materialized

## Scope

This checkpoint records the prospective Stage 2 formal-confirmation design after Stage 1 exploratory discovery was integrated to `main`.

It is a **pre-authorization checkpoint**. No Stage 2 scientific corpus has been generated.

## Baseline

```text
integrated main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 branch = research/blunder-misvaluation-patterns-stage2-formal
studyId = BMP-STUDY1
stageId = BMP-S2-FORMAL-2026-08-22-v1
```

## Frozen candidate/spec identity

```text
candidate freeze ID = BMP-S2-CANDIDATES-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 097aa6450f270254ec6dee2a7fd7e74a2d8298cae36923a39e822b2137172730
```

Formal mapping:

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share one frozen Namua support group/root denominator; C04 uses one Mtaji support group.

## Fresh population freeze

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
opening = seeded-uniform exact E.moveVariants for first 8 plies
```

Generation strata:

```text
B-D1 683
B-D2 683
B-D3 683
LS-D2 683
V2-D2 682
LE-D2 682
```

## Identity firewall freeze

Required final Stage 1 overlap:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

Trajectory/opening overlap is removed before root selection. Rule-state overlap is removed only after outcome-blind root selection and does not trigger an alternate root.

No replacement and no seed extension.

## Formal estimability freeze

Per candidate:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Failure -> `INCONCLUSIVE-NOT-ESTIMABLE`.

## Formal endpoint / multiplicity freeze

Two co-primary recurrence endpoints per candidate:

```text
failure signature: exact one-sided binomial H0 p<=0.50; observed floor >=0.65
D3 inferior:       exact one-sided binomial H0 p<=0.50; observed floor >=0.70
```

Eight planned tests use Holm-Bonferroni at FWER 0.05.

Additional confirmation gates:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

## Verification firewall

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal measure
-> independent formal measurement verification
-> formal evaluate
```

The independent measurement verifier recomputes selected-root identity, legal moves, support-group match, deterministic candidate move, exact D3 candidate tables, D3 inferior/TopSet/rank loss, the four frozen failure tokens, and the three-axis Stage 1 identity firewall.

## Tooling materialized

```text
tools/experiments/validate-blunder-misvaluation-stage2-formal-spec.js
tools/experiments/lib/blunder-misvaluation-stage2-formal.js
tools/experiments/lib/blunder-misvaluation-stage2-corpus.js
tools/experiments/run-blunder-misvaluation-stage2-formal.js
tools/experiments/verify-blunder-misvaluation-stage2-formal.js
tools/experiments/evaluate-blunder-misvaluation-stage2-formal.js
test/blunder-misvaluation-stage2-contract.test.js
test/blunder-misvaluation-stage2-tooling.test.js
.github/workflows/blunder-misvaluation-stage2-contract.yml
.github/workflows/blunder-misvaluation-stage2-tooling.yml
```

## Current authorization state

```text
local technical validation = PENDING
exact scientific source-file SHA-256 freeze = PENDING
STAGE_2_FORMAL_AUTHORIZATION.json = ABSENT
Stage 2 scientific generation = NOT AUTHORIZED
formal result = NONE
```

The next allowed step is the technical validation sequence in `STAGE_2_EXECUTION_RUNBOOK.md`. Generation must remain fail-closed until a separate source-bound authorization is committed.
