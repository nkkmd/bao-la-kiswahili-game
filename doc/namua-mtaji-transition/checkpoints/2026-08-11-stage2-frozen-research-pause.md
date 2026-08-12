# Checkpoint — Stage 2 frozen research pause

Date: 2026-08-11  
Status: **PAUSED AT CLEAN PROSPECTIVE BOUNDARY**

## State at pause

The Namua→Mtaji temporal-transition study is intentionally paused after completion of all Stage 1 exploratory work and after the Stage 2 formal protocol, machine-readable preregistration, instrumentation, and outcome firewall were frozen.

At this checkpoint:

```text
Stage 0 = CLOSED PASS
Stage 1 = COMPLETE / CONSUMED
Stage 2 readiness = PASS
Stage 2 design = FROZEN
Stage 2 formal games generated = 0
Stage 2 preoutcome matching performed = no
Stage 2 M1/M2 formal outcomes inspected = no
Stage 2 outcome unlock present = no
```

## Stage 1 readiness frozen result

```text
unique Namua CBE trajectory-ply units = 14
unique CBE historical trajectories = 14
readiness minimum = 10 units / 8 trajectories
result = PASS
```

Final-extension risk-set support remained abundant and structurally positive; comparator scarcity is not a design blocker.

## Stage 2 frozen corpus

```text
condition = P2-D2 only
hard / bao / phase2 / depth2
games = 4096
seeds = 20280001..20284096
opening = seeded-uniform-legal, 8 plies
max ply = 100
```

No early stopping, appended games, favorable reseeding, or outcome-driven redesign is authorized.

## Frozen formal analysis

Exposure:

```text
unique historicalTrajectoryHash
earliest fully ascertained Namua CBE
maximum one exposure per trajectory
```

Comparator:

```text
R3-M
exact candidate ply
not Category A at index
same forced-capture status
no Namua CBE anywhere in control trajectory
first-Mtaji morphology eligible
20 unique controls per exposure
global control non-reuse
```

Estimability:

```text
G1 >= 20 morphology-eligible unique exposed trajectories
G2 = exactly 20 eligible unique R3-M controls for every exposure
```

Primary test:

```text
MTAJI-M1 vs MTAJI-M2 at first eligible Mtaji
matched-set exact conditional Poisson-binomial
two-sided alpha = 0.05
```

## Outcome firewall

Preoutcome matching must be completed first with:

```bash
python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase match
```

Then stop.

The file below must not exist until independent preoutcome review passes:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

Formal M1/M2 evaluation remains unauthorized until an unlock is committed with the exact matching/config/file hashes.

## Resume entrypoint

On a new chat/session, start from:

```text
doc/namua-mtaji-transition/RESUME_HERE.md
```

and follow its read order before making any research decision.

## Interpretation boundary

This pause does not reopen any prior formal decision, negative/null result, threshold, classifier, candidate definition, or interpretation boundary.

> **The clean restart point is before any Stage 2 held-out formal generation.**
