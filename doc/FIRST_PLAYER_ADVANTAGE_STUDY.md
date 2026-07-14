# Bao la Kiswahili 先攻・後攻差の予備調査

Version: 0.1.0  
更新日: 2026-07-14

## 1. 目的

この文書は、このリポジトリのコンピュータ対戦結果を用いて、Bao la Kiswahiliに先攻・後攻の有利不利が観測されるかを予備的に調べた記録である。

ここで扱うのは、Bao一般について先手必勝・後手必勝を証明する理論研究ではない。このルールエンジン、AI、探索条件で実施したAI対AI対局から、席順による偏りの有無を調べる実装研究である。

## 2. 用語

この実装では盤面側を`South`と`North`で表す。初期状態では`state.player`が指す側から対局が始まるため、本調査では初手を指す側を先攻として扱う。

ただし、文書内では保存済みベンチマークとの対応を明確にするため、集計値を`South勝利`、`North勝利`と表記する。

## 3. 調査方法

### 3.1 ベンチマークの座席交代

`tools/benchmark.js`は、2局を1組として同じ開始局面を共有し、`first`と`second`をSouth/Northへ交互に配置する。

```text
第1局: first = North、second = South
第2局: first = South、second = North
```

これにより、特定AIの強さと座席の影響をある程度分離できる。各AIは同数だけSouthとNorthを担当する。

### 3.2 使用データ

保存済みのPhase 0基準ベンチマークを、先後差の観点から再解析した。

```sh
node tools/benchmark.js --games 100 --seed 20260706 \
  --first hard --second normal \
  --first-profile legacy --second-profile legacy \
  --time-limit 0 --max-depth 2
```

| 条件 | 値 |
| --- | --- |
| 対局数 | 100局 |
| 乱数seed | 20260706 |
| first | hard |
| second | normal |
| 評価profile | legacy |
| 最大深度 | 2 |
| 時間制限 | なし |
| 最大手数 | 既定値300 |

時間制限を無効にして固定深度まで探索するため、CPU負荷による到達深度差を避けた条件である。

## 4. 結果

| 指標 | 結果 |
| --- | ---: |
| South勝利 | 48局 |
| North勝利 | 52局 |
| 引き分け | 0局 |
| South勝率 | 48.0% |
| North勝率 | 52.0% |
| South勝率の95% Wilson信頼区間 | 38.5%–57.7% |
| 平均手数 | 40.4手 |

AI別には、hardが98勝2敗であり、South時48勝、North時50勝だった。normalの2勝はいずれも、全体集計上はNorth側の勝利として現れている。

## 5. 解釈

今回の100局ではNorthが52対48で4局多く勝った。しかし、この差は小さく、South勝率の95%信頼区間には50%が含まれる。

したがって、今回の結果からは次のように結論づける。

> この100局のAI対AI対局では、先攻または後攻の明確な統計的優位は検出されなかった。

52対48という観測値だけを見てNorth有利と判断することはできない。100局では、実力が同等でもこの程度の偏りは偶然に発生し得る。

## 6. この調査の限界

### 6.1 同一AI同士ではない

今回の対戦はhard対normalであり、完全な同一AI自己対局ではない。座席は均等に交代しているためAI強度差の影響は抑えられるが、着手選択の性質が異なる2種類のAIを使っている。

### 6.2 seedが1種類だけである

100局は単一seedから生成されている。別seedでも同様の傾向になるか確認していないため、開局系列への依存を除外できない。

### 6.3 初期局面中心である

`opening-plies`は0であり、標準初期局面から開始している。ランダムなnamua局面、mtaji局面、異なる開局系列における先後差は未調査である。

### 6.4 AIは完全なBaoプレイヤーではない

浅い固定深度2のAIによる結果である。より深い探索や熟練者同士では、先後差が異なる可能性がある。

### 6.5 実装ルールに限定される

この調査は、このリポジトリが採用するルール実装を対象とする。地域差、takasiaの不採用、連続種まきの安全上限などが、一般的なBaoの理論的先後差と一致するとは限らない。

## 7. 現時点の結論

現時点で最も慎重かつ妥当な表現は次のとおりである。

> この実装の保存済み100局では、South 48勝、North 52勝だった。差は統計的に明確ではなく、先攻・後攻のどちらが有利かは未確定である。

したがって、ゲーム画面や説明文で「先攻有利」「後攻有利」と断定する根拠には使わない。

## 8. 次の本調査

より信頼できる判断には、同一AI・複数seed・複数開始条件で最低1,000局程度を集める。

推奨する固定深度試験:

```sh
node tools/benchmark.js --games 1000 --seed 20260714 \
  --first hard --second hard \
  --first-profile bao --second-profile bao \
  --first-search phase2 --second-search phase2 \
  --opening-plies 0 --opening-phase any \
  --time-limit 0 --max-depth 2 \
  --output artifacts/first-player-initial-depth2.json
```

開局多様性を加える試験:

```sh
node tools/benchmark.js --games 1000 --seed 20261714 \
  --first hard --second hard \
  --first-profile bao --second-profile bao \
  --first-search phase2 --second-search phase2 \
  --opening-plies 8 --opening-phase namua \
  --time-limit 0 --max-depth 2 \
  --output artifacts/first-player-namua-depth2.json

node tools/benchmark.js --games 1000 --seed 20262714 \
  --first hard --second hard \
  --first-profile bao --second-profile bao \
  --first-search phase2 --second-search phase2 \
  --opening-plies 8 --opening-phase mtaji \
  --time-limit 0 --max-depth 2 \
  --output artifacts/first-player-mtaji-depth2.json
```

本調査では、次を個別に報告する。

- South/North勝率と勝率差
- 95%信頼区間
- seed別の勝率
- namua/mtaji別の勝率
- 初期局面とランダム開局の差
- 平均手数と引き分け率
- 同じ開局を共有したペア単位の結果
- 深度を変えた場合の再現性

## 9. 研究上の注意

AI自己対局で50%付近になったことは、Baoそのものが公平である証明ではない。特定のAIが先手優位を利用できていない可能性や、評価関数が一方の席で起きる特徴を正しく評価していない可能性がある。

反対に、一方の勝率が高くても、それがゲーム固有の先後差ではなく、AIの着手順序、乱数消費、評価関数、探索打ち切りなどの実装差である可能性がある。

最終的な主張には、複数条件のAI対局、熟練者の対局記録、可能であれば理論的な局面解析を組み合わせる必要がある。
