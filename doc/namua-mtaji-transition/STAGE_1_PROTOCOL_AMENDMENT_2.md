# Stage 1 Protocol Amendment 2 — Exact-Ply Risk-Set Comparator Feasibility Audit

Date: 2026-08-11  
Status: **FROZEN BEFORE SUPPLEMENTAL AUDIT EXECUTION**  
Study: Namua→Mtaji Strategic Temporal Transition

## 1. Why this amendment exists

The completed 192-game Stage 1 exploratory pilot established two design facts before Stage 2 freeze:

1. surviving standard trajectories reach first Mtaji at deterministic ply 44;
2. the inherited Stage 6 comparator family has no progression overlap with the observed CBE event.

Observed Namua Category-A support after trajectory-ply duplicate collapse is only:

```text
capture-branch-expansion = 1 unique trajectory-ply unit
capture-branch-convergence = 1 unique trajectory-ply unit
temporary-spike = 0 unique trajectory-ply units
```

The CBE unit occurs at ply 33, while the convergence unit occurs at ply 29. Direct reuse of the old comparator family would therefore confound phenotype class with deterministic Namua progression.

This amendment adds a **support-only comparator audit** using the already-consumed Stage 1 corpus. It does not authorize a new scientific effect analysis.

## 2. Scientific boundary

This audit remains Stage 1 exploratory design work.

Required flags/interpretation:

```text
formalExperiment = false
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
```

Explicitly prohibited:

- p-values;
- hypothesis tests;
- morphology effect sizes;
- M1/M2 contrast optimization;
- comparator selection based on observed M1/M2 outcome direction;
- threshold/classifier modification;
- use of the pilot as later held-out confirmation.

## 3. Exposure identity

Exposure units are frozen inherited phenotype events satisfying:

```text
Category A
candidate phase = namua
classification = capture-branch-expansion
ascertainment complete through candidatePly + 8
```

Before comparator construction, duplicate exposure rows are collapsed by:

```text
historicalTrajectoryHash + candidatePly
```

Condition labels attached to an identical deterministic trajectory-ply unit are metadata, not independent exposed units.

The audit may nevertheless examine same-condition control availability separately for each condition in which the duplicate exposed trajectory appears.

## 4. Why exact ply is the progression anchor

For surviving standard Namua trajectories:

```text
total reserve at observation ply t = 44 - t
```

Therefore matching on exact `candidatePly` exactly matches total remaining reserve under the audited engine semantics.

The audit must verify, rather than merely assume, that candidate and landmark reserve totals satisfy the deterministic clock invariant for every eligible control.

The audit must not treat candidate ply and total reserve as two independent matching dimensions.

## 5. Base risk-set eligibility

For each exposed CBE unit at candidate ply `t`, a control game is base-eligible for a given exposure-condition row only if all are true:

1. `conditionId` equals the exposure row condition;
2. its complete historical trajectory differs from the exposed trajectory;
3. an observation exists at ply `t`;
4. that observation is `phase == namua` and non-terminal;
5. an observation exists at landmark `t + 8`;
6. therefore phenotype ascertainment support is complete through `t + 8`;
7. the control is not the same `historicalTrajectoryHash + candidatePly` unit as the exposure.

Do **not** require later Mtaji reachability for base eligibility, because doing so would condition comparator inclusion on a downstream outcome.

Later Mtaji/morphology eligibility may be counted only as an availability diagnostic.

## 6. Nested comparator-support families

The audit must report the following nested families separately.

### R0 — Same condition + exact ply

All base-eligible control trajectories.

Purpose: maximum progression-matched support.

### R1 — R0 + non-Category-A index state

Exclude controls whose exact `gameId + candidatePly` is itself an inherited Category-A representative.

Purpose: compare an exposed transition phenotype with an ordinary state at the same progression point rather than another Category-A event at the same index.

### R2 — R1 + same forced-capture status

Require control `actor.forcedCapture` at candidate ply to equal the exposed CBE event's forced-capture status.

Purpose: test whether a context-matched ordinary-state comparator is available without adding forced-capture membership to the CBE definition.

This is comparator restriction only; it does **not** redefine CBE.

### R3 — R2 + no Namua CBE anywhere in control trajectory

Exclude any control historical trajectory containing an inherited Category-A CBE event anywhere in Namua in the Stage 1 event table.

Purpose: audit a cleaner trajectory-level unexposed comparator family.

This family is potentially stricter than needed and is not automatically preferred.

## 7. Duplicate collapse

Within every risk-set family, report both:

- raw eligible game rows;
- unique historical trajectories.

The primary support count for design decisions is the unique historical-trajectory count.

Also report duplicated historical-trajectory condition sets across the full pilot so later design can avoid counting deterministic duplicates as independent information.

## 8. Progression invariants to verify

For every exposure and eligible control:

At candidate ply `t`:

```text
total reserve = 44 - t
```

At landmark `t + 8`, where that observation remains Namua:

```text
total reserve = 44 - (t + 8)
```

Any violation must be reported and the audit must fail closed rather than silently treating exact ply as progression matched.

Actor/opponent reserve values may also be reported for parity verification.

## 9. Structural support diagnostics

For each risk-set family, report support/ranges only for prespecified state quantities at candidate and landmark:

- actor/opponent reserve;
- nyumba seeds;
- actor legal move count;
- actor capture move count;
- actor forced-capture state;
- actor/opponent front-row seeds;
- actor/opponent front connections;
- actor/opponent maximum capturable seeds.

These diagnostics assess common support and do not constitute effect testing.

No favorable structural feature may be selected after inspection as a new outcome threshold.

## 10. Downstream-outcome availability diagnostic

For each family, report counts only for:

- control games that later reach first Mtaji;
- control games with first-Mtaji morphology eligibility;
- terminal-before-Mtaji;
- administrative truncation.

Do **not** report M1 versus M2 label counts by risk-set family in this audit.

Reason:

Comparator selection must be based on pre-outcome support, not on which comparator produces the largest morphology contrast.

## 11. Condition-pair duplication audit

Across all 192 games, group identical `historicalTrajectoryHash` values and report:

- number of duplicate groups;
- group sizes;
- condition sets represented in duplicate groups;
- pairwise condition co-occurrence counts.

This is a design-efficiency diagnostic for deciding whether some conditions add largely redundant trajectories in a later exploratory extension.

It must not be interpreted as search-profile equivalence in general.

## 12. Decision rule after audit

After inspecting the support audit:

### If R2 or R3 has substantial unique-trajectory support

A same-ply risk-set comparator remains viable. The next task is to obtain more **exposed CBE trajectories**, not to search for another outcome definition.

### If only R0/R1 is supported

The design must decide explicitly whether forced-capture context should be adjusted/modelled rather than matched.

### If all exact-ply same-condition families are sparse

The formal bridge is not identifiable under this sampling design; a new exploratory sampling strategy is required before Stage 2 freeze.

No numerical minimum is fixed in this amendment because the purpose of this audit is to measure support. Any later minimum/exposure target must be frozen before generating an extension corpus.

## 13. Formal-design items still not frozen

This amendment does not freeze:

- formal comparator;
- primary statistical unit;
- condition scope;
- formal exposure target/sample size;
- structural endpoint/model;
- morphology endpoint/model;
- handling of terminal-before-Mtaji in the primary estimand;
- effect direction;
- significance or multiplicity policy;
- formal seed block.

## 14. Required output

The supplemental audit must produce:

```text
stage1-riskset-audit.json
stage1-riskset-controls.csv
```

The JSON report must retain the exploratory/no-inference boundary and record zero effect testing.

## 15. Pause point

> **This amendment is frozen before running the exact-ply risk-set support audit. The audit uses only the already-consumed 192-game Stage 1 corpus and is prohibited from selecting a comparator based on M1/M2 outcomes. Stage 2 remains unauthorized until this support audit and any necessary exposure-yield extension are completed.**
