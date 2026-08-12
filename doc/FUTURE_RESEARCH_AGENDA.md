# Bao 今後の研究課題

Version: 1.2.0  
Status: Active  
作成日: 2026-07-21  
更新日: 2026-08-12

## 1. 目的

この文書は、先攻・後攻差研究および第一次定石研究の完了後に検討する、Bao la Kiswahili の新しい研究方向を整理した研究アジェンダである。

ここで扱う課題は、既存研究の試行数追加、別seedによる追試、既存定石候補の再検証ではない。囲碁・将棋で発展してきた局面分類、手筋、形勢判断、終盤解析、認知研究、計算複雑性研究などを参考にしつつ、Bao固有の構造へ置き換えた独立の研究領域を対象とする。

本書は実装ロードマップではない。各課題を実際に開始する際は、研究目的、仮説、測定方法、データ形式、判定基準、停止条件を個別の研究計画として定義する。

2026-08-12時点で、第1段階のうち「局面の相転移点」「局面類型と棋風」に加え、両者を接続する独立研究 **「BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続」** のStudy 1も完了した。Namua→Mtaji Study 1のprimary formal resultは `not-confirmed` であり、同一formal corpusの追加解析や別seedによる救済はfuture workとして扱わない。

## 2. 既存研究との境界

既存の研究・開発基盤では、主に次を扱っている。

- 先攻・後攻の有利差
- 固定開局を共有するペア対局
- 定石候補の抽出と検証
- seed付き自己対局
- 評価関数および探索方式の比較
- 戦術局面回帰
- 実対局由来の局面監査
- 局面相転移点Study 1 — [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md)
- 局面類型と棋風Study 1 — [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md)
- Namua→Mtaji Strategic Temporal Transition Study 1 — [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md)

今後の研究では、単純な勝率比較から対象を広げ、次の問いを中心に置く。

> Baoの局面にはどのような構造があり、どのような原理で戦略が変化し、それを人間が理解可能な知識として記述できるか。

完了済みStudyのformal decision、事前登録条件、negative/null/inconclusive result、解釈境界は後続研究によって変更しない。後続研究は、既存Studyの救済や再定義ではなく、新しい研究課題として開始する。

## 3. 研究上の共通原則

1. 自己対局AIの評価をBao上の絶対的正解とはみなさない。
2. 機械的観測、統計的傾向、棋力判断、理論的証明を区別する。
3. 局面番号や特定手順だけでなく、再利用可能な構造として知識を表現する。
4. namuaとmtajiを必要に応じて分離して分析する。
5. 人間向け概念と機械向け特徴量を安易に同一視しない。
6. 研究結果には適用範囲、既知の反例、未解決点を残す。
7. 研究用データは再現可能な局面形式、条件、seed、AI設定とともに保存する。

## 4. 研究課題

### 4.1 局面の相転移点

#### 現在の状態

**Study 1完了。**

- 初見向け概要: [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md)
- 科学的正本: [`phase-transition/STUDY_1_FINAL_REPORT.md`](phase-transition/STUDY_1_FINAL_REPORT.md)

Study 1では`capture-branch-expansion`をboundedなstrategic-transition phenotypeとして保持し、固定条件でdepth2とdepth3のsearch-profile orderingが逆転することまで確認した。一方、universal Bao phase-transition law、一般的なsearch-profile × depth interaction、reserve・nyumba・front-row・mobilityを包含する一般理論は確立していない。これらは後続する独立研究の対象である。

#### 中心課題

Baoの対局において、局面の価値基準や最善戦略が不可逆的に変化する地点を特定する。

#### 主な対象

- namuaからmtajiへの移行
- nyumbaの消失または機能変化
- reserveが特定範囲を下回る局面
- 前列支配の崩壊または固定化
- 捕獲重視から可動性重視への移行
- 強制系列中心から自由選択中心への移行

#### 研究方法の例

各手についてreserve、nyumba状態、合法手数、捕獲手数、最大捕獲量、前列占有、評価値、候補手順位、最善手安定性を時系列化し、急激な変化点を検出する。

#### 期待成果

手数によらないBao固有の序盤・中盤・終盤分類、および局面フェーズ判定基準。

---

### 4.2 局面類型と棋風

#### 現在の状態

**Study 1完了。**

- 初見向け概要: [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md)
- 科学的正本: [`position-typology/STUDY_1_FINAL_REPORT.md`](position-typology/STUDY_1_FINAL_REPORT.md)

Study 1では、固定representation / population内でMtajiの`MTAJI-M1 / MTAJI-M2`二類型をformalにconfirmedした。Namuaでは離散typeをpromoteせず、`N-ACT / N-CON`をexploratory continuous coordinatesとして保持した。discrete playing-style cluster setは支持されず、探索で得たexact `STYLE-C1..C4` 4D geometryも独立確認では`not-confirmed`となった。

#### 中心課題

Baoに繰り返し現れる局面構造と、対局者またはAIが選びやすい戦略傾向を分類する。

#### 類型候補

- 捕獲重視型
- nyumba維持型
- 前列制圧型
- reserve温存型
- 早期mtaji移行型
- 可動性重視型
- 強制系列型
- 持久型

これらは当初の候補語彙であり、Study 1の結果によって確認済み類型へ自動的に昇格したものではない。

#### 研究方法の例

多数の対局から捕獲頻度、nyumba保持期間、reserve消費速度、前列占有率、relay長、合法手数、mtaji移行時点、評価変動などを抽出し、クラスタリングと代表局面分析を行う。

#### 期待成果

Bao固有の棋風語彙、対局スタイル分類、異なる戦略傾向を持つAI、学習者向けスタイル診断。

---

### 4.2.1 Namua→Mtaji移行前後の戦略的転移構造 — Study 1完了

#### 研究題目

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Status: **Study 1 closed / formal decision `not-confirmed`**

- 初見向け概要: [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md)
- 科学的正本: [`namua-mtaji-transition/STUDY_1_FINAL_REPORT.md`](namua-mtaji-transition/STUDY_1_FINAL_REPORT.md)
- Formal result: [`namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md`](namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md)

#### 研究の起点

局面類型Study 1の固定cross-study bridgeでは、対象となった`capture-branch-expansion` 59件がすべてNamuaに位置し、Mtajiとの同時点overlapが0だった。そのため、`capture-branch-expansion`とconfirmed Mtaji morphology `MTAJI-M1 / MTAJI-M2`の直接対応は推定できなかった。

この未推定部分を、同一時点の対応付けではなくprospectiveな時間的接続として独立研究化した。

#### Design-stageで判明した決定的境界

Stage 0/1で、現engineのstandard trajectoryではNamua→Mtaji移行がreserve exhaustionによるdeterministic clockであることが確立した。

```text
initial total reserve = 44
Namua total reserve at ply t = 44 - t
first Mtaji observation = ply 44
```

Stage 2 formal corpusでも、Mtajiへ到達した3886/3886 gamesがply 44でfirst Mtajiへ移行し、progression violationは0だった。

したがって、当初候補だった

```text
time-to-first-Mtaji
first-Mtaji survival
first-Mtaji hazard
CBEによるMtaji acceleration / delay
```

は、現engineにおけるstrategic inferential endpointとして棄却された。candidate-to-first-Mtaji距離は戦略的survival timeではなく、rule-derived deterministic progressionである。

この境界はformal outcome inspection前に固定されており、negative result後の再解釈ではない。

#### Frozen Stage 2 formal question

Formal analysisは、timingではなくfirst-Mtaji morphology associationへ限定された。

```text
condition = P2-D2 only
hard / bao / phase2 / depth2
games = 4096
seeds = 20280001..20284096
```

Exposure:

```text
earliest fully ascertained Namua CBE per unique historical trajectory
```

Comparator:

```text
R3-M
exact candidate ply
not Category A at index
same forced-capture status
no Namua CBE anywhere in control trajectory
first-Mtaji morphology eligible
20 unique controls per exposure
global control non-reuse
```

Estimability:

```text
morphology-eligible exposed trajectories = 30
G1 >= 20 -> PASS
G2 exactly 20 controls/exposure -> PASS
matched sets = 30
unique controls = 600
```

#### Formal result

```text
Exposed MTAJI-M1 = 26 / 30 = 0.8667
Matched-control MTAJI-M1 = 509 / 600 = 0.8483
mean matched risk difference = +0.01833
MH common OR = 1.1618
```

Single preregistered matched-set exact conditional Poisson-binomial test:

```text
observed T = 26
p_two_sided = 1.0
alpha = 0.05
```

Formal decision:

> **NOT-CONFIRMED**

P2-D2内のfirst-Mtaji morphology associationは確認されなかった。小さな正の記述差をtrendとして救済しない。

#### Future-work boundary

この完了研究について、次はfuture workに含めない。

- 同一formal corpusでcandidate-ply subgroupを探すことによるprimary resultの救済
- alternative comparatorへの切替
- 追加game / 別seedによる有意化探索
- CBE / Category-A thresholdの緩和
- Mtaji classifierのrefit / relabeling
- deterministic clockをsurvival/hazard endpointとして再包装すること

将来扱う場合は、別のscientific questionとしてprospectively分離する。

新しい研究候補には、例えば次がある。

- Namua progression上のfull structural trajectoryを、事前固定したrule-state representationで調べる研究
- front-row / nyumba / mobility / forcing lifecycle / search-tree mechanismの新規mechanistic study
- MTAJI-M1/M2とCBEのhuman/expert validation
- P2-D2以外でのexternal validityをfresh corpusで検証する研究

いずれもNamua→Mtaji Study 1の`not-confirmed` decisionを変更しない。

---

### 4.3 局面複雑度と難易度

#### 中心課題

Baoにおける「難しい局面」を、探索量だけに依存せず複数の観点から定義する。

#### 難易度の層

1. **探索難易度**: 最善手安定までに必要な深度、node数、時間
2. **判断難易度**: 上位候補間の評価差、唯一手性
3. **予測難易度**: 浅い評価と深い評価の乖離
4. **構造難易度**: 合法手数、relay長、強制捕獲系列、分岐形状
5. **人間難易度**: 誤答率、判断時間、説明の不一致

#### 期待成果

Bao局面難易度尺度、難易度別問題集、層別ベンチマーク、教材の段階設計。

---

### 4.4 手筋の発見と体系化

#### 中心課題

特定の開局手順に依存せず、異なる局面で共通して有効になるBao固有の着手原理を発見する。

#### 候補例

- 捕獲を遅らせて後続利益を得る
- relay終点を調整する
- 相手へ捕獲を強制して配置を崩す
- nyumbaを一時的に崩して主導権を得る
- reserve投入位置から連続構想を作る
- 前列の一部を犠牲にして可動性を回復する

#### 研究方法の例

高深度探索または熟練者レビューで支持された着手から、着手前後の局所構造、強制応手、relay終点、数手後の利益を抽象化し、同じ因果系列を持つ局面をまとめる。

#### 期待成果

局面横断的な「Bao手筋辞典」、手筋検出器、手筋別練習問題。

---

### 4.5 悪手と錯覚パターン

#### 中心課題

初心者、人間一般、浅い探索AIが繰り返し陥る誤判断を分類する。

#### 錯覚候補

- 即時捕獲量の過大評価
- nyumba維持の絶対視
- reserveの過度な温存
- relay終了後の配置の見落とし
- 相手の強制捕獲を自分の利益と誤認
- 一手後の可動性低下の見落とし
- 見かけ上の左右対称性への依存

#### 研究方法の例

誤った候補手について、選択理由、浅深度差、反撃系列、特徴量変化、人間の説明を比較し、失敗原因を再利用可能なカテゴリへ整理する。

#### 期待成果

初心者向け注意点、誤答理由付き問題集、悪手説明機能、人間らしい難易度調整。

---

### 4.6 形勢判断と勝率校正

#### 中心課題

AIの内部評価値が、実際の勝率とどのような関係にあるかを明らかにする。

#### 研究方法の例

異なる評価値を持つ多数の局面から反復対局を行い、phase、reserve差、nyumba状態、AI強度ごとに実勝率を測定する。評価値と勝率の対応を校正し、信頼区間も記録する。

#### 期待成果

「互角」「やや有利」「優勢」「勝勢」などのBao固有基準、観戦用勝率表示、評価値の解釈可能性向上。

---

### 4.7 逆転可能性と勝負手

#### 中心課題

理論上の最善手と、実戦で相手に誤りを要求して逆転可能性を高める手を区別する。

#### 主な指標

- 最善応手に対する評価
- 平均的応手に対する勝率
- 応手の唯一性
- 分岐数
- 相手AIの強度別誤答率
- 候補手ごとの逆転率

#### 期待成果

劣勢時の勝負手分類、実戦型AI、難しい応手を要求する局面の教材化。

---

### 4.8 限定終盤と必勝圏

#### 中心課題

完全なゲーム解析ではなく、制約された終盤局面を列挙・後退解析し、必勝・必敗・循環・勝利距離を求める。

#### 対象候補

- reserveが0
- nyumbaなし
- 総種数が一定以下
- 非空穴数が一定以下
- 合法手数が少ない
- 特定の種数分布に限定する

#### 期待成果

Bao終盤テーブルベース、終盤完全手、必勝問題、評価関数およびルールエンジンの検証用正解データ。

---

### 4.9 重要局面と勝敗分岐点

#### 中心課題

一局の全着手から、勝敗や戦略方針を大きく変えた少数の局面を抽出する。

#### 判定候補

- 勝率または評価値の急変
- 最善手との差が大きい着手
- 唯一手が存在した局面
- 相転移を起こした着手
- 以後の局面類型を変えた着手
- 不可逆な構造損失

#### 期待成果

勝着、敗着、疑問手、分岐点を中心とする自動棋譜解説、一局から少数問を生成する復習機能。

---

### 4.10 人間とAIの判断差

#### 中心課題

初心者、熟練者、評価関数のみのAI、浅い探索AI、深い探索AIが、どの局面で異なる判断を行うかを調べる。

#### 測定候補

- 選択手
- 判断時間
- 候補手数
- 形勢予測
- 理由説明
- 読み筋の長さ
- 見落とした反撃

#### 期待成果

熟達過程のモデル、初心者が優先して学ぶべき概念、人間らしいAI、説明機能の改善。

---

### 4.11 対称性と同型局面

#### 中心課題

盤面表示が異なっていても、合法手、局面遷移、勝敗が本質的に同じ局面を体系化する。

#### 研究対象

- 左右反転
- プレイヤー交換
- 穴番号の正規化
- namuaとmtajiで成立する変換の違い
- 合法手グラフの同型
- canonical formの構築

#### 期待成果

重複局面削減、研究データ圧縮、Transposition Table効率化、対称性を利用したテスト生成。

既存のnamua対称性研究とは異なり、個別の不一致原因だけでなく、Bao全体の局面同値関係を研究対象とする。

---

### 4.12 状態空間とゲーム木複雑度

#### 中心課題

Baoの計算論的規模を推定し、他の盤上ゲームやマンカラ系ゲームと比較可能な基礎値を得る。

#### 主な対象

1. 到達可能な合法局面数
2. 可能な対局系列数
3. phase別の実効分岐係数
4. 平均対局長と分布
5. 強制手がゲーム木を圧縮する割合
6. 対称性を除いた局面数

#### 研究方法の例

完全列挙が困難な場合は、到達可能性判定、canonical form、自己対局標本、ランダムウォーク、モンテカルロ推定を組み合わせる。

#### 期待成果

Baoの探索困難性に対する定量的説明、研究用基準値、ゲームAI方式選択の理論的根拠。

## 5. 推奨する研究プログラム

### 第1段階: Baoを記述する語彙の構築

現在の優先順位:

1. **[完了] 局面の相転移点 — Study 1**
2. **[完了] 局面類型と棋風 — Study 1**
3. **[完了] Namua→Mtaji移行前後の戦略的転移構造 — Study 1 (`not-confirmed`)**
4. **[未着手] 局面複雑度と難易度**
5. **[未着手] 手筋の発見と体系化**

この段階では、Baoの局面を人間と機械の双方が記述できる共通語彙を作る。最初の三研究によりstate morphology、strategic-transition phenotype、両者のprospective bridgeに関する境界が得られた。Namua→Mtaji Study 1はprimary morphology associationを確認しなかったが、deterministic clockという重要なrule-derived boundaryを確立した。次の研究はこのnegative resultを救済するのではなく、難易度・手筋、または新しくpreregisterしたstructural/mechanistic questionへ進む。

### 第2段階: 理解、教育、解説への展開

優先課題:

1. 悪手と錯覚パターン
2. 形勢判断と勝率校正
3. 重要局面と勝敗分岐点
4. 人間とAIの判断差

この段階では、局面知識を教材、棋譜解説、学習支援へ変換する。

### 第3段階: 理論および完全解析への展開

優先課題:

1. 限定終盤と必勝圏
2. 対称性と同型局面
3. 状態空間とゲーム木複雑度
4. 逆転可能性と勝負手

この段階では、数学的・計算論的性質と実戦的選択の違いを研究する。

## 6. 特に優先する三本柱

### 6.1 Bao局面分類学

相転移、局面類型、棋風、難易度を統合し、Baoの局面を体系的に記述する。局面相転移点Study 1、局面類型と棋風Study 1、Namua→Mtaji Study 1は完了した。今後、Namua→Mtajiの追加研究を行う場合は、完了済みprimary resultを再検定するのではなく、structural trajectory、mechanism、external validity等の新しい問いとしてprospectively定義する。

### 6.2 Bao手筋・錯覚体系

定石とは異なる局面横断的な手筋と、典型的な誤判断を対応付ける。

### 6.3 Bao終盤科学

限定局面の完全解析、必勝圏、勝利距離、終盤テーブルベースを扱う。

## 7. 個別研究を開始する条件

各研究課題を実施へ移す際は、最低限次を定義する。

- 研究課題と既存研究との差
- 検証可能な仮説
- 対象とするphaseおよび局面集合
- 使用するAI、探索深度、時間制限、seed
- 収集する特徴量とデータ形式
- 統計単位と相関の扱い
- 人間レビューが必要な箇所
- 成功基準、否定基準、停止条件
- 成果物の保存先

完了済み研究から派生する新研究では特に、既存Studyのformal decisionsを変更しないこと、endpoint・comparator・population・seed・decision ruleを結果を見る前に定義すること、confirmed/exploratory vocabularyを同じ証拠水準として扱わないことを開始条件に含める。

Namua→Mtajiを扱う場合、現engineではfirst-Mtaji timingがdeterministic progressionであるため、`time-to-first-Mtaji` / survival / hazard / acceleration / delayをstrategic endpointとして再利用しない。異なるengine semanticsを研究対象にする場合は、それ自体を別システム・別studyとして明示する。

## 8. 到達目標

長期的な目標は、Baoを単にプレイ可能なゲーム、または勝率を比較できるAI対象として扱うだけでなく、次の形へ発展させることである。

- 局面を分類できる
- 戦略転換を説明できる
- 手筋と錯覚を言語化できる
- 形勢と勝率を校正できる
- 重要局面を抽出できる
- 限定終盤を証明できる
- 人間の学習過程を支援できる

中心となる研究方針は次のとおりである。

> Baoの局面を分類し、局面間に共通する戦略原理を発見し、それを人間が理解できる知識へ変換する。
