# Research Generation 3 — G3-02 research complete / main integration pending

Date: 2026-09-02

## Program checkpoint

G3-02 formal Study `EBRWS-STUDY1`の研究workflowはresearch branch上で完了した。

```text
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID
Research workflow = COMPLETE ON RESEARCH BRANCH
Stage 0 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 2 / execution-count contract violated
Formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = NOT CONSUMED
Protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
Main integration = NOT PERFORMED
G3-03 automatic scientific start = NOT AUTHORIZED
```

## Formal interpretation

Authorized Stage 1 runner-local computationのglobal gate PASS、production / independent exact equality、Namua 12/12・Mtaji 9/12 `REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT`はdiagnostic provenanceのみである。

Canonical Stage 1 artifact materialization failureと、exactly-one-execution authorizationに反するunintended duplicate run `33569382663`の双方により、formal dispositionはfail-closed `TECHNICAL-INVALID`である。duplicate runは`INVALID-DO-NOT-USE`とし、formal replication・confirmation・repair・rescueには使用しない。

## Preserved program boundaries

- G3-01 remains immutable `CLOSED / TECHNICAL-INVALID`, eligible families `[]`.
- LGTGMIV remains immutable `CLOSED / FORMAL-ELIGIBLE-ALL` within its frozen RAW-only depth-5 boundary.
- G3-02 remains closed; no same-evidence repair or reclassification is authorized.
- authoritative identity remains RAW-only.
- validated transform set remains `[]`.
- protected G3-11 depth-10 holdout remains sealed.
- historical `doc/research-generation-3/PROGRAM_PLAN.md` remains unchanged; research branch and `main` blob SHA both equal `2bb90c11f1625f63f40a7eab8a3de7774505a1ac` at completion audit.

## Operational closure

All five EBRWS-specific GitHub Actions workflows have been placed in `CLOSED / DISABLED` state with no executable job:

- `ebrws-stage0-technical.yml`
- `ebrws-stage1-tooling.yml`
- `ebrws-stage1-development.yml`
- `ebrws-central-doc-sync.yml`
- `ebrws-technical-invalid-central-doc-sync.yml`

The Study completion checkpoint is:

`doc/effective-branching-reply-width-structure/checkpoints/2026-09-02-g3-02-research-complete-main-integration-pending.md`

Study completion checkpoint commit:

`f988ff1fdc18d62f5cfa2ded40183a1f3202868f`

## Main integration hold

Remote `main` was audited immediately before completion recording at:

`ca6a1e4a9b41d79d873fa71385972e402ffa5197`

No G3-02 merge/integration to `main` has been performed.

This checkpoint explicitly records that integration remains blocked until a separate explicit user instruction. It also does not authorize G3-03 or any later scientific execution. The next scientific step requires a separate post-G3-02 program review.
