# Research Program Decision — Oracle Representation Integrity / Symmetry Confirmation

Date: 2026-08-24  
Updated: 2026-08-25  
Status: **RECORDED — SEQUENCE DECISION FULFILLED / ORISC-STUDY1 COMPLETED**

## Original decision

The next Bao research study after Symmetry / Isomorphic Positions Study 1 was selected as a new prospective independent study under the working title:

> **Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1**
>
> Japanese working description: **限定終盤exact oracleの表現整合性・raw-state identity監査と、独立したsymmetry confirmation**

This study was intentionally selected **before** State Space / Game Tree Complexity research.

## Fulfillment update — 2026-08-25

The sequence decision has now been fulfilled as `ORISC-STUDY1`.

Final result:

```text
ORISC-STUDY1 = COMPLETED
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated symmetry transformation set = []
canonicalization = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
raw state identity = authoritative
```

Axis A independently reconstructed the immutable raw 8-state / 7-edge Restricted Endgame graph with production/independent equality, 64-seed conservation, terminal captured/pending accounting and transition closure. Three immutable repository-facing terminal rows nevertheless failed the prospectively frozen stored-row re-hash and reconstructed raw-state binding gates; the identity-field difference was `pending` only. Because production and independent implementations agreed exactly, the formal result is `NOT-CONFIRMED`, not `NON-ESTIMABLE`.

The conditional symmetry stage had been frozen before Axis A outcome but required Axis A `CONFIRMED` and IDENTITY PASS. Those conditions were not met, so no nontrivial symmetry candidate was executed or assigned a formal pass/fail label.

## Current research-program sequence

```text
Restricted Endgame / Winning Regions Study 1
  -> completed; immutable formal decision retained

Symmetry / Isomorphic Positions Study 1
  -> completed; Study-level 0 validated / 0 rejected / 5 NON-ESTIMABLE

Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1
  -> completed; Axis A NOT-CONFIRMED / Axis B NOT-AUTHORIZED-NOT-EXECUTED

State Space / Game Tree Complexity
  -> next machine-only candidate, RAW-STATE IDENTITY ONLY
```

The original rationale for placing ORISC before State Space has therefore been satisfied. State Space / Game Tree Complexity may now proceed without waiting for another symmetry study, provided its formal representation uses authoritative raw state identity and does not use any unvalidated transformation for state reduction.

## Independence and no-rescue boundary

This sequence update does not reopen, rescue, amend, or reinterpret the formal decisions of either completed upstream study.

### Restricted Endgame / Winning Regions Study 1

The following remain immutable:

- formal decision `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`;
- frozen 8-state / 7-edge bounded-domain result;
- existing state/edge/solution identities, value, DTF, and optimal-move claims within that frozen boundary.

ORISC evaluated the separate downstream endpoint of whether the repository-facing stored result is suitable for **raw-state identity reconstruction and downstream transform validation**. Its failure at that endpoint does not retroactively change the prior exact-solution decision.

### Symmetry / Isomorphic Positions Study 1

The following remain immutable:

- Study-level closure: 0 validated / 0 rejected / 5 `NON-ESTIMABLE`;
- v1 candidate-decision execution remains technically invalidated for candidate-decision use;
- v1 fresh zero-mismatch observations remain diagnostic evidence only;
- corrected v2 was not authorized or executed;
- no T01/T02/T03 canonicalization or symmetry reduction is authorized by Study 1.

`ORISC-STUDY1` was not a continuation, rescue stage, or retroactive v2 of `SIP-STUDY1`, and its result does not modify SIP closure.

## ORISC prospective targets and their disposition

The original sequence decision required a future protocol to separately address:

1. terminal-state representation and raw `ruleState` identity;
2. `stateKey` serialization / re-hash contract;
3. pending/captured-seed accounting and 64-seed conservation representation;
4. reconstruction of the immutable Restricted Endgame graph from an independently specified source contract;
5. identity-positive-control behavior before any nontrivial transform decision;
6. production / independent implementation agreement;
7. only after representation-integrity gates pass, a prospectively specified symmetry/isomorphism confirmation stage;
8. explicit downstream authorization or prohibition of canonicalization and symmetry-reduced state counting.

`ORISC-STUDY1` implemented these requirements prospectively. Items 1–6 were formally evaluated in Axis A; the repository-facing binding requirement failed while production/independent equality passed. Item 7 therefore remained conditionally blocked. Item 8 closed with no canonicalization or symmetry-reduced counting authorization.

No candidate transformation, corrected representation rule, reconstruction method, population, seed block, or pass/fail criterion was selected after inspecting the formal Axis A outcome.

## Current downstream contract

After completion of ORISC-STUDY1:

```text
validated symmetry transformation set = empty
canonicalization = not authorized
symmetry-group claim = not authorized
symmetry-reduced state counting = not authorized
raw state identity = authoritative downstream representation
State Space / Game Tree Complexity = may proceed RAW-ONLY
```

If a future study wishes to repair or replace the repository-facing oracle representation, or to test nontrivial symmetries again, it must do so as a new prospective study/versioned protocol. It must not rewrite the closed ORISC result or the upstream REWR/SIP decisions.

## Human-evidence boundary

The existing decision to defer human/expert-dependent research is unchanged. ORISC-STUDY1 was machine-only; no human claim was added.

## Historical significance of this record

This file originally recorded why ORISC should precede State Space. It now records that the prerequisite study was completed and that its result authorizes only the raw-state route forward. It does not itself authorize or execute the next State Space / Game Tree Complexity study.