# Symmetry / Isomorphic Positions Study 1 — closure checkpoint

Date: 2026-08-24  
Study: `SIP-STUDY1`  
Formal stage: `SIP-S1-FORMAL-2026-08-24-v1`  
Status: **CLOSED**

## Canonical formal decision

```text
scientific outcomes = 5
VALIDATED-BOUNDED-ISOMORPHISM = 0
NOT-VALIDATED = 0
NON-ESTIMABLE = 5
```

All five frozen fresh bounded-local scientific scopes produced exact mismatch count 0 in production and independent implementations. This evidence is retained but is not promoted to Study-level validation because the prospectively mandatory immutable exact-oracle anchor and production/independent equality gate `G12` were not estimable to the required exact standard.

## Required anchor limitation

The Restricted Endgame Study 1 artifact remains immutable and retains formal decision `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`.

A post-outcome read-only diagnostic found:

```text
oracle stateRows = 8
stored stateKey mismatch rows = 3
production/independent re-hash disagreements = 0
stored ruleState seed totals observed = 63, 64
recomputed guard-free transitions = 7
successor escapes stored key set = 0
```

Because the identity positive control also fails at the oracle-anchor layer, no oracle mismatch from this Study is interpreted as candidate-specific negative evidence. The prior Study is not rewritten, invalidated, or rescued.

## Frozen result identities

```text
specSha256 = ede4968d7702ffded73233cf05cbe10c94c4d3a1cb04ef850f85c727b56d2b0a
authorizationSha256 = a539de44b26e513ab461a559e97ee4e7914900178a469389a5c996def3d7f5a4
domainSha256 = fa40e1b7d2fc5e34291ec9537e8a5f19b280be8203d62ca8687090dc96ff9e22
productionResultSha256 = fd1c509b40a3ea40675e738826db8cb4030378ed8955f122594a6f5e4756574a
independentVerificationSha256 = 8e7327b4192e2616716d34deae86b15a51f269201f591a843310d414541596f0
formal archival workflow run = 32728925376
oracle diagnostic workflow run = 32728619101
```

## Downstream authorization

```text
validated transformation set = []
canonicalization = NOT AUTHORIZED
symmetry group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
raw-state State Space / Game Tree Complexity research = AUTHORIZED
T01/T02/T03 state reduction = NOT AUTHORIZED
```

A future prospective study may audit terminal-state representation, captured-seed accounting, raw-rule-state identity and state-key serialization, and may then perform new symmetry confirmation if justified. It must not retroactively change either `SIP-STUDY1` or Restricted Endgame Study 1.

## Repository closure state

- `STUDY_1_OVERVIEW.md` complete.
- `STUDY_1_FINAL_REPORT.md` complete.
- canonical compact formal result complete.
- production and independent raw result artifacts preserved.
- `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `EXPERIMENT_INDEX.md`, `REPRODUCIBILITY_INDEX.md`, and `RESEARCH_LOG.md` closed.
- root `README.md`, `doc/RESEARCH_INDEX.md`, and `doc/FUTURE_RESEARCH_AGENDA.md` updated.
- `doc/FUTURE_RESEARCH_AGENDA.md` version advanced to `1.12.0`.
- Stage 1 automatic outcome-generation workflow retired; only a manual archived-closure integrity check remains.
- temporary technical PRs are not part of the scientific result.

No further scientific outcome generation is authorized within `SIP-STUDY1`.
