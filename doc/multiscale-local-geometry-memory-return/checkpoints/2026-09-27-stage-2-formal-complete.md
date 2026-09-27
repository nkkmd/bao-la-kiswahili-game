# G4-07 / MLGMR-STUDY1 — Stage 2 formal checkpoint

Date: 2026-09-27  
Agenda: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
Stage: `MLGMR-S2-FORMAL-2026-09-26-v1`  
Final disposition: **`FORMAL-COMPLETE`**

## 1. Purpose

Stage 2 is the prospectively frozen fresh formal holdout for the 16 axis×lag slots promoted by the Stage 1 support-only gate. Formal inference uses trajectory-level balance, exact two-sided binomial sign tests, and Holm-Bonferroni correction across the fixed 16-slot family at exact family alpha `1/20`.

The Stage 1 effect direction was not used to choose the formal family. No lag, axis, checkpoint, policy, support threshold, formal test, multiplicity rule, or population was changed after fresh Stage 2 access began.

## 2. Canonical execution

```text
run = 36278926636 / attempt 1
head = f73e2ade42b3379b9eaf2007292a057cfeaf88f0
conclusion = success
binding = MLGMR-STUDY1-STAGE2-BINDING-2026-09-27-V1
frozen source commit = 8bf76b5bb4ef375948cedaac131cb256b4a1dd8a
artifact ID = 10919769185
artifact name = mlgmr-stage2-formal-result
artifact ZIP SHA-256 = 4d8370ccad1be7fa4052a4293e6b64c4e1b77f7c11c94c1f4dbabead694394f2
STAGE_2_RESULT.json SHA-256 = 970083e5f2a5f06e05d52c271e7b4b2bda3e8eb7889ba699b96c9cc3efc98726
STAGE_2_CANDIDATE_MANIFEST.json SHA-256 = 1c4b8479a04169a50e89e4c33b79fc4a95930c2d61c52f1d6ddb51cf958b28af
STAGE_2_FORMAL_MEASUREMENTS.json SHA-256 = be67b4e7d78291e008eaf8b40d94b08cf5924a703ddb54df183824f237751ab8
STAGE_2_FORMAL_INFERENCE.json SHA-256 = 365e7ae66571d6e6621a81ea6755185c7e581d13a38f81491f428b3a7f03b429
```

All workflow gates passed: syntax, frozen binding, frozen 16-slot family and independent inference verification, frozen upstream artifact retrieval, artifact presence checks, the one-shot fresh formal runner, and result upload.

## 3. Fresh-access and firewall accounting

```text
firewall digest = 21219d6c137fb69340cd8193ac9b74d7f79dbeca6ee19db8442322a15596556d
firewall set sizes = seed 4480 / trajectory 680 / prefix 296 / root 5613
fresh scientific seed reads = 363
first seed read = 40723001
last seed read = 40723581
G4-10 depth-11 access = 0
public AI change = false
main integration = false
```

The complete upstream identity firewall was materialized before the first fresh Stage 2 read. During candidate scanning, the frozen firewall excluded two upstream trajectory collisions and one upstream prefix collision in addition to the frozen excluded seed namespaces.

The Stage 2 no-rescue boundary is permanently crossed. Same-evidence rerun, seed extension, replacement population, post-access threshold changes, favorable subgroup rescue, and additional Stage 2 formal runs are not authorized.

## 4. Candidate and formal measurement accounting

```text
P1 fully eligible candidate count = 48
P2 fully eligible candidate count = 48
formal measured trajectories = 64
measured P1 = 32
measured P2 = 32
production / independent exact agreement = true
elapsedMs = 8935819
rssBytes = 439906304
stage elapsed ceiling = 16200000
stage RSS ceiling = 4294967296
```

Rejections observed before reaching the fixed candidate target:

```text
P1:
  TERMINAL-BEFORE-72 = 237
  DEPTH5-PREFLIGHT-INELIGIBLE = 4
  UPSTREAM-TRAJECTORY = 2
P2:
  TERMINAL-BEFORE-72 = 22
  DEPTH5-PREFLIGHT-INELIGIBLE = 1
  UPSTREAM-PREFIX = 1
```

## 5. Formal result

The fixed 16-slot family produced:

```text
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
```

All six lag-1 slots were `REVERSAL-CONFIRMED`:

```text
A1 root legal width                 lag 1: 1 positive / 61 negative / 2 zero
A2 cumulative tree occurrence       lag 1: 10 positive / 54 negative / 0 zero
A3 cumulative distinct RAW states   lag 1: 11 positive / 53 negative / 0 zero
A4 cumulative tree/RAW ratio        lag 1: 4 positive / 52 negative / 8 zero
A5 duplicate-transition fraction    lag 1: 8 positive / 49 negative / 7 zero
A6 unit-width occupancy fraction    lag 1: 9 positive / 55 negative / 0 zero
```

All fixed-family lag-2 slots and the four fixed-family lag-4 slots were `NOT-CONFIRMED` after the preregistered exact sign test and Holm-Bonferroni correction.

No slot in the fixed formal family was `PERSISTENCE-CONFIRMED`.

## 6. Bounded persistence summary

The preregistered contiguous-persistence summary starts from lag 1 and only extends while successive lags are `PERSISTENCE-CONFIRMED`.

Because lag 1 is `REVERSAL-CONFIRMED` for every axis:

```text
A1 confirmedContiguousPersistenceLagMax = NONE
A2 confirmedContiguousPersistenceLagMax = NONE
A3 confirmedContiguousPersistenceLagMax = NONE
A4 confirmedContiguousPersistenceLagMax = NONE
A5 confirmedContiguousPersistenceLagMax = NONE
A6 confirmedContiguousPersistenceLagMax = NONE
```

This is a bounded operational result over the frozen lag family. It is not a physical half-life estimate and does not establish a decay law.

## 7. Return endpoint

The reversal-return endpoint remains **descriptive only** by preregistration. It is not part of the formal multiplicity family and receives no confirmation label or p-value claim.

The descriptive aggregate shows many trajectories returning after an initial nonzero reversal, but those counts must not be promoted to a formal return law, causal claim, rule-event mechanism, or universal Bao dynamic.

## 8. Interpretation boundary

The formal result supports the narrow statement that, in the frozen fresh P1/P2 trajectory population and continuous representation used by `MLGMR-STUDY1`, the shortest preregistered lag shows a statistically confirmed opposite-sign relationship for all six axes.

It does **not** establish:

- a universal oscillation law for Bao;
- a causal mechanism for reversal;
- a rule-event-specific effect;
- a physical memory half-life or decay constant;
- persistence or reversal outside the frozen lag/checkpoint family;
- search strength, best-move correctness, game-theoretic value, or human difficulty;
- any automatic public-AI engineering decision.

G4-08 remains the separate agenda for rule-semantic transition decomposition and must not be pre-empted by causal interpretation of this result.

## 9. Canonical record and raw artifact

Repository canonical summary/provenance record:

`results/stage-2/STAGE_2_CANONICAL_RECORD.json`

The byte-exact raw Stage 2 files remain pinned in GitHub Actions artifact `10919769185` by the SHA-256 values in section 2. The repository canonical record preserves the formal decisions, sign counts, bounded-persistence summary, execution provenance, firewall accounting, resource accounting, and raw-file digests without duplicating the large raw measurement payload.

## 10. Study status after Stage 2

`MLGMR-STUDY1` has completed its preregistered technical, development, and formal stages.

```text
Stage 0 = PASS
Stage 1 = DEVELOPMENT-SUPPORT-ONLY / COMPLETE
Stage 2 = FORMAL-COMPLETE
G4-10 depth-11 access = 0 / NOT AUTHORIZED
public AI change = false
main integration = NOT AUTHORIZED
```

The next permitted work is documentation closure, cross-document consistency audit, and a separate main-integration review. No additional scientific run is required or authorized for this Study.
