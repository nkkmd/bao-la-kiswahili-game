# Critical Positions / Outcome Branching Study 1 — Overview

更新日: 2026-08-24  
状態: **Study 1 closed / Stage 1 exploratory complete / promoted candidates 0 / Stage 2 not executed**

## 何を調べた研究か

Baoでは、ある局面でどの手を選ぶかによって、その後の勝敗傾向が大きく変わることがある。本研究は、そのような局面を単なるengine評価値ではなく、**同じroot局面から全合法手を別々に選び、その後を同じ固定policyで多数回継続したときのempirical outcome差**として測定した。

Primary constructは次である。

```text
fixed-policy empirical continuation divergence
```

各局面について全exact legal moveを試し、各手から64回ずつ継続した。手ごとのroot-actor勝率の最大値と最小値の差を`D_range`とし、

```text
D_range >= 0.30
```

をStage 1のhigh-divergence基準とした。

これはgame-theoretic winning probabilityや「真の勝率差」ではない。

## 何が分かったか

Fresh Stage 1 corpusからoutcome-blindに600局面を選び、600局面すべてがmeasurement可能だった。

```text
Namua = 300
Mtaji = 300
primary estimable roots = 600 / 600
exact root-move interventions = 2666
```

独立verifierでも600局面の再選択、全continuation再測定、D2/D3再計算、structural response再計算がすべてPASSした。

High-divergence rootは次のとおり存在した。

```text
Namua = 52 / 300
Mtaji = 87 / 300
overall = 139 / 600
```

したがって、**どの合法手を選ぶかによって固定policy下の実現outcomeが大きく分岐する局面そのものは観測できた**。

## しかし、単純な構造クラスにはできなかった

本研究では、high-divergence局面を再現可能な「重要局面クラス」として表現できるかも調べた。

候補は事前に、

```text
phase + 1〜2個のpre-root structural tokens
```

だけで表すと固定した。例えば合法手数、捕獲可能手数、reserve、nyumba、前列占有、前列connection、reusable pitsなどである。

1183個のcandidate patternを機械的に監査したが、事前固定したsupport・diversity・high-divergence recurrence条件を**すべて**満たしたものは0件だった。

```text
candidate audits = 1183
promotion gate pass = 0
promoted candidates = 0
manual override = false
```

したがって、今回の結論は

> **重要なoutcome divergenceを示す局面は存在するが、それを今回の単純な1〜2特徴の構造パターンだけで高い再現率をもって分類することはできなかった。**

となる。

## Stage 2を行わなかった理由

Stage 2 formal confirmationへ進むには、Stage 1でpromotionされたcandidateを事前固定する必要があった。

しかし、

```text
promoted candidates = 0
```

だったため、formal confirmation対象が存在しない。

ここでthresholdを下げたり、惜しかったpatternを選んだり、feature grammarを拡張したりすると、結果を見た後の救済になる。そのため行わなかった。

```text
Stage 2 = NOT AUTHORIZED / NOT EXECUTED
Stage 2 reserved seeds = UNCONSUMED
Study 1 = CLOSED
```

これは「候補をformalに検証して`NOT-CONFIRMED`になった」という意味ではない。formal候補自体が作られなかった。

## この結果から言えないこと

本研究は次を否定していない。

- Baoにgame-theoreticなturning pointが存在すること
- 3個以上の特徴を組み合わせた複雑な構造が有効であること
- nonlinear classifierやrepresentation learningで重要局面を分類できること
- 人間やexpertが別の形で重要局面を認識していること
- traditional Bao theoryに重要局面概念が存在すること

また、engine evaluation differenceをvalidated win-probability differenceとして扱っていない。

## 研究上の意味

本研究で重要なのは、二つの問いが分離されたことである。

```text
1. move choiceによってoutcomeが大きく分岐する局面は存在するか
   -> exploratoryには YES

2. それを単純なpre-root structural classとして再現可能に表せるか
   -> 今回のfrozen grammarでは NO PROMOTED CANDIDATE
```

このため、将来研究で重要局面分類を続けるなら、今回のthresholdを緩めて救済するのではなく、**新しいprospective independent studyとして、より表現力の高いrepresentation/classifierを事前固定してfresh evidenceで検証する**必要がある。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合
- [`results/STAGE_1_EXPLORATORY_SUMMARY.json`](results/STAGE_1_EXPLORATORY_SUMMARY.json) — compact machine-readable summary
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure state
- [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md) — prospective design
- [`preregistration/STAGE_1_EXPLORATORY_SPEC.json`](preregistration/STAGE_1_EXPLORATORY_SPEC.json) — frozen Stage 1 specification
