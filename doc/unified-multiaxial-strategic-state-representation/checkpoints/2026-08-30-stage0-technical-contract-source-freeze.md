# 2026-08-30 — UMSSR-STUDY1 Stage 0 technical contract / source freeze

## 目的

`UMSSR-S0-TECHNICAL-2026-08-30-v1`をscientific evidence生成前・Stage 1/2 seed未消費の状態で実行するため、technical spec、technical-only authorization、production / independent implementation、runner、GitHub Actions workflowを同一source-freeze commitへ固定する。

## technical-only境界

```text
Stage 0 scientific inference = NOT AUTHORIZED
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds 29310001..29314096 = RESERVED / UNCONSUMED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
Stage 0 execution inputs = HAND-BUILT-TECHNICAL-FIXTURES
scientific seed use = FORBIDDEN
```

## 固定するsource

- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `authorizations/STAGE_0_TECHNICAL_EXECUTE.json`
- `tools/experiments/lib/umssr-stage0-production.js`
- `tools/experiments/lib/umssr-stage0-independent.js`
- `tools/experiments/run-umssr-stage0-technical.js`
- `.github/workflows/umssr-stage0-technical.yml`

workflowを含むcommit SHAそのものをStage 0 source freeze identityとし、runnerは`git rev-parse HEAD`をresultへ記録する。

## mandatory technical gates

Stage 0では少なくとも次をfail-closedで検証する。

1. initial contract binding
2. required source path presence / SHA-256 materialization
3. RAW identity production / independent exact agreement
4. `turn/reason` exclusionと`pending` inclusion
5. fresh technical observable exact agreement
6. IEEE-754 binary64 canonical hexによるnumeric identity
7. G2-02系search instrumentのproduction / independent technical reconstruction agreement
8. Research Generation 1 `TM-S2-C03`のoriginal frozen scope内exact reconstruction
9. G2-05 bounded depth-9 exact control binding
10. historical morphology executable availability audit
11. independent helper separation
12. scientific seed non-use
13. resource ceiling

## candidate-specific technical ineligibility

historical morphology classifierが現在のpreserved repositoryからexact reconstructionできないことは、既存formal morphology claimの否定ではない。

Stage 0でG2-08のstatic auditとartifact absenceが再確認された場合:

```text
historical morphology direct executable use in G2-10 = INELIGIBLE
fresh morphology concept, if later selected = DEVELOPMENT-CANDIDATE-ONLY
whole Stage 0 = may still PASS
```

refit / replacementはStage 0では行わない。

## numeric policy

G2-06のfloating-point accumulation-order failureを踏まえ、technical float identityは次で固定する。

```text
arithmetic = IEEE-754 binary64
aggregation order = lexical canonical
canonical float encoding = big-endian binary64 lowercase hex
tolerance rescue = NOT AUTHORIZED
object insertion order as numeric identity = NOT AUTHORIZED
```

## technical repair rule

Stage 0はnon-scientificであるため、implementation defectが生じた場合に限り、以下をすべて維持して修正rerunできる。

- scientific seed消費なし
- scientific outcome生成なし
- technical fixtures不変
- gate relaxationなし
- eligibility relaxationなし
- resource ceiling relaxationなし
- threshold / scientific contract変更なし

invalid attemptは記録し、隠してはならない。

## Stage 1への境界

Stage 0 PASSはStage 1を自動authorizeしない。Stage 1 scientific seed消費には、別途Stage 1 source / population / axis / feature / scaling / representation-selection / readiness / formal-endpoint contractのfreezeと明示的authorizationを必要とする。
