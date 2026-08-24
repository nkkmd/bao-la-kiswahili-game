# REPRODUCIBILITY_INDEX — Symmetry / Isomorphic Positions Study 1

Updated: 2026-08-24  
Study: `SIP-STUDY1`  
Status: **COMPLETED / 5 formal outcomes `NON-ESTIMABLE`**

## Study-start source bindings

```text
main HEAD
f2edfe27f4e22198e28525b0ac09f6dd4834c488

public/engine.js Git blob at study start
2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c

Restricted Endgame canonical result Git blob
811eb78806813d236dc91c776e1e408d4feac22e

historical symmetry transform Git blob (context only)
a9117f46643fc79fc3352771d684c4ac9f7a01f6
```

## Immutable upstream exact-oracle identities

```text
domainSha256 = acfc25413f9c237569884f166ed971ad9ee9395665ce96ec6d094d8ed4a6c56a
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

These identities and the upstream formal decision remain unchanged by `SIP-STUDY1`.

## Candidate firewall chronology

```text
initial design / candidate-freeze commit
ea991e641afa63e704f6fd23585db8ee21bacaff

Stage 0 tooling commit
ee72cebb3c9353cca67a8a0f738595c275bc3b14

candidate contract Git blob after freeze
09d6744a109e8ca8f9220fa8f24188cf55d4ad9c

candidate contract byte SHA256 used by Stage 1
b349a34c28824ee54770329a516fd0cf7a7c2cc6488e874b02fe5800ee75c9f0
```

Historical `tools/symmetry/transform-candidates.js` was context only and was not imported by the new formal transform implementation.

## Stage 0 technical verification

```text
technical stage = SIP-STAGE0-TECHNICAL-2026-08-24-v2
workflow run = 32713095966
job = 97388528118
artifact = 9514839582
artifact ZIP SHA256 = 9e7ac1b261bd74e91b729bffb0ea0641812b92f7d711080a0db1e73b8ce7da0f
```

Frozen technical choice:

```text
formal seed block = 22910001..22910064
maximum trajectory ply = 120
roots per stratum = 8
local depth = 3
strata = namua / mtaji / mtaji-houseless
```

The choice used graph size, edge count, branching, runtime/memory and guard status only; no candidate mismatch rate was an input.

## Stage 1 prefreeze verification

```text
prefreeze verification run = 32727669985
prefreeze job = 97432529219
prefreeze artifact = 9520143728
prefreeze artifact ZIP SHA256 = 0a580f8e7dca3731253caeea6ea5fc46661cb93e1e3f3184387241d2e4d6e45a
```

The domain materializer used no candidate transform. It produced shortage 0, witness replay failure 0, and trajectory runtime guard hit 0.

## Frozen Stage 1 scientific contract

```text
stageId = SIP-S1-FORMAL-2026-08-24-v1
specSha256 = ede4968d7702ffded73233cf05cbe10c94c4d3a1cb04ef850f85c727b56d2b0a
authorizationSha256 = a539de44b26e513ab461a559e97ee4e7914900178a469389a5c996def3d7f5a4
domainSha256 = fa40e1b7d2fc5e34291ec9537e8a5f19b280be8203d62ca8687090dc96ff9e22
candidateContractSha256 = b349a34c28824ee54770329a516fd0cf7a7c2cc6488e874b02fe5800ee75c9f0
oracleSha256 = e8ddff92818f6192cbfdaec3cac6fed79114df377582b11bf0374cb11fd81e0d
```

Frozen source-file SHA256 values recorded in the spec:

```text
engine = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
transformImplementation = 9209c9274d65a9482ae91f811dfa1691866441cce39b2da49ea0411d5896bba7
runner = 28b2355bc2f223c06f5d7be9be975cdfde79cd7b4f318b8ae1980970e2082b85
verifier = c1bbf2377a6b7214caa9cd023c31ab136c3e9072acec24e03ff46c53151ba854
```

## v1 technical invalidation and unexecuted v2 correction

The archived v1 production/independent files are preserved byte-for-byte for traceability, but `results/STAGE_1_V1_INVALIDATION.json` marks that run `TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION`. The root cause is the oracle reconstruction from terminal `stateRows.ruleState`, for which three snapshots do not re-hash to their stored raw keys and represent 63 seeds.

A corrected v2 production runner was drafted prospectively around raw oracle graph reconstruction, but the correction path was not completed: `STAGE_1_FORMAL_SPEC_V2.json`, `STAGE_1_AUTHORIZATION_V2.json`, an independent v2 verifier, and v2 result artifacts were never created. v2 was not authorized or executed. The draft runner is not part of the closed Study result.

Accordingly, the final 0 validated / 0 rejected / 5 `NON-ESTIMABLE` status is a Study-level closure decision. Fresh v1 zero-mismatch counts are reproducible diagnostics from an invalidated run, not formal positive findings.

## Formal outcome artifacts

Canonical repository files:

- `preregistration/STAGE_1_DOMAIN.json`
- `preregistration/STAGE_1_FORMAL_SPEC.json`
- `preregistration/STAGE_1_AUTHORIZATION.json`
- `results/STAGE_1_PRODUCTION_RESULT.json`
- `results/STAGE_1_INDEPENDENT_VERIFICATION.json`
- `results/STAGE_1_WORKFLOW_PROVENANCE.json`
- `results/STAGE_1_FORMAL_RESULT.json`

Frozen result identities:

```text
productionResultSha256 = fd1c509b40a3ea40675e738826db8cb4030378ed8955f122594a6f5e4756574a
independentVerificationSha256 = 8e7327b4192e2616716d34deae86b15a51f269201f591a843310d414541596f0
```

Exact archival run:

```text
workflow run = 32728925376
formal artifact archive commit = 0b021de1138b07e2b64619fc80a507b9effaf9b2
```

The archive rerun did not change any scientific input. It reproduced and committed the already observed verification failure rather than attempting to rescue it.

## Independent-verification result

```text
formal validated = 0
formal notValidated = 0
formal nonEstimable = 5
```

For each scientific candidate scope, the fresh graph had zero mismatch. Production and independent implementations disagreed on mandatory exact-oracle mismatch accounting; therefore `G12=FAIL` and final decision is `NON-ESTIMABLE` for all five outcomes.

## Control behavior

```text
IDENTITY fresh mismatch count = 0
negative-control independent fresh mismatch count = 638
```

The IDENTITY control also failed the exact-oracle anchor, so the oracle failure cannot be interpreted as candidate-specific negative evidence.

## Post-outcome read-only oracle diagnostic

```text
workflow run = 32728619101
job = 97435494379
classification = POST-OUTCOME-READ-ONLY-ORACLE-ANCHOR-DIAGNOSTIC
```

Findings:

```text
oracle rows = 8
stored stateKey mismatch rows = 3
production/independent recomputed-key disagreements = 0
seed totals observed = 63, 64
recomputed transitions = 7
successor escapes stored key set = 0
```

Affected stored terminal keys:

```text
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
```

This diagnostic cannot revise the upstream Study and is used only to document why its immutable artifact was not a usable symmetry-transform anchor under the frozen Stage 1 contract.

## Final downstream boundary

```text
validated transformation set = []
canonicalization authorized = false
symmetry-group claim authorized = false
symmetry-reduced state counting authorized = false
State Space Study may use raw state identity = true
State Space Study may use T01/T02/T03 for reduction = false
```

No further outcome generation is authorized within Study 1.
