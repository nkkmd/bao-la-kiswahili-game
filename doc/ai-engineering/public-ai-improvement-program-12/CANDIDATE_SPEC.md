# `PBAI-P12` — `PBAI-C016-v1` prospective candidate仕様

固定日: 2026-09-17  
Program: **`PBAI-P12`**  
Candidate: **`PBAI-C016-v1`**  
Baseline: **`AI-GEN4-BASELINE-2026-09-17-v1`**  
状態: **`FROZEN-BEFORE-CANDIDATE-DEVELOPMENT`**

## 1. 前段のsupport判定

baseline support計測は事前固定したgateをすべて満たした。

- 計測局面: 37（Namua 24 / Mtaji 13）
- 診断ON/OFFの探索結果: 完全一致
- PVS scout: 3,144回
- full-window再探索: 260回
- full-window再探索node: 6,159
- rootでfull-window再探索が発生した局面: 26 / 37（70.27%）

したがって`PBAI-P12-B = COMPLETE / SUPPORT-PASS`とし、この文書で`PBAI-P12-C`のcandidate mechanismを結果確認前に固定する。

## 2. 中心機構

`PBAI-C016-v1`は、**rootの非principal candidateだけ**を対象に、従来の1点幅PVS scoutを固定margin幅のprobeへ置き換える。

最大化rootで現在の暫定bestを`alpha`、固定marginを`Δ`とすると、2手目以降は次の窓を用いる。

```text
[alpha, alpha + Δ + 1]
```

判定は次のとおりとする。

1. probe値 `<= alpha`: 従来と同様に候補を棄却する。
2. `alpha < probe値 < alpha + Δ + 1`: 現深度で候補は暫定bestより良いが差は`Δ`以内と扱い、full-window再探索を省略して暫定bestを維持する。
3. probe値 `>= alpha + Δ + 1`: `Δ`を超えて改善する可能性があるため、従来どおりfull-window再探索を行う。

この方式は、1点幅scoutの返却値が境界値に近いことだけを根拠に省略しない。margin幅の探索窓そのものを使い、窓内で確定した小差だけを「十分良い」の許容範囲として扱う。

## 3. 適用範囲

初回候補は安全のためrootへ限定する。

- `ply === 0`だけで有効
- iterative deepeningのdepth 1〜2では無効
- depth 3以上でのみ有効
- `aspirationWindow > 0`のときは無効
- recursive nodeでは従来PVSを完全維持
- quiescence search、評価器、着手順、killer/history、ルール処理は変更しない

recursive nodeへmarginを伝播させないため、複数階層の許容誤差累積は今回の候補では発生させない。

## 4. 戦術安全条件

rootが次のいずれかに該当する場合、margin機構を無効にしてbaseline PVSへ戻す。

- 合法手にcaptureが1つ以上ある
- Namuaで自分または相手のreserveが4以下
- Namuaで合法手にnyumba（front index 4）を直接起点とする手が含まれる
- terminalまたは合法手なし

安全条件の判定のためだけに追加の`applyMove`を行わない。判定費用が節約量を食い潰さないよう、既存stateと既生成root movesだけで判定する。

## 5. TTの扱い

margin内の改善候補を意図的に採用しなかったroot iterationは、通常minimaxの`exact`値ではない。

したがって、そのroot TT entryは`exact / lower / upper`のいずれとしても保存せず、候補手順序のヒントだけを保持する**`approx`** entryとして保存する。

- `approx`はTT lookup時にalpha/betaを狭めない
- `approx`は即時returnに使わない
- `bestMove`だけは次のiterationのmove orderingへ利用可能
- recursive nodeのTT semanticsは変更しない

## 6. developmentで試す固定margin

candidate結果を見る前に次の3値を固定する。

```text
Δ ∈ {16, 32, 64}
```

単位は`PBAI-C015-v1`論理ゲート評価器の内部整数scoreであり、KETE数・勝率差・理論的損失量を意味しない。

## 7. developmentデータ

`PBAI-P12-D`では開始認可時に予約した次のseed blockだけを使う。

```text
121210001..121210032
```

baseline support用`121200001..121200024`、independent validation用`121220001..121220064`、protected release holdout用`121230001..121230064`は使わない。

## 8. 固定深度development判定条件

各marginについて、同一局面・固定depth 4・時間無制限でbaselineと比較する。候補を次段階へ残すには次をすべて満たす。

1. safety条件を満たすeligible局面が8局面以上ある。
2. eligible局面にNamua / Mtajiがそれぞれ3局面以上含まれる。
3. marginによるfull-window再探索省略が合計8回以上発生する。
4. eligible局面の合計node比 `candidate / baseline <= 0.97`。
5. 全計測局面の合計node比 `candidate / baseline <= 1.02`。
6. baselineとcandidateのroot move一致率が75%以上。
7. 全局面でdepth 4を完了し、timeoutを発生させない。
8. feature flagを無効にしたcandidate実装はbaselineと完全一致する。

marginの選択規則は、**16 → 32 → 64の順に確認し、上記gateを最初に満たした最小値を採用**する。後から大きいmarginへ都合よく切り替えない。

どのmarginもgateを満たさない場合、`PBAI-C016-v1`は`DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4`として終了する。

## 9. development gate通過後の境界

fixed-depth gate通過は棋力改善の証拠ではない。通過した場合だけ、選択された1つのmarginを固定して同一時間条件のdevelopment試験へ進む。

その後も次を別途要求する。

- hard / expertの同一時間での到達深度・node・wall-clock確認
- tactical regression
- 未使用seedによる独立validation
- 先後交換pairによる棋力評価
- 公開Worker・ブラウザ・実機確認
- protected release holdout

`main`統合、公開採用、release発行、AI世代昇格はこの文書では認可しない。
