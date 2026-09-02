# SFCDF-STUDY1 — Current Status

Updated: 2026-09-02

```text
Study = SFCDF-STUDY1
Program position = Research Generation 3 / G3-04
Status = ACTIVE / STAGE1-PASS / STAGE2-NOT-AUTHORIZED
Research branch = research/g3-04-structural-forcing-corridor-decision-funnel
baseline remote main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
program review = G3-04-AUTHORIZED
Stage 0 = SFCDF-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS
Stage 1 = SFCDF-S1-DEVELOPMENT-2026-09-02-v1 / STAGE1-PASS
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 1
Stage 1 seed = 31410001..31410192 / CONSUMED
Stage 2 = SFCDF-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31420001..31420288 / NOT CONSUMED
no-rescue boundary = CROSSED / ACTIVE
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## Frozen scientific boundary

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
principal families = LGTGMIV F5,F2,F3,F4
auxiliary family = LGTGMIV F1
```

Candidate endpoints remain the prospectively frozen C1–C6 family. C1–C3 are corridor descriptors and C4–C6 are funnel descriptors; no combined class is defined.

## Stage 0

Authorized v2 technical run `33620251552` passed. Canonical deterministic technical core:

`14e7640dcd302c402c21a5acbe44bcbf004956670f467763faf7c301e545a295`

Stage 0 used no fresh scientific seed and did not access the protected depth-10 holdout.

## Stage 1 execution

Exactly one authorized scientific run was performed:

```text
run = 33621863279
trigger SHA = 75f2691c19533ce9300abfda88987ad3436d381e
lease commit = 923f890302e50a1ae19d184eb9120105559f8381
scientific job = success
artifact = 9843276993
artifact ZIP SHA-256 = b3aeea3c1058d98b8b59fe0eaa69edc734f60e2ccb04223a464d842a78e33a56
mirror commit = b7b2abfa
```

Integrity/estimability state:

```text
selected pairs = 12
selected roots = 24
population complete = true
root/stage resource gates = PASS
source identity exact = true
all roots exact = true
pair comparison exact = true
development exact = true
stage scientific exact = true
production stage scientific core = fb8929e2a27802e46431deb79fcfafe78d9598301f6252f3ad6ffea485216cca
independent stage scientific core = fb8929e2a27802e46431deb79fcfafe78d9598301f6252f3ad6ffea485216cca
```

## Frozen promoted candidate set

Only the following two candidates are promoted to possible Stage 2 evaluation:

1. `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION` — **`MTAJI-GREATER`**
2. `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO` — **`NAMUA-GREATER`**

The four non-promoted candidates C2–C5 cannot be revived in Stage 2.

Stage 1 development counts:

```text
C1: 11 Mtaji>Namua / 1 Namua>Mtaji / 0 ties
C6: 0 Mtaji>Namua / 10 Namua>Mtaji / 2 ties
```

These development counts are not formal confirmation.

## Current boundary

Stage 1 reports `stage2AuthorizationEligible=true`, but Stage 2 is still **NOT AUTHORIZED**.

The next safe action is a separate Stage 2 preparation/authorization review. Stage 2 may use only the frozen promoted set/directions and Stage 1 identity information needed for the formal firewall. No Stage 2 seed may be read until the formal runner/workflow/source bindings are frozen, non-scientifically validated, and a separate exactly-one Stage 2 execution authorization is committed.
