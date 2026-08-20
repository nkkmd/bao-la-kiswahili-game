# Decision Register — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20

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

Status: **FROZEN**

## D-007 — Primary construct

Primary calibration target is static default `bao` evaluation via `AI.evaluate(state, actor)`.

Exact D2 search bestScore remains key secondary and is not merged with the static score.

Status: **FROZEN**

## D-008 — Replication principle

Do not create pseudo-replication by repeating the same deterministic state/policy. Primary uncertainty is over prospectively sampled independent trajectory/state units.

Status: **FROZEN**

## D-009 — Seed firewall

Stage 1 used only `22200001..22201024`. Stage 2 is reserved at `22300001..22302048`. No extension is allowed after outcome inspection.

Status: **FROZEN**

## D-010 — Authorization firewall

A preregistration/spec file alone does not authorize scientific generation. A separate authorization artifact is required after technical validation and source/seed freeze.

Status: **FROZEN**

## D-011 — Formal no-rescue

No outcome-dependent extension, reseeding, replicate increase, bin change, model-family change, phase split/merge, optimizer/tolerance change, endpoint substitution, threshold change or outlier exclusion is allowed on Stage 2 evidence.

Status: **FROZEN**

## D-012 — Stage 1 selected calibration family

The prospectively enumerated phase-aware logistic candidate became ineligible in five-fold CV because fold 1 Mtaji failed the frozen numerical convergence gate after 100 iterations:

```text
max |gradient| = 4.513435944430988e-10
required tolerance = 1e-10
```

No rescue optimizer/tolerance/regularization is permitted.

The phase-stratified isotonic candidate remained eligible:

```text
pooled CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

Therefore the frozen selection rule chooses:

```text
selected family = phase-stratified-isotonic
reason = only-eligible-candidate
Stage 1 result status = MODEL-SELECTED-EXPLORATORY
```

Stage 1 does not itself authorize a formal calibration claim.

Status: **FROZEN**

## D-013 — Stage 2 mapping lock

Stage 2 uses the exact Stage 1 isotonic mapping bound by:

```text
Stage 1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
fullFit canonical JSON SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

No Stage 2 refit, smoothing, endpoint substitution, or primary-probability clipping is allowed.

Status: **FROZEN**

## D-014 — Stage 2 cross-stage identity firewall

Final Stage 2 selected states must have zero overlap with Stage 1 on:

```text
historicalTrajectoryHash — all Stage 1 generated games
openingPrefixHash — all Stage 1 generated games
ruleStateKey — all Stage 1 observations
```

Overlaps are excluded without replacement; no seed extension is allowed.

Status: **FROZEN**

## D-015 — Stage 2 primary formal decision

After all estimability/identity/verification gates pass, `CONFIRMED` requires every criterion:

```text
paired Brier-skill one-sided 95% bootstrap lower bound > 0
pooled frozen-model Brier <= 0.18
Namua frozen-model Brier <= 0.25
Mtaji frozen-model Brier <= 0.12
```

If estimable but any criterion fails: `NOT-CONFIRMED`.

If any estimability/identity gate fails: `INCONCLUSIVE`.

Secondary/descriptive results cannot rescue this decision.

Status: **FROZEN**

## D-016 — Current Stage 2 authorization boundary

`STAGE_2_FORMAL_SPEC.json` is frozen, but `STAGE_2_FORMAL_AUTHORIZATION.json` is intentionally absent pending Stage 2 technical smoke and source binding.

```text
Stage 2 technical validation = OPEN
Stage 2 scientific generation = NOT AUTHORIZED
formal outcome inspection = NOT STARTED
```

Status: **ACTIVE FIREWALL**
