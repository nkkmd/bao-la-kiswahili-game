# 2026-08-25 — ORISC-STUDY1 closure checkpoint

Study: `ORISC-STUDY1`  
Status: **COMPLETED**

## Immutable upstream boundary

```text
REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN / 8 states / 7 edges / unchanged
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE / unchanged
upstream oracle rows rewritten = false
```

## Frozen formal identities

```text
Stage 2 candidate contract SHA-256
6509dc18553d968437d87f7522cacebb4b66f13f15469240075964b72f1c8796

Stage 1 spec SHA-256
5a766ec900c1f76c5b832f2c76153b9426b3970316b31806d377c497d1e585e5

Stage 1 authorization SHA-256
b8bc9c65510c2f4ea0909e269af7945d7ae5d3d32b595224519b1549a275325e
```

## Authorized Stage 1 workflow

```text
runId = 32753073798
jobId = 97514309075
artifactId = 9529771157
artifact ZIP SHA-256 = 13844208eeaaa4ae8eedc35724a0d71ed043f982cfaaa48cf1d692133d74d6e8
production resultSha256 = 03b112ba6dc1b79d65e4bfd3dbba603f0a20d0f3e16ab9d98a37e9bf50f6afe9
independent verification resultSha256 = 3501a65b4920e9ae44f55e2a46da370f750cbac01c1293398dc7b020cdae4bcf
```

## Axis A final decision

```text
ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED

PASS = A-G1 A-G2 A-G3 A-G4 A-G5 A-G6 A-G7 A-G10 A-G12
FAIL = A-G8 A-G9 A-G11
```

The frozen raw graph reconstructed exactly in both independent tracks. Three immutable repository-facing terminal rows failed stored-row re-hash and raw-state binding. The only identity-field difference was `pending`; repository rows represented 63 seeds and reconstructed raw states represented 64.

Because production and independent implementations agreed exactly (`A-G12=PASS`), this is an interpretable representation-integrity failure rather than `NON-ESTIMABLE`.

## Axis B disposition

```text
status = NOT-AUTHORIZED-NOT-EXECUTED
nontrivial candidate decisions generated = 0
Stage 2 authorization = NONE
Stage 2 scientific result = NONE
```

The candidate contract was frozen before Axis A outcome, but Axis A `CONFIRMED` and IDENTITY PASS were mandatory prerequisites and were not met.

## Final downstream contract

```text
validated symmetry transformation set = []
canonicalization = NOT AUTHORIZED
symmetry-group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
raw state identity = authoritative
State Space / Game Tree Complexity may proceed = RAW-ONLY
```

## Canonical closure artifacts

- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `results/STAGE_1_FORMAL_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`

No further scientific outcome generation is authorized within ORISC-STUDY1. `main` integration is not performed by this checkpoint.