# ORISC-STUDY1 — Stage 0A Candidate / Population Proposal

Status: **HISTORICAL PRE-OUTCOME PROPOSAL / SUBSEQUENTLY FROZEN / STAGE 2 NOT EXECUTED**  
Scientific outcome inspected when this proposal was created: **NO**

## Purpose and provenance

This document records the Stage 0A proposal that derived the conditional Stage 2 symmetry candidates and population from Bao rule semantics before any ORISC Stage 1 formal representation-integrity outcome existed.

The proposal was subsequently frozen, without post-outcome tuning, in:

```text
preregistration/STAGE_2_CANDIDATE_CONTRACT.json
candidateContractSha256 = 6509dc18553d968437d87f7522cacebb4b66f13f15469240075964b72f1c8796
```

That machine-readable contract is authoritative for the candidate definitions. The proposed Stage 2 was never authorized or executed because Axis A later failed its prospectively frozen authorization gate.

## Semantic premises used before outcome

Current engine semantics used for derivation were:

```text
FRONT = 0
BACK = 1
HOUSE = 4
opponent facing front index = 7 - localIndex
raw identity = pits, reserve, houseOwned, player, phase, winner, pending
turn / reason excluded from raw identity
```

Pit arrays and sowing directions are player-local. Active nyumba remains fixed at local `HOUSE=4`, so unrestricted global local-LR reflection was not retained as a scientific all-state candidate.

Prior `SIP-STUDY1` candidate names and diagnostic zero-mismatch observations were declared prior information, not pass evidence or tuning data.

## Frozen controls

```text
ORISC-C00-IDENTITY
  mandatory positive control

ORISC-C01-LR-NO-DIRECTION-FLIP
  intentionally malformed Mtaji-houseless LR transform
  index reflected, sow direction deliberately not reflected
```

The negative control was selected from rule semantics and was not tuned to a target mismatch rate.

## Frozen scientific candidates

### `ORISC-T01-SEAT-SWAP-LOCAL`

Player-indexed state fields are swapped:

```text
pits[0] <-> pits[1]
reserve[0] <-> reserve[1]
houseOwned[0] <-> houseOwned[1]
pending[0] <-> pending[1]
player 0 <-> 1
winner 0 <-> 1
phase unchanged
```

Player-local move coordinates remain local. Expected inverse: involution. The transform does not preserve the raw standard initial state's `player=0`, so fixed-start reachability was not automatically claimed.

### `ORISC-T02-LR-MTAJI-HOUSELESS`

Frozen applicability:

```text
phase = mtaji
reserve = [0,0]
houseOwned = [false,false]
```

State pits reflect `i -> 7-i`; move index reflects `i -> 7-i`; direction and side both flip left/right. Player/winner/pending are preserved. Expected inverse: involution.

### `ORISC-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS`

Frozen composition of the T01 seat swap and T02 local-LR reflection on the T02 applicability domain. Expected inverse: involution.

## Frozen candidate-level decisions

The contract prospectively defined three candidate decisions rather than reproducing SIP-STUDY1's five-scope closure structure:

```text
ORISC-O01-T01
  required fresh Namua + fresh Mtaji + reconstructed exact-oracle scopes

ORISC-O02-T02
  required fresh Mtaji-houseless + reconstructed exact-oracle scopes

ORISC-O03-T03
  required fresh Mtaji-houseless + reconstructed exact-oracle scopes
```

Each candidate would have required all prospectively required scopes to pass with exact zero mismatch.

## Frozen fresh population

```text
seed block             = 23110001..23110128
seeds                  = 128
maximum trajectory ply = 160
roots per stratum      = 12
local expansion depth  = 4
strata                  = namua / mtaji / mtaji-houseless
```

Root selection was outcome-blind and based on first eligible states per seeded trajectory, raw-key deduplication, ascending raw key and fixed root count. Candidate behavior, mismatch counts, value, DTF, oracle result and canonical orbit quantities were forbidden selection inputs.

Shortage or runtime-guard failure was prospectively non-rescuing: no seed extension, root-count reduction, stratum replacement or depth reduction after candidate behavior.

## Frozen exact Stage 2 gates

```text
B-G1  source/candidate contract identity
B-G2  applicability and transformed-state validity
B-G3  state inverse/bijection
B-G4  exact move-set bijection using moveVariants where required
B-G5  move inverse/bijection
B-G6  exact transition commutation
B-G7  terminal equivalence
B-G8  winner equivariance
B-G9  bounded graph-node/edge isomorphism
B-G10 reconstructed exact-oracle value/DTF/optimal-move preservation where required
B-G11 production/independent equality
```

All applicable gates required exact zero mismatch.

## Final disposition

Formal Axis A later produced:

```text
ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
A-G11 IDENTITY = FAIL
A-G12 production/independent equality = PASS
```

The Stage 2 conditional gate therefore failed before any nontrivial candidate execution. Final status:

```text
Stage 2 authorization = NONE
Stage 2 execution = NONE
candidate validations = 0
candidate rejections = 0
candidate non-estimable decisions = 0
```

This proposal and its frozen contract must not be interpreted as scientific evidence for or against T01/T02/T03.