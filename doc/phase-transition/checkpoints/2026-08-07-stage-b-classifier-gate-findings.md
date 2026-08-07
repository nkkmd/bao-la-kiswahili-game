# Stage B fixed classifier-gate findings

Date: 2026-08-07
Status: completed retrospective fixed-gate decomposition / non-formal
Branch: `research/forced-capture-regime-analysis`

## Scope and boundary

This checkpoint records a Stage B reconstruction of the already-existing ordered candidate classifier for the fixed E-018, E-019, and E-020 formal corpora.

It does **not** create a new hypothesis or formal experiment, regenerate games, alter any preregistration or decision rule, or independently validate the `capture-branch-expansion` phenotype.

The fixed formal decisions remain unchanged:

- E-018/H16: `confirmed` only for `hard / bao / depth2`;
- E-019/H17: global `not-confirmed`;
- E-020/H18: `confirmed` only for `hard / bao / depth3`.

PR #26 remains open / draft / unmerged.

## Input/result provenance

Local Stage B result reviewed:

- analysis version: `stage-b-classifier-gates-1`
- analysis type: `Stage B retrospective fixed classifier-gate decomposition`
- `generatesGames=false`
- `invokesFormalRunner=false`
- `changesPrimaryDecision=false`
- `resultChosenThresholdsUsed=false`
- `thresholdsArePreExistingClassifierDefaults=true`

Fixed inherited classifier defaults:

- `eventWindow = 8`
- `expansionDelta = 3`
- `persistenceFraction = 0.5`

All six conditions exactly reconstruct their recorded expansion rows/games within the selected `namua × inside-regime` context, and all six preserve the fixed formal primary expansion-game counts.

## Primary comparable context

The fixed gate analysis uses:

`eligible candidate AND phaseAtCandidate=namua AND regimeId present`

Within this context the final expansion-compatible rates are:

| comparison | P2 | LG | direction |
|---|---:|---:|---|
| E-018 D2 | 63/77 = 81.82% | 9/46 = 19.57% | P2 > LG |
| E-019 D3 | 13/68 = 19.12% | 140/175 = 80.00% | LG > P2 |
| E-020 D3 | 18/73 = 24.66% | 129/157 = 82.17% | LG > P2 |

Thus the D2/D3 reversal remains after conditioning on the coarse recorded phase and forced-capture-regime context.

This rules out an explanation based only on the fraction of candidates that are in `namua` or inside a forced-capture regime.

## Sequential gate survival

The classifier gate order is inherited from the existing implementation:

1. survive the near-`mtaji` precursor gate;
2. survive the near-forcing-release gate;
3. pass `captureDelta >= 3`;
4. pass `postPersistenceFraction >= 0.5`.

Conditional survival from the immediately preceding gate is:

| condition | mtaji gate | forcing-release gate | capture-delta gate | persistence gate |
|---|---:|---:|---:|---:|
| E-018 D2 P2 | 88.3% | 100.0% | 97.1% | 95.5% |
| E-018 D2 LG | 50.0% | 78.3% | 94.4% | 52.9% |
| E-019 D3 P2 | 61.8% | 59.5% | 84.0% | 61.9% |
| E-019 D3 LG | 97.1% | 96.5% | 88.4% | 96.6% |
| E-020 D3 P2 | 65.8% | 64.6% | 87.1% | 66.7% |
| E-020 D3 LG | 93.0% | 97.9% | 91.6% | 98.5% |

The key replicated D3 pattern is therefore not a single amplitude gate. P2 loses heavily before the capture-delta threshold, particularly at the near-`mtaji` and near-forcing-release gates, and then loses again at persistence. LG survives all three temporal/persistence stages at very high rates.

D2 shows the opposite ordering: P2 survives the temporal gates and persistence gate much better than LG.

## Multiplicative gate decomposition

Because the final within-context expansion-compatible rate is the product of the four sequential conditional survival rates, the profile contrast can be factorized descriptively into fixed-gate ratios.

### E-018 D2 — P2/LG

Gate-specific survival ratios:

- near-`mtaji`: 1.766
- forcing-release: 1.278
- capture-delta: 1.028
- persistence: 1.803

Product: `4.1818`, matching the final P2/LG within-context expansion-compatible risk ratio.

On a log-ratio arithmetic decomposition, the approximate shares are:

- near-`mtaji`: 39.8%
- forcing-release: 17.1%
- capture-delta: 1.9%
- persistence: 41.2%

### E-019 D3 — P2/LG

Gate-specific survival ratios:

- near-`mtaji`: 0.636
- forcing-release: 0.617
- capture-delta: 0.950
- persistence: 0.641

Product: `0.2390`, matching the final P2/LG within-context risk ratio.

Approximate log-ratio shares:

- near-`mtaji`: 31.6%
- forcing-release: 33.7%
- capture-delta: 3.6%
- persistence: 31.1%

### E-020 D3 — P2/LG

Gate-specific survival ratios:

- near-`mtaji`: 0.707
- forcing-release: 0.659
- capture-delta: 0.951
- persistence: 0.677

Product: `0.3001`, matching the final P2/LG within-context risk ratio.

Approximate log-ratio shares:

- near-`mtaji`: 28.8%
- forcing-release: 34.6%
- capture-delta: 4.2%
- persistence: 32.4%

These shares are arithmetic factorization only, not causal mediation fractions.

## Mechanism implication

The fixed-gate decomposition strongly constrains the Stage B working explanation.

A simple instantaneous-amplitude mechanism is not supported as the principal discriminator:

- the `captureDelta >= 3` gate contributes only a small part of the profile contrast in D2 and both D3 corpora;
- the largest separations occur at temporal-position gates (`mtaji` proximity and forcing-release proximity) and at the persistence gate.

Combined with the earlier morphology result that the favored profile is associated with longer forced-capture regimes and earlier normalized position within those regimes, the most coherent current working model is:

> Search profile and depth alter where candidates occur within the lifecycle of a forced-capture regime. Expansion-compatible candidates are preferentially located away from imminent `mtaji` transition and forcing release and in contexts that can sustain elevated capture branching. The profile occupying this sustained-forcing window is P2 at depth2 and LG at depth3.

This remains retrospective and descriptive. It does not establish causal mediation, a general depth interaction, or a search-tree mechanism.

## What this analysis does and does not explain

Supported as a Stage B secondary constraint:

- coarse phase/regime composition alone is insufficient;
- the D3 LG-over-P2 within-context conversion advantage replicates in E-019 and E-020;
- the D2 P2-over-LG contrast shows the opposite gate-survival ordering;
- temporal placement relative to `mtaji`/forcing release and persistence are much more discriminating than the capture-delta gate itself.

Not established:

- why search depth changes which profile reaches those contexts;
- whether the effect is caused by horizon behavior, evaluator behavior, or internal search-tree dynamics;
- a general search-profile × depth interaction;
- any causal effect of regime length or normalized position.

## Next operation

Before closing Stage B, complete the preregistered/design-specified trajectory/ply duplication check with the same definition across E-018 D2, E-019 D3, and E-020 D3.

Do not rerun games. Prefer reading the already-produced structural-secondary JSON files from the final formal archives.

The purpose is to verify that the D2 and D3 manifestation directions remain after trajectory-ply deduplication and are not artifacts of repeated identical trajectory/ply candidate instances.

After that check, Stage B can be synthesized without introducing result-chosen continuous B5 cut points. Any stronger claim about causal depth/profile interaction or search-tree mediation would require a new separately governed study.