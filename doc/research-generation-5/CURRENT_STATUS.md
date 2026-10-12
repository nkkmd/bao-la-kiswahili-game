# 第五世代研究 — 現在の状態

更新日: 2026-10-12（日本時間）  
状態: **Stage 1開発診断・独立検算完了／候補0件／本区画を消費済みで終了／正式検証未実施**

## 現在確定していること

中心課題は「探索順位の変動と、完全解析した局面における選択手の厳密価値損失との関係」である。[研究計画](PROGRAM_PLAN.md)の第1段階を[G5-01](g5-01/README.md) / `RRSVL-STUDY1` として具体化した。ユーザーの着手指示に基づく[実行前レビュー](g5-01/PREEXECUTION_REVIEW.md)で、対象、現行takasiaルール、測定、計算上限、独立検算の範囲を固定した。

2026-10-12に既知fixture限定のStage 0が `STAGE0-TECHNICAL-PASS` となった。ローカルとGitHub Actionsのcore hashが一致し、技術テスト7件、takasiaエンジン・AI回帰36件が合格した。[技術検証報告](g5-01/STAGE_0_REPORT.md)に結果と検算範囲を記録する。技術合格は科学的な関係の確認とは別である。新規対局生成、科学的seed読取、正式解析、正式検定、公開AI変更はこの技術工程に含まれない。

第四世代の確定結果は変更しない。G4-03の順位変動と幅の関連、G4-05・G4-09の固定8領域、G4-09一般Module Aの標本条件未達、G4-10の`NON-ESTIMABLE`を、それぞれ元の範囲のまま参照する。

研究ブランチは `research/g5-01-measurement-readiness`。Stage 0ソース固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`、Actions runは `38229687584`。この作業は研究ブランチで記録し、mainへの統合は未実施である。

## 独立遷移の技術検証

工程2へ進めるユーザー指示を受け、[独立遷移の技術契約](g5-01/transition/TECHNICAL_CONTRACT.md)と、現行エンジンを呼び出さない環状配列の実装を準備した。固定40 fixtureと相対深さ2の全合法遷移を照合し、416状態・411辺で独立一致した。[独立遷移報告](g5-01/transition/REPORT.md)の技術判断は `STAGE0-TRANSITION-TECHNICAL-PASS`。遷移テスト6件とActions run `38231679692`が合格した。新規局面の全閉包を検証した結果ではない。[新規局面の開発診断設計](g5-01/DEVELOPMENT_PLAN.md)で候補選定・証拠分離・資源条件を具体化した。

## Stage 1の開発診断

[開発契約](g5-01/development/CONTRACT.md) / `RRSVL-S1-DEVELOPMENT-2026-10-12-v1` を事前固定し、Actions run `38234120711` / attempt 1で `50112001..50112032` の32 sourceを一度だけ生成した。全32 sourceの独立再生が合格し、要約・消費journal・候補固定・圧縮証拠・検算をコミット `f9d66df5998dd0be8570c2d855dcb89cd45c1bae` で研究ブランチへ保存した。

実行判断は `STAGE1-DEVELOPMENT-COMPLETE`、検算は `STAGE1-DEVELOPMENT-INDEPENDENT-PASS`。ただし候補は0件で、新規の完全閉包・厳密解の解析は未実施である。[報告](g5-01/development/REPORT.md)に結果と限界を記録する。開発診断の完了を、解析領域の供給や正式検証への適格性の成立へ読み替えない。

保存済み着手記録の事後診断では、ply・段階・合法手幅の条件を通過した23 sourceの311状態がすべて「占有穴数12以下」で除かれ、当該範囲の最小占有穴数は16だった。新しいsource生成、候補再選定、閉包再解析は行っていない。

## 終了境界と次の研究

本Stage 1 v1の区画は消費済みとして閉じる。同一区画の再実行、seed追加、候補置換、条件緩和による再選定、上限引上げは行わない。正式な順位変動・価値損失の関係は未承認・未実施であり、Bao全体や公開AIについて結論を出さない。

次は[新しい独立Studyの設計事項](g5-01/development/NEXT_RESEARCH.md)で、完全解析領域の供給と実資源を問う前提研究を検討する。新しいID、source・区画、結果を使わない選定、資源・重複・停止条件を結果前に固定する。今回の32 sourceを正式holdoutへ昇格させない。

長時間実行は引き続きGitHub Actionsを第一候補とする。main統合は未実施で、公開AI採用は別のAI Engineering判断である。

## 正本

- [入口](README.md)
- [研究計画](PROGRAM_PLAN.md)
- [G5-01技術契約](g5-01/TECHNICAL_CONTRACT.md)
- [研究ログ](RESEARCH_LOG.md)
- [再開位置](RESUME_HERE.md)
- [第四世代の最終統合](../research-generation-4/FINAL_SYNTHESIS.md)
