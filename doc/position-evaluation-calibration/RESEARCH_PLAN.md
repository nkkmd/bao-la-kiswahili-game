# Research Plan — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18

## 1. Scientific question

Primary question:

> Under a frozen Bao engine/evaluator/search/continuation policy and a prospectively defined state population, can engine evaluation be mapped reproducibly to empirical continuation win probability, and does that mapping generalize to a fresh held-out corpus?

## 2. Immutable boundaries

This is a new prospective independent study. It does not reopen or rescue prior work.

Historical decisions remain immutable, including:

```text
Position Complexity Study 1:
  PCX-H1 = INCONCLUSIVE
  PCX-H2 = NOT-CONFIRMATORILY-EVALUATED

Tactical Motifs Study 1:
  TM-S2-C01 = NOT-CONFIRMED
  TM-S2-C02 = NOT-CONFIRMED
  TM-S2-C03 = CONFIRMED
  TM-S2-C04 = NOT-CONFIRMED

Tactical Motif Human / Expert Validation Study 1:
  machineEvidence = CONFIRMED
  humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
  humanExpertN = 0
```

No calibration result may be used to alter those labels.

## 3. Construct separation

The study separates:

- static evaluation;
- fixed-depth search value;
- realized continuation outcome under a frozen policy;
- game-theoretic value;
- human judgment.

Structural complexity, search workload, decision ambiguity and prediction instability retain the definitions established in Position Complexity Study 1 and are not renamed as calibration.

## 4. Stage architecture

### Stage 0 — technical / construct / feasibility

Required before any scientific generation:

1. evaluation semantics audit;
2. exact actor-perspective rule;
3. continuation-policy determinism audit;
4. state-population and sampling rule;
5. identity firewall;
6. historical seed audit and fresh seed allocation;
7. endpoint and administrative-truncation rule;
8. Stage 1 model-development protocol;
9. independent verification contract;
10. authorization artifact.

### Stage 1 — exploratory development

Fresh, non-overlapping corpus. Purpose:

- establish score support and phase coverage;
- assess monotonicity descriptively;
- compare only prospectively enumerated calibration model families;
- freeze the selected mapping family, transformations, parameters/fit procedure, Stage 2 metrics, thresholds and decision rule before Stage 2 generation.

Stage 1 is permanently exploratory/consumed and cannot provide formal confirmation evidence.

### Stage 2 — formal held-out evaluation

Fresh seed block and fresh corpus. No Stage 1 trajectory, opening prefix or exact rule state may enter Stage 2.

Formal generation requires a frozen Stage 2 spec plus a separate authorization artifact. Verification must PASS before outcome evaluation.

## 5. Primary and secondary measurement targets

Stage 0 working decision:

```text
primary target quantity = AI.evaluate(state, actor), profile=bao
actor = state.player at selected state
primary outcome = terminal winner equals selected actor under frozen continuation policy
```

Key secondary measurement:

```text
exact D2 root bestScore
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

D1/D3 may be collected only if frozen before generation and must remain secondary/descriptive unless separately preregistered.

## 6. Population and sampling principles

Preferred design, to be frozen after Stage 0 feasibility validation:

```text
fresh seeded-uniform opening generation
nonterminal states only
opening burn-in before eligibility
one selected state per unique historicalTrajectoryHash
outcome-blind deterministic state selection
phase assignment/stratification fixed before outcome inspection
exact duplicate ruleStateKey collapse
no replacement after duplicate/unavailable-state removal
```

The study will record `historicalTrajectoryHash`, `ruleStateKey`, and `openingPrefixHash` separately.

## 7. Continuation policy principle

Primary continuation should use a deterministic fixed AI configuration rather than adding artificial randomness merely to create within-state replicates. Therefore the empirical probability is a population-level conditional quantity over sampled states/openings, not a claim that one fixed state has intrinsic stochastic winning probability.

If Stage 0 reveals a need for stochastic continuation, the RNG/tie-breaking/replicate design must be frozen before Stage 1. No outcome-dependent replicate extension is allowed.

## 8. Phase and heterogeneity

Namua/Mtaji phase is the authoritative global `state.phase` from the engine. Phase dependence is part of the prospective calibration design.

Prespecified heterogeneity variables may include actor seat, forced capture, legal move count, reserve, house/nyumba structure and frozen Mtaji morphology. They cannot be searched post hoc for favorable subgroups. Mtaji morphology retains its bounded confirmed status; Namua continuous coordinates retain exploratory status.

## 9. No-rescue firewall

After Stage 2 generation/outcome inspection, do not add games/seeds, alter bins, exclude extreme scores for convenience, change model family/optimizer/tolerance/primary metric, change inclusion thresholds, split/merge phases post hoc, or fit a rescue model on the same formal corpus.

Gate failure, null, not-confirmed or inconclusive are valid final outcomes.
