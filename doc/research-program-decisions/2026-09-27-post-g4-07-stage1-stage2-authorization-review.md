# G4-07 / MLGMR-STUDY1 — post-Stage-1 / pre-Stage-2 authorization review

Date: 2026-09-27  
Review ID: `MLGMR-STUDY1-STAGE2-DESIGN-AUTH-2026-09-27-V1`  
Repository: `nkkmd/bao-la-kiswahili-game`  
Research branch: `research/g4-07-multiscale-geometry-memory-return`

## Decision

**`STAGE2-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / STAGE2-EXECUTION-NOT-YET-AUTHORIZED`**

This review authorizes preparation and freezing of the formal Stage 2 holdout implementation, source firewall, workflow, inference adapter, and execution binding. It does **not** authorize generation or reading of any Stage 2 fresh scientific seed.

## Evidence reviewed

The canonical Stage 1 execution is:

```text
run = 36247459779 / attempt 1 / success
head = cf9244d760fac807c604fef1ae9639103bfa4b31
artifact ID = 10908816662
artifact ZIP SHA-256 = 65081316d7f3dc0f59b7da5a527af65c052ea33b0ab7e8e8b07d06d764f27469
STAGE_1_RESULT.json SHA-256 = 2a712105917da91c954689f42665fc248fdf16e22721e13726e7e0cfd356d196
STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json SHA-256 = bcc53e7f7a561552e0a67ac0225b0da29da6d7904834b6b8130531cc48b6e13b
fresh Stage 1 seed reads = 96
Stage 2 seed reads = 0
production / independent exact agreement = true
formal inference performed = false
```

Stage 1 satisfied its prospectively frozen development/support-only contract. All 16 required measured trajectories were obtained, P1/P2 each contributed 8 measured trajectories, and the production and independent implementations agreed exactly.

## Formal-family derivation

Stage 2 family membership is determined **only** by the frozen Stage 1 support gate. Stage 1 effect direction, p-values, favorable subgroup behavior, game outcome, or post-hoc preference are not allowed to affect family membership.

The resulting formal family is exactly these 16 slots:

```text
CRCLGR-A1-ROOT-LEGAL-WIDTH-LAG1
CRCLGR-A1-ROOT-LEGAL-WIDTH-LAG2
CRCLGR-A1-ROOT-LEGAL-WIDTH-LAG4
CRCLGR-A2-CUMULATIVE-TREE-OCCURRENCE-LAG1
CRCLGR-A2-CUMULATIVE-TREE-OCCURRENCE-LAG2
CRCLGR-A2-CUMULATIVE-TREE-OCCURRENCE-LAG4
CRCLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES-LAG1
CRCLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES-LAG2
CRCLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES-LAG4
CRCLGR-A4-CUMULATIVE-TREE-RAW-RATIO-LAG1
CRCLGR-A4-CUMULATIVE-TREE-RAW-RATIO-LAG2
CRCLGR-A5-DUPLICATE-TRANSITION-FRACTION-LAG1
CRCLGR-A5-DUPLICATE-TRANSITION-FRACTION-LAG2
CRCLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION-LAG1
CRCLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION-LAG2
CRCLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION-LAG4
```

No lag-8 slot is eligible. A4-lag4 and A5-lag4 are not eligible. These exclusions are support-gate consequences, not effect-direction decisions.

## Stage 2 formal contract to preserve

The already-frozen preregistration remains controlling:

```text
Stage 2 seed reservation = 40723001..40724024
candidate target = 48 per policy
minimum fully eligible = 40 per policy
formal measured population = 32 per policy / 64 total
formal family = the 16 support-only-promoted slots above
formal test = exact two-sided binomial sign test on trajectory-level balance signs
zero trajectory balances in formal n = false
multiplicity = Holm-Bonferroni
family alpha = 1/20
minimum support trajectories per slot = 48
minimum support per policy per slot = 20
minimum nonzero trajectory balances per slot = 40
```

For consistency with the Stage 1 support definition, a Stage 2 trajectory supports a slot only when `comparableNonzero >= 3`.

A formal-family slot that fails the frozen support or nonzero-balance gate is `NON-ESTIMABLE`; it remains in the fixed 16-slot multiplicity family with conservative Holm input `p=1`. It may not be removed after inspection.

For an estimable slot:

- exact two-sided binomial sign test compares positive vs negative trajectory-level balances;
- trajectory-level zero balances are excluded from the sign-test n;
- Holm-Bonferroni is applied across all 16 fixed family members at exact family alpha `1/20`;
- Holm-significant positive predominance is `PERSISTENCE-CONFIRMED`;
- Holm-significant negative predominance is `REVERSAL-CONFIRMED`;
- otherwise the label is `NOT-CONFIRMED`.

Any implementation/instrument disagreement, frozen-source mismatch, firewall verification failure, or execution-integrity violation is fail-closed and cannot be converted into a scientific label.

## Identity firewall requirement

Before the first Stage 2 fresh seed read, the Stage 2 runner must verify all identity-only upstream sources already required by Stage 1 **and** the Stage 1 consumed-identity artifact:

```text
Stage 1 artifact run = 36247459779
Stage 1 artifact ID = 10908816662
Stage 1 identity row count = 96
Stage 1 identity SHA-256 = bcc53e7f7a561552e0a67ac0225b0da29da6d7904834b6b8130531cc48b6e13b
```

The whole Stage 1 reserved seed namespace `40713001..40713512` is excluded from Stage 2 even though only 96 fresh reads were consumed.

Artifact absence, artifact digest mismatch, identity-row mismatch, or repository identity mismatch must fail before any Stage 2 fresh seed read.

## Bounded-memory and return outputs

The preregistered `confirmedContiguousPersistenceLagMax` summary may be derived only after Stage 2 formal labels are complete, walking the frozen lag order `[1,2,4,8]` from lag 1 and stopping at the first non-`PERSISTENCE-CONFIRMED` or non-family lag. No beyond-lag-8 extrapolation or physical half-life interpretation is allowed.

The first-reversal / bounded-return module remains descriptive-only. No return p-value, formal confirmation label, or rule-specific causal inference is authorized.

## No-rescue and protected-evidence boundary

Stage 1 has already crossed the scientific no-rescue boundary. Therefore Stage 2 preparation may not alter:

- source policies;
- checkpoint grid;
- lag family;
- axis family;
- primary endpoint;
- support definition or thresholds;
- Stage 2 seed block;
- selection rule;
- formal test;
- multiplicity procedure or family alpha;
- resource ceilings;
- interpretation boundary.

Stage 2 execution, if later authorized, is one-shot. No same-evidence rerun, seed extension, replacement population, or favorable-subgroup rescue is authorized.

The following remain prohibited:

```text
Stage 2 fresh scientific seed access = NOT YET AUTHORIZED
G3-11 depth-10 rerun = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED
public AI change = false
main integration = NOT AUTHORIZED
```

## Authorized next work

This review authorizes only:

1. `STAGE_2_FORMAL_SPEC.json` freeze;
2. Stage 2 identity/firewall source manifest freeze;
3. formal exact-sign-test / Holm inference adapter implementation and independent cross-check;
4. Stage 2 runner implementation;
5. GitHub Actions one-shot workflow implementation;
6. syntax/static/source-separation checks;
7. frozen blob-SHA binding preparation;
8. a separate final one-shot Stage 2 execution authorization.

No Stage 2 scientific seed may be generated or read before item 8 is complete.
