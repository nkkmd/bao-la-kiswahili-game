# STSCV-STUDY1 — Stage 2 fail-closed closure checkpoint

Date: 2026-08-28

## Frozen conclusion

```text
Study = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

## Trigger

Authorized Stage 2 workflow:

```text
run = 33145860098
job = 98766622115
head = c7619ded9f682b499a02d023b40ac54ba4dc95ca
conclusion = failure
```

Production held-out measurement completed successfully. Mandatory independent verification then terminated during formal-result assembly with:

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

No complete independent verification artifact, formal result artifact, SHA256SUMS, or workflow artifact ZIP was materialized.

## Frozen rule application

`preregistration/STAGE_2_DECISION_RULE.json` requires every global gate to PASS before candidate mismatch can be interpreted scientifically. S2-G5 was not established as a complete canonical independent-verification result.

Therefore the prospectively frozen global-failure rule applies exactly:

```text
studyDecision = INCONCLUSIVE
candidateDecision = NON-ESTIMABLE
canonicalizationDecision = NON-ESTIMABLE
scientificMismatchInterpretationAuthorized = false
```

## Production diagnostics retained without decision use

```text
selected roots = 32 Namua + 32 Mtaji + 32 Mtaji-houseless
T01 production mismatch = 0
T02 production mismatch = 0
T03 production mismatch = 0
production bounded graph = 6317 states / 6341 edges
```

These are preserved as bounded diagnostics only. They do not authorize `VALIDATED-BOUNDED-ISOMORPHISM`.

## No-rescue boundary

The verifier implementation defect became known only after fresh Stage 2 outcome generation. This Study will not repair that source and rerun the same formal evidence to obtain a candidate decision.

Any new formal validation must be a new prospective Study or explicitly new versioned protocol with fresh authorization and fresh evidence.

## Downstream boundary

Canonicalization, symmetry-reduced state counting, and transform-based scientific population deduplication remain unauthorized. SIP-STUDY1, ORISC-STUDY1, SSGTC-STUDY1, G2-01, and G2-02 remain unchanged.
