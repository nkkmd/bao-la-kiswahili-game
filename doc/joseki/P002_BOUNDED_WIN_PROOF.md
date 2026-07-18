# P002 9 ply有界強制勝ちの全枝検証

生成日時: 2026-07-18T01:56:56.442Z

AI評価器・alpha-beta・quiescenceを使わず、現ルールエンジンの合法手生成、着手適用、終局判定だけで9 plyのAND/OR探索を行った。South手番では勝てる合法手が1つ以上存在すること、North手番では全合法応手の後もSouthが勝てることを要求した。

合意手 `capture:namua:0:2:right:left::false` には9 ply以内のSouth強制勝ちがある。保存証明書をルールエンジンで再検証し、North節点では合法応手集合を全て照合した。

| P002の合法手 | 9 ply以内の強制勝ち | 訪問節点 | cache hit |
| --- | --- | ---: | ---: |
| `capture:namua:0:2:right:left::false` | yes | 46 | 0 |
| `capture:namua:0:2:left:right::false` | no | 1,542 | 2 |

`no`はこの9 ply以内にSouth終局勝ちを強制できないという有界判定であり、代替手が最終的に負けることまでは意味しない。

## 証明条件

- horizon: 9 ply
- 全探索訪問節点: 1,590
- memo化状態: 501
- 最大分岐数: 10
- 証明書節点: 10
- South OR節点: 5
- North AND節点: 4
- North合法応手の証明対象: 4
- South終局leaf: 1

## 解釈

- depth 8探索の勝ちスコアは評価値だけの現象ではなく、現ルール実装上の全応手を対象にした有界強制勝ちとして再現した。
- 主変化を1本再生しただけでなく、North節点をAND条件で検査している。South節点は戦略の存在証明なので勝てる1手を証明書に保持する。
- これはAI探索から独立しているが、ルール実装自体からは独立していない。人間棋譜または別ルール実装による検証なしに`validated`や暫定定石へ昇格しない。

## 完全性

- rules engine sha256: `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c`
- certificate hash: `6f137936fabc3282809f711b603eade69f47e8f1ffdfc1a8653c771ad33878fb`
- result hash: `20c7db44a94fe63cfda36259e5adbeb34ec957e988168649d8fc7057aa1424cd`
