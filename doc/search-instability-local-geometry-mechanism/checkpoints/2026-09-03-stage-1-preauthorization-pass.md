# SILGM Stage 1 preauthorization static audit — PASS

Date: 2026-09-03  
Study: `SILGM-STUDY1`  
Stage: `SILGM-S1-DEVELOPMENT-2026-09-03-v1`  
Audit: `SILGM-S1-PREAUTH-STATIC-2026-09-03-v1`  
Disposition: **`STAGE1-PREAUTH-STATIC-AUDIT-PASS`**

## Execution identity

```text
trigger commit = 6b75baa7203258482d41a5da4fad86eeb326c04f
bound tooling parent = a5ddd8f99407094fa12dbfc5a61bcb1140f07915
workflow run = 33714344021
job = 100520244867
artifact id = 9877968797
artifact name = silgm-stage1-preauthorization-v1-33714344021
artifact ZIP SHA-256 = 8de27b2a735c8a67aaf3f09075d354411a2f6abd296c8e9c19adc93eab6d6250
canonical JSON SHA-256 = ccb7fcc99915686ccbce7d74cdc1b4218eef1cf959e5da73018241e677667174
```

## Audited frozen bindings

The fresh-free audit verified exact Git-blob bindings for the authoritative engine/evaluator, the frozen Study and Stage-1 specs, the SILGM and BRMGI identity firewalls, the canonical BRMGI Stage-1 disposition, the Stage-0-v4 PASS result, the LGTGMIV production/independent geometry implementations, the controlled-search technical reference, the SILGM production/independent search cores, and the new Stage-1 production/independent/runner sources.

The audit additionally verified:

- production Stage-1 selection/measurement imports only the production geometry/search path;
- independent Stage-1 selection/measurement imports only the independent geometry/search path and does not alias the production search/aggregation path;
- the Stage-1 runner requires a separate authorization artifact before population selection;
- the unarmed runner fails closed before Stage-1 spec/seed access;
- the frozen 24 Namua + 24 Mtaji target, seed range `31710001..31710256`, no seed extension, no root replacement, and protected-depth-10 firewall remain intact;
- BRMGI/G3-06 failed-selection diagnostics, direction, and failed/partial identity provenance are not retained.

## Evidence boundary

The audit result records:

```text
authorizationArtifactPresent = false
freshStage1SeedAccess = false
freshStage2SeedAccess = false
protectedDepth10Access = false
scientificEvidenceGenerated = false
scientificEvidenceRead = false
noRescueBoundaryCrossed = false
stage1AuthorizedByThisAudit = false
```

The subsequent unarmed smoke test also reported `freshScientificSeedAccess=false` and `protectedDepth10Access=false`.

Therefore the audit itself does not authorize or execute Stage 1. A separate formal Stage-1 authorization decision and a separately bound authorization/trigger chain are required before the first Stage-1 seed access.
