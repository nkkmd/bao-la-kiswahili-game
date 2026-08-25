# Practical Comeback / Error-Inducing Move Study 1 — Overview

更新日: 2026-08-25  
Status: **RESEARCH START / NO SCIENTIFIC RESULT YET**

## 研究題目

> **Baoにおける逆転可能性と勝負手の定量化 — opponent-error dependence, reply difficulty, and practical comeback potential の分離・検証**

Working English title: **Practical Comeback / Error-Inducing Move Study 1**  
Study ID: `PCEM-STUDY1`

## 中心課題

本Studyは、prospectively defined disadvantaged rootにおいて、strong/reference policy上の最善手と、frozen imperfect-opponent policy下で実現するbounded-horizon comeback frequencyを分離して測定する。

特に、あるroot moveがreference-policy上のbest moveではない、またはsmall positive optimality gapを持つ場合でも、相手のsuccessful-defense reply setを狭くし、frozen imperfect policyがそのreply setを外す頻度を増やすことによって、より高いempirical comeback frequencyを生む構造をmachine-reproducibly同定できるかを検討する。

## Formal claim boundary at study start

Even a positive result would authorize only a statement of the form:

> A prospectively defined move class produced a higher bounded-horizon empirical comeback frequency under the frozen opponent policy, population, phase, root-eligibility rule and continuation conditions used by this study.

It would not by itself establish:

- objective superiority;
- game-theoretic optimality;
- true Bao winning probability;
- effectiveness against all opponent strengths;
- human difficulty, deception, pressure, or psychology;
- expert/traditional recognition as a Bao “winning try”.

## Immutable upstream boundaries

The study does not alter completed results from Critical Positions / Outcome Branching, Position Evaluation / Win-Rate Calibration, Blunder / Misvaluation Patterns, Position Complexity / Difficulty, Restricted Endgame / Winning Regions, Symmetry / Isomorphic Positions, ORISC-STUDY1, or State Space / Game Tree Complexity Study 1.

In particular:

- Critical Positions Study 1 Stage 2 remains unexecuted after 0 promoted candidates.
- Calibration Study 1 remains `INCONCLUSIVE`; its isotonic mapping is not a validated Bao win probability.
- Blunder Study 1 remains 0 `CONFIRMED` / 4 `NOT-CONFIRMED`.
- Position Complexity / Difficulty Study 1 remains `INCONCLUSIVE`; machine workload is not human difficulty.
- Restricted Endgame exact claims remain limited to the frozen 8-state / 7-edge domain.
- Symmetry Study 1 remains `NON-ESTIMABLE` with no validated transformation.
- ORISC-STUDY1 retains Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`, Axis B `NOT-AUTHORIZED-NOT-EXECUTED`, validated transformation set `[]`.
- State Space / Game Tree Complexity Study 1 remains exact only within the frozen depth-8 RAW-ONLY domain.

## Measurement architecture

The planned measurement system separates at least six axes:

```text
A. strongest-policy value / best-response robustness
B. empirical comeback frequency under frozen imperfect opponent policy
C. successful-defense reply-set narrowness
D. opponent-error dependence
E. machine-operational reply difficulty / punishment concentration
F. move optimality gap
```

The precise root disadvantage rule, reference comparator, opponent policy, comeback horizon, defensive-success definition and numerical thresholds are not inferred from Stage 1 outcomes. They must be frozen prospectively after technical-only Stage 0 feasibility checks and before Stage 1 scientific outcome inspection.

## Stage architecture

### Stage 0

Technical / construct feasibility only. No scientific inference. It validates representation, legal move intervention, seeded policy behavior, outcome accounting, reply enumeration, independent verification feasibility and resource envelope.

### Stage 1

Fresh exploratory discovery using a new seed block. Disadvantaged roots are selected by a prospectively frozen outcome-blind rule; exact legal root moves are measured; candidate grammar is bounded in advance; zero promoted candidates is valid.

### Stage 2

Fresh formal confirmation is authorized only if Stage 1 produces at least one candidate through the frozen promotion rule. Stage 2 requires a separately frozen candidate definition, population, comparator, endpoints, estimability gates, statistical test, multiplicity correction, missingness/cutoff handling and stopping rule.

If Stage 1 promotes zero candidates:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Current state

No Stage 0 scientific outcome, Stage 1 outcome, candidate, or formal result exists yet. The current repository changes establish only the independent-study identity, immutable boundaries, measurement dependency audit and protocol skeleton.
