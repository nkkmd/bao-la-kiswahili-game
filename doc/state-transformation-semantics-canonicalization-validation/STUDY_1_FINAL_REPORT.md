# State Transformation Semantics / Canonicalization Validation Study 1 — Final Report

Updated: 2026-08-28

## Study identity

```text
Program label = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Formal title = State Transformation Semantics / Canonicalization Validation Study 1
Baseline main = a8493d2a50e11f15d16ef8348f2442b262ca275d
Research branch = research/g2-03-state-transformation-semantics-canonicalization-validation
```

Japanese working title:

**Baoにおける状態変換意味論とcanonicalizationの厳密検証 — rule-semantic validity, legal-move equivariance, successor binding, graph isomorphism, and prospective canonicalization authorization**

## Final decision

```text
Study-level formal decision = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

The Study closes under the prospectively frozen Stage 2 global-failure rule. This is not a scientific rejection of the three candidate transforms.

## Research question

The Study asked whether candidate state transformations can be validated as exact rule-semantic bounded graph isomorphisms when the representation contract is explicit from the start, and whether any validated transforms can then support canonicalization without conflating semantic graph equivalence with fixed-start reachable-population identity.

The formal gates required exact preservation of authoritative RAW state semantics, exact legal-move-set bijection, exact move identity including Namua variants, successor commutation, terminal/winner/pending semantics, inverse/bijection properties, bounded graph binding, controls, firewall integrity, frozen source identity, and mandatory independent verification.

## Authoritative identity

The Study retained the RAW scientific identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` and `reason` were excluded. No symmetry transform or canonicalization was used to deduplicate the scientific population before formal authorization.

## Upstream boundaries

The Study did not modify or rescue any earlier result, including:

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

In particular, G2-03 did not retrospectively repair repository-facing oracle rows or reinterpret historical zero-mismatch diagnostics as valid candidate decisions.

## Stage 0 — technical reconstruction

Stage 0 was technical only. It reconstructed current engine representation and transformation semantics, separately implemented production and independent paths, verified the IDENTITY positive control, confirmed that the deliberately broken left-right control is detectable, and reduced the requested transform family to a finite candidate contract before scientific development evidence.

Stage 0 did not create a scientific candidate decision.

## Stage 1 — development evidence

Stage 1 used fresh historically reachable RAW states and remained development-only. It selected:

```text
Namua roots = 24
Mtaji roots = 24
Mtaji-houseless roots = 24
Total = 72
```

The Stage 1 selected identities were then consumed by the Stage 2 firewall at trajectory-seed, opening-prefix, and RAW-state levels. Stage 1 evidence was not reused as Stage 2 formal confirmation evidence.

The Stage 1 candidate contract retained three non-identity candidates:

```text
STSCV-T01-SEAT-SWAP-LOCAL
STSCV-T02-LR-MTAJI-HOUSELESS
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

No Stage 1 candidate outcome was a formal validation.

## Stage 2 — prospective formal freeze

Before any Stage 2 scientific outcome existed, the following were frozen:

```text
Stage = STSCV-S2-FORMAL-2026-08-28-v1
fresh seed block = 26032001..26032768
seed count = 768
target roots per stratum = 32
strata = Namua / Mtaji / Mtaji-houseless
local graph depth = 3
replacement outside frozen seed block = false
seed extension after outcome = false
mismatch tolerance = 0
```

The Stage 2 prefreeze workflow run `33145713610` passed after prospective firewall hardening. That hardening independently recomputed the Stage 1 selection binding rather than trusting a stored selection hash. No Stage 2 scientific outcome existed during the hardening.

Explicit Stage 2 authorization was committed at:

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

The authorization was bound to the exact frozen spec, candidate contract, firewall, decision rule, RAW identity, production runner, independent verifier, and source hashes.

## Frozen Stage 2 decision rule

The formal decision rule required all six global gates to pass.

```text
S2-G1 population / firewall / uniqueness
S2-G2 runtime relay-limit integrity
S2-G3 IDENTITY exact zero mismatch
S2-G4 negative-control interpretable mismatch
S2-G5 exact production / independent agreement
S2-G6 frozen contract/source/hash agreement
```

If any global gate failed or was not established, the prospectively frozen rule required:

```text
study = INCONCLUSIVE
candidate = NON-ESTIMABLE
canonicalization = NON-ESTIMABLE
scientific mismatch interpretation = not authorized
```

Only if all global gates passed could zero candidate mismatch yield `VALIDATED-BOUNDED-ISOMORPHISM` or one-or-more mismatch yield `NOT-VALIDATED`.

## Stage 2 execution

The authorized formal workflow was:

```text
workflow = STSCV Stage 2 Formal
run = 33145860098
job = 98766622115
head = c7619ded9f682b499a02d023b40ac54ba4dc95ca
conclusion = failure
```

The following steps succeeded:

```text
engine regression = PASS
frozen production/independent source reconstruction = PASS
fresh held-out production measurement = PASS
```

The production measurement selected the exact frozen quotas:

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
Total = 96
```

Production also reported:

```text
selectionSha256 = 4d81f8adebfe7b32bfba86adaaeb3f04a8ca6b451e09953612804734d303bb1c
measurementSha256 = 530ae49610dc7cc3af2713c0cf35c5d4e24d005f376d53e9da869b184b06b4fb
decisionInputSha256 = 58c8a2f6422135073bb4cbd5bac985bf1e72e5040b1c285ff5eca3a129523264
```

Production-only candidate mismatch diagnostics were:

```text
T01 = 0
T02 = 0
T03 = 0
```

These zero-mismatch values are **not formal validations** because the mandatory independent-verification gate did not complete as a canonical artifact.

## Independent-verifier failure

The independent verifier ran after production measurement but terminated during formal-result assembly with:

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

The failure occurred in the frozen verifier source after fresh held-out scientific outcome generation had already occurred. The formal workflow therefore did not materialize:

```text
STAGE_2_INDEPENDENT_VERIFICATION.json
STAGE_2_FORMAL_RESULT.json
SHA256SUMS.txt
workflow artifact ZIP
```

The later canonical-hash and artifact-upload steps were skipped.

This is classified as a technical/reproducibility failure, not as a candidate semantic mismatch. The verifier source was not repaired and the same Stage 2 evidence was not rerun for rescue.

## Fail-closed application

Because mandatory global gate S2-G5 was not established as a complete canonical verification result:

```text
all global gates PASS = false
scientific mismatch interpretation authorized = false
```

The frozen global-failure rule therefore determines the final Study closure:

```text
Study = INCONCLUSIVE
T01 = NON-ESTIMABLE
T02 = NON-ESTIMABLE
T03 = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start population dedup = NON-ESTIMABLE
```

No candidate is placed in `NOT-VALIDATED`, because no scientific mismatch decision is authorized under the failed global verification gate.

## Canonicalization boundary

Production-only diagnostics evaluated a bounded source graph of:

```text
states = 6317
edges = 6341
runtime guard hits = 0
max generated orbit size = 4
```

Production reported zero mismatch for its semantic-domain canonicalization diagnostics. This is not sufficient for formal authorization because mandatory independent verification was not canonically completed.

There is also a distinct fixed-start boundary. Production diagnostics reported that none of the three non-identity candidates preserves the standard initial RAW state:

```text
T01 initial RAW preservation = false
T02 initial RAW preservation = false
T03 initial RAW preservation = false
```

No independent standard-start reachability-closure proof was implemented. Therefore this Study authorizes neither scientific-population canonicalization nor symmetry-reduced state counting.

## What this Study does and does not establish

This Study establishes that a prospective representation-first transformation-validation pipeline can reach fresh held-out production measurement under a strict Stage 1 identity firewall, but its mandatory independent formal closure failed technically and must remain non-estimable.

It does **not** establish that the three transforms are false. It also does not formally establish that they are valid, despite production-only zero-mismatch diagnostics.

It does not authorize:

- canonicalization for scientific population identity;
- symmetry-reduced state counting;
- retrofit of symmetry reduction into SSGTC-STUDY1;
- repair or reinterpretation of SIP-STUDY1 or ORISC-STUDY1;
- any change to G2-01 or G2-02;
- public AI engineering changes.

## No-rescue closure

After the fresh Stage 2 production outcome existed, the verifier variable-name defect was known. Under the frozen no-rescue rule, this Study does not fix the verifier and rerun the same formal evidence to obtain a favorable candidate decision.

A future re-examination of these transformation hypotheses must use a new prospective Study ID or explicitly new versioned protocol, a fresh authorization, and fresh formal evidence. The closed G2-03 result remains `INCONCLUSIVE` with all three candidates `NON-ESTIMABLE`.

## Canonical records

- `results/STAGE_2_FORMAL_RESULT.json` — repository-facing fail-closed formal closure
- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json` — failed workflow provenance
- `preregistration/STAGE_2_DECISION_RULE.json` — frozen decision rule
- `preregistration/STAGE_2_AUTHORIZATION.json` — explicit pre-outcome authorization
- `results/STAGE_2_PREFREEZE_MANIFEST.json` — source/firewall freeze
- `REPRODUCIBILITY_INDEX.md` — reproducibility and provenance index
- `CURRENT_STATUS.md` — terminal Study status
- `DECISION_REGISTER.md` — immutable Study decisions

## Final conclusion

**STSCV-STUDY1 is complete with formal decision `INCONCLUSIVE`.**

The three held-out transformation candidates are **`NON-ESTIMABLE`**, not rejected and not validated. Canonicalization and symmetry-reduced scientific population identity remain **not authorized**. The production-only zero-mismatch diagnostics are preserved as bounded non-decisional evidence and are not used to rescue the failed mandatory independent-verification gate.
