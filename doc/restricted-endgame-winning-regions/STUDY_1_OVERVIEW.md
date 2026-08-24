# Restricted Endgame / Winning Regions Study 1 — Overview

**研究題目:** Baoにおける限定終盤と必勝圏の完全解析 — constrained endgame state spaces における exact game-theoretic value, cycle structure, and distance-to-win の列挙・後退解析  
**Formal decision:** `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`  
**完了日:** 2026-08-24

## 何を調べたか

Bao全体ではなく、事前に固定した有限のMtaji終盤domainについて、全状態と全合法遷移を列挙し、engine evaluationや自己対局勝率を使わずにexact game-theoretic valueを求められるかを調べた。

Primary domainは、標準初期局面から合法に到達した1つのMtaji rootと、そのrootからの**全合法手による完全forward closure**として定義した。左右反転、player swap等のsymmetry reductionは使用していない。

## 主要結果

最終的にexact claimの対象となったfrozen domainは次の通り。

```text
historically reachable roots = 1
states = 8
legal edges = 7
symmetry reduction = none
RECURRENT states = 0
```

8状態の内訳は:

```text
TERMINAL = 4
WIN      = 3
LOSS     = 1
RECURRENT = 0
```

frozen root:

```text
state key = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
player to move = Player 0
exact value = WIN
absolute forced winner = Player 0
DTF = 3 moves
unique optimal move = capture:mtaji:1:4:left:::false
```

したがって、このfrozen rootではPlayer 0が最善応手の下でも3手以内にterminalへ到達するforced winを持つ。

## なぜdomainが8状態なのか

Stage 0ではoutcomeを見ず、state count・edge count・closure completeness・relay work・memory/runtimeだけで候補を選んだ。

より大きい1-root候補も、事前に許可した1回だけの拡張監査で:

```text
observed states = 423,733
observed edges = 426,938
maximum inspected move microsteps = 1,000,000
stop = ADMIN-CUTOFF
```

となった。このcutoffはBaoの引き分けや敗北ではなくtechnical failureである。事前規則に従って追加cap拡張や結果依存のdomain変更は行わず、すでに独立完全検証を通過していた8-state domainへfallbackした。

## verification

Production solverとindependent verifierは、legal-move generator、guard-free transition、state serialization、closure traversal、retrograde algorithmを別実装としている。

独立verificationでは以下がすべて完全一致した。

```text
root keys
state count
edge count
state-set SHA-256
transition-set SHA-256
value counts
all state-level rows
RECURRENT SCCs
solution SHA-256
```

Canonical solution SHA-256:

```text
4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

## 何を意味しないか

この結果からは、以下を主張しない。

- Bao全体が解けた
- 全Mtaji局面が解けた
- Baoの全終盤が解けた
- Baoにはcycleが存在しない
- engine evaluationがgame-theoretically正しい
- empirical win rateがgame-theoretic probabilityである
- symmetryが成立する

exact claimは**frozen 8-state restricted domainだけ**に限定される。

## 最初に読む文書

- `STUDY_1_FINAL_REPORT.md` — 科学的・技術的な最終統合
- `results/STAGE_1_EXACT_RESULT.json` — 8状態すべてのcanonical exact result
- `REPRODUCIBILITY_INDEX.md` — hash / workflow / verifier identity
- `CURRENT_STATUS.md` — closure状態と固定境界
