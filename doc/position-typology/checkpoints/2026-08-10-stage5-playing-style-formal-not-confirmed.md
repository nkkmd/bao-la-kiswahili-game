# Checkpoint — Stage 5 Playing-Style Formal Result

Date: 2026-08-10  
Status: **formal decision = not-confirmed**

## Formal experiment

Preregistration:

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
```

Frozen definitions:

```text
styleCoordinateDefinitionHash = 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
styleIngredientDefinitionHash = b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
mtajiCandidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Formal result:

```text
resultHash = 6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
formalDecision = not-confirmed
```

The result artifact canonical hash was independently recomputed and matched exactly.

## Population and integrity

```text
games generated = 192
full-phase trajectories = 176
technical minimum trajectories = 144
minimum per condition = 20
```

Condition full-phase counts:

```text
B-D1  27
B-D2  32
B-D3  30
LS-D2 28
V2-D2 31
LE-D2 28
```

All technical gates passed, including full replay verification.

The formal transfer records no discovery refit, no Namua scaler refit, no Mtaji classifier refit, no style scaler/PCA refit for frozen projection, no cluster search, and no post-hoc rescue.

## Primary gates

```text
G1 frozen subspace variance              PASS  0.69823 >= 0.60
G2 de-novo subspace alignment            FAIL
   maximum principal angle = 34.1058° > 25°
   mean principal angle    = 15.7369° > 15°
G3 four behavioral anchors               PASS
G4 non-anchor signatures                 PASS  7/8, >=1 per coordinate
G5 trajectory-resample subspace stability FAIL
   p90(max principal angle) = 48.8193° > 30°
```

Because technical gates passed and at least one primary gate failed, the preregistered formal decision is `not-confirmed`.

## Interpretation boundary fixed here

The following remains fixed:

- position type and playing style are separate concepts,
- MTAJI-M1/M2 remain formally confirmed state-level position morphologies,
- Namua remains represented by exploratory continuous coordinates rather than rescued discrete types,
- Stage 4 discrete playing-style clusters remain unsupported,
- STYLE-C1..C4 remain discovery-derived exploratory trajectory descriptors,
- the exact four-dimensional PCA playing-style geometry is **not confirmed**,
- passing G1/G3/G4 does not rescue the failed overall confirmation,
- AI/search/evaluator/depth condition labels remain metadata only,
- no result-dependent coordinate-count, preprocessing, threshold, or cluster rescue is permitted.

The appropriate synthesis is:

> Behavioral associations of the frozen trajectory coordinates substantially replicated, but the exact four-dimensional PCA subspace lacked the preregistered independent alignment and resampling stability required for confirmation.

## Next research boundary

The next substantive phase is the original plan's cross-study relation to closed phase-transition Study 1.

That work is secondary / hypothesis-generating and must:

1. leave every Study 1 formal decision unchanged,
2. leave Stage 5 `not-confirmed` unchanged,
3. treat confirmed MTAJI-M1/M2 as the strongest current position-level vocabulary,
4. treat Namua continuous coordinates and STYLE-C1..C4 as exploratory when used at all,
5. not use cross-study associations to retroactively confirm the failed style geometry.
