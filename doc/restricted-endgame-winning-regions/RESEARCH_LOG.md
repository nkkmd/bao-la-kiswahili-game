# RESEARCH_LOG — Restricted Endgame / Winning Regions Study 1

## 2026-08-24 — Study initiation

- Re-read current `main`; baseline fixed at `626480507710e0095ef8aec6a53c3e4e0318fa4f`.
- Confirmed research sequence Restricted Endgame / Winning Regions → Symmetry / Isomorphic Positions → State Space / Game Tree Complexity.
- Recovered runtime state, legal move, move application and terminal behavior from `public/engine.js` and tests.
- Confirmed `MAX_RELAY=512` is an implementation safety guard, not a normative Bao terminal rule.
- Confirmed no intrinsic formal draw/repetition state; prior max-ply draw labels are administrative.
- Chose witness-reachable Mtaji forward closure and raw-state identity; symmetry reduction prohibited.
- Opened `research/restricted-endgame-winning-regions` and Draft PR #38.

## 2026-08-24 — Stage 0 guard-free semantics and witness scan

- Added generic synthetic retrograde fixtures.
- Added guard-free Mtaji move executor separating `MOVE-NONTERMINATION` and `ADMIN-CUTOFF` from game outcomes.
- Added historical witness generation/replay and complete raw forward closure enumeration.
- Technical seed block `22800001..22800256` produced 3464 unique eligible Mtaji roots.
- Original non-empty cap ≤14 yielded no candidate; no scientific outcome was generated.
- Re-froze v2 structural grid from outcome-blind root distributions only.

## 2026-08-24 — Stage 0 v2 matrix and independent graph verification

- Frozen 36-profile matrix selection rule executed.
- Selected root `fc1e124...` under purely technical criteria.
- Complete closure: 8 states / 7 edges / maximum 10 move microsteps.
- Added separate legal-move, transition, serialization and closure implementation.
- Independent reconstruction matched full state count, edge count, state-set hash and transition-set hash.

## 2026-08-24 — One-shot Stage 0 v3 expansion

- Prospectively tested one larger technical candidate before Stage 1 freeze.
- Reached 423,733 states / 426,938 edges.
- Encountered `ADMIN-CUTOFF` at 1,000,000 move microsteps.
- Classified as technical infeasibility, not draw/loss.
- Applied pre-frozen fallback to independently verified v2 domain.
- No additional Stage 0 cap expansion authorized.

## 2026-08-24 — Stage 1 solver tooling

- Production retrograde changed to synchronous waves so DTF is enumeration-order independent.
- Terminal base cases separated as `TERMINAL + absoluteWinner`.
- Independent retrograde implemented using predecessor propagation and unresolved-successor counting.
- Production/independent tablebase tooling matched synthetic and technical fixtures on values, DTF, optimal moves and SCCs.

## 2026-08-24 — Stage 1 freeze and pre-generation correction

- Frozen 8-state domain and initial exact spec.
- Issued authorization v1, but before any scientific run a manual contract inspection found a resource-limit field-name mismatch between spec and runner/verifier.
- Revoked authorization v1 before any outcome generation.
- Corrected only the two field references.
- Re-ran all technical fixtures successfully.
- Re-froze source hashes; domain, classification, DTF and endpoint unchanged.
- Issued authorization v2.

## 2026-08-24 — Scientific exact solution

Scientific workflow run `32702596730` executed only after corrected authorization v2.

Production result:

```text
states = 8
edges = 7
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Frozen root:

```text
Player 0 to move
WIN
absoluteWinner = 0
DTF = 3
unique optimal move = capture:mtaji:1:4:left:::false
```

Production result SHA-256:

```text
e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
```

## 2026-08-24 — Independent exact verification

Independent implementation reconstructed and re-solved the full domain.

All checks passed:

```text
rootKeys
stateCount
edgeCount
stateSetSha256
transitionSetSha256
counts
fullStateRows
recurrentSccs
solutionSha256
```

Verification result SHA-256:

```text
87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
```

Formal decision fixed as:

> `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`

No full-Bao, all-Mtaji, all-endgame, no-cycle, engine-evaluation or symmetry claim is authorized.
