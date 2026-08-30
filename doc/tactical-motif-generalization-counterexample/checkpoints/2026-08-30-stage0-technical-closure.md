# 2026-08-30 — Stage 0 technical closureの記録

Study: `TMGC-STUDY1`  
Stage: `TMGC-S0-TECHNICAL-2026-08-30-v1`

## 正式判断

**`STAGE0-TECHNICAL-PASS`**

これはtechnical-only closureであり、TM-S2-C03のgeneralization/counterexampleについて科学的positive/negative inferenceを与えない。

## 必須証拠

### core semantics / provenanceの検証

- workflow run: `33285277593`
- source commit: `123b24049f6d12dbe529c5aecc7fc2ee78852deb`
- result: `CORE-SEMANTICS-AND-PROVENANCE-PASS`
- Research Generation 1 candidate / spec / authorization文書のbindingはexact。
- authorization-bound 17 source fileのSHA-256 bindingはexact。
- production / independentのtechnical reconstructionはexact一致。
- RAW identity / legal moves / successor / C03 primary+paired semantics / D1-D3 instrumentationはPASS。

### 凍結済みcontractの検証

- workflow run: `33285599766`
- source commit: `59019e4fcefd02d231296cc87d9adcc0b9816f90`
- result: `passed=true`
- seed non-overlap、8-strata/shard整合、phase boundary、RAW identity、Stage1→2 firewall、prospective axes、multiplicity、no-rescue、decision vocabulary: all pass

### source / diversity / resource preflightの結果

- workflow run: `33285761079`
- source commit: `93396ec45619cf10a08726b5705b9a155bcb1c3b`
- result: `SOURCE-PREFLIGHT-PASS`
- frozen technical seeds: `8090001..8090128`
- 128 games / 8 strata × 16
- unique RAW trajectories: 126
- distinct opening prefixes: 121
- selected unique C03-exact rootsは66。
- selected rootのdistinct opening prefixesは64。
- 8 source strataと4 source familiesのすべてが含まれた。
- deterministic exact reruns: 8/8
- trajectory replayはすべてexact一致した。
- 256-game source shardのprojected runtimeは384.62 s。
- 256-game shardあたりのprojected compact gzip sizeは647,088 bytes。
- 観測されたmax RSSは140,164 KB。
- 凍結済みcheckはすべてPASS。

## 無効試行の扱い

run `33285427882`はresult serialization直前の`ReferenceError`とpipeline exit-code maskingにより`TECHNICAL-EXECUTION-INVALID-NO-PREFLIGHT-RESULT`とした。technical seed、population、8 strata、eligibility、diversity/resource gateは変更せず、同一technical seedsでexact rerunした。

## phaseに関する判断

`TM-S2-C03` exactはMtaji back-row takata constructであり、Namua legal move constructionへphase-only transportできない。したがってdirect Namua transportは`TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`であり、scientific counterexampleへ数えない。

## authorizationへの帰結

Stage 0 PASSにより、**Stage 1 tooling smoke、source freeze、authorization materializationへ進むことは可能**になった。ただしStage 1 scientific seedは、Stage 1 production/independent toolingがtechnical-only smokeで検証され、source hashesとauthorizationがfreezeされるまで使用してはならない。

Stage 2は引き続き`NOT-AUTHORIZED`である。
