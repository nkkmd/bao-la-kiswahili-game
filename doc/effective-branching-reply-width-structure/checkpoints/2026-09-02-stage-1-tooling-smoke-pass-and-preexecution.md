# EBRWS-STUDY1 — Stage 1 tooling smoke PASS / pre-execution checkpoint

Date: 2026-09-02 (Asia/Tokyo)

## Scope

This checkpoint is recorded before any `EBRWS-STUDY1` Stage 1 fresh scientific evidence generation or read.

## Repository / tooling state

- research branch: `research/g3-02-effective-branching-reply-width-structure`
- audited branch head before this checkpoint: `be238a6ef1ed0eb8db1dd3565ad16eeb829e16c1`
- Stage 1 authorization: `EBRWS-S1-DEVELOPMENT-2026-09-01-v1 / AUTHORIZED`
- Stage 1 scientific result directory before execution: absent
- Stage 1 seed `31210001..31210192` consumed: false
- Stage 2 seed `31220001..31220288` consumed: false

## Tooling smoke

GitHub Actions:

- workflow: `EBRWS Stage 1 tooling smoke`
- run: `33525232642`
- job: `99914259137`
- conclusion: `success`

Read-only tooling output:

```text
toolingPass = true
syntaxPass = true
importPass = true
staticIndependent = true
freshScientificSeedAccessed = false
freshScientificRootGenerated = false
protectedDepth10Access = false
productionSourceSha256 = e0df467abf861f9178a72705cccb124776abbd0272f50cc57d53875a33c1bc6f
independentSourceSha256 = c5c0587a5a7c7067636562c7f617e54deaadf77fca378e7cd6add5ea42bfecb3
```

The production and independent G3-02 endpoint implementations are separate source files and have distinct source hashes.

## Firewall audit

Before execution, both implementations were inspected and confirmed to reconstruct and exclude the identity sets for:

- G3-01 consumed population,
- LGTGMIV Stage 1 population,
- LGTGMIV Stage 2 population,

using RAW-root identity, full source-trajectory identity, and first-16-move-prefix identity. Root selection remains geometry-blind and outcome-blind.

Both implementations independently recompute the G3-02 derived endpoint/class/candidate logic from formally eligible LGTGMIV primitives. No shared G3-02 derived-metric/class/promotion/hash helper is used.

## Frozen scientific boundary

No scientific threshold, endpoint, family usage, phase subset, seed, root rule, horizon, resource ceiling, promotion criterion, or decision label has been changed after protocol freeze.

The one-shot Stage 1 execution is permitted only under the existing authorization. Once fresh Stage 1 evidence is generated or read, the no-rescue boundary is crossed permanently for this evidence.

## Downstream boundary

Stage 2 remains:

`NOT-AUTHORIZED-NOT-EXECUTED`

A Stage 1 PASS with a non-empty promoted primary candidate set can make a separate Stage 2 authorization review eligible; it cannot automatically start Stage 2.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`
