# PBAI-P2 checkpoint — C009 development closure

Date: 2026-09-01  
Program: `PBAI-P2`  
Candidate: `PBAI-C009-v1`  
Stage: `PBAI-P2-E-DEVELOPMENT`

## Formal disposition

```text
PBAI-C009-v1 = TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED
validation contract freeze = NOT AUTHORIZED
validation execution = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
AI-GEN3 promotion = NOT AUTHORIZED
same-version rescue = NOT AUTHORIZED
```

## Canonical execution

```text
workflow run = 33504482668
job = 99845173939
workflow head = e25ddb04b794d736250839a2611174d01e62c801
artifact = 9799229328
artifact ZIP SHA-256 = 527f31fdcf17bdb6c1d48f1899099951bc1989f6ef9ff3c6a7d33aacd4527b22
production result SHA-256 = 20207afe6e11ef36f397bd59da254c6e12fd3fb453eab962f84e0d3e70e0622f
independent verification SHA-256 = 68bd106c74695c8fe8bfd29902b564c4873394460f6a705a5fe14ac3743749e9
deterministic core SHA-256 = b2bd6806c75307a49999c29743e919fe67a44b368e6d81e6e8abaed9f47005dc
```

Independent verifier did not import the production runner and independently reconstructed strict-RAW population selection, baseline single-reply eligibility, D4 engineering reference, candidate/baseline metrics, aggregate gates, and the final disposition. Full eligible/control rows, population, summary, decision, and deterministic core were exactly equal.

## Population

```text
source seeds = 42400001..42400512 (512)
trajectory candidates = 426
global roots = 256 (Namua 128 / Mtaji 128)
all eligible before selection = 189
selected eligible roots = 128 (Namua 64 / Mtaji 64)
negative controls = 64
```

## Frozen-gate result

```text
top-set agreement delta = +0.015625        [required >= +0.03] FAIL
mean normalized rank-loss delta = +0.003924851190476197
                                              [required <= -0.01] FAIL
severe-loss-rate excess = -0.015625        [required <= 0] PASS
catastrophic new loss = 0                  [required = 0] PASS
median node ratio = 1.0140845070422535     [required <= 1.25] PASS
p95 node ratio = 1.3620689655172413        [required <= 1.75] PASS
runtime trigger failures = 0               PASS
max-extension-path failures = 0            PASS
negative-control failures = 18 / 64        [required = 0] FAIL
technical failures = 0                     PASS
```

Frozen decision mapping evaluates technical/control failure before benefit-only failure. Because the negative-control gate failed, the canonical disposition is therefore:

```text
TECHNICAL-INVALID-REJECT-OR-HOLD
```

Primary benefit gates also failed independently, so this result does not support proceeding to validation under any interpretation of the control failure.

## Pre-outcome syntax correction

The first development workflow attempt `33504249360` stopped at `node --check` because the production runner had one missing closing parenthesis. Baseline materialization and development execution were skipped; `424xxxxx` development seeds were not accessed. The correction changed only that syntax error and did not change the candidate mechanism, population, thresholds, or decision mapping.

## Firewall state

```text
Research Generation 3 influence = ZERO
validation 425xxxxx = NOT ACCESSED
release holdout 426xxxxx = NOT ACCESSED
public/default AI = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

The candidate feature remains an isolated/default-off development artifact only. It is not authorized for public integration.
