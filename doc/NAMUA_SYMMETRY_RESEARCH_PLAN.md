# namua鏡像対称性・評価不一致研究計画

Version: 0.1.0  
作成日: 2026-07-15

## 1. 目的

先攻・後攻差研究で確認された、namua局面における以下の不一致原因を特定する。

- 合法手対称性: 147/177局面で一致、30局面で不一致
- legacy評価対称性: 177/177局面で一致
- bao評価対称性: 112/177局面で一致、65局面で不一致
- mtajiでは合法手・legacy評価・bao評価がすべて一致

本研究では、不一致が次のどちらに由来するかを切り分ける。

1. 鏡像変換の定義または監査コードがBaoの座標・方向規約と一致していない
2. ルールエンジンまたはbao評価にSouth/North座席依存が存在する

本研究の実験はローカル環境で実行し、重い処理をGitHub Actionsでは行わない。

## 2. 研究上の原則

調査は次の順序で進める。

```text
鏡像変換の定義
  ↓
状態変換
  ↓
着手変換
  ↓
合法手集合
  ↓
着手適用後状態
  ↓
評価特徴量
  ↓
評価合計
```

下位層の対称性が確認できるまでは、上位層の不一致を独立した不具合と断定しない。

特に、合法手生成と着手適用の対称性を確認してからbao評価の調査へ進む。

## 3. 仮説

### H1: 鏡像変換の定義が誤っている

現在の監査はSouth/North交換、左右反転、方向反転を組み合わせている。Baoの盤面座標、前列・後列、種まき方向の意味を考慮すると、別の変換が正しい可能性がある。

### H2: namua固有の状態が完全に変換されていない

重点確認対象:

- `reserve`
- `houseOwned`
- `pending`
- nyumbaの位置・所有状態
- 捕獲義務
- takata／kutakata
- namua投入位置
- phase遷移直前の状態

### H3: 合法手生成に座席依存の分岐がある

穴番号、方向、捕獲対象、nyumba制約、reserve投入位置などに、South/Northで非対称な処理が存在する可能性がある。

### H4: 着手の正規化または比較方法が誤っている

`moveKey()`による比較で、意味的に同一の着手が異なる表現になっている、または`side`と`direction`を二重反転している可能性がある。

### H5: bao評価の特徴量に座席依存がある

重点確認対象:

- mobility
- 捕獲可能性
- reserve
- nyumba
- 前列・後列占有
- vulnerability
- phase固有ボーナス
- 位置依存評価
- tempo／手番ボーナス

### H6: 合法手不一致がbao評価不一致を派生させている

bao評価が合法手数、捕獲可能手数、mobilityなどを使用している場合、合法手生成の非対称性が評価値へ波及する。

## 4. ブランチと配置

推奨ブランチ:

```text
research/namua-symmetry-audit
```

予定ファイル構成:

```text
doc/
└── NAMUA_SYMMETRY_RESEARCH_PLAN.md

tools/
├── first-player-symmetry-audit.js
└── symmetry/
    ├── generate-states.js
    ├── transform-candidates.js
    ├── classify-mismatches.js
    ├── minimize-counterexample.js
    └── verify-transition-symmetry.js

test/
├── symmetry-transform.test.js
├── namua-move-symmetry.test.js
├── transition-symmetry.test.js
├── evaluation-symmetry.test.js
└── fixtures/
    └── namua-symmetry-cases.js

artifacts/
└── namua-symmetry/
    ├── baseline/
    ├── classified/
    ├── minimized/
    └── final/
```

## 5. Phase 0: 基準状態の固定

### 作業

- 現在の監査コードとseedを固定する
- 旧200局面を再生成可能にする
- 監査対象局面自体をJSONとして保存する
- 現在の不一致件数を基準成果物へ保存する

### 基準値

```text
合法手対称: 170/200
legacy評価対称: 200/200
bao評価対称: 135/200
```

### 成果物

```text
artifacts/namua-symmetry/baseline/
├── summary.json
├── details.json
└── states.jsonl
```

### 完了条件

同一コミット・同一seedで基準値を完全に再現できること。

## 6. Phase 1: 監査出力の詳細化

現在の監査に、各不一致局面の完全な差分を追加する。

保存項目:

```json
{
  "state": {},
  "mirroredState": {},
  "expectedMoves": [],
  "actualMoves": [],
  "missingMoves": [],
  "unexpectedMoves": [],
  "originalEvaluation": {},
  "mirroredEvaluation": {},
  "evaluationDelta": {},
  "metadata": {}
}
```

`metadata`にはphase、player、turn、reserve、houseOwned、nyumba状態、捕獲可能性、takata／kutakata、合法手数、pendingを記録する。

### 完了条件

30件の合法手不一致と65件のbao評価不一致を、個別fixtureとして再現できること。

## 7. Phase 2: 不一致の分類

### 合法手不一致の分類

- 着手数だけが異なる
- 穴番号だけが異なる
- 左右方向だけが異なる
- 捕獲可否が異なる
- nyumba関連
- reserve投入位置
- takata／kutakata
- 一方にだけ存在する着手種別

### 評価不一致の分類

- 合法手不一致を伴う
- 合法手は一致する
- nyumba所有時のみ
- reserveが残る場合のみ
- 特定プレイヤー手番のみ
- 捕獲可能局面のみ
- 一定の評価差
- 特定特徴量に比例する差

### 成果物

```text
artifacts/namua-symmetry/classified/classification.json
```

### 完了条件

すべての不一致を少なくとも一つの分類へ割り当てること。

## 8. Phase 3: 正しい鏡像変換の確定

複数の変換候補を同一局面集合で比較する。

| 候補 | プレイヤー交換 | 左右反転 | 行交換 | 方向反転 |
| --- | ---: | ---: | ---: | ---: |
| A | あり | あり | なし | あり |
| B | あり | あり | なし | なし |
| C | あり | なし | なし | あり |
| D | あり | なし | なし | なし |
| E | あり | 条件別 | 条件別 | 条件別 |

### 公理テスト

鏡像関数には次を要求する。

```text
mirror(mirror(state)) = state
mirror(mirror(move)) = move
```

合法手については次を要求する。

```text
mirror(legalMoves(state))
=
legalMoves(mirror(state))
```

### 手作業fixture

- 標準初期局面
- reserve投入可能穴が一つだけの局面
- 左方向だけ合法な局面
- 右方向だけ合法な局面
- 捕獲手が一つだけの局面
- nyumba保持局面
- nyumba喪失局面
- takataのみ可能な局面
- kutakataのみ可能な局面
- namuaからmtajiへ遷移する直前

### 完了条件

- 二重変換で元状態と元着手へ完全に戻る
- 手作業fixtureがすべて通る
- 変換定義をBaoの座標規約として説明できる

## 9. Phase 4: 合法手生成の原因追跡

正しい鏡像変換でも不一致が残る場合、`moveVariants()`の生成過程を段階別に比較する。

```text
手番開始状態
→ namua投入候補
→ 捕獲義務判定
→ 方向候補
→ nyumba制約
→ takata／kutakata判定
→ 最終着手variant
```

診断用関数案:

```js
explainMoveGeneration(state)
```

出力例:

```json
{
  "phase": "namua",
  "mustCapture": true,
  "entryCandidates": [],
  "directionCandidates": [],
  "houseRestrictions": [],
  "rejectedCandidates": [],
  "finalMoves": []
}
```

### 完了条件

合法手不一致30件について、最初に差が生じる処理段階を特定すること。

## 10. Phase 5: 着手適用の対称性監査

各合法手について次を比較する。

```text
mirror(applyMove(state, move))
```

```text
applyMove(mirror(state), mirror(move))
```

期待関係:

```text
mirror(applyMove(S, M))
=
applyMove(mirror(S), mirror(M))
```

比較対象:

- pits
- reserve
- player
- phase
- winner
- houseOwned
- pending
- turn
- 捕獲結果
- 連続種まき結果

### 完了条件

最低1,000組の局面・着手で完全一致すること。ここを通過するまでbao評価の修正へ進まない。

## 11. Phase 6: bao評価の特徴量分解

評価合計だけでなく、各特徴量を元局面と鏡像局面で比較する。

```json
{
  "mobility": {
    "original": 4,
    "mirrored": 3,
    "delta": 1
  }
}
```

評価が手番側視点なら、期待関係は次のとおり。

```text
evaluate(state, state.player)
=
evaluate(mirror(state), mirror(state).player)
```

固定South視点であれば符号反転が必要となるため、評価APIの視点定義を先に明文化する。

### 調査順序

1. mobility・合法手依存特徴
2. 捕獲可能性
3. reserve
4. nyumba
5. 前列・後列
6. vulnerability
7. phase別ボーナス
8. 位置依存評価
9. tempo／手番ボーナス

### 完了条件

bao評価不一致65件について、差を生む特徴量をすべて特定すること。

## 12. Phase 7: 最小反例の生成

不一致を維持したまま状態を縮小する。

1. 無関係な穴の石を減らす
2. reserveを減らす
3. nyumba以外の石を除去する
4. pendingを簡略化する
5. turnなど補助値を最小化する
6. 一方の不一致着手だけが残る状態まで削減する

### 成果物

```text
test/fixtures/namua-symmetry-cases.js
artifacts/namua-symmetry/minimized/
```

### 完了条件

主要な原因分類ごとに、説明可能な最小反例を最低1件保存すること。

## 13. Phase 8: 修正と回帰テスト

追加するテスト:

```text
test/symmetry-transform.test.js
test/namua-move-symmetry.test.js
test/transition-symmetry.test.js
test/evaluation-symmetry.test.js
```

### 修正原則

- 調査コードと本番修正を別コミットにする
- ルールエンジン修正と評価関数修正を別コミットにする
- 監査を通すだけの例外処理を追加しない
- 仕様根拠を説明できない変更は採用しない
- 原因が監査側のみなら、エンジンとAIは変更しない

## 14. Phase 9: 大規模再監査

修正後は段階的に局面数を増やす。

| 段階 | 局面数 | 目的 |
| --- | ---: | --- |
| A | 手作業fixture | 意味論確認 |
| B | 200 | 旧結果との直接比較 |
| C | 1,000 | 基本再現性 |
| D | 10,000 | 稀な状態の検出 |
| E | phase・状態別層化 | 条件依存の確認 |

層別集計:

- namua／mtaji
- reserveあり／なし
- nyumba所有／喪失
- 捕獲あり／なし
- South手番／North手番

### 合格基準

- 二重鏡像: 100%
- 合法手集合: 100%
- 着手適用後状態: 100%
- legacy評価: 100%
- bao評価: 100%

意図上対称である処理については、統計的に高い一致率ではなく完全一致を要求する。

## 15. Phase 10: 先攻・後攻差研究への影響評価

対称性修正が入った場合のみ、旧研究の主要条件を限定的に再実行する。

優先順位:

1. 標準初期局面の深度別診断
2. 8手ランダム序盤・基準bao条件
3. legacy／bao／bao-v2比較
4. 深度3条件
5. top3条件
6. 必要な場合のみ追加実験

旧成果物は削除せず、修正前バージョンとして保持する。修正後の結果は次へ保存する。

```text
artifacts/first-player-suite/post-symmetry-fix-YYYY-MM/
```

## 16. ローカル実行方針

- 重い監査はGitHub Actionsで実行しない
- seedと局面集合を固定し、修正前後で同一局面を比較する
- 途中経過をJSONへ保存し、中断後に再開可能にする
- 1局面または1バッチ完了ごとに原子的に書き込む
- 10,000局面監査は複数バッチへ分割する
- GitHub Actionsには、固定fixtureを使う軽量な回帰テストだけを残す

想定コマンド形:

```sh
node tools/symmetry/generate-states.js \
  --count 10000 \
  --seed 20260714 \
  --output artifacts/namua-symmetry/final/states.jsonl

node tools/first-player-symmetry-audit.js \
  --input artifacts/namua-symmetry/final/states.jsonl \
  --output artifacts/namua-symmetry/final/audit.json
```

実際のCLIは実装時に確定し、本書と`tools/symmetry/README.md`へ反映する。

## 17. 統計上の扱い

主指標:

- 合法手対称率
- 着手適用対称率
- legacy評価対称率
- bao評価対称率
- phase別不一致率
- 原因分類別件数

一致率にはWilson 95%信頼区間を付けるが、最終合格基準は100%とする。

修正前後は異なるランダム標本ではなく、同一seed・同一局面集合によるペア比較とする。

## 18. 推奨コミット構成

```text
research: add detailed namua symmetry diagnostics
research: classify namua legal-move mismatches
test: add mirror transformation invariants
research: identify canonical Bao mirror transform
test: add minimized namua symmetry fixtures
fix(engine): correct namua seat asymmetry
test: add move-transition symmetry coverage
research: decompose bao evaluation symmetry
fix(ai): correct bao evaluation seat asymmetry
research: rerun large-scale symmetry audit
docs: record namua symmetry findings
```

原因が監査側だけであれば、`fix(engine)`と`fix(ai)`は作成しない。

## 19. 完了条件

次の条件をすべて満たした時点で研究完了とする。

1. 正しい鏡像変換を明文化した
2. 二重変換が常に元へ戻る
3. 旧30件の合法手不一致をすべて説明した
4. 旧65件のbao評価不一致をすべて説明した
5. 着手適用後状態の対称性を検証した
6. 原因分類ごとの最小反例を保存した
7. 必要なエンジン・AI修正を完了した
8. 回帰テストを追加した
9. 固定seedの10,000到達可能局面で全監査を通過した
10. 先攻・後攻差研究への影響を統合研究文書へ追記した

## 20. 最初に実施する作業

最初の実装単位は次の4点とする。

```text
1. 現在の不一致局面を完全保存する
2. expectedMovesとactualMovesの集合差を記録する
3. 複数の鏡像変換候補を同一局面で比較する
4. namua合法手生成のどの段階で最初に差が生じるか特定する
```

この4点が完了するまでは、ルールエンジンやbao評価を修正しない。