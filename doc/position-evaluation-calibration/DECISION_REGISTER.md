# Decision Register — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18

## D-001 — Independent prospective identity

Study 1 is a new prospective independent study. No prior formal decision may be rescued, weakened, strengthened or relabeled.

Status: **FROZEN**

## D-002 — Repository baseline

```text
main baseline = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
```

The prior reported SHA was one merge behind; the only changed file was `doc/FUTURE_RESEARCH_AGENDA.md`.

Status: **FROZEN**

## D-003 — Construct boundary

The study keeps separate:

```text
engine evaluation
empirical continuation win probability
game-theoretic value
human perception of advantage
```

Status: **FROZEN**

## D-004 — Position Complexity boundary

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

No calibration model may be described as resolving the PCX BFGS convergence failure.

Status: **FROZEN**

## D-005 — Tactical Motif / TMHV boundary

```text
C01 = NOT-CONFIRMED
C02 = NOT-CONFIRMED
C03 = CONFIRMED
C04 = NOT-CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

Calibration does not modify these labels and cannot substitute for human evidence.

Status: **FROZEN**

## D-006 — Primary perspective

Selected-state actor perspective is used:

```text
actor = state.player
score sign = actor-relative
win outcome = final winner == actor
```

Status: **FROZEN FOR STAGE 0 DESIGN**

## D-007 — Primary construct candidate

Primary calibration target is static default `bao` evaluation via `AI.evaluate(state, actor)`.

Exact D2 search bestScore under the validated Position Complexity diagnostic is key secondary.

This choice may be amended only prospectively during Stage 0, before any Stage 1 scientific outcome generation/inspection, with a versioned decision record.

Status: **STAGE 0 WORKING-FROZEN**

## D-008 — Replication principle

Do not create pseudo-replication by repeating the same deterministic state/policy. Primary uncertainty is over prospectively sampled independent trajectory/state units.

Status: **FROZEN**

## D-009 — Seed firewall

No new seed block is assigned until the repository-wide historical seed audit closes.

Status: **FROZEN**

## D-010 — Authorization firewall

A preregistration/spec file alone does not authorize scientific generation. A separate authorization artifact is required after technical validation and source/seed freeze.

Status: **FROZEN**

## D-011 — Formal no-rescue

No outcome-dependent extension, reseeding, replicate increase, bin change, model-family change, phase split/merge, optimizer/tolerance change, endpoint substitution, threshold change or outlier exclusion is allowed on Stage 2 evidence.

Status: **FROZEN**
