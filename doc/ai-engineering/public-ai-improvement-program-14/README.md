# 公開Bao AI改善Program 14（`PBAI-P14`）

正式作業名: **AI-GEN4の探索候補遷移再利用 — A1成立性確認**  
英語作業名: **AI-GEN4 Search-Transition Reuse Feasibility**  
対象: 現行の公開 `AI-GEN4 / AI-GEN4-RELEASE-001`（hard・expertの既定経路）  
開始日: 2026-09-28  
状態: **`AUTHORIZED / STAGED-IMPROVEMENT-IN-PROGRESS`**  
公開AI変更: **なし**  
Candidate ID: **`PBAI-C017-v1`**（development-only）

## 1. 目的

改善案A1「同一ノードで既に作った遷移結果の再利用」を、現行の本番探索経路で検証する。baseline supportと隔離候補のfixed-depth development gateはPASSした。これらは候補の実時間短縮率、棋力改善、公開採用の証明ではない。

このProgramはResearch Generation 4とは独立した工学作業である。P1〜P12の閉鎖判断、Jev比較、RG4の研究Studyを再開・救済・変更しない。

## 2. 現在状態

baseline supportの結果は[`BASELINE_SUPPORT_RESULT.md`](../../../artifacts/pbai-p14/BASELINE_SUPPORT_RESULT.md)、candidate development gateの結果は[`C017_DEVELOPMENT_RESULT.md`](../../../artifacts/pbai-p14/C017_DEVELOPMENT_RESULT.md)にある。2つのcanonical JSONはそれぞれ[`baseline-support.json`](../../../artifacts/pbai-p14/baseline-support.json)、[`c017-development.json`](../../../artifacts/pbai-p14/c017-development.json)。fresh seed・診断計装なしのwall-clock validationを別契約として設計する段階。

## 3. 段階

1. **A — 認可・baseline固定:** 完了。ユーザーの改善着手指示により隔離Programを開始。
2. **B/C — baseline supportとcandidate契約:** 完了。support gateをPASSし、`PBAI-C017-v1`の実装・seed・開発gateを結果前に固定。
3. **D — isolated development:** 完了。fixed-depth意味同値性と遷移再適用の機械的削減を確認。
4. **E — performance validation:** 未開始。新規seed、未計装のpaired/counterbalanced timing、shard保存とaggregate gateを事前固定する。
5. **F以降 — strength / release:** Eの結果と各段階の新しい事前契約に基づいて進める。公開AI採用、main統合、release、AI世代昇格は自動化しない。

## 4. 実行環境

baseline supportと候補developmentは、GitHub Actionsの8 shard、個別artifact、全shard成功後のaggregateで完了した。次のwall-clock validationと長時間対局比較もActionsを第一候補にし、job timeout、部分artifact保全、全shard完了時だけの正式判定を設ける。未完了を不合格へ変換せず、seedを追加しない。実測からActions上限が不適切と分かった場合だけ、根拠と再現性・中断対策を先に記録して別環境を検討する。

## 5. 文書

- [開始認可レビュー](AUTHORIZATION_REVIEW.md)
- [Program計画](PROGRAM_PLAN.md)
- [baseline support計測契約](BASELINE_SUPPORT_SPEC.md)
- [baseline support結果](../../../artifacts/pbai-p14/BASELINE_SUPPORT_RESULT.md)
- [candidate開発契約](CANDIDATE_SPEC.md)
- [candidate development結果](../../../artifacts/pbai-p14/C017_DEVELOPMENT_RESULT.md)
- [現在状態](CURRENT_STATUS.md)
- [判断記録](DECISION_REGISTER.md)
- [終了報告](PROGRAM_FINAL_REPORT.md)（完了時作成）