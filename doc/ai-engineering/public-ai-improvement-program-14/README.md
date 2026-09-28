# 公開Bao AI改善Program 14（`PBAI-P14`）

正式作業名: **AI-GEN4の探索候補遷移再利用 — A1成立性確認**
英語作業名: **AI-GEN4 Search-Transition Reuse Feasibility**
対象: 現行の公開 `AI-GEN4 / AI-GEN4-RELEASE-001`（hard・expertの既定経路）
開始日: 2026-09-28
状態: **`AUTHORIZED / BASELINE-SUPPORT-MEASUREMENT-IN-PROGRESS`**
公開AI変更: **なし**
Candidate ID: **未発行**（A1のsupport gate通過後に候補仕様を固定する）

## 1. 目的

改善案A1「同一ノードで既に作った遷移結果の再利用」が、現在の本番探索経路で実際に対象機会を持つかを、候補実装前に計測する。計測で候補の効果や棋力改善を主張せず、固定深度での探索判断が診断計装により変わらないことも同時に確認する。

このProgramはResearch Generation 4とは独立した工学作業である。P1〜P12の閉鎖判断、Jev比較、RG4の研究Studyを再開・救済・変更しない。

## 2. 現在状態

baseline support用の計測条件は[`BASELINE_SUPPORT_SPEC.md`](BASELINE_SUPPORT_SPEC.md)に固定した。専用branchは `engineering/pbai-p14-a1-support`。計測器とActions workflowを追加し、候補コードへ進む前にsupport gateを実行する。

## 3. 段階

1. **A — 認可・baseline固定:** 完了。2026-09-28のユーザー指示により、隔離Program、baseline support計測、Actions実行、結果記録を認可。
2. **B — baseline support計測:** Actionsの8 shardで実行。固定specの条件を満たさなければ `NO-SUPPORT / KEEP-AI-GEN4` で停止。
3. **C — candidate contract:** support通過時のみ、新Candidate ID、正確性・費用gate、fresh seed分割を固定する。
4. **D — isolated development:** contract後、feature-flagged candidateを実装。fixed-depth意味同値性と計算費用を検証する。
5. **E以降 — independent validation / strength / release:** 前段の各gateを通過した場合に限り、freshデータで別々に判断する。公開AI採用、main統合、release、AI世代昇格は自動化しない。

## 4. 実行環境

baseline supportはGitHub Actionsを第一候補にした。64 seedを8 shardに分け、各shardを独立jobとして実行・artifact保存する。対話が中断されてもActionsの実行と完了済みshardの保存が継続する。測定が失敗・中断した場合は、残存artifactとjob結果を確認してから次を判断し、seedの再使用や追加を無断で行わない。

長時間の対局比較もActionsを第一候補に設計する。実測から各shardがActions上限に収まらないと分かった場合は、ローカル等の代替が必要な理由と再現性・中断対策を記録して切り替える。

## 5. 文書

- [開始認可レビュー](AUTHORIZATION_REVIEW.md)
- [Program計画](PROGRAM_PLAN.md)
- [baseline support計測契約](BASELINE_SUPPORT_SPEC.md)
- [現在状態](CURRENT_STATUS.md)
- [判断記録](DECISION_REGISTER.md)
- [終了報告](PROGRAM_FINAL_REPORT.md)（完了時作成）
