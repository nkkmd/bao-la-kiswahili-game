# PSRRE-STUDY1 — Stage 1 scientific runner / artifact contract source freeze

Date: 2026-08-30

## 境界

このcheckpointを含むcommitで、Stage 1 consume-once scientific runner、artifact packaging contract、technical-only packaging preflight、scientific workflowを固定する。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 tooling smoke = TOOLING-SMOKE-PASS
Stage 1 scientific authorization = false
Stage 1 scientific seeds = RESERVED_UNCONSUMED
Stage 2 scientific authorization = false
G2-11 authorization = false
```

## 固定するexecution architecture

- `prereg/STAGE_1_EXECUTION_CONTRACT.json`
- `tools/experiments/run-psrre-stage1-packaging-preflight.js`
- `tools/experiments/run-psrre-stage1-development.js`
- `.github/workflows/psrre-stage1-packaging-preflight.yml`
- `.github/workflows/psrre-stage1-development.yml`

scientific workflowはexplicit authorization artifactの追加以外では起動しない。

## consume-once gate

scientific runnerはscientific generationより前に次を検証する。

1. `authorized=true`のStage 1 authorizationが存在する。
2. authorization commitの親がauthorizationに記録されたsource-freeze commitである。
3. Stage 1 spec、feature dictionary、Stage 2 contract、execution contract、tooling-smoke result、packaging-preflight resultのSHA-256がauthorization bindingと一致する。
4. execution contractに列挙したsource pathのGit blob SHA-1がauthorizationと一致する。
5. seed blockが`29510001..29514096`で`RESERVED_UNCONSUMED`として承認されている。
6. tooling smokeとpackaging preflightがPASSしている。

全gate PASS後、`CONSUMPTION_RECORD.json`を最初にmaterializeしてからscientific generationへ入る。それ以降にtechnical / resource / artifact failureが起きてもseed blockをunconsumedへ戻さず、same-block rerun / repair / replacement / extensionを行わない。

## final decision order

1. production / independent mismatch → `STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`
2. resource / mandatory artifact failure → `STAGE1-RESOURCE-CENSORED`
3. population / active-feature readiness failure → `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`
4. readiness PASS + eligible representation 0 → `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`
5. readiness PASS + eligible representationあり → `STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN`

## packaging preflight

このsource-freeze commitではtechnical-only packaging preflightを自動実行する。`29500001..29500064`だけをtechnical seedとして用い、128-row synthetic stress matrixで3 family × `K=2..8`のmodel plumbingを検証する。

scientific-scale projectionにはcontractで固定した保守的safety multiplierを用いる。preflight outcomeを見てpopulation、28-feature dictionary、representation family、K、support / silhouette / stability threshold、Stage 2 endpointを変更しない。

## authorization after PASS

packaging preflightがPASSした場合、canonical preflight resultとStage 1 explicit authorizationを、このsource-freeze commitを直接親とする**同一commit**に追加する。そのcommitのみがscientific workflowを起動できる。

Stage 1結果によってG2-10 closureを変更しない。Stage 1 PASSでもStage 2またはG2-11を自動authorizeしない。
