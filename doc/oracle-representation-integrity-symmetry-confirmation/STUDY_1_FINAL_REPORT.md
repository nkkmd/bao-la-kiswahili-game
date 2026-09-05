# Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1 — Final Report （結論）

## 日本語での結論と読み方

Axis AはORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED、Axis BはNOT-AUTHORIZED-NOT-EXECUTEDである。upstream REWR / SIPの既存formal decisionは変更しない。

以下には、Study closure時に固定した英語の詳細記録が含まれる。canonical decision token、数値、seed、hash、実行ID、authorization、evidence boundaryを再解釈しないため原文を保持している。初めて読む場合は`STUDY_1_OVERVIEW.md`と`CURRENT_STATUS.md`を先に参照する。

Updated: 2026-08-25  
Study ID: `ORISC-STUDY1`  
Status: **COMPLETED**

## 1. Research question （日本語の要点）

This prospective independent study separated two questions that had previously become entangled in downstream symmetry validation:

1. **Axis A — Oracle Representation Integrity:** whether engine-semantic raw state, terminal captured/pending accounting, canonical raw serialization, SHA-256 state identity, reconstruction of the immutable Restricted Endgame graph, and repository-facing oracle rows form one exact and independently reproducible representation contract.
2. **Axis B — Independent Symmetry Confirmation:** only if Axis A passed, whether a prospectively frozen set of nontrivial Bao state/move transforms could be confirmed by exact move-equivariance, transition commutation, graph isomorphism, terminal/winner semantics, inverse properties, and downstream canonicalization gates.

Axis B was explicitly conditional. It was not permitted to repair or bypass an Axis A failure.

## 2. Immutable upstream boundary （適用範囲と制限）

This study does not alter either completed upstream study.

### Restricted Endgame / Winning Regions Study 1 （日本語の要点）

Remains:

```text
studyId = REWR-STUDY1
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

The existing state/edge set, exact values, DTF, optimal moves, and formal decision are unchanged.

### Symmetry / Isomorphic Positions Study 1 （日本語の要点）

Remains:

```text
studyId = SIP-STUDY1
studyStatus = COMPLETED
formalDecision = NON-ESTIMABLE
validated = 0
rejected = 0
nonEstimable = 5
v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No previous SIP candidate is rescued, validated, or rejected by this study.

## 3. Representation layers （識別と表現）

The study treated the following as distinct objects:

```text
engine-semantic state
serialized raw rule state
canonical SHA-256 stateKey
original workflow production row
original workflow independent row
repository-facing stored oracle row
freshly reconstructed raw state
reporting/display representation
```

Nominally describing the same Bao position is insufficient for raw identity. Exact field equality is required under the frozen contract.

## 4. Frozen raw identity contract （識別と表現）

Raw state identity includes exactly:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

and excludes:

```text
turn
reason
```

`pending` must be explicitly present. The ORISC serializers do not silently replace a missing `pending` field with `[0,0]`.

Canonical state identity is SHA-256 over a recursively stable JSON-compatible serialization with lexicographically sorted object keys and preserved array order.

Exact move identity includes:

```text
type
phase
row
index
direction
side
houseChoice
houseTwo
```

so distinct Namua `houseChoice` variants cannot collapse into one move identity.

## 5. Frozen seed-conservation semantics （日本語の要点）

The represented-seed quantity was fixed before the formal result as:

```text
sum(pits) + sum(reserve) + sum(pending)
```

For the standard 64-seed game ancestry used here, the required total is exactly 64.

Current engine semantics show that when a capture empties the opponent front row, the captured quantity removed from the board is added to `pending[player]` before winner assignment. Thus terminal `pending` is part of raw rule-state accounting, not merely a display field.

## 6. Stage 0A — Technical / semantic / provenance audit （Stageの記録）

Stage 0A was explicitly technical-only and generated no formal ORISC decision.

The original REWR scientific workflow artifact was recovered read-only:

```text
workflow run = 32702596730
artifactId = 9511074442
artifact ZIP SHA-256 = 7da2a3f46745c18f4aa8896bc6a576b5d56b490b1461a4def3364183b047c023
production resultSha256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
independent verification resultSha256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
```

Both original files contained exactly eight state rows. Production and independent full rows were exactly equal. Every original state represented 64 seeds.

For the three terminal state keys previously implicated by SIP diagnostics:

```text
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
```

the original workflow rows contained:

```text
pending = [1,0]
represented seeds = 64
```

while the later repository-facing `STAGE_1_EXACT_RESULT.json` contained `pending=[0,0]`, representing 63 seeds.

The repository result first appears in commit `eb6052679e94de62bacec0eebe13758c7e85638d`. No artifact-to-repository materialization script was added in that commit. The precise mechanism by which the three values changed is therefore recorded as:

```text
UNRESOLVED-PROVENANCE-GAP
```

It is not labeled manual corruption, solver corruption, serializer corruption, or another more specific mechanism without evidence.

Dedicated oracle-independent synthetic fixtures also passed for:

- production/independent serializer agreement;
- `pending` affecting raw identity;
- `turn` / `reason` exclusion;
- rejection of missing `pending`;
- terminal capture transfer into `pending`;
- 64-seed conservation;
- no invented `pending` on a non-capture front-empty terminal path;
- exact distinction of `houseChoice=stop/use` move identities.

Stage 0A technical CI:

```text
runId = 32751644956
jobId = 97509741453
artifactId = 9529232934
artifact ZIP SHA-256 = ceeeeb7190a17784708d8e20f7d7d5a71910add8417b1effb2c561864b5d41af
```

## 7. Pre-outcome symmetry candidate freeze （結果）

Before any ORISC Stage 1 formal outcome, the conditional Stage 2 contract was frozen:

```text
candidateContractSha256 = 6509dc18553d968437d87f7522cacebb4b66f13f15469240075964b72f1c8796
```

Controls:

```text
ORISC-C00-IDENTITY
ORISC-C01-LR-NO-DIRECTION-FLIP
```

Scientific candidates:

```text
ORISC-T01-SEAT-SWAP-LOCAL
ORISC-T02-LR-MTAJI-HOUSELESS
ORISC-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

Fresh conditional Stage 2 population was also frozen before Stage 1 outcome:

```text
seeds = 23110001..23110128
maximum trajectory ply = 160
roots per stratum = 12
local expansion depth = 4
strata = namua / mtaji / mtaji-houseless
```

No Stage 1 result was available when these definitions were fixed.

Unlike SIP-STUDY1, this study proposed only three candidate-level decisions. T01 would require all prospectively required Namua, Mtaji, and exact-oracle scopes to pass rather than treating a pooled scope as a separate fourth-style outcome.

## 8. Stage 0B — Technical prefreeze （Stageの記録）

Stage 0B deliberately did **not** evaluate repository-facing oracle semantic gates. Its purpose was to establish that the formal machinery could independently reconstruct the frozen raw graph before authorization.

Final workflow-bound prefreeze:

```text
stageId = ORISC-STAGE0B-PREFREEZE-2026-08-25-v2
runId = 32752858110
jobId = 97513606755
artifactId = 9529690660
artifact ZIP SHA-256 = 6305da6b61c1eaa296ca65696c51f81a0e2eb62072dc5aa1bae4e7c9555e06ec
result JSON SHA-256 = ce37364ad472903bc6449ff402b527e2a5a193a28f2196c3ec2b2ebc1756d581
```

Both tracks independently reproduced:

```text
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
represented seed totals = {64}
```

Production and independent state rows and edges were exactly equal.

A first spec freeze was validated but was replaced **before authorization and before outcome generation** solely to bind the formal GitHub Actions orchestration workflow by byte hash. No endpoint, population, identity rule, gate, candidate, seed, or decision rule changed.

Final spec identity:

```text
specSha256 = 5a766ec900c1f76c5b832f2c76153b9426b3970316b31806d377c497d1e585e5
formal workflow SHA-256 = 0f5e5da13e84e9511a477a8fdfc01133e3a36cc08e908e16a31b71517e3b429f
```

## 9. Stage 1 authorization （Stageの記録）

Authorization was issued only after final source-hash validation:

```text
authorizationId = ORISC-S1-REPRESENTATION-INTEGRITY-AUTH-2026-08-25-v1
authorizationSha256 = b8bc9c65510c2f4ea0909e269af7945d7ae5d3d32b595224519b1549a275325e
```

The authorization explicitly permitted only Axis A Stage 1 and explicitly did not authorize Stage 2.

## 10. Formal Stage 1 gates （Stageの記録）

The prospective gates were:

```text
A-G1  frozen source / candidate-contract identity
A-G2  frozen root witness reconstruction
A-G3  production / independent complete raw graph equality
A-G4  immutable graph identity
A-G5  canonical serialization / state-key equality
A-G6  64-seed conservation
A-G7  terminal winner + captured/pending accounting
A-G8  repository stored-row re-hash
A-G9  repository stateKey -> reconstructed raw-state binding
A-G10 repository transition successor binding
A-G11 IDENTITY positive control across all required representation layers
A-G12 production / independent equality
```

All applicable semantic comparisons were exact; no approximate pass threshold was permitted.

Decision rule:

- all A-G1..A-G12 PASS -> `ORACLE-REPRESENTATION-INTEGRITY-CONFIRMED`;
- A-G12 PASS with at least one interpretable mandatory gate failure -> `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`;
- cross-implementation disagreement, incomplete reconstruction, source drift, or technical failure -> `NON-ESTIMABLE`.

## 11. Formal Stage 1 result （結果）

Authorized workflow:

```text
runId = 32753073798
jobId = 97514309075
artifactId = 9529771157
artifact ZIP SHA-256 = 13844208eeaaa4ae8eedc35724a0d71ed043f982cfaaa48cf1d692133d74d6e8
production resultSha256 = 03b112ba6dc1b79d65e4bfd3dbba603f0a20d0f3e16ab9d98a37e9bf50f6afe9
independent verification resultSha256 = 3501a65b4920e9ae44f55e2a46da370f750cbac01c1293398dc7b020cdae4bcf
```

Formal decision:

> **`ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`**

Gate result:

```text
A-G1  PASS
A-G2  PASS
A-G3  PASS
A-G4  PASS
A-G5  PASS
A-G6  PASS
A-G7  PASS
A-G8  FAIL
A-G9  FAIL
A-G10 PASS
A-G11 FAIL
A-G12 PASS
```

### What passed （日本語の要点）

The raw graph itself was reconstructed exactly and independently:

```text
states = 8
edges = 7
production/independent graph equality = PASS
production/independent serializer equality = PASS
all reconstructed represented seed totals = 64
terminal accounting mismatches = 0
repository transition mismatches = 0
```

Thus the study did **not** find a disagreement in the frozen raw graph identity, legal successor graph, or terminal captured/pending semantics generated from the frozen root.

### What failed （日本語の要点）

Exactly three immutable repository-facing terminal rows failed both the stored-row re-hash gate and reconstructed raw-state binding gate.

```text
stored key
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
repository re-hash
7849cf1069ca9c966d111bb83a1fb36915abedb4a8533083778fb67f71a39a70

stored key
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
repository re-hash
cc5d25496bb7cdc92ace7ec2d3ad92f60647fc72adb3a634189451ee48bdd3f8

stored key
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
repository re-hash
eb1a9cae73ecfa295eb51b5e476484a00a4f80ebd2bb1c2d2e42eb78106372f0
```

For all three:

```text
repository represented seeds = 63
reconstructed represented seeds = 64
identity-field difference = pending only
```

Because repository reconstruction is part of the prospectively frozen IDENTITY control, `A-G11=FAIL`.

Production and independent implementations agreed on the exact affected rows, exact gate labels, transition counts, terminal accounting, and identity-control decision, so:

```text
A-G12 = PASS
```

This is therefore an interpretable formal representation-integrity failure rather than a technical non-estimability result.

## 12. Why this does not invalidate REWR-STUDY1 （日本語の要点）

`REWR-STUDY1` asked whether the frozen restricted graph could be exactly solved and independently verified. Its scientific workflow production and independent files agreed, and this new study again reconstructs the same raw 8-state/7-edge graph exactly.

`ORISC-STUDY1` asks a different endpoint: whether the later repository-facing state-row representation is itself a valid raw-state reconstruction anchor for downstream transformation validation.

Failure of the latter does not retroactively change the former.

Accordingly:

```text
REWR-STUDY1 formal decision remains EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
REWR state/edge/value/DTF/optimal-move claims remain unchanged
```

No upstream row was rewritten to make ORISC pass.

## 13. Axis B — Independent Symmetry Confirmation （日本語の要点）

The frozen authorization rule required all of:

```text
Stage 1 decision = ORACLE-REPRESENTATION-INTEGRITY-CONFIRMED
A-G11 IDENTITY = PASS
A-G12 production/independent equality = PASS
separate Stage 2 authorization
```

Observed:

```text
Stage 1 = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
A-G11 = FAIL
A-G12 = PASS
```

Therefore:

> **Axis B status: `NOT-AUTHORIZED-NOT-EXECUTED`**

No formal nontrivial candidate evaluation was run.

Consequently this study produces:

```text
new symmetry candidates validated = 0
new symmetry candidates rejected = 0
new symmetry candidates declared non-estimable = 0
```

The zeros do not mean the candidates failed. They mean the conditional scientific stage was never authorized.

The old SIP fresh zero-mismatch diagnostics remain old diagnostic evidence only and are not imported as ORISC formal findings.

## 14. Stage 3 / downstream authorization （Stageの記録）

Because no valid Stage 2 symmetry confirmation exists:

```text
validated symmetry transformation set = empty
canonicalization = NOT AUTHORIZED
symmetry group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
raw state identity = authoritative downstream representation
```

State Space / Game Tree Complexity research may now proceed **raw-only**, without any symmetry reduction derived from SIP or ORISC.

A future symmetry study would require a new prospective representation source contract that does not bypass this closed result. It cannot simply rewrite the old repository rows and relabel the current study as passed.

## 15. Study-level closure （結論）

`ORISC-STUDY1` is complete with:

```text
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
Stage 3 canonicalization authorization = NO
validated symmetry transformation set = empty
raw state identity = authoritative downstream representation
```

## 16. Final interpretation boundary （結論）

This study supports the following statement:

> The frozen REWR 8-state raw graph can be independently reconstructed with exact graph identity, 64-seed accounting, and consistent terminal semantics. However, the immutable repository-facing oracle rows do not satisfy the prospectively frozen raw-state re-hash and reconstruction-binding contract for three terminal rows, so that repository representation is not confirmed as a downstream transform-validation anchor under ORISC-STUDY1.

This study does **not** support any of the following:

- `REWR-STUDY1` was invalid or incorrectly solved;
- its exact value or DTF results should be corrected;
- `SIP-STUDY1` should be reopened or rescued;
- T01/T02/T03 are false symmetries;
- Bao has no useful symmetry;
- a corrected oracle artifact has been authorized;
- canonicalization or symmetry-reduced state counting is authorized.
