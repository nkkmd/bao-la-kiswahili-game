# SSGTC-STUDY1 — Research Log

## 2026-08-25 — Study start

- Re-fetched remote `main`; SHA confirmed as `9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901`.
- Re-read program-level research state and the required Restricted Endgame, Symmetry, and ORISC documents/results.
- Restored immutable upstream decisions and the ORISC RAW-ONLY downstream contract.
- Created branch `research/state-space-game-tree-complexity` from the exact study-start main SHA.
- Fixed Study ID `SSGTC-STUDY1` and working title `State Space / Game Tree Complexity Study 1`.
- Re-audited `public/engine.js` and representation tooling.
- Confirmed engine initial state explicitly contains `pending:[0,0]`.
- Identified compatibility behavior in current engine that can synthesize missing `pending`. SSGTC therefore hard-rejects missing `pending` before engine entry and validates after every studied transition.
- Frozen study-start firewall, Stage 0 protocol, Stage 1 exploratory boundary, Stage 2 prospective firewall, exact/estimate vocabulary, and independent-verification/materialization responsibilities before scientific outcome generation.
- Added study-owned production and independent raw-state representation modules and Stage 0 technical tooling.
- Opened draft PR #49 from `research/state-space-game-tree-complexity` to `main`; no merge or auto-merge authorized.

## 2026-08-25 — Stage 0 technical acceptance

Canonical GitHub Actions run `32803985808` completed successfully.

```text
decision = SSGTC-STAGE0-PASS
S0-G1..S0-G12 = PASS
scientificInferenceAuthorized = false
maxDepth = 2
uniqueRawStates = 19
transitions = 18
```

Separate-process independent verification passed. Artifact ZIP SHA-256 was checked after retrieval. Stage 0 remained technical-only and was not reused as Stage 1 evidence.

## 2026-08-25 — Stage 1 resource profile frozen

Before Stage 1 outcome generation, numeric graph/tree/runtime/memory/artifact caps were committed. The predeclared Stage 2 feasibility minimum required at least four fully expanded graph depths and four fully expanded tree depths beyond the root with mandatory integrity verification passing.

No estimator or symmetry reduction was authorized.

## 2026-08-25 — Stage 1 non-canonical technical attempts

Three failed executions were retained as technical failures rather than scientifically interpreted or rescued.

### Run `32805036665`

Production stopped because `S1-G9-NO-SYMMETRY` self-inspection falsely matched forbidden strings occurring inside its own regex/check implementation. Other generated scientific patterns were not adopted.

### Run `32805162435`

A first outcome-blind correction still self-matched because the check line itself contained `require(` and forbidden-token regex text. The run remained non-canonical.

### Run `32805259739`

Production passed, but independent verification failed on branching aggregates. A blind structural audit found that raw identity, row/hash binding, BFS reachability, duplicate/transposition accounting, completed-domain hashes, and reporting projection agreed; the mismatch was confined to branching summaries because individually processed states from a partial expansion depth had been included. The preregistration had already required partial layers to be censored.

The correction did not change resource caps, raw identity, expansion semantics, endpoints, or observed target selection. Aggregation was aligned with the existing complete-layer rule.

## 2026-08-25 — Stage 1 accepted exploratory run

Canonical exploratory run `32805576462` passed production and separate-process independent verification.

```text
resultClass = EXPLORATORY-ONLY
technicalAcceptance = PASS
scientificInferenceAuthorized = false
formalReuseInStage2 = false
artifactId = 9548021440
artifactZipSha256 = d95f8be89984480031f6742d63d003f67c6cea8afe7b401d05adca28ee09846d
```

The graph stopped at the frozen `FRONTIER_CAP` while attempting depth-8 parent expansion. Depth-9 rows were recorded as censored/observed only. The completed verified domain included all raw states through depth 8 and all transitions from parent depths 0..7. The tree completed through depth 8.

The preregistered Stage 2 feasibility minimum passed. This decision was based on completion/verification metadata, not on a favorable scientific direction.

## 2026-08-25 — Stage 2 formal specification frozen

A fresh formal target was committed before formal outcome generation:

```text
namespace = SSGTC-S2-FORMAL-2026-08-25-v1
root = standard engine initialState()
raw graph parent depths = 0..7
reachable raw-state depths = 0..8
game-tree depths = 0..8
symmetry reduction = false
canonicalization = false
estimation = false
Stage 1 rows reused = false
```

Formal outcome classification was fixed as exact bounded completion, resource-censored target failure, or technical invalidity. A failed exact enumeration could not be relabeled as an estimate.

## 2026-08-25 — Stage 2 formal execution and independent verification

Canonical run `32805975114`, job `97676042161`, completed production enumeration and full-domain independent re-enumeration successfully.

Formal result:

```text
formalDecision = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
reachable raw states through depth 8 = 24848
transition occurrences from parent depths 0..7 = 25648
game-tree node occurrences through depth 8 = 30941
game-tree edge occurrences through depth 8 = 30940
```

Canonical identities:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

Artifact provenance:

```text
artifactId = 9548146194
artifactZipSha256 = 713e258847a98e9b01866bae248f0986708f8ef90df803157514c63469b52e15
```

The downloaded ZIP was re-hashed after retrieval and matched the GitHub digest. The independent verifier imported neither the production serializer nor production formal runner nor Stage 1 artifact code and independently reran the entire frozen graph and tree domains.

## 2026-08-25 — Study closure preparation

- Materialized `results/STAGE_2_FORMAL_RESULT.json` and formal acceptance checkpoint.
- Finalized `STUDY_1_FINAL_REPORT.md`, `STUDY_1_OVERVIEW.md`, `CURRENT_STATUS.md`, `REPRODUCIBILITY_INDEX.md`, study `README.md`, results index, and decision register.
- Preserved all upstream decisions and the empty validated symmetry transformation set.
- Kept the formal claim strictly bounded: this Study does not claim `Bao state space = 24848`, a full game-tree count, a global growth law, a validated estimator, or symmetry-reduced canonicalization.
- Began repository-wide documentation and CI consistency audit before any merge to `main`.

## Repository interface boundary

GitHub connector operations record remote branch/commit state. No claim is made about an unrelated local worktree. PR #49 remains the integration vehicle and must not be merged until final audit succeeds and the user explicitly authorizes merge.