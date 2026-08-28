# PR #71 review disposition

Date: 2026-08-28
Study: `DRSSE-STUDY1`
PR: `#71`
Canonical formal decision: `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`

## Review findings

Automated review identified two latent implementation concerns in the frozen formal source:

1. the resource-censored path does not perform independent re-enumeration through `lastCompleteDepth` when `targetComplete=false`;
2. the production enumerator does not call `ambientStop()` once more after the final transition/layer materialization before calculating `targetComplete`.

These are valid concerns for a hypothetical resource-incomplete execution or for a future version of the enumerator/verifier. They are not used to reinterpret or repair the frozen formal source after outcome generation.

## Canonical-run impact audit

The accepted Stage 2 run was not resource-incomplete:

```text
targetComplete = true
lastCompleteDepth = 9
firstIncompleteDepth = null
stopReason = null
fullIndependentExactRecomputationPerformed = true
fullIndependentExactRecomputationPassed = true
```

Therefore the first concern's skipped branch was not taken in the canonical execution: the full prospectively frozen depth-9 domain was independently re-enumerated.

The accepted final recorded resource use remained below every relevant frozen cap:

```text
parentStateExpansions = 24848 < 500000
moveEvaluations = 106773 < 3000000
elapsedSeconds = 22.918839671 < 1200
peakResidentSetBytes = 680075264 < 6442450944
uncompressedArtifactBytesFinal = 84250493 < 1073741824
cumulative RAW states = 102857 < 500000
depth-labelled legal edges = 106773 < 3000000
tree node occurrences = 136645 < 1000000000
```

Thus the second concern also does not alter the accepted exact decision: even the final recorded post-materialization resource values are well within the frozen resource contract.

## Disposition

The canonical formal source blobs at authorization/head `9199a3d25ea38978673f94bfcd4250aa3b5411fa` are not modified or rerun after outcome observation. Scientific generation workflows remain archived.

The post-closure consistency test now explicitly asserts both facts relevant to the accepted run:

- full independent exact recomputation was performed and passed;
- final recorded resource use remained below all frozen Stage 2 caps.

Any future protocol that permits a resource-censored formal outcome must independently re-enumerate all claimed-complete layers and must recheck ambient/resource caps after final transition/materialization before classifying completion. That requires a new prospective version/authorization rather than a same-evidence repair of `DRSSE-S2-FORMAL-2026-08-28-v1`.

## Program-level prospective follow-up

The two findings above are promoted, without changing G2-05, into a repository-level prospective implementation policy:

- [`../../research-program-decisions/2026-08-28-post-g2-05-raw-enumeration-hardening.md`](../../research-program-decisions/2026-08-28-post-g2-05-raw-enumeration-hardening.md)

The policy additionally requires a pre-formal negative-control matrix, new source identities/fresh authorization for the hardened implementation, read-only post-merge closure auditing, and explicit adoption by G2-12 if it consumes G2-05-derived bounded exact RAW enumeration.
