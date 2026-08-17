# Stage 1 formal stimulus freeze rule validated

Date: 2026-08-17

Freeze ID: `TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`

## Decision

**PASS — PROSPECTIVE FORMAL-STIMULUS SELECTION RULE FROZEN / EXACT PRIVATE MATERIALIZATION PENDING**

The compact Stage 1 artifacts passed identity audit before exact formal position identities were materialized.

A separate prospective freeze specification now fixes:

- exact audited input artifact SHA-256 identities;
- 12 primary three-position blocks;
- control balance `4 / 4 / 4` across `P_ONLY / M_ONLY / MORPH_NEAR`;
- target-A/control candidate ordering by frozen Stage 1 matching cost then SHA-256 tie-break;
- target-B selection by the exact Stage 1 nuisance match cost, maximum cost `10`, then SHA-256 tie-break;
- global no-reuse of `ruleStateKey`, `historicalTrajectoryHash`, and `openingPrefixHash` across all 36 primary positions;
- six secondary C03 move-choice states, one per generation stratum, with no primary/secondary recurrence;
- total unique formal positions = `42`;
- no manual aesthetic substitution and no human-outcome-dependent reselection.

## Public/private boundary

Exact selected identities, board states, and participant SVGs remain local/private before formal collection. Public Git records only the deterministic rule and later a SHA-256 commitment plus aggregate audit metadata.

## Tooling validation

GitHub Actions:

- run: `32040413639`
- job: `95418609369`
- conclusion: `success`
- `Validate deterministic formal stimulus freezer`: `success`

The CI test confirmed deterministic 12-block construction, exact `4/4/4` control balance, six secondary strata, and 42-way uniqueness of rule state / historical trajectory / opening prefix on synthetic material.

## Boundary

This checkpoint does not authorize scientific expert recruitment, formal human responses, human recognition inference, expert tesuji claims, or traditionality claims.

Next step: run the validated freezer locally against the exact audited Stage 1 artifacts and return only the public-safe `formal-stimulus-freeze-audit.json` plus the SHA-256 of the private freeze file. Do not upload the private exact-stimulus file unless a targeted forensic audit becomes necessary.
