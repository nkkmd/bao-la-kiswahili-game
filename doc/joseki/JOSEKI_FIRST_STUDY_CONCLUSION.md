# Bao la Kiswahili 第一次定石研究 — 最終結論

完了日時: 2026-07-18T05:48:17.388Z

状態: `completed-without-provisional-joseki`

## 結論

第一次研究は、暫定定石を認定せずに完了した。標準初期局面の4初手は全て全応手頑健性基準に未達だった。条件付き局面P002には現ルール実装上の9 ply South強制勝ちがあるが外部未検証、P003はdepth 11でconsensus首位だが13 ply有界終局は全候補未解決である。

- 認定定石: 0
- 暫定定石: 0
- validated: 0

暫定定石0件は失敗ではない。AI条件に対する不安定性、全応手に対する脆弱性、固定自己対局と深い探索の不一致を再現可能に示したため、計画の成功条件を満たす。

## RQ1〜RQ6の最終回答

### RQ1 — 標準初期局面の初手に安定した優劣があるか

4初手全てが全応手頑健性基準に未達。一般定石として推せる単一初手は確認されなかった。

### RQ2 — 各初手に代表的な最善応手があるか

応手ごとの差は確認したが、短期最悪評価と終局上の主要応手は一致しない場合があり、終局固定継続を優先して記録した。

### RQ3 — 短い定型系列が存在するか

標準初期局面の一般系列は認定されなかった。条件付きP002では9 plyのSouth強制勝ち系列を現ルール実装内で証明した。

### RQ4 — 深度・評価関数・探索方式に頑健か

広い局面では不安定。低分岐強制捕獲P002/P003ではcross-method consensusが安定し、P003はdepth 11まで維持した。

### RQ5 — 主要応手以外にも頑健か

標準初手は全合法North応手試験で全て基準未達。P002の有界証明ではNorth証明節点の全合法応手を被覆した。

### RQ6 — 局面特徴で有力性を説明できるか

強制捕獲・front-empty脅威は有用な分類軸だが、frontSafety、応手数、強制系列長の単独閾値では勝敗を説明できなかった。

## 条件付き候補の最終状態

- P002: `bounded-consensus-supported-no-promotion`、promotion eligible: no
- P003: `deep-consensus-supported-bounded-unresolved-no-promotion`、promotion eligible: no

## P002外部検証の扱い

9手盤面照合票は生成済みだが、チェック欄は未記入であり、別ルール実装でも未検証である。このためP002は`externally-unvalidated`とする。これは第一次研究の終了を妨げないが、暫定定石またはvalidatedへの昇格を妨げる。

## 成功条件

- [x] 再現可能な開局木生成基盤
- [x] 全初手・全応手比較
- [x] AI条件間一致・不一致の定量化
- [x] 暫定定石または明確な非定石の特定 — 暫定定石0件、一般初手候補なしを再現可能に特定
- [x] 主要応手と反例の記録
- [x] 人間向けページ生成
- [x] 成果物からの再集計
- [x] 適用範囲と限界の明記

## 将来研究

- P002 9手系列の人間または別ルール実装による再生
- J001のdepth相互作用と評価ホライズンの診断
- 長期評価反転の特徴単位診断
- 低分岐強制捕獲以外におけるMCTS candidate/prior再設計
- nyumba、namua-to-mtaji、kichwa、front-emptyを含む第二次局面標本
- 熟練者棋譜比較、定石ブラウザ、opening book統合

これらは第一次研究の未完了作業ではなく、独立した将来研究バックログとして管理する。

## 最終完全性

- prerequisite verifications: 16
- success criteria: 8/8
- conclusion hash: `a1947ef2af2c32b1115154bacfcf4497ee8c2aaf243abd0f63a6a8c2ffc1311e`
- verification hash: `3e02bedcac294666947d971342834339769cee3bf26e8d812698205ebd4595d9`
