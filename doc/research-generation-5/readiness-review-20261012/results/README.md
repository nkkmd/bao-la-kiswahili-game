# 準備再評価 — 保存結果の入口

[RESULT.json](RESULT.json)は4 Studyのsource結合・区画消費・独立再生の一致と、16完全領域・84非終局・67複数手局面の記述を保存する。原証拠は各Studyに保持し、今回のレビュー出力を新しい科学標本にしない。

[RESULT_BINDING.json](RESULT_BINDING.json)はレビュー出力のバイトhash、[SOURCE_MANIFEST](../SOURCE_MANIFEST.json)は入力・コード・設計案のhashを保持する。

primaryReadinessの判断はPRIMARY-READINESS-NOT-MET。depth1/4の実比較はしておらずn0/n1は未観測で、conditionalTailBoundはnull。実際の損失観測もnullのまま保持する。未知を0へ補わない。

[設計案](../DESIGN_PROPOSAL.md)の93ずつはモデル前提が成立する場合の精度計算であり、現在データへの信頼区間・検出力・正式登録・実行認可ではない。[再現性](../REPRODUCIBILITY.md)に再確認手順を示す。
