# REEOE-STUDY1 — 再現性索引

更新日: 2026-08-28  
状態: **COMPLETED / INCONCLUSIVE / STAGE 2 NOT EXECUTED**

## Study anchor

```text
Program = G2-04
Study ID = REEOE-STUDY1
Research Generation = Research Generation 2
Baseline main = aba61596e6440e9d54be6f1e9520f65e983000b3
Branch = research/g2-04-restricted-endgame-exact-oracle-expansion
PR = #70
Formal decision = INCONCLUSIVE
```

## authoritative RAW identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
missing pending = invalid
validated transform set = []
symmetry/canonicalization/quotient graph = not authorized
```

Exact move identity:

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

## Stage lineage

```text
REEOE-S0-TECHNICAL-2026-08-28-v1 = STAGE0-TECHNICAL-PASS
REEOE-S1-DEVELOPMENT-2026-08-28-v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
REEOE-S1-DEVELOPMENT-2026-08-28-v2 = STAGE1-DEVELOPMENT-BLOCKED
REEOE-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Study-start contract

Canonical prospective contract:

- `preregistration/STUDY_START_CONTRACT.json`
- baseline main: `aba61596e6440e9d54be6f1e9520f65e983000b3`
- formal title: `Restricted Endgame Exact Oracle Expansion Study 1`

このcontractではRAW identity、complete-forward-closure requirement、retrograde vocabulary、DTF rule、all-optimal-move requirement、positive / negative control、no-rescue policy、Stage 1 / Stage 2の別個authorization requirementを固定しました。

## Stage 0 technical validation

Canonical compact result:

- `results/STAGE_0_TECHNICAL_RESULT.json`
- Git blob: `32bad823c5e6fc75b61aeccd5b5f4cfc7ddcc62d`

Canonical workflow:

```text
runId = 33150063023
jobId = 98779736420
artifactId = 9677327024
artifact name = reeoe-stage0-technical
artifact ZIP SHA-256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
workflow head = 0557aa7573227eb57cec0088885f40bd2daa4a22
```

Technical positive-control identity:

```text
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
predecessorSha256 = 60a2923d053be5ffc07755c7e16000ae54ecf280f07384284e2f9d4b9361a2e3
productionTechnicalCoreSha256 = 26cd857fab4a57596208220e87306792138083a70ea2ac056dcb0518ea6fb277
independentVerificationCoreSha256 = 284cc2c53035b0a614eae33c07282b78e5543540c06138b4f21d7f5f65346e40
```

`S0-G1..S0-G12`はすべてPASSし、4 corruption controlすべてを検出しました。これはinstrument evidenceだけです。

Stage 0ではmissing `pending`をrejectするG2-04 strict representation layerも確立しました。legacy REWR compatibility helperは変更していません。

## Stage 1 v1 — invalidated lineage

Preregistration:

- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_AUTHORIZATION.json`

Canonical attempted workflow:

```text
runId = 33150429724
stage = REEOE-S1-DEVELOPMENT-2026-08-28-v1
fresh seeds = 24040001..24040512
classification = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
```

production development step完了後、incorrect module pathによりindependent verifierがstartupで失敗しました。production outputが既に生成されていたため、同じevidenceを修復して再実行していません。

Frozen consequence:

```text
v1 production-only outputs eligible for v2/Stage2 design = false
v1 seed/RAW identities consumed = true
same-evidence rerun = false
```

Checkpoint:

- `checkpoints/2026-08-28-stage1-v1-verifier-startup-failure.md`

その後executable v1 workflowはarchival stubへ置換しました。historical executable sourceはGit historyに残しています。

## Stage 1 v2 — fresh development contract

Spec:

- `preregistration/STAGE_1_DEVELOPMENT_V2_SPEC.json`
- Git blob: `d699c8c5f3df3ef76f5ca748ddc98814588fd98a`

Authorization:

- `preregistration/STAGE_1_DEVELOPMENT_V2_AUTHORIZATION.json`
- Git blob: `e4906bf39ee2639bff69ad918489dd14c5053f98`

Frozen source identity:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
tools/benchmark.js = 88a2543157eacf15693b30c589b0fbcc616223a6
restricted-endgame-stage0.js = c0391da999314c4709e5002e73eae42ef3048436
restricted-endgame-transition.js = 7ca35ef03ecad102b9a9e1fa6c4767f72d409961
restricted-endgame-independent-verifier.js = 94a79d140803802acf607bbaf02d570aa3b6f362
run-reeoe-stage1-development-v2.js = d72e45023fdabb09e12359f4130dd7c4a204e954
verify-reeoe-stage1-development-v2-independent.js = 892b54de80f044d3ee7b2e226cf28b01039f32f5
```

Fresh block / frozen structural-resource rule:

```text
seeds = 24041001..24041512
games = 512
maxPly = 240
phase = mtaji
reserve = [0,0]
houseOwned = [false,false]
pending = [0,0]
represented seeds = 64
nonEmptyPitCount <= 18
exactLegalMoveCount <= 2
maximum selected roots = 8
maximum states/root = 100000
maximum edges/root = 500000
maximum move microstates = 1000000
minimum selected roots = 4
minimum independently verified complete closures = 3
```

v1のstructural / resource conditionは緩和していません。変更したのはfresh scientific identityとverifier hardeningだけです。

## Stage 1 v2 canonical execution

Workflow:

```text
runId = 33151053940
jobId = 98782876984
workflow head = a44a825c815b2182091ba5e9ff147b1ae8ec395d
workflow conclusion = failure
failure semantic = FROZEN-DEVELOPMENT-ACCEPTANCE-NOT-MET
artifact uploaded = false
```

independent verifierがfrozen acceptance checkで意図的にnonzero exitし、`upload-artifact`より前に停止したためartifactはuploadされませんでした。

Production / independent reconstructed population:

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
```

Population identity:

```text
allEncounteredRootSetSha256 = 36c8afe8eb06c268c80652d132d5149691b6d689c8f5729d31b05811d0e91107
eligibleRootSetSha256 = 6e73ee17c2cac85a1d122c66b2be36afec67d8c42554518c7ef0f582483fe247
selectedRootSetSha256 = a34918b684e8de06674463e072d36129f36bda5d23dac2200ad24c3363250de8
selectedRootOrderSha256 = 77cd163773d526a49190fc090b3d4c8f9e4ef112b494ee40cc1946dc372bdd69
developmentCoreSha256 = 1d21c1c29355556e1a2ba25c20bf8a29b156b86cc9cbe4216aa243bf16964caf
reconstructedIndependentVerificationCoreSha256 = b09c71350f990195d0b1e56ee267a615e11b7bfa90942bdbcb2dcd94db7ea003
```

Closure classification:

```text
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
COMPLETE = 0
```

Independent verifierは512 trajectoriesすべて、encountered RAW rootsすべて、eligible set、selected-root order / identity、各closure classificationを独立再生成しました。final acceptance evaluationまで到達し、`complete=0 < 3`だけを理由としてFAILしました。

Canonical compact result:

- `results/STAGE_1_DEVELOPMENT_V2_RESULT.json`
- Git blob at first materialization: `62ce20a35dd88e95c0ee4bb1aa94ec20c607d849`

Checkpoint:

- `checkpoints/2026-08-28-stage1-v2-block-stage2-not-authorized.md`

## Stage 2 reproducibility state

次のものは意図的に存在しません。

```text
Stage 2 formal-domain spec = NONE
Stage 2 source freeze = NONE
Stage 2 authorization = NONE
Stage 2 production result = NONE
Stage 2 independent verification = NONE
Stage 2 artifact = NONE
```

これはStage 1 v2 development gateのfail-closed consequenceであり、「formal workが欠落している」という意味ではありません。

## Study-level canonical result

- `results/STUDY_1_FINAL_RESULT.json`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`

Canonical decision:

```text
formalDecision = INCONCLUSIVE
freshExactOracleProduced = false
formalStage2DomainsEvaluated = 0
```

## no-rescue / interpretation boundary

結果確認後のcap increase、domain shrinkage、root replacement、seed extension、partial-closure promotion、alternate solver substitution、symmetry / canonicalizationは使用していません。

`MOVE-NONTERMINATION`はintra-move transition-instrument classificationであり、game-level `RECURRENT`や`DRAW`へ昇格していません。

upstream REWR 8-state / 7-edge exact resultは変更しません。実質的に異なるstructural / resource contractでexact-oracle expansionを行う場合は、新しいprospective independent Study / versioned protocolとfresh evidenceが必要です。
