# Research Program Decision — G3-09 / CLGR-STUDY1 Technical-Invalid Closure

Date: 2026-09-03

## Decision

**`G3-09 / CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID`**

Stage state:

```text
Stage 0 v1 = TECHNICAL-INVALID / pre-fresh / no rerun
Stage 0 v2 = STAGE0-PASS
Stage 1 = STAGE1-PASS / exactly one authorized fresh execution
Stage 2 = TECHNICAL-INVALID / exactly one authorized fresh execution
Stage 1 seed block = CONSUMED
Stage 2 seed block = CONSUMED
formal representation eligibility = NOT ESTABLISHED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

## Basis

G3-09 was separately authorized after post-G3-08 current-state review as a new prospective Study, not as a repair or reanalysis of G3-08. The Study prospectively froze one primary representation, `CLGR-R1-EXACT-SQUASHED-L1`, over LGTGMIV F1-F5 RAW-only relative-depth-5 measurements, with six exact axes, data-independent rational squashing, equal weights and exact L1 distance.

Stage 1 development completed its exactly-one fresh execution and passed all frozen development gates on 24 Namua + 24 Mtaji roots. This made Stage 2 review eligible but did not itself establish formal representation eligibility.

Stage 2 was separately authorized after a fresh-free static audit. Exactly one formal execution selected the complete 36 Namua + 36 Mtaji root population, then failed closed during required depth-5 exact RAW enumeration at root index 61 / source seed `31920066` with:

`relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b`

The canonical formal result is `TECHNICAL-INVALID`, with 61 partial root measurements and `scientificSummaryAuthorized=false`.

## Program interpretation

This closure does not establish that the continuous representation is formally eligible or formally not eligible. The 61 partial Stage 2 measurements are technical provenance only and may not be promoted into a completed formal scientific result.

Stage 1 development PASS remains immutable Study provenance but cannot substitute for the failed formal holdout.

G3-08 conclusions, G3-07 and earlier formal decisions, LGTGMIV formal eligibility and the protected depth-10 boundary are unchanged.

## No-rescue

Because Stage 2 fresh access occurred, `CLGR-STUDY1` may not be rescued by:

- same-evidence rerun
- relay-limit handling changes followed by rerun
- seed extension or root replacement
- resource-ceiling relaxation
- axis, transform, weighting, distance or representation-family changes
- endpoint or eligibility-gate changes
- favorable subgroup or partial-formal selection

A future relay-limit-safe continuous representation study requires a new prospective independent Study/version and separate authorization.

## Downstream boundary

Historical `doc/research-generation-3/PROGRAM_PLAN.md` remains unchanged.

G3-10 is **not automatically authorized**. Its historical dependency on validated local-geometry coordinates must be reconsidered in a separate post-G3-09 current-state authorization review; that review may determine that a prerequisite is required.

## Main integration boundary

This decision is fixed on the research branch. Integration into `main` is prohibited until explicit user instruction.
