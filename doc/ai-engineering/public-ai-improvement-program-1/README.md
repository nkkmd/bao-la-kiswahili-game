# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** PBAI-A/B/C COMPLETE / **PBAI-D PBAI-C002-v1 CONTRACT FROZEN** / one development candidate authorized after merge / no public AI implementation change yet

## 1. Purpose and separation

PBAI-P1はcompleted **Research Generation 1**をengineering inputとしてpublic Bao AIのcandidateを設計・比較・検証するengineering programである。Engineering outcomeによって既存研究のformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更しない。Research Generation 2 outcomeはPBAI-P1へ逐次流入させない。

## 2. Canonical identities

```text
current public lineage = AI-GEN2
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
first frozen candidate contract = PBAI-C002-v1
next adopted public lineage reserved = AI-GEN3
```

`AI-GEN3`はcandidate authorization、development、validation、release-candidate作成だけでは付与しない。Explicit `ADOPT` + actual public-default deployment後のみpromotionする。

## 3. Completed prerequisite phases

### PBAI-A — evidence audit

14-Study Research Generation 1 evidence core、E1/E2/E3/E4 engineering use、prohibited inference、Research Generation 2 exclusion、RAW identity boundaryをfreezeした。

Canonical: [`GENERATION_1_EVIDENCE_AUDIT.md`](GENERATION_1_EVIDENCE_AUDIT.md)

### PBAI-B — exact AI-GEN2 baseline

```text
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
baseline public-source commit = f4ae3b11901180cbe417b3e643e2b357d8045d2d
```

Exact source hashes、rules binding、evaluation/search/config、Worker/fallback、PWA/cache semanticsをfreezeした。

Canonical:

- [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
- [`baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`](baselines/AI-GEN2-BASELINE-2026-08-26-v1.json)

### PBAI-C — global engineering gates

Candidate implementation/outcomeが0の状態でstrength / decision-quality / operational / correctness / holdout gatesをfreezeした。

Canonical:

- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
- [`benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json)

Release-holdout ranges are frozen but execution remains **NOT-AUTHORIZED**.

## 4. PBAI-D — first exact candidate contract

Canonical contract:

[`candidates/PBAI-C002-v1.json`](candidates/PBAI-C002-v1.json)

Research source:

```text
Tactical Motifs / Tesuji Study 1
TM-S2-C03 = CONFIRMED
phase = mtaji
precondition = reusablePits=0-2
move abstraction = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

The human/expert follow-up was `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`. Therefore C03 remains a machine-reproducible motif under its frozen operationalization, not a traditional/expert/human/pedagogical claim.

### Authorized v1 mechanism

```text
candidate = PBAI-C002-v1
feature flag = pbaiC002C03Ordering
public default before adoption = off
mechanism = enhanced-alpha-beta move ordering only
allowed public source surface = public/ai.js
```

Explicitly prohibited in v1:

```text
selective extension
evaluation bonus
forced move
depth/time-budget change
persistent table/cache
pit-index preference inside the coarse C03 family
```

The runtime trigger uses the frozen phase/precondition/coarse move family only. The research consequence is not used to decide whether the trigger fires.

C03 priority may not override immediate-win ordering, enabled TT-first preference or captured-seed ordering.

### Candidate-specific benefit gate

On eligible target roots, fixed-depth D4 feature-on/off comparison must show search-node efficiency while preserving D4 semantics.

Development and validation:

```text
median nodes(on/off) <= 0.95
fraction roots candidate nodes <= baseline nodes >= 0.55
root-score mismatches = 0
selected move outside frozen D4 top set = 0
catastrophic new losses = 0
```

Release holdout, if later explicitly authorized:

```text
median nodes(on/off) <= 0.97
fraction roots candidate nodes <= baseline nodes >= 0.52
```

Global PBAI-C gates remain mandatory and cannot be relaxed.

Negative-control roots (Namua and Mtaji reusablePits>=3) must show zero candidate trigger and exact fixed-depth feature-on/off equivalence.

### Candidate cost / no-rescue

```text
additional persistent memory = 0
additional public/ai.js bytes <= 4096
new public asset = prohibited
PBAI-C002-v1 mechanism versions = 1
post-outcome trigger/order/threshold retuning = prohibited
```

## 5. Program flow

```text
PBAI-A  Research Generation 1 evidence audit                 COMPLETE
PBAI-B  AI-GEN2 exact public baseline freeze                 COMPLETE
PBAI-C  global numeric benchmark/release-gate freeze         COMPLETE
PBAI-D  PBAI-C002-v1 exact contract + development auth       FROZEN
PBAI-E  isolated PBAI-C002-v1 development / ablation         NEXT AFTER CONTRACT MERGE
PBAI-F  fresh validation + conditional holdout authorization
PBAI-G  final regression / operational gate
PBAI-H  staged public deployment / keep-or-rollback
```

## 6. Current authorization boundary

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = true after contract merge
PBAI-C003 authorized = false
PBAI-C004 authorized = false
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 1 after contract merge
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
public deployments caused by PBAI-P1 = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

The contract-freeze change itself may not contain `public/` implementation edits. After merge, the next permitted operation is an isolated PBAI-C002-v1 development branch with the feature default off.

Failure, non-estimability or lack of practical benefit are valid outcomes; `KEEP-AI-GEN2` remains an acceptable Program result.
