# REPRODUCIBILITY_INDEX — Symmetry / Isomorphic Positions Study 1

## Study-start source bindings

```text
main HEAD
f2edfe27f4e22198e28525b0ac09f6dd4834c488

public/engine.js blob
2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c

Restricted Endgame canonical result blob
811eb78806813d236dc91c776e1e408d4feac22e

historical symmetry transform blob (context only)
a9117f46643fc79fc3352771d684c4ac9f7a01f6
```

## Upstream exact-oracle identities

```text
domainSha256 = acfc25413f9c237569884f166ed971ad9ee9395665ce96ec6d094d8ed4a6c56a
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

## Prospective candidate firewall

```text
initial design/candidate-freeze commit
ea991e641afa63e704f6fd23585db8ee21bacaff

Stage 0 tooling commit
ee72cebb3c9353cca67a8a0f738595c275bc3b14

preregistration/CANDIDATE_TRANSFORMS.json Git blob
09d6744a109e8ca8f9220fa8f24188cf55d4ad9c

tools/experiments/lib/symmetry-isomorphism-transforms.js Git blob
ec4941bfab3039dd66a4b5a88fafd429538c47ec

test/symmetry-isomorphism-stage0.test.js Git blob
4b3580ace002f12dbd5657a815b859560ae64f06

tools/experiments/audit-symmetry-isomorphism-stage0.js Git blob
6044fe30035e1bb2f99c55f2d3cfc7ea47e017df

.github/workflows/symmetry-isomorphism-stage0.yml Git blob
254e2176cee794cf53ee4f18bffcbc15ca133029
```

The candidate JSON and the Study-owned transform implementation were committed before any Study 1 fresh formal reachable-corpus candidate pass/fail result was authorized or generated. Historical `tools/symmetry/transform-candidates.js` is not imported by the new formal transform implementation.

Candidate-specific semantic hashes computed by the Stage 0 audit are not substituted for the Git bindings above; they will be recorded only after the technical artifact is retrieved and verified.

## Seed blocks

```text
Stage 0 technical reserve: 22900001..22900256
Stage 0 current benchmark subset: 22900001..22900032
Stage 1 formal reserve: begins 22910001; exact consumed interval to be frozen after Stage 0 feasibility only
```

## Formal authorization state

```text
Stage 0 scientificOutcomeGenerated = false by design
Stage 1 formalSelectionAuthorized = false
Stage 1 formalSeedBlockConsumed = false
```

Stage 1 cannot be authorized until the Stage 0 technical artifact is verified and root count / phase coverage / local graph depth are selected only from technical size, runtime, memory, branching and administrative-guard quantities.

## Pending reproducibility artifacts

- Stage 0 technical audit JSON
- Stage 0 technical artifact verification / candidate semantic-hash audit
- selected Stage 1 technical sizing rationale
- Stage 1 frozen domain JSON
- Stage 1 formal spec JSON
- Stage 1 authorization record
- production graph-isomorphism result
- independent verification result
- conditional canonicalization contract/result
