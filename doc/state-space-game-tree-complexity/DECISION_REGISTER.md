# SSGTC-STUDY1 — Decision Register

All decisions below preserve the prospective order of the study. D001-D019 were fixed before the relevant Stage 0/1 outcomes; closure decisions record later events without changing those earlier rules.

## D001 — Prospective independence

SSGTC-STUDY1 is a new independent prospective study. Completed Bao studies are immutable upstream context, not data to be rescued or re-decided.

## D002 — Baseline

Study-start remote `main` is `9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901`. Work occurs only on `research/state-space-game-tree-complexity` until an explicitly authorized merge.

## D003 — Authoritative raw identity

Identity fields are exactly `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`. `turn` and `reason` are excluded from identity.

Missing `pending` is invalid. No study code may repair it to `[0,0]` before identity validation.

## D004 — Representation invariant

Every accepted state must satisfy `sum(pits)+sum(reserve)+sum(pending)=64`. Validation occurs before and after every studied transition.

## D005 — Symmetry prohibition

Study 1 forbids all symmetry-reduced canonicalization and quotient counting, including seat swap, left/right reflection, compound transforms, SIP T01/T02/T03, ORISC T01/T02/T03, and any assumed geometric symmetry. The validated transformation set available to this study is `[]`.

## D006 — Claim vocabulary separation

The study will not conflate:

- raw rule-state space;
- reachable raw state space;
- bounded reachable raw state space;
- game-tree nodes / generated successor occurrences;
- unique raw states;
- transpositions;
- trajectories;
- historical encountered-state counts;
- observed sample counts;
- estimates.

A global statement of the form `Bao state space = X` is unauthorized absent a complete proof/exhaustive enumeration of that target.

## D007 — Exactness rule

An exact count requires an explicitly frozen target domain, exhausted frontier, no censoring, successful representation gates, deterministic replay, complete artifact verification, and independent agreement. A bounded exact result is exact only inside its frozen domain.

A resource-censored exact attempt cannot be relabeled as an estimate.

## D008 — Stage 0 scope

Stage 0 is technical only. Its shallow graph counts are diagnostics for serializer, replay, duplicate detection, graph cross-check, and materialization integrity; they are not scientific evidence about Bao growth.

## D009 — Independent verification

Production and independent raw serializers must be separately implemented. The independent representation verifier must not import or call the production serializer. Production expansion may be verified by independent reconstruction from emitted raw records, but this must not be described as an independently implemented Bao rule engine unless such an engine is actually implemented.

## D010 — Artifact provenance

Required chain:

```text
scientific raw artifact
  -> verified materializer
  -> repository-facing artifact
  -> post-materialization re-hash and semantic verification
```

Reporting projections never become identity authority.

## D011 — Resource / stopping discipline

Stage 1 and any Stage 2 resource caps must be frozen before the corresponding outcome is inspected. The first applicable cap stops expansion. Partial layers are censored; only fully completed verified layers can support bounded-exact layer claims. Caps may not be lifted after observing a scientifically desirable pattern.

## D012 — Stage separation

Stage 0 fixtures, Stage 1 exploratory corpus, and any Stage 2 formal population use distinct namespaces. Stage 1 rows are never formal Stage 2 evidence.

## D013 — Estimator firewall

No estimator is currently authorized. Any future estimate requires a separately frozen protocol specifying target population, estimator, sampling mechanism, truncation/censoring, coverage assumptions, duplicate handling, uncertainty, and failure conditions before the relevant formal data are observed.

## D014 — Study-level outcome labels

The following labels are reserved and may be used only after their applicable protocol defines and satisfies them:

- `SSGTC-EXACT-WITHIN-FROZEN-DOMAIN`
- `SSGTC-RESOURCE-CENSORED`
- `SSGTC-ESTIMABLE`
- `SSGTC-NON-ESTIMABLE`
- `SSGTC-TECHNICALLY-INVALID`

Stage 0 itself uses only technical PASS/BLOCK language and produces no scientific decision.

## D015 — No-rescue firewall

Prohibited after outcome inspection: changing depth/caps for favorable growth, filtering favorable seeds, changing duplicate identity, dropping raw fields, omitting `pending`, introducing symmetry, relabeling failed exact enumeration as estimate, switching estimator/interval opportunistically, reusing Stage 1 as Stage 2 evidence, or promoting upstream negative/non-estimable diagnostics into positive evidence.

## D016 — Integration

No merge to `main` and no auto-merge are authorized before study completion, documentation audit, CI/reproducibility checks, and explicit user instruction.

## D017 — Stage 0 accepted as technical PASS only

GitHub Actions run `32803985808` passed all frozen `S0-G1` through `S0-G12` gates and the separate-process independent verifier. The accepted label is exactly `SSGTC-STAGE0-PASS`. The diagnostic depth-2 counts remain technical-only and may not be promoted to a Bao-wide complexity claim or reused as Stage 1 observations.

## D018 — Stage 1 numeric resource profile

Before any Stage 1 outcome generation, the following caps were frozen for namespace `SSGTC-S1-EXPLORATORY-2026-08-25-v1`:

```text
graph max depth = 12
graph max unique raw states = 100000
graph max generated edges = 500000
graph max frontier states = 50000

tree max depth = 8
tree max node occurrences = 250000
tree max edge occurrences = 250000

global max wall clock = 600 seconds
global max RSS = 4294967296 bytes
global max uncompressed artifact bytes = 134217728 bytes
```

The first reached cap stops the applicable expansion and partial layers are censored. These caps may not be increased after Stage 1 scientific-pattern inspection.

## D019 — Stage 2 minimum feasibility rule

Stage 2 design may begin only if Stage 1 completes at least four fully expanded graph depths beyond the root and four fully expanded game-tree depths beyond the root, with every mandatory integrity gate passing. Failure of this minimum leaves Stage 2 not authorized; no cap increase or favorable-subset rescue is permitted.

## D020 — Non-canonical Stage 1 technical failures remain sealed

Runs `32805036665`, `32805162435`, and `32805259739` are retained as technical-invalid/non-canonical attempts. The first two failed self-inspection implementation checks. The third showed that branching summaries had included individually processed states from a partial depth, contrary to the pre-frozen complete-layer censoring rule.

No scientific pattern from these runs is used to choose endpoints, caps, or formal claims. The corrective changes were restricted to technical self-checking and alignment of aggregation with the already frozen partial-layer rule.

## D021 — Accepted Stage 1 remains exploratory-only

Run `32805576462` passed production and separate-process independent verification and is the accepted Stage 1 exploratory artifact. Its graph reached the pre-frozen frontier cap while attempting parent depth 8; depth-9 rows are censored observed-only. Raw-state depths 0..8 and transitions from parent depths 0..7 were completely verified, and the tree completed through depth 8.

Stage 1 remains `EXPLORATORY-ONLY`, `scientificInferenceAuthorized=false`, and `formalReuseInStage2=false`. It may support only the preregistered feasibility decision.

## D022 — Stage 2 formal target frozen as bounded depth-8 replication

After the D019 feasibility minimum passed, Stage 2 prospectively froze a fresh standard-root target with:

```text
raw graph parent depths = 0..7
reachable raw-state depths = 0..8
game-tree depths = 0..8
symmetry reduction = false
canonicalization = false
estimation = false
Stage 1 rows reused = false
```

The formal outcome labels were fixed before execution: exact bounded completion, resource-censored completion failure, or technical invalidity. A failed exact attempt could not be relabeled as an estimate.

## D023 — Formal decision

Canonical Stage 2 run `32805975114` completed the frozen target and passed independent full-domain re-enumeration. The formal decision is:

```text
SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

Canonical endpoint values are:

```text
reachable raw states through depth 8 = 24848
transitions from parent depths 0..7 = 25648
game-tree node occurrences through depth 8 = 30941
game-tree edge occurrences through depth 8 = 30940
```

with exact set identities:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

## D024 — Closure boundary

The Stage 2 result is exact only inside the frozen standard-root depth-8 RAW-ONLY domain. The study does not authorize a full Bao state-space count, full game-tree count, global growth law, global transposition ratio, symmetry-reduced count, canonicalization claim, or full-game estimator.

SSGTC-STUDY1 is complete once final documentation consistency and CI audit pass. Any deeper enumeration, full-game estimation, or symmetry-reduced count must use a new prospective study/versioned protocol. Upstream Restricted Endgame, Symmetry, and ORISC decisions remain unchanged.