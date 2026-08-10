# Checkpoint — Stage 5 Formal Run Authorized

Date: 2026-08-10  
Status: **all discovery transforms frozen / formal preregistration complete / held-out run now authorized**

This checkpoint is the final repository-side pause point before generation of the Stage 5 held-out corpus.

## Frozen identities

```text
preregistrationId
= PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1

styleCoordinateDefinitionHash
= 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc

styleIngredientDefinitionHash
= b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da

mtajiCandidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Machine preregistration spec blob:

```text
e94566e73fdf9dd2d24caae9c42be46538270eb8
```

## Frozen held-out block

```text
20350001..20350192
192 games
6 conditions x 32
```

At the time this checkpoint is written:

```text
held-out generation performed = false
held-out result inspected = false
```

## Frozen primary analysis

The complete primary transfer chain is fixed before data generation:

```text
raw state
 -> frozen 44D Namua state scaler -> N-ACT / N-CON
 -> frozen confirmed Mtaji classifier -> MTAJI-M1 / MTAJI-M2
 -> fixed 10 trajectory descriptors
 -> frozen Stage 4 10D scaler
 -> frozen canonical 4x10 projection
 -> STYLE-C1..C4
```

Formal G1–G5 and their thresholds are fixed in the machine spec and narrative preregistration. No cluster confirmation or cluster rescue is authorized.

## Formal implementation

```text
tools/experiments/run-position-typology-stage5-style-confirmation.js
tools/experiments/verify-position-typology-stage5-style-confirmation.js
tools/experiments/analyze-position-typology-stage5-style-confirmation.py
```

The analyzer independently verifies embedded hashes for the style-coordinate definition, style-ingredient definition, and Mtaji candidate definition before evaluating held-out data. The machine-spec file SHA binds the frozen ingredient identity into corpus provenance.

## Decision boundary

```text
technical + G1..G5 all pass -> confirmed
technical pass, any G1..G5 fail -> not-confirmed
integrity/replay/provenance/population failure -> inconclusive
```

No post-hoc feature, threshold, coordinate-count, axis-orientation, seed-block, or clustering change may rescue a failed result.

## Unchanged interpretation boundaries

- position type remains state-level.
- playing style remains trajectory/policy-level.
- MTAJI-M1/M2 remain confirmed state morphologies, not styles.
- Namua remains continuous-coordinate represented; k=2/k=4 remain not promoted.
- actor-oriented Mtaji k=2 remains a continuous relational-polarity coordinate.
- AI implementation labels remain metadata only.
- Study 1 formal decisions remain unchanged.

## Authorized next action

Execute only the local workflow in:

```text
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_RUNBOOK.md
```
