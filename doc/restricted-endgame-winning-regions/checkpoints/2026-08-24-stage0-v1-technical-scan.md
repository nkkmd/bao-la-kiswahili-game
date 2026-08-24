# Checkpoint — Stage 0 v1 technical scan

Date: 2026-08-24  
Study: `REWR-STUDY1`  
Stage: `REWR-S0-TECHNICAL-2026-08-24-v1`

## Integrity

```text
baseline study branch head tested = 1ecde27ded98e2f37eedbe12d3f72ca0adddc11c
spec SHA-256 = a407de009e121b5bd1cad883cac6f83d35663a7241a56c34485805d169276c58
manifest SHA-256 = 5c15b5e45c3a5f1c0e42def4f9b2bd252d5f544fbc64e862156ae3f15d54e292
workflow run = 32698255065
workflow artifact id = 9509616363
artifact ZIP SHA-256 = c0dc8a4d51ea7fcbacbe0dbc0c0a665bb6863ebd84bb1b066837b2885cb6c8ab
```

All relevant CI steps passed:

- baseline `engine.test.js`;
- synthetic retrograde semantics;
- guard-free Mtaji transition parity;
- witness / closure mechanics;
- technical-only witness/root scan;
- scientific outcome firewall assertion.

## Technical scan result

```text
technical seed block = 22800001..22800256
games = 256
maximum trajectory ply = 240
unique witness-reachable base-eligible Mtaji roots = 3464
v1 candidate plan count = 0
scientific outcome fields emitted = false
```

The v1 root filter required `nonEmptyPitCount <= 14`. The witness-root population had observed minimum `nonEmptyPitCount = 15`; therefore the v1 grid was structurally empty.

Technical structural distribution from the frozen witness artifact:

```text
nonEmptyPitCount:
  min = 15
  5th percentile = 19
  median = 22
  95th percentile = 26
  max = 30

legalMoveCount:
  min = 1
  25th percentile = 2
  median = 3
  90th percentile = 7
  max = 14
```

These are construct/feasibility variables only. No WIN/LOSS/RECURRENT/DTF/optimal-move information was generated or inspected.

## Decision

The v1 grid is **NOT-ESTIMABLE AS A ROOT FILTER GRID** because it contains zero eligible roots. This is not a scientific negative result and does not authorize any exact outcome claim.

A v2 Stage 0 technical spec may revise only the root-filter grid using the above structural distribution while preserving:

- the same technical-only witness pool;
- the no-outcome-peeking firewall;
- full forward closure rather than feature-truncated closure;
- no symmetry reduction;
- no `relay-limit` terminal semantics.

The v1 spec and result remain immutable historical Stage 0 evidence.
