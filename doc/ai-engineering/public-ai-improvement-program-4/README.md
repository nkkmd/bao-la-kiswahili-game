# PBAI-P4 — 探索専用の軽量な局面遷移の検証

正式題目: `Search-Only Lightweight State Transition Verification Program 4`。

このProgramは、AIが思考中に作っていた表示用の盤面スナップショットを省くことで、同じ計算結果をより短時間で得られ、同じ持ち時間での対局成績も改善するかを調べる独立したAI Engineering検証である。唯一の候補は `PBAI-C011-v1`。Research Generation 4とは別の活動である。

現時点では正確性、development、validationが完了し、最終holdoutを実行している。公開AIは引き続き `AI-GEN2` で、候補の既定値はfalse。main統合・公開配備・AI世代昇格は行わない。

## 読む順序

1. [初見向け概要](OVERVIEW.md) — 何を変え、何を検証するか
2. [現在状態](CURRENT_STATUS.md) — 完了範囲と次の工程
3. [事前固定条件](PROTOCOL.md) — 対象、seed、数値gate、停止条件
4. [候補台帳](CANDIDATE_REGISTER.md) — 機構と対象外の変更
5. [判断台帳](DECISION_REGISTER.md) — 条件成立の根拠
6. [再現手順](REPRODUCIBILITY_INDEX.md) — 正本、hash、既知データの検算
7. [再開位置](RESUME_HERE.md) — 実行履歴と中断時の確認
8. [公開判断](RELEASE_REGISTER.md) — 公開系統と未認可の操作

[AI開発の中央索引](../../AI_ENGINEERING_INDEX.md)へ戻る。
