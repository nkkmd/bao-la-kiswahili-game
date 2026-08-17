# Checkpoint — Stage 1 exact formal stimulus freeze PASS

Date: 2026-08-18  
Stage: `TMHV-S1-STIMULUS-2026-08-17-v1`  
Freeze ID: `TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`

## Decision

**PASS — EXACT FORMAL MACHINE STIMULI FROZEN / HUMAN DATA COLLECTION NOT AUTHORIZED**

The prospectively frozen deterministic freezer was run against the exact hash-bound Stage 1 artifacts. The public-safe audit reports `passed=true` and all frozen construction checks are true.

## Cryptographic commitments

- formal selection spec SHA-256: `67384b96b14551eb80d83d26f798f396e52098712d533b0e2e88131bc69d3df5`
- private exact freeze SHA-256: `2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`
- returned public-safe audit SHA-256: `e994ddeb2875831a7a79e1181aa2bbbb39658316ebffcf896c7953265cdd70b3`
- pool hash: `6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`

Input artifact hashes remained exactly those frozen before materialization.

## Formal machine stimulus counts

- primary blocks: `12`
- primary positions: `36`
- primary C03 targets: `24`
- primary controls: `12`
- control balance: `P_ONLY=4`, `M_ONLY=4`, `MORPH_NEAR=4`
- secondary move-choice C03 targets: `6`
- total unique formal positions: `42`

All 42 positions are unique by:

- rule-state key;
- historical trajectory;
- opening prefix.

Primary actors are normalized to South and all primary positions are Mtaji.

## Generation-condition provenance

Aggregate condition counts across the 42 frozen positions are:

```text
LS-D2 = 10
LE-D2 = 10
B-D1  = 10
V2-D2 = 10
B-D2  = 1
B-D3  = 1
```

This is not a frozen-gate failure. The prospective freeze contract required one secondary item per generation stratum but did not require balanced generation-condition representation across all primary positions. Therefore this observed distribution is preserved as-is. No post-materialization rebalancing, substitution, or aesthetic reselection is permitted.

## Privacy / contamination boundary

Exact rule-state identities, board states, seeds, and participant SVGs remain only in the gitignored private local artifact. Public Git stores only the deterministic rule, cryptographic commitment, aggregate counts, and constraint audit.

## Human-study boundary

Still false / not authorized:

- scientific expert recruitment;
- formal human responses;
- scientific human inference;
- human-recognition claim;
- expert-tesuji claim;
- traditionality claim.

Historical `TM-S2-C03 = CONFIRMED` remains unchanged.
