# 第五世代研究 — 現在の状態

更新日: 2026-10-12（日本時間）  
状態: **Stage 0と独立遷移の技術検証合格／Stage 1の開発実行契約・基盤を準備済み／新規証拠の実行前**

## 現在確定していること

中心課題は「探索順位の変動と、完全解析した局面における選択手の厳密価値損失との関係」である。[研究計画](PROGRAM_PLAN.md)の第1段階を[G5-01](g5-01/README.md) / `RRSVL-STUDY1` として具体化した。ユーザーの着手指示に基づく[実行前レビュー](g5-01/PREEXECUTION_REVIEW.md)で、対象、現行takasiaルール、測定、計算上限、独立検算の範囲を固定した。

2026-10-12に既知fixture限定のStage 0が `STAGE0-TECHNICAL-PASS` となった。ローカルとGitHub Actionsのcore hashが一致し、技術テスト7件、takasiaエンジン・AI回帰36件が合格した。[技術検証報告](g5-01/STAGE_0_REPORT.md)に結果と検算範囲を記録する。技術合格は科学的な関係の確認とは別である。新規対局生成、科学的seed読取、正式解析、正式検定、公開AI変更はこの技術工程に含まれない。

第四世代の確定結果は変更しない。G4-03の順位変動と幅の関連、G4-05・G4-09の固定8領域、G4-09一般Module Aの標本条件未達、G4-10の`NON-ESTIMABLE`を、それぞれ元の範囲のまま参照する。

研究ブランチは `research/g5-01-measurement-readiness`。Stage 0ソース固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`、Actions runは `38229687584`。この作業は研究ブランチで記録し、mainへの統合は未実施である。

## 独立遷移の技術検証

工程2へ進めるユーザー指示を受け、[独立遷移の技術契約](g5-01/transition/TECHNICAL_CONTRACT.md)と、現行エンジンを呼び出さない環状配列の実装を準備した。固定40 fixtureと相対深さ2の全合法遷移を照合し、416状態・411辺で独立一致した。[独立遷移報告](g5-01/transition/REPORT.md)の技術判断は `STAGE0-TRANSITION-TECHNICAL-PASS`。遷移テスト6件とActions run `38231679692`が合格した。新規局面の全閉包を検証した結果ではない。[新規局面の開発診断設計](g5-01/DEVELOPMENT_PLAN.md)で候補選定・証拠分離・資源条件を具体化した。

## Stage 1の実行前準備

継続指示に基づき、[開発契約](g5-01/development/CONTRACT.md) / `RRSVL-S1-DEVELOPMENT-2026-10-12-v1` を具体化した。開発区画は `50112001..50112032`、候補最大8、1領域5,000状態・50,000辺・60秒に固定する。source選定、独立再生、全閉包照合、consume-once lease、seed消費journal、checkpoint、Actionsと研究ブランチへの保存を実装した。

固定fixtureだけの開発前テスト5件が合格した。ソース固定・Actions前確認が合格してから一度だけtriggerを登録し、durable leaseを保存した後に区画を開く。現時点では割当seedによる新規sourceはまだ生成していない。

## 次工程の条件

次は[Stage 1開発契約](g5-01/development/CONTRACT.md)のソースと技術前確認を固定し、Actionsで開発診断を一度だけ実行する。正式検証の閾値と判断規則は別途結果前に定める。[次工程の設計事項](g5-01/NEXT_STAGE_DESIGN.md)を参照する。技術合格だけではこの条件を満たさない。

長時間実行はGitHub Actionsを第一候補として中断耐性と成果物保存を設計する。研究結果の公開AI採用は別のAI Engineering審査に属する。

## 正本

- [入口](README.md)
- [研究計画](PROGRAM_PLAN.md)
- [G5-01技術契約](g5-01/TECHNICAL_CONTRACT.md)
- [研究ログ](RESEARCH_LOG.md)
- [再開位置](RESUME_HERE.md)
- [第四世代の最終統合](../research-generation-4/FINAL_SYNTHESIS.md)
