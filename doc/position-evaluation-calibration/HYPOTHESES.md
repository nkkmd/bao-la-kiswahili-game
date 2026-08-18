# Hypotheses — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18

The labels below define questions and analysis roles. Exact Stage 2 thresholds/decision rules remain unauthorized until the Stage 1 development protocol is completed and frozen before any Stage 2 generation.

## H1 / Q1 — Monotonicity

Under the frozen state population and continuation policy, higher actor-perspective evaluation should be associated with higher probability that the selected actor wins the continuation.

This is an empirical population relationship, not a game-theoretic claim and not a causal effect of the score itself.

## H2 / Q2 — Calibration mapping

A prospectively selected mapping from static `bao` evaluation to empirical continuation win probability can be constructed on fresh Stage 1 development data.

Stage 1 may select only among model families enumerated before Stage 1 outcome analysis. The selected family and fitting procedure must be frozen before Stage 2.

## H3 / Q3 — Held-out generalization

The frozen Stage 1 mapping maintains preregistered calibration performance on a non-overlapping fresh Stage 2 corpus.

This is the formal center of Study 1.

## H4 / Q4 — Phase dependence

Namua and Mtaji may not share the same score-to-probability mapping.

Phase-aware and pooled candidate models must be defined prospectively; phase may not be split or merged after Stage 2 outcome inspection.

## H5 / Q5 — Structural heterogeneity

Prespecified structural variables may show calibration heterogeneity, including:

- forced-capture state;
- legal move count;
- reserve;
- house/nyumba structure;
- actor seat / first-player relation;
- frozen Mtaji morphology where applicable.

Unless explicitly promoted before Stage 2, these analyses are key-secondary or descriptive only and cannot rescue the primary result.

## Non-hypotheses / prohibited interpretations

The study does not test or establish that:

- the evaluator is theoretically correct;
- the AI chooses game-theoretically optimal moves;
- a score causes a win;
- C03 is more or less confirmed;
- C01/C02/C04 should be relabeled;
- Position Complexity Study 1 is numerically rescued;
- human experts perceive the same advantage;
- TMHV N=0 is evidence for or against human recognition.
