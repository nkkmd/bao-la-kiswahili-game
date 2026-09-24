# LWSRT-STUDY1 — Stage 2 pre-execution preparation checkpoint

Date: 2026-09-24  
Program: `Research Generation 4 / G4-03`  
Stage: `LWSRT-S2-FORMAL-2026-09-24-v1`

## Formal disposition

**`STAGE2-PREPARATION-PASS / READY-FOR-FINAL-ONE-SHOT-AUTHORIZATION`**

This checkpoint does **not** authorize Stage 2 fresh scientific execution.

## Completed preparation

- Stage 1 closure fixed as `STAGE1-PASS / STAGE2-PREPARATION-ELIGIBLE`.
- Stage 2 pre-access review fixed as `LWSRT-STUDY1-STAGE2-PREACCESS-PASS`.
- Canonical Stage 1 artifact is bound for identity-only exclusion use.
- Stage 1 source-seed / trajectory / opening-prefix / RAW-root identity sets were re-materialized and digest-verified without scientific replay.
- Stage 2 assignment namespace is fixed to `LWSRT-S2-ASSIGN-2026-09-24-v1`.
- Stage 2 selection namespace is fixed to `LWSRT-S2-SELECT-2026-09-24-v1`.
- Exact per-phase hypergeometric PMF, Namua/Mtaji convolution, two-sided p-value, direction, fixed-12 Holm-Bonferroni, and formal decision mapping are implemented.
- Support failure is fail-closed to `NON-ESTIMABLE`; technical failure is fail-closed to `STAGE2-TECHNICAL-INVALID`.
- Stage 2 formal runner requires a separate `STAGE_2_FINAL_AUTHORIZATION.json`; it cannot execute in the present branch state.

## Seed-free preflight

```text
workflow = LWSRT G4-03 Stage 2 pre-execution static validation
run = 35991470739
attempt = 1
head = 2a6f66760ce95f0ca36e021fef59c4ac8ebf751c
conclusion = success
artifact ID = 10804501661
artifact SHA-256 = 169e454762927829dbe60979720010ed3f25a9cbf34728c2c41ce3948b6bf1a5
STAGE_2_PREFLIGHT_RESULT.json SHA-256 = 4c50d1b5aad96f66cf99a80666399a5bc301e0df6978b56b41086b190b0088d2
fresh scientific seed access = false
Stage 2 scientific execution started = false
```

The deterministic inference fixture for `8 HIGH changed / 4 LOW changed` in both phases yielded exact two-sided `p = 0.04457973996974697`, matching the frozen implementation fixture. The fixed-12 Holm fixture also passed.

## Frozen binding validation

```text
binding = authorizations/STAGE_2_PREEXECUTION_BINDING.json
code freeze head = 2a6f66760ce95f0ca36e021fef59c4ac8ebf751c
binding validation run = 35991767724
conclusion = success
bound files = 24
fresh scientific seed access = false
```

The binding covers the formal runner, exact-inference library, preflight runner, engine / AI / weights, source-policy production/independent implementations, geometry dependencies, search production/independent implementations, robustness helper, frozen spec/protocol, upstream and Stage 1 identity-firewall contracts, Stage 1 artifact receipt, Stage 2 pre-access review, preflight workflow, and preflight receipt.

## Fixed-family handling of NON-ESTIMABLE slots

The protocol freezes a single 12-test Holm family. If a formal slot is `NON-ESTIMABLE`, that slot remains in the fixed family with conservative `p=1` **for multiplicity bookkeeping only**; no scientific p-value is reported for the non-estimable slot. This avoids silently shrinking the preregistered family and cannot make the remaining estimable tests less conservative than the fixed-12 design.

## Current protected boundary

```text
Stage 2 fresh seed block = 40322001..40323536 / 1536
Stage 2 fresh seed reads = 0
Stage 2 final one-shot authorization = ABSENT
Stage 2 execution environment = UNSET-PENDING-FINAL-AUTHORIZATION
Stage 2 durable execution lease = ABSENT
protected G3-11 depth-10 access = false
G4-10 depth-11 access = false
public AI change = false
main integration = false
```

## Next gate

The next permissible action is a **separate final one-shot Stage 2 authorization review** that prospectively fixes the execution environment and the durable one-shot execution contract. Only after that review passes may a Stage 2 trigger/lease mechanism be armed. No `40322...` seed may be read before that gate is fixed.
