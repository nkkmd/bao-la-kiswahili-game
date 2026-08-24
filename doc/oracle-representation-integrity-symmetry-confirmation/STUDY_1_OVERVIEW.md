# Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1 — Overview

**Study ID:** `ORISC-STUDY1`  
**Status:** Study initialized; no formal scientific result yet.

## Research question

The study asks two deliberately separated questions.

### Axis A — Oracle Representation Integrity

Can the Bao engine-semantic raw state, terminal-state accounting, raw serialization, SHA-256 state identity, immutable Restricted Endgame 8-state graph, and repository-facing oracle rows be reconstructed under one prospectively frozen contract with exact production/independent agreement?

The audit distinguishes at minimum:

```text
engine-semantic state
serialized raw rule state
stateKey
workflow-run raw state row
repository-facing stored state row
reconstructed raw state
reporting/display representation
```

These objects must not be treated as interchangeable merely because they describe the same nominal position.

### Axis B — Independent Symmetry Confirmation

Only if Axis A passes its predefined authorization gate, can a separately frozen set of nontrivial state/move transforms be evaluated for exact move-equivariance, transition commutation, terminal/winner semantics, graph isomorphism, inverse properties, and downstream canonicalization eligibility.

## What this study does not change

The study cannot revise any existing formal decision.

- `REWR-STUDY1` stays `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` for its frozen 8-state / 7-edge domain.
- `SIP-STUDY1` stays completed at `0 validated / 0 rejected / 5 NON-ESTIMABLE`.
- `SIP-S1-FORMAL-2026-08-24-v1` stays technically invalidated for candidate-decision use.
- SIP corrected v2 stays not authorized and not executed.
- Existing oracle state/edge/value/DTF/optimal-move claims are not rewritten by this study.

## Known prior information declared before the new formal protocol

At study start, prior documentation already recorded that three repository-facing terminal `stateRows.ruleState` snapshots do not re-hash to their stored state keys and represent 63 rather than 64 seeds when `pending=[0,0]` is used.

A new **technical provenance recovery performed before any ORISC formal outcome generation** additionally recovered the original Restricted Endgame scientific workflow artifact (`runId 32702596730`, artifact `9511074442`). In both the original production file and the independent verification file, the three affected terminal states carry:

```text
pending = [1,0]
represented seed total = 64
```

and all eight raw states represent 64 seeds. The repository-facing canonical result introduced later contains `pending=[0,0]` in those three rows.

This provenance fact is treated as **known prior technical information**, not as an `ORISC-STUDY1` Stage 1 result. Stage 1 must re-evaluate the prospectively frozen endpoints independently.

## Why the distinction matters

The original production and independent tablebase machinery used raw state identity containing:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

while excluding administrative/history fields `turn` and `reason` from the state key. The engine's terminal capture path can remove captured seeds from the opponent front row and place the removed quantity in `pending` before setting the winner. Therefore a reporting snapshot that drops `pending` can describe the same visible board yet fail raw identity and seed-conservation reconstruction.

## Planned decision flow

```text
Stage 0A provenance/semantic audit
    |
    v
Stage 0B freeze all outcome-facing contracts
    |
    v
Stage 1 representation integrity
    |-- not confirmed / non-estimable --> Stage 2 blocked
    |
    `-- confirmed + identity gate pass --> separate Stage 2 authorization possible
                                              |
                                              v
                                      independent symmetry confirmation
                                              |
                                              v
                                      Stage 3 downstream decision
```

## Current scientific status

No `ORISC-STUDY1` scientific endpoint has been evaluated. No nontrivial symmetry candidate has a new-study pass/fail label. No canonicalization or symmetry-reduced state counting is authorized.