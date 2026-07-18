# 定石研究の着手表記

盤の穴はエンジン内部の各プレイヤー視点で表す。

- `row 0`: front row
- `row 1`: back row
- `index 0`〜`7`: 各プレイヤーから見た左から右
- `left`／`right`: エンジンのsowing direction
- `side left`／`side right`: capture時のkichwa側

着手キーは次の順序をコロンで結合する。

```text
type:phase:row:index:direction:side:houseChoice:houseTwo
```

例:

```text
takata:namua:0:5:left:::false
capture:namua:0:4:left:right::false
```

穴番号と方向は各プレイヤーのローカル座標である。South/North座席交換ではplayer別の盤、reserve、nyumba所有者などを交換し、index、direction、sideは反転しない。
