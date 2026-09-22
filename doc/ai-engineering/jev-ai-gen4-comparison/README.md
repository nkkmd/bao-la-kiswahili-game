# Jev × Bao AI-GEN4比較試験

- Study ID: **`JEV-BAO-STRENGTH-20260921-v1`**
- 費用管理ID: **`JEV-BAO-COMP-20260921`**
- 基準commit: **`252ad27973dbc2b4b674fba3104e38299ac98e9e`**
- 実施ブランチ: **`experiment/jev-ai-gen4-20260921`**
- 状態: **`COMPLETED / CLOSED`**
- 正式判定: **`INCONCLUSIVE`**

## 結論

予め固定した32局面で担当側を入れ替え、64局を実施した。Jev組込版は32勝、AI-GEN4単独は32勝で、全32ペアが1勝1敗だった。この条件では優劣を確認できなかったため、正式判定は`INCONCLUSIVE`である。

これは両方式の同等性を証明する結果ではない。対象はJevの出力をルート候補手の探索順序にだけ使う方式であり、Jev単体、局面評価器としての利用、枝刈り、別のモデルやプロンプトへは一般化しない。

## 公開AIとの境界

本試験は比較と記録のために実施した。結果にかかわらずJev組込版は公開AIに採用しない。`public/`、公開AIの世代、正式release、本番配信状態に変更はなく、現在も`AI-GEN4 / AI-GEN4-RELEASE-001`を維持する。

試験は終了しており、このStudy IDによる追加の有料API呼出しを禁止する。

## 読む順序

1. [`FINAL_REPORT.md`](FINAL_REPORT.md) — 最終結果、条件、費用、限界
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の正式状態と禁止事項
3. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — 固定計画、実装、結果、元データの対応
4. [`ARTIFACT_MANIFEST.md`](ARTIFACT_MANIFEST.md) — リポジトリ外バックアップとSHA-256
5. [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — 実施から終了までの記録
6. [`RESUME_HERE.md`](RESUME_HERE.md) — 終了後に参照できる作業と再実行禁止の境界
7. [`CLOSURE_AUDIT.md`](CLOSURE_AUDIT.md) — 終了時の技術・秘密情報・日本語品質監査

## 保存したリポジトリ内証拠

- [`tools/jev-comparison/`](../../../tools/jev-comparison/) — 試験コード、固定計画、manifest、無課金検証コード
- [`summary.json`](../../../tools/jev-comparison/results/strength-v1/summary.json) — 64局の判定を含む最終集計
- [`plan.json`](../../../tools/jev-comparison/results/strength-v1/plan.json) — 実行時の仕様識別
- [`preflight.json`](../../../tools/jev-comparison/results/strength-v1/preflight.json) — 有料呼出し0の事前検証
- [`environment.json`](../../../tools/jev-comparison/results/strength-v1/environment.json) — 保存された実行環境

`tools/jev-comparison/`内の既存文書は、配布キットとして固定した実行前・中間時点の記録を含む。現在状態は[`ARCHIVE_STATUS.md`](../../../tools/jev-comparison/ARCHIVE_STATUS.md)と本ディレクトリを正本とする。
