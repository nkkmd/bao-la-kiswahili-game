# G3-10 pre-main integration readiness checkpoint — 2026-09-04

## Decision

`G3-10 / GCLD-STUDY1`のscientific execution、canonical artifact preservation、formal closure、current-facing documentation synchronization、pre-main consistency auditは完了した。

Repository stateを次として固定する。

**`PRE-MAIN-INTEGRATION-READY / MAIN-INTEGRATION-NOT-AUTHORIZED`**

## Scientific closure

```text
Study = GCLD-STUDY1
Program position = Research Generation 3 / G3-10
Lifecycle = CLOSED / FORMAL-COMPLETE
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-PASS
Stage 2 = FORMAL-COMPLETE
C1 directionality/path efficiency = CONFIRMED / ACTUAL-GREATER
C2 persistence/lag-distance gradient = CONFIRMED / ACTUAL-GREATER
C3 return fraction = CONFIRMED / ACTUAL-LESS
C4 chronology-conditioned circulation = NOT-CONFIRMED
C5 first-order directional path dependence = CONFIRMED / ACTUAL-GREATER
all primary endpoints estimable = true
same-evidence rerun = NOT AUTHORIZED
```

## Canonical Stage 2 evidence

```text
formal Actions run = 33810395545
result artifact ID = 9916587217
result ZIP SHA-256 = 63e55a9a8f5d6c3752c15cee06a01c327fd717606bf7086b3d1242f780126a4f
STAGE_2_FORMAL_RESULT.json SHA-256 = 08f31652fb599cf9db9b839cbc07f8aabe06aed69215208ec0556e6ec3a5bf7a
canonical scientific-result SHA-256 = c5ec84cecb4e540ce7ad9f52548dac14deecde3423b2f4d10e1c39e1000ae09f
exact-byte mirror run = 33816914860
exact-byte mirror commit = 622dae1ede85b3e8856a86a3b647a056f7ac08db
scientific recomputation during mirror = false
```

## Documentation and consistency audit

Current-facing synchronization対象:

- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-generation-3/README.md`
- `doc/research-generation-3/CURRENT_STATUS.md`
- GCLD study-local `README.md`, `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `REPRODUCIBILITY_INDEX.md`, `STUDY_1_FINAL_REPORT.md`

Audit provenance:

```text
current-facing documentation sync run = 33817487979 / SUCCESS
pre-main readiness audit run = 33817654425 / SUCCESS
remaining stale current-facing repairs = completed
GCLD CURRENT_STATUS repository readiness = PRE-MAIN-INTEGRATION-READY
```

Historical program plan:

```text
doc/research-generation-3/PROGRAM_PLAN.md Git blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac
status = UNCHANGED
retroactive program-plan rewrite = NOT PERFORMED
```

## Branch relationship immediately before this checkpoint

Audited research tip before adding this checkpoint:

`63ab353f7e2de41840b7f3740f58183d34593d57`

Remote `main` anchor independently re-read immediately before this checkpoint:

`0bcd1695b6dbd044acf2eed91740d282c63dbb07`

GitHub compare at that point:

```text
status = ahead
ahead_by = 139
behind_by = 0
merge_base = 0bcd1695b6dbd044acf2eed91740d282c63dbb07
```

したがってresearch branchはcurrent `main`を祖先に持ち、main側の追加commitを取りこぼしていない。本checkpoint追加はdocumentation-onlyであり、scientific evidenceを変更しない。

## Immutable boundaries

```text
protected standard-root complete exact depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
G3-09 partial scientific evidence reuse = NOT PERFORMED
GCLD Stage 1/2 same-evidence rerun = NOT AUTHORIZED
seed extension = NOT PERFORMED
trajectory replacement = NOT PERFORMED
historical PROGRAM_PLAN edit = NOT PERFORMED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Stop point

本checkpointが、ユーザーから明示的な`main`統合指示を受ける前の停止点である。

この状態から自動的にmerge、fast-forward、pull request merge、mainへの直接commit、integration trigger作成を行ってはならない。
