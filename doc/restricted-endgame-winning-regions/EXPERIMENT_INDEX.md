# EXPERIMENT_INDEX — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24

| ID | Stage | Purpose | Scientific outcome authorized? | Status |
| --- | --- | --- | --- | --- |
| `REWR-T0-SYNTHETIC` | Stage 0 | Generic retrograde / SCC / DTF semantics on synthetic graphs | No | PASS |
| `REWR-T1-RELAY` | Stage 0 | Guard-free Bao relay transition audit | No | PASS |
| `REWR-T2-WITNESS` | Stage 0 | Generate/replay historically reachable Mtaji witness roots | No | PASS; 3464 unique roots |
| `REWR-T3-CLOSURE-V1` | Stage 0 | Initial candidate root-grid scan | No | COMPLETE; no root under original nonEmpty≤14 cap |
| `REWR-T3-CLOSURE-V2` | Stage 0 | Outcome-blind 36-profile complete-closure matrix | No | PASS; 8-state candidate selected |
| `REWR-T4-VERIFY` | Stage 0 | Independent selected-domain state/edge reconstruction | No | PASS; full equality |
| `REWR-T5-V3` | Stage 0 | One-shot expanded candidate closure | No | INFEASIBLE; ADMIN-CUTOFF; V2 fallback |
| `REWR-S1-TOOLING` | Stage 1 prefreeze | Production/independent retrograde + tablebase fixture validation | No | PASS |
| `REWR-S1-PREFREEZE` | Stage 1 prefreeze | Source-hash and authorization-absence audit | No | PASS |
| `REWR-S1-EXACT` | Stage 1 | Frozen production scientific exact tablebase | Yes, after authorization v2 | COMPLETE |
| `REWR-S1-VERIFY` | Stage 1 | Independent complete graph + exact solution verification | Yes | PASS / exact claim authorized |

## Stage 0 firewall result

No candidate-domain WIN/LOSS/RECURRENT, DTF, optimal moves, or winning-region composition was generated before final domain selection and Stage 1 freeze.

## Stage 1 exact result

```text
states = 8
edges = 7
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Scientific workflow run `32702596730` passed production generation, independent verification and exact-claim gate.
