# RESEARCH_LOG — Restricted Endgame / Winning Regions Study 1

## 2026-08-24 — Study initiation

- Re-read current `main`; baseline fixed at `626480507710e0095ef8aec6a53c3e4e0318fa4f`.
- Confirmed current research sequence records Restricted Endgame / Winning Regions before Symmetry / Isomorphic Positions and State Space / Game Tree Complexity.
- Recovered runtime state, legal move, move application and terminal behavior from `public/engine.js` and `test/engine.test.js`.
- Confirmed `MAX_RELAY=512` is an implementation safety guard, not a normative Bao terminal rule, from `RULES_BASELINE.md`.
- Confirmed engine has no intrinsic formal draw/repetition state; prior max-ply draw labels are administrative.
- Recovered direct `ruleStateKey` infrastructure and exact `AI.moveKey`; primary Study 1 will not use symmetry canonicalization.
- Reconfirmed formal boundaries of Position Evaluation, Blunder/Misvaluation, Critical Positions, Position Complexity, Tactical Motifs, and Namua→Mtaji Study 1.
- Chose witness-reachable Mtaji forward closure as the primary Stage 0 construct direction.
- Chose exact-domain selection by technical feasibility only; game-theoretic outcomes remain locked until Stage 1 domain freeze.
- Opened branch `research/restricted-endgame-winning-regions`.
- Authorized synthetic generic retrograde fixtures only; Bao scientific tablebase generation remains blocked.
