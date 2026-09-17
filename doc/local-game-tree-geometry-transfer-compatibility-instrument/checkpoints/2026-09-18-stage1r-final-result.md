# LGTTCI-STUDY1 — Stage 1R 最終結果 checkpoint

日付: 2026-09-18  
対象: Research Generation 4 / G4-01  
Study: `LGTTCI-STUDY1`  
Stage: `LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`

## 結論

Stage 1R の正式compatibility dispositionは次のとおりである。

`COMPATIBILITY-ELIGIBLE-ALL`

3つのcompatibility familyはすべて適格となった。

- SFCDF: `compatible = true`
- SILGM: `compatible = true`
- GCLD: `compatible = true`

これは**後続のfresh-domain transfer研究へ進むためのcompatibility/readiness条件が3 familyすべてで満たされた**ことを意味する。formal scientific effect、generalization、counterexampleを肯定する結果ではない。

## 実行経過

旧Stage 1は、fresh seedへのアクセス開始後にローカル長時間processの実行環境が失われたため、`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`として閉じ、旧`401...` namespaceをquarantineした。

Stage 1Rでは新しい`402...` primary namespaceを使い、GitHub Actions上でfresh acquisitionを一度だけ実行した。

fresh execution:

- run: `35224920019`
- head: `90aff0561538113c203cbf8efa8977420a19dca1`
- primary source coverage: `1536 / 1536`
- paired reserve使用: `0`
- full fresh workflow rerun: `0`

元workflowはsource acquisition完了後のdownstream工程でtechnical failureとなった。このため、保存済みimmutable source artifactだけを入力にしたdownstream-only recoveryを別途prospectiveに固定して実行した。

recovery:

- run: `35265290422`
- authorization commit: `2216c19e52bd0a7ce2680426183c058ecb8fce1c`
- conclusion: `success`
- recovery中のfresh seed access: `0`
- fresh workflow rerun: `0`

## source evidenceの監査

元runのsource artifactを全件監査し、次を確認した。

- exact source artifact coverage: `1536 / 1536`
- duplicate source artifact: `0`
- expired source artifact: `0`
- origin run mismatch: `0`
- origin HEAD mismatch: `0`
- primary count: `1536`
- reserve count: `0`

canonical source bundle:

- artifact ID: `10517090411`
- artifact digest: `sha256:3e1312fbd2fed104dc25ea53448b5f76feee2f37bc2b34ef09274e4df690a65b`
- source manifest deterministic core SHA256: `8111413773dfd9899b4562ee5089223a0aef75b6885041f4eacb1006111d7cdd`
- recovery source-artifact index deterministic SHA256: `7b95662b92a2129bc16f8c8a50acc1fa4ed1d1ec381504d761937a9c1e54134a`

## measurementとaggregate

seed-free measurement taskは全22件がGitHub Actionsで完了し、job conclusionはすべて`success`となった。

aggregate jobも`success`で完了した。

final result:

- artifact ID: `10516843232`
- artifact digest: `sha256:06a7232a423fdf32fce863a938b097fc97fe3f8bf29148b8cf6638500d17e630`
- measurement task count: `22`
- deterministic core SHA256: `0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61`
- decision: `COMPATIBILITY-ELIGIBLE-ALL`

canonical repository result:

- `results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json`
- `results/stage-1r/STAGE_1R_RECOVERY_EXECUTION_PROVENANCE.json`
- `results/stage-1r/STAGE_1R_DOWNSTREAM_RECOVERY_PROVENANCE.json`
- `results/stage-1r/ARTIFACT_ATTESTATION.json`

## 科学的境界

このStageで生成してよいのはcompatibility/readiness判定だけである。したがって、次は生成していない。

- scientific effect direction
- p-valueまたはeffect size
- formal generalization decision
- formal counterexample decision
- G4-02以降の研究結果
- public AI変更判断

`COMPATIBILITY-ELIGIBLE-ALL`は、G4-02/G4-03/G4-04など後続研究の開始条件を満たし得ることを示すが、それらを自動的にauthorizationするものではない。

## Study closure

G4-01 / `LGTTCI-STUDY1`は、予定したtechnical validationとfresh compatibility validationを完了した。

正式状態:

`G4-01 / LGTTCI-STUDY1 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`

研究branch上のStudy作業は閉じる。`main`への統合は別途ユーザーの明示指示を必要とする。
