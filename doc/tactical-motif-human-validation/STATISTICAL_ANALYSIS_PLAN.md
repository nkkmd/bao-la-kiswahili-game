# STATISTICAL_ANALYSIS_PLAN — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-18  
Status: **CLOSED — HUMAN FORMAL INFERENCE NOT ESTIMABLE (N=0)**

## 1. Planned hierarchical data structure

The study distinguished:

```text
participant
position / matched block
participant × block response
```

Individual responses were never intended to be treated as independent expert samples.

## 2. Planned primary participant-level endpoint

For participant `i`:

```text
primaryScore_i = correctly discriminated C03 target pairs
                 / usable primary blocks
```

Planned blocks: `12`.

Primary inclusion required at least `10` usable blocks.

Planned success definition:

```text
participantSuccess_i = 1 if primaryScore_i > 0.5
                       0 otherwise
```

## 3. Planned primary formal test

Inferential unit: participant.

```text
H0: prevalence(participantSuccess=1) <= 0.5
H1: prevalence(participantSuccess=1) > 0.5
```

Planned test: exact one-sided binomial.  
Planned alpha: `0.05`.

Positive human validation additionally required:

```text
median(primaryScore_i) >= 2/3
```

## 4. Frozen estimability rule

```text
minimum included primary experts = 10
planned target recruitment = 12..16
minimum usable primary blocks / expert = 10/12
```

If included primary experts `<10`, formal human inference is not performed and the final human-axis label is `INCONCLUSIVE-NOT-ESTIMABLE`.

The minimum expert count may not be lowered to rescue estimability.

## 5. Observed closure state

The study closed before scientific recruitment because the independent investigator had no feasible current route to the frozen qualified expert cohort.

```text
scientific recruitment started = false
included primary experts = 0
formal human responses = 0
```

Therefore:

```text
required included experts = 10
observed included experts = 0
estimability gate = FAIL
```

## 6. Statistical execution decision

Because `N=0 < 10`:

- the exact one-sided binomial test was **not performed**;
- no primary p-value exists;
- no participant primary score exists;
- no median primary score exists;
- no secondary human inferential analysis was performed.

Final human-axis statistical decision:

`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`

Reason:

`ZERO-ACCESSIBLE-ELIGIBLE-EXPERT-COHORT-PRECOLLECTION`

## 7. Why this is not `NOT-HUMAN-EXPERT-VALIDATED`

`NOT-HUMAN-EXPERT-VALIDATED` requires an estimable, technically valid human study in which the frozen confirmation criteria fail.

That condition never occurred. There are no human observations.

Zero participants therefore cannot be interpreted as evidence of expert non-recognition.

## 8. Secondary outcomes

Move-choice, explicit label, confidence, and explanation agreement remained secondary/exploratory by design.

No formal human observations exist for these outcomes, so they cannot be used to rescue or reinterpret the primary non-estimability result.

## 9. Missing-data rules

The previously planned missing/completion rules were never invoked because no formal participant was enrolled.

No imputation, participant exclusion, or outcome-dependent deletion occurred.

## 10. No-rescue

The study did not:

- lower the minimum expert count;
- redefine participant success;
- switch tests;
- alter alpha;
- replace stimuli;
- substitute non-experts or AI for qualified experts;
- reinterpret N=0 as a negative human outcome.

The final statistical state is fixed as:

```text
formalHumanInferencePerformed = false
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```
