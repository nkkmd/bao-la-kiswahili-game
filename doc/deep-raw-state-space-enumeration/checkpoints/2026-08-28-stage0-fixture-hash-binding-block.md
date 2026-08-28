# DRSSE Stage 0 — fixture hash binding block

Date: 2026-08-28
Stage: `DRSSE-S0-TECHNICAL-2026-08-28-v1`
Workflow run: `33155385913`
Job: `98796817628`
Head: `819cd06bf49b3ca4225025220f3418b9bb722a8c`
Classification: `TECHNICAL-BLOCK-FIXTURE-HASH-SEMANTICS`
Scientific inference: NOT AUTHORIZED

The production technical enumerator completed the frozen depth-2 positive fixture far enough to evaluate its gates. The following fixture gates passed:

```text
RAW identity = PASS
complete depth-2 layers = PASS
G1 cumulative state count 19 = PASS
G1 cumulative edge count 18 = PASS
G1 state-set SHA256 = PASS
no transform = PASS
no resource stop = PASS
```

The G1 transition-set SHA256 fixture gate failed. Inspection of the immutable G1 SSGTC Stage 0 runner established that G1 computed its transition-set hash as SHA256 over sorted raw transition fingerprints:

```text
parentKey|moveKey|childKey
```

DRSSE's internal cumulative edge hash intentionally hashes individual fingerprints before hashing the sorted set. The two deterministic conventions therefore cannot be compared directly even when the same 18 transitions are present.

The run is not accepted as Stage 0 PASS. The correction is restricted to the technical compatibility gate: the DRSSE Stage 0 wrapper now independently reconstructs the G1-compatible transition hash from its materialized edge rows while retaining DRSSE's internal hash convention unchanged. RAW identity, enumerator, successor semantics, counts, resource contract, and independent verifier are unchanged.

This Stage is technical-only. No G2-05 scientific inference, Stage 1 design optimization, or Stage 2 evidence selection is authorized from this blocked run.
