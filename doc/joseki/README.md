# Bao la Kiswahili 定石集

このディレクトリは、AI実験で検証した定石候補を人間向けに整理する。伝統的・実戦的な定石を記録したものではなく、現在のルール実装とAI条件に依存する研究成果である。

- [初手・応手スクリーニング](OPENING_INDEX.md)
- [8 ply候補系列](CANDIDATE_LINES.md)
- [8 ply葉 MCTS頑健性試験](MCTS_ROBUSTNESS.md)
- [MCTS iteration感度試験](MCTS_SENSITIVITY.md)
- [着手表記](JOSEKI_NOTATION.md)
- 研究方法と解釈: `doc/JOSEKI_RESEARCH.md`

現在は4 ply全数調査、最有力候補の8 ply重点検証、短時間MCTSスクリーニング、層化iteration感度試験を完了した。候補初手は`screened`、MCTSの次手選択は低分岐の強制捕獲層を除いて`unstable`であり、暫定定石はまだ認定していない。
