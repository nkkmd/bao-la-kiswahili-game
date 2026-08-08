# 局面類型と棋風研究 — 現在地

更新日: 2026-08-08  
Status: **selected next research / kickoff design / no formal experiment authorized**

Branch: `research/position-typology-and-playing-style`

## 現在地

次の優先研究課題として **「Baoにおける局面類型と棋風の発見・検証」** を選択した。

現在は研究開始前の設計段階であり、以下はまだ固定していない。

- formal hypothesis
- cluster数
- position-type名称
- playing-style名称
- feature setの最終版
- preprocessing
- seed block
- confirmation threshold
- statistical test
- formal execution policy

したがって、現時点の文書はpreregistrationではない。

## 直前研究との境界

局面相転移点Study 1はclosedであり、PR #26は`main`へmerge済み。

本研究ではStudy 1の以下を変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018/H16: `confirmed` only fixed `hard / bao / depth2`
- E-019/H17: global `not-confirmed`
- E-020/H18: `confirmed` only fixed `hard / bao / depth3`
- `capture-branch-expansion` classifier / vocabulary
- Stage B retrospective interpretation boundaries

Study 1の成果は、本研究後半のcross-study analysisで参照できるが、局面類型の発見をStudy 1の結論へ合わせるために使用しない。

## 研究開始時の最優先作業

1. `doc/position-typology/RESEARCH_PLAN.md` を精読する。
2. `doc/FUTURE_RESEARCH_AGENDA.md` の4.2および推奨研究プログラムを確認する。
3. `doc/phase-transition/STUDY_1_OVERVIEW.md` と `STUDY_1_FINAL_REPORT.md` から継承すべき研究規律を確認する。
4. 現在のengine、AI、experiment tooling、既存artifact schemaを監査する。
5. 既存データで利用可能なposition-level featureを一覧化する。
6. 類型発見に不足する特徴量と、AI内部情報によるリーク候補を分離する。
7. Stage 0 exploratory corpus設計を提案する。
8. 実データ生成前に、exploratory / future confirmatory corpusの境界を明文化する。

## 重要原則

- position typeとplaying styleを分離する。
- playing styleを一局面だけから判定しない。
- `phase2` / `legacy`等の実装名をそのまま棋風名にしない。
- 勝率・AI評価値を局面類型そのものと同一視しない。
- 類型名を先に決めてクラスタを当てはめない。
- trajectory / position重複を独立標本として扱わない。
- Study 1 formal decisionsを変更しない。

## 次のdecision point

Stage 0監査完了後に、次を判断する。

- 新規データ生成が必要か、既存artifactを探索に再利用できるか
- phaseを分離して類型化するか、共通feature spaceで扱うか
- unsupervised / semi-supervised / rule-basedのどれを主探索にするか
- position canonicalizationが先に必要か
- exploratory corpusの規模と多様性条件

これらを決めるまではformal confirmationへ進まない。
