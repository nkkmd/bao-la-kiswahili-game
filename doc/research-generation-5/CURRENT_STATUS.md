# 第五世代研究 — 現在の状態

更新日: 2026-10-12（日本時間）  
状態: **G5-01のStage 0技術検証合格／新規証拠の科学実行は未開始／科学的結果なし**

## 現在確定していること

中心課題は「探索順位の変動と、完全解析した局面における選択手の厳密価値損失との関係」である。[研究計画](PROGRAM_PLAN.md)の第1段階を[G5-01](g5-01/README.md) / `RRSVL-STUDY1` として具体化した。ユーザーの着手指示に基づく[実行前レビュー](g5-01/PREEXECUTION_REVIEW.md)で、対象、現行takasiaルール、測定、計算上限、独立検算の範囲を固定した。

2026-10-12に既知fixture限定のStage 0が `STAGE0-TECHNICAL-PASS` となった。ローカルとGitHub Actionsのcore hashが一致し、技術テスト7件、takasiaエンジン・AI回帰36件が合格した。[技術検証報告](g5-01/STAGE_0_REPORT.md)に結果と検算範囲を記録する。技術合格は科学的な関係の確認とは別である。新規対局生成、科学的seed読取、正式解析、正式検定、公開AI変更はこの技術工程に含まれない。

第四世代の確定結果は変更しない。G4-03の順位変動と幅の関連、G4-05・G4-09の固定8領域、G4-09一般Module Aの標本条件未達、G4-10の`NON-ESTIMABLE`を、それぞれ元の範囲のまま参照する。

研究ブランチは `research/g5-01-measurement-readiness`。Stage 0ソース固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`、Actions runは `38229687584`。この作業は研究ブランチで記録し、mainへの統合は未実施である。

## 次工程の条件

現行全ルールの独立遷移検証、開発用と正式検証用の重複遮断、source policy、科学的seed、標本単位、閾値、資源上限、consume-once leaseを結果を見る前に定める。[次工程の設計事項](g5-01/NEXT_STAGE_DESIGN.md)を参照する。技術合格だけではこの条件を満たさない。

長時間実行はGitHub Actionsを第一候補として中断耐性と成果物保存を設計する。研究結果の公開AI採用は別のAI Engineering審査に属する。

## 正本

- [入口](README.md)
- [研究計画](PROGRAM_PLAN.md)
- [G5-01技術契約](g5-01/TECHNICAL_CONTRACT.md)
- [研究ログ](RESEARCH_LOG.md)
- [再開位置](RESUME_HERE.md)
- [第四世代の最終統合](../research-generation-4/FINAL_SYNTHESIS.md)
