# ORISC-STUDY1 — Stage 0A Technical / Semantic / Provenance Audit

Updated: 2026-08-25  
Status: **COMPLETE / TECHNICAL-ONLY / NO FORMAL STAGE 1 DECISION**

## 1. Scope

Stage 0A reconstructed source semantics and provenance needed to freeze `ORISC-STUDY1`. It did not issue the formal Oracle Representation Integrity decision and did not evaluate any nontrivial symmetry candidate.

## 2. Immutable upstream boundary

Unchanged throughout this audit:

```text
REWR-STUDY1 formal decision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
REWR frozen domain          = 8 states / 7 edges
REWR stateSetSha256         = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
REWR transitionSetSha256    = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
REWR solutionSha256         = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15

SIP-STUDY1                 = COMPLETED
SIP formal closure          = 0 validated / 0 rejected / 5 NON-ESTIMABLE
SIP corrected v2            = NOT-AUTHORIZED-NOT-EXECUTED
```

No upstream result row was edited.

## 3. Source / representation inventory

Current rule engine Git blob:

```text
public/engine.js
2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
```

Relevant existing REWR implementation Git blobs at current main:

```text
tools/experiments/lib/restricted-endgame-transition.js
7ca35ef03ecad102b9a9e1fa6c4767f72d409961

tools/experiments/lib/restricted-endgame-independent-verifier.js
94a79d140803802acf607bbaf02d570aa3b6f362

tools/experiments/lib/restricted-endgame-tablebase.js
f41ef2538b41e8ca9ed50f79cdab4bfa910989ef

tools/experiments/run-restricted-endgame-stage1-exact.js
f47683ce17ebf39f538134d2af020b29d8b50392
```

Frozen REWR domain Git blob:

```text
doc/restricted-endgame-winning-regions/preregistration/STAGE_1_DOMAIN.json
8453290d4ab0b94b4d11a7022014d0d9325303ce
```

Repository-facing exact result Git blob:

```text
doc/restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json
811eb78806813d236dc91c776e1e408d4feac22e
```

New ORISC Stage 0A production serializer Git blob:

```text
tools/experiments/lib/orisc-representation-production.js
d11ff20485c7fa358c4196d48d686e52e5171697
```

The independent serializer is separately implemented and does not import the production serializer.

## 4. Raw identity and strict-presence rule

Stage 0A re-derived the raw identity field set:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Excluded from identity:

```text
turn
reason
```

A key Stage 0A hardening decision is that the new ORISC serializer does **not** silently default a missing `pending` field to `[0,0]`. The field must be explicitly present and valid. This does not change valid engine-state keys; it prevents missing representation data from being silently normalized during downstream reconstruction.

## 5. Seed conservation semantics

The prospective represented-seed quantity is:

```text
sum(pits) + sum(reserve) + sum(pending)
```

For standard states descended from the standard 64-seed initial state, the required total is 64.

Current engine terminal-capture semantics remove captured seeds from the opponent front row and, if that capture empties the opponent front, add the removed quantity to `pending[player]` before assigning the winner.

## 6. Oracle-independent synthetic fixtures

CI executed dedicated synthetic fixtures before reading the upstream oracle result.

Passed checks:

```text
production / independent canonical serialization equality
production / independent key equality
pending changes raw identity
turn does not change raw identity
reason does not change raw identity
missing pending is rejected
terminal capture transfers removed seed count into pending
terminal capture preserves represented seed total 64
front-empty finish without removed capture does not invent pending
houseChoice stop/use are distinct move identities
```

Fixture success is instrumentation readiness only.

## 7. Original REWR workflow recovery

The immutable original scientific workflow was recovered read-only:

```text
workflow run = 32702596730
artifactId   = 9511074442
production resultSha256
  e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
independent verification resultSha256
  87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
```

The new Stage 0A workflow downloaded this artifact directly with read-only Actions permission; it did not use the repository-facing rows as the original source.

## 8. Cross-artifact technical result

Stage 0A CI:

```text
runId      = 32751644956
jobId      = 97509741453
artifactId = 9529232934
artifact ZIP SHA-256
           = ceeeeb7190a17784708d8e20f7d7d5a71910add8417b1effb2c561864b5d41af
audit JSON SHA-256
           = 290aec0eab51226695a1f4d0246cd40b5366a6ffa2ec107646f6cdb7b7fb1914
conclusion = success
```

Original production:

```text
rows                         = 8
represented seed totals      = {64}
serializer disagreements     = 0
production/independent key disagreements = 0
stored-key mismatch rows     = 0
```

Original independent result:

```text
rows                         = 8
represented seed totals      = {64}
serializer disagreements     = 0
production/independent key disagreements = 0
stored-key mismatch rows     = 0
```

Production and independent original full rows are exactly equal.

Repository-facing result:

```text
rows                         = 8
represented seed totals      = {63,64}
serializer disagreements     = 0
production/independent key disagreements = 0
stored-key mismatch rows     = 3
```

The state-key sets are equal across original production, original independent, and repository-facing artifacts.

## 9. Exact bounded discrepancy

Exactly three repository-facing rows differ from the original workflow rows:

```text
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
```

For all three:

```text
identity-field difference = pending only
original pending          = [1,0]
repository pending        = [0,0]
original represented seeds = 64
repository represented seeds = 63
outcome-field differences = none
```

No difference was observed in status, absoluteWinner, DTF, optimal-move keys, recurrent-move keys, SCC id, or cyclic-SCC flag for those rows.

This Stage 0A observation therefore localizes the known representation discrepancy to the workflow-artifact -> repository-facing row boundary, not to a disagreement between the original production and independent exact solvers.

## 10. Materialization provenance gap

The repository-facing result first appears in commit:

```text
eb6052679e94de62bacec0eebe13758c7e85638d
```

That commit adds the result together with closure documentation. No result-materialization or artifact-to-repository conversion script is added in the same commit, and no repository mechanism has yet been found that establishes exactly how the three `pending` values changed.

Therefore the mechanism is recorded as:

```text
UNRESOLVED-PROVENANCE-GAP
```

It is **not** labeled manual corruption, serializer corruption, solver corruption, or any other specific cause without evidence.

## 11. Independent implementation boundary for Stage 1

Formal Stage 1 must use two separately implemented tracks with no shared helper for:

```text
raw-state projection
stable serializer
state key
exact Mtaji legal move generation
guard-free transition
closure traversal
terminal captured/pending accounting
```

The current Stage 0A serializer pair satisfies the serializer-level independence requirement. Formal transition/closure tracks still require dedicated ORISC implementations or a prospectively documented source-independence contract before Stage 1 authorization.

## 12. Stage 2 pre-outcome proposal

Before any Stage 1 formal outcome, Stage 0A independently re-derived:

```text
ORISC-T01-SEAT-SWAP-LOCAL
ORISC-T02-LR-MTAJI-HOUSELESS
ORISC-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
ORISC-C00-IDENTITY
ORISC-C01-LR-NO-DIRECTION-FLIP
```

The proposed fresh Stage 2 seed block is:

```text
23110001..23110128
```

A repository search found no existing use of `23110001`. Final collision/no-overlap checks remain part of Stage 0B freeze.

Full proposal: `STAGE_0A_CANDIDATE_POPULATION_PROPOSAL.md`.

## 13. Stage 0A completion decision

All Stage 0A completion conditions are satisfied:

```text
source/provenance inventory                 PASS
workflow/repository discrepancy bounded     PASS
synthetic representation fixtures           PASS
serializer independence documented          PASS
candidate/population proposal pre-outcome   PASS
formal Stage 1 outcome generated            NO
nontrivial symmetry decision generated      NO
```

Stage 0A is therefore **COMPLETE**.

This completion does not authorize Stage 1. The next step is Stage 0B machine-readable freeze, source hashing, independent transition/closure implementation binding, and separate Stage 1 authorization.
