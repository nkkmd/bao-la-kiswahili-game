# 2026-09-04 — G3-12 pre-main final crosscheck

## Decision

**`PASS / PRE-MAIN-INTEGRATION-READY`**

本crosscheckは、G3-12 `LGTGGC-STUDY1` の科学的closure完了後、`main` integration直前に、root `README.md`を含むcurrent-facing documentation、study-local canonical records、Actions provenance、historical provenance boundaryを再監査した最終確認である。

科学的再計算、fresh Stage 1 replay、Stage 2 seed access、G3-11 depth-10 rerun、depth-11 access、G2-12 estimator scientific input、`main` integrationは一切行っていない。

## Audited repository state

```text
Repository = nkkmd/bao-la-kiswahili-game
Research branch = research/g3-12-local-game-tree-geometry-generalization-counterexample
Audited branch HEAD before this checkpoint commit = ad6449387be6b6a1e325756049f4c1ccedbec29c
main HEAD = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
branch vs main = ahead 92 / behind 0
merge base = current main HEAD
main integration = NOT PERFORMED
```

## Current-facing documentation crosscheck

以下を再確認した。

1. root `README.md`
2. `doc/RESEARCH_INDEX.md`
3. `doc/FUTURE_RESEARCH_AGENDA.md`
4. `doc/research-generation-3/README.md`
5. `doc/research-generation-3/CURRENT_STATUS.md`
6. `doc/local-game-tree-geometry-generalization-counterexample/README.md`
7. `doc/local-game-tree-geometry-generalization-counterexample/CURRENT_STATUS.md`
8. `doc/local-game-tree-geometry-generalization-counterexample/STUDY_1_FINAL_REPORT.md`
9. `doc/local-game-tree-geometry-generalization-counterexample/DECISION_REGISTER.md`
10. `doc/local-game-tree-geometry-generalization-counterexample/REPRODUCIBILITY_INDEX.md`
11. `doc/local-game-tree-geometry-generalization-counterexample/STAGE_1_FAILURE_INDEPENDENT_AUDIT.md`
12. `doc/research-program-decisions/2026-09-04-post-g3-12-stage1-stage2-authorization-review.md`
13. `doc/local-game-tree-geometry-generalization-counterexample/results/stage-1/STAGE_1_EXECUTION_RECORD.json`

Scientific/current-facing stateは全て次で一致している。

```text
Study = LGTGGC-STUDY1
Lifecycle = CLOSED / TECHNICAL-INVALID
Stage 0 active = LGTGGC-S0-TECHNICAL-2026-09-04-v3 / STAGE0-PASS
Stage 1 = EXECUTED EXACTLY ONCE / TECHNICAL-INVALID
SFCDF Stage 1 = STAGE1-PASS / development readiness only
SILGM Stage 1 = STAGE1-TECHNICAL-INVALID / complete root ranking required
GCLD Stage 1 = NOT EXECUTED / seeds unread
Stage 2 = LGTGGC-STAGE2-NOT-AUTHORIZED / NOT EXECUTED / seeds unread
Formal generalization decisions = NONE
Formal counterexample decisions = NONE
same-evidence rerun = NOT AUTHORIZED
main integration = NOT PERFORMED
```

root READMEを含むcentral documentsに追加のstatus correctionは不要である。

## Minor provenance clarity findings

科学的またはcurrent-facingな不整合は見つからなかった。一方、Actions履歴だけを将来独立に読む監査者にとって曖昧になり得るprovenance説明を2点補強した。

### 1. Non-adopted capture-first technical diagnostics

Actions履歴には、active treeから完全撤去済みのtemporary / non-adopted `CAPTURE-FIRST` technical pathによる2 runが残っている。

```text
33847428204 = failure / NON-ADOPTED TECHNICAL DIAGNOSTIC
33847684538 = success / NON-ADOPTED TECHNICAL DIAGNOSTIC
```

これらはcanonical Stage 0 V1/V2/V3の一部ではなく、scientific readiness evidenceでもない。Stage 1/2 scientific seed accessはなく、関連workflow / authorization / result filesはfirst-fresh Stage 1前にactive treeから除去された。Stage 1 authorizationがbindしたMAX-CAPTURE production/independent blobsへrestore済みである。

この区別を`REPRODUCIBILITY_INDEX.md`へ明示した。

### 2. Final central-document sync control-plane history

成功したtechnical-only documentation syncは:

```text
33853805427 = success / documentation sync only
```

その前に3件のcontrol-plane failureが存在する。

```text
33853619855 = failure / jobs 0
33853641204 = failure / jobs 0
33853781598 = failure / jobs 0
```

3件ともjob生成前に失敗しており、Actions executionによるcurrent-facing document変更やscientific seed accessは0である。このchronologyも`REPRODUCIBILITY_INDEX.md`へ明示した。

## Intentional historical differences that are not inconsistencies

以下は見た目上の差異だが、修正対象ではない。

1. `doc/research-generation-3/PROGRAM_PLAN.md`はhistorical prospective planであり、G3-12 closureに合わせてretroactiveに書き換えない。
2. base protocol/spec内のoriginal `P2-CAPTURE-FIRST`記載はhistorical preregistration provenanceとして保持し、active scientific contractはpre-fresh amendment `P2-MAX-CAPTURE`とする。
3. G3-01..G3-11の各Study-local historical status/checkpointは、その時点の意味を保持するためG3-12 current stateへ機械的に書き換えない。
4. Research Generation 3 program statusは`ACTIVE`のままでよい。`LGTGGC-STUDY1`のclosureとprogram-level closureは同義ではなく、G3-H01 human trackも独立・non-blockingである。
5. 先行final consistency checkpointに記載されたahead countは、そのcheckpoint commit作成前のaudited HEADに対する値であり、後続provenance-only commitsでbranchのahead countが増えることはstalenessではない。

## Historical PROGRAM_PLAN integrity

`doc/research-generation-3/PROGRAM_PLAN.md`はbranch/mainで同一blobを保持している。

```text
blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac
match = true
```

## Actions safety crosscheck

Stage 1 scientific executionはActions run `33848876682`の1回だけであり、closure/documentation作業後にscientific rerunは発生していない。

Stage 2 workflow/resultはactive branch diffに存在せず、Stage 2 scientific seed accessは0のままである。

## Final disposition

今回の最終crosscheckで見つかったのは、scientific/current-facing inconsistencyではなく、Actions provenanceの説明をより明確にする軽微な文書上の不足だけだった。これを`REPRODUCIBILITY_INDEX.md`で補強した後、再監査して整合を確認した。

したがって:

**`PASS / PRE-MAIN-INTEGRATION-READY`**

を維持する。

現時点でroot READMEを含む関連current-facing文書に、追加で修正すべきmaterialな不整合・更新漏れ・scientific boundary violationは認めない。

`main` integrationは本checkpointではauthorizeも実行もしない。明示的なuser instructionまでresearch branchを保持する。
