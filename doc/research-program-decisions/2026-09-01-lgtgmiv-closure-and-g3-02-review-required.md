# Program Decision — LGTGMIV closure and G3-02 authorization review required

Date: 2026-09-01

## Decision

Accept `LGTGMIV-STUDY1` as formally closed with:

`CLOSED / FORMAL-ELIGIBLE-ALL`

The following five bounded local geometry measurement families are formally eligible under the Study's frozen RAW-only depth-5 instrument contract:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

This program decision accepts the Study closure; it does not expand the scientific claim beyond the frozen Study boundary.

## Evidence basis

- Stage 0: `STAGE0-PASS`
- Stage 1: fresh 16-root development population, global PASS, all five families promoted
- Stage 2: fresh 24-root formal holdout, global PASS, all five families formal eligible
- Stage 2 formal workflow: `33452082425 / success`
- Stage 2 result commit: `5fbdd72a8c0a8d34b1b74cf0829a6f972812a549`
- Stage 2 read-only audit: `33452400324 / success`
- audit result commit: `ad057e499e34f70493ac1d7332fe42332323d293`

The read-only audit imported no engine and performed no scientific re-execution.

## G3-01 boundary

This decision does not change G3-01.

```text
LGTGMF-STUDY1 = CLOSED / TECHNICAL-INVALID
formal eligible families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

LGTGMIV is a separate fresh Study, not a G3-01 repair or rescue.

## G3-02 decision

**G3-02 is not automatically authorized.**

`automaticG302StartAuthorized = false`

G3-02 and the downstream G3-02..G3-08 chain remain blocked until a separate post-closure authorization review prospectively checks:

- current repository and program state,
- the exact LGTGMIV formal eligible family set,
- G3-02 scientific question and dependency on those families,
- G3-02 fresh population / seed / evidence firewall,
- resource and estimability gates,
- independence requirements,
- protected-evidence boundaries.

No G3-02 fresh scientific evidence may be generated before that review produces an explicit authorization decision.

## Protected evidence

The standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

This decision does not authorize its generation or inspection.

## Historical plan boundary

`doc/research-generation-3/PROGRAM_PLAN.md` remains the historical prospective program plan and is not retrospectively rewritten by this closure decision.
