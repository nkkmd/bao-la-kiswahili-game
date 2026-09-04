# G3-12 / LGTGGC-STUDY1 — Stage 0 V2 precomputation technical-invalid

Date: 2026-09-04

## Disposition

```text
Stage = LGTGGC-S0-TECHNICAL-2026-09-04-v2
Actions run = 33842965132
job = 100928827303
workflow conclusion = failure
stage disposition = PRECOMPUTATION-TECHNICAL-INVALID
scientific execution consumed = false
technical seed replay executed = false
technical seed access = 0
Stage 1 scientific seed access = 0
Stage 2 scientific seed access = 0
fresh G3-12 scientific evidence generated/read/peeked = 0
protected G3-11 depth-10 access = false
depth-11 access = false
G2-12 estimator scientific input = false
same V2 rerun = NOT AUTHORIZED
```

## Failure point

The workflow stopped in the static `node --check` step before authorization verification and before invocation of the Stage 0 runner.

The syntax defect was a missing closing parenthesis in the technical result assembly expression:

```text
Object.fromEntries(gIds.map(id=>[id,gep[id]])
```

No P1/P2 source replay, no technical root reconstruction, no search-condition computation, no CRCLGR/GCLD technical measurement, and no probability calculation occurred.

This is therefore a precomputation tooling failure, not a technical finding about the frozen controls and not a scientific result.

## Versioning decision

The same V2 execution is not rerun. A separately frozen `LGTGGC-S0-TECHNICAL-2026-09-04-v3` may correct only this syntax defect while retaining unchanged:

- `LGTGGC-P1-UNIFORM-LEGAL`;
- `LGTGGC-P2-MAX-CAPTURE`;
- RF1/RF2 definitions;
- technical seed namespace `32309001..32309064` (unread by V2);
- all Stage 1/2 scientific seed blocks;
- mandatory technical controls;
- formal claim identities and thresholds;
- resource ceilings;
- RAW identity and `validated transform set = []`;
- depth-10/depth-11/G2-12 firewalls;
- no-rescue and interpretation boundaries.

V3 requires a new technical authorization and execution token. V2 authorization does not authorize V3.
