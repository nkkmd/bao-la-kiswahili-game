# 第五世代 — 応手種別による供給設計

作成日: 2026-10-13（日本時間）  
設計ID: `RG5-REPLY-MODE-SOURCE-DESIGN-2026-10-13-v1`  
状態: **SOURCE-DESIGN-SPECIFIED-NOT-EXECUTED**

主要な「順位変動と勝敗価値損失」の問いを保持し、短期自然終局とは異なる構造層を具体化した。rootの手によって相手の応手が捕獲手になる枝とtakataになる枝を持ち、全ての直後の子が非終局である局面を対象案とする。供給を保証する研究結果ではなく、次の独立開発Studyへ渡す実装可能な設計である。

保存済みG5-02部分グラフにこの構造が284件あった。旧16完全領域には0件で、当該284件の勝敗価値も閉包費用も未確定である。旧局面を新候補として採用せず、source・遷移・閉包を追加生成しなかった。主要関係の準備判断は引き続きPRIMARY-READINESS-NOT-METである。

[設計](DESIGN.md)、[報告](REPORT.md)、[再現性](REPRODUCIBILITY.md)、[研究ログ](RESEARCH_LOG.md)、[再開位置](RESUME_HERE.md)、[品質監査](QUALITY_AUDIT.md)の順に読む。JSONのID・状態token・field・hashは機械定義としてそのまま保持する。新規実行は別ID・区画・ソース固定・認可記録・消費leaseを備える工程へ進む。
