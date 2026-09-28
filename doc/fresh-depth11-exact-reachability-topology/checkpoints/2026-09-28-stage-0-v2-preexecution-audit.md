# G4-10 / FDERT-STUDY1 — Stage 0 v2 pre-execution audit

Date: 2026-09-28  
Stage: `FDERT-S0-TECHNICAL-2026-09-28-v2`  
Decision: **`PASS / READY-FOR-ONE-SHOT-TECHNICAL-AUTHORIZATION`**

## v1 disposition

`FDERT-S0-TECHNICAL-2026-09-28-v1`はself-referential static string guardのfalse positiveにより`STAGE0-TECHNICAL-INVALID`で閉じた。

```text
v1 rerun = prohibited
v1 protected depth-11 access = false
v1 scientific inference = false
```

## v2 correction

v2はself-source substring scanを削除し、全real enumerationを単一wrapper経由に限定する。

wrapperは実行時に次を強制する。

```text
targetDepth is integer
targetDepth >= 0
targetDepth <= maximumRealFixtureDepth
maximumRealFixtureDepth = 2
```

全real target depthはruntime listへ記録し、run終了時にmaximum observed depthが2以下であることを再確認する。

## Frozen boundary

```text
scientific inference = false
protected depth-11 access = false
maximum real fixture depth = 2
Stage 1 execution = false
public AI change = false
main integration = false
```

## Source blobs prepared for v2 authorization

```text
.github/workflows/fdert-stage0-technical-v2.yml = aea8355cbc9c8684327a56d4795c6854614f6313
doc/fresh-depth11-exact-reachability-topology/prereg/STAGE_0_TECHNICAL_SPEC_V2.json = 62d8d35b976a3af076fa7474e07f4784a23aede0
tools/experiments/run-fdert-stage0-technical-v2.js = 15bd2283c2d9749fd2ca6d5f2317958ec495df15
tools/experiments/lib/fdert-contract.js = 5c564745e44860fa904a2b06cebade2590d43c95
tools/experiments/lib/drsse-production.js = e8fc23799415f566850c817c22cf658216bb98be
tools/experiments/lib/drsse-independent.js = 906e0412bcf47fe37d95ac29ad83f9c83bc52857
public/engine.js = 1527bb3665228b7a5bd9f03153567aedbaaa22d7
```

## Execution policy

- GitHub Actions first candidate
- one-shot authorization
- repository contents read-only in workflow
- artifact retention 90 days
- no result auto-push
- artifact inspection before canonical mirror

## Decision

v2 pre-execution audit PASS。

次に許可できるのは`FDERT-S0-TECHNICAL-2026-09-28-v2`のsource-bound one-shot technical authorizationだけである。Stage 1 protected scientific executionは未認可のままとする。
