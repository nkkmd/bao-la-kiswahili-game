# Stage B classification-circularity guard

Date: 2026-08-07
Status: active interpretation guard / non-formal
Branch: `research/forced-capture-regime-analysis`

## Purpose

This checkpoint refines the interpretation of the Stage B B1-B4 first-pass mechanism summary without changing any recorded values or formal decisions.

The first-pass checkpoint correctly reports morphology differences, but several candidate metrics are also inputs to the existing candidate-classification rule. They therefore must not be presented as independent explanatory mediators of the `capture-branch-expansion` classification.

## Classification-linked variables

The existing `classifyCandidate()` logic uses, in order:

1. `phaseAtCandidate === "namua"` together with `distanceToMtaji <= eventWindow` for `namua-to-mtaji-precursor`;
2. `distanceToForcingRelease <= eventWindow` for `forcing-release-precursor`;
3. `captureDelta >= expansionDelta` together with `postPersistenceFraction >= persistenceFraction` for `capture-branch-expansion`;
4. `captureDelta <= convergenceDelta` for `capture-branch-convergence`.

Therefore:

- `captureDelta` is directly classification-defining;
- `postPersistenceFraction` is directly classification-defining for expansion versus temporary spike;
- `distanceToForcingRelease` is classification-linked through precursor precedence;
- `phaseAtCandidate` is classification-linked together with `distanceToMtaji`;
- `candidateCaptureMoveCount` contributes mechanically to `captureDelta` and is not fully independent of the classification signal.

These variables remain valid descriptive summaries of the candidate pools, but their association with expansion manifestation is partly or directly definitional.

## Higher-priority non-circular structural variables

For mechanism discrimination, prioritize variables that are not themselves thresholds in the classification rule:

- `regimeLength`;
- `positionInRegime`;
- `normalizedPositionInRegime`;
- recorded regime membership (`regimeId` present/absent);
- `recoveryDistance`;
- broader candidate-pool composition across existing categorical contexts;
- trajectory duplication and deterministic board-state structure where reconstructable from the locked corpus.

`postCaptureMax`, `preCaptureMean`, and related branch summaries may be useful, but must be interpreted with awareness that they are correlated with derived classification quantities.

## Revised interpretation of the first-pass result

The strongest non-circular observation currently available is not that persistence or capture delta "causes" expansion. It is that the profile with the higher expansion-game rate also places eligible candidates in a markedly different **forced-capture regime topology**:

- E-018 D2 P2 candidates occur in longer regimes and earlier normalized positions than D2 LG candidates;
- E-019 D3 and E-020 D3 independently show the opposite ordering, with LG candidates in much longer regimes and much earlier normalized positions than P2 candidates.

This regime-topology ordering follows the observed profile ordering in all three comparisons and is not part of the expansion classification threshold itself.

That makes regime topology a higher-priority Stage B mechanism candidate than the classification-linked `captureDelta` or `postPersistenceFraction` differences.

## Next analysis guard

The categorical subgroup analysis should proceed using existing recorded categories only:

- phase;
- forced-capture status;
- regime membership;
- phase × regime membership.

Its purpose is not to prove mediation. Its purpose is to determine whether the P2/LG conversion contrast persists after comparing candidates in the same coarse recorded context.

No new game generation is authorized by this checkpoint. No formal hypothesis is created. E-018/H16, E-019/H17, and E-020/H18 remain unchanged.