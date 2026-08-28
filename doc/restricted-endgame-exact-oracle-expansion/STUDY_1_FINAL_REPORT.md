# Restricted Endgame Exact Oracle Expansion Study 1 — Final Report

Updated: 2026-08-28  
Program label: `G2-04`  
Study ID: `REEOE-STUDY1`  
Research generation: **Research Generation 2**  
Formal decision: **`INCONCLUSIVE`**

## 1. Research question

This prospective independent Study asked whether multiple outcome-blind, prospectively selected restricted Bao endgame domains could be proven complete under authoritative RAW state identity and then exactly solved for game-theoretic value, SCC/recurrent structure, distance-to-forced-terminal, all optimal moves, and optimal-move multiplicity.

The Study was designed to require complete forward closure before any domain could be called an exact oracle.

## 2. Representation contract

Authoritative state identity remained:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Excluded:

```text
turn
reason
```

No symmetry reduction, canonicalization, player-swap quotient, left-right quotient, orbit deduplication, or symmetry-reduced graph was used. The validated non-identity transformation set available from upstream G2-03 remained empty.

## 3. Immutable upstream boundaries

Nothing in this Study changes:

- `PEOCR-STUDY1 = INCONCLUSIVE`;
- `SRDR-STUDY1 = INCONCLUSIVE`, including `1040 < 1050` after the Stage 1 firewall;
- `STSCV-STUDY1 = INCONCLUSIVE`, its three candidates `NON-ESTIMABLE`, validated transform set `[]`, and canonicalization `NON-ESTIMABLE`;
- `REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` for its frozen 8-state / 7-edge domain only;
- ORISC Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` and Axis B `NOT-AUTHORIZED-NOT-EXECUTED`;
- `SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`.

The historical REWR 423,733-state candidate remained `ADMIN-CUTOFF` technical history and was not resumed by increasing a cap.

## 4. Stage 0 — technical instrument validation

Stage 0 was technical only.

The prior REWR exact domain was reconstructed as positive control `REEOE-C00-REWR-8STATE-REGRESSION` and reproduced:

```text
states = 8
edges = 7
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Production and independent paths agreed on graph identity, predecessor relation, values, DTF, and all optimal/max-resistance moves. All four frozen corruption controls were detected.

Canonical Stage 0 provenance:

```text
workflowRunId = 33150063023
artifactId = 9677327024
artifactZipSha256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
S0-G1..S0-G12 = PASS
```

This was instrument validation, not fresh G2-04 exact-oracle evidence.

## 5. Stage 1 v1 — technical invalidation

The first fresh development version used a prospectively frozen fresh block. Production development output was generated, but the independent verifier then failed at startup because of an incorrect module path.

Because production output had already been observed, the same evidence was not repaired and rerun.

```text
Stage 1 v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
workflowRunId = 33150429724
same-evidence rerun = not authorized
v1 production-only output eligible for v2/Stage 2 design = false
v1 seed/RAW identities = consumed
```

The invalidated v1 workflow was subsequently converted to an archival stub to prevent repeated production generation on PR updates.

## 6. Stage 1 v2 — fresh development

A new version was prospectively frozen with a fresh non-overlapping block while preserving the v1 structural envelope, resource ceilings, selection order, maximum root count, and acceptance rule.

Fresh identities:

```text
seeds = 24041001..24041512
games = 512
maxPly = 240
```

Root eligibility/selection:

```text
phase = mtaji
winner = null
reserve = [0,0]
houseOwned = [false,false]
pending = [0,0]
represented seeds = 64
both front rows occupied
non-empty pits <= 18
exact legal moves <= 2
selection = first eligible roots by seed, ply, RAW state key
maximum selected roots = 8
```

Per-root closure ceilings:

```text
maximum states = 100000
maximum edges = 500000
maximum move microstates = 1000000
```

Frozen acceptance required:

```text
selected roots >= 4
independently verified complete closures >= 3
full fresh scan/eligible-set/selection agreement
closure classification agreement
```

No retrograde outcome was an allowed Stage 1 endpoint.

## 7. Stage 1 v2 result

Production and independent verification reconstructed the fresh population and selection without disagreement:

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
```

Closure stop classification:

```text
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
COMPLETE = 0
```

Population identities:

```text
allEncounteredRootSetSha256 = 36c8afe8eb06c268c80652d132d5149691b6d689c8f5729d31b05811d0e91107
eligibleRootSetSha256 = 6e73ee17c2cac85a1d122c66b2be36afec67d8c42554518c7ef0f582483fe247
selectedRootSetSha256 = a34918b684e8de06674463e072d36129f36bda5d23dac2200ad24c3363250de8
selectedRootOrderSha256 = 77cd163773d526a49190fc090b3d4c8f9e4ef112b494ee40cc1946dc372bdd69
developmentCoreSha256 = 1d21c1c29355556e1a2ba25c20bf8a29b156b86cc9cbe4216aa243bf16964caf
independentVerificationCoreSha256 = b09c71350f990195d0b1e56ee267a615e11b7bfa90942bdbcb2dcd94db7ea003
```

The independent verifier reached the frozen acceptance evaluation without reporting full-scan, selection, or closure-classification mismatch. It then intentionally failed the workflow because:

```text
selected = 8
complete = 0
required complete >= 3
```

Therefore:

> **Stage 1 v2 decision = `STAGE1-DEVELOPMENT-BLOCKED`**

The workflow did not upload an artifact because the nonzero acceptance failure occurred before the upload step. The repository-facing compact result preserves the run/job/head identities and reconstructed development/verification core hashes.

## 8. Interpretation of the closure stops

The observed stop labels are development/resource classifications only.

- `STATE-LIMIT` means the frozen 100,000-state ceiling was exceeded before closure completion.
- `ADMIN-CUTOFF` means one exact move reached the frozen 1,000,000 move-microstate administrative ceiling; it is not a Bao terminal result.
- `MOVE-NONTERMINATION` records detected deterministic intra-move microstate recurrence under the guard-free transition instrument; it is not automatically a game-level `RECURRENT` or `DRAW` classification.

No partial graph is promoted to an exact oracle.

## 9. Stage 2 — not authorized

Stage 2 was never automatically authorized by Study start or Stage 1 execution.

Because the valid v2 development result failed its prospectively frozen feasibility/acceptance rule, no Stage 2 contract was created or executed:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal domain definitions frozen = 0
formal Stage 2 source freezes = 0
formal Stage 2 authorizations = 0
formal exact domains evaluated = 0
domain-level formal decisions = 0
fresh G2-04 exact oracle = none
```

## 10. No-rescue closure

After the v2 result, the Study did not:

- increase the state, edge, or microstate ceiling;
- add a tighter structural restriction to obtain smaller favorable closures;
- replace roots;
- extend or replace the v2 seed block;
- ignore the `MOVE-NONTERMINATION` case;
- switch to symmetry/canonicalized identity;
- promote near-complete graphs to exact;
- substitute another solver or favorable subset.

Such changes require a new prospective Study/versioned protocol with fresh evidence.

## 11. Formal decision

The Research Generation 2 Study-level closure is:

> **`INCONCLUSIVE`**

Reason: the technical instrument passed, but the prospectively frozen fresh development gate did not establish a feasible set of complete closures under the frozen design. Stage 2 therefore remained unexecuted, so no formal exact-oracle domain decision can be made.

This is a valid fail-closed Research Generation 2 outcome. It is not evidence that exact oracle expansion is impossible in Bao; it is evidence only that this Study's frozen development design did not support authorization of its formal Stage 2.

## 12. Claims not authorized

REEOE-STUDY1 does **not** authorize any claim that:

```text
Bao endgames are unsolvable
all Mtaji closures exceed 100000 states
Bao has a formal draw
MOVE-NONTERMINATION is a game-level draw/recurrent region
all endgame roots have huge closures
no larger exact oracle can exist
symmetry reduction is valid
canonicalization is valid
```

It also does not modify the exact 8-state REWR result.

## 13. Canonical artifacts

Repository-facing canonical records:

- `preregistration/STUDY_START_CONTRACT.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json` — invalidated v1 lineage
- `preregistration/STAGE_1_DEVELOPMENT_AUTHORIZATION.json` — invalidated v1 lineage
- `checkpoints/2026-08-28-stage1-v1-verifier-startup-failure.md`
- `preregistration/STAGE_1_DEVELOPMENT_V2_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_V2_AUTHORIZATION.json`
- `results/STAGE_1_DEVELOPMENT_V2_RESULT.json`
- `checkpoints/2026-08-28-stage1-v2-block-stage2-not-authorized.md`
- `results/STUDY_1_FINAL_RESULT.json`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`

## 14. Future research boundary

A future attempt may prospectively investigate a different endgame structural restriction, different resource contract, or different exact transition domain. It must be a new independent Study/versioned protocol, may use REEOE-STUDY1 only as prior feasibility/resource information, and may not change this `INCONCLUSIVE` closure.
