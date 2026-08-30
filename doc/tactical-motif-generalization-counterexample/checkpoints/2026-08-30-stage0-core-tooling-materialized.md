# 2026-08-30 — Stage 0 core toolingをmaterialize

Study: `TMGC-STUDY1`  
Stage: `TMGC-S0-TECHNICAL-2026-08-30-v1`

## 状態

**TOOLING-MATERIALIZED / TECHNICAL-RUN-PENDING**

G2-09 scientific generationは未開始で、Stage 1 / Stage 2 reserved seedsは未消費である。

## materializeしたtechnical path

- `tools/experiments/lib/tmgc-stage0-production.js`
- `tools/experiments/lib/tmgc-stage0-independent.js`
- `tools/experiments/run-tmgc-stage0-technical.js`
- `.github/workflows/tmgc-stage0-technical.yml`

## core検証項目

- Research Generation 1 candidate / spec / authorizationのSHA binding
- 第一世代authorization-bound source fileとcurrent sourceのSHA binding
- RAW identityのexact reconstruction
- exact legal move set / candidate move selection / successor identityの検証
- C03 primary structural consequenceの検証
- paired diagnostic consequence
- D1/D2/D3 exact-searchのreconstruction
- synthetic structural-positive controlとcounterexample control
- independent implementationにおけるshared helper除外
- direct Namua phase transportのsemantic eligibility

technical fixtureはhandcrafted / syntheticであり、G2-09のscientific populationではない。このrunからscientific acceptance / rejection / generalizationを推論することは許可しない。
