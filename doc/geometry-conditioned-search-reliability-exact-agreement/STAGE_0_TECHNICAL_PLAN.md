# G4-09 / GCSREA-STUDY1 — Stage 0 Technical Plan

更新日: 2026-09-27  
Stage ID: `GCSREA-S0-TECHNICAL-2026-09-27-v1`  
Evidence class: `TECHNICAL-FIXTURE`

## Purpose

fresh scientific evidenceへアクセスする前に、G4-09で必要なsearch-output comparison、RAW local geometry、exact move-set agreement semantics、production / independent separationが再現可能かをtechnical-onlyに検証する。

Stage 0は科学的effect、search correctness rate、geometry-reliability relationを生成しない。

## Technical sources

- `public/engine.js` initial RAW state
- initial RAW stateのcanonical-first legal child
- synthetic search/exact move-set fixture

`40913001` / `40923001`のfuture scientific candidate namespaceは参照しない。

## Search gate

固定6 configurationをproduction / independentで再計算し、estimability、completed depth、canonical best、TopSet、score、ranking、PVをexact一致させる。

```text
D2_Q1
D3_Q1
D2_Q0
D2_Q2
B256_Q1_MAXD3
B1024_Q1_MAXD3
```

さらに3 technical contrastについてstability semanticsの二経路一致を要求する。少なくとも1 contrastはtechnical fixture上でestimableでなければならない。

## Geometry gate

initial RAW rootとcanonical-first childの最大2 rootについてrelative depth 5 / RAW-only geometryをproduction / independentでexact一致させる。

## Exact-agreement semantics gate

synthetic legal move universeを用いて、search TopSetとexact value-preserving move setの関係を次の5分類すべてで検証する。

```text
EQUAL
A-SUBSET-B
A-SUPERSET-B
OVERLAP
DISJOINT
```

同時にcanonical-best inclusion、Top-k exact coverage、PV first-move inclusionを二経路で一致させる。

実際のG4-05 fixed 8 exact microdomainへ新規searchを掛けることは禁止する。

## Execution firewall

```text
scientificExecution = false
freshScientificSeedReads = 0
G4-05 exact-domain new measurements = 0
Stage 1 candidate namespace reads = 0
Stage 2 candidate namespace reads = 0
G4-10 depth-11 access count = 0
public AI changed = false
```

## Source binding

実装、spec、workflowをstatic reviewしたresearch branch HEADを`auditedSourceSha`としてauthorizationへbindする。

authorization後からexecution triggerまでに許可する変更pathは次の2つだけとする。

1. `doc/geometry-conditioned-search-reliability-exact-agreement/authorizations/STAGE_0_AUTHORIZATION.json`
2. `doc/geometry-conditioned-search-reliability-exact-agreement/executions/STAGE_0_TRIGGER.json`

それ以外のpathが変化していればworkflowは実行前にfail closedする。

## Workflow

`.github/workflows/gcsrea-stage0-technical.yml`

GitHub Actions上で次を行う。

1. full-history checkout
2. Node syntax checks
3. authorization / source-binding verification
4. technical-only Stage 0 run
5. execution context materialization
6. SHA-256 manifest generation
7. artifact upload

## Resource ceiling

```text
geometry roots <= 2
exact semantic fixtures <= 5
elapsed <= 900000 ms
peak RSS <= 1500000000 bytes
result artifact <= 8000000 bytes
```

## Pass condition

すべてのmandatory gateが成立した場合のみ:

`STAGE0-PASS`

それ以外:

`TECHNICAL-INVALID`

Stage 0 PASSはStage 1 fresh scientific accessを自動認可しない。
