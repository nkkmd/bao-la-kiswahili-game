# 2026-08-25 — ORISC-STUDY1 post-closure workflow archival

Study: `ORISC-STUDY1`  
Classification: **POST-CLOSURE EXECUTION CONTROL / NO SCIENTIFIC RESULT CHANGE**

## Context

`ORISC-STUDY1` had already reached its canonical closure:

```text
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
canonical formal run = 32753073798
canonical artifact = 9529771157
```

No further scientific outcome generation was authorized inside the closed study.

## Closure-audit finding

During documentation-only updates to draft PR #48, GitHub pull-request synchronization triggered the historical Stage 1 formal workflow again. The cause was the workflow's `pull_request.paths` filter: the authorization path was already part of the PR-wide changed-file set, so later synchronization events continued to satisfy the filter even when the new commit changed only documentation.

The unintended duplicate was:

```text
runId = 32797248144
jobId = 97650964412
artifactId = 9545248579
artifact ZIP SHA-256 = 1b339c75af3ee7a514a04c51902934c8b0930d792cfcc19f8c320cae181053e0
```

Its output exactly reproduced the canonical scientific identities:

```text
formalDecision = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
production resultSha256 = 03b112ba6dc1b79d65e4bfd3dbba603f0a20d0f3e16ab9d98a37e9bf50f6afe9
independent verification resultSha256 = 3501a65b4920e9ae44f55e2a46da370f750cbac01c1293398dc7b020cdae4bcf
A-G12 = PASS
IDENTITY = FAIL
stage2ExecutionAuthorizedByThisResult = false
```

The run is therefore classified as:

```text
POST-CLOSURE-AUTOMATIC-DUPLICATE
NON-CANONICAL
NO-NEW-SCIENTIFIC-EVIDENCE
```

It is excluded from the canonical evidence set and does not reopen or replicate the Study for formal inference.

## Corrective action

The four ORISC workflows were converted after closure to archival stubs:

```text
Stage 0A archival commit = cfb292af840818e5767149969a86772c2e567eac
Stage 0B archival commit = 0caf5b791d2bf08622d992dd2a11fff6248ec47e
Stage 1 spec-freeze archival commit = b626d60c4cc2a71ad4c8c7572328ee862b0f76c7
Stage 1 formal archival commit = 8f6ecf623abd733bc7d5333f124b8923d4456141
```

Each current workflow:

- has no automatic `push` trigger;
- has no automatic `pull_request` trigger;
- executes no ORISC scientific tooling;
- may only be manually dispatched to print a closed-study notice.

## Reproducibility boundary

The current archival workflow bytes intentionally differ from the frozen workflow bytes used for the canonical formal result. This is not a retroactive source change.

The executable formal workflow used by the scientific run remains preserved in Git history and is bound before outcome by:

```text
formal workflow SHA-256 = 0f5e5da13e84e9511a477a8fdfc01133e3a36cc08e908e16a31b71517e3b429f
specSha256 = 5a766ec900c1f76c5b832f2c76153b9426b3970316b31806d377c497d1e585e5
authorizationSha256 = b8bc9c65510c2f4ea0909e269af7945d7ae5d3d32b595224519b1549a275325e
```

The canonical scientific run remains:

```text
runId = 32753073798
jobId = 97514309075
artifactId = 9529771157
artifact ZIP SHA-256 = 13844208eeaaa4ae8eedc35724a0d71ed043f982cfaaa48cf1d692133d74d6e8
```

## Scientific boundary

This post-closure operation changes none of:

- `REWR-STUDY1` formal decision;
- `SIP-STUDY1` closure;
- ORISC Axis A formal decision;
- A-G1..A-G12 gate results;
- candidate contract;
- Axis B non-execution;
- downstream raw-only authorization boundary.

No further ORISC scientific outcome generation is authorized.

## Integration boundary

`main` is not modified by this checkpoint. Draft PR #48 remains the only integration boundary and must remain unmerged until explicit user instruction.