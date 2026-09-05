# REEOE-STUDY1 — 現在の状態

更新日: 2026-08-28

## 状態

**COMPLETED / FORMAL DECISION `INCONCLUSIVE` / STAGE 2 NOT AUTHORIZED**

## 研究識別子

```text
Program = G2-04
Study ID = REEOE-STUDY1
Research Generation = Research Generation 2
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Baseline main = aba61596e6440e9d54be6f1e9520f65e983000b3
Research branch = research/g2-04-restricted-endgame-exact-oracle-expansion
Integration PR = #70
```

## Stage progression （Stageの記録）

```text
Stage 0 = REEOE-S0-TECHNICAL-2026-08-28-v1
  STAGE0-TECHNICAL-PASS

Stage 1 v1 = REEOE-S1-DEVELOPMENT-2026-08-28-v1
  TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
  same-evidence rerun prohibited

Stage 1 v2 = REEOE-S1-DEVELOPMENT-2026-08-28-v2
  STAGE1-DEVELOPMENT-BLOCKED

Stage 2 = REEOE-S2-FORMAL-2026-08-28-v1
  NOT-AUTHORIZED-NOT-EXECUTED
```

## 正式判断

```text
formalDecision = INCONCLUSIVE
freshExactOracleProduced = false
formalStage2DomainsEvaluated = 0
domainLevelFormalDecisionsGenerated = 0
```

valid fresh Stage 1 v2 development runが、結果を見る前に固定したfeasibility / acceptance gateを満たさなかったため、本StudyはStage 2へ進む前に終了しました。

## Stage 0 technical result （技術検証）

immutable REWR 8-state / 7-edge exact domainをtechnical positive controlとしてのみ再構築しました。

```text
workflowRunId = 33150063023
artifactId = 9677327024
artifactZipSha256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
states = 8
edges = 7
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
S0-G1..S0-G12 = PASS
negative controls detected = 4/4
```

Stage 0ではfresh G2-04 scientific evidenceを生成していません。

## Stage 1 v1 failure boundary （Stageの記録）

最初のfresh development executionではproduction-only development outputが生成された後、module-path defectによりindependent verifierが起動できませんでした。

```text
workflowRunId = 33150429724
classification = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
v1 outputs eligible for later design = false
v1 seed/RAW identities consumed = true
```

defect判明後に同じblockを再実行していません。

## Stage 1 v2 valid development result （Stageの記録）

Fresh identities:

```text
seeds = 24041001..24041512
games = 512
maxPly = 240
```

固定structural / resource contract:

```text
phase = mtaji
reserve = [0,0]
houseOwned = [false,false]
pending = [0,0]
represented seeds = 64
non-empty pits <= 18
exact legal moves <= 2
maximum selected roots = 8
states/root <= 100000
edges/root <= 500000
move microstates <= 1000000
minimum complete closures = 3
```

観測・独立再構築結果:

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0

STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

Identities:

```text
allEncounteredRootSetSha256 = 36c8afe8eb06c268c80652d132d5149691b6d689c8f5729d31b05811d0e91107
eligibleRootSetSha256 = 6e73ee17c2cac85a1d122c66b2be36afec67d8c42554518c7ef0f582483fe247
selectedRootSetSha256 = a34918b684e8de06674463e072d36129f36bda5d23dac2200ad24c3363250de8
selectedRootOrderSha256 = 77cd163773d526a49190fc090b3d4c8f9e4ef112b494ee40cc1946dc372bdd69
developmentCoreSha256 = 1d21c1c29355556e1a2ba25c20bf8a29b156b86cc9cbe4216aa243bf16964caf
independentVerificationCoreSha256 = b09c71350f990195d0b1e56ee267a615e11b7bfa90942bdbcb2dcd94db7ea003
```

Productionとindependent verificationは、population、selection、closure classificationに不一致なく固定acceptance evaluationまで到達しました。

workflowがnonzero終了した理由は、`0 < 3` complete closuresという事前登録済みacceptance failureだけです。

## Stage 2 non-authorization （承認状態）

Stage 1 v2 feasibility gateがFAILしたため、本StudyではStage 2 formal-domain contractを作成・実行していません。

結果確認後のcap increase、structural restriction追加、favorable root replacement、seed extension、symmetry reduction、partial-graph promotionも行っていません。

## authoritative representation （表現）

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
symmetry reduction = forbidden
canonicalization = forbidden
quotient graph = forbidden
```

## 変更しないupstream state

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
STSCV-STUDY1 = INCONCLUSIVE
REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN (8 states / 7 edges only)
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

本Studyはこれらを変更しません。

## canonical result files （証拠と成果物）

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_DEVELOPMENT_V2_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`

異なるstructural / resource contractでexact oracle expansionを再検証する場合は、新しいprospective independent Study / versioned protocolとfresh evidenceが必要です。
