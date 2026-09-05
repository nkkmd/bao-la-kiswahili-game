# BECT-STUDY1 — 再現性索引

更新日: 2026-09-02

## baseline（開始時点）

```text
repository = nkkmd/bao-la-kiswahili-game
program review baseline main = 99eb6f571dbd1e1a41f12c65c2efb7c62930de45
post-decision branch baseline main = 127a9653933c623307c8423fddaf42166090f11b
research branch = research/g3-05-branch-expansion-compression-transition
Study ID = BECT-STUDY1
```

## program authorization （承認状態）

- `../research-program-decisions/2026-09-02-post-g3-04-g3-05-authorization-review.md`
- `../research-generation-3/checkpoints/2026-09-02-post-g3-04-g3-05-authorization-review.md`
- decision: `G3-05-AUTHORIZED`

## 結果を見る前に固定したcontract

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `prereg/STUDY_1_SPEC.json`

最初のprospective freeze commit:

```text
machine prereg initial commit = c20fca50881c2f385cdf9f0e5065258fdbf66310
protocol initial commit = 2bfc9174c4630a3d0c4194704bdf5df81c2af536
README initial commit = 0781a4e64adfefdbb256e794d557ef5e06ed0248
overview initial commit = 62c847ccf51a3d833c0cb0e32f1fcd589c45d3b2
current-status initial commit = 33faf7c40dcf7aa71e4185fca25715f1c5b977a3
decision-register initial commit = 16ee2127d6b09128fc4b335dfb309d2383e6e0d1
```

## 固定済みupstream source binding

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
tools/experiments/lib/lgtgmiv-stage1-production.js = a4664f01535d6abbf6f83821befbb2fafd55cde6
tools/experiments/lib/lgtgmiv-stage1-independent.js = 0c7239ac7acf146e9aee63dae66194681b8631d6
tools/experiments/lib/bect-production.js = b8fa63e941b4da1fec0969155c09754eae151a56
tools/experiments/lib/bect-independent.js = bb085c648d2f4f3d7d44f206f04036e95f94980b
```

## representationとequality

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
validated transforms = []
relative horizon = 5
cross-implementation scientific equality = canonical sorted-key JSON -> UTF-8 -> SHA-256 exact equality
prototype-sensitive runtime equality = NOT A SCIENTIFIC GATE
```

## Stage 0前に固定したclarification

`prereg/STUDY_1_SPEC_CLARIFICATION_1.json`

```text
blob = 90869977c1977bbc10f4834228ee69b9151ce250
M5 denominator = sum uniqueTransitionCount[d], d=0..4
fresh evidence before clarification = false
Stage 0 fixture before clarification = false
```

## 予約済みfresh namespace

```text
Stage 1 = 31510001..31510240 / CONSUMED / CLOSED TO SAME-EVIDENCE REUSE
Stage 2 = 31520001..31520384 / NOT CONSUMED / NOT AUTHORIZED
```

## protected evidence （証拠の状態）

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
```

BECT actionから、このholdoutをgeneration、partial generation、read、peek、trial enumeration、resource estimationに使用してはならない。

## Stage 0前のstatic audit v1

```text
workflow = .github/workflows/bect-stage0-static-audit.yml
run = 33631463838
result = success
fixture execution = false
technical seed access = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

## Stage 0 v1 — `TECHNICAL-INVALID`となった経緯

Stage ID:

`BECT-S0-TECHNICAL-2026-09-02-v1`

Authorization:

- `authorizations/2026-09-02-stage-0-technical-authorization.md`
- nonce `BECT-S0-AUTH-2026-09-02-V1-01`
- max formal executions = 1

Execution:

```text
workflow = .github/workflows/bect-stage0-technical.yml
run = 33631597307
job = 100252124483
head = 4e34e624740df600182206dbde54827d7b071ee8
actual formal executions = 1
result = TECHNICAL-INVALID
```

branch-advancement allowlistと固定済みsource-binding gateはPASSした。technical seed `31500001`がrunnerの固定root pair 24->25より前にterminalとなったため、fixture stepはbounded measurement前にfailedした。

fresh scientific seed、Stage 1 seed、Stage 2 seed、protected depth-10 evidenceにはアクセスしていない。v1は再実行していない。

## Stage 0 v2のtechnical refreeze

v1 failure後、新しいtechnical versionを次のとおり固定した。

- `prereg/STAGE_0_V2_TECHNICAL_REFREEZE.json`
- blob `e59e82c6e73ee241b48d6106377805857cb11588`
- Stage ID `BECT-S0-TECHNICAL-2026-09-02-v2`

scientific Study contractは変更していない。technical changeは次の一点に限る。

```text
fixed root pair 24->25
=> latest consecutive nonterminal post-move root pair in the fixed technical replay
```

同じv1 executionは再試行していない。

## Stage 0前のv2 static audit

```text
run = 33631962037
job = 100253335120
result = success
fixture execution = false
technical seed access = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

auditはfixtureを実行せず、v2 syntax、refreeze identity、固定済みStage 1 / Stage 2 seed block、protected-evidence boundaryを確認した。

## Stage 0 v2 — `STAGE0-PASS`となった結果

Authorization:

- `authorizations/2026-09-02-stage-0-v2-technical-authorization.md`
- blob `2a6b036aba9453e50b3e5e9ea19922dffde964e7`
- nonce `BECT-S0-AUTH-2026-09-02-V2-01`
- max formal executions = 1

Implementation:

```text
tools/experiments/run-bect-stage0-technical-v2.js = 5d72e6187db911758f2e9822971a11055aea30bc
workflow = .github/workflows/bect-stage0-technical-v2.yml
```

Execution:

```text
run = 33632094597
job = 100253778721
head = 9a2c4549f748085ec11b8f30263e97459b3caff4
actual formal executions = 1
conclusion = success
stage disposition = STAGE0-PASS
```

Durable artifact:

```text
artifact ID = 9847240252
name = bect-stage0-technical-v2-33632094597
size = 1265 bytes
ZIP SHA-256 = ac0b114f40e610b2353c03757a3e69839fcea4674a035a5935e795d82571292f
expired = false
```

Artifact exact files:

```text
results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json
SHA-256 = 8e3cb7631fcbdc3acee486f5b1495987b81624cea65746879824eac7328d25fe

results/stage-0-v2/STAGE_0_TECHNICAL_PROVENANCE.txt
SHA-256 = 3f533544209763106d83548844505a482ee7dc9184813d79e1d88db195559453
```

repository mirrorはdownloadしたartifact byteから作成し、recoveryのためにtechnical resultを再計算していない。

Deterministic technical result:

```text
technical seed = 31500001 / permanently prohibited from scientific use
observed trajectory length = 24
measured root pair = 22 -> 23
root selection = latest consecutive nonterminal post-move root pair
trajectory replay exact = true
adjacent successor binding exact = true
overlapping-window semantics exact = true
repeated RAW identity time-index semantics exact = true
production/independent root reconstruction exact = true
production/independent family exact = true
production/independent BECT level exact = true
canonical prototype-insensitive equality = true
implementation separation = true
deterministic core SHA-256 = f446b41b33910071cdef310bedd53e734e19d38dca7083b6efe9504a6bdbe716
fresh scientific seed access = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

## Stage 0のexecution-count audit

Stage 0後のbranch Actions historyには、次のBECT push run 4件がある。

1. static audit v1 `33631463838` — 非computational audit
2. Stage 0 v1 `33631597307` — authorizeされたformal technical execution 1回
3. static audit v2 `33631962037` — 非computational audit
4. Stage 0 v2 `33632094597` — authorizeされたformal technical execution 1回

Therefore:

```text
Stage 0 v1 = 1 authorized / 1 actual / no rerun
Stage 0 v2 = 1 authorized / 1 actual / no rerun
fresh Stage 1 executions = 0
fresh Stage 2 executions = 0
```

## Stage 0のclosure boundary

`BECT-S0-TECHNICAL-2026-09-02-v2 = STAGE0-PASS`は、別個のStage 1 authorization reviewへ進むtechnical eligibilityを確立する。fresh Stage 1 seed accessまたはexecution自体をauthorizeするものではない。

## Stage 1のprospective clarification 2

`prereg/STUDY_1_SPEC_CLARIFICATION_2.json`

```text
blob = 87e78b008024301a26f78d1ac488d8489f9bd02b
fresh evidence before clarification = false
Stage 1 seed access before clarification = false
coverage rule = metric defined at all 48 analysis roots on all 10 selected trajectories
longitudinal identity rules = prospectively fixed before fresh evidence
```

このclarificationが解消するのはimplementation ambiguityだけである。endpoint universe、event grammar、population、seed block、horizon、representation、promotion gate、formal test、resource ceilingは変更しない。

## Stage 1 identity-only firewall （証拠分離規則）

Materialization:

```text
run = 33634116550
job = 100260542549
artifact = 9848023294
artifact ZIP SHA-256 = da16c9103f80de82051b229239491535604f20b903e427d5b4898c7126d1418b
identity file SHA-256 = 771297c0fa0f2c9de3f74f85ba1b52d58de9e4ab1ae19c7421643436c0156926
identity core SHA-256 = 5b8246baf0f0b13fdfbc40b55bf3298895e7f0da660ca6b1275880361c4b7417
root identities = 124
trajectory identities = 124
opening-prefix identities = 67
scientific outcome fields retained = false
```

Exact-byte mirror:

```text
run = 33634259594
job = 100261031754
mirror commit = 229527b993012c8019ef782c62f4d2652ee0c7f9
UPSTREAM_IDENTITY_FIREWALL.json blob = 123430eb0cbe100bf50e068ee4c4ee7dc52c2ca8
```

BECT identity firewallは、G3-03 diagnostic scientific fieldとG3-04 scientific outcome fieldを保持しない。

## Stage 1の固定済みscientific implementation

```text
tools/experiments/lib/bect-stage1-production.js = 32995ed7e666b7cff7a6bb43946a30cdc86a7668
tools/experiments/lib/bect-stage1-independent.js = fcc150bdfcfbb1727ea6e0fdd4f336d1ae36e1e6
tools/experiments/run-bect-stage1-development.js = 127cb10ea23d18f0a32c2adc2d8c499de4c19b04
.github/workflows/bect-stage1-development.yml = dcb39d07420ad81db9e10d0ba08a10a9a3cb7cb7
```

production / independent selectorとaggregatorはimplementationを分離している。scientific workflowはdedicated trigger path、`cancel-in-progress: false`、durable pre-computation lease、exact source binding、branch-advancement allowlist、artifact-before-repository-mirror boundaryを使用する。

## Stage 1 preauthorization validation （承認状態）

Static audit:

```text
run = 33635090198
job = 100263846393
result = PASS
scientific runner execution = false
Stage 1 seed access = false
```

最初のtooling smoke `33635334088`は、fresh access前にunarmed runnerがfail closedすることを確認した。最後のstatic trigger-string count assertionにdefectがありfailedしたが、scientific consequenceはない。

Corrected tooling smoke:

```text
run = 33635443176
job = 100265043171
result = PASS
unarmed runner fail-closed = PASS
single scientific trigger declaration = PASS
concurrency/lease/artifact path gates = PASS
Stage 1 seed access = false
```

Source validation:

```text
run = 33635524477
job = 100265316151
result = PASS
exact source bindings = PASS
scientific workflow execution = false
Stage 1 seed access = false
```

Durable lease-path smoke:

```text
run = 33635710262
job = 100265942917
result = PASS
technical trigger commit = bd7a7ef367b170e79d874d941bd0583513d02baa
durable technical marker commit = a588dbbaf01d1c5a5d5191ef3f34b9e054ab8037
scientific authorization = false
scientific computation = false
Stage 1 seed access = false
```

lease smokeはnon-scientific markerに対して実際のGitHub contents-write / branch-push pathを使用し、scientific workflowをtriggerしなかった。

## Stage 1 preauthorization checkpoint （承認状態）

`checkpoints/2026-09-02-stage-1-preauthorization-tooling-pass.md`

```text
blob = 86df093e85d14fc1a9c931e818f4067cb8822949
decision = BECT-STAGE1-AUTHORIZATION-ELIGIBLE / SCIENTIFIC-EXECUTION-NOT-YET-AUTHORIZED
BECT Stage 1 Development workflow executions before authorization = 0
Stage 1 seed = NOT CONSUMED
Stage 2 seed = NOT CONSUMED
fresh BECT scientific evidence generated/read = false
no-rescue boundary = NOT CROSSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

別個のmachine-readable authorizationでpreparation後のbranch HEADをbindし、Stage 1 scientific executionをexactly oneだけ許可しなければならない。そのbaselineからcomputationまでの間にbranchを進められるのは、authorization artifactとdedicated execution trigger 1件だけである。

## Stage 1のauthorizationとexactly-once実行

authorization baselineとcontrol plane:

```text
authorized scientific content HEAD = 5ba3706193a06902650b82f1232d19bb2cee2c1e
authorization commit = 5cceaeeece7c6d7949815a47b7ef918bbae72e59
authorization nonce = BECT-S1-AUTH-2026-09-02-V1-01
maxScientificExecutions = 1
trigger commit = 75b29fd33215bd98652613975c5b0c900f065b9d
workflow run = 33636606641
lease job = 100268940443 / success
scientific job = 100268996072 / exit 2 after canonical TECHNICAL-INVALID result
lease commit = bf1f8a5940bfb87f8c92d482728aa89ce398b749
authorized scientific executions = 1
actual scientific executions = 1
fresh access started = true
Stage 1 seed consumed = true
no-rescue boundary = CROSSED / ACTIVE
```

Canonical technical error:

`relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529`

Stage 1 rerunは実施もauthorizeもしていない。

## Stage 1のdurable artifactとexact-byte mirror

```text
artifact ID = 9849245665
artifact name = bect-stage1-development-result-33636606641
artifact size = 4081 bytes
artifact ZIP SHA-256 = 0c99d05c1983a35996e283dee379e65848a8df98dda46989053ebd46873cfbcc
scientific-result.json SHA-256 = a21ad5449dfa090e4ff2ed87ebc64a48b5fb0755eabd0dcfe375358bde7d0b96
telemetry.json SHA-256 = 0608c9f035a19c4908ba02d0b462e2e0f4ca08226df3ec1062d2086dbca7f2b4
execution-summary.json SHA-256 = b54f441cadac0252dc15deac07c90974bc28e18d26d2dd3934b3fb6707fb352f
mirror workflow run = 33637372364
mirror commit = ac2bd2ca101a9002c69131c2c39ebbfbb98368a1
scientific recomputation for recovery = false
```

exact-byte mirror後のrepository blob:

```text
results/stage-1/scientific-result.json = c7daf6f7d2f4ea96fa0b752ff90216daff800482
results/stage-1/telemetry.json = 378bab53d13b6bd27c961dffda1a2ec797a94009
results/stage-1/execution-summary.json = 58281cb78e364947a32e0a8fbec05581a32ce11a
```

partial telemetryには最初に選択したtrajectoryの25 root（ply 16..40）が含まれる。これらのrowはdiagnostic provenanceに限られ、有効なStage 1 development datasetを構成せず、formal promotionに使用できない。

## formal closure（正式な終了状態）

Canonical records:

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `checkpoints/2026-09-02-stage-1-technical-invalid-study-closure.md`
- `../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`
- `../research-generation-3/checkpoints/2026-09-02-g3-05-technical-invalid-closure.md`

```text
BECT-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = NOT CONSUMED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
main integration = NOT PERFORMED
```

このclosureはtechnical validity resultであり、Bao geometry transitionに対するnegative / null scientific resultではない。same-evidence rescueは禁止する。
