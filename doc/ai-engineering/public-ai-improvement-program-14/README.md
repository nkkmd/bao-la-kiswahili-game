# 公開Bao AI改善Program 14（`PBAI-P14`）

正式作業名: **AI-GEN4の探索候補遷移再利用 — A1成立性確認**  
英語作業名: **AI-GEN4 Search-Transition Reuse Feasibility**  
対象: 現行の公開 `AI-GEN4 / AI-GEN4-RELEASE-001`（hard・expertの既定経路）  
開始日: 2026-09-28  
状態: **`COMPLETE / NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4`**  
公開AI変更: **なし**  
Candidate ID: **`PBAI-C017-v1`**（development-only）

## 1. 目的

改善案A1「同一ノードで既に作った遷移結果の再利用」を、現行の公開探索経路と同じ構成で検証した。baseline supportと隔離候補の固定深度開発検証はPASSした。未計装の実時間計測は技術的に有効だったが、事前に固定した3.0%の時間短縮基準を満たさず、PBAI-P14を終了した。

このProgramはResearch Generation 4とは独立した工学作業である。P1〜P12の閉鎖判断、Jev比較、RG4の研究Studyを再開・救済・変更しない。

## 2. 最終状態

正式判断は**`NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4`**である。8 shardで64 seedを処理し、そのうち61 seedから106局面を得て、固定深度4の出力同値性と計時条件を確認した。推定時間短縮は2.9795%（seed単位bootstrapの95%区間1.7091%〜4.1921%）で、事前固定した点推定3.0%以上の基準を0.0205 percentage point下回った。区間の下限が正でも、別条件である点推定基準を変更しない。

性能検証の証拠は[結果記録](../../../artifacts/pbai-p14/C017_PERFORMANCE_002_RESULT.md)と[canonical JSON](../../../artifacts/pbai-p14/c017-performance-002.json)、正式判断は[最終報告](PROGRAM_FINAL_REPORT.md)にある。公開既定、候補コード、release、AI世代は変更していない。終了文書と結果データのmain反映は候補の採用を意味しない。

## 3. 段階

1. **認可・baseline固定とsupport:** 完了。baseline supportは8 shard、111局面でPASS。
2. **隔離候補の開発:** `PBAI-C017-v1`を発行し、固定深度の意味同値性と遷移再適用18,686回の削減を確認。
3. **独立した実時間計測:** 最初の試行は技術的不成立としてseedを再利用しなかった。新しいseedを使った性能検証002は有効で、事前の3.0%基準には未達。
4. **正式判断:** 候補を不採用とし、棋力比較・release holdoutへは進まず終了。公開AIは`AI-GEN4 / AI-GEN4-RELEASE-001`を維持。

## 4. 実行環境

support、development、performanceをGitHub Actionsのshardで実行した。性能検証002では各shardのcheckpointとartifactを保存し、8 shardの完了後に集計した。ローカル環境へ切り替える必要はなかった。Actionsの失敗表示は、性能検証002では技術的不成立を意味せず、事前の時間短縮基準に届かなかったことを示す。

## 5. 文書

事前固定した候補契約の`Scope boundary`見出しは、原本保持のため変更しない例外とする。その境界は本書の「最終状態」と[最終報告](PROGRAM_FINAL_REPORT.md)で日本語で説明する。実行コードと不採用候補は隔離ブランチに保持し、以下の終了文書と結果データを参照する。

- [開始認可レビュー](AUTHORIZATION_REVIEW.md)
- [Program計画](PROGRAM_PLAN.md)
- [baseline support計測契約](BASELINE_SUPPORT_SPEC.md)
- [baseline support結果](../../../artifacts/pbai-p14/BASELINE_SUPPORT_RESULT.md)
- [candidate開発契約](CANDIDATE_SPEC.md)
- [candidate development結果](../../../artifacts/pbai-p14/C017_DEVELOPMENT_RESULT.md)
- [性能検証002の契約](C017_PERFORMANCE_002_SPEC.md)
- [性能検証002の結果](../../../artifacts/pbai-p14/C017_PERFORMANCE_002_RESULT.md)
- [現在状態](CURRENT_STATUS.md)
- [判断記録](DECISION_REGISTER.md)
- [終了報告](PROGRAM_FINAL_REPORT.md)