# 2026-08-31 — G3-01 Stage 0 implementation freeze

Stage 0 technical execution前に、production implementation、structurally independent implementation、runner、verifier、Actions workflowをresearch branch上で固定した。

```text
Study ID = LGTGMF-STUDY1
Stage ID = LGTGMF-S0-TECHNICAL-2026-08-31-v1
Scientific evidence class = TECHNICAL-FIXTURE / HISTORICAL-EXACT-REFERENCE only
Scientific seed consumption = NONE
Stage 1 seed read = PROHIBITED
Stage 2 seed read = PROHIBITED
standard initial RAW root complete depth-10 generation/read = PROHIBITED
```

## Implementation separation

Production:
- `tools/experiments/lib/lgtgmf-production.js`
- `tools/experiments/run-lgtgmf-stage0-technical.js`

Independent:
- `tools/experiments/lib/lgtgmf-independent.js`
- `tools/experiments/verify-lgtgmf-stage0-independent.js`

Independent pathはproduction serializer、move key、tree traversal、deduplication、transposition/reconvergence aggregation、reply geometry aggregation、result assemblyをimportしない。共有するのはauthoritative `public/engine.js`とNode標準cryptographic primitiveに限定する。

## Stage 0 execution design

- T00: RAW serialization / transient-field exclusion / pending-required / 64-seed invariant
- T01..T07: prospectively known synthetic fixture
- T08: ascending / descending / deterministic shuffled traversal-order invariance
- T09: G2-05 historical exact referenceのstandard initial root depth 0..2のみ再構築

T09 reference anchors:

```text
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
cumulative RAW states through depth 2 = 19
cumulative global RAW transitions = 18
cumulative RAW state set SHA-256 = 0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f
cumulative transition set SHA-256 = be534cbc3e99808a668483c21fca1720dc5ea5a7ac442075294f21a8542baea1
```

## Authorization firewall

このimplementation freeze commit自体ではworkflowを実行しない。別commitで`authorizations/STAGE_0_TECHNICAL_EXECUTE.json`を作成した場合のみ、workflowがそのauthorization commitの親SHAと本implementation freeze commitの一致を検証してStage 0を実行する。

Stage 0はtechnical-onlyであり、その成否によってG2-05、G2-12、Research Generation 2 closureを変更しない。
