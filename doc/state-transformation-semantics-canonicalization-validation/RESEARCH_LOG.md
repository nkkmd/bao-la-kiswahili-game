# STSCV-STUDY1 — Research Log

## 2026-08-28 — Study-start repository audit

Observed remote `main`:

```text
a8493d2a50e11f15d16ef8348f2442b262ca275d
```

This exactly matched the user-provided post-G2-02 integration/provenance anchor.

Open PR audit returned zero open PRs.

Residual G2 branches:

```text
research/g2-01-position-evaluation-empirical-outcome-calibration-replication: ahead 0 / behind 78
research/g2-01-stage1-implementation-backup: ahead 0 / behind 119
research/g2-02-search-reliability-decision-robustness: ahead 0 / behind 7
```

Conclusion: no active/unmerged competing Research Generation 2 work was found.

## 2026-08-28 — Required scientific-state reconstruction

Read and reconciled the Research Generation 2 agenda/governance, G2-01/G2-02 closure documents, SIP-STUDY1, ORISC-STUDY1, REWR-STUDY1, SSGTC-STUDY1, root README, and RULES_BASELINE.

Immutable boundaries recorded:

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primaryFormalCriterion null
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated transform set = []
```

## 2026-08-28 — Study identity and stage freeze

Formal Study identity fixed prospectively:

```text
Agenda = G2-03
Study ID = STSCV-STUDY1
Formal title = State Transformation Semantics / Canonicalization Validation Study 1
```

Stage IDs fixed:

```text
STSCV-S0-TECHNICAL-2026-08-28-v1
STSCV-S1-DEVELOPMENT-2026-08-28-v1
STSCV-S2-FORMAL-2026-08-28-v1
```

No scientific outcome existed at this point.

## 2026-08-28 — Representation design decision

Authoritative state identity retained as RAW-only:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

A key G2-03 design distinction was fixed prospectively: exact rule-semantic isomorphism does not automatically imply authorization for fixed-start reachable-population canonicalization. Domain/reachability closure must be separately demonstrated.

## 2026-08-28 — Stage 0 technical validation

Stage 0 reconstructed the current engine representation/transformation semantics and established separate production and independent technical paths.

The technical instrument contract covered:

- authoritative RAW serialization;
- exact move identity including Namua `moveVariants`;
- transform and inverse handling;
- legal-move-set comparison;
- successor binding;
- terminal/winner/pending semantics;
- IDENTITY positive control;
- deliberately broken LR negative control.

Stage 0 remained non-scientific and produced no candidate decision.

## 2026-08-28 — Stage 1 prospective development freeze and execution

Stage 1 was authorized only after its candidate contract, population/selection rules, source hashes, and development role were frozen.

Fresh development population:

```text
Namua roots = 24
Mtaji roots = 24
Mtaji-houseless roots = 24
Total = 72
```

Canonical Stage 1 development workflow:

```text
workflow run = 33144060069
artifact ID = 9675082539
artifact ZIP SHA-256 = 86d7a8635ab9e06632f67e9039371aa053fbc224e71ee70576bb983d0abd6ca5
selectionSha256 = f1cfeed4b712885ca1dd0ec84ea537b5ec8177fe64f16c677971558b2e2ae7c5
measurementSha256 = bae92c61d3a9736130da6d80a3ea6a6a7597d8277cfe362b13127749b7b74bf8
formalCandidateDecisionsAuthorized = false
```

Three non-identity candidates were retained for a later held-out formal stage:

```text
STSCV-T01-SEAT-SWAP-LOCAL
STSCV-T02-LR-MTAJI-HOUSELESS
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

All 72 Stage 1 selected trajectory identities, opening-prefix identities, and RAW-state identities were prospectively consumed for the Stage 2 firewall. Stage 1 outcomes were not formal validation evidence.

## 2026-08-28 — Stage 2 prospective freeze

A new Stage 2 formal contract was frozen before any Stage 2 scientific outcome existed.

```text
seed block = 26032001..26032768
seed count = 768
target roots per stratum = 32
strata = Namua / Mtaji / Mtaji-houseless
local graph depth = 3
mismatch tolerance = 0
replacement outside seed block = false
seed extension after outcome = false
```

Formal global gates were frozen as S2-G1..S2-G6. Mandatory production/independent agreement was S2-G5.

The global failure rule was also frozen prospectively:

```text
if any global gate does not PASS:
  Study = INCONCLUSIVE
  candidate = NON-ESTIMABLE
  canonicalization = NON-ESTIMABLE
  scientific mismatch interpretation = not authorized
```

## 2026-08-28 — Stage 2 firewall hardening before authorization

Initial prefreeze audit exposed a provenance weakness: the Stage 1 compact result's stored `selectionSha256` was being trusted rather than recomputed from its selected-root identities.

Because no Stage 2 scientific outcome existed, this was handled prospectively rather than as a rescue. Production, independent, and prefreeze paths were hardened to independently reconstruct the Stage 1 selection binding.

Final hardened prefreeze:

```text
workflow run = 33145713610
job = 98766151957
head = bb6df48ab46bd1379d9aedbadb97db995e961271
conclusion = success
artifact ID = 9675658249
artifact ZIP SHA-256 = e2b6c07919875effade8f4d93b6f824d9e75522904243d079f504102ef746ae2
scientificOutcomeGenerated = false
```

Older run `33145557654` was superseded by the hardened prefreeze.

## 2026-08-28 — Explicit Stage 2 authorization

Stage 2 formal scientific generation was explicitly authorized at commit:

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

The authorization was bound to the exact frozen spec, candidate contract, firewall, decision rule, Stage 1 result identity, RAW identity, production runner, independent verifier, and source hash set.

No candidate outcome had been inspected before authorization and no Stage 2 scientific outcome existed before authorization.

## 2026-08-28 — Fresh held-out Stage 2 production measurement

Authorized workflow:

```text
name = STSCV Stage 2 Formal
run = 33145860098
job = 98766622115
head = c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

The engine regression and frozen source reconstruction passed. Fresh held-out production measurement then completed successfully.

Production selected the exact frozen quota:

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
```

Production-only compact diagnostics printed to the workflow log:

```text
selectionSha256 = 4d81f8adebfe7b32bfba86adaaeb3f04a8ca6b451e09953612804734d303bb1c
measurementSha256 = 530ae49610dc7cc3af2713c0cf35c5d4e24d005f376d53e9da869b184b06b4fb
decisionInputSha256 = 58c8a2f6422135073bb4cbd5bac985bf1e72e5040b1c285ff5eca3a129523264
T01 mismatch = 0
T02 mismatch = 0
T03 mismatch = 0
bounded canonicalization source graph = 6317 states / 6341 edges
runtime guard hits = 0
max generated orbit size = 4
```

These values were not interpreted as candidate decisions before mandatory independent verification.

## 2026-08-28 — Mandatory independent verifier failure

The independent verification step terminated during formal-result assembly with:

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

Workflow consequence:

```text
independent verification / frozen decision rule = failure
canonical hashes = skipped
artifact upload = skipped
workflow conclusion = failure
```

No complete canonical `STAGE_2_INDEPENDENT_VERIFICATION.json`, workflow-produced `STAGE_2_FORMAL_RESULT.json`, SHA256SUMS, or workflow artifact ZIP was materialized.

The failure is a technical/reproducibility failure after fresh outcome generation, not a scientific candidate mismatch.

## 2026-08-28 — Fail-closed formal decision

Because mandatory global gate S2-G5 could not be established as a complete canonical independent-verification result, the pre-outcome frozen global-failure rule applied without modification.

Final closure:

```text
STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

Production-only zero-mismatch diagnostics were preserved but not upgraded to `VALIDATED-BOUNDED-ISOMORPHISM`. The technical verifier failure was also not converted into `NOT-VALIDATED`.

## 2026-08-28 — Canonicalization boundary preserved

Production-only diagnostics indicated zero semantic-domain canonicalization mismatches in the bounded source graph, but mandatory independent verification did not complete canonically.

Separately, production diagnostics showed:

```text
T01 standard initial RAW preservation = false
T02 standard initial RAW preservation = false
T03 standard initial RAW preservation = false
independent standard-start reachability-closure proof implemented = false
```

Therefore G2-03 authorizes neither scientific-population canonicalization nor symmetry-reduced state counting.

## 2026-08-28 — No-rescue closure

The verifier variable-name defect was discovered only after fresh held-out Stage 2 production outcome generation. It was not repaired for a same-evidence rerun.

Any future formal re-examination requires a new prospective Study or explicitly new versioned protocol with fresh authorization and fresh formal evidence. SIP-STUDY1, ORISC-STUDY1, SSGTC-STUDY1, G2-01, and G2-02 remain unchanged.

Repository-facing fail-closed closure records were added without modifying the frozen scientific runner/verifier or re-executing Stage 2 evidence.
