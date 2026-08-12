# Position Complexity / Difficulty Study 1 — Hypotheses

更新日: 2026-08-12  
Status: **CANDIDATE HYPOTHESES / NOT YET FORMALLY PREREGISTERED**

この文書はStage 0開始時点のhypothesis候補を記録する。Stage 1 exploratory evidenceを用いてmeasurement feasibilityを確認した後、Stage 2 fresh corpus生成前にformal hypothesisを一度だけfreezeする。

Stage 2 outcomeを見て仮説・metric・方向・thresholdを変更してはならない。

## H1 candidate — Structural branching and depth instability

Scientific statement:

> 合法選択肢のstructural branchingは、同一局面を固定search/evaluatorでdepth 2からdepth 3へ深くしたときのroot decision instabilityと関連する。

Provisional structural variable:

```text
legalMoveCount
```

Provisional outcome:

```text
tie-aware D2 -> D3 root-optimum instability
```

Current preferred inferential form:

```text
H0: beta_legalMoveCount = 0
H1: beta_legalMoveCount != 0
```

Status:

```text
PRIMARY CANDIDATE
NOT FROZEN
```

Rationale:

- structural variable does not contain evaluator/search outcome;
- prediction instability is a different layer;
- two-sided association avoids assuming that more legal moves must necessarily imply more instability before exploratory feasibility is known.

## H2 candidate — Decision ambiguity adds information beyond structure

Scientific statement:

> Root decision ambiguityは、structural branchingだけでは説明できないdepth-instability情報を持つ。

Provisional ambiguity variable:

```text
bestScore_D2 - secondBestScore_D2
```

Expected relation:

```text
smaller margin -> greater D2-to-D3 instability
```

Candidate model adds ambiguity after `legalMoveCount` and phase context.

Status:

```text
KEY SECONDARY CONFIRMATORY CANDIDATE
NOT FROZEN
```

This is an incremental association hypothesis, not causal mediation and not human cognitive difficulty.

## H3 candidate — Structural branching and search workload are related but non-identical

Scientific statement:

> Structural branchingとfixed-search workloadは関連し得るが、legal move countだけでnodes/cutoffs/evaluationsの全変動を表現できるとは仮定しない。

Candidate quantities:

```text
legalMoveCount
captureMoveCount
relay/chain quantities
nodes
quiescenceNodes
cutoffs
evaluations
```

Status:

```text
SECONDARY / EXPLORATORY AT STUDY INITIATION
```

No success criterion based on a desired correlation magnitude is currently authorized.

## H4 candidate — Multiple machine-reproducible layers

Scientific statement:

> Structural, search-workload, ambiguity and prediction-instability measures will not collapse cleanly into one empirically interchangeable dimension.

Possible exploratory diagnostics:

- within-/cross-layer correlation matrix;
- partial associations;
- incremental prediction;
- PCA/factor diagnostics;
- variance partitioning.

Status:

```text
EXPLORATORY ONLY FOR STUDY 1 UNLESS SEPARATELY FROZEN
```

A one-factor vs multi-factor latent model is not currently the primary formal test because representation/model-family selection would create excessive researcher degrees of freedom before measurement validity is established.

## H5 future — Human difficulty validation

Future question:

> Do machine-reproducible structural/ambiguity/instability layers predict human error rate, response time, candidate generation or explanation quality?

Status:

```text
OUT OF SCOPE FOR STUDY 1
FUTURE INDEPENDENT STUDY
```

Human difficulty is not inferred from engine search difficulty in the present study.

## Explicit non-hypotheses / prohibited rescue targets

The following are not present-study hypotheses:

- CBE accelerates or delays first Mtaji;
- CBE changes first-Mtaji survival/hazard;
- prior D2 phase2 > legacy and D3 legacy > phase2 results are re-confirmed by reanalysis;
- MTAJI-M1 is harder/easier than MTAJI-M2;
- N-ACT/N-CON are confirmed difficulty axes;
- STYLE-C1..C4 are rescued as difficulty/style coordinates;
- the existing adaptive `complexityScore()` is a validated research metric.

Any later decision to study one of these requires a separately documented prospective question and fresh evidence.