# LGTTCI-STUDY1 — 再開位置

更新日: 2026-09-18  
状態: **`G4-01 COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / REPOSITORY CONSISTENCY AUDIT PASS / MAIN NOT MERGED`**

## 現在地

```text
Study = LGTTCI-STUDY1
Program position = Research Generation 4 / G4-01
Research branch = research/g4-01-transfer-compatibility-instrument
Baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
Stage 0 = STAGE0-PASS
Stage 1 = EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
Stage 1R = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
source coverage = 1536 / 1536
paired reserve use = 0
fresh workflow rerun = 0
downstream recovery run = 35265290422 / success
formal effect generation = 0
formal generalization decision = false
formal counterexample decision = false
repository-wide consistency audit = PASS
main integration = NOT AUTHORIZED
```

## 再開時の読む順序

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`checkpoints/2026-09-18-stage1r-final-result.md`](checkpoints/2026-09-18-stage1r-final-result.md)
3. [`results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json`](results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json)
4. [`results/stage-1r/ARTIFACT_ATTESTATION.json`](results/stage-1r/ARTIFACT_ATTESTATION.json)
5. [`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md)
6. [`../research-generation-4/checkpoints/2026-09-18-g4-01-repository-consistency-audit.md`](../research-generation-4/checkpoints/2026-09-18-g4-01-repository-consistency-audit.md)
7. 必要に応じて旧Stage 1中断記録、Stage 1R preregistration、authorization/bindingを参照する。

## 完了したこと

- Stage 0 technical validation: `STAGE0-PASS`
- 旧Stage 1: fail-closedで終了、旧`401...` namespaceをquarantine
- Stage 1R fresh acquisition: `1536 / 1536`
- paired reserve use: `0`
- downstream-only recovery: success
- seed-free measurement: `22 / 22` success
- aggregate: success
- SFCDF: compatible
- SILGM: compatible
- GCLD: compatible
- final decision: `COMPATIBILITY-ELIGIBLE-ALL`
- canonical result/provenance/attestation: research branchへ保存済み
- G4-01 closure decision: 記録済み
- root README・中央索引・Future Agendaを含むrepository-wide consistency audit: `PASS`

## 最終識別子

```text
fresh execution run = 35224920019
fresh execution head = 90aff0561538113c203cbf8efa8977420a19dca1
recovery run = 35265290422
recovery authorization commit = 2216c19e52bd0a7ce2680426183c058ecb8fce1c
source manifest deterministic SHA256 = 8111413773dfd9899b4562ee5089223a0aef75b6885041f4eacb1006111d7cdd
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
final artifact ID = 10516843232
final artifact digest = sha256:06a7232a423fdf32fce863a938b097fc97fe3f8bf29148b8cf6638500d17e630
```

## 次に行うこと

G4-01の研究そのものとmain統合前の文書整合性監査は完了している。

次の選択肢は次の2つである。

1. ユーザーの明示指示後にPR #151を`main`へ統合する。
2. G4-02/G4-03/G4-04のいずれかについて、別途authorization reviewから次研究を開始する。

G4-01の`COMPATIBILITY-ELIGIBLE-ALL`は後続研究の自動authorizationではない。後続Studyごとにfresh evidence boundary、claim、seed、execution contractをprospectiveに固定する必要がある。

## 特に守ること

- 旧`401...` seedを再利用しない。
- Stage 1R fresh workflowを再実行しない。
- `COMPATIBILITY-ELIGIBLE-ALL`をgeneralization/effect/counterexample結果として解釈しない。
- G3-11 depth 10、G3-12 protected evidence、G4-10 depth 11へ無断アクセスしない。
- public AI変更へ自動的に接続しない。
- ユーザーの明示指示なしに`main`へ統合しない。

現在は、**G4-01研究完了・repository-wide consistency audit PASS・research branch保存済み・main統合待ち**のcheckpointである。
