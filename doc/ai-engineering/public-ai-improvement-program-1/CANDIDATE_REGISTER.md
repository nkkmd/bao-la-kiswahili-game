# PBAI-P1 Candidate Register

Status: **PBAI-C GLOBAL GATES FROZEN / PBAI-C002-v1 CONTRACT FROZEN / ONE CANDIDATE AUTHORIZED FOR DEVELOPMENT**

Canonical global gate spec:

```text
PBAI-C-GLOBAL-GATES-2026-08-26-v1
```

Canonical first candidate contract:

```text
candidates/PBAI-C002-v1.json
```

Candidate status vocabulary:

```text
PROPOSED
EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT
DEVELOPMENT-ONLY
VALIDATION-READY
RELEASE-CANDIDATE
ADOPTED
REJECTED
HOLD
WITHDRAWN
```

## Candidate states after PBAI-D contract freeze

| ID | Candidate family | Research Generation 1 evidence basis | Current status | Key constraint / risk |
| --- | --- | --- | --- | --- |
| `PBAI-C001` | Phase / morphology-aware search or evaluation | bounded phase/search dependence; confirmed `MTAJI-M1/MTAJI-M2` morphology | `EVIDENCE-AUDIT-READY` | no implementation while C002 is active; a later exact contract must choose one mechanism |
| `PBAI-C002` | `TM-S2-C03`-aware move ordering | `TM-S2-C03` machine-confirmed motif | `AUTHORIZED-FOR-DEVELOPMENT` | v1 is move-ordering-only; no extension, evaluation bonus, forced move, depth/time-budget change, human/traditional claim |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | frozen exact 8-state domain plus ORISC RAW-binding constraints | `EVIDENCE-AUDIT-READY` | no implementation while C002 is active; strict RAW key including `pending` remains mandatory |
| `PBAI-C004` | Search-instability-aware selective deepening | reproducible adjacent-depth instability / reply-pressure evidence | `EVIDENCE-AUDIT-READY` | no implementation while C002 is active; production trigger must be a new engineering construct |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE`; score is not validated probability | `EVIDENCE-AUDIT-READY` | no implementation while C002 is active; no score→win-probability mapping |

## PBAI-C002-v1 exact authorization

`PBAI-C002-v1` is the only candidate authorized for development. Authorization begins only after the contract-freeze PR is merged to `main`.

Research source:

```text
Tactical Motifs / Tesuji Study 1
TM-S2-C03 = CONFIRMED
canonical candidate key = 7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba
```

Frozen research definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move abstraction = takata / row 1 / direction right / coarse-no-index
structural consequence = actorNyumbaSeedsDeltaSign=0
```

The engineering trigger uses only the frozen phase/precondition/move-family representation. The structural consequence is **not** evaluated to decide whether the runtime trigger fires.

### v1 mechanism

```text
feature flag = pbaiC002C03Ordering
public default before adoption = off
mechanism = enhanced-alpha-beta move ordering only
selective extension = prohibited
evaluation bonus = prohibited
forced move = prohibited
search-depth budget change = prohibited
time-budget change = prohibited
persistent table/cache = prohibited
public source surface allowed = public/ai.js only
```

C03 priority is placed only after immediate-win, enabled TT-first preference and captured-seed ordering. It may not override those stronger existing ordering classes. Multiple coarse-family matching moves receive equal C03 priority; pit index may not be added as a new preference.

### Target population and benefit gate

Candidate-local target roots are selected from the already frozen PBAI-C decision-quality populations using the existing outcome/value-blind deterministic order.

Eligibility:

```text
nonterminal
minimum 2 legal moveVariants
phase = mtaji
actor reusablePits = 0..2
>=1 legal C03 coarse-family move
>=1 legal non-C03 alternative
```

Target roots:

```text
development = 64, minimum estimable 48
validation = 128, minimum estimable 96
release holdout = 256, minimum estimable 192
```

Primary intended benefit:

```text
fixed-depth D4 paired feature-on/off node efficiency on target roots

development:
  median nodes(on/off) <= 0.95
  fraction roots candidate nodes <= baseline nodes >= 0.55

validation:
  median nodes(on/off) <= 0.95
  fraction roots candidate nodes <= baseline nodes >= 0.55

release holdout:
  median nodes(on/off) <= 0.97
  fraction roots candidate nodes <= baseline nodes >= 0.52
```

Semantic safety on every target root requires:

```text
root-score mismatch = 0
candidate selected move outside frozen D4 reference top set = 0
catastrophic new loss = 0
```

Global PBAI-C strength / decision / operational / correctness gates remain mandatory and cannot be relaxed by this candidate-specific benefit result.

### Negative controls

Development/validation/holdout negative controls include:

```text
Namua roots
Mtaji roots with reusablePits >= 3
```

Feature-on must produce trigger count 0 and exact feature-off fixed-depth move/root-score/search-counter equivalence on every negative-control root.

### Cost budget

```text
additional persistent memory = 0 bytes
additional public/ai.js bytes <= 4096
new public asset = prohibited
```

### No-rescue / holdout firewall

```text
PBAI-C002-v1 mechanism versions allowed = 1
post-outcome trigger retuning = prohibited
post-outcome ordering-position retuning = prohibited
post-outcome benefit-threshold retuning = prohibited
release holdout execution = NOT-AUTHORIZED
```

Release holdout remains blocked until implementation is complete, fresh validation passes, the candidate source/config hash is frozen, and an explicit PBAI-F authorization is recorded.

## Cross-candidate constraints

- all candidates compare against `AI-GEN2-BASELINE-2026-08-26-v1`;
- all candidates remain subject to `PBAI-C-GLOBAL-GATES-2026-08-26-v1`;
- Research Generation 2 outcomes are excluded from PBAI-P1;
- authoritative research-derived RAW identity includes `pending` and cannot be replaced by current `AI.stateKey`;
- unvalidated symmetry/canonicalization is prohibited;
- machine motif/search findings may not be represented as human difficulty, human error, traditional tesuji recognition, forced win or validated win probability;
- combined candidate mechanisms require a new candidate ID after component ablation.

Current authorization state:

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = true
PBAI-C003 authorized = false
PBAI-C004 authorized = false
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 1
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

`AUTHORIZED-FOR-DEVELOPMENT` is not validation, release, adoption or `AI-GEN3` promotion. The next permitted operation is an isolated `PBAI-C002-v1` implementation with the feature default off.
