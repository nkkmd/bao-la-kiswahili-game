# STSCV-STUDY1 — Current Status

Updated: 2026-08-28

## Status

**STUDY COMPLETE / FORMAL DECISION `INCONCLUSIVE` / 3 CANDIDATES `NON-ESTIMABLE` / CANONICALIZATION `NON-ESTIMABLE` / NO TRANSFORM VALIDATED**

## Identity

```text
Program = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Formal title = State Transformation Semantics / Canonicalization Validation Study 1
Baseline main = a8493d2a50e11f15d16ef8348f2442b262ca275d
Research branch = research/g2-03-state-transformation-semantics-canonicalization-validation
```

Japanese working title:

**Baoにおける状態変換意味論とcanonicalizationの厳密検証 — rule-semantic validity, legal-move equivariance, successor binding, graph isomorphism, and prospective canonicalization authorization**

## Final formal closure

```text
Study = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

This is a technical/reproducibility non-estimability closure, not a scientific rejection of the candidate transforms.

## Stage progression

```text
Stage 0 = STSCV-S0-TECHNICAL-2026-08-28-v1 — completed / technical
Stage 1 = STSCV-S1-DEVELOPMENT-2026-08-28-v1 — completed / development only
Stage 2 = STSCV-S2-FORMAL-2026-08-28-v1 — executed / fail-closed INCONCLUSIVE
```

Stage 1 used 72 fresh development roots: 24 Namua + 24 Mtaji + 24 Mtaji-houseless. Those identities were prospectively firewalled from Stage 2 at trajectory-seed, opening-prefix, and RAW-state levels.

Stage 2 prospectively froze seeds `26032001..26032768`, 32 roots per stratum, depth 3, zero mismatch tolerance, no replacement outside the seed block, and no seed extension after outcome.

## Stage 2 prefreeze and authorization

Hardened Stage 2 prefreeze:

```text
workflow run = 33145713610
head = bb6df48ab46bd1379d9aedbadb97db995e961271
conclusion = success
scientific outcome existed = false
```

Explicit authorization commit:

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

The authorization was bound to the frozen spec, candidate contract, Stage 1 firewall, decision rule, RAW identity, source hashes, production runner, and independent verifier before Stage 2 outcome generation.

## Stage 2 formal workflow

```text
workflow = STSCV Stage 2 Formal
run = 33145860098
job = 98766622115
head = c7619ded9f682b499a02d023b40ac54ba4dc95ca
conclusion = failure
```

Successful steps:

```text
engine regression = PASS
frozen source reconstruction = PASS
fresh held-out production measurement = PASS
```

Production selected the frozen target exactly:

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
```

Production-only diagnostics reported candidate mismatch count 0 for T01/T02/T03. These are not candidate decisions.

Mandatory independent verification then terminated during formal-result assembly with:

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

The workflow-produced canonical independent-verification artifact, independently verified formal-result artifact, SHA256SUMS, and workflow artifact ZIP were therefore not materialized. A separate repository-facing fail-closed closure was subsequently recorded at `results/STAGE_2_FORMAL_RESULT.json` by applying the already-frozen global-failure rule; it is not the missing workflow-produced independently verified result.

## Frozen global-rule application

The Stage 2 decision rule requires all global gates to PASS before candidate mismatch is scientifically interpretable.

```text
S2-G1 = PASS
S2-G2 = PASS
S2-G3 = PASS
S2-G4 = PASS
S2-G5 = NOT-ESTABLISHED
S2-G6 = PASS
all global gates PASS = false
```

Therefore the prospectively frozen global-failure rule requires:

```text
study = INCONCLUSIVE
candidate = NON-ESTIMABLE
canonicalization = NON-ESTIMABLE
scientific mismatch interpretation = not authorized
```

## Authoritative representation

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
```

No transform is authorized for scientific population identity, canonicalization, or symmetry-reduced state counting.

Production diagnostics additionally showed that none of T01/T02/T03 preserves the standard initial RAW state, and no independent standard-start reachability-closure proof was implemented.

## Immutable upstream state

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
SRDR primaryFormalCriterion = null
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
SIP v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
SIP corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

G2-03 changes none of these decisions.

## No-rescue closure

The verifier defect became known after fresh held-out Stage 2 outcome generation. The verifier source is not repaired and the same Stage 2 evidence is not rerun to rescue the formal decision.

A new formal test of these hypotheses requires a new prospective Study or explicitly new versioned protocol with fresh authorization and fresh formal evidence.

## Canonical closure documents

- `STUDY_1_FINAL_REPORT.md`
- `results/STAGE_2_FORMAL_RESULT.json`
- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json`
- `checkpoints/2026-08-28-stage2-fail-closed-closure.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`

## Repository state

Integrated into `main` through PR #69 after the final documentation and CI audit.

```text
Final research head = c6f2fa750ce2e30a5ce359b9f3c594145c8e5a38
Merge commit = 2b5f297e09330348fdb2c42472aed50340eb0180
Integrated branch = main
```

Post-merge integration provenance is recorded in:

- `checkpoints/2026-08-28-main-integration.md`
- `results/MAIN_INTEGRATION_PROVENANCE.json`

Repository integration does not change the formal scientific closure, validated transform set, canonicalization boundary, or no-rescue rule.
