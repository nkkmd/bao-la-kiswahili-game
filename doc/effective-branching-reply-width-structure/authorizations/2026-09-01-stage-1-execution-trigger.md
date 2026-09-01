# EBRWS-STUDY1 — Stage 1 one-shot execution trigger

Activation date: 2026-09-02 (Asia/Tokyo)

> Filename note: this path retains the `2026-09-01` basename already bound into the pre-execution Stage 1 runner contract. The actual activation is recorded here as 2026-09-02; no scientific contract is changed by this naming compatibility.

## Trigger

`EBRWS-S1-DEVELOPMENT-2026-09-01-v1` one-shot fresh-development execution is now triggered under the existing Stage 1 authorization.

Pre-execution checkpoint:

`checkpoints/2026-09-02-stage-1-tooling-smoke-pass-and-preexecution.md`

Immediately before this trigger:

- Stage 1 result directory: absent
- Stage 1 seed `31210001..31210192` consumed: false
- Stage 2 seed `31220001..31220288` consumed: false
- Stage 2: `NOT-AUTHORIZED-NOT-EXECUTED`
- protected depth-10 exact holdout: `SEALED / NOT GENERATED / NOT READ`

This trigger authorizes no rerun, seed extension, replacement root, endpoint modification, threshold modification, or Stage 2 execution.

At first fresh Stage 1 scientific evidence generation/read, the frozen no-rescue boundary becomes active permanently for this evidence.
