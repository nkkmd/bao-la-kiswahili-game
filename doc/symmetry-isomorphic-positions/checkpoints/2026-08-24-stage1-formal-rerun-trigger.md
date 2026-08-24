# Stage 1 exact rerun trigger

Date: 2026-08-24
Study: `SIP-STUDY1`
Stage: `SIP-S1-FORMAL-2026-08-24-v1`
Classification: **exact diagnostic rerun of frozen authorized formal run**

This checkpoint does not change candidate semantics, domain selection, root count, depth, seed block, source hashes, gates, or decision rules.

The rerun must abort before outcome generation if any source/domain/spec/authorization hash does not equal the already frozen contract. Any resulting negative, non-estimable, or verifier-disagreement outcome must be preserved without rescue.
