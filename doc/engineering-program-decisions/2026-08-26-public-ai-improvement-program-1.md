# Public Bao AI Improvement Program 1 — Program Decision

Date: 2026-08-26  
Status: ACTIVE ENGINEERING PROGRAM DECISION  
Program ID: `PBAI-P1`

## Decision

Generation-1 completed Bao researchをevidence baseとする**Generation-1 Evidence-Informed Public Bao AI Improvement Program 1**を、Research Trackから独立したengineering programとして設立する。

Programの目的はpublic Bao AIの品質向上可能性をengineeringとして検証することであり、研究結果の再判定ではない。

## Fixed boundaries

1. Generation-1 scientific decisions remain immutable.
2. Generation-2 research is a separate pure research program and is excluded from PBAI-P1 by default.
3. Engineering positive/negative results do not confirm, rescue, reject, or reinterpret research hypotheses.
4. Program establishment does not modify public AI implementation.
5. PBAI-A evidence audit, PBAI-B baseline freeze, PBAI-C benchmark/release-gate freeze precede candidate implementation authorization.
6. Existing `AI_ADVANCED_ROADMAP.md` Phase 0–11 history remains intact; PBAI-P1 uses separate stage labels `PBAI-A`..`PBAI-H`.
7. Candidate changes are ablated individually before combined variants.
8. Release holdout evidence is protected from candidate tuning.
9. RAW state identity and no-unvalidated-symmetry boundary remain in force.
10. Human claims require human evidence.

## Initial candidate families

- phase/morphology-aware search or evaluation
- C03-aware tactical selective extension / move ordering
- restricted exact-oracle lookup plumbing
- search-instability-aware selective deepening
- evaluation-score / win-probability semantics sanitation

These are `PROPOSED`, not implementation-authorized.

## Current terminal state of establishment action

```text
programEstablished = true
phaseAEvidenceAuditComplete = false
baselineFrozen = false
benchmarkNumericReleaseGatesFrozen = false
candidateImplementations = 0
publicDeploymentChanged = false
```
