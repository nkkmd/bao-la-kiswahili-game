# PBAI-P1 — PBAI-C002-v1 Development Authorization

Date: 2026-08-26  
Program: `PBAI-P1`  
Phase: `PBAI-D`  
Decision: **AUTHORIZE DEVELOPMENT AFTER THIS CONTRACT-FREEZE CHANGE IS MERGED**

## Source state

```text
source main = 1cc5377178047e03f9225634c63eae9025480de7
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
candidate implementation observed before decision = 0
candidate outcome observed before decision = 0
Research Generation 2 evidence included = false
```

## Candidate selected

```text
engineering candidate = PBAI-C002-v1
research source = TM-S2-C03
research formal decision = CONFIRMED
```

C03 is used only within its original scientific boundary: a machine-reproducible transferable tactical motif under the frozen research rules/engine/search operationalization. This decision does not create a forced-win, traditional tesuji, human-importance, pedagogical or general Bao claim.

The human/expert validation Study 1 remained `INCONCLUSIVE-NOT-ESTIMABLE (N=0)` and supplies no negative or positive human evidence.

## Exact authorized mechanism

```text
feature flag = pbaiC002C03Ordering
public default = false
mechanism = enhanced-alpha-beta move ordering only
affected public source = public/ai.js only
```

Authorized runtime trigger:

```text
state phase = mtaji
actor reusablePits = number of actor board pits with >=2 seeds = 0..2
minimum legal moveVariants = 2
>=1 legal C03 coarse-family move
>=1 legal non-C03 alternative
C03 family = takata / row 1 / direction right / coarse-no-index
```

The structural research consequence `actorNyumbaSeedsDeltaSign=0` is not a runtime trigger. The paired diagnostic definition is not a runtime trigger.

The C03 ordering priority must be below immediate-win, enabled TT-first and captured-seed ordering. Multiple matching moves receive equal C03 priority; pit index cannot be introduced as a new preference.

## Explicitly not authorized

- selective extension;
- evaluation-score bonus or penalty;
- forced move selection;
- depth-budget change;
- time-budget change;
- persistent table/cache;
- `public/engine.js` change;
- `public/ai-config.js` change;
- UI or public-default activation;
- new static public asset;
- use of Research Generation 2 evidence;
- release-holdout execution;
- `AI-GEN3` promotion.

## Candidate-specific benefit gate

Primary endpoint: fixed-depth D4 search-node efficiency on eligible target roots, feature on versus feature off.

Development/validation:

```text
median node ratio <= 0.95
fraction roots with candidate nodes <= baseline nodes >= 0.55
```

Target-root hard semantic gates:

```text
root-score mismatch = 0
candidate selected move outside frozen D4 reference top set = 0
catastrophic new loss = 0
```

If later authorized, release holdout requires median node ratio `<=0.97` and non-increasing-node fraction `>=0.52` in addition to all global gates.

Negative controls require zero trigger and exact fixed-depth feature-on/off equivalence.

## Cost gate

```text
additional persistent memory = 0 bytes
additional public/ai.js bytes <= 4096
new public assets = 0
```

## No-rescue rule

`PBAI-C002-v1` permits one frozen mechanism version. Candidate outcomes may not be followed by trigger retuning, ordering-position retuning or benefit-threshold retuning under the same version. A materially different proposal requires a new prospectively frozen version/contract.

## Authorization boundary

After this contract-freeze change is merged:

```text
PBAI-C002 = AUTHORIZED-FOR-DEVELOPMENT
AUTHORIZED-FOR-DEVELOPMENT count = 1
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

Implementation must occur on a new isolated branch based on the post-merge `main`. Development results do not authorize validation, holdout, adoption or public deployment.
