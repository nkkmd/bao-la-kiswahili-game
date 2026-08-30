# PSRRE-STUDY1 — Stage 1 tooling smoke PASS

Date: 2026-08-30

## 結論

`PSRRE-S1-TOOLING-SMOKE-2026-08-30-v1`はtechnical-only contractの全mandatory checkを満たし、`TOOLING-SMOKE-PASS`で終了した。

```text
workflow run = 33307611100
workflow job = 99246820137
head = 1ae4dc02263a9c400f9f39f89f6105e9f80a79a2
source freeze = 751f09e7bfdc17bbe3f340683e573980723cc607
artifact id = 9730969588
mandatory checks = 16 / 16 PASS
scientific seeds used = []
scientific outcome generated = false
G2-11 outcome inspected = false
```

## technical exactness

productionとindependent implementationは次でexact一致した。

- 64 technical gamesのsource generation
- 8 strataから各1 rootを選ぶtechnical root selection
- 28-feature calculation
- median / MAD scaling
- deterministic PCA8
- Ward partition
- deterministic PAM
- frozen assignment
- synthetic candidate-metric plumbing
- canonical serialization / hash

technical rootsでは28 features中16 featuresがnonzero MADだった。これはtechnical fixtureの性質を示すだけで、Stage 1 scientific populationにおけるactive-feature数を予測・保証するものではない。

## resource

```text
runner elapsed = 5.85557228 s
runner RSS = 96,690,176 bytes
final artifact bytes = 166,447
```

resource ceilingはPASSした。

## scientific boundary

このPASSはscientific representationのvalidation、family selection、support / silhouette / stabilityの科学的評価ではない。synthetic metric fixtureは実装plumbing検証だけに使った。

Stage 1 scientific seeds `29510001..29514096`とStage 2 scientific seeds `29610001..29618192`は未消費・未承認のままである。

Stage 1 scientific executionは自動承認しない。次にscientific runner、independent verification path、artifact packagingをmaterializeし、source/hash freezeとpreflightを通過した後にのみ、別authorizationを検討する。
