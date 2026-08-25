# SSGTC-STUDY1 — Research Log

## 2026-08-25 — Study start

- Re-fetched remote `main`; SHA confirmed as `9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901`.
- Re-read program-level research state and the required Restricted Endgame, Symmetry, and ORISC documents/results.
- Restored immutable upstream decisions and the ORISC RAW-ONLY downstream contract.
- Created branch `research/state-space-game-tree-complexity` from the exact study-start main SHA.
- Fixed Study ID `SSGTC-STUDY1` and working title `State Space / Game Tree Complexity Study 1`.
- Re-audited `public/engine.js` and ORISC production/independent representation code.
- Confirmed engine initial state explicitly contains `pending:[0,0]`.
- Identified compatibility behavior in current engine that can synthesize missing `pending` during clone/terminal handling. Decision: SSGTC uses a study-owned pre-transition hard validator and never permits engine fallback to repair a studied raw state.
- Confirmed the ORISC independent representation implementation is structurally separate from its production serializer and can inform, but not substitute for, a study-owned SSGTC independent verifier.
- Confirmed existing ORISC Stage 0/1 workflows are closed-study notices; SSGTC will generate only fresh SSGTC-owned artifacts.
- Frozen initial decision register, study-start firewall, Stage 0 technical protocol, Stage 1 exploratory boundary, and Stage 2 prospective firewall before Stage 0 outcome generation.

### Scientific outcome state

```text
No Stage 0 diagnostic result generated yet.
No Stage 1 scientific corpus generated.
No Stage 2 formal evidence generated.
formalDecision = NOT-YET-AVAILABLE
```

### Repository interface boundary

The GitHub connector exposes remote repository state rather than a local checkout worktree. This log therefore records the exact remote branch/SHA state and does not claim a local working tree was clean.