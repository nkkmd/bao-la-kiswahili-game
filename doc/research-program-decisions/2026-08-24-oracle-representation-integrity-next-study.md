# Research Program Decision — Oracle Representation Integrity / Symmetry Confirmation

Date: 2026-08-24  
Status: **RECORDED — NEXT PROSPECTIVE INDEPENDENT STUDY**

## Decision

The next Bao research study will be conducted as a new prospective independent study under the working title:

> **Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1**
>
> Japanese working description: **限定終盤exact oracleの表現整合性・raw-state identity監査と、独立したsymmetry confirmation**

This study is selected **before** State Space / Game Tree Complexity research.

## Research-program sequence

```text
Restricted Endgame / Winning Regions Study 1
  -> completed; immutable formal decision retained

Symmetry / Isomorphic Positions Study 1
  -> completed; Study-level 0 validated / 0 rejected / 5 NON-ESTIMABLE

Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1
  -> NEXT prospective independent study

State Space / Game Tree Complexity
  -> after the oracle-integrity / symmetry-confirmation study
```

Although raw-state State Space / Game Tree Complexity research is technically possible without symmetry reduction, the research program will intentionally perform the oracle-integrity / symmetry-confirmation study first so that later state-space work has an explicit, independently validated decision on whether any symmetry reduction is authorized.

## Independence and no-rescue boundary

This new study must not reopen, rescue, amend, or reinterpret the formal decisions of either completed upstream study.

### Restricted Endgame / Winning Regions Study 1

The following remain immutable:

- formal decision `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`;
- frozen 8-state / 7-edge bounded-domain result;
- existing state/edge/solution identities, value, DTF, and optimal-move claims within that frozen boundary.

The new study may audit whether the stored result artifact is suitable for **raw-state identity reconstruction and downstream transform validation**, but that audit is a new endpoint and does not retroactively change the prior exact-solution decision.

### Symmetry / Isomorphic Positions Study 1

The following remain immutable:

- Study-level closure: 0 validated / 0 rejected / 5 `NON-ESTIMABLE`;
- v1 candidate-decision execution remains technically invalidated for candidate-decision use;
- v1 fresh zero-mismatch observations remain diagnostic evidence only;
- corrected v2 was not authorized or executed;
- no T01/T02/T03 canonicalization or symmetry reduction is authorized by Study 1.

The new study must not be treated as a continuation, rescue stage, or retroactive v2 of `SIP-STUDY1`. It must use a new study ID, a fresh prospective protocol, explicit source identities, and pre-outcome decision rules.

## Prospective research targets

The exact protocol will be frozen only when the new study starts. At minimum, the design should separately address:

1. terminal-state representation and raw `ruleState` identity;
2. `stateKey` serialization / re-hash contract;
3. pending/captured-seed accounting and 64-seed conservation representation;
4. reconstruction of the immutable Restricted Endgame graph from an independently specified source contract;
5. identity-positive-control behavior before any nontrivial transform decision is authorized;
6. production / independent implementation agreement;
7. only after the representation-integrity gates pass, a prospectively specified symmetry/isomorphism confirmation stage;
8. explicit downstream authorization or prohibition of canonicalization and symmetry-reduced state counting.

No candidate transformation, corrected representation rule, reconstruction method, population, seed block, or pass/fail criterion may be selected after inspecting the new study's scientific outcome.

## Downstream contract

Until this new study produces its own valid formal result:

```text
validated symmetry transformation set = empty
canonicalization from SIP-T01/T02/T03 = not authorized
symmetry-reduced state counting = not authorized
raw state identity = authoritative downstream representation
```

State Space / Game Tree Complexity research is therefore **programmatically deferred until after this study**, even though a raw-only version would otherwise be technically permissible.

## Human-evidence boundary

The existing decision to defer human/expert-dependent research is unchanged. This next study is machine-only unless a future prospective protocol explicitly adds a separate human evidence axis.

## Start condition

When this study is actually started, it should begin in a new chat and a new dedicated research branch from then-current `main`. The current file records only the research-program ordering decision; it does not preregister scientific hypotheses or authorize outcome generation.
