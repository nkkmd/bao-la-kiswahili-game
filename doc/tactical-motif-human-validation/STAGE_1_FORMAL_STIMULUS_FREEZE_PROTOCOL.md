# Stage 1 Formal Stimulus Freeze Protocol

Freeze ID: `TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`

## Purpose

Materialize the exact formal machine stimuli for the later human/expert study **after** the Stage 1 machine pool passed all readiness and compact-artifact identity audits, but **before** any scientific human response exists.

This is still machine/instrument work. It does not authorize recruitment, formal human responses, or human/expert inference.

## Frozen input identity

The freezer accepts only the already audited Stage 1 compact artifacts with the exact SHA-256 values frozen in `preregistration/STAGE_1_FORMAL_STIMULUS_FREEZE_SPEC.json`.

Any input hash mismatch is a hard stop. Do not regenerate, substitute, edit, or selectively replace a stimulus-pool artifact to make the freezer run.

## Primary block construction

The formal candidate instrument contains 12 three-position blocks:

```text
C03 target A
C03 target B
matched non-C03 control
```

Control-family balance is exactly:

```text
P_ONLY     4
M_ONLY     4
MORPH_NEAR 4
```

The participant-facing correct pair is target A + target B. With three possible pairs, random correctness is `1/3` per block.

### Target A + control

For each fixed slot/control family, use only the already frozen Stage 1 target-control matches. Candidate order is:

1. stored Stage 1 matching cost ascending;
2. deterministic SHA-256 tie-break from the exact identities and fixed salt.

### Target B

Target B must be a separate `C03_TARGET`. It is matched to target A using the exact Stage 1 nuisance `matchCost` and maximum accepted cost `10`.

Candidate order is:

1. target-A/target-B match cost ascending;
2. deterministic SHA-256 tie-break from the exact identities and fixed salt.

### Global primary no-reuse

Across all 36 primary positions, no two selected positions may share:

- `ruleStateKey`;
- `historicalTrajectoryHash`;
- `openingPrefixHash`.

This is stricter than merely preventing same-block recurrence and reduces participant recognition of repeated source material.

## Secondary move-choice positions

Select six additional `C03_TARGET` states, exactly one from each generation stratum:

```text
B-D1
B-D2
B-D3
LS-D2
V2-D2
LE-D2
```

They are selected by a frozen SHA-256 rank and may not reuse any primary rule state, historical trajectory, or opening prefix. Secondary positions also may not reuse one another.

Total formal positions therefore equal `42`:

- 24 primary C03 targets;
- 12 primary controls;
- 6 secondary C03 targets.

## Public/private freeze boundary

Before scientific collection, the public repository must **not** expose the exact selected board states or participant SVGs. The freezer therefore writes the exact material only to:

`artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1/formal-stimulus-freeze.private.json`

The public-safe audit contains only:

- input artifact hashes;
- selection-spec hash;
- SHA-256 commitment of the private freeze file;
- aggregate counts and constraint checks;
- no exact stimulus identities.

This limits avoidable pre-exposure/participant contamination while preserving a cryptographic preregistration commitment.

## Failure boundary

If any slot cannot be constructed under the fixed algorithm or any generation stratum lacks a secondary target after no-reuse exclusions, stop as `TECHNICAL-INCONCLUSIVE`.

Do not:

- relax no-reuse rules;
- raise the matching-cost maximum;
- change the control balance;
- replace a selected identity manually for aesthetics;
- use human responses to reselection;
- expose formal positions publicly before collection merely for convenience.

A redesign requires a new prospective freeze version before any scientific human response.

## Human-data firewall

Successful materialization means only:

`EXACT FORMAL MACHINE STIMULI FROZEN`

It does **not** mean:

- ethics requirements are satisfied;
- expert recruitment is authorized;
- formal human response collection is authorized;
- C03 is human/expert validated;
- C03 is a traditional tesuji.
