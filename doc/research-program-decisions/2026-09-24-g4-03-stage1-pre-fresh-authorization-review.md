# G4-03 / LWSRT-STUDY1 — post-Stage0 / pre-fresh Stage 1 authorization review

Date: 2026-09-24  
Research branch: `research/g4-03-width-ranking-transfer`  
Pre-review branch HEAD: `64975e3016a36b7e621f979bbd1d571398219e55`

## Decision

**`LWSRT-STUDY1-STAGE1-AUTHORIZED-LOCAL-ONCE`**

This decision authorizes exactly one Stage 1 development execution under the already frozen protocol. It does not authorize Stage 2, formal scientific inference, public-AI changes, or main integration.

## Gate review

### PASS — Stage 0

`LWSRT-S0-TECHNICAL-2026-09-24-v1` is complete with `STAGE0-PASS` from workflow run `35947479946`. Canonical repository result blob: `772e39a4b4e7225b3565c3c8701e36cc5fbd6978`.

### PASS — preregistration remains frozen

- protocol blob: `acc74df015970e6b5fe1b89656844daa6d9f485c`
- machine-readable spec blob: `cd955019972b629b03ea210ff6f430ce4b83e502`
- Stage 1 seed block remains exactly `40312001..40312768` / 768 slots
- target remains `8 HIGH + 8 LOW` for each `policy × root-family × phase`
- no seed extension, root replacement, threshold relearning, endpoint substitution, or subgroup rescue is authorized

### PASS — identity-only freshness firewall

Firewall blob: `066322fe3b273fd88590f2d367c8526a5659835a`.

The firewall binds:

- G3-07 Stage 1 repository identity-only material, 48 rows;
- G3-07 Stage 2 canonical artifact `9879091983` and identity-only canonical digests for 72 selected rows;
- G4-01 Stage 1R SILGM recovery bundle `10517090411`, with canonical digests for 768 source seeds, 766 unique full trajectories, and 665 unique non-null RAW roots;
- complete quarantine of the G4-01 interrupted SILGM namespace and Stage 1R reserve namespace.

G4-01 Stage 1R opening-prefix hashes are unavailable in the canonical recovery source bundle. This review does not infer or claim non-overlap for that unavailable identity class. The protocol expressly permits unavailable identity classes to remain non-audited provided non-overlap is not claimed.

### PASS — scientific blindness of Stage 1

Stage 1 may output only support, endpoint-definedness counts, production/independent exactness, resource readiness, and identity-manifest hashes. It must not output or retain HIGH-vs-LOW risk difference, effect direction, p-value, formal generalization/counterexample decision, or any threshold re-learning signal.

### PASS — execution boundary

Heavy fresh scientific generation on GitHub Actions remains prohibited. Stage 1 must execute locally from the frozen branch state. Before the first fresh seed read, runtime materialization must reproduce the frozen firewall counts/digests exactly; otherwise execution fails closed and consumes no fresh seed.

## Authorized access

Exactly one scientific Stage 1 execution may access:

`40312001..40312768`

No other fresh seed range is authorized. No rerun or repair using the same evidence is authorized after fresh access begins.

## Still prohibited

- Stage 2 `40322001..40323536`
- any p-value/effect-direction/generalization result from Stage 1
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- symmetry canonicalization not independently validated
- public AI change
- `main` integration

## Next gate

After the one authorized Stage 1 execution, record a development-only result and identity exclusion material for Stage 2. Stage 2 remains `NOT-AUTHORIZED` until a separate post-Stage1 review.
