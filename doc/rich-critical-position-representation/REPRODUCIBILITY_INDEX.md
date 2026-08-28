# RCPR-STUDY1 — Reproducibility Index

Updated: 2026-08-29  
Status: **ACTIVE / STAGE 0 TECHNICAL PASS / STAGE 1 SOURCE FREEZE PASS / STAGE 1 AUTHORIZED / STAGE 1 EXECUTION IN PROGRESS / STAGE 1 BLOCK CONSUMED / RESULT PENDING / STAGE 2 NOT AUTHORIZED**

## Study anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
branch = research/g2-06-rich-critical-position-representation
Program = G2-06
Study ID = RCPR-STUDY1
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
source-freeze checkpoint commit = 4366e439c2838dd7f2f388e834ecc93aed7efcb6
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
active Stage 1 workflow run = 33196954082
active Stage 1 production job = 98936414477
```

## Prospective authority

- `preregistration/STUDY_START_FREEZE.md`
- `STUDY_1_PROTOCOL.md`
- `DECISION_REGISTER.md`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `preregistration/STAGE_1_EXECUTION_ADDENDUM.json`
- `authorizations/STAGE_1_EXECUTE.json`

No Stage 1 G2-06 scientific outcome existed when the design, execution addendum, scientific source freeze, source-hash audit, or explicit Stage 1 authorization was created.

## Authoritative representation

```text
RAW identity include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
missing pending = invalid
validated transform set = []
symmetry reduction = false
canonicalization = false
candidate feature families = 8
scalar feature width = 310
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
```

## Stage 0 technical execution provenance

```text
Stage 0 decision = STAGE0-TECHNICAL-PASS
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
workflow conclusion = success
job = 98876051308
artifact = 9688987798
artifact name = rcpr-stage0-technical-v1
artifact ZIP SHA256 = 442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269
fixtures = 6
Namua fixtures = 3
Mtaji fixtures = 3
production/independent exact representation agreement = true
RAW identity production/independent agreement = true
mandatory positive controls = PASS
mandatory negative controls = PASS
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

## Historical evidence exclusion

Prohibited from RCPR Stage 1/2 development/formal rows:

```text
CPOB source seeds 22600001..22603072
CPOB selected roots = 600
CPOB high-divergence roots = 139
CPOB candidate audits = 1183
CPOB promoted candidates = 0
CPOB reserved unconsumed Stage 2 seeds 22700001..22706144
all CPOB Stage 1 measured/discovery payloads
```

The historical CPOB evidence and reserved Stage 2 block are not reassigned to RCPR.

## Stage 1 frozen development design

```text
Stage 1 spec Git blob = d86ec140aecbb8c74f0bc6add2b9c810796a055e
Stage 1 spec SHA256 = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
execution addendum Git blob = c52d411ca95e0a3ca2994dc9ebf147ff82ca89b2
execution addendum SHA256 = e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64
source games = 3072
seed block = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
target roots = 600
Namua quota = 300
Mtaji quota = 300
history window = 4 moves
feature width = 310
replicates per exact root move = 64
maximum post-root continuation plies = 200
high-divergence threshold = D_range >= 0.30
CV folds = 5
Stage 1 rows reusable as Stage 2 formal evidence = false
```

## Stage 1 implementation validation provenance

```text
final smoke workflow run = 33195723195
final smoke job = 98932225577
final smoke artifact = 9695647002
final smoke artifact ZIP SHA256 = 9d87a3aba46e69952061aa3b30a628f41fe6525db69299634bf1386716273a11
production smoke SHA256 = e8c7a944876b370f0516b8b4dc2a1176e649202fc08354dc4663503a01d54611
independent smoke SHA256 = e0e335e85f6759178f510dc50d6ca585c35c4aa10aa933045c2f6a6f1cf89bc4
```

All final smoke steps passed, including independent replay/root reselection/feature+measurement/model agreement and fail-closed refusal without authorization.

## Stage 1 resource preflight provenance

```text
workflow run = 33195349152
job = 98930953453
artifact = 9695494212
artifact ZIP SHA256 = aec9f6c4c5bca8308ace21bfa47b17bc400e7215ecde8a69395b6183c560f4b1
resource preflight SHA256 = 48682f9bf2c11cb7c3410d1620fe1a127cd4108befa2ddae88f20bb4697e32c0
production job ceiling = 360 minutes
independent job ceiling = 360 minutes
Node old-space ceiling = 6144 MB
runner = ubuntu-24.04 / Node 22
```

Production and independent verification are frozen as separate jobs.

## Stage 1 exact source-freeze audit

```text
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
audit commit = 7545a50524d6ef425ff97c4bc93c7138a523f967
workflow run = 33196797865
job = 98935883477
conclusion = success
artifact = 9696075216
artifact ZIP SHA256 = fabb644c69d0f5efac48f3275a1e28a008a84832c7a7c4fd99a5f199038dbd7c
audit envelope SHA256 = 03c466fa075d95ee0a8aba8ba863e7236a9a1997e8b566e6725b0ba378476a2d
```

The audit verified remote-main equality, authorization absence, scientific-source ancestry, spec/addendum hashes, and exact Git-blob agreement for all 17 frozen runtime/orchestration files. The permanent complete blob map is in `results/STAGE_1_SOURCE_FREEZE_AUDIT.json`.

Key scientific source blobs include:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/ai.js = 8d472be415fac17e47a8e5e667cea9672e7a9ef5
public/ai-config.js = a3f8c1dbd1d8d79a478f4724c51eeef6b02cf6a3
public/ai-weights.js = 98969eb4c8e1403beedcf5c139a07166aa78175c
tools/benchmark.js = 88a2543157eacf15693b30c589b0fbcc616223a6
tools/experiments/lib/position-complexity-search-diagnostic.js = 72617e23ca143fac7bea35934815fd438d3e5be7
tools/experiments/lib/rcpr-production.js = b0020f8f83aef7007afb3fda1251459cb4b30b22
tools/experiments/lib/rcpr-independent.js = e55a26bd7c371066f22d5f639d0e23ca1ad06102
tools/experiments/lib/rcpr-stage1-production.js = 2661d9affc0e225b1861c29d7214860a4c32e43b
tools/experiments/lib/rcpr-stage1-independent.js = 6b11fb56311903dc795272172787e24e6cbc70ac
tools/experiments/lib/rcpr-stage1-independent-corpus.js = cdf812a681d39efaa1ac511e8ca8dafad9e7c4e9
tools/experiments/lib/rcpr-stage1-independent-model.js = f02f3bfcb1a11f8899dd8e9ce4e554fd92557999
tools/experiments/run-rcpr-stage1-development.js = 1885d470a8c6be8209c40d14cb74533d8538c281
tools/experiments/verify-rcpr-stage1-independent.js = abfa203d5344612daab9250ac0d297ce6a01a6aa
.github/workflows/rcpr-stage1-development.yml = 9216c0614cae5638ef8eb20d99a1e0341e4c8fe0
```

## Stage 1 explicit authorization and active execution

```text
authorization ID = RCPR-S1-EXECUTE-2026-08-29-v1
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
workflow run = 33196954082
production job = 98936414477
production step = Execute fresh Stage 1 development population once
observed execution state = in_progress
scientific Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement/extension = NOT AUTHORIZED
Stage 1 result = PENDING
Stage 2 = NOT AUTHORIZED
```

The production step has started. Under the frozen execution addendum, the Stage 1 block is now conservatively and irreversibly classified as consumed unless repository evidence proves the execution-start boundary was never crossed. No such evidence is currently available.

## Current fail-closed state

While workflow run `33196954082` is active, only read-only inspection is authorized. Do not modify frozen scientific sources or scientific design, dispatch another Stage 1 run, replace/extend seeds, or authorize Stage 2.

If production or independent verification fails after consumption, record `STAGE1-TECHNICAL-INVALID` and do not rerun the same block. If both complete successfully, archive exact artifacts/hashes and record the prospectively defined Stage 1 readiness/target-formation decision before considering any new Stage 2 freeze.
