# G3-08 / LGPML-STUDY1 — Final Document Consistency Follow-up Pass

Date: 2026-09-03

## Disposition

**`PASS`**

The first final consistency pass correctly fixed the G3-08 Study and central current state, but a subsequent full inherited-document read-through found repository-lifecycle wording that remained stale in G3-04..G3-07 current-facing documents, plus one duplicate obsolete G3-08 status line in `doc/research-generation-3/README.md`.

This follow-up normalizes only historical downstream-authorization / main-integration metadata. It does **not** change any scientific result, candidate label, threshold, endpoint, seed, hash, population, representation, no-rescue boundary, or protected-evidence state.

## Corrections

- removed duplicate live `G3-08 = NOT AUTHORIZED` line from RG3 README;
- marked G3-04..G3-07 closure-time next-study authorization statements as historical;
- updated G3-07 README/CURRENT_STATUS to state that the separate G3-08 review later completed and G3-08 is now closed technical-invalid;
- added post-closure main-integration metadata to G3-05/G3-06/G3-07 final reports without changing science;
- appended G3-07 Decision Register lifecycle follow-up decisions;
- clarified G3-07 downstream history in RESEARCH_INDEX / FUTURE_RESEARCH_AGENDA.

## Immutable current state

```text
G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds = NOT CONSUMED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
G3-08 main integration = NOT AUTHORIZED / NOT PERFORMED
G3-09 = NOT AUTHORIZED / separate post-G3-08 review required
PROGRAM_PLAN blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac
```

Workflow run = `33744376975`  
Audit trigger HEAD = `befcf9c460dcc4b10cb8e8c671776a59d01bf701`  
Research branch = `research/g3-08-local-geometry-persistence-memory-length`

This checkpoint supersedes the earlier consistency pass only with respect to documentation-lifecycle completeness; the earlier scientific/technical closure checks remain valid.
