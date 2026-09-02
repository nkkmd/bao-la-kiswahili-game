# BRMGI-STUDY1 — Stage 0 Technical Plan

更新日: 2026-09-02  
Stage: `BRMGI-S0-TECHNICAL-2026-09-02-v1`  
Evidence class: **TECHNICAL-FIXTURE ONLY**

## 1. Purpose

Stage 0はG3-06のscientific outcomeを作るStageではない。

fresh Stage 1 seedを一切使わず、次のcontractが実装可能かを検証する。

- rule-event classification
- pre-root / move / complete post-root binding
- event-specific control construction
- LGTGMIV production / independent depth-5 reconstruction binding
- exact pre/post delta / event-control contrast
- compound-event semantics
- sparse reconstruction / cache / resource accounting
- relay-limit fail-closed
- exactly-one execution control plane

Stage 0 PASSはfresh Stage 1をauthorizeしない。

## 2. Planned implementation separation

Production side:

```text
tools/experiments/lib/brmgi-production.js
  -> tools/experiments/lib/lgtgmiv-stage1-production.js
```

Independent side:

```text
tools/experiments/lib/brmgi-independent.js
  -> tools/experiments/lib/lgtgmiv-stage1-independent.js
```

禁止:

- productionからindependent BRMGI aggregationをimportすること
- independentからproduction BRMGI aggregationをimportすること
- shared BRMGI event classifier / control selector / candidate aggregatorを両implementationがimportすること

共有してよいものはauthoritative rule engine API、frozen machine preregistration、scientific canonical serialization contractの仕様情報に限る。

## 3. Stage 0 runner

Planned runner:

`tools/experiments/run-brmgi-stage0-technical.js`

Runnerは次をcanonical technical artifactへ書く。

- fixture identities
- production / independent event labels
- production / independent pre/move/post identities
- production / independent M1-M6 endpoint values
- exact delta / contrast values
- all mandatory gate booleans
- resource telemetry separated from scientific canonical core
- protected-evidence access flags

## 4. Mandatory fixture classes

### T1 — ordinary non-capture / capture-mandatory semantics

固定fixtureでcapture可能rootのlegal move setがcapture-onlyであることを確認し、E1 generic same-root noncapture controlを作らないことを検証する。

### T2 — capture source-event control selection

fixed technical trajectory上で、same pre-phaseのnearest earlier noncapture moveをdeterministically選択し、move orderやobject property orderでcontrol identityが変わらないことを確認する。

### T3 — nyumba stop/use

fixed syntheticまたはtechnical-replay rootで同一physical opening moveの`houseChoice=stop/use`をbindし、use/stop post RAWが期待通り区別されることを確認する。

fixtureが自然に得られない場合、Stage 0用のexplicit synthetic stateをprospectively記録して使用する。scientific seedを探索してfixtureを探さない。

### T4 — reserve decrement / Namua-to-Mtaji

fixed technical fixtureで:

- Namua nontransition reserve decrement
- final reserve exhaustion
- complete post-rootのphase=`mtaji`

を確認し、E3がreserve exhaustion + phase transitionのlinked compound labelになることを検証する。

### T5 — compound-event label

1 moveへ複数event labelが付く場合に、mutually exclusive recodingを行わずfull label vectorを保持することを確認する。

### T6 — exact arithmetic

integer / reduced rationalについて:

```text
pre value
post value
pre/post delta
event/control contrast
sign
```

をproduction / independent別実装でexact一致させる。float arithmeticはdecision pathに入れない。

### T7 — bounded geometry binding

LGTGMIV production / independentをそれぞれ別に呼び、同じfixture rootについてcanonical F1-F5 reconstruction / M1-M6 derived endpointがexact一致することを確認する。

### T8 — cache semantics

cache keyが:

`RAW identity + relative horizon + implementation family`

であることを確認し、symmetry/reflection/canonical orbitをcache reuseへ使わない。

### T9 — relay-limit fail-closed

Protected evidenceやfresh seedを探索せず、explicit technical sentinelをrunnerへ与えて:

- source/direct move relay-limit -> technical ineligibility
- required bounded reconstruction relay-limit -> Stage `TECHNICAL-INVALID`

の分岐を検証する。

実際のdepth-10やrandom searchでrelay-limit caseを発見しに行かない。

### T10 — execution integrity

- unarmed scientific runner fail-closed
- exactly one Stage 0 trigger path
- concurrency guard
- durable lease path
- source binding
- artifact-before-mirror

をtechnical-onlyで検証する。

## 5. Resource accounting

Stage 0ではscientific population sizingを実測から変更しない。

technical fixtureの測定値はresource-risk smokeにのみ用い、Stage 1/2のfrozen ceilingsを結果後に緩和しない。

## 6. Static audit before formal Stage 0

Formal Stage 0 authorization前にstatic auditで少なくとも次を確認する。

- prereg JSON parse
- Stage/Study/seed constants exact binding
- no Stage 1/2 seed import in Stage 0 runner
- no depth-10 source path
- no G3-03 diagnostic outcome read
- no G3-04 outcome-value read
- no G3-05 partial telemetry read
- production / independent BRMGI separation
- canonical equality implementation
- workflow trigger uniqueness
- artifact upload path

Static auditはfixture/scientific measurementを実行しない。

## 7. Formal Stage 0 authorization

Static audit PASS後に、audited branch HEADとsource blob setへbindingしたmachine-readable / human-readable authorizationを別commitで記録する。

```text
max formal Stage 0 executions = 1
fresh Stage 1 seed access = false
fresh Stage 2 seed access = false
protected depth-10 access = false
```

同一v1 technical executionを結果後に自動rerunしない。

## 8. Stage 0 disposition

Possible labels:

- `STAGE0-PASS`
- `TECHNICAL-INVALID`

Stage 0 technical-invalidはscientific nullではない。

`STAGE0-PASS`でもStage 1は自動authorizeされず、separate post-Stage-0 authorization reviewが必要。
