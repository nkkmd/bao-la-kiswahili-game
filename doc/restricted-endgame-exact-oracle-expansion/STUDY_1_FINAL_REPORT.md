# G2-04 第1研究 最終報告 — 限定終盤exact oracleの拡張

更新日: 2026-08-28  
Program label: `G2-04`  
Study ID: `REEOE-STUDY1`  
研究世代: **Research Generation 2**  
正式判断: **`INCONCLUSIVE`**

## 1. 研究上の問い

本prospective independent Studyでは、結果を見ずに事前選定した複数の限定Bao終盤domainについて、authoritative RAW state identityの下でcomplete forward closureを証明し、その後にgame-theoretic value、SCC / recurrent structure、distance-to-forced-terminal、すべてのoptimal move、optimal-move multiplicityをexactに解析できるかを調べました。

本Studyでは、**complete forward closureが成立したdomainだけをexact oracleと呼べる**ように設計しました。

## 2. representation contract （表現）

Authoritative state identityは次を維持しました。

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

除外項目:

```text
turn
reason
```

symmetry reduction、canonicalization、player-swap quotient、left-right quotient、orbit deduplication、symmetry-reduced graphは使用していません。

upstream G2-03から利用可能なvalidated non-identity transformation setは空のままです。

## 3. 変更しないupstream境界

本Studyは次の判断を一切変更しません。

- `PEOCR-STUDY1 = INCONCLUSIVE`
- `SRDR-STUDY1 = INCONCLUSIVE`。Stage 1 firewall後の`1040 < 1050`を含む
- `STSCV-STUDY1 = INCONCLUSIVE`、3 candidateは`NON-ESTIMABLE`、validated transform set=`[]`、canonicalization=`NON-ESTIMABLE`
- `REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`。exactなのは固定8-state / 7-edge domainのみ
- ORISC Axis A=`ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`、Axis B=`NOT-AUTHORIZED-NOT-EXECUTED`
- `SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`

歴史的REWR 423,733-state candidateは`ADMIN-CUTOFF`というtechnical historyのままであり、capを増やして続きを実行していません。

## 4. Stage 0 — technical instrument validation （技術検証）

Stage 0はtechnical onlyです。

既存REWR exact domainをpositive control `REEOE-C00-REWR-8STATE-REGRESSION`として再構築し、次を再現しました。

```text
states = 8
edges = 7
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Productionとindependent pathはgraph identity、predecessor relation、value、DTF、すべてのoptimal / max-resistance moveについて一致しました。固定済み4種類のcorruption controlもすべて検出しました。

Canonical Stage 0 provenance:

```text
workflowRunId = 33150063023
artifactId = 9677327024
artifactZipSha256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
S0-G1..S0-G12 = PASS
```

これはinstrument validationであり、新しいG2-04 exact-oracle evidenceではありません。

## 5. Stage 1 v1 — technical invalidation （技術検証）

最初のfresh development versionでは、事前固定したfresh blockを使用しました。Production development outputは生成されましたが、その後independent verifierが誤ったmodule pathにより起動時に失敗しました。

production outputをすでに観察していたため、同じevidenceを修復して再実行していません。

```text
Stage 1 v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
workflowRunId = 33150429724
same-evidence rerun = not authorized
v1 production-only output eligible for v2/Stage 2 design = false
v1 seed/RAW identities = consumed
```

invalidated v1 workflowは、その後PR更新などでproduction generationが繰り返されないようarchival stubへ変更しました。

## 6. Stage 1 v2 — fresh development （Stageの記録）

v1のstructural envelope、resource ceiling、selection order、maximum root count、acceptance ruleを変更せず、新しい非重複blockを用いたv2を結果を見る前に固定しました。

Fresh identities:

```text
seeds = 24041001..24041512
games = 512
maxPly = 240
```

Root eligibility / selection:

```text
phase = mtaji
winner = null
reserve = [0,0]
houseOwned = [false,false]
pending = [0,0]
represented seeds = 64
both front rows occupied
non-empty pits <= 18
exact legal moves <= 2
selection = first eligible roots by seed, ply, RAW state key
maximum selected roots = 8
```

rootごとのclosure ceiling:

```text
maximum states = 100000
maximum edges = 500000
maximum move microstates = 1000000
```

固定acceptance rule:

```text
selected roots >= 4
independently verified complete closures >= 3
full fresh scan/eligible-set/selection agreement
closure classification agreement
```

retrograde outcomeはStage 1 endpointとして認めていません。

## 7. Stage 1 v2の結果

Productionとindependent verificationはfresh populationとselectionを不一致なく再構築しました。

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
```

Closure stop classification:

```text
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
COMPLETE = 0
```

Population identities:

```text
allEncounteredRootSetSha256 = 36c8afe8eb06c268c80652d132d5149691b6d689c8f5729d31b05811d0e91107
eligibleRootSetSha256 = 6e73ee17c2cac85a1d122c66b2be36afec67d8c42554518c7ef0f582483fe247
selectedRootSetSha256 = a34918b684e8de06674463e072d36129f36bda5d23dac2200ad24c3363250de8
selectedRootOrderSha256 = 77cd163773d526a49190fc090b3d4c8f9e4ef112b494ee40cc1946dc372bdd69
developmentCoreSha256 = 1d21c1c29355556e1a2ba25c20bf8a29b156b86cc9cbe4216aa243bf16964caf
independentVerificationCoreSha256 = b09c71350f990195d0b1e56ee267a615e11b7bfa90942bdbcb2dcd94db7ea003
```

Independent verifierはfull scan、selection、closure classificationにmismatchを報告せず、固定acceptance evaluationまで到達しました。

その後、次の条件によりworkflowは意図どおりnonzero終了しました。

```text
selected = 8
complete = 0
required complete >= 3
```

したがって、

> **Stage 1 v2 decision = `STAGE1-DEVELOPMENT-BLOCKED`**

です。

nonzero acceptance failureがartifact upload stepより前に発生したため、workflow artifactはuploadされていません。Repository-facing compact resultにはrun / job / head identityと再構築済みdevelopment / verification core hashを保存しています。

## 8. closure stopの解釈

観測されたstop labelはdevelopment / resource classificationにすぎません。

- `STATE-LIMIT`: closure完了前に固定100,000-state ceilingを超えたことを意味する
- `ADMIN-CUTOFF`: 1つのexact moveが固定1,000,000 move-microstate administrative ceilingへ達したことを意味し、Bao terminal resultではない
- `MOVE-NONTERMINATION`: guard-free transition instrumentの下でdeterministic intra-move microstate recurrenceを検出したことを意味し、自動的にgame-level `RECURRENT`または`DRAW`になるわけではない

**partial graphをexact oracleへ昇格していません。**

## 9. Stage 2 — 未承認

Stage 2はStudy開始やStage 1実行によって自動承認される設計ではありません。

valid v2 development resultが事前固定feasibility / acceptance ruleを満たさなかったため、Stage 2 contractは作成も実行もしていません。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal domain definitions frozen = 0
formal Stage 2 source freezes = 0
formal Stage 2 authorizations = 0
formal exact domains evaluated = 0
domain-level formal decisions = 0
fresh G2-04 exact oracle = none
```

## 10. no-rescue closure （解釈上の境界）

v2 result確認後、本Studyでは次を行っていません。

- state / edge / microstate ceilingの増加
- 小さく都合のよいclosureを得るためのstructural restriction追加
- root replacement
- v2 seed blockの延長・置換
- `MOVE-NONTERMINATION` caseの無視
- symmetry / canonicalized identityへの切替
- near-complete graphのexact昇格
- 別solverまたはfavorable subsetへの置換

これらの変更を行うには、新しいprospective Study / versioned protocolとfresh evidenceが必要です。

## 11. 正式判断

Research Generation 2 Study-level closureは次です。

> **`INCONCLUSIVE`**

technical instrumentはPASSしましたが、固定したfresh development gateではcomplete closureを実現可能な形で確立できませんでした。そのためStage 2は実行されず、formal exact-oracle domain decisionは存在しません。

これは正規のfail-closed Research Generation 2 outcomeです。

Baoでexact oracle expansionが不可能だという証拠ではなく、**このStudyで固定したdevelopment designではformal Stage 2を承認する条件が成立しなかった**ことだけを意味します。

## 12. 承認されないclaim

REEOE-STUDY1は次を一切承認しません。

```text
Bao endgames are unsolvable
all Mtaji closures exceed 100000 states
Bao has a formal draw
MOVE-NONTERMINATION is a game-level draw/recurrent region
all endgame roots have huge closures
no larger exact oracle can exist
symmetry reduction is valid
canonicalization is valid
```

また、exact 8-state REWR resultも変更しません。

## 13. canonical artifact （証拠と成果物）

Repository-facing canonical record:

- `preregistration/STUDY_START_CONTRACT.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json` — invalidated v1 lineage
- `preregistration/STAGE_1_DEVELOPMENT_AUTHORIZATION.json` — invalidated v1 lineage
- `checkpoints/2026-08-28-stage1-v1-verifier-startup-failure.md`
- `preregistration/STAGE_1_DEVELOPMENT_V2_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_V2_AUTHORIZATION.json`
- `results/STAGE_1_DEVELOPMENT_V2_RESULT.json`
- `checkpoints/2026-08-28-stage1-v2-block-stage2-not-authorized.md`
- `results/STUDY_1_FINAL_RESULT.json`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`

## 14. 将来研究の境界

将来、異なるendgame structural restriction、異なるresource contract、異なるexact transition domainをprospectiveに検討することはできます。

ただし、新しい独立Study / versioned protocolとして実施し、REEOE-STUDY1はfeasibility / resourceに関するprior informationとしてのみ利用できます。この`INCONCLUSIVE` closureを変更してはいけません。
