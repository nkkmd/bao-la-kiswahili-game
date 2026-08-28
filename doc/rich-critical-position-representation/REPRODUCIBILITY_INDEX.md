# RCPR-STUDY1 — Reproducibility Index

Updated: 2026-08-28  
Status: **ACTIVE / STAGE 0 TECHNICAL-ONLY / NO SCIENTIFIC OUTCOME**

## Study anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
branch = research/g2-06-rich-critical-position-representation
Program = G2-06
Study ID = RCPR-STUDY1
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
```

## Startup repository audit

```text
expected main SHA = 37480777246aa306c6ca3d0679d936b5e0107071
actual remote main SHA = 37480777246aa306c6ca3d0679d936b5e0107071
match = true
open PR count = 0
```

Audited historical Research Generation 2 branches and G2-05 hardening branch were all ahead of `main` by zero commits. No residual unmerged scientific work was identified.

## Prospective authority

- `preregistration/STUDY_START_FREEZE.md`
- `STUDY_1_PROTOCOL.md`
- `DECISION_REGISTER.md`

No G2-06 scientific outcomes existed when these documents were created.

## Authoritative representation

```text
RAW identity include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
missing pending = invalid
represented seeds = 64 for ordinary legal study states
validated transform set = []
symmetry reduction = false
canonicalization = false
```

## Stage 0 source audit identities

Known upstream Git blob identities at the verified baseline:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/ai.js = 8d472be415fac17e47a8e5e667cea9672e7a9ef5
public/ai-weights.js = 98969eb4c8e1403beedcf5c139a07166aa78175c
tools/experiments/lib/position-complexity-search-diagnostic.js = 72617e23ca143fac7bea35934815fd438d3e5be7
historical tools/experiments/lib/critical-positions-outcome-branching.js = d3568a7d195a32e56f68519d1813a1365dda603b
historical tools/experiments/lib/position-typology-features.js = 2ea6c226561f1b7e59926caa39c0ebee28cf6b65
historical tools/experiments/lib/tactical-motif-features.js = a8c668779a1cb9738b7066799a46f1fb484a1df4
G2-05 tools/experiments/lib/drsse-production.js = e8fc23799415f566850c817c22cf658216bb98be
```

The historical CPOB and position-typology/tactical modules are method fixtures only and are not authorized as scientific G2-06 feature/identity implementations.

## Historical evidence exclusion

Prohibited from RCPR Stage 1/2 development/formal rows:

```text
CPOB source seeds 22600001..22603072
CPOB selected roots = 600
CPOB high-divergence roots = 139
CPOB candidate audits = 1183
CPOB promoted candidates = 0
CPOB reserved unconsumed Stage 2 seeds 22700001..22706144
all CPOB Stage 1 measured/discovery payloads
```

The unconsumed historical Stage 2 seed block is intentionally not reassigned to RCPR; RCPR will freeze distinct fresh seed blocks before its own Stage 1 and Stage 2 generation.

## Stage 0 provenance fields to preserve

The Stage 0 technical result must record at minimum:

```text
studyId
stageId
baselineMainSha
sourceCommit
sourceTreeDirty
specSha256
sourceBlobHashes
engineBlobSha
aiBlobSha
aiWeightsBlobSha
searchBlobSha
productionFeatureBlobSha
independentFeatureBlobSha
workflowRunId
workflowJobId
artifactId
artifactZipSha256
positiveControls
negativeControls
familyEligibility
productionIndependentAgreement
resourceProfile
resultHash
```

## Stage 1/2 future provenance

Before Stage 1 scientific outcome generation, exact source seed blocks and all scientific implementation hashes must be frozen. Before Stage 2, a new source freeze and explicit authorization must record formal population, Stage 1 identity firewall, model/representation parameters, endpoint thresholds, verifier hashes, workflow IDs, artifact identity and decision core.
