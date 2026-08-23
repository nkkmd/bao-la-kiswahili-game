# CURRENT_STATUS — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23

## Repository identity

```text
studyId = CPOB-STUDY1
baseline main HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
previously reported main HEAD = 2c452186fc1bfbe2800c84d9acc8546915c33da1
study branch = research/critical-positions-outcome-branching
draft tracking PR = #36 / DO NOT MERGE during active design
directory = doc/critical-positions-outcome-branching/
artifact root = artifacts/local/critical-positions-outcome-branching/
```

The verified current `main` had advanced beyond `2c452186...`; the study branch was created from the actual verified `576783b1...` HEAD.

## Current scientific state

```text
prior-study state restoration = COMPLETE
seed namespace audit = COMPLETE for tracked declarations at initiation
Stage 0 construct design = COMPLETE / FROZEN
Stage 0 technical execution = COMPLETE / PASS
Stage 0 independent technical replay verification = PASS
Stage 0 scientific data = NONE
Stage 1 prospective design = FROZEN / CONTRACT VALIDATION PENDING
Stage 1 scientific generation = NOT AUTHORIZED / NOT STARTED
Stage 2 scientific generation = NOT AUTHORIZED / NOT STARTED
scientific outcomes inspected = false
```

## Stage 0 technical validation

Validated branch source before Stage 0 closure:

```text
technical validation source head = b6d4fafd34720e59223cb645476f5e384890eacd
GitHub Actions run = 32624898086
job = 97158580192
technical smoke = PASS
independent replay verification = PASS
cap/replicate audit = PASS
independent cap/replicate replay = PASS
scientificSeedConsumed = false
reservedScientificSeedBlocksTouched = false
```

Deterministic technical core hashes exclude wall-clock timing:

```text
CPOB-S0-TECHNICAL-2026-08-23-v1 core hash
= 75aaa30a9f8154873bf9391c27b4720886fce17ec7402b68800c03b2cbe276cd

CPOB-S0-CAP-AUDIT-2026-08-23-v1 core hash
= 0530faca878fa71b86f6b55b355cd0b70f67b5f8c32e287b82ce10dd8bb77678
```

Technical artifact bundle:

```text
artifactId = 9489405729
zip SHA-256 = e38ae9939f75ba8dc03d49eca436f9ce06f4a2368122672df9981afa1793e2b3
retention = temporary CI artifact only
```

## Primary construct and frozen measurement

Primary construct:

```text
fixed-policy empirical continuation divergence
```

For every selected nonterminal root with at least two exact legal `E.moveVariants(root)` moves:

```text
root actor = state.player
root move interventions = every exact AI.moveKey variant
post-root continuation policy = P1_NORMAL_TOP3
replicates per exact root move = 64
maximum post-root continuation plies = 200
replicate pairing = common derived seed across all root moves at replicate index r
administrative cap = ADMINISTRATIVE_UNFINISHED, never draw/0.5
primary root estimability = every exact root move terminates in all 64 replicates
```

For an estimable root:

```text
p_hat_m = root-actor wins / 64 for exact root move m
D_range = max_m(p_hat_m) - min_m(p_hat_m)
Stage 1 high-divergence root = D_range >= 0.30
```

`p_hat_m` is a fixed-policy empirical continuation quantity. It is not a game-theoretic probability and is not derived from the inconclusive Calibration Study isotonic mapping.

## Continuation-policy technical decision

Stage 0 prospectively compared only the three pre-enumerated technical candidates:

```text
P1 = seeded existing normal / bao top-3 immediate-score policy
P2 = seeded exact D2-ranked top-3 / bao / phase2 / Q1 wrapper
P3 = seeded uniform exact legal moves
```

All three were exactly replayable under supplied RNG. On the fixed smoke workload, run-specific wall-clock observations were approximately:

```text
P1 = 2.279 ms / recorded continuation ply
P2 = 52.513 ms / recorded continuation ply
P3 = 0.280 ms / recorded continuation ply
```

P2 was therefore about 23× P1 on this technical workload and was judged impractical as the every-ply continuation policy for exhaustive all-root-move × 64-replicate measurement plus independent remeasurement. P3 is substantially cheaper but intentionally weak as a strategic continuation policy. P1 is frozen as the primary balance of seeded stochasticity, existing engine semantics, exact replayability, and feasible cost.

P2 remains available only as a secondary root search-value instrument. P3 remains a technical comparator, not a primary scientific continuation.

## Cap / replicate technical audit

P1 was independently replayed for 64 technical replicates to a maximum cap of 200 from one fixed non-scientific fixture/root-move.

```text
terminal continuation ply min = 7
terminal continuation ply max = 104
terminal continuation ply mean = 45.25

R=64 / cap=80  completion = 60/64 = 0.9375
R=64 / cap=120 completion = 64/64 = 1.0000
R=64 / cap=160 completion = 64/64 = 1.0000
R=64 / cap=200 completion = 64/64 = 1.0000
```

These are technical fixture results only. They do not establish population-level completion or any scientific win rate. The scientific cap is frozen conservatively at 200; roots failing complete 64/64 termination for any legal move are primary-non-estimable with no replacement.

## Immutable inherited formal states

```text
Blunder / Misvaluation Patterns Study 1:
  4 estimable formal candidates
  0 CONFIRMED
  4 NOT-CONFIRMED
  CLOSED

Position Evaluation / Win-Rate Calibration Study 1:
  FORMAL DECISION = INCONCLUSIVE
  Stage 1 isotonic mapping = exploratory only

Position Complexity / Difficulty Study 1:
  PCX-H1 = INCONCLUSIVE
  PCX-H2 = NOT-CONFIRMATORILY-EVALUATED

Tactical Motifs / Tesuji Study 1:
  C01 = NOT-CONFIRMED
  C02 = NOT-CONFIRMED
  C03 = CONFIRMED
  C04 = NOT-CONFIRMED

Tactical Motif Human / Expert Validation Study 1:
  machineEvidence = CONFIRMED
  humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
  N = 0

Namua→Mtaji Strategic Temporal Transition Study 1:
  FORMAL DECISION = NOT-CONFIRMED
  first Mtaji observation under frozen engine = deterministic ply 44 for Mtaji-reaching trajectories
```

No label above may be changed by this study.

## Seed reservation

```text
Stage 0 scientific seed block = NONE
Stage 1 reserved = 22600001..22603072 (3072 seeds)
Stage 2 reserved = 22700001..22706144 (6144 seeds)
```

Reservation is not authorization. Continuation RNG seeds are deterministically derived from stage salt + root identity + replicate index and do not expand the source-game seed namespace.

## Stage 1 blocking gates

Stage 1 scientific generation remains blocked until all of the following are complete and committed:

- exact Stage 1 exploratory spec validation;
- candidate grammar / bins / support / diversity / caps contract tests;
- scientific runner technical validation with scientific generation disabled;
- independent corpus and continuation remeasurement verifier technical validation;
- exact Stage 1 spec SHA-256;
- exact scientific source-file SHA-256 mapping;
- separate source-bound Stage 1 generation authorization.

The Stage 1 spec itself does **not** authorize generation.

Stage 2 remains blocked until Stage 1 is generated, independently verified, consumed as exploratory evidence, candidate definitions are frozen, Stage 2 formal rules are preregistered, source-bound authorization exists, and fresh evidence is guaranteed.
