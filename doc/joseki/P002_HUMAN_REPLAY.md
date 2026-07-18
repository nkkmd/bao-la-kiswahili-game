# P002 9手強制勝ち系列 — 人間向け盤面照合票

生成日時: 2026-07-18T05:48:17.322Z

盤面はpublic/engine.jsから生成しており、独立検証ではない。チェック欄は人間または別ルール実装による確認のため意図的に未記入としている。

## 照合方法

1. indexは0〜7で左から右に表示する。North/Southとも成果物内の配列順であり、物理盤の見え方に合わせて必要なら読み替える。
2. 各着手前盤面からmove keyの着手を手作業または別実装で適用する。
3. 捕獲・播種・relay、着手後盤面、reserveを確認してチェック欄を埋める。
4. 最終局面でNorth frontが全て0となり、Southの`front-empty`勝ちになることを確認する。

開始局面: `5a8aac4659368e29d2788d9375a48a08694b15e42f14dd357d5eb3f389eb6eaf`
証明書hash: `6f137936fabc3282809f711b603eade69f47e8f1ffdfc1a8653c771ad33878fb`
総石数: 64

## 1. South — `capture:namua:0:2:right:left::false`

手番開始: turn 9、namua、合法手2通り

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  0  0  0  0  5  1  3
South front   0  0  1  5  1  2  4  0
South back    1  1  1  1  1  0  0  0
```

reserve South/North: 18 / 18
石数台帳 board South/North + reserve + pending = 18 / 10 + 18/18 + 0/0 = 64
state hash: `5a8aac4659368e29d2788d9375a48a08694b15e42f14dd357d5eb3f389eb6eaf`

### イベント要約

- reserve投入: 1
- 捕獲: North front index 5から5石、North front index 6から1石、North front index 7から3石
- relay: South front index 4 (2石)、South front index 6 (5石)、South back index 4 (2石)、South back index 2 (2石)、South back index 0 (2石)、South front index 2 (4石)
- sowイベント: 26
- events hash: `c9fa6b1812e4a5c9f8a88aca30ce7df53b07160c8814212df2571009664d50ca`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  0  0  0  0  0  0  0
South front   4  3  0  7  1  4  1  1
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 17 / 18
石数台帳 board South/North + reserve + pending = 28 / 1 + 17/18 + 0/0 = 64
state hash: `7458a8af1fed8e937f3cda0c64fadd9e06cb5523db4a30fdb72c1dd6d7162ec5`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 2. North — `capture:namua:0:0:right:left::false`

手番開始: turn 10、namua、合法手1通り（1択）

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  0  0  0  0  0  0  0
South front   4  3  0  7  1  4  1  1
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 17 / 18
石数台帳 board South/North + reserve + pending = 28 / 1 + 17/18 + 0/0 = 64
state hash: `7458a8af1fed8e937f3cda0c64fadd9e06cb5523db4a30fdb72c1dd6d7162ec5`

### イベント要約

- reserve投入: 1
- 捕獲: South front index 7から1石
- relay: North front index 0 (3石)
- sowイベント: 4
- events hash: `30fe0b62c49d7cbe61160f7def54211f5d390a807d7ad90f25d591f61e1012cc`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  1  1  1  0  0  0  0
South front   4  3  0  7  1  4  1  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 17 / 17
石数台帳 board South/North + reserve + pending = 27 / 3 + 17/17 + 0/0 = 64
state hash: `eb76f6eaa6b2a78b4bbae44857a71c12e90b46cbcf94b88295a08a376acb55ab`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 3. South — `capture:namua:0:4:right:left::false`

手番開始: turn 11、namua、合法手5通り

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  1  1  1  0  0  0  0
South front   4  3  0  7  1  4  1  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 17 / 17
石数台帳 board South/North + reserve + pending = 27 / 3 + 17/17 + 0/0 = 64
state hash: `eb76f6eaa6b2a78b4bbae44857a71c12e90b46cbcf94b88295a08a376acb55ab`

### イベント要約

- reserve投入: 1
- 捕獲: North front index 3から1石、North front index 2から1石
- relay: South front index 0 (5石)
- sowイベント: 7
- events hash: `72a8ed64bd284d47927065da5e9657500b4988b431d7ade2026e7efe68edaeca`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  1  0  0  0  0  0  0
South front   1  4  1  8  3  5  1  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 16 / 17
石数台帳 board South/North + reserve + pending = 30 / 1 + 16/17 + 0/0 = 64
state hash: `07a0294223c3bfa94ef7e914f94d44f982de46b427c8b4e4c2f19694538b89b1`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 4. North — `capture:namua:0:1:right:left::false`

手番開始: turn 12、namua、合法手1通り（1択）

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  1  0  0  0  0  0  0
South front   1  4  1  8  3  5  1  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 16 / 17
石数台帳 board South/North + reserve + pending = 30 / 1 + 16/17 + 0/0 = 64
state hash: `07a0294223c3bfa94ef7e914f94d44f982de46b427c8b4e4c2f19694538b89b1`

### イベント要約

- reserve投入: 1
- 捕獲: South front index 6から1石
- relay: なし
- sowイベント: 1
- events hash: `23e6f01b1b003858fa5549bbfc77cd730e99bdf709d26da0b27df416efcdd013`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  2  0  0  0  0  0  0
South front   1  4  1  8  3  5  0  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 16 / 16
石数台帳 board South/North + reserve + pending = 29 / 3 + 16/16 + 0/0 = 64
state hash: `67e2f40d329b50713a3df3a5f497178359c17accab6ccec1c49567f96cd43448`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 5. South — `takata:namua:0:1:right:::false`

手番開始: turn 13、namua、合法手8通り

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  2  0  0  0  0  0  0
South front   1  4  1  8  3  5  0  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 16 / 16
石数台帳 board South/North + reserve + pending = 29 / 3 + 16/16 + 0/0 = 64
state hash: `67e2f40d329b50713a3df3a5f497178359c17accab6ccec1c49567f96cd43448`

### イベント要約

- reserve投入: 1
- 捕獲: なし
- relay: なし
- sowイベント: 5
- events hash: `0640467e833778340f7dc1ffa5a96563a08614b9183604ab366e83a727d497c8`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  2  0  0  0  0  0  0
South front   1  0  2  9  4  6  1  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 15 / 16
石数台帳 board South/North + reserve + pending = 30 / 3 + 15/16 + 0/0 = 64
state hash: `a327d584c0b90aa3e0d8b5b7a62677dd12493052f4d495fbe9de77d7c3b5bab2`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 6. North — `capture:namua:0:1:right:left::false`

手番開始: turn 14、namua、合法手1通り（1択）

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  2  0  0  0  0  0  0
South front   1  0  2  9  4  6  1  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 15 / 16
石数台帳 board South/North + reserve + pending = 30 / 3 + 15/16 + 0/0 = 64
state hash: `a327d584c0b90aa3e0d8b5b7a62677dd12493052f4d495fbe9de77d7c3b5bab2`

### イベント要約

- reserve投入: 1
- 捕獲: South front index 6から1石
- relay: North front index 0 (2石)
- sowイベント: 3
- events hash: `239e1aaf4f8077c8511f80ef7dea4544dbda2fc2b6d4b77bfd7fb5cfbf796da4`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  4  1  0  0  0  0  0
South front   1  0  2  9  4  6  0  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 15 / 15
石数台帳 board South/North + reserve + pending = 29 / 5 + 15/15 + 0/0 = 64
state hash: `1f16d05e87c8a21af455029e05fdae546e78e792a78d06fc3c5f3b6ecae9d996`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 7. South — `capture:namua:0:5:right:left::false`

手番開始: turn 15、namua、合法手2通り

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  4  1  0  0  0  0  0
South front   1  0  2  9  4  6  0  0
South back    0  2  0  2  0  1  1  1
```

reserve South/North: 15 / 15
石数台帳 board South/North + reserve + pending = 29 / 5 + 15/15 + 0/0 = 64
state hash: `1f16d05e87c8a21af455029e05fdae546e78e792a78d06fc3c5f3b6ecae9d996`

### イベント要約

- reserve投入: 1
- 捕獲: North front index 2から1石
- relay: South front index 0 (2石)、South front index 2 (3石)、South front index 5 (8石)
- sowイベント: 14
- events hash: `efef12cd1fd0c4b1098a8799babe9b0e5c2d6231c261036d174fb7918a2d7a85`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  4  0  0  0  0  0  0
South front   0  1  0 10  5  0  1  1
South back    0  2  1  3  1  2  2  2
```

reserve South/North: 14 / 15
石数台帳 board South/North + reserve + pending = 31 / 4 + 14/15 + 0/0 = 64
state hash: `377782b622ffc7aeba74f9f6d0967b352aeb0e96c852db78ce287252d724ae68`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 8. North — `capture:namua:0:1:right:left::false`

手番開始: turn 16、namua、合法手1通り（1択）

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  4  0  0  0  0  0  0
South front   0  1  0 10  5  0  1  1
South back    0  2  1  3  1  2  2  2
```

reserve South/North: 14 / 15
石数台帳 board South/North + reserve + pending = 31 / 4 + 14/15 + 0/0 = 64
state hash: `377782b622ffc7aeba74f9f6d0967b352aeb0e96c852db78ce287252d724ae68`

### イベント要約

- reserve投入: 1
- 捕獲: South front index 6から1石
- relay: なし
- sowイベント: 1
- events hash: `5acb5f50f978d19c39c18dd9032043e8b9f060d59531ff88e3ebe8671607cced`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  5  0  0  0  0  0  0
South front   0  1  0 10  5  0  0  1
South back    0  2  1  3  1  2  2  2
```

reserve South/North: 14 / 14
石数台帳 board South/North + reserve + pending = 30 / 6 + 14/14 + 0/0 = 64
state hash: `6ad463c380a53b620c12521a5e4239c588a237684a3cc370feeb6bd8119ce608`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 9. South — `capture:namua:0:7:left:right::false`

手番開始: turn 17、namua、合法手1通り（1択）

### 着手前

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   1  5  0  0  0  0  0  0
South front   0  1  0 10  5  0  0  1
South back    0  2  1  3  1  2  2  2
```

reserve South/North: 14 / 14
石数台帳 board South/North + reserve + pending = 30 / 6 + 14/14 + 0/0 = 64
state hash: `6ad463c380a53b620c12521a5e4239c588a237684a3cc370feeb6bd8119ce608`

### イベント要約

- reserve投入: 1
- 捕獲: North front index 0から1石、North front index 1から5石
- relay: South front index 7 (3石)、South front index 4 (6石)、South back index 1 (3石)、South back index 4 (2石)、South back index 6 (3石)
- sowイベント: 18
- events hash: `80f2e2529e11b0861527c21e2474f0f1f60c1d3ee2fb9f67cf6e767f65ef0b6d`

### 着手後

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  0  0  0  0  0  0  0
South front   1  2  1 11  0  1  2  1
South back    1  0  2  4  0  3  0  3
```

reserve South/North: 13 / 14
石数台帳 board South/North + reserve + pending = 32 / 0 + 13/14 + 5/0 = 64
state hash: `55c1218fdb22abb6e7e1ac2a5c69a229ba6fbab82f419da28dc7f4f5925dfbe9`

### 人間照合欄

- [ ] 着手前盤面とreserveが一致する
- [ ] 指定着手がBaoのルール上合法である
- [ ] 捕獲元、播種方向、relayがイベント要約と一致する
- [ ] 着手後盤面と石数台帳が一致する

## 最終確認

```text
index        0  1  2  3  4  5  6  7
North back    0  0  0  0  0  0  0  0
North front   0  0  0  0  0  0  0  0
South front   1  2  1 11  0  1  2  1
South back    1  0  2  4  0  3  0  3
```

- [ ] North frontが全て0である
- [ ] 勝者がSouth、理由が`front-empty`である
- [ ] 最終state hash `55c1218fdb22abb6e7e1ac2a5c69a229ba6fbab82f419da28dc7f4f5925dfbe9`と一致する

## 自動生成側の完全性

- ply: 9
- North 1択応手: 4/4
- 石数台帳照合: 18
- terminal: South / front-empty
