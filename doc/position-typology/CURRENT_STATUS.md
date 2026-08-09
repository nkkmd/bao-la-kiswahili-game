# 局面類型と棋風研究 — 現在地

更新日: 2026-08-09  
Status: **Stage 0 instrumentation implemented / local smoke validation pending / no formal experiment authorized**

Branch: `research/position-typology-and-playing-style`

- Stage 0監査: [`STAGE_0_AUDIT.md`](STAGE_0_AUDIT.md)
- Stage 0実行手順: [`STAGE_0_RUNBOOK.md`](STAGE_0_RUNBOOK.md)

## 現在地

次の優先研究課題として **「Baoにおける局面類型と棋風の発見・検証」** を開始した。

2026-08-09にrepository auditを完了し、その監査結果に基づくposition-typology専用instrumentationを実装した。

実装済み:

- full 32-pit stateを保存するposition observation schema
- board / legal-state primitive feature extractor
- historical state hash / `ruleStateKey` / `seatCanonicalKey`
- maximum capturable seeds
- relay / capture-chain primitive
- seed-distribution summary
- exploratory Stage 0 smoke generator
- replay / schema / provenance verifier
- reachable-state seat-canonical identity audit
- unit test

現時点ではまだ大量自己対局、clustering、formal confirmationは開始していない。

次の停止点は**ローカル環境でのStage 0 instrumentation smokeとQA**である。

以下は引き続き固定していない。

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

したがって、`RESEARCH_PLAN.md`、`STAGE_0_AUDIT.md`、現在のsmoke protocolはいずれもpreregistrationではない。

## Study 1との固定境界

局面相転移点Study 1はclosedであり、以下を変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018/H16: `confirmed` only fixed `hard / bao / depth2`
- E-019/H17: global `not-confirmed`
- E-020/H18: `confirmed` only fixed `hard / bao / depth3`
- `capture-branch-expansion` classifier / vocabulary
- forced-capture regime definition
- `sustained-forcing window` のStage B retrospective interpretation boundary
- trajectory-ply sensitivityの位置づけ

Study 1 formal corpusはinitial typology discovery corpusへ入れない。独立に得られたposition typeとの関係を、研究後半のcross-study analysisで検討するためにのみ使用する。

## Stage 0 instrumentationの設計境界

### Primary board / legal-state

新しいposition observationは、AI実装名や評価値ではなく、engine stateから導出するprimitiveを保存する。

主な対象:

- phase
- reserve
- house / nyumba
- full pit distribution
- front / back seed and occupancy
- legal move count
- capture move count
- forced capture
- reusable pits
- front connections
- maximum capturable seeds
- relay / capture-chain primitive
- seed concentration / variance

### Trajectory / context

次はinitial cluster形成へ直接入れない。

- ply / turn
- opening id / generation condition
- trajectory identity
- forced-capture regime lifecycle
- recent persistence / dwell history

### Secondary AI/search

次はinitial cluster形成へ入れない。

- evaluation / root score
- search depth
- node count
- cutoff / cache diagnostics
- PV / horizon information

Smoke runnerはsearch diagnosticsをmove-level secondary metadataとして保存できるが、position observationのprimary featuresには含めない。

## Position identity

Stage 0では「同じ局面」を一種類のhashへまとめない。

1. **historical state identity**
   - 既存Study 1互換のstate hash
   - turn等を含むreplay/provenance用
2. **rule-state identity**
   - pits / reserve / houseOwned / player / phase / terminal-relevant state
   - turn、seed、gameId、AI conditionを除外
3. **seat-canonical identity**
   - 既存symmetry研究で確認済みのSouth/North seat exchangeだけを同値変換候補とする
   - 単純なcolumn / direction reversalは使用しない
4. **trajectory identity**
   - historical / rule-state / seat-canonical state sequenceを別々に保持する

新しいreachable-state smoke上でseat-symmetryを再監査してから、seat-canonical dedupをStage 1のprimary policyにするか決める。

## 実装済みファイル

```text
schemas/position-typology-observation.schema.json

tools/experiments/lib/position-typology-features.js
tools/experiments/run-position-typology-smoke.js
tools/experiments/verify-position-typology-smoke.js
tools/experiments/audit-position-typology-identity.js

test/position-typology-features.test.js

doc/position-typology/STAGE_0_RUNBOOK.md
```

## 次に行う作業

ローカル環境で `STAGE_0_RUNBOOK.md` に従い、次を実行する。

1. new feature unit test
2. existing symmetry regression tests
3. 16-game Stage 0 instrumentation smoke
4. replay / schema / provenance verification
5. reachable-state seat-canonical identity audit
6. phase / opening / trajectory / position duplication summaryのinspection

出力は `artifacts/local/position-typology/stage0-smoke-v1/` に保存し、Gitへcommitしない。

必要な主要出力:

- `manifest.json`
- `verification.json`
- `identity-audit.json`

## Stage 0 data-quality gate

以下はhard integrity gateとする。

- schema validation pass
- complete replay pass
- every stored move legal
- stored observation recomputation pass
- state / trajectory identity match
- source provenance match
- seat-canonical identity audit pass
- incomplete / mixed-config gameをanalysisへ入れない

一方、次の数値thresholdはまだformalに固定しない。

- unique trajectory rate
- dominant trajectory rate
- unique position rate
- seat-canonical collapse rate
- namua / mtaji ratio
- opening concentration

まずsmokeで分布を監査し、Stage 1 exploratory corpusのsampling designとして決定する。

## 重要原則

- position typeとplaying styleを分離する。
- playing styleを一局面だけから判定しない。
- `phase2` / `legacy`等の実装名を棋風名にしない。
- 勝率・AI評価値を局面類型そのものと同一視しない。
- 類型名を先に決めない。
- raw ply数を独立標本数とみなさない。
- deterministic trajectory repetitionを独立例として数えない。
- exploratory discoveryとfuture confirmatory validationを分離する。
- Study 1 formal decisionsを変更しない。
- formal corpusをGitHub Actionsで生成しない。

## 次のdecision point

local smokeとidentity / duplication auditをpassした後に、次を判断する。

- namua / mtajiを分離して類型化するか
- raw pit vectorをcluster inputへ含めるか
- rule-state dedupだけかseat-canonical dedupまで使うか
- trajectory-level weightingとbalanced subsamplingのどちらを主とするか
- unsupervised / semi-supervised / rule-basedの比較方法
- exploratory corpusのgeneration strata・規模・多様性条件
- Stage 2 replication用held-out design

これらを決めるまではformal confirmationへ進まない。
