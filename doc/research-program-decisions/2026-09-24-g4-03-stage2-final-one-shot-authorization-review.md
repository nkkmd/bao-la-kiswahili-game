# 2026-09-24 — G4-03 / LWSRT-STUDY1 Stage 2 final one-shot authorization review

## 正式判定

**`PASS / STAGE2-FRESH-FORMAL-GITHUB-ACTIONS-ONCE-AUTHORIZED`**

Authorization token:

**`LWSRT-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

この review は、すべての Stage 2 preparation gate が fresh scientific seed access 0 のまま PASS したことを確認し、固定 seed block `40322001..40323536` を GitHub Actions 上で **一回だけ** formal execution に使用することを認可する。

## 1. Review anchor

```text
repository = nkkmd/bao-la-kiswahili-game
agenda = Research Generation 4 / G4-03
study = LWSRT-STUDY1
branch = research/g4-03-width-ranking-transfer
Stage 1 canonical run = 35987703180 / attempt 1 / success
Stage 1 disposition = STAGE1-PASS
Stage 2 pre-access review = LWSRT-STUDY1-STAGE2-PREACCESS-PASS
Stage 2 seed-free preflight = PASS / run 35991470739
Stage 2 frozen binding validation = PASS / run 35991767724
Stage 2 fresh scientific seed reads before final review = 0
Stage 2 scientific execution started before final review = false
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

## 2. Preparation gates

Final authorization requires all of the following to have passed prospectively before the first `40322...` read:

1. Stage 1 canonical artifact receipt fixed and digest-bound.
2. Stage 1 identity-only firewall fixed at 128 identities.
3. Stage 2 assignment namespace fixed as `LWSRT-S2-ASSIGN-2026-09-24-v1`.
4. Stage 2 selection namespace fixed as `LWSRT-S2-SELECT-2026-09-24-v1`.
5. Stage 2 exact hypergeometric / convolution / two-sided p / direction / fixed-12 Holm implementation frozen.
6. Stage 2 seed-free preflight PASS at run `35991470739`.
7. Stage 2 pre-execution binding fixed with code-freeze anchor `2a6f66760ce95f0ca36e021fef59c4ac8ebf751c`.
8. All 24 bound files independently verified at run `35991767724`.
9. Stage 2 fresh scientific seed access remains 0.
10. No Stage 2 durable execution lease exists before this review.

All ten requirements are satisfied.

## 3. Scientific contract remains unchanged

This final review does not change the frozen scientific design.

```text
stage ID = LWSRT-S2-FORMAL-2026-09-24-v1
evidence class = FRESH-FORMAL-HELDOUT
seed block = 40322001..40323536 / 1536
selection target = 12 HIGH + 12 LOW per policy × root-family × phase
total selected-root target = 192
formal tests = 3 contrasts × 4 domains = 12
phase handling = exact hypergeometric PMF, then Namua/Mtaji convolution
exact two-sided p = min(1, 2 * min(lower tail, upper tail))
multiplicity = HOLM-BONFERRONI-FIXED-12
family alpha = 1/20
seed extension = prohibited
root replacement = prohibited
threshold relearning = prohibited
```

## 4. Execution-environment amendment and one-shot boundary

The frozen v1 protocol originally prohibited heavy fresh generation on GitHub Actions. This review prospectively amends **only the Stage 2 execution environment** before any Stage 2 fresh seed access.

Effective execution environment:

```text
mode = GITHUB-ACTIONS-ONLY
authorized scientific executions = 1
local fresh generation = prohibited
workflow rerun after fresh access = prohibited
second scientific execution = prohibited
```

Authorized workflow:

```text
path = .github/workflows/lwsrt-stage2-actions-once.yml
blob SHA = 4354595e7cd7f88407d31b467e956708c7f16f88
trigger path = doc/local-width-search-ranking-transfer/authorizations/STAGE_2_ACTIONS_EXECUTION_TRIGGER.json
lease path = doc/local-width-search-ranking-transfer/executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json
```

The trigger file must be introduced by a commit that changes that file only. The workflow must reject any trigger whose study ID, stage ID, authorization token, seed block, no-rerun acknowledgement, no-seed-extension acknowledgement, or no-root-replacement acknowledgement does not exactly match this review.

Before the first fresh seed read, the workflow must:

1. verify the final authorization and all frozen blob bindings;
2. verify the code-freeze head is an ancestor of the trigger commit;
3. verify the durable Stage 2 execution lease is absent;
4. download and digest-check the immutable G3-07 Stage 2, G4-01 Stage 1R, and G4-03 Stage 1 artifacts;
5. re-run the upstream identity firewall and Stage 2 seed-free preflight;
6. acquire the durable repository execution lease.

If any pre-fresh check fails, fresh seed access is prohibited. If the durable lease already exists, a second execution is prohibited. Once the durable lease is acquired, workflow rerun is not authorized even if the scientific execution later fails.

## 5. Formal-output authorization

Unlike Stage 1, Stage 2 is the preregistered formal held-out stage. The single authorized execution may therefore compute and preserve:

- selected Stage 2 root identities;
- per-phase changed / unchanged counts;
- exact stratified two-sided p-values for estimable tests;
- effect direction;
- fixed-12 Holm-adjusted decisions;
- `GENERALIZATION-CONFIRMED`, `COUNTEREXAMPLE-CONFIRMED`, `NOT-GENERALIZED`, `NON-ESTIMABLE`, or `TECHNICAL-INVALID` according to the frozen protocol.

No result may be used to alter another test, seed block, threshold, source policy, root family, or selection rule.

## 6. Still prohibited

This authorization does not permit:

- a second Stage 2 scientific execution;
- workflow rerun after fresh access;
- seed extension;
- root replacement;
- threshold relearning;
- post-access repair-and-rerun;
- protected G3-11 depth-10 evidence access;
- protected G4-10 depth-11 evidence access;
- public AI changes;
- `main` integration.

## 7. Final decision

**`LWSRT-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

Stage 2 fresh formal execution is authorized exactly once on the frozen seed block, but only after a separate seed-free final-authorization validation confirms this review, the machine-readable authorization, the workflow blob, all frozen bindings, and the continued absence of trigger/lease contamination. The trigger file itself is the final execution-start operation.