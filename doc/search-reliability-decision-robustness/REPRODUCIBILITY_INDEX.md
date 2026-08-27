# SRDR-STUDY1 — Reproducibility Index

更新日: 2026-08-28

## Study anchor

```text
Program label = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Branch = research/g2-02-search-reliability-decision-robustness
Draft PR = #68
```

## Stage identities and state

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1 = PASS
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1 = PROFILE-FROZEN-DEVELOPMENT
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1 = AUTHORIZED / formal run active
```

## Upstream records audited before Study freeze

- `README.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`
- G2-01 overview/final/status/decision/reproducibility/formal-result records
- Research Generation 1 Position Complexity / Difficulty Study 1 final/status/index/protocol/plan records

G2-01 and Position Complexity scientific rows are not reusable as G2-02 formal evidence.

## Authoritative identity contract

```text
RAW identity fields = pits,reserve,houseOwned,player,phase,winner,pending
turn/reason = excluded from identity
symmetry reduction = prohibited
reflection equivalence = prohibited
player-seat canonicalization = prohibited
```

## Stage 0 canonical provenance

```text
spec = preregistration/STAGE_0_TECHNICAL_SPEC.json
spec SHA-256 = 12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
authorization SHA-256 = 59be5113a3e2bb89a7ea8791be2c4a282f3ad726afebbe8496ef2af01a6a9e5e
source-freeze run = 33061797905
technical run = 33061951566
artifact ID = 9642069374
artifact ZIP SHA-256 = 16b3f6591cd7133a59f876f357b9ff0cb30b337b18dae18d84bd727e4971cf2e
deterministic result hash = 98bd6c67588e33281066a05fd47189e86c6c4fdffa7b2576bd0c6781245fc218
```

Canonical result: `results/STAGE_0_TECHNICAL_RESULT.json`.

## Stage 1 preregistration and authorization

```text
spec = preregistration/STAGE_1_DEVELOPMENT_SPEC.json
spec SHA-256 = 4fe5d56926fd1b263dc15bf60a4894b89a0dc33fc01c062712c30a2e113e893a
source freeze commit = 753425610573354ae6394ae414666c3bc62c5365
authorization commit = eed7c6adbc234f5c3bf95b6bcd35b67d68b0eada
scientific workflow run = 33067208005
runtime = Node 22.23.2 / ubuntu-24.04
```

Frozen population:

```text
games = 1280
seeds = 25011001..25012280
maxPly = 80
extension = false
replacement = false
```

Frozen search grid:

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

## Stage 1 production identity and measurement provenance

```text
generated games = 1280
unique historical trajectories = 1057
distinct opening prefixes = 1057
selected unique RAW states = 1018
Namua = 527
Mtaji = 491
selection hash = ed00623f244310b29bc25c0885f287321d4430df1b4d8e4a3a061c06dfc62052
stored production pre-serialization measurement hash = 9b3425d546bdb59176fb49711161b0d5b79fb368039d65a89946ad37efb98532
```

Original workflow artifact:

```text
artifact ID = 9651424447
artifact name = g2-02-stage1-development-v1
ZIP SHA-256 = 2c90e3cdd935bdbeab4e79f99eba3b59968763327cd78e8e912cfc7864e04627
```

## Stage 1 independent-verifier serialization correction

The frozen verifier completed all scientific replay/remeasurement with:

```text
games verified = 1280
game replay mismatches = 0
selected-state mismatches = 0
measurement-row mismatches = 0
selection hash match = true
```

The only initial failure was aggregate hash representation. Exact-depth in-memory production objects contained `attemptedDepth: undefined` and `abortedDepth: undefined`; frozen `stableStringify` hashed those keys, but JSON persistence omitted them.

Correction ID:

`SRDR-S1-VERIFICATION-HASH-CORRECTION-2026-08-28-v1`

No scientific generation, seed use, state replacement, search change or endpoint change occurred during correction.

Corrected verification run/artifact:

```text
run = 33123555267
artifact ID = 9667419537
artifact name = g2-02-stage1-development-v1-verified-canonical
artifact ZIP SHA-256 = 41c6b9940798aa1626b0c73279a47b53dbc3e14316d0cb75f48f4d194f5c8cf8
canonical persisted / independent measurement hash = 76225f2d76176ab13bfa34566874b13e14b97c587b1505877504b0aa68959eea
```

Required canonical Stage 1 artifact file SHA-256 values:

```text
stage1-generation-manifest.json = ce7dc177099ad4653af4bd9392828c367d2db0a8e8213445caaae23173652067
stage1-selected-states.json = 4ee7e09663fe6a3544e2b6180d68ff3bbedd74a816d8b6dd89470c0da512d7fd
stage1-measurements.json = ee510b584242fd5c365e2539dbee676723a3dc38c3014a92aa3af517ca2950fb
stage1-verification.json = 17b42097ceedbd64325a9c09974dd78fec5182865ad2ffdfa189039703689197
stage1-development-profile.json = 20e5a07f09045cfb06e6b98af571854c5085df8d65fb77a04c9ade5cb6829c5e
stage1-development-result.json = 9f455cfe41b37d43ee75317ca59e0f9813f3b4ed536d34cf1c6b959084432954
```

Stage 1 decision/profile:

```text
decision = PROFILE-FROZEN-DEVELOPMENT
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

Materialized repository summary: `results/STAGE_1_DEVELOPMENT_RESULT.json`.

## Stage 2 formal preregistration

```text
spec = preregistration/STAGE_2_FORMAL_SPEC.json
spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
```

Frozen population:

```text
games = 1536
seeds = 25021001..25022536
maxPly = 80
extension = false
replacement = false
```

Stage 1 consumed-identity firewall uses the immutable corrected Stage 1 artifact above. Required post-firewall overlap:

```text
historical trajectory = 0
opening prefix = 0
selected RAW state = 0
```

Search grid is identical to Stage 1. Stage 2 measurement hash semantics are prospectively changed only to canonicalize representation:

```text
measurement core -> JSON roundtrip -> stable stringify -> SHA-256
```

No search or scientific endpoint value is changed by this hash contract.

## Stage 2 formal criterion

Formal criterion: `mixed-material-sensitivity-and-high-budget-convergence/v1`.

After all preregistered gates pass:

```text
P1 D2_Q1 vs D3_Q1 pooled canonical-best disagreement:
   two-sided 95% Wilson lower bound >= 0.20
P2 D2_Q2 vs D2_Q1 pooled canonical-best disagreement:
   two-sided 95% Wilson lower bound >= 0.20
P3 B1024_Q1_MAXD3 vs D3_Q1 pooled canonical-best agreement:
   two-sided 95% Wilson lower bound >= 0.90
```

Decision taxonomy:

```text
any formal gate fail -> INCONCLUSIVE
all gates pass + P1/P2/P3 pass -> CONFIRMED
all gates pass + any primary criterion fail -> NOT-CONFIRMED
technical execution failure -> not a scientific decision
```

## Stage 2 source freeze and authorization

A workflow-trigger coverage issue was corrected before scientific authorization so that Stage 2 workflow source changes trigger both preauthorization and source freeze.

Final common source commit:

`e176cafc15d2dde7b8767de6961959bb7ee9bb7b`

Both required runs passed on that exact commit:

```text
preauthorization run = 33124483699 / success
source-freeze run = 33124483869 / success
reserved Stage 2 scientific seed consumed before authorization = false
```

Frozen source SHA-256 set:

```text
public/engine.js = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
public/ai.js = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
public/ai-weights.js = 7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8
tools/benchmark.js = 2a893d7fe78d9d9cb211b38840c45f5c3dd9053fa3e05255b123985a08cfa808
tools/experiments/lib/search-reliability-decision-robustness.js = b7db89afbdfda25f4394f9e7bf6f8b745b5c7d01cb7356e21a50e32d114013e4
tools/experiments/lib/search-reliability-stage1-common.js = d1576a98a5b4c922e46954f1187c99a315e1242a981149b534eb71326914b002
tools/experiments/lib/search-reliability-stage1-measurement.js = de101d440e561b5bf7f7d1bcf3f463590f41d94225d26752012d4d8fa8552ed3
tools/experiments/run-search-reliability-stage2-formal.js = 27d64d947d83894a437a595be087c53e0c609e6ce08530e5c8722af9ec671443
tools/experiments/verify-search-reliability-stage2-independent.js = 25eb0b44efed0755b30ccd68f7594ed43b92e978b51c24b5690e47db3972ba5b
tools/experiments/analyze-search-reliability-stage2-formal.js = b641dff6dfecccd0423df74df09ddc3c82aa7cec30bfacbc136f43a4578e39b5
preregistration/STAGE_2_FORMAL_SPEC.json = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
.github/workflows/g2-02-search-reliability-stage2-preauth.yml = f93c71ed8d1f4a3562018d0494ccbfbe40ba821963db72ffe61c86215fbec705
.github/workflows/g2-02-search-reliability-stage2-source-freeze.yml = 5538c05d83abad2c8f9cf6ac2544c104b693e0c1dc23395c7d3a357c54d0a6e3
.github/workflows/g2-02-search-reliability-stage2-formal.yml = 52587033af5720d7dba081edc4514b9a0ef65e9bcbf2ac5493b9de265b535e7b
```

Explicit authorization:

```text
file = preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
authorization commit = bec87d54540c96c24353f2eeadc25338c53e54eb
formal workflow run = 33124538584
runtime = Node 22.23.2 / ubuntu-24.04
```

The formal run passed its authorization gate and immutable Stage 1 firewall artifact download, and entered frozen Stage 2 generation/firewall-selection/measurement.

## Pending canonical evidence

The following do not exist as accepted canonical Stage 2 evidence until formal run `33124538584` completes independent verification and the frozen analyzer:

```text
Stage 2 selection hash
Stage 2 measurement hash
Stage 2 verification SHA-256
Stage 2 artifact ZIP SHA-256
Stage 2 canonical result hash
Study-level formal decision
```

No placeholder value may be filled from Stage 1 outcomes or historical studies.