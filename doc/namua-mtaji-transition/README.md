# Namua→Mtaji Strategic Temporal Transition Study

Status: **primary formal study complete / not-confirmed / final integration**  
開始日: 2026-08-10  
Formal evaluation date: 2026-08-12  
Branch: `research/namua-mtaji-temporal-transition`  
Base: `main@c7d06d485789e1ea96d6603802423951a88c1f87`

## 研究題目

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

本研究は、完了済みの

1. 局面相転移点 Study 1
2. 局面類型と棋風 Study 1

から生じた未推定部分を扱う、新規・prospectiveな独立研究です。

既存Studyのformal decision、threshold、negative/null/inconclusive result、classifier、vocabulary statusを変更・救済しません。

## 結論

Stage 0 feasibilityとStage 1 exploratory design workを経て、fresh held-out Stage 2 formal corpusを事前固定しました。

Primary formal condition:

```text
P2-D2 only
hard / bao / phase2 / depth2
games = 4096
seeds = 20280001..20284096
```

Formal exposure/comparator:

```text
exposure = earliest fully ascertained Namua CBE per unique historical trajectory
comparator = exact-ply R3-M
controls = 20 unique controls per exposure
global control reuse = false
```

Observed estimability:

```text
unique earliest-CBE trajectories = 31
morphology-eligible exposed trajectories = 30
G1 = PASS (30 >= 20)
G2 = PASS (20 controls for every exposure)
matched sets = 30
unique controls = 600
```

First-Mtaji morphology:

```text
Exposed MTAJI-M1 = 26 / 30 = 0.8667
Matched-control MTAJI-M1 = 509 / 600 = 0.8483
mean within-stratum matched risk difference = +0.01833
Mantel-Haenszel common OR = 1.1618
```

Preregistered matched-set exact conditional Poisson-binomial test:

```text
observed T = 26
p_two_sided = 1.0
alpha = 0.05
```

Formal decision:

> **NOT-CONFIRMED**

Within the frozen P2-D2, first-Mtaji-morphology-eligible target population, the preregistered analysis did not confirm an association between prior fully ascertained Namua `capture-branch-expansion` and first-Mtaji frozen morphology relative to exact-ply R3-M controls.

The small positive descriptive difference is not a confirmed association and is not interpreted as a trend or rescued positive result.

## Deterministic Namua clock

An important design finding became permanent before formal analysis:

```text
initial total reserve = 44
first Mtaji observation = ply 44
Namua total reserve at ply t = 44 - t
```

Stage 2 again observed first Mtaji at ply 44 for all 3886 reached-Mtaji games, with zero violations.

Therefore first-Mtaji timing is not a survival/hazard endpoint in this engine. The study does not claim CBE accelerates or delays Mtaji.

## Frozen inherited definitions

### capture-branch-expansion

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

### Historical Category-A

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

### Mtaji morphology

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No classifier refit, restandardization, relabeling, threshold tuning, or alternative-k rescue was performed.

Namua discrete type remains unsupported. N-ACT/N-CON remain exploratory coordinates. STYLE-C1..C4 exact geometry remains formal not-confirmed.

## Outcome firewall

Preoutcome matching was completed before any M1/M2 label was read.

```text
morphologyLabelsRead during matching = false
frozen Mtaji classifier loaded during matching = false
```

Only after independent review passed was the exact matching/config/file identity bound in:

```text
preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

The evaluated morphology CSV preserved the frozen preoutcome assignment exactly. Final artifact audit independently reproduced the primary statistics and formal decision.

## 最初に読む文書

1. [`RESUME_HERE.md`](RESUME_HERE.md) — current restart boundary
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — complete current state and immutable boundaries
3. [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md) — canonical Stage 2 formal result
4. [`STAGE_2_FORMAL_PROTOCOL.md`](STAGE_2_FORMAL_PROTOCOL.md) — frozen protocol
5. [`preregistration/STAGE_2_FORMAL_SPEC.json`](preregistration/STAGE_2_FORMAL_SPEC.json) — machine-readable preregistration
6. [`checkpoints/2026-08-12-stage2-formal-not-confirmed.md`](checkpoints/2026-08-12-stage2-formal-not-confirmed.md) — formal decision checkpoint

## Stage 1 provenance

All Stage 1 corpora are permanently consumed exploratory evidence and are excluded from Stage 2 formal inference.

Final Stage 1 readiness:

```text
unique CBE trajectory-ply units = 14
unique CBE historical trajectories = 14
frozen gate = >=10 units / >=8 trajectories
result = PASS
```

Relevant records include:

- [`STAGE_1_RESULT.md`](STAGE_1_RESULT.md)
- [`STAGE_1_EXTENSION_RESULT.md`](STAGE_1_EXTENSION_RESULT.md)
- [`STAGE_1_FINAL_EXTENSION_RESULT.md`](STAGE_1_FINAL_EXTENSION_RESULT.md)
- [`STAGE_1_RISKSET_RESULT.md`](STAGE_1_RISKSET_RESULT.md)
- [`STAGE_1_EXTENSION_RISKSET_RESULT.md`](STAGE_1_EXTENSION_RISKSET_RESULT.md)

## Interpretation boundary

This formal negative result does not authorize:

- proof of absence of all Namua→Mtaji temporal structure;
- causal null claims;
- Mtaji timing/hazard claims;
- generalization beyond P2-D2;
- universal ontology claims for MTAJI-M1/M2;
- post-hoc candidate-ply subgroup, comparator, threshold, seed, or sample-size rescue;
- reclassification of N-ACT/N-CON or STYLE-C1..C4.

Any new confirmatory question must be a separate prospective study with a fresh preregistration and fresh evidence.

## Local artifact policy

Formal corpus and derived large artifacts remain under `artifacts/local/`, are gitignored, and must not be committed. Formal generation remains local-only; GitHub Actions is not used for the 4096-game corpus.
