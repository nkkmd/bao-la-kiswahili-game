# G4-04 / GTTD-STUDY1 — 現在の状態

更新日: 2026-09-25  
Agenda: `Research Generation 4 / G4-04`  
Study: `GTTD-STUDY1`  
状態: **`STAGE1-PASS / STAGE2-PREPARATION-ELIGIBLE`**

## 現在地

```text
reviewed main HEAD = 1274c9cf408f0e044c39751599941a6f75e96a4c
research branch = research/g4-04-geometry-trajectory-transfer
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-PASS / canonical run 36089520136 / exactly once
Stage 2 = NOT AUTHORIZED / fresh seeds NOT READ
formal scientific outcome = NONE
main integration = NOT AUTHORIZED
public AI change = false
```

## Transfer target

G3-10 `GCLD-STUDY1`のformal confirmed claimのみを対象とする。

```text
C1 ACTUAL-GREATER
C2 ACTUAL-GREATER
C3 ACTUAL-LESS
C5 ACTUAL-GREATER
```

C4はG3-10で`NOT-CONFIRMED`のためpositive transfer targetではない。

## Stage 0

```text
Stage ID = GTTD-S0-TECHNICAL-2026-09-25-v1
canonical Actions run = 36082558032 / attempt 1 / success
stage disposition = STAGE0-PASS
fresh scientific seed access = false
```

Stage 0ではrepresentation、15 checkpoint、32 control、C1/C2/C3/C5 exact production/independent一致、P1/P2 source generation、RF1/RF2 technical determinism、resource fail-closedを確認した。

## Stage 1

```text
Stage ID = GTTD-S1-DEVELOPMENT-2026-09-25-v1
authorization = GTTD-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE
canonical Actions run = 36089520136 / attempt 1 / success
trigger commit = 038022a431475039f1ae18481c4b5092e57e71b7
artifact ID = 10846181741
artifact SHA-256 = fa14e0c56d7d7f7088684eb715b1bf26b307cb22459741dfe4a7629cf40b3183
STAGE_1_RESULT.json SHA-256 = 58ffb52f7924ce47ac4c5b1c8f321c5bd28e3b6d548a788eefa1179ae7ab29f0
identity manifest SHA-256 = 0935cd3c6f35ca8dfe68e268337ba7f4bb55e615d726e8919594d7f52eebcd3e
stage disposition = STAGE1-PASS
```

Stage 1 support:

```text
fresh seed block = 40413001..40413512 / fixed 512 slots
actual seed reads = 134
last seed read = 40413203
P1 candidates = 16 / fully eligible = 15 / measured = 8
P2 candidates = 16 / fully eligible = 16 / measured = 8
C1/C2/C3/C5 defined = 8/8 for both policies
both-phase measured trajectories = 8/8 for both policies
production / independent exact = true
```

Stage 1はblinded development evidenceであり、endpoint値、contrast符号、effect direction、p値を保存していない。formal inferenceは未実施で、Stage 2を自動認可しない。

Stage 2 identity firewallでは、canonical Stage 1 artifact内の32 identity rowsから次を除外する。

- source seed
- full trajectory SHA-256
- opening-prefix SHA-256
- checkpoint RAW-root SHA-256

Stage 1 scientific outcomeの再利用・再演算は許可しない。

## Stage 2 frozen contract

```text
Stage ID = GTTD-S2-FORMAL-2026-09-25-v1
evidence = FRESH-FORMAL-HELDOUT
fresh seed block = 40423001..40424024 / 1024 / RESERVED-NOT-ACCESSED
formal domains = P1, P2
endpoints = C1, C2, C3, C5
formal tests = 8
candidate target = 48 per policy
minimum fully eligible = 40 per policy
formal measured population = first 32 eligible per policy
minimum nonzero contrasts = 20 per test
formal test = exact two-sided sign test
multiplicity = fixed 8-test Holm-Bonferroni
family alpha = 1/20
seed extension = prohibited
same-evidence rerun = prohibited
```

RF1/RF2はStage 2でもsupport descriptorのみで、formal subgroup inferenceは禁止する。

## 次工程

1. post-Stage1 Stage 2 pre-access authorization reviewを固定する。
2. Stage 1 identity-only firewall reader、Stage 2 runner、exact sign test / exact Holmを実装する。
3. protected-evidence guardを含むseed-free deterministic preflightをGitHub Actionsで実行する。
4. pre-execution bindingを固定して再検証する。
5. 全pre-fresh gateがPASSした場合のみ、Stage 2 final one-shot authorizationを別途固定する。
6. fresh formal Stage 2はGitHub Actions exactly-onceを第一候補とする。

## 現在の禁止事項

- Stage 2 fresh seed access
- Stage 2 scientific effect direction / p-value生成
- Stage 2 formal inference
- Stage 1 scientific replay / outcome reuse
- seed extension / trajectory replacement / threshold relaxation
- same-evidence rerun
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- root-family subgroup rescue
- main integration
- public AI change
