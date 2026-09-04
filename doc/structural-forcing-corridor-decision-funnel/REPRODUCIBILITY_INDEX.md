# SFCDF-STUDY1 — 再現性索引

更新日: 2026-09-02

## baseline（開始時点）

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
research branch = research/g3-04-structural-forcing-corridor-decision-funnel
Study ID = SFCDF-STUDY1
Study status = CLOSED / FORMAL-COMPLETE
```

## canonical preregistration （概要）

```text
prereg/STUDY_1_SPEC.json
blob = 3742a0b9ddbcf9c7b3534d22adb0e06d859410bf

STUDY_1_PROTOCOL.md
blob = c7705b3ac80b68c2b69ce621bd1a534a32ffb408
```

prereg JSONには、synthetic fixtureまたはfresh scientific evidenceより前にsyntax-only correctionを1件行った。scientific contractは変更していない。

## rule / upstream source binding （概要）

```text
public/engine.js
blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c

tools/experiments/lib/lgtgmiv-stage1-production.js
blob = a4664f01535d6abbf6f83821befbb2fafd55cde6

tools/experiments/lib/lgtgmiv-stage1-independent.js
blob = 0c7239ac7acf146e9aee63dae66194681b8631d6
```

## G3-04 endpoint binding （概要）

```text
tools/experiments/lib/sfcdf-production.js
blob = b6fca5d533ff4fdf906e64509185b480c6dc5818

tools/experiments/lib/sfcdf-independent.js
blob = 3bbc16d41c56f2eb00d7169ace2359f0fa9b9b53
```

## scientific representation （概要）

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
validated transforms = []
relative horizon = 5
```

## canonical equality （概要）

cross-implementation scientific equalityは次のとおりである。

```text
canonical sorted-key JSON scientific content
→ UTF-8 bytes
→ SHA-256
→ exact digest equality
```

JavaScript object prototype、property insertion order、runtime identity、timestamp、memory telemetryはscientific identityの対象外である。

## upstream identity-only firewall （証拠分離規則）

```text
prereg/UPSTREAM_IDENTITY_FIREWALL.json
blob = 9bc9debfa8df428eece243ca2ce49baf5707b9bf
identity core SHA-256 = 0196f255aa152f343cb428ee048ab1570ccdf4661c5adba5a47f4356a974b086
scientific outcome fields retained = false
```

## fresh namespace （概要）

```text
Stage 1 = 31410001..31410192 / CONSUMED
Stage 2 = 31420001..31420288 / CONSUMED
```

seed extensionまたはreplacementは行っていない。

## protected evidence （証拠の状態）

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
reserved for = G3-11 FRESH-DEEPER-EXACT-HOLDOUT
```

## Stage 0の記録

Stage ID: `SFCDF-S0-TECHNICAL-2026-09-02-v1`

v1 pre-fixture abort:

```text
run = 33616688284
synthetic fixture execution = false
fresh scientific seed access = false
```

v2のvalid technical execution:

```text
run = 33620251552
artifact ID = 9842597981
artifact ZIP SHA-256 = 028ad7e5034cc4954003b081ca6f0c7ac2bc44a97db0f397fe78ea65f21b7021
deterministic technical core = 14e7640dcd302c402c21a5acbe44bcbf004956670f467763faf7c301e545a295
stage disposition = STAGE0-PASS
```

## Stage 1のimplementation

```text
tools/experiments/lib/sfcdf-stage1-production.js
blob = 1cfbc58b2d670fa2bee0254c4ab8bb09c67d5a48

tools/experiments/lib/sfcdf-stage1-independent.js
blob = 9d39e13c7dd4d0d2d9dcb99500dfb07c92e48215

tools/experiments/run-sfcdf-stage1-development.js
blob = a4162e2dba356b2b4a2639ef320e87b7b567bb83

.github/workflows/sfcdf-stage1-development.yml
blob = a0454e894c0d5e1709d7c79a3140aed58be95eaf
```

Pre-authorization tooling:

```text
tooling smoke run = 33621353261 / PASS
source validation run = 33621535038 / PASS
scientific workflow runs before authorization = 0
```

Authorization:

```text
authorized scientific-content HEAD = 140d5827fea9affee46aa15f08cbe15eb7775129
nonce = SFCDF-S1-AUTH-2026-09-02-V1-01
max scientific executions = 1
```

Execution:

```text
run = 33621863279
lease commit = 923f890302e50a1ae19d184eb9120105559f8381
artifact ID = 9843276993
artifact ZIP SHA-256 = b3aeea3c1058d98b8b59fe0eaa69edc734f60e2ccb04223a464d842a78e33a56
scientific-result blob = 049473e3130814382418fd15fe0c7991f7c08c21
production Stage core = fb8929e2a27802e46431deb79fcfafe78d9598301f6252f3ad6ffea485216cca
independent Stage core = fb8929e2a27802e46431deb79fcfafe78d9598301f6252f3ad6ffea485216cca
stage disposition = STAGE1-PASS
```

Promoted set:

```text
C1 / MTAJI-GREATER
C6 / NAMUA-GREATER
```

## Stage 2のformal input

```text
prereg/STAGE_2_FORMAL_INPUT.json
blob = 88563b39f2e9fec2bdf0e00eb40ec9debbba9ff0
Stage 1 identity core SHA-256 = eca6d00a88def284644bdf59bc599e8faae7d09f3aaa2656fafd046c35fd4c0d
Stage 1 RAW-root identities = 24
Stage 1 trajectory identities = 24
Stage 1 first-16-prefix identities = 12
retained Stage 1 scientific field = promotedCandidates only
```

Materialization:

```text
run = 33623755813
artifact ID = 9843933810
artifact ZIP SHA-256 = 8b95129a24f46a8761227641292c04e29b317fb186b92f50f63613e211470b3e
```

## Stage 2のimplementation

```text
tools/experiments/lib/sfcdf-stage2-production.js
blob = afe2c26209dffcf0f7f69069b35563298af2d57c

tools/experiments/lib/sfcdf-stage2-independent.js
blob = 5dcfb57c3b3222e6f81105ac8a3d6a565f4a57d8

tools/experiments/run-sfcdf-stage2-formal.js
blob = e4fd7bb283824457b9440c46d8a8943b9b48c5ea

.github/workflows/sfcdf-stage2-formal.yml
blob = 98e7afdca6238408f614285f734c434ea1e4d2a8
```

Source validation:

```text
run = 33624044515 / STAGE2-SOURCE-VALIDATION-PASS
artifact ID = 9844048379
artifact ZIP SHA-256 = 78043bd630ce465f3b5fed1a219e4b51f23b539563cfabd71d662ffd28863a5a
result blob = 27638da8c72f4e4fce53338cb500b8ddebad895f
Stage 2 scientific workflow runs before authorization = 0
Stage 2 seed access = false
protected depth-10 access = false
```

Authorization:

```text
authorized scientific-content HEAD = 1d6ba1982855cc3ddf3abf9ebd9c9b8daa5c21c4
nonce = SFCDF-S2-AUTH-2026-09-02-V1-01
max scientific executions = 1
```

## Stage 2のformal execution

```text
workflow run = 33624399706
execution trigger commit = 40fd586e3bc3bf77fa2fc5303cc11fcf99655946
lease commit = 325366baedcd437f45991e2941bc38fc2e04bd1f
result mirror commit = e850dca8236745cb611cf2e0f60ed9113b6ed4a8
artifact ID = 9844368476
artifact size = 15299 bytes
artifact ZIP SHA-256 = c4d10eb07eec6ed75510f344f5c06d13deabeb03210023cd541035f05bd5da0f
scientific-result blob = 099c45134e2816aac7bafdd5aab5ade03903c64a
execution-summary blob = d2e4db04a5f2b35cc3da573fd9ab82ec6131f03a
production Stage core = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
independent Stage core = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
stage disposition = STAGE2-PASS
```

Formal candidate results:

```text
C1 = CONFIRMED / MTAJI-GREATER / 18 of 18 same-direction nonzero / p=1/131072 / Holm PASS
C6 = CONFIRMED / NAMUA-GREATER / 18 of 18 same-direction nonzero / p=1/131072 / Holm PASS
```

## execution-count audit （実行記録）

```text
Stage 1 = 1 authorized / 1 actual
Stage 2 = 1 authorized / 1 actual
same-evidence reruns after fresh access = 0
```

## closure file （最終状態）

canonical closure sourceは次を含む。

- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `STUDY_1_FINAL_REPORT.md`
- `checkpoints/2026-09-02-stage-2-formal-pass-study-closure.md`
- `../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`
- `../research-generation-3/checkpoints/2026-09-02-g3-04-formal-complete-closure.md`
- `results/stage-1/scientific-result.json`
- `results/stage-2/scientific-result.json`
- `results/stage-2/execution-summary.json`

closure後のG3-04 scientific executionはauthorizeされていない。
