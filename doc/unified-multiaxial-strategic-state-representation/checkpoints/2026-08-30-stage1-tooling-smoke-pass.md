# 2026-08-30 — Stage 1 tooling smoke PASS

## canonical technical execution

```text
Study = UMSSR-STUDY1
Stage = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
run = 33296341604
job = 99216540208
source commit = 622dfc79aee5915f520c75a23e4123caa74ea865
artifact id = 9727521248
artifact ZIP SHA-256 = 39120244bb238aee19e5181104c33d7551c5b4b6eb0b11156011efe6085febef
STAGE_1_TOOLING_SMOKE_RESULT.json SHA-256 = 1aa049ad47f307e243b8f85aae4cdf6a2fa4ecfc4ab6da3bc88e045d4e82944c
FINAL_EXACT_COMPARISON.json SHA-256 = 7ed78bb4a975353fdadb0d9cae52de5ec8232f97d0318ad7f55bf11560613b32
```

## exact comparison

```text
sourceExact = true
selectionExact = true
featureExact = true
scalerExact = true
candidateExact = true
representationExact = true
readinessExact = true
fullExact = true
```

technical population:

```text
seeds = 29300001..29300064
games = 64
selected roots = 8
quota = 1 per phase/source-policy stratum
feature width = 40
scientific seeds consumed = false
```

## resource preflight

```text
production = 9457.786765 ms
independent = 8274.361248 ms
projected production scientific runtime with 1.5 safety factor = 907947.52944 ms
projected independent scientific runtime with 1.5 safety factor = 794338.679808 ms
frozen per-side ceiling = 7200000 ms
max RSS = 101624 KB
```

resource projectionはceiling内である。

## scientific interpretation firewall

technical 8-root sampleでは`k=2` candidateがfrozen selection thresholdを満たさなかった。しかしこれはtechnical smoke populationであり、Stage 1 scientific populationではない。

```text
candidate K technical-smoke metrics = NOT SCIENTIFIC EVIDENCE
representation eligibility inference = NOT AUTHORIZED
threshold change = NOT AUTHORIZED
K-range change = NOT AUTHORIZED
```

smoke resultはtooling exactnessとresource planningだけに使用する。

## current authorization state

```text
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds 29310001..29314096 = RESERVED / UNCONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
```

次にfull artifact packaging / runner-local comparison preflightとscientific consume-once runnerをsource-freezeする。これらのtechnical gateがPASSするまでStage 1 authorizationを発行しない。
