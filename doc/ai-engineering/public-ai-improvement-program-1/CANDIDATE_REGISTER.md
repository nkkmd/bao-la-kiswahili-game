# PBAI-P1 Candidate Register

Status: INITIAL / NO CANDIDATE AUTHORIZED FOR IMPLEMENTATION

Candidate status vocabulary:

```text
PROPOSED
EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT
DEVELOPMENT-ONLY
VALIDATION-READY
RELEASE-CANDIDATE
ADOPTED
REJECTED
HOLD
WITHDRAWN
```

## Initial candidates

| ID | Candidate family | Generation-1 evidence basis | Current status | Key risk |
| --- | --- | --- | --- | --- |
| `PBAI-C001` | Phase / morphology-aware search or evaluation | phase/typology findings, Mtaji morphology | PROPOSED | exploratory/phase constructを過剰hard-codeすること |
| `PBAI-C002` | `TM-S2-C03`-aware tactical selective extension / move ordering | C03 machine-confirmed motif | PROPOSED | motifをgame-theoretic/traditional/human claimへ拡張すること |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | frozen 8-state exact oracle | PROPOSED | 8-state claimを全終盤へ一般化すること |
| `PBAI-C004` | Search-instability-aware selective deepening | search instability / high-divergence observations | PROPOSED | unvalidated difficulty/criticality classifierを流用すること |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE` | PROPOSED | scoreをvalidated win probabilityとして扱うこと |

## Authorization requirements

candidateを`AUTHORIZED-FOR-DEVELOPMENT`へ移すには、最低限次を記録する。

- exact source Study / document / evidence level
- engineering mechanism
- code surface
- expected benefit
- expected runtime/memory cost
- known prohibited inference
- candidate-specific benchmark endpoints
- development seeds
- validation seeds
- release holdout rule
- acceptance/rejection rule
- rollback method

## Combination rule

`PBAI-C001 + C004`のような複合変更は既存IDへ黙って追加しない。独立combined candidate IDを発行する。
