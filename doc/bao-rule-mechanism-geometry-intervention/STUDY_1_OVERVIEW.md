# G3-06 / BRMGI-STUDY1 — 研究概要

更新日: 2026-09-02  
状態: **Prospective / pre-Stage-0 / fresh scientific evidence未生成**

## 何を調べる研究か

本Studyは、Baoのある合法手を指す前後で、周囲のbounded local game tree / RAW reachable graphの形がどう変わるかをexactに測り、その変化がBao固有のrule-semantic eventとどのように結びつくかを検証する。

対象は次の3系統である。

1. capture move
2. nyumbaを`stop`するか`use`するかを同一root・同一physical opening move内で比較できる局面
3. reserveが尽きてNamuaからMtajiへ移るlinked event

G3-05でbranch expansion/compression transitionが確認されたことは前提にしない。G3-05は`CLOSED / TECHNICAL-INVALID`であり、partial telemetryを本Studyのevent選択や方向仮説へ使わない。

## 何を「効果」と呼ばないか

Historical agendaでは`Geometry Intervention`という語を使っているが、captureはmandatoryであり、capture可能rootにはgeneric non-capture legal alternativeがない。またNamuaでは通常の着手がreserve decrementとphaseに機械的に結びついている。

したがって本Studyは、一般的なcausal effectを測る研究としては設計しない。

formal claimは次に限定する。

- move-conditioned structural change
- event-conditioned geometry difference
- association

同一rootのnyumba `use` / `stop`比較はroot-level confoundingを抑えられるが、それでもBao全般のcausal mechanismを無条件には主張しない。

## 測定基盤

LGTGMIVでformal eligibilityを得たF1-F5だけを使う。

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative horizon = 5
validated transforms = []
```

formal endpointは6つ。

- root legal width
- cumulative tree occurrence
- global distinct RAW states
- duplicate-transition fraction
- cumulative tree/RAW ratio
- unit-width occupancy fraction

pre/post差とevent/control差はintegerまたはexact reduced rationalで保持し、float toleranceや結果後のmagnitude thresholdを使わない。

## Fresh population

Stage 1:

```text
31610001..31610256
8 comparable units / event family
```

Stage 2:

```text
31620001..31620384
12 comparable units / promoted event family
```

各event familyについて1 trajectoryから最大1 unitのみ採用する。seed block内で必要数を確保できなければnon-estimableとして扱い、seed追加で救済しない。

## G3-05 relay-limitから引き継ぐもの／引き継がないもの

引き継ぐのはtechnical lessonだけである。

- event-centered sparse sampling
- bounded reconstruction数の明示上限
- per-root / per-stage resource ceilings
- `relay-limit`の明示検出
- fail-closed
- artifact-first recovery

引き継がないもの:

- partial geometry values
- transition direction
- candidate event
- positive/negative scientific interpretation

required depth-5 reconstruction中に`relay-limit`へ到達した場合、Stageを`TECHNICAL-INVALID`として閉じ、root replacementやsame-evidence rerunを行わない。

## 現在地

Program-level authorization reviewは **`G3-06-AUTHORIZED`**。

ただしauthorization範囲は:

- Study definition / preregistration
- technical-only Stage 0

までである。

Fresh Stage 1は **`NOT AUTHORIZED`**。Stage 0 PASS後に別authorization reviewが必要。

Protected standard initial RAW depth-10 holdoutは引き続き:

**`SEALED / NOT GENERATED / NOT READ`**
