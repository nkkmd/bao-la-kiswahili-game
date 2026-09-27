# G4-08 / BRSGT-STUDY1 — 現在の状態

更新日: 2026-09-27  
状態: **STAGE 0 v2 PASS / STAGE 1 v1 TECHNICAL-INVALID・NO-RERUN / STAGE 1 v2 PREREGISTERED・PRE-FRESH STATIC AUDIT PENDING**

## Formal identity

```text
Agenda = Research Generation 4 / G4-08
Study ID = BRSGT-STUDY1
Branch = research/g4-08-rule-semantic-geometry-transition
Reviewed main = 2023860419d13b6f294b0600943de8fb4e50b1bb
Authorization review = G4-08-AUTHORIZATION-REVIEW-2026-09-27-V1
```

## Current boundary

```text
Stage 0 v1 = TECHNICAL-INVALID / NO-RERUN
Stage 0 v2 = STAGE0-PASS / COMPLETE
Stage 1 v1 = TECHNICAL-INVALID / NO-RERUN-SAME-VERSION
Stage 1 v1 seed block = 40813001..40813512 / CONSERVATIVELY CONSUMED / NO REUSE
Stage 1 v2 = PREREGISTERED / PRE-FRESH PREPARATION COMPLETE / SCIENTIFIC EXECUTION NOT AUTHORIZED
Stage 1 v2 seed block = 40814001..40814512 / RESERVED / NOT ACCESSED
Stage 1 v2 authorization file = ABSENT
Stage 1 v2 scientific trigger file = ABSENT
Stage 2 = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED / NOT ACCESSED
public AI change = NOT AUTHORIZED / NONE
main integration = NOT AUTHORIZED
```

## Stage 0 v2 canonical result

```text
Stage ID = BRSGT-S0-TECHNICAL-2026-09-27-v2
workflow run = 36295553800 / attempt 1
job = 108553613736
stage disposition = STAGE0-PASS
fixture count = 4
all represented seed totals = 64
geometry measurements = 7
fresh scientific seed reads = 0
Stage 2 candidate namespace reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

E1 CAPTURE、E2 NYUMBA USE-vs-STOP、E3 RESERVE-DECREMENT-NONTRANSITION、E4 NAMUA-TO-MTAJIをすべてcoverし、production / independentのunit selection、geometry endpoint、exact arithmeticが一致した。

正本: [`results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json`](results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json)

## Stage 1 v1 pre-fresh freeze and execution

Final-freeze audit:

```text
workflow run = 36298395328 / success
audit head = 4f307a5502abc1b5748c4080cdcbe7ef7d53dc71
disposition = STAGE1-PRE-FRESH-STATIC-AUDIT-PASS
scientific authorization present at audit = false
scientific trigger present at audit = false
fresh scientific seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
```

One-shot execution:

```text
workflow run = 36298620437 / attempt 1
job = 108561989069
execution HEAD = eb8220af5e1c17bb89f4bde28b6025e7b10803d1
binding = STAGE1-BINDING-PASS
stage disposition = STAGE1-TECHNICAL-INVALID
same-version rerun = FORBIDDEN
artifact ID = 10924827904
artifact ZIP SHA-256 = f95452e80b6e70bb6801c59c9767dc0231ae1522415dd12e9f9259e1c31b121d
```

## Stage 1 v1 technical failure — refined diagnosis

Actions logで保存されたterminal error:

```text
ReferenceError: freshScientificSeedReads is not defined
at tools/experiments/run-brsgt-stage1-development.js:486
```

actual counterは`freshSeedReads`である。source auditでは未定義の`freshScientificSeedReads` shorthandが計4箇所に存在した。

```text
normal path:
  identity-exclusion construction
  result construction
  summary logging
catch path:
  failure-artifact construction
```

したがって、terminal errorはcatch pathにも同じdefectがあったことを示すが、**別の先行technical errorがあったとは断定できない**。normal path上の同defectがinitiating exceptionだった可能性と、それ以前の別technical exceptionだった可能性をretained evidenceから区別できない。

`STAGE_1_FAILURE.json`は生成されず、exact fresh-read countも保存されなかった。よってv1 block `40813001..40813512` 全体を安全側でconsumed扱いとして永久に再利用しない。

正本:

- [`results/stage-1-v1/STAGE_1_V1_CANONICAL_FAILURE_RECORD.json`](results/stage-1-v1/STAGE_1_V1_CANONICAL_FAILURE_RECORD.json)
- [`checkpoints/2026-09-27-stage-1-v1-technical-invalid.md`](checkpoints/2026-09-27-stage-1-v1-technical-invalid.md)

Scientific interpretation:

```text
Stage 1 v1 scientific outcome = NONE / TECHNICAL-INVALID
formal inference performed = false
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
main integration authorized = false
```

## Stage 1 v2 frozen design

Stage ID:

`BRSGT-S1-DEVELOPMENT-2026-09-27-v2`

```text
evidence class = FRESH-DEVELOPMENT
seed block = 40814001..40814512 / 512 slots
v1 block reuse = false
source policies = same as v1
source max ply = 72
event families = E1..E4
metrics = M1..M6
relative depth = 5
representation = RAW-ONLY
formal inference = false
effect values retained = false
effect signs retained = false
Stage 2 seed access = false
G4-10 depth-11 access = false
public AI change = false
main integration = false
scientific execution authorized = false
```

v2は科学条件の変更ではなく、v1 technical invalidationからのversion-isolated correctionである。v1には利用可能なscientific resultがないため、v1 outcomeを見て条件を調整していない。

## Stage 1 v2 technical hardening

Prepared files:

```text
prereg/STAGE_1_V2_DEVELOPMENT_SPEC.json
prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json
tools/experiments/materialize-brsgt-stage1-v2-runner.js
tools/experiments/verify-brsgt-stage1-v2-binding.js
tools/experiments/audit-brsgt-stage1-v2-static.js
.github/workflows/brsgt-stage1-v2-development.yml
.github/workflows/brsgt-stage1-v2-preauth-static.yml
```

Main safeguards:

1. v1 seed blockをv2 firewallのexcluded namespaceへ明記。
2. v2 fresh blockは`40814001..40814512`へ分離。
3. v1 runnerのfrozen SHA-256をmaterializerが検証。
4. v2 runnerはcount-checked deterministic transformationで生成。
5. `freshScientificSeedReads`の4 shorthandをすべて`freshSeedReads`へ明示mapping。
6. fresh access前にintentional exceptionを発火し、実際のcatch pathが`STAGE_1_FAILURE.json`を作成できることをself-test。
7. later authorizationではstatic-audited HEAD、materializer SHA、spec SHA、firewall SHA、generated-runner SHAをbinding対象にする。
8. audit後の許可差分を`STAGE_1_V2_AUTHORIZATION.json` + `STAGE_1_V2_TRIGGER.json`の2 pathだけに限定する。

Preparation checkpoint:
[`checkpoints/2026-09-27-stage-1-v2-preparation.md`](checkpoints/2026-09-27-stage-1-v2-preparation.md)

## Protected boundaries

- G3-06 repair / reopen / rerun禁止
- G3-06 scientific namespace再利用禁止
- Stage 0 v1 rerun禁止
- Stage 1 v1 rerun禁止
- Stage 1 v1 block `40813001..40813512`再利用禁止
- Stage 1 v2 fresh accessはauthorization前禁止
- Stage 2 seed access禁止
- G4-10 depth-11 access禁止
- public AI変更禁止
- main integration禁止

## Next gate

`STAGE_1_V2_STATIC_AUDIT_TRIGGER.json`だけを追加して、現在のspec・firewall・materializer・binding・workflow・documentationを含むHEADをpre-fresh static auditする。

Static auditでは少なくとも以下をPASSさせる。

- v2 authorization / scientific trigger不在
- v1 block quarantine
- v2 seed reservation未アクセス
- frozen v1 runner SHA binding
- 4 counter mappings exact
- catch-path self-test PASS / fresh read 0
- generated v2 runner syntax PASS
- firewall materialization fresh read 0
- Stage 2 / G4-10 / public AI protection

Static audit PASS後もscientific executionは自動認可しない。別のone-shot authorization reviewを行う。
