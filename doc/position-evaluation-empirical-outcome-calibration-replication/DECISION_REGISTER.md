# PEOCR-STUDY1 — Decision Register

## D-001 — Study identity

Date: 2026-08-26

`G2-01` is instantiated as a new independent Research Generation 2 study.

```text
Formal title = Position Evaluation / Empirical Outcome Calibration Replication Study 1
Study ID = PEOCR-STUDY1
```

`G2-01` remains the Agenda sequence label, not the formal Study ID.

## D-002 — Research Generation 1 boundary

`PEC-STUDY1 = INCONCLUSIVE` is immutable.

No additional PEC Stage 2 games, seed extension, gate relaxation, replacement, mapping refit, threshold change, or retrospective reclassification is authorized.

Prior data may inform resource planning and failure-mode identification only.

## D-003 — Baseline

Study-start remote `main`:

```text
9e9cb6e2525f09a873e741db9f8fa42696839fbe
```

Research branch:

```text
research/g2-01-position-evaluation-empirical-outcome-calibration-replication
```

## D-004 — State identity

Formal state identity remains RAW:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

No symmetry/canonicalization is authorized.

## D-005 — Calibration family

Before any G2-01 scientific outcome, the primary development family is frozen to:

```text
phase-stratified isotonic PAVA
formal prediction clipping = [0.01, 0.99]
candidate family selection = none
```

The clipping rule is fixed prospectively to keep log loss finite and cannot be changed after Stage 1/2 outcomes.

## D-006 — Population size

```text
Stage 1 development = 2,048 games
Stage 2 formal = 8,192 games
```

The larger Stage 2 population is a prospective design response to the known identity-firewall attrition mechanism from Research Generation 1; it is not an extension of the closed PEC Stage 2 corpus.

## D-007 — Strict cross-stage firewall

Stage 2 excludes Stage 1 overlap on:

```text
historicalTrajectoryHash
openingPrefixHash
rawStateKey
```

Exclusion is without replacement. Seed extension is prohibited.

## D-008 — Formal metrics and decision

Formal co-primary evidence:

- paired Brier skill vs Stage 1 phase-only reference
- paired log-loss skill vs the same reference

All-gate success also requires the prospectively reused replication Brier maxima:

```text
pooled <= 0.18
Namua <= 0.25
Mtaji <= 0.12
```

Decision:

```text
all gates + all criteria PASS -> CONFIRMED
all gates PASS + criterion failure -> NOT-CONFIRMED
any estimability/identity gate failure -> INCONCLUSIVE
```

## D-009 — Human / game-theoretic / engineering boundary

The Study does not authorize:

- game-theoretic probability claims
- human advantage-perception claims
- causal claims
- public-AI quality or promotion claims

Engineering outcomes cannot revise this Study.
