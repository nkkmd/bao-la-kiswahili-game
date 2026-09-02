# TCTGD-STUDY1 — Stage 1 development authorization

Date: 2026-09-02

Decision: `STAGE1-AUTHORIZED`

Exactly one fresh-development scientific execution is authorized for `TCTGD-S1-DEVELOPMENT-2026-09-02-v1` using seed block `31310001..31310192`, 12 paired trajectories / 24 roots, RAW-only identity and relative depth 5.

Preconditions confirmed before authorization:

- G3-03 program decision = `G3-03-AUTHORIZED`.
- Stage 0 = `STAGE0-PASS`, core `e7e7831cf9503c94441a5dc9b30253485dc4b498e9b397408901186c914765d5`.
- original scientific Study contract remains unchanged; technical execution revision v2 only replaces the unusable branch-only `workflow_dispatch` control path.
- failed dispatch smoke `33591947107` generated no scientific evidence.
- push-path control smoke `33592075136` = success, exactly one run for its trigger commit, no seed/root/depth-10 access.
- identity-only upstream firewall is frozen in `prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json`; G3-02 scientific outcomes and selected roots are not loaded or reconstructed.
- scientific-content baseline = `3b31c0e853b99d50e6e4cd924984342535c22547`.
- pre-authorization Stage 1 scientific execution count = 0.
- Stage 1 result / execution marker / execution trigger do not yet exist.
- protected standard-root depth-10 holdout = `SEALED / NOT GENERATED / NOT READ`.

The authoritative machine-readable authorization is `STAGE_1_DEVELOPMENT_AUTHORIZATION.json`. The execution trigger must bind its nonce exactly. Any unexpected post-baseline path change, source blob mismatch, duplicate execution marker, lease push failure or protected-evidence violation fails closed before fresh computation where possible.

No second Stage 1 scientific execution is authorized. Fresh evidence generation/read activates the no-rescue boundary. Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED` regardless of Stage 1 outcome until a separate authorization review.
