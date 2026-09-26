# 2026-09-26 — post-G4-05 current-state G4-06 認可レビュー

Review ID: `G4-06-AUTHORIZATION-REVIEW-2026-09-26-V1`  
Agenda: `Research Generation 4 / G4-06`  
Repository: `nkkmd/bao-la-kiswahili-game`  
Reviewed `main` HEAD: `6a005d9f84d222126dc41abfe17ad5baa4c96629`  
判定: **`G4-06-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**  
G4-06 scientific bridge computation: **`NOT AUTHORIZED YET`**  
G4-10 depth 11 access: **`NOT AUTHORIZED / NOT ACCESSED`**  
public AI change: **`NOT AUTHORIZED`**

## 1. 審査対象

G4-06は、G4-05で完全解析済みとなったfresh exact microdomainを固定済み上流入力として用い、bounded RAW local game-tree geometryとexact game-theoretic consequenceの対応をprospectiveに検証するResearch Generation 4 Wave BのStudy候補である。

Program Planで固定されている中心課題は、完全解析済みmicrodomain内でcorridor、tree/RAW inflation、transposition、reply width等が、exact value、solution distance、value-preserving move countと再現可能な関係を持つかを調べることである。

本レビューはG4-06の科学結果を生成するものではない。Study identity、上流G4-05証拠の固定方法、geometry / exact constructの分離、small-N境界、technical validation、failure semanticsを結果生成前に固定できるかを審査する。

## 2. current-state prerequisite

```text
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED
G4-06 = NEXT CORE CANDIDATE / ELIGIBLE FOR AUTHORIZATION REVIEW / NOT-AUTHORIZED before this review
G4-10 depth 11 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
public AI change authorized by RG4 = false
```

Program PlanはG4-06について、G4-05がformal-eligible exact oracle domainを生成した場合だけ実行候補になると固定している。G4-05は8 complete formal domainsを生成し、production / independent solver agreementを成立させたため、このdependencyは満たされている。

## 3. G4-05上流証拠の固定

G4-06で使用可能なscientific populationは、G4-05 canonical Stage 2で確定した8 formal domainsだけとする。

Canonical upstream:

```text
G4-05 study = RLEMOF-STUDY1
Stage 2 run = 36120286922 / attempt 1
execution SHA = 72e45631112359346a83f9399be32ee3e6420ccb
artifact ID = 10858056244
artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
production-result.json SHA-256 = 03f0f416dca4bb92de9c55e780d47e8d39c2e2bb50fa0d987953fa87f256fff0
independent-verification.json SHA-256 = acfb9fda216d0669e4432ab4bb112b07283e05def34e9793507c0c7ad9964140
formal domain count = 8
```

2026-09-26の本レビュー時にcanonical Actions artifactを再取得し、上記3ファイルのSHA-256がrepository記録と一致することを確認した。

artifact内のproduction resultは各formal domainについて、少なくとも次を保持している。

- `candidateIndex`
- `seed`
- `ply`
- `rootStateKey`
- `exactLegalMoveCount`
- complete closureのstate / edge countとstate / transition digest
- solution digest
- root exact `WIN` / `LOSS`
- absolute winner
- root DTF
- root `optimalMoveKeys`

一方、root state本体および全stateのsolution rowはartifactへ保存されていない。したがってvalue-preserving move count等の新しいG4-06 exact-derived constructを計算する場合、後続formal Stageで固定済み8 rootだけをdeterministically再物質化する必要がある。

## 4. G4-05 rerun禁止との整合

G4-06では次を禁止する。

- G4-05 seed blockの再scanによるcandidate再選択
- candidate orderingの再評価
- G4-05 formal domain countまたはformal decisionの再判定
- `STATE-LIMIT` candidate 1 / 4の救済
- seed extension
- cap増加によるupstream G4-05 resultの変更
- G4-05 Stage 0 / Stage 1 / Stage 2をG4-05としてrerunすること

一方、G4-06の別Studyとして、**既に固定済みの8個の `(seed, ply, rootStateKey)` tupleだけ**を入力し、root stateをdeterministically再物質化してRAW key一致を確認する処理は、後続Stageでprospectiveに認可できる。

その場合も、再物質化したrootから得られるclosure / solutionはG4-05のstate-set、transition-set、solution digestと完全一致しなければならない。不一致はG4-06をfail-closedし、G4-05 resultを書き換えない。

## 5. authoritative identity / geometry boundary

G4-06のauthoritative state identityはG4-05およびLGTGMIVと同じRAW identityを維持する。

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
canonicalization = forbidden
symmetry reduction = forbidden
```

GeometryはLGTGMIVのRAW-only / relative depth 5 measurement foundationを基礎とする。

```text
F1 = TREE-OCCURRENCE
F2 = RAW-GRAPH
F3 = TRANSPOSITION-RECONVERGENCE
F4 = TREE-GRAPH-RELATION
F5 = REPLY-GEOMETRY
```

G4-06はこれらのbounded geometryをexact valueそのものへ読み替えない。geometryとexact consequenceは別constructとして計算し、最後に対応関係だけを評価する。

## 6. prospective endpoint family

formal scientific output生成前に、少なくとも次を固定する。

### 6.1 geometry側

Program Planの4概念を代表するscalar familyを事前登録する。

1. corridor: unit-width occupancy系
2. tree/RAW inflation: cumulative tree occurrence / distinct RAW state ratio系
3. transposition: reconvergence / duplicate encounter系
4. reply width: immediate reply width系

既存validated familyから導出する場合も、scalar化の式、depth範囲、denominator-zero、terminal truncationをStage specで固定する。

### 6.2 exact consequence側

1. root exact value: `WIN` / `LOSS`
2. solution distance: root DTF
3. value-preserving root move count
4. DTF-optimal root move countを補助構造として保持可能

`value-preserving move`はformal Stage前にplayer-to-move基準で厳密に定義する。root `WIN` / `LOSS`とchild solution statusの対応を使用し、engine evaluationやsearch scoreを使用しない。

## 7. small-Nと推定可能性

G4-05 formal populationは8 domainsで、canonical root value内訳は`WIN = 2`、`LOSS = 6`である。

したがってG4-06では、stateやedgeを独立標本へ水増ししない。primary experimental unitは**G4-05 formal domain / root**とする。

Stage specでは、各geometry × exact consequence relationについて次を固定する。

- measurable domain count
- geometry側variation gate
- exact consequence側variation gate
- tie handling
- exact rational / integer summary
- `NON-ESTIMABLE` mapping

小標本に対して通常の大標本近似を主たる根拠にしない。対応関係は、binary exact valueではcross-group pair ordering、ordered consequenceではconcordant / discordant / tie count等のexact finite summariesを第一候補とする。

positive relationが存在しない場合も正常なformal outcomeであり、結果確認後にmetric、threshold、domain、depth、directionを変更しない。

## 8. Stage構成

### Stage 0 — technical-only

科学的G4-06 bridge outputを生成しない。

Stage 0ではtechnical fixture / synthetic fixtureだけを用い、少なくとも次を検証する。

1. RAW identity serialization / hash consistency
2. LGTGMIV bounded geometry extraction
3. exact solver technical fixtureとの接続
4. value-preserving move分類logic
5. DTF-optimal move count logic
6. exact-rational scalar derivation
7. binary group pair ordering
8. ordered consequenceのconcordant / discordant / tie集計
9. denominator-zero / no-variation / terminal-truncation semantics
10. production / independent implementationの一致
11. corruption / digest mismatchのhard-fail
12. G4-06 scientific execution flagがfalseであること

Stage 0 PASSはG4-05 8 formal domainsに対するG4-06 scientific computationを自動認可しない。

### Stage 1 — formal bridge mapping

**NOT AUTHORIZED by this review**。

Stage 0 PASS後の別authorization reviewで、次をすべてfreezeした場合だけ候補になる。

- exact 8-domain input manifest
- root re-materialization algorithm
- upstream digest binding
- geometry scalar definitions
- exact consequence definitions
- relation summaries
- estimability gates
- production / independent implementations
- resource ceiling
- execution context / rerun rule
- canonical result schema

## 9. 実行環境

8 formal domainsは小規模だが、G4-06ではexact closureのdownstream re-materializationが必要になる可能性がある。

長めの処理が生じる場合は、これまでのG4-03〜G4-05と同様にGitHub Actionsを第一候補とし、source SHA、run ID、attempt、artifact ID、artifact digestを保存する。

Stage 0はtechnical-onlyであり、再現可能なActions workflowを用意してよい。Stage 1 formal executionは別authorizationなしにdispatchしない。

## 10. 認可gate

| Gate | 判定 |
|---|---|
| RG4 current-state | PASS |
| G4-05 dependency | PASS |
| canonical upstream artifact integrity | PASS |
| fixed 8-domain population | PASS |
| RAW-only identity | PASS |
| transform set `[]` | PASS |
| geometry measurement foundation | PASS |
| exact consequence availability | PASS-WITH-DOWNSTREAM-REMATERIALIZATION-DESIGN |
| small-N fail-closed design | PASS-AS-DESIGN |
| G4-05 rerun separation | PASS-AS-DESIGN |
| production / independent technical path | PASS-AS-DESIGN |
| G4-10 / public AI protected boundary | PASS |

## 11. 認可される次工程

本レビューにより次だけを認可する。

- Study ID / title / research branchの固定
- Study-start protocolのfreeze
- Stage 0 technical specのfreeze
- technical-only code / independent verifier / workflowの作成
- technical fixture / synthetic fixtureの使用
- canonical G4-05 artifact metadataをimmutable upstream bindingとして参照すること
- Stage 0 technical execution

本レビューでは次を認可しない。

- G4-05 8 formal domainsに対する新しいgeometry scalarの科学計算
- G4-05 8 formal domainsに対するvalue-preserving move countの科学計算
- G4-06 formal relation matrixの生成
- G4-05 candidate poolの再scan / 再選択
- G4-05 resultの再判定
- G4-10 depth-11 access
- symmetry / canonicalization
- `main`統合
- public AI変更

## 12. 最終判定

**`G4-06-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**

正式Study IDは`LGTGECB-STUDY1`、research branchは`research/g4-06-geometry-exact-consequence-bridge`とする。

次工程はStudy protocolとStage 0 technical specをprospectiveにfreezeし、technical-only Stage 0を実装・実行することである。Stage 0 PASS後もG4-05 8-domain scientific bridge mappingには別authorization reviewを必須とする。
