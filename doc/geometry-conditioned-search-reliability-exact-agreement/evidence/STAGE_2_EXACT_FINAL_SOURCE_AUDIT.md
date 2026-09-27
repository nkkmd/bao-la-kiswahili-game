# G4-09 Stage 2 exact-census final source audit

- Study: `GCSREA-STUDY1`
- Stage: `GCSREA-S2-EXACT-CENSUS-2026-09-27-v1`
- Audit class: `FINAL-SOURCE / PRE-AUTHORIZATION / ZERO-ACTUAL-SEARCH`
- GitHub Actions run: `36354788277`
- Run attempt: `1`
- Source SHA: `b286ee4954e30877d02ffc3262806c0cb1e4d230`
- Conclusion: `SUCCESS`
- Artifact ID: `10943129358`
- Artifact SHA-256: `debe71c78ee7d17bb2b13204bd1b48ee534567c3d7e97309f62576493bf81dd6`

## Verified gates

The final pre-authorization source audit completed successfully with no actual fixed-8 search measurement. It verified:

- syntax of the Stage 2 exact-census runner, structured result verifier, source-binding verifier, exact-oracle preflight, and production/independent agreement classifiers;
- absence of final measurement authorization, final measurement trigger, and durable Stage 2 measurement lease at audit time;
- rematerialization and integrity of all eight immutable G4-05 exact domains;
- final runner structural preflight with `8` fixed domains, `2` forced roots, `6` nontrivial roots;
- production and independent search execution counts remained `0` during the audit;
- actual fixed-8 search measurements remained `0`;
- general-domain Stage 2 fresh seed reads remained `0`;
- G4-10 depth-11 access remained `0`;
- public AI remained unchanged;
- the final one-shot workflow contains exactly one `--execute-authorized-once` measurement command, requires a durable lease before that command, and preserves immediate post-measurement artifact upload plus structured verification.

## Artifact file digests

- `ACTIONS_EXECUTION_METADATA.json`: `e4678def69d7c6db1819e84c2d9bd552018420e09f6150cfe78add0400710a69`
- `EXACT_ORACLE_INTEGRITY_PREFLIGHT.json`: `04a86213f6c41f30c50bc6727216a22bf57e91ef254c06412eb23d587021ec0f`
- `PREMEASUREMENT_STRUCTURAL_RESULT.json`: `565a065df704fd3345b7da12aa39c44f7d0a2ef951f838405ea6eb09a4144133`
- `WORKFLOW_STRUCTURE_AUDIT.json`: `29f0bb6c01dc8305a77f570c48833ecda5c5ccc97ad1932cc0c817d09f3e714b`

## Authorization boundary

This audit does **not** authorize actual fixed-8 search measurement. It is evidence supporting a separate final one-shot authorization review. No rerun, rescue, domain replacement, G4-05 candidate rescan, general-domain Stage 2 seed access, G4-10 access, public-AI change, or main integration is authorized by this record.
