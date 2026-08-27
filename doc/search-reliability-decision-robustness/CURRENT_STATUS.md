# SRDR-STUDY1 — Current Status

更新日: 2026-08-27

## Status

**STUDY ACTIVE / STAGE 0 TECHNICAL PASS / PRE-SCIENTIFIC-GENERATION / STAGE 1 NOT AUTHORIZED / STAGE 2 NOT AUTHORIZED**

## Identity

```text
Program = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Formal title = Search Reliability / Decision Robustness Study 1
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Research branch = research/g2-02-search-reliability-decision-robustness
Draft PR = #68
```

## Repository-start audit

```text
remote main = db6980bffb7e6853751914da628db8936c76d81e
expected prior main = db6980bffb7e6853751914da628db8936c76d81e
match = true
open PRs at study start = 0
active competing Research Generation 2 PRs = 0
```

Residual G2-01 branches were audited and are behind `main` with `ahead_by = 0`; they contain no unintegrated active research work.

## Stage state

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
          PASS
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
          NOT AUTHORIZED
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
          NOT AUTHORIZED
```

## Stage 0 provenance

```text
spec SHA-256 = 12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
authorization SHA-256 = 59be5113a3e2bb89a7ea8791be2c4a282f3ad726afebbe8496ef2af01a6a9e5e
source-freeze workflow run = 33061797905
technical workflow run = 33061951566
technical execution commit = 93f46db6afda7ec864a0699f4bf2f2efe62183e7
artifact ID = 9642069374
artifact ZIP SHA-256 = 16b3f6591cd7133a59f876f357b9ff0cb30b337b18dae18d84bd727e4971cf2e
artifact JSON SHA-256 = ea47cce0ec0ff3716b7e7e9f0c88bda30c28d2bf9f45f4d2d3818eeb64811162
deterministic result hash = 98bd6c67588e33281066a05fd47189e86c6c4fdffa7b2576bd0c6781245fc218
canonical Stage 0 result SHA-256 = 661f34fd972c2ee27840b81a95de99d7e4301c8a9d3442692ae8325e77bfee03
```

Canonical result:

`results/STAGE_0_TECHNICAL_RESULT.json`

## Stage 0 technical findings

The controlled research search instrument passed all Stage 0 gates.

- existing Position Complexity exact diagnostic agreement: all root scores, TopSet and best score matched at initial Namua depths 1/2/3 and a forced-win Mtaji depth 4 fixture;
- authoritative RAW identity and source-state non-mutation passed;
- repeat-run determinism passed;
- dedicated node-budget semantics passed independent verification;
- canonical nominal-PV reconstruction passed independent verification;
- quiescence depth / capture ordering and move ordering are technically measurable;
- 9 frozen measurement-path source SHA-256 values were independently rechecked in CI.

Node-budget semantics are fixed for the technical instrument as:

```text
node-budgeted iterative deepening
use last fully completed all-root-candidate iteration
partial root iteration = discard
PV reconstruction = deterministic postprocessing outside decision node budget
```

On the technical initial-state fixture the standalone node costs were D1=14, D2=46, D3=124. Boundary checks produced 13->non-estimable, 59->D1, 60->D2 and 184->D3 exactly as independently predicted.

Move ordering preserved complete-depth exact root scores on the tested fixture but changed node consumption (engine=46, canonical=46, reverse-canonical=44 at D2). Therefore move ordering must be frozen within any scientific node-budget comparison and cannot be silently changed between conditions.

PV semantics validated for possible promotion are:

```text
canonical-exact-nominal-pv/quiescence-score-only/v1
```

Stage 0 is technical only. These observations are not scientific evidence about Bao position prevalence or reliability rates.

## Immutable boundaries

```text
PEOCR-STUDY1 = INCONCLUSIVE
Position Complexity / Difficulty Study 1 = INCONCLUSIVE
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

No prior scientific row is authorized as G2-02 formal evidence. RAW state identity remains `pits,reserve,houseOwned,player,phase,winner,pending`. No symmetry/canonicalization is authorized.

## Scientific authorization firewall

```text
Stage 0 scientific inference = false
Stage 0 formal evidence = false
Stage 0 scientific seed consumed = false
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
```

## Next authorized work

Only prospective Stage 1 design work is authorized next: fresh population/seed design, technical resource planning if needed, finite scientific search-condition grid freeze, exact move/tie/TopSet/ranking/PV rules, identity firewall, Stage 1 source-hash freeze, independent verifier readiness, and an explicit Stage 1 authorization record.

No fresh Stage 1 scientific outcome may be generated before those items are frozen.
