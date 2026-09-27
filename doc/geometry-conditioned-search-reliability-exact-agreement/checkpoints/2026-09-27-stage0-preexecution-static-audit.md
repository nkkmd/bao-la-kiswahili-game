# G4-09 / GCSREA-STUDY1 — Stage 0 pre-execution static audit

Date: 2026-09-27  
Review type: `PRE-EXECUTION / STATIC / NO SCIENTIFIC ACCESS`

## Disposition

**`PASS / READY-FOR-SOURCE-BOUND-STAGE0-AUTHORIZATION`**

## Reviewed baseline

```text
main baseline = fc0f345034639c03dc10b0537c331ae44ee47b3b
pre-audit research HEAD = 712906dcf7d756a66272868d6291c4a57a5fc692
research branch = research/g4-09-search-reliability-exact-agreement
branch vs baseline = ahead 11 / behind 0
merge base = main baseline
```

## Diff scope

Baselineからの変更はG4-09専用の次の範囲だけである。

- G4-09 authorization review
- `doc/geometry-conditioned-search-reliability-exact-agreement/**`
- `tools/experiments/lib/gcsrea-stage0-production.js`
- `tools/experiments/lib/gcsrea-stage0-independent.js`
- `tools/experiments/run-gcsrea-stage0-technical.js`
- `tools/experiments/verify-gcsrea-stage0-binding.js`
- `.github/workflows/gcsrea-stage0-technical.yml`

`public/`変更は0。既存G4-03 / G4-05 / G4-06 canonical resultの変更は0。

## Scientific firewall review

Stage 0 contractは次を明示的に禁止している。

```text
fresh scientific seed access = false
Stage 1 candidate namespace read = false
Stage 2 candidate namespace read = false
G4-05 fixed exact-domain new search measurement = false
G4-10 depth-11 access = false
public AI change = false
```

Stage 0 runnerはfuture scientific candidate namespace値を直接参照せず、G4-05 canonical exact-domain artifact pathも参照しない設計である。actual exact-domain agreement値はStage 0では生成しない。

## Two-path review

search computation:

- production: `tools/experiments/lib/silgm-production.js`
- independent: `tools/experiments/lib/silgm-independent.js`

G4-09-specific comparison semantics:

- production: `tools/experiments/lib/gcsrea-stage0-production.js`
- independent: `tools/experiments/lib/gcsrea-stage0-independent.js`

Stage 0 workflowは実行前に両経路のsource separationとauthorization bindingをverifyする。

## Stage 0 execution guards

workflowはtechnical runnerより前に次を実行する。

1. Node syntax checks
2. authorization / source SHA binding verification
3. post-audit changed-path verification

いずれかが失敗した場合、technical runnerへ進まずfail closedする。

technical runner後もresource / execution firewallを再検証し、違反時はartifact upload前にfailureとする。

## Source freeze rule

本audit記録をcommitした後のbranch HEADを`auditedSourceSha`としてStage 0 authorizationへbindする。

そのSHA以後、execution triggerまでに変更を許可するpathは次の2つだけとする。

```text
doc/geometry-conditioned-search-reliability-exact-agreement/authorizations/STAGE_0_AUTHORIZATION.json
doc/geometry-conditioned-search-reliability-exact-agreement/executions/STAGE_0_TRIGGER.json
```

その他の変更があればStage 0 binding verifierはfail closedする。

## Authorization boundary

このauditはStage 1 / Stage 2を認可しない。Stage 0がPASSしてもfresh scientific accessは別reviewまで0のままとする。
