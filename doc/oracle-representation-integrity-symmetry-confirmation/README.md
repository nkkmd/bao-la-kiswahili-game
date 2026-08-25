# Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1

**Study ID:** `ORISC-STUDY1`  
**Status:** **COMPLETED**  
**Axis A:** `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`  
**Axis B:** `NOT-AUTHORIZED-NOT-EXECUTED`  
**Branch:** `research/oracle-representation-integrity-symmetry-confirmation`  
**Baseline main HEAD:** `e8f0a3c360d9e7c9f7f6882fb212a32921040912`

## Purpose

This prospective independent Bao study audited whether the immutable Restricted Endgame Study 1 repository-facing exact-oracle representation is suitable as a raw-state reconstruction anchor. A separate symmetry/isomorphism confirmation stage was allowed only if prospectively frozen representation-integrity gates passed.

The study was not a continuation, corrected v2, rescue, or retrospective reanalysis of `SIP-STUDY1`, and it did not change `REWR-STUDY1`.

## Final result

Axis A independently reconstructed the frozen raw graph exactly:

```text
states = 8
edges = 7
production / independent graph equality = PASS
production / independent serializer equality = PASS
all reconstructed represented seed totals = 64
terminal accounting mismatches = 0
transition successor mismatches = 0
```

However three immutable repository-facing terminal rows failed the prospectively frozen stored-row re-hash and reconstructed raw-state binding gates. In all three, the identity-field difference was `pending` only and the repository row represented 63 seeds rather than 64.

Therefore:

```text
Axis A formal decision = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
A-G8 = FAIL
A-G9 = FAIL
A-G11 IDENTITY = FAIL
A-G12 production/independent equality = PASS
```

Because Axis A and IDENTITY did not satisfy the conditional Stage 2 authorization gate:

```text
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
nontrivial symmetry candidate decisions = 0
```

## Immutable upstream boundaries

`REWR-STUDY1` remains:

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
states = 8
edges = 7
```

`SIP-STUDY1` remains:

```text
formalDecision = NON-ESTIMABLE
validated = 0
rejected = 0
nonEstimable = 5
```

No upstream oracle row was rewritten.

## Final downstream contract

```text
raw state identity = authoritative
validated symmetry transformation set = empty
canonicalization = NOT AUTHORIZED
symmetry-group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
State Space / Game Tree Complexity = may proceed RAW-ONLY
```

The ORISC result does not show that the unexecuted T01/T02/T03 candidates are false symmetries.

## Canonical documents

- `STUDY_1_OVERVIEW.md` — human-readable result overview
- `STUDY_1_FINAL_REPORT.md` — scientific and technical final integration
- `results/STAGE_1_FORMAL_RESULT.json` — canonical Axis A formal result
- `results/STUDY_1_FINAL_RESULT.json` — Study-level closure
- `CURRENT_STATUS.md` — final status and downstream boundary
- `DECISION_REGISTER.md` — prospective decisions, no-rescue rules and closure decisions
- `REPRODUCIBILITY_INDEX.md` — source/hash/workflow identities
- `RESEARCH_LOG.md` — chronology
- `preregistration/STAGE_1_FORMAL_SPEC.json` — frozen Axis A spec
- `preregistration/STAGE_1_AUTHORIZATION.json` — Axis A authorization
- `preregistration/STAGE_2_CANDIDATE_CONTRACT.json` — pre-outcome conditional Stage 2 contract; **never authorized/executed**

## Historical design documents

- `PROTOCOL_DRAFT.md` — prefreeze design draft, superseded by the frozen formal spec
- `STAGE_0A_TECHNICAL_AUDIT_PLAN.md` — Stage 0A technical-only plan
- `STAGE_0A_TECHNICAL_AUDIT.md` — completed technical/provenance audit
- `STAGE_0A_CANDIDATE_POPULATION_PROPOSAL.md` — pre-outcome proposal later frozen in the Stage 2 candidate contract

No further scientific outcome generation is authorized within this completed Study 1.