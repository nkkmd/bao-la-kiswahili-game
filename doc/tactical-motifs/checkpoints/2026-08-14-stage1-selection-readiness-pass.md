# Stage 1 exploratory selection — readiness pass checkpoint

Date: 2026-08-14

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

## Purpose

Record the deterministic state-selection result and the preregistered readiness decision before any all-move measurement is executed.

This checkpoint does not alter the frozen scientific population, state-selection rule, readiness thresholds, candidate grammar, promotion thresholds, or Stage 2 boundary.

## Frozen binding

- spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- verified source/corpus boundary: full 768-game replay/search verification passed before selection
- selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`

## Selection result

- generated games: 768
- unique historical trajectories: 741
- unavailable assigned phase: 25
  - assigned Mtaji: 23
  - assigned Namua: 2
- selected before rule-state collapse: 716
- duplicate selected rule states collapsed: 1
- selected unique rule states: 715
- replacement performed: `false`
- selected Namua states: 370
- selected Mtaji states: 345
- distinct selected opening-prefix identities: 659

Selected generation-stratum counts:

- `B-D1`: 114
- `B-D2`: 115
- `B-D3`: 122
- `LS-D2`: 122
- `V2-D2`: 121
- `LE-D2`: 121

The 25 assigned-phase-unavailable trajectories were not replaced. The single duplicate selected rule state was collapsed according to the frozen rule. No phase reassignment or favorable replacement was performed.

## Independent readiness check

Frozen thresholds and observed values:

| Gate | Frozen minimum | Observed | Margin | Result |
|---|---:|---:|---:|---|
| unique historical trajectories | 550 | 741 | +191 | PASS |
| selected unique rule states | 450 | 715 | +265 | PASS |
| Namua selected states | 180 | 370 | +190 | PASS |
| Mtaji selected states | 180 | 345 | +165 | PASS |
| distinct opening prefixes | 32 | 659 | +627 | PASS |
| selected per generation stratum | 40 | 114 minimum | +74 | PASS |

All six selection-readiness gates pass and `selection-audit.json` reports `passed=true`.

## No-rescue audit

At this checkpoint:

- seed extension: none
- replacement sampling: none
- threshold retuning: none
- phase reassignment: none
- opening-threshold relaxation: none
- favorable subset selection: none
- post-outcome depth selection: none
- failed-candidate renaming: none
- manual candidate promotion: none

No motif measurement or candidate discovery has yet been performed.

## Gate decision

The preregistered firewall permits the next phase:

`node tools/experiments/run-tactical-motif-stage1-exploratory.js --phase measure`

Measurement must cover all exact legal move variants at the frozen 715 selected unique rule states. After measurement, `measurement-manifest.json` must be inspected and discovery remains blocked unless:

- `measurementReadinessPassed = true`; and
- `measuredMoveRecords >= 1800`.

Stage 2 generation remains not authorized. No `confirmed tesuji` claim is authorized.
