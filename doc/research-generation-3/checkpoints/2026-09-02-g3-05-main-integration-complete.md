# Research Generation 3 — G3-05 main integration complete

Date: 2026-09-02  
Status: **MAIN-INTEGRATION-COMPLETE**

## Integration provenance

```text
Study = G3-05 / BECT-STUDY1
pre-integration main = 127a9653933c623307c8423fddaf42166090f11b
audited research branch = research/g3-05-branch-expansion-compression-transition
audited research head = 49f868103b186c8bc00a188afd185a620a797e55
pre-integration relation = branch 96 commits ahead / 0 behind
merge base = 127a9653933c623307c8423fddaf42166090f11b
integration method = fast-forward ref update / force=false
fast-forward integrated head = 49f868103b186c8bc00a188afd185a620a797e55
post-integration study README commit = 0174122aae88408b2546c00f3692dfb57413a7ce
post-integration CURRENT_STATUS commit = ee1e8de8db7181ed4e3850e9b8b87d6e4749ade4
main integration = COMPLETE
```

No squash, rebase, history rewrite, scientific rerun, or forced ref update was used.

## Scientific state preserved

```text
BECT-STUDY1 = CLOSED / TECHNICAL-INVALID
Stage 0 v2 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID / 1 authorized / 1 actual
Stage 1 seed = 31510001..31510240 / CONSUMED
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
no-rescue boundary = CROSSED / ACTIVE
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

The integration does not change the BECT formal decision, scientific result bytes, frozen protocol/preregistration, upstream G3-03/G3-04 decisions, or protected-evidence boundary.

## Final document boundary

The pre-integration final document audit passed in workflow run `33640556626`, with checkpoint `doc/branch-expansion-compression-transition/checkpoints/2026-09-02-final-document-consistency-pass.md`.

After the fast-forward, only current-facing integration state was updated in:

- `doc/branch-expansion-compression-transition/README.md`
- `doc/branch-expansion-compression-transition/CURRENT_STATUS.md`

Historical prospective documents and scientific result artifacts were not rewritten.

## Next program action

G3-06 remains **`NOT AUTHORIZED`**.

The next scientific action, if pursued, is a separate post-G3-05 current-state authorization review. G3-05 partial telemetry must not be promoted into a validated transition mechanism or reused to rescue BECT-STUDY1.
