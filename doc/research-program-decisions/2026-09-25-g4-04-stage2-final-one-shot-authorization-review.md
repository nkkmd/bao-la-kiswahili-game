# 2026-09-25 — G4-04 / GTTD-STUDY1 Stage 2 final one-shot authorization review

## 正式判定

**`GTTD-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

Stage 2 fresh formal executionを、GitHub Actions上で一回だけ実行することを認可する。

## 1. Review anchor

```text
repository = nkkmd/bao-la-kiswahili-game
agenda = Research Generation 4 / G4-04
study = GTTD-STUDY1
branch = research/g4-04-geometry-trajectory-transfer
Stage 1 canonical run = 36089520136 / attempt 1 / success
Stage 1 disposition = STAGE1-PASS
Stage 2 pre-access decision = GTTD-STUDY1-STAGE2-PREACCESS-PASS
Stage 2 seed-free preflight run = 36095418431 / attempt 1 / success
Stage 2 fresh seed reads before authorization = 0
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

## 2. Seed-free preparation gate

Stage 2 preflightは次を全てPASSした。

- Stage 2 implementation syntax check
- canonical Stage 1 artifact SHA-256 verification
- immutable G4-01 GCLD source artifact SHA-256 verification
- 24-file pre-execution blob binding verification
- G3-10 Stage 1 identity 24 rows verification
- G3-10 Stage 2 identity 48 rows verification
- G4-01 GCLD identity 384 rows verification
- canonical G4-04 Stage 1 identity 32 rows verification
- Stage 1 scientific replay禁止確認
- Stage 2 fresh scientific seed access = false
- protected G3-11 depth-10 access = false
- G4-10 depth-11 access = false
- exact sign-test three-way implementation agreement
- fixed 8-test exact Holm implementation agreement
- decision mapping deterministic fixtures

Canonical preflight:

```text
run = 36095418431 / attempt 1 / success
head = 949095463cde5b6a01537986e5a924be47288138
artifact ID = 10847750492
artifact SHA-256 = a065841e29809142954797f491d6fb0253566b5ec177473e93eb2d85daf8bcfb
STAGE_2_PREFLIGHT_RESULT.json SHA-256 = f01642d1b6fc0826ffd59f0e75fe3a744d7ad91aefcb354ac2a959564c2fd7cb
```

## 3. Frozen scientific contract

変更しない。

```text
stage ID = GTTD-S2-FORMAL-2026-09-25-v1
fresh seed block = 40423001..40424024 / 1024
formal domains = P1 / P2
candidate target = 48 per policy
minimum fully eligible = 40 per policy
formal measured population = first 32 eligible per policy
endpoints = C1 / C2 / C3 / C5
formal tests = 8
formal test = exact two-sided binomial sign test
minimum nonzero trajectories = 20 per test
multiplicity = fixed 8-test Holm-Bonferroni
family alpha = exact 1/20
root-family formal subgroup inference = prohibited
seed extension = prohibited
trajectory replacement after candidate manifest = prohibited
same-evidence rerun = prohibited
```

## 4. Frozen code / identity binding

Pre-execution binding:

```text
path = doc/geometry-trajectory-dynamics-transfer/authorizations/STAGE_2_PREEXECUTION_BINDING.json
blob SHA = 5282f79ba9b3575cbd9e6aef496db7ffe515bd2e
bound files = 24
fresh scientific seed access at binding = 0
```

Preflight receipt:

```text
path = doc/geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_PREFLIGHT_RECEIPT.json
blob SHA = a1e6613ab8a21ff08af2d9d405bcb11752b7a48f
```

Authorized execution workflow:

```text
path = .github/workflows/gttd-stage2-actions-once.yml
blob SHA = c9041cc401d43854ca9749577f82599dc070b521
```

Final authorization validation workflow:

```text
path = .github/workflows/gttd-stage2-final-authorization-validation.yml
blob SHA = 4858202c946a51cc5b5fddec118f2108590a8242
```

## 5. Execution environment

Stage 2 fresh formal execution environmentを **GitHub Actions only** とする。

理由:

- formal measurementは長時間化する可能性がある。
- chat/session中断と実行寿命を分離できる。
- immutable run ID / attempt / artifactを残せる。
- one-shot trigger、durable lease、frozen blob bindingをrepository側で監査できる。

ローカルfresh generationは認可しない。

## 6. Exactly-once boundary

認可するscientific executionは **1回のみ**。

必須順序:

1. machine-readable final authorizationをcommitする。
2. final authorization validation workflowをfresh seed accessなしでPASSさせる。
3. durable repository execution leaseを一回分だけ作成する。
4. dedicated trigger fileを最後にsingle-purpose commitする。
5. execution workflow内でcontrol-plane / blob binding / artifact hashesを再検証する。
6. seed-free preflightをfirst fresh read直前に再度PASSさせる。
7. そのrun内でのみStage 2 fresh formal executionを行う。

Fresh access開始後は、同じStage/versionでのrerun、repair-and-rerun、seed extensionを認可しない。

## 7. Stage 1 / upstream firewall

Stage 2ではcanonical Stage 1 artifactをidentity-onlyで使用する。

除外対象:

- source seed
- full trajectory SHA-256
- opening-prefix SHA-256
- checkpoint RAW-root SHA-256

Stage 1 scientific outcomeの再利用・再演算は禁止する。

G3-10 / G4-01 upstream identity firewallも引き続き強制する。G4-01で監査不能なopening-prefixについては非重複を主張せず、historical seed replayも行わない。

## 8. Final authorization gates

| Gate | Decision |
| --- | --- |
| G4-04 preregistration | PASS / FROZEN |
| Stage 0 | PASS |
| Stage 1 canonical execution | PASS |
| Stage 1 one-shot boundary | PASS |
| Stage 2 pre-access review | PASS |
| Stage 2 scientific contract | FROZEN |
| Stage 1 identity-only firewall | PASS |
| upstream identity firewall | PASS |
| exact sign-test fixtures | PASS |
| exact 8-test Holm fixtures | PASS |
| 24-file preexecution binding | PASS |
| seed-free preflight run 36095418431 | PASS |
| Stage 2 fresh seed access before authorization | 0 / PASS |
| GitHub Actions execution environment | AUTHORIZED |
| scientific execution count | 1 ONLY |
| rerun after fresh access | NOT AUTHORIZED |
| seed extension | NOT AUTHORIZED |
| main integration | NOT AUTHORIZED |
| public AI change | NOT AUTHORIZED |

## 9. 正式結論

**`GTTD-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

machine authorization validation、durable lease、dedicated triggerの全gateがPASSした場合に限り、Stage 2 formalをGitHub Actionsで一回だけ実行してよい。
