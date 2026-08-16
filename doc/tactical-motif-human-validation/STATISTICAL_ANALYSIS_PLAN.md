# STATISTICAL_ANALYSIS_PLAN — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-16  
Status: **STAGE 0 PLAN / STAGE 2 FORMAL SPEC NOT YET FROZEN**

## 1. Hierarchical data structure

The study distinguishes:

```text
participant
position / matched block
participant × block response
```

Individual responses are not treated as independent expert samples.

## 2. Primary participant-level endpoint

For participant `i`:

```text
primaryScore_i = number of correctly discriminated C03 target pairs
                 / number of usable primary blocks
```

Planned blocks: `12`.

Primary inclusion requires at least `10` usable blocks.

Define:

```text
participantSuccess_i = 1 if primaryScore_i > 0.5
                       0 otherwise
```

A score exactly `0.5` is conservatively non-success; it is not dropped as a tie.

## 3. Primary formal test candidate

Inferential unit: participant.

```text
H0: prevalence(participantSuccess=1) <= 0.5
H1: prevalence(participantSuccess=1) > 0.5
```

Test: exact one-sided binomial.  
Planned alpha: `0.05`.

This avoids counting repeated block responses as independent experts. It tests whether a majority-prevalence of qualified experts performs above the within-participant 0.5 discrimination benchmark.

## 4. Effect-size gate

Statistical rejection alone is insufficient. Planned positive decision additionally requires:

```text
median(primaryScore_i) >= 2/3
```

The exact Stage 2 spec must encode the threshold before formal responses.

## 5. Minimum sample / estimability

```text
minimum included primary experts = 10
planned target recruitment = 12..16
minimum usable primary blocks per included expert = 10/12
```

If the included primary expert count is `<10`, formal human inference is not performed and the label is `INCONCLUSIVE-NOT-ESTIMABLE`.

Recruitment may not be extended by loosening expert criteria. Any fixed maximum recruitment window/count will be frozen in Stage 2.

## 6. Planned final labels

### HUMAN-EXPERT-VALIDATED

Requires all frozen estimability/integrity gates plus:

- exact one-sided participant-level p-value `<=0.05`;
- median participant primary score `>=2/3`.

### NOT-HUMAN-EXPERT-VALIDATED

Study is estimable and technically valid, but any required primary confirmation condition fails.

### INCONCLUSIVE-NOT-ESTIMABLE

Minimum expert count, completion, or frozen stimulus coverage gate fails.

### TECHNICAL-INCONCLUSIVE

Protocol integrity, stimulus identity, data provenance, randomization, response capture, or other preregistered technical validity gate fails before interpretable formal inference.

## 7. Secondary outcomes

Move-choice, explicit label, confidence, and explanation agreement are secondary/exploratory and cannot rescue the primary result.

A Stage 2 spec must predefine any secondary multiplicity family before formal data. If no correction plan is frozen, secondary p-values are descriptive only.

## 8. Missing data

- fewer than 10 usable primary blocks: participant excluded from primary under the fixed completion rule;
- 10–12 usable blocks: score denominator is the number of usable blocks;
- technical item failure attributable to instrument/server is recorded separately from participant skip;
- no imputation of substantive primary choices;
- no deletion based on C03 support/disagreement.

## 9. Small-sample strategy

The confirmatory center intentionally avoids an asymptotic mixed-effects model as the sole formal test. Mixed-effects models may be exploratory/secondary after formal evaluation, clearly separated from the participant-level exact decision.

## 10. No-rescue

After formal responses begin, do not switch to a more favorable mixed model, redefine success, merge categories, change alpha, replace stimuli, drop unfavorable experts, or promote a secondary endpoint to primary.
