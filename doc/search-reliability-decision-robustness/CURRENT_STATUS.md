# SRDR-STUDY1 — Current Status

更新日: 2026-08-28

## Status

**STUDY ACTIVE / STAGE 0 TECHNICAL PASS / STAGE 1 PROFILE-FROZEN-DEVELOPMENT / STAGE 2 FORMAL REPLICATION AUTHORIZED AND RUNNING**

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

Residual G2-01 branches were audited and were behind `main` with `ahead_by = 0`; they contained no unintegrated active Research Generation 2 work.

## Stage state

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
          PASS
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
          PROFILE-FROZEN-DEVELOPMENT
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
          AUTHORIZED / FORMAL RUN 33124538584 ACTIVE
```

No Stage 2 formal decision has been declared yet.

## Stage 0 provenance

```text
spec SHA-256 = 12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
authorization SHA-256 = 59be5113a3e2bb89a7ea8791be2c4a282f3ad726afebbe8496ef2af01a6a9e5e
source-freeze workflow run = 33061797905
technical workflow run = 33061951566
technical execution commit = 93f46db6afda7ec864a0699f4bf2f2efe62183e7
artifact ID = 9642069374
artifact ZIP SHA-256 = 16b3f6591cd7133a59f876f357b9ff0cb30b337b18dae18d84bd727e4971cf2e
deterministic result hash = 98bd6c67588e33281066a05fd47189e86c6c4fdffa7b2576bd0c6781245fc218
```

Canonical Stage 0 result: `results/STAGE_0_TECHNICAL_RESULT.json`.

Stage 0 validated exact root-score/TopSet measurement, deterministic node-budget semantics, PV reconstruction, quiescence perturbation, move-ordering control, RAW identity, and independent verification. Node-budget decisions use only the last fully completed all-root-candidate iterative-deepening depth; a partial root iteration is discarded.

## Stage 1 frozen development result

Stage 1 used exactly the prospectively reserved block:

```text
games = 1280
seeds = 25011001..25012280
maxPly = 80
seed extension = false
replacement = false
```

Observed identity/population audit:

```text
generated trajectories = 1280
unique historical trajectories = 1057
distinct opening prefixes = 1057
selected unique RAW states = 1018
Namua = 527
Mtaji = 491
selection hash = ed00623f244310b29bc25c0885f287321d4430df1b4d8e4a3a061c06dfc62052
```

The frozen independent verifier replayed all 1280 games and remeasured all 1018 selected states with:

```text
game replay mismatches = 0
selected-state mismatches = 0
measurement-row mismatches = 0
selection hash match = true
```

The initial verifier failed closed only because the production pre-serialization measurement hash included exact-depth `attemptedDepth: undefined` and `abortedDepth: undefined`, while JSON persistence omitted those object properties. The representation-only defect was forensically reproduced without new scientific generation or seed use under correction ID:

```text
SRDR-S1-VERIFICATION-HASH-CORRECTION-2026-08-28-v1
```

Canonical persisted/independent measurement hash:

```text
76225f2d76176ab13bfa34566874b13e14b97c587b1505877504b0aa68959eea
```

Corrected verification workflow:

```text
run = 33123555267
artifact ID = 9667419537
artifact name = g2-02-stage1-development-v1-verified-canonical
artifact ZIP SHA-256 = 41c6b9940798aa1626b0c73279a47b53dbc3e14316d0cb75f48f4d194f5c8cf8
```

All frozen Stage 1 readiness gates passed. Stage 1 decision:

```text
PROFILE-FROZEN-DEVELOPMENT
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

Canonical materialized summary: `results/STAGE_1_DEVELOPMENT_RESULT.json`.

Stage 1 remains development evidence only and is not reusable as Stage 2 formal rows.

## Stage 2 prospective formal freeze

Stage 2 formal spec:

`preregistration/STAGE_2_FORMAL_SPEC.json`

Frozen population:

```text
games = 1536
seeds = 25021001..25022536
maxPly = 80
seed extension = false
replacement = false
```

Stage 2 applies a strict Stage 1 consumed-identity firewall before reliability measurement:

1. historical trajectory overlap -> exclude, no replacement;
2. opening-prefix overlap -> exclude, no replacement;
3. selected authoritative RAW-state overlap -> exclude, no replacement.

Required post-firewall overlap is zero in all three dimensions.

The scientific search grid is unchanged from Stage 1:

```text
D1_Q1
D2_Q1
D3_Q1
D2_Q0
D2_Q2
B64_Q1_MAXD3
B256_Q1_MAXD3
B1024_Q1_MAXD3
```

`D3_Q1` is a frozen higher-resource search reference only; it is not game-theoretic truth or a validated optimal-move oracle.

Formal primary criterion is `mixed-material-sensitivity-and-high-budget-convergence/v1`. After all identity/estimability/reproducibility gates pass, all three are required for `CONFIRMED`:

```text
P1: D2_Q1 vs D3_Q1 canonical-best disagreement
    two-sided 95% Wilson lower bound >= 0.20
P2: D2_Q2 vs D2_Q1 canonical-best disagreement
    two-sided 95% Wilson lower bound >= 0.20
P3: B1024_Q1_MAXD3 vs D3_Q1 canonical-best agreement
    two-sided 95% Wilson lower bound >= 0.90
```

If any formal gate fails, decision is `INCONCLUSIVE`. If all gates pass but one or more primary criteria fail, decision is `NOT-CONFIRMED`.

## Stage 2 authorization provenance

Preauthorization and source-freeze were required to PASS on one identical source commit. Workflow trigger coverage was corrected before scientific authorization so that later Stage 2 workflow-file additions also retrigger preauthorization.

```text
source freeze commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
preauthorization run = 33124483699 / success
source-freeze run = 33124483869 / success
Stage 2 spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
authorization commit = bec87d54540c96c24353f2eeadc25338c53e54eb
formal run = 33124538584
```

The formal run has passed its explicit authorization gate and downloaded the immutable Stage 1 firewall artifact. It is currently executing the frozen Stage 2 generation/firewall-selection/measurement step.

Stage 2 fixes the Stage 1 serialization defect prospectively by JSON-roundtripping the measurement-core object before stable serialization and SHA-256 hashing.

## Immutable boundaries

```text
PEOCR-STUDY1 = INCONCLUSIVE
Position Complexity / Difficulty Study 1 = INCONCLUSIVE
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

No prior scientific row is authorized as G2-02 formal evidence. RAW state identity remains `pits,reserve,houseOwned,player,phase,winner,pending`. No symmetry/canonicalization is authorized.

## Current scientific firewall

```text
Stage 1 rows reusable as Stage 2 formal evidence = false
Stage 2 population/grid/criteria/gates = frozen
Stage 2 scientific generation = authorized for exact frozen block only
Stage 2 seed extension/replacement = prohibited
formal outcome = not yet declared
public AI change recommendation = not authorized by this study workflow
```

## Next gate

The current formal run must complete, in order:

1. frozen Stage 2 generation, Stage 1 firewall, selection and measurement;
2. independent full replay, independent firewall/selection and independent remeasurement;
3. selection/measurement hash agreement;
4. frozen estimability and reproducibility gates;
5. frozen three-part primary formal criterion;
6. canonical formal result materialization.

No design change or rescue action is authorized in response to the Stage 2 outcome.