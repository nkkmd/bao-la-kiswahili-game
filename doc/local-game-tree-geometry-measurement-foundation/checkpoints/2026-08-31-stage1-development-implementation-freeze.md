# 2026-08-31 — G3-01 Stage 1 development implementation freeze

`LGTGMF-S0-TECHNICAL-2026-08-31-v2`が`STAGE0-TECHNICAL-PASS`となり、fresh scientific seed consumptionがまだ`NONE`であることを確認したうえで、Stage 1 development implementationをoutcome前にfreezeする。

```text
Study ID = LGTGMF-STUDY1
Stage ID = LGTGMF-S1-DEVELOPMENT-2026-08-31-v1
Evidence class = FRESH-DEVELOPMENT
Scientific inference authorized = false
Seed block = 31010001..31010096
Required roots = Namua 6 / Mtaji 6
Local target depth = 5
Candidate metric families = F1..F5 (unchanged)
Stage 2 seed read = prohibited
standard-root complete depth-10 generation/read = prohibited
```

Production path:
- `tools/experiments/run-lgtgmf-stage1-development.js`
- `tools/experiments/lib/lgtgmf-production.js`
- `tools/experiments/lib/lgtgmf-production-v2.js`

Independent path:
- `tools/experiments/verify-lgtgmf-stage1-independent.js`
- `tools/experiments/lib/lgtgmf-independent.js`
- `tools/experiments/lib/lgtgmf-independent-v2.js`

Execution workflow:
- `.github/workflows/lgtgmf-stage1-development.yml`

Canonical preregistration:
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `STUDY_1_PROTOCOL.md`

Root selectionはseedごとに`tools/benchmark.js`と同一の`seededRandom`アルゴリズムを独立実装し、各plyでexact move key昇順のlegal move listから一様indexを選択する。selectionはgeometry、search evaluation、game outcomeを参照しない。

Productionとindependentは別processで同じfrozen seed blockからroot populationをそれぞれ再生成し、root RAW key、selected ply、source trajectory hash、first-16 exact-move opening-prefix hashを照合する。local geometryは各selected RAW rootから双方が独立にdepth 0..5をfull reconstructionする。

Stage 1のfamily promotionはF1〜F5についてproduction / independentのexact family digest一致を必要とする。resource ceilingまたはpopulation不足が起きた場合、complete subsetだけで救済しない。

このcheckpoint commit自体はfresh seedを消費しない。次の別commitに置く`STAGE_1_DEVELOPMENT_EXECUTE.json`だけがworkflowをtriggerする。authorization commitの親commitを本implementation freezeと一致させる。
