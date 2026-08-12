# Position Complexity / Difficulty Study — Decision Register

更新日: 2026-08-12  
Status: **ACTIVE / append decisions; do not silently rewrite historical decisions**

Decision status vocabulary:

```text
FROZEN = present-study boundary that may not be silently changed
PROVISIONAL = recommended design pending Stage 0/1 feasibility; must be frozen before Stage 2
REJECTED = explicitly not adopted
```

---

## PCX-D001 — Independent prospective study

Status: **FROZEN**

Decision:

This research is a new prospective independent Study 1. It does not reopen or rescue any completed Study.

Consequences:

- prior formal decisions are immutable historical results;
- prior corpora may provide motivation/technical prior only unless explicitly designated for non-confirmatory technical checks;
- present confirmatory claims require a fresh held-out corpus.

## PCX-D002 — No composite difficulty score in Study 1

Status: **FROZEN**

Decision:

Do not construct a weighted global `difficulty score` as the Study 1 primary representation.

Reason:

The scientific question is whether structural complexity, search workload, decision ambiguity and prediction instability are separable. Combining them before testing would assume the conclusion and obscure layer-specific failure modes.

## PCX-D003 — Human difficulty is not a Study 1 primary endpoint

Status: **FROZEN**

Decision:

Study 1 establishes machine-reproducible measures only. Human error, response time, candidate generation and verbal explanation require a separate validation infrastructure and future prospective study.

## PCX-D004 — Existing closed-study vocabularies are not refit

Status: **FROZEN**

Decision:

- CBE definition/thresholds remain unchanged if referenced.
- MTAJI-M1/M2 retain their bounded confirmed meaning only.
- no Namua discrete type is resurrected.
- N-ACT/N-CON remain exploratory.
- discrete playing-style clustering remains unsupported.
- STYLE-C1..C4 exact geometry remains formal not-confirmed.
- Namua→Mtaji Study 1 remains NOT-CONFIRMED.

## PCX-D005 — Deterministic Namua clock remains a permanent boundary

Status: **FROZEN**

Decision:

```text
initial reserve total = 44
Namua reserve total at ply t = 44 - t
first Mtaji observation = ply 44
```

No time-to-first-Mtaji, first-Mtaji survival/hazard, acceleration or delay endpoint is authorized.

## PCX-D006 — Existing adaptive complexityScore is not a research measure

Status: **FROZEN**

Decision:

`public/ai-config.js::complexityScore()` is an implementation heuristic used to adjust time/depth budgets. It must not be treated as scientific ground truth, primary predictor or validated complexity index.

For research measurements, adaptive search allocation is disabled so structural variables are not mechanically injected into the search budget.

## PCX-D007 — Wall-clock time is not the initial primary search-complexity metric

Status: **FROZEN for initial design**

Decision:

`elapsedMs` is hardware/runtime sensitive. Initial inferential search-workload measures should prefer deterministic counters under fixed source/options, such as nodes, quiescence nodes, cutoffs and evaluations. Wall-clock time may be recorded for QA/descriptive reporting.

## PCX-D008 — Exact root candidate values are required before ambiguity is formalized

Status: **FROZEN**

Decision:

Do not infer decision ambiguity from only the selected move and `rootScore`.

A valid ambiguity measure requires an exhaustive legal root candidate table with searched values under a fixed perspective and frozen search/evaluator semantics.

## PCX-D009 — Generic PV is not presently a validated core metric

Status: **FROZEN**

Decision:

Repository-specific joseki tooling that reconstructs a line by repeated search does not automatically define a general principal variation metric for this study.

PV instability may become secondary only after Stage 0 provides a generic, replay-validated definition. It is not required for the primary Study 1 claim.

## PCX-D010 — Stage separation

Status: **FROZEN**

Decision:

```text
Stage 0 = technical / measurement feasibility
Stage 1 = exploratory metric and design development
Stage 2 = fresh held-out formal confirmation
```

Stage 0/1 data are permanently consumed and cannot be used as independent Stage 2 confirmation evidence.

## PCX-D011 — Primary structural variable candidate

Status: **PROVISIONAL**

Recommendation:

Use raw `legalMoveCount` as the primary structural branching variable rather than a composite index.

Reason:

It is directly defined by the rules engine, search-independent, broadly applicable across phase, and conceptually closest to root structural branching.

Freeze/reject decision must occur after Stage 1 and before Stage 2.

## PCX-D012 — Primary prediction-instability candidate

Status: **PROVISIONAL**

Recommendation:

Use tie-aware D2→D3 root-optimum instability based on exact root candidate top sets:

```text
D23Instability = 1 iff TopSet_D2 intersect TopSet_D3 is empty
```

This avoids treating arbitrary tie-breaking as a substantive move reversal.

Stage 1 must audit event prevalence before this endpoint is frozen for Stage 2.

## PCX-D013 — Decision-ambiguity candidate

Status: **PROVISIONAL**

Recommendation:

Use the exact searched best-vs-second-best root score margin at depth 2 as the first ambiguity candidate.

Entropy/near-equivalent counts remain exploratory until threshold/temperature dependence is audited.

## PCX-D014 — Formal pseudo-replication strategy

Status: **PROVISIONAL with frozen principle**

Frozen principle:

All plies are not independent observations. Duplicate historical trajectories and exact duplicate rule states must not inflate formal sample size.

Preferred Stage 2 implementation:

- collapse duplicate historical trajectories;
- deterministically select one formal position per unique historical trajectory when feasible;
- collapse exact duplicate `ruleStateKey` selected states by a fixed representative rule;
- preserve phase/source provenance;
- no result-dependent replacement of missing/unavailable samples.

If Stage 1 demonstrates inadequate coverage, a bounded repeated-state design may be considered only with a preregistered trajectory-clustered inference plan.

## PCX-D015 — Confirmatory center vs latent decomposition

Status: **FROZEN for Study 1 planning**

Decision:

The Study 1 confirmatory center is association/incremental-information testing, not estimation of an exact latent-factor count.

- primary candidate: structural branching vs prediction instability;
- key secondary candidate: ambiguity adds information beyond structure;
- broad PCA/factor/latent geometry remains exploratory.

This limits researcher degrees of freedom and prevents a result-dependent global difficulty ontology.

## PCX-D016 — Multiplicity hierarchy

Status: **PROVISIONAL**

Recommendation:

- one primary test at alpha 0.05;
- small prespecified key-secondary family with Holm family-wise correction;
- broad exploratory matrices do not generate confirmation claims from unadjusted p-values; BH-FDR may be used if p-values are reported.

Exact family and q-value must be frozen before Stage 2.

## PCX-D017 — Formal generation remains locked

Status: **FROZEN**

Decision:

No Stage 2 formal corpus is authorized until all of the following exist:

- validated Stage 0 instrumentation;
- completed/consumed Stage 1 exploratory audit;
- frozen Stage 2 hypothesis, metric, population and state-selection rule;
- exact test/alpha/multiplicity rules;
- exact estimability gates;
- fixed game count and seed range;
- frozen source/tool hashes;
- formal runbook/preregistration.

No GitHub Actions generation of the large formal corpus.

## PCX-D018 — Single-choice roots are excluded from primary decision-instability inference

Status: **FROZEN**

Decision:

The primary structural-branching versus decision-instability population must require:

```text
legalMoveCount >= 2
```

Reason:

A root with exactly one legal move is mechanically stable across search depths because no alternative decision exists. Including those positions would bake a trivial structural relationship into the primary endpoint and could exaggerate the association between low branching and stability.

Single-choice roots may still be retained in structural/search-workload descriptive summaries, but they are not eligible for the primary D2→D3 decision-instability test.