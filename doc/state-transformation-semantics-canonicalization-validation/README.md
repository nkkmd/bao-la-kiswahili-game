# STSCV-STUDY1

Research Generation 2 `G2-03` — **State Transformation Semantics / Canonicalization Validation Study 1**.

## Status

```text
Study = COMPLETE
Formal decision = INCONCLUSIVE
T01 = NON-ESTIMABLE
T02 = NON-ESTIMABLE
T03 = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

The Stage 2 held-out production measurement completed, but the mandatory independent verifier failed during formal-result assembly. The prospectively frozen global-failure rule therefore closes the Study as `INCONCLUSIVE` and all three candidates as `NON-ESTIMABLE`.

Production-only zero-mismatch diagnostics are preserved as non-decisional evidence and are not formal validations.

## Read first

1. `STUDY_1_OVERVIEW.md`
2. `STUDY_1_FINAL_REPORT.md`
3. `CURRENT_STATUS.md`
4. `DECISION_REGISTER.md`
5. `REPRODUCIBILITY_INDEX.md`
6. `RESEARCH_LOG.md`
7. `STUDY_1_PROTOCOL.md` — original prospective protocol / historical contract

## Final machine-readable result

- `results/STAGE_2_FORMAL_RESULT.json` — repository-facing fail-closed formal closure
- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json` — failed Stage 2 workflow provenance
- `checkpoints/2026-08-28-stage2-fail-closed-closure.md` — closure checkpoint

## Stage 2 prospective contracts

- `preregistration/STAGE_2_SPEC.json`
- `preregistration/STAGE_2_FIREWALL.json`
- `preregistration/STAGE_2_DECISION_RULE.json`
- `preregistration/STAGE_2_AUTHORIZATION.json`
- `results/STAGE_2_PREFREEZE_MANIFEST.json`
- `results/STAGE_2_PREFREEZE_WORKFLOW_PROVENANCE.json`

Explicit formal authorization commit:

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

Authorized Stage 2 workflow:

```text
run = 33145860098
job = 98766622115
conclusion = failure
```

Independent verifier failure:

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

No same-evidence source repair/rerun was performed.

## Earlier stage records

Stage 0:

- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_0_WORKFLOW_PROVENANCE.json`

Stage 1:

- `preregistration/STAGE_1_CANDIDATE_CONTRACT.json`
- `preregistration/STAGE_1_SPEC.json`
- `preregistration/STAGE_1_AUTHORIZATION.json`
- `results/STAGE_1_PREFREEZE_MANIFEST.json`
- `results/STAGE_1_PREFREEZE_WORKFLOW_PROVENANCE.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`

Stage 1 remained development-only and generated no formal candidate decision.

## Representation boundary

Authoritative scientific input identity remains RAW-only:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason` are excluded.

At Study closure:

```text
canonicalization for scientific population identity = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
```

## Upstream immutability

This Study does not modify or rescue G2-01, G2-02, SIP-STUDY1, ORISC-STUDY1, REWR-STUDY1, SSGTC-STUDY1, or any other completed Study.

A future formal test of these transformation hypotheses requires a new prospective Study or explicitly new versioned protocol, fresh authorization, and fresh formal evidence.
