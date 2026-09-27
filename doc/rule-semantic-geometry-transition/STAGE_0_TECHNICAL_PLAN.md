# G4-08 / BRSGT-STUDY1 — Stage 0 Technical Plan

更新日: 2026-09-27  
Stage ID: `BRSGT-S0-TECHNICAL-2026-09-27-v1`  
Evidence class: `TECHNICAL-FIXTURE`

## Purpose

fresh scientific evidenceへアクセスする前に、G4-08で必要なrule-event classification、event-unit identity、pre/post geometry measurement、exact arithmetic、production/independent separationがtechnical fixture上で再現可能かを検証する。

特にG3-06で発生した`production/independent selection mismatch`を再発させないことを最優先とする。

## Fixture set

Stage 0はPRNG seedを使わない。

1. `BRSGT-TF-INITIAL` — `public/engine.js` initial state
2. `BRSGT-TF-NYUMBA` — NYUMBA stop/use pairを持つhand-constructed synthetic RAW state
3. `BRSGT-TF-PHASE` — Namua→Mtaji transitionを発生させるhand-constructed synthetic RAW state

各fixtureについてcanonical legal move / moveVariantsを列挙し、production / independent implementationがunit-by-unitで同一selection coreを生成することを要求する。

## Required event coverage

```text
BRSGT-E1-CAPTURE = covered
BRSGT-E2-NYUMBA-USE-VS-STOP = covered
BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION = covered
BRSGT-E4-NAMUA-TO-MTAJI = covered
compound label vector = at least one multi-label transition
```

coverageが満たせない場合はfixtureをfresh evidence access前にtechnical-only versionとして再設計できるが、authorized execution後のsame-version rescueは行わない。

## Selection agreement gate

production / independent間で以下をexact比較する。

```text
fixtureId
eventLabels
preRawSha256
moveKey
postRawSha256
disposition
nyumbaPhysicalMoveKey
nyumbaStopMoveKey
nyumbaUseMoveKey
nyumbaStopPostRawSha256
nyumbaUsePostRawSha256
compoundLabelVector
canonicalOrder
```

countだけ一致してもPASSではない。

## Geometry validation

最大7 rootを実測する。

```text
initial pre
initial canonical-first post
nyumba pre
nyumba stop post
nyumba use post
phase pre
phase canonical-first post
```

各rootでproduction / independentについて:

- reconstruction core SHA
- family core SHA
- M1..M6 exact endpoint

を一致させる。

resource ceilingは8 rootなので、1 rootの余白を持つがauthorized run中の追加測定は行わない。

## Exact arithmetic checks

- initial pre/post delta
- NYUMBA use-minus-stop pair contrast
- denominator 0 exact rationalのundefined handling

をproduction / independentでexact一致させる。

## Execution firewall

Stage 0 runnerはfuture candidate namespace `40813001` / `40823001`を参照しない。

```text
scientificExecution = false
freshScientificSeedReads = 0
Stage 1 candidate namespace reads = 0
Stage 2 candidate namespace reads = 0
G4-10 depth-11 access count = 0
public AI changed = false
```

## Source binding

実装・spec・workflowをstatic reviewしたHEADを`auditedSourceSha`としてStage 0 authorizationへbindする。

authorization後、実行triggerまで許可される変更pathは次の2つだけとする。

1. `doc/rule-semantic-geometry-transition/authorizations/STAGE_0_AUTHORIZATION.json`
2. `doc/rule-semantic-geometry-transition/executions/STAGE_0_TRIGGER.json`

それ以外が変わっていればworkflowは実行前にfail closedする。

## Workflow

`.github/workflows/brsgt-stage0-technical.yml`

GitHub Actions上で:

1. checkout / full history
2. Node syntax checks
3. authorization/source binding verification
4. technical Stage 0 run
5. execution context materialization
6. SHA-256 manifest creation
7. artifact upload

を行う。

## Pass condition

全gateがtrueのときのみ:

`STAGE0-PASS`

それ以外は:

`TECHNICAL-INVALID`

Stage 0 PASSはStage 1を自動認可しない。
