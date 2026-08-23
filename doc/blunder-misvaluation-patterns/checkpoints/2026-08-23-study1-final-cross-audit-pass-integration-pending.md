# BMP Study 1 — Final Cross-Audit PASS / Integration Pending

Date: 2026-08-23  
Study: `BMP-STUDY1`  
Stage 2: `BMP-S2-FORMAL-2026-08-22-v1`

## Decision

The post-formal-result repository cross-audit passed. Study 1 is scientifically closed and the research branch is documentation-complete for a later explicit integration decision.

**No integration to `main` was performed.**

## Final scientific state

```text
formal candidates = 4
estimable = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
Study 1 = CLOSED
```

Candidate decisions:

```text
BMP-S2-C01 = NOT-CONFIRMED
BMP-S2-C02 = NOT-CONFIRMED
BMP-S2-C03 = NOT-CONFIRMED
BMP-S2-C04 = NOT-CONFIRMED
```

## Frozen identities rechecked

```text
candidate SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
formal embedded resultHash = 1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
raw stage2-formal-result.json SHA-256 = e478d3fb29ad15508ddcaf6973d8eb8aa6bf4debd23921564ae08a1ac518293d
```

Raw canonical result path:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/stage2-formal-result.json
```

## Quantitative cross-check

The current-facing documents agree on:

```text
Stage 1 games = 2048
Stage 1 unique historical trajectories = 1884
Stage 1 selected roots = 1200
Stage 1 measured exact legal moves = 5295
Stage 1 exploratory candidates = 4

Stage 2 games = 4096
Stage 2 unique historical trajectories = 3559
Stage 2 distinct opening prefixes = 2827
G01 selected/measured roots = 1868
G02 selected/measured roots = 810
total formal measurements = 2678
final Stage 1 overlap = 0 / 0 / 0
```

## Documents audited / synchronized

Central navigation:

```text
README.md
doc/RESEARCH_INDEX.md
doc/FUTURE_RESEARCH_AGENDA.md
```

Study-level current-facing and provenance documents:

```text
doc/blunder-misvaluation-patterns/README.md
doc/blunder-misvaluation-patterns/CURRENT_STATUS.md
doc/blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md
doc/blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md
doc/blunder-misvaluation-patterns/REPRODUCIBILITY_INDEX.md
doc/blunder-misvaluation-patterns/EXPERIMENT_INDEX.md
doc/blunder-misvaluation-patterns/DECISION_REGISTER.md
doc/blunder-misvaluation-patterns/STAGE_2_DECISION_REGISTER.md
doc/blunder-misvaluation-patterns/RESEARCH_LOG.md
doc/blunder-misvaluation-patterns/RESEARCH_PLAN.md
doc/blunder-misvaluation-patterns/HYPOTHESES.md
doc/blunder-misvaluation-patterns/SEED_AUDIT.md
doc/blunder-misvaluation-patterns/STAGE_2_EXECUTION_RUNBOOK.md
doc/blunder-misvaluation-patterns/preregistration/README.md
doc/blunder-misvaluation-patterns/results/README.md
doc/blunder-misvaluation-patterns/checkpoints/README.md
```

Canonical result:

```text
doc/blunder-misvaluation-patterns/results/STAGE_2_FORMAL_RESULT.json
```

## Historical-record handling

Frozen prospective specifications/protocols, authorizations, source freezes and dated checkpoints are intentionally not rewritten to make their historical gate-state language look current. For example, the frozen Stage 2 protocol states that generation was not authorized **at protocol freeze time**. Current status documents explicitly distinguish that historical state from the completed execution state.

The historical pre-authorization formal-spec SHA transcription error remains documented by the correction checkpoint; current-facing documents use the canonical `426041...caab` hash.

## Formal-evaluation provenance note

The wrapper evaluation path enforced independent measurement verification but originally omitted the verification object from the result constructor, yielding a null provenance-binding field. The already-frozen direct evaluator was then run on the same verified inputs and produced identical endpoint values/decisions with the existing verification hash bound correctly.

This was a provenance-binding correction only. No scientific endpoint, threshold, candidate, support set, data, primary depth, evaluator or decision rule changed.

## Source immutability audit

Scientific generation source commit:

```text
eecb2c8213fc71e518b0e96946e82790fd20961b
```

Formal-evaluation-open branch tip:

```text
b0a62af568b27b30273f3c435debeeee10691904
```

Cross-commit review from these boundaries to the pre-checkpoint audit tip found only documentation, compact result and provenance/checkpoint changes after scientific execution. No engine, AI, Stage 2 scientific tooling, candidate/spec, source-freeze or authorization artifact was changed.

Pre-checkpoint documentation audit tip:

```text
3d1107c017b6222a9db81106de585bfed6b348cc
```

## Main / branch state

At audit time:

```text
main = 52f5635be7064b5016baf7cde82faebe60609d9e
main integration of Stage 2 = NOT PERFORMED
research branch contains Stage 2 closure work ahead of main
```

No `main` ref update was performed in this audit.

## CI note

The queried combined-status endpoint for the documentation-audit branch tip returned no status contexts. Therefore this checkpoint does **not** claim a new GitHub Actions CI PASS for the final documentation-only commits. Prior local Stage 2 validator, contract test, tooling test and syntax checks had passed before scientific authorization, and scientific source/tooling remained unchanged afterward.

## Final boundary

`NOT-CONFIRMED` means the exact frozen machine-operational candidates did not satisfy the prospective Stage 2 confirmation rule. It is not proof of game-theoretic soundness and does not establish human misconception, expert/traditional recognition, pedagogical importance, causal mechanism or external validity.

No post-outcome rescue is authorized. Any materially different follow-up requires a new prospective study/version with fresh evidence.

## Repository decision

```text
final cross-document audit = PASS
scientific closure = COMPLETE
integration readiness = PASS
main integration = PENDING EXPLICIT USER AUTHORIZATION
```
