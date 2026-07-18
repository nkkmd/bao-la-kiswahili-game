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
- [P002 評価反転trace比較](P002_REVERSAL_ANALYSIS.md)
- [P002 — 低分岐強制捕獲の収束先反例](patterns/P002.md)
- [強制捕獲局面P003 固定継続比較](FORCED_P003_RESULTS.md)
- [P003 評価反転trace比較](P003_REVERSAL_ANALYSIS.md)
- [P003 — frontSafety同値でも残る探索収束反例](patterns/P003.md)
- [P002・P003 探索収束反例の横断比較](FORCED_CONVERGENCE_COMPARISON.md)
- [P002・P003 探索depth sweep](FORCED_DEPTH_SWEEP.md)
- [P002 depth 8 強制勝ち系列](P002_DEPTH8_WIN.md)
- [P002 9 ply 有界強制勝ちAND/OR証明](P002_BOUNDED_WIN_PROOF.md)
- [P003 depth 9〜10 延長](P003_DEPTH_EXTENSION.md)
- [P003 depth 11 追試](P003_DEPTH11.md)
- [P003 depth 11 全候補統合](P003_DEPTH11_COMPLETE.md)
- [J001 — 6番穴・右（応手頑健性で反証）](openings/J001.md)
- [未解決系列](UNRESOLVED_LINES.md)
- [着手表記](JOSEKI_NOTATION.md)
- 研究方法と解釈: `doc/JOSEKI_RESEARCH.md`

現在は4 ply全数調査、MCTS頑健性試験、全初手・全応手継続、P001〜P003、評価反転・depth sweepを完了した。近似自己対局ではP002・P003とも非合意手が勝数首位だったが、P002の合意手はAI評価器を使わないAND/OR検証でも9 ply以内のSouth強制勝ちとなった。P003はdepth 11の4候補値を完備し、consensus手が首位を維持した。自己対局勝数を真の手ランキングとは扱わず、別ルール実装による再現がないため暫定定石はまだ認定しない。
