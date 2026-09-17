# LGTTCI-STUDY1 — 入口

更新日: 2026-09-18  
Program position: `Research Generation 4 / G4-01`  
状態: **`COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`**

正式Study ID:

`LGTTCI-STUDY1`

英語正式題目:

**Local Game-Tree Geometry Transfer Compatibility Instrument Study 1 — Prospective validation of root contracts, helper preconditions, measurement agreement, and resource readiness for fresh-domain claim transfer**

日本語作業名:

**Bao局所ゲーム木幾何claim移送Compatibility Instrument研究1 — fresh domain移送に必要なroot contract、helper precondition、測定一致、resource readinessのprospective検証**

## このStudyが調べたこと

Research Generation 3でformal-completeとなったG3-04、G3-07、G3-10由来のclaim familyを将来のfresh domainへ移す前に、科学的effectを見ずに次を検証した。

- root contractを再現可能に判定できるか
- source policyをproduction/independentで同一にreplayできるか
- RAW局所幾何をrelative depth 5でexact一致して測定できるか
- SILGM系search helperのhard preconditionをroot selection前に検出できるか
- root legal width 1をhard failureではなくclean `NON-ESTIMABLE`として扱えるか
- continuous geometryを必要とするfamilyでproduction/independentの境界を維持できるか
- resource ceiling内で後続Studyのcompatibility populationを評価できるか

このStudyではformal effect direction、p-value、generalization/counterexample decisionを生成していない。

## 実行の要約

Stage 0 `LGTTCI-S0-TECHNICAL-2026-09-17-v1`は`STAGE0-PASS`で完了した。

旧Stage 1 `LGTTCI-S1-COMPATIBILITY-2026-09-17-v1`はfresh seedへのアクセス後にローカル実行環境を失ったため、`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`として閉じた。旧`401...` namespaceは全体をquarantineし、再利用していない。

再試験Stage 1R `LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`は、GitHub Actionsのimmutable artifact pipelineでfresh acquisitionを一度だけ実行した。

```text
fresh execution run = 35224920019
primary source coverage = 1536 / 1536
paired reserve use = 0
full fresh workflow rerun = 0
```

元workflowはfresh acquisition後のdownstream工程でtechnical failureとなったため、保存済みimmutable source artifactだけを入力にしたdownstream-only recoveryを実行した。

```text
recovery run = 35265290422
recovery conclusion = success
fresh seed access during recovery = 0
```

## 最終結果

22個のseed-free measurement taskとaggregateがすべてsuccessした。

```text
SFCDF = compatible
SILGM = compatible
GCLD = compatible
decision = COMPATIBILITY-ELIGIBLE-ALL
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
```

final artifact:

```text
artifact ID = 10516843232
digest = sha256:06a7232a423fdf32fce863a938b097fc97fe3f8bf29148b8cf6638500d17e630
```

canonical result:

- [`results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json`](results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json)
- [`results/stage-1r/STAGE_1R_RECOVERY_EXECUTION_PROVENANCE.json`](results/stage-1r/STAGE_1R_RECOVERY_EXECUTION_PROVENANCE.json)
- [`results/stage-1r/STAGE_1R_DOWNSTREAM_RECOVERY_PROVENANCE.json`](results/stage-1r/STAGE_1R_DOWNSTREAM_RECOVERY_PROVENANCE.json)
- [`results/stage-1r/ARTIFACT_ATTESTATION.json`](results/stage-1r/ARTIFACT_ATTESTATION.json)

最終checkpoint:

[`checkpoints/2026-09-18-stage1r-final-result.md`](checkpoints/2026-09-18-stage1r-final-result.md)

## 結果の意味

`COMPATIBILITY-ELIGIBLE-ALL`は、SFCDF・SILGM・GCLDの3 familyすべてについて、後続のfresh-domain transfer研究を設計・実施するためのcompatibility/readiness条件が満たされたことを示す。

これは次を意味しない。

- G3由来claimのfresh-domain一般化が確認された
- effect directionやeffect sizeが確認された
- counterexampleの成立／不成立が確認された
- G4-02/G4-03/G4-04が自動的に開始許可された
- public AI変更が認められた

## Study closure

G4-01 / `LGTTCI-STUDY1`は研究完了として閉じた。

closure decision:

[`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md)

後続のG4-02/G4-03/G4-04は、それぞれ別のauthorization reviewを必要とする。

G4-01の`main`統合は2026-09-18にユーザーから明示承認され、PR #151を統合経路とする。これは後続Studyや公開AI変更の承認ではない。
