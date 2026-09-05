# REEOE-STUDY1 — 研究ログ

## 2026-08-28 — repository audit / Study開始

G2-04 modification前にread-only repository auditを完了しました。

```text
expected prior main = aba61596e6440e9d54be6f1e9520f65e983000b3
observed remote main = aba61596e6440e9d54be6f1e9520f65e983000b3
match = true
open PRs = 0
```

Residual Research Generation 2 branchはいずれも`main`よりahead commitが0であり、competing active / unmerged G2 researchはありませんでした。

## 2026-08-28 — upstream contract reconstruction （固定した条件）

immutable boundaryを再構築し、固定しました。

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primary null / 1040 < 1050
STSCV-STUDY1 = INCONCLUSIVE / T01-T03 NON-ESTIMABLE / transform set []
REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN for 8 states / 7 edges only
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

## 2026-08-28 — formal identity / Study-start freeze （識別情報）

```text
Program = G2-04
Study ID = REEOE-STUDY1
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Branch = research/g2-04-restricted-endgame-exact-oracle-expansion
PR = #70
```

Initial Stage IDs:

```text
REEOE-S0-TECHNICAL-2026-08-28-v1
REEOE-S1-DEVELOPMENT-2026-08-28-v1
REEOE-S2-FORMAL-2026-08-28-v1
```

Authoritative identityは`pits,reserve,houseOwned,player,phase,winner,pending`として固定し、`turn/reason`を除外しました。symmetry / canonicalization / quotient countingは禁止しました。

## 2026-08-28 — Stage 0 implementation audit （Stageの記録）

既存REWR exact-analysis lineageを監査しました。old production / independent serializerの双方に、missing field時に`pending=[0,0]`を合成するcompatibility fallbackがありました。

G2-04ではhistorical helperを変更せず、identity使用前にmissing `pending`をrejectするstrict G2-04 validation layerをproduction / independent双方へ実装しました。

production Stage 0 runner、independent verifier、4 corruption control、dedicated workflowを追加しました。

Stage 0 output生成前にproduction runner内の単純なroot-result reference typoを発見して修正しました。scientific definitionやfixtureは変更していません。

## 2026-08-28 — Stage 0 technical PASS （技術検証）

Canonical workflow:

```text
run = 33150063023
job = 98779736420
artifact = 9677327024
artifact ZIP SHA-256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
```

Result:

```text
8 states / 7 edges
TERMINAL=4 WIN=3 LOSS=1 RECURRENT=0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
S0-G1..S0-G12 = PASS
negative controls detected = 4/4
```

再構築terminal rowでは`pending`を保持し、8 statesすべてでrepresented seedsは64でした。Stage 0はtechnical-onlyを維持しました。

## 2026-08-28 — Stage 1 v1 prospective freeze / authorization （承認状態）

Fresh development block:

```text
seeds = 24040001..24040512
games = 512
maxPly = 240
```

Frozen structural / resource envelope:

```text
Mtaji / reserve [0,0] / houses false / pending [0,0] / 64 represented seeds
nonEmptyPitCount <= 18
exactLegalMoveCount <= 2
maximum selected roots = 8
states/root <= 100000
edges/root <= 500000
move microstates <= 1000000
minimum complete closures = 3
```

retrograde value、DTF、cycle、optimal move、winner identityをdevelopment-selection inputとして使用することは禁止しました。

## 2026-08-28 — Stage 1 v1 fail-closed technical invalidation （技術検証）

workflow run `33150429724`ではproduction developmentが完了した後、wrong relative locationから`../public/engine.js`を参照したためindependent verifierがstartupで失敗しました。

production outputがすでに生成されていたため、同じevidenceを修復してrerunしていません。

```text
Stage 1 v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
v1 outputs eligible for later design = false
v1 identities consumed = true
```

その後v1 workflowをarchival stubへ変更し、duplicate production generationを防止しました。

## 2026-08-28 — Stage 1 v2 prospective freeze （固定した条件）

v1のstructural / resource / acceptance designを緩和せずfresh versionを定義しました。

```text
Stage = REEOE-S1-DEVELOPMENT-2026-08-28-v2
seeds = 24041001..24041512
games = 512
maxPly = 240
```

Independent verifierは512 trajectoriesすべて、encountered RAW rootすべて、eligible root、first-eight selected root、各closureをacceptance evaluation前に再生成するよう強化しました。

source blobを固定してexplicit v2 execution authorizationを発行しました。Stage 2は未承認のままです。

## 2026-08-28 — Stage 1 v2 execution （実行記録）

Canonical workflow:

```text
run = 33151053940
job = 98782876984
workflow head = a44a825c815b2182091ba5e9ff147b1ae8ec395d
```

Production result:

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
```

Closure stop:

```text
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

Independent verifierはfull population / selectionとselected closure classificationをすべて独立再現しました。frozen acceptance checkまで到達し、`complete=0 < 3`を理由にexitしました。

```text
Stage 1 v2 = STAGE1-DEVELOPMENT-BLOCKED
```

frozen acceptance failureがupload stepより前に発生したため、workflow artifactはuploadされていません。

Canonical identity:

```text
allEncounteredRootSetSha256 = 36c8afe8eb06c268c80652d132d5149691b6d689c8f5729d31b05811d0e91107
eligibleRootSetSha256 = 6e73ee17c2cac85a1d122c66b2be36afec67d8c42554518c7ef0f582483fe247
selectedRootSetSha256 = a34918b684e8de06674463e072d36129f36bda5d23dac2200ad24c3363250de8
selectedRootOrderSha256 = 77cd163773d526a49190fc090b3d4c8f9e4ef112b494ee40cc1946dc372bdd69
developmentCoreSha256 = 1d21c1c29355556e1a2ba25c20bf8a29b156b86cc9cbe4216aa243bf16964caf
independentVerificationCoreSha256 = b09c71350f990195d0b1e56ee267a615e11b7bfa90942bdbcb2dcd94db7ea003
```

## 2026-08-28 — Stage 2 non-authorization （承認状態）

frozen Stage 1 v2 feasibility ruleを満たさなかったため、cap increase、domain shrinkage、root replacement、seed extension、solver substitution、partial-closure promotion、symmetry / canonicalization rescueを行っていません。

```text
REEOE-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
formal Stage 2 domains = 0
fresh G2-04 exact oracle = none
```

## 2026-08-28 — Study closure （最終状態）

Study-level formal decisionを次で固定しました。

```text
INCONCLUSIVE
```

このclosureが述べるのは、本Studyのfrozen development designではStage 2承認に必要なcomplete-closure feasibilityが成立しなかったことだけです。

Bao endgameや他の将来restricted domainがunsolvableであることを意味しません。

canonical closure artifactは`results/`、`STUDY_1_FINAL_REPORT.md`、`CURRENT_STATUS.md`、decision / reproducibility recordに保存しました。
