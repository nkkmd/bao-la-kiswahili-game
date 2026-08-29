# PCRPR-STUDY1 — Pre-Main Integration Audit

Date: 2026-08-29

## Integration target

```text
repository = nkkmd/bao-la-kiswahili-game
base main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
research branch = research/g2-07-practical-comeback-reply-pressure-representation
pre-merge branch HEAD = 80baf53446354e2229ff518f2d3ba2c374fb7f7c
PR = #76
```

## Scientific closure consistency

The canonical closure records agree on:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds 28710001..28713072 = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
Study = CLOSED
```

Production and independent replay both completed their scientific computation and reported the same development-core SHA256, but the independent full result artifact was not materialized because GitHub Actions `CreateArtifact` timed out after five attempts. Mandatory full final exact verification therefore did not complete; the prospectively frozen fail-closed mapping requires `STAGE1-TECHNICAL-INVALID`.

## Central-document audit

Final integration preparation detected and corrected three documentation omissions:

1. root `README.md` previously ended its Research Generation 2 closure list at G2-06;
2. `doc/RESEARCH_INDEX.md` lacked a dedicated G2-07 closure section and still described G2-07 as the next independent item;
3. `doc/FUTURE_RESEARCH_AGENDA.md` still marked G2-07 as planned / next unstarted.

A one-shot anchor-validated materialization workflow (`33254196072`) updated exactly those shared entry documents and passed all reference checks. The temporary materialization workflow and script were then removed from the branch.

Current shared-document state:

```text
root README = G2-07 closure entry present
RESEARCH_INDEX = section 23 PCRPR-STUDY1 present
FUTURE_RESEARCH_AGENDA = G2-07 completed / next unstarted G2-08
```

## Diff-scope audit

Compare `e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5...80baf53446354e2229ff518f2d3ba2c374fb7f7c` is ahead-only, behind 0. Final changed-file scope is limited to:

- PCRPR archival workflow stubs (`.github/workflows/pcrpr-*`);
- PCRPR study documents/results/preregistration/checkpoints;
- PCRPR experiment tooling;
- root `README.md`;
- `doc/RESEARCH_INDEX.md`;
- `doc/FUTURE_RESEARCH_AGENDA.md`.

No pre-existing `public/engine.js`, `public/ai.js`, `public/ai-weights.js`, rule semantics, public gameplay code, or unrelated study result is modified.

## Integration decision

```text
research closure = COMPLETE
central documentation = SYNCHRONIZED
scientific rerun = NOT AUTHORIZED
Stage 2 = NOT AUTHORIZED
PR #76 = READY FOR MAIN INTEGRATION
```

After merge, a post-main closure checkpoint should record the actual merge commit SHA and update operational status from branch-only/pending integration to main-integrated. No scientific result may change during that post-merge documentation step.
