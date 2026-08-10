# Checkpoint — Stage 5 Continuous Playing-Style Confirmation Preregistration

Date: 2026-08-10  
Status: **formal preregistration complete / held-out generation authorized next / held-out not yet generated**

## Research state frozen at this checkpoint

Stage 4 discovery concluded:

```text
playing-style geometry
= continuous multi-axis trajectory space
!= discrete style-type set in the discovery corpus
```

No discrete style cluster count was promoted.

The exact four-coordinate discovery transform has been accepted:

```text
styleCoordinateDefinitionHash
= 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

The previously missing state-level ingredients have now also been accepted:

```text
styleIngredientDefinitionHash
= b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

The confirmed Mtaji classifier remains:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

## Frozen trajectory coordinates

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

These are continuous trajectory-level descriptors. They are not:

- position types,
- discrete player classes,
- outcome classes,
- AI evaluator/search/depth labels.

## Formal preregistration

ID:

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
```

Machine spec:

```text
doc/position-typology/preregistration/STAGE_5_PLAYING_STYLE_CONFIRMATION_SPEC.json
```

Spec blob after finalization:

```text
e94566e73fdf9dd2d24caae9c42be46538270eb8
```

Spec finalization commit:

```text
be572ec403de30eae2abcefbc319db557d1d78a5
```

Narrative preregistration:

```text
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_PREREGISTRATION.md
```

Runbook:

```text
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_RUNBOOK.md
```

Formal analyzer:

```text
tools/experiments/analyze-position-typology-stage5-style-confirmation.py
```

Analyzer creation commit:

```text
873ef13cc11376ddb6bab83778d18bcfb0f6c35c
```

Formal corpus runner / verifier:

```text
tools/experiments/run-position-typology-stage5-style-confirmation.js
tools/experiments/verify-position-typology-stage5-style-confirmation.js
```

## Held-out corpus fixed before execution

```text
games      = 192
base seed  = 20350001
last seed  = 20350192
conditions = 6 x 32
max ply    = 100
opening    = seeded-uniform legal, first 8 plies
```

Condition assignment is `gameIndex modulo 6`.

At this checkpoint:

```text
future held-out corpus generated = false
future held-out values inspected = false
```

This seed block must not be changed after execution begins.

## Primary gates frozen before held-out generation

### G1

Frozen STYLE-C1..C4 subspace variance ratio:

```text
>= 0.60
```

### G2

Frozen vs held-out de-novo four-dimensional PCA subspace:

```text
maximum principal angle <= 25 degrees
mean principal angle    <= 15 degrees
```

### G3

Behavioral anchors:

```text
C1 vs mtajiM1Fraction              >= 0.35
C2 vs namuaStructuralContrastMean  >= 0.35
C3 vs namuaCaptureActivityTrendRho >= 0.35
C4 vs mtajiTypeSwitchRate          >= 0.35
```

### G4

Eight non-anchor behavioral associations are preregistered. Pass requires:

```text
>= 6 / 8 preserve expected sign with |rho| >= 0.20
and >= 1 qualifying association for every C1..C4
```

### G5

100 deterministic 80%-game subsamples:

```text
p90(max principal angle) <= 30 degrees
random state = 20359999
```

## Technical minimums

```text
full-phase game trajectories >= 144
full-phase trajectories per condition >= 20
full replay verification = passed
```

Integrity / replay / provenance or technical-population failure yields `inconclusive`.

## Formal decision rule

```text
technical gates + G1..G5 all pass -> confirmed
technical gates pass; any G1..G5 fails -> not-confirmed
integrity/replay/provenance or population failure -> inconclusive
```

No secondary diagnostic can rescue or veto this decision.

## No-post-hoc boundary

After held-out generation starts, do not change:

- coordinate count,
- descriptor set,
- Namua state scaler,
- Mtaji classifier,
- Stage 4 style scaler,
- frozen 4x10 component matrix,
- axis orientation,
- G1–G5 thresholds,
- seed block,
- cluster policy.

No discrete-cluster rescue is authorized.

## Unchanged prior decisions

- Study 1 formal decisions remain unchanged.
- Study 1 formal corpus remains outside the current discovery/confirmation evidence.
- Stage 2 Mtaji formal decision remains `confirmed`.
- MTAJI-M1/M2 remain state-level morphologies.
- rejected actor-oriented Mtaji k=2 remains a continuous relational-polarity coordinate.
- Namua k=2/k=4 remain not promoted.
- N-PROG remains progress context, not style.
- AI implementation labels remain metadata only.

## Next action

The next permissible action is the local Stage 5 formal run exactly as specified in:

```text
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_RUNBOOK.md
```
