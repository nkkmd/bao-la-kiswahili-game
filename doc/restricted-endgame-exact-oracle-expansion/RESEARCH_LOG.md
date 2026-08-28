# REEOE-STUDY1 — Research Log

## 2026-08-28 — Repository audit and Study start

Read-only repository audit completed before G2-04 modifications.

```text
expected prior main = aba61596e6440e9d54be6f1e9520f65e983000b3
observed remote main = aba61596e6440e9d54be6f1e9520f65e983000b3
match = true
open PRs = 0
```

Residual Research Generation 2 branches had zero commits ahead of `main`; no competing active/unmerged G2 research was found.

## 2026-08-28 — Upstream contract reconstruction

Immutable boundaries were reconstructed and frozen:

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primary null / 1040 < 1050
STSCV-STUDY1 = INCONCLUSIVE / T01-T03 NON-ESTIMABLE / transform set []
REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN for 8 states / 7 edges only
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

## 2026-08-28 — Formal identity and Study-start freeze

```text
Program = G2-04
Study ID = REEOE-STUDY1
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Branch = research/g2-04-restricted-endgame-exact-oracle-expansion
PR = #70
```

Initial Stage IDs:

```text
REEOE-S0-TECHNICAL-2026-08-28-v1
REEOE-S1-DEVELOPMENT-2026-08-28-v1
REEOE-S2-FORMAL-2026-08-28-v1
```

Authoritative identity was frozen as `pits,reserve,houseOwned,player,phase,winner,pending`; `turn/reason` excluded. Symmetry/canonicalization/quotient counting prohibited.

## 2026-08-28 — Stage 0 implementation audit

The existing REWR exact-analysis lineage was inspected. Both old production/independent serializers contain a compatibility fallback that can synthesize `pending=[0,0]` when missing. G2-04 did not alter historical helpers; instead a strict G2-04 validation layer was implemented on both production and independent paths to reject missing `pending` before identity use.

A production Stage 0 runner, independent verifier, four corruption controls, and dedicated workflow were added.

One simple production-runner root-result reference typo was found and corrected before any Stage 0 output was generated. No scientific definition or fixture changed.

## 2026-08-28 — Stage 0 technical PASS

Canonical workflow:

```text
run = 33150063023
job = 98779736420
artifact = 9677327024
artifact ZIP SHA-256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
```

Result:

```text
8 states / 7 edges
TERMINAL=4 WIN=3 LOSS=1 RECURRENT=0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
S0-G1..S0-G12 = PASS
negative controls detected = 4/4
```

Reconstructed terminal rows preserved `pending` and all eight represented 64 seeds. Stage 0 remained technical-only.

## 2026-08-28 — Stage 1 v1 prospective freeze and authorization

Fresh development block:

```text
seeds = 24040001..24040512
games = 512
maxPly = 240
```

Frozen structural/resource envelope:

```text
Mtaji / reserve [0,0] / houses false / pending [0,0] / 64 represented seeds
nonEmptyPitCount <= 18
exactLegalMoveCount <= 2
maximum selected roots = 8
states/root <= 100000
edges/root <= 500000
move microstates <= 1000000
minimum complete closures = 3
```

Retrograde values, DTF, cycles, optimal moves, and winner identity were prohibited development-selection inputs.

## 2026-08-28 — Stage 1 v1 fail-closed technical invalidation

Workflow run `33150429724` completed production development, then the independent verifier failed at startup because it referenced `../public/engine.js` from the wrong relative location.

Because production output had already been generated, the same evidence was not repaired and rerun.

```text
Stage 1 v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
v1 outputs eligible for later design = false
v1 identities consumed = true
```

The v1 workflow was later converted to an archival stub to prevent duplicate production generation.

## 2026-08-28 — Stage 1 v2 prospective freeze

A fresh version was defined without relaxing the v1 structural/resource/acceptance design.

```text
Stage = REEOE-S1-DEVELOPMENT-2026-08-28-v2
seeds = 24041001..24041512
games = 512
maxPly = 240
```

The independent verifier was strengthened to regenerate all 512 trajectories, all encountered RAW roots, eligible roots, first-eight selected roots, and each closure before acceptance evaluation.

Source blobs were frozen and explicit v2 execution authorization issued. Stage 2 remained unauthorized.

## 2026-08-28 — Stage 1 v2 execution

Canonical workflow:

```text
run = 33151053940
job = 98782876984
workflow head = a44a825c815b2182091ba5e9ff147b1ae8ec395d
```

Production result:

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
```

Closure stops:

```text
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

The independent verifier independently reproduced the full population/selection and all selected closure classifications. It reached the frozen acceptance check and exited because `complete=0 < 3`.

```text
Stage 1 v2 = STAGE1-DEVELOPMENT-BLOCKED
```

The workflow did not upload an artifact because the frozen acceptance failure occurred before the upload step.

Canonical identities:

```text
allEncounteredRootSetSha256 = 36c8afe8eb06c268c80652d132d5149691b6d689c8f5729d31b05811d0e91107
eligibleRootSetSha256 = 6e73ee17c2cac85a1d122c66b2be36afec67d8c42554518c7ef0f582483fe247
selectedRootSetSha256 = a34918b684e8de06674463e072d36129f36bda5d23dac2200ad24c3363250de8
selectedRootOrderSha256 = 77cd163773d526a49190fc090b3d4c8f9e4ef112b494ee40cc1946dc372bdd69
developmentCoreSha256 = 1d21c1c29355556e1a2ba25c20bf8a29b156b86cc9cbe4216aa243bf16964caf
independentVerificationCoreSha256 = b09c71350f990195d0b1e56ee267a615e11b7bfa90942bdbcb2dcd94db7ea003
```

## 2026-08-28 — Stage 2 non-authorization

The frozen Stage 1 v2 feasibility rule was not satisfied. No cap increase, domain shrinkage, root replacement, seed extension, solver substitution, partial-closure promotion, or symmetry/canonicalization rescue was performed.

```text
REEOE-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
formal Stage 2 domains = 0
fresh G2-04 exact oracle = none
```

## 2026-08-28 — Study closure

The Study-level formal decision was frozen as:

```text
INCONCLUSIVE
```

This closure states only that this Study's frozen development design did not establish the complete-closure feasibility required to authorize Stage 2. It does not imply that Bao endgames or other future restricted domains are unsolvable.

Canonical closure artifacts were created in `results/`, `STUDY_1_FINAL_REPORT.md`, `CURRENT_STATUS.md`, and the decision/reproducibility records.
