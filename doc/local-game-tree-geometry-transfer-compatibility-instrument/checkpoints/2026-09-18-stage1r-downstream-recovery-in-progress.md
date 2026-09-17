# Stage 1R downstream-only recovery — in-progress checkpoint

## 状態

- Study: `LGTTCI-STUDY1`
- Stage: `LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`
- recovery type: `DOWNSTREAM-ONLY`
- original fresh execution run: `35224920019`
- downstream recovery run: `35265290422`
- recovery authorization commit: `2216c19e52bd0a7ce2680426183c058ecb8fce1c`
- 状態: `RECOVERY-IN-PROGRESS`

## fresh evidence 境界

このrecoveryではfresh seedまたはpaired reserve seedを読み直さない。元run `35224920019` に保存済みのimmutable source artifactだけを入力とする。

- fresh workflow rerun: なし
- recovery中のfresh seed access: なし
- recovery中のreserve seed access: なし
- `401...` quarantine namespace再利用: なし

## canonical source bundle 復旧

recovery authorization gateは成功した。

元runのsource artifactを全件列挙し、artifact ID、artifact name、digest、expired状態、origin run ID、origin HEAD SHAを検証した後、1536件すべてを取得してcanonical source bundleを再構成した。

確定値:

- source artifact count: `1536`
- primary count: `1536`
- reserve count: `0`
- source run ID: `35224920019`
- source run HEAD: `90aff0561538113c203cbf8efa8977420a19dca1`
- recovery source-artifact index deterministic SHA256: `7b95662b92a2129bc16f8c8a50acc1fa4ed1d1ec381504d761937a9c1e54134a`
- source manifest deterministic SHA256: `8111413773dfd9899b4562ee5089223a0aef75b6885041f4eacb1006111d7cdd`
- recovery source-bundle artifact ID: `10517090411`
- recovery source-bundle artifact digest: `sha256:3e1312fbd2fed104dc25ea53448b5f76feee2f37bc2b34ef09274e4df690a65b`

`Recover and seal canonical source bundle` jobはsuccessした。

## measurement

22個のmeasurement taskはすべてcanonical source bundleだけを入力としており、fresh seedを読まない。

本checkpoint作成時点でmeasurement phaseは進行中であり、少なくとも `SFCDF-P1-RF2` はsuccessしている。最終compatibility dispositionはまだ確定していない。

## 判定上の注意

このcheckpointは実行監査記録であり、科学的なStage 1R結果ではない。

- effect direction: 生成しない
- formal generalization decision: 生成しない
- formal counterexample decision: 生成しない
- G4-02以降: 未承認
- public AI変更: 未承認
- main統合: 未承認

最終result artifactが生成され、全22 measurement taskとaggregateの監査が完了するまでStage 1Rのcompatibility dispositionを確定しない。
