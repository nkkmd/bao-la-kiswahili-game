# LGPML-STUDY1 — Reproducibility Index

更新日: 2026-09-03

## Repository identity

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 9f6abd3c9b146bb88c11dd04963052300e4cdc3b
research branch = research/g3-08-local-geometry-persistence-memory-length
Study ID = LGPML-STUDY1
current status = CLOSED / TECHNICAL-INVALID
Study/tooling freeze commit = b293acc5943fab9100f512ed7008dd46583be763
Stage 0 trigger commit = 830d1d9dce139deca08d91c94ba98da8a784c498
Stage 1 authorization commit = a7904798de848fe8af3bd7e66b1b81741590ba95
Stage 1 trigger commit = bfd0f7b0f754b4ffc14faae018a2ceb52647677f
Stage 1 exact-result mirror commit = 79fb4c51940d255e05c8e1c5469f1f759b81bf26
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
Stage 1 = 31810001..31810256 / CONSUMED / same-evidence rerun prohibited
Stage 2 = 31820001..31820384 / NOT CONSUMED
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

## Stage 1 authorization / exactly-one execution

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
workflow conclusion = failure after canonical STAGE1-TECHNICAL-INVALID result
lease artifact = 9884042604
lease ZIP SHA-256 = 61a50d3e5657dd8a84dc4e63780e9a715829db2daa8285e78d88dc3af22eda28
authorized scientific executions = 1
actual scientific executions = 1
no-rescue boundary = CROSSED / ACTIVE
same-evidence rerun = PROHIBITED
protected depth-10 access = false
```

## Stage 1 canonical technical-invalid result

```text
stageDisposition = STAGE1-TECHNICAL-INVALID
technical error = relay-limit enumeration 74581ece7d29895d9727bb9cd507046f98a158b51466abdeaa335eb9e60d510e
formal promoted candidate set = []
promoted candidate count = 0
stage2AutomaticallyAuthorized = false
```

Workflow log recorded 9 complete trajectory aggregations before the technical error:

`31810001, 31810003, 31810004, 31810010, 31810015, 31810016, 31810024, 31810025, 31810028`.

These are technical provenance only and are not a valid complete Stage 1 scientific summary.

Durable result artifact:

```text
artifact ID = 9886738874
artifact name = lgpml-stage1-result-33731577464
artifact size = 791 bytes (ZIP)
artifact ZIP SHA-256 = ef2ed1d6c28b30461d03f3a294cb3cb3d11d9f951fa24b6e6f2a94f546d6f53c
scientific-result.json = 1718 bytes
scientific-result.json SHA-256 = e8bb384dd8ba526029ee62753836847f25b45546e013fb4b224f5ab02c68a46c
```

Canonical repository file:

`results/stage-1/scientific-result.json`

Exact mirror commit:

`79fb4c51940d255e05c8e1c5469f1f759b81bf26`

scientific recomputation during mirror = false。

## Stage 2 fresh-free tooling and non-execution

```text
Stage ID = LGPML-S2-FORMAL-2026-09-03-v1
authorization = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed access = false
pretooling audit v1 = TECHNICAL FIXTURE EXPECTATION FAILURE / no scientific consequence
pretooling audit v2 run = 33732602250
pretooling audit v2 job = 100575749583
pretooling audit v2 disposition = STAGE2-PRETOOLING-AUDIT-PASS
lag-window identity fixture count = 173
production/independent formal semantics = EXACT
Stage 2 runner/verifier/workflow = PREPARED / UNARMED / UNUSED
protected depth-10 access = false
```

Valid Stage 1 completionとnonempty promoted setがないため、Stage 2 authorization prerequisiteは満たさない。

## Formal closure

```text
LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed block = CONSUMED
Stage 2 seed block = NOT CONSUMED
same-evidence rescue = PROHIBITED
```

Canonical scientific interpretationは`STUDY_1_FINAL_REPORT.md`を参照する。partial trajectory outputやtechnical error diagnosticをscientific geometry-persistence evidenceとして再利用しない。

## Historical pre-integration boundary

At G3-08 scientific closure, `main` integration was **NOT AUTHORIZED** and remote `main` was `9f6abd3c9b146bb88c11dd04963052300e4cdc3b`. This is retained as closure-time provenance; the later authorized integration is recorded below.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout = `SEALED / NOT GENERATED / NOT READ / NOT PEEKED`。

<!-- LGPML-FINAL-DOC-FOLLOWUP -->
## Final document consistency follow-up

A post-closure read-through found stale downstream/lifecycle wording in inherited G3-04..G3-07 current-facing documents and one duplicate obsolete G3-08 status line in the RG3 README. These are repository-documentation metadata only; no scientific content changed. The correction is recorded in `checkpoints/2026-09-03-final-document-consistency-followup-pass.md`.

At that follow-up checkpoint, the then-current state was: G3-08 / `LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID`; G3-09 `NOT AUTHORIZED`; protected depth-10 sealed; G3-08 main integration not yet performed. Those statements are historical checkpoint provenance. Current program state is authoritative in `../research-generation-3/CURRENT_STATUS.md`; G3-08 integration is complete and G3-09 / `CLGR-STUDY1` is now `CLOSED / TECHNICAL-INVALID`.

<!-- LGPML-G3-08-MAIN-INTEGRATION -->
## Main integration

2026-09-03、明示的ユーザー指示後にremote `main`をpre-integration SHA `9f6abd3c9b146bb88c11dd04963052300e4cdc3b`からaudited G3-08 research tip `72bd208267359f461e9dbbde938bb952eb01b91c`へfast-forwardした。`force=false`。squash、rebase、history rewrite、scientific recomputationは行っていない。

Post-integration documentation finalizationはrepository-lifecycle metadataのみを更新し、scientific result、preregistration、seed、candidate set、protected evidenceを変更しない。
