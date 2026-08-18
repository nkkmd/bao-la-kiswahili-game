# Stage 1 compact artifact audit PASS

Date: 2026-08-17

Stage: `TMHV-S1-STIMULUS-2026-08-17-v1`

## Decision

**PASS — COMPACT ARTIFACT IDENTITY VERIFIED / MACHINE STIMULUS POOL READY / HUMAN DATA COLLECTION NOT AUTHORIZED**

The locally returned compact Stage 1 bundle was inspected independently before exact formal human-stimulus identities were frozen.

Bundle SHA-256:

`88918bf56e2e4e58875b014ab47da71b69756121c6c6dfa8ea76348400c16f3c`

Artifact SHA-256:

```text
manifest.json            24d23be9e08ef392f1eab5f767dc069cad4a819c2211f2f2c88c64801038dea4
verification.json        39f642eb65de48da99ba6c491d5647eb23c33e40631d3db36995e4cb725b0866
stimulus-pool-audit.json ccf376539588b5b06ad5ca0b16bba1b61b096506d9b1e0c00f29f785a1338c27
stimulus-pool.json       a1ee4f6749a6f6b433122ea896975deef45fa6b2fb41c1a9edc53955a302f5a8
```

The returned `SHA256SUMS.txt` matched all four independently recomputed hashes.

## Identity checks

- spec SHA-256 matched the frozen Stage 1 spec;
- authorization SHA-256 matched the generation authorization;
- authorized source commit matched in manifest and verification;
- manifest and verification both recorded a clean source tree;
- pool hash matched in `stimulus-pool.json` and `stimulus-pool-audit.json`;
- verification identity and generation summary hashes matched the previously recorded execution results.

## Pool integrity checks

All class counts and matched counts reproduced the recorded audit.

Across all 1,554 stored target-control matches:

- same historical trajectory violations: `0`;
- same opening-prefix violations: `0`;
- duplicate controls within a control family: `0`;
- duplicate targets within a control family: `0`;
- matching-cost violations above the frozen maximum `10`: `0`.

Within every stimulus class:

- at most one selected state per historical trajectory: confirmed;
- duplicate rule-state identities: none.

## Participant rendering checks

Each participant-facing stimulus contained only:

```text
stimulusId
phase
actor
svg
```

All rendered actors were normalized to South and all positions were Mtaji. A direct scan of participant-facing SVG content found no occurrences of the hidden-cue terms covering opening history, ply, candidate labels, legal-move/search information, reusable-pit terminology, tesuji terminology, C03, or TM-S2.

## Boundary

This audit verifies the machine artifact identity and readiness only. It does **not** authorize:

- scientific expert recruitment;
- formal human responses;
- human recognition inference;
- expert/traditional tesuji claims.

Exact formal stimulus identities remain unfrozen at this checkpoint. The next prospective step is to freeze a deterministic formal-stimulus construction rule, materialize exact identities privately, and publish only cryptographic commitments/audit metadata before Stage 2 preregistration.
