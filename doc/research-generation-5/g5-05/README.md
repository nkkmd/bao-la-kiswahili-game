# G5-05 — 応手種別分岐による完全解析領域の供給

Study ID: MRCS-STUDY1  
作成日: 2026-10-13（日本時間）  
状態: **実装・事前固定／新規区画の実行前**

相手の捕獲手とtakataの応手集合へ分かれる非終局局面を、全軌跡の最後から選ぶ新しい開発供給Studyである。主要な順位変動と勝敗価値損失の問いを保持し、[前段の設計](../source-design-20261013/README.md)を新規証拠で検証する。構造差が勝敗価値差を保証するとは仮定しない。

最初に[契約](CONTRACT.md)、[実行前レビュー](PREEXECUTION_REVIEW.md)、[報告](REPORT.md)、[現在状態](CURRENT_STATUS.md)、[再現性](REPRODUCIBILITY.md)、[研究ログ](RESEARCH_LOG.md)、[再開位置](RESUME_HERE.md)を読む。JSONのfield・ID・hash・状態tokenは機械定義として保持する。旧4 Studyの記録を変更せず、正式関係の登録・検定、main統合、公開AI変更は本Studyに含めない。
