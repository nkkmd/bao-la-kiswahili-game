# Stage B categorical subgroup findings

Date: 2026-08-07
Status: completed retrospective categorical subgroup decomposition / non-formal
Branch: `research/forced-capture-regime-analysis`

## Boundary

This checkpoint records a secondary Stage B analysis of the already-fixed E-018, E-019, and E-020 formal-analysis outputs.

It does not:

- create a new formal experiment or hypothesis;
- regenerate or overwrite a formal corpus;
- alter preregistration, seed blocks, execution locks, or decision rules;
- change any formal primary decision;
- establish causal mediation or a general search-profile-by-depth interaction.

The fixed formal decisions remain unchanged:

- E-018/H16: `confirmed` only for `hard / bao / depth2`;
- E-019/H17: global `not-confirmed`;
- E-020/H18: `confirmed` only for `hard / bao / depth3`.

PR #26 remains open / draft / unmerged.

## Input provenance

Analyzer:

- `tools/experiments/analyze-phase-transition-stage-b-subgroups.js`
- analysis version: `stage-b-subgroups-1`

Reviewed local result:

- `stage-b-subgroup-summary.json`
- SHA-256: `fa539d0e386fc7bdbdaf85494990f2ea28ac88fdf64b68b6c8786cd33ddd6f5e`
- size: 43,612 bytes

The six candidate-control input SHA-256 values exactly match those used in the first Stage B mechanism decomposition.

All six fixed primary expansion-game count guards pass:

| condition | expected | observed |
|---|---:|---:|
| E-018 D2 P2 | 63 | 63 |
| E-018 D2 LG | 9 | 9 |
| E-019 D3 P2 | 13 | 13 |
| E-019 D3 LG | 140 | 140 |
| E-020 D3 P2 | 18 | 18 |
| E-020 D3 LG | 129 | 129 |

No result-selected continuous cut point is used in this analysis.

## Main result: the profile contrast survives categorical context restriction

The strongest directly comparable recorded context is:

`phaseAtCandidate = namua` AND `regimeMembership = inside-regime`

Within this same categorical context, the profile ordering remains large and reverses between D2 and D3 exactly as the formal event-rate ordering does.

| comparison | P2 expansion rate | LG expansion rate | favored profile | favored/unfavored RR |
|---|---:|---:|---|---:|
| E-018 D2 | 63/77 = 0.8182 | 9/46 = 0.1957 | P2 | 4.1818 |
| E-019 D3 | 13/68 = 0.1912 | 140/175 = 0.8000 | LG | 4.1846 |
| E-020 D3 | 18/73 = 0.2466 | 129/157 = 0.8217 | LG | 3.3323 |

Thus the D3 LG-over-P2 conversion advantage is not removed by restricting analysis to candidates that are both:

1. in `namua`; and
2. inside a recorded forced-capture regime.

Likewise, E-018 D2 shows the opposite P2-over-LG ordering inside the same categorical context.

This materially narrows the Stage B mechanism question. A simple explanation based only on different proportions of `mtaji` candidates or candidates outside forced-capture regimes is insufficient.

## Replication across the two D3 corpora

The within-context D3 result is independently reproduced in E-019 and E-020:

- E-019: LG 80.0% versus P2 19.1%;
- E-020: LG 82.2% versus P2 24.7%.

The absolute rates and direction are closely aligned despite independent seed blocks and the different formal role of E-019 versus E-020.

This is a replicated secondary morphology result. It is not a new formal confirmation.

## Phase result

Across all six conditions:

- no `mtaji` candidate is classified as `capture-branch-expansion`;
- all observed expansion candidates occur in `namua`.

However, phase should not be interpreted as an independent causal predictor. The existing classifier gives `namua-to-mtaji-precursor` precedence when a `namua` candidate is within the fixed event window of transition to `mtaji`.

Therefore the next analysis must explicitly respect the classifier's ordered decision gates rather than treating phase and expansion classification as statistically independent variables.

## Forced-capture / regime-membership result

Across all six conditions:

- every observed expansion candidate is inside a recorded forced-capture regime;
- no observed outside-regime candidate is classified as expansion.

The D3 contrast remains large even after restricting to inside-regime candidates:

- E-019 inside-regime: P2 14.1% versus LG 72.2%;
- E-020 inside-regime: P2 18.4% versus LG 73.7%.

E-018 D2 reverses:

- P2 61.8% versus LG 17.6%.

Again, regime membership itself must not be overinterpreted as an independent mechanism. The classifier gives a near-forcing-release condition precedence over the expansion branch, so classifier gate structure and forcing morphology are linked by construction.

## Interpretation update

The previous working model survives and becomes more specific:

> The D2/D3 reversal is not primarily a coarse candidate-pool composition effect based on phase or forced-capture membership. The decisive difference remains among candidates already occupying the same broad `namua × forced-capture-regime` context. The next mechanism target is therefore the internal morphology and classifier-gate passage of those candidates: distance from `mtaji` transition, distance from forcing release, capture-branch increase, and persistence.

Important qualification:

- some of these quantities are part of the fixed classification rule itself;
- they can explain **where the fixed classifier separates the profile-specific candidate pools**, but must not be presented as independent validation of the expansion phenotype;
- non-classifier morphology such as regime length and normalized regime position remains especially important for any explanatory interpretation beyond classifier reconstruction.

## Next Stage B operation: fixed classifier-gate decomposition

Before new games or new instrumentation, decompose existing `namua × inside-regime` candidate rows through the exact pre-existing classifier order:

1. near `mtaji` transition: `distanceToMtaji <= 8`;
2. near forcing release: `distanceToForcingRelease <= 8`;
3. sufficient branch increase: `captureDelta >= 3`;
4. sufficient persistence: `postPersistenceFraction >= 0.5`;
5. resulting `capture-branch-expansion` classification.

These thresholds are not new Stage B choices. They are the already-fixed classifier defaults in `tools/experiments/lib/forced-capture-regimes.js`.

For each condition report:

- candidate rows and unique games entering the `namua × inside-regime` context;
- count removed at each ordered classifier gate;
- count surviving each gate;
- final expansion-compatible count;
- consistency with the recorded `capture-branch-expansion` classification.

Primary question:

> Which fixed classifier gate accounts for the large within-context P2/LG conversion difference, and does that gate ordering reverse between E-018 D2 and both D3 corpora?

This remains a deterministic, read-only, retrospective, non-formal analysis of existing corpus outputs.