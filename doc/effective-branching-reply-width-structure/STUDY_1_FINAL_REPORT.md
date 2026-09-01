# EBRWS-STUDY1 — Study 1 Final Report

## 1. Formal identity

- Program: Research Generation 3
- Agenda position: `G3-02`
- Study ID: `EBRWS-STUDY1`
- English title: **Effective Branching and Reply-Width Structure Study 1 — Prospective validation of reproducible multi-ply branching and reply-width profiles as bounded RAW local game-tree position characteristics in Bao**
- 日本語題目: **Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証**
- baseline remote `main`: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- research branch: `research/g3-02-effective-branching-reply-width-structure`

Final disposition:

`CLOSED / TECHNICAL-INVALID`

Stage 2:

`NOT-AUTHORIZED-NOT-EXECUTED`

## 2. Scientific question

本Studyは、単純なroot legal-move countだけでは表現できない数plyのbranching / reply-width profileが、LGTGMIVでformal eligibilityを得たbounded RAW-only depth-5 measurement instrumentの範囲で、prospectively定義した再現可能な局面特性として成立するかを検証するために開始した。

G3-01の`TECHNICAL-INVALID` resultを救済せず、別のmeasurement prerequisite `LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`を経た後に、独立authorization reviewを`AUTHORIZED`として開始した。

## 3. Frozen representation and measurement boundary

Scientific state identityはRAW-only:

`pits,reserve,houseOwned,player,phase,winner,pending`

Validated transform setは`[]`であり、symmetry、reflection、rotation、player swap、canonical orbit、heuristic equivalenceは導入していない。

Primary dependencies:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F5-REPLY-GEOMETRY`

Secondary contextual dependencies:

- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

`effective branching`を新しいvalidated instrumentとして扱わず、eligible exact primitivesからprospectively固定したexact-rational derived quantityとして定義した。

## 4. Frozen primary endpoints

Primary construct systemsは2つだけに固定した。

1. `TREE-WIDTH-SHAPE`
2. `REPLY-WIDTH-SHAPE`

各construct × phaseでdominant classがeligible rootsの少なくとも2/3を占める場合のみStage 1 candidateとする。

Floating pointを使用せず、gateは:

`3 * classCount >= 2 * eligibleRootCount`

とした。

Stage 1はphase各12 rootsのため8/12以上、Stage 2は各18 rootsのため12/18以上を必要とする。

## 5. Population and firewall

### Stage 1

```text
seed = 31210001..31210192
target = 12 Namua + 12 Mtaji
relative depth = 5
evidence = FRESH-DEVELOPMENT
```

### Stage 2

```text
seed = 31220001..31220288
target = 18 Namua + 18 Mtaji
relative depth = 5
evidence = FRESH-FORMAL-HELDOUT
```

Root selectionはgeometry-blind / outcome-blindとし、G3-01、LGTGMIV Stage 1、LGTGMIV Stage 2とのRAW root、full source trajectory、first-16-move prefix collisionをrejectするcontractを固定した。

Stage 2はさらにG3-02 Stage 1 identitiesをrejectする予定だったが、Stage 2は未承認・未実行である。

## 6. Stage 0 result

`EBRWS-S0-TECHNICAL-2026-09-01-v1`はsynthetic primitive fixturesだけを用い、fresh scientific seedを消費しなかった。

Formal result:

`STAGE0-PASS`

Production / independent stage scientific core:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

exact-rational arithmetic、class boundary、2/3 gate、production/independent endpoint agreement、order invariance、telemetry separation、static independenceが全てPASSした。

## 7. Stage 1 pre-execution verification

Stage 1は別authorizationでexactly one executionを許可した。

Tooling smoke:

- GitHub Actions run `33525232642`
- job `99914259137`
- conclusion `success`
- fresh scientific seed accessed = false
- fresh scientific root generated = false
- protected depth-10 access = false

Production / independent G3-02 source hashesも別値であり、独立実装境界を維持していた。

## 8. Stage 1 one-shot computation

Authorized one-shot:

- run `33569323221`
- job `100059596453`

Fresh Stage 1 evidence生成時点でno-rescue boundaryがcrossedした。

Scientific execution stepは正常終了し、runnerは次を出力した。

```text
reported runner stageDisposition = STAGE1-PASS
globalGatePass = true
selectedCounts = 12 Namua + 12 Mtaji
productionStageScientificCoreSha256 = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
independentStageScientificCoreSha256 = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 = 4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
```

Runner-local diagnostic candidate summary:

| Construct | Phase | Class | Count |
| --- | --- | --- | ---: |
| `REPLY-WIDTH-SHAPE` | namua | `COMPRESSION-DOMINANT` | 12/12 |
| `REPLY-WIDTH-SHAPE` | mtaji | `COMPRESSION-DOMINANT` | 9/12 |

`TREE-WIDTH-SHAPE`についてrunner-local promoted candidateは記録されなかった。

この表はformal positive scientific resultではなく、後述のtechnical-invalid incidentに付随するdiagnostic provenanceである。

## 9. Repository materialization failure

Runnerはcanonical files:

- `scientific-result.json`
- `telemetry.json`
- `execution-summary.json`

を生成し、ephemeral runner workspaceでlocal commit `709bc393`を作成した。

しかしpushはnon-fast-forwardでrejectされた。one-shot execution中にremote research branchがtechnical workflow arming commitによって先行していたためである。

Logged commitments:

```text
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = f13a71a7a219fc1978667c1b39120df709b163fd5250962e9f19310ca9f9c719
```

Job終了後、`709bc393`はGitHub repository objectとして回収不能であることを確認した。このため、full canonical Stage 1 evidence objectをrepositoryへimmutable materializeできなかった。

## 10. Fail-closed decision

Frozen protocol §16はStage 1 global gatesにtechnical-integrity violationがないことを要求し、Stage 1終了時にpromoted primary candidate setをimmutable artifactとしてfreezeすることを要求する。

またStage 1 authorizationはexactly one fresh-development executionだけを許可し、fresh evidence generation/read後はno-rescue boundaryが有効である。

したがって、同じStage 1 seedを再実行して失われたcanonical filesを作り直すことはしない。threshold、endpoint、family、phase、root、seed、horizon、resource ceilingも変更しない。

Runner-local computationのpositive summaryをformal promotionへ救済することも行わない。

Formal Stage 1 disposition:

`TECHNICAL-INVALID`

Formal Study disposition:

`TECHNICAL-INVALID`

Formal promoted candidate set:

`[]`

## 11. Stage 2 disposition

Frozen Stage 2 authorization prerequisiteは、Stage 1 global mandatory gates PASSに加えて、promoted candidate setのimmutable freezeを要求する。

Canonical Stage 1 artifactをdurably materializeできなかったため、このprerequisiteはformalには満たされない。

Stage 2:

`NOT-AUTHORIZED-NOT-EXECUTED`

Stage 2 seed `31220001..31220288`は未消費のまま保持する。

## 12. Protected evidence

G3-11用standard initial RAW-root complete exact depth-10 holdoutはStudy全期間を通して:

`SEALED / NOT GENERATED / NOT READ`

である。

G3-02はdepth-10 complete enumerationを生成・readせず、G2-12 estimatorをdepth-10 truthとして使用しなかった。

## 13. Scientific interpretation

本Studyはformal positive conclusionを持たない。

Runner-local evidenceは、fresh bounded depth-5 rootsにおいてreply-width compression-dominant profileがNamua 12/12、Mtaji 9/12として計算されたことをdiagnostic provenanceとして残す。しかしcanonical Stage 1 evidence materializationが失敗したため、これを「Baoに再現可能なeffective branching / reply-width structureが確認された」と解釈してはならない。

また、たとえ将来別Studyで同様のgeometry patternがformalに確認されても、それはsearch difficulty、best move、game-theoretic forcing、win/value、human difficultyを意味しない。

## 14. Immutable boundaries after closure

- G3-01 remains `CLOSED / TECHNICAL-INVALID`, eligible families `[]`.
- LGTGMIV remains `CLOSED / FORMAL-ELIGIBLE-ALL`.
- EBRWS-STUDY1 is not rerun or repaired with the same evidence.
- Stage 1 diagnostic candidates are not formal candidates.
- Stage 2 remains unexecuted.
- RAW identity remains authoritative.
- validated transform set remains `[]`.
- protected depth-10 holdout remains sealed.
- historical `doc/research-generation-3/PROGRAM_PLAN.md` is not rewritten.

Any future attempt to test the scientific question again must be a new prospective Study or explicitly new version with fresh evidence; it must not change the formal decision of `EBRWS-STUDY1`.

## 15. Final Actions-history audit — unintended duplicate execution

Closure後のGitHub Actions履歴監査で、Stage 1 scientific runnerが合計2回実行されていたことを確認した。prospective authorizationはexactly one executionだったため、これは追加のtechnical-integrity violationである。

- authorized run: `33569323221` / job `100059596453`
- unintended duplicate run: `33569382663` / job `100060967285`

run #2をtriggerしたworkflow-arming commitはrun #1のscientific outcomeが判明する前に投入されていたため、結果を見て意図的にpositive resultを救済した操作ではない。一方、non-cancelling concurrencyによってrun #2の実計算はrun #1のscientific step完了後、すなわちno-rescue boundary成立後に開始された。そのためrun #2はfrozen exactly-one-execution authorizationに違反し、`INVALID-DO-NOT-USE`とする。

run #2はrunner-localでrun #1と同一のscientific core / candidate-set / scientific-result file hashを生成したが、この一致をformal replication、confirmation、repair、rescueへ用いない。run #2のlocal result commit `24c57398`もpush failure後に回収不能である。

このfinal auditによってformal dispositionは変更しない。むしろtechnical-invalid根拠を追加する。

```text
EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID
authorized Stage 1 executions = 1
actual Stage 1 scientific executions = 2
execution-count contract = violated
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1 execution workflowはclosure後にdisabledとし、第三の実行は許可しない。protected depth-10 holdoutは両runとも生成・readしておらず、`SEALED / NOT GENERATED / NOT READ`のままである。
