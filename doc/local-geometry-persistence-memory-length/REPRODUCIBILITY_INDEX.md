# LGPML-STUDY1 — Reproducibility Index

更新日: 2026-09-03

## Repository identity

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 9f6abd3c9b146bb88c11dd04963052300e4cdc3b
research branch = research/g3-08-local-geometry-persistence-memory-length
Study ID = LGPML-STUDY1
current status = PROSPECTIVE-FROZEN / STAGE0-PASS / STAGE1 EXACTLY-ONE EXECUTION IN PROGRESS
Study/tooling freeze commit = b293acc5943fab9100f512ed7008dd46583be763
Stage 0 trigger commit = 830d1d9dce139deca08d91c94ba98da8a784c498
Stage 1 authorization commit = a7904798de848fe8af3bd7e66b1b81741590ba95
Stage 1 trigger commit = bfd0f7b0f754b4ffc14faae018a2ceb52647677f
```

## Frozen contracts

- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`
- `STUDY_1_PROTOCOL.md`

## Frozen upstream bindings

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
lgtgmiv-stage1-production.js = a4664f01535d6abbf6f83821befbb2fafd55cde6
lgtgmiv-stage1-independent.js = 0c7239ac7acf146e9aee63dae66194681b8631d6
lgpml-production.js = 44f6f549badba294074b29e512c630ab450bec35
lgpml-independent.js = 71b6c85f0648087d3e6dd582b97d0601c1fb57d1
Stage 1 lgpml-stage1-production.js = 920c33f96e8e084531fd147e422082ca0c83ea33
Stage 1 lgpml-stage1-independent.js = af463c78801f5546b3ab8b6baeef6153c33d2241
Stage 1 runner = bc3ff94b7f964f36503ec90c826c1ec854aad35c
Stage 1 authorization verifier = bcb8476692f1b80776bb03381dc696e6be03a89c
Stage 1 workflow = 117c44e853c184565425e7305bc35d957831cc20
```

## Stage namespaces

```text
technical = 31809001..31809008 / scientific use prohibited
Stage 1 = 31810001..31810256 / fresh access started in exactly-one authorized execution / no rerun
Stage 2 = 31820001..31820384 / not consumed
```

## Stage 0

```text
Stage ID = LGPML-S0-TECHNICAL-2026-09-03-v1
disposition = STAGE0-PASS
workflow run = 33727822427
job = 100560742801
lease artifact = 9882644942
lease ZIP SHA-256 = dbc68c9d2726a7711d2c966999c0e668bedc878a16ced28bf386de1364a897b2
result artifact = 9882655923
result ZIP SHA-256 = 44be205b804a549dfcf9d73cb99bbc3532ec946c8529134edf13f26326184c03
deterministic core = 6e51e95ae7afa97fb8993e698dbe7f290454433f012bb24cbc17b6d1d1b8411d
technical seed = 31809002 / scientific use prohibited
measured roots = plies 16,17,44,45
max combined root elapsed = 10877 ms
fresh scientific seed access = false
protected depth-10 access = false
```

Canonical compact result: `results/stage-0-v1/STAGE_0_TECHNICAL_RESULT.json`。

## Upstream identity-only firewall

```text
materialization = PASS
scientific outcome fields retained = false
G3-07 Stage 2 deterministic selection core = c78f561bb6fdeadad50c968313073f8d0b6cc87c94e1e961c28e43ab7389bd89
rootRawSha256 count = 269
sourceTrajectorySha256 count = 244
openingPrefixSha256 count = 187
identity core = d123435bb93d5746e7a1fee8b9b35d166a5bff57ce681c8df01d987a64f6a7d3
Stage 1 seed access during materialization = false
protected depth-10 access = false
```

Canonical manifest: `prereg/UPSTREAM_IDENTITY_FIREWALL.json`。

## Stage 1 authorization / execution

```text
Stage ID = LGPML-S1-DEVELOPMENT-2026-09-03-v1
preauthorization audit run = 33729048934
preauthorization audit job = 100564565986
preauthorization disposition = STAGE1-PREAUTH-STATIC-AUDIT-PASS
authorization = STAGE1-AUTHORIZED / max scientific executions 1
authorization commit = a7904798de848fe8af3bd7e66b1b81741590ba95
trigger commit = bfd0f7b0f754b4ffc14faae018a2ceb52647677f
workflow run = 33731577464
job = 100572486927
run attempt = 1
lease artifact = 9884042604
lease ZIP SHA-256 = 61a50d3e5657dd8a84dc4e63780e9a715829db2daa8285e78d88dc3af22eda28
scientific computation status = IN PROGRESS / RESULT NOT YET AVAILABLE
no-rescue boundary = CROSSED
same-evidence rerun = PROHIBITED
result recovery = EXACT-BYTE ARTIFACT RECOVERY ONLY / NO RECOMPUTATION
protected depth-10 access = false
```

## Stage 2 fresh-free tooling state

```text
Stage ID = LGPML-S2-FORMAL-2026-09-03-v1
authorization = NOT AUTHORIZED
Stage 2 seed access = false
pretooling audit v1 = TECHNICAL FIXTURE EXPECTATION FAILURE / no scientific consequence
pretooling audit v2 run = 33732602250
pretooling audit v2 job = 100575749583
pretooling audit v2 disposition = STAGE2-PRETOOLING-AUDIT-PASS
lag-window identity fixture count = 173
production/independent formal semantics = EXACT
Stage 2 runner/verifier/workflow = PREPARED / UNARMED
Stage 1 identity/formal input materializer = PREPARED / NOT TRIGGERED
protected depth-10 access = false
```

Stage 2 authorization is impossible until the canonical Stage 1 result is recovered and evaluated under the frozen Stage 1 disposition/promotion contract.

## Main integration boundary

`main` integration is **NOT AUTHORIZED**. The user has explicitly required that integration must not occur until a later explicit instruction. Current remote `main` remains `9f6abd3c9b146bb88c11dd04963052300e4cdc3b`.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout = `SEALED / NOT GENERATED / NOT READ / NOT PEEKED`。
