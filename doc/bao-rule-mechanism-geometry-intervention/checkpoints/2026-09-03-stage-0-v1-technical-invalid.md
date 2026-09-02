# BRMGI Stage 0 v1 — technical-invalid checkpoint

Date: 2026-09-03  
Stage: `BRMGI-S0-TECHNICAL-2026-09-02-v1`  
Disposition: **`TECHNICAL-INVALID / NO RERUN`**

## Execution provenance

```text
workflow run = 33677691455
trigger head = b7267169a190353dab3e34221958ae871015be2b
authorization commit = 63df203ce4c0f57c1739e91c49b7da6b151a667c
audited source head = daba751736763acf0cd96db909dc8482f7e2a654
authorized executions = 1
actual executions = 1
```

Authorization-chain verification passed. A durable lease was uploaded before computation:

```text
lease artifact ID = 9864980761
lease ZIP SHA-256 = e10c9e3882c277e98e130c28700518431b39b7a811a77c95d2dc906a5f074bd5
```

## Technical failure

The Stage 0 runner failed while evaluating the explicit synthetic nyumba fixture. The fixture represented only 34 seeds. `lgtgmiv-stage1-production.js` correctly failed closed when `stateKey` enforced the frozen RAW representation invariant:

```text
Error: represented seed total 34
```

The failure occurred in `brmgi-production.js::nyumbaPairs` when comparing stop/use post-state RAW identities.

No canonical Stage 0 result file was written, so the result-artifact upload also failed. The Actions log is the authoritative technical failure provenance for v1.

## Scientific consequence

```text
fresh Stage 1 seed access = false
fresh Stage 2 seed access = false
fresh scientific evidence generated/read = false
protected depth-10 access = false
scientific inference = none
```

This is not evidence for or against any G3-06 rule-event geometry hypothesis.

The same v1 execution is not rerun.

## Versioning disposition

Because the failure is confined to an explicit technical synthetic fixture and occurred before any fresh scientific evidence, a new **Stage 0 v2 technical version** may be prospectively frozen. v2 may correct only the fixture so that it satisfies the already-frozen 64-seed RAW representation invariant. Study identity, Stage 1/2 IDs, scientific seed blocks, event families, endpoints, populations, promotion/formal rules, resource ceilings, interpretation boundaries and protected evidence remain unchanged.
