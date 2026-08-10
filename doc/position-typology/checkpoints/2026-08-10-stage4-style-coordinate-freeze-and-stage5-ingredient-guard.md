# Checkpoint — Stage 4 style coordinate freeze accepted / Stage 5 ingredient guard

Date: 2026-08-10

## Accepted Stage 4 coordinate definition

```text
styleCoordinateDefinitionHash = 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

The uploaded artifact was independently checked for:

- exact canonical JSON hash,
- 10-dimensional descriptor order,
- scaler dimensions and positive scales,
- scale/variance consistency,
- four canonical 10D PCA components,
- positive declared behavioral-anchor loadings,
- source Stage 2 / Stage 3 / Stage 4 hashes,
- future style-confirmation seeds untouched.

Accepted frozen coordinates:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

The Stage 4 discrete k=2..6 probes remain non-promoted.

## Stage 5 pre-heldout design choices already fixed

Future seed block selected before held-out generation:

```text
20350001..20350192
192 games
6 conditions x 32 games
```

Primary confirmation concept:

1. frozen 4D subspace variance retention,
2. frozen-vs-de-novo 4D principal-subspace alignment,
3. behavioral-anchor reproduction,
4. prespecified non-anchor behavioral signature reproduction,
5. game-subsample subspace robustness.

No cluster rescue is authorized.

## Additional dependency discovered before held-out generation

Stage 4 game descriptors depend on Stage 3 `N-ACT` / `N-CON`, but the Stage 3 audit did not serialize the exact discovery-side 44D StandardScaler arrays.

Decision:

> Do not refit that scaler on Stage 5 held-out data. Freeze the exact discovery-side state transform first.

Added exporter:

```text
tools/experiments/export-position-typology-stage5-style-ingredient-definition.py
```

Expected artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-ingredient-definition-v1/style-ingredient-definition.json
```

## Formal-run guard

The Stage 5 machine spec is intentionally held in draft state:

```text
status = draft-pending-style-ingredient-freeze
formalExperiment = false
formalRunAuthorized = false
coordinateIngredients.requiredHash = null
```

Therefore no Stage 5 formal game generation is authorized at this checkpoint.

After the ingredient-definition artifact is inspected, its hash will be frozen into the spec and only then will the formal preregistration checkpoint be completed.

## Boundaries unchanged

- Study 1 formal decisions remain unchanged.
- Stage 2 Mtaji confirmation remains `confirmed`.
- MTAJI-M1/M2 ontology remains unchanged.
- Namua remains continuous-coordinate representation; no discrete Namua type is rescued.
- Playing style remains trajectory-level, not state-level.
- AI implementation labels remain metadata, not playing-style names.
- No held-out Stage 5 style data have been generated or inspected.
