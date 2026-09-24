# 2026-09-24 — G4-03 / LWSRT-STUDY1 Stage 2 pre-access authorization review

## 正式判定

**`PASS / STAGE2-PREPARATION-AUTHORIZED / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

Authorization token:

**`LWSRT-STUDY1-STAGE2-PREACCESS-PASS`**

この review は `LWSRT-STUDY1` Stage 2 の implementation、Stage 1 identity-only firewall materialization、pre-execution binding、seed-free preflight を固定することのみを許可する。

**この review だけでは Stage 2 fresh scientific seed `40322001..40323536` の read を許可しない。**

## 1. Review anchor

```text
repository = nkkmd/bao-la-kiswahili-game
agenda = Research Generation 4 / G4-03
study = LWSRT-STUDY1
branch = research/g4-03-width-ranking-transfer
Stage 1 canonical run = 35987703180 / attempt 1 / success
Stage 1 disposition = STAGE1-PASS / STAGE2-PREPARATION-ELIGIBLE
Stage 1 fresh reads = 768 / exactly one scientific execution
Stage 2 fresh seed reads before review = 0
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

## 2. Stage 1 prerequisite

Canonical Stage 1 result satisfies the frozen development gate:

```text
16 policy × root-family × phase × width cells = 8 / 8 each
selected roots = 128 / 128
SC1 endpoint defined = 128 / 128
SC2 endpoint defined = 128 / 128
SC3 endpoint defined = 128 / 128
production / independent exact = true
formal inference = false
p-values = false
risk differences = false
effect direction = false
generalization/counterexample decision = false
Stage 2 access = false
```

Stage 1 is therefore sufficient for Stage 2 preparation, but Stage 1 observations must not be reused as Stage 2 formal evidence.

Canonical artifact:

```text
artifact ID = 10803311137
artifact SHA-256 = aaea8b1c564dbe400d2d1fc00ebfa58f23cd485d9ae994af88cd4ceaf6b621a6
STAGE_1_RESULT.json SHA-256 = 58d5489ce918bc57b599ca168fdcefbd4e741892ad123d96d27439fb06085ac8
identity manifest SHA-256 = 4a1dd1f3bc516734c91f99fbd9bf63ff966e3ed0568cb1b21c3fa6ccd290a979
```

## 3. Frozen Stage 2 scientific contract

`STUDY_1_PROTOCOL.md` / `STUDY_1_SPEC.json` の科学契約を変更しない。

```text
stage ID = LWSRT-S2-FORMAL-2026-09-24-v1
evidence class = FRESH-FORMAL-HELDOUT
seed block = 40322001..40323536 / 1536
source policies = P1 / P2
root families = RF1 / RF2
phases = Namua / Mtaji
width classes used = HIGH / LOW
selection target = 12 HIGH + 12 LOW per policy × root-family × phase
selected-root target total = 192
contrasts = SC1 DEPTH / SC2 NODE-BUDGET / SC3 QUIESCENCE
endpoint = SILGM-E3-RANKING-PREORDER-CHANGE
formal tests = 3 contrasts × 4 policy/root-family domains = 12
phase handling = exact hypergeometric PMF per phase, then Namua/Mtaji convolution
exact two-sided p = min(1, 2 * min(lower tail, upper tail))
direction = HIGHER-IN-HIGH / LOWER-IN-HIGH / ZERO-DIRECTION
multiplicity = fixed 12-test Holm-Bonferroni
family alpha = 1/20
minimum per-phase changed = 6
minimum per-phase unchanged = 6
seed extension = prohibited
root replacement = prohibited
threshold relearning = prohibited
```

## 4. Stage 1 identity firewall requirement

Stage 2 must exclude every Stage 1 identity on four axes:

1. source seed
2. full trajectory SHA-256
3. opening-prefix SHA-256
4. selected RAW-root SHA-256

The canonical Stage 1 artifact may be loaded only to materialize these identity fields and verify its fixed digest / result hash / identity manifest hash. Stage 1 endpoint observations must not be imported into Stage 2 formal inference.

Existing upstream G3-07 / G4-01 firewalls remain in force in addition to the Stage 1 exclusion.

## 5. Stage 2 preparation requirements

Before any Stage 2 fresh seed read, preparation must establish all of the following:

1. Stage 2 runner is syntactically valid and bound to the frozen spec.
2. Stage 2 assignment uses a Stage-2-specific SHA-256 namespace, distinct from Stage 1.
3. Stage 2 within-cell selection rank uses a Stage-2-specific namespace.
4. Stage 1 artifact receipt is verified against fixed artifact / result / identity-manifest hashes.
5. Stage 1 identity rows are used only as exclusion identities.
6. G3-07 / G4-01 existing upstream identity firewall remains exact.
7. source replay and anchor selection retain production / independent exact agreement.
8. all six controlled-search condition implementations retain production / independent exact agreement.
9. formal exact hypergeometric PMF, convolution, exact two-sided p, direction, and fixed-12 Holm implementation pass deterministic unit fixtures.
10. support failure produces `NON-ESTIMABLE` without seed extension or replacement.
11. technical mismatch produces `TECHNICAL-INVALID` and no rescue execution.
12. seed-free preflight reads no `40322...` seed and computes no scientific Stage 2 outcome.
13. protected G3-11 depth-10 and G4-10 depth-11 evidence remains inaccessible.
14. public AI and `main` integration remain untouched.

## 6. Execution-environment boundary

The frozen v1 protocol originally prohibited heavy fresh generation on GitHub Actions. Stage 1 changed only its execution environment prospectively, before fresh access, through a separately recorded amendment.

For Stage 2, **this pre-access review does not yet amend the fresh-execution environment**. Seed-free preparation/preflight may run on GitHub Actions. Any Stage 2 fresh formal execution environment must be prospectively fixed by a separate amendment/authorization before the first `40322...` read.

Stage 2 execution metadata must directly record the effective authorization token; it must not repeat the Stage 1 historical/effective-token split.

## 7. This review authorizes

Authorized now:

- Stage 2 implementation
- Stage 1 identity-only firewall reader/verifier
- Stage 2 exact-inference implementation
- deterministic formal-inference fixtures
- Stage 2 pre-execution binding
- Stage 2 seed-free preflight
- GitHub Actions use for seed-free technical validation
- preparation of a final one-shot execution authorization contract after all preflight gates PASS

Not authorized now:

- Stage 2 fresh seed read
- Stage 2 formal scientific execution
- scientific effect direction from Stage 2 data
- Stage 2 p-values from fresh data
- generalization/counterexample decision
- seed extension
- root replacement
- workflow rerun after fresh access
- public AI change
- `main` integration

## 8. Authorization gates

| Gate | Decision |
| --- | --- |
| G4-03 preregistration | PASS / FROZEN |
| Stage 0 | PASS |
| Stage 1 canonical execution | PASS |
| Stage 1 support target | PASS / 128 of 128 |
| Stage 1 endpoint definedness | PASS / 384 of 384 contrast-root checks |
| Stage 1 production/independent exactness | PASS |
| Stage 1 formal-output prohibition | PASS |
| Stage 1 one-shot boundary | PASS |
| Stage 2 namespace previously unread | PASS / 0 reads |
| Stage 2 scientific contract unchanged | PASS |
| Stage 1 identity firewall implementation | PENDING |
| Stage 2 exact-inference deterministic tests | PENDING |
| Stage 2 pre-execution binding | PENDING |
| Stage 2 seed-free preflight | PENDING |
| Stage 2 final fresh-execution authorization | NOT AUTHORIZED |
| public AI change | NOT AUTHORIZED |
| main integration | NOT AUTHORIZED |

## 9. 正式結論

**`LWSRT-STUDY1-STAGE2-PREACCESS-PASS / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

Stage 2 implementation、binding、seed-free preflightへ進んでよい。fresh formal executionは、これらがすべてPASSし、実行環境を含むfinal one-shot authorizationが別途固定されるまで禁止する。
