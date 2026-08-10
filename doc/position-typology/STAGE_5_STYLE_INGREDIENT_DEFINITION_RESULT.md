# Stage 5 Style Ingredient Definition — Accepted Freeze

Date: 2026-08-10  
Status: **accepted / frozen before held-out generation / not confirmation**

## Accepted artifact

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-ingredient-definition-v1/style-ingredient-definition.json
```

Accepted hash:

```text
b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

The canonical JSON hash was independently recomputed and matched exactly.

## What is frozen

### Namua state-level ingredients

Representation:

```text
namua-role-invariant-continuous-geometry-v1
44 dimensions
```

Frozen components include:

- exact base-field order,
- exact total / absolute-difference field order,
- exact `log1p` field set,
- exact discovery StandardScaler mean / scale / variance,
- exact N-ACT component-field definition,
- exact N-CON component-field definition.

Validation confirmed:

- 44 field-order entries,
- 44 scaler means,
- 44 strictly positive scales,
- 44 variances,
- `variance ~= scale^2` within floating-point tolerance.

Held-out Namua scaler refitting is forbidden.

### Mtaji state-level ingredient

The existing confirmed classifier remains frozen:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

No classifier refit, restandardization, relabeling, or ontology change is authorized.

## Upstream style-coordinate identity

The ingredient artifact points to the already accepted Stage 4 style definition:

```text
styleCoordinateDefinitionHash = 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

No new style coordinate is introduced by this freeze.

## Boundary

This artifact is still discovery-side infrastructure:

- `formalExperiment: false`
- `exploratory: true`
- `confirmationPerformed: false`
- `futureStyleConfirmationSeedsTouched: false`
- `ingredientDefinitionFrozenForPreregistration: true`

It exists solely so the future Stage 5 held-out corpus can be transformed with the exact discovery-side state ingredients.

## Consequence

The previously identified gap is closed. The complete frozen transfer chain is now:

```text
raw held-out state
  -> frozen Namua N-ACT / N-CON state transform
  -> frozen Mtaji M1 / M2 classifier
  -> fixed 10 trajectory descriptors
  -> frozen discovery 10D StandardScaler
  -> frozen canonical STYLE-C1..C4 projection
```

No held-out refit is needed at any stage of the primary frozen projection.
