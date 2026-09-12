# PBAI-P10：expertへの論理ゲート型評価器の適用検証

後続の[P11独立再試験](../public-ai-improvement-program-11/README.md)とexpertの正式採用・配信確認は完了し、現在の公開AIは[AI-GEN4](../ai-gen4-release/README.md)です。P10の`TECHNICAL-INVALID / HOLD`は維持します。以下の公開状態はP10終了時点の記録です。

## 目的と現在の状態

PBAI-C015-v1を公開expertの実設定へ適用できるか、新しい対局集団で検証する。正式試験は中断し、`TECHNICAL-INVALID / HOLD`で終了した。expertの正式採用、main統合、公開切替、AI-GEN4昇格は行っていない。hardの正式採用と配信確認は維持する。中断の詳細は[最終報告](PROGRAM_FINAL_REPORT.md)、対策は[実行基盤の対策](EXECUTION_RECOVERY.md)を参照する。

開始時に参照したmainはGitHubから取得した`c062dd739216a914defac7ace8836b429c44fa02`。作業ブランチは`engineering/pbai-p10-expert-validation`である。サブエージェントは使用しない。

## 読む順序

1. [監査と固定計画](PROTOCOL.md)：対象条件、証拠の境界、合否・停止条件。
2. [機械可読条件](SPEC.json)：局数、seed、資源上限。
3. [再開と現在状態](RESUME_HERE.md)：実行中の確認方法、再実行禁止。
4. [実機と採用準備](DEVICE_AND_RELEASE.md)：ユーザー確認と配信の順序。

## 結果の扱い

動作確認を棋力改善の証拠にしない。主要試験の3設定すべてが合格しても、実機確認と採用判断は別である。不合格・技術的無効・判断不能ならexpertはAI-GEN3を維持する。過去のP6・P7のHOLD、P8・P9の結果・モデル・seed・hashを上書きしない。
