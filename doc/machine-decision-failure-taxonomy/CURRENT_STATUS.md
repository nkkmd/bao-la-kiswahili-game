# MDFT-STUDY1 — 現在の状態

更新日: 2026-08-30

## 研究識別

```text
Program = G2-08
Study ID = MDFT-STUDY1
Formal title = Machine Decision-Failure Taxonomy Study 1
Baseline remote main = cb660e166460e0f19d4ba16d5283fa880d55757f
Branch = research/g2-08-machine-decision-failure-taxonomy
Stage 0 = MDFT-S0-TECHNICAL-2026-08-29-v1
Stage 1 = MDFT-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = MDFT-S2-FORMAL-2026-08-29-v1
```

## 現在の正式状態

```text
Study = ACTIVE
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = AUTHORIZED / CURRENT CONSUME-ONCE RUN IN PROGRESS
Stage 1 run = 33277102013
Stage 1 seeds 28910001..28914096 = CONSUMED
same-block rerun / repair / replacement / extension = NOT AUTHORIZED
Stage 2 = NOT AUTHORIZED / NOT EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
scientificInferenceAuthorized = false until canonical Stage 1 result verification
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## Stage 0 closure

Canonical Stage 0 disposition:

```text
STAGE0-TECHNICAL-PASS
```

Technical eligibility fixed before Stage 1 evidence:

```text
MDFT-F05 = TECHNICALLY-ELIGIBLE
MDFT-F09 = TECHNICALLY-INELIGIBLE
MDFT-F10 = TECHNICALLY-ELIGIBLE
```

F09 is excluded because the historically frozen morphology classifier cannot be reconstructed exactly from currently preserved repository sources without refit or invention. This does not modify the historical Position Typology result.

## Stage 1 preregistration / preflight

```text
specSha256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
canonical technical preflight run = 33258188633
preflight artifact = 9716460551
preflight all gates = PASS
preflight target distribution reported = false
scientific runner readiness run = 33277031634 / success
source freeze = preregistration/STAGE_1_SOURCE_FREEZE.json
authorization = authorizations/STAGE_1_EXECUTION_AUTHORIZATION.json
```

The canonical preflight exact-matched production/independent source generation, root selection, Stage 1 analysis and forced F10 on technical-only seeds. The 8 MiB transfer probe also succeeded.

## Stage 1 consumption boundary

Execution-start gate for run `33277102013` passed. Therefore:

```text
28910001..28914096 = CONSUMED permanently
```

This remains true even if later computation, verification, serialization or artifact transfer fails. The block must never be returned to `UNCONSUMED`.

## Immutable upstream boundaries

Research Generation 2 `G2-01..G2-07` and Research Generation 1 canonical decisions remain unchanged. In particular:

```text
STSCV validated transform set = []
RCPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 seeds = CONSUMED
PCRPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
BMP-STUDY1 = 0 CONFIRMED / 4 NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
```

PCRPR production-only `F05_ALL` / `lambda=100` / OOF metrics are not validated inputs to G2-08.

## RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
```

## 次の工程

Current authorized run `33277102013` alone is allowed to finish. After job completion:

1. verify mandatory artifact upload;
2. inspect `CONSUMPTION_RECORD.json`, `FINAL_EXACT_COMPARISON.json`, `HASH_MANIFEST.json`, full production/independent shards and `STAGE_1_DEVELOPMENT_RESULT.json`;
3. bind the canonical Stage 1 disposition without threshold/leaf/seed rescue;
4. if Stage 1 passes, freeze the Stage 2 target/spec but do **not** execute Stage 2 without a new explicit authorization;
5. if Stage 1 is blocked/invalid/resource-censored, keep Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED` according to the frozen rule.
