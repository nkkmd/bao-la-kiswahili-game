# 2026-08-30 — Stage 1 scientific runner / artifact contract source freeze

## boundary

このcheckpointを含むcommitで、Stage 1 scientific consume-once runner、scientific workflow、full-shard packaging preflight、execution contractをsource-freezeする。

```text
Stage 1 scientific authorization = false
Stage 1 scientific seeds = RESERVED / UNCONSUMED
Stage 2 scientific authorization = false
Stage 2 scientific seeds = RESERVED / UNCONSUMED
```

## prerequisites already passed

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 tooling smoke accepted run = 33296341604
Stage 1 tooling smoke disposition = STAGE1-TOOLING-SMOKE-PASS
production/independent full smoke exact = true
scientific seed use through tooling smoke = 0
```

invalid technical attempt `33296234733`はimplementation-only defectとして別checkpointに保存し、contract / feature / threshold / seedを変更していない。

## source-frozen execution architecture

- `prereg/STAGE_1_EXECUTION_CONTRACT.json`
- `tools/experiments/run-umssr-stage1-packaging-preflight.js`
- `tools/experiments/run-umssr-stage1-development.js`
- `.github/workflows/umssr-stage1-packaging-preflight.yml`
- `.github/workflows/umssr-stage1-development.yml`

scientific runnerはexplicit authorizationなしに実行されない。

## consume-once gate

scientific runnerは次を**seed生成前**に検証する。

1. authorization artifactが`authorized=true`である。
2. authorization commitの親がauthorizationに記録したsource-freeze commitである。
3. Stage 1 spec / feature dictionary / Stage 2 validation / execution contract / tooling smoke result / packaging preflight resultのSHA-256がauthorization bindingと一致する。
4. execution contractに列挙したsource pathのGit blob SHA-1がauthorizationと一致する。
5. seed blockが`29310001..29314096`で`RESERVED_UNCONSUMED`としてauthorizationされている。
6. tooling smokeとpackaging preflightがPASSしている。

以上を通過後、`CONSUMPTION_RECORD.json`を先に保存してからscientific generationを開始する。

その後のtechnical / resource / artifact failureでもseedをUNCONSUMEDへ戻さない。同一block rerun / repair / replacement / extensionは禁止する。

## scientific final decision order

runnerはrepresentation存在をglobal readinessから分離し、次の順序で判定する。

1. production / independent mismatch -> `STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`
2. resource / shard ceiling failure -> `STAGE1-RESOURCE-CENSORED`
3. prospectively frozen global readiness failure -> `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`
4. readiness PASS + eligible representationなし -> `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`
5. readiness PASS + eligible representationあり -> `STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN`

## artifact contract

mandatory:

```text
CONSUMPTION_RECORD.json
FINAL_EXACT_COMPARISON.json
STAGE_1_DEVELOPMENT_RESULT.json
ESSENTIAL_CORE.json
HASH_MANIFEST.json
production/full-shard-0001.json.gz
independent/full-shard-0001.json.gz
```

representation PASS時のみ`FROZEN_REPRESENTATION.json`もmandatoryとする。

full-shard ceilingとruntime/RSS ceilingは既存Stage 1 development specから変更しない。

## packaging preflight

このsource-freeze pushでtechnical-only packaging preflightを起動する。technical seeds `29300001..29300064`だけを用いてfull production / independent payloadをgzip保存し、scientific-scale projectionをfrozen ceilingと比較する。

preflight outcomeを見てscientific population、feature、threshold、K、Stage 2 endpointを変更しない。implementation defectだけを同じscientific contractのまま修正できる。

## authorization after PASS

packaging preflightがPASSした場合、canonical preflight resultとexplicit Stage 1 authorizationを**同一commit**に追加する。そのcommitの親をこのsource-freeze commitとする。

これによりscientific runnerがauthorization commit ancestryとpreflight source commitを直接検証できる。
