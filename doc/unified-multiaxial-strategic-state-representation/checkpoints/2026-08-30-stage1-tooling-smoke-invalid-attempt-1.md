# 2026-08-30 — Stage 1 tooling smoke invalid attempt 1 / implementation-only repair

## 対象

```text
Study = UMSSR-STUDY1
Stage = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
workflow = UMSSR Stage 1 Tooling Smoke
run = 33296234733
job = 99216263113
source commit = fbfa65e774fa6bd6a509fb0b3ee903a463a86f17
```

## 結果

最初のtooling smokeはtechnical execution failureとなった。

```text
syntax checks = PASS
scientific seed firewall = PASS
scientific seed use = 0
runner result JSON = absent
failure = TypeError: Assignment to constant variable.
location = tools/experiments/lib/umssr-stage1-production.js graph()
artifact id = 9727487276
artifact ZIP SHA-256 = 3c9631a3872ac0891c2b7d92bfbebbc23401a621d61e45c13944daef0dc0e9cc
```

production `graph()`でdepth-2 edge count用の`edges`を`const`として宣言した後、second-ply edgeごとに`edges++`していた。これはpure implementation defectであり、population、feature definition、scientific threshold、K候補、Stage 2 endpointの結果ではない。

## disposition

```text
TECHNICAL-EXECUTION-INVALID-NO-SMOKE-RESULT
scientific evidence = NONE
Stage 1 scientific seeds = RESERVED / UNCONSUMED
Stage 2 scientific seeds = RESERVED / UNCONSUMED
Stage 1 authorization = false
```

## repair boundary

`STAGE_1_TOOLING_SMOKE_SPEC.json`のprospective repair ruleに従い、次の1点だけを修正する。

```text
before: const ... edges=first.length
repair: const ...; let edges=first.length
```

変更しないもの:

- Stage 1 scientific seed block
- development population / root selection
- 40-feature dictionary
- numeric / scaling contract
- candidate K `2..6`
- support / silhouette / stability threshold
- readiness threshold
- Stage 2 validation contract / primary endpoint
- technical smoke seeds / games / strata
- production / independent comparison requirements
- artifact / resource ceilings

同一technical contractで修正rerunする。invalid attemptは隠さずprovenanceとして保持する。
