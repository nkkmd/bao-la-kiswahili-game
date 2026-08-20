# Decision Register — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20

## D-001 — Independent prospective identity

Study 1 is a new prospective independent study. No prior formal decision may be rescued, weakened, strengthened or relabeled.

Status: **FROZEN**

## D-002 — Repository baseline

```text
main baseline = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
```

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

Calibration does not rescue these decisions.

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

```text
actor = state.player
score sign = actor-relative
win outcome = final winner == actor
```

Status: **FROZEN**

## D-007 — Primary construct

Primary calibration target is static default `bao` evaluation via `AI.evaluate(state, actor)`. Exact D2 search bestScore remains secondary and is not merged with the static score.

Status: **FROZEN**

## D-008 — Replication principle

Primary uncertainty is over prospectively sampled independent trajectory/state units. Repeating one deterministic state/policy does not create replication.

Status: **FROZEN**

## D-009 — Seed firewall

```text
Stage 1 = 22200001..22201024
Stage 2 = 22300001..22302048
```

No outcome-dependent extension is allowed.

Status: **FROZEN**

## D-010 — Authorization firewall

A spec alone never authorizes scientific generation. Separate source-bound authorization is required.

Status: **FROZEN**

## D-011 — Formal no-rescue

No outcome-dependent extension, reseeding, replicate increase, bin change, model-family change, optimizer/tolerance rescue, endpoint substitution, threshold change, or outlier exclusion may change the formal result.

Status: **FROZEN**

## D-012 — Stage 1 selected calibration family

Phase-aware logistic became ineligible in CV fold 1 / Mtaji after 100 iterations:

```text
max |gradient| = 4.513435944430988e-10
required tolerance = 1e-10
```

Phase-stratified isotonic remained eligible:

```text
pooled CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

Frozen selection:

```text
selected family = phase-stratified-isotonic
reason = only-eligible-candidate
Stage 1 status = MODEL-SELECTED-EXPLORATORY
```

Stage 1 itself does not authorize a formal calibration claim.

Status: **FROZEN**

## D-013 — Stage 2 mapping lock

```text
Stage 1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
fullFit canonical JSON SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

No Stage 2 refit, smoothing, endpoint substitution, or primary-probability clipping is allowed.

Status: **FROZEN**

## D-014 — Stage 2 cross-stage identity firewall

Final Stage 2 states must have zero Stage 1 overlap on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

Overlaps are excluded without replacement.

Status: **FROZEN**

## D-015 — Stage 2 primary formal rule

After every estimability/identity/verification gate passes, `CONFIRMED` requires all:

```text
paired Brier-skill one-sided 95% bootstrap lower bound > 0
pooled frozen-model Brier <= 0.18
Namua frozen-model Brier <= 0.25
Mtaji frozen-model Brier <= 0.12
```

If estimable but any criterion fails: `NOT-CONFIRMED`.

If any estimability/identity gate fails: `INCONCLUSIVE`.

Secondary/descriptive values cannot rescue the decision.

Status: **FROZEN**

## D-016 — Stage 2 authorization

Stage 2 technical smoke passed before scientific generation. Source-bound authorization then allowed exactly:

```text
2048 games
22300001..22302048
```

Stage 1 refit, seed extension, overlap replacement, and outcome-dependent extension remained forbidden.

Status: **FROZEN / EXECUTED**

## D-017 — Stage 2 verification and estimability

Independent verification passed:

```text
gamesVerified = 2048
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
final Stage 1 overlaps = 0 / 0 / 0
```

Three preregistered estimability gates failed:

```text
unique historical trajectories after Stage 1 firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

Therefore D-015 forces:

```text
formal decision = INCONCLUSIVE
bootstrap eligible = false
primary performance criteria eligible = false
```

This is an estimability failure and must not be relabeled `NOT-CONFIRMED`.

Status: **FROZEN — INCONCLUSIVE**

## D-018 — Canonical formal-result materialization and closure

The frozen evaluator materialized the canonical Stage 2 result without changing the prior gate decision.

```text
canonical stage2-formal-result SHA-256 = 94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
formalDecision = INCONCLUSIVE
bootstrap = null
criteria = null
```

Descriptive values include:

```text
pooled Brier = 0.15550141283724248
Namua Brier = 0.22678074548187638
Mtaji Brier = 0.08012948693071474
observed paired Brier skill = +0.09555981447607745
```

These do not enter the formal decision because the estimability branch failed first. Exact unclipped log loss is non-finite with 7 boundary contradictions; this also remains descriptive only.

Study 1 closes without extra data or any rescue change.

Status: **FINAL / STUDY 1 CLOSED / FORMAL INCONCLUSIVE**
