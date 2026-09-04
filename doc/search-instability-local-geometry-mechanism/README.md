# 探索不安定性と局所ゲーム木幾何の関係 — `SILGM-STUDY1`

Research Generation 3 `G3-07` / `SILGM-STUDY1` の研究ディレクトリ。

最終的なlifecycle状態:

**`CLOSED / FORMAL-COMPLETE`**

正式なcandidate別判断:

- depth × E3 ranking-preorder change × G1 root legal width = **CONFIRMED / HIGHER-IN-HIGH**
- node-budget × E3 ranking-preorder change × G1 root legal width = **CONFIRMED / HIGHER-IN-HIGH**
- quiescence × E3 ranking-preorder change × G1 root legal width = **CONFIRMED / HIGHER-IN-HIGH**
- 4 promoted candidates = `NOT-CONFIRMED`
- 1 promoted candidate = `NON-ESTIMABLE`

本Studyが確認したのは、固定範囲における非因果的な関連だけです。正しいsearch condition、game-theoretic difficulty、客観的な着手品質、人間にとっての難しさ、因果mechanismを特定したものではありません。

## 正本となる記録

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`prereg/STAGE_1_DEVELOPMENT_SPEC.json`](prereg/STAGE_1_DEVELOPMENT_SPEC.json)
- [`prereg/STAGE_2_FORMAL_SPEC.json`](prereg/STAGE_2_FORMAL_SPEC.json)
- [`prereg/STAGE_2_FORMAL_INPUT.json`](prereg/STAGE_2_FORMAL_INPUT.json)
- [`results/stage-1/STAGE_1_RESULT_SUMMARY.json`](results/stage-1/STAGE_1_RESULT_SUMMARY.json)
- [`results/stage-2/STAGE_2_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_RESULT_SUMMARY.json)
- [`checkpoints/2026-09-03-stage-2-formal-complete-study-closure.md`](checkpoints/2026-09-03-stage-2-formal-complete-study-closure.md)
- [`checkpoints/2026-09-03-final-document-consistency-followup-pass.md`](checkpoints/2026-09-03-final-document-consistency-followup-pass.md)

## 保護された証拠

standard initial RAW rootのcomplete exact depth-10 holdoutは、本Studyでは開封していません。

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

## 後続研究との境界

**closure時点のhistorical boundary:** G3-07の終了時点では、G3-08（Local Geometry Persistence / Memory-Length Study 1）は**`NOT AUTHORIZED`**であり、別のpost-G3-07 current-state authorization reviewを必要としました。そのreviewは後に完了しています。現在のprogram stateは[`../research-generation-3/CURRENT_STATUS.md`](../research-generation-3/CURRENT_STATUS.md)を参照してください。後続Studyが実施されたことは、G3-07の判断を事後変更するものではありません。

## 統合に関する境界

本Studyは明示的なユーザー指示に基づき、2026-09-03にresearch branch tip `7f14538aa0ec3edd2045649025715219ffea17ec`からfast-forwardで`main`へ統合しました。研究ブランチはprovenanceのため保持し、scientific closureとno-rescue boundaryは変更していません。
