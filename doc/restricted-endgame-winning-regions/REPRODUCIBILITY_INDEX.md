# REPRODUCIBILITY_INDEX — Restricted Endgame / Winning Regions Study 1 （再現性）

## 日本語での要点

frozen 8-state domainだけをEXACT-SOLVED-WITHIN-FROZEN-DOMAINとして扱う。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-24  
Status: **EXACT SOLUTION COMPLETE / INDEPENDENT VERIFICATION PASS**

## Baseline identities （日本語の要点）

```text
main HEAD at study start = 626480507710e0095ef8aec6a53c3e4e0318fa4f
rules reference = nkkmd/bao-la-kiswahili-ja@1179267b1f19b27a2138791253f2cb9cbfe98c14
branch = research/restricted-endgame-winning-regions
Draft PR = #38
```

## Identity conventions （識別と表現）

Primary state identity: direct stable serialization of `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending` followed by SHA-256.

Primary move identity: exact key including `houseChoice` and `houseTwo`.

Forbidden primary reduction: `seatCanonicalKey` or any symmetry/isomorphism canonicalization.

## Stage 0 identities （Stageの記録）

Technical witness block:

```text
seeds = 22800001..22800256
games = 256
max trajectory ply = 240
unique eligible Mtaji roots = 3464
```

V2 selection:

```text
selectionRuleSha256 = 2055de803cdb65e64519d88e002ee7db2ce57aafbc8f020133c1d5bb7e3cb78f
selectedRootSetSha256 = cca1db8aaaee310ed7a4113f97a9a802bab8d4ab19c464d1fca471ff41fd954a
matrixResultSha256 = df50610aa20bc5dcfdd96560ddb6e9bb9ad48ab142a9abccd6f7691e6a9a4ee1
independentGraphVerificationResultSha256 = 34731c808cb0447b9f73f4f0d080fa920c1e79b08ad41b28c87632b7efbaa208
```

Frozen graph:

```text
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
```

Root reachability witness:

```text
seed = 22800188
ply = 48
witnessStableSha256 = a57e086f6e85d46052f9bacb0ad1f24851e04935b3bcd9ee41647aaa43228fa2
rootStateStableSha256 = 179e129c58dab07e5f6177b22e3d1d0914f76a334708c4a9bab8c4b573a6098b
```

One-shot v3:

```text
v3ResultSha256 = ba407b4b6afb53da7c72ea15e6ac600ad9efaf621a988fb5937398c4bc79fc41
decision = V3-INFEASIBLE-USE-V2-FALLBACK
states observed = 423733
edges observed = 426938
stop = ADMIN-CUTOFF at 1000000 move microsteps
additional expansion authorized = false
```

## Stage 1 frozen contract （Stageの記録）

```text
domainId = REWR-S1-DOMAIN-2026-08-24-v1
domainSha256 = acfc25413f9c237569884f166ed971ad9ee9395665ce96ec6d094d8ed4a6c56a
stageId = REWR-S1-EXACT-2026-08-24-v1
specSha256 = ec20df4621b7d8e50fd979bee4681c7eadb5bf2138c14911cb6ab97acd0738cc
authorizationId = REWR-S1-EXACT-AUTH-2026-08-24-v2
authorizationSha256 = d3fe788e95606c6641ad4c33a396a2c02b21138b9b80bef2522f85cd124f282c
```

Frozen source SHA-256:

```text
public/engine.js
e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c

doc/RULES_BASELINE.md
083c347fc222976ee84e488c0b14d5b71549d67f1ea918fe3fe3972904f25f8f

tools/benchmark.js
2a893d7fe78d9d9cb211b38840c45f5c3dd9053fa3e05255b123985a08cfa808

tools/experiments/lib/restricted-endgame-stage0.js
ffc7c4a8d5fe7e2fd4a053b6a7c78d5064a729b4f1ae2d34d705c46c156a3749

tools/experiments/lib/restricted-endgame-transition.js
7c46154b9c50823bc7b4e1bc9f8f687cd6e9e6b5e50e3178f75e26fa39c26b73

tools/experiments/lib/restricted-endgame-independent-verifier.js
b3edda4283793eddc238f11bfc57d98b291ef9b5786f440573e79d3f9c99c3ee

tools/experiments/lib/restricted-endgame-retrograde.js
8d3aa85b79104413a0e3ad0a66766713f0c3f5c7408142c761d0def9e62dbdd5

tools/experiments/lib/restricted-endgame-retrograde-independent.js
427ffa7784bc649a3f83418745b2e75856b669437cced8d1a1c1096edf944855

tools/experiments/lib/restricted-endgame-tablebase.js
d8cd54a03b97c148f81e7d122621d7bc7ddbdc0f5e192d0dac1cfab9c1f893c3

tools/experiments/lib/restricted-endgame-tablebase-independent.js
b170602bf8900a8979cf14644a8d7503e239cab3872a3818bd7740186a1802e1

tools/experiments/validate-restricted-endgame-stage1-spec.js
aa284e00416c3e9486c5da224547d1c3fdb5c2c692eba59367fe1463c79a1cb0

tools/experiments/run-restricted-endgame-stage1-exact.js
d08611f120d0cd00e34b82efcdfab50928bb6ba17300ffb8812505fa4c457213

tools/experiments/verify-restricted-endgame-stage1-exact.js
d0b3ccffa1dc9e1fdff6ed0f9cb4dbf3725397c892003f60c4d0c1b4d1a8e319
```

## Pre-generation correction provenance （日本語の要点）

```text
initial freeze commit = b2728585335549f5f35f9711f8320ff8a4a37b5c
revoked authorization v1 commit = 5a08d1fdce27c1d80f182e89112db5004353c8a5
authorization revocation commit = f4133b17b1e6c5a4fe7a646757c86001d99cf47f
production runner correction = 367a6f2e460e9fc5b774c32a5748d87e789eea13
independent verifier correction = d32cdfcaca21c5d10e290434c286b9f702d6f93c
source-hash refreeze = dd034f34d96c1be1aeaa1cf5e3d74ea46e25fffc
authorization v2 commit = 87cd16b0d1b38ca1e7677fb94835424509386b1e
scientific outcome generated before correction = false
```

## Scientific exact run （日本語の要点）

```text
workflow = Restricted endgame Stage 1 exact solution
runId = 32702596730
artifactId = 9511074442
artifact name = rewr-stage1-exact-solution
artifact ZIP SHA-256 = 7da2a3f46745c18f4aa8896bc6a576b5d56b490b1461a4def3364183b047c023
```

Production:

```text
productionResultSha256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Independent verification:

```text
verificationResultSha256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
passed = true
exactClaimAuthorized = true
```

Full equality:

```text
rootKeys = true
stateCount = true
edgeCount = true
stateSetSha256 = true
transitionSetSha256 = true
counts = true
fullStateRows = true
recurrentSccs = true
solutionSha256 = true
```

## Canonical repository artifacts （証拠と成果物）

```text
preregistration/STAGE_1_DOMAIN.json
preregistration/STAGE_1_EXACT_SPEC.json
preregistration/STAGE_1_EXACT_AUTHORIZATION.json
results/STAGE_1_EXACT_RESULT.json
STUDY_1_OVERVIEW.md
STUDY_1_FINAL_REPORT.md
CURRENT_STATUS.md
DECISION_REGISTER.md
```

`results/STAGE_1_EXACT_RESULT.json` preserves all 8 exact state rows without runtime/heap timing as the repository-facing scientific oracle.
