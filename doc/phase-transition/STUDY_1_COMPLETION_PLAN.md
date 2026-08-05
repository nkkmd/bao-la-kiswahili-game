# 局面相転移点研究 — 第1研究 完了計画

更新日: 2026-08-05  
Status: Active completion plan  
対象: **第1研究「Baoにおける局面相転移点の発見と、capture-branch-expansionの確認」**

## 1. この文書の位置づけ

初期計画 `doc/PHASE_TRANSITION_RESEARCH_PLAN.md` は、研究開始前にRQ1–RQ10を広く設定した探索的マスター計画である。

研究の進行により、強制捕獲レジーム内部の `capture-branch-expansion` が最も明瞭な再現可能候補として浮上し、E-010–E-019で確認的検証が集中した。

このため、初期RQを結果後に削除・否定するのではなく、研究プログラムを次のように整理する。

- **第1研究**: Baoにおける局面相転移点の発見と、`capture-branch-expansion` の確認
- **追加研究**: 第1研究で主対象としなかったreserve、nyumba、前列、mobility、forcing解除、formal phaseとの関係など

この整理は既存formal decision、事前登録条件、endpoint、threshold、seed、direction ruleを変更しない。

## 2. 第1研究の中心問い

第1研究では次を中心に扱う。

1. Bao対局から再現可能な戦略的相転移候補を抽出できるか。
2. 強制捕獲レジーム内部に、単なる一時的スパイクではない持続的な捕獲選択肢構造変化が存在するか。
3. `capture-branch-expansion` は新規seed・独立構造で再観測されるか。
4. その顕在化はsearch profileに依存するか。
5. search depth / evaluator変更時の適用範囲・反例・境界条件は何か。
6. 機械定義と人間向けBao語彙としてどこまで固定できるか。

## 3. 現在までに確定したこと

### 3.1 探索・候補同定

- pilot-v2で複数の相転移候補を抽出した。
- 全Aアーキタイプが強制捕獲レジーム内に位置した。
- `capture-branch-expansion` は候補側に強く濃縮する主要現象として浮上した。
- 一時的スパイク、終局近傍forcing解除等を分離し、capture-branch-expansionを即時大量捕獲ではなく後続局面の捕獲選択肢形成として解釈した。

### 3.2 Formal decision

固定済みformal decisions:

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

これらを結果後に再分類しない。

### 3.3 Search-profile dependence

E-018により、固定 `hard / bao / depth 2`、paired same-opening designでphase2 > legacyのcapture-branch-expansion manifestation差がformal `confirmed`。

E-019では一般化仮説H17を検定し:

- D1 (`bao / depth1`): phase2 > legacy, component `pass`, Holm standalone confirmed
- D3 (`bao / depth3`): preregistered方向と逆のlegacy > phase2, component `fail`
- V2 (`bao-v2 / depth2`): phase2 > legacy, component `pass`, Holm standalone confirmed
- global H17: `not-confirmed`

したがってsearch-profile effectは事前指定条件間で一様ではない。

## 4. 第1研究に残す工程

### Stage A — D3逆転の独立確認

E-019 D3の `legacy > phase2` は強い観測だが、E-019の事前登録仮説H17とは逆方向だった。

第1研究を閉じる前に、この逆転が独立seedで再現するかを新しいconfirmatory hypothesisとして検証する。

原則:

- E-019のD3結果を遡及的confirmationにしない
- 新規hypothesis IDを付与する場合はdata generation前
- 新規experiment ID（E-020候補）は正式登録時にのみ付与する
- E-019 formal seedを再利用しない
- 新規preregistration / execution policy / explicit approval / execution lockを要求する
- search-profile × depth interactionまたはdepth依存の非単調性を、結果を見てから都合よく変更しない形で定義する

E-020 / H18という番号は現時点では**未登録**であり、正式な事前登録作成時まで確定しない。

### Stage B — 逆転・depth依存の機構解析

Stage Aの結果に応じて、depthによる方向変化の構造的原因を調べる。

候補となる分析:

- phase2 / legacyでcandidate trajectoryがどこから分岐するか
- candidate自体の発生率とmanifestation率の分離
- forced-capture regimeの長さ・位置・branching構造
- capture-option形成前後の合法手数・捕獲手数・最大捕獲可能量
- 同一openingでdepth 1/2/3の選択手が変化する境界
- trajectory-ply単位で見た独立構造数と反例

この段階は説明的・機構的解析を主とする。新しいformal claimを行う場合だけ、独立した事前登録実験へ分離する。

### Stage C — capture-branch-expansionの最終認定範囲

初期計画の相転移認定基準に照らして最終評価する。

1. 異なる対局で再発する
2. 二つ以上の独立特徴群に変化がある
3. 変化が事前指定期間持続する
4. 新規seedで再現する
5. 局面構造として説明できる
6. 反例と適用範囲を記録できる

各項目を `satisfied / partially satisfied / not satisfied` 等で根拠付き評価し、formal experimentのdecisionとは混同しない。

特に、search depth / evaluator / search profileに関する適用範囲を明示する。

### Stage D — 機械定義とBao固有語彙の固定

最終報告では少なくとも次を定義する。

- 強制捕獲レジーム
- category-A candidate
- capture-branch-expansion
- event persistence
- trajectory / trajectory-ply
- search-profile dependence
- 確認された適用範囲と反例

日本語説明と機械判定条件の対応を残す。

### Stage E — 第1研究 最終統合

次を作成して第1研究を閉じる。

- 最終研究報告（FINAL_REPORT相当）
- E-001以降のexperiment / decision / hypothesis chronology
- formal decisionsと解釈境界の一覧
- capture-branch-expansionの代表例・反例
- 再現情報とfinal archive index
- 未解決事項 / Future Work

新しいformal experimentが追加された場合は、そのfinal bundle監査まで終えてから最終統合する。

## 5. 第1研究の完了条件

次を満たした時点で第1研究を「完了」とする。

- D3逆転について、独立confirmatory testを実施するか、実施しない合理的理由を明示して境界条件として確定する
- capture-branch-expansionのdepth/search-profile依存性について、確認範囲と非確認範囲を明文化する
- 必要な機構解析を完了し、現象を局面構造として説明できる範囲を確定する
- 初期の相転移認定基準6項目に対する最終評価を行う
- 機械定義と人間向け語彙を対応付ける
- formal decisionsを変更せず最終報告へ統合する
- final artifacts / checksums / checkpoints / ledgersが整合する

PR #26のmergeやdraft解除はrepository運用上の判断であり、科学的完了条件とは分離する。明示的な指示があるまでPR #26はopen / draftを維持する。

## 6. 初期RQの扱い

初期RQ1–RQ10は削除しない。第1研究で主対象にならなかった問いは**否定されたのではなく、追加研究課題として繰り越す**。

| RQ | 第1研究での位置づけ | 今後 |
|---|---|---|
| RQ1 namua→mtaji前後 | 探索的観測あり、中心確認対象外 | formal phaseとの時間関係を追加研究 |
| RQ2 phase移行と独立戦略転移 | capture-branch-expansionがphase変化なしで生じる例を観測 | より一般的な独立性は追加研究 |
| RQ3 reserve閾値 | 第1研究の中心確認対象外 | 追加研究 |
| RQ4 nyumba消失 | 第1研究の中心確認対象外 | 追加研究 |
| RQ5 前列支配 | 特徴量として利用、中心確認対象外 | 追加研究 |
| RQ6 捕獲重視→可動性重視 | 中心確認対象外 | 追加研究 |
| RQ7 強制→自由選択 | forcing解除候補の終局近傍交絡を確認 | 独立現象としては追加研究 |
| RQ8 探索条件再現性 | E-011/E-018/E-019で重点的に検証 | 第1研究内で境界条件を最終確定 |
| RQ9 一対局の複数転移 | 探索的支持 | 一般的確認は追加研究 |
| RQ10 局面状態分類 | archetype / trajectory分析で支持 | 一般的分類理論は追加研究 |

この表は各RQのformal success/failureを新たに判定するものではない。

## 7. Future Work / 追加研究プログラム

第1研究完了後の候補:

- reserve閾値と戦略転換
- nyumba消失と局面条件の相互作用
- 前列支配の崩壊・固定化
- capture重視からmobility重視への転換
- forcing系列から自由選択系列への非終局的転換
- namua→mtaji形式移行と戦略転移の時間関係
- 複数種類の相転移を統合する分類体系
- evaluator/search implementationを広げた外的妥当性

追加研究は第1研究のformal decisionを変更するためではなく、Baoの相転移研究プログラムを拡張する独立研究として設計する。

## 8. 現在の次工程

現時点では新しい仮説・E-020をまだ事前登録しない。

再開時にまずE-019までの結果を再確認し、D3逆転をどの仮説形式で独立検証するかを設計する。その後、正式な仮説・preregistrationをdata generation前に固定する。
