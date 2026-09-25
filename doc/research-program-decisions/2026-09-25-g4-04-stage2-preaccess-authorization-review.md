# 2026-09-25 — G4-04 / GTTD-STUDY1 Stage 2 pre-access authorization review

## 正式判定

**`PASS / STAGE2-PREPARATION-AUTHORIZED / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

Authorization token:

**`GTTD-STUDY1-STAGE2-PREACCESS-PASS`**

このreviewは、`GTTD-STUDY1` Stage 2のimplementation、Stage 1 identity-only firewall materialization、exact sign-test / Holm実装、pre-execution binding、seed-free preflightを固定することのみを許可する。

**このreviewだけではStage 2 fresh scientific seed `40423001..40424024` のreadを許可しない。**

## 1. Review anchor

```text
repository = nkkmd/bao-la-kiswahili-game
agenda = Research Generation 4 / G4-04
study = GTTD-STUDY1
branch = research/g4-04-geometry-trajectory-transfer
Stage 1 canonical run = 36089520136 / attempt 1 / success
Stage 1 disposition = STAGE1-PASS / STAGE2-PREPARATION-ELIGIBLE
Stage 1 fresh reads = 134 / exactly one scientific execution
Stage 2 fresh seed reads before review = 0
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

## 2. Stage 1 prerequisite

Canonical Stage 1 result satisfies the frozen development gate:

```text
P1 candidates = 16 / fully eligible = 15 / measured = 8
P2 candidates = 16 / fully eligible = 16 / measured = 8
C1/C2/C3/C5 defined = 8/8 for both policies
both-phase measured trajectories = 8/8 for both policies
production / independent exact = true
formal inference = false
p-values = false
contrast signs retained = false
effect direction retained = false
scientific endpoint values retained = false
Stage 2 access = false
```

Stage 1はStage 2 preparationには十分だが、Stage 1観測値をStage 2 formal evidenceとして再利用してはならない。

Canonical artifact:

```text
artifact ID = 10846181741
artifact SHA-256 = fa14e0c56d7d7f7088684eb715b1bf26b307cb22459741dfe4a7629cf40b3183
STAGE_1_RESULT.json SHA-256 = 58ffb52f7924ce47ac4c5b1c8f321c5bd28e3b6d548a788eefa1179ae7ab29f0
identity manifest SHA-256 = 0935cd3c6f35ca8dfe68e268337ba7f4bb55e615d726e8919594d7f52eebcd3e
identity rows = 32
```

## 3. Frozen Stage 2 scientific contract

`STAGE_2_FORMAL_SPEC.json`を変更しない。

```text
stage ID = GTTD-S2-FORMAL-2026-09-25-v1
evidence class = FRESH-FORMAL-HELDOUT
seed block = 40423001..40424024 / 1024
formal domains = P1 / P2
root-family handling = support descriptor only
candidate target = 48 per policy
minimum fully eligible = 40 per policy
formal measured population = first 32 eligible per policy
checkpoints = 16,20,24,...,72 / 15 points
controls = 32 endpoint-preserving order-destroyed controls
endpoints = C1 / C2 / C3 / C5
formal tests = 8 = 2 policies × 4 endpoints
formal test = exact two-sided binomial sign test on nonzero trajectory contrasts
minimum nonzero trajectories per test = 20
multiplicity = fixed 8-test Holm-Bonferroni
family alpha = 1/20
decision = GENERALIZATION-CONFIRMED / COUNTEREXAMPLE-CONFIRMED / NOT-GENERALIZED / NON-ESTIMABLE / TECHNICAL-INVALID
seed extension = prohibited
trajectory replacement after manifest = prohibited
same-evidence rerun = prohibited
```

## 4. Stage 1 identity firewall requirement

Stage 2 must exclude every canonical Stage 1 identity on four axes:

1. source seed
2. full trajectory SHA-256
3. opening-prefix SHA-256
4. checkpoint RAW-root SHA-256

Canonical Stage 1 artifact may be loaded only after fixed artifact/result/identity-manifest digest verification and only to materialize these identity fields. Stage 1 endpoint observations must not be imported into Stage 2 inference.

Existing upstream G3-10 / G4-01 identity firewall remains in force in addition to Stage 1 exclusion.

## 5. Stage 2 preparation requirements

Before any Stage 2 fresh seed read, preparation must establish all of the following:

1. Stage 2 runner is syntactically valid and bound to the frozen Stage 2 spec.
2. Stage 1 canonical artifact digest, result digest, identity-manifest digest and row count verify exactly.
3. Stage 1 artifact is used for identity exclusion only.
4. G3-10 Stage 1 / Stage 2 identities and G4-01 immutable GCLD source identities remain exact.
5. source replay, 15 checkpoints, opening-prefix calculation and resource preflight retain production / independent exact agreement.
6. C1/C2/C3/C5 production / independent exact agreement remains mandatory.
7. exact two-sided sign-test implementation passes deterministic fixtures.
8. fixed 8-test exact Holm-Bonferroni implementation passes deterministic fixtures.
9. decision mapping matches the frozen formal contract.
10. support failure produces `NON-ESTIMABLE` without seed extension or replacement.
11. technical mismatch produces `TECHNICAL-INVALID` and no rescue execution.
12. seed-free preflight reads no `40423...` Stage 2 scientific seed and computes no fresh scientific outcome.
13. protected G3-11 depth-10 and G4-10 depth-11 evidence remains inaccessible.
14. public AI and `main` integration remain untouched.

## 6. Execution-environment boundary

長めの試験は中断耐性を重視し、Stage 2 fresh formal executionは **GitHub Actionsを第一候補**としてprospectively設計する。

ただし、このpre-access reviewはまだfresh execution自体を認可しない。seed-free implementation/preflightとfrozen bindingが全てPASSした後、GitHub Actions exactly-onceのfinal authorizationを別途固定する。

Final authorizationでは少なくとも以下を固定する。

- execution environment = GitHub Actions only
- authorized scientific executions = 1
- durable repository lease
- dedicated single-path trigger
- frozen runner/spec/firewall/inference/workflow blob identities
- canonical Stage 1 artifact receipt
- rerun after fresh access = false
- seed extension = false
- post-access repair-and-rerun = false

## 7. このreviewが認可するもの

Authorized now:

- Stage 2 implementation
- Stage 1 identity-only firewall reader/verifier
- upstream identity firewall verifier
- exact sign-test / exact Holm implementation
- deterministic inference fixtures
- Stage 2 pre-execution binding
- Stage 2 seed-free preflight
- GitHub Actions use for seed-free validation
- final one-shot authorization contractの準備

Not authorized now:

- Stage 2 fresh seed read
- Stage 2 formal scientific execution
- fresh Stage 2 p-values / effect direction
- generalization / counterexample decision from fresh data
- seed extension
- trajectory replacement after manifest
- same-evidence workflow rerun
- root-family subgroup inference
- public AI change
- `main` integration

## 8. Authorization gates

| Gate | Decision |
| --- | --- |
| G4-04 preregistration | PASS / FROZEN |
| Stage 0 | PASS |
| Stage 1 canonical execution | PASS |
| Stage 1 support target | PASS |
| Stage 1 endpoint definedness | PASS |
| Stage 1 production/independent exactness | PASS |
| Stage 1 formal-output prohibition | PASS |
| Stage 1 one-shot boundary | PASS |
| Stage 2 namespace previously unread | PASS / 0 reads |
| Stage 2 scientific contract unchanged | PASS |
| Stage 1 identity firewall implementation | PENDING |
| exact sign-test / Holm deterministic tests | PENDING |
| Stage 2 pre-execution binding | PENDING |
| Stage 2 seed-free preflight | PENDING |
| Stage 2 final fresh-execution authorization | NOT AUTHORIZED |
| public AI change | NOT AUTHORIZED |
| main integration | NOT AUTHORIZED |

## 9. 正式結論

**`GTTD-STUDY1-STAGE2-PREACCESS-PASS / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

Stage 2 implementation、binding、seed-free GitHub Actions preflightへ進んでよい。fresh formal executionは、これらがすべてPASSし、final exactly-once authorizationが別途固定されるまで禁止する。
