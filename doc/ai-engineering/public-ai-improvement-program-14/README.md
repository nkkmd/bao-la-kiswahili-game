# 公開Bao AI改善Program 14（`PBAI-P14`）

正式作業名: **AI-GEN4の探索候補遷移再利用 — A1成立性確認**  
英語作業名: **AI-GEN4 Search-Transition Reuse Feasibility**  
対象: 現行の公開 `AI-GEN4 / AI-GEN4-RELEASE-001`（hard・expertの既定経路）  
開始日: 2026-09-28  
状態: **`AUTHORIZED / CANDIDATE-DEVELOPMENT-IN-PROGRESS`**  
公開AI変更: **なし**  
Candidate ID: **`PBAI-C017-v1`**（development-only）

## 1. 目的

改善案A1「同一ノードで既に作った遷移結果の再利用」を、現行の本番探索経路で検証する。baseline support測定は候補実装前に完了し、対象機会が確認された。計測は候補効果や棋力改善を主張しない。

このProgramはResearch Generation 4とは独立した工学作業である。P1〜P12の閉鎖判断、Jev比較、RG4の研究Studyを再開・救済・変更しない。

## 2. 現在状態

baseline supportはPASS。結果は[`BASELINE_SUPPORT_RESULT.md`](../../../artifacts/pbai-p14/BASELINE_SUPPORT_RESULT.md)、全canonicalデータは[`baseline-support.json`](../../../artifacts/pbai-p14/baseline-support.json)にある。候補仕様[`CANDIDATE_SPEC.md`](CANDIDATE_SPEC.md)とfresh development seed blockを実装前に固定した。実装はsupport branchから分けた開発branchで行う。

## 3. 段階

1. **A — 認可・baseline固定:** 完了。ユーザーの改善着手指示により隔離Programを開始。
2. **B — baseline support計測:** 完了。Actionsの8 shardで固定gateをPASS。
3. **C — candidate contract:** 完了。`PBAI-C017-v1`、A1実装範囲、seed分割、同値性・費用gateを凍結。
4. **D — isolated development:** 進行中。feature-flagged candidateを実装し、Actionsでfixed-depth意味同値性と計算費用を検証する。
5. **E以降 — independent validation / strength / release:** 前段のgateと各試験の事前契約を満たした場合だけ、freshデータで個別に実施する。公開AI採用、main統合、release、AI世代昇格は自動化しない。

## 4. 実行環境

baseline supportはGitHub Actionsで再開可能な8 shardとして実行した。長時間の対局比較もActionsを第一候補にし、shardごとのartifact保存、全shard完了時だけの集計、明示的な時間上限を設ける。各runの失敗時は部分artifactを監査し、未完了を不合格へ変換しない。ローカル等へ切り替える必要が出た場合は、実測した障害と再現性・中断対策を先に記録する。

## 5. 文書

- [開始認可レビュー](AUTHORIZATION_REVIEW.md)
- [Program計画](PROGRAM_PLAN.md)
- [baseline support計測契約](BASELINE_SUPPORT_SPEC.md)
- [baseline support結果](../../../artifacts/pbai-p14/BASELINE_SUPPORT_RESULT.md)
- [candidate開発契約](CANDIDATE_SPEC.md)
- [現在状態](CURRENT_STATUS.md)
- [判断記録](DECISION_REGISTER.md)
- [終了報告](PROGRAM_FINAL_REPORT.md)（完了時作成）
