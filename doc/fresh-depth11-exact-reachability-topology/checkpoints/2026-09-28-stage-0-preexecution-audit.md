# G4-10 / FDERT-STUDY1 — Stage 0 pre-execution audit

Date: 2026-09-28  
Stage: `FDERT-S0-TECHNICAL-2026-09-28-v1`  
Decision: **`PASS / READY-FOR-ONE-SHOT-TECHNICAL-AUTHORIZATION`**

## Audit scope

protected depth-11 scientific evidenceへアクセスする前に、Stage 0 technical-only executionのsource、fixture depth、fail-closed semantics、Actions経路を監査した。

## Frozen scientific boundary

```text
scientific inference = false
protected depth-11 access = false
maximum real fixture depth = 2
Stage 1 scientific execution = false
public AI change = false
main integration = false
```

Stage 0 runnerはstandard initial RAW rootのdepth-2 fixtureだけを実計算する。depth-11 partial enumeration、count probe、RSS probe、sample expansionを行わない。

## Current source observations

G3-11時点からcurrent `public/engine.js` blobは更新されている。一方、exact production / independent enumeratorのblobはG3-11で使用したものと一致する。

そのためStage 0では、現行engineに対して以下を再検証する。

```text
required standard root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
known shallow RAW counts = [1, 4, 14]
known shallow tree occurrences = [1, 4, 14]
```

これはdepth-11 scientific evidenceではなく、shallow compatibility fixtureである。

## Source blobs prepared for authorization binding

```text
.github/workflows/fdert-stage0-technical.yml = e9fde7fd2516053450fb5776f3fdb872344d00b5
doc/fresh-depth11-exact-reachability-topology/prereg/STAGE_0_TECHNICAL_SPEC.json = 584f703858d7c2a9ed6beb31f9a237adaf6a5212
tools/experiments/run-fdert-stage0-technical.js = 7d85aa96e1ea348ad223b6e6734e869168f37628
tools/experiments/lib/fdert-contract.js = 5c564745e44860fa904a2b06cebade2590d43c95
tools/experiments/lib/drsse-production.js = e8fc23799415f566850c817c22cf658216bb98be
tools/experiments/lib/drsse-independent.js = 906e0412bcf47fe37d95ac29ad83f9c83bc52857
public/engine.js = 1527bb3665228b7a5bd9f03153567aedbaaa22d7
```

Authorization artifactはこれらをexact blob bindingする。

## Technical controls

必須controlは次を含む。

- source freeze exact binding
- current engine standard-root identity
- depth-2 production completion
- materialized independent verification
- full shallow independent recomputation
- state/work/tree/artifact cap fail-closed
- final resource gate synthetic boundary
- corrupted completion metadata rejection
- resource-cutoff `NON-ESTIMABLE` quarantine
- integrity defect `TECHNICAL-INVALID` classification
- production / independent static separation
- runner内depth-11 real computation不在

## Actions path

Workflowはauthorization fileのpushだけで起動する。

```text
runner = ubuntu-24.04
job timeout = 20 minutes
repository write permission = none / contents: read
result retention = Actions artifact / 90 days
repository result auto-push = false
```

この設計ではtechnical run終了後、artifactを取得・検証した上でcanonical resultを別commitとして記録する。

## Decision

Stage 0 pre-execution auditはPASS。

**次に許可できる作業は、source-bound one-shot Stage 0 technical authorization artifactの作成と、そのauthorization pushによるtechnical-only Actions executionである。**

Stage 1 protected depth-11 executionは未認可のままとする。
