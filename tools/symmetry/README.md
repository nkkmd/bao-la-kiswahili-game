# Namua symmetry audit tools

BaoEngine の穴番号、`left` / `right`、方向は、South/North 共通の画面座標ではなく、各プレイヤー自身から見たローカル座標である。したがって、本研究で扱う座席交換は盤面上の180度回転に相当するが、エンジン表現では player-indexed な値だけを交換し、穴番号と方向は維持する（候補D）。

```text
mirror(state): pits, reserve, houseOwned, pending, player, winner のSouth/Northを交換
mirror(move):  index, row, side, directionを変更しない
```

従来監査の候補Aは座席交換に加えて穴番号と方向を反転した。この操作は nyumba の固定座標 `HOUSE = 4` を index 3へ移すため、正しい状態変換ではない。

## Reproduce

```sh
node tools/symmetry/generate-states.js --count 200 --seed 20260714 --output artifacts/namua-symmetry/baseline/states.jsonl
node tools/first-player-symmetry-audit.js --input artifacts/namua-symmetry/baseline/states.jsonl --candidate A --output artifacts/namua-symmetry/baseline/details.json
node tools/symmetry/compare-candidates.js --count 200 --seed 20260714 --output artifacts/namua-symmetry/classified/candidate-comparison.json
node tools/symmetry/verify-transition-symmetry.js --count 1000 --seed 20260714 --candidate D
```

10,000局面監査はローカルで次を実行する。局面生成は決定的で、同一seedなら先頭200局も基準集合と一致する。

```sh
node tools/first-player-symmetry-audit.js --count 10000 --seed 20260714 --candidate D --summary-only --output artifacts/namua-symmetry/final/audit-10000.json
```
