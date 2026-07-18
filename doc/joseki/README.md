# Bao la Kiswahili 定石集

このディレクトリは、AI実験で検証した定石候補を人間向けに整理する。伝統的・実戦的な定石を記録したものではなく、現在のルール実装とAI条件に依存する研究成果である。

- [初手・応手スクリーニング](OPENING_INDEX.md)
- [8 ply候補系列](CANDIDATE_LINES.md)
- [8 ply葉 MCTS頑健性試験](MCTS_ROBUSTNESS.md)
- [MCTS iteration感度試験](MCTS_SENSITIVITY.md)
- [8 ply局面パターン](POSITION_PATTERNS.md)
- [8 ply主要系列 継続自己対局](CONTINUATION_RESULTS.md)
- [全4初手 継続自己対局比較](FIRST_MOVE_CONTINUATIONS.md)
- [C0敗着系列の評価反転分析](C0_LOSS_ANALYSIS.md)
- [J001 全North応手固定継続](J001_REPLY_RESULTS.md)
- [全初手・全North応手 固定継続比較](ALL_REPLY_RESULTS.md)
- [条件付き局面P001 第3手比較](CONDITIONAL_P001_RESULTS.md)
- [P001 — 非捕獲2 ply後の第3手不安定形](patterns/P001.md)
- [強制捕獲局面P002 固定継続比較](FORCED_P002_RESULTS.md)
- [P002 — 低分岐強制捕獲の収束先反例](patterns/P002.md)
- [J001 — 6番穴・右（応手頑健性で反証）](openings/J001.md)
- [未解決系列](UNRESOLVED_LINES.md)
- [着手表記](JOSEKI_NOTATION.md)
- 研究方法と解釈: `doc/JOSEKI_RESEARCH.md`

現在は4 ply全数調査、旧候補の8 ply重点検証、MCTS頑健性試験、全初手・全応手継続、条件付きP001、強制捕獲P002、C0評価反転分析、局面パターン横断集計を完了した。P002ではphase2全6条件とMCTS全3 seedが一致した手が3/6勝、非consensus手が5/6勝となり、探索安定性と長期勝敗が分離した。一般・条件付きとも暫定定石は認定していない。
